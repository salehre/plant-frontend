<script setup lang="ts">
import type { Plant } from '~/types/plant.types'

const props = defineProps<{ plant: Plant }>()

const items = computed(() => [
  { icon: 'lucide:sun', label: 'نور', value: lightLabel(props.plant.care.light) },
  { icon: 'lucide:droplets', label: 'آبیاری', value: `هر ${toPersianDigits(props.plant.care.wateringFrequencyDays)} روز` },
  {
    icon: 'lucide:thermometer',
    label: 'دما',
    value: `${toPersianDigits(props.plant.care.temperatureRange[0])} تا ${toPersianDigits(props.plant.care.temperatureRange[1])} درجه`,
  },
  { icon: 'lucide:sprout', label: 'خاک مناسب', value: props.plant.care.soil },
  { icon: 'lucide:wind', label: 'رطوبت', value: waterLabel(props.plant.care.humidity) },
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
