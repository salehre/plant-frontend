<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    loading?: boolean
    disabled?: boolean
    block?: boolean
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    block: false,
    type: 'button',
  },
)

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-200',
  // مثل دکمه‌های Google/Apple تو رفرنس: پس‌زمینه‌ی نیمه‌شفاف + بوردر ظریف (تم‌دار و سازگار با لایت/دارک)
  secondary: 'border border-ink/15 bg-ink/5 text-ink hover:bg-ink/10 active:bg-ink/15',
  ghost: 'bg-transparent text-ink hover:bg-ink/5 active:bg-ink/10',
  danger: 'bg-status-danger text-white hover:opacity-90 active:opacity-80',
  // برای CTAهای روی زمینه‌ی شیشه‌ای (مثلاً صفحات auth) - رنگ گرم "چراغ رشد" که از پس‌زمینه‌ی سبز جدا دیده می‌شه
  accent: 'bg-accent-500 text-white shadow-[0_4px_18px_-4px_rgba(201,138,60,0.65)] hover:bg-accent-600 active:bg-accent-700 disabled:bg-accent-200',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3 gap-2',
}
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    class="inline-flex items-center justify-center rounded-[var(--radius-control)] font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60"
    :class="[variantClasses[props.variant], sizeClasses[props.size], props.block ? 'w-full' : '']"
  >
    <Icon
      v-if="props.loading"
      name="svg-spinners:180-ring"
      class="size-4"
    />
    <slot />
  </button>
</template>