<script setup lang="ts">
const links = [
  { to: '/dashboard', label: 'nav.dashboard', icon: 'lucide:layout-dashboard' },
  { to: '/my-plants', label: 'nav.myPlants', icon: 'lucide:sprout' },
  { to: '/care-calendar', label: 'nav.careCalendar', icon: 'lucide:calendar-check' },
  { to: '/profile', label: 'nav.profile', icon: 'lucide:user' },
]
</script>

<template>
  <aside class="hidden w-56 shrink-0 flex-col gap-1 border-e border-ink/5 p-4 md:flex">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-primary-50 hover:text-primary-700"
      active-class="!bg-primary-50 !text-primary-700"
    >
      <Icon
        :name="link.icon"
        class="size-4"
      />
      {{ $t(link.label) }}
    </NuxtLink>
  </aside>
</template>
