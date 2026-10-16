<script setup lang="ts">
import MobileBottomNav from "~/components/layout/MobileBottomNav.vue";
import TheFooter from "~/components/layout/TheFooter.vue";
import TheHeader from "~/components/layout/TheHeader.vue";
import TheSidebar from "~/components/layout/TheSidebar.vue";

const route = useRoute();
const isHome = computed(() => route.path === "/");
</script>

<template>
  <div class="min-h-screen bg-bg">
    <TheSidebar />

    <!-- md:ps-64 = عرض سایدبار (در RTL سایدبار سمت راسته و در LTR سمت چپ) -->
    <div class="flex min-h-screen min-w-0 flex-col overflow-x-clip md:ps-64">
      <TheHeader />
      <main
        class="mx-auto w-full max-w-6xl flex-1 px-4 pt-4 sm:px-6"
        :class="isHome ? '' : 'pb-24 md:pb-8'"
      >
        <slot />
      </main>
      <TheFooter v-if="isHome" class="mt-12" />
    </div>

    <MobileBottomNav />
  </div>
</template>
