/**
 * لود تنبل و tree-shaken شده‌ی echarts: فقط چارت‌ها/کامپوننت‌هایی که پروژه لازم داره ثبت می‌شن
 * و کل کتابخونه تو بسته‌ی اولیه نمی‌ره. فقط سمت کلاینت صدا زده بشه (تو onMounted).
 * اگه چارت جدیدی (bar, radar, ...) لازم شد، همین‌جا به use([...]) اضافه‌ش کن.
 */
let echartsPromise: Promise<typeof import('echarts/core')> | null = null

export function loadEcharts() {
  if (!echartsPromise) {
    echartsPromise = (async () => {
      const [core, charts, components, renderers] = await Promise.all([
        import('echarts/core'),
        import('echarts/charts'),
        import('echarts/components'),
        import('echarts/renderers'),
      ])
      core.use([
        charts.LineChart,
        charts.PieChart,
        components.GridComponent,
        components.TooltipComponent,
        renderers.CanvasRenderer,
      ])
      return core
    })()
  }
  return echartsPromise
}