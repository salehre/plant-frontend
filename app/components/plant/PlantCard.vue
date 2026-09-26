<script setup lang="ts">
import type { Plant } from '~/types/plant.types'

const props = defineProps<{ plant: Plant }>()
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
          :label="lightLabel(props.plant.care.light)"
        />
        <RequirementBadge
          icon="lucide:droplets"
          :label="waterLabel(props.plant.care.water)"
        />
      </div>
    </div>
  </NuxtLink>
</template>
