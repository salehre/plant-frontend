<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'
import type { Plant } from '~/types/plant.types'

const props = defineProps<{ plants: Plant[] }>()
const { t, locale } = useI18n({ messages: { en, fa }, useScope: 'local' })

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
const difficultyKeys: Record<string, string> = {
  easy: 'components.common.difficultyEasy',
  medium: 'components.common.difficultyMedium',
  hard: 'components.common.difficultyHard',
}
function formatCount(value: number) {
  return new Intl.NumberFormat(locale.value, { useGrouping: false }).format(value)
}
function translatedValue(keys: Record<string, string>, value: string) {
  const key = keys[value]
  return key ? t(key) : value
}

const rows = computed(() => [
  { label: t('components.compareTable.light'), get: (p: Plant) => translatedValue(lightKeys, p.care.light), icon: 'lucide:sun' },
  {
    label: t('components.compareTable.watering'),
    get: (p: Plant) => t('components.compareTable.everyDays', { days: formatCount(p.care.wateringFrequencyDays) }),
    icon: 'lucide:droplets',
  },
  {
    label: t('components.compareTable.temperature'),
    get: (p: Plant) => t('components.compareTable.temperatureValue', {
      min: formatCount(p.care.temperatureRange[0]),
      max: formatCount(p.care.temperatureRange[1]),
    }),
    icon: 'lucide:thermometer',
  },
  { label: t('components.compareTable.humidity'), get: (p: Plant) => translatedValue(waterKeys, p.care.humidity), icon: 'lucide:wind' },
  { label: t('components.compareTable.careLevel'), get: (p: Plant) => translatedValue(difficultyKeys, p.difficulty), icon: 'lucide:gauge' },
  {
    label: t('components.compareTable.toxicity'),
    get: (p: Plant) => t(p.toxicity.isToxic ? 'components.compareTable.toxicForPets' : 'components.compareTable.safe'),
    icon: 'lucide:alert-triangle',
  },
])
</script>

<template>
  <div class="overflow-x-auto rounded-lg bg-surface shadow-card">
    <table class="w-full min-w-[500px] text-sm">
      <thead>
        <tr class="border-b border-ink/5">
          <th class="p-4 text-start text-ink-muted">
            {{ t('components.compareTable.feature') }}
          </th>
          <th
            v-for="plant in props.plants"
            :key="plant.id"
            class="p-4 text-start"
          >
            <div class="flex items-center gap-2">
              <img
                :src="plant.images[0]"
                :alt="plant.name"
                class="size-10 rounded-md object-cover"
              >
              <span class="font-bold text-ink">{{ plant.name }}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.label"
          class="border-b border-ink/5 last:border-0"
        >
          <td class="p-4 text-ink-muted">
            <span class="flex items-center gap-1.5">
              <Icon
                :name="row.icon"
                class="size-4"
              />
              {{ row.label }}
            </span>
          </td>
          <td
            v-for="plant in props.plants"
            :key="plant.id"
            class="p-4 text-ink"
          >
            {{ row.get(plant) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
