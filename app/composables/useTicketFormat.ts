/** قالب‌بندی تاریخ و ساعت تیکت‌ها بر اساس زبان فعال (اعداد فارسی برای fa) */
export function useTicketFormat() {
  const { locale } = useI18n()

  function formatDateTime(iso: string) {
    return new Intl.DateTimeFormat(locale.value === 'fa' ? 'fa-IR' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  }

  function formatDate(iso: string) {
    return new Intl.DateTimeFormat(locale.value === 'fa' ? 'fa-IR' : 'en-US', { dateStyle: 'medium' }).format(new Date(iso))
  }

  /** TK-1001 با اعداد فارسی در حالت fa */
  function ticketCode(slug: string) {
    return toPersianDigits(slug.toUpperCase())
  }

  return { formatDateTime, formatDate, ticketCode }
}
