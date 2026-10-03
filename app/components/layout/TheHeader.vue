<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'

const uiStore = useUiStore()
const { t } = useI18n({ messages: { en, fa }, useScope: 'local' })

const navLinks = [
  { to: '/', label: 'components.theHeader.home' },
  { to: '/identify', label: 'components.theHeader.identify' },
  { to: '/plants', label: 'components.theHeader.catalog' },
  { to: '/profile', label: 'components.theHeader.profile' },
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
        <span>{{ t('components.theHeader.brand') }}</span>
      </NuxtLink>

      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
            active-class="!text-primary-700 bg-primary-50"
        >
          {{ t(link.label) }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <NuxtLink
            to="/profile"
            class="hidden size-9 items-center justify-center rounded-full bg-primary-50 text-primary-700 sm:flex"
            :aria-label="t('components.theHeader.profile')"
        >
          <Icon
              name="lucide:user"
              class="size-4"
          />
        </NuxtLink>

        <button
            class="flex size-9 items-center justify-center rounded-md text-ink md:hidden"
            :aria-label="t('components.theHeader.menu')"
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