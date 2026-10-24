/**
 * همه‌ی Intl.NumberFormat و Intl.DateTimeFormat (و در نتیجه $n / $d ی vue-i18n) رو مجبور می‌کنه
 * با ارقام لاتین (0-9) خروجی بده، حتی وقتی locale فارسیه (تاریخ همچنان شمسی می‌مونه).
 * بدون پسوند .client تا سمت سرور هم اجرا بشه و hydration mismatch نداشته باشیم.
 */
export default defineNuxtPlugin(() => {
  const g = Intl as any
  if (g.__latinDigitsPatched) return
  g.__latinDigitsPatched = true

  for (const name of ['NumberFormat', 'DateTimeFormat'] as const) {
    const Original = g[name]
    g[name] = new Proxy(Original, {
      construct: (target, args) =>
        new target(args[0], { numberingSystem: 'latn', ...args[1] }),
      apply: (target, _this, args) =>
        target(args[0], { numberingSystem: 'latn', ...args[1] }),
    })
  }
})
