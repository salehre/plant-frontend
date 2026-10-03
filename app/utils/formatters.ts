/**
 * Locale-aware number and date formatting shared by page and component templates.
 */
export function toPersianDigits(value: number | string): string {
  if (getLocale().startsWith('en')) return String(value)
  const fa = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return String(value).replace(/\d/g, d => fa[Number(d)] ?? d)
}

/**
 * Format dates using the active locale's calendar and language.
 */
export function toJalaliDate(isoDate: string): string {
  const date = new Date(isoDate)
  const formatter = new Intl.DateTimeFormat(getLocale(), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return formatter.format(date)
}

export function formatConfidence(value: number): string {
  const percentage = new Intl.NumberFormat(getLocale(), { maximumFractionDigits: 0 }).format(Math.round(value * 100))
  return `${percentage}${getLocale().startsWith('en') ? '%' : '٪'}`
}

const taskLabels: Record<string, Record<'fa' | 'en', string>> = {
  water: { fa: 'آبیاری', en: 'Watering' },
  fertilize: { fa: 'کوددهی', en: 'Fertilizing' },
  prune: { fa: 'هرس', en: 'Pruning' },
  repot: { fa: 'تعویض گلدان', en: 'Repotting' },
  mist: { fa: 'مه‌پاشی', en: 'Misting' },
}

export function taskLabel(type: string): string {
  return taskLabels[type]?.[getLanguage()] ?? type
}

const difficultyLabels: Record<string, Record<'fa' | 'en', string>> = {
  easy: { fa: 'آسان', en: 'Easy' },
  medium: { fa: 'متوسط', en: 'Moderate' },
  hard: { fa: 'سخت', en: 'Difficult' },
}

export function difficultyLabel(value: string): string {
  return difficultyLabels[value]?.[getLanguage()] ?? value
}

const lightLabels: Record<string, Record<'fa' | 'en', string>> = {
  low: { fa: 'کم‌نور', en: 'Low light' },
  medium: { fa: 'نور غیرمستقیم', en: 'Indirect light' },
  high: { fa: 'نور زیاد', en: 'Bright light' },
  direct: { fa: 'آفتاب مستقیم', en: 'Direct sunlight' },
}

export function lightLabel(value: string): string {
  return lightLabels[value]?.[getLanguage()] ?? value
}

const waterLabels: Record<string, Record<'fa' | 'en', string>> = {
  low: { fa: 'کم', en: 'Low' },
  medium: { fa: 'متوسط', en: 'Moderate' },
  high: { fa: 'زیاد', en: 'High' },
}

export function waterLabel(value: string): string {
  return waterLabels[value]?.[getLanguage()] ?? value
}

const healthLabels: Record<string, Record<'fa' | 'en', string>> = {
  healthy: { fa: 'سالم', en: 'Healthy' },
  needs_attention: { fa: 'نیاز به توجه', en: 'Needs attention' },
  sick: { fa: 'بیمار', en: 'Unwell' },
}

export function healthLabel(value: string): string {
  return healthLabels[value]?.[getLanguage()] ?? value
}

function getLocale(): string {
  if (import.meta.client) return document.documentElement.lang || 'fa-IR'
  return 'fa-IR'
}

function getLanguage(): 'fa' | 'en' {
  return getLocale().startsWith('en') ? 'en' : 'fa'
}
