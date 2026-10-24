<script setup lang="ts">
import { sidebarIcons } from './sidebarIcons'

const route = useRoute()
const authStore = useAuthStore()

const links = [
  { to: '/', label: 'nav.home', icon: sidebarIcons.home },
  { to: '/my-plants', label: 'nav.myPlants', icon: sidebarIcons.sprout },
  { to: '/plants', label: 'nav.catalog', icon: sidebarIcons.compass },
  { to: '/identify', label: 'nav.identify', icon: sidebarIcons.scanLine },
  { to: '/ai-doctor', label: 'nav.aiDoctor', icon: sidebarIcons.stethoscope },
  { to: '/profile', label: 'nav.profile', icon: sidebarIcons.user },
  { to: '/about', label: 'components.theFooter.about', icon: sidebarIcons.info },
]
const secondaryLinks = [
  { to: '/dashboard', label: 'nav.dashboard', icon: sidebarIcons.layoutDashboard },
  { to: '/climate', label: 'nav.climate', icon: sidebarIcons.cloudSun },
  // { to: '/community', label: 'nav.community', icon: sidebarIcons.users },
  { to: '/support', label: 'support.nav', icon: sidebarIcons.lifeBuoy },
  { to: '/contact', label: 'components.theFooter.contact', icon: sidebarIcons.mail },
]

const replay = reactive<Record<string, number>>({})
function onLinkClick(to: string) {
  replay[to] = (replay[to] ?? 0) + 1
}
const iconKey = (to: string) => `${to}-${replay[to] ?? 0}`

function isActive(to: string) {
  return to === '/' ? route.path === '/' : (route.path === to || route.path.startsWith(`${to}/`))
}

</script>

<template>
  <aside class="fixed inset-y-0 start-0 z-40 hidden w-64 flex-col gap-6 rounded-e-3xl border-e border-ink/5 bg-surface px-4 py-5 md:flex">
    <!-- لوگو -->
    <NuxtLink
      to="/"
      class="flex items-center gap-2.5 px-2"
    >
      <img
        src="/images/logo.png"
        :alt="$t('brand.name')"
        class="h-10 w-auto object-contain"
      >
      <span class="text-lg font-extrabold text-primary-800">{{ $t('brand.name') }}</span>
    </NuxtLink>

    <!-- منو -->
    <nav class="custom-scrollbar flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
      <template
        v-for="link in links"
        :key="link.to"
      >
        <NuxtLink
          :to="link.to"
          class="sidebar-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          :class="isActive(link.to)
            ? 'sidebar-link--active bg-primary-50 font-bold text-primary-700'
            : 'text-ink-muted hover:bg-primary-50/70 hover:text-primary-700'"
          @click="onLinkClick(link.to)"
        >
          <UserAvatar
            v-if="link.to === '/profile' && authStore.user?.avatar"
            :src="authStore.user.avatar"
            :name="authStore.user.name"
            class="size-5"
          />
          <component
            :is="link.icon"
            v-else
            :key="iconKey(link.to)"
            class="size-5"
          />
          {{ $t(link.label) }}
        </NuxtLink>
      </template>
      <div class="my-2 border-t border-ink/5" />

      <NuxtLink
        v-for="link in secondaryLinks"
        :key="link.to"
        :to="link.to"
        class="sidebar-link flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors"
        :class="isActive(link.to)
          ? 'sidebar-link--active bg-primary-50 font-bold text-primary-700'
          : 'text-ink-muted hover:bg-primary-50/70 hover:text-primary-700'"
        @click="onLinkClick(link.to)"
      >
        <component
          :is="link.icon"
          :key="iconKey(link.to)"
          class="size-4"
        />
        {{ $t(link.label) }}
      </NuxtLink>
    </nav>

    <div class="relative overflow-hidden rounded-2xl bg-primary-900 p-4 text-white">
      <img
        src="/images/plants/footer.webp"
        alt=""
        class="pointer-events-none absolute inset-0 size-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-br from-primary-900/55 via-primary-900/45 to-primary-800/50" />
      <p class="relative z-10 mb-3 text-sm font-bold leading-6">
        {{ $t('home.heroTitle') }}
      </p>
      <NuxtLink
        to="/identify"
        class="relative z-10 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-primary-800 transition-colors hover:bg-primary-50"
      >
        <component
          :is="sidebarIcons.scanLine"
          class="size-3.5"
        />
        {{ $t('home.identifyCta') }}
      </NuxtLink>
    </div>
  </aside>
</template>