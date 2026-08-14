<!--
  کارت استاندارد بخش‌های صفحه‌ی جزئیات گیاه (تاکسونومی، مورفولوژی، شیمی، ...).
  چون این ساختار (عنوان فارسی + زیرنویس انگلیسی + خط تاکیدی + محتوا) توی
  PlantDetailFull.vue ده‌بار تکرار می‌شه، به‌جای کپی‌کردن همون بلوک، یه کامپوننت
  کوچیک جداست - نه یه انتزاع سراسری، فقط برای جلوگیری از تکرار داخل همین فیچر.
-->
<script setup lang="ts">
defineProps<{
  title: string
  titleEn: string
}>()
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-ink/10 bg-surface">
    <div class="px-5 pb-3 pt-5">
      <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
        {{ title }}
        <span class="text-[11px] font-normal tracking-wide text-ink-muted">{{ titleEn }}</span>
      </h2>
      <div class="mt-2 h-0.5 w-14 rounded-full bg-accent-500" />
    </div>
    <div class="px-5 pb-5">
      <slot />
    </div>
  </div>
</template>
