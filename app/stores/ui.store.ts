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

export const seasonByTheme: Record<ThemeKey, string> = {
  navy: 'winter',
  brown: 'autumn',
  wine: 'spring',
  forest: 'summer',
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    mobileNavOpen: false,
    theme: useLocalStorage<ThemeKey>('bargyar-theme', 'forest'),
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
    applyThemeAttribute() {
      if (import.meta.client) {
        document.documentElement.setAttribute('data-theme', this.theme)
        document.documentElement.classList.toggle('dark', this.mode === 'dark')
      }
    },
  },
})