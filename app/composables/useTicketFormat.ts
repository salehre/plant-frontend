/**
 * قالب‌بندی تاریخ و ساعت تیکت‌ها، همیشه عددی: روز/ماه/سال ساعت:دقیقه (مثلاً ۱۹/۷/۱۴۰۵ ۱۹:۱۷).
 * زبان fa: تقویم شمسی با اعداد فارسی. زبان en: تقویم میلادی با اعداد انگلیسی.
 * اگه اعداد انگلیسی (19/7/1405) رو حتی توی فارسی می‌خوای، locale پایین رو به 'fa-IR-u-nu-latn' تغییر بده.
 */
export function useTicketFormat() {
  const { locale } = useI18n()

  function parts(iso: string, withTime: boolean) {
    const loc = locale.value === 'fa' ? 'fa-IR' : 'en-US'
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' }
    if (withTime) Object.assign(options, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    const map: Record<string, string> = {}
    for (const p of new Intl.DateTimeFormat(loc, options).formatToParts(new Date(iso))) {
      map[p.type] = p.value
    }
    return map
  }

  /** 19/7/1405 19:17 */
  function formatDateTime(iso: string) {
    const p = parts(iso, true)
    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`
  }

  /** 19/7/1405 */
  function formatDate(iso: string) {
    const p = parts(iso, false)
    return `${p.day}/${p.month}/${p.year}`
  }

  /** TK-1001 با اعداد فارسی در حالت fa */
  function ticketCode(slug: string) {
    return toPersianDigits(slug.toUpperCase())
  }

  /** 1.2 مگابایت / 1.2 MB */
  function formatFileSize(bytes: number) {
    const fa = locale.value === 'fa'
    const units = fa ? ['بایت', 'کیلوبایت', 'مگابایت'] : ['B', 'KB', 'MB']
    let i = 0
    let n = bytes
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024
      i++
    }
    const text = i === 0 ? String(Math.round(n)) : (Math.round(n * 10) / 10).toString()
    return `${fa ? toPersianDigits(text) : text} ${units[i]}`
  }

  /** 1:05 */
  function formatDuration(seconds: number) {
    const s = Math.max(0, Math.round(seconds))
    const text = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
    return locale.value === 'fa' ? toPersianDigits(text) : text
  }

  return { formatDateTime, formatDate, ticketCode, formatFileSize, formatDuration }
}
