<script setup lang="ts">
const props = defineProps<{
  options: { label: string, value: string }[]
  // undefined یعنی «هنوز چیزی انتخاب نشده» - مثلاً وقتی این کامپوننت با defineField
  // از vee-validate استفاده می‌شه، تایپ فیلد پیش از اولین تعامل کاربر می‌تونه undefined باشه.
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [string] }>()

const open = ref(false)
const target = ref<HTMLElement | null>(null)

onClickOutside(target, () => (open.value = false))

const selectedLabel = computed(
  () => props.options.find(o => o.value === props.modelValue)?.label ?? props.placeholder ?? 'انتخاب کن',
)

function select(value: string) {
  emit('update:modelValue', value)
  open.value = false
}
</script>

<template>
  <div
    ref="target"
    class="relative"
  >
    <button
      type="button"
      class="flex w-full items-center justify-between gap-2 rounded-md border border-ink/10 bg-surface px-3 py-2 text-sm text-ink hover:border-primary-300"
      @click="open = !open"
    >
      <span>{{ selectedLabel }}</span>
      <Icon
        name="lucide:chevron-down"
        class="size-4 text-ink-muted transition-transform"
        :class="{ 'rotate-180': open }"
      />
    </button>
    <Transition name="dropdown-fade">
      <ul
        v-if="open"
        class="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-ink/10 bg-surface py-1 shadow-card-hover"
      >
        <li
          v-for="opt in options"
          :key="opt.value"
          class="cursor-pointer px-3 py-2 text-sm hover:bg-primary-50"
          :class="{ 'text-primary-700 font-medium': opt.value === modelValue }"
          @click="select(opt.value)"
        >
          {{ opt.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.12s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
