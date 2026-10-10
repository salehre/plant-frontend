<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <!-- count = تعداد بخش‌های legal.privacy.sections در فایل‌های i18n -->
  <LegalDocument
    ns="privacy"
    :count="8"
  />
</template>
