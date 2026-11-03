/**
 * وقتی یک المنت (مثلاً یک سکشن پر از انیمیشن) از دید خارج می‌شه، attribute `data-offscreen` روش
 * گذاشته می‌شه و CSS مربوطه (توی main.css) همه‌ی انیمیشن‌های داخلش رو `paused` می‌کنه.
 * با برگشتن به دید، attribute برداشته می‌شه و انیمیشن‌ها از همون‌جا ادامه پیدا می‌کنن.
 *
 * یک IntersectionObserver مشترک برای همه‌ی المنت‌ها استفاده می‌شه تا هزینه‌ی observer جدا برای هر سکشن نداشته باشیم.
 */
let sharedObserver: IntersectionObserver | null = null

function getObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) el.removeAttribute('data-offscreen')
          else el.setAttribute('data-offscreen', '')
        }
      },
      // کمی زودتر از رسیدن به صفحه شروع به پخش می‌کنیم تا شروع انیمیشن جلوی چشم کاربر دیده نشه
      { rootMargin: '150px 0px' },
    )
  }
  return sharedObserver
}

export function observeOffscreen(el: Element) {
  getObserver()?.observe(el)
}

export function unobserveOffscreen(el: Element) {
  getObserver()?.unobserve(el)
  el.removeAttribute('data-offscreen')
}
