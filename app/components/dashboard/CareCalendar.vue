<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'
import type { CareTask } from '~/types/user.types'

const props = defineProps<{ tasks: CareTask[] }>()
const { t } = useI18n({ messages: { en, fa }, useScope: 'local' })

const weekDays = [
  'components.careCalendar.saturday',
  'components.careCalendar.sunday',
  'components.careCalendar.monday',
  'components.careCalendar.tuesday',
  'components.careCalendar.wednesday',
  'components.careCalendar.thursday',
  'components.careCalendar.friday',
]
const taskLabelKeys: Record<string, string> = {
  water: 'components.common.taskWater',
  fertilize: 'components.common.taskFertilize',
  prune: 'components.common.taskPrune',
  repot: 'components.common.taskRepot',
  mist: 'components.common.taskMist',
}

function localizedTaskLabel(type: string) {
  const key = taskLabelKeys[type]
  return key ? t(key) : type
}

function tasksForDayOffset(offset: number) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  const iso = date.toISOString().slice(0, 10)
  return props.tasks.filter(t => t.dueDate === iso)
}
</script>

<template>
  <div class="grid grid-cols-7 gap-2">
    <div
      v-for="(day, i) in weekDays"
      :key="day"
      class="flex flex-col items-center gap-2 rounded-md bg-surface p-2 shadow-card"
    >
      <span class="text-xs font-medium text-ink-muted">{{ t(day) }}</span>
      <div class="flex flex-wrap justify-center gap-1">
        <span
          v-for="task in tasksForDayOffset(i)"
          :key="task.id"
          class="size-2 rounded-full bg-primary-500"
          :title="localizedTaskLabel(task.type)"
        />
        <span
          v-if="!tasksForDayOffset(i).length"
          class="text-xs text-ink-muted/40"
        >—</span>
      </div>
    </div>
  </div>
</template>
