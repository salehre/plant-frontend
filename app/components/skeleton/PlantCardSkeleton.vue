<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'default' | 'mini' }>(), { variant: 'default' })
</script>

<template>
  <!-- مثل PlantCard variant=mini -->
  <div
    v-if="variant === 'mini'"
    class="flex min-w-0 flex-col gap-2"
    aria-hidden="true"
  >
    <div class="aspect-square animate-pulse rounded-xl bg-ink/10" />
    <div class="flex flex-col gap-1.5 px-0.5">
      <AppSkeleton
        height="0.75rem"
        width="70%"
      />
      <AppSkeleton
        height="0.625rem"
        width="50%"
      />
    </div>
  </div>

  <!-- مثل PlantCard پیش‌فرض: ردیف در موبایل، کارت از sm به بالا -->
  <div
    v-else
    class="glass-card flex items-center gap-3 p-2.5 sm:flex-col sm:items-stretch sm:gap-0"
    aria-hidden="true"
  >
    <div class="size-16 shrink-0 animate-pulse rounded-xl bg-ink/10 sm:aspect-[4/3] sm:size-auto sm:w-full" />
    <div class="flex min-w-0 flex-1 flex-col gap-2 sm:px-1.5 sm:pb-1.5 sm:pt-3">
      <AppSkeleton
        height="1rem"
        width="65%"
      />
      <AppSkeleton
        height="0.75rem"
        width="45%"
      />
      <div class="mt-1 hidden gap-1.5 sm:flex">
        <AppSkeleton
          height="1.5rem"
          width="4.5rem"
          rounded="rounded-full"
        />
        <AppSkeleton
          height="1.5rem"
          width="4.5rem"
          rounded="rounded-full"
        />
      </div>
    </div>
  </div>
</template>