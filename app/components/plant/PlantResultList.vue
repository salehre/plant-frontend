<script setup lang="ts">
import type { PlantResultItem, PlantResultOptions, PlantResultVariant } from '~/composables/usePlantResults'

const props = withDefaults(
    defineProps<{
      items: PlantResultItem[]
      variant: PlantResultVariant
      options?: Partial<PlantResultOptions>
      isConfirmed?: (item: PlantResultItem) => boolean
    }>(),
    { options: undefined, isConfirmed: undefined },
)

const emit = defineEmits<{
  remove: [item: PlantResultItem]
  confirm: [item: PlantResultItem]
}>()

const resolved = usePlantResultOptions(() => props.variant, () => props.options)
</script>

<template>
  <div class="flex flex-col gap-3">
    <PlantResultCard
        v-for="(item, index) in items"
        :key="item.id"
        :name="item.name"
        :scientific-name="item.scientificName"
        :image="item.image"
        :slug="item.slug"
        :plant="item.plant"
        :confidence="item.confidence"
        :meta="resolved.showMeta ? item.meta : ''"
        :show-confidence="resolved.showConfidence"
        :show-wishlist-button="resolved.showWishlistButton"
        :removable="resolved.removable"
        :confirmable="resolved.confirmable"
        :confirmed="props.isConfirmed?.(item) ?? false"
        :default-open="resolved.defaultOpenFirst && index === 0"
        @remove="emit('remove', item)"
        @confirm="emit('confirm', item)"
    />
  </div>
</template>