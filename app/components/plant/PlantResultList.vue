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

const { t } = useI18n()
const resolved = usePlantResultOptions(() => props.variant, () => props.options)

// اگه والد (مثل PredictionCard) useCompareLink رو provide کرده باشه، چک‌باکس مقایسه نمایش داده می‌شه
const compare = inject(compareLinkKey, null)

// کلیک با موس/لمس توی خودِ composable مدیریت می‌شه (pointerdown/up)؛
// اینجا فقط کلیکی که از کیبورد میاد (Enter/Space → detail === 0) لازمه
function onHandleClick(id: string, e: MouseEvent) {
  if (e.detail === 0) compare?.toggle(id)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
        v-for="(item, index) in items"
        :key="item.id"
        class="flex items-start gap-2"
        :data-compare-id="compare ? item.id : undefined"
    >
      <div
          class="min-w-0 flex-1 rounded-[28px] transition-shadow"
          :class="compare && compare.hoverId === item.id ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-transparent' : ''"
      >
        <PlantResultCard
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

      <!-- چک‌باکس مقایسه: از اینجا خط بکش روی نتیجه‌ی دیگه -->
      <button
          v-if="compare"
          type="button"
          role="checkbox"
          :aria-checked="compare.isChecked(item.id)"
          :disabled="!item.slug"
          :data-compare-handle="item.id"
          :aria-label="t('components.plantResultList.compareHandle')"
          :title="t('components.plantResultList.compareHandle')"
          class="mt-8 flex size-6 shrink-0 cursor-grab touch-none select-none items-center justify-center rounded-full border-2 transition-colors active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
          :class="compare.isChecked(item.id)
          ? 'border-primary-500 bg-primary-500 text-white'
          : 'border-primary-500/50 text-transparent hover:border-primary-500'"
          @pointerdown="compare.start(item.id, $event)"
          @click="onHandleClick(item.id, $event)"
      >
        <Icon
            name="lucide:check"
            class="size-3.5"
        />
      </button>
    </div>
  </div>
</template>