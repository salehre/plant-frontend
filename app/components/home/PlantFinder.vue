<script setup lang="ts">
import type { MockLocale } from '~/services/mock/mock-locale'
import { seasonByTheme } from '~/stores/ui.store'

const { t, locale } = useI18n()
const store = usePlantFinderStore()
const uiStore = useUiStore()

const bgImage = computed(() => `/images/bg-image/${seasonByTheme[uiStore.theme]}.webp`)

const activeLocale = computed<MockLocale>(() => (locale.value === 'fa' ? 'fa' : 'en'))
const question = computed(() => store.currentQuestion)
const isAsking = computed(() => !store.loading && !store.done)

const percentFormatter = computed(() => new Intl.NumberFormat(locale.value, { useGrouping: false }))
const formatScore = (score: number) =>
  t('components.confidenceScore.percentage', { value: percentFormatter.value.format(score) })

const difficultyKeys: Record<string, string> = {
  easy: 'components.common.difficultyEasy',
  medium: 'components.common.difficultyMedium',
  hard: 'components.common.difficultyHard',
}

/* ---------------------------------------------------------
 * ذرات شناور پس‌زمینه
 * از یک شبه‌رندوم قطعی (seeded) استفاده می‌کنیم تا خروجی SSR
 * و کلاینت دقیقاً یکی باشه و hydration mismatch نگیریم.
 * --------------------------------------------------------- */
const seeded = (i: number, s: number) => {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const particles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${(seeded(i, 1) * 100).toFixed(2)}%`,
  size: `${(5 + seeded(i, 2) * 9).toFixed(2)}px`,
  delay: `${(seeded(i, 3) * -22).toFixed(2)}s`,
  duration: `${(16 + seeded(i, 4) * 14).toFixed(2)}s`,
  drift: `${(seeded(i, 5) * 80 - 40).toFixed(2)}px`,
  spin: `${(seeded(i, 6) * 540 - 270).toFixed(0)}deg`,
  opacity: (0.12 + seeded(i, 7) * 0.3).toFixed(2),
}))

/* ---------------------------------------------------------
 * ناوبری جهت‌دار: ترنزیشن سؤال‌ها بسته به جلو/عقب فرق می‌کنه
 * --------------------------------------------------------- */
const navDir = ref<'next' | 'prev'>('next')
const stepTransition = computed(() => (navDir.value === 'next' ? 'step-next' : 'step-prev'))

function submit() {
  return store.submit(activeLocale.value, t('home.plantFinder.error'))
}

function onNext() {
  navDir.value = 'next'
  if (store.isLastStep) return submit()
  store.next()
}

function onBack() {
  navDir.value = 'prev'
  store.back()
}

/* ---------------------------------------------------------
 * انتخاب گزینه: مکث کوتاه برای دیده‌شدن انیمیشن تأیید
 * (کمی طولانی‌تر از قبل تا افکت Pop/Ripple کامل دیده بشه)
 * --------------------------------------------------------- */
const ADVANCE_DELAY = 420
let advanceTimer: ReturnType<typeof setTimeout> | undefined

/** گزینه‌ای که همین الان لمس شده (برای افکت موج و پاپ) */
const pressed = ref<string | null>(null)

function onSelect(value: string) {
  if (advanceTimer || store.loading) return
  pressed.value = value
  store.select(question.value.id, value)
  advanceTimer = setTimeout(() => {
    advanceTimer = undefined
    pressed.value = null
    onNext()
  }, ADVANCE_DELAY)
}

onBeforeUnmount(() => clearTimeout(advanceTimer))

watch(activeLocale, () => {
  if (store.done) submit()
})
</script>

<template>
  <section
    class="finder-scene relative isolate flex min-h-[400px] flex-col justify-center overflow-hidden rounded-2xl p-6 text-white sm:min-h-[460px] sm:p-10"
    aria-labelledby="plant-finder-title"
  >
    <!-- ───── لایه‌های پس‌زمینه ───── -->
    <Transition name="bg-fade">
      <SkeletonImage
        :key="bgImage"
        :src="bgImage"
        alt=""
        image-class="bg-float size-full object-cover"
        class="absolute inset-0 -z-30"
      />
    </Transition>

    <!-- تاریکی پایه + وینیِت نرم -->
    <div class="absolute inset-0 -z-20 bg-black/45" />
    <div class="finder-vignette absolute inset-0 -z-20" aria-hidden="true" />

    <!-- شفق قطبی زنده (Aurora) -->
    <div class="finder-aurora absolute inset-0 -z-20" aria-hidden="true" />

    <!-- ذرات شناور (گرده / برگ) -->
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <span
        v-for="p in particles"
        :key="p.id"
        class="finder-particle"
        :style="{
          left: p.left,
          width: p.size,
          height: p.size,
          opacity: p.opacity,
          animationDelay: p.delay,
          animationDuration: p.duration,
          '--drift': p.drift,
          '--spin': p.spin,
        }"
      />
    </div>

    <!-- ───── تیتر معرفی ───── -->
    <h2
      id="plant-finder-title"
      :class="isAsking
        ? 'reveal-up text-lg font-extrabold text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.45)] sm:text-xl'
        : 'sr-only'"
    >
      {{ t('home.plantFinder.title') }}
    </h2>
    <p
      v-if="isAsking"
      class="reveal-up mb-7 mt-2 max-w-2xl text-xs leading-6 text-white/85 sm:text-sm"
      style="--d: 90ms"
    >
      {{ t('home.plantFinder.introDescription') }}
    </p>

    <!-- ═══════════ حالت لودینگ: جوانه در حال رشد ═══════════ -->
    <Transition name="phase" mode="out-in">
      <div
        v-if="store.loading"
        key="loading"
        class="flex min-h-64 flex-col items-center justify-center gap-5 py-10 text-center"
        role="status"
        aria-live="polite"
      >
        <div class="sprout-stage relative flex size-24 items-center justify-center">
          <!-- حلقه‌های سونار -->
          <span class="sonar-ring" />
          <span class="sonar-ring" style="animation-delay: .8s" />
          <span class="sonar-ring" style="animation-delay: 1.6s" />

          <!-- هاله تنفسی -->
          <span class="sprout-aura" />

          <!-- جوانه‌ای که خودش رو رسم می‌کنه -->
          <svg
            class="sprout-svg relative z-10 size-12"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path class="sprout-stem" d="M24 44 V22" />
            <path class="sprout-leaf-l" d="M24 26 C14 26 10 20 10 14 C18 14 24 18 24 26 Z" />
            <path class="sprout-leaf-r" d="M24 22 C34 22 38 16 38 10 C30 10 24 14 24 22 Z" />
          </svg>
        </div>

        <div class="flex flex-col items-center gap-2.5">
          <p class="text-sm text-white/90">
            {{ t('home.plantFinder.loading') }}
          </p>
          <!-- نوار بارگذاری نامتعین -->
          <span class="indeterminate-bar" />
        </div>
      </div>

      <!-- ═══════════ نتایج ═══════════ -->
      <div v-else-if="store.done" key="results">
        <h3 class="reveal-up text-base font-bold text-white">
          {{ t('home.plantFinder.resultsTitle') }}
        </h3>
        <p class="reveal-up mb-5 mt-1 text-xs text-white/80 sm:text-sm" style="--d: 70ms">
          {{ t('home.plantFinder.resultsSubtitle') }}
        </p>

        <p
          v-if="!store.suggestions.length"
          class="reveal-up rounded-lg bg-white/15 p-3 text-xs text-white/90 backdrop-blur-sm sm:text-sm"
          style="--d: 140ms"
        >
          {{ t('home.plantFinder.noResults') }}
        </p>

        <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <li
            v-for="(item, i) in store.suggestions"
            :key="item.plant.id"
            class="result-item"
            :style="{ '--i': i }"
          >
            <NuxtLink
              :to="`/plants/${item.plant.slug}`"
              class="result-card group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface text-ink"
            >
              <div class="relative aspect-[16/10] overflow-hidden bg-primary-50">
                <SkeletonImage
                  :src="item.plant.image"
                  :alt="item.plant.name"
                  image-class="result-img size-full object-cover"
                  class="absolute inset-0"
                />
                <!-- براقی عبوری روی تصویر -->
                <span class="card-sheen" aria-hidden="true" />

                <!-- نشان امتیاز با حلقه‌ی پرشونده -->
                <span
                  class="score-badge absolute end-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-primary-600/95 py-0.5 pe-2.5 ps-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm"
                  :style="{ '--target': item.matchScore }"
                >
                  <span class="score-ring"><i /></span>
                  {{ t('home.plantFinder.match') }} {{ formatScore(item.matchScore) }}
                </span>
              </div>

              <div class="flex flex-1 flex-col gap-2 p-4">
                <div>
                  <h4 class="text-sm font-bold text-ink transition-colors duration-300 group-hover:text-primary-700">
                    {{ item.plant.name }}
                  </h4>
                  <p class="text-xs italic text-ink-muted">
                    {{ item.plant.scientificName }}
                  </p>
                </div>

                <p v-if="item.reason" class="text-xs leading-5 text-ink-muted">
                  {{ item.reason }}
                </p>
                <ul v-else class="flex flex-wrap gap-1.5">
                  <li
                    v-for="(id, ci) in item.matchedOn"
                    :key="id"
                    class="match-chip inline-flex items-center gap-1 rounded-lg bg-primary-50 px-2 py-0.5 text-xs text-primary-700"
                    :style="{ '--ci': ci }"
                  >
                    <Icon name="lucide:check" class="size-3" />
                    {{ t(`home.plantFinder.matched.${id}`) }}
                  </li>
                </ul>

                <span class="mt-auto pt-1 text-xs text-ink-muted">
                  {{ t(difficultyKeys[item.plant.difficulty] ?? '') }}
                </span>
              </div>
            </NuxtLink>
          </li>
        </ul>

        <div class="reveal-up mt-5 flex justify-end" style="--d: 260ms">
          <AppButton variant="secondary" size="sm" class="restart-btn" @click="store.reset()">
            <Icon name="lucide:rotate-ccw" class="restart-icon size-4" />
            {{ t('home.plantFinder.restart') }}
          </AppButton>
        </div>
      </div>

      <!-- ═══════════ سؤال‌ها ═══════════ -->
      <div v-else key="questions">
        <div class="mb-6">
          <div class="mb-2.5 text-xs text-white/85">
            {{ t('home.plantFinder.stepOf', {
              current: percentFormatter.format(store.step + 1),
              total: percentFormatter.format(store.totalSteps),
            }) }}
          </div>

          <!-- نوار مراحل مایع با شیمر -->
          <div
            class="flex gap-1.5"
            role="progressbar"
            :aria-valuemin="1"
            :aria-valuemax="store.totalSteps"
            :aria-valuenow="store.step + 1"
          >
            <span
              v-for="i in store.totalSteps"
              :key="i"
              class="step-seg"
              :class="{
                'is-done': i <= store.step,
                'is-active': i === store.step + 1,
              }"
            >
              <i class="step-fill" />
            </span>
          </div>
        </div>

        <Transition :name="stepTransition" mode="out-in">
          <div
            :key="question.id"
            role="group"
            :aria-labelledby="`finder-q-${question.id}`"
          >
            <h3
              :id="`finder-q-${question.id}`"
              class="q-title mb-5 text-base font-bold text-white sm:text-lg"
            >
              {{ t(`home.plantFinder.questions.${question.id}.title`) }}
            </h3>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                v-for="(option, oi) in question.options"
                :key="option.value"
                type="button"
                :aria-pressed="store.currentAnswer === option.value"
                class="opt-btn group/opt relative flex items-center gap-3 overflow-hidden rounded-xl border px-4 py-4 text-start text-sm"
                :class="[
                  store.currentAnswer === option.value ? 'is-selected' : 'is-idle',
                  pressed === option.value && 'is-pressed',
                ]"
                :style="{ '--oi': oi }"
                @click="onSelect(option.value)"
              >
                <!-- موج انتخاب -->
                <span class="opt-ripple" aria-hidden="true" />
                <!-- براقی عبوری -->
                <span class="opt-sheen" aria-hidden="true" />

                <span class="opt-icon-wrap relative z-10 grid size-9 shrink-0 place-items-center rounded-lg">
                  <Icon :name="option.icon" class="opt-icon size-5" />
                </span>

                <span class="relative z-10 flex-1">
                  {{ t(`home.plantFinder.questions.${question.id}.options.${option.value}`) }}
                </span>

                <!-- تیک تأیید -->
                <Transition name="check-pop">
                  <span
                    v-if="store.currentAnswer === option.value"
                    class="relative z-10 grid size-5 shrink-0 place-items-center rounded-full bg-primary-600 text-white"
                  >
                    <Icon name="lucide:check" class="size-3" />
                  </span>
                </Transition>
              </button>
            </div>
          </div>
        </Transition>

        <Transition name="err-shake">
          <p
            v-if="store.error"
            class="mt-3 rounded-lg bg-status-danger/90 p-2.5 text-xs text-white shadow-lg"
            role="alert"
          >
            {{ store.error }}
          </p>
        </Transition>

        <div class="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            class="back-btn inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            :disabled="store.isFirstStep"
            @click="onBack"
          >
            <Icon name="lucide:arrow-right" class="back-icon size-4 ltr:rotate-180" />
            {{ t('home.plantFinder.back') }}
          </button>

          <AppButton
            v-if="store.isLastStep && store.error"
            variant="primary"
            size="sm"
            @click="submit"
          >
            {{ t('home.plantFinder.retry') }}
          </AppButton>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
/* ╔══════════════════════════════════════════╗
   ║  0. پراپرتی‌های انیمیشن‌پذیر             ║
   ╚══════════════════════════════════════════╝ */
@property --score {
  syntax: '<number>';
  initial-value: 0;
  inherits: false;
}

/* ╔══════════════════════════════════════════╗
   ║  1. صحنه و پس‌زمینه                      ║
   ╚══════════════════════════════════════════╝ */
.finder-scene {
  transform: translateZ(0);
}

.bg-fade-enter-active,
.bg-fade-leave-active { transition: opacity 0.7s ease, filter 0.7s ease; }
.bg-fade-enter-from,
.bg-fade-leave-to { opacity: 0; filter: blur(6px); }

/* شناور آرام + تنفس خیلی ملایم */
.bg-float {
  scale: 1.06;
  animation: bg-float 22s ease-in-out infinite;
  will-change: transform;
}
@keyframes bg-float {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  33%      { transform: translate3d(-1.2%, -0.9%, 0) scale(1.02); }
  66%      { transform: translate3d(0.9%, -0.4%, 0) scale(1.01); }
}

/* وینیِت نرم برای خوانایی متن */
.finder-vignette {
  background: radial-gradient(
    120% 90% at 50% 40%,
    transparent 35%,
    rgba(0, 0, 0, 0.35) 100%
  );
}

/* شفق سبز/فیروزه‌ای شناور */
.finder-aurora {
  background:
    radial-gradient(60% 45% at 18% 20%, rgba(52, 211, 153, 0.22), transparent 65%),
    radial-gradient(55% 50% at 85% 75%, rgba(56, 189, 248, 0.18), transparent 65%),
    radial-gradient(45% 40% at 55% 95%, rgba(163, 230, 53, 0.14), transparent 70%);
  filter: blur(14px);
  animation: aurora-drift 24s ease-in-out infinite alternate;
  mix-blend-mode: screen;
}
@keyframes aurora-drift {
  0%   { transform: translate3d(-3%, 2%, 0) scale(1.05); opacity: 0.75; }
  50%  { transform: translate3d(3%, -2%, 0) scale(1.12); opacity: 1; }
  100% { transform: translate3d(-2%, -3%, 0) scale(1.07); opacity: 0.8; }
}

/* ذرات گرده/برگ شناور */
.finder-particle {
  position: absolute;
  bottom: -8%;
  border-radius: 50% 0 50% 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(190, 242, 220, 0.5));
  filter: blur(0.4px);
  animation-name: particle-rise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform, opacity;
}
@keyframes particle-rise {
  0%   { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
  12%  { opacity: var(--o, 0.3); }
  88%  { opacity: var(--o, 0.3); }
  100% { transform: translate3d(var(--drift, 0), -120vh, 0) rotate(var(--spin, 180deg)); opacity: 0; }
}

/* ╔══════════════════════════════════════════╗
   ║  2. ورود متن‌ها                          ║
   ╚══════════════════════════════════════════╝ */
.reveal-up {
  animation: reveal-up 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--d, 0ms);
}
@keyframes reveal-up {
  from { opacity: 0; transform: translateY(14px); filter: blur(5px); }
  to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
}

/* تعویض فاز کلی (سؤال ↔ لودینگ ↔ نتایج) */
.phase-enter-active { transition: opacity .38s ease, transform .38s cubic-bezier(.16,1,.3,1), filter .38s ease; }
.phase-leave-active { transition: opacity .22s ease, transform .22s ease, filter .22s ease; }
.phase-enter-from   { opacity: 0; transform: translateY(16px) scale(.985); filter: blur(6px); }
.phase-leave-to     { opacity: 0; transform: translateY(-10px) scale(.99); filter: blur(4px); }

/* ╔══════════════════════════════════════════╗
   ║  3. لودینگ: جوانه در حال رشد             ║
   ╚══════════════════════════════════════════╝ */
.sprout-aura {
  position: absolute;
  inset: 18%;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(167, 243, 208, 0.55), transparent 70%);
  filter: blur(10px);
  animation: aura-breathe 2.4s ease-in-out infinite;
}
@keyframes aura-breathe {
  0%, 100% { transform: scale(0.85); opacity: 0.5; }
  50%      { transform: scale(1.25); opacity: 1; }
}

.sonar-ring {
  position: absolute;
  inset: 22%;
  border-radius: 9999px;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  opacity: 0;
  animation: sonar 2.4s cubic-bezier(0.15, 0.6, 0.3, 1) infinite;
}
@keyframes sonar {
  0%   { transform: scale(0.6); opacity: 0.7; }
  100% { transform: scale(2.1); opacity: 0; }
}

.sprout-svg {
  color: rgb(var(--color-primary-100));
  filter: drop-shadow(0 2px 10px rgb(var(--color-primary-400) / 0.45));
}

.sprout-stem,
.sprout-leaf-l,
.sprout-leaf-r {
  stroke-dasharray: 90;
  stroke-dashoffset: 90;
  animation: draw 2.6s ease-in-out infinite;
}
.sprout-stem   { animation-delay: 0s; }
.sprout-leaf-l { animation-delay: .35s; transform-origin: 24px 26px; }
.sprout-leaf-r { animation-delay: .7s;  transform-origin: 24px 22px; }

@keyframes draw {
  0%   { stroke-dashoffset: 90; opacity: 0; }
  25%  { opacity: 1; }
  55%  { stroke-dashoffset: 0;  opacity: 1; }
  85%  { stroke-dashoffset: 0;  opacity: 1; }
  100% { stroke-dashoffset: 0;  opacity: 0; }
}

.indeterminate-bar {
  position: relative;
  display: block;
  width: 140px;
  height: 3px;
  overflow: hidden;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.2);
}
.indeterminate-bar::after {
  content: '';
  position: absolute;
  inset-block: 0;
  width: 42%;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  animation: indeterminate 1.3s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}
@keyframes indeterminate {
  0%   { transform: translateX(-120%); }
  100% { transform: translateX(260%); }
}

/* ╔══════════════════════════════════════════╗
   ║  4. نوار مراحل مایع                      ║
   ╚══════════════════════════════════════════╝ */
.step-seg {
  position: relative;
  flex: 1;
  height: 6px;
  overflow: hidden;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.22);
  transition: background-color .4s ease;
}
.step-fill {
  position: absolute;
  inset: 0;
  display: block;
  border-radius: inherit;
  background: linear-gradient(90deg, #fff, #d1fae5);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .55s cubic-bezier(0.16, 1, 0.3, 1);
}
:dir(rtl) .step-fill { transform-origin: right; }

.step-seg.is-done .step-fill,
.step-seg.is-active .step-fill { transform: scaleX(1); }

/* مرحله فعال: نبض + شیمر عبوری */
.step-seg.is-active {
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.55);
}
.step-seg.is-active::after {
  content: '';
  position: absolute;
  inset-block: 0;
  width: 50%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95), transparent);
  animation: seg-shimmer 1.9s ease-in-out infinite;
}
@keyframes seg-shimmer {
  0%   { transform: translateX(-130%); }
  100% { transform: translateX(230%); }
}

/* ╔══════════════════════════════════════════╗
   ║  5. ترنزیشن جهت‌دار سؤال‌ها (3D)         ║
   ╚══════════════════════════════════════════╝ */
.step-next-enter-active,
.step-prev-enter-active { transition: opacity .42s cubic-bezier(.16,1,.3,1), transform .42s cubic-bezier(.16,1,.3,1), filter .42s ease; }
.step-next-leave-active,
.step-prev-leave-active { transition: opacity .2s ease, transform .2s ease, filter .2s ease; }

/* رفتن به جلو */
.step-next-enter-from { opacity: 0; transform: translateX(42px) rotateY(-9deg) scale(.96); filter: blur(6px); }
.step-next-leave-to   { opacity: 0; transform: translateX(-34px) rotateY(7deg) scale(.97); filter: blur(4px); }
/* برگشت به عقب */
.step-prev-enter-from { opacity: 0; transform: translateX(-42px) rotateY(9deg) scale(.96); filter: blur(6px); }
.step-prev-leave-to   { opacity: 0; transform: translateX(34px) rotateY(-7deg) scale(.97); filter: blur(4px); }

/* در RTL جهت‌ها آینه می‌شن */
:dir(rtl) .step-next-enter-from { transform: translateX(-42px) rotateY(9deg) scale(.96); }
:dir(rtl) .step-next-leave-to   { transform: translateX(34px) rotateY(-7deg) scale(.97); }
:dir(rtl) .step-prev-enter-from { transform: translateX(42px) rotateY(-9deg) scale(.96); }
:dir(rtl) .step-prev-leave-to   { transform: translateX(-34px) rotateY(7deg) scale(.97); }

.q-title {
  animation: title-in .5s cubic-bezier(.16,1,.3,1) both;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.4);
}
@keyframes title-in {
  from { opacity: 0; transform: translateY(8px); letter-spacing: .04em; }
  to   { opacity: 1; transform: translateY(0);   letter-spacing: normal; }
}

/* ╔══════════════════════════════════════════╗
   ║  6. دکمه‌های گزینه                       ║
   ╚══════════════════════════════════════════╝ */
.opt-btn {
  backdrop-filter: blur(8px);
  transition:
    background-color .3s ease,
    border-color .3s ease,
    color .3s ease,
    transform .35s cubic-bezier(.34,1.56,.64,1),
    box-shadow .35s ease;
  /* ورود آبشاری */
  animation: opt-in .45s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(var(--oi, 0) * 65ms + 60ms);
  will-change: transform;
}
@keyframes opt-in {
  from { opacity: 0; transform: translateY(14px) scale(.96); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0) scale(1);      filter: blur(0); }
}

.opt-btn.is-idle {
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
.opt-btn.is-idle:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 14px 28px -12px rgba(0, 0, 0, 0.55);
}
.opt-btn:active { transform: translateY(-1px) scale(.985); transition-duration: .1s; }

.opt-btn.is-selected {
  border-color: #fff;
  background: #fff;
  color: rgb(var(--color-primary-700));
  box-shadow: 0 16px 34px -14px rgba(0, 0, 0, 0.6), 0 0 0 3px rgba(255, 255, 255, 0.25);
}

/* جهش تأیید هنگام کلیک */
.opt-btn.is-pressed { animation: opt-pop .42s cubic-bezier(.34,1.56,.64,1); }
@keyframes opt-pop {
  0%   { transform: scale(1); }
  35%  { transform: scale(.955); }
  70%  { transform: scale(1.035); }
  100% { transform: scale(1); }
}

/* موج انتخاب از مرکز */
.opt-ripple {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.75), transparent 60%);
  opacity: 0;
  transform: scale(0.2);
}
.opt-btn.is-pressed .opt-ripple { animation: ripple-out .55s ease-out; }
@keyframes ripple-out {
  0%   { opacity: .7; transform: scale(.2); }
  100% { opacity: 0;  transform: scale(2.4); }
}

/* براقی عبوری روی هاور */
.opt-sheen {
  position: absolute;
  inset-block: 0;
  inline-size: 55%;
  pointer-events: none;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  transform: translateX(-160%);
}
.opt-btn:hover .opt-sheen { animation: sheen .85s ease-out; }
@keyframes sheen {
  to { transform: translateX(260%); }
}

/* آیکون گزینه */
.opt-icon-wrap {
  background: rgba(255, 255, 255, 0.14);
  transition: background-color .3s ease, transform .4s cubic-bezier(.34,1.56,.64,1);
}
.opt-btn:hover .opt-icon-wrap { transform: scale(1.1) rotate(-6deg); background: rgba(255, 255, 255, 0.26); }
.opt-btn.is-selected .opt-icon-wrap {
  background: rgb(var(--color-primary-50));
  transform: scale(1.06);
}
.opt-icon { transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
.opt-btn.is-selected .opt-icon { animation: icon-cheer .5s cubic-bezier(.34,1.56,.64,1); }
@keyframes icon-cheer {
  0%   { transform: scale(1) rotate(0); }
  45%  { transform: scale(1.3) rotate(10deg); }
  100% { transform: scale(1) rotate(0); }
}

/* تیک تأیید */
.check-pop-enter-active { transition: transform .4s cubic-bezier(.34,1.56,.64,1), opacity .25s ease; }
.check-pop-leave-active { transition: transform .15s ease, opacity .15s ease; }
.check-pop-enter-from,
.check-pop-leave-to { opacity: 0; transform: scale(0) rotate(-90deg); }

/* ╔══════════════════════════════════════════╗
   ║  7. خطا و دکمه بازگشت                    ║
   ╚══════════════════════════════════════════╝ */
.err-shake-enter-active { animation: err-shake .5s cubic-bezier(.36,.07,.19,.97); }
.err-shake-leave-active { transition: opacity .2s ease, transform .2s ease; }
.err-shake-leave-to     { opacity: 0; transform: translateY(-6px); }
@keyframes err-shake {
  0%   { opacity: 0; transform: translateY(-8px); }
  30%  { opacity: 1; transform: translateX(-6px); }
  50%  { transform: translateX(5px); }
  70%  { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}

.back-icon { transition: transform .35s cubic-bezier(.34,1.56,.64,1); }
.back-btn:not(:disabled):hover .back-icon { transform: translateX(4px); }
:dir(rtl) .back-btn:not(:disabled):hover .back-icon { transform: translateX(-4px); }

/* ╔══════════════════════════════════════════╗
   ║  8. کارت‌های نتیجه                       ║
   ╚══════════════════════════════════════════╝ */
.result-item {
  animation: card-in .7s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(var(--i, 0) * 110ms + 100ms);
  perspective: 1000px;
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(26px) rotateX(10deg) scale(.94); filter: blur(7px); }
  to   { opacity: 1; transform: translateY(0) rotateX(0) scale(1);          filter: blur(0); }
}

.result-card {
  transition:
    transform .45s cubic-bezier(.16,1,.3,1),
    box-shadow .45s ease,
    border-color .45s ease;
  will-change: transform;
}
.result-card:hover {
  transform: translateY(-8px) scale(1.015);
  box-shadow: 0 26px 48px -18px rgba(0, 0, 0, 0.35);
  border-color: rgb(var(--color-primary-300, 134 239 172) / 0.8);
}
.result-card:active { transform: translateY(-3px) scale(.995); transition-duration: .12s; }

.result-img {
  transition: transform .7s cubic-bezier(.16,1,.3,1), filter .5s ease;
}
.result-card:hover .result-img {
  transform: scale(1.1) translateY(-2%);
  filter: saturate(1.15);
}

/* براقی عبوری روی تصویر */
.card-sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.45) 50%, transparent 65%);
  transform: translateX(-130%);
}
.result-card:hover .card-sheen { animation: card-sheen 1s ease-out; }
@keyframes card-sheen {
  to { transform: translateX(130%); }
}

/* نشان امتیاز + حلقه پرشونده */
.score-badge {
  animation: badge-in .55s cubic-bezier(.34,1.56,.64,1) both;
  animation-delay: calc(var(--i, 0) * 110ms + 350ms);
  transition: transform .35s cubic-bezier(.34,1.56,.64,1);
}
@keyframes badge-in {
  from { opacity: 0; transform: translateY(-8px) scale(.7); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.result-card:hover .score-badge { transform: scale(1.07); }

.score-ring {
  display: grid;
  place-items: center;
  inline-size: 16px;
  block-size: 16px;
  border-radius: 9999px;
  background: conic-gradient(#fff calc(var(--score) * 1%), rgba(255, 255, 255, 0.3) 0);
  animation: score-fill 1.1s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(var(--i, 0) * 110ms + 450ms);
}
.score-ring i {
  inline-size: 9px;
  block-size: 9px;
  border-radius: 9999px;
  background: rgb(var(--color-primary-600));
}
@keyframes score-fill {
  from { --score: 0; }
  to   { --score: var(--target, 100); }
}

/* چیپ‌های تطابق */
.match-chip {
  animation: chip-in .4s cubic-bezier(.34,1.56,.64,1) both;
  animation-delay: calc(var(--i, 0) * 110ms + var(--ci, 0) * 55ms + 400ms);
  transition: transform .25s ease, background-color .25s ease;
}
@keyframes chip-in {
  from { opacity: 0; transform: scale(.6) translateY(6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.result-card:hover .match-chip { transform: translateY(-1px); }

/* دکمه شروع دوباره */
.restart-icon { transition: transform .55s cubic-bezier(.34,1.56,.64,1); }
.restart-btn:hover .restart-icon { transform: rotate(-360deg); }

/* ╔══════════════════════════════════════════╗
   ║  9. احترام به prefers-reduced-motion     ║
   ╚══════════════════════════════════════════╝ */
@media (prefers-reduced-motion: reduce) {
  .bg-float,
  .finder-aurora,
  .finder-particle,
  .sprout-aura,
  .sonar-ring,
  .sprout-stem,
  .sprout-leaf-l,
  .sprout-leaf-r,
  .indeterminate-bar::after,
  .step-seg.is-active::after,
  .opt-btn,
  .opt-ripple,
  .opt-sheen,
  .card-sheen,
  .result-item,
  .score-ring,
  .match-chip,
  .score-badge,
  .reveal-up,
  .q-title {
    animation: none !important;
  }
  .finder-particle,
  .sonar-ring { display: none !important; }

  .opt-btn,
  .result-card,
  .result-img,
  .step-fill {
    transition-duration: 0.01ms !important;
    transform: none !important;
  }

  .sprout-stem,
  .sprout-leaf-l,
  .sprout-leaf-r { stroke-dashoffset: 0; opacity: 1; }
}
</style>