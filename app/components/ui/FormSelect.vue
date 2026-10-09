<script setup lang="ts">
const props = defineProps<{
  options: { label: string, value: string }[]
  modelValue?: string
  placeholder?: string
  invalid?: boolean
  ariaLabel?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [string] }>()

const { t } = useI18n()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)
const listId = useId()

onClickOutside(root, () => close())

const selectedIndex = computed(() => props.options.findIndex(o => o.value === props.modelValue))
const selected = computed(() => props.options[selectedIndex.value])

function openList() {
  activeIndex.value = selectedIndex.value >= 0 ? selectedIndex.value : 0
  open.value = true
}

function close() {
  open.value = false
}

function toggle() {
  open.value ? close() : openList()
}

function select(value: string) {
  emit('update:modelValue', value)
  close()
}

function move(step: 1 | -1) {
  const count = props.options.length
  activeIndex.value = (activeIndex.value + step + count) % count
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp': {
      event.preventDefault()
      if (!open.value) return openList()
      move(event.key === 'ArrowDown' ? 1 : -1)
      break
    }
    case 'Enter':
    case ' ': {
      event.preventDefault()
      const opt = props.options[activeIndex.value]
      if (open.value && opt) select(opt.value)
      else openList()
      break
    }
    case 'Escape':
    case 'Tab':
      close()
      break
  }
}
</script>

<template>
  <div
    ref="root"
    class="relative"
    :class="{ 'z-30': open }"
  >
    <button
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listId"
      :aria-label="ariaLabel"
      class="flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2.5 text-sm outline-none transition-colors"
      :class="[
        invalid ? 'border-status-danger' : open ? 'border-primary-500' : 'border-ink/15',
        selected ? 'text-ink' : 'text-ink-muted/60',
      ]"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="truncate">{{ selected?.label ?? placeholder ?? t('components.appDropdown.select') }}</span>
      <Icon
        name="lucide:chevron-down"
        class="size-4 shrink-0 text-ink-muted transition-transform duration-200"
        :class="{ 'rotate-180': open }"
      />
    </button>

    <Transition name="select-pop">
      <ul
        v-if="open"
        :id="listId"
        role="listbox"
        class="absolute inset-x-0 z-30 mt-3 origin-top overflow-hidden rounded-[10px] border border-ink/10 bg-surface  shadow-card-hover"
      >
        <li
          v-for="(opt, index) in options"
          :key="opt.value"
          role="option"
          :aria-selected="opt.value === modelValue"
          class="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm transition-colors"
          :class="[
            index === activeIndex ? 'bg-primary-50' : '',
            opt.value === modelValue ? 'font-medium text-primary-700' : 'text-ink',
          ]"
          @mouseenter="activeIndex = index"
          @click="select(opt.value)"
        >
          <span>{{ opt.label }}</span>
          <Icon
            v-if="opt.value === modelValue"
            name="lucide:check"
            class="size-4 shrink-0"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.select-pop-enter-active {
  transition:
    opacity 0.18s ease,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.select-pop-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}
.select-pop-enter-from,
.select-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>