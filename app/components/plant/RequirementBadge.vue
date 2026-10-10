<script setup lang="ts">
defineProps<{ icon: string, label: string }>()
</script>

<template>
  <span class="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-2 py-1 text-xs text-primary-700">
    <Icon
      :name="icon"
      class="size-3.5"
    />
    {{ label }}
  </span>
</template>
