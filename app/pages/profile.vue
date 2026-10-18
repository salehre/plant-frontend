<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()
const authStore = useAuthStore()
const userPlantsStore = useUserPlantsStore()
const historyStore = useHistoryStore()
const { processing: coverProcessing, pick: pickCover, remove: removeCover } = useCoverUpload()
const coverInput = ref<HTMLInputElement | null>(null)
const { plants: favoritePlants, load: loadFavorites } = useWishlistPlants()

onMounted(() => { void loadFavorites() })

const intlLocale = computed(() => locale.value === 'fa' ? 'fa-IR' : 'en-US')
const user = computed(() => authStore.user)
const displayName = computed(() => user.value?.name || t('pages.profile.account'))

const joinedLabel = computed(() => {
  if (!user.value?.joinedAt) return ''
  const date = new Intl.DateTimeFormat(intlLocale.value, { month: 'long', year: 'numeric' }).format(new Date(user.value.joinedAt))
  return t('pages.profile.joined', { date })
})

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(intlLocale.value, { dateStyle: 'medium' }).format(new Date(timestamp))
}
function formatPercent(value: number) {
  return t('components.confidenceScore.percentage', {
    value: new Intl.NumberFormat(locale.value, { useGrouping: false }).format(Math.round(value * 100)),
  })
}

const plantCount = computed(() => userPlantsStore.plants.length)
const healthyCount = computed(() => userPlantsStore.plants.filter(p => p.healthStatus === 'healthy').length)
const healthRate = computed(() => plantCount.value ? Math.round(healthyCount.value / plantCount.value * 100) : 0)

const stats = computed(() => [
  { icon: 'lucide:sprout', value: toPersianDigits(plantCount.value), label: 'pages.dashboard.plant' },
  { icon: 'lucide:scan-line', value: toPersianDigits(historyStore.count), label: 'pages.dashboard.totalScans' },
  { icon: 'lucide:leaf', value: toPersianDigits(new Set(historyStore.entries.map(e => e.scientificName)).size), label: 'pages.dashboard.speciesIdentified' },
  { icon: 'lucide:heart-pulse', value: `${toPersianDigits(healthRate.value)}٪`, label: 'pages.dashboard.healthRate' },
])

const recent = computed(() => historyStore.sorted.slice(0, 3))
const favorites = computed(() => favoritePlants.value.slice(0, 3))

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
  <div class="flex flex-col gap-6">
    <!-- کاور + مشخصات کاربر -->
    <section class="glass-card overflow-hidden">
      <div class="relative h-36 sm:h-44">
        <img
          :src="user?.cover || '/images/plants/header.png'"
          :alt="$t('home.greenLeavesAlt')"
          class="size-full object-cover"
        >

        <div
          v-if="coverProcessing"
          class="absolute inset-0 flex items-center justify-center bg-black/40 text-white"
        >
          <Icon
            name="svg-spinners:ring-resize"
            class="size-7"
          />
        </div>

        <div
          v-if="authStore.isLoggedIn"
          class="absolute end-3 top-3 flex items-center gap-2"
        >
          <button
            v-if="user?.cover"
            type="button"
            class="flex size-9 items-center justify-center rounded-xl bg-surface/90 text-primary-700 shadow-card backdrop-blur transition-colors hover:bg-surface disabled:opacity-60"
            :aria-label="$t('pages.profile.removeCover')"
            :title="$t('pages.profile.removeCover')"
            :disabled="coverProcessing"
            @click="removeCover"
          >
            <Icon
              name="lucide:trash-2"
              class="size-[18px]"
            />
          </button>
          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-xl bg-surface/90 text-primary-700 shadow-card backdrop-blur transition-colors hover:bg-surface disabled:opacity-60"
            :aria-label="$t('pages.profile.changeCover')"
            :title="$t('pages.profile.changeCover')"
            :disabled="coverProcessing"
            @click="coverInput?.click()"
          >
            <Icon
              name="lucide:camera"
              class="size-[18px]"
            />
          </button>
          <input
            ref="coverInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="pickCover"
          >
        </div>
      </div>

      <div class="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end">
        <AvatarUploader
          avatar-class="size-24 ring-4 ring-surface"
          class="-mt-12 z-10"
        />

        <div class="min-w-0 flex-1 pt-2 sm:pb-1">
          <h1 class="truncate text-2xl font-bold text-ink">
            {{ displayName }}
          </h1>
          <p
            v-if="user?.email"
            class="truncate text-sm text-ink-muted"
          >
            {{ user.email }}
          </p>
          <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
            <span
              v-if="joinedLabel"
              class="inline-flex items-center gap-1.5"
            >
              <Icon
                name="lucide:calendar"
                class="size-3.5"
              />
              {{ joinedLabel }}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <Icon
                name="lucide:sprout"
                class="size-3.5"
              />
              {{ $t('pages.dashboard.plant') }}: {{ toPersianDigits(plantCount) }}
            </span>
          </div>
        </div>

        <NuxtLink
          to="/settings"
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/10 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-primary-50 sm:mb-1"
        >
          <Icon
            name="lucide:pencil"
            class="size-4"
          />
          {{ $t('pages.profile.editProfile') }}
        </NuxtLink>
      </div>
    </section>

    <!-- آمار -->
    <section class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="glass-card flex flex-col gap-3 p-4"
      >
        <span class="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
          <Icon
            :name="stat.icon"
            class="size-5"
          />
        </span>
        <div>
          <p class="text-2xl font-extrabold leading-none text-ink">
            {{ stat.value }}
          </p>
          <p class="mt-1.5 text-xs text-ink-muted">
            {{ $t(stat.label) }}
          </p>
        </div>
      </div>
    </section>

    <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div class="flex min-w-0 flex-col gap-5">

        <ActivityFeed />

        <!-- علاقه‌مندی‌ها -->
        <section
          v-if="favorites.length"
          class="glass-card p-4 sm:p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="font-bold text-ink">
              {{ $t('pages.profile.myFavorites') }}
            </h2>
            <NuxtLink
              to="/wishlist"
              class="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              {{ $t('common.seeAll') }}
            </NuxtLink>
          </div>
          <div class="grid grid-cols-3 gap-2 sm:gap-3">
            <NuxtLink
              v-for="plant in favorites"
              :key="plant.id"
              :to="`/plants/${plant.slug}`"
              class="group flex min-w-0 flex-col gap-2.5 rounded-2xl border border-ink/5 bg-surface p-1.5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover sm:p-2.5"
            >
              <div class="aspect-square overflow-hidden rounded-xl bg-primary-50">
                <img
                  :src="plant.images[0]"
                  :alt="plant.name"
                  class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                >
              </div>
              <div class="min-w-0 px-0.5 pb-0.5">
                <p class="truncate text-xs font-bold text-ink sm:text-sm">
                  {{ plant.name }}
                </p>
                <p class="truncate text-[11px] italic text-ink-muted">
                  {{ plant.scientificName }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </section>

        <!-- آخرین اسکن‌ها -->
        <section
          v-if="recent.length"
          class="glass-card p-4 sm:p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="font-bold text-ink">
              {{ $t('pages.profile.history') }}
            </h2>
            <NuxtLink
              to="/history"
              class="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              {{ $t('common.seeAll') }}
            </NuxtLink>
          </div>
          <div class="grid grid-cols-3 gap-2 sm:gap-3">
            <NuxtLink
              v-for="entry in recent"
              :key="entry.id"
              :to="entry.slug ? `/plants/${entry.slug}` : '/history'"
              class="group flex min-w-0 flex-col gap-2.5 rounded-2xl border border-ink/5 bg-surface p-1.5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover sm:p-2.5"
            >
              <div class="relative aspect-square overflow-hidden rounded-xl bg-primary-50">
                <Icon
                  name="lucide:leaf"
                  class="absolute inset-0 m-auto size-6 text-primary-400"
                />
                <img
                  :src="entry.image"
                  :alt="entry.plantName"
                  class="relative size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  @error="onImageError"
                >
              </div>
              <div class="min-w-0 px-0.5 pb-0.5">
                <p class="truncate text-xs font-bold text-ink sm:text-sm">
                  {{ entry.plantName }}
                </p>
                <p class="truncate text-[11px] italic text-ink-muted">
                  {{ entry.scientificName }}
                </p>
                <p class="truncate text-[11px] font-medium text-primary-700">
                  {{ formatPercent(entry.confidence) }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </section>
      </div>

      <!-- دسترسی سریع -->
      <section class="glass-card p-4 sm:p-5">
        <h2 class="mb-2 font-bold text-ink">
          {{ $t('pages.profile.quickActions') }}
        </h2>
        <ul class="divide-y divide-ink/5">
          <li
            v-for="action in quickActions"
            :key="action.to"
          >
            <NuxtLink
              :to="action.to"
              class="flex items-center gap-3 py-3"
            >
              <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Icon
                  :name="action.icon"
                  class="size-5"
                />
              </span>
              <span class="flex-1 text-sm font-medium text-ink">{{ $t(action.label) }}</span>
              <Icon
                name="lucide:chevron-left"
                class="size-4 shrink-0 text-ink-muted ltr:rotate-180"
              />
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>