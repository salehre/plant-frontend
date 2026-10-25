<script setup lang="ts">
const { t, locale } = useI18n()

const CYCLE_DURATION = 3000

const steps = [
  { key: 'upload', icon: 'lucide:camera' },
  { key: 'analyze', icon: 'lucide:scan-line' },
  { key: 'result', icon: 'lucide:sparkles' },
  { key: 'details', icon: 'lucide:book-open' },
] as const

const particles = [
  { x: '7%', y: '18%', size: '4px', delay: '-1s', duration: '6s' },
  { x: '14%', y: '72%', size: '3px', delay: '-3s', duration: '7s' },
  { x: '27%', y: '28%', size: '2px', delay: '-2s', duration: '5s' },
  { x: '43%', y: '82%', size: '4px', delay: '-4s', duration: '8s' },
  { x: '59%', y: '17%', size: '3px', delay: '-1.5s', duration: '6.5s' },
  { x: '72%', y: '75%', size: '2px', delay: '-3.5s', duration: '5.5s' },
  { x: '84%', y: '31%', size: '4px', delay: '-2.5s', duration: '7.5s' },
  { x: '92%', y: '68%', size: '3px', delay: '-5s', duration: '8.5s' },
] as const

const sectionRef = ref<HTMLElement | null>(null)
const hasEntered = ref(false)
const isInView = ref(false)
const prefersReducedMotion = ref(false)

const autoIndex = ref(0)
const hoveredIndex = ref<number | null>(null)

const activeIndex = computed(() => hoveredIndex.value ?? autoIndex.value)

function formatNumber(value: number) {
  return new Intl.NumberFormat(locale.value, {
    useGrouping: false,
  }).format(value)
}

let observer: IntersectionObserver | null = null
let cycleTimer: ReturnType<typeof setTimeout> | null = null
let rippleTimer: ReturnType<typeof setTimeout> | null = null
let motionQuery: MediaQueryList | null = null
let documentIsVisible = true

function stopPlayback() {
  if (!cycleTimer)
    return

  clearTimeout(cycleTimer)
  cycleTimer = null
}

function schedulePlayback(delay = CYCLE_DURATION) {
  stopPlayback()

  if (
    !isInView.value
    || prefersReducedMotion.value
    || hoveredIndex.value !== null
    || !documentIsVisible
  ) {
    return
  }

  cycleTimer = setTimeout(() => {
    autoIndex.value = (autoIndex.value + 1) % steps.length
    schedulePlayback()
  }, delay)
}

function activateStep(index: number) {
  autoIndex.value = index
  hoveredIndex.value = index
  stopPlayback()
}

function deactivateStep(event: MouseEvent) {
  resetCardTransform(event.currentTarget as HTMLElement)
  hoveredIndex.value = null
  schedulePlayback(3400)
}

function handleCardPointer(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || prefersReducedMotion.value)
    return

  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()

  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height

  const rotateX = (0.5 - y) * 7
  const rotateY = (x - 0.5) * 9

  card.style.setProperty('--card-rx', `${rotateX}deg`)
  card.style.setProperty('--card-ry', `${rotateY}deg`)
  card.style.setProperty('--pointer-x', `${x * 100}%`)
  card.style.setProperty('--pointer-y', `${y * 100}%`)
}

function resetCardTransform(card: HTMLElement) {
  card.style.setProperty('--card-rx', '0deg')
  card.style.setProperty('--card-ry', '0deg')
  card.style.setProperty('--pointer-x', '50%')
  card.style.setProperty('--pointer-y', '50%')
}

function handleMagneticMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || prefersReducedMotion.value)
    return

  const element = event.currentTarget as HTMLElement
  const rect = element.getBoundingClientRect()

  const x = event.clientX - (rect.left + rect.width / 2)
  const y = event.clientY - (rect.top + rect.height / 2)

  element.style.setProperty('--cta-x', `${x * 0.1}px`)
  element.style.setProperty('--cta-y', `${y * 0.14}px`)
}

function resetMagneticButton(event: PointerEvent) {
  const element = event.currentTarget as HTMLElement

  element.style.setProperty('--cta-x', '0px')
  element.style.setProperty('--cta-y', '0px')
}

function createRipple(event: PointerEvent) {
  if (prefersReducedMotion.value)
    return

  const element = event.currentTarget as HTMLElement
  const rect = element.getBoundingClientRect()

  element.style.setProperty('--ripple-x', `${event.clientX - rect.left}px`)
  element.style.setProperty('--ripple-y', `${event.clientY - rect.top}px`)

  element.classList.remove('is-rippling')

  // برای شروع دوباره‌ی انیمیشن
  void element.offsetWidth

  element.classList.add('is-rippling')

  if (rippleTimer)
    clearTimeout(rippleTimer)

  rippleTimer = setTimeout(() => {
    element.classList.remove('is-rippling')
  }, 650)
}

function handleVisibilityChange() {
  documentIsVisible = document.visibilityState === 'visible'

  if (documentIsVisible)
    schedulePlayback(1800)
  else
    stopPlayback()
}

function handleMotionChange(event: MediaQueryListEvent) {
  prefersReducedMotion.value = event.matches

  if (event.matches)
    stopPlayback()
  else
    schedulePlayback()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', handleMotionChange)

  documentIsVisible = document.visibilityState === 'visible'
  document.addEventListener('visibilitychange', handleVisibilityChange)

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      ([entry]) => {
        const wasEntered = hasEntered.value

        isInView.value = Boolean(entry?.isIntersecting)

        if (isInView.value) {
          hasEntered.value = true
          schedulePlayback(wasEntered ? 1800 : 2400)
        }
        else {
          stopPlayback()
        }
      },
      {
        threshold: 0.25,
      },
    )

    if (sectionRef.value)
      observer.observe(sectionRef.value)
  }
  else {
    hasEntered.value = true
    isInView.value = true
    schedulePlayback()
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  stopPlayback()

  if (rippleTimer)
    clearTimeout(rippleTimer)

  motionQuery?.removeEventListener('change', handleMotionChange)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="steps-section relative isolate overflow-hidden rounded-[24px] bg-primary-900 px-4 py-10 text-white sm:px-8 sm:py-14"
    :class="{
      'has-entered': hasEntered,
      'is-in-view': isInView,
    }"
    :style="{ '--cycle-duration': `${CYCLE_DURATION}ms` }"
  >
    <!-- تزئینات متحرک پس‌زمینه -->
    <div
      class="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <span class="ambient-light ambient-light--one" />
      <span class="ambient-light ambient-light--two" />

      <span class="ambient-orbit ambient-orbit--one">
        <span class="ambient-orbit__dot" />
      </span>

      <span class="ambient-orbit ambient-orbit--two">
        <span class="ambient-orbit__dot" />
      </span>

      <span class="section-sweep" />

      <span
        v-for="(particle, index) in particles"
        :key="index"
        class="ambient-particle"
        :style="{
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
          animationDelay: particle.delay,
          animationDuration: particle.duration,
        }"
      />
    </div>

    <div class="relative z-10">
      <!-- عنوان -->
      <header class="steps-intro mx-auto max-w-xl text-center">
        <h2 class="steps-title text-2xl font-extrabold sm:text-3xl">
          {{ t('home.steps.title') }}
        </h2>

        <span
          class="steps-title-line mx-auto mt-4 block h-0.5 w-14 rounded-full bg-primary-300"
          aria-hidden="true"
        >
          <span class="steps-title-line__dot" />
        </span>

        <p class="steps-description mt-4 text-sm leading-7 text-white/70 sm:text-base">
          {{ t('home.steps.description') }}
        </p>
      </header>

      <!-- مراحل -->
      <ol
        class="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        :aria-label="t('home.steps.title')"
      >
        <li
          v-for="(step, index) in steps"
          :key="step.key"
          class="step-item relative"
          :style="{ '--step-delay': `${160 + index * 130}ms` }"
        >
          <div
            class="step-card group relative isolate flex min-h-[220px] flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-primary-800/80 p-5"
            :class="[
              `step-card--${step.key}`,
              { 'is-active': activeIndex === index },
            ]"
            @mouseenter="activateStep(index)"
            @mouseleave="deactivateStep"
            @pointermove="handleCardPointer"
          >
            <!-- نور دنبال‌کننده‌ی ماوس -->
            <span
              class="card-pointer-light"
              aria-hidden="true"
            />

            <!-- اسکن داخلی کارت -->
            <span
              class="card-scan"
              aria-hidden="true"
            />

            <!-- گوشه‌های فوکوس -->
            <span
              class="card-corner card-corner--ts"
              aria-hidden="true"
            />
            <span
              class="card-corner card-corner--te"
              aria-hidden="true"
            />
            <span
              class="card-corner card-corner--bs"
              aria-hidden="true"
            />
            <span
              class="card-corner card-corner--be"
              aria-hidden="true"
            />

            <div class="relative z-10 flex items-center justify-between">
              <!-- آیکون -->
              <span
                class="step-icon relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/20 text-primary-200"
                :class="`step-icon--${step.key}`"
              >
                <span
                  class="icon-ripple"
                  aria-hidden="true"
                />

                <span
                  class="icon-effect"
                  aria-hidden="true"
                >
                  <i />
                  <i />
                  <i />
                  <i />
                </span>

                <Icon
                  :name="step.icon"
                  class="step-icon__glyph relative z-10 size-6"
                />
              </span>

              <!-- شماره مرحله -->
              <span class="step-number text-4xl font-extrabold leading-none text-white/15">
                {{ formatNumber(index + 1) }}
              </span>
            </div>

            <div class="relative z-10">
              <h3 class="step-title text-base font-bold">
                {{ t(`home.steps.${step.key}.title`) }}
              </h3>

              <p class="mt-2 text-sm leading-7 text-white/70">
                {{ t(`home.steps.${step.key}.description`) }}
              </p>
            </div>

            <!-- نوار زمان مرحله -->
            <span
              class="step-meter relative z-10 mt-auto block h-1 overflow-hidden rounded-full bg-white/10"
              aria-hidden="true"
            >
              <span class="step-meter__fill block h-full rounded-full bg-primary-300" />
            </span>
          </div>

          <!-- اتصال بین مراحل -->
          <span
            v-if="index < steps.length - 1"
            class="step-connector absolute top-[4.2rem] z-20 hidden h-7 w-8 items-center -end-8 lg:flex"
            :class="{
              'is-complete': activeIndex > index,
              'is-sending': activeIndex === index,
            }"
            aria-hidden="true"
          >
            <span class="step-connector__line" />
            <span class="step-connector__packet" />

            <span class="step-connector__badge">
              <Icon
                name="lucide:chevron-right"
                class="size-3.5 rtl:-scale-x-100"
              />
            </span>
          </span>
        </li>
      </ol>

      <!-- دکمه -->
      <div class="steps-cta mt-11 text-center">
        <span class="steps-cta-shell relative inline-flex">
          <span
            class="steps-cta-ping"
            aria-hidden="true"
          />

          <NuxtLink
            to="/identify"
            class="steps-cta-link group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white"
            @pointermove="handleMagneticMove"
            @pointerleave="resetMagneticButton"
            @pointerdown="createRipple"
          >
            <span
              class="steps-cta-scan"
              aria-hidden="true"
            />

            <span class="cta-icon relative z-10 flex size-5 items-center justify-center">
              <span
                class="cta-icon__orbit"
                aria-hidden="true"
              />

              <Icon
                name="lucide:scan-line"
                class="relative z-10 size-4"
              />
            </span>

            <span class="relative z-10">
              {{ t('home.identifyCta') }}
            </span>

            <Icon
              name="lucide:arrow-right"
              class="cta-arrow relative z-10 size-4 rtl:-scale-x-100"
            />
          </NuxtLink>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ورود اولیه */

.steps-title,
.steps-description,
.steps-cta,
.step-item {
  opacity: 0;
}

.steps-title {
  clip-path: inset(0 0 100% 0);
  transform: translateY(12px);
}

.steps-description {
  transform: translateY(10px);
}

.step-item {
  translate: 0 22px;
  scale: 0.97;
}

.steps-cta {
  transform: translateY(12px);
}

.steps-section.has-entered .steps-title {
  animation: title-reveal 750ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.steps-section.has-entered .steps-description {
  animation: content-enter 650ms 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.steps-section.has-entered .step-item {
  animation: step-enter 750ms var(--step-delay) cubic-bezier(0.16, 1, 0.3, 1) both;
}

.steps-section.has-entered .steps-cta {
  animation: content-enter 650ms 760ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes title-reveal {
  to {
    opacity: 1;
    clip-path: inset(0 0 0 0);
    transform: translateY(0);
  }
}

@keyframes content-enter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes step-enter {
  to {
    opacity: 1;
    translate: 0 0;
    scale: 1;
  }
}

/* خط زیر عنوان */

.steps-title-line {
  position: relative;
  transform: scaleX(0);
  transform-origin: center;
}

.steps-section.has-entered .steps-title-line {
  animation: title-line-enter 650ms 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.steps-title-line__dot {
  position: absolute;
  top: 50%;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: white;
  opacity: 0;
  transform: translate(-50%, -50%);
}

.steps-section.is-in-view .steps-title-line__dot {
  animation: title-dot-travel 3.2s 1s ease-in-out infinite;
}

@keyframes title-line-enter {
  to {
    transform: scaleX(1);
  }
}

@keyframes title-dot-travel {
  0% {
    left: 0;
    opacity: 0;
  }

  15%,
  85% {
    opacity: 0.9;
  }

  100% {
    left: 100%;
    opacity: 0;
  }
}

/* نورهای ساده‌ی پس‌زمینه؛ بدون گرادیان */

.ambient-light {
  position: absolute;
  border-radius: 999px;
  background: rgb(96 165 250 / 0.09);
  filter: blur(50px);
}

.ambient-light--one {
  width: 15rem;
  height: 15rem;
  top: -6rem;
  right: -4rem;
}

.ambient-light--two {
  width: 12rem;
  height: 12rem;
  bottom: -5rem;
  left: -4rem;
  background: rgb(255 255 255 / 0.04);
}

.steps-section.is-in-view .ambient-light--one {
  animation: light-drift-one 8s ease-in-out infinite;
}

.steps-section.is-in-view .ambient-light--two {
  animation: light-drift-two 10s ease-in-out infinite;
}

@keyframes light-drift-one {
  50% {
    transform: translate(-24px, 20px) scale(1.08);
  }
}

@keyframes light-drift-two {
  50% {
    transform: translate(20px, -18px) scale(0.92);
  }
}

/* مدارها */

.ambient-orbit {
  position: absolute;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: 50%;
}

.ambient-orbit--one {
  width: 17rem;
  height: 17rem;
  top: -9rem;
  right: -6rem;
}

.ambient-orbit--two {
  width: 10rem;
  height: 10rem;
  bottom: -5rem;
  left: -3rem;
}

.ambient-orbit__dot {
  position: absolute;
  top: 8%;
  left: 50%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgb(191 219 254);
  box-shadow: 0 0 14px rgb(191 219 254 / 0.65);
}

.steps-section.is-in-view .ambient-orbit--one {
  animation: orbit-spin 22s linear infinite;
}

.steps-section.is-in-view .ambient-orbit--two {
  animation: orbit-spin 17s linear infinite reverse;
}

@keyframes orbit-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ذرات شناور */

.ambient-particle {
  position: absolute;
  border-radius: 50%;
  background: rgb(219 234 254 / 0.65);
  box-shadow: 0 0 8px rgb(191 219 254 / 0.35);
}

.steps-section.is-in-view .ambient-particle {
  animation-name: ambient-particle-float;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes ambient-particle-float {
  0%,
  100% {
    opacity: 0.25;
    transform: translateY(0) scale(0.8);
  }

  50% {
    opacity: 0.9;
    transform: translateY(-13px) scale(1.15);
  }
}

/* خط اسکن کل بخش */

.section-sweep {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -3%;
  width: 1px;
  background: rgb(255 255 255 / 0.08);
  box-shadow:
    0 0 10px rgb(191 219 254 / 0.12),
    12px 0 30px rgb(191 219 254 / 0.05);
  opacity: 0;
}

.section-sweep::after {
  position: absolute;
  top: 30%;
  left: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgb(219 234 254);
  box-shadow: 0 0 12px rgb(219 234 254 / 0.7);
  content: '';
  transform: translate(-50%, -50%);
}

.steps-section.is-in-view .section-sweep {
  animation: section-sweep 9s 1.4s ease-in-out infinite;
}

@keyframes section-sweep {
  0% {
    left: -3%;
    opacity: 0;
  }

  12%,
  86% {
    opacity: 1;
  }

  100% {
    left: 103%;
    opacity: 0;
  }
}

/* کارت */

.step-card {
  --card-rx: 0deg;
  --card-ry: 0deg;
  --pointer-x: 50%;
  --pointer-y: 50%;

  transform:
    perspective(900px)
    rotateX(var(--card-rx))
    rotateY(var(--card-ry));

  transform-style: preserve-3d;
  will-change: transform;

  transition:
    transform 180ms ease-out,
    translate 420ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 300ms ease,
    background-color 300ms ease,
    box-shadow 300ms ease;
}

.step-card.is-active {
  z-index: 2;
  translate: 0 -7px;
  border-color: rgb(191 219 254 / 0.32);
  background-color: rgb(30 64 175 / 0.7);
  box-shadow:
    0 20px 38px rgb(0 0 0 / 0.22),
    0 0 0 1px rgb(255 255 255 / 0.035);
}

@media (hover: hover) and (pointer: fine) {
  .step-card:hover {
    border-color: rgb(219 234 254 / 0.42);
    box-shadow:
      0 24px 46px rgb(0 0 0 / 0.26),
      0 0 0 1px rgb(255 255 255 / 0.05);
  }
}

/* نور دنبال‌کننده‌ی نشانگر */

.card-pointer-light {
  position: absolute;
  z-index: 0;
  left: var(--pointer-x);
  top: var(--pointer-y);
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: rgb(191 219 254 / 0.1);
  filter: blur(24px);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 250ms ease;
}

.step-card:hover .card-pointer-light {
  opacity: 1;
}

/* اسکن کارت */

.card-scan {
  position: absolute;
  z-index: 1;
  top: -15%;
  right: 0;
  left: 0;
  height: 12px;
  background: rgb(255 255 255 / 0.07);
  filter: blur(5px);
  opacity: 0;
  pointer-events: none;
}

.steps-section.is-in-view .step-card.is-active .card-scan {
  animation: card-scan 1.5s 180ms ease-in-out;
}

@keyframes card-scan {
  0% {
    top: -15%;
    opacity: 0;
  }

  18%,
  80% {
    opacity: 1;
  }

  100% {
    top: 110%;
    opacity: 0;
  }
}

/* گوشه‌های فوکوس کارت */

.card-corner {
  position: absolute;
  z-index: 2;
  width: 13px;
  height: 13px;
  border-color: rgb(191 219 254 / 0.8);
  opacity: 0;
  scale: 0.6;
  transition:
    opacity 300ms ease,
    scale 450ms cubic-bezier(0.16, 1, 0.3, 1);
}

.card-corner--ts {
  top: 8px;
  inset-inline-start: 8px;
  border-block-start: 1px solid;
  border-inline-start: 1px solid;
}

.card-corner--te {
  top: 8px;
  inset-inline-end: 8px;
  border-block-start: 1px solid;
  border-inline-end: 1px solid;
}

.card-corner--bs {
  bottom: 8px;
  inset-inline-start: 8px;
  border-block-end: 1px solid;
  border-inline-start: 1px solid;
}

.card-corner--be {
  right: 8px;
  bottom: 8px;
  inset-inline-end: 8px;
  border-block-end: 1px solid;
  border-inline-end: 1px solid;
}

.step-card.is-active .card-corner {
  opacity: 0.7;
  scale: 1;
}

/* آیکون */

.step-icon {
  transform: translateZ(24px);
  transition:
    transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
    background-color 300ms ease,
    color 300ms ease;
}

.step-card.is-active .step-icon {
  color: white;
  background-color: rgb(59 130 246 / 0.58);
  transform: translateZ(34px) translateY(-2px) scale(1.08);
}

.icon-ripple {
  position: absolute;
  inset: -5px;
  border: 1px solid rgb(191 219 254 / 0.6);
  border-radius: inherit;
  opacity: 0;
}

.steps-section.is-in-view .step-card.is-active .icon-ripple {
  animation: icon-ripple 1.15s ease-out;
}

@keyframes icon-ripple {
  from {
    opacity: 0.75;
    transform: scale(0.78);
  }

  to {
    opacity: 0;
    transform: scale(1.38);
  }
}

.icon-effect {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* مرحله آپلود */

.step-icon--upload .icon-effect::before {
  position: absolute;
  inset: 20%;
  border-radius: 50%;
  background: white;
  content: '';
  opacity: 0;
}

.steps-section.is-in-view
.step-card.is-active
.step-icon--upload
.icon-effect::before {
  animation: camera-flash 720ms ease;
}

.steps-section.is-in-view
.step-card.is-active
.step-icon--upload
.step-icon__glyph {
  animation: camera-shutter 720ms ease;
}

@keyframes camera-flash {
  38% {
    opacity: 0;
    scale: 0.4;
  }

  48% {
    opacity: 0.9;
    scale: 1.2;
  }

  70%,
  100% {
    opacity: 0;
    scale: 1.6;
  }
}

@keyframes camera-shutter {
  35% {
    transform: scale(0.75) rotate(-7deg);
  }

  56% {
    transform: scale(1.14) rotate(4deg);
  }

  100% {
    transform: scale(1) rotate(0);
  }
}

/* مرحله تحلیل */

.step-icon--analyze .icon-effect::before {
  position: absolute;
  right: 16%;
  left: 16%;
  height: 2px;
  border-radius: 4px;
  background: white;
  box-shadow: 0 0 7px rgb(255 255 255 / 0.8);
  content: '';
  opacity: 0;
}

.steps-section.is-in-view
.step-card.is-active
.step-icon--analyze
.icon-effect::before {
  animation: analyze-line 1.25s ease-in-out infinite;
}

.steps-section.is-in-view
.step-card.is-active
.step-icon--analyze
.step-icon__glyph {
  animation: analyze-glyph 1.25s ease-in-out infinite;
}

@keyframes analyze-line {
  0% {
    top: 18%;
    opacity: 0;
  }

  18%,
  82% {
    opacity: 0.9;
  }

  100% {
    top: 78%;
    opacity: 0;
  }
}

@keyframes analyze-glyph {
  50% {
    transform: scale(0.94);
    opacity: 0.8;
  }
}

/* مرحله نتیجه */

.step-icon--result .icon-effect i {
  --dx: 0px;
  --dy: 0px;

  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: white;
  opacity: 0;
}

.step-icon--result .icon-effect i:nth-child(1) {
  --dx: 23px;
  --dy: -18px;
}

.step-icon--result .icon-effect i:nth-child(2) {
  --dx: -22px;
  --dy: -15px;
}

.step-icon--result .icon-effect i:nth-child(3) {
  --dx: 20px;
  --dy: 19px;
}

.step-icon--result .icon-effect i:nth-child(4) {
  --dx: -20px;
  --dy: 18px;
}

.steps-section.is-in-view
.step-card.is-active
.step-icon--result
.icon-effect i {
  animation: result-particle 850ms ease-out both;
}

.steps-section.is-in-view
.step-card.is-active
.step-icon--result
.icon-effect i:nth-child(2) {
  animation-delay: 60ms;
}

.steps-section.is-in-view
.step-card.is-active
.step-icon--result
.icon-effect i:nth-child(3) {
  animation-delay: 110ms;
}

.steps-section.is-in-view
.step-card.is-active
.step-icon--result
.icon-effect i:nth-child(4) {
  animation-delay: 160ms;
}

.steps-section.is-in-view
.step-card.is-active
.step-icon--result
.step-icon__glyph {
  animation: result-pop 850ms ease;
}

@keyframes result-particle {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }

  35% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform:
      translate(
        calc(-50% + var(--dx)),
        calc(-50% + var(--dy))
      )
      scale(1);
  }
}

@keyframes result-pop {
  0% {
    transform: scale(0.7) rotate(-14deg);
  }

  48% {
    transform: scale(1.25) rotate(12deg);
  }

  100% {
    transform: scale(1) rotate(0);
  }
}

/* مرحله جزئیات */

.step-icon--details .icon-effect::before {
  position: absolute;
  top: 24%;
  bottom: 24%;
  left: 50%;
  width: 1px;
  background: rgb(255 255 255 / 0.8);
  content: '';
  opacity: 0;
  transform: scaleY(0);
}

.steps-section.is-in-view
.step-card.is-active
.step-icon--details
.icon-effect::before {
  animation: book-center-line 760ms ease;
}

.steps-section.is-in-view
.step-card.is-active
.step-icon--details
.step-icon__glyph {
  animation: book-open 760ms ease;
}

@keyframes book-center-line {
  35% {
    opacity: 0;
    transform: scaleY(0);
  }

  65%,
  100% {
    opacity: 0.8;
    transform: scaleY(1);
  }
}

@keyframes book-open {
  0% {
    transform: perspective(60px) rotateY(0);
  }

  42% {
    transform: perspective(60px) rotateY(-18deg) scaleX(0.88);
  }

  72% {
    transform: perspective(60px) rotateY(10deg) scaleX(1.08);
  }

  100% {
    transform: perspective(60px) rotateY(0) scaleX(1);
  }
}

/* متن و شماره کارت */

.step-number {
  transform: translateZ(18px);
  transition:
    color 300ms ease,
    transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
}

.step-title {
  transition:
    color 300ms ease,
    transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
}

.step-card.is-active .step-number {
  color: rgb(255 255 255 / 0.4);
  transform: translateZ(28px) translateY(-3px) scale(1.04);
}

.step-card.is-active .step-title {
  color: rgb(219 234 254);
  transform: translateX(2px);
}

/* نوار زمان کارت */

.step-meter__fill {
  transform: scaleX(0);
  transform-origin: left;
}

.steps-section.is-in-view
.step-card.is-active
.step-meter__fill {
  animation: step-meter var(--cycle-duration) linear both;
}

:global([dir='rtl']) .step-meter__fill {
  transform-origin: right;
}

@keyframes step-meter {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

/* اتصال مراحل */

.step-connector__line {
  position: absolute;
  right: 0;
  left: 0;
  height: 1px;
  background: rgb(255 255 255 / 0.12);
  transition:
    background-color 350ms ease,
    box-shadow 350ms ease;
}

.step-connector.is-complete .step-connector__line,
.step-connector.is-sending .step-connector__line {
  background: rgb(147 197 253 / 0.8);
  box-shadow: 0 0 9px rgb(147 197 253 / 0.4);
}

.step-connector__badge {
  position: absolute;
  z-index: 2;
  inset-inline-end: -9px;
  display: flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: 50%;
  background: rgb(30 64 175);
  color: rgb(255 255 255 / 0.8);
  transition:
    scale 300ms ease,
    border-color 300ms ease;
}

.step-connector.is-sending .step-connector__badge {
  scale: 1.12;
  border-color: rgb(191 219 254 / 0.55);
}

.step-connector.is-sending .step-connector__badge::after {
  position: absolute;
  inset: -4px;
  border: 1px solid rgb(191 219 254 / 0.45);
  border-radius: 50%;
  content: '';
  animation: connector-ring 1.4s ease-out infinite;
}

.step-connector__packet {
  position: absolute;
  z-index: 3;
  inset-inline-start: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 10px rgb(191 219 254);
  opacity: 0;
}

.steps-section.is-in-view
.step-connector.is-sending
.step-connector__packet {
  animation: packet-travel 1.25s ease-in-out infinite;
}

@keyframes connector-ring {
  from {
    opacity: 0.65;
    scale: 0.7;
  }

  to {
    opacity: 0;
    scale: 1.55;
  }
}

@keyframes packet-travel {
  0% {
    inset-inline-start: 0;
    opacity: 0;
    scale: 0.6;
  }

  20%,
  80% {
    opacity: 1;
    scale: 1;
  }

  100% {
    inset-inline-start: calc(100% - 5px);
    opacity: 0;
    scale: 0.6;
  }
}

/* دکمه */

.steps-cta-link {
  --cta-x: 0px;
  --cta-y: 0px;
  --ripple-x: 50%;
  --ripple-y: 50%;

  translate: var(--cta-x) var(--cta-y);

  box-shadow:
    0 10px 24px rgb(0 0 0 / 0.18),
    0 0 0 1px rgb(255 255 255 / 0.08);

  transition:
    translate 160ms ease-out,
    background-color 280ms ease,
    box-shadow 280ms ease,
    scale 180ms ease;
}

.steps-cta-link:hover {
  background-color: rgb(96 165 250);
  box-shadow:
    0 15px 32px rgb(0 0 0 / 0.24),
    0 0 0 1px rgb(255 255 255 / 0.12);
}

.steps-cta-link:active {
  scale: 0.97;
}

.steps-cta-link:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgb(30 58 138),
    0 0 0 5px rgb(147 197 253);
}

/* Ripple دکمه */

.steps-cta-link::after {
  position: absolute;
  z-index: 0;
  top: var(--ripple-y);
  left: var(--ripple-x);
  width: 12px;
  height: 12px;
  border: 1px solid rgb(255 255 255 / 0.75);
  border-radius: 50%;
  content: '';
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0);
}

.steps-cta-link.is-rippling::after {
  animation: cta-ripple 620ms ease-out;
}

@keyframes cta-ripple {
  0% {
    opacity: 0.75;
    transform: translate(-50%, -50%) scale(0.5);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(18);
  }
}

/* اسکن دکمه */

.steps-cta-scan {
  position: absolute;
  z-index: 0;
  top: -20%;
  bottom: -20%;
  left: -25%;
  width: 14px;
  background: rgb(255 255 255 / 0.18);
  filter: blur(5px);
  opacity: 0;
  transform: rotate(8deg);
}

.steps-section.is-in-view .steps-cta-scan {
  animation: cta-scan 3.2s 1.2s ease-in-out infinite;
}

@keyframes cta-scan {
  0% {
    left: -25%;
    opacity: 0;
  }

  20%,
  65% {
    opacity: 0.8;
  }

  100% {
    left: 120%;
    opacity: 0;
  }
}

/* حلقه‌ی دکمه */

.steps-cta-ping {
  position: absolute;
  inset: -6px;
  border: 1px solid rgb(147 197 253 / 0.32);
  border-radius: 16px;
  pointer-events: none;
}

.steps-section.is-in-view .steps-cta-ping {
  animation: cta-ping 2.8s ease-out infinite;
}

@keyframes cta-ping {
  0%,
  45% {
    opacity: 0;
    transform: scale(0.96);
  }

  55% {
    opacity: 0.55;
  }

  100% {
    opacity: 0;
    transform: scale(1.12);
  }
}

/* آیکون و فلش دکمه */

.cta-icon__orbit {
  position: absolute;
  inset: -3px;
  border: 1px solid rgb(255 255 255 / 0.4);
  border-radius: 50%;
  opacity: 0;
}

.steps-cta-link:hover .cta-icon__orbit {
  animation: cta-icon-orbit 700ms ease-out;
}

.steps-cta-link:hover .cta-arrow {
  animation: cta-arrow 650ms ease-in-out infinite alternate;
}

@keyframes cta-icon-orbit {
  from {
    opacity: 0.8;
    transform: scale(0.6) rotate(0);
  }

  to {
    opacity: 0;
    transform: scale(1.5) rotate(180deg);
  }
}

@keyframes cta-arrow {
  to {
    translate: 3px 0;
  }
}

:global([dir='rtl']) .steps-cta-link:hover .cta-arrow {
  animation-name: cta-arrow-rtl;
}

@keyframes cta-arrow-rtl {
  to {
    translate: -3px 0;
  }
}

/* کاهش حرکت برای دسترس‌پذیری */

@media (prefers-reduced-motion: reduce) {
  .steps-section *,
  .steps-section *::before,
  .steps-section *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }

  .steps-title,
  .steps-description,
  .steps-cta,
  .step-item {
    opacity: 1 !important;
    clip-path: none !important;
    transform: none !important;
    translate: none !important;
    scale: 1 !important;
  }

  .steps-title-line {
    transform: scaleX(1) !important;
  }

  .step-card {
    transform: none !important;
    translate: none !important;
  }

  .step-meter__fill {
    transform: scaleX(1) !important;
  }

  .steps-cta-link {
    translate: none !important;
  }
}
</style>