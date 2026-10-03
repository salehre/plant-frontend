<script setup lang="ts">
import MobileBottomNav from '~/components/layout/MobileBottomNav.vue'
import TheHeader from '~/components/layout/TheHeader.vue'
import TheFooter from '~/components/layout/TheFooter.vue'
import CornerGradient from '~/components/layout/CornerGradient.vue'

const route = useRoute()
</script>

<template>
  <div class="relative flex min-h-screen flex-col overflow-x-clip">
    <CornerGradient />
    <TheHeader />
    <main class="flex-1 pb-24 md:pb-0">
      <slot />
    </main>
    <TheFooter v-if="route.path === '/'" />
    <MobileBottomNav />
  </div>
</template>