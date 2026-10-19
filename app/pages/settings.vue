<script setup lang="ts">
import { themes } from '~/stores/ui.store'
import type { SettingsSectionKey } from '~/composables/useSettingsSections'

definePageMeta({ layout: 'default' })

const { locale, setLocale, t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const isDark = computed(() => uiStore.mode === 'dark')
const user = computed(() => authStore.user)
const intlLocale = computed(() => locale.value === 'fa' ? 'fa-IR' : 'en-US')
const memberSince = computed(() => user.value?.joinedAt
  ? new Intl.DateTimeFormat(intlLocale.value, { month: 'long', year: 'numeric' }).format(new Date(user.value.joinedAt))
  : '')

// بخش فعال از ?section= میاد و انتخابش توی ساید بار (زیر «تنظیمات») انجام می‌شه.
// روی دسکتاپ فقط بخش انتخاب‌شده دیده می‌شه؛ روی موبایل (بدون ساید بار) همه‌ی بخش‌ها زیر هم‌ان
const { active } = useSettingsSections()

function panelClass(key: SettingsSectionKey) {
  return active.value === key ? '' : 'md:hidden'
}

const languages = [
  { code: 'fa', label: 'فارسی' },
  { code: 'en', label: 'English' },
] as const

const aboutRows = computed(() => [
  { to: '/about', icon: 'lucide:info', label: t('components.theFooter.about') },
  { to: '/support', icon: 'lucide:life-buoy', label: t('support.nav') },
  { to: '/tickets', icon: 'lucide:message-square-text', label: t('components.theFooter.tickets') },
  { to: '/contact', icon: 'lucide:mail', label: t('components.theFooter.contact') },
  { to: '/terms', icon: 'lucide:file-text', label: t('components.theFooter.terms') },
  { to: '/privacy', icon: 'lucide:shield-check', label: t('components.theFooter.privacy') },
])
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- عنوان -->
    <div class="flex items-start gap-2">
      <button
        type="button"
        class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-primary-50 md:hidden"
        :aria-label="t('common.back')"
        @click="router.back()"
      >
        <Icon
          name="lucide:chevron-right"
          class="size-6 ltr:rotate-180"
        />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-ink sm:text-3xl">
          {{ t('pages.profile.settings') }}
        </h1>
        <p class="mt-1 text-sm text-ink-muted">
          {{ t('pages.profile.settingsSubtitle') }}
        </p>
      </div>
    </div>

    <div class="flex min-w-0 flex-col gap-5">
      <!-- حساب -->
      <section
        class="flex flex-col gap-5"
        :class="panelClass('account')"
      >
        <div class="glass-card p-4 sm:p-5">
          <h2 class="mb-4 font-bold text-ink">
            {{ t('pages.profile.account') }}
          </h2>
          <div class="mb-4 flex items-center gap-4">
            <AvatarUploader avatar-class="size-16" />
            <div class="min-w-0">
              <p class="truncate text-lg font-bold text-ink">
                {{ user?.name || t('pages.profile.account') }}
              </p>
              <p
                v-if="user?.email"
                class="truncate text-sm text-ink-muted"
              >
                {{ user.email }}
              </p>
            </div>
          </div>
          <dl
            v-if="user"
            class="divide-y divide-ink/5 text-sm"
          >
            <div class="flex items-center justify-between gap-3 py-3">
              <dt class="text-ink-muted">
                {{ t('auth.email') }}
              </dt>
              <dd class="truncate font-medium text-ink">
                {{ user.email }}
              </dd>
            </div>
            <div
              v-if="memberSince"
              class="flex items-center justify-between gap-3 py-3"
            >
              <dt class="text-ink-muted">
                {{ t('pages.profile.memberSince') }}
              </dt>
              <dd class="font-medium text-ink">
                {{ memberSince }}
              </dd>
            </div>
          </dl>
        </div>

        <ProfileInfoForm />
      </section>

      <!-- ظاهر و زبان -->
      <section
        class="flex flex-col gap-5"
        :class="panelClass('appearance')"
      >
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
                  {{ t('pages.profile.appearanceSubtitle', 'شخصی‌سازی حالت شب/روز و پالت رنگی سامانه') }}
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-7">
            <!-- ۱. انتخاب حالت دارک / لایت -->
            <div>
              <label class="mb-3 block text-xs font-bold uppercase tracking-wider text-ink-muted">
                {{ t('pages.profile.themeMode', 'حالت نمایش') }}
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
                    <span class="text-xs text-ink-muted">{{ t('pages.profile.lightDesc', 'تم روز و روشن') }}</span>
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
                    <span class="text-xs text-ink-muted">{{ t('pages.profile.darkDesc', 'تم شب و تاریک') }}</span>
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
                    {{ t('pages.profile.colorTheme', 'رنگ سازمانی و پالت') }}
                  </label>
                  <p class="text-xs text-ink-muted mt-0.5">
                    {{ t('pages.profile.colorThemeSubtitle', 'رنگ دکمه‌ها، آیکون‌ها و المان‌های تعاملی') }}
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
                          Action
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
                {{ t('pages.profile.languageSubtitle', 'زبان رابط کاربری سامانه را انتخاب کنید') }}
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
                  {{ lang.code === 'fa' ? 'Persian (RTL)' : 'English (LTR)' }}
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
      </section>

      <!-- آدرس‌ها -->
      <section :class="panelClass('locations')">
        <AddressManager />
      </section>

      <!-- درباره / پشتیبانی -->
      <section
        class="glass-card p-4 sm:p-5"
        :class="panelClass('about')"
      >
        <h2 class="mb-2 font-bold text-ink">
          {{ t('components.theFooter.about') }}
        </h2>
        <ul class="divide-y divide-ink/5">
          <li
            v-for="row in aboutRows"
            :key="row.to"
          >
            <NuxtLink
              :to="row.to"
              class="flex items-center gap-3 py-4"
            >
              <Icon
                :name="row.icon"
                class="size-5 shrink-0 text-primary-700"
              />
              <span class="flex-1 text-sm font-medium text-ink">{{ row.label }}</span>
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