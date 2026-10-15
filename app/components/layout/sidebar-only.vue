<script setup lang="ts">
import MobileBottomNav from '~/components/layout/MobileBottomNav.vue'
import TheSidebar from '~/components/layout/TheSidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-bg">
    <TheSidebar />

    <!-- md:ps-64 = عرض سایدبار؛ pb-20 جا برای نوار پایین موبایل -->
    <div class="flex min-h-screen min-w-0 flex-col overflow-x-clip pb-20 md:ps-64 md:pb-0">
      <main class="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        <slot />
      </main>
    </div>

    <MobileBottomNav />
  </div>
</template>