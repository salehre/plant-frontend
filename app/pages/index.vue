<script setup lang="ts">
import { getMockDiseases } from '~/services/mock/diseases.mock'

const plantStore = usePlantStore()
const blogStore = useBlogStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')
const diseases = computed(() => getMockDiseases(activeLocale.value))
const featured = computed(() => plantStore.featured)
const { status: homeStatus } = useAsyncData(
  'home-page-content',
  async () => {
    await Promise.all([
      plantStore.fetchFeatured(activeLocale.value, t('errors.featuredPlants')),
      blogStore.fetchFeatured(activeLocale.value, t('blog.errorList')),
    ])
    return true
  },
  { watch: [activeLocale] },
)
const homePending = computed(() => homeStatus.value === 'pending')
const homePagePending = useState('home-page-pending', () => true)
watch(homePending, (pending) => {
  homePagePending.value = pending
}, { immediate: true })
const featuredShown = computed(() => featured.value.slice(0, 4))

// بک‌گراند کارت تبلیغی بخش گیاهان شاخص؛ بعداً فقط مسیر همین عکس رو عوض کن
const featuredPromoImage = '/images/plants/header.webp'

const quickActions = [
  { to: '/identify', icon: 'lucide:scan-line', animation: 'scan', label: 'nav.identify', hint: 'home.quickHints.identify' },
  { to: '/my-plants', icon: 'lucide:sprout', animation: 'sprout', label: 'nav.myPlants', hint: 'home.quickHints.myPlants' },
  { to: '/care-calendar', icon: 'lucide:calendar-check', animation: 'calendar', label: 'nav.careCalendar', hint: 'home.quickHints.care' },
  { to: '/ai-doctor', icon: 'lucide:stethoscope', animation: 'doctor', label: 'nav.aiDoctor', hint: 'home.quickHints.aiDoctor' },
  { to: '/plants', icon: 'lucide:compass', animation: 'compass', label: 'nav.explore', hint: 'home.quickHints.catalog' },
]

function onHeroCtaMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  button.style.setProperty('--cta-x', `${(event.clientX - rect.left - rect.width / 2) * 0.1}px`)
  button.style.setProperty('--cta-y', `${(event.clientY - rect.top - rect.height / 2) * 0.14}px`)
}

function resetHeroCta(event: PointerEvent) {
  const button = event.currentTarget as HTMLElement
  button.style.setProperty('--cta-x', '0px')
  button.style.setProperty('--cta-y', '0px')
}

function rippleHeroCta(event: PointerEvent) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  button.style.setProperty('--ripple-x', `${event.clientX - rect.left}px`)
  button.style.setProperty('--ripple-y', `${event.clientY - rect.top}px`)
  button.classList.remove('is-rippling')
  void button.offsetWidth
  button.classList.add('is-rippling')
}

function onHeroCtaAnimationEnd(event: AnimationEvent) {
  if (event.animationName === 'hero-cta-ripple') {
    (event.currentTarget as HTMLElement).classList.remove('is-rippling')
  }
}
</script>

<template>
  <HomePageSkeleton v-if="homePending" />
  <div
    v-else
    class="flex flex-col gap-10"
  >
    <!-- ======= هیرو ======= -->
    <section
      class="relative overflow-hidden rounded-[19px] bg-primary-900 text-white"
    >
      <SkeletonImage
        src="/images/plants/header.webp"
        :alt="t('home.greenLeavesAlt')"
        loading="eager"
        fetchpriority="high"
        image-class="size-full object-cover object-center ltr:-scale-x-100"
        class="absolute inset-0"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-primary-900/45 to-primary-900/0 rtl:bg-gradient-to-l" />

      <div class="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div class="flex min-h-[240px] max-w-xl flex-col justify-center gap-5 py-8 sm:min-h-[340px] sm:py-12">
          <h1 class="text-2xl font-extrabold leading-tight sm:text-5xl">
            {{ t('home.heroTitle') }}
          </h1>
          <p class="max-w-md text-sm leading-7 text-white/80 sm:text-base">
            {{ t('home.heroSubtitle') }}
          </p>
          <div class="flex flex-wrap gap-3">
            <span class="hero-cta-shell relative inline-flex">
              <span class="hero-cta-ping" aria-hidden="true" />
              <NuxtLink
                to="/identify"
                class="hero-cta-link hero-cta-link--primary group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                @pointermove="onHeroCtaMove"
                @pointerleave="resetHeroCta"
                @pointerdown="rippleHeroCta"
                @animationend="onHeroCtaAnimationEnd"
              >
                <span class="hero-cta-scan" aria-hidden="true" />
                <span class="hero-cta-icon relative z-10 flex size-4 items-center justify-center">
                  <span class="hero-cta-icon-orbit" aria-hidden="true" />
                  <Icon name="lucide:scan-line" class="relative z-10 size-4" />
                </span>
                <span class="relative z-10">{{ t('home.identifyCta') }}</span>
                <Icon name="lucide:arrow-right" class="hero-cta-arrow relative z-10 size-4 rtl:-scale-x-100" />
              </NuxtLink>
            </span>
            <span class="hero-cta-shell hero-cta-shell--secondary relative hidden sm:inline-flex">
              <span class="hero-cta-ping" aria-hidden="true" />
              <NuxtLink
                to="/plants"
                class="hero-cta-link hero-cta-link--secondary group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-xl border border-white/40 px-5 py-2.5 text-sm font-medium text-white"
                @pointermove="onHeroCtaMove"
                @pointerleave="resetHeroCta"
                @pointerdown="rippleHeroCta"
                @animationend="onHeroCtaAnimationEnd"
              >
                <span class="hero-cta-scan" aria-hidden="true" />
                <span class="hero-cta-icon relative z-10 flex size-4 items-center justify-center">
                  <span class="hero-cta-icon-orbit" aria-hidden="true" />
                  <Icon name="lucide:compass" class="relative z-10 size-4" />
                </span>
                <span class="relative z-10">{{ t('nav.catalog') }}</span>
                <Icon name="lucide:arrow-right" class="hero-cta-arrow relative z-10 size-4 rtl:-scale-x-100" />
              </NuxtLink>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= دسترسی سریع ======= -->
     <section
    class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
    style="perspective: 1200px;"
  >
    <NuxtLink
      v-for="(action, idx) in quickActions"
      :key="action.to"
      :to="action.to"
      class="quick-action-card group relative flex flex-col items-center gap-3 overflow-visible rounded-[28px] border border-white/40 bg-white/10 p-5 text-center shadow-2xl shadow-black/[0.02] backdrop-blur-3xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-4 hover:scale-[1.04] hover:bg-white/30 hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.15),0_0_0_1px_rgba(255,255,255,0.5)_inset,_0_8px_24px_rgba(0,0,0,0.05)] active:scale-[0.96] active:duration-150 last:col-span-2 sm:last:col-span-1"
      :style="{ animationDelay: `${idx * 0.08}s` }"
    >
      <!-- نور نرم از پشت در hover -->
      <div
        class="pointer-events-none absolute -top-8 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-400/30 to-transparent opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <!-- درخشش سطح شیشه -->
      <div
        class="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-60"
      />

      <!-- پوسته آیکون -->
      <span
        class="quick-action-icon-shell relative z-10 flex size-[72px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-white/80 via-white/40 to-white/10 text-primary-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-white/30 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-[0_12px_24px_rgba(59,130,246,0.2)] group-hover:text-primary-700"
        :class="`shell--${action.animation}`"
      >
        <!-- ذرات مدار (Orbit) -->
        <template v-if="action.animation === 'orbit'">
          <span class="orbit-dot" style="animation-delay: 0s;" />
          <span class="orbit-dot" style="animation-delay: -1.3s;" />
          <span class="orbit-dot" style="animation-delay: -2.6s;" />
        </template>

        <!-- لیزر سینمایی -->
        <span
          v-if="action.animation === 'scan'"
          class="quick-action-scan-line"
          aria-hidden="true"
        />
        <span
          v-if="action.animation === 'scan'"
          class="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-primary-200/20 to-transparent"
        />

        <!-- هاله درخشان (Glow) -->
        <template v-if="action.animation === 'glow'">
          <span class="absolute inset-[-6px] rounded-[32px] bg-gradient-to-tr from-primary-300/60 via-fuchsia-300/40 to-rose-300/60 opacity-70 blur-xl" />
          <span class="absolute inset-[-3px] rounded-[28px] bg-gradient-to-tr from-primary-200/50 to-fuchsia-200/50 opacity-90 blur-lg" />
        </template>

        <!-- مرز چرخان گرادیان -->
        <span
          v-if="action.animation === 'gradient'"
          class="absolute inset-[-2px] -z-10 rounded-[28px] bg-gradient-to-tr from-blue-400 via-violet-400 to-rose-400 opacity-80"
          style="animation: rotate 3s linear infinite;"
        />

        <Icon
          :name="action.icon"
          class="quick-action-icon relative z-10 size-8 transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
          :class="`icon--${action.animation}`"
        />
      </span>

      <!-- متن -->
      <span
        class="relative z-10 flex flex-col gap-1 transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <span
          class="text-base font-black text-slate-800 transition-colors duration-300 group-hover:text-primary-700"
          :class="{ 'bg-gradient-to-r from-blue-600 via-violet-600 to-rose-500 bg-clip-text text-transparent': action.animation === 'gradient' }"
        >
          {{ t(action.label) }}
        </span>
        <span class="text-[11px] font-medium leading-tight text-slate-400/90 transition-colors duration-300 group-hover:text-slate-500">
          {{ t(action.hint) }}
        </span>
      </span>

      <!-- خط زیرین درخشان -->
      <div
        class="absolute bottom-4 left-1/2 h-[2px] w-12 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary-300 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </NuxtLink>
  </section>

    <!-- ======= گیاهان شاخص ======= -->
    <section class="glass-card p-4 sm:p-5">
      <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div class="min-w-0">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-bold text-ink">
                {{ t('home.featuredPlants') }}
              </h2>
              <p class="mt-1.5 text-base text-ink-muted">
                {{ t('home.featuredSubtitle') }}
              </p>
            </div>
            <NuxtLink
              to="/plants"
              class="shrink-0 text-sm font-semibold text-primary-700 hover:text-primary-600"
            >
              {{ t('common.seeAll') }}
            </NuxtLink>
          </div>

          <!-- اسلایدر Swiper: موبایل ~۱.۵ کارت | تبلت ۲.۴ | دسکتاپ ۳ کارت با فلش -->
          <AppSlider
            :items="featuredShown"
            :item-key="plant => plant.id"
            :breakpoints="{ 640: { slidesPerView: 2.4 }, 1024: { slidesPerView: 3 } }"
            class="-mx-4 px-4 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0"
          >
            <template #default="{ item: plant }">
              <NuxtLink
                :to="`/plants/${plant.slug}`"
                class="group flex h-full flex-col rounded-2xl border border-ink/5 bg-surface p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover lg:rounded-3xl lg:p-3.5"
              >
                <div class="relative aspect-[5/4] overflow-hidden rounded-xl bg-primary-50 lg:aspect-[4/3.4] lg:rounded-2xl">
                  <SkeletonImage
                    :src="plant.images[0]"
                    :alt="plant.name"
                    image-class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    class="absolute inset-0"
                  />
                  <div class="absolute end-2 top-2">
                    <WishlistButton
                      :slug="plant.slug"
                      compact
                    />
                  </div>
                </div>
                <div class="flex items-end justify-between gap-2 px-1.5 pb-1.5 pt-3.5 lg:px-2 lg:pb-2 lg:pt-4">
                  <div class="min-w-0">
                    <p class="truncate text-base font-bold text-ink lg:text-lg">
                      {{ plant.name }}
                    </p>
                    <p class="mt-1 truncate text-sm italic text-ink-muted lg:text-base">
                      {{ plant.scientificName }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </template>
          </AppSlider>
        </div>

        <!-- کارت تبلیغی با عکس پس‌زمینه -->
        <div class="relative isolate flex min-h-[260px] max-md:hidden flex-col justify-center overflow-hidden rounded-3xl p-8">
          <SkeletonImage
            :src="featuredPromoImage"
            alt=""
            image-class="size-full object-cover object-center"
            class="absolute inset-0 -z-20"
          />
          <div class="absolute inset-0 -z-10 bg-gradient-to-r from-surface/95 via-surface/75 to-surface/10 rtl:bg-gradient-to-l" />
          <h3 class="max-w-[15rem] text-3xl font-extrabold leading-snug text-ink">
            {{ t('home.promoTitle') }}
          </h3>
          <p class="mt-4 max-w-[14rem] text-base leading-7 text-ink-muted">
            {{ t('home.promoText') }}
          </p>
          <NuxtLink
            to="/care-calendar"
            class="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-800"
          >
            {{ t('home.promoCta') }}
            <Icon
              name="lucide:arrow-right"
              class="size-4 rtl:-scale-x-100"
            />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Plant Finder -->
    <section>
      <PlantFinder />
    </section>

    <!-- سوالات متداول -->
    <FaqSection />

    <!-- مشکلات رایج -->
    <section>
      <h2 class="mb-4 text-lg font-bold text-ink">
        {{ t('home.popularDiseases') }}
      </h2>
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <NuxtLink
          v-for="disease in diseases"
          :key="disease.id"
          to="/identify"
          class="glass-card flex flex-col gap-3 p-2.5"
        >
          <SkeletonImage
            :src="disease.image"
            :alt="disease.name"
            image-class="size-full object-cover"
            class="h-28 w-full rounded-xl"
          />
          <span class="px-1.5 pb-1 text-sm font-bold text-ink">{{ disease.name }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- بلاگ -->
    <BlogSection />

    <IdentifySteps />
  </div>
</template>

<style scoped>
.quick-action-card {
  transition:
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.quick-action-card:hover,
.quick-action-card:focus-visible {
  transform: translateY(-3px);
}

.quick-action-icon-shell {
  overflow: hidden;
}

.quick-action-scan-line {
  position: absolute;
  z-index: 1;
  inset-inline: 20%;
  top: 18%;
  height: 2px;
  border-radius: 9999px;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
  opacity: 0;
}

.quick-action-card:hover .quick-action-icon--scan,
.quick-action-card:focus-visible .quick-action-icon--scan {
  animation: quick-scan-icon 1s ease-in-out infinite;
}

.quick-action-card:hover .quick-action-scan-line,
.quick-action-card:focus-visible .quick-action-scan-line {
  animation: quick-scan-line 1s ease-in-out infinite;
}

@keyframes quick-scan-icon {
  50% {
    transform: scale(1.08);
  }
}

@keyframes quick-scan-line {
  0% {
    top: 18%;
    opacity: 0;
  }

  20%,
  80% {
    opacity: 1;
  }

  100% {
    top: 78%;
    opacity: 0;
  }
}

.quick-action-card:hover .quick-action-icon--sprout,
.quick-action-card:focus-visible .quick-action-icon--sprout {
  animation: quick-sprout-grow 650ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes quick-sprout-grow {
  0% {
    transform: scale(0.8) rotate(-8deg);
  }

  60% {
    transform: scale(1.18) rotate(6deg);
  }

  100% {
    transform: scale(1) rotate(0);
  }
}

.quick-action-card:hover .quick-action-icon--calendar,
.quick-action-card:focus-visible .quick-action-icon--calendar {
  animation: quick-calendar-check 650ms ease-out;
}

@keyframes quick-calendar-check {
  0% {
    transform: translateY(0) scale(1);
  }

  40% {
    transform: translateY(-3px) scale(1.12);
  }

  65% {
    transform: translateY(1px) scale(0.95);
  }

  100% {
    transform: translateY(0) scale(1);
  }
}

.quick-action-card:hover .quick-action-icon--doctor,
.quick-action-card:focus-visible .quick-action-icon--doctor {
  animation: quick-doctor-pulse 800ms ease-in-out infinite;
}

@keyframes quick-doctor-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.12);
  }
}

.quick-action-card:hover .quick-action-icon--compass,
.quick-action-card:focus-visible .quick-action-icon--compass {
  animation: quick-compass-turn 700ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes quick-compass-turn {
  from {
    transform: rotate(-35deg) scale(0.9);
  }

  to {
    transform: rotate(0) scale(1);
  }
}

.hero-cta-link {
  --cta-x: 0px;
  --cta-y: 0px;
  --ripple-x: 50%;
  --ripple-y: 50%;
  translate: var(--cta-x) var(--cta-y);
  transition: translate 160ms ease-out, background-color 280ms ease, box-shadow 280ms ease, scale 180ms ease;
}

.hero-cta-link--primary {
  background-color: rgb(var(--color-primary-500));
  box-shadow: 0 10px 24px rgb(0 0 0 / 0.18), 0 0 0 1px rgb(255 255 255 / 0.08);
}

.hero-cta-link--primary:hover {
  background-color: rgb(var(--color-primary-400));
  box-shadow: 0 15px 32px rgb(0 0 0 / 0.24), 0 0 0 1px rgb(255 255 255 / 0.12);
}

.hero-cta-link--secondary {
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.12);
}

.hero-cta-link--secondary:hover {
  background-color: rgb(255 255 255 / 0.1);
}

.hero-cta-link:active {
  scale: 0.97;
}

.hero-cta-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgb(30 58 138), 0 0 0 5px rgb(147 197 253);
}

.hero-cta-link::after {
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

.hero-cta-link.is-rippling::after {
  animation: hero-cta-ripple 620ms ease-out;
}

@keyframes hero-cta-ripple {
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(18);
  }
}

.hero-cta-scan {
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
  animation: hero-cta-scan 3.2s 1.2s ease-in-out infinite;
}

.hero-cta-shell--secondary .hero-cta-scan {
  animation-delay: 2.8s;
}

@keyframes hero-cta-scan {
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

.hero-cta-ping {
  position: absolute;
  inset: -6px;
  border: 1px solid rgb(147 197 253 / 0.32);
  border-radius: 16px;
  pointer-events: none;
  animation: hero-cta-ping 2.8s ease-out infinite;
}

.hero-cta-shell--secondary .hero-cta-ping {
  animation-delay: 1.4s;
}

@keyframes hero-cta-ping {
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

.hero-cta-icon-orbit {
  position: absolute;
  inset: -3px;
  border: 1px solid rgb(255 255 255 / 0.4);
  border-radius: 50%;
  opacity: 0;
}

.hero-cta-link:hover .hero-cta-icon-orbit {
  animation: hero-cta-icon-orbit 700ms ease-out;
}

.hero-cta-link:hover .hero-cta-arrow {
  animation: hero-cta-arrow 650ms ease-in-out infinite alternate;
}

@keyframes hero-cta-icon-orbit {
  from {
    opacity: 0.8;
    transform: scale(0.6) rotate(0);
  }

  to {
    opacity: 0;
    transform: scale(1.5) rotate(180deg);
  }
}

@keyframes hero-cta-arrow {
  to {
    translate: 3px 0;
  }
}

:global([dir='rtl']) .hero-cta-link:hover .hero-cta-arrow {
  animation-name: hero-cta-arrow-rtl;
}

@keyframes hero-cta-arrow-rtl {
  to {
    translate: -3px 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quick-action-card,
  .quick-action-card:hover,
  .quick-action-card:focus-visible {
    transform: none;
    transition: none;
  }

  .quick-action-card *,
  .quick-action-card *::before,
  .quick-action-card *::after {
    animation: none !important;
  }

  .hero-cta-link,
  .hero-cta-link *,
  .hero-cta-link::after,
  .hero-cta-ping {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }

  .hero-cta-link {
    translate: none !important;
  }
}

/* ---------- ورود سینمایی (Stagger) ---------- */
.quick-action-card {
  opacity: 0;
  transform: translateY(30px) rotateX(12deg);
  animation: cardReveal 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes cardReveal {
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

/* ---------- چرخش مرز گرادیان ---------- */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ---------- اسکن لیزری پیشرفته ---------- */
.quick-action-scan-line {
  position: absolute;
  left: 8px;
  right: 8px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    transparent,
    #60a5fa,
    #93c5fd,
    #38bdf8,
    #60a5fa,
    transparent
  );
  box-shadow:
    0 0 10px 2px #60a5fa,
    0 0 20px 4px rgba(96, 165, 250, 0.5),
    0 0 30px 6px rgba(96, 165, 250, 0.2);
  z-index: 20;
  animation: laserMove 1.4s ease-in-out infinite alternate;
}

@keyframes laserMove {
  0% {
    top: 18%;
    opacity: 0.5;
    filter: brightness(0.8);
  }
  100% {
    top: 78%;
    opacity: 1;
    filter: brightness(1.3);
  }
}

/* ---------- ذرات مدار (Orbit) ---------- */
.orbit-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  margin: -3.5px 0 0 -3.5px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #ffffff, #3b82f6);
  box-shadow: 0 0 6px 1px #60a5fa, 0 0 10px 2px rgba(59, 130, 246, 0.7);
  animation: orbitMove 3.5s linear infinite;
}

.orbit-dot:nth-child(2) { animation-delay: -1.3s; animation-duration: 4.2s; }
.orbit-dot:nth-child(3) { animation-delay: -2.6s; animation-duration: 5s; }

@keyframes orbitMove {
  from {
    transform: rotate(0deg) translateX(22px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(22px) rotate(-360deg);
  }
}

/* ---------- انیمیشن‌های آیکون ---------- */
.icon--scan {
  animation: scanHeart 2s ease-in-out infinite;
}
@keyframes scanHeart {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.06) translateY(-1px); }
}

.icon--glow {
  filter: drop-shadow(0 0 6px rgba(236, 72, 153, 0.6))
          drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
  animation: glowPulse 2.5s ease-in-out infinite;
}
@keyframes glowPulse {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(236,72,153,0.5))
            drop-shadow(0 0 8px rgba(59,130,246,0.4));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(236,72,153,0.9))
            drop-shadow(0 0 16px rgba(59,130,246,0.8));
  }
}

.icon--orbit {
  animation: floatWobble 2.4s ease-in-out infinite;
}
@keyframes floatWobble {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-3px) rotate(3deg); }
}

.icon--gradient {
  background: linear-gradient(110deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientSlide 3s linear infinite;
}
@keyframes gradientSlide {
  to { background-position: 200% center; }
}

.icon--magnetic {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.group:hover .icon--magnetic {
  transform: translateY(-8px) scale(1.18) rotate(-6deg);
}

/* ---------- سازگاری با گرادیان (نباید ببُرد) ---------- */
.shell--gradient {
  overflow: visible !important;
}

/* ---------- کاهش حرکت برای دسترسی ---------- */
@media (prefers-reduced-motion: reduce) {
  .quick-action-card,
  .quick-action-scan-line,
  .orbit-dot,
  .icon--scan,
  .icon--glow,
  .icon--orbit,
  .icon--gradient,
  .icon--magnetic {
    animation: none !important;
    transition: none !important;
  }
  .quick-action-card {
    opacity: 1;
    transform: none;
  }
}
</style>