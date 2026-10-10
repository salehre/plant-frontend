<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <!-- count = تعداد بخش‌های legal.terms.sections در فایل‌های i18n -->
  <LegalDocument
    ns="terms"
    :count="9"
  />
</template>
