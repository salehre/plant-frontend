<script setup lang="ts">
import { themes } from '~/stores/ui.store'

// تنظیمات ظاهر و زبان (قبلاً بخش جدا توی /settings بود؛ حالا تب پروفایله)
const { locale, setLocale, t } = useI18n()
const uiStore = useUiStore()

const isDark = computed(() => uiStore.mode === 'dark')

// اسم زبان‌ها به زبان خودشون نوشته می‌شه (استاندارد انتخاب زبان)؛ توضیح زیرشون ترجمه می‌شه
const languages = computed(() => [
  { code: 'fa', label: 'فارسی', desc: t('pages.profile.languageFaDesc') },
  { code: 'en', label: 'English', desc: t('pages.profile.languageEnDesc') },
] as const)
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- کارت تم و ظاهر -->
    <div class="glass-card p-4 sm:p-6">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="flex size-10 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600 shadow-inner dark:bg-primary-400/10 dark:text-primary-400">
            <Icon name="lucide:palette" class="size-5" />
          </div>
          <div>
            <h2 class="text-base font-bold text-ink">
              {{ t('pages.profile.appearance') }}
            </h2>
            <p class="text-xs text-ink-muted">
              {{ t('pages.profile.appearanceSubtitle') }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-7">
        <!-- ۱. انتخاب حالت دارک / لایت -->
        <div>
          <label class="mb-3 block text-xs font-bold uppercase tracking-wider text-ink-muted">
            {{ t('pages.profile.themeMode') }}
          </label>
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <!-- دکمه تم روشن -->
            <button
              type="button"
              class="group relative flex flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-all duration-300"
              :class="!isDark 
                ? 'border-primary-500 bg-primary-50/50 shadow-sm ring-2 ring-primary-500/20 dark:bg-primary-950/20' 
                : 'border-ink/10 bg-surface hover:border-ink/20 hover:bg-ink/[0.02]'"
              @click="isDark && uiStore.toggleMode()"
            >
              <div
                class="flex size-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                :class="!isDark ? 'bg-amber-500/15 text-amber-600 shadow-inner' : 'bg-ink/5 text-ink-muted'"
              >
                <Icon name="lucide:sun" class="size-6" />
              </div>
              <div>
                <span class="block text-sm font-bold text-ink">{{ t('pages.profile.light') }}</span>
                <span class="text-xs text-ink-muted">{{ t('pages.profile.lightDesc') }}</span>
              </div>
              <span
                v-if="!isDark"
                class="absolute end-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary-600 text-white shadow-sm"
              >
                <Icon name="lucide:check" class="size-3" />
              </span>
            </button>

            <!-- دکمه تم تاریک -->
            <button
              type="button"
              class="group relative flex flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-all duration-300"
              :class="isDark 
                ? 'border-primary-500 bg-primary-50/50 shadow-sm ring-2 ring-primary-500/20 dark:bg-primary-950/20' 
                : 'border-ink/10 bg-surface hover:border-ink/20 hover:bg-ink/[0.02]'"
              @click="!isDark && uiStore.toggleMode()"
            >
              <div
                class="flex size-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                :class="isDark ? 'bg-indigo-500/15 text-indigo-400 shadow-inner' : 'bg-ink/5 text-ink-muted'"
              >
                <Icon name="lucide:moon" class="size-6" />
              </div>
              <div>
                <span class="block text-sm font-bold text-ink">{{ t('pages.profile.dark') }}</span>
                <span class="text-xs text-ink-muted">{{ t('pages.profile.darkDesc') }}</span>
              </div>
              <span
                v-if="isDark"
                class="absolute end-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary-600 text-white shadow-sm"
              >
                <Icon name="lucide:check" class="size-3" />
              </span>
            </button>
          </div>
        </div>

        <!-- ۲. انتخاب پالت رنگی (رنگ اصلی سامانه) -->
        <div class="border-t border-ink/5 pt-6">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                {{ t('pages.profile.colorTheme') }}
              </label>
              <p class="text-xs text-ink-muted mt-0.5">
                {{ t('pages.profile.colorThemeSubtitle') }}
              </p>
            </div>
          </div>

          <!-- گرید کارت‌های تم با Mini-Mockup -->
          <div
            class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            role="radiogroup"
            :aria-label="t('pages.profile.colorTheme')"
          >
            <button
              v-for="theme in themes"
              :key="theme.key"
              type="button"
              role="radio"
              :aria-checked="uiStore.theme === theme.key"
              class="group relative flex flex-col overflow-hidden rounded-2xl border p-2.5 text-start transition-all duration-300"
              :class="uiStore.theme === theme.key 
                ? 'border-primary-500 bg-surface shadow-md ring-2 ring-primary-500/25' 
                : 'border-ink/10 bg-surface/60 hover:border-ink/20 hover:bg-surface hover:shadow-xs'"
              @click="uiStore.setTheme(theme.key)"
            >
              <!-- پیش‌نمایش گرافیکی مینیاتوری از تم (Mini UI Mockup) -->
              <div 
                class="relative mb-3 flex h-20 w-full flex-col justify-between overflow-hidden rounded-xl border border-ink/5 bg-ink/[0.02] p-2.5 transition-transform duration-300 group-hover:scale-[1.02]"
              >
                <!-- هدر ماک‌آپ -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1 opacity-40">
                    <span class="size-1.5 rounded-full bg-ink" />
                    <span class="size-1.5 rounded-full bg-ink" />
                  </div>
                  <!-- نشانگر رنگی -->
                  <span
                    class="h-2 w-5 rounded-full shadow-xs"
                    :style="{ backgroundColor: theme.swatch }"
                  />
                </div>

                <!-- المان‌های فرضی داخل ماک‌آپ -->
                <div class="space-y-1.5">
                  <div class="flex items-center gap-1.5">
                    <!-- دکمه فرضی با رنگ تم -->
                    <div
                      class="flex h-5 items-center justify-center rounded-md px-2 text-[9px] font-bold text-white shadow-xs"
                      :style="{ backgroundColor: theme.swatch }"
                    >
                      {{ t('pages.profile.themePreviewAction') }}
                    </div>
                    <!-- خط فرضی متن -->
                    <div class="h-2 flex-1 rounded-full bg-ink/10" />
                  </div>
                  <div class="h-1.5 w-2/3 rounded-full bg-ink/5" />
                </div>

                <!-- افکت نور ملایم پس‌زمینه برای تم فعال -->
                <div
                  v-if="uiStore.theme === theme.key"
                  class="pointer-events-none absolute inset-0 opacity-20"
                  :style="{ background: `radial-gradient(circle at 100% 0%, ${theme.swatch}, transparent 70%)` }"
                />
              </div>

              <!-- عنوان و دایره رنگ -->
              <div class="flex items-center justify-between gap-1.5 px-1 pb-0.5">
                <div class="flex items-center gap-2 min-w-0">
                  <span
                    class="size-3.5 shrink-0 rounded-full shadow-xs ring-2 ring-white/80 dark:ring-black/40"
                    :style="{ backgroundColor: theme.swatch }"
                  />
                  <span class="truncate text-xs font-bold text-ink">
                    {{ t(`pages.profile.themes.${theme.key}`) }}
                  </span>
                </div>

                <!-- آیکون تیک انتخاب -->
                <span
                  class="flex size-4.5 shrink-0 items-center justify-center rounded-full transition-all duration-200"
                  :class="uiStore.theme === theme.key 
                    ? 'bg-primary-600 text-white shadow-xs scale-100' 
                    : 'opacity-0 scale-75'"
                >
                  <Icon name="lucide:check" class="size-3" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- کارت زبان -->
    <div class="glass-card p-4 sm:p-6">
      <div class="mb-4 flex items-center gap-2.5">
        <div class="flex size-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-400">
          <Icon name="lucide:languages" class="size-5" />
        </div>
        <div>
          <h2 class="text-base font-bold text-ink">
            {{ t('pages.profile.language') }}
          </h2>
          <p class="text-xs text-ink-muted">
            {{ t('pages.profile.languageSubtitle') }}
          </p>
        </div>
      </div>

      <div
        class="grid grid-cols-1 gap-3 sm:grid-cols-2"
        role="radiogroup"
        :aria-label="t('pages.profile.language')"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          type="button"
          role="radio"
          :aria-checked="locale === lang.code"
          class="group relative flex items-center gap-3.5 rounded-2xl border p-3.5 text-start transition-all duration-200"
          :class="locale === lang.code 
            ? 'border-primary-500 bg-primary-50/40 shadow-sm ring-2 ring-primary-500/20 dark:bg-primary-950/20' 
            : 'border-ink/10 bg-surface hover:border-ink/20 hover:bg-ink/[0.02]'"
          @click="setLocale(lang.code)"
        >
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
            :class="locale === lang.code 
              ? 'bg-primary-600 text-white shadow-sm' 
              : 'bg-ink/5 text-ink-muted group-hover:bg-ink/10'"
          >
            {{ lang.code }}
          </div>

          <div class="flex-1 min-w-0">
            <span class="block truncate text-sm font-bold text-ink">
              {{ lang.label }}
            </span>
            <span class="block truncate text-xs text-ink-muted">
              {{ lang.desc }}
            </span>
          </div>

          <span
            class="flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
            :class="locale === lang.code 
              ? 'border-primary-600 bg-primary-600 text-white' 
              : 'border-ink/20 group-hover:border-ink/40'"
          >
            <Icon
              v-if="locale === lang.code"
              name="lucide:check"
              class="size-3"
            />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
