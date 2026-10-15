<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

/**
 * آیکن شب/روز: خورشید و ماه یک SVG واحدن و موقع عوض شدن حالت به هم تبدیل می‌شن.
 *
 *  خورشید -> ماه:  پرتوها می‌چرخن و داخل قرص فرو می‌رن، قرص بزرگ می‌شه، یه دایره‌ی «گاز»
 *                 از گوشه‌ی بالا-راست میاد و هلال رو می‌سازه، بعدش چند ستاره‌ی کوچیک ظاهر می‌شن.
 *  ماه -> خورشید: همین مسیر برعکس.
 *
 * همه‌ی شکل‌ها با یه عدد `progress` (۰ = خورشید، ۱ = ماه) محاسبه می‌شن و با requestAnimationFrame
 * جلو می‌رن؛ نه CSS transition روی mask (که توی بعضی مرورگرها درست آپدیت نمی‌شه) و نه
 * `d` ی path (که همه‌جا پشتیبانی نمی‌شه). با prefers-reduced-motion بدون انیمیشن عوض می‌شه.
 *
 * رنگ از currentColor گرفته می‌شه و اندازه رو از بیرون با کلاس بده:
 *   <ThemeModeIcon :dark="isDark" class="size-5" />
 */
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

// id یکتا برای mask تا چند نمونه از آیکن توی یک صفحه با هم قاطی نشن
const maskId = `tm-mask-${Math.random().toString(36).slice(2, 9)}`

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

// قرص: شعاع ۵ (خورشید) -> ۹ (ماه)
const coreR = computed(() => 5 + 4 * progress.value)

// دایره‌ی گاز: از بیرون آیکن (بالا-راست) تا جای هلال (مرکز ۱۶.۵ و ۷.۵ با شعاع ۶.۴)
const biteX = computed(() => 27 - 10.5 * progress.value)
const biteY = computed(() => -3 + 10.5 * progress.value)

// کمی کج شدن آیکن وسط انیمیشن (اول و آخر صفره)
const tilt = computed(() => -Math.sin(Math.PI * clamp(progress.value)) * 22)

// پرتوها: می‌چرخن و به مرکز کوچیک می‌شن
const raysTransform = computed(() => {
  // سریع‌تر از رشد قرص جمع می‌شن تا زود زیرش برن و برآمدگی ریزی دورش نمونه
  const scale = clamp(1 - progress.value * 1.5, 0.001, 1.15)
  return `translate(12 12) rotate(${progress.value * 90}) scale(${scale}) translate(-12 -12)`
})
const raysOpacity = computed(() => clamp(1 - progress.value * 1.8))

// ستاره‌های ماه: هرکدوم از یه لحظه‌ی مشخص شروع به ظاهر شدن می‌کنن
const stars = [
  { x: 17.6, y: 8.6, size: 1.7, from: 0.55, dot: false },
  { x: 14.8, y: 4.6, size: 1.1, from: 0.7, dot: false },
  { x: 20, y: 5.2, size: 0.9, from: 0.8, dot: true },
]
function starTransform(star: typeof stars[number]) {
  const scale = clamp((progress.value - star.from) / (1 - star.from), 0, 1.25)
  // چرخش تا ۹۰ درجه تموم می‌شه تا علامت «+» توی حالت نهایی صاف بمونه
  return `translate(${star.x} ${star.y}) rotate(${progress.value * 90}) scale(${Math.max(scale, 0.001)})`
}
function starOpacity(star: typeof stars[number]) {
  return clamp((progress.value - star.from) / ((1 - star.from) * 0.6))
}
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
    <defs>
      <mask
        :id="maskId"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect
          width="24"
          height="24"
          fill="#fff"
          stroke="none"
        />
        <circle
          :cx="biteX"
          :cy="biteY"
          r="6.4"
          fill="#000"
          stroke="none"
        />
      </mask>
    </defs>

    <g :transform="`rotate(${tilt} 12 12)`">
      <!-- پرتوهای خورشید -->
      <g
        :transform="raysTransform"
        :opacity="raysOpacity"
      >
        <path
          v-for="i in 8"
          :key="i"
          d="M12 2v2"
          :transform="`rotate(${(i - 1) * 45} 12 12)`"
        />
      </g>

      <!-- قرص خورشید / بدنه‌ی ماه -->
      <circle
        cx="12"
        cy="12"
        :r="coreR"
        fill="currentColor"
        stroke="none"
        :mask="`url(#${maskId})`"
      />

      <!-- ستاره‌های کنار ماه -->
      <g stroke-width="1.4">
        <g
          v-for="(star, index) in stars"
          :key="index"
          :transform="starTransform(star)"
          :opacity="starOpacity(star)"
        >
          <circle
            v-if="star.dot"
            r="1"
            fill="currentColor"
            stroke="none"
          />
          <path
            v-else
            :d="`M0 ${-star.size}V${star.size}M${-star.size} 0H${star.size}`"
          />
        </g>
      </g>
    </g>
  </svg>
</template>