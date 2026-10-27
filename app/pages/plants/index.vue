<script setup lang="ts">
const route = useRoute()
const plantStore = usePlantStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

plantStore.query = (route.query.q as string) ?? ''

const categories = computed(() => [
  { label: t('pages.catalog.filters.allCategories'), value: 'all' },
  { label: t('pages.catalog.filters.indoor'), value: 'indoor' },
  { label: t('pages.catalog.filters.hanging'), value: 'hanging' },
  { label: t('pages.catalog.filters.medicinal'), value: 'medicinal' },
])
const categoryIcons: Record<string, string> = {
  all: 'lucide:layout-grid',
  indoor: 'lucide:flower-2',
  hanging: 'lucide:sprout',
  medicinal: 'lucide:heart-pulse',
}
const difficulties = computed(() => [
  { label: t('pages.catalog.filters.allDifficulties'), value: 'all' },
  { label: t('pages.catalog.filters.easy'), value: 'easy' },
  { label: t('pages.catalog.filters.medium'), value: 'medium' },
  { label: t('pages.catalog.filters.hard'), value: 'hard' },
])
const lightOptions = computed(() => [
  { label: t('pages.catalog.filters.allLight'), value: 'all' },
  { label: t('pages.catalog.filters.lowLight'), value: 'low' },
  { label: t('pages.catalog.filters.indirectLight'), value: 'medium' },
  { label: t('pages.catalog.filters.highLight'), value: 'high' },
  { label: t('pages.catalog.filters.directSun'), value: 'direct' },
])

// گزینه‌های فیلتر تاکسونومیک (family/genus) از دیتاست واقعی می‌آیند، نه هاردکد
const familyDropdownOptions = computed(() => [
  { label: t('pages.catalog.filters.allFamilies'), value: 'all' },
  ...plantStore.familyOptions.map(f => ({ label: f, value: f })),
])
const genusDropdownOptions = computed(() => [
  { label: t('pages.catalog.filters.allGenera'), value: 'all' },
  ...plantStore.genusOptions.map(g => ({ label: g, value: g })),
])

plantStore.category = 'all'
plantStore.difficulty = 'all'
plantStore.light = 'all'
plantStore.family = (route.query.family as string) ?? 'all'
plantStore.genus = (route.query.genus as string) ?? 'all'

const showAdvanced = ref(!!route.query.family || !!route.query.genus)

await plantStore.fetchFilterOptions(t('errors.plantFilters'))
await useAsyncData(
  `plant-list-${activeLocale.value}`,
  () => plantStore.fetchList(activeLocale.value, t('errors.plantList')).then(() => true),
)

watch(
  [() => plantStore.query, () => plantStore.category, () => plantStore.difficulty, () => plantStore.light, () => plantStore.genus, () => activeLocale.value],
  () => plantStore.fetchList(activeLocale.value, t('errors.plantList')),
)

// وقتی خانواده عوض میشه، لیست جنس‌ها باید دوباره محاسبه بشه و جنس انتخاب‌شده‌ی قبلی معتبر نمونه
watch(
  () => plantStore.family,
  async () => {
    plantStore.genus = 'all'
    await plantStore.fetchFilterOptions(t('errors.plantFilters'))
    await plantStore.fetchList(activeLocale.value, t('errors.plantList'))
  },
)

// ── کمکی‌های UI ─────────────────────────────────────────────

// با هر تغییر در نتایج، کل گرید remount میشه تا انیمیشن ورود پله‌ای کارت‌ها دوباره پخش بشه
const resultKey = computed(() => plantStore.list.map(p => p.id).join('|'))

const hasActiveFilters = computed(() =>
  !!plantStore.query
  || plantStore.category !== 'all'
  || plantStore.difficulty !== 'all'
  || plantStore.light !== 'all'
  || plantStore.family !== 'all'
  || plantStore.genus !== 'all',
)

// نمایش تعداد نتایج با ارقام فارسی در حالت fa
const formattedCount = computed(() =>
  plantStore.list.length.toLocaleString(activeLocale.value === 'fa' ? 'fa-IR' : 'en-US'),
)

function resetFilters() {
  plantStore.query = ''
  plantStore.category = 'all'
  plantStore.difficulty = 'all'
  plantStore.light = 'all'
  plantStore.family = 'all'
  plantStore.genus = 'all'
}
</script>

<template>
  <div class="relative mx-auto max-w-6xl pt-3">
    <!-- ✨ پس‌زمینه‌ی تزئینی (هاله‌های محو) -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 -top-16 h-56"
    >
      <div class="blob absolute start-[6%] top-2 size-64 rounded-full bg-primary-200/40 blur-3xl" />
      <div
        class="blob absolute end-[4%] top-8 size-52 rounded-full bg-emerald-200/30 blur-3xl"
        style="animation-delay: 2s"
      />
    </div>

    <div class="relative">
      <!-- هدر -->
      <header class="mb-8">
        <div class="reveal flex items-center gap-3" style="--i: 0">
          <h1 class="bg-gradient-to-l from-primary-700 pt-3 via-primary-600 to-emerald-500 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
            {{ t('nav.catalog') }}
          </h1>
          <Icon
            name="lucide:leaf"
            class="leaf-sway size-7 text-primary-500 sm:size-8"
            aria-hidden="true"
          />
        </div>
        <p
          class="reveal mt-2 max-w-xl text-ink-muted"
          style="--i: 1"
        >
          {{ t('pages.catalog.subtitle') }}
        </p>
      </header>

      <!-- جستجو + دکمه‌ی فیلتر پیشرفته -->
      <div class="reveal mb-6 flex flex-col gap-3 sm:flex-row" style="--i: 2">
        <div class="relative flex-1 rounded-2xl transition-shadow duration-300 focus-within:shadow-lg focus-within:shadow-primary-600/10">
          <SearchSuggestions v-model="plantStore.query" />
        </div>
        <AppButton
          variant="ghost"
          class="shrink-0 self-start sm:self-auto"
          :class="showAdvanced ? 'bg-primary-200/50 text-primary-700' : ''"
          :aria-expanded="showAdvanced"
          @click="showAdvanced = !showAdvanced"
        >
          <Transition
            name="icon-swap"
            mode="out-in"
          >
            <Icon
              :key="showAdvanced"
              :name="showAdvanced ? 'lucide:x' : 'lucide:sliders-horizontal'"
              class="size-4"
            />
          </Transition>
          {{ t('pages.catalog.advancedFilters') }}
        </AppButton>
      </div>

      <!-- دسته‌بندی با آیکن گرد (مثل دیزاین) -->
      <div class="-mx-1 mb-6 flex gap-3 overflow-x-auto px-1 py-2 sm:gap-4">
        <button
          v-for="(c, i) in categories"
          :key="c.value"
          type="button"
          class="reveal group flex w-20 shrink-0 flex-col items-center gap-1.5"
          :style="{ '--i': 3 + i }"
          :aria-pressed="plantStore.category === c.value"
          @click="plantStore.category = c.value"
        >
          <span
            class="relative flex size-16 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out group-active:scale-90"
            :class="plantStore.category === c.value
              ? 'border-primary-600 bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-600/30 ring-4 ring-primary-600/15'
              : 'border-primary-200 bg-primary-50 text-primary-600 group-hover:-translate-y-1 group-hover:border-primary-400 group-hover:bg-primary-100 group-hover:shadow-md group-hover:shadow-primary-600/10'"
          >
            <Icon
              :name="categoryIcons[c.value] ?? 'lucide:leaf'"
              class="size-7 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
            />
            <Transition name="pop">
              <span
                v-if="plantStore.category === c.value"
                class="absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary-600 text-white shadow-md ring-2 ring-white"
              >
                <Icon
                  name="lucide:check"
                  class="size-3"
                />
              </span>
            </Transition>
          </span>
          <span
            class="w-full truncate text-center text-xs transition-colors duration-300"
            :class="plantStore.category === c.value ? 'font-semibold text-primary-700' : 'text-ink-muted'"
          >{{ c.label }}</span>
        </button>
      </div>

      <!-- فیلترهای پیشرفته -->
      <Transition name="panel">
        <div
          v-if="showAdvanced"
          class="mb-6 flex origin-top flex-col flex-wrap gap-3 rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50/80 via-primary-50/40 to-transparent p-4 shadow-sm shadow-primary-900/5 sm:flex-row sm:items-center"
        >
          <div
            v-for="(dd, i) in [
              { model: 'difficulty', options: difficulties },
              { model: 'light', options: lightOptions },
              { model: 'family', options: familyDropdownOptions, placeholder: t('pages.catalog.family') },
              { model: 'genus', options: genusDropdownOptions, placeholder: t('pages.catalog.genus') },
            ]"
            :key="dd.model"
            class="reveal relative z-0 focus-within:z-30 sm:w-56"
            :style="{ '--i': i }"
          >
            <AppDropdown
              :model-value="plantStore[dd.model]"
              :options="dd.options"
              :placeholder="dd.placeholder"
              @update:model-value="plantStore[dd.model] = $event"
            />
          </div>
          <button
            class="reveal group inline-flex items-center gap-1.5 self-start rounded-full px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100/70 hover:text-primary-800"
            style="--i: 4"
            @click="resetFilters"
          >
            <Icon
              name="lucide:rotate-ccw"
              class="size-4 transition-transform duration-500 group-hover:-rotate-180"
            />
            {{ t('pages.catalog.clearFilters') }}
          </button>
        </div>
      </Transition>

      <!-- نوار تعداد نتایج -->
      <Transition name="fade">
        <div
          v-if="!plantStore.loading && plantStore.list.length"
          class="mb-4 flex items-center justify-between gap-3"
          aria-live="polite"
        >
          <p class="text-sm text-ink-muted">
            <span class="font-bold tabular-nums text-primary-700">{{ formattedCount }}</span>
            {{ t('pages.catalog.results') }}
          </p>
          <button
            v-if="hasActiveFilters"
            class="group inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-primary-700"
            @click="resetFilters"
          >
            <Icon
              name="lucide:rotate-ccw"
              class="size-3.5 transition-transform duration-500 group-hover:-rotate-180"
            />
            {{ t('pages.catalog.clearFilters') }}
          </button>
        </div>
      </Transition>

      <!-- ناحیه‌ی نتایج: اسکلتون / گرید / حالت خالی -->
      <Transition
        name="fade-swap"
        mode="out-in"
      >
        <!-- اسکلتون لودینگ -->
        <div
          v-if="plantStore.loading"
          key="loading"
          class="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          <div
            v-for="i in 8"
            :key="i"
            class="reveal overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
            :style="{ '--i': i - 1 }"
          >
            <div class="skeleton aspect-[4/3] w-full" />
            <div class="space-y-2.5 p-4">
              <div class="skeleton h-4 w-2/3 rounded-full" />
              <div class="skeleton h-3 w-1/3 rounded-full" />
            </div>
          </div>
        </div>

        <!-- نتایج -->
        <div
          v-else-if="plantStore.list.length"
          :key="resultKey"
          class="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          <div
            v-for="(plant, i) in plantStore.list"
            :key="plant.id"
            class="card-in transition-transform duration-300 hover:-translate-y-1"
            :style="{ '--i': Math.min(i, 11) }"
          >
            <PlantCard :plant="plant" />
          </div>
        </div>

        <!-- حالت خالی -->
        <div
          v-else
          key="empty"
          class="flex flex-col items-center gap-5 py-20 text-center"
        >
          <div class="relative">
            <span
              class="pulse-ring absolute inset-0 rounded-full bg-primary-300/50"
              aria-hidden="true"
            />
            <div class="float-soft relative flex size-24 items-center justify-center rounded-full bg-primary-50 ring-8 ring-primary-200/50">
              <Icon
                name="lucide:search-x"
                class="size-10 text-primary-400"
              />
            </div>
          </div>
          <p class="text-lg font-semibold text-ink">
            {{ t('pages.catalog.empty') }}
          </p>
          <button
            class="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 active:scale-95"
            @click="resetFilters"
          >
            <Icon
              name="lucide:rotate-ccw"
              class="size-4"
            />
            {{ t('pages.catalog.clearFilters') }}
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* ── ورود پله‌ای عناصر ── */
.reveal {
  animation: fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i, 0) * 80ms);
}
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

/* ── ورود پله‌ای کارت‌ها ── */
.card-in {
  animation: card-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i, 0) * 45ms);
}
@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.97);
  }
}

/* ── تعویض نرم ناحیه‌ی نتایج ── */
.fade-swap-enter-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-swap-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-swap-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-swap-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── پنل فیلترهای پیشرفته ── */
.panel-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.panel-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.99);
}

/* ── بَج تیک دسته‌بندی (اسپرینگ) ── */
.pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-leave-active {
  transition: all 0.15s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0);
}

/* ── تعویض آیکن دکمه‌ی فیلتر ── */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.icon-swap-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}
.icon-swap-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}

/* ── اسکلتون شیمر ── */
.skeleton {
  position: relative;
  overflow: hidden;
  background-color: rgb(0 0 0 / 0.06);
}
.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.6), transparent);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* ── تزئینات ── */
.blob {
  animation: blob 9s ease-in-out infinite alternate;
}
@keyframes blob {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(24px, 14px) scale(1.08);
  }
}
.leaf-sway {
  animation: sway 5s ease-in-out infinite;
  transform-origin: 50% 90%;
}
@keyframes sway {
  0%, 100% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(10deg);
  }
}
.float-soft {
  animation: float-soft 4s ease-in-out infinite;
}
@keyframes float-soft {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
.pulse-ring {
  animation: pulse-ring 2.4s ease-out infinite;
}
@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  70%, 100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

/* ── دسترسی‌پذیری: کاربرانی که انیمیشن کمتر می‌خواهند ── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>