import type { Config } from 'tailwindcss'

// همه‌ی rounded های پروژه (به‌جز rounded-full برای دایره‌ها) از --radius-control
// (تعریف‌شده در main.css) استفاده می‌کنن؛ همون شعاع فیلدها و دکمه‌های auth.
const control = 'var(--radius-control)'

export default {
  theme: {
    extend: {
      borderRadius: {
        none: '0px',
        sm: control,
        DEFAULT: control,
        md: control,
        lg: control,
        xl: control,
        '2xl': control,
        '3xl': control,
        control,
      },
    },
  },
} satisfies Partial<Config>
