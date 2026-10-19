<template>
  <!-- کارت سکشن صفحه‌ی جزییات گیاه: پدینگ، عنوان (text-base = ۱.۵rem) و فاصله‌ی mb-4 مثل صفحه‌ی اصلی -->
  <section
    class="glass-card p-5 sm:p-6"
    aria-hidden="true"
  >
    <div class="flex h-6 items-center">
      <AppSkeleton
        height="1rem"
        :width="titleWidth"
      />
    </div>
    <div class="mb-4" />
    <slot />
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ titleWidth?: string }>(), { titleWidth: '7rem' })
</script>