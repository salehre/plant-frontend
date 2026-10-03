<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'
import type { Plant } from '~/types/plant.types'

const props = defineProps<{ plant: Plant }>()
const { t } = useI18n({ messages: { en, fa }, useScope: 'local' })

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
function translatedValue(keys: Record<string, string>, value: string) {
  const key = keys[value]
  return key ? t(key) : value
}
</script>

<template>
  <NuxtLink
    :to="`/plants/${props.plant.slug}`"
    class="glass-card group flex flex-col overflow-hidden"
  >
    <div class="relative aspect-square overflow-hidden bg-primary-50">
      <img
        :src="props.plant.images[0]"
        :alt="props.plant.name"
        class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      >
      <WishlistButton
        :slug="props.plant.slug"
        compact
        class="absolute end-2 top-2"
      />
    </div>
    <div class="flex flex-1 flex-col gap-1 p-4">
      <h3 class="font-bold text-ink">{{ props.plant.name }}</h3>
      <p class="text-xs italic text-ink-muted">{{ props.plant.scientificName }}</p>
      <div class="mt-2 flex flex-wrap gap-1.5">
        <RequirementBadge
          icon="lucide:sun"
          :label="translatedValue(lightKeys, props.plant.care.light)"
        />
        <RequirementBadge
          icon="lucide:droplets"
          :label="translatedValue(waterKeys, props.plant.care.water)"
        />
      </div>
    </div>
  </NuxtLink>
</template>
