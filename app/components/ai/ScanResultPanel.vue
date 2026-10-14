<script setup lang="ts">
import type { IdentifyResult } from '~/types/identify.types'
import type { MockLocale } from '~/services/mock/mock-locale'

interface Candidate {
  id: string
  name: string
  scientificName: string
  confidence: number
  image: string
  slug?: string
}

const props = defineProps<{ result: IdentifyResult }>()
const { t, locale } = useI18n()
const identifyStore = useIdentifyStore()
const userPlantsStore = useUserPlantsStore()
const uiStore = useUiStore()
const mockLocale = computed<MockLocale>(() => locale.value === 'en' ? 'en' : 'fa')

// نتیجه‌ی اصلی + گونه‌های مشابه، به‌ترتیب اطمینان
const candidates = computed<Candidate[]>(() => [
  {
    id: props.result.scientificName,
    name: props.result.plantName,
    scientificName: props.result.scientificName,
    confidence: props.result.confidence,
    image: props.result.image,
    slug: props.result.slug,
  },
  ...props.result.similarSpecies.map(s => ({
    id: s.scientificName,
    name: s.name,
    scientificName: s.scientificName,
    confidence: s.confidence,
    image: s.image ?? '',
    slug: s.slug,
  })),
])

const tab = ref<'overview' | 'similar'>('overview')
const selectedId = ref(props.result.scientificName)
const added = ref(false)
const selected = computed(() => candidates.value.find(c => c.id === selectedId.value) ?? candidates.value[0]!)

// اسکن جدید = نتیجه‌ی جدید
watch(() => props.result, () => {
  selectedId.value = props.result.scientificName
  tab.value = 'overview'
  added.value = false
})

// اطلاعات گیاهِ انتخاب‌شده (برای تب نمای کلی)
const { plant, detail, loading, load } = usePlantPreview(() => selected.value.slug, null, mockLocale)
watch(() => selected.value.slug, () => load(true), { immediate: true })

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
const toxicLabels: Record<string, string> = {
  human: 'components.common.human',
  cat: 'components.common.cat',
  dog: 'components.common.dog',
}
function translated(keys: Record<string, string>, value: string) {
  const key = keys[value]
  return key ? t(key) : value
}
const toxicTo = computed(() =>
  plant.value?.toxicity.toxicTo
    .map(target => translated(toxicLabels, target))
    .join(locale.value === 'fa' ? '، ' : ', ') ?? '',
)

function formatPercent(value: number) {
  return t('components.confidenceScore.percentage', {
    value: new Intl.NumberFormat(locale.value, { useGrouping: false }).format(Math.round(value * 100)),
  })
}
function formatCount(value: number) {
  return new Intl.NumberFormat(locale.value, { useGrouping: false }).format(value)
}

// عدد خامِ درصد (0 تا 100) - برای محاسبات SVG، همیشه باید رقم انگلیسی باشه
function rawPercent(value: number) {
  return Math.round(value * 100)
}

// متن نمایشیِ درصد (لوکالایزشده) - فقط برای نمایش به کاربر
function displayPercent(value: number) {
  return new Intl.NumberFormat(locale.value, { useGrouping: false }).format(rawPercent(value))
}

const confidenceRaw = computed(() => rawPercent(selected.value.confidence))
const confidenceDisplay = computed(() => displayPercent(selected.value.confidence))

function isConfirmed(c: Candidate) {
  return identifyStore.isConfirmed(c.scientificName)
}

// تأیید یه نتیجه = قبول کردنش؛ همون لحظه تو تاریخچه‌ی اسکن‌ها ثبت می‌شه
function onConfirm(c: Candidate) {
  const confirmed = identifyStore.toggleConfirm({
    plantName: c.name,
    scientificName: c.scientificName,
    confidence: c.confidence,
    image: c.image,
    slug: c.slug,
  })
  uiStore.showToast(
    t(confirmed ? 'components.predictionCard.confirmedToast' : 'components.predictionCard.unconfirmedToast'),
    confirmed ? 'success' : 'info',
  )
}

function select(c: Candidate) {
  selectedId.value = c.id
  tab.value = 'overview'
}

function compareUrl(c: Candidate) {
  return selected.value.slug && c.slug ? `/compare/${selected.value.slug}/${c.slug}?from=identify` : ''
}

function addToGarden() {
  const c = selected.value
  userPlantsStore.addPlant({
    plantSlug: c.slug ?? '',
    nickname: c.name,
    // عکس اسکن (blob) بعد از رفرش از بین می‌ره؛ پس عکس خود گیاه ذخیره می‌شه
    photo: c.image || '/images/plants/botanical-1.webp',
    acquiredAt: new Date().toISOString().slice(0, 10),
    location: t('pages.myPlants.home'),
    healthStatus: 'healthy',
    lastWateredAt: null,
    nextWateringAt: null,
  })
  added.value = true
  uiStore.showToast(t('pages.myPlants.addedToast', { name: c.name }))
}
</script>

<template>
  <div class="glass-card flex flex-col gap-5 p-4 sm:p-5">
    <!-- هدر نتیجه‌ی انتخاب‌شده -->
    <div class="flex items-center gap-3">
      <span class="relative size-16 shrink-0 overflow-hidden rounded-xl bg-primary-50">
        <Icon
          name="lucide:leaf"
          class="absolute inset-0 m-auto size-6 text-primary-500"
        />
        <img
          v-if="selected.image"
          :src="selected.image"
          :alt="selected.name"
          class="relative size-full object-cover"
        >
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="truncate text-lg font-bold text-ink">
          {{ selected.name }}
        </h2>
        <p class="truncate text-sm italic text-ink-muted">
          {{ selected.scientificName }}
        </p>
      </div>

      <!-- دایره‌ی درصد اطمینان -->
      <div class="relative flex size-14 shrink-0 items-center justify-center">
        <svg
          viewBox="0 0 36 36"
          class="size-14 -rotate-90"
        >
          <path
            class="stroke-primary-100"
            stroke-width="3"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="stroke-primary-600 transition-[stroke-dasharray] duration-500 ease-out"
            stroke-width="3"
            stroke-linecap="round"
            fill="none"
            :stroke-dasharray="`${confidenceRaw}, 100`"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span class="absolute text-[11px] font-bold text-primary-700">
          {{ confidenceDisplay }}٪
        </span>
      </div>
    </div>

    <!-- تب‌ها -->
    <div class="flex gap-2 overflow-x-auto">
      <button
        type="button"
        class="chip"
        :class="{ 'chip--active': tab === 'overview' }"
        @click="tab = 'overview'"
      >
        {{ $t('identify.overview') }}
      </button>
      <button
        type="button"
        class="chip"
        :class="{ 'chip--active': tab === 'similar' }"
        @click="tab = 'similar'"
      >
        {{ $t('identify.similarTab') }} ({{ formatCount(candidates.length) }})
      </button>
    </div>

    <!-- تب نمای کلی -->
    <div
      v-if="tab === 'overview'"
      class="flex flex-col gap-4"
    >
      <div>
        <span class="mb-1 block text-xs text-ink-muted">{{ $t('components.common.confidence') }}</span>
        <ConfidenceScore :value="selected.confidence" />
      </div>

      <p
        v-if="!selected.slug"
        class="text-sm text-ink-muted"
      >
        {{ $t('components.common.unlinkedPlant') }}
      </p>
      <div
        v-else-if="loading"
        class="flex flex-col gap-2"
      >
        <AppSkeleton
          height="1.5rem"
          width="70%"
        />
        <AppSkeleton height="3rem" />
      </div>
      <template v-else-if="plant">
        <div class="flex flex-wrap gap-1.5">
          <span
            v-if="plant.toxicity.isToxic"
            class="inline-flex items-center gap-1 rounded-lg bg-status-danger/10 px-2 py-1 text-xs text-status-danger"
          >
            <Icon
              name="lucide:triangle-alert"
              class="size-3.5"
            />
            {{ $t('components.common.toxicFor', { target: toxicTo }) }}
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-2 py-1 text-xs text-primary-700"
          >
            <Icon
              name="lucide:shield-check"
              class="size-3.5"
            />
            {{ $t('components.common.notToxic') }}
          </span>
          <span
            v-if="detail?.conservationBadge"
            class="inline-flex items-center gap-1 rounded-lg bg-accent-50 px-2 py-1 text-xs text-accent-700"
          >
            <Icon
              name="lucide:leaf"
              class="size-3.5"
            />
            {{ detail.conservationBadge }}
          </span>
          <RequirementBadge
            icon="lucide:sun"
            :label="translated(lightKeys, plant.care.light)"
          />
          <RequirementBadge
            icon="lucide:droplets"
            :label="translated(waterKeys, plant.care.water)"
          />
        </div>

        <div
          v-if="detail?.quickStats.length"
          class="grid gap-2 sm:grid-cols-3"
        >
          <div
            v-for="stat in detail.quickStats.slice(0, 3)"
            :key="stat.label"
            class="rounded-xl bg-primary-50/70 px-3 py-2"
          >
            <p class="text-xs text-ink-muted">
              {{ stat.label }}
            </p>
            <p class="line-clamp-2 text-sm font-medium text-ink">
              {{ stat.value }}
            </p>
          </div>
        </div>
      </template>
      <p
        v-else
        class="text-sm text-ink-muted"
      >
        {{ $t('components.common.plantNotFound') }}
      </p>

      <button
        type="button"
        class="inline-flex w-fit items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors"
        :class="isConfirmed(selected)
          ? 'border-primary-600 bg-primary-600 text-white'
          : 'border-primary-500/40 text-primary-700 hover:bg-primary-50'"
        :aria-pressed="isConfirmed(selected)"
        :title="isConfirmed(selected) ? $t('components.plantResultCard.undoConfirm') : $t('components.plantResultCard.confirm')"
        @click="onConfirm(selected)"
      >
        <Icon
          name="lucide:check"
          class="size-4"
        />
        {{ isConfirmed(selected) ? $t('identify.confirmedResult') : $t('identify.confirmResult') }}
      </button>
    </div>

    <!-- تب گونه‌های مشابه -->
    <ol
      v-else
      class="flex flex-col gap-2"
    >
      <li
        v-for="(c, index) in candidates"
        :key="c.id"
        class="flex items-center gap-2 rounded-xl border p-2 transition-colors"
        :class="c.id === selectedId ? 'border-primary-500/50 bg-primary-50/60' : 'border-ink/5'"
      >
        <button
          type="button"
          class="flex min-w-0 flex-1 items-center gap-3 text-start"
          @click="select(c)"
        >
          <span class="w-5 shrink-0 text-center text-sm font-bold text-ink-muted">{{ formatCount(index + 1) }}</span>
          <span class="relative size-14 shrink-0 overflow-hidden rounded-xl bg-primary-50">
            <Icon
              name="lucide:leaf"
              class="absolute inset-0 m-auto size-5 text-primary-500"
            />
            <img
              v-if="c.image"
              :src="c.image"
              :alt="c.name"
              class="relative size-full object-cover"
              loading="lazy"
            >
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-bold text-ink">{{ c.name }}</span>
            <span class="block truncate text-xs italic text-ink-muted">{{ c.scientificName }}</span>
          </span>

          <!-- دایره‌ی درصد اطمینان (سایز کوچک‌تر برای لیست) -->
          <span class="relative flex size-10 shrink-0 items-center justify-center">
            <svg
              viewBox="0 0 36 36"
              class="size-10 -rotate-90"
            >
              <path
                class="stroke-primary-100"
                stroke-width="4"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="stroke-primary-600"
                stroke-width="4"
                stroke-linecap="round"
                fill="none"
                :stroke-dasharray="`${rawPercent(c.confidence)}, 100`"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span class="absolute text-[9px] font-bold text-primary-700">
              {{ displayPercent(c.confidence) }}٪
            </span>
          </span>
        </button>

        <NuxtLink
          v-if="c.id !== selectedId && compareUrl(c)"
          :to="compareUrl(c)"
          class="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
          :aria-label="$t('components.predictionCard.compareLink')"
          :title="$t('components.predictionCard.compareLink')"
        >
          <Icon
            name="lucide:git-compare"
            class="size-4"
          />
        </NuxtLink>
        <button
          type="button"
          class="flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors"
          :class="isConfirmed(c)
            ? 'border-primary-600 bg-primary-600 text-white'
            : 'border-primary-500/40 text-primary-700 hover:bg-primary-50'"
          :aria-pressed="isConfirmed(c)"
          :title="isConfirmed(c) ? $t('components.plantResultCard.undoConfirm') : $t('components.plantResultCard.confirm')"
          :aria-label="isConfirmed(c) ? $t('components.plantResultCard.undoConfirm') : $t('components.plantResultCard.confirm')"
          @click="onConfirm(c)"
        >
          <Icon
            name="lucide:check"
            class="size-4"
          />
        </button>
      </li>
    </ol>

    <!-- اکشن‌ها -->
    <div class="grid grid-cols-2 gap-3">
      <NuxtLink
        v-if="selected.slug"
        :to="`/plants/${selected.slug}`"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-600 px-4 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50"
      >
        {{ $t('identify.viewDetails') }}
      </NuxtLink>
      <span
        v-else
        class="inline-flex items-center justify-center rounded-xl border border-ink/10 px-4 py-2.5 text-sm text-ink-muted"
      >
        {{ $t('identify.viewDetails') }}
      </span>
      <AppButton
        variant="primary"
        :disabled="added"
        @click="addToGarden"
      >
        <Icon
          :name="added ? 'lucide:check' : 'lucide:plus'"
          class="size-4"
        />
        {{ $t('identify.addToGarden') }}
      </AppButton>
    </div>
  </div>
</template>