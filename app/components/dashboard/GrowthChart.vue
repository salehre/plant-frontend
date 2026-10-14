<script setup lang="ts">
import type { EChartsOption } from 'echarts'

const props = withDefaults(
  defineProps<{
    data?: number[]
    labels?: string[]
  }>(),
  {
    data: () => [20, 35, 30, 50, 65, 60, 80],
    labels: undefined,
  },
)

const { t, locale } = useI18n()
const colors = useChartColors()

const numberFormat = computed(() => new Intl.NumberFormat(locale.value, { useGrouping: false }))
const chartLabels = computed(() => props.labels ?? props.data.map((_, index) =>
  t('components.growthChart.week', { week: numberFormat.value.format(index + 1) }),
))

const option = computed<EChartsOption>(() => {
  const c = colors.value
  return {
    animationDuration: 700,
    grid: { top: 12, right: 12, bottom: 4, left: 12, containLabel: true },
    tooltip: {
      trigger: 'axis',
      confine: true,
      backgroundColor: c.surface,
      borderColor: c.grid,
      textStyle: { color: c.ink, fontFamily: c.font, fontSize: 12 },
      valueFormatter: value => numberFormat.value.format(Number(value)),
    },
    xAxis: {
      type: 'category',
      data: chartLabels.value,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: c.muted, fontFamily: c.font, fontSize: 10, hideOverlap: true },
    },
    yAxis: {
      type: 'value',
      min: 0,
      show: false,
      splitLine: { show: false },
    },
    series: [
      {
        type: 'line',
        data: props.data,
        smooth: true,
        showSymbol: false,
        symbolSize: 8,
        lineStyle: { width: 2.5, color: c.primary, cap: 'round', join: 'round' },
        itemStyle: { color: c.primary },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: c.primarySoft },
              { offset: 1, color: c.primaryFaint },
            ],
          },
        },
      },
    ],
  }
})
</script>

<template>
  <div class="glass-card p-4">
    <p class="mb-3 text-sm font-medium text-ink">
      {{ t('components.growthChart.title') }}
    </p>
    <AppChart
      :option="option"
      height="140px"
      :aria-label="t('components.growthChart.title')"
    />
  </div>
</template>