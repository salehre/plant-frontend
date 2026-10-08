<script setup lang="ts">
import { themes } from '~/stores/ui.store'
const { locale, setLocale, t } = useI18n()

function toggleLocale() {
  setLocale(locale.value === 'fa' ? 'en' : 'fa')
}

definePageMeta({ layout: 'default' })

const uiStore = useUiStore()
const historyStore = useHistoryStore()
const wishlistStore = useWishlistStore()
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
    <div>
      <h1 class="text-2xl font-bold text-ink">
        {{ t('pages.profile.title') }}
      </h1>
      <p class="text-ink-muted leading-relaxed">
        {{ t('pages.profile.subtitle') }}
      </p>
    </div>

    <!-- اطلاعات کاربر -->
    <section>
      <h2 class="mb-3 font-bold text-ink">
        {{ t('pages.profile.account') }}
      </h2>
      <ProfileInfoForm />
    </section>

    <!-- تنظیمات -->
    <section>
      <h2 class="mb-3 font-bold text-ink">
        {{ t('pages.profile.settings') }}
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
            :aria-label="locale === 'fa' ? t('common.switchToEnglish') : t('common.switchToPersian')"
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
          {{ t('pages.profile.appearance') }}
        </div>
        <button
          type="button"
          class="flex h-9 items-center justify-center rounded-full bg-primary-50 px-3 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-100"
          :aria-label="uiStore.mode === 'dark' ? t('pages.profile.switchToLight') : t('pages.profile.switchToDark')"
          @click="uiStore.toggleMode()"
        >
          {{ uiStore.mode === 'dark' ? t('pages.profile.dark') : t('pages.profile.light') }}
        </button>
      </div>

      <!-- انتخاب تم رنگی -->
      <div class="glass-card mt-3 px-4 py-3">
        <div class="mb-3 text-sm text-ink">
          {{ t('pages.profile.colorTheme') }}
        </div>
        <div class="flex items-center gap-3">
          <button
              v-for="theme in themes"
              :key="theme.key"
              type="button"
              role="radio"
              :aria-checked="uiStore.theme === theme.key"
              :aria-label="t(`pages.profile.themes.${theme.key}`)"
              :title="t(`pages.profile.themes.${theme.key}`)"
              class="flex size-9 items-center justify-center rounded-full ring-offset-2 ring-offset-surface transition-all"
              :class="uiStore.theme === theme.key ? 'ring-2 ring-ink/60' : 'ring-1 ring-ink/10'"
              @click="uiStore.setTheme(theme.key)"
          >
            <span
                class="size-6 rounded-full"
                :style="{ backgroundColor: theme.swatch }"
            />
          </button>
        </div>
      </div>
    </section>

    <!-- لینک به صفحه‌ی علاقه‌مندی‌ها و تاریخچه -->
    <section class="flex flex-col gap-3">
      <NuxtLink
        to="/wishlist"
        class="glass-card group flex items-center gap-4 px-4 py-4"
      >
        <span class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          <Icon
            name="lucide:heart"
            class="size-6"
          />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block font-bold text-ink">
            {{ t('pages.profile.wishlist') }}
            <span class="text-sm font-normal text-ink-muted">({{ toPersianDigits(wishlistStore.count) }})</span>
          </span>
          <span class="block text-xs leading-relaxed text-ink-muted">
            {{ t('pages.profile.wishlistDescription') }}
          </span>
        </span>
        <Icon
          name="lucide:chevron-left"
          class="size-5 shrink-0 text-ink-muted transition-transform group-hover:-translate-x-1"
        />
      </NuxtLink>

      <NuxtLink
        to="/history"
        class="glass-card group flex items-center gap-4 px-4 py-4"
      >
        <span class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          <Icon
            name="lucide:history"
            class="size-6"
          />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block font-bold text-ink">
            {{ t('pages.profile.history') }}
            <span class="text-sm font-normal text-ink-muted">({{ toPersianDigits(historyStore.count) }})</span>
          </span>
          <span class="block text-xs leading-relaxed text-ink-muted">
            {{ t('pages.profile.historyDescription') }}
          </span>
        </span>
        <Icon
          name="lucide:chevron-left"
          class="size-5 shrink-0 text-ink-muted transition-transform group-hover:-translate-x-1"
        />
      </NuxtLink>
    </section>
  </div>
</template>