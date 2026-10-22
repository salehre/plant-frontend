<script setup lang="ts">
export interface ChatSuggestion {
  id: string
  label: string
  icon?: string
}

/** کارت‌های پیشنهاد سؤال: آیکن بالا، متن پایین */
defineProps<{ items: ChatSuggestion[] }>()
const emit = defineEmits<{ select: [ChatSuggestion] }>()
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="flex flex-col items-start gap-3 rounded-2xl border border-ink/10 bg-bg/60 p-4 text-start text-sm font-medium leading-6 text-ink transition-all hover:-translate-y-0.5 hover:border-primary-500/40 hover:bg-primary-50"
      @click="emit('select', item)"
    >
      <span
        v-if="item.icon"
        class="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-white/10"
      >
        <Icon
          :name="item.icon"
          class="size-5"
        />
      </span>
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>