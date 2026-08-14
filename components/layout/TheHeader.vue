<script setup lang="ts">
const uiStore = useUiStore()
const { locale, setLocale } = useI18n()

function toggleLocale() {
  setLocale(locale.value === 'fa' ? 'en' : 'fa')
}

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
        <button
          type="button"
          role="switch"
          :aria-checked="uiStore.darkMode"
          class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
          :class="uiStore.darkMode ? 'bg-primary-600' : 'bg-ink/15'"
          @click="uiStore.toggleDarkMode"
        >
          <span
            class="absolute top-0.5 flex size-5 items-center justify-center rounded-full bg-white shadow transition-all"
            :class="uiStore.darkMode ? 'start-[22px]' : 'start-0.5'"
          >
            <Icon
              :name="uiStore.darkMode ? 'lucide:moon' : 'lucide:sun'"
              class="size-3.5 text-primary-600"
            />
          </span>
        </button>
        <button
            type="button"
            class="flex h-9 items-center justify-center rounded-full bg-primary-50 px-3 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-100"
            :aria-label="locale === 'fa' ? 'Switch language to English' : 'تغییر زبان به فارسی'"
            @click="toggleLocale"
        >
          {{ locale === 'fa' ? 'EN' : 'فا' }}
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