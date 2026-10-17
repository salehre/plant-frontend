/**
 * رنگ‌های چارت از همون CSS variableهای تم (main.css) خونده می‌شن، پس با عوض شدن
 * تم رنگی یا دارک‌مود چارت هم خودکار هم‌رنگ بقیه‌ی اپ می‌شه.
 * فونت چارت هم با عوض شدن زبان (Peyda <-> Inter) دوباره خونده می‌شه.
 */
export interface ChartColors {
  primary: string
  primarySoft: string
  primaryFaint: string
  track: string
  ink: string
  muted: string
  surface: string
  grid: string
  font: string
}

function channel(name: string, alpha?: number) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim()
  const rgb = raw.split(/\s+/).join(',')
  if (!rgb) return alpha === undefined ? '#888' : `rgba(136,136,136,${alpha})`
  return alpha === undefined ? `rgb(${rgb})` : `rgba(${rgb},${alpha})`
}

function readColors(): ChartColors {
  if (!import.meta.client) {
    return {
      primary: '#358269',
      primarySoft: 'rgba(53,130,105,0.28)',
      primaryFaint: 'rgba(53,130,105,0)',
      track: '#d7efe7',
      ink: '#0c3024',
      muted: '#51645e',
      surface: '#ffffff',
      grid: 'rgba(12,48,36,0.08)',
      font: 'inherit',
    }
  }
  return {
    primary: channel('primary-500'),
    primarySoft: channel('primary-500', 0.28),
    primaryFaint: channel('primary-500', 0),
    track: channel('primary-100'),
    ink: channel('ink'),
    muted: channel('ink-muted'),
    surface: channel('surface'),
    grid: channel('ink', 0.08),
    font: getComputedStyle(document.body).fontFamily || 'inherit',
  }
}

export function useChartColors() {
  const uiStore = useUiStore()
  const { locale } = useI18n()
  const colors = ref<ChartColors>(readColors())

  const refresh = async () => {
    // attribute تم تو applyThemeAttribute ست می‌شه؛ یه tick صبر می‌کنیم تا استایل نهایی اعمال شده باشه
    await nextTick()
    colors.value = readColors()
  }

  // lang روی <html> با useHead (توی app.vue) async عوض می‌شه، پس بعد از یه فریم هم دوباره می‌خونیم
  const refreshAfterLocaleChange = async () => {
    await refresh()
    if (import.meta.client) {
      requestAnimationFrame(() => {
        colors.value = readColors()
      })
    }
  }

  onMounted(refresh)
  watch(() => [uiStore.theme, uiStore.mode], refresh)
  watch(locale, refreshAfterLocaleChange)

  return colors
}