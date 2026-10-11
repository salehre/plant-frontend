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

  return { formatDateTime, formatDate, ticketCode }
}
