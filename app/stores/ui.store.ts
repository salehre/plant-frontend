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
export type ThemeMode = 'light' | 'dark'

export const useUiStore = defineStore('ui', {
  state: () => ({
    mobileNavOpen: false,
    // تم رنگی انتخابی روی همین دستگاه ذخیره می‌شه (localStorage)؛ پیش‌فرض forest
    // (نزدیک‌ترین تم به هویت اصلی سبز اپ) تا با اولین بار بازکردن اپ هماهنگ باشه.
    theme: useLocalStorage<ThemeKey>('bargyar-theme', 'forest'),
    // حالت روشن/تاریک، مستقل از تم رنگی؛ پیش‌فرض dark چون هویت اصلی اپ تاریکه.
    mode: useLocalStorage<ThemeMode>('bargyar-mode', 'dark'),
  }),
  actions: {
    showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
      toast[type === 'info' ? 'message' : type](message)
    },
    setTheme(theme: ThemeKey) {
      this.theme = theme
      this.applyThemeAttribute()
    },
    setMode(mode: ThemeMode) {
      this.mode = mode
      this.applyThemeAttribute()
    },
    toggleMode() {
      this.setMode(this.mode === 'dark' ? 'light' : 'dark')
    },
    /** روی <html> attribute «data-theme» و کلاس «dark» رو اعمال می‌کنه؛ در بوت اپ و بعد از setTheme/setMode صدا زده می‌شه */
    applyThemeAttribute() {
      if (import.meta.client) {
        document.documentElement.setAttribute('data-theme', this.theme)
        document.documentElement.classList.toggle('dark', this.mode === 'dark')
      }
    },
  },
})