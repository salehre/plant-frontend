<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'


const i18nHead = useLocaleHead()
useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
}))
</script>

<template>
  <div>
    <ClientOnly>
      <VitePwaManifest />
    </ClientOnly>
    <Toaster rich-colors dir="rtl" position="bottom-right" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
