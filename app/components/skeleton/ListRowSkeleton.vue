<script setup lang="ts">
// برای PlantWidget، TaskCard و ردیف‌های تاریخچه/علاقه‌مندی
withDefaults(defineProps<{ imageSize?: string }>(), { imageSize: '3.5rem' })
</script>

<template>
  <div
    class="glass-card flex items-center gap-3 p-3"
    aria-hidden="true"
  >
    <AppSkeleton
      :height="imageSize"
      :width="imageSize"
      rounded="rounded-md"
    />
    <div class="flex min-w-0 flex-1 flex-col gap-2">
      <AppSkeleton
        height="1rem"
        width="50%"
      />
      <AppSkeleton
        height="0.75rem"
        width="70%"
      />
    </div>
  </div>
</template>