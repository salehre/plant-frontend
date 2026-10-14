<script setup lang="ts">
import type { Plant } from '~/types/plant.types'

const props = withDefaults(defineProps<{
  plant: Plant
  /** default: ردیف توی موبایل و کارت توی دسکتاپ | mini: تصویر مربعی کوچک با اسم زیرش */
  variant?: 'default' | 'mini'
}>(), { variant: 'default' })
const { t } = useI18n()

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
  <!-- کارت کوچک مربعی (Popular Plants) -->
  <NuxtLink
    v-if="props.variant === 'mini'"
    :to="`/plants/${props.plant.slug}`"
    class="group flex min-w-0 flex-col gap-2"
  >
    <div class="aspect-square overflow-hidden rounded-xl bg-primary-50">
      <img
        :src="props.plant.images[0]"
        :alt="props.plant.name"
        class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      >
    </div>
    <div class="min-w-0 px-0.5">
      <p class="truncate text-xs font-bold text-ink">
        {{ props.plant.name }}
      </p>
      <p class="truncate text-[11px] italic text-ink-muted">
        {{ props.plant.scientificName }}
      </p>
    </div>
  </NuxtLink>

  <!-- پیش‌فرض: ردیف لیستی توی موبایل، کارت توی sm به بالا -->
  <NuxtLink
    v-else
    :to="`/plants/${props.plant.slug}`"
    class="glass-card group flex items-center gap-3 p-2.5 sm:flex-col sm:items-stretch sm:gap-0"
  >
    <div class="relative size-16 shrink-0 overflow-hidden rounded-xl bg-primary-50 sm:aspect-[4/3] sm:size-auto sm:w-full">
      <img
        :src="props.plant.images[0]"
        :alt="props.plant.name"
        class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      >
      <div class="absolute end-2 top-2 hidden sm:block">
        <WishlistButton
          :slug="props.plant.slug"
          compact
        />
      </div>
    </div>
    <div class="flex min-w-0 flex-1 flex-col gap-0.5 sm:px-1.5 sm:pb-1.5 sm:pt-3">
      <h3 class="truncate font-bold text-ink">
        {{ props.plant.name }}
      </h3>
      <p class="truncate text-xs italic text-ink-muted">
        {{ props.plant.scientificName }}
      </p>
      <div class="mt-2 hidden flex-wrap gap-1.5 sm:flex">
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
    <Icon
      name="lucide:chevron-left"
      class="size-4 shrink-0 text-ink-muted sm:hidden ltr:rotate-180"
    />
  </NuxtLink>
</template>
