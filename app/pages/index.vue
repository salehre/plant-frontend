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
// بک‌گراند کارت تبلیغی بخش گیاهان شاخص؛ بعداً فقط مسیر همین عکس رو عوض کن
const featuredPromoImage = '/images/plants/header.png'

const quickActions = [
  { to: '/my-plants', icon: 'lucide:sprout', label: 'nav.myPlants', hint: 'home.quickHints.myPlants' },
  { to: '/plants', icon: 'lucide:compass', label: 'nav.catalog', hint: 'home.quickHints.catalog' },
  { to: '/climate', icon: 'lucide:map-pin', label: 'nav.climate', hint: 'home.quickHints.city' },
]
</script>

<template>
  <div class="flex flex-col gap-10 lg:gap-14">
    <!-- هیرو + دسترسی سریع (نوار دسترسی سریع روی لبه‌ی پایین هیرو سوار می‌شه) -->
    <div>
      <section class="relative isolate overflow-hidden rounded-[18px] bg-primary-900 text-white">
        <img
          src="/images/plants/header.png"
          :alt="t('home.greenLeavesAlt')"
          fetchpriority="high"
          class="absolute inset-0 -z-20 size-full object-cover object-center ltr:-scale-x-100"
        >
        <div class="absolute inset-0 -z-10 bg-gradient-to-r from-primary-900/80 via-primary-900/50 to-primary-900/0 rtl:bg-gradient-to-l" />

        <div class="flex min-h-[270px] max-w-xl flex-col justify-center gap-5 px-5 pb-16 pt-9 sm:min-h-[390px] sm:px-10 sm:pb-24 sm:pt-14">
          <h1 class="text-3xl font-extrabold leading-snug sm:text-5xl sm:leading-tight">
            {{ t('home.heroTitle') }}
          </h1>
          <p class="max-w-md text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
            {{ t('home.heroSubtitle') }}
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/identify"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary-900 transition-colors hover:bg-white/90"
            >
              <Icon
                name="lucide:scan-line"
                class="size-4"
              />
              {{ t('home.identifyCta') }}
            </NuxtLink>
            <NuxtLink
              to="/plants"
              class="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {{ t('nav.catalog') }}
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="relative z-10 mx-3 -mt-9 sm:mx-8 sm:-mt-12">
        <div class="glass-card grid grid-cols-3 overflow-hidden">
          <NuxtLink
            v-for="(action, i) in quickActions"
            :key="action.to"
            :to="action.to"
            class="flex flex-col items-center gap-2 px-2 py-4 text-center transition-colors hover:bg-ink/[0.03] sm:flex-row sm:gap-4 sm:px-6 sm:py-5 sm:text-start"
            :class="i > 0 ? 'border-s border-ink/10' : ''"
          >
            <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 sm:size-12">
              <Icon
                :name="action.icon"
                class="size-5 sm:size-6"
              />
            </span>
            <span class="flex min-w-0 flex-col gap-0.5">
              <span class="text-sm font-bold leading-6 text-ink">{{ t(action.label) }}</span>
              <span class="hidden text-xs text-ink-muted sm:block">{{ t(action.hint) }}</span>
            </span>
            <Icon
              name="lucide:chevron-right"
              class="ms-auto hidden size-4 shrink-0 text-ink-muted sm:block rtl:-scale-x-100"
            />
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- گیاهان شاخص -->
    <section class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div class="min-w-0">
        <div class="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 class="text-xl font-bold text-ink">
              {{ t('home.featuredPlants') }}
            </h2>
            <p class="mt-1 text-sm text-ink-muted">
              {{ t('home.featuredSubtitle') }}
            </p>
          </div>
          <NuxtLink
            to="/plants"
            class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-600"
          >
            {{ t('common.seeAll') }}
            <Icon
              name="lucide:arrow-right"
              class="size-4 rtl:-scale-x-100"
            />
          </NuxtLink>
        </div>

        <!-- اسکلتون: همون چیدمان قبلی (اسکرول افقی موبایل / ۳ ستون دسکتاپ) -->
        <div
          v-if="featuredPending"
          class="-mx-4 flex gap-4 overflow-hidden px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
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
          class="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
        >
          <template #default="{ item: plant }">
            <NuxtLink
              :to="`/plants/${plant.slug}`"
              class="group flex h-full flex-col rounded-[18px] border border-ink/5 bg-surface p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div class="relative aspect-[5/4] overflow-hidden rounded-xl bg-primary-50 lg:aspect-[4/3.4]">
                <img
                  :src="plant.images[0]"
                  :alt="plant.name"
                  class="size-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                  loading="lazy"
                >
                <div class="absolute end-2 top-2">
                  <WishlistButton
                    :slug="plant.slug"
                    compact
                  />
                </div>
              </div>
              <div class="min-w-0 px-1.5 pb-1.5 pt-3.5 lg:px-2 lg:pb-2">
                <p class="truncate text-base font-bold text-ink lg:text-lg">
                  {{ plant.name }}
                </p>
                <p class="mt-1 truncate text-sm italic text-ink-muted lg:text-base">
                  {{ plant.scientificName }}
                </p>
              </div>
            </NuxtLink>
          </template>
        </AppSlider>
      </div>

      <!-- کارت تبلیغی با عکس پس‌زمینه (هم‌سبک هیرو) -->
      <div class="relative isolate flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[18px] p-7 text-white max-md:hidden">
        <img
          :src="featuredPromoImage"
          alt=""
          class="absolute inset-0 -z-20 size-full object-cover object-center"
          loading="lazy"
        >
        <div class="absolute inset-0 -z-10 bg-gradient-to-t from-primary-900/95 via-primary-900/60 to-primary-900/20" />
        <h3 class="text-2xl font-extrabold leading-snug">
          {{ t('home.promoTitle') }}
        </h3>
        <p class="mt-3 text-sm leading-7 text-white/80">
          {{ t('home.promoText') }}
        </p>
        <NuxtLink
          to="/care-calendar"
          class="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary-900 transition-colors hover:bg-white/90"
        >
          {{ t('home.promoCta') }}
          <Icon
            name="lucide:arrow-right"
            class="size-4 rtl:-scale-x-100"
          />
        </NuxtLink>
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
      <h2 class="mb-5 text-xl font-bold text-ink">
        {{ t('home.popularDiseases') }}
      </h2>
      <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <NuxtLink
          v-for="disease in diseases"
          :key="disease.id"
          to="/identify"
          class="group relative isolate flex aspect-[4/3] items-end overflow-hidden rounded-[18px] bg-primary-900 p-3.5 sm:p-4"
        >
          <img
            :src="disease.image"
            alt=""
            class="absolute inset-0 -z-20 size-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
            loading="lazy"
          >
          <span class="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span class="text-sm font-bold leading-6 text-white sm:text-base">{{ disease.name }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- بلاگ -->
    <BlogSection />

    <IdentifySteps />
  </div>
</template>

<style scoped>
.x{
  stroke: none;
}
</style>