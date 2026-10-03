<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'

const props = withDefaults(
    defineProps<{
      data?: number[]
      labels?: string[]
    }>(),
    {
      data: () => [20, 35, 30, 50, 65, 60, 80],
    },
)

const { t, locale } = useI18n({ messages: { en, fa }, useScope: 'local' })
const chartLabels = computed(() => props.labels ?? Array.from({ length: 7 }, (_, index) => {
  const week = new Intl.NumberFormat(locale.value, { useGrouping: false }).format(index + 1)
  return t('components.growthChart.week', { week })
}))
const width = 300
const height = 100
const max = computed(() => Math.max(...props.data))

const points = computed(() =>
    props.data
        .map((v, i) => {
          const x = (i / (props.data.length - 1)) * width
          const y = height - (v / max.value) * (height - 10) - 5
          return `${x},${y}`
        })
        .join(' '),
)
</script>

<template>
  <div class="glass-card p-4">
    <p class="mb-3 text-sm font-medium text-ink">
      {{ t('components.growthChart.title') }}
    </p>
    <svg
        :viewBox="`0 0 ${width} ${height}`"
        class="w-full text-primary-500"
        preserveAspectRatio="none"
    >
      <polyline
          :points="points"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linejoin="round"
          stroke-linecap="round"
      />
    </svg>
    <div class="mt-2 flex justify-between text-[10px] text-ink-muted">
      <span>{{ chartLabels[0] }}</span>
      <span>{{ chartLabels[chartLabels.length - 1] }}</span>
    </div>
  </div>
</template>