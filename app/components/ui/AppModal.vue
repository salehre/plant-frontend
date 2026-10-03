<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'

const props = defineProps<{
  modelValue: boolean
  title?: string
}>()

const { t } = useI18n({ messages: { en, fa }, useScope: 'local' })
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="props.modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
        @click.self="close"
      >
        <div class="w-full max-w-md rounded-lg bg-surface p-6 shadow-card-hover">
          <div class="mb-4 flex items-center justify-between">
            <h3
              v-if="props.title"
              class="text-lg font-bold text-ink"
            >
              {{ props.title }}
            </h3>
            <button
              class="rounded-sm p-1 text-ink-muted hover:bg-ink/5"
              :aria-label="t('components.appModal.close')"
              @click="close"
            >
              <Icon
                name="lucide:x"
                class="size-5"
              />
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
