<script setup lang="ts">
import type { CareTask } from '~/types/user.types'

const props = defineProps<{ task: CareTask, plantName: string }>()
const emit = defineEmits<{ done: [string] }>()
const { t } = useI18n()

const taskIcon: Record<string, string> = {
  water: 'lucide:droplets',
  fertilize: 'lucide:flask-conical',
  prune: 'lucide:scissors',
  repot: 'lucide:flower',
  mist: 'lucide:cloud-drizzle',
}
const taskLabelKeys: Record<string, string> = {
  water: 'components.common.taskWater',
  fertilize: 'components.common.taskFertilize',
  prune: 'components.common.taskPrune',
  repot: 'components.common.taskRepot',
  mist: 'components.common.taskMist',
}
const localizedTaskLabel = computed(() => {
  const key = taskLabelKeys[props.task.type]
  return key ? t(key) : props.task.type
})
</script>

<template>
  <div class="glass-card flex items-center gap-3 p-3.5">
    <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
      <Icon
          :name="taskIcon[props.task.type] ?? 'lucide:sprout'"
          class="size-4"
      />
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-bold text-ink">
        {{ localizedTaskLabel }} · {{ props.plantName }}
      </p>
      <p class="text-xs text-ink-muted">
        {{ toJalaliDate(props.task.dueDate) }}
      </p>
    </div>
    <button
        class="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary-300 text-primary-700 transition-colors hover:bg-primary-600 hover:text-white"
        :aria-label="t('components.taskCard.complete')"
        @click="emit('done', props.task.id)"
    >
      <Icon
          name="lucide:check"
          class="size-4"
      />
    </button>
  </div>
</template>