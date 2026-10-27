<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { getMockPlants, mockPlants } from '~/services/mock/plants.mock'

definePageMeta({ layout: 'dashboard' })

const userPlantsStore = useUserPlantsStore()
const uiStore = useUiStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')
const showAddModal = ref(false)

// جستجو و فیلتر وضعیت
const search = ref('')
const statusFilter = ref<'all' | 'healthy' | 'needs_attention' | 'sick'>('all')
const statusOptions = ['all', 'healthy', 'needs_attention', 'sick'] as const
const statusBadge: Record<string, string> = {
  healthy: 'bg-primary-50 text-primary-700',
  needs_attention: 'bg-accent-50 text-accent-700',
  sick: 'bg-status-danger/10 text-status-danger',
}
const statusIcon: Record<string, string> = {
  healthy: 'lucide:heart-pulse',
  needs_attention: 'lucide:alert-triangle',
  sick: 'lucide:thermometer',
}

const filteredPlants = computed(() =>
  userPlantsStore.plants.filter(p =>
    (statusFilter.value === 'all' || p.healthStatus === statusFilter.value)
    && (!search.value.trim() || p.nickname.includes(search.value.trim()) || p.location.includes(search.value.trim())),
  ),
)

const plantOptions = computed(() => getMockPlants(activeLocale.value).map(p => ({ label: p.name, value: p.slug })))

const schema = toTypedSchema(z.object({
  nickname: z.string().min(2, 'pages.myPlants.validation.nicknameMin').max(30, 'pages.myPlants.validation.nicknameMax'),
  plantSlug: z.string().min(1, 'pages.myPlants.validation.plantRequired'),
  location: z.string().max(40, 'pages.myPlants.validation.locationMax').optional(),
}))

const { handleSubmit, defineField, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { nickname: '', plantSlug: '', location: '' },
})

const [nickname, nicknameAttrs] = defineField('nickname')
const [plantSlug] = defineField('plantSlug')
const [location, locationAttrs] = defineField('location')

const onSubmit = handleSubmit((values) => {
  const plant = mockPlants.find(p => p.slug === values.plantSlug)
  userPlantsStore.addPlant({
    plantSlug: values.plantSlug,
    nickname: values.nickname,
    photo: plant?.images[0] ?? '/images/plants/header.webp',
    acquiredAt: new Date().toISOString().slice(0, 10),
    location: values.location || t('pages.myPlants.home'),
    healthStatus: 'healthy',
    lastWateredAt: null,
    nextWateringAt: null,
  })
  uiStore.showToast(t('pages.myPlants.addedToast', { name: values.nickname }))
  showAddModal.value = false
  resetForm()
})

function removePlant(id: string, nickName: string) {
  userPlantsStore.removePlant(id)
  uiStore.showToast(t('pages.myPlants.removedToast', { name: nickName }), 'info')
}

// ── Lazy image loading with IntersectionObserver ──
const imageStates = reactive<Record<string, 'loading' | 'loaded' | 'error'>>({})

function onImageLoad(id: string) {
  imageStates[id] = 'loaded'
}

function onImageError(id: string) {
  imageStates[id] = 'error'
}

// directive for intersection observer lazy loading
const vLazyImg = {
  mounted(el: HTMLImageElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const src = el.dataset.src
            if (src) {
              el.src = src
              el.removeAttribute('data-src')
            }
            observer.unobserve(el)
          }
        })
      },
      { rootMargin: '100px' },
    )
    observer.observe(el)
  },
}

// ── Stagger animation ──
const containerRef = ref<HTMLElement>()
const isVisible = ref(false)

onMounted(() => {
  if (!containerRef.value)
    return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.05 },
  )
  observer.observe(containerRef.value)
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 text-white shadow-md">
          <Icon
            name="lucide:flower-2"
            class="size-5"
          />
        </span>
        <div>
          <h1 class="text-2xl font-bold text-ink">
            {{ t('nav.myPlants') }}
          </h1>
          <p class="text-xs text-ink-muted">
            {{ toPersianDigits(userPlantsStore.plants.length) }} {{ t('pages.myPlants.plantCount') }}
          </p>
        </div>
      </div>
      <AppButton
        variant="primary"
        class="group"
        @click="showAddModal = true"
      >
        <Icon
          name="lucide:plus"
          class="size-4 transition-transform duration-300 group-hover:rotate-90"
        />
        {{ $t('common.add') }}
      </AppButton>
    </div>

    <!-- جستجو و فیلتر -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative sm:w-72">
        <Icon
          name="lucide:search"
          class="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
        />
        <input
          v-model="search"
          type="text"
          :placeholder="$t('common.searchPlaceholder')"
          class="field !ps-10 transition-shadow duration-200 focus:shadow-md focus:shadow-primary-100/40"
        >
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="option in statusOptions"
          :key="option"
          type="button"
          class="chip transition-all duration-200"
          :class="{ 'chip--active scale-[1.03] shadow-sm': statusFilter === option }"
          @click="statusFilter = option"
        >
          {{ option === 'all' ? $t('common.all') : healthLabel(option) }}
          ({{ toPersianDigits(option === 'all' ? userPlantsStore.plants.length : userPlantsStore.plants.filter(p => p.healthStatus === option).length) }})
        </button>
      </div>
    </div>

    <!-- لیست گیاهان -->
    <div
      v-if="filteredPlants.length"
      ref="containerRef"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
    >
      <div
        v-for="(p, index) in filteredPlants"
        :key="p.id"
        class="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-md backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-100/30"
        :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        :style="{ transitionDelay: `${Math.min(index * 80, 600)}ms` }"
      >
        <!-- تصویر -->
        <NuxtLink
          :to="`/my-plants/${p.id}`"
          class="relative block overflow-hidden bg-gradient-to-br from-primary-50 to-emerald-50"
        >
          <!-- Skeleton loader -->
          <div
            v-if="imageStates[p.id] !== 'loaded'"
            class="absolute inset-0 z-10 flex items-center justify-center"
          >
            <div class="flex flex-col items-center gap-2">
              <div class="size-8 animate-pulse rounded-full bg-primary-100" />
              <div class="h-2 w-16 animate-pulse rounded-full bg-primary-100" />
            </div>
            <!-- Shimmer effect -->
            <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          <!-- Error state -->
          <div
            v-if="imageStates[p.id] === 'error'"
            class="absolute inset-0 z-20 flex items-center justify-center bg-primary-50/80"
          >
            <Icon
              name="lucide:image-off"
              class="size-8 text-ink-muted/40"
            />
          </div>

          <img
            v-lazy-img
            :data-src="p.photo"
            :alt="p.nickname"
            class="h-48 w-full object-cover transition-all duration-500 group-hover:scale-110"
            :class="imageStates[p.id] === 'loaded' ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'"
            loading="lazy"
            @load="onImageLoad(p.id)"
            @error="onImageError(p.id)"
          >

          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </NuxtLink>

        <!-- دکمه حذف -->
        <button
          :aria-label="t('common.delete')"
          class="absolute end-3 top-3 z-30 flex size-8 items-center justify-center rounded-xl bg-white/90 text-ink-muted shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-status-danger hover:text-white hover:shadow-lg"
          @click="removePlant(p.id, p.nickname)"
        >
          <Icon
            name="lucide:trash-2"
            class="size-4"
          />
        </button>

        <!-- بج وضعیت روی تصویر -->
        <div class="absolute start-3 top-3 z-20">
          <span
            class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-sm"
            :class="statusBadge[p.healthStatus]"
          >
            <Icon
              :name="statusIcon[p.healthStatus]"
              class="size-3"
            />
            {{ healthLabel(p.healthStatus) }}
          </span>
        </div>

        <!-- اطلاعات -->
        <div class="p-4">
          <NuxtLink
            :to="`/my-plants/${p.id}`"
            class="group/link flex items-center gap-1 font-bold text-ink transition-colors hover:text-primary-600"
          >
            {{ p.nickname }}
            <Icon
              name="lucide:arrow-up-right"
              class="size-3.5 opacity-0 transition-all duration-200 group-hover/link:opacity-100 rtl:-scale-x-100"
            />
          </NuxtLink>

          <div class="mt-1.5 flex items-center gap-1.5 text-xs text-ink-muted">
            <Icon
              name="lucide:map-pin"
              class="size-3"
            />
            {{ p.location }}
          </div>

          <!-- پایین کارت -->
          <div class="mt-3 flex items-center justify-between border-t border-ink/5 pt-3">
            <span
              v-if="p.nextWateringAt"
              class="flex items-center gap-1.5 text-xs font-medium text-primary-600"
            >
              <span class="relative flex size-5 items-center justify-center">
                <span class="absolute inline-flex size-full animate-ping rounded-full bg-primary-200 opacity-40" />
                <Icon
                  name="lucide:droplets"
                  class="relative size-3.5"
                />
              </span>
              {{ toJalaliDate(p.nextWateringAt) }}
            </span>
            <span
              v-else
              class="text-xs text-ink-muted/50"
            >—</span>

            <NuxtLink
              :to="`/my-plants/${p.id}`"
              class="flex items-center gap-1 rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-600 transition-all duration-200 hover:bg-primary-100 hover:shadow-sm"
            >
              {{ t('common.details') }}
              <Icon
                name="lucide:chevron-left"
                class="size-3 rtl:rotate-180"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- حالت خالی -->
    <div
      v-else
      class="flex flex-col items-center gap-4 py-20 text-center"
    >
      <div class="relative">
        <span class="flex size-20 items-center justify-center rounded-3xl bg-primary-50">
          <Icon
            name="lucide:sprout"
            class="size-10 text-primary-300"
          />
        </span>
        <!-- Floating particles -->
        <span class="absolute -end-2 -top-2 flex size-6 animate-bounce items-center justify-center rounded-full bg-emerald-100 text-emerald-500 [animation-delay:0.2s]">
          <Icon name="lucide:plus" class="size-3" />
        </span>
        <span class="absolute -bottom-1 -start-3 flex size-5 animate-bounce items-center justify-center rounded-full bg-primary-100 text-primary-500 [animation-delay:0.5s]">
          <Icon name="lucide:leaf" class="size-2.5" />
        </span>
      </div>
      <div>
        <p class="font-medium text-ink">
          {{ userPlantsStore.plants.length ? $t('pages.catalog.empty') : t('pages.myPlants.empty') }}
        </p>
        <p class="mt-1 text-sm text-ink-muted">
          {{ t('pages.myPlants.emptyHint') }}
        </p>
      </div>
      <AppButton
        variant="primary"
        class="mt-2"
        @click="showAddModal = true"
      >
        <Icon
          name="lucide:plus"
          class="size-4"
        />
        {{ t('pages.myPlants.addFirst') }}
      </AppButton>
    </div>

    <!-- مودال افزودن گیاه -->
    <AppModal
      v-model="showAddModal"
      :title="t('pages.myPlants.addPlant')"
    >
      <form
        class="flex flex-col gap-5"
        novalidate
        @submit="onSubmit"
      >
        <!-- نام مستعار -->
        <div>
          <label class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink">
            <Icon name="lucide:tag" class="size-3.5 text-primary-500" />
            {{ t('pages.myPlants.nickname') }}
          </label>
          <input
            v-model="nickname"
            v-bind="nicknameAttrs"
            type="text"
            class="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:shadow-md focus:shadow-primary-100/40 focus-visible:ring-2 focus-visible:ring-primary-400"
            :class="errors.nickname ? 'border-status-danger' : 'border-ink/10'"
            :placeholder="t('pages.myPlants.nicknamePlaceholder')"
          >
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="-translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition-all duration-150"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-1 opacity-0"
          >
            <p
              v-if="errors.nickname"
              class="mt-1.5 flex items-center gap-1 text-xs text-status-danger"
            >
              <Icon name="lucide:alert-circle" class="size-3" />
              {{ errors.nickname ? t(errors.nickname) : '' }}
            </p>
          </Transition>
        </div>

        <!-- نوع گیاه -->
        <div>
          <label class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink">
            <Icon name="lucide:flower" class="size-3.5 text-primary-500" />
            {{ t('pages.myPlants.plantType') }}
          </label>
          <AppDropdown
            v-model="plantSlug"
            :options="plantOptions"
            :placeholder="t('pages.myPlants.choosePlant')"
          />
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="-translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition-all duration-150"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-1 opacity-0"
          >
            <p
              v-if="errors.plantSlug"
              class="mt-1.5 flex items-center gap-1 text-xs text-status-danger"
            >
              <Icon name="lucide:alert-circle" class="size-3" />
              {{ errors.plantSlug ? t(errors.plantSlug) : '' }}
            </p>
          </Transition>
        </div>

        <!-- مکان -->
        <div>
          <label class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink">
            <Icon name="lucide:map-pin" class="size-3.5 text-primary-500" />
            {{ t('pages.myPlants.location') }}
          </label>
          <input
            v-model="location"
            v-bind="locationAttrs"
            type="text"
            class="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:shadow-md focus:shadow-primary-100/40 focus-visible:ring-2 focus-visible:ring-primary-400"
            :class="errors.location ? 'border-status-danger' : 'border-ink/10'"
            :placeholder="t('pages.myPlants.locationPlaceholder')"
          >
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="-translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition-all duration-150"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-1 opacity-0"
          >
            <p
              v-if="errors.location"
              class="mt-1.5 flex items-center gap-1 text-xs text-status-danger"
            >
              <Icon name="lucide:alert-circle" class="size-3" />
              {{ errors.location ? t(errors.location) : '' }}
            </p>
          </Transition>
        </div>

        <AppButton
          type="submit"
          variant="primary"
          block
          class="!rounded-xl !py-3 !text-sm !font-semibold"
        >
          <Icon name="lucide:check" class="size-4" />
          {{ $t('common.save') }}
        </AppButton>
      </form>
    </AppModal>
  </div>
</template>

<style>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>