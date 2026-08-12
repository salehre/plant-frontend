/**
 * تبدیل عدد به اعداد فارسی (۰-۹)
 */
export function toPersianDigits(value: number | string): string {
  const fa = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return String(value).replace(/\d/g, d => fa[Number(d)] ?? d)
}

/**
 * فرمت تاریخ میلادی (YYYY-MM-DD) به تاریخ شمسی خوانا
 */
export function toJalaliDate(isoDate: string): string {
  const date = new Date(isoDate)
  const formatter = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return formatter.format(date)
}

export function formatConfidence(value: number): string {
  return toPersianDigits(Math.round(value * 100)) + '٪'
}

const taskLabels: Record<string, string> = {
  water: 'آبیاری',
  fertilize: 'کوددهی',
  prune: 'هرس',
  repot: 'تعویض گلدان',
  mist: 'مه‌پاشی',
}

export function taskLabel(type: string): string {
  return taskLabels[type] ?? type
}

const difficultyLabels: Record<string, string> = {
  easy: 'آسان',
  medium: 'متوسط',
  hard: 'سخت',
}

export function difficultyLabel(value: string): string {
  return difficultyLabels[value] ?? value
}

const lightLabels: Record<string, string> = {
  low: 'کم‌نور',
  medium: 'نور غیرمستقیم',
  high: 'نور زیاد',
  direct: 'آفتاب مستقیم',
}

export function lightLabel(value: string): string {
  return lightLabels[value] ?? value
}

const waterLabels: Record<string, string> = {
  low: 'کم',
  medium: 'متوسط',
  high: 'زیاد',
}

export function waterLabel(value: string): string {
  return waterLabels[value] ?? value
}

const healthLabels: Record<string, string> = {
  healthy: 'سالم',
  needs_attention: 'نیاز به توجه',
  sick: 'بیمار',
}

export function healthLabel(value: string): string {
  return healthLabels[value] ?? value
}
