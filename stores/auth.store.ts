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
  },
})
