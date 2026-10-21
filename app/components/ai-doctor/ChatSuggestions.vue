<script setup lang="ts">
export interface ChatSuggestion {
  id: string
  label: string
  icon?: string
}

/** معادل Suggestions در localmode.ai: کارت‌های پیشنهاد سؤال */
defineProps<{ items: ChatSuggestion[] }>()
const emit = defineEmits<{ select: [ChatSuggestion] }>()
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface p-3.5 text-start text-sm leading-6 text-ink transition-colors hover:border-primary-500/40 hover:bg-primary-50"
      @click="emit('select', item)"
    >
      <Icon
        v-if="item.icon"
        :name="item.icon"
        class="size-5 shrink-0 text-primary-600"
      />
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>