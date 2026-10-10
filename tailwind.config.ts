import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        // primary/accent هم مثل surface/bg/ink با CSS variable تعریف شدن، ولی نه برای
        // حالت dark، بلکه برای سیستم «۴ تم» (wine/forest/brown/navy) - مقدارشون بر اساس
        // attribute «data-theme» روی <html> توی main.css عوض می‌شه (نگاه کن به stores/ui.store.ts).
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900) / <alpha-value>)',
        },
        accent: {
          50: 'rgb(var(--color-accent-50) / <alpha-value>)',
          100: 'rgb(var(--color-accent-100) / <alpha-value>)',
          200: 'rgb(var(--color-accent-200) / <alpha-value>)',
          300: 'rgb(var(--color-accent-300) / <alpha-value>)',
          400: 'rgb(var(--color-accent-400) / <alpha-value>)',
          500: 'rgb(var(--color-accent-500) / <alpha-value>)',
          600: 'rgb(var(--color-accent-600) / <alpha-value>)',
          700: 'rgb(var(--color-accent-700) / <alpha-value>)',
          800: 'rgb(var(--color-accent-800) / <alpha-value>)',
          900: 'rgb(var(--color-accent-900) / <alpha-value>)',
        },
        // این سه رنگ با CSS variable تعریف شدن (نه هگز ثابت) تا زیر کلاس `.dark`
        // مقدارشون توی main.css عوض بشه و کل اپ بدون بازنویسی هر کامپوننت، تیره بشه.
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
        },
        status: {
          success: '#4a7c3c',
          warning: '#d4a017',
          danger: '#c0392b',
          info: '#3178c6',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      // همه‌ی rounded ها (به‌جز rounded-full) هم‌شعاع فیلدها و دکمه‌های auth؛
      // مقدار واقعی در main.css با --radius-control تعریف شده.
      borderRadius: {
        sm: 'var(--radius-control)',
        DEFAULT: 'var(--radius-control)',
        md: 'var(--radius-control)',
        lg: 'var(--radius-control)',
        xl: 'var(--radius-control)',
        '2xl': 'var(--radius-control)',
        '3xl': 'var(--radius-control)',
      },
      boxShadow: {
        'card': '0 2px 12px -2px rgba(31, 36, 24, 0.08)',
        'card-hover': '0 8px 24px -4px rgba(31, 36, 24, 0.14)',
      },
    },
  },
  plugins: [],
}