<script setup lang="ts">
import MobileBottomNav from '~/components/layout/MobileBottomNav.vue'
import TheHeader from '~/components/layout/TheHeader.vue'
import TheSidebar from '~/components/layout/TheSidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-bg">
    <TheSidebar />

    <!-- md:ps-64 = عرض سایدبار (در RTL سایدبار سمت راسته و در LTR سمت چپ) -->
    <div class="flex min-h-screen min-w-0 flex-col md:ps-64">
      <TheHeader />
      <main class="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-4 sm:px-6 md:pb-10">
        <slot />
      </main>
    </div>

    <MobileBottomNav />
  </div>
</template>
