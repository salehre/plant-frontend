<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getMockDiseases } from '~/services/mock/diseases.mock'

const homeRoot = ref<HTMLElement | null>(null)
let revealObserver: IntersectionObserver | null = null
let revealSetupStarted = false

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

async function setupSectionReveal() {
  if (revealSetupStarted) return
  revealSetupStarted = true

  await nextTick()
  const root = homeRoot.value
  if (!root) {
    revealSetupStarted = false
    return
  }

  const targets = Array.from(root.children).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  )

  targets.forEach((element, index) => {
    element.classList.add('home-section-reveal')
    element.style.setProperty('--reveal-delay', `${(index % 5) * 60}ms`)
  })

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    targets.forEach(element => element.classList.add('is-visible'))
    return
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
  )

  targets.forEach(element => revealObserver?.observe(element))
}

watch(homePending, (pending) => {
  if (!pending) setupSectionReveal()
}, { flush: 'post' })

onMounted(() => {
  if (!homePending.value) setupSectionReveal()
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})

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
    ref="homeRoot"
    class="home-page flex flex-col gap-10"
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
      class="quick-action-card glass-card group relative flex flex-col items-center gap-3 overflow-visible rounded-[28px] p-5 text-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-primary-500/30 hover:scale-[1.02] active:scale-[0.98] active:duration-150 last:col-span-2 sm:last:col-span-1"
      :style="{ animationDelay: `${idx * 0.08}s` }"
    >
      <!-- نور نرم از پشت در hover -->
      <div
        class="pointer-events-none absolute -top-8 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-400/30 to-transparent opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <!-- درخشش سطح شیشه -->
      <div
        class="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-primary-500/[0.06] via-transparent to-transparent opacity-60"
      />

      <!-- پوسته آیکون -->
      <span
        class="quick-action-icon-shell relative z-10 flex size-[72px] items-center justify-center overflow-hidden rounded-3xl bg-primary-50 text-primary-700 shadow-card ring-1 ring-primary-500/10 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-primary-100 group-hover:shadow-card-hover group-hover:text-primary-800"
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
          <span class="absolute inset-[-6px] rounded-[32px] bg-gradient-to-tr from-primary-300/40 via-primary-200/30 to-accent-300/30 opacity-70 blur-xl" />
          <span class="absolute inset-[-3px] rounded-[28px] bg-gradient-to-tr from-primary-200/40 to-accent-200/40 opacity-90 blur-lg" />
        </template>

        <!-- مرز چرخان گرادیان -->
        <span
          v-if="action.animation === 'gradient'"
          class="absolute inset-[-2px] -z-10 rounded-[28px] bg-gradient-to-tr from-primary-400 via-primary-500 to-accent-400 opacity-80"
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
          class="text-base font-black text-ink transition-colors duration-300 group-hover:text-primary-700"
          :class="{ 'bg-gradient-to-r from-primary-700 via-primary-500 to-accent-600 bg-clip-text text-transparent': action.animation === 'gradient' }"
        >
          {{ t(action.label) }}
        </span>
        <span class="text-[11px] font-medium leading-tight text-ink-muted transition-colors duration-300 group-hover:text-ink">
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
<section class="diseases-section relative overflow-hidden">
  <!-- پس‌زمینه با پالس‌های محو (حس هشدار ملایم) -->
  <div class="disease-ambient absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
    <span class="ambient-pulse pulse-1" />
    <span class="ambient-pulse pulse-2" />
    <span class="ambient-pulse pulse-3" />
  </div>

  <h2 class="section-title mb-4 text-lg font-bold text-ink">
    {{ t('home.popularDiseases') }}
  </h2>
  
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <NuxtLink
      v-for="(disease, index) in diseases"
      :key="disease.id"
      to="/identify"
      class="disease-card glass-card group relative flex flex-col gap-3 overflow-hidden p-2.5"
      :style="{ '--card-index': index }"
    >
      <!-- افکت اسکن لیزری روی کارت -->
      <span class="scan-line absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-status-danger/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <!-- هاله قرمز/هشداردهنده دور کارت -->
      <div class="disease-glow absolute -inset-px rounded-[inherit] bg-gradient-to-tr from-status-danger/0 via-status-danger/0 to-status-danger/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <!-- کانتینر تصویر با افکت‌ها -->
      <div class="image-wrapper relative overflow-hidden rounded-xl">
        <SkeletonImage
          :src="disease.image"
          :alt="disease.name"
          image-class="disease-image size-full object-cover transition-transform duration-700 ease-out"
          class="h-28 w-full"
        />
        
        <!-- لایه قرمز شفاف روی تصویر (حس بیماری/هشدار) -->
        <div class="image-overlay absolute inset-0 bg-gradient-to-t from-status-danger/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <!-- ذرات معلق روی تصویر -->
        <div class="spores absolute inset-0 pointer-events-none">
          <span class="spore spore-1" />
          <span class="spore spore-2" />
          <span class="spore spore-3" />
        </div>

        <!-- بج "شناسایی سریع" -->
        <span class="identify-badge absolute end-2 top-2 inline-flex items-center gap-1 rounded-md bg-status-danger/90 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <Icon name="lucide:microscope" class="size-2.5" />
          شناسایی
        </span>
      </div>

      <!-- نام بیماری -->
      <span class="disease-name relative px-1.5 pb-1 text-sm font-bold text-ink transition-colors duration-300 group-hover:text-status-danger">
        {{ disease.name }}
        <!-- خط زیرین انیمیشنی -->
        <span class="name-underline absolute bottom-0 start-0 h-0.5 w-0 bg-status-danger transition-all duration-500 group-hover:w-full" />
      </span>

      <!-- فلش جهت‌نما -->
      <Icon
        name="lucide:arrow-up-right"
        class="card-arrow absolute end-2 top-2 size-4 text-status-danger opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
      />
    </NuxtLink>
  </div>
</section>

    <!-- بلاگ -->
    <BlogSection />

    <IdentifySteps />
  </div>
</template>

<style scoped>
.home-page .home-section-reveal {
  opacity: 0;
  transform: translate3d(0, 22px, 0) scale(0.985);
  transition:
    opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}

.home-page .home-section-reveal.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .home-page .home-section-reveal,
  .home-page .home-section-reveal.is-visible {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

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
    rgb(var(--color-primary-300)),
    rgb(var(--color-primary-200)),
    rgb(var(--color-primary-400)),
    rgb(var(--color-primary-300)),
    transparent
  );
  box-shadow:
    0 0 10px 2px rgb(var(--color-primary-400) / 0.8),
    0 0 20px 4px rgb(var(--color-primary-400) / 0.5),
    0 0 30px 6px rgb(var(--color-primary-400) / 0.2);
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
  background: radial-gradient(circle at 35% 35%, rgb(var(--color-surface)), rgb(var(--color-primary-500)));
  box-shadow: 0 0 6px 1px rgb(var(--color-primary-400)), 0 0 10px 2px rgb(var(--color-primary-500) / 0.7);
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
  filter: drop-shadow(0 0 6px rgb(var(--color-accent-400) / 0.6))
          drop-shadow(0 0 10px rgb(var(--color-primary-400) / 0.5));
  animation: glowPulse 2.5s ease-in-out infinite;
}
@keyframes glowPulse {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgb(var(--color-accent-400) / 0.5))
            drop-shadow(0 0 8px rgb(var(--color-primary-400) / 0.4));
  }
  50% {
    filter: drop-shadow(0 0 12px rgb(var(--color-accent-400) / 0.9))
            drop-shadow(0 0 16px rgb(var(--color-primary-400) / 0.8));
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
  background: linear-gradient(110deg, rgb(var(--color-primary-400)) 0%, rgb(var(--color-primary-600)) 50%, rgb(var(--color-accent-500)) 100%);
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

/* ===================================================
   1. پس‌زمینهambient با پالس‌های هشداردهنده
   =================================================== */
.diseases-section {
  position: relative;
  animation: sectionReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.disease-ambient {
  overflow: hidden;
}

.ambient-pulse {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%);
  animation: ambientPulse 8s ease-in-out infinite;
}

.pulse-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -100px;
  animation-delay: 0s;
}

.pulse-2 {
  width: 250px;
  height: 250px;
  bottom: -100px;
  right: -50px;
  animation-delay: -3s;
}

.pulse-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  animation-delay: -6s;
}

@keyframes ambientPulse {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(20px, -15px) scale(1.15);
    opacity: 0.8;
  }
}

/* ===================================================
   2. عنوان بخش
   =================================================== */
.section-title {
  animation: titleSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ef4444, #f87171);
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  animation: titleUnderline 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
}

:dir(rtl) .section-title::after {
  transform-origin: right;
}

@keyframes titleSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes titleUnderline {
  to {
    transform: scaleX(1);
  }
}

/* ===================================================
   3. کارت‌های بیماری - ورود آبشاری
   =================================================== */
.disease-card {
  --card-index: 0;
  
  opacity: 0;
  transform: translateY(20px) scale(0.96);
  animation: cardEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(0.3s + var(--card-index, 0) * 0.1s);
  
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.4s ease,
    background-color 0.3s ease;
  
  will-change: transform;
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.disease-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow:
    0 20px 40px -12px rgba(239, 68, 68, 0.15),
    0 8px 16px -4px rgba(0, 0, 0, 0.08);
}

.disease-card:active {
  transform: translateY(-2px) scale(0.98);
  transition-duration: 0.1s;
}

/* ===================================================
   4. اسکن لیزری قرمز
   =================================================== */
.scan-line {
  z-index: 10;
  animation: scanMove 2s ease-in-out infinite;
  animation-play-state: paused;
}

.disease-card:hover .scan-line {
  animation-play-state: running;
}

@keyframes scanMove {
  0%, 100% {
    top: 0%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  50% {
    top: 100%;
  }
}

/* ===================================================
   5. هاله هشداردهنده دور کارت
   =================================================== */
.disease-glow {
  z-index: 5;
  transition: background 0.5s ease;
}

.disease-card:hover .disease-glow {
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(239, 68, 68, 0.12),
    transparent 40%
  );
}

/* ===================================================
   6. تصویر بیماری + زوم + ذرات
   =================================================== */
.image-wrapper {
  position: relative;
  overflow: hidden;
}

.disease-image {
  will-change: transform;
}

.disease-card:hover .disease-image {
  transform: scale(1.12);
}

.image-overlay {
  z-index: 5;
}

/* ذرات معلق (هاگ/اسپور) */
.spores {
  z-index: 8;
}

.spore {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.6);
  opacity: 0;
  animation: sporeFloat 3s ease-in-out infinite;
}

.spore-1 {
  top: 20%;
  left: 30%;
  animation-delay: 0s;
}

.spore-2 {
  top: 60%;
  left: 70%;
  animation-delay: -1s;
}

.spore-3 {
  top: 40%;
  left: 50%;
  animation-delay: -2s;
}

.disease-card:hover .spore {
  animation: sporeFloatActive 2s ease-in-out infinite;
}

@keyframes sporeFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes sporeFloatActive {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-8px) scale(1.2);
    opacity: 0.8;
  }
  75% {
    transform: translateY(4px) scale(0.8);
    opacity: 0.4;
  }
}

/* ===================================================
   7. بج شناسایی سریع
   =================================================== */
.identify-badge {
  transform: translateY(-4px);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.disease-card:hover .identify-badge {
  transform: translateY(0);
}

/* ===================================================
   8. نام بیماری + خط زیرین
   =================================================== */
.disease-name {
  display: inline-block;
  transition: color 0.3s ease;
}

.name-underline {
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ===================================================
   9. فلش جهت‌نما
   =================================================== */
.card-arrow {
  transform: rotate(0deg);
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.disease-card:hover .card-arrow {
  transform: rotate(45deg) translateX(2px);
}

:dir(rtl) .card-arrow {
  transform: rotate(0deg);
}

:dir(rtl) .disease-card:hover .card-arrow {
  transform: rotate(-45deg) translateX(-2px);
}

/* ===================================================
   10. کاهش حرکت (Accessibility)
   =================================================== */
@media (prefers-reduced-motion: reduce) {
  .diseases-section,
  .section-title,
  .section-title::after,
  .disease-card,
  .scan-line,
  .ambient-pulse,
  .disease-image,
  .spore,
  .identify-badge,
  .name-underline,
  .card-arrow {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
  
  .disease-card {
    opacity: 1;
  }
  
  .spore {
    display: none;
  }
}

/* ===================================================
   11. دارک مود
   =================================================== */
:is(.dark) .ambient-pulse {
  background: radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%);
}

:is(.dark) .disease-card:hover {
  box-shadow:
    0 20px 40px -12px rgba(239, 68, 68, 0.25),
    0 8px 16px -4px rgba(0, 0, 0, 0.3);
}

:is(.dark) .spore {
  background: rgba(248, 113, 113, 0.7);
}
</style>