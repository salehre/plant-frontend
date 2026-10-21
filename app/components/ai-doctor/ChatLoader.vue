<script setup lang="ts">
/** معادل Loader (حالت typing) در localmode.ai */
defineProps<{ label: string }>()
</script>

<template>
  <div
    class="flex items-center gap-1.5 py-3"
    role="status"
    :aria-label="label"
  >
    <span
      v-for="i in 3"
      :key="i"
      class="size-2 rounded-full bg-ink-muted motion-safe:animate-bounce"
      :style="{ animationDelay: `${(i - 1) * 150}ms` }"
    />
  </div>
</template>