<script setup lang="ts">
const uiStore = useUiStore()

const iconFor = (type: string) =>
  type === 'success' ? 'lucide:check-circle' : type === 'error' ? 'lucide:alert-circle' : 'lucide:info'

const colorFor = (type: string) =>
  type === 'success'
    ? 'bg-primary-600'
    : type === 'error'
      ? 'bg-status-danger'
      : 'bg-status-info'
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 start-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 rtl:translate-x-1/2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in uiStore.toasts"
          :key="toast.id"
          class="flex items-center gap-2 rounded-md px-4 py-3 text-sm text-white shadow-card-hover"
          :class="colorFor(toast.type)"
        >
          <Icon
            :name="iconFor(toast.type)"
            class="size-4 shrink-0"
          />
          <span>{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
