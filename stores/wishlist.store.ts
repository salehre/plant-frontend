import { defineStore } from 'pinia'

/**
 * Wishlist = «این گیاه رو دوست دارم/می‌خوام بخرم»
 * برخلاف My Garden (که در فاز ۲ منتظره)، Wishlist هیچ Care Plan/Reminder فعال نمی‌سازه؛
 * فقط یه لیست ساده از slug گیاهانیه که کاربر از Explore علامت زده.
 *
 * چون MVP بدون Auth کاره، این با localStorage روی همین دستگاه نگه داشته می‌شه
 * (معادل همون device_id که در دیتامدل توافق کردیم) - وقتی Auth واقعی اضافه شد،
 * همین لیست می‌تونه به اکانت کاربر migrate بشه.
 */
export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    slugs: useLocalStorage<string[]>('bargyar-wishlist', []),
  }),
  getters: {
    count: state => state.slugs.length,
  },
  actions: {
    isWishlisted(slug: string) {
      return this.slugs.includes(slug)
    },
    toggle(slug: string) {
      if (this.isWishlisted(slug)) {
        this.slugs = this.slugs.filter(s => s !== slug)
        useUiStore().showToast('از علاقه‌مندی‌ها حذف شد', 'info')
      }
      else {
        this.slugs = [...this.slugs, slug]
        useUiStore().showToast('به علاقه‌مندی‌ها اضافه شد')
      }
    },
    remove(slug: string) {
      this.slugs = this.slugs.filter(s => s !== slug)
    },
  },
})
