<script setup lang="ts">
import { getMockDiseases } from '~/services/mock/diseases.mock'

const plantStore = usePlantStore()
const historyStore = useHistoryStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')
const diseases = computed(() => getMockDiseases(activeLocale.value))
const featured = computed(() => plantStore.featured)
await useAsyncData(
  `featured-plants-${activeLocale.value}`,
  () => plantStore.fetchFeatured(activeLocale.value, t('errors.featuredPlants')).then(() => plantStore.featured),
)
watch(activeLocale, locale => plantStore.fetchFeatured(locale, t('errors.featuredPlants')))

const quickActions = [
  { to: '/my-plants', icon: 'lucide:sprout', label: 'nav.myPlants', hint: 'home.quickHints.myPlants' },
  { to: '/plants', icon: 'lucide:compass', label: 'nav.catalog', hint: 'home.quickHints.catalog' },
  { to: '/care-calendar', icon: 'lucide:calendar-check', label: 'nav.careCalendar', hint: 'home.quickHints.care' },
]

const recentScans = computed(() => historyStore.sorted.slice(0, 4))

function formatConfidence(value: number) {
  return t('components.confidenceScore.percentage', {
    value: new Intl.NumberFormat(locale.value, { useGrouping: false }).format(Math.round(value * 100)),
  })
}

// عکس اسکن (blob) بعد از رفرش از بین می‌ره؛ فقط مخفیش می‌کنیم تا آیکن پشتش دیده بشه
function onImageError(e: Event) {
  (e.target as HTMLImageElement).style.visibility = 'hidden'
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <!-- هیرو -->
    <section class="relative overflow-hidden rounded-[22px] bg-primary-900 text-white">
      <img
        src="/images/plants/botanical-1.webp"
        :alt="t('home.greenLeavesAlt')"
        class="absolute inset-0 size-full object-cover"
      >
      <div class="absolute inset-0 from-primary-900 via-primary-900/85 to-primary-900/10 rtl:bg-gradient-to-l ltr:bg-gradient-to-r" />

      <div class="relative flex min-h-[240px] max-w-xl flex-col justify-center gap-5 p-6 sm:min-h-[340px] sm:p-10">
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
    <section v-if="recentScans.length">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-bold text-ink">
          {{ t('pages.profile.history') }}
        </h2>
        <NuxtLink
          to="/history"
          class="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {{ t('common.seeAll') }}
        </NuxtLink>
      </div>
      <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
        <NuxtLink
          v-for="(entry, index) in recentScans"
          :key="entry.id"
          :to="entry.slug ? `/plants/${entry.slug}` : '/history'"
          class="glass-card group flex-col p-2"
          :class="index === 3 ? 'hidden sm:flex' : 'flex'"
        >
          <div class="relative aspect-square overflow-hidden rounded-xl bg-primary-50">
            <Icon
              name="lucide:leaf"
              class="absolute inset-0 m-auto size-8 text-primary-400"
            />
            <img
              :src="entry.image"
              :alt="entry.plantName"
              class="relative size-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              @error="onImageError"
            >
          </div>
          <div class="flex items-center justify-between gap-2 px-1.5 pb-1 pt-3">
            <span class="truncate text-sm font-bold text-ink">{{ entry.plantName }}</span>
            <span class="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary-700">
              {{ formatConfidence(entry.confidence) }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Plant Finder -->
    <section>
      <PlantFinder />
    </section>

    <!-- سوالات متداول -->
    <FaqSection />

    <!-- گیاهان شاخص -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-bold text-ink">
          {{ t('home.featuredPlants') }}
        </h2>
        <NuxtLink
          to="/plants"
          class="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {{ t('common.seeAll') }}
        </NuxtLink>
      </div>
      <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
        <PlantCard
          v-for="plant in featured"
          :key="plant.id"
          :plant="plant"
          variant="mini"
        />
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