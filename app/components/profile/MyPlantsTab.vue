<script setup lang="ts">
const { t } = useI18n()
const userPlantsStore = useUserPlantsStore()
const { plants: favoritePlants, load: loadFavorites } = useWishlistPlants()

onMounted(() => { void loadFavorites() })

const myPlants = computed(() => userPlantsStore.plants.slice(0, 8))
const favorites = computed(() => favoritePlants.value.slice(0, 10))

const healthClass: Record<string, string> = {
  healthy: 'bg-primary-50 text-primary-700',
  needs_attention: 'bg-accent-50 text-accent-700',
  sick: 'bg-status-danger/10 text-status-danger',
}

function onImageError(e: Event) {
  (e.target as HTMLImageElement).style.visibility = 'hidden'
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- گیاه‌های من -->
    <section class="glass-card p-5 sm:p-6">
      <header class="mb-5 flex items-center justify-between gap-3">
        <div class="min-w-0">
          <h2 class="text-lg font-bold text-ink">
            {{ t('pages.profile.myPlants.title') }}
          </h2>
          <p class="text-xs text-ink-muted">
            {{ t('pages.profile.plantsMeta', { n: userPlantsStore.plants.length }) }}
          </p>
        </div>
        <NuxtLink
          to="/my-plants"
          class="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink/5 px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-primary-50 hover:text-primary-700"
        >
          {{ t('common.seeAll') }}
        </NuxtLink>
      </header>

      <div
        v-if="myPlants.length"
        class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        <NuxtLink
          v-for="plant in myPlants"
          :key="plant.id"
          :to="`/my-plants/${plant.id}`"
          class="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          <div class="relative aspect-square overflow-hidden bg-primary-50">
            <img
              :src="plant.photo"
              :alt="plant.nickname"
              class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              @error="onImageError"
            >
            <span
              class="absolute start-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm"
              :class="healthClass[plant.healthStatus]"
            >
              {{ healthLabel(plant.healthStatus) }}
            </span>
          </div>
          <div class="flex flex-col gap-0.5 p-3">
            <p class="truncate text-sm font-bold text-ink transition-colors group-hover:text-primary-700">
              {{ plant.nickname }}
            </p>
            <p class="truncate text-xs text-ink-muted">
              {{ plant.location }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <div
        v-else
        class="flex flex-col items-center gap-3 rounded-xl bg-primary-50/60 px-4 py-8 text-center"
      >
        <p class="text-sm text-ink-muted">
          {{ t('pages.profile.myPlants.empty') }}
        </p>
        <NuxtLink
          to="/my-plants"
          class="text-xs font-bold text-primary-700 hover:underline"
        >
          {{ t('pages.profile.myPlants.emptyCta') }}
        </NuxtLink>
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
              {{ t('pages.profile.myFavorites') }}
            </h2>
            <p class="text-xs text-ink-muted">
              {{ t('pages.profile.plantsMeta', { n: favorites.length }) }}
            </p>
          </div>
        </div>
        <NuxtLink
          to="/wishlist"
          class="group inline-flex shrink-0 items-center gap-1 rounded-full bg-ink/5 px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-primary-50 hover:text-primary-700"
        >
          {{ t('common.seeAll') }}
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
  </div>
</template>
