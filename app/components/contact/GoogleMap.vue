<script setup lang="ts">
// نقشه‌ی گوگل‌مپ با مارکر روی مکان - بدون نیاز به API key و بدون پکیج اضافه (iframe رسمی embed)

const props = withDefaults(defineProps<{
  /** [طول جغرافیایی (lng), عرض جغرافیایی (lat)] */
  center: [number, number]
  zoom?: number
}>(), {
  zoom: 15,
})

const { t, locale } = useI18n()

const src = computed(() => {
  const [lng, lat] = props.center
  const params = new URLSearchParams({
    q: `${lat},${lng}`,
    z: String(props.zoom),
    hl: locale.value === 'fa' ? 'fa' : 'en',
    output: 'embed',
  })
  return `https://maps.google.com/maps?${params.toString()}`
})

const loaded = ref(false)
</script>

<template>
  <div class="relative size-full">
    <iframe
      :src="src"
      :title="t('contact.mapAlt')"
      class="size-full border-0"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      @load="loaded = true"
    />
    <div
      v-if="!loaded"
      class="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary-50 text-sm text-ink-muted"
    >
      {{ t('contact.mapLoading') }}
    </div>
  </div>
</template>