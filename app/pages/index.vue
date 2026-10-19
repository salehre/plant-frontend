<script setup lang="ts">
import { getMockDiseases } from '~/services/mock/diseases.mock'

const plantStore = usePlantStore()
const historyStore = useHistoryStore()
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
// بک‌گراند کارت تبلیغی بخش گیاهان شاخص؛ بعداً فقط مسیر همین عکس رو عوض کن
const featuredPromoImage = '/images/plants/header.png'

const quickActions = [
  { to: '/my-plants', icon: 'lucide:sprout', label: 'nav.myPlants', hint: 'home.quickHints.myPlants' },
  { to: '/plants', icon: 'lucide:compass', label: 'nav.catalog', hint: 'home.quickHints.catalog' },
  { to: '/climate', icon: 'lucide:map-pin', label: 'nav.climate', hint: 'home.quickHints.city' },
]

const recentScans = computed(() => historyStore.sorted.slice(0, 5))

function formatConfidence(value: number) {
  return t('home.scanConfidence', {
    value: t('components.confidenceScore.percentage', {
      value: new Intl.NumberFormat(locale.value, { useGrouping: false }).format(Math.round(value * 100)),
    }),
  })
}

// زمان نسبی و محلی‌شده: «۲ ساعت پیش» / «دیروز» / "2 hours ago" / "Yesterday"
function scanTime(timestamp: number) {
  const rtf = new Intl.RelativeTimeFormat(locale.value === 'fa' ? 'fa' : 'en', { numeric: 'auto' })
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60_000))
  if (minutes < 60) return rtf.format(-minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (hours < 24) return rtf.format(-hours, 'hour')
  const days = Math.round(hours / 24)
  if (days < 30) return rtf.format(-days, 'day')
  const months = Math.round(days / 30)
  if (months < 12) return rtf.format(-months, 'month')
  return rtf.format(-Math.round(months / 12), 'year')
}

// عکس اسکن (blob) بعد از رفرش از بین می‌ره؛ فقط مخفیش می‌کنیم تا آیکن پشتش دیده بشه
function onImageError(e: Event) {
  (e.target as HTMLImageElement).style.visibility = 'hidden'
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <!-- هیرو -->
    <section class="relative overflow-hidden rounded-[19px] bg-primary-900 text-white">
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
            class="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {{ t('nav.catalog') }}
          </NuxtLink>
        </div>
      </div>
      </div>
    </section>

    <!-- دسترسی سریع -->
    <section class="grid grid-cols-3 gap-3 sm:gap-4">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.to"
        :to="action.to"
        class="glass-card flex flex-col items-center gap-3 p-4 text-center"
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

    <!-- آخرین اسکن‌ها -->
    <section v-if="recentScans.length" class="glass-card p-4 sm:p-5">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-bold text-ink">
          {{ t('pages.profile.history') }}
        </h2>
        <NuxtLink
          to="/history"
          class="text-sm font-semibold text-primary-700 hover:text-primary-600"
        >
          {{ t('common.seeAll') }}
        </NuxtLink>
      </div>

      <!-- اسلایدر Swiper: موبایل ~۱.۵ کارت | تبلت ۲.۴ | دسکتاپ ۴ کارت با فلش -->
      <AppSlider
        :items="recentScans"
        :item-key="entry => entry.id"
        :breakpoints="{ 640: { slidesPerView: 2.4 }, 1024: { slidesPerView: 4 } }"
        class="-mx-4 px-4 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0"
      >
        <template #default="{ item: entry }">
          <NuxtLink
            :to="entry.slug ? `/plants/${entry.slug}` : '/history'"
            class="group flex h-full flex-col rounded-2xl border border-ink/5 bg-surface p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <div class="relative aspect-[5/4] overflow-hidden rounded-xl bg-primary-50">
              <Icon
                name="lucide:leaf"
                class="absolute inset-0 m-auto size-10 text-primary-400"
              />
              <img
                :src="entry.image"
                :alt="entry.plantName"
                class="relative size-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                @error="onImageError"
              >
            </div>
            <div class="flex items-end justify-between gap-2 px-1.5 pb-1.5 pt-3.5">
              <div class="min-w-0">
                <p class="truncate text-base font-bold text-ink">
                  {{ entry.plantName }}
                </p>
                <p class="mt-1.5 truncate text-sm font-semibold text-primary-700">
                  {{ formatConfidence(entry.confidence) }}
                </p>
                <p class="mt-0.5 truncate text-sm text-ink-muted">
                  {{ scanTime(entry.timestamp) }}
                </p>
              </div>
              <span class="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink-muted transition-colors group-hover:border-primary-300 group-hover:text-primary-700">
                <Icon
                  name="lucide:chevron-right"
                  class="size-5 rtl:-scale-x-100"
                />
              </span>
            </div>
          </NuxtLink>
        </template>
      </AppSlider>
    </section>

    <!-- Plant Finder -->
    <section>
      <PlantFinder />
    </section>

    <!-- سوالات متداول -->
    <FaqSection />

    <!-- گیاهان شاخص -->
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

    <!-- راهنماها -->
    <section>
      <h2 class="mb-4 text-lg font-bold text-ink">
        {{ t('home.guidesTitle') }}
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="glass-card p-5">
          <span class="mb-3 flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary-700">
            <Icon
              name="lucide:droplets"
              class="size-5"
            />
          </span>
          <h3 class="mb-1 font-bold text-ink">
            {{ t('home.wateringTitle') }}
          </h3>
          <p class="text-sm leading-6 text-ink-muted">
            {{ t('home.wateringDescription') }}
          </p>
        </div>
        <div class="glass-card p-5">
          <span class="mb-3 flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary-700">
            <Icon
              name="lucide:sun"
              class="size-5"
            />
          </span>
          <h3 class="mb-1 font-bold text-ink">
            {{ t('home.lightTitle') }}
          </h3>
          <p class="text-sm leading-6 text-ink-muted">
            {{ t('home.lightDescription') }}
          </p>
        </div>
        <div class="glass-card p-5">
          <span class="mb-3 flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary-700">
            <Icon
              name="lucide:bug"
              class="size-5"
            />
          </span>
          <h3 class="mb-1 font-bold text-ink">
            {{ t('home.pestTitle') }}
          </h3>
          <p class="text-sm leading-6 text-ink-muted">
            {{ t('home.pestDescription') }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.x{
  stroke: none;
}
</style>