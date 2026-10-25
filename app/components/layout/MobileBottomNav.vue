<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

interface NavItem {
  to: string
  icon: string
  label: string
  badge?: number
}

const items: NavItem[] = [
  { to: '/', icon: 'lucide:home', label: 'components.mobileBottomNav.home' },
  { to: '/identify', icon: 'lucide:scan-line', label: 'components.mobileBottomNav.identify' },
  { to: '/my-plants', icon: 'lucide:sprout', label: 'nav.myPlants' },
  { to: '/plants', icon: 'lucide:compass', label: 'nav.catalog' },
  { to: '/profile', icon: 'lucide:user', label: 'components.mobileBottomNav.profile' },
]

// تطبیق با مرز سگمنت: /plants و /plants/rose فعالن ولی /plants-xyz نه
// صفحه‌ای که توی نوار نیست (مثلاً /blog) هیچ تبی رو فعال نمی‌کنه
function isActive(to: string) {
  return to === '/' ? route.path === '/' : (route.path === to || route.path.startsWith(`${to}/`))
}

const activeIndex = computed(() => items.findIndex(item => isActive(item.to)))
const activeIndicatorStyle = computed(() => ({
  insetInlineStart: `${activeIndex.value * (100 / items.length)}%`,
}))
</script>

<template>
  <div
    class="fixed inset-x-0 z-40 flex justify-center px-3 md:hidden"
    style="bottom: calc(1.25rem + env(safe-area-inset-bottom));"
  >
    <nav
      class="bottom-nav w-full max-w-[330px] rounded-full px-2 py-1.5"
      :aria-label="t('components.mobileBottomNav.navigation')"
    >
      <div class="bottom-nav__track">
        <span
          v-if="activeIndex >= 0"
          class="bottom-nav__indicator"
          :style="activeIndicatorStyle"
          aria-hidden="true"
        />
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :aria-label="t(item.label)"
          :aria-current="isActive(item.to) ? 'page' : undefined"
          class="bottom-nav__item flex items-center justify-center rounded-full px-3.5 py-2.5"
          :class="isActive(item.to) ? 'bottom-nav__item--active' : 'text-ink-muted'"
        >
          <span class="relative flex shrink-0 items-center justify-center">
            <Icon
              :name="item.icon"
              class="size-6"
            />
            <span
              v-if="item.badge"
              class="bottom-nav__badge absolute flex items-center justify-center rounded-full text-[10px] font-bold text-white"
            >
              {{ item.badge > 9 ? '9+' : item.badge }}
            </span>
          </span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.bottom-nav {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-ink) / 0.06);
  box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.18);
}

.bottom-nav__track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.bottom-nav__indicator {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  z-index: 0;
  width: 20%;
  border-radius: 9999px;
  background-color: rgb(var(--color-primary-500));
  pointer-events: none;
  transition: inset-inline-start 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.bottom-nav__item {
  position: relative;
  z-index: 1;
  min-width: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.2s ease;
}

.bottom-nav__item--active {
  color: #fff;
}

.bottom-nav__badge {
  top: -5px;
  right: -6px;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  background: #ef4444;
  box-shadow: 0 0 0 2px rgb(var(--color-surface));
}

@media (prefers-reduced-motion: reduce) {
  .bottom-nav__item,
  .bottom-nav__indicator {
    transition: none;
  }
}
</style>
