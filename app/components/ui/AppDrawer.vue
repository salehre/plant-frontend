<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    side?: 'start' | 'end'
  }>(),
  { side: 'end' },
)

const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div
        v-if="props.modelValue"
        class="fixed inset-0 z-50 bg-ink/40"
        @click.self="close"
      >
        <Transition
          :name="props.side === 'end' ? 'drawer-slide-end' : 'drawer-slide-start'"
          appear
        >
          <div
            v-if="props.modelValue"
            class="absolute top-0 h-full w-72 max-w-[85vw] bg-surface p-5 shadow-card-hover"
            :class="props.side === 'end' ? 'end-0' : 'start-0'"
          >
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}
.drawer-slide-end-enter-active,
.drawer-slide-end-leave-active,
.drawer-slide-start-enter-active,
.drawer-slide-start-leave-active {
  transition: transform 0.25s ease;
}
.drawer-slide-end-enter-from,
.drawer-slide-end-leave-to {
  transform: translateX(100%);
}
.drawer-slide-start-enter-from,
.drawer-slide-start-leave-to {
  transform: translateX(-100%);
}
</style>
