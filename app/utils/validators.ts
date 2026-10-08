/**
 * ولیدیشن‌های مشترک فرم‌ها (auto-import از utils/).
 * همه‌ی تابع‌ها اعداد فارسی و عربی رو قبل از چک کردن به انگلیسی تبدیل می‌کنن.
 */
export function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

/** شماره موبایل ایران: ۱۱ رقم و شروع با 09 */
export function isValidIranMobile(value: string): boolean {
  return /^09\d{9}$/.test(normalizeDigits(value.trim()))
}

/** کد ملی ایران: ۱۰ رقم + چک‌سام استاندارد (کدهای تکراری مثل 1111111111 نامعتبرن) */
export function isValidNationalId(value: string): boolean {
  const code = normalizeDigits(value.trim())
  if (!/^\d{10}$/.test(code)) return false
  if (/^(\d)\1{9}$/.test(code)) return false

  const digits = code.split('').map(Number)
  const sum = digits.slice(0, 9).reduce((acc, d, i) => acc + d * (10 - i), 0)
  const remainder = sum % 11
  const check = digits[9]!
  return remainder < 2 ? check === remainder : check === 11 - remainder
}