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
const authStore = useAuthStore()
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-6">
    <div>
      <h1 class="text-2xl font-bold text-ink">
        {{ t('pages.profile.title') }}
      </h1>
      <p class="text-sm leading-relaxed text-ink-muted">
        {{ t('pages.profile.subtitle') }}
      </p>
    </div>

    <!-- هدر پروفایل -->
    <div class="glass-card flex items-center gap-4 p-4">
      <span class="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
        <Icon
          name="lucide:user"
          class="size-8"
        />
      </span>
      <div class="min-w-0">
        <p class="truncate text-lg font-bold text-ink">
          {{ authStore.user?.name || t('pages.profile.account') }}
        </p>
        <p
          v-if="authStore.user?.email"
          class="truncate text-sm text-ink-muted"
        >
          {{ authStore.user.email }}
        </p>
      </div>
    </div>

    <!-- تنظیمات: یک کارت با ردیف‌های جداشده -->
    <section>
      <h2 class="mb-3 font-bold text-ink">
        {{ t('pages.profile.settings') }}
      </h2>
      <div class="glass-card divide-y divide-ink/5 overflow-hidden">
        <div class="flex items-center justify-between gap-3 px-4 py-3.5">
          <div class="flex items-center gap-3 text-sm text-ink">
            <span class="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <Icon
                name="lucide:languages"
                class="size-[18px]"
              />
            </span>
            {{ $t('swich_language') }}
          </div>
          <button
            type="button"
            class="chip"
            :aria-label="locale === 'fa' ? t('common.switchToEnglish') : t('common.switchToPersian')"
            @click="toggleLocale"
          >
            {{ locale === 'fa' ? 'English' : 'فارسی' }}
          </button>
        </div>

        <div class="flex items-center justify-between gap-3 px-4 py-3.5">
          <div class="flex items-center gap-3 text-sm text-ink">
            <span class="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <Icon
                :name="uiStore.mode === 'dark' ? 'lucide:moon' : 'lucide:sun'"
                class="size-[18px]"
              />
            </span>
            {{ t('pages.profile.appearance') }}
          </div>
          <button
            type="button"
            class="chip"
            :aria-label="uiStore.mode === 'dark' ? t('pages.profile.switchToLight') : t('pages.profile.switchToDark')"
            @click="uiStore.toggleMode()"
          >
            {{ uiStore.mode === 'dark' ? t('pages.profile.dark') : t('pages.profile.light') }}
          </button>
        </div>

        <div class="flex items-center justify-between gap-3 px-4 py-3.5">
          <div class="flex items-center gap-3 text-sm text-ink">
            <span class="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <Icon
                name="lucide:palette"
                class="size-[18px]"
              />
            </span>
            {{ t('pages.profile.colorTheme') }}
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="theme in themes"
              :key="theme.key"
              type="button"
              role="radio"
              :aria-checked="uiStore.theme === theme.key"
              :aria-label="t(`pages.profile.themes.${theme.key}`)"
              :title="t(`pages.profile.themes.${theme.key}`)"
              class="flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-surface transition-all"
              :class="uiStore.theme === theme.key ? 'ring-2 ring-ink/60' : 'ring-1 ring-ink/10'"
              @click="uiStore.setTheme(theme.key)"
            >
              <span
                class="size-5 rounded-full"
                :style="{ backgroundColor: theme.swatch }"
              />
            </button>
          </div>
        </div>

        <NuxtLink
          to="/wishlist"
          class="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-primary-50/50"
        >
          <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Icon
              name="lucide:heart"
              class="size-[18px]"
            />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-ink">
              {{ t('pages.profile.wishlist') }}
              <span class="font-normal text-ink-muted">({{ toPersianDigits(wishlistStore.count) }})</span>
            </span>
            <span class="block truncate text-xs text-ink-muted">{{ t('pages.profile.wishlistDescription') }}</span>
          </span>
          <Icon
            name="lucide:chevron-left"
            class="size-5 shrink-0 text-ink-muted transition-transform group-hover:-translate-x-1 ltr:rotate-180"
          />
        </NuxtLink>

        <NuxtLink
          to="/history"
          class="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-primary-50/50"
        >
          <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Icon
              name="lucide:history"
              class="size-[18px]"
            />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-ink">
              {{ t('pages.profile.history') }}
              <span class="font-normal text-ink-muted">({{ toPersianDigits(historyStore.count) }})</span>
            </span>
            <span class="block truncate text-xs text-ink-muted">{{ t('pages.profile.historyDescription') }}</span>
          </span>
          <Icon
            name="lucide:chevron-left"
            class="size-5 shrink-0 text-ink-muted transition-transform group-hover:-translate-x-1 ltr:rotate-180"
          />
        </NuxtLink>
      </div>
    </section>

    <!-- اطلاعات کاربر -->
    <section>
      <h2 class="mb-3 font-bold text-ink">
        {{ t('pages.profile.account') }}
      </h2>
      <ProfileInfoForm />
    </section>
  </div>
</template>
