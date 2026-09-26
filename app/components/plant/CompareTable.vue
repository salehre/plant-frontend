<script setup lang="ts">
import type { Plant } from '~/types/plant.types'

const props = defineProps<{ plants: Plant[] }>()

const rows = computed(() => [
  { label: 'نور', get: (p: Plant) => lightLabel(p.care.light), icon: 'lucide:sun' },
  { label: 'آبیاری', get: (p: Plant) => `هر ${toPersianDigits(p.care.wateringFrequencyDays)} روز`, icon: 'lucide:droplets' },
  { label: 'دما', get: (p: Plant) => `${toPersianDigits(p.care.temperatureRange[0])} تا ${toPersianDigits(p.care.temperatureRange[1])} درجه`, icon: 'lucide:thermometer' },
  { label: 'رطوبت', get: (p: Plant) => waterLabel(p.care.humidity), icon: 'lucide:wind' },
  { label: 'سطح مراقبت', get: (p: Plant) => difficultyLabel(p.difficulty), icon: 'lucide:gauge' },
  { label: 'سمیت', get: (p: Plant) => (p.toxicity.isToxic ? 'سمی برای حیوانات' : 'بی‌خطر'), icon: 'lucide:alert-triangle' },
])
</script>

<template>
  <div class="overflow-x-auto rounded-lg bg-surface shadow-card">
    <table class="w-full min-w-[500px] text-sm">
      <thead>
        <tr class="border-b border-ink/5">
          <th class="p-4 text-start text-ink-muted">
            ویژگی
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
