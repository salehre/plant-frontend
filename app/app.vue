<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const { locale } = useI18n()
const isPageLoading = ref(false)
const nuxtApp = useNuxtApp()

let loadingTimeout: ReturnType<typeof setTimeout> | undefined

nuxtApp.hook('page:start', () => {
  clearTimeout(loadingTimeout)
  loadingTimeout = setTimeout(() => {
    isPageLoading.value = true
  }, 120)
})

nuxtApp.hook('page:finish', () => {
  clearTimeout(loadingTimeout)
  loadingTimeout = undefined
  isPageLoading.value = false
})

onBeforeUnmount(() => clearTimeout(loadingTimeout))

// lang و dir مستقیم از locale ست می‌شن تا html[lang^='en'] / html[lang^='fa'] توی main.css
// (که فونت Inter/Peyda رو عوض می‌کنه) همیشه با زبان فعلی هماهنگ باشن.
useHead(() => ({
  htmlAttrs: {
    lang: locale.value === 'fa' ? 'fa-IR' : 'en-US',
    dir: locale.value === 'fa' ? 'rtl' : 'ltr',
  },
}))
</script>

<template>
  <div>
    <svg width="0" height="0" style="position: absolute" aria-hidden="true">
      <defs>
        <filter id="glass-distortion-08" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.006" numOctaves="2" seed="92" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="45" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
    <ClientOnly>
      <VitePwaManifest />
    </ClientOnly>
    <Toaster rich-colors :dir="locale === 'fa' ? 'rtl' : 'ltr'" position="bottom-right" />
    <NuxtRouteAnnouncer />
    <Transition name="page-loading">
      <div
        v-if="isPageLoading"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-bg/85 px-6 backdrop-blur-sm"
        role="status"
        :aria-label="$t('common.loading')"
        aria-live="polite"
      >
        <div class="w-full max-w-sm space-y-5 rounded-2xl border border-ink/10 bg-surface/90 p-6 shadow-card">
          <div class="flex items-center gap-4">
            <div class="size-12 shrink-0 motion-safe:animate-pulse rounded-2xl bg-primary-700/15" />
            <div class="flex-1 space-y-2">
              <div class="h-4 w-2/3 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="h-3 w-1/2 motion-safe:animate-pulse rounded bg-ink/10" />
            </div>
          </div>
          <div class="space-y-3">
            <div class="h-3 w-full motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="h-3 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="h-3 w-3/5 motion-safe:animate-pulse rounded bg-ink/10" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="index in 2" :key="index" class="h-16 motion-safe:animate-pulse rounded-xl bg-ink/5" />
          </div>
        </div>
      </div>
    </Transition>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>
.page-loading-enter-active,
.page-loading-leave-active {
  transition: opacity 180ms ease;
}

.page-loading-enter-from,
.page-loading-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .page-loading-enter-active,
  .page-loading-leave-active {
    transition: none;
  }
}
</style>