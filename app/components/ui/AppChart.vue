<script setup lang="ts">
import type { ECharts, EChartsOption } from 'echarts'

/**
 * wrapper عمومی echarts برای همه‌ی نمودارهای پروژه.
 * فقط option می‌گیره؛ init، ریسایز (ResizeObserver) و dispose رو خودش مدیریت می‌کنه.
 */
const props = withDefaults(defineProps<{
  option: EChartsOption
  height?: string
  ariaLabel?: string
}>(), {
  height: '100%',
  ariaLabel: undefined,
})

const el = ref<HTMLElement | null>(null)
let chart: ECharts | null = null
let observer: ResizeObserver | null = null
let disposed = false

onMounted(async () => {
  const echarts = await loadEcharts()
  // اگه کامپوننت قبل از تموم شدن لود unmount شده باشه
  if (disposed || !el.value) return
  chart = echarts.init(el.value, undefined, { renderer: 'canvas' })
  chart.setOption(props.option)
  observer = new ResizeObserver(() => chart?.resize())
  observer.observe(el.value)
})

watch(() => props.option, (option) => {
  chart?.setOption(option, { notMerge: true })
}, { deep: true })

onBeforeUnmount(() => {
  disposed = true
  observer?.disconnect()
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div
    ref="el"
    role="img"
    :aria-label="ariaLabel"
    class="w-full"
    :style="{ height }"
  />
</template>