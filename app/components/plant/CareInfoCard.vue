<script setup lang="ts">
import type { Plant } from '~/types/plant.types'

const props = defineProps<{ plant: Plant }>()
const { t, locale } = useI18n()

const lightKeys: Record<string, string> = {
  low: 'components.common.lightLow',
  medium: 'components.common.lightMedium',
  high: 'components.common.lightHigh',
  direct: 'components.common.lightDirect',
}
const waterKeys: Record<string, string> = {
  low: 'components.common.waterLow',
  medium: 'components.common.waterMedium',
  high: 'components.common.waterHigh',
}
function formatCount(value: number) {
  return new Intl.NumberFormat(locale.value, { useGrouping: false }).format(value)
}
function translatedValue(keys: Record<string, string>, value: string) {
  const key = keys[value]
  return key ? t(key) : value
}

const items = computed(() => [
  { icon: 'lucide:sun', label: t('components.careInfoCard.light'), value: translatedValue(lightKeys, props.plant.care.light) },
  {
    icon: 'lucide:droplets',
    label: t('components.careInfoCard.watering'),
    value: t('components.careInfoCard.everyDays', { days: formatCount(props.plant.care.wateringFrequencyDays) }),
  },
  {
    icon: 'lucide:thermometer',
    label: t('components.careInfoCard.temperature'),
    value: t('components.careInfoCard.temperatureValue', {
      min: formatCount(props.plant.care.temperatureRange[0]),
      max: formatCount(props.plant.care.temperatureRange[1]),
    }),
  },
  { icon: 'lucide:sprout', label: t('components.careInfoCard.suitableSoil'), value: props.plant.care.soil },
  {
    icon: 'lucide:wind',
    label: t('components.careInfoCard.humidity'),
    value: translatedValue(waterKeys, props.plant.care.humidity),
  },
])
</script>

<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
    <div
      v-for="item in items"
      :key="item.label"
      class="flex flex-col gap-1.5 rounded-md bg-primary-50/60 p-3"
    >
      <div class="flex items-center gap-1.5 text-primary-600">
        <Icon
          :name="item.icon"
          class="size-4"
        />
        <span class="text-xs font-medium">{{ item.label }}</span>
      </div>
      <span class="text-sm text-ink">{{ item.value }}</span>
    </div>
  </div>
</template>
