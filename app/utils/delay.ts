/**
 * شبیه‌سازی تأخیر شبکه برای مسیرهای Mock (services/*.service.ts و storeهای بدون Backend واقعی).
 * قبلاً این تابع در چند فایل جدا تکرار شده بود؛ حالا یک نسخه‌ی مشترک و auto-import (utils/).
 * در Phase 3 که Backend واقعی جایگزین Mock می‌شه، این تابع دیگه لازم نیست.
 */
export function simulateDelay(ms = 400) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}
