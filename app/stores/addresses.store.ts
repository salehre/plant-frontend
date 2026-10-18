import { defineStore } from 'pinia'

/**
 * آدرس‌های ذخیره‌شده‌ی کاربر (شهر + عنوان اختیاری مثل «خانه» یا «محل کار»).
 * کاربر توی تنظیمات چندتا آدرس اضافه می‌کنه و توی صفحه‌ی «گیاه مناسب شهر تو»
 * یکی از اون‌ها رو انتخاب می‌کنه تا پیشنهادها بر اساس همون شهر نمایش داده بشه.
 *
 * مثل Wishlist، فعلاً روی همین دستگاه (localStorage) نگه داشته می‌شه.
 */
export interface SavedAddress {
  id: string
  cityId: string
  label: string
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

export const useAddressStore = defineStore('addresses', {
  state: () => ({
    items: useLocalStorage<SavedAddress[]>('bargyar-addresses', []),
    activeId: useLocalStorage<string>('bargyar-active-address', ''),
  }),
  getters: {
    count: state => state.items.length,
    // آدرس انتخاب‌شده؛ اگه حذف شده بود یا هنوز انتخابی نبود، اولین آدرس
    active: (state): SavedAddress | undefined =>
      state.items.find(a => a.id === state.activeId) ?? state.items[0],
  },
  actions: {
    /** false یعنی همین شهر با همین عنوان قبلاً اضافه شده */
    add(cityId: string, label: string) {
      const clean = label.trim()
      const exists = this.items.some(
        a => a.cityId === cityId && a.label.toLowerCase() === clean.toLowerCase(),
      )
      if (exists) return false
      const address: SavedAddress = { id: makeId(), cityId, label: clean }
      this.items = [...this.items, address]
      if (this.items.length === 1) this.activeId = address.id
      return true
    },
    remove(id: string) {
      this.items = this.items.filter(a => a.id !== id)
      if (this.activeId === id) this.activeId = this.items[0]?.id ?? ''
    },
    setActive(id: string) {
      if (this.items.some(a => a.id === id)) this.activeId = id
    },
  },
})