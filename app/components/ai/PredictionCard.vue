<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'
import type { IdentifyResult } from '~/types/identify.types'
import type { PlantResultItem } from '~/composables/usePlantResults'

const props = defineProps<{ result: IdentifyResult }>()
const { t } = useI18n({ messages: { en, fa }, useScope: 'local' })
const identifyStore = useIdentifyStore()
const uiStore = useUiStore()

const mainItems = computed(() => [fromIdentifyResult(props.result)])
const similarItems = computed(() => props.result.similarSpecies.map(fromSimilarSpecies))

function isConfirmed(item: PlantResultItem) {
  return identifyStore.isConfirmed(item.scientificName)
}

// تأیید یه نتیجه = قبول کردنش؛ همون لحظه تو تاریخچه‌ی اسکن‌ها ثبت می‌شه
function onConfirm(item: PlantResultItem) {
  const confirmed = identifyStore.toggleConfirm({
    plantName: item.name,
    scientificName: item.scientificName,
    confidence: item.confidence ?? 0,
    image: item.image ?? '',
    slug: item.slug,
  })
  uiStore.showToast(
      t(confirmed ? 'components.predictionCard.confirmedToast' : 'components.predictionCard.unconfirmedToast'),
      confirmed ? 'success' : 'info',
  )
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="glass-card flex items-center gap-2 bg-primary-50 px-5 py-3 text-primary-700">
      <Icon
          name="lucide:sparkles"
          class="size-5"
      />
      <span class="text-sm font-medium">{{ t('components.predictionCard.identified') }}</span>
    </div>

    <!-- نتیجه‌ی اصلی: هم‌شکل کارت‌های تاریخچه و علاقه‌مندی‌ها، ولی از اول بازه -->
    <PlantResultList
        :items="mainItems"
        variant="identify"
        :is-confirmed="isConfirmed"
        @confirm="onConfirm"
    />

    <section v-if="props.result.similarSpecies.length">
      <p class="mb-2 text-xs font-medium text-ink-muted">
        {{ t('components.predictionCard.similarSpecies') }}
      </p>
      <PlantResultList
          :items="similarItems"
          variant="identify"
          :options="{ defaultOpenFirst: false }"
          :is-confirmed="isConfirmed"
          @confirm="onConfirm"
      />
    </section>
  </div>
</template>