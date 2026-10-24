<script setup lang="ts">
const { t, locale } = useI18n()
const historyStore = useHistoryStore()
const {
  plantCount,
  healthyCount,
  healthRate,
  scanCount,
  speciesCount,
  plantsThisMonth,
  scansThisMonth,
  speciesThisMonth,
} = useProfileStats()

const intlLocale = computed(() => (locale.value === 'fa' ? 'fa-IR' : 'en-US'))

function delta(n: number) {
  return n > 0 ? t('pages.profile.stats.delta', { n }) : t('pages.profile.stats.deltaNone')
}

const cards = computed(() => [
  {
    key: 'plants',
    icon: 'lucide:sprout',
    value: plantCount.value,
    label: t('pages.profile.stats.totalPlants'),
    delta: delta(plantsThisMonth.value),
  },
  {
    key: 'scans',
    icon: 'lucide:scan-line',
    value: scanCount.value,
    label: t('pages.profile.stats.scans'),
    delta: delta(scansThisMonth.value),
  },
  {
    key: 'species',
    icon: 'lucide:leaf',
    value: speciesCount.value,
    label: t('pages.profile.stats.species'),
    delta: delta(speciesThisMonth.value),
  },
  {
    key: 'health',
    icon: 'lucide:heart-pulse',
    value: `${healthRate.value}%`,
    label: t('pages.profile.stats.health'),
    delta: t('pages.profile.stats.healthyOf', { healthy: healthyCount.value, total: plantCount.value }),
  },
])

const recentScans = computed(() => historyStore.sorted.slice(0, 4))

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(intlLocale.value, { dateStyle: 'medium' }).format(new Date(timestamp))
}

const quickActions = [
  { to: '/climate', icon: 'lucide:cloud-sun', label: 'nav.climate' },
  { to: '/my-plants', icon: 'lucide:sprout', label: 'nav.myPlants' },
  { to: '/care-calendar', icon: 'lucide:calendar-check', label: 'nav.careCalendar' },
  { to: '/dashboard', icon: 'lucide:layout-dashboard', label: 'nav.dashboard' },
]

function onImageError(e: Event) {
  (e.target as HTMLImageElement).style.visibility = 'hidden'
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- کارت‌های آمار -->
    <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div
        v-for="card in cards"
        :key="card.key"
        class="glass-card stat-card flex flex-col gap-4 p-4 transition-shadow duration-300 hover:shadow-card-hover sm:p-5"
      >
        <span class="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-300">
          <Icon
            :name="card.icon"
            class="size-5 justify-end"
          />
        </span>
        <div class="flex gap-2">
          <p class="text-2xl font-extrabold leading-none tracking-tight text-ink sm:text-3xl">
            {{ card.value }}
          </p>
          <p class="mt-2 text-xs font-medium text-ink-muted">
            {{ card.label }}
          </p>
        </div>
        <p class="text-xs font-semibold text-primary-600">
          {{ card.delta }}
        </p>
      </div>
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <!-- آخرین اسکن‌ها -->
      <section class="glass-card p-5 sm:p-6">
        <header class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-base font-bold text-ink">
            {{ t('pages.profile.overview.recentScans') }}
          </h2>
          <NuxtLink
            to="/history"
            class="text-xs font-bold text-primary-700 hover:underline"
          >
            {{ t('common.seeAll') }}
          </NuxtLink>
        </header>

        <ul
          v-if="recentScans.length"
          class="flex flex-col divide-y divide-ink/5"
        >
          <li
            v-for="entry in recentScans"
            :key="entry.id"
          >
            <NuxtLink
              :to="entry.slug ? `/plants/${entry.slug}` : '/history'"
              class="flex items-center gap-3 py-3"
            >
              <img
                :src="entry.image"
                :alt="entry.plantName"
                class="size-11 shrink-0 rounded-xl bg-primary-50 object-cover"
                loading="lazy"
                @error="onImageError"
              >
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-bold text-ink">{{ entry.plantName }}</span>
                <span class="block truncate text-xs italic text-ink-muted">{{ entry.scientificName }}</span>
              </span>
              <span class="shrink-0 text-xs text-ink-muted">{{ formatDate(entry.timestamp) }}</span>
            </NuxtLink>
          </li>
        </ul>
        <p
          v-else
          class="rounded-xl bg-primary-50/60 px-4 py-6 text-center text-sm text-ink-muted"
        >
          {{ t('pages.profile.overview.noScans') }}
        </p>
      </section>

      <!-- دسترسی سریع -->
      <section class="glass-card p-5 sm:p-6">
        <h2 class="mb-4 text-base font-bold text-ink">
          {{ t('pages.profile.quickActions') }}
        </h2>
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            class="group flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface p-3.5 transition-colors hover:border-primary-300 hover:bg-primary-50/60"
          >
            <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-transform group-hover:scale-105">
              <Icon
                :name="action.icon"
                class="size-5"
              />
            </span>
            <span class="text-sm font-bold text-ink">{{ t(action.label) }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* زاویه‌ی گرادیانت قابل انیمیت (برای چرخوندن خط دور کارت) */
@property --stat-border-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

/* خط ۱ پیکسلی که موقع هاور دور کارت می‌چرخه */
.stat-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  padding: 1px; /* ضخامت خط */
  border-radius: inherit;
  background: conic-gradient(
    from var(--stat-border-angle),
    transparent 0%,
    transparent 55%,
    rgb(var(--color-primary-300)) 80%,
    rgb(var(--color-primary-500)) 100%
  );
  /* فقط حاشیه دیده بشه، داخل کارت خالی بمونه */
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.stat-card:hover::before {
  opacity: 1;
  animation: stat-border-spin 2.4s linear infinite;
}

@keyframes stat-border-spin {
  to { --stat-border-angle: 360deg; }
}

@media (prefers-reduced-motion: reduce) {
  .stat-card:hover::before {
    animation: none;
  }
}
</style>