<script setup lang="ts">
/** معادل In-Message Error در localmode.ai: خطای داخل خود پیام، با دکمه‌ی تلاش دوباره */
defineProps<{ message: string, retryLabel: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    class="flex flex-col items-start gap-2"
    role="alert"
  >
    <p class="text-sm leading-7 text-status-danger">
      {{ message }}
    </p>
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-full border border-primary-500/40 px-3 py-1.5 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-50"
      @click="emit('retry')"
    >
      <Icon
        name="lucide:rotate-ccw"
        class="size-3.5"
      />
      {{ retryLabel }}
    </button>
  </div>
</template>