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
    <!-- بک‌گراند اس‌وی‌جی گیاهی با جزئیات بیشتر -->
    <svg
      class="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      dir="ltr"
    >
      <defs>
        <filter id="steps-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="35" />
        </filter>
        <pattern id="steps-dots" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.8" fill="currentColor" />
        </pattern>
        <linearGradient id="steps-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.92" />
          <stop offset="40%" stop-color="currentColor" stop-opacity="0.5" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>

        <!-- برگ ساده -->
        <symbol id="steps-leaf-simple" viewBox="0 0 64 64">
          <path
            d="M32 2C17 10 6 25 6 40c0 11 9 20 26 22 17-2 26-11 26-22C58 25 47 10 32 2z"
            fill="currentColor"
          />
          <path d="M32 8v46" fill="none" stroke="currentColor" stroke-width="1.6" stroke-opacity="0.55" stroke-linecap="round" />
          <path d="M32 20c-5 3-9 8-11 13M32 32c-6 3-11 8-13 14M32 44c-5 3-9 8-10 12" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.4" stroke-linecap="round" />
          <path d="M32 20c5 3 9 8 11 13M32 32c6 3 11 8 13 14M32 44c5 3 9 8 10 12" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.4" stroke-linecap="round" />
        </symbol>

        <!-- برگ مونسترا (بریدگی‌دار) -->
        <symbol id="steps-monstera" viewBox="0 0 100 120">
          <path
            d="M50 4C30 10 14 26 10 46c-2 10 2 20 8 28c4-10 10-16 18-18c-6 6-10 14-11 23c5 2 10 1 14-2c-3 7-2 14 3 20c4 3 9 4 14 3c5 1 10 0 14-3c5-6 6-13 3-20c4 3 9 4 14 2c-1-9-5-17-11-23c8 2 14 8 18 18c6-8 10-18 8-28C86 26 70 10 50 4Z"
            fill="currentColor"
          />
          <path d="M50 12v100" fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.5" stroke-linecap="round" />
          <path d="M50 32c-8 2-15 7-19 15M50 52c-9 2-17 8-21 17M50 72c-7 2-13 8-16 15" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.35" stroke-linecap="round" />
          <path d="M50 32c8 2 15 7 19 15M50 52c9 2 17 8 21 17M50 72c7 2 13 8 16 15" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.35" stroke-linecap="round" />
          <g fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" class="text-primary-50" stroke-opacity="0.85">
            <path d="M24 50c8-2 14-8 16-16" />
            <path d="M18 68c9-2 16-8 19-17" />
            <path d="M24 86c8-1 15-7 18-15" />
            <path d="M76 50c-8-2-14-8-16-16" />
            <path d="M82 68c-9-2-16-8-19-17" />
            <path d="M76 86c-8-1-15-7-18-15" />
          </g>
        </symbol>

        <!-- فروند (برگ سرخس‌مانند) -->
        <symbol id="steps-frond" viewBox="0 0 100 200">
          <path d="M50 196C48 150 48 100 50 4" fill="none" stroke="currentColor" stroke-width="2" stroke-opacity="0.6" />
          <g fill="currentColor" opacity="0.85">
            <ellipse cx="38" cy="170" rx="12" ry="4" transform="rotate(-30 38 170)" />
            <ellipse cx="62" cy="170" rx="12" ry="4" transform="rotate(30 62 170)" />
            <ellipse cx="36" cy="150" rx="13" ry="4" transform="rotate(-35 36 150)" />
            <ellipse cx="64" cy="150" rx="13" ry="4" transform="rotate(35 64 150)" />
            <ellipse cx="34" cy="130" rx="12" ry="4" transform="rotate(-40 34 130)" />
            <ellipse cx="66" cy="130" rx="12" ry="4" transform="rotate(40 66 130)" />
            <ellipse cx="34" cy="110" rx="11" ry="3.5" transform="rotate(-45 34 110)" />
            <ellipse cx="66" cy="110" rx="11" ry="3.5" transform="rotate(45 66 110)" />
            <ellipse cx="35" cy="90" rx="9" ry="3" transform="rotate(-50 35 90)" />
            <ellipse cx="65" cy="90" rx="9" ry="3" transform="rotate(50 65 90)" />
            <ellipse cx="37" cy="72" rx="7" ry="2.5" transform="rotate(-55 37 72)" />
            <ellipse cx="63" cy="72" rx="7" ry="2.5" transform="rotate(55 63 72)" />
            <ellipse cx="40" cy="56" rx="5" ry="2" transform="rotate(-60 40 56)" />
            <ellipse cx="60" cy="56" rx="5" ry="2" transform="rotate(60 60 56)" />
            <ellipse cx="43" cy="42" rx="4" ry="1.5" transform="rotate(-65 43 42)" />
            <ellipse cx="57" cy="42" rx="4" ry="1.5" transform="rotate(65 57 42)" />
            <ellipse cx="46" cy="30" rx="3" ry="1.2" transform="rotate(-70 46 30)" />
            <ellipse cx="54" cy="30" rx="3" ry="1.2" transform="rotate(70 54 30)" />
            <ellipse cx="48" cy="20" rx="2" ry="1" transform="rotate(-75 48 20)" />
            <ellipse cx="52" cy="20" rx="2" ry="1" transform="rotate(75 52 20)" />
          </g>
        </symbol>

        <!-- جوانه -->
        <symbol id="steps-sprout" viewBox="0 0 64 64">
          <path d="M32 60V30" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          <path d="M32 34c-9-13 -24-11 -28-1 6 2 11 8 13 13 5-2 11-8 15-12z" fill="currentColor" />
          <path d="M32 34c9-13 24-11 28-1 -6 2 -11 8 -13 13 -5-2 -11-8 -15-12z" fill="currentColor" />
          <ellipse cx="32" cy="54" rx="4" ry="3" fill="currentColor" opacity="0.6" />
        </symbol>
      </defs>

      <!-- لکه‌های رنگی محو -->
      <g filter="url(#steps-soft)" class="text-primary-500 opacity-20">
        <circle cx="140" cy="720" r="240" />
        <circle cx="1060" cy="740" r="250" />
      </g>
      <g filter="url(#steps-soft)" class="text-primary-300 opacity-15">
        <circle cx="600" cy="90" r="190" />
      </g>

      <!-- الگوی نقطه‌ای ملایم -->
      <rect width="1200" height="800" fill="url(#steps-dots)" class="text-primary-900 opacity-5" />

      <!-- خطوط منحنی پایین -->
      <g class="text-primary-600 opacity-10" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M0 700 C 200 660, 320 740, 520 700 S 900 660, 1200 720" />
        <path d="M0 732 C 200 692, 320 772, 520 732 S 900 692, 1200 752" />
        <path d="M0 764 C 200 724, 320 804, 520 764 S 900 724, 1200 784" />
      </g>

      <!-- واین سمت چپ -->
      <g class="text-primary-700 opacity-10">
        <path d="M70 800 C 50 620, 130 500, 100 340" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        <g transform="translate(78,640) rotate(-28) scale(0.5)">
          <use href="#steps-leaf-simple" width="80" height="80" x="-40" y="-40" />
        </g>
        <g transform="translate(104,540) rotate(22) scale(0.45)">
          <use href="#steps-leaf-simple" width="80" height="80" x="-40" y="-40" />
        </g>
        <g transform="translate(78,430) rotate(-38) scale(0.55)">
          <use href="#steps-leaf-simple" width="80" height="80" x="-40" y="-40" />
        </g>
        <g transform="translate(106,340) rotate(16) scale(0.4)">
          <use href="#steps-leaf-simple" width="80" height="80" x="-40" y="-40" />
        </g>
      </g>

      <!-- واین سمت راست -->
      <g class="text-primary-700 opacity-10">
        <path d="M1130 800 C 1150 620, 1070 500, 1100 340" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        <g transform="translate(1122,640) rotate(28) scale(0.5)">
          <use href="#steps-leaf-simple" width="80" height="80" x="-40" y="-40" />
        </g>
        <g transform="translate(1096,540) rotate(-22) scale(0.45)">
          <use href="#steps-leaf-simple" width="80" height="80" x="-40" y="-40" />
        </g>
        <g transform="translate(1122,430) rotate(38) scale(0.55)">
          <use href="#steps-leaf-simple" width="80" height="80" x="-40" y="-40" />
        </g>
        <g transform="translate(1094,340) rotate(-16) scale(0.4)">
          <use href="#steps-leaf-simple" width="80" height="80" x="-40" y="-40" />
        </g>
      </g>

      <!-- برگ مونسترای بزرگ پایین چپ -->
      <g transform="translate(170, 650) rotate(-16) scale(2.6)" class="text-primary-800 opacity-10">
        <use href="#steps-monstera" width="120" height="144" x="-60" y="-72" />
      </g>

      <!-- برگ مونسترای بزرگ پایین راست (قرینه) -->
      <g transform="translate(1030, 665) rotate(14) scale(2.4)" class="text-primary-700 opacity-10">
        <g transform="scale(-1,1)">
          <use href="#steps-monstera" width="120" height="144" x="-60" y="-72" />
        </g>
      </g>

      <!-- جوانه‌ها -->
      <g transform="translate(330, 745) scale(1.15)" class="text-primary-600 opacity-15">
        <use href="#steps-sprout" width="80" height="80" x="-40" y="-40" />
      </g>
      <g transform="translate(870, 735) scale(1.05)" class="text-primary-600 opacity-15">
        <use href="#steps-sprout" width="80" height="80" x="-40" y="-40" />
      </g>

      <!-- فروند بالا چپ و راست -->
      <g transform="translate(95, 130) rotate(-24) scale(1.05)" class="text-primary-500 opacity-10">
        <use href="#steps-frond" width="120" height="240" x="-60" y="-120" />
      </g>
      <g transform="translate(1105, 145) rotate(24) scale(1.05)" class="text-primary-500 opacity-10">
        <g transform="scale(-1,1)">
          <use href="#steps-frond" width="120" height="240" x="-60" y="-120" />
        </g>
      </g>

      <!-- برگ‌های پراکنده کناره‌ها -->
      <g transform="translate(150, 510) rotate(-62) scale(0.9)" class="text-primary-600 opacity-10">
        <use href="#steps-leaf-simple" width="80" height="80" x="-40" y="-40" />
      </g>
      <g transform="translate(1050, 545) rotate(68) scale(0.85)" class="text-primary-600 opacity-10">
        <g transform="scale(-1,1)">
          <use href="#steps-leaf-simple" width="80" height="80" x="-40" y="-40" />
        </g>
      </g>

      <!-- محو شدن تدریجی به سمت بالا برای ترکیب بهتر با بک‌گراند -->
      <rect width="1200" height="800" fill="url(#steps-fade)" class="text-primary-50" />
    </svg>

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