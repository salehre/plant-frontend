<script setup lang="ts">
const { t } = useI18n()

interface FaqItem { q: string, a: string }

const FAQ_COUNT = 6
const items = computed<FaqItem[]>(() =>
  Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: t(`home.faq.items[${i}].q`),
    a: t(`home.faq.items[${i}].a`),
  })),
)

const openIndex = ref<number | null>(0)
function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

/* ── ریپل کلیک ── */
const ripples = ref<Map<number, { id: number, x: number, y: number }>>(new Map())
let rippleId = 0

function onTriggerClick(event: MouseEvent, i: number) {
  const btn = event.currentTarget as HTMLElement
  const rect = btn.getBoundingClientRect()

  const id = ++rippleId
  ripples.value.set(id, {
    id,
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  })

  setTimeout(() => ripples.value.delete(id), 600)
  toggle(i)
}

/* ── تیلت سه‌بعدی دنبال‌کننده‌ی ماوس ── */
function onCardMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height

  card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
  card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
  card.style.setProperty('--tx', `${((x - 0.5) * 4).toFixed(2)}deg`)
  card.style.setProperty('--ty', `${((0.5 - y) * 3).toFixed(2)}deg`)
}

function onCardLeave(event: PointerEvent) {
  const card = event.currentTarget as HTMLElement
  card.style.setProperty('--mx', '50%')
  card.style.setProperty('--my', '50%')
  card.style.setProperty('--tx', '0deg')
  card.style.setProperty('--ty', '0deg')
}
</script>

<template>
  <section
    class="faq-section mx-auto w-full max-w-3xl"
    aria-labelledby="faq-title"
  >
    <div class="faq-header mb-8 text-center">
      <span class="faq-kicker" aria-hidden="true">
        <i />
        FAQ
        <i />
      </span>

      <h2
        id="faq-title"
        class="mt-3 text-xl font-black tracking-tight text-ink sm:text-2xl"
      >
        {{ t('home.faq.title') }}
      </h2>

      <p class="faq-subtitle mt-2 text-sm text-ink-muted sm:text-base">
        {{ t('home.faq.subtitle') }}
      </p>
    </div>

    <div class="flex flex-col gap-3.5">
      <article
        v-for="(item, i) in items"
        :key="i"
        class="faq-card"
        :class="{ 'is-open': openIndex === i }"
        :style="{ '--i': i }"
        @pointermove="onCardMove"
        @pointerleave="onCardLeave"
      >
        <!-- نور دنبال‌کننده -->
        <span class="faq-spotlight" aria-hidden="true" />

        <!-- حاشیه گرادیانی که خودش را می‌کشد -->
        <svg class="faq-border" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <rect
            class="faq-border-rect"
            x="0.5"
            y="0.5"
            width="99"
            height="99"
            rx="14"
            ry="14"
          />
        </svg>

        <!-- خط کناری سبز که رشد می‌کند -->
        <span class="faq-accent" aria-hidden="true" />

        <!-- ریپل کلیک -->
        <span
          v-for="r in ripples.values()"
          :key="r.id"
          class="faq-ripple"
          :style="{ left: `${r.x}px`, top: `${r.y}px` }"
          aria-hidden="true"
        />

        <h3>
          <button
            type="button"
            class="faq-trigger relative flex w-full items-center gap-3 px-4 py-4 text-start sm:gap-4 sm:px-6"
            :aria-expanded="openIndex === i"
            :aria-controls="`faq-panel-${i}`"
            @click="onTriggerClick($event, i)"
          >
            <span class="faq-q min-w-0 flex-1 text-sm font-bold text-ink sm:text-base">
              {{ item.q }}
            </span>

            <!-- آیکون مورف: پلاس ↔ مینوس -->
            <span class="faq-icon" aria-hidden="true">
              <span class="faq-icon-bar faq-icon-bar--h" />
              <span class="faq-icon-bar faq-icon-bar--v" />
            </span>
          </button>
        </h3>

        <!-- پنل پاسخ با Grid Reveal -->
        <div
          :id="`faq-panel-${i}`"
          class="faq-panel"
          :class="{ 'faq-panel--open': openIndex === i }"
          role="region"
        >
          <div class="faq-panel-inner">
            <!-- خط جداکننده ظریف -->
            <span class="faq-divider" aria-hidden="true" />

            <!-- متن پاسخ با ورود آبشاری -->
            <p class="faq-a text-sm leading-7 text-ink-muted sm:text-[0.93rem] sm:leading-8">
              {{ item.a }}
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
/* ========================================================
   هدر
   ======================================================== */
.faq-header {
  animation: header-drop 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes header-drop {
  from {
    opacity: 0;
    transform: translateY(14px);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.faq-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.28em;
  color: rgb(var(--color-primary-500));
  text-transform: uppercase;
  animation: kicker-in 0.5s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.faq-kicker i {
  display: block;
  width: 1.5rem;
  height: 1px;
  background: currentColor;
  opacity: 0.35;
}

@keyframes kicker-in {
  from {
    opacity: 0;
    letter-spacing: 0.5em;
  }
  to {
    opacity: 1;
    letter-spacing: 0.28em;
  }
}

.faq-subtitle {
  animation: header-drop 0.6s 0.08s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ========================================================
   کارت‌ها — ورود آبشاری با فیزیک فنری
   ======================================================== */
.faq-card {
  --mx: 50%;
  --my: 50%;
  --tx: 0deg;
  --ty: 0deg;

  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: rgb(var(--color-surface) / 0.72);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.03),
    0 4px 14px -4px rgba(0, 0, 0, 0.04);

  transform: perspective(900px) rotateX(var(--ty)) rotateY(var(--tx));
  transform-style: preserve-3d;
  animation: card-enter 0.65s cubic-bezier(0.34, 1.3, 0.64, 1) both;
  animation-delay: calc(var(--i) * 75ms + 120ms);
  transition:
    transform 0.25s ease-out,
    box-shadow 0.35s ease,
    background-color 0.3s ease;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: perspective(900px) translateY(22px) rotateX(8deg) scale(0.97);
    filter: blur(5px);
  }
  to {
    opacity: 1;
    transform: perspective(900px) translateY(0) rotateX(0deg) scale(1);
    filter: blur(0);
  }
}

/* ========================================================
   نور دنبال‌کننده‌ی ماوس
   ======================================================== */
.faq-spotlight {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(
    350px circle at var(--mx) var(--my),
    rgb(var(--color-primary-400) / 0.12),
    transparent 70%
  );
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.faq-card:hover .faq-spotlight {
  opacity: 1;
}

/* ========================================================
   حاشیه گرادیانی SVG (خودش را می‌کشد)
   ======================================================== */
.faq-border {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.faq-border-rect {
  fill: none;
  stroke: url(#faqGrad);
  stroke-width: 1.5;
  stroke-dasharray: 396;
  stroke-dashoffset: 396;
  transition: stroke-dashoffset 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  vector-effect: non-scaling-stroke;
}

.faq-card.is-open .faq-border-rect {
  stroke-dashoffset: 0;
}

/* گرادیان داینامیک از طریق CSS fallback */
.faq-card.is-open {
  border-color: rgb(var(--color-primary-500) / 0.32);
}

/* ========================================================
   خط کناری سبز که رشد می‌کند
   ======================================================== */
.faq-accent {
  position: absolute;
  inset-block: 14px;
  inset-inline-start: 0;
  width: 3px;
  border-radius: 0 999px 999px 0;
  background: linear-gradient(
    180deg,
    rgb(var(--color-primary-300)),
    rgb(var(--color-primary-500)) 60%,
    rgb(var(--color-accent-500))
  );
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.faq-card.is-open .faq-accent {
  transform: scaleY(1);
}

/* ========================================================
   ریپل کلیک (Material-inspired)
   ======================================================== */
.faq-ripple {
  position: absolute;
  z-index: 0;
  width: 0;
  height: 0;
  border-radius: 999px;
  background: radial-gradient(circle, rgb(var(--color-primary-500) / 0.22), transparent 70%);
  transform: translate(-50%, -50%);
  animation: ripple-expand 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes ripple-expand {
  from {
    width: 0;
    height: 0;
    opacity: 0.7;
  }
  to {
    width: 500px;
    height: 500px;
    opacity: 0;
  }
}

.faq-trigger {
  position: relative;
  z-index: 2;
}

/* ========================================================
   آیکون مورف پلاس ↔ مینوس
   ======================================================== */
.faq-icon {
  position: relative;
  display: grid;
  width: 2.1rem;
  height: 2.1rem;
  flex-shrink: 0;
  place-items: center;
  border-radius: 999px;
  background: rgb(var(--color-primary-50) / 0.95);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9);
  transition:
    background-color 0.3s ease,
    transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease;
}

.faq-icon-bar {
  position: absolute;
  width: 11px;
  height: 2px;
  border-radius: 999px;
  background: rgb(var(--color-primary-700));
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease,
    background-color 0.3s ease;
}

.faq-icon-bar--v {
  transform: rotate(90deg);
}

/* باز شدن: خط عمودی محو می‌شود و خط افقی می‌ماند. */
.faq-card.is-open .faq-icon {
  background: rgb(var(--color-primary-600));
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    0 4px 14px -4px rgb(var(--color-primary-500) / 0.55);
}

.faq-card.is-open .faq-icon-bar {
  background: #fff;
}

.faq-card.is-open .faq-icon-bar--v {
  opacity: 0;
  transform: rotate(90deg) scaleX(0);
}

/* ========================================================
   پنل پاسخ — Grid Reveal + ورود متن
   ======================================================== */
.faq-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-panel--open {
  grid-template-rows: 1fr;
}

.faq-panel-inner {
  overflow: hidden;
  min-height: 0;
}

.faq-divider {
  display: block;
  height: 1px;
  margin: 0 4rem 0 3.6rem;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(var(--color-primary-500) / 0.3),
    rgb(var(--color-primary-500) / 0.08),
    transparent
  );
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s 0.05s cubic-bezier(0.16, 1, 0.3, 1);
}

:dir(rtl) .faq-divider {
  transform-origin: right;
}

.faq-panel--open .faq-divider {
  transform: scaleX(1);
}

.faq-a {
  padding: 0.85rem 1rem 1.1rem;
  padding-inline-start: 1rem;
  opacity: 0;
  transform: translateY(-8px);
  filter: blur(3px);
  transition:
    opacity 0.35s ease,
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.35s ease;
}

@media (sm) {
  .faq-a {
    padding-inline-start: 1.5rem;
  }
}

.faq-panel--open .faq-a {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
  transition-delay: 0.1s;
}

/* ========================================================
   سؤال متن
   ======================================================== */
.faq-q {
  transition: color 0.25s ease;
}

.faq-card.is-open .faq-q {
  color: rgb(var(--color-primary-500));
}

/* ========================================================
   Hover (فقط ماوس)
   ======================================================== */
@media (hover: hover) and (pointer: fine) {
  .faq-card:hover {
    box-shadow:
      0 6px 20px -6px rgba(0, 0, 0, 0.07),
      0 0 0 1px rgb(var(--color-primary-500) / 0.12);
    transform:
      perspective(900px)
      rotateX(var(--ty))
      rotateY(var(--tx))
      translateY(-3px);
  }

  .faq-card.is-open:hover {
    box-shadow:
      0 16px 40px -20px rgb(var(--color-primary-600) / 0.35),
      0 0 0 1px rgb(var(--color-primary-500) / 0.28);
    transform:
      perspective(900px)
      rotateX(var(--ty))
      rotateY(var(--tx))
      translateY(-2px);
  }

  .faq-card:hover .faq-icon {
    transform: scale(1.1);
  }

  .faq-card.is-open:hover .faq-icon {
    transform: scale(1.1);
  }
}

/* ========================================================
   Focus (دسترسی)
   ======================================================== */
.faq-trigger:focus-visible {
  outline: none;
}

.faq-card:has(.faq-trigger:focus-visible) {
  outline: 3px solid rgb(var(--color-primary-500) / 0.5);
  outline-offset: 3px;
}

/* ========================================================
   کاهش حرکت
   ======================================================== */
@media (prefers-reduced-motion: reduce) {
  .faq-header,
  .faq-kicker,
  .faq-subtitle,
  .faq-card,
  .faq-ripple {
    animation: none !important;
  }

  .faq-card,
  .faq-spotlight,
  .faq-accent,
  .faq-icon,
  .faq-icon-bar,
  .faq-q,
  .faq-panel,
  .faq-divider,
  .faq-a,
  .faq-border-rect {
    transition: none !important;
    transform: none !important;
    filter: none !important;
    opacity: 1 !important;
  }

  .faq-card {
    transform: none !important;
  }
}
</style>