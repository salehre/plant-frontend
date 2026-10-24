<script setup lang="ts">
import { findCityById } from '~/services/mock/climate.mock'
import { getMockPlants } from '~/services/mock/plants.mock'

const { t, locale } = useI18n()
const addressStore = useAddressStore()

// وقتی آدرسی ذخیره نشده، مثل قبل از لیست همه‌ی شهرها انتخاب می‌شه
const fallbackCityId = ref('tehran')
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')


const addressChips = computed(() =>
  addressStore.items.map((address) => {
    const city = findCityById(address.cityId, activeLocale.value)
    return { id: address.id, label: address.label, cityName: city?.name ?? address.cityId }
  }),
)
const selectedCityId = computed({
  get: () => addressStore.active?.cityId ?? fallbackCityId.value,
  set: (value: string) => { fallbackCityId.value = value },
})

const selectedCity = computed(() => findCityById(selectedCityId.value, activeLocale.value))
const localizedPlants = computed(() => getMockPlants(activeLocale.value))

const suitablePlants = computed(() => {
  if (!selectedCity.value) return []
  return selectedCity.value.suitablePlantSlugs
      .map(slug => localizedPlants.value.find(p => p.slug === slug))
      .filter((p): p is NonNullable<typeof p> => !!p)
})

const humidityLabelMap = computed<Record<string, string>>(() => ({
  low: t('pages.climate.low'),
  medium: t('pages.climate.medium'),
  high: t('pages.climate.high'),
}))
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-2xl font-bold text-ink">
        {{ t('pages.climate.title') }}
      </h1>
      <p class="mt-1 text-sm text-ink-muted">
        {{ t('pages.climate.subtitle') }}
      </p>
    </div>

    <!-- آدرس‌های ذخیره‌شده‌ی کاربر -->
    <div
      v-if="addressChips.length"
      class="flex flex-col gap-2.5"
    >
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm font-medium text-ink">
          {{ t('pages.climate.myAddresses') }}
        </p>
        <NuxtLink
          to="/profile?tab=addresses"
          class="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-surface px-3.5 py-2 text-xs font-bold text-ink transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
        >
          <Icon
            name="lucide:settings-2"
            class="size-4"
          />
          {{ t('pages.climate.manageAddresses') }}
        </NuxtLink>
      </div>
      <div
        class="flex flex-wrap gap-2"
        role="radiogroup"
        :aria-label="t('pages.climate.myAddresses')"
      >
        <button
          v-for="chip in addressChips"
          :key="chip.id"
          type="button"
          role="radio"
          :aria-checked="addressStore.active?.id === chip.id"
          class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
          :class="addressStore.active?.id === chip.id
            ? 'border-primary-600 bg-primary-600 text-white'
            : 'border-ink/10 bg-surface text-ink hover:border-primary-300 hover:bg-primary-50'"
          @click="addressStore.setActive(chip.id)"
        >
          <AddressIcon
            :label="chip.label"
            class="size-4 shrink-0"
          />
          <span class="font-bold">{{ chip.label || chip.cityName }}</span>
          <span
            v-if="chip.label"
            class="text-xs opacity-80"
          >{{ chip.cityName }}</span>
        </button>
      </div>
    </div>

    <!-- بدون آدرس: انتخاب مستقیم شهر + دعوت به افزودن آدرس -->
    <div
      v-else
      class="flex flex-col gap-3"
    >
      <div class="grid max-w-lg gap-3 sm:grid-cols-2">
        <ProvinceCitySelect v-model="selectedCityId" />
      </div>
      <NuxtLink
        to="/profile?tab=addresses"
        class="inline-flex w-fit items-center gap-2 rounded-xl bg-primary-50 px-4 py-2.5 text-sm text-primary-700 transition-colors hover:bg-primary-100"
      >
        <Icon
          name="lucide:map-pin-plus"
          class="size-4"
        />
        {{ t('pages.climate.addAddressHint') }}
      </NuxtLink>
    </div>

    <template v-if="selectedCity">
      <!-- کارت اصلی آب‌وهوا -->
      <div class="glass-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <span class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Icon
              name="lucide:cloud-sun"
              class="size-9"
            />
          </span>
          <div>
            <p class="text-sm text-ink-muted">
              {{ selectedCity.name }} · {{ selectedCity.province }}
            </p>
            <p class="text-3xl font-extrabold text-ink">
              {{ toPersianDigits(selectedCity.avgTemp[0]) }}–{{ toPersianDigits(selectedCity.avgTemp[1]) }}°
            </p>
            <p class="text-sm text-ink-muted">
              {{ t('pages.climate.annualTemperature') }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 sm:w-[420px]">
          <div class="rounded-xl bg-primary-50/70 p-3 text-center">
            <Icon
              name="lucide:droplets"
              class="mx-auto mb-1 size-5 text-primary-600"
            />
            <p class="text-sm font-bold text-ink">
              {{ humidityLabelMap[selectedCity.humidity] }}
            </p>
            <p class="text-xs text-ink-muted">
              {{ t('pages.climate.humidity') }}
            </p>
          </div>
          <div class="rounded-xl bg-primary-50/70 p-3 text-center">
            <Icon
              name="lucide:cloud"
              class="mx-auto mb-1 size-5 text-primary-600"
            />
            <p class="truncate text-sm font-bold text-ink">
              {{ selectedCity.climateType }}
            </p>
            <p class="text-xs text-ink-muted">
              {{ t('pages.climate.climateType') }}
            </p>
          </div>
          <div class="rounded-xl bg-primary-50/70 p-3 text-center">
            <Icon
              name="lucide:sprout"
              class="mx-auto mb-1 size-5 text-primary-600"
            />
            <p class="text-sm font-bold text-ink">
              {{ toPersianDigits(suitablePlants.length) }} {{ t('pages.climate.plantCount') }}
            </p>
            <p class="truncate text-xs text-ink-muted">
              {{ t('pages.climate.suitableRecommendations') }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <div>
      <h2 class="mb-4 text-lg font-bold text-ink">
        {{ t('pages.climate.plantsForCity', { city: selectedCity?.name }) }}
      </h2>
      <div
        v-if="suitablePlants.length"
        class="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
      >
        <PlantCard
          v-for="plant in suitablePlants"
          :key="plant.id"
          :plant="plant"
        />
      </div>
      <p
        v-else
        class="text-ink-muted"
      >
        {{ t('pages.climate.empty') }}
      </p>
    </div>
  </div>
</template>