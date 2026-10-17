<script setup lang="ts">
import MobileBottomNav from "~/components/layout/MobileBottomNav.vue";
import TheFooter from "~/components/layout/TheFooter.vue";
import TheHeader from "~/components/layout/TheHeader.vue";
import TheSidebar from "~/components/layout/TheSidebar.vue";

const route = useRoute();
const isHome = computed(() => route.path === "/");
const isPlantDetail = computed(() => route.path.startsWith('/plants/'))
</script>

<template>
  <div class="min-h-screen bg-bg">
    <TheSidebar />
    <div class="flex min-h-screen min-w-0 flex-col overflow-x-clip md:ps-64">
      <TheHeader :class="isPlantDetail ? 'max-md:hidden' : ''" />
      <main
        class="mx-auto w-full max-w-6xl flex-1 px-4 pt-4 sm:px-6"
        :class="isHome ? '' : 'pb-24 md:pb-8'"
      >
        <slot />
      </main>
      <TheFooter v-if="isHome" class="mt-12" />
    </div>

    <MobileBottomNav :class="isPlantDetail ? 'max-md:hidden' : ''" />
  </div>
</template>
