<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'
import type { HistoryEntry } from '~/stores/history.store'
import type { Plant } from '~/types/plant.types'
import type { MockLocale } from '~/services/mock/mock-locale'
import { getPlantBySlug } from '~/services/plant.service'
import { findPlantDetailBySlug } from '~/services/mock/plant-details.mock'

const props = defineProps<{ entry: HistoryEntry }>()
const emit = defineEmits<{ remove: [id: string] }>()
const { t, locale } = useI18n({ messages: { en, fa }, useScope: 'local' })
const mockLocale = computed<MockLocale>(() => locale.value === 'en' ? 'en' : 'fa')

const open = ref(false)
const loading = ref(false)
const plant = ref<Plant | null>(null)
let requested = false
let requestId = 0

const panelId = `history-panel-${props.entry.id}`
const detail = computed(() => (props.entry.slug ? findPlantDetailBySlug(props.entry.slug, mockLocale.value) : undefined))

// جزئیات گیاه فقط اولین باری که کارت باز می‌شه (یا عکس خراب می‌شه) لود می‌شه
async function ensurePlant(force = false) {
  if ((requested && !force) || !props.entry.slug) return
  requested = true
  const currentRequest = ++requestId
  loading.value = true
  try {
    const result = (await getPlantBySlug(props.entry.slug, mockLocale.value)) ?? null
    if (currentRequest === requestId) plant.value = result
  }
  finally {
    if (currentRequest === requestId) loading.value = false
  }
}

watch(mockLocale, () => {
  if (requested) void ensurePlant(true)
})

function toggle() {
  open.value = !open.value
  if (open.value) ensurePlant()
}

// عکس اسکن (blob) بعد از رفرش از بین می‌ره؛ در این حالت عکس خود گیاه جایگزین می‌شه
const imageFailed = ref(false)
async function onImageError() {
  imageFailed.value = true
  await ensurePlant()
}
const thumb = computed(() => (imageFailed.value ? (plant.value?.images[0] ?? '') : props.entry.image))

// const confidenceColor = computed(() => {
//   if (props.entry.confidence >= 0.8) return 'bg-primary-500'
//   if (props.entry.confidence >= 0.5) return 'bg-status-warning'
//   return 'bg-status-danger'
// })

const toxicLabels: Record<string, string> = {
  human: 'components.common.human',
  cat: 'components.common.cat',
  dog: 'components.common.dog',
}
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
const toxicTo = computed(() =>
  plant.value?.toxicity.toxicTo
    .map(target => {
      const key = toxicLabels[target]
      return key ? t(key) : target
    })
    .join(locale.value === 'fa' ? '، ' : ', ') ?? '',
)
function translatedCareValue(keys: Record<string, string>, value: string) {
  const key = keys[value]
  return key ? t(key) : value
}
function formatConfidenceLocalized(value: number) {
  return t('components.confidenceScore.percentage', {
    value: new Intl.NumberFormat(locale.value, { useGrouping: false }).format(Math.round(value * 100)),
  })
}
</script>

<template>
  <div class="glass-card overflow-hidden">
    <!-- هدر (همیشه دیده می‌شه) -->
    <div class="flex items-center gap-1 pe-2">
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-3 p-3 text-start"
        :aria-expanded="open"
        :aria-controls="panelId"
        @click="toggle"
      >
        <span class="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-primary-50">
          <img
            v-if="thumb"
            :src="thumb"
            :alt="entry.plantName"
            class="size-full object-cover"
            loading="lazy"
            @error="onImageError"
          >
          <Icon
            v-else
            name="lucide:leaf"
            class="absolute inset-0 m-auto size-6 text-primary-600"
          />
          <!-- ریبون درصد اطمینان روی عکس -->
<!--          <span-->
<!--            class="absolute inset-x-0 bottom-0 py-0.5 text-center text-[11px] font-bold text-white"-->
<!--            :class="confidenceColor"-->
<!--          >-->
<!--            {{ formatConfidenceLocalized(entry.confidence) }}-->
<!--          </span>-->
        </span>

        <span class="min-w-0 flex-1">
          <span class="block truncate font-bold text-ink">{{ entry.plantName }}</span>
          <span class="block truncate text-xs italic text-ink-muted">{{ entry.scientificName }}</span>
          <span class="mt-0.5 block text-xs text-ink-muted">
            {{ toJalaliDate(new Date(entry.timestamp).toISOString()) }}
          </span>
        </span>

        <Icon
          name="lucide:chevron-down"
          class="size-5 shrink-0 text-ink-muted transition-transform duration-300"
          :class="open ? 'rotate-180' : ''"
        />
      </button>

      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-status-danger/10 hover:text-status-danger"
        :aria-label="t('components.historyCard.removeFromHistory')"
        @click="emit('remove', entry.id)"
      >
        <Icon
          name="lucide:trash-2"
          class="size-4"
        />
      </button>
    </div>

    <!-- بخش بازشونده -->
    <div
      class="grid transition-[grid-template-rows] duration-300 ease-out"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <div
          :id="panelId"
          class="flex flex-col gap-4 border-t border-ink/5 p-4"
          :inert="!open"
        >
          <div>
            <span class="mb-1 block text-xs text-ink-muted">{{ t('components.common.confidence') }}</span>
            <ConfidenceScore :value="entry.confidence" />
          </div>

          <p
            v-if="!entry.slug"
            class="text-sm text-ink-muted"
          >
            {{ t('components.common.unlinkedScan') }}
            <NuxtLink
              to="/identify"
              class="text-primary-600 hover:underline"
            >
              {{ t('components.common.scanAgain') }}
            </NuxtLink>
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
            <!-- وضعیت‌ها: سمیت، حفاظت، نور، آب -->
            <div class="flex flex-wrap gap-1.5">
              <span
                v-if="plant.toxicity.isToxic"
                class="inline-flex items-center gap-1 rounded-full bg-status-danger/10 px-2 py-1 text-xs text-status-danger"
              >
                <Icon
                  name="lucide:triangle-alert"
                  class="size-3.5"
                />
                {{ t('components.common.toxicFor', { target: toxicTo }) }}
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs text-primary-700"
              >
                <Icon
                  name="lucide:shield-check"
                  class="size-3.5"
                />
                {{ t('components.common.notToxic') }}
              </span>
              <span
                v-if="detail?.conservationBadge"
                class="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-1 text-xs text-accent-700"
              >
                <Icon
                  name="lucide:leaf"
                  class="size-3.5"
                />
                {{ detail.conservationBadge }}
              </span>
              <RequirementBadge
                icon="lucide:sun"
                :label="translatedCareValue(lightKeys, plant.care.light)"
              />
              <RequirementBadge
                icon="lucide:droplets"
                :label="translatedCareValue(waterKeys, plant.care.water)"
              />
            </div>

            <!-- اطلاعات کلیدی (مبدا، زیستگاه، گستره در ایران) -->
            <div
              v-if="detail?.quickStats.length"
              class="grid gap-2 sm:grid-cols-3"
            >
              <div
                v-for="stat in detail.quickStats.slice(0, 3)"
                :key="stat.label"
                class="rounded-xl bg-ink/5 px-3 py-2"
              >
                <p class="text-xs text-ink-muted">
                  {{ stat.label }}
                </p>
                <p class="line-clamp-2 text-sm font-medium text-ink">
                  {{ stat.value }}
                </p>
              </div>
            </div>

            <NuxtLink
              :to="`/plants/${plant.slug}`"
              class="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {{ t('components.historyCard.fullPlantInfo') }}
              <Icon
                name="lucide:arrow-left"
                class="size-4"
              />
            </NuxtLink>
          </template>

          <p
            v-else
            class="text-sm text-ink-muted"
          >
            {{ t('components.common.plantNotFound') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>