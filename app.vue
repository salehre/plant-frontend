<script setup lang="ts">
// lang/dir روی <html> باید با زبان انتخاب‌شده هماهنگ باشه (نه ثابت fa/rtl)،
// چون حالا en هم به‌عنوان لوکیل فعاله؛ useLocaleHead این رو از تنظیمات هر locale می‌سازه.
const i18nHead = useLocaleHead()
useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
}))
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
