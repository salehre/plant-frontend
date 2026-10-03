<script setup lang="ts">
import { getMockCities, findCityById } from '~/services/mock/climate.mock'
import { getMockPlants } from '~/services/mock/plants.mock'

const selectedCityId = ref('tehran')
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

const cityOptions = computed(() => getMockCities(activeLocale.value).map(c => ({ label: `${c.name} (${c.province})`, value: c.id })))

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
  <div class="mx-auto max-w-5xl px-4 py-10">
    <h1 class="mb-2 text-2xl font-bold text-ink">
      {{ t('pages.climate.title') }}
    </h1>
    <p class="mb-6 text-ink-muted">
      {{ t('pages.climate.subtitle') }}
    </p>

    <div class="mb-8 max-w-xs">
      <AppDropdown
          v-model="selectedCityId"
          :options="cityOptions"
      />
    </div>

    <div
        v-if="selectedCity"
        class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
    >
      <div class="glass-card p-4 text-center">
        <Icon
            name="lucide:thermometer"
            class="mx-auto mb-1 size-5 text-primary-600"
        />
        <p class="text-sm font-medium text-ink">
          {{ toPersianDigits(selectedCity.avgTemp[0]) }}–{{ toPersianDigits(selectedCity.avgTemp[1]) }}°
        </p>
        <p class="text-xs text-ink-muted">
          {{ t('pages.climate.annualTemperature') }}
        </p>
      </div>
      <div class="glass-card p-4 text-center">
        <Icon
            name="lucide:droplets"
            class="mx-auto mb-1 size-5 text-primary-600"
        />
        <p class="text-sm font-medium text-ink">
          {{ humidityLabelMap[selectedCity.humidity] }}
        </p>
        <p class="text-xs text-ink-muted">
          {{ t('pages.climate.humidity') }}
        </p>
      </div>
      <div class="glass-card p-4 text-center">
        <Icon
            name="lucide:cloud"
            class="mx-auto mb-1 size-5 text-primary-600"
        />
        <p class="text-sm font-medium text-ink">
          {{ selectedCity.climateType }}
        </p>
        <p class="text-xs text-ink-muted">
          {{ t('pages.climate.climateType') }}
        </p>
      </div>
      <div class="glass-card p-4 text-center">
        <Icon
            name="lucide:sprout"
            class="mx-auto mb-1 size-5 text-primary-600"
        />
        <p class="text-sm font-medium text-ink">
          {{ toPersianDigits(suitablePlants.length) }} {{ t('pages.climate.plantCount') }}
        </p>
        <p class="text-xs text-ink-muted">
          {{ t('pages.climate.suitableRecommendations') }}
        </p>
      </div>
    </div>

    <h2 class="mb-4 text-lg font-bold text-ink">
      {{ t('pages.climate.plantsForCity', { city: selectedCity?.name }) }}
    </h2>
    <div
        v-if="suitablePlants.length"
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
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
</template>