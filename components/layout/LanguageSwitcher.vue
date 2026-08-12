<script setup lang="ts">
const { locale, setLocale } = useI18n()

const isFa = computed(() => locale.value === 'fa')

function toggleLocale() {
  setLocale(isFa.value ? 'en' : 'fa')
}
</script>

<template>
  <button
    type="button"
    class="flex h-9 items-center justify-center rounded-full bg-primary-50 px-3 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-100"
    :aria-label="isFa ? 'Switch language to English' : 'تغییر زبان به فارسی'"
    @click="toggleLocale"
  >
    {{ isFa ? 'EN' : 'فا' }}
  </button>
</template>
