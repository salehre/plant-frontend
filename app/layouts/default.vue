<script setup lang="ts">
import MobileBottomNav from '~/components/layout/MobileBottomNav.vue'
import TheHeader from '~/components/layout/TheHeader.vue'
import TheFooter from '~/components/layout/TheFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <TheHeader />
    <main class="flex-1 pb-24 md:pb-0">
      <slot />
    </main>
    <TheFooter />
    <MobileBottomNav />
  </div>
</template>
