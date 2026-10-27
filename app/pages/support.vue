<script setup lang="ts">
import type { Directive } from 'vue'

definePageMeta({ layout: 'default' })

const { t, te, locale } = useI18n()
useHead(() => ({ title: t('support.nav') }))

// تعداد سؤال‌ها باید با آرایه‌ی home.faq.items در fa.json و en.json یکی باشد.
const FAQ_COUNT = 6

const topics = computed(() =>
  Array.from({ length: FAQ_COUNT }, (_, id) => ({
    id,
    q: t(`home.faq.items[${id}].q`),
    a: t(`home.faq.items[${id}].a`),
  })),
)

const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const filtered = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase()

  if (!normalizedQuery) return topics.value

  return topics.value.filter(({ q, a }) =>
    `${q} ${a}`.toLocaleLowerCase().includes(normalizedQuery),
  )
})

const openIndex = ref<number | null>(null)

function toggle(id: number) {
  openIndex.value = openIndex.value === id ? null : id
}

function clearQuery() {
  query.value = ''
  searchInput.value?.focus()
}

// اگر سؤال بازشده با جستجو از نتایج حذف شد، آکاردئون آن بسته شود.
watch(filtered, (items) => {
  if (
    openIndex.value !== null
    && !items.some(item => item.id === openIndex.value)
  ) {
    openIndex.value = null
  }
})

// کلید اختیاری support.clearSearch — اگر در فایل ترجمه نباشد از متن پیش‌فرض استفاده می‌شود
const clearSearchLabel = computed(() =>
  te('support.clearSearch')
    ? t('support.clearSearch')
    : locale.value.startsWith('fa') ? 'پاک کردن جستجو' : 'Clear search',
)

const cards = [
  { to: '/terms', icon: 'lucide:scroll-text', title: 'components.theFooter.terms', hint: 'support.cards.termsHint' },
  { to: '/blog', icon: 'lucide:book-open', title: 'pages.blog.title', hint: 'support.cards.guideHint' },
  { to: '/contact', icon: 'lucide:messages-square', title: 'contact.title', hint: 'support.cards.contactHint' },
  { to: '/tickets/new', icon: 'lucide:triangle-alert', title: 'tickets.newTicket', hint: 'support.cards.reportHint' },
]

// دایرکتیو v-reveal: وقتی عنصر وارد دید کاربر شد، با انیمیشن نمایش داده می‌شود
const revealObservers = new WeakMap<HTMLElement, IntersectionObserver>()

const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (typeof binding.value === 'number') {
      el.style.setProperty('--reveal-delay', `${binding.value}ms`)
    }
    if (!('IntersectionObserver' in window)) {
      el.classList.add('reveal--in')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('reveal--in')
            observer.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    revealObservers.set(el, observer)
  },
  unmounted(el) {
    revealObservers.get(el)?.disconnect()
    revealObservers.delete(el)
  },
}
</script>

<template>
  <div class="support-page mx-auto flex max-w-6xl flex-col gap-8">
    <!-- هیرو و جستجو -->
    <section class="support-hero relative overflow-hidden rounded-[19px] bg-primary-900 text-white">
      <img
        src="/images/plants/header.webp"
        alt=""
        aria-hidden="true"
        class="hero-bg pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      >
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/70 to-primary-900/30" />

      <!-- هاله‌های نور شناور -->
      <div aria-hidden="true" class="hero-glow hero-glow--1" />
      <div aria-hidden="true" class="hero-glow hero-glow--2" />

      <div class="relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 sm:py-14">
        <h1 class="hero-anim hero-anim--1 text-2xl font-extrabold sm:text-4xl">
          {{ t('support.title') }}
        </h1>

        <p class="hero-anim hero-anim--2 max-w-xl text-sm leading-7 text-white/80">
          {{ t('support.subtitle') }}
        </p>

        <form
          class="hero-anim hero-anim--3 hero-search relative max-w-2xl rounded-xl bg-surface shadow-xl shadow-black/10 ring-1 ring-white/20"
          role="search"
          :aria-label="t('support.searchPlaceholder')"
          @submit.prevent
        >
          <input
            ref="searchInput"
            v-model="query"
            type="search"
            name="q"
            autocomplete="off"
            :aria-label="t('support.searchPlaceholder')"
            :placeholder="t('support.searchPlaceholder')"
            class="h-12 w-full rounded-xl border-0 bg-transparent ps-4 text-sm text-ink outline-none transition-[padding] duration-300 placeholder:text-ink-muted/70"
            :class="query ? 'pe-20' : 'pe-12'"
          >
          <Icon
            name="lucide:search"
            aria-hidden="true"
            class="search-icon pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-ink-muted"
          />
          <Transition name="pop">
            <button
              v-if="query"
              type="button"
              :aria-label="clearSearchLabel"
              class="clear-btn absolute end-11 top-1/2 flex size-6 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/10 hover:text-ink"
              @click="clearQuery"
            >
              <Icon
                name="lucide:x"
                aria-hidden="true"
                class="size-3.5"
              />
            </button>
          </Transition>
        </form>
      </div>
    </section>

    <!-- کارت‌های دسترسی -->
    <section class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <NuxtLink
        v-for="(card, index) in cards"
        :key="card.to"
        :to="card.to"
        :style="{ '--d': `${350 + index * 90}ms` }"
        class="support-card glass-card group relative flex flex-col gap-3 overflow-hidden p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
      >
        <span class="flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-600/30 dark:bg-primary-900/40 dark:text-primary-300">
          <Icon
            :name="card.icon"
            aria-hidden="true"
            class="size-5"
          />
        </span>
        <span>
          <span class="block text-sm font-bold text-ink">{{ t(card.title) }}</span>
          <span class="mt-0.5 block text-xs leading-5 text-ink-muted">{{ t(card.hint) }}</span>
        </span>
      </NuxtLink>
    </section>

    <!-- پرسش‌های پرتکرار -->
    <section
      id="topics"
      v-reveal
      class="scroll-mt-24"
      aria-labelledby="support-topics-heading"
    >
      <h2
        id="support-topics-heading"
        class="mb-3 text-lg font-bold text-ink"
      >
        {{ t('support.popularTopics') }}
      </h2>

      <Transition
        name="result-state"
        mode="out-in"
      >
        <div
          v-if="filtered.length"
          key="faq-results"
          class="glass-card overflow-hidden"
        >
          <TransitionGroup
            name="faq-list"
            tag="div"
            class="faq-items divide-y divide-ink/5"
            appear
          >
            <div
              v-for="(item, index) in filtered"
              :key="item.id"
              :style="{ '--i': index }"
            >
              <button
                :id="`topic-trigger-${item.id}`"
                type="button"
                class="group flex w-full items-center gap-3 px-4 py-4 text-start transition-colors duration-300 hover:bg-primary-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-600 dark:hover:bg-primary-900/20"
                :class="{ 'bg-primary-50/60 dark:bg-primary-900/25': openIndex === item.id }"
                :aria-expanded="openIndex === item.id"
                :aria-controls="`topic-panel-${item.id}`"
                @click="toggle(item.id)"
              >
                <span
                  aria-hidden="true"
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]"
                  :class="openIndex === item.id
                    ? '-rotate-6 scale-105 bg-primary-600 text-white shadow-md shadow-primary-600/30'
                    : 'bg-primary-50 text-primary-700 group-hover:scale-105 dark:bg-primary-900/40 dark:text-primary-300'"
                >
                  <Icon
                    name="lucide:circle-help"
                    class="size-5"
                  />
                </span>

                <span
                  class="flex-1 text-sm font-bold transition-colors duration-300"
                  :class="openIndex === item.id ? 'text-primary-700 dark:text-primary-300' : 'text-ink'"
                >
                  {{ item.q }}
                </span>

                <Icon
                  name="lucide:chevron-down"
                  aria-hidden="true"
                  class="size-4 shrink-0 text-ink-muted transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]"
                  :class="{ 'rotate-180': openIndex === item.id }"
                />
              </button>

              <div
                :id="`topic-panel-${item.id}`"
                class="topic-panel"
                :class="{ 'topic-panel--open': openIndex === item.id }"
                :aria-hidden="openIndex !== item.id"
                :aria-labelledby="`topic-trigger-${item.id}`"
                role="region"
              >
                <div class="topic-panel__inner min-h-0 overflow-hidden">
                  <p class="px-4 pb-4 ps-[4.25rem] text-sm leading-7 text-ink-muted">
                    {{ item.a }}
                  </p>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <div
          v-else
          key="no-results"
          role="status"
          class="glass-card flex flex-col items-center gap-3 px-4 py-10 text-center"
        >
          <span class="no-results-icon flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
            <Icon
              name="lucide:search-x"
              aria-hidden="true"
              class="size-6"
            />
          </span>
          <p class="text-sm text-ink-muted">
            {{ t('support.noResults') }}
          </p>
        </div>
      </Transition>
    </section>

    <!-- هنوز کمک می‌خوای؟ -->
    <section
      v-reveal="80"
      class="support-cta relative isolate overflow-hidden rounded-2xl bg-primary-50 p-5 dark:bg-primary-900/30 sm:p-6"
    >
      <Icon
        name="lucide:leaf"
        aria-hidden="true"
        class="cta-leaf pointer-events-none absolute -bottom-4 -start-4 size-28 text-primary-200/60"
      />

      <div class="relative flex flex-wrap items-center gap-4">
        <span class="cta-icon-wrap relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface text-primary-700">
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
          <p class="text-sm text-ink-muted">
            {{ t('support.stillNeedHelpText') }}
          </p>
        </div>

        <NuxtLink
          to="/contact"
          class="support-contact-link inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          {{ t('components.theFooter.contact') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ---------- کی‌فریم‌ها ---------- */
@keyframes rise-blur {
  0% {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
    filter: blur(10px);
  }

  60% {
    filter: blur(0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    filter: blur(0);
  }
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: translateY(26px) scale(0.94);
  }

  55% {
    opacity: 1;
  }

  75% {
    transform: translateY(-4px) scale(1.01);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes hero-drift {
  from {
    transform: scale(1.12) translateY(-2%);
  }

  to {
    transform: scale(1.02) translateY(0);
  }
}

@keyframes glow-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(14px, -14px) scale(1.1);
  }
}

@keyframes leaf-float {
  0%,
  100% {
    transform: rotate(-12deg) translate(0, 0);
  }

  50% {
    transform: rotate(-5deg) translate(6px, -12px);
  }
}

@keyframes headset-bob {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  30% {
    transform: translateY(-2px) rotate(-6deg);
  }

  60% {
    transform: translateY(0) rotate(4deg);
  }
}

@keyframes ring-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 30%, transparent);
  }

  70%,
  100% {
    box-shadow: 0 0 0 14px transparent;
  }
}

@keyframes icon-wobble {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-20deg);
  }

  60% {
    opacity: 1;
    transform: scale(1.12) rotate(6deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* ---------- هیرو ---------- */
.support-hero {
  isolation: isolate;
}

.hero-bg {
  will-change: transform;
  animation: hero-drift 2.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-glow {
  position: absolute;
  border-radius: 9999px;
  filter: blur(70px);
  pointer-events: none;
}

.hero-glow--1 {
  top: -6rem;
  background: rgb(255 255 255 / 14%);
  animation: glow-float 9s ease-in-out infinite;
  inline-size: 18rem;
  block-size: 18rem;
  inset-inline-end: 8%;
}

.hero-glow--2 {
  bottom: -5rem;
  background: rgb(74 222 128 / 18%);
  animation: glow-float 11s ease-in-out 1.4s infinite reverse;
  inline-size: 14rem;
  block-size: 14rem;
  inset-inline-start: 12%;
}

.hero-anim {
  animation: rise-blur 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.hero-anim--1 {
  animation-delay: 0.08s;
}

.hero-anim--2 {
  animation-delay: 0.2s;
}

.hero-anim--3 {
  animation-delay: 0.34s;
}

/* ---------- جستجو ---------- */
.hero-search {
  transition:
    transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1),
    box-shadow 0.35s ease;
}

.hero-search:focus-within {
  transform: translateY(-2px);
  box-shadow:
    0 0 0 4px rgb(255 255 255 / 22%),
    0 24px 48px -12px rgb(0 0 0 / 35%);
}

/* دکمه‌ی پاک‌کردن پیش‌فرض مرورگر مخفی شود تا با دکمه‌ی سفارشی تداخل نکند */
.hero-search input[type='search']::-webkit-search-cancel-button {
  display: none;
}

.search-icon {
  transition:
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    color 0.3s ease;
}

.hero-search:focus-within .search-icon {
  transform: translateY(-50%) scale(1.15);
}

.clear-btn {
  transform: translateY(-50%);
}

.pop-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pop-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.4) rotate(-90deg);
}

/* ---------- کارت‌ها ---------- */
.support-card {
  will-change: transform;
  animation: pop-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--d, 0ms);
  transition:
    transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1),
    box-shadow 0.35s ease;
}

/* برق کشویی (sheen) هنگام هاور */
.support-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(115deg, transparent 32%, rgb(255 255 255 / 50%) 50%, transparent 68%);
  transform: translateX(-130%);
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

:global(.dark) .support-card::before {
  background: linear-gradient(115deg, transparent 32%, rgb(255 255 255 / 10%) 50%, transparent 68%);
}

@media (hover: hover) and (pointer: fine) {
  .support-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px -14px rgb(15 23 42 / 22%);
  }

  .support-card:hover::before {
    transform: translateX(130%);
  }
}

.support-card:active {
  transform: translateY(-1px) scale(0.97);
  transition-duration: 0.08s;
}

/* ---------- آکاردئون ---------- */
.faq-items {
  position: relative;
}

.faq-list-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--i, 0) * 40ms);
}

.faq-list-leave-active {
  position: absolute;
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
  inset-inline: 0;
}

.faq-list-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.99);
}

.faq-list-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.faq-list-move {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.topic-panel {
  display: grid;
  opacity: 0;
  grid-template-rows: 0fr;
  transition:
    grid-template-rows 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.25s ease;
}

.topic-panel--open {
  opacity: 1;
  grid-template-rows: 1fr;
}

.topic-panel__inner {
  min-height: 0;
  overflow: hidden;
}

.topic-panel__inner > p {
  opacity: 0;
  transform: translateY(-8px);
  transition:
    opacity 0.3s ease 0.06s,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.06s;
}

.topic-panel--open .topic-panel__inner > p {
  opacity: 1;
  transform: translateY(0);
}

/* ---------- تعویض وضعیت نتیجه / عدم نتیجه ---------- */
.result-state-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.result-state-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.result-state-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.99);
}

.result-state-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.99);
}

.no-results-icon {
  animation: icon-wobble 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
}

/* ---------- نمایش هنگام اسکرول ---------- */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  filter: blur(6px);
  transition:
    opacity 0.7s ease var(--reveal-delay, 0ms),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms),
    filter 0.7s ease var(--reveal-delay, 0ms);
}

.reveal--in {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* ---------- CTA ---------- */
.cta-leaf {
  animation: leaf-float 7s ease-in-out infinite;
}

.cta-icon-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  animation: ring-pulse 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  pointer-events: none;
}

.cta-headset {
  animation: headset-bob 3.2s ease-in-out infinite;
}

.support-contact-link {
  position: relative;
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1),
    box-shadow 0.3s ease,
    background-color 0.3s ease;
}

.support-contact-link::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 35%, rgb(255 255 255 / 30%) 50%, transparent 65%);
  transform: translateX(-130%);
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.support-contact-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px -10px rgb(21 128 61 / 50%);
}

.support-contact-link:hover::after {
  transform: translateX(130%);
}

.support-contact-link:active {
  transform: translateY(0) scale(0.96);
}

/* ---------- کاهش حرکت برای کاربران حساس ---------- */
@media (prefers-reduced-motion: reduce) {
  .support-page *,
  .support-page *::before,
  .support-page *::after {
    transition-delay: 0ms !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }

  .reveal {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}
</style>