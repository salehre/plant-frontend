import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'


// ۴ تم برند اپ - هرکدوم فقط رنگ‌های primary/accent رو عوض می‌کنن (نگاه کن به
// main.css، بلاک‌های [data-theme]) و مستقل از دارک‌مود هستن. label برای UI
// انتخاب تم (پروفایل) و swatch برای پیش‌نمایش رنگی دایره‌ی هر گزینه استفاده می‌شه.
export const themes = [
  { key: 'wine', label: 'زرشکی', swatch: '#5A1E2A' },
  { key: 'forest', label: 'سبز جنگلی', swatch: '#0F3D2E' },
  { key: 'brown', label: 'قهوه‌ای', swatch: '#5A2E0A' },
  { key: 'navy', label: 'سرمه‌ای', swatch: '#071739' },
] as const

export type ThemeKey = typeof themes[number]['key']

export const useUiStore = defineStore('ui', {
  state: () => ({
    mobileNavOpen: false,
    // ترجیح دارک‌مود روی همین دستگاه ذخیره می‌شه (localStorage)، نه سرور - چون MVP بدون Auth کار می‌کنه
    darkMode: useLocalStorage<boolean>('bargyar-dark-mode', false),
    // تم رنگی انتخابی هم مثل دارک‌مود روی همین دستگاه ذخیره می‌شه؛ پیش‌فرض forest
    // (نزدیک‌ترین تم به هویت اصلی سبز اپ) تا با اولین بار بازکردن اپ هماهنگ باشه.
    theme: useLocalStorage<ThemeKey>('bargyar-theme', 'forest'),
  }),
  actions: {
    showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
      toast[type === 'info' ? 'message' : type](message)
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      this.applyDarkModeClass()
    },
    /** روی <html> کلاس dark رو اعمال می‌کنه؛ در app.vue و بعد از toggle صدا زده می‌شه */
    applyDarkModeClass() {
      if (import.meta.client) {
        document.documentElement.classList.toggle('dark', this.darkMode)
      }
    },
    setTheme(theme: ThemeKey) {
      this.theme = theme
      this.applyThemeAttribute()
    },
    /** روی <html> attribute «data-theme» رو اعمال می‌کنه؛ در بوت اپ و بعد از setTheme صدا زده می‌شه */
    applyThemeAttribute() {
      if (import.meta.client) {
        document.documentElement.setAttribute('data-theme', this.theme)
      }
    },
  },
})
