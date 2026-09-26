<script setup lang="ts">
import type { CareTask } from '~/types/user.types'

const props = defineProps<{ tasks: CareTask[] }>()

const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

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
      <span class="text-xs font-medium text-ink-muted">{{ day }}</span>
      <div class="flex flex-wrap justify-center gap-1">
        <span
          v-for="task in tasksForDayOffset(i)"
          :key="task.id"
          class="size-2 rounded-full bg-primary-500"
          :title="taskLabel(task.type)"
        />
        <span
          v-if="!tasksForDayOffset(i).length"
          class="text-xs text-ink-muted/40"
        >—</span>
      </div>
    </div>
  </div>
</template>
