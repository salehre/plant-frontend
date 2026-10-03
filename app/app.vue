<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'


const i18nHead = useLocaleHead()
const { locale } = useI18n()
useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
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
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
