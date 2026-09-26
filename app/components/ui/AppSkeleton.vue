<script setup lang="ts">
withDefaults(
  defineProps<{
    height?: string
    width?: string
    rounded?: string
  }>(),
  { height: '1rem', width: '100%', rounded: 'rounded-sm' },
)
</script>

<template>
  <div
    class="animate-pulse bg-ink/10"
    :class="rounded"
    :style="{ height, width }"
  />
</template>
