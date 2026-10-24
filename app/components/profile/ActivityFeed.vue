<script setup lang="ts">
import type { ActivityEntry, ActivityType } from '~/stores/activity.store'

const { t, locale } = useI18n()
const activityStore = useActivityStore()

type Filter = 'all' | ActivityType
const filters: Filter[] = ['all', 'scan', 'plant_added', 'task_done']
const active = ref<Filter>('all')

const PAGE_SIZE = 8
const visibleCount = ref(PAGE_SIZE)
watch(active, () => { visibleCount.value = PAGE_SIZE })

const filtered = computed(() =>
  active.value === 'all'
    ? activityStore.sorted
    : activityStore.sorted.filter(e => e.type === active.value),
)
const visible = computed(() => filtered.value.slice(0, visibleCount.value))

function countOf(filter: Filter) {
  return filter === 'all'
    ? activityStore.count
    : activityStore.entries.filter(e => e.type === filter).length
}

const typeIcon: Record<ActivityType, string> = {
  scan: 'lucide:scan-line',
  plant_added: 'lucide:sprout',
  task_done: 'lucide:circle-check',
}
const taskLabelKeys: Record<string, string> = {
  water: 'components.common.taskWater',
  fertilize: 'components.common.taskFertilize',
  prune: 'components.common.taskPrune',
  repot: 'components.common.taskRepot',
  mist: 'components.common.taskMist',
}

function subtitle(entry: ActivityEntry) {
  if (entry.type === 'scan') return t('pages.profile.identified')
  if (entry.type === 'plant_added') return t('pages.profile.activity.plantAdded')
  const key = entry.taskType ? taskLabelKeys[entry.taskType] : undefined
  return t('pages.profile.activity.taskDone', { task: key ? t(key) : '' })
}

function linkOf(entry: ActivityEntry) {
  if (entry.slug) return `/plants/${entry.slug}`
  return entry.type === 'scan' ? '/history' : '/my-plants'
}

const intlLocale = computed(() => locale.value === 'fa' ? 'fa-IR' : 'en-US')
function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(intlLocale.value, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp))
}
function formatPercent(value: number) {
  return t('components.confidenceScore.percentage', {
    value: new Intl.NumberFormat(locale.value, { useGrouping: false }).format(Math.round(value * 100)),
  })
}
// متن‌های حالت خالی (وقتی کاربر هنوز هیچ فعالیتی نداره)
const emptyText = computed(() => locale.value === 'fa'
  ? {
      title: 'هنوز فعالیتی نداشتی',
      text: 'با اولین اسکن، افزودن گیاه یا انجام یه کار مراقبتی، فعالیت‌هات اینجا نمایش داده می‌شن.',
    }
  : {
      title: 'No activity yet',
      text: 'Scan a plant, add one to your garden or finish a care task and your activity will show up here.',
    })

function onImageError(e: Event) {
  (e.target as HTMLImageElement).style.visibility = 'hidden'
}
</script>

<template>
  <section
    v-if="activityStore.count"
    class="glass-card p-4 sm:p-5"
  >
    <h2 class="mb-3 font-bold text-ink">
      {{ $t('pages.profile.recentActivity') }}
    </h2>

    <!-- فیلتر -->
    <div
      role="tablist"
      class="-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-5 sm:px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        role="tab"
        :aria-selected="active === filter"
        class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors"
        :class="active === filter ? 'bg-primary-700 text-white' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'"
        @click="active = filter"
      >
        {{ $t(`pages.profile.activity.filters.${filter}`) }}
        <span
          class="rounded-full px-1.5 text-[0.65rem] font-bold"
          :class="active === filter ? 'bg-white/20' : 'bg-primary-100/70'"
        >
          {{ toPersianDigits(countOf(filter)) }}
        </span>
      </button>
    </div>

    <!-- لیست -->
    <ul
      v-if="visible.length"
      class="divide-y divide-ink/5"
    >
      <li
        v-for="entry in visible"
        :key="entry.id"
      >
        <NuxtLink
          :to="linkOf(entry)"
          class="flex items-center gap-3 py-3"
        >
          <span class="relative size-11 shrink-0 overflow-hidden rounded-lg bg-primary-50">
            <Icon
              :name="typeIcon[entry.type]"
              class="absolute inset-0 m-auto size-5 text-primary-400"
            />
            <img
              v-if="entry.image"
              :src="entry.image"
              :alt="entry.title"
              class="relative size-full object-cover"
              loading="lazy"
              @error="onImageError"
            >
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-bold text-ink">{{ entry.title }}</span>
            <span class="block truncate text-xs text-ink-muted">
              {{ subtitle(entry) }} · {{ formatDate(entry.timestamp) }}
            </span>
          </span>
          <span
            v-if="entry.type === 'scan' && entry.confidence != null"
            class="shrink-0 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary-700"
          >
            {{ formatPercent(entry.confidence) }}
          </span>
          <span
            v-else
            class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"
          >
            <Icon
              :name="typeIcon[entry.type]"
              class="size-4"
            />
          </span>
        </NuxtLink>
      </li>
    </ul>
    <p
      v-else
      class="py-6 text-center text-sm text-ink-muted"
    >
      {{ $t('pages.profile.activity.emptyFilter') }}
    </p>

    <button
      v-if="filtered.length > visibleCount"
      type="button"
      class="mt-2 w-full rounded-xl py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
      @click="visibleCount += PAGE_SIZE"
    >
      {{ $t('pages.profile.activity.showMore') }}
    </button>
  </section>

  <!-- حالت خالی: هنوز هیچ فعالیتی ثبت نشده -->
  <section
    v-else
    class="glass-card flex flex-col items-center gap-4 px-6 py-12 text-center sm:py-16"
  >
    <span class="flex size-16 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-300">
      <Icon
        name="lucide:activity"
        class="size-8"
      />
    </span>
    <div class="max-w-sm">
      <h2 class="text-base font-bold text-ink">
        {{ emptyText.title }}
      </h2>
      <p class="mt-2 text-sm leading-7 text-ink-muted">
        {{ emptyText.text }}
      </p>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-3">
      <NuxtLink
        to="/identify"
        class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700"
      >
        <Icon
          name="lucide:scan-line"
          class="size-4"
        />
        {{ t('nav.identify') }}
      </NuxtLink>
      <NuxtLink
        to="/my-plants"
        class="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-surface px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
      >
        <Icon
          name="lucide:sprout"
          class="size-4"
        />
        {{ t('nav.myPlants') }}
      </NuxtLink>
    </div>
  </section>
</template>