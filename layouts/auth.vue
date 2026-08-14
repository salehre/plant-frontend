<script setup lang="ts">
import { themes } from '~/stores/ui.store'
import type { ThemeKey } from '~/stores/ui.store'

const uiStore = useUiStore()

const seasonByTheme: Record<ThemeKey, string> = {
  navy: 'winter',
  brown: 'autumn',
  wine: 'spring',
  forest: 'summer',
}

const bgImage = computed(() => `/images/bg-image/${seasonByTheme[uiStore.theme]}.webp`)

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  const n = Number.parseInt(clean, 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

const themeRgb = computed(() => {
  const swatch = themes.find(t => t.key === uiStore.theme)?.swatch ?? '#0F3D2E'
  return hexToRgb(swatch)
})

const mistStyle = computed(() => ({
  background: `radial-gradient(ellipse at center, transparent 55%, rgba(${themeRgb.value}, 0.28) 100%)`,
}))
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
    <Transition name="bg-fade">
      <img
          :key="bgImage"
          :src="bgImage"
          alt=""
          class="absolute inset-0 size-full object-cover"
      >
    </Transition>
    <div
        class="mist-overlay absolute inset-0"
        :style="mistStyle"
    />

    <div class="relative z-10 w-full max-w-md">
      <NuxtLink
          to="/"
          class="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]"
      >
        <Icon
            name="lucide:leaf"
            class="size-6 text-accent-300"
        />
        برگ‌یار
      </NuxtLink>

      <LiquidGlassPanel>
        <div class="p-7 sm:p-8">
          <slot />
        </div>
      </LiquidGlassPanel>
    </div>

    <AppToast />
  </div>
</template>

<style scoped>
.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 0.6s ease;
}
.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}

.mist-overlay {
  transition: background 0.6s ease;
}

@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(28px, -22px) scale(1.08);
  }
}
</style>