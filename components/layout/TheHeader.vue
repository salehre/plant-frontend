<script setup lang="ts">
const uiStore = useUiStore()

// MVP scope: Identify / Explore(Catalog) / Profile
// my-plants, care-calendar, community, climate, dashboard از نویگیشن فریز شدن
// (کد این صفحات حذف نشده، فقط از مسیر کاربر MVP خارج شده - رجوع به mvp-alignment-checklist.md)
// Profile دیگه پشت Auth نیست (MVP بدون لاگین کار می‌کنه)، پس دیگه نیازی به
// user-menu/logout این‌جا نیست - authStore برای فاز بعد (my-garden/community) نگه داشته شده.
const navLinks = [
  { to: '/', label: 'nav.home' },
  { to: '/identify', label: 'nav.identify' },
  { to: '/plants', label: 'nav.catalog' },
  { to: '/profile', label: 'nav.profile' },
]
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-ink/5 bg-surface/90 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-lg font-bold text-primary-700"
      >
        <Icon
          name="lucide:leaf"
          class="size-6"
        />
        <span>برگ‌یار</span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
          active-class="!text-primary-700 bg-primary-50"
        >
          {{ $t(link.label) }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <LanguageSwitcher class="hidden sm:flex" />

        <AppButton
          variant="secondary"
          size="sm"
          class="hidden sm:inline-flex"
          @click="navigateTo('/identify')"
        >
          <Icon
            name="lucide:scan-line"
            class="size-4"
          />
          {{ $t('identify.title') }}
        </AppButton>

        <NuxtLink
          to="/profile"
          class="hidden size-9 items-center justify-center rounded-full bg-primary-50 text-primary-700 sm:flex"
          aria-label="پروفایل"
        >
          <Icon
            name="lucide:user"
            class="size-4"
          />
        </NuxtLink>

        <button
          class="flex size-9 items-center justify-center rounded-md text-ink md:hidden"
          aria-label="منو"
          @click="uiStore.mobileNavOpen = true"
        >
          <Icon
            name="lucide:menu"
            class="size-5"
          />
        </button>
      </div>
    </div>

    <MobileNav
      v-model="uiStore.mobileNavOpen"
      :links="navLinks"
    />
  </header>
</template>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.12s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
