<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { getMockPlants, mockPlants } from '~/services/mock/plants.mock'

definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

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

function removePlant(id: string, nickname: string) {
  userPlantsStore.removePlant(id)
  uiStore.showToast(t('pages.myPlants.removedToast', { name: nickname }), 'info')
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-ink">
        {{ t('nav.myPlants') }}
      </h1>
      <AppButton
          variant="primary"
          @click="showAddModal = true"
      >
        <Icon
            name="lucide:plus"
            class="size-4"
        />
        {{ $t('common.add') }}
      </AppButton>
    </div>

    <!-- جستجو و فیلتر -->
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative sm:w-72">
        <Icon
            name="lucide:search"
            class="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
        />
        <input
            v-model="search"
            type="text"
            :placeholder="$t('common.searchPlaceholder')"
            class="field !ps-10"
        >
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button
            v-for="option in statusOptions"
            :key="option"
            type="button"
            class="chip"
            :class="{ 'chip--active': statusFilter === option }"
            @click="statusFilter = option"
        >
          {{ option === 'all' ? $t('common.all') : healthLabel(option) }}
          ({{ toPersianDigits(option === 'all' ? userPlantsStore.plants.length : userPlantsStore.plants.filter(p => p.healthStatus === option).length) }})
        </button>
      </div>
    </div>

    <div
        v-if="filteredPlants.length"
        class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
    >
      <div
          v-for="p in filteredPlants"
          :key="p.id"
          class="glass-card group relative flex items-center gap-3 p-2.5 sm:flex-col sm:items-stretch sm:gap-0"
      >
        <NuxtLink
            :to="`/my-plants/${p.id}`"
            class="block size-16 shrink-0 overflow-hidden rounded-xl bg-primary-50 sm:size-auto sm:w-full"
        >
          <img
              :src="p.photo"
              :alt="p.nickname"
              class="size-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-44"
              loading="lazy"
          >
        </NuxtLink>
        <button
            :aria-label="t('common.delete')"
            class="absolute end-3 top-3 flex size-8 items-center justify-center rounded-lg sm:end-4 sm:top-4 sm:bg-surface/90 text-ink-muted shadow-card backdrop-blur transition-colors hover:text-status-danger"
            @click="removePlant(p.id, p.nickname)"
        >
          <Icon
              name="lucide:trash-2"
              class="size-4"
          />
        </button>
        <div class="flex min-w-0 flex-1 flex-col gap-1 pe-9 sm:px-1.5 sm:pb-1.5 sm:pe-1.5 sm:pt-3">
          <NuxtLink
              :to="`/my-plants/${p.id}`"
              class="font-bold text-ink"
          >
            {{ p.nickname }}
          </NuxtLink>
          <p class="text-xs text-ink-muted">
            {{ p.location }}
          </p>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <span
                class="rounded-full px-2.5 py-0.5 text-xs font-bold"
                :class="statusBadge[p.healthStatus]"
            >
              {{ healthLabel(p.healthStatus) }}
            </span>
            <span
                v-if="p.nextWateringAt"
                class="flex items-center gap-1 text-xs text-primary-700"
            >
              <Icon
                  name="lucide:droplets"
                  class="size-3.5"
              />
              {{ toJalaliDate(p.nextWateringAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
        v-else
        class="flex flex-col items-center gap-3 py-16 text-center text-ink-muted"
    >
      <Icon
          name="lucide:sprout"
          class="size-10"
      />
      {{ userPlantsStore.plants.length ? $t('pages.catalog.empty') : t('pages.myPlants.empty') }}
    </div>

    <AppModal
        v-model="showAddModal"
        :title="t('pages.myPlants.addPlant')"
    >
      <form
          class="flex flex-col gap-4"
          novalidate
          @submit="onSubmit"
      >
        <div>
          <label class="mb-1 block text-sm text-ink">{{ t('pages.myPlants.nickname') }}</label>
          <input
              v-model="nickname"
              v-bind="nicknameAttrs"
              type="text"
              class="w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              :class="errors.nickname ? 'border-status-danger' : 'border-ink/10'"
              :placeholder="t('pages.myPlants.nicknamePlaceholder')"
          >
          <p
              v-if="errors.nickname"
              class="mt-1 text-xs text-status-danger"
          >
            {{ errors.nickname ? t(errors.nickname) : '' }}
          </p>
        </div>
        <div>
          <label class="mb-1 block text-sm text-ink">{{ t('pages.myPlants.plantType') }}</label>
          <AppDropdown
              v-model="plantSlug"
              :options="plantOptions"
              :placeholder="t('pages.myPlants.choosePlant')"
          />
          <p
              v-if="errors.plantSlug"
              class="mt-1 text-xs text-status-danger"
          >
            {{ errors.plantSlug ? t(errors.plantSlug) : '' }}
          </p>
        </div>
        <div>
          <label class="mb-1 block text-sm text-ink">{{ t('pages.myPlants.location') }}</label>
          <input
              v-model="location"
              v-bind="locationAttrs"
              type="text"
              class="w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              :class="errors.location ? 'border-status-danger' : 'border-ink/10'"
              :placeholder="t('pages.myPlants.locationPlaceholder')"
          >
          <p
              v-if="errors.location"
              class="mt-1 text-xs text-status-danger"
          >
            {{ errors.location ? t(errors.location) : '' }}
          </p>
        </div>
        <AppButton
            type="submit"
            variant="primary"
            block
        >
          {{ $t('common.save') }}
        </AppButton>
      </form>
    </AppModal>
  </div>
</template>