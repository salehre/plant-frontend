<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
useHead(() => ({ title: t('support.nav') }))

const ctaSection = ref<HTMLElement | null>(null)

function onCtaPointerMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || !ctaSection.value) return

  const rect = ctaSection.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2

  ctaSection.value.style.setProperty('--far-x', `${-x * 7}px`)
  ctaSection.value.style.setProperty('--far-y', `${-y * 7}px`)
  ctaSection.value.style.setProperty('--near-x', `${-x * 14}px`)
  ctaSection.value.style.setProperty('--near-y', `${-y * 14}px`)
}

function onCtaPointerLeave() {
  if (!ctaSection.value) return

  ctaSection.value.style.removeProperty('--far-x')
  ctaSection.value.style.removeProperty('--far-y')
  ctaSection.value.style.removeProperty('--near-x')
  ctaSection.value.style.removeProperty('--near-y')
}

// تعداد سؤال‌ها باید با آرایه‌ی home.faq.items در fa.json و en.json یکی باشد
const FAQ_COUNT = 6

const topics = computed(() =>
  Array.from({ length: FAQ_COUNT }, (_, index) => ({
    id: `faq-${index}`,
    q: t(`home.faq.items[${index}].q`),
    a: t(`home.faq.items[${index}].a`),
  })),
)

const query = ref('')

const filtered = computed(() => {
  const search = query.value.trim().toLowerCase()

  if (!search) return topics.value

  return topics.value.filter(item =>
    `${item.q} ${item.a}`.toLowerCase().includes(search),
  )
})

const openQuestion = ref<string | null>(null)

function toggleQuestion(id: string) {
  openQuestion.value = openQuestion.value === id ? null : id
}

watch(query, () => {
  openQuestion.value = null
})

const cards = [
  {
    to: '/terms',
    icon: 'lucide:scroll-text',
    title: 'components.theFooter.terms',
    hint: 'support.cards.termsHint',
  },
  {
    to: '/blog',
    icon: 'lucide:book-open',
    title: 'pages.blog.title',
    hint: 'support.cards.guideHint',
  },
  {
    to: '/contact',
    icon: 'lucide:messages-square',
    title: 'contact.title',
    hint: 'support.cards.contactHint',
  },
  {
    to: '/tickets/new',
    icon: 'lucide:triangle-alert',
    title: 'tickets.newTicket',
    hint: 'support.cards.reportHint',
  },
]
</script>

<template>
  <div class="support-page mx-auto flex max-w-6xl flex-col gap-8 pb-6">
    <!-- هیرو و جستجو -->
    <section class="support-hero relative isolate overflow-hidden rounded-[19px] bg-primary-900 text-white">
      <img
        src="/images/plants/header.webp"
        alt=""
        aria-hidden="true"
        class="support-hero__image absolute inset-0 size-full object-cover opacity-60"
      >

      <div
        aria-hidden="true"
        class="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-primary-900/65 to-primary-900/95"
      />

      <span
        aria-hidden="true"
        class="support-hero__orb support-hero__orb--one pointer-events-none absolute -end-16 -top-20 size-64 rounded-full bg-primary-300/20 blur-3xl"
      />
      <span
        aria-hidden="true"
        class="support-hero__orb support-hero__orb--two pointer-events-none absolute -bottom-24 -start-10 size-72 rounded-full bg-accent-300/15 blur-3xl"
      />

      <div class="relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 sm:py-14">
        <h1 class="support-hero__title text-2xl font-extrabold leading-tight sm:text-4xl">
          {{ t('support.title') }}
        </h1>

        <p class="support-hero__subtitle max-w-xl text-sm leading-7 text-white/80">
          {{ t('support.subtitle') }}
        </p>

        <form
          class="support-search relative max-w-2xl"
          role="search"
          :aria-label="t('support.searchPlaceholder')"
          @submit.prevent
        >
          <div class="support-search__shell relative rounded-2xl bg-surface shadow-lg shadow-black/10">
            <label
              for="support-search"
              class="sr-only"
            >
              {{ t('support.searchPlaceholder') }}
            </label>

            <input
              id="support-search"
              v-model="query"
              type="search"
              :placeholder="t('support.searchPlaceholder')"
              class="h-12 w-full rounded-2xl border-0 bg-surface pe-14 ps-4 text-sm text-ink outline-none placeholder:text-ink-muted/70"
            >

            <span class="support-search__icon pointer-events-none absolute end-2 top-1/2 flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <Icon
                name="lucide:search"
                class="size-4"
              />
            </span>
          </div>
        </form>
      </div>
    </section>

    <!-- کارت‌های دسترسی -->
    <section class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <NuxtLink
        v-for="(card, index) in cards"
        :key="card.to"
        :to="card.to"
        class="support-card group glass-card relative isolate flex min-h-[146px] overflow-hidden rounded-2xl p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:min-h-[158px] sm:p-5"
        :style="{ '--card-delay': `${index * 85}ms` }"
      >
        <span
          aria-hidden="true"
          class="support-card__glow pointer-events-none absolute -end-10 -top-10 size-32 rounded-full bg-primary-200/60 blur-3xl"
        />

        <div class="support-card__content relative z-10 flex w-full flex-col gap-3">
          <span class="support-card__icon flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Icon
              :name="card.icon"
              class="size-5"
            />
          </span>

          <span>
            <span class="block text-sm font-bold text-ink">
              {{ t(card.title) }}
            </span>
            <span class="mt-0.5 block text-xs leading-5 text-ink-muted">
              {{ t(card.hint) }}
            </span>
          </span>
        </div>
      </NuxtLink>
    </section>

    <!-- پرسش‌های پرتکرار -->
    <section
      id="topics"
      class="scroll-mt-24"
    >
      <h2 class="faq-heading mb-3 flex items-center gap-2 text-lg font-bold text-ink">
        <span class="flex size-8 items-center justify-center rounded-lg bg-primary-700 text-white">
          <Icon
            name="lucide:sparkles"
            class="size-4"
          />
        </span>

        {{ t('support.popularTopics') }}

        <span class="hidden h-px flex-1 bg-gradient-to-r from-ink/10 to-transparent sm:block" />
      </h2>

      <TransitionGroup
        v-if="filtered.length"
        name="faq-list"
        tag="div"
        appear
        class="glass-card relative divide-y divide-ink/5 overflow-hidden"
      >
        <div
          v-for="(item, index) in filtered"
          :key="item.id"
          class="faq-row"
          :style="{ '--faq-delay': `${Math.min(index * 55, 275)}ms` }"
        >
          <button
            :id="`${item.id}-question`"
            type="button"
            class="faq-trigger group flex w-full items-center gap-3 px-4 py-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
            :class="{ 'faq-trigger--open': openQuestion === item.id }"
            :aria-expanded="openQuestion === item.id"
            :aria-controls="`${item.id}-panel`"
            @click="toggleQuestion(item.id)"
          >
            <span
              class="faq-question-icon flex size-10 shrink-0 items-center justify-center rounded-xl"
              :class="{ 'faq-question-icon--open': openQuestion === item.id }"
            >
              <Icon
                name="lucide:circle-help"
                class="size-5"
              />
            </span>

            <span class="flex-1 text-sm font-bold leading-6 text-ink">
              {{ item.q }}
            </span>

            <span
              class="faq-chevron flex size-8 shrink-0 items-center justify-center rounded-full border"
              :class="{ 'faq-chevron--open': openQuestion === item.id }"
            >
              <Icon
                name="lucide:chevron-down"
                class="size-4"
              />
            </span>
          </button>

          <div
            :id="`${item.id}-panel`"
            class="faq-panel"
            :class="{ 'faq-panel--open': openQuestion === item.id }"
            role="region"
            :aria-labelledby="`${item.id}-question`"
            :aria-hidden="openQuestion !== item.id"
          >
            <div class="faq-panel__inner">
              <p class="px-4 pb-4 ps-[4.25rem] text-sm leading-7 text-ink-muted">
                {{ item.a }}
              </p>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <Transition
        name="support-fade"
        mode="out-in"
      >
        <p
          v-if="!filtered.length"
          key="empty"
          class="glass-card flex flex-col items-center gap-3 px-4 py-9 text-center text-sm text-ink-muted"
        >
          <span class="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Icon
              name="lucide:search-x"
              class="size-6"
            />
          </span>

          {{ t('support.noResults') }}
        </p>
      </Transition>
    </section>

    <!-- هنوز کمک می‌خوای؟ -->
    <section
      ref="ctaSection"
      class="support-cta relative isolate overflow-hidden rounded-2xl bg-primary-50 p-6 dark:bg-primary-900/20 sm:p-8"
      @pointermove="onCtaPointerMove"
      @pointerleave="onCtaPointerLeave"
    >
      <div aria-hidden="true" class="cta-gradient" />
      <div aria-hidden="true" class="cta-aurora" />
      <div aria-hidden="true" class="cta-dots" />

      <div aria-hidden="true" class="cta-layer cta-layer--far">
        <div class="cta-blob cta-blob--one" />
        <div class="cta-blob cta-blob--two" />
        <div class="cta-ring cta-ring--one" />
        <div class="cta-ring cta-ring--two" />
      </div>

      <div aria-hidden="true" class="cta-layer cta-layer--near">
        <Icon name="lucide:leaf" class="cta-leaf cta-leaf--one" />
        <Icon name="lucide:leaf" class="cta-leaf cta-leaf--two" />
        <Icon name="lucide:leaf" class="cta-leaf cta-leaf--three" />
        <Icon name="lucide:sparkles" class="cta-sparkle cta-sparkle--one" />
        <Icon name="lucide:sparkle" class="cta-sparkle cta-sparkle--two" />
      </div>

      <div aria-hidden="true" class="cta-card-sheen" />

      <div class="cta-stagger relative z-[2] flex flex-wrap items-center gap-4 sm:gap-5">
        <span class="cta-icon-wrap relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-primary-700 shadow-lg shadow-primary-900/10 backdrop-blur dark:bg-white/10 dark:text-primary-200">
          <Icon
            name="lucide:headset"
            aria-hidden="true"
            class="cta-headset size-5"
          />
        </span>

        <div class="min-w-0 flex-1">
          <p class="font-bold text-ink">
            {{ t('support.stillNeedHelp') }}
          </p>
          <p class="mt-1 text-sm leading-6 text-ink-muted">
            {{ t('support.stillNeedHelpText') }}
          </p>
        </div>

        <NuxtLink
          to="/contact"
          class="support-contact-link relative isolate inline-flex w-full items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-700/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 sm:w-auto"
        >
          <span
            aria-hidden="true"
            class="cta-button-shine"
          />
          <span class="relative z-10">
            {{ t('components.theFooter.contact') }}
          </span>
          <Icon
            name="lucide:arrow-left"
            aria-hidden="true"
            class="cta-arrow relative z-10 size-4 rtl:rotate-180"
          />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.support-page {
  --support-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

/* هیرو */
.support-hero {
  animation: support-rise 720ms var(--support-ease) both;
}

.support-hero__image {
  transform-origin: center;
  animation: hero-drift 22s ease-in-out infinite alternate;
}

.support-hero__title {
  animation: support-rise 650ms var(--support-ease) 80ms both;
}

.support-hero__subtitle {
  animation: support-rise 650ms var(--support-ease) 170ms both;
}

.support-search {
  animation: support-rise 650ms var(--support-ease) 260ms both;
}

.support-hero__orb {
  animation: ambient-float 9s ease-in-out infinite alternate;
}

.support-hero__orb--two {
  animation-delay: -4s;
  animation-direction: alternate-reverse;
}

.support-search__shell {
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition:
    transform 260ms var(--support-ease),
    box-shadow 260ms ease,
    border-color 260ms ease;
}

.support-search__shell:focus-within {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.65);
  box-shadow:
    0 14px 32px rgba(0, 0, 0, 0.16),
    0 0 0 3px rgba(255, 255, 255, 0.2);
}

.support-search__icon {
  transform: translateY(-50%);
  transition:
    transform 260ms var(--support-ease),
    background-color 260ms ease,
    color 260ms ease;
}

.support-search__shell:focus-within .support-search__icon {
  transform: translateY(-50%) rotate(-7deg) scale(1.06);
  background-color: rgb(var(--color-primary-700));
  color: white;
}

/* کارت‌ها */
.support-card {
  transition:
    transform 280ms var(--support-ease),
    box-shadow 280ms ease,
    border-color 280ms ease;
}

.support-card:hover,
.support-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgb(var(--color-primary-500) / 0.28);
  box-shadow: 0 14px 32px rgb(var(--color-ink) / 0.09);
}

.support-card__content {
  animation: support-rise 640ms var(--support-ease) var(--card-delay, 0ms) both;
}

.support-card__glow {
  opacity: 0;
  transform: scale(0.8);
  transition:
    opacity 350ms ease,
    transform 500ms var(--support-ease);
}

.support-card:hover .support-card__glow,
.support-card:focus-visible .support-card__glow {
  opacity: 0.8;
  transform: scale(1.15);
}

.support-card__icon {
  transition:
    transform 300ms var(--support-ease),
    background-color 260ms ease,
    color 260ms ease,
    box-shadow 260ms ease;
}

.support-card:hover .support-card__icon,
.support-card:focus-visible .support-card__icon {
  transform: rotate(-5deg) scale(1.07);
  background-color: rgb(var(--color-primary-700));
  color: white;
  box-shadow: 0 8px 18px rgb(var(--color-primary-700) / 0.2);
}

/* تیتر و لیست FAQ */
.faq-heading {
  animation: support-rise 600ms var(--support-ease) 300ms both;
}

.faq-list-appear-active,
.faq-list-enter-active,
.faq-list-leave-active {
  transition:
    opacity 260ms ease,
    transform 340ms var(--support-ease);
  transition-delay: var(--faq-delay, 0ms);
}

.faq-list-appear-from,
.faq-list-enter-from {
  opacity: 0;
  transform: translateY(9px) scale(0.99);
}

.faq-list-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.995);
}

.faq-list-leave-active {
  pointer-events: none;
}

.faq-list-move {
  transition: transform 340ms var(--support-ease);
}

.faq-trigger {
  transition: background-color 220ms ease;
}

.faq-trigger:hover,
.faq-trigger--open {
  background-color: rgb(var(--color-primary-500) / 0.055);
}

.faq-question-icon {
  background-color: rgb(var(--color-primary-50));
  color: rgb(var(--color-primary-700));
  box-shadow: inset 0 0 0 1px rgb(var(--color-primary-500) / 0.12);
  transition:
    transform 280ms var(--support-ease),
    background-color 220ms ease,
    color 220ms ease,
    box-shadow 220ms ease;
}

.faq-trigger:hover .faq-question-icon {
  transform: rotate(-5deg) scale(1.04);
}

.faq-question-icon--open {
  background-color: rgb(var(--color-primary-700));
  color: white;
  box-shadow: 0 6px 14px rgb(var(--color-primary-700) / 0.2);
}

.faq-chevron {
  color: rgb(var(--color-ink-muted));
  border-color: rgb(var(--color-ink) / 0.1);
  background-color: rgb(var(--color-surface));
  transition:
    transform 300ms var(--support-ease),
    border-color 220ms ease,
    background-color 220ms ease,
    color 220ms ease;
}

.faq-chevron--open {
  transform: rotate(180deg);
  border-color: rgb(var(--color-primary-700));
  background-color: rgb(var(--color-primary-700));
  color: white;
}

.faq-panel {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 360ms var(--support-ease),
    opacity 240ms ease;
}

.faq-panel--open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.faq-panel__inner {
  min-height: 0;
  overflow: hidden;
  transform: translateY(-5px);
  transition: transform 320ms var(--support-ease);
}

.faq-panel--open .faq-panel__inner {
  transform: translateY(0);
}

.support-fade-enter-active,
.support-fade-leave-active {
  transition:
    opacity 240ms ease,
    transform 300ms var(--support-ease);
}

.support-fade-enter-from,
.support-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* بخش تماس */
.support-cta {
  --far-x: 0px;
  --far-y: 0px;
  --near-x: 0px;
  --near-y: 0px;
  border: 1px solid rgb(var(--color-primary-500) / 0.16);
  box-shadow: 0 8px 28px rgb(var(--color-ink) / 0.045);
  animation: support-rise 760ms var(--support-ease) 420ms both;
  transition:
    box-shadow 300ms ease,
    border-color 300ms ease;
}

.support-cta:hover {
  border-color: rgb(var(--color-primary-500) / 0.3);
  box-shadow: 0 16px 38px rgb(var(--color-ink) / 0.09);
}

.cta-gradient,
.cta-aurora,
.cta-dots,
.cta-layer,
.cta-card-sheen {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.cta-gradient {
  z-index: 0;
  background: linear-gradient(
    125deg,
    rgb(var(--color-primary-100) / 0.72),
    rgb(var(--color-surface) / 0.92) 52%,
    rgb(var(--color-accent-50) / 0.7)
  );
}

:global(.dark) .cta-gradient {
  background: linear-gradient(
    125deg,
    rgb(var(--color-primary-800) / 0.78),
    rgb(var(--color-surface) / 0.72) 52%,
    rgb(var(--color-accent-900) / 0.42)
  );
}

.cta-aurora {
  z-index: 0;
  background:
    radial-gradient(ellipse at 18% 120%, rgb(var(--color-primary-400) / 0.24), transparent 58%),
    radial-gradient(ellipse at 82% -30%, rgb(var(--color-accent-300) / 0.2), transparent 54%);
  opacity: 0.9;
  animation: cta-aurora 12s ease-in-out infinite alternate;
}

.cta-dots {
  z-index: 0;
  color: rgb(var(--color-primary-800) / 0.1);
  background-image: radial-gradient(currentColor 0.75px, transparent 0.75px);
  background-size: 22px 22px;
  -webkit-mask-image: linear-gradient(135deg, #000 0%, transparent 68%);
  mask-image: linear-gradient(135deg, #000 0%, transparent 68%);
}

.cta-layer {
  z-index: 1;
  overflow: visible;
  transition: transform 450ms var(--support-ease);
  will-change: transform;
}

.cta-layer--far {
  transform: translate3d(var(--far-x), var(--far-y), 0);
}

.cta-layer--near {
  transform: translate3d(var(--near-x), var(--near-y), 0);
}

.cta-blob {
  position: absolute;
  aspect-ratio: 1;
  border-radius: 9999px;
  background: radial-gradient(circle, rgb(var(--color-primary-400) / 0.2), transparent 70%);
  filter: blur(2px);
  animation: cta-blob-float 11s ease-in-out infinite alternate;
}

.cta-blob--one {
  top: -5rem;
  inset-inline-end: 8%;
  width: 12rem;
}

.cta-blob--two {
  bottom: -7rem;
  inset-inline-start: 22%;
  width: 15rem;
  background: radial-gradient(circle, rgb(var(--color-accent-300) / 0.2), transparent 70%);
  animation-delay: -5s;
  animation-direction: alternate-reverse;
}

.cta-ring {
  position: absolute;
  width: 7rem;
  aspect-ratio: 1;
  border: 1px solid rgb(var(--color-primary-500) / 0.2);
  border-radius: 9999px;
  animation: cta-ring-float 8s ease-in-out infinite;
}

.cta-ring--one {
  top: 16%;
  inset-inline-start: 38%;
}

.cta-ring--two {
  top: 42%;
  inset-inline-end: 7%;
  width: 4rem;
  animation-delay: -4s;
}

.cta-leaf {
  position: absolute;
  transform-origin: 50% 100%;
  color: rgb(var(--color-primary-600) / 0.2);
  animation: leaf-sway 7s ease-in-out infinite;
}

.cta-leaf--one {
  bottom: -1.25rem;
  inset-inline-start: 3%;
  width: 5rem;
  height: 5rem;
}

.cta-leaf--two {
  top: 18%;
  inset-inline-end: 28%;
  width: 2rem;
  height: 2rem;
  animation-delay: -2s;
}

.cta-leaf--three {
  bottom: 8%;
  inset-inline-end: 4%;
  width: 3rem;
  height: 3rem;
  animation-delay: -4s;
}

.cta-sparkle {
  position: absolute;
  color: rgb(var(--color-accent-600) / 0.58);
  animation: sparkle-float 4s ease-in-out infinite;
}

.cta-sparkle--one {
  top: 18%;
  inset-inline-end: 18%;
  width: 1.25rem;
  height: 1.25rem;
}

.cta-sparkle--two {
  bottom: 24%;
  inset-inline-start: 28%;
  width: 1rem;
  height: 1rem;
  animation-delay: -2s;
}

.cta-card-sheen {
  z-index: 1;
  background: linear-gradient(110deg, transparent 35%, rgb(255 255 255 / 0.25) 50%, transparent 65%);
  background-size: 220% 100%;
  animation: cta-sheen 10s ease-in-out 1s infinite;
}

.cta-stagger {
  animation: support-rise 680ms var(--support-ease) 140ms both;
}

.cta-icon-wrap {
  transition:
    transform 300ms var(--support-ease),
    box-shadow 300ms ease;
}

.support-cta:hover .cta-icon-wrap {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgb(var(--color-ink) / 0.1);
}

.cta-icon-ring {
  position: absolute;
  inset: 0;
  border: 1px solid currentColor;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  animation: icon-ring 3.8s ease-out 700ms infinite;
}

.cta-headset {
  transition: transform 260ms var(--support-ease);
}

.support-cta:hover .cta-headset {
  transform: rotate(-8deg) scale(1.08);
}

.support-contact-link {
  transition:
    transform 240ms var(--support-ease),
    box-shadow 240ms ease,
    background-color 240ms ease;
}

.support-contact-link:hover,
.support-contact-link:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgb(var(--color-ink) / 0.18);
}

.support-contact-link:active {
  transform: translateY(0);
}

.cta-button-shine {
  position: absolute;
  top: -50%;
  bottom: -50%;
  left: -45%;
  width: 35%;
  transform: translateX(-150%) rotate(18deg);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: transform 700ms var(--support-ease);
}

.support-contact-link:hover .cta-button-shine,
.support-contact-link:focus-visible .cta-button-shine {
  transform: translateX(500%) rotate(18deg);
}

.cta-arrow {
  transition: scale 240ms var(--support-ease);
}

.support-contact-link:hover .cta-arrow,
.support-contact-link:focus-visible .cta-arrow {
  scale: 1.12;
}

/* انیمیشن‌ها */
@keyframes support-rise {
  from {
    opacity: 0;
    transform: translate3d(0, 14px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes cta-aurora {
  from {
    transform: translate3d(-2%, 1%, 0) scale(1);
    opacity: 0.72;
  }

  to {
    transform: translate3d(2%, -1%, 0) scale(1.08);
    opacity: 1;
  }
}

@keyframes cta-blob-float {
  from {
    transform: translate3d(0, 0, 0) scale(0.96);
  }

  to {
    transform: translate3d(-12px, 8px, 0) scale(1.06);
  }
}

@keyframes cta-ring-float {
  0%,
  100% {
    opacity: 0.34;
    transform: translateY(0) scale(0.96);
  }

  50% {
    opacity: 0.7;
    transform: translateY(-8px) scale(1.04);
  }
}

@keyframes cta-sheen {
  0%,
  72%,
  100% {
    background-position: 120% 0;
  }

  88% {
    background-position: -20% 0;
  }
}

@keyframes hero-drift {
  from {
    transform: scale(1.04) translate3d(0, 0, 0);
  }

  to {
    transform: scale(1.1) translate3d(0, -0.5%, 0);
  }
}

@keyframes ambient-float {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }

  to {
    transform: translate3d(10px, -12px, 0) scale(1.06);
  }
}

@keyframes leaf-sway {
  0%,
  100% {
    transform: rotate(-12deg) translateY(0);
  }

  50% {
    transform: rotate(-17deg) translateY(-5px);
  }
}

@keyframes sparkle-float {
  0%,
  100% {
    opacity: 0.55;
    transform: translateY(0) rotate(0);
  }

  50% {
    opacity: 1;
    transform: translateY(-5px) rotate(12deg);
  }
}

@keyframes icon-ring {
  0% {
    opacity: 0.45;
    transform: scale(0.9);
  }

  75%,
  100% {
    opacity: 0;
    transform: scale(1.55);
  }
}

/* رعایت تنظیم کاهش حرکت سیستم کاربر */
@media (prefers-reduced-motion: reduce) {
  .support-page *,
  .support-page *::before,
  .support-page *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }

  .support-card:hover,
  .support-card:focus-visible,
  .support-search__shell:focus-within,
  .support-cta:hover .cta-icon-wrap,
  .support-contact-link:hover,
  .support-contact-link:focus-visible,
  .support-contact-link:active {
    transform: none !important;
  }

  .support-contact-link:hover .cta-arrow,
  .support-contact-link:focus-visible .cta-arrow {
    scale: 1;
  }
}
</style>