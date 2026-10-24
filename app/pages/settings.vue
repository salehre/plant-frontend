<script setup lang="ts">
// صفحه‌ی تنظیمات به تب‌های پروفایل منتقل شده. لینک‌های قدیمی (?section=) به تب مربوطه هدایت می‌شن.
const route = useRoute()

const legacySections: Record<string, string> = {
  account: 'account',
  appearance: 'appearance',
  locations: 'addresses',
  about: 'about',
}

const tab = legacySections[String(route.query.section ?? '')] ?? 'account'

await navigateTo({ path: '/profile', query: { tab } }, { replace: true, redirectCode: 301 })
</script>

<template>
  <div />
</template>
