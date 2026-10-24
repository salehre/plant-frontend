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
    value: `${toPersianDigits(healthRate.value)}%`,
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
  <div class="relative min-h-screen">
    <!-- حباب‌های نوری پس‌زمینه -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -start-20 size-96 rounded-full bg-primary-100/40 blur-3xl" />
      <div class="absolute top-1/3 -end-20 size-80 rounded-full bg-emerald-100/30 blur-3xl" />
      <div class="absolute bottom-0 start-1/2 size-80 rounded-full bg-teal-100/20 blur-3xl" />
    </div>

    <div class="flex flex-col gap-5 pb-6 sm:gap-8">
      <!-- کاور و مشخصات کاربر -->
      <section class="glass-card relative overflow-hidden">
        <div class="pointer-events-none absolute -top-24 -end-10 size-64 rounded-full bg-primary-400/20 blur-3xl" />
        <div class="pointer-events-none absolute -bottom-32 -start-10 size-64 rounded-full bg-primary-500/10 blur-3xl" />

        <div class="relative h-44 sm:h-60">
          <img
            :src="user?.cover || '/images/plants/header.png'"
            :alt="$t('home.greenLeavesAlt')"
            class="size-full object-cover"
          >

          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div
            v-if="coverProcessing"
            class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <Icon
              name="svg-spinners:ring-resize"
              class="size-8 text-white"
            />
          </div>

          <span
            v-if="joinedLabel"
            class="absolute bottom-3 end-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md sm:bottom-4 sm:end-4 sm:px-3 sm:py-1.5 sm:text-[11px]"
          >
            <Icon
              name="lucide:calendar"
              class="size-3.5"
            />
            {{ joinedLabel }}
          </span>

          <div
            v-if="authStore.isLoggedIn"
            class="absolute end-3 top-3 flex items-center gap-2 sm:end-4 sm:top-4"
          >
            <div class="flex items-center gap-1 rounded-full border border-white/10 bg-black/30 p-1 backdrop-blur-md">
              <button
                v-if="user?.cover"
                type="button"
                class="flex size-8 items-center justify-center rounded-full text-white/90 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
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
                class="flex size-8 items-center justify-center rounded-full text-white/90 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
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
            </div>
          </div>

          <input
            ref="coverInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="pickCover"
          >
        </div>

        <div class="relative px-4 pb-6 sm:px-8 sm:pb-8">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div class="relative z-10 -mt-12 w-fit shrink-0 sm:-mt-14">
                <AvatarUploader
                  avatar-class="size-24 sm:size-32 shadow-card ring-4 ring-surface"
                />
              </div>

              <div class="min-w-0 max-w-full flex-1 sm:pt-4">
                <h1 class="truncate text-xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  {{ displayName }}
                </h1>

                <p
                  v-if="user?.email"
                  class="mt-1.5 flex min-w-0 items-center gap-2 text-sm text-ink-muted"
                >
                  <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    <Icon
                      name="lucide:mail"
                      class="size-3"
                    />
                  </span>
                  <span
                    class="min-w-0 truncate"
                    dir="ltr"
                  >{{ user.email }}</span>
                </p>
              </div>
            </div>

            <NuxtLink
              to="/settings"
              class="group flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-surface shadow-card transition-all hover:bg-ink/90 hover:shadow-card-hover active:scale-[0.98] sm:mb-2 sm:inline-flex sm:w-auto"
            >
              <Icon
                name="lucide:pencil"
                class="size-4 transition-transform group-hover:rotate-12"
              />
              {{ $t('pages.profile.editProfile') }}
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- آمار -->
      <section class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="stat-card group glass-card relative overflow-hidden p-5 transition-shadow duration-300 hover:shadow-card-hover"
        >


          <div class="relative z-10 flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-3xl font-extrabold leading-none tracking-tight text-ink">
                {{ stat.value }}
              </p>
              <p class="mt-2 text-xs font-medium text-ink-muted">
                {{ $t(stat.label) }}
              </p>
            </div>
              <Icon
                :name="stat.icon"
                class="size-5"
              />
          </div>
        </div>
      </section>

      <!-- علاقه‌مندی‌ها -->
      <section
        v-if="favorites.length"
        class="glass-card p-5 sm:p-6"
      >
        <header class="mb-5 flex items-center justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <Icon
                name="lucide:heart"
                class="size-5"
              />
            </span>

            <div class="min-w-0">
              <h2 class="truncate text-lg font-bold text-ink">
                {{ $t('pages.profile.myFavorites') }}
              </h2>
              <p class="text-xs text-ink-muted">
                {{ toPersianDigits(favorites.length) }} گیاه
              </p>
            </div>
          </div>

          <NuxtLink
            to="/wishlist"
            class="group inline-flex shrink-0 items-center gap-1 rounded-full bg-ink/5 px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-primary-50 hover:text-primary-700"
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
          :slides-per-view="2.4"
          :space-between="12"
          :breakpoints="{ 640: { slidesPerView: 3.2, spaceBetween: 16 }, 1024: { slidesPerView: 4.2, spaceBetween: 16 } }"
          class="-mx-5 px-5 pb-2 sm:-mx-6 sm:px-6"
        >
          <template #default="{ item: plant }">
            <NuxtLink
              :to="`/plants/${plant.slug}`"
              class="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-ink/5 transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div class="relative aspect-[4/3] overflow-hidden bg-primary-50">
                <img
                  :src="plant.images[0]"
                  :alt="plant.name"
                  class="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                  @error="onImageError"
                >

                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span class="absolute end-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-sm backdrop-blur transition-transform duration-300 group-hover:scale-110">
                  <Icon
                    name="lucide:heart"
                    class="size-4 fill-current"
                  />
                </span>
              </div>

              <div class="flex flex-1 flex-col justify-center gap-0.5 p-3">
                <p class="truncate text-sm font-bold text-ink transition-colors group-hover:text-primary-700">
                  {{ plant.name }}
                </p>
                <p class="truncate text-xs italic text-ink-muted">
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
        class="glass-card p-5 sm:p-6"
      >
        <header class="mb-5 flex items-center justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
              <Icon
                name="lucide:scan-line"
                class="size-5"
              />
            </span>

            <div class="min-w-0">
              <h2 class="truncate text-lg font-bold text-ink">
                {{ $t('pages.profile.history') }}
              </h2>
              <p class="text-xs text-ink-muted">
                {{ toPersianDigits(recent.length) }} اسکن اخیر
              </p>
            </div>
          </div>

          <NuxtLink
            to="/history"
            class="group inline-flex shrink-0 items-center gap-1 rounded-full bg-ink/5 px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-primary-50 hover:text-primary-700"
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
          :slides-per-view="2.4"
          :space-between="12"
          :breakpoints="{ 640: { slidesPerView: 3.2, spaceBetween: 16 }, 1024: { slidesPerView: 4.2, spaceBetween: 16 } }"
          class="-mx-5 px-5 pb-2 sm:-mx-6 sm:px-6"
        >
          <template #default="{ item: entry }">
            <NuxtLink
              :to="entry.slug ? `/plants/${entry.slug}` : '/history'"
              class="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-ink/5 transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div class="relative aspect-[4/3] overflow-hidden bg-primary-50">
                <img
                  :src="entry.image"
                  :alt="entry.plantName"
                  class="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                  @error="onImageError"
                >

                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <span class="absolute end-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                  <Icon
                    name="lucide:clock"
                    class="size-3"
                  />
                  {{ formatDate(entry.timestamp) }}
                </span>

                <span class="absolute bottom-2.5 start-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-primary-700 shadow-sm backdrop-blur">
                  <Icon
                    name="lucide:scan-line"
                    class="size-3"
                  />
                  {{ formatPercent(entry.confidence) }}
                </span>
              </div>

              <div class="flex flex-1 flex-col justify-center gap-0.5 p-3">
                <p class="truncate text-sm font-bold text-ink transition-colors group-hover:text-primary-700">
                  {{ entry.plantName }}
                </p>
                <p class="truncate text-xs italic text-ink-muted">
                  {{ entry.scientificName }}
                </p>
              </div>
            </NuxtLink>
          </template>
        </AppSlider>
      </section>

      <!-- فعالیت‌های اخیر -->
      <ActivityFeed />
    </div>
  </div>
</template>

<style scoped>
@property --stat-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 20;
  padding: 1px;
  border-radius: inherit;
  pointer-events: none;
  background: conic-gradient(
    from var(--stat-angle),
    transparent 0%,
    transparent 65%,
    rgb(var(--color-primary-500)) 90%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: stat-border-spin 2.5s linear infinite;
}

.stat-card:hover::before {
  opacity: 1;
}

@keyframes stat-border-spin {
  to {
    --stat-angle: 360deg;
  }
}
</style>