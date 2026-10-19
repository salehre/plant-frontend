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
  { name: isFa.value ? 'زبان مادرشوهر' : 'Snake plant', scientific: 'Sansevieria trifasciata', image: '/images/plants/botanical-3.jpg', confidence: 0.74 },
  { name: isFa.value ? 'فیکوس لیراتا' : 'Fiddle-leaf fig', scientific: 'Ficus lyrata', image: '/images/plants/botanical-4.jpg', confidence: 0.61 },
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
    <filter id="steps-soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="40" />
    </filter>
    <filter id="steps-blur-back" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="2.2" />
    </filter>

    <!-- رنگ روی خود pattern ست می‌شود تا به دایره‌ها ارث برسد -->
    <pattern id="steps-dots" width="28" height="28" patternUnits="userSpaceOnUse" class="text-primary-900">
      <circle cx="2" cy="2" r="1.4" fill="currentColor" />
    </pattern>

    <!-- فید به سمت بالا (با mask، نه گرادیانت currentColor) -->
    <linearGradient id="steps-fade-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.2" />
      <stop offset="0.45" stop-color="#fff" stop-opacity="0.75" />
      <stop offset="1" stop-color="#fff" />
    </linearGradient>
    <mask id="steps-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="800">
      <rect width="1200" height="800" fill="url(#steps-fade-g)" />
    </mask>

    <!-- ماسک برگ ساده: رگبرگ‌ها حک می‌شوند -->
    <mask id="steps-leaf-m" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
      <rect width="64" height="64" fill="#fff" />
      <g fill="none" stroke="#000" stroke-linecap="round">
        <path d="M32 10V56" stroke-opacity="0.5" stroke-width="1.5" />
        <path d="M32 22c-5 2-9 6-11 11M32 33c-6 2-10 7-12 12M32 44c-4 2-8 5-9 9" stroke-opacity="0.35" stroke-width="1" />
        <path d="M32 22c5 2 9 6 11 11M32 33c6 2 10 7 12 12M32 44c4 2 8 5 9 9" stroke-opacity="0.35" stroke-width="1" />
      </g>
    </mask>
    <symbol id="steps-leaf" viewBox="0 0 64 64">
      <path
        mask="url(#steps-leaf-m)"
        d="M32 2C18 9 7 24 7 40c0 10 8 18 25 20 17-2 25-10 25-20C57 24 46 9 32 2z"
        fill="currentColor"
      />
      <path d="M32 58c0 3-1 5-3 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </symbol>

    <!-- برگ مونسترا: بریدگی‌ها و سوراخ‌ها با mask واقعی -->
    <mask id="steps-monstera-m" maskUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="140">
      <rect x="-10" y="-10" width="120" height="140" fill="#fff" />
      <!-- بریدگی‌ها -->
      <g fill="none" stroke="#000" stroke-width="5" stroke-linecap="round">
        <path d="M-6 34L30 47" />
        <path d="M-6 58L27 64" />
        <path d="M-3 80L30 80" />
        <path d="M106 34L70 47" />
        <path d="M106 58L73 64" />
        <path d="M103 80L70 80" />
      </g>
      <!-- سوراخ‌ها -->
      <ellipse cx="39" cy="28" rx="2.6" ry="4.2" transform="rotate(-20 39 28)" fill="#000" />
      <ellipse cx="61" cy="28" rx="2.6" ry="4.2" transform="rotate(20 61 28)" fill="#000" />
      <ellipse cx="40" cy="92" rx="2.2" ry="3.4" transform="rotate(-25 40 92)" fill="#000" />
      <ellipse cx="60" cy="92" rx="2.2" ry="3.4" transform="rotate(25 60 92)" fill="#000" />
      <!-- رگبرگ‌ها -->
      <g fill="none" stroke="#000" stroke-linecap="round">
        <path d="M50 8V102" stroke-opacity="0.55" stroke-width="1.6" />
        <path d="M50 30c-7 2-13 6-17 12M50 52c-8 2-14 6-18 12M50 74c-6 2-11 5-14 10" stroke-opacity="0.35" stroke-width="1" />
        <path d="M50 30c7 2 13 6 17 12M50 52c8 2 14 6 18 12M50 74c6 2 11 5 14 10" stroke-opacity="0.35" stroke-width="1" />
      </g>
    </mask>
    <symbol id="steps-monstera" viewBox="0 0 100 120">
      <path
        mask="url(#steps-monstera-m)"
        d="M50 4C78 12 98 38 94 68C91 92 70 108 52 104L50 98L48 104C30 108 9 92 6 68C2 38 22 12 50 4Z"
        fill="currentColor"
      />
      <path d="M50 100C50 110 49 116 47 120" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
    </symbol>

    <!-- برگچه‌ی سرخس -->
    <path id="steps-leaflet" d="M0 0C8-5 20-5 30 0C20 5 8 5 0 0Z" fill="currentColor" />

    <!-- فروند سرخسی -->
    <symbol id="steps-frond" viewBox="0 0 100 200">
      <path d="M50 198C47 150 47 90 50 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-opacity="0.7" />
      <g>
        <use href="#steps-leaflet" transform="translate(50 178) rotate(-30) scale(1)" />
        <use href="#steps-leaflet" transform="translate(50 178) scale(-1 1) rotate(-30) scale(1)" />
        <use href="#steps-leaflet" transform="translate(49 158) rotate(-34) scale(0.95)" />
        <use href="#steps-leaflet" transform="translate(49 158) scale(-1 1) rotate(-34) scale(0.95)" />
        <use href="#steps-leaflet" transform="translate(48.5 138) rotate(-38) scale(0.88)" />
        <use href="#steps-leaflet" transform="translate(48.5 138) scale(-1 1) rotate(-38) scale(0.88)" />
        <use href="#steps-leaflet" transform="translate(48 118) rotate(-42) scale(0.78)" />
        <use href="#steps-leaflet" transform="translate(48 118) scale(-1 1) rotate(-42) scale(0.78)" />
        <use href="#steps-leaflet" transform="translate(48 98) rotate(-46) scale(0.68)" />
        <use href="#steps-leaflet" transform="translate(48 98) scale(-1 1) rotate(-46) scale(0.68)" />
        <use href="#steps-leaflet" transform="translate(48.5 78) rotate(-50) scale(0.56)" />
        <use href="#steps-leaflet" transform="translate(48.5 78) scale(-1 1) rotate(-50) scale(0.56)" />
        <use href="#steps-leaflet" transform="translate(49 58) rotate(-55) scale(0.44)" />
        <use href="#steps-leaflet" transform="translate(49 58) scale(-1 1) rotate(-55) scale(0.44)" />
        <use href="#steps-leaflet" transform="translate(49.5 40) rotate(-60) scale(0.32)" />
        <use href="#steps-leaflet" transform="translate(49.5 40) scale(-1 1) rotate(-60) scale(0.32)" />
        <use href="#steps-leaflet" transform="translate(50 24) rotate(-70) scale(0.22)" />
        <use href="#steps-leaflet" transform="translate(50 24) scale(-1 1) rotate(-70) scale(0.22)" />
      </g>
    </symbol>

    <!-- جوانه -->
    <symbol id="steps-sprout" viewBox="0 0 64 64">
      <path d="M32 60V32" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
      <path d="M32 36C24 22 10 22 4 30c8 1 14 6 17 13 4-1 8-4 11-7z" fill="currentColor" />
      <path d="M32 36C40 22 54 22 60 30c-8 1-14 6-17 13-4-1-8-4-11-7z" fill="currentColor" opacity="0.8" />
      <ellipse cx="32" cy="57" rx="7" ry="2.4" fill="currentColor" opacity="0.35" />
    </symbol>
  </defs>

  <!-- ۱) لکه‌های رنگی محو -->
  <g filter="url(#steps-soft)">
    <circle cx="140" cy="720" r="240" class="text-primary-500 opacity-20" fill="currentColor" />
    <circle cx="1060" cy="740" r="250" class="text-primary-500 opacity-20" fill="currentColor" />
    <circle cx="600" cy="110" r="200" class="text-primary-300 opacity-20" fill="currentColor" />
    <circle cx="600" cy="420" r="260" class="text-primary-100 opacity-30" fill="currentColor" />
  </g>

  <!-- ۲) الگوی نقطه‌ای -->
  <rect width="1200" height="800" fill="url(#steps-dots)" class="opacity-[0.07]" />

  <!-- ۳) گیاهان (با فید به سمت بالا) -->
  <g mask="url(#steps-fade)">
    <!-- خطوط موجی پایین -->
    <g class="text-primary-600 opacity-10" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M0 700C200 660 320 740 520 700S900 660 1200 720" />
      <path d="M0 732C200 692 320 772 520 732S900 692 1200 752" />
      <path d="M0 764C200 724 320 804 520 764S900 724 1200 784" />
    </g>

    <!-- لایه‌ی پشت: بزرگ، محو و کم‌رنگ -->
    <g filter="url(#steps-blur-back)">
      <g transform="translate(300 600) rotate(-30) scale(3.4)" class="text-primary-300 opacity-20">
        <use href="#steps-monstera" width="120" height="144" x="-60" y="-72" />
      </g>
      <g transform="translate(910 590) rotate(26) scale(3.2)" class="text-primary-300 opacity-20">
        <g transform="scale(-1 1)">
          <use href="#steps-monstera" width="120" height="144" x="-60" y="-72" />
        </g>
      </g>
    </g>

    <!-- واین سمت چپ -->
    <g class="text-primary-700 opacity-10">
      <path d="M70 800C40 640 140 520 96 330" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <g class="steps-sway" style="animation-delay: -1s">
        <g transform="translate(70 700) rotate(-70) scale(0.5)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
        <g transform="translate(88 620) rotate(58) scale(0.55)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
        <g transform="translate(78 540) rotate(-62) scale(0.5)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
        <g transform="translate(100 450) rotate(52) scale(0.6)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
        <g transform="translate(92 385) rotate(-48) scale(0.45)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
        <g transform="translate(96 330) rotate(4) scale(0.5)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
      </g>
    </g>

    <!-- واین سمت راست -->
    <g class="text-primary-700 opacity-10">
      <path d="M1130 800C1160 640 1060 520 1104 330" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <g class="steps-sway" style="animation-delay: -3s">
        <g transform="translate(1130 700) rotate(70) scale(0.5)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
        <g transform="translate(1112 620) rotate(-58) scale(0.55)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
        <g transform="translate(1122 540) rotate(62) scale(0.5)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
        <g transform="translate(1100 450) rotate(-52) scale(0.6)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
        <g transform="translate(1108 385) rotate(48) scale(0.45)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
        <g transform="translate(1104 330) rotate(-4) scale(0.5)"><use href="#steps-leaf" width="64" height="64" x="-32" y="-60" /></g>
      </g>
    </g>

    <!-- مونسترای بزرگ پایین چپ -->
    <g transform="translate(170 660) rotate(-16) scale(2.6)" class="text-primary-800 opacity-10">
      <g class="steps-sway-slow">
        <use href="#steps-monstera" width="120" height="144" x="-60" y="-72" />
      </g>
    </g>

    <!-- مونسترای بزرگ پایین راست (قرینه) -->
    <g transform="translate(1030 672) rotate(14) scale(2.4)" class="text-primary-700 opacity-10">
      <g class="steps-sway-slow" style="animation-delay: -2.5s">
        <g transform="scale(-1 1)">
          <use href="#steps-monstera" width="120" height="144" x="-60" y="-72" />
        </g>
      </g>
    </g>

    <!-- جوانه‌ها -->
    <g transform="translate(330 748) scale(1.15)" class="text-primary-600 opacity-20">
      <use href="#steps-sprout" width="80" height="80" x="-40" y="-52" />
    </g>
    <g transform="translate(870 740) scale(1.05)" class="text-primary-600 opacity-20">
      <use href="#steps-sprout" width="80" height="80" x="-40" y="-52" />
    </g>
    <g transform="translate(600 770) scale(0.8)" class="text-primary-500 opacity-15">
      <use href="#steps-sprout" width="80" height="80" x="-40" y="-52" />
    </g>

    <!-- فروند بالا -->
    <g transform="translate(100 150) rotate(-24) scale(1.1)" class="text-primary-500 opacity-15">
      <g class="steps-sway-slow">
        <use href="#steps-frond" width="120" height="240" x="-60" y="-120" />
      </g>
    </g>
    <g transform="translate(1100 160) rotate(24) scale(1.1)" class="text-primary-500 opacity-15">
      <g class="steps-sway-slow" style="animation-delay: -3.5s">
        <g transform="scale(-1 1)">
          <use href="#steps-frond" width="120" height="240" x="-60" y="-120" />
        </g>
      </g>
    </g>

    <!-- برگ‌های پراکنده -->
    <g transform="translate(190 500) rotate(-62) scale(0.9)" class="text-primary-600 opacity-15">
      <use href="#steps-leaf" width="64" height="64" x="-32" y="-32" />
    </g>
    <g transform="translate(1010 530) rotate(68) scale(0.85)" class="text-primary-600 opacity-15">
      <use href="#steps-leaf" width="64" height="64" x="-32" y="-32" />
    </g>
    <g transform="translate(410 690) rotate(24) scale(0.55)" class="text-primary-500 opacity-15">
      <use href="#steps-leaf" width="64" height="64" x="-32" y="-32" />
    </g>
    <g transform="translate(780 700) rotate(-30) scale(0.5)" class="text-primary-500 opacity-15">
      <use href="#steps-leaf" width="64" height="64" x="-32" y="-32" />
    </g>

    <!-- ذرات ریز شناور -->
    <g class="text-primary-400 opacity-30" fill="currentColor">
      <circle cx="260" cy="420" r="3" />
      <circle cx="330" cy="330" r="2" />
      <circle cx="930" cy="400" r="3" />
      <circle cx="860" cy="310" r="2" />
      <circle cx="480" cy="610" r="2.5" />
      <circle cx="720" cy="630" r="2" />
      <circle cx="140" cy="260" r="2" />
      <circle cx="1060" cy="280" r="2.5" />
    </g>
  </g>
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

.steps-sway,
.steps-sway-slow {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: steps-sway 7s ease-in-out infinite alternate;
animation: none;
}
.steps-sway-slow {
  animation-duration: 11s;
}
@keyframes steps-sway {
  from { transform: rotate(-1.8deg); }
  to { transform: rotate(1.8deg); }
}
</style>