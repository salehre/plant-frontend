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
    
    <!-- انیمیشن‌های پس‌زمینه -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <!-- الگوی نقطه‌ای متحرک -->
      <div class="absolute inset-0 bg-dots opacity-10 animate-bg-pan"></div>
      
      <!-- حلقه‌های نبض‌دار -->
      <span class="absolute -top-24 -end-24 w-96 h-96 border border-white/5 rounded-full animate-pulse-slow"></span>
      <span class="absolute top-1/2 -start-32 w-64 h-64 border border-white/10 rounded-full animate-float-slow delay-1000"></span>
      
      <!-- ذرات معلق (Orbs) -->
      <span class="absolute top-[20%] end-[15%] w-3 h-3 bg-primary-400 rounded-full animate-float delay-700 shadow-[0_0_20px_rgba(var(--color-primary-400),0.8)]"></span>
      <span class="absolute bottom-[30%] start-[10%] w-2 h-2 bg-white rounded-full animate-float delay-300 shadow-[0_0_15px_rgba(255,255,255,0.8)]"></span>
      <span class="absolute top-[60%] end-[30%] w-1.5 h-1.5 bg-primary-200 rounded-full animate-float delay-1000 shadow-[0_0_10px_rgba(var(--color-primary-200),0.8)]"></span>
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
/* الگوی نقطه‌ای */
.bg-dots {
  background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* حرکت آرام پس‌زمینه */
@keyframes bg-pan {
  0% { background-position: 0 0; }
  100% { background-position: 64px 64px; }
}
.animate-bg-pan {
  animation: bg-pan 8s linear infinite;
}

/* نبض حلقه‌ها */
@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.05); opacity: 0.3; }
}
.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}

/* شناور ماندن اجزا */
@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-10px) translateX(5px); }
  50% { transform: translateY(-20px) translateX(0); }
  75% { transform: translateY(-10px) translateX(-5px); }
}
.animate-float {
  animation: float 8s ease-in-out infinite;
}
.animate-float-slow {
  animation: float 12s ease-in-out infinite reverse;
}

/* انیمیشن ورود با جهش جزئی */
@keyframes fade-up {
  0% { opacity: 0; transform: translateY(30px) scale(0.95); }
  60% { opacity: 1; transform: translateY(-5px) scale(1.02); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-up {
  animation: fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  opacity: 0;
}

/* حرکت پارتیکل اطلاعات در خطوط اتصال */
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

/* افکت راداری پشت دکمه */
@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
}
.animate-ping-slow {
  animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* کلاس‌های تاخیر زمانی */
.delay-150 { animation-delay: 150ms; }
.delay-300 { animation-delay: 300ms; }
.delay-700 { animation-delay: 700ms; }
.delay-1000 { animation-delay: 1000ms; }

/* غیرفعال کردن انیمیشن‌ها برای کاربرانی که ترجیح می‌دهند حرکت کمتری ببینند */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }
}
</style>