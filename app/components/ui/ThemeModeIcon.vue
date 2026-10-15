<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  dark: boolean
  /** مدت انیمیشن (میلی‌ثانیه) */
  duration?: number
}>(), { duration: 700 })

const progress = ref(props.dark ? 1 : 0)
let frame = 0

// جلو زدن کمی از هدف (overshoot) و برگشت، برای حس فنری
function easeOutBack(t: number) {
  const c1 = 1.1
  const c3 = c1 + 1
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
}

watch(() => props.dark, (isDark) => {
  const from = progress.value
  const to = isDark ? 1 : 0
  cancelAnimationFrame(frame)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || props.duration <= 0 || from === to) {
    progress.value = to
    return
  }
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / props.duration)
    progress.value = from + (to - from) * easeOutBack(t)
    if (t < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
})

onBeforeUnmount(() => cancelAnimationFrame(frame))

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const fmt = (value: number) => Number(value.toFixed(3))

// ---- هندسه ----
const CENTER = 12
// شعاع دایره‌ی گاز = نصف فاصله‌ی دو نوک هلال (۱۲,۳) و (۲۱,۱۲) مثل ماه lucide
const BITE_R = 6.364

/** مسیر خط دور شکل: دایره‌ی خورشید که کم‌کم به هلال ماه تبدیل می‌شه */
const bodyPath = computed(() => {
  const p = progress.value
  // دایره‌ی بدنه: شعاع ۴ (خورشید lucide) -> ۹ (ماه lucide)
  const r1 = 4 + 5 * p
  // دایره‌ی گاز: از بیرون آیکن (بالا-راست) تا مرکز (۱۶.۵ و ۷.۵)
  const bx = 27 - 10.5 * p
  const by = -3 + 10.5 * p
  const dx = bx - CENTER
  const dy = by - CENTER
  const d = Math.hypot(dx, dy)

  // دایره‌ها همدیگه رو قطع نمی‌کنن: فقط یه دایره‌ی کامل
  if (d >= r1 + BITE_R || d <= Math.abs(r1 - BITE_R)) {
    return `M${fmt(CENTER - r1)} ${CENTER}A${fmt(r1)} ${fmt(r1)} 0 1 0 ${fmt(CENTER + r1)} ${CENTER}A${fmt(r1)} ${fmt(r1)} 0 1 0 ${fmt(CENTER - r1)} ${CENTER}Z`
  }

  // نقطه‌های تقاطع دو دایره
  const a = (r1 * r1 - BITE_R * BITE_R + d * d) / (2 * d)
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a))
  const ux = dx / d
  const uy = dy / d
  const mx = CENTER + a * ux
  const my = CENTER + a * uy
  const plusX = mx - h * uy
  const plusY = my + h * ux
  const minusX = mx + h * uy
  const minusY = my - h * ux

  // کمان بیرونی دایره‌ی بدنه (جهت مثبت) + کمان درونیِ دایره‌ی گاز (جهت منفی) برای برگشت
  const largeOuter = a > 0 ? 1 : 0
  const largeInner = d - a < 0 ? 1 : 0
  return `M${fmt(plusX)} ${fmt(plusY)}A${fmt(r1)} ${fmt(r1)} 0 ${largeOuter} 1 ${fmt(minusX)} ${fmt(minusY)}A${BITE_R} ${BITE_R} 0 ${largeInner} 0 ${fmt(plusX)} ${fmt(plusY)}Z`
})

// کمی کج شدن آیکن وسط انیمیشن (اول و آخر صفره)
const tilt = computed(() => -Math.sin(Math.PI * clamp(progress.value)) * 22)

// پرتوها: می‌چرخن، از سمت بیرون کوتاه می‌شن و محو می‌شن (برگشت: با کمی جهش بلندتر از حد نهایی می‌شن)
const rayAngle = computed(() => progress.value * 90)
const rayPath = computed(() => {
  const shrink = clamp(progress.value * 1.8, -0.25, 1)
  return `M12 4V${fmt(12 - (10 - 2 * shrink))}`
})
const raysOpacity = computed(() => clamp(1 - progress.value * 1.8))
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <g :transform="`rotate(${tilt} 12 12)`">
      <!-- پرتوهای خورشید -->
      <g
        :transform="`rotate(${rayAngle} 12 12)`"
        :opacity="raysOpacity"
      >
        <path
          v-for="i in 8"
          :key="i"
          :d="rayPath"
          :transform="`rotate(${(i - 1) * 45} 12 12)`"
        />
      </g>

      <!-- دایره‌ی خورشید / هلال ماه -->
      <path :d="bodyPath" />
    </g>
  </svg>
</template>