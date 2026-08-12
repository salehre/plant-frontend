<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data?: number[]
    labels?: string[]
  }>(),
  {
    data: () => [20, 35, 30, 50, 65, 60, 80],
    labels: () => ['هفته ۱', 'هفته ۲', 'هفته ۳', 'هفته ۴', 'هفته ۵', 'هفته ۶', 'هفته ۷'],
  },
)

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
  <div class="rounded-lg bg-surface p-4 shadow-card">
    <p class="mb-3 text-sm font-medium text-ink">
      روند رشد
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
      <span>{{ props.labels[0] }}</span>
      <span>{{ props.labels[props.labels.length - 1] }}</span>
    </div>
  </div>
</template>
