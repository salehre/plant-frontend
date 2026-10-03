<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'
import type { MockLocale } from '~/services/mock/mock-locale'
import { suggestPlants } from '~/services/mock/plants.mock'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string], 'select': [string] }>()
const { locale } = useI18n({ messages: { en, fa }, useScope: 'local' })

const isFocused = ref(false)
const target = ref<HTMLElement | null>(null)
onClickOutside(target, () => (isFocused.value = false))

const mockLocale = computed<MockLocale>(() => locale.value === 'en' ? 'en' : 'fa')
const suggestions = computed(() => suggestPlants(props.modelValue, 5, mockLocale.value))
const showDropdown = computed(() => isFocused.value && props.modelValue.trim().length > 0 && suggestions.value.length > 0)

function pick(name: string) {
  emit('update:modelValue', name)
  emit('select', name)
  isFocused.value = false
}
</script>

<template>
  <div
    ref="target"
    class="relative"
  >
    <div class="relative">
      <Icon
        name="lucide:search"
        class="absolute top-1/2 start-3 size-4 -translate-y-1/2 text-ink-muted"
      />
      <input
        :value="props.modelValue"
        type="text"
        :placeholder="$t('common.searchPlaceholder')"
        class="w-full rounded-md border border-ink/10 bg-surface py-2.5 ps-9 pe-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="isFocused = true"
      >
    </div>
    <Transition name="dropdown-fade">
      <ul
        v-if="showDropdown"
        class="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-ink/10 bg-surface py-1 shadow-card-hover"
      >
        <li
          v-for="s in suggestions"
          :key="s.id"
          class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-primary-50"
          @click="pick(s.name)"
        >
          <img
            :src="s.images[0]"
            :alt="s.name"
            class="size-8 rounded-md object-cover"
          >
          <div>
            <p class="text-ink">
              {{ s.name }}
            </p>
            <p class="text-xs italic text-ink-muted">
              {{ s.scientificName }}
            </p>
          </div>
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
