<script setup lang="ts">
import type { CareTask } from '~/types/user.types'

const props = defineProps<{ task: CareTask, plantName: string }>()
const emit = defineEmits<{ done: [string] }>()

const taskIcon: Record<string, string> = {
  water: 'lucide:droplets',
  fertilize: 'lucide:flask-conical',
  prune: 'lucide:scissors',
  repot: 'lucide:flower',
  mist: 'lucide:cloud-drizzle',
}
</script>

<template>
  <div class="flex items-center gap-3 rounded-md border border-ink/5 bg-surface p-3">
    <div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
      <Icon
        :name="taskIcon[props.task.type] ?? 'lucide:sprout'"
        class="size-4"
      />
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium text-ink">
        {{ taskLabel(props.task.type) }} · {{ props.plantName }}
      </p>
      <p class="text-xs text-ink-muted">
        {{ toJalaliDate(props.task.dueDate) }}
      </p>
    </div>
    <button
      class="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary-200 text-primary-600 hover:bg-primary-50"
      aria-label="انجام شد"
      @click="emit('done', props.task.id)"
    >
      <Icon
        name="lucide:check"
        class="size-4"
      />
    </button>
  </div>
</template>
