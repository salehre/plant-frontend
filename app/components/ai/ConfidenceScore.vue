<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'

const props = defineProps<{ value: number }>()
const { t, locale } = useI18n({ messages: { en, fa }, useScope: 'local' })

const percent = computed(() => Math.round(props.value * 100))
const formattedPercent = computed(() =>
  t('components.confidenceScore.percentage', {
    value: new Intl.NumberFormat(locale.value, { useGrouping: false }).format(percent.value),
  }),
)

const colorClass = computed(() => {
  if (props.value >= 0.8) return 'bg-primary-500'
  if (props.value >= 0.5) return 'bg-status-warning'
  return 'bg-status-danger'
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
      <div
        class="h-full rounded-full transition-all duration-700"
        :class="colorClass"
        :style="{ width: percent + '%' }"
      />
    </div>
    <span class="w-10 text-left text-xs font-medium text-ink-muted">{{ formattedPercent }}</span>
  </div>
</template>
