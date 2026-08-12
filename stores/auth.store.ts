import { defineStore } from 'pinia'
import type { User } from '~/types/user.types'

/**
 * تا وصل‌شدن Backend واقعی (Laravel Sanctum)، همه‌ی state این پروژه از localStorage
 * استفاده می‌کنه (مثل wishlist/history/ui) - برای همین user هم به‌جای کوکی مستقیماً
 * useLocalStorage شده، نه یک state ساده + تابع persist/hydrate جدا.
 *
 * توجه: چون localStorage فقط سمت کلاینت وجود داره، در SSR همیشه user اولیه null
 * رندر می‌شه و بعد از mount مقدار واقعی جایگزین می‌شه (یک فلاش کوتاه لاگین/خروج
 * روی صفحاتی که isLoggedIn رو نشون می‌دن). با کوکی این فلاش نبود، ولی چون فعلاً
 * middleware auth هم غیرفعاله و همه‌چیز موقتیه، این trade-off قابل قبوله.
 *
 * در Phase 3 این Store به Laravel Sanctum وصل می‌شود: login/register واقعاً به
 * /api/login و /api/register درخواست می‌زنند و توکن واقعی (احتمالاً از طریق کوکی
 * httpOnly سمت سرور، نه localStorage) جایگزین این حالت می‌شود.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage<User | null>('bargyar-auth-user', null),
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

    async register(name: string, email: string, _password: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        this.user = {
          id: 'u_current',
          name,
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
     * فاز بازیابی رمز - قدم ۱: کاربر ایمیلش رو می‌ده.
     * Phase 3: اینجا واقعاً به /api/forgot-password درخواست زده می‌شه و بک‌اند یک ایمیل
     * حاوی لینک بازیابی (با توکن یک‌بارمصرف) می‌فرسته. فعلاً چون بک‌اند واقعی وصل نیست،
     * فرض می‌کنیم ایمیل ارسال شده و کاربر مستقیم (با ایمیلش در query) به صفحه‌ی
     * reset-password هدایت می‌شه تا فلوی UI کامل تست‌پذیر باشه.
     */
    async forgotPassword(email: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!email.includes('@')) {
          this.error = 'ایمیل معتبر نیست.'
          return false
        }
        return true
      }
      finally {
        this.loading = false
      }
    },

    /**
     * فاز بازیابی رمز - قدم ۲: کاربر رمز جدیدش رو انتخاب می‌کنه.
     * Phase 3: به‌جای email، توکن بازیابی (از لینک ایمیل) به بک‌اند فرستاده می‌شه.
     */
    async resetPassword(email: string, _newPassword: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!email) {
          this.error = 'درخواست بازیابی نامعتبر است، دوباره تلاش کن.'
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
