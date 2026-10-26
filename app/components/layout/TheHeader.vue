<script setup lang="ts">
const uiStore = useUiStore()
const userPlantsStore = useUserPlantsStore()
const authStore = useAuthStore()
const { locale, setLocale } = useI18n()

const query = ref('')
const isDark = computed(() => uiStore.mode === 'dark')
const todayCount = computed(() => userPlantsStore.todayTasks.length)

function toggleLocale() {
  setLocale(locale.value === 'fa' ? 'en' : 'fa')
}

function onSearch() {
  navigateTo({ path: '/plants', query: query.value ? { q: query.value } : {} })
}
</script>

<template>
  <header class="app-header sticky top-0 z-30 bg-bg">
    <div class="app-header__inner mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
      <!-- لوگو؛ فقط موبایل -->
      <NuxtLink
        to="/"
        class="app-brand flex items-center gap-2 text-primary-800 md:hidden"
        :aria-label="$t('brand.name')"
      >
        <img
          src="/images/logo.png"
          :alt="$t('brand.name')"
          class="app-brand-logo h-10 w-auto object-contain"
        >
      </NuxtLink>

      <!-- جستجو -->
      <form
        class="app-search relative max-w-xl flex-1"
        @submit.prevent="onSearch"
      >
        <Icon
          name="lucide:search"
          class="app-search-icon pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
        />
        <input
          v-model="query"
          type="search"
          :placeholder="$t('common.searchPlaceholder')"
          class="app-search-input h-11 w-full !rounded-full border border-ink/10 bg-surface ps-10 pe-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
        >
      </form>

      <div class="app-header-actions ms-auto flex items-center gap-2 rounded-full border border-ink/10 bg-surface p-1 shadow-sm">
        <!-- تغییر زبان -->
        <button
          type="button"
          class="header-action header-locale hidden size-9 items-center justify-center rounded-full text-xs font-bold text-primary-700 md:flex"
          :aria-label="locale === 'fa' ? $t('common.switchToEnglish') : $t('common.switchToPersian')"
          :title="locale === 'fa' ? $t('common.switchToEnglish') : $t('common.switchToPersian')"
          @click="toggleLocale"
        >
          {{ locale === 'fa' ? 'EN' : 'فا' }}
        </button>

        <!-- دارک / لایت مود -->
        <button
          type="button"
          class="header-action header-theme flex size-9 items-center justify-center rounded-full text-primary-700"
          :aria-label="isDark ? $t('pages.profile.switchToLight') : $t('pages.profile.switchToDark')"
          :title="isDark ? $t('pages.profile.switchToLight') : $t('pages.profile.switchToDark')"
          @click="uiStore.toggleMode()"
        >
          <span class="header-theme-icon-wrap">
            <ThemeModeIcon
              :dark="!isDark"
              class="size-[18px]"
            />
          </span>
        </button>

        <!-- اعلان تسک‌های امروز -->
        <NuxtLink
          to="/care-calendar"
          class="header-action header-notifications relative flex size-9 items-center justify-center rounded-full text-primary-700"
          :aria-label="$t('nav.careCalendar')"
        >
          <span class="header-bell-wrap">
            <Icon
              name="lucide:bell"
              class="size-[18px]"
            />
          </span>

          <span
            v-if="todayCount"
            class="header-notification-dot absolute end-2 top-2 size-2 rounded-full bg-status-danger ring-2 ring-surface"
            aria-hidden="true"
          />
        </NuxtLink>

        <!-- پروفایل -->
        <NuxtLink
          to="/profile"
          class="header-action header-profile hidden size-9 items-center justify-center rounded-full ring-2 ring-transparent md:flex"
          :aria-label="$t('nav.profile')"
        >
          <UserAvatar
            :src="authStore.user?.avatar"
            :name="authStore.user?.name"
            class="size-full"
          />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ورود نرم هدر */
.app-header {
  position: sticky;
  border-bottom: 1px solid rgb(var(--color-ink) / 0.12);
}

.app-header::after {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  width: min(28rem, 55vw);
  height: 1px;
  margin-inline: auto;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(var(--color-primary-500) / 0.45),
    transparent
  );
  content: '';
  pointer-events: none;
  transform: scaleX(0);
  animation: header-line-in 800ms 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.app-header__inner {
  animation: header-enter 550ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes header-enter {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes header-line-in {
  to {
    transform: scaleX(1);
  }
}

/* لوگو */
.app-brand-logo {
  transition:
    transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 300ms ease;
}

.app-brand:hover .app-brand-logo {
  transform: translateY(-1px) scale(1.04);
  filter: drop-shadow(0 4px 7px rgb(var(--color-primary-500) / 0.2));
}

/* فوکوس جستجو */
.app-search {
  border-radius: 9999px;
  transition:
    transform 220ms ease,
    filter 220ms ease;
}

.app-search:focus-within {
  transform: translateY(-1px);
  filter: drop-shadow(0 5px 8px rgb(var(--color-primary-500) / 0.12));
}

.app-search-icon {
  transition:
    color 220ms ease,
    scale 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.app-search:focus-within .app-search-icon {
  color: rgb(var(--color-primary-700));
  scale: 1.12;
}

/* دکمه‌ها و لینک‌های هدر */
.header-action {
  position: relative;
  transition:
    transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
    background-color 220ms ease,
    color 220ms ease,
    box-shadow 220ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .header-action:hover {
    transform: translateY(-1px) scale(1.04);
    box-shadow: 0 4px 12px rgb(var(--color-ink) / 0.09);
  }

  .header-action:active {
    transform: scale(0.94);
    transition-duration: 100ms;
  }
}

.header-action:focus-visible,
.app-brand:focus-visible {
  outline: 2px solid rgb(var(--color-primary-500) / 0.65);
  outline-offset: 3px;
}

/* چرخش کوتاه آیکون تم */
.header-theme-icon-wrap {
  display: grid;
  place-items: center;
  transform-origin: center;
  transition: transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

@media (hover: hover) and (pointer: fine) {
  .header-theme:hover .header-theme-icon-wrap {
    transform: rotate(28deg) scale(1.08);
  }
}

/* تکان زنگوله هنگام هاور */
.header-bell-wrap {
  display: grid;
  place-items: center;
  transform-origin: 50% 10%;
}

@media (hover: hover) and (pointer: fine) {
  .header-notifications:hover .header-bell-wrap {
    animation: bell-ring 650ms ease-in-out;
  }
}

@keyframes bell-ring {
  0%,
  100% {
    transform: rotate(0);
  }
  18% {
    transform: rotate(14deg);
  }
  36% {
    transform: rotate(-12deg);
  }
  54% {
    transform: rotate(8deg);
  }
  72% {
    transform: rotate(-5deg);
  }
}

/* موج ملایم دور نشان اعلان */
.header-notification-dot::after {
  position: absolute;
  inset: -3px;
  border: 1px solid rgba(239, 68, 68, 0.65);
  border-radius: inherit;
  content: '';
  opacity: 0;
  animation: notification-wave 2.2s ease-out infinite;
}

@keyframes notification-wave {
  0% {
    opacity: 0.75;
    transform: scale(0.7);
  }
  100% {
    opacity: 0;
    transform: scale(2.2);
  }
}

/* کاهش انیمیشن برای تنظیم دسترسی سیستم */
@media (prefers-reduced-motion: reduce) {
  .app-header__inner,
  .app-header::after,
  .header-notification-dot::after {
    animation: none !important;
  }

  .app-brand-logo,
  .app-search,
  .app-search-icon,
  .header-action,
  .header-theme-icon-wrap {
    transition: none !important;
  }

  .app-header::after {
    transform: scaleX(1);
  }
}
</style>