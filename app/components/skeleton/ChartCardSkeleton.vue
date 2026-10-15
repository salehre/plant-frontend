<script setup lang="ts">
withDefaults(defineProps<{ height?: string }>(), { height: '140px' })
</script>

<template>
  <div
    class="glass-card p-4"
    aria-hidden="true"
  >
    <AppSkeleton
      class="mb-3"
      height="0.875rem"
      width="30%"
    />
    <AppSkeleton
      :height="height"
      rounded="rounded-lg"
    />
  </div>
</template>