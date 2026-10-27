<script setup lang="ts">
/**
 * آواتار کاربر. اندازه رو با کلاس بده، مثلاً <UserAvatar class="size-10" />.
 * اگه عکس نبود (یا لود نشد) آیکن کاربر نشون داده می‌شه.
 */
const props = defineProps<{
  src?: string | null
  name?: string
}>()

const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <span class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700">
    <img
      v-if="props.src && !failed"
      loading="lazy"
      decoding="async"
      :src="props.src"
      :alt="props.name || ''"
      class="size-full object-cover"
      @error="failed = true"
    >
    <Icon
      v-else
      name="lucide:user"
      class="size-1/2"
    />
  </span>
</template>