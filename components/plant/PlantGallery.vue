<script setup lang="ts">
const props = defineProps<{ images: string[], alt: string }>()
const activeIndex = ref(0)
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="aspect-square overflow-hidden rounded-lg bg-primary-50">
      <img
        :src="props.images[activeIndex]"
        :alt="props.alt"
        class="size-full object-cover"
      >
    </div>
    <div
      v-if="props.images.length > 1"
      class="flex gap-2"
    >
      <button
        v-for="(img, i) in props.images"
        :key="img"
        class="size-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors"
        :class="i === activeIndex ? 'border-primary-500' : 'border-transparent opacity-70'"
        @click="activeIndex = i"
      >
        <img
          :src="img"
          :alt="`${props.alt} ${i + 1}`"
          class="size-full object-cover"
        >
      </button>
    </div>
  </div>
</template>
