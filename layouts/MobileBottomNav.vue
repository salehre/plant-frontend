<!--
  نوار پایین شناور - فقط موبایل (md:hidden). همون افکت Liquid Glass با تنظیمات
  جدیدی که فرستادی (baseFrequency 0.015 / scale 95 / blur 10px)، ولی رنگ‌ها از
  توکن‌های surface/ink خود اپ میان (نه سفید ثابت) تا هم روی صفحات روشن هم دارک‌مود درست دیده بشه.
  id فیلتر جدا از LiquidGlassPanel (glass-distortion-nav) چون این کامپوننت هم‌زمان
  با آن (صفحات auth) روی صفحه نیست، ولی برای اطمینان از تداخل احتمالی id یکتا نگه داشته شده.
-->
<script setup lang="ts">
const route = useRoute()

const items = [
  { to: '/', label: 'nav.home', icon: 'lucide:home' },
  { to: '/identify', label: 'nav.identify', icon: 'lucide:scan-line' },
  { to: '/plants', label: 'nav.catalog', icon: 'lucide:sprout' },
  { to: '/profile', label: 'nav.profile', icon: 'lucide:user' },
]

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <div
    class="fixed inset-x-0 z-40 flex justify-center px-4 md:hidden"
    style="bottom: calc(1.25rem + env(safe-area-inset-bottom));"
  >
    <svg
      width="0"
      height="0"
      class="absolute"
    >
      <defs>
        <filter
          id="glass-distortion-nav"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feTurbulence
            type="fractalNoise"
            base-frequency="0.015 0.015"
            num-octaves="2"
            seed="92"
            result="noise"
          />
          <feGaussianBlur
            in="noise"
            std-deviation="2"
            result="blurred"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="95"
            x-channel-selector="R"
            y-channel-selector="G"
          />
        </filter>
      </defs>
    </svg>

    <nav
      class="glass-bottom-nav relative isolate flex items-center gap-1 rounded-full px-2 py-2 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.35)]"
      aria-label="ناوبری اصلی"
    >
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="relative z-10 flex min-w-[68px] flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-ink-muted transition-colors"
        :class="isActive(item.to) ? 'text-primary-700' : 'hover:text-ink'"
      >
        <Icon
          :name="item.icon"
          class="size-5"
        />
        <span class="text-[11px] font-medium">{{ $t(item.label) }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.glass-bottom-nav {
  background-color: rgb(var(--color-surface) / 0.55);
}

.glass-bottom-nav::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 9999px;
  box-shadow: inset 0 0 12px -6px rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.glass-bottom-nav::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 9999px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  filter: url(#glass-distortion-nav);
  -webkit-filter: url(#glass-distortion-nav);
  isolation: isolate;
  pointer-events: none;
}
</style>
