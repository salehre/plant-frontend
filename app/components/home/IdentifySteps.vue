<script setup lang="ts">
const { t, locale } = useI18n()

const steps = ['upload', 'analyze', 'result', 'details'] as const

function formatNumber(value: number) {
  return new Intl.NumberFormat(locale.value, { useGrouping: false }).format(value)
}
function percent(value: number) {
  return t('components.confidenceScore.percentage', { value: formatNumber(value) })
}

// داده‌ی نمونه‌ی پیش‌نمایش‌ها (از عکس‌ها و گیاه‌های خود پروژه)
const isFa = computed(() => locale.value === 'fa')
const main = computed(() => ({
  name: isFa.value ? 'مونستِرا' : 'Monstera',
  scientific: 'Monstera deliciosa',
  image: '/images/plants/botanical-1.webp',
}))
const similar = computed(() => [
  { name: isFa.value ? 'زبان مادرشوهر' : 'Snake plant', scientific: 'Sansevieria trifasciata', image: '/images/plants/botanical-3.webp', confidence: 0.74 },
  { name: isFa.value ? 'فیکوس لیراتا' : 'Fiddle-leaf fig', scientific: 'Ficus lyrata', image: '/images/plants/botanical-4.webp', confidence: 0.61 },
])

const detailTabs = ['overview', 'care', 'healthToxicity', 'scientific'] as const
const careItems = computed(() => [
  { icon: 'lucide:sun', label: t('components.careInfoCard.light'), value: t('components.common.lightMedium') },
  { icon: 'lucide:droplets', label: t('components.careInfoCard.watering'), value: t('components.careInfoCard.everyDays', { days: formatNumber(7) }) },
  { icon: 'lucide:thermometer', label: t('components.careInfoCard.temperature'), value: t('components.careInfoCard.temperatureValue', { min: formatNumber(18), max: formatNumber(27) }) },
  { icon: 'lucide:wind', label: t('components.careInfoCard.humidity'), value: t('components.common.waterMedium') },
])
</script>

<template>
  <section class="relative overflow-hidden rounded-[19px] bg-primary-50/50 px-4 py-10 sm:px-8 sm:py-12">
    <!-- برگ‌های تزئینی دو طرف -->
    <Icon
      name="lucide:leaf"
      class="pointer-events-none absolute -bottom-10 -start-10 size-52 rotate-12 text-primary-300/30 ltr:-scale-x-100"
      aria-hidden="true"
    />
    <Icon
      name="lucide:sprout"
      class="pointer-events-none absolute -bottom-8 -end-8 size-56 -rotate-6 text-primary-300/30"
      aria-hidden="true"
    />

    <!-- یادداشت دست‌نویس -->
    <div
      class="pointer-events-none absolute end-6 top-24 hidden w-32 text-center text-xs italic leading-5 text-ink-muted xl:block"
      aria-hidden="true"
    >
      {{ t('home.steps.note') }}
      <Icon
        name="lucide:corner-right-down"
        class="mx-auto mt-1 size-5 rtl:-scale-x-100"
      />
    </div>

    <div class="relative">
      <!-- عنوان -->
      <div class="mx-auto max-w-xl text-center">
        <h2 class="text-2xl font-extrabold text-primary-800 sm:text-3xl">
          {{ t('home.steps.title') }}
        </h2>
        <p class="mt-3 text-sm leading-7 text-ink-muted sm:text-base">
          {{ t('home.steps.description') }}
        </p>
      </div>

      <!-- مراحل -->
      <div class="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="(step, index) in steps"
          :key="step"
          class="relative flex flex-col items-center text-center"
        >
          <!-- فلش بین مراحل -->
          <Icon
            v-if="index < steps.length - 1"
            name="lucide:arrow-right"
            class="absolute top-2.5 hidden size-5 text-ink-muted -end-[1.875rem] rtl:-scale-x-100 lg:block"
            aria-hidden="true"
          />

          <span class="flex size-10 items-center justify-center rounded-full bg-primary-700 text-lg font-bold text-white shadow-card">
            {{ formatNumber(index + 1) }}
          </span>
          <h3 class="mt-3 text-base font-bold text-ink">
            {{ t(`home.steps.${step}.title`) }}
          </h3>
          <p class="mt-2 min-h-[3.5rem] max-w-[16rem] text-xs leading-6 text-ink-muted">
            {{ t(`home.steps.${step}.description`) }}
          </p>

          <!-- پیش‌نمایش هر مرحله: شبیه بخش‌های واقعی پروژه -->
          <div
            class="mt-5 h-[23rem] w-full max-w-[17rem] select-none overflow-hidden text-start"
            aria-hidden="true"
          >
            <!-- ۱: صفحه‌ی تشخیص (ScanViewfinder) -->
            <div
              v-if="step === 'upload'"
              class="flex size-full flex-col overflow-hidden rounded-[22px] bg-primary-900 shadow-card"
            >
              <div class="relative flex-1 overflow-hidden">
                <img
                  :src="main.image"
                  alt=""
                  class="absolute inset-0 size-full object-cover"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-900/60" />
                <div class="absolute inset-5">
                  <span class="absolute left-0 top-0 size-8 rounded-tl-2xl border-l-[3px] border-t-[3px] border-white" />
                  <span class="absolute right-0 top-0 size-8 rounded-tr-2xl border-r-[3px] border-t-[3px] border-white" />
                  <span class="absolute bottom-0 left-0 size-8 rounded-bl-2xl border-b-[3px] border-l-[3px] border-white" />
                  <span class="absolute bottom-0 right-0 size-8 rounded-br-2xl border-b-[3px] border-r-[3px] border-white" />
                </div>
                <p class="absolute inset-x-4 bottom-2 text-center text-[11px] leading-5 text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
                  {{ t('identify.pointHint') }}
                </p>
              </div>
              <div class="flex h-[76px] items-center justify-between border-t border-white/10 px-4">
                <span class="flex w-14 flex-col items-center gap-1 text-[9px] text-white/90">
                  <span class="flex size-8 items-center justify-center rounded-lg bg-white/15">
                    <Icon
                      name="lucide:image"
                      class="size-4"
                    />
                  </span>
                  {{ t('identify.gallery') }}
                </span>
                <span class="flex size-12 items-center justify-center rounded-full border-[3px] border-white bg-white/90 text-primary-800 ring-4 ring-white/25">
                  <Icon
                    name="lucide:camera"
                    class="size-5"
                  />
                </span>
                <span class="flex w-14 flex-col items-center gap-1 text-[9px] text-white/90">
                  <span class="flex size-8 items-center justify-center rounded-lg bg-white/15">
                    <Icon
                      name="lucide:switch-camera"
                      class="size-4"
                    />
                  </span>
                  <span class="truncate">{{ t('identify.switchCamera') }}</span>
                </span>
              </div>
            </div>

            <!-- ۲: در حال تحلیل (همون ویوفایندر + لایه‌ی اسکن) -->
            <div
              v-else-if="step === 'analyze'"
              class="flex size-full flex-col overflow-hidden rounded-[22px] bg-primary-900 shadow-card"
            >
              <div class="relative flex-1 overflow-hidden">
                <img
                  :src="main.image"
                  alt=""
                  class="absolute inset-0 size-full object-cover"
                  loading="lazy"
                >
                <div class="absolute inset-5">
                  <span class="absolute left-0 top-0 size-8 rounded-tl-2xl border-l-[3px] border-t-[3px] border-white" />
                  <span class="absolute right-0 top-0 size-8 rounded-tr-2xl border-r-[3px] border-t-[3px] border-white" />
                  <span class="absolute bottom-0 left-0 size-8 rounded-bl-2xl border-b-[3px] border-l-[3px] border-white" />
                  <span class="absolute bottom-0 right-0 size-8 rounded-br-2xl border-b-[3px] border-r-[3px] border-white" />
                </div>
                <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary-900/55 text-white">
                  <span class="steps-scan-line absolute inset-x-5 h-0.5 rounded-full bg-primary-300 shadow-[0_0_16px_4px_rgba(138,197,163,0.8)]" />
                  <Icon
                    name="svg-spinners:180-ring"
                    class="size-8"
                  />
                  <span class="text-xs font-medium">{{ t('identify.analyzing') }}</span>
                </div>
              </div>
              <div class="flex h-[76px] items-center justify-center border-t border-white/10 px-6">
                <div class="h-2 w-full overflow-hidden rounded-full bg-white/15">
                  <div class="steps-progress h-full rounded-full bg-primary-300" />
                </div>
              </div>
            </div>

            <!-- ۳: نتیجه‌ی اسکن (PredictionCard + PlantResultCard) -->
            <div
              v-else-if="step === 'result'"
              class="flex size-full flex-col gap-2.5 rounded-[22px] border border-ink/5 bg-surface p-3 shadow-card"
            >
              <div class="flex items-center gap-1.5 rounded-xl bg-primary-50 px-3 py-2 text-primary-700">
                <Icon
                  name="lucide:sparkles"
                  class="size-4 shrink-0"
                />
                <span class="truncate text-[11px] font-medium">{{ t('components.predictionCard.identified') }}</span>
              </div>

              <p class="flex items-start gap-1 text-[9px] leading-4 text-ink-muted">
                <Icon
                  name="lucide:git-compare"
                  class="mt-0.5 size-3 shrink-0"
                />
                <span class="line-clamp-2">{{ t('components.predictionCard.compareHint') }}</span>
              </p>

              <!-- نتیجه‌ی اصلی -->
              <div class="rounded-xl border border-ink/5 bg-surface shadow-card">
                <div class="flex items-center gap-2 p-2">
                  <img
                    :src="main.image"
                    alt=""
                    class="size-12 shrink-0 rounded-xl object-cover"
                    loading="lazy"
                  >
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-xs font-bold text-ink">{{ main.name }}</span>
                    <span
                      class="block truncate text-[10px] italic text-ink-muted"
                      dir="ltr"
                    >{{ main.scientific }}</span>
                  </span>
                  <span class="flex size-6 shrink-0 items-center justify-center rounded-md border border-primary-500/50 text-primary-600">
                    <Icon
                      name="lucide:check"
                      class="size-3.5"
                    />
                  </span>
                  <Icon
                    name="lucide:chevron-down"
                    class="size-4 shrink-0 text-ink-muted"
                  />
                </div>
                <div class="px-2.5 pb-2.5">
                  <span class="mb-1 block text-[9px] text-ink-muted">{{ t('components.common.confidence') }}</span>
                  <div class="flex items-center gap-2">
                    <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                      <div class="h-full w-[97%] rounded-full bg-primary-500" />
                    </div>
                    <span class="text-[10px] font-medium text-ink-muted">{{ percent(97) }}</span>
                  </div>
                </div>
              </div>

              <!-- گونه‌های مشابه -->
              <p class="text-[10px] font-medium text-ink-muted">
                {{ t('components.predictionCard.similarSpecies') }}
              </p>
              <div
                v-for="item in similar"
                :key="item.scientific"
                class="flex items-center gap-2 rounded-xl border border-ink/5 bg-surface p-2 shadow-card"
              >
                <img
                  :src="item.image"
                  alt=""
                  class="size-9 shrink-0 rounded-lg object-cover"
                  loading="lazy"
                >
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-[11px] font-bold text-ink">{{ item.name }}</span>
                  <span class="flex items-center gap-1.5">
                    <span class="h-1 w-10 overflow-hidden rounded-full bg-ink/10">
                      <span
                        class="block h-full rounded-full"
                        :class="item.confidence >= 0.7 ? 'bg-primary-500' : 'bg-status-warning'"
                        :style="{ width: Math.round(item.confidence * 100) + '%' }"
                      />
                    </span>
                    <span class="text-[9px] text-ink-muted">{{ percent(Math.round(item.confidence * 100)) }}</span>
                  </span>
                </span>
                <Icon
                  name="lucide:chevron-down"
                  class="size-4 shrink-0 text-ink-muted"
                />
              </div>
            </div>

            <!-- ۴: صفحه‌ی جزئیات گیاه -->
            <div
              v-else
              class="flex size-full flex-col gap-2.5 rounded-[22px] border border-ink/5 bg-surface p-3 shadow-card"
            >
              <div class="relative h-28 shrink-0 overflow-hidden rounded-2xl">
                <img
                  :src="main.image"
                  alt=""
                  class="size-full object-cover"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-primary-900/75 via-primary-900/10 to-transparent" />
                <span class="absolute end-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-primary-700">
                  <Icon
                    name="lucide:heart"
                    class="size-3.5"
                  />
                </span>
                <div class="absolute inset-x-3 bottom-2 text-white">
                  <p class="truncate text-sm font-bold">
                    {{ main.name }}
                  </p>
                  <p
                    class="truncate text-[10px] italic text-white/80"
                    dir="ltr"
                  >
                    {{ main.scientific }}
                  </p>
                </div>
              </div>

              <!-- تب‌ها -->
              <div class="grid grid-cols-4 gap-0.5 rounded-xl bg-primary-50 p-0.5 text-center">
                <span
                  v-for="(tab, i) in detailTabs"
                  :key="tab"
                  class="truncate rounded-lg px-0.5 py-1.5 text-[8.5px] font-semibold"
                  :class="i === 0 ? 'bg-surface text-primary-700 shadow-sm' : 'text-ink-muted'"
                >
                  {{ t(`plantDetail.tabs.${tab}`) }}
                </span>
              </div>

              <!-- کارت‌های نگهداری -->
              <div class="grid grid-cols-2 gap-1.5">
                <div
                  v-for="item in careItems"
                  :key="item.label"
                  class="flex flex-col gap-0.5 rounded-lg bg-primary-50/70 p-2"
                >
                  <span class="flex items-center gap-1 text-primary-600">
                    <Icon
                      :name="item.icon"
                      class="size-3.5 shrink-0"
                    />
                    <span class="truncate text-[9px]">{{ item.label }}</span>
                  </span>
                  <span class="truncate text-[10px] font-bold text-ink">{{ item.value }}</span>
                </div>
              </div>

              <div class="mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-primary-800 py-2.5 text-xs font-bold text-white">
                <Icon
                  name="lucide:plus"
                  class="size-4"
                />
                {{ t('identify.addToGarden') }}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.steps-scan-line {
  animation: steps-scan 2.4s ease-in-out infinite;
}
.steps-progress {
  width: 0;
  animation: steps-progress 3.2s ease-in-out infinite;
}
@keyframes steps-scan {
  0%, 100% { top: 14%; }
  50% { top: 82%; }
}
@keyframes steps-progress {
  0% { width: 8%; }
  70% { width: 90%; }
  100% { width: 96%; }
}
@media (prefers-reduced-motion: reduce) {
  .steps-scan-line, .steps-progress { animation: none; }
  .steps-progress { width: 66%; }
}
</style>