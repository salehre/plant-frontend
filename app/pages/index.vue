<script setup lang="ts">
import { mockDiseases } from '~/services/mock/diseases.mock'

const plantStore = usePlantStore()
const { data: featured } = await useAsyncData('featured-plants', () => plantStore.fetchFeatured().then(() => plantStore.featured))

const uiStore = useUiStore()
const searchQuery = ref('')

function onSearch() {
  navigateTo({ path: '/plants', query: searchQuery.value ? { q: searchQuery.value } : {} })
}
</script>

<template>
  <div>
    <section class="hero-leaves relative overflow-hidden px-4 py-10 sm:py-16">
      <img
        src="/images/bg-image/spring.webp"
        alt=""
        class="absolute inset-0 size-full object-cover"
      >
      <div class="absolute inset-0 bg-black/25" />

      <div class="relative z-10 mx-auto max-w-5xl">
        <LiquidGlassPanel>
          <div class="flex flex-col gap-8 p-6 sm:p-10">
            <!-- نوار بالا -->
            <div class="flex items-center gap-3 text-white/90">
              <button
                type="button"
                aria-label="منو"
                class="flex flex-col justify-center gap-1"
                @click="uiStore.mobileNavOpen = true"
              >
                <span class="block h-0.5 w-5 rounded-full bg-white/90" />
                <span class="block h-0.5 w-5 rounded-full bg-white/90" />
                <span class="block h-0.5 w-5 rounded-full bg-white/90" />
              </button>
              <span class="text-sm">درباره‌ی زندگی و گیاهان</span>
            </div>

            <!-- عکس + عنوان -->
            <div class="grid grid-cols-1 items-center gap-8 sm:grid-cols-[220px_1fr]">
              <div class="aspect-square overflow-hidden rounded-2xl border border-white/25 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800"
                  alt="برگ‌های سبز"
                  class="size-full object-cover"
                  loading="lazy"
                >
              </div>

              <div>
                <h1 class="mb-6 text-3xl font-extrabold leading-tight text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.35)] sm:text-5xl">
                  لذت طبیعت
                </h1>

                <div class="max-w-md border-t border-white/25 pt-4">
                  <h2 class="mb-3 text-lg font-semibold text-white sm:text-xl">
                    {{ $t('home.heroTitle') }}
                  </h2>
                  <p class="text-sm leading-7 text-white/80">
                    {{ $t('home.heroSubtitle') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- نوار پایین -->
            <div class="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5">
              <span class="text-sm text-white/90">ارتباط با طبیعت</span>
              <div class="flex flex-wrap gap-3">
                <NuxtLink
                  to="/identify"
                  class="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm text-white transition-colors hover:bg-white/10"
                >
                  <Icon
                    name="lucide:scan-line"
                    class="size-4"
                  />
                  {{ $t('home.identifyCta') }}
                </NuxtLink>
                <NuxtLink
                  to="/plants"
                  class="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm text-white transition-colors hover:bg-white/10"
                >
                  دایرة‌المعارف
                </NuxtLink>
              </div>
            </div>
          </div>
        </LiquidGlassPanel>

        <!-- جستجو - جدا از کارت شیشه‌ای تا چیدمان مرجع دست‌نخورده بمونه -->
        <form
          class="mx-auto mt-6 flex w-full max-w-md gap-2"
          @submit.prevent="onSearch"
        >
          <div class="relative flex-1">
            <Icon
              name="lucide:search"
              class="absolute top-1/2 start-3 size-4 -translate-y-1/2 text-ink-muted"
            />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('common.searchPlaceholder')"
              class="w-full rounded-full border-0 bg-surface py-3 ps-9 pe-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
          </div>
          <AppButton
            type="submit"
            variant="primary"
          >
            {{ $t('common.search') }}
          </AppButton>
        </form>
      </div>
    </section>

    <!-- Featured Plants -->
    <section class="mx-auto max-w-6xl px-4 py-14">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold text-ink">
          {{ $t('home.featuredPlants') }}
        </h2>
        <NuxtLink
          to="/plants"
          class="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {{ $t('common.seeAll') }}
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <PlantCard
          v-for="plant in featured"
          :key="plant.id"
          :plant="plant"
        />
      </div>
    </section>

    <!-- Popular Diseases -->
    <section class="bg-primary-50/50 py-14">
      <div class="mx-auto max-w-6xl px-4">
        <h2 class="mb-6 text-xl font-bold text-ink">
          {{ $t('home.popularDiseases') }}
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="disease in mockDiseases"
            :key="disease.id"
            :to="`/identify`"
            class="flex flex-col gap-2 rounded-lg bg-surface p-4 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <img
              :src="disease.image"
              :alt="disease.name"
              class="h-28 w-full rounded-md object-cover"
              loading="lazy"
            >
            <span class="text-sm font-medium text-ink">{{ disease.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Educational Content -->
    <section class="mx-auto max-w-6xl px-4 py-14">
      <h2 class="mb-6 text-xl font-bold text-ink">
        شروع کن با این راهنماها
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-lg border border-ink/5 p-5">
          <Icon
            name="lucide:droplets"
            class="mb-3 size-6 text-primary-600"
          />
          <h3 class="mb-1 font-medium text-ink">
            آبیاری اصولی
          </h3>
          <p class="text-sm text-ink-muted">
            یاد بگیر چطور آبیاری بیش‌ازحد را تشخیص بدی و از پوسیدگی ریشه جلوگیری کنی.
          </p>
        </div>
        <div class="rounded-lg border border-ink/5 p-5">
          <Icon
            name="lucide:sun"
            class="mb-3 size-6 text-primary-600"
          />
          <h3 class="mb-1 font-medium text-ink">
            نورسنجی خانه
          </h3>
          <p class="text-sm text-ink-muted">
            هر گوشه خانه‌ات چقدر نور می‌گیرد و کدام گیاه با آن سازگار است؟
          </p>
        </div>
        <div class="rounded-lg border border-ink/5 p-5">
          <Icon
            name="lucide:bug"
            class="mb-3 size-6 text-primary-600"
          />
          <h3 class="mb-1 font-medium text-ink">
            تشخیص زودهنگام آفت
          </h3>
          <p class="text-sm text-ink-muted">
            نشانه‌های اولیه آفت و بیماری را قبل از گسترش شناسایی کن.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-leaves {
  min-height: 560px;
  display: flex;
  align-items: center;
}
</style>
