<script setup lang="ts">
const { t, locale } = useI18n()

const steps = [
  { key: 'upload', icon: 'lucide:camera' },
  { key: 'analyze', icon: 'lucide:scan-line' },
  { key: 'result', icon: 'lucide:sparkles' },
  { key: 'details', icon: 'lucide:book-open' },
] as const

function formatNumber(value: number) {
  return new Intl.NumberFormat(locale.value, { useGrouping: false }).format(value)
}
</script>

<template>
  <section class="relative isolate overflow-hidden rounded-[32px] bg-primary-900 px-4 py-12 text-white shadow-2xl sm:px-8 sm:py-16">

    <!-- فضای زنده پس‌زمینه -->
    <div
      class="steps-decor pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <span class="steps-scan" />

      <span class="steps-radar">
        <span class="steps-radar__ring" />
        <span class="steps-radar__ring" />
        <span class="steps-radar__ring" />
      </span>

      <span class="steps-radar steps-radar--soft">
        <span class="steps-radar__ring" />
        <span class="steps-radar__ring" />
      </span>

      <Icon
        name="lucide:sparkles"
        class="steps-star steps-star--one size-5 text-primary-200/50"
      />
      <Icon
        name="lucide:sparkles"
        class="steps-star steps-star--two size-4 text-primary-200/40"
      />
      <Icon
        name="lucide:sparkles"
        class="steps-star steps-star--three size-3.5 text-primary-100/35"
      />
    </div>

    <div class="relative z-10">
      <!-- عنوان با انیمیشن ورود -->
      <div class="mx-auto max-w-2xl text-center animate-fade-up">
        <h2 class="text-3xl font-black tracking-tight sm:text-4xl mb-4">
          {{ t('home.steps.title') }}
        </h2>
        <p class="text-base text-white/70 sm:text-lg animate-fade-up delay-150">
          {{ t('home.steps.description') }}
        </p>
      </div>

      <!-- مراحل با ورود پلکانی -->
      <ol class="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <li
          v-for="(step, index) in steps"
          :key="step.key"
          class="group relative flex flex-col rounded-3xl border border-white/10 bg-primary-800/40 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-primary-800/80 hover:border-primary-400/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] animate-fade-up"
          :style="{ animationDelay: `${300 + index * 150}ms` }"
        >
          <!-- شماره واترمارک با افکت هاور -->
          <span class="absolute top-2 end-4 text-7xl font-black text-white/[0.03] transition-all duration-500 group-hover:text-primary-500/10 group-hover:scale-125 group-hover:-translate-y-2 group-hover:-rotate-6 select-none pointer-events-none">
            {{ formatNumber(index + 1) }}
          </span>

          <!-- آیکون با حلقه چرخان -->
          <div class="relative z-10 flex size-14 items-center justify-center rounded-2xl bg-primary-900 border border-white/5 text-primary-300 mb-6 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:text-white group-hover:border-primary-400/50 group-hover:shadow-[0_0_20px_rgba(var(--color-primary-500),0.4)]">

            <span class="absolute inset-0 rounded-2xl border border-dashed border-transparent group-hover:border-primary-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-[spin_4s_linear_infinite]"></span>

            <Icon
              :name="step.icon"
              class="size-6 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
            />
          </div>

          <!-- متن -->
          <div class="relative z-10 mt-auto">
            <h3 class="text-lg font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              {{ t(`home.steps.${step.key}.title`) }}
            </h3>
            <p class="text-sm text-white/60 leading-relaxed transition-colors duration-300 group-hover:text-white/90">
              {{ t(`home.steps.${step.key}.description`) }}
            </p>
          </div>

          <!-- فلش اتصال همراه با جریان داده متحرک -->
          <span
            v-if="index < steps.length - 1"
            class="absolute top-1/2 -end-[30px] z-20 hidden -translate-y-1/2 items-center justify-center lg:flex"
            aria-hidden="true"
          >
            <!-- خط پایه -->
            <span class="absolute w-10 h-[2px] bg-white/5"></span>

            <!-- نقطه نورانی متحرک (Data Flow) -->
            <span class="absolute top-1/2 start-0 w-2 h-[2px] bg-primary-400 rounded-full animate-slide-dot -translate-y-1/2"></span>

            <!-- نشانگر فلش -->
            <span class="relative flex size-8 items-center justify-center rounded-full bg-primary-900 border border-white/10 text-primary-400 shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:bg-primary-500 group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_0_15px_rgba(var(--color-primary-500),0.6)] z-10">
              <Icon
                name="lucide:arrow-right"
                class="size-4 rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              />
            </span>
          </span>
        </li>
      </ol>

      <!-- دکمه اقدام (CTA) با افکت‌های پیشرفته -->
      <div class="mt-16 flex justify-center animate-fade-up delay-700 relative z-10">

        <!-- افکت پینگ (راداری) پشت دکمه -->
        <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[200px] h-12 bg-primary-500/20 rounded-full animate-ping-slow pointer-events-none"></span>

        <NuxtLink
          to="/identify"
          class="group relative inline-flex items-center gap-2.5 rounded-xl bg-primary-500 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:bg-primary-400 hover:-translate-y-1 active:translate-y-0 hover:shadow-[0_10px_40px_-10px_rgba(var(--color-primary-500),0.8)] z-10 overflow-hidden"
        >
          <Icon
            name="lucide:scan-line"
            class="size-5 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12"
          />
          <span>{{ t('home.identifyCta') }}</span>

          <!-- درخشش عبوری هنگام هاور (Shine Effect) -->
          <span class="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
            <span class="absolute top-0 bottom-0 -left-[150%] w-1/2 bg-white/20 skew-x-[-20deg] group-hover:left-[200%] transition-all duration-700 ease-in-out"></span>
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ===== بک‌گراند: اسکن سراسری ===== */
.steps-scan {
  position: absolute;
  inset-inline: -8%;
  block-size: 18%;
  inset-block-start: -20%;
  background: rgb(255 255 255 / 0.045);
  filter: blur(10px);
  opacity: 0;
  transform: rotate(8deg);
  animation: section-scan 6.8s 1.1s ease-in-out infinite;
}

@keyframes section-scan {
  0% {
    inset-block-start: -22%;
    opacity: 0;
  }

  12%,
  78% {
    opacity: 0.7;
  }

  100% {
    inset-block-start: 108%;
    opacity: 0;
  }
}

/* ===== بک‌گراند: رادار شناسایی ===== */
.steps-radar {
  position: absolute;
  inline-size: 18rem;
  block-size: 18rem;
  inset-block-start: -7rem;
  inset-inline-end: -5rem;
}

.steps-radar--soft {
  inline-size: 12rem;
  block-size: 12rem;
  inset-block-start: auto;
  inset-block-end: -5rem;
  inset-inline-end: auto;
  inset-inline-start: -4rem;
}

.steps-radar__ring {
  position: absolute;
  inset: 0;
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: 50%;
  opacity: 0;
  animation: radar-ping 4.6s ease-out infinite;
}

.steps-radar__ring:nth-child(2) {
  animation-delay: 1.5s;
}

.steps-radar__ring:nth-child(3) {
  animation-delay: 3s;
}

.steps-radar--soft .steps-radar__ring {
  animation-duration: 5.4s;
}

@keyframes radar-ping {
  0% {
    opacity: 0.45;
    transform: scale(0.28);
  }

  100% {
    opacity: 0;
    transform: scale(1);
  }
}

/* ===== بک‌گراند: ستاره‌های چشمک‌زن ===== */
.steps-star {
  position: absolute;
  animation: star-twinkle 3.2s ease-in-out infinite;
}

.steps-star--one {
  inset-block-start: 24%;
  inset-inline-start: 7%;
}

.steps-star--two {
  inset-block-end: 18%;
  inset-inline-end: 11%;
  animation-delay: -1.4s;
}

.steps-star--three {
  inset-block-start: 58%;
  inset-inline-end: 22%;
  animation-delay: -2.2s;
  animation-duration: 4s;
}

@keyframes star-twinkle {
  0%,
  100% {
    opacity: 0.28;
    transform: scale(0.82) rotate(-10deg);
  }

  50% {
    opacity: 0.9;
    transform: scale(1.12) rotate(10deg);
  }
}

/* ===== انیمیشن ورود با جهش جزئی ===== */
@keyframes fade-up {
  0% { opacity: 0; transform: translateY(30px) scale(0.95); }
  60% { opacity: 1; transform: translateY(-5px) scale(1.02); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-up {
  animation: fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  opacity: 0;
}

/* ===== حرکت پارتیکل اطلاعات در خطوط اتصال ===== */
@keyframes slide-dot {
  0% { transform: translateX(0); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateX(2.5rem); opacity: 0; }
}
@keyframes slide-dot-rtl {
  0% { transform: translateX(0); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateX(-2.5rem); opacity: 0; }
}
.animate-slide-dot {
  animation: slide-dot 2s ease-in-out infinite;
}
[dir="rtl"] .animate-slide-dot {
  animation-name: slide-dot-rtl;
}

/* ===== افکت راداری پشت دکمه ===== */
@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
}
.animate-ping-slow {
  animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* ===== کلاس‌های تاخیر زمانی ===== */
.delay-150 { animation-delay: 150ms; }
.delay-700 { animation-delay: 700ms; }

/* ===== غیرفعال کردن انیمیشن‌ها برای کاربرانی که حرکت کمتر می‌خواهند ===== */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }
}
</style>