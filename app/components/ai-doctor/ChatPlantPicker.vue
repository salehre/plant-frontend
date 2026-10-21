<script setup lang="ts">
import type { PlantOption } from '~/composables/useUserPlantOptions'

const props = defineProps<{
  plants: PlantOption[]
  /** id گیاه‌های وصل‌شده به گفتگو */
  selected: string[]
}>()
const emit = defineEmits<{ toggle: [id: string] }>()

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const open = ref(false)
onClickOutside(root, () => { open.value = false })

// از روی لیست فعلی ساخته می‌شه تا گیاهِ حذف‌شده از «گیاهان من» چیپ نداشته باشه
const chips = computed(() => props.plants.filter(p => props.selected.includes(p.id)))
</script>

<template>
  <div
    ref="root"
    class="relative flex flex-wrap items-center gap-2"
  >
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
      :aria-expanded="open"
      @click="open = !open"
    >
      <Icon
        name="lucide:sprout"
        class="size-4"
      />
      {{ t('aiDoctor.attachPlants') }}
    </button>

    <span
      v-for="plant in chips"
      :key="plant.id"
      class="inline-flex items-center gap-1.5 rounded-full bg-primary-50 py-1 ps-1 pe-2 text-xs font-medium text-primary-700"
    >
      <img
        :src="plant.photo"
        alt=""
        class="size-5 rounded-full object-cover"
      >
      {{ plant.nickname }}
      <button
        type="button"
        class="flex size-4 items-center justify-center rounded-full transition-colors hover:bg-primary-700/10"
        :aria-label="t('aiDoctor.detachPlant', { name: plant.nickname })"
        @click="emit('toggle', plant.id)"
      >
        <Icon
          name="lucide:x"
          class="size-3"
        />
      </button>
    </span>

    <div
      v-if="open"
      class="absolute bottom-full start-0 z-20 mb-2 w-72 max-w-full rounded-2xl border border-ink/10 bg-surface p-1.5 shadow-lg"
      role="listbox"
      aria-multiselectable="true"
    >
      <p
        v-if="!plants.length"
        class="px-3 py-4 text-center text-xs leading-6 text-ink-muted"
      >
        {{ t('aiDoctor.noPlants') }}
      </p>
      <ul
        v-else
        class="max-h-64 overflow-y-auto"
      >
        <li
          v-for="plant in plants"
          :key="plant.id"
        >
          <button
            type="button"
            role="option"
            :aria-selected="selected.includes(plant.id)"
            class="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-start transition-colors hover:bg-ink/[0.05]"
            @click="emit('toggle', plant.id)"
          >
            <img
              :src="plant.photo"
              alt=""
              class="size-9 shrink-0 rounded-lg object-cover"
            >
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-ink">{{ plant.nickname }}</span>
              <span class="block truncate text-xs text-ink-muted">{{ plant.species }}</span>
            </span>
            <Icon
              v-if="selected.includes(plant.id)"
              name="lucide:check"
              class="size-4 shrink-0 text-primary-700"
            />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>