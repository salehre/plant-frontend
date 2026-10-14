<script setup lang="ts">
const route = useRoute()

// منوی اصلی (مثل دیزاین) + منوی فرعی کوچک‌تر برای بقیه‌ی صفحه‌ها
const links = [
  { to: '/', label: 'nav.home', icon: 'lucide:home' },
  { to: '/my-plants', label: 'nav.myPlants', icon: 'lucide:sprout' },
  { to: '/plants', label: 'nav.catalog', icon: 'lucide:compass' },
  { to: '/identify', label: 'nav.identify', icon: 'lucide:scan-line' },
  { to: '/care-calendar', label: 'nav.careCalendar', icon: 'lucide:calendar-check' },
  { to: '/profile', label: 'nav.profile', icon: 'lucide:user' },
  { to: '/settings', label: 'pages.profile.settings', icon: 'lucide:settings' },
]
const secondaryLinks = [
  { to: '/dashboard', label: 'nav.dashboard', icon: 'lucide:layout-dashboard' },
  { to: '/climate', label: 'nav.climate', icon: 'lucide:cloud-sun' },
  { to: '/community', label: 'nav.community', icon: 'lucide:users' },
  { to: '/support', label: 'support.nav', icon: 'lucide:life-buoy' },
]

// تطبیق با مرز سگمنت: /plants و /plants/rose فعالن ولی /plants-xyz نه
function isActive(to: string) {
  return to === '/' ? route.path === '/' : (route.path === to || route.path.startsWith(`${to}/`))
}
</script>

<template>
  <aside class="fixed inset-y-0 start-0 z-40 hidden w-64 flex-col gap-6 border-e border-ink/5 bg-surface px-4 py-5 md:flex">
    <!-- لوگو -->
    <NuxtLink
      to="/"
      class="flex items-center gap-2.5 px-2"
    >
      <span class="flex size-10 items-center justify-center rounded-xl bg-primary-700 text-white">
        <Icon
          name="lucide:leaf"
          class="size-5"
        />
      </span>
      <span class="text-lg font-extrabold text-primary-800">{{ $t('brand.name') }}</span>
    </NuxtLink>

    <!-- منو -->
    <nav class="custom-scrollbar flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
        :class="isActive(link.to)
          ? 'bg-primary-50 font-bold text-primary-700'
          : 'text-ink-muted hover:bg-primary-50/70 hover:text-primary-700'"
      >
        <Icon
          :name="link.icon"
          class="size-5"
        />
        {{ $t(link.label) }}
      </NuxtLink>
      <div class="my-2 border-t border-ink/5" />

      <NuxtLink
        v-for="link in secondaryLinks"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors"
        :class="isActive(link.to)
          ? 'bg-primary-50 font-bold text-primary-700'
          : 'text-ink-muted hover:bg-primary-50/70 hover:text-primary-700'"
      >
        <Icon
          :name="link.icon"
          class="size-4"
        />
        {{ $t(link.label) }}
      </NuxtLink>
    </nav>

    <!-- کارت دعوت به اسکن -->
    <div class="relative overflow-hidden rounded-2xl bg-primary-900 p-4 text-white">
      <img
        src="/images/plants/dd.jpg"
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
        <Icon
          name="lucide:scan-line"
          class="size-3.5"
        />
        {{ $t('home.identifyCta') }}
      </NuxtLink>
    </div>
  </aside>
</template>
