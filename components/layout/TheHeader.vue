<script setup lang="ts">
import {MorphIcon} from "morphicons/vue";

const heroSun = "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
const heroMoon = "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"

const uiStore = useUiStore()


const navLinks = [
  { to: '/', label: 'home' },
  { to: '/identify', label: 'identify' },
  { to: '/plants', label: 'catalog' },
  { to: '/profile', label: 'profile' },
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
        <button
          type="button"
          :aria-pressed="uiStore.darkMode"
          :aria-label="uiStore.darkMode ? 'فعال‌سازی حالت روشن' : 'فعال‌سازی حالت تاریک'"
          class="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-ink/15"
          @click="uiStore.toggleDarkMode"
        > 
          <MorphIcon
            :icon="uiStore.darkMode ? heroMoon : heroSun"
            class="size-4.5 text-primary-600"
          />
        </button>

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