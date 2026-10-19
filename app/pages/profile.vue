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

  const date = new Intl.DateTimeFormat(intlLocale.value, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(user.value.joinedAt))

  return t('pages.profile.joined', { date })
})

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(intlLocale.value, {
    dateStyle: 'medium',
  }).format(new Date(timestamp))
}

function formatPercent(value: number) {
  return t('components.confidenceScore.percentage', {
    value: new Intl.NumberFormat(locale.value, {
      useGrouping: false,
    }).format(Math.round(value * 100)),
  })
}

const plantCount = computed(() => userPlantsStore.plants.length)

const healthyCount = computed(() =>
  userPlantsStore.plants.filter(p => p.healthStatus === 'healthy').length,
)

const healthRate = computed(() =>
  plantCount.value
    ? Math.round(healthyCount.value / plantCount.value * 100)
    : 0,
)

const stats = computed(() => [
  {
    icon: 'lucide:sprout',
    value: toPersianDigits(plantCount.value),
    label: 'pages.dashboard.plant',
  },
  {
    icon: 'lucide:scan-line',
    value: toPersianDigits(historyStore.count),
    label: 'pages.dashboard.totalScans',
  },
  {
    icon: 'lucide:leaf',
    value: toPersianDigits(
      new Set(historyStore.entries.map(e => e.scientificName)).size,
    ),
    label: 'pages.dashboard.speciesIdentified',
  },
  {
    icon: 'lucide:heart-pulse',
    value: `${toPersianDigits(healthRate.value)}٪`,
    label: 'pages.dashboard.healthRate',
  },
])

const recent = computed(() => historyStore.sorted.slice(0, 10))
const favorites = computed(() => favoritePlants.value.slice(0, 10))

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
    <!-- کاور و مشخصات کاربر -->
    <section class="glass-card relative overflow-hidden">
      <div class="pointer-events-none absolute -top-20 -end-14 size-56 rounded-full bg-primary-400/20 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-24 -start-14 size-56 rounded-full bg-primary-500/10 blur-3xl" />

      <div class="relative h-40 sm:h-52">
        <img
          :src="user?.cover || '/images/plants/header.png'"
          :alt="$t('home.greenLeavesAlt')"
          class="size-full object-cover"
        >

        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

        <div
          v-if="coverProcessing"
          class="absolute inset-0 flex items-center justify-center bg-black/40 text-white backdrop-blur-[2px]"
        >
          <Icon
            name="svg-spinners:ring-resize"
            class="size-7"
          />
        </div>

        <div
          v-if="authStore.isLoggedIn"
          class="absolute bottom-3 end-3 flex items-center gap-1.5"
        >
          <button
            v-if="user?.cover"
            type="button"
            class="flex size-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:opacity-50"
            :aria-label="$t('pages.profile.removeCover')"
            :title="$t('pages.profile.removeCover')"
            :disabled="coverProcessing"
            @click="removeCover"
          >
            <Icon
              name="lucide:trash-2"
              class="size-4"
            />
          </button>

          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:opacity-50"
            :aria-label="$t('pages.profile.changeCover')"
            :title="$t('pages.profile.changeCover')"
            :disabled="coverProcessing"
            @click="coverInput?.click()"
          >
            <Icon
              name="lucide:camera"
              class="size-4"
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

      <div class="relative flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end">
        <div class="relative z-10 -mt-12 shrink-0 sm:-mt-14">
          <AvatarUploader
            avatar-class="size-24 shadow-card ring-4 ring-surface sm:size-28"
          />
        </div>

        <div class="min-w-0 flex-1 sm:pb-1.5">
          <h1 class="truncate text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            {{ displayName }}
          </h1>

          <p
            v-if="user?.email"
            class="mt-0.5 flex items-center gap-1.5 truncate text-sm text-ink-muted"
          >
            <Icon
              name="lucide:mail"
              class="size-3.5 shrink-0"
            />
            {{ user.email }}
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <span
              v-if="joinedLabel"
              class="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700"
            >
              <Icon
                name="lucide:calendar"
                class="size-3.5"
              />
              {{ joinedLabel }}
            </span>

            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">
              <Icon
                name="lucide:sprout"
                class="size-3.5"
              />
              {{ $t('pages.dashboard.plant') }}:
              {{ toPersianDigits(plantCount) }}
            </span>

            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">
              <Icon
                name="lucide:heart-pulse"
                class="size-3.5"
              />
              {{ toPersianDigits(healthRate) }}٪
            </span>
          </div>
        </div>

        <NuxtLink
          to="/settings"
          class="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-700 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.98] sm:mb-1.5"
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
        class="glass-card group relative overflow-hidden p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        <!-- شاخه‌ی گیاه تزئینی -->
        <svg
          aria-hidden="true"
          viewBox="0 0 140 150"
          fill="none"
          class="pointer-events-none absolute -bottom-3 -end-2 z-0 h-32 w-28 origin-bottom text-primary-700/35 opacity-90 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-2 motion-reduce:transition-none"
        >
          <!-- ساقه و شاخه‌ها -->
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M119 150C111 130 102 111 91 91C79 69 63 49 44 32"
              stroke-width="2"
              stroke-opacity=".65"
            />
            <path d="M59 49L49 50" stroke-width="1.4" stroke-opacity=".55" />
            <path d="M70 68L65 68" stroke-width="1.4" stroke-opacity=".55" />
            <path d="M89 91L84 92" stroke-width="1.4" stroke-opacity=".55" />
            <path d="M103 111L96 112" stroke-width="1.4" stroke-opacity=".55" />
            <path d="M114 133L110 132" stroke-width="1.4" stroke-opacity=".55" />
          </g>

          <!-- برگ‌ها -->
          <g
            fill="currentColor"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="1"
          >
            <path
              d="M49 50C35 49 22 41 14 29C9 22 11 14 18 10C31 13 42 23 48 35C51 41 52 47 49 50Z"
              fill-opacity=".55"
              stroke-opacity=".45"
            />
            <path
              d="M65 68C69 54 81 43 97 38C105 35 112 39 113 46C109 60 99 72 85 78C77 81 69 76 65 68Z"
              fill-opacity=".48"
              stroke-opacity=".45"
            />
            <path
              d="M84 92C70 91 56 84 47 73C42 67 44 59 51 55C65 59 76 67 83 78C87 83 88 88 84 92Z"
              fill-opacity=".52"
              stroke-opacity=".45"
            />
            <path
              d="M96 112C99 98 110 87 124 82C131 79 137 83 137 90C134 103 124 114 111 120C104 123 98 119 96 112Z"
              fill-opacity=".45"
              stroke-opacity=".45"
            />
            <path
              d="M110 132C96 133 82 127 73 117C67 111 69 103 76 99C90 103 102 112 109 123C112 127 113 130 110 132Z"
              fill-opacity=".5"
              stroke-opacity=".45"
            />
          </g>

          <!-- رگ‌برگ‌ها -->
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width=".8"
            stroke-opacity=".6"
          >
            <path d="M49 50C39 37 29 23 18 10" />
            <path d="M42 41L29 38M36 33L25 29M30 25L22 21" />

            <path d="M65 68C81 60 97 52 113 46" />
            <path d="M75 63L80 52M85 58L93 48M97 53L104 43" />

            <path d="M84 92C72 79 61 67 50 56" />
            <path d="M77 85L63 83M69 76L58 73M61 67L53 64" />

            <path d="M96 112C110 103 123 95 136 89" />
            <path d="M106 105L109 94M116 98L123 88M127 92L131 85" />

            <path d="M110 132C98 120 86 109 75 100" />
            <path d="M101 125L87 122M92 117L82 110M83 109L77 103" />
          </g>
        </svg>

        <div class="relative z-10">
          <span class="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-card">
            <Icon
              :name="stat.icon"
              class="size-5"
            />
          </span>

          <p class="text-2xl font-extrabold leading-none text-ink">
            {{ stat.value }}
          </p>

          <p class="mt-1.5 text-[11px] font-medium text-ink-muted">
            {{ $t(stat.label) }}
          </p>
        </div>
      </div>
    </section>

    <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div class="flex min-w-0 flex-col gap-5">
        <ActivityFeed />

        <!-- علاقه‌مندی‌ها -->
        <section
          v-if="favorites.length"
          class="glass-card p-4 sm:p-5"
        >
          <header class="mb-4 flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-2.5">
              <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon
                  name="lucide:heart"
                  class="size-4"
                />
              </span>

              <h2 class="truncate font-bold text-ink">
                {{ $t('pages.profile.myFavorites') }}
              </h2>

              <span class="shrink-0 rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-bold text-ink-muted">
                {{ toPersianDigits(favorites.length) }}
              </span>
            </div>

            <NuxtLink
              to="/wishlist"
              class="group inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              {{ $t('common.seeAll') }}
              <Icon
                name="lucide:chevron-left"
                class="size-3.5 transition-transform ltr:rotate-180 rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5"
              />
            </NuxtLink>
          </header>

          <AppSlider
            :items="favorites"
            :item-key="plant => plant.id"
            :slides-per-view="2.6"
            :space-between="8"
            :breakpoints="{ 640: { slidesPerView: 3.4, spaceBetween: 12 } }"
            class="-mx-4 px-4 py-1 sm:-mx-5 sm:px-5"
          >
            <template #default="{ item: plant }">
              <NuxtLink
                :to="`/plants/${plant.slug}`"
                class="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div class="relative aspect-[4/5] overflow-hidden bg-primary-50">
                  <Icon
                    name="lucide:leaf"
                    class="absolute inset-0 m-auto size-8 text-primary-300"
                  />

                  <img
                    :src="plant.images[0]"
                    :alt="plant.name"
                    class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    @error="onImageError"
                  >

                  <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span class="absolute end-2 top-2 flex size-7 items-center justify-center rounded-full bg-surface/90 text-rose-500 shadow-card backdrop-blur">
                    <Icon
                      name="lucide:heart"
                      class="size-3.5 fill-current"
                    />
                  </span>
                </div>

                <div class="flex min-w-0 flex-1 flex-col gap-0.5 p-3">
                  <p class="truncate text-[13px] font-bold text-ink sm:text-sm">
                    {{ plant.name }}
                  </p>
                  <p class="truncate text-[11px] italic text-ink-muted">
                    {{ plant.scientificName }}
                  </p>
                </div>
              </NuxtLink>
            </template>
          </AppSlider>
        </section>

        <!-- آخرین اسکن‌ها -->
        <section
          v-if="recent.length"
          class="glass-card p-4 sm:p-5"
        >
          <header class="mb-4 flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-2.5">
              <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon
                  name="lucide:scan-line"
                  class="size-4"
                />
              </span>

              <h2 class="truncate font-bold text-ink">
                {{ $t('pages.profile.history') }}
              </h2>

              <span class="shrink-0 rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-bold text-ink-muted">
                {{ toPersianDigits(recent.length) }}
              </span>
            </div>

            <NuxtLink
              to="/history"
              class="group inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              {{ $t('common.seeAll') }}
              <Icon
                name="lucide:chevron-left"
                class="size-3.5 transition-transform ltr:rotate-180 rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5"
              />
            </NuxtLink>
          </header>

          <AppSlider
            :items="recent"
            :item-key="entry => entry.id"
            :slides-per-view="2.6"
            :space-between="8"
            :breakpoints="{ 640: { slidesPerView: 3.4, spaceBetween: 12 } }"
            class="-mx-4 px-4 py-1 sm:-mx-5 sm:px-5"
          >
            <template #default="{ item: entry }">
              <NuxtLink
                :to="entry.slug ? `/plants/${entry.slug}` : '/history'"
                class="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div class="relative aspect-[4/5] overflow-hidden bg-primary-50">
                  <Icon
                    name="lucide:leaf"
                    class="absolute inset-0 m-auto size-8 text-primary-300"
                  />

                  <img
                    :src="entry.image"
                    :alt="entry.plantName"
                    class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    @error="onImageError"
                  >

                  <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span class="absolute end-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                    <Icon
                      name="lucide:clock"
                      class="size-3"
                    />
                    {{ formatDate(entry.timestamp) }}
                  </span>

                  <span class="absolute bottom-2 start-2 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-bold text-primary-700 shadow-card backdrop-blur">
                    <Icon
                      name="lucide:scan-line"
                      class="size-3"
                    />
                    {{ formatPercent(entry.confidence) }}
                  </span>
                </div>

                <div class="flex min-w-0 flex-1 flex-col gap-0.5 p-3">
                  <p class="truncate text-[13px] font-bold text-ink sm:text-sm">
                    {{ entry.plantName }}
                  </p>
                  <p class="truncate text-[11px] italic text-ink-muted">
                    {{ entry.scientificName }}
                  </p>
                </div>
              </NuxtLink>
            </template>
          </AppSlider>
        </section>
      </div>

      <!-- دسترسی سریع -->
      <section class="glass-card p-4 sm:p-5 lg:sticky lg:top-24">
        <header class="mb-4 flex items-center gap-2.5">
          <span class="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Icon
              name="lucide:zap"
              class="size-4"
            />
          </span>

          <h2 class="font-bold text-ink">
            {{ $t('pages.profile.quickActions') }}
          </h2>
        </header>

        <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            class="group flex flex-col items-center gap-2.5 rounded-2xl border border-ink/5 bg-surface p-3.5 text-center transition duration-300 hover:-translate-y-0.5 hover:border-primary-500/30 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <span class="flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white">
              <Icon
                :name="action.icon"
                class="size-5"
              />
            </span>

            <span class="text-xs font-semibold text-ink">
              {{ $t(action.label) }}
            </span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>