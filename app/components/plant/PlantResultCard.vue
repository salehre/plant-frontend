<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'
import type { MockLocale } from '~/services/mock/mock-locale'
import type { Plant } from '~/types/plant.types'

/**
 * کارت یکپارچه‌ی نمایش یک گیاه در لیست‌ها - هم‌شکل در:
 *  - تاریخچه‌ی اسکن‌ها   (confidence + meta=تاریخ + removable)
 *  - علاقه‌مندی‌ها        (plant آماده، بدون confidence)
 *  - نتیجه‌ی اسکن        (نتیجه‌ی اصلی + گونه‌های مشابه، با دکمه‌ی تأیید)
 * هدر همیشه دیده می‌شه؛ با کلیک، جزئیات گیاه باز می‌شه.
 */
const props = withDefaults(
    defineProps<{
      name: string
      scientificName: string
      image?: string
      slug?: string
      /** عدد بین ۰ تا ۱؛ اگه نباشه ریبون و نوار اطمینان نمایش داده نمی‌شه */
      confidence?: number
      /** false = ریبون و نوار اطمینان رو مخفی می‌کنه، حتی اگه confidence داده شده باشه */
      showConfidence?: boolean
      /** false = دکمه‌ی قلب علاقه‌مندی مخفی می‌شه */
      showWishlistButton?: boolean
      /** خط سوم هدر، مثلاً تاریخ اسکن یا دسته‌ی گیاه */
      meta?: string
      /** اگه خود Plant از قبل موجوده بدش تا دوباره fetch نشه */
      plant?: Plant | null
      /** نمایش دکمه‌ی حذف (برای تاریخچه) */
      removable?: boolean
      /** نمایش دکمه‌ی تأیید نتیجه (برای صفحه‌ی Identify) */
      confirmable?: boolean
      /** آیا کاربر این نتیجه رو تأیید کرده؟ */
      confirmed?: boolean
      defaultOpen?: boolean
    }>(),
    {
      image: '',
      slug: undefined,
      confidence: undefined,
      showConfidence: true,
      showWishlistButton: true,
      meta: '',
      plant: null,
      removable: false,
      confirmable: false,
      confirmed: false,
      defaultOpen: false,
    },
)

const emit = defineEmits<{ remove: [], confirm: [] }>()
const { t, locale } = useI18n({ messages: { en, fa }, useScope: 'local' })
const mockLocale = computed<MockLocale>(() => locale.value === 'en' ? 'en' : 'fa')

const panelId = `plant-result-${useId()}`
const open = ref(props.defaultOpen)
const { plant: loadedPlant, detail, loading, load } = usePlantPreview(() => props.slug, props.plant, mockLocale)
if (open.value) load()

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
function translatedCareValue(keys: Record<string, string>, value: string) {
  const key = keys[value]
  return key ? t(key) : value
}

function toggle() {
  open.value = !open.value
  if (open.value) load()
}

// عکس اسکن (blob) بعد از رفرش از بین می‌ره؛ در این حالت عکس خود گیاه جایگزین می‌شه
const imageFailed = ref(false)
async function onImageError() {
  imageFailed.value = true
  await load()
}
const thumb = computed(() => (imageFailed.value ? (loadedPlant.value?.images[0] ?? '') : props.image))

const hasConfidence = computed(() => props.showConfidence && typeof props.confidence === 'number')
// const confidenceColor = computed(() => {
//   const c = props.confidence ?? 0
//   if (c >= 0.8) return 'bg-primary-500'
//   if (c >= 0.5) return 'bg-status-warning'
//   return 'bg-status-danger'
// })

const toxicLabels: Record<string, string> = {
  human: 'components.common.human',
  cat: 'components.common.cat',
  dog: 'components.common.dog',
}
const toxicTo = computed(() =>
    loadedPlant.value?.toxicity.toxicTo
        .map(target => {
          const key = toxicLabels[target]
          return key ? t(key) : target
        })
        .join(locale.value === 'fa' ? '، ' : ', ') ?? '',
)
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
              :alt="name"
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
<!--              v-if="hasConfidence"-->
<!--              class="absolute inset-x-0 bottom-0 py-0.5 text-center text-[11px] font-bold text-white"-->
<!--              :class="confidenceColor"-->
<!--          >-->
<!--            {{ formatConfidenceLocalized(confidence!) }}-->
<!--          </span>-->
        </span>

        <span class="min-w-0 flex-1">
          <span class="block truncate font-bold text-ink">{{ name }}</span>
          <span class="block truncate text-xs italic text-ink-muted">{{ scientificName }}</span>
          <span
              v-if="meta"
              class="mt-0.5 block truncate text-xs text-ink-muted"
          >
            {{ meta }}
          </span>
        </span>

        <Icon
            name="lucide:chevron-down"
            class="size-5 shrink-0 text-ink-muted transition-transform duration-300"
            :class="open ? 'rotate-180' : ''"
        />
      </button>

      <button
          v-if="confirmable"
          type="button"
          class="flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors"
          :class="confirmed
          ? 'border-primary-500 bg-primary-500 text-white'
          : 'border-primary-500/50 text-primary-600 hover:bg-primary-500 hover:text-white dark:text-primary-200'"
          :aria-pressed="confirmed"
          :aria-label="confirmed ? t('components.plantResultCard.undoConfirm') : t('components.plantResultCard.confirm')"
          :title="confirmed ? t('components.plantResultCard.undoConfirm') : t('components.plantResultCard.confirm')"
          @click="emit('confirm')"
      >
        <Icon
            name="lucide:check"
            class="size-4"
        />
      </button>
      <WishlistButton
          v-if="slug && showWishlistButton"
          :slug="slug"
          compact
      />
      <button
          v-if="removable"
          type="button"
          class="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-status-danger/10 hover:text-status-danger"
          :aria-label="t('components.plantResultCard.removeFromHistory')"
          @click="emit('remove')"
      >
        <Icon
            name="lucide:trash-2"
            class="size-4"
        />
      </button>
    </div>
    <div v-if="hasConfidence" class="px-4 pb-3">
      <span class="mb-1 block text-xs text-ink-muted">{{ t('components.common.confidence') }}</span>
      <ConfidenceScore :value="confidence!" />
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
            :inert="open ? undefined : true"
        >

          <p
              v-if="!slug"
              class="text-sm text-ink-muted"
          >
            {{ t('components.common.unlinkedPlant') }}
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

          <template v-else-if="loadedPlant">
            <!-- وضعیت‌ها: سمیت، حفاظت، نور، آب -->
            <div class="flex flex-wrap gap-1.5">
              <span
                  v-if="loadedPlant.toxicity.isToxic"
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
                  :label="translatedCareValue(lightKeys, loadedPlant.care.light)"
              />
              <RequirementBadge
                  icon="lucide:droplets"
                  :label="translatedCareValue(waterKeys, loadedPlant.care.water)"
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
                :to="`/plants/${loadedPlant.slug}`"
                class="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {{ t('components.common.fullPlantInfo') }}
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