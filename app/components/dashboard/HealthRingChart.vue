<script setup lang="ts">
import type { EChartsOption } from 'echarts'

// نمودار حلقه‌ای درصد سلامت گیاه‌ها (قبلاً دو تا <circle> SVG دستی بود)
const props = defineProps<{ value: number }>()

const { t } = useI18n()
const colors = useChartColors()

const percent = computed(() => Math.min(100, Math.max(0, props.value)))

const option = computed<EChartsOption>(() => {
  const c = colors.value
  return {
    animationDuration: 700,
    series: [
      {
        type: 'pie',
        radius: ['74%', '92%'],
        startAngle: 90,
        silent: true,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: { borderRadius: 10 },
        data: [
          { value: percent.value, itemStyle: { color: c.primary } },
          { value: 100 - percent.value, itemStyle: { color: c.track } },
        ],
      },
    ],
  }
})
</script>

<template>
  <div class="relative">
    <AppChart
      :option="option"
      :aria-label="`${t('pages.dashboard.healthRate')}: ${toPersianDigits(percent)}٪`"
    />
    <span class="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-ink">
      {{ toPersianDigits(percent) }}٪
    </span>
  </div>
</template>