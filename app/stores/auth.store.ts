import { defineStore } from 'pinia'
import type { User } from '~/types/user.types'

type OtpPurpose = 'register' | 'reset'
interface OtpEntry { code: string, expiresAt: number }
interface PendingRegistration { name: string, email: string, verified: boolean }

const OTP_TTL_MS = 10 * 60 * 1000

/**
 * فلوی auth کاملاً بر پایه‌ی OTP (کد ۶ رقمی) - بدون لینک ایمیل، بدون رمز عبور در
 * لحظه‌ی ثبت‌نام. دقیقاً هم‌شکل با پروژه‌ی رفرنس (Todolist)، با این تفاوت‌ها که
 * خودمون خواستیم: لاگین فقط با ایمیل (نه username)، و بعد از set-password مستقیم
 * می‌ره داشبورد (نه برگشت به صفحه‌ی login).
 *
 *   ثبت‌نام  → register(name, email)     → OTP می‌فرسته، pendingRegistration رو نگه می‌داره
 *            → verifyRegisterOtp(email, code) → کد رو verified می‌کنه (هنوز لاگین نشده)
 *            → setPassword(password)     → فقط اگه verified باشه، حساب واقعاً ساخته و لاگین می‌شه
 *
 *   فراموشی → forgotPassword(email)      → OTP می‌فرسته
 *            → resetPassword(email, code, newPassword) → کد و رمز جدید با هم توی یک
 *              درخواست چک می‌شن (نه دو مرحله‌ی جدا) - اگه کد غلط بود، صفحه برمی‌گردونه
 *              مرحله‌ی وارد کردن کد، بدون این‌که این‌جا خطا throw بشه.
 *
 * Phase 3: این Store به Laravel Sanctum وصل می‌شه. تولید/وریفای OTP واقعاً سمت سرور
 * انجام می‌شه (کد هیچ‌وقت به کلاینت برنمی‌گرده - برخلاف mock فعلی که چون ایمیل واقعی
 * ارسال نمی‌شه، کد رو برای تست توی toast/console نشون می‌ده).
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage<User | null>('bargyar-auth-user', null),
    pendingRegistration: useLocalStorage<PendingRegistration | null>('bargyar-pending-registration', null),
    otps: useLocalStorage<Record<string, OtpEntry>>('bargyar-otp-codes', {}),
    loading: false,
    error: '',
  }),
  getters: {
    isLoggedIn: state => !!state.user,
  },
  actions: {
    async login(email: string, _password: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!email.includes('@')) {
          this.error = 'ایمیل یا رمز عبور اشتباه است.'
          return false
        }
        this.user = {
          id: 'u_current',
          name: email.split('@')[0] ?? 'کاربر',
          email,
          joinedAt: new Date().toISOString().slice(0, 10),
        }
        return true
      }
      finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
    },

    /**
     * تولید و «ارسال» یک کد ۶ رقمی. چون بک‌اند/ایمیل واقعی وصل نیست، این‌جا فقط توی
     * localStorage (با ttl) ذخیره‌ش می‌کنیم و برای این‌که فلو قابل تست باشه، خودِ کد رو
     * برمی‌گردونیم تا صفحه‌ی صداکننده با toast دِوِلوپری نشونش بده - Phase 3 این نشون‌دادن
     * حذف می‌شه چون کد فقط سمت سرور و توی ایمیل واقعی می‌مونه.
     */
    async sendOtp(email: string, purpose: OtpPurpose) {
      await simulateDelay(400)
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      this.otps[`${purpose}:${email}`] = { code, expiresAt: Date.now() + OTP_TTL_MS }
      return code
    },

    verifyOtpCode(email: string, purpose: OtpPurpose, code: string) {
      const key = `${purpose}:${email}`
      const entry = this.otps[key]
      if (!entry || entry.expiresAt < Date.now() || entry.code !== code) {
        return false
      }
      delete this.otps[key]
      return true
    },

    /** ثبت‌نام قدم ۱: اسم/ایمیل رو موقتاً نگه می‌داره (هنوز verified نیست) و OTP می‌فرسته. */
    async register(name: string, email: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        this.pendingRegistration = { name, email, verified: false }
        const code = await this.sendOtp(email, 'register')
        return code
      }
      finally {
        this.loading = false
      }
    },

    /** ثبت‌نام قدم ۲: با کد درست، ایمیل verified می‌شه (ولی حساب هنوز ساخته نشده). */
    async verifyRegisterOtp(email: string, code: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!this.verifyOtpCode(email, 'register', code)) {
          this.error = 'کد وارد شده اشتباه یا منقضی‌شده است.'
          return false
        }
        if (this.pendingRegistration && this.pendingRegistration.email === email) {
          this.pendingRegistration.verified = true
        }
        return true
      }
      finally {
        this.loading = false
      }
    },

    /** ثبت‌نام قدم ۳: فقط اگه pendingRegistration واقعاً verified باشه، حساب ساخته و لاگین می‌شه. */
    async setPassword(_password: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!this.pendingRegistration?.verified) {
          this.error = 'ابتدا باید ایمیلت را تایید کنی.'
          return false
        }
        this.user = {
          id: 'u_current',
          name: this.pendingRegistration.name,
          email: this.pendingRegistration.email,
          joinedAt: new Date().toISOString().slice(0, 10),
        }
        this.pendingRegistration = null
        return true
      }
      finally {
        this.loading = false
      }
    },

    /** بازیابی رمز قدم ۱: OTP برای ایمیل می‌فرسته. */
    async forgotPassword(email: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!email.includes('@')) {
          this.error = 'ایمیل معتبر نیست.'
          return null
        }
        const code = await this.sendOtp(email, 'reset')
        return code
      }
      finally {
        this.loading = false
      }
    },

    /**
     * بازیابی رمز قدم ۲: کد و رمز جدید با هم توی یک درخواست چک می‌شن (نه در دو مرحله‌ی
     * جدا) - اگه کد غلط/منقضی بود false برمی‌گرده تا صفحه کاربر رو به قدم «وارد کردن
     * کد» برگردونه.
     */
    async resetPassword(email: string, code: string, _newPassword: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!this.verifyOtpCode(email, 'reset', code)) {
          this.error = 'کد وارد شده اشتباه یا منقضی‌شده است.'
          return false
        }
        return true
      }
      finally {
        this.loading = false
      }
    },
  },
})