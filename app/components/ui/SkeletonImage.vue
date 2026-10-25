<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  imageClass?: string
  loading?: 'eager' | 'lazy'
  fetchpriority?: 'high' | 'low' | 'auto'
}>(), {
  imageClass: 'size-full object-cover',
  loading: 'lazy',
  fetchpriority: 'auto',
})

const image = ref<HTMLImageElement | null>(null)
const loaded = ref(false)

function syncLoadedState() {
  if (image.value?.complete) loaded.value = true
}

watch(() => props.src, () => {
  loaded.value = false
  nextTick(syncLoadedState)
})

onMounted(syncLoadedState)
</script>

<template>
  <span class="block overflow-hidden">
    <span class="relative block size-full overflow-hidden">
      <span
        v-if="!loaded"
        class="absolute inset-0 motion-safe:animate-pulse bg-ink/10"
        aria-hidden="true"
      />
      <img
        ref="image"
        :src="props.src"
        :alt="props.alt"
        :class="props.imageClass"
        :loading="props.loading"
        :fetchpriority="props.fetchpriority"
        decoding="async"
        @load="loaded = true"
        @error="loaded = true"
      >
    </span>
  </span>
</template>
