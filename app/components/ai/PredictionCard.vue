<script setup lang="ts">
import type { IdentifyResult } from '~/types/identify.types'
import type { PlantResultItem } from '~/composables/usePlantResults'

const props = defineProps<{ result: IdentifyResult }>()
const { t } = useI18n()
const identifyStore = useIdentifyStore()
const uiStore = useUiStore()

const mainItems = computed(() => [fromIdentifyResult(props.result)])
const similarItems = computed(() => props.result.similarSpecies.map(fromSimilarSpecies))

// ---------- مقایسه‌ی دو نتیجه با کشیدن خط بین چک‌باکس‌ها
const resultsRef = ref<HTMLElement | null>(null)
const slugById = computed(() =>
    new Map([...mainItems.value, ...similarItems.value].map(item => [item.id, item.slug])),
)
const compare = useCompareLink(resultsRef, id => slugById.value.get(id))
provide(compareLinkKey, compare)

// اسکن جدید = نتیجه‌های جدید؛ خط قبلی دیگه معنی نداره
watch(() => props.result, () => compare.clear())

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

    <p
        v-if="props.result.similarSpecies.length"
        class="flex items-center gap-1.5 text-xs text-ink-muted"
    >
      <Icon
          name="lucide:git-compare"
          class="size-4 shrink-0"
      />
      {{ t('components.predictionCard.compareHint') }}
    </p>

    <!-- ظرف نتایج: خط مقایسه و آیکنش نسبت به همین بلاک رسم می‌شن -->
    <div
        ref="resultsRef"
        class="relative flex flex-col gap-4"
    >
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

      <svg
          class="pointer-events-none absolute inset-0 size-full overflow-visible text-primary-500"
          aria-hidden="true"
      >
        <path
            v-if="compare.line"
            :d="compare.line.d"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
        />
        <path
            v-if="compare.dragLine"
            :d="compare.dragLine"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-dasharray="6 6"
            opacity="0.7"
        />
      </svg>

      <!-- آیکن مقایسه، وسط خط -->
      <NuxtLink
          v-if="compare.line && compare.compareUrl"
          :to="compare.compareUrl"
          class="absolute z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform hover:scale-110"
          :style="{ left: `${compare.line.mid.x}px`, top: `${compare.line.mid.y}px` }"
          :aria-label="t('components.predictionCard.compareLink')"
          :title="t('components.predictionCard.compareLink')"
      >
        <Icon
            name="lucide:git-compare"
            class="size-4"
        />
      </NuxtLink>
    </div>
  </div>
</template>