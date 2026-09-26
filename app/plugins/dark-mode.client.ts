/**
 * اعمال attribute تم (data-theme) روی <html> در همون شروع بارگذاری کلاینت.
 * قبلاً این کار داخل onMounted در app.vue انجام می‌شد؛ آوردیمش این‌جا تا با الگوی
 * موجود پروژه (plugins/auth.ts برای hydrate کردن state از کوکی) یکدست باشه:
 * هر state سراسری که باید قبل از رندر اولیه‌ی صفحه آماده باشه، این‌جا bootstrap می‌شه.
 */
export default defineNuxtPlugin(() => {
  const uiStore = useUiStore()
  uiStore.applyThemeAttribute()
})