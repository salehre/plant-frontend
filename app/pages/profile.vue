<script setup lang="ts">
import { themes } from '~/stores/ui.store'
const { locale, setLocale } = useI18n()

function toggleLocale() {
  setLocale(locale.value === 'fa' ? 'en' : 'fa')
}

definePageMeta({ layout: 'default' })

const uiStore = useUiStore()
const historyStore = useHistoryStore()
const wishlistStore = useWishlistStore()

const { plants: wishlistPlants, loading: wishlistLoading, load: loadWishlistPlants } = useWishlistPlants()
await loadWishlistPlants()

function removeHistoryEntry(id: string) {
  historyStore.remove(id)
  uiStore.showToast('از تاریخچه حذف شد', 'info')
}

function clearHistory() {
  historyStore.clear()
  uiStore.showToast('تاریخچه پاک شد', 'info')
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
    <div>
      <h1 class="text-2xl font-bold text-ink">
        پروفایل
      </h1>
      <p class="text-ink-muted">
        تاریخچه‌ی اسکن‌ها، علاقه‌مندی‌ها و تنظیمات همین دستگاه.
      </p>
    </div>

    <!-- تنظیمات -->
    <section>
      <h2 class="mb-3 font-bold text-ink">
        تنظیمات
      </h2>
      <div class="glass-card flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-1 text-sm text-ink">
          <Icon
              name="material-symbols:language"
              class="size-5 text-primary-600"
          />
          {{ $t("swich_language") }}
        </div>
        <button
            type="button"
            class="flex h-9 items-center justify-center rounded-full bg-primary-50 px-3 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-100"
            :aria-label="locale === 'fa' ? 'Switch language to English' : 'تغییر زبان به فارسی'"
            @click="toggleLocale"
        >
          {{ locale === 'fa' ? 'EN' : 'فا' }}
        </button>
      </div>

      <!-- حالت روشن/تاریک -->
      <div class="mt-3 flex items-center justify-between rounded-lg bg-surface px-4 py-3 shadow-card">
        <div class="flex items-center gap-1 text-sm text-ink">
          <Icon
            :name="uiStore.mode === 'dark' ? 'material-symbols:dark-mode-outline' : 'material-symbols:light-mode-outline'"
            class="size-5 text-primary-600"
          />
          حالت نمایش
        </div>
        <button
          type="button"
          class="flex h-9 items-center justify-center rounded-full bg-primary-50 px-3 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-100"
          :aria-label="uiStore.mode === 'dark' ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'"
          @click="uiStore.toggleMode()"
        >
          {{ uiStore.mode === 'dark' ? 'تاریک' : 'روشن' }}
        </button>
      </div>

      <!-- انتخاب تم رنگی -->
      <div class="glass-card mt-3 px-4 py-3">
        <div class="mb-3 text-sm text-ink">
          تم رنگی
        </div>
        <div class="flex items-center gap-3">
          <button
              v-for="t in themes"
              :key="t.key"
              type="button"
              role="radio"
              :aria-checked="uiStore.theme === t.key"
              :aria-label="t.label"
              :title="t.label"
              class="flex size-9 items-center justify-center rounded-full ring-offset-2 ring-offset-surface transition-all"
              :class="uiStore.theme === t.key ? 'ring-2 ring-ink/60' : 'ring-1 ring-ink/10'"
              @click="uiStore.setTheme(t.key)"
          >
            <span
                class="size-6 rounded-full"
                :style="{ backgroundColor: t.swatch }"
            />
          </button>
        </div>
      </div>
    </section>

    <!-- Wishlist -->
    <section>
      <div class="mb-3 flex items-center justify-between">
        <h2 class="font-bold text-ink">
          علاقه‌مندی‌ها
          <span class="text-sm font-normal text-ink-muted">({{ toPersianDigits(wishlistStore.count) }})</span>
        </h2>
        <NuxtLink
            to="/plants"
            class="text-sm text-primary-700 hover:underline"
        >
          کاوش در دایرةالمعارف
        </NuxtLink>
      </div>

      <div
          v-if="wishlistLoading"
          class="grid grid-cols-2 gap-4 sm:grid-cols-3"
      >
        <AppSkeleton
            v-for="i in 3"
            :key="i"
            height="140px"
            rounded="rounded-lg"
        />
      </div>

      <div
          v-else-if="wishlistPlants.length"
          class="grid grid-cols-2 gap-4 sm:grid-cols-3"
      >
        <PlantCard
            v-for="plant in wishlistPlants"
            :key="plant.id"
            :plant="plant"
        />
      </div>

      <div
          v-else
          class="rounded-lg border border-dashed border-ink/15 px-4 py-8 text-center text-sm text-ink-muted"
      >
        هنوز چیزی به علاقه‌مندی‌ها اضافه نکردی. از صفحه‌ی هر گیاه می‌تونی این کار رو انجام بدی.
      </div>
    </section>

    <!-- History -->
    <section>
      <div class="mb-3 flex items-center justify-between">
        <h2 class="font-bold text-ink">
          تاریخچه‌ی اسکن‌ها
          <span class="text-sm font-normal text-ink-muted">({{ toPersianDigits(historyStore.count) }})</span>
        </h2>
        <button
            v-if="historyStore.count"
            type="button"
            class="text-sm text-status-danger hover:underline"
            @click="clearHistory"
        >
          پاک کردن همه
        </button>
      </div>

      <div
          v-if="historyStore.sorted.length"
          class="glass-card flex flex-col divide-y divide-ink/5"
      >
        <div
            v-for="entry in historyStore.sorted"
            :key="entry.id"
            class="flex items-center gap-3 px-4 py-3"
        >
          <img
              :src="entry.image"
              :alt="entry.plantName"
              class="size-12 shrink-0 rounded-md object-cover"
              loading="lazy"
          >
          <NuxtLink
              :to="entry.slug ? `/plants/${entry.slug}` : '/identify'"
              class="min-w-0 flex-1"
          >
            <p class="truncate font-medium text-ink">
              {{ entry.plantName }}
            </p>
            <p class="truncate text-xs text-ink-muted">
              {{ toJalaliDate(new Date(entry.timestamp).toISOString()) }} · اطمینان {{ formatConfidence(entry.confidence) }}
            </p>
          </NuxtLink>
          <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-status-danger/10 hover:text-status-danger"
              aria-label="حذف از تاریخچه"
              @click="removeHistoryEntry(entry.id)"
          >
            <Icon
                name="lucide:trash-2"
                class="size-4"
            />
          </button>
        </div>
      </div>

      <div
          v-else
          class="rounded-lg border border-dashed border-ink/15 px-4 py-8 text-center text-sm text-ink-muted"
      >
        هنوز هیچ گیاهی تشخیص نداده‌ای.
        <NuxtLink
            to="/identify"
            class="text-primary-700 hover:underline"
        >
          یکی رو امتحان کن
        </NuxtLink>
      </div>
    </section>
  </div>
</template>