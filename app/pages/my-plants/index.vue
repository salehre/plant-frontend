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
const mounted = ref(ref)

// جستجو و فیلتر
const search = ref('')
const statusFilter = ref<'all' | 'healthy' | 'needs_attention' | 'sick'>('all')
const statusOptions = ['all', 'healthy', 'needs_attention', 'sick'] as const

const statusBadge: Record<string, string> = {
  healthy: 'bg-emerald-500/95 text-white',
  needs_attention: 'bg-amber-500/95 text-white',
  sick: 'bg-rose-500/95 text-white',
}
const statusDot: Record<string, string> = {
  healthy: 'bg-emerald-300',
  needs_attention: 'bg-amber-200',
  sick: 'bg-rose-200',
}
// ✅ آیکون‌های حالت (تغییر شد)
const statusIcon: Record<string, string> = {
  healthy: 'lucide:leaf',
  needs_attention: 'lucide:alert-triangle',
  sick: 'lucide:thermometer',
}

const counts = computed(() => ({
  all: userPlantsStore.plants.length,
  healthy: userPlantsStore.plants.filter(p => p.healthStatus === 'healthy').length,
  needs_attention: userPlantsStore.plants.filter(p => p.healthStatus === 'needs_attention').length,
  sick: userPlantsStore.plants.filter(p => p.healthStatus === 'sick').length,
}))

const filteredPlants = computed(() =>
  userPlantsStore.plants.filter(p =>
    (statusFilter.value === 'all' || p.healthStatus === statusFilter.value)
    && (!search.value.trim() || p.nickname.includes(search.value.trim()) || p.location.includes(search.value.trim())),
  ),
)

function clearSearch() {
  search.value = ''
}

function formatPlantCount(count: number) {
  return activeLocale.value === 'fa' ? toPersianDigits(count) : String(count)
}

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

// ✅ نگاشت آیکون فیلتر (افزودجدی)
const filterIconMap = {
  all: 'lucide:home',
  healthy: 'lucide:leaf',
  needs_attention: 'lucide:alert-triangle',
  sick: 'lucide:thermometer',
}

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

// ─── Lazy image ───
const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const imageStates = reactive<Record<string, 'loading' | 'loaded' | 'error'>>({})

function onImageLoad(e: Event, id: string) {
  const img = e.target as HTMLImageElement
  if (img.dataset.src)
    return
  imageStates[id] = 'loaded'
}
function onImageError(id: string) {
  imageStates[id] = 'error'
}

const vLazyImg = {
  mounted(el: HTMLImageElement) {
    if (typeof IntersectionObserver === 'undefined') {
      if (el.dataset.src) {
        el.src = el.dataset.src
        el.removeAttribute('data-src')
      }
      return
    }
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
      { rootMargin: '200px 0px', threshold: 0.05 },
    )
    observer.observe(el)
    // @ts-ignore
    el._observer = observer
  },
  unmounted(el: HTMLImageElement) {
    // @ts-ignore
    el._observer?.disconnect?.()
  },
}

// ─── Tilt سه‌بعدی ───
function handleTilt(e: MouseEvent) {
  if (window.matchMedia('(hover: none)').matches)
    return
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width - 0.5
  const py = (e.clientY - r.top) / r.height - 0.5
  el.style.setProperty('--rx', `${(-py * 7).toFixed(2)}deg`)
  el.style.setProperty('--ry', `${(px * 9).toFixed(2)}deg`)
}
function resetTilt(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
}

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})
</script>

<template>
  <div class="relative">
    <!-- بک‌گراند شناور -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div class="animate-blob absolute -top-24 -start-24 size-72 rounded-full bg-primary-100/50 blur-[90px]" />
      <div class="animate-blob-delayed absolute -end-24 top-40 size-80 rounded-full bg-accent-100/50 blur-[100px]" />
      <Icon
        name="lucide:leaf"
        class="animate-float absolute end-[8%] top-6 size-6 text-primary-200/60"
      />
      <Icon
        name="lucide:trees"
        class="animate-float-delayed absolute start-[4%] top-48 size-5 text-primary-200/60"
      />
    </div>

    <!-- هدر -->
    <div
      class="mb-6 flex items-center justify-between transition-all duration-700"
      :class="mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'"
    >
      <div class="flex items-center gap-3">
        <span class="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-900/15">
          <span class="absolute inset-0 animate-ping rounded-2xl bg-primary-400/20 [animation-duration:2.5s]" />
          <Icon
            name="lucide:trees"
            class="animate-float relative size-5"
          />
        </span>
        <div>
          <h1 class="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-ink">
            {{ t('nav.myPlants') }}
          </h1>
          <p class="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
            <span class="relative flex size-1.5">
              <span class="absolute inline-flex size-full animate-ping rounded-full bg-primary-400 opacity-60" />
              <span class="relative inline-flex size-1.5 rounded-full bg-primary-500" />
            </span>
            <span
              :key="counts.all"
              class="animate-pop inline-block font-bold text-ink"
            >
              {{ formatPlantCount(counts.all) }}
            </span>
            {{ t('pages.myPlants.plantCount') }}
          </p>
        </div>
      </div>

      <AppButton
        variant="primary"
        class="btn-shine group rounded-2xl px-4 py-2.5 bg-primary-600 text-white font-medium transition-all duration-300 hover:shadow-xl hover:shadow-primary-300/50 active:scale-95"
        @click="showAddModal = true"
      >
        <Icon
          name="lucide:plus"
          class="size-4 mr-2 transition-transform duration-300 hover:rotate-60 hover:scale-110"
        />
        {{ $t('common.add') }}
      </AppButton>
    </div>

    <!-- جستجو و فیلتر -->
    <div
      class="mb-6 flex flex-col gap-3 transition-all delay-100 duration-700 sm:flex-row sm:items-start"
      :class="mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
    >
      <div class="group relative w-full sm:w-72 sm:shrink-0">
        <Icon
          name="lucide:search"
          class="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-primary-500"
        />
        <input
          v-model="search"
          type="text"
          :placeholder="$t('common.searchPlaceholder')"
          class="field !rounded-2xl !py-2.5 !ps-10 !pe-10 transition-all duration-300 focus:!border-primary-300 focus:shadow-lg focus:shadow-primary-100/50"
        >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="scale-50 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition-all duration-150"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-50 opacity-0"
        >
          <button
            v-if="search"
            type="button"
            class="absolute end-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-ink/5 text-ink-muted transition-all hover:rotate-90 hover:bg-ink/10 hover:text-ink"
            @click="clearSearch"
          >
            <Icon
              name="lucide:x"
              class="size-3.5"
            />
          </button>
        </Transition>
      </div>

      <div
        class="flex min-w-0 flex-1 flex-wrap gap-2 overflow-visible px-1 py-1"
        :class="mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
      >
        <button
          v-for="(option, idx) in statusOptions"
          :key="option"
          type="button"
          class="chip group relative z-0 !shrink-0 !rounded-full !px-3.5 !py-1.5 transition-all duration-300 hover:z-10 hover:-translate-y-0.5 hover:shadow-md focus-visible:z-10 active:scale-95"
          :style="{ transitionDelay: `${idx * 30}ms` }"
          @click="statusFilter = option"
        >
          <span class="flex items-center gap-1">
            <!-- ✅ آیکون وضعیت روی هر فیلتر -->
            <span v-if="option !== 'all'" class="relative size-3.5 rounded-full" :class="statusDot[option]">
              <Icon :name="filterIconMap[option]" class="absolute inset-0 flex items-center justify-center size-3.5" style="color: #fff" />
            </span>
            <span>{{ option === 'all' ? $t('common.all') : healthLabel(option) }}</span>
            <span
              :key="counts[option]"
              class="animate-pop inline-flex min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-black"
              :class="statusFilter === option ? 'bg-white/25' : 'bg-ink/5'"
            >
              {{ formatPlantCount(counts[option]) }}
            </span>
          </span>
        </button>
      </div>
    </div>

    <!-- گريد کارت‌ها با انیمیشن FLIP -->
    <TransitionGroup
      v-if="filteredPlants.length"
      name="plant-card"
      tag="div"
      appear
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
    >
      <div
        v-for="(p, index) in filteredPlants"
        :key="p.id"
        :style="{ '--i': index % 9 }"
        class="plant-card-item"
      >
        <div
          class="tilt-card plant-card-surface shine group relative overflow-hidden rounded-[22px] border backdrop-blur-md transition-shadow duration-500"
          @mousemove="handleTilt"
          @mouseleave="resetTilt"
        >
          <!-- تصویر -->
          <NuxtLink
            :to="`/my-plants/${p.id}`"
            class="relative block h-48 overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-accent-50"
          >
            <!-- اسکلت + شیمر -->
            <div
              v-if="imageStates[p.id] !== 'loaded' && imageStates[p.id] !== 'error'"
              class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 overflow-hidden"
            >
              <span class="animate-float flex size-10 items-center justify-center rounded-2xl bg-surface shadow-sm">
                <Icon
                  name="lucide:seedling"
                  class="size-5 animate-pulse text-primary-300"
                />
              </span>
              <div class="h-2 w-20 animate-pulse rounded-full bg-primary-100" />
              <div class="shimmer absolute inset-0" />
            </div>

            <!-- خطا -->
            <div
              v-if="imageStates[p.id] === 'error'"
              class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-primary-50 to-accent-50 text-ink-muted/70"
            >
              <Icon
                name="lucide:image-off"
                class="animate-float size-8"
              />
              <span class="text-[11px]">{{ t('pages.myPlants.imageUnavailable') }}</span>
            </div>

            <img
              v-lazy-img
              :src="PLACEHOLDER"
              :data-src="p.photo"
              :alt="p.nickname"
              loading="lazy"
              decoding="async"
              class="size-full object-cover transition-all duration-[900ms] ease-out group-hover:rotate-[0.5deg] group-hover:scale-[1.08]"
              :class="imageStates[p.id] === 'loaded' ? 'scale-100 opacity-100 blur-0' : 'scale-[1.04] opacity-0 blur-[6px]'"
              @load="onImageLoad($event, p.id)"
              @error="onImageError(p.id)"
            >

            <!-- گرادیان هاور -->
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div class="pointer-events-none absolute inset-x-4 bottom-3 flex translate-y-3 items-center gap-1 text-[11px] font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <Icon
                name="lucide:eye"
                class="size-3.5"
              />
              {{ t('common.details') }}
            </div>
          </NuxtLink>

          <!-- بج وضعیت -->
          <div class="absolute start-3 top-3 z-20">
            <span
              class="inline-flex items-center gap-1.5 rounded-full py-1 pe-2.5 ps-1.5 text-[11px] font-bold shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-105"
              :class="statusBadge[p.healthStatus]"
            >
              <span class="flex size-5 items-center justify-center rounded-full bg-white/25">
                <Icon
                  :name="statusIcon[p.healthStatus]"
                  class="size-3"
                />
              </span>
              {{ healthLabel(p.healthStatus) }}
            </span>
          </div>

          <!-- حذف -->
          <button
            :aria-label="t('common-delete')"
            class="absolute end-3 top-3 z-30 flex size-8 items-center justify-center rounded-xl bg-surface/90 text-ink-muted shadow-lg backdrop-blur-md transition-all duration-300 hover:rotate-12 hover:scale-110 hover:bg-status-danger hover:text-white active:scale-90 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
            @click="removePlant(p.id, p.nickname)"
          >
            <Icon
              name="lucide:trash-2"
              class="size-4"
            />
          </button>

          <!-- اطلاعات -->
          <div class="relative p-4">
            <NuxtLink
              :to="`/my-plants/${p.id}`"
              class="group/link flex items-center gap-1 font-extrabold text-ink transition-colors duration-200 hover:text-primary-600"
            >
              <span class="truncate">{{ p.nickname }}</span>
              <Icon
                name="lucide:arrow-up-left"
                class="size-4 shrink-0 -translate-x-1 text-primary-500 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100 rtl:rotate-90"
              />
            </NuxtLink>

            <div class="mt-1.5 flex items-center gap-1.5 text-xs text-ink-muted">
              <span class="flex size-5 items-center justify-center rounded-md bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-100">
                <Icon
                  name="lucide:map-pin"
                  class="size-3"
                />
              </span>
              <span class="truncate">{{ p.location }}</span>
            </div>

            <div class="mt-3.5 flex items-center justify-between border-t border-dashed border-ink/10 pt-3">
              <span
                v-if="p.nextWateringAt"
                class="group/water flex items-center gap-1.5 text-xs font-bold text-primary-700"
              >
                <span class="relative flex size-6 items-center justify-center rounded-full bg-primary-50 transition-colors duration-300 group-hover/water:bg-primary-100">
                  <span class="absolute inline-flex size-full animate-ping rounded-full bg-primary-300/40 [animation-duration:1.8s]" />
                  <Icon
                    name="lucide:droplets"
                    class="animate-wiggle relative size-3.5"
                  />
                </span>
                {{ toJalaliDate(p.nextWateringAt) }}
              </span>
              <span
                v-else
                class="text-xs text-ink-muted/40"
              >—</span>

              <NuxtLink
                :to="`/my-plants/${p.id}`"
                class="flex items-center gap-0.5 rounded-xl bg-primary-50 px-2.5 py-1.5 text-[11px] font-bold text-primary-700 transition-all duration-300 hover:gap-1.5 hover:bg-primary-600 hover:text-white hover:shadow-lg hover:shadow-primary-200 active:scale-95"
              >
                {{ t('common.details') }}
                <Icon
                  name="lucide:chevron-left"
                  class="size-3 rtl:rotate-180"
                />
              </NuxtLink>
            </div>
          </div>

          <!-- خط پایین رنگی -->
          <span class="absolute inset-x-0 bottom-0 h-[3px] origin-right scale-x-0 bg-gradient-to-l from-primary-500 via-primary-400 to-accent-400 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
        </div>
      </div>
    </TransitionGroup>

    <!-- خالی -->
    <div
      v-else
      :key="statusFilter + search"
      class="animate-fadeUp relative flex flex-col items-center gap-4 overflow-hidden rounded-[26px] border border-dashed border-primary-200 bg-surface/60 py-16 text-center backdrop-blur-sm sm:py-20"
    >
      <div class="pointer-events-none absolute inset-0">
        <span class="animate-float absolute start-[15%] top-8 text-primary-200"><Icon
          name="lucide:seedling"
          class="size-5"
        /></span>
        <span class="animate-float-delayed absolute end-[12%] top-14 text-accent-300/70"><Icon
          name="lucide:star"
          class="size-5"
        /></span>
        <span class="animate-float absolute bottom-10 start-[25%] text-primary-100 [animation-delay:0.8s]"><Icon
          name="lucide:rose"
          class="size-6"
        /></span>
      </div>

      <div class="relative">
        <span class="absolute inset-0 -m-4 animate-ping rounded-[28px] bg-primary-100/40 [animation-duration:2.8s]" />
        <span class="animate-float relative flex size-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-surface to-primary-50 shadow-xl shadow-primary-900/10 ring-1 ring-ink/5">
          <Icon
            name="lucide:seedling"
            class="size-10 text-primary-400"
          />
        </span>
        <span class="animate-bounce absolute -end-2 -top-2 flex size-7 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg [animation-delay:0.2s]">
          <Icon
            name="lucide:plus"
            class="size-3.5"
          />
        </span>
        <span class="animate-bounce absolute -bottom-1 -start-3 flex size-6 items-center justify-center rounded-full bg-surface text-primary-500 shadow-md [animation-delay:0.6s]">
          <Icon
            name="lucide:leaf"
            class="size-3"
          />
        </span>
      </div>

      <div class="relative">
        <p class="font-extrabold text-ink">
          {{ userPlantsStore.plants.length ? $t('pages.catalog.empty') : t('pages.myPlants.empty') }}
        </p>
        <p class="mx-auto mt-1.5 max-w-xs text-sm leading-7 text-ink-muted">
          {{ t('pages.myPlants.emptyHint') }}
        </p>
      </div>

      <AppButton
        variant="primary"
        class="btn-shine group relative rounded-2xl px-5 py-2.5 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.95]"
      >
        <Icon
          name="lucide:plus"
          class="size-4 transition-transform duration-300 group-hover:rotate-180"
        />
        {{ t('pages.myPlants.addFirst') }}
      </AppButton>
    </div>

    <!-- مودال -->
    <AppModal
      v-model="showAddModal"
      :title="t('pages.myPlants.addPlant')"
    >
      <form
        class="flex flex-col gap-5"
        novalidate
        @submit="onSubmit"
      >
        <div class="animate-fadeUp" style="animation-delay: 0.05s">
          <label class="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-ink">
            <span class="flex size-6 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><Icon
              name="lucide:tag"
              class="size-3.5"
            /></span>
            {{ t('pages.myPlants.nickname') }}
          </label>
          <input
            v-model="nickname"
            v-bind="nicknameAttrs"
            type="text"
            class="w-full rounded-2xl border px-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:shadow-lg focus:shadow-primary-100/50 focus-visible:ring-2 focus-visible:ring-primary-400"
            :class="errors.nickname ? 'animate-shake border-status-danger bg-status-danger/5' : 'border-ink/10 bg-surface focus:border-primary-300'"
            :placeholder="t('pages.myPlants.nicknamePlaceholder')"
          >
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="-translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-1 opacity-0"
          >
            <p
              v-if="errors.nickname"
              class="mt-1.5 flex items-center gap-1 text-xs font-medium text-status-danger"
            >
              <Icon
                name="lucide:circle-alert"
                class="size-3.5 animate-pop"
              />
              {{ errors.nickname ? t(errors.nickname) : '' }}
            </p>
          </Transition>
        </div>

        <div class="animate-fadeUp" style="animation-delay: 0.12s">
          <label class="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-ink">
            <span class="flex size-6 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><Icon
              name="lucide:flower"
              class="size-3.5"
            /></span>
            {{ t('pages.myPlants.plantType') }}
          </label>
          <AppDropdown
            v-model="plantSlug"
            :options="plantOptions"
            :placeholder="t('pages.myPlants.choosePlant')"
          />
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="-translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-1 opacity-0"
          >
            <p
              v-if="errors.plantSlug"
              class="mt-1.5 flex items-center gap-1 text-xs font-medium text-status-danger"
            >
              <Icon
                name="lucide:circle-alert"
                class="size-3.5 animate-pop"
              />
              {{ errors.plantSlug ? t(errors.plantSlug) : '' }}
            </p>
          </Transition>
        </div>

        <div class="animate-fadeUp" style="animation-delay: 0.19s">
          <label class="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-ink">
            <span class="flex size-6 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><Icon
              name="lucide:map-pin"
              class="size-3.5"
            /></span>
            {{ t('pages.myPlants.location') }}
          </label>
          <input
            v-model="location"
            v-bind="locationAttrs"
            type="text"
            class="w-full rounded-2xl border px-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:shadow-lg focus:shadow-primary-100/50 focus-visible:ring-2 focus-visible:ring-primary-400"
            :class="errors.location ? 'animate-shake border-status-danger bg-status-danger/5' : 'border-ink/10 bg-surface focus:border-primary-300'"
            :placeholder="t('pages.myPlants.locationPlaceholder')"
          >
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="-translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-1 opacity-0"
          >
            <p
              v-if="errors.location"
              class="mt-1.5 flex items-center gap-1 text-xs font-medium text-status-danger"
            >
              <Icon
                name="lucide:circle-alert"
                class="size-3.5 animate-pop"
              />
              {{ errors.location ? t(errors.location) : '' }}
            </p>
          </Transition>
        </div>

        <AppButton
          type="submit"
          variant="primary"
          block
          class="btn-shine group rounded-2xl py-3 text-sm font-bold shadow-lg shadow-primary-200/50 transition-all duration-300 hover:!shadow-xl active:scale-[0.98]"
        >
          <Icon
            name="lucide:check"
            class="size-4 transition-transform duration-300 group-hover:scale-125"
          />
          {{ $t('common.save') }}
        </AppButton>
      </form>
    </AppModal>
  </div>
</template>

<style scoped>
/* ── ورود کارت‌ها + جابه‌جایی نرم فیلتر ── */
.plant-card-move {
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.plant-card-enter-active {
  animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i, 0) * 75ms);
}
.plant-card-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}
.plant-card-leave-to {
  opacity: 0;
  transform: scale(0.94) translateY(12px);
}

/* ── Tilt ── */
.plant-card-surface {
  border-color: rgb(var(--color-ink) / 0.1);
  background-color: rgb(var(--color-surface) / 0.9);
  box-shadow: 0 8px 30px -12px rgb(var(--color-ink) / 0.12);
}
.plant-card-surface:hover {
  box-shadow: 0 20px 50px -15px rgb(var(--color-primary-500) / 0.3);
}

.tilt-card {
  transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 0.35s ease, box-shadow 0.4s ease, translate 0.35s ease;
  transform-style: preserve-3d;
}
.tilt-card:hover {
  translate: 0 -6px;
}

/* ── برق کشویی روی کارت و دکمه ── */
.shine {
  position: relative;
}
.shine::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  background: linear-gradient(105deg, transparent 42%, rgba(255, 255, 255, 0.55) 50%, transparent 58%);
  transform: translateX(-130%);
  transition: transform 0.9s ease;
}
.shine:hover::after {
  transform: translateX(130%);
}
.btn-shine {
  position: relative;
  overflow: hidden;
}
.btn-shine::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.35) 50%, transparent 60%);
  transform: translateX(-150%);
  transition: transform 0.7s ease;
  pointer-events: none;
}
.btn-shine:hover::before {
  transform: translateX(150%);
}

/* ── شیمر اسکلت ── */
.shimmer {
  background: linear-gradient(100deg, transparent 20%, rgba(255, 255, 255, 0.7) 50%, transparent 80%);
  background-size: 200% 100%;
  animation: shimmerMove 1.4s infinite linear;
}

/* ── کی‌فریم‌ها ── */
@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes shimmerMove {
  0% {
    background-position: 180% 0;
  }
  100% {
    background-position: -80% 0;
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-9px) rotate(4deg);
  }
}
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(28px, -22px) scale(1.1);
  }
  66% {
    transform: translate(-18px, 18px) scale(0.92);
  }
}
@keyframes pop {
  0% {
    transform: scale(0.6);
  }
  60% {
    transform: scale(1.12);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes wiggle {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-12deg);
  }
  75% {
    transform: rotate(12deg);
  }
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-5px);
  }
  40% {
    transform: translateX(5px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(3px);
  }
}

.animate-fadeUp {
  animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.animate-float {
  animation: float 5.5s ease-in-out infinite;
}
.animate-float-delayed {
  animation: float 7s ease-in-out infinite;
  animation-delay: 1.2s;
}
.animate-blob {
  animation: blob 12s ease-in-out infinite;
}
.animate-blob-delayed {
  animation: blob 15s ease-in-out infinite reverse;
}
.animate-pop {
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.animate-shake {
  animation: shake 0.4s ease;
}
.group:hover .animate-wiggle,
.animate-wiggle {
  animation: wiggle 2.2s ease-in-out infinite;
  transform-origin: center bottom;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .tilt-card {
    transform: none !important;
  }
}
</style>