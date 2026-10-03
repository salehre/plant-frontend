<script setup lang="ts">
definePageMeta({ layout: 'default' })

const wishlistStore = useWishlistStore()
const { plants, loading, load } = useWishlistPlants()
const { t } = useI18n()
await load()
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
    <NuxtLink
      to="/profile"
      class="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-primary-700"
    >
      <Icon
        name="lucide:arrow-right"
        class="size-4"
      />
      {{ t('pages.common.backToProfile') }}
    </NuxtLink>

    <div class="flex items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-ink">
          {{ t('pages.wishlist.title') }}
          <span class="text-base font-normal text-ink-muted">({{ toPersianDigits(wishlistStore.count) }})</span>
        </h1>
        <p class="text-ink-muted">
          {{ t('pages.wishlist.subtitle') }}
        </p>
      </div>
      <NuxtLink
        to="/plants"
        class="shrink-0 text-sm text-primary-700 hover:underline"
      >
        {{ t('pages.wishlist.explore') }}
      </NuxtLink>
    </div>

    <div
      v-if="loading"
      class="flex flex-col gap-3"
    >
      <AppSkeleton
        v-for="i in 3"
        :key="i"
        height="88px"
        rounded="rounded-[28px]"
      />
    </div>

    <div
      v-else-if="plants.length"
      class="flex flex-col gap-3"
    >
      <PlantResultCard
        v-for="plant in plants"
        :key="plant.id"
        :name="plant.name"
        :scientific-name="plant.scientificName"
        :image="plant.images[0]"
        :slug="plant.slug"
        :meta="plant.category"
        :plant="plant"
      />
    </div>

    <div
      v-else
      class="rounded-lg border border-dashed border-ink/15 px-4 py-8 text-center text-sm text-ink-muted"
    >
      {{ t('pages.wishlist.empty') }}
    </div>
  </div>
</template>