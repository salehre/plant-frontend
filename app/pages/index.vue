<script setup lang="ts">
import { getMockDiseases } from '~/services/mock/diseases.mock'

const plantStore = usePlantStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')
const diseases = computed(() => getMockDiseases(activeLocale.value))
const featured = computed(() => plantStore.featured)
const { status: featuredStatus } = useAsyncData(
  'home-featured-plants',
  () => plantStore.fetchFeatured(activeLocale.value, t('errors.featuredPlants')).then(() => true),
  { watch: [activeLocale] },
)
const featuredPending = computed(() => featuredStatus.value === 'pending' && !featured.value.length)
const featuredShown = computed(() => featured.value.slice(0, 4))

// state مشترک لودینگ برای هیرو و کارت‌های دسترسی سریع
const homeSkeletonPending = computed(() => featuredPending.value)
const quickActionSkeletons = Array.from({ length: 5 }, (_, index) => index)

// بک‌گراند کارت تبلیغی بخش گیاهان شاخص؛ بعداً فقط مسیر همین عکس رو عوض کن
const featuredPromoImage = '/images/plants/header.png'

const quickActions = [
  { to: '/identify', icon: 'lucide:scan-line', label: 'nav.identify', hint: 'home.quickHints.identify' },
  { to: '/my-plants', icon: 'lucide:sprout', label: 'nav.myPlants', hint: 'home.quickHints.myPlants' },
  { to: '/care-calendar', icon: 'lucide:calendar-check', label: 'nav.careCalendar', hint: 'home.quickHints.care' },
  { to: '/ai-doctor', icon: 'lucide:stethoscope', label: 'nav.aiDoctor', hint: 'home.quickHints.aiDoctor' },
  { to: '/plants', icon: 'lucide:compass', label: 'nav.explore', hint: 'home.quickHints.catalog' },
]

// افکت «وزن موس» روی کارت‌های دسترسی سریع: سمتی از کارت که موس روشه، به عقب فرو میره (انگار فشار میاد)
const TILT_MAX_DEG = 9 // حداکثر زاویه‌ی کج شدن
const TILT_DIRECTION = 1 // 1 = سمت زیر موس به عقب میره | -1 = سمت زیر موس به جلو میاد

function onCardMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5 // -0.5 تا 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  el.style.setProperty('--tilt-x', `${(-y * 2 * TILT_MAX_DEG * TILT_DIRECTION).toFixed(2)}deg`)
  el.style.setProperty('--tilt-y', `${(x * 2 * TILT_MAX_DEG * TILT_DIRECTION).toFixed(2)}deg`)
}

function onCardLeave(event: PointerEvent) {
  const el = event.currentTarget as HTMLElement
  el.style.removeProperty('--tilt-x')
  el.style.removeProperty('--tilt-y')
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <!-- ======= هیرو: اسکلتون ======= -->
    <section
      v-if="homeSkeletonPending"
      class="relative overflow-hidden rounded-[19px] bg-primary-900"
      aria-busy="true"
      aria-label="Loading"
    >
      <!-- جای عکس هدر -->
      <div class="absolute inset-0 animate-pulse bg-gradient-to-br from-primary-950 via-primary-800 to-primary-700" />
      <div class="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-primary-900/45 to-primary-900/0 rtl:bg-gradient-to-l" />

      <div class="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div class="flex min-h-[240px] max-w-xl flex-col justify-center gap-5 py-8 sm:min-h-[340px] sm:py-12">
          <!-- جای h1: text-2xl / sm:text-5xl با leading-tight -->
          <div class="space-y-1.5 sm:space-y-3">
            <div class="h-6 w-11/12 animate-pulse rounded-md bg-white/30 sm:h-12 sm:w-full" />
            <div class="h-6 w-2/3 animate-pulse rounded-md bg-white/30 sm:h-12 sm:w-3/5" />
          </div>

          <!-- جای p: text-sm / sm:text-base با leading-7 -->
          <div class="max-w-md space-y-3.5 sm:space-y-3">
            <div class="h-3.5 w-full animate-pulse rounded bg-white/20 sm:h-4" />
            <div class="h-3.5 w-11/12 animate-pulse rounded bg-white/20 sm:h-4" />
            <div class="h-3.5 w-7/12 animate-pulse rounded bg-white/20 sm:h-4" />
          </div>

          <!-- جای دکمه‌ها: py-2.5 + text-sm => h-10 -->
          <div class="flex flex-wrap gap-3">
            <div class="h-10 w-36 animate-pulse rounded-xl bg-white/30 sm:w-40" />
            <div class="hidden h-10 w-28 animate-pulse rounded-xl border border-white/25 bg-white/10 sm:block" />
          </div>
        </div>
      </div>
    </section>

    <!-- ======= هیرو ======= -->
    <section
      v-else
      class="relative overflow-hidden rounded-[19px] bg-primary-900 text-white"
    >
      <img
        src="/images/plants/header.png"
        :alt="t('home.greenLeavesAlt')"
        class="absolute inset-0 size-full object-cover object-center ltr:-scale-x-100"
      >
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
            <NuxtLink
              to="/identify"
              class="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-400"
            >
              <Icon
                name="lucide:scan-line"
                class="size-4"
              />
              {{ t('home.identifyCta') }}
            </NuxtLink>
            <NuxtLink
              to="/plants"
              class="sm:inline-flex hidden items-center gap-2 rounded-xl border border-white/40 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {{ t('nav.catalog') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= دسترسی سریع: اسکلتون ======= -->
    <section
      v-if="homeSkeletonPending"
      class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
      aria-hidden="true"
    >
      <div
        v-for="item in quickActionSkeletons"
        :key="item"
        class="glass-card flex flex-col items-center gap-3 p-4 text-center last:col-span-2 sm:last:col-span-1"
      >
        <!-- جای دایره آیکون size-12 + آیکون size-6 -->
        <span class="flex size-12 animate-pulse items-center justify-center rounded-full bg-primary-50">
          <span class="size-6 rounded-md bg-primary-100" />
        </span>

        <!-- جای لیبل (text-sm) و هینت (text-[11px]) با gap-0.5 -->
        <span class="flex w-full flex-col items-center gap-0.5">
          <span class="my-[3px] h-3.5 w-20 animate-pulse rounded bg-ink/10" />
          <span class="my-[2px] h-2.5 w-24 animate-pulse rounded bg-ink/5" />
        </span>
      </div>
    </section>

    <!-- ======= دسترسی سریع ======= -->
    <section
      v-else
      class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
    >
      <NuxtLink
        v-for="action in quickActions"
        :key="action.to"
        :to="action.to"
        class="glass-card tilt-card flex flex-col items-center gap-3 p-4 text-center last:col-span-2 sm:last:col-span-1"
        @pointermove="onCardMove"
        @pointerleave="onCardLeave"
      >
        <span class="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          <Icon
            :name="action.icon"
            class="size-6"
          />
        </span>
        <span class="flex flex-col gap-0.5">
          <span class="text-sm font-bold text-ink">{{ t(action.label) }}</span>
          <span class="text-[11px] text-ink-muted">{{ t(action.hint) }}</span>
        </span>
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

          <!-- اسکلتون: همون چیدمان قبلی (اسکرول افقی موبایل / ۳ ستون دسکتاپ) -->
          <div
            v-if="featuredPending"
            class="-mx-4 flex gap-4 overflow-hidden px-4 pb-2 sm:-mx-5 sm:px-5 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
          >
            <FeaturedPlantCardSkeleton
              v-for="i in 4"
              :key="i"
            />
          </div>

          <!-- اسلایدر Swiper: موبایل ~۱.۵ کارت | تبلت ۲.۴ | دسکتاپ ۳ کارت با فلش -->
          <AppSlider
            v-else
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
                  <img
                    :src="plant.images[0]"
                    :alt="plant.name"
                    class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  >
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
          <img
            :src="featuredPromoImage"
            alt=""
            class="absolute inset-0 -z-20 size-full object-cover object-center"
            loading="lazy"
          >
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
          <img
            :src="disease.image"
            :alt="disease.name"
            class="h-28 w-full rounded-xl object-cover"
            loading="lazy"
          >
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
/* کج شدن سه‌بعدی کارت‌های دسترسی سریع زیر موس */
.tilt-card {
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  transform: perspective(700px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) scale3d(1, 1, 1);
  /* برگشت نرم و فنری وقتی موس کارت رو ترک می‌کنه */
  transition:
    transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  will-change: transform;
}

@media (hover: hover) and (pointer: fine) {
  .tilt-card:hover {
    /* موقع حرکت موس سریع دنبال می‌کنه، کمی کوچیک می‌شه تا حس فشار بده */
    transform: perspective(700px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) scale3d(0.97, 0.97, 0.97);
    transition:
      transform 0.12s ease-out,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tilt-card,
  .tilt-card:hover {
    transform: none;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }
}
</style>