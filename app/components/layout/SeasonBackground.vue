<script setup lang="ts">
import { seasonByTheme } from '~/stores/ui.store'

/**
 * پس‌زمینه‌ی متحرک هر تم (فصل) - ظریف و کم‌مزاحمت:
 *  navy (زمستون)    -> دانه‌های برف + ستاره‌های چشمک‌زن + هر از گاهی یه شهاب که از کنار صفحه رد می‌شه
 *  brown (پاییز)    -> برگ‌هایی که آروم می‌چرخن و سقوط می‌کنن + دو پرنده‌ی مهاجر که آروم به سمت پایین می‌رن
 *  wine (بهار)      -> شکوفه‌هایی که خیلی آروم دریفت می‌شن + دو زنبور عسل با پرواز زیگزاگی
 *  forest (تابستون) -> دو پروانه با مسیر منحنی و نامنظم + چندتا ذره‌ی نور
 * قواعد:
 *  - فقط حاشیه‌های چپ و راست صفحه؛ وسط صفحه (جایی که محتوا هست) خالی می‌مونه
 *  - رنگ همه از primary همون تم می‌گیره (بدون رنگ ثابت)
 *  - کوچیک، کم‌رنگ و کم‌تعداد؛ توی موبایل هم کمتر
 *  - با prefers-reduced-motion کلاً خاموش می‌شه
 * فقط SVG + CSS animation، بدون هیچ کتابخونه و JS در حال اجرا.
 * variant="fixed": پشت کل صفحه (لایه‌ی layout)؛ variant="absolute": داخل یه کانتینر relative
 * (مثلاً روی عکس hero یا layout لاگین) - بالای عکس و پایین محتوایی که z-10 داره.
 */
const props = withDefaults(defineProps<{ variant?: 'fixed' | 'absolute' }>(), { variant: 'fixed' })

type Season = 'winter' | 'autumn' | 'spring' | 'summer'
type Kind = 'flake' | 'dot' | 'leaf' | 'maple' | 'blossom' | 'petal' | 'firefly'

interface Particle {
  id: number
  kind: Kind
  x: number
  size: number
  color: string
  opacity: number
  fall: number
  delay: number
  sway: number
  swayDur: number
  swayDelay: number
  spin: number
  spinReverse: boolean
  drift: number
  extra: boolean
}

type FlyerKind = 'butterfly' | 'bee' | 'bird'

/** موجود زنده‌ی هر فصل: پروانه (تابستون)، زنبور (بهار)، پرنده‌ی مهاجر (پاییز) */
interface Flyer {
  id: number
  kind: FlyerKind
  x: number
  size: number
  color: string
  opacity: number
  dur: number
  delay: number
  up: boolean
  swayA: number
  swayADur: number
  swayB: number
  swayBDur: number
  wobbleDur: number
  flap: number
  extra: boolean
}

interface FlyerConfig {
  kind: FlyerKind
  size: [number, number]
  /** مدت یه بار عبور از بالا تا پایین صفحه (ثانیه) */
  dur: [number, number]
  swayA: [number, number]
  swayADur: [number, number]
  swayB: [number, number]
  swayBDur: [number, number]
  wobbleDur: [number, number]
  /** پروانه/زنبور: دوره‌ی بال‌زدن؛ پرنده: دوره‌ی یه چرخه‌ی «چندتا بال‌زدن + سر خوردن» */
  flap: [number, number]
  opacity: [number, number]
  /** جهت هر موجود: true = به بالا، false = به پایین */
  up: boolean[]
}

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  color: string
  opacity: number
  dur: number
  delay: number
  extra: boolean
}

interface Comet {
  id: number
  x: number
  dur: number
  delay: number
  drift: number
  tilt: number
  peak: number
  extra: boolean
}

interface SeasonConfig {
  count: number
  /** از این ایندکس به بعد، توی موبایل مخفی می‌شن */
  mobileCount: number
  kinds: { kind: Kind, weight: number, size: [number, number], fall?: [number, number], opacity?: [number, number] }[]
  fall: [number, number]
  /** جابه‌جایی چپ و راست (vw) - کم نگه داشته شده تا ذرات وارد وسط صفحه نشن */
  sway: [number, number]
  swayDur: [number, number]
  spin: [number, number]
  /** حداکثر کج شدن مسیر (vw) */
  drift: number
  opacity: [number, number]
}

const configs: Record<Season, SeasonConfig> = {
  winter: {
    count: 12,
    mobileCount: 7,
    kinds: [
      { kind: 'flake', weight: 60, size: [7, 13] },
      { kind: 'dot', weight: 40, size: [2, 5], fall: [26, 40], opacity: [0.2, 0.4] },
    ],
    fall: [20, 34],
    sway: [0.5, 1.8],
    swayDur: [4, 8],
    spin: [14, 28],
    drift: 1.5,
    opacity: [0.3, 0.6],
  },
  autumn: {
    count: 8,
    mobileCount: 5,
    kinds: [
      { kind: 'leaf', weight: 55, size: [12, 20] },
      { kind: 'maple', weight: 45, size: [11, 19] },
    ],
    fall: [22, 38],
    sway: [1, 2.8],
    swayDur: [4, 7],
    spin: [10, 22],
    drift: 2.5,
    opacity: [0.35, 0.65],
  },
  spring: {
    count: 9,
    mobileCount: 5,
    kinds: [
      { kind: 'blossom', weight: 55, size: [10, 17] },
      { kind: 'petal', weight: 45, size: [6, 11] },
    ],
    fall: [28, 46],
    sway: [1, 3],
    swayDur: [6, 11],
    spin: [20, 42],
    drift: 2,
    opacity: [0.35, 0.65],
  },
  summer: {
    count: 9,
    mobileCount: 5,
    kinds: [{ kind: 'firefly', weight: 100, size: [6, 11] }],
    fall: [26, 48],
    sway: [0.6, 2],
    swayDur: [5, 10],
    spin: [3, 6],
    drift: 1.5,
    opacity: [0.35, 0.8],
  },
}

// تابستون = پروانه (مقدارها همون قبلی‌ان)، بهار = زنبور (کوچیک‌تر، سریع‌تر و زیگزاگی‌تر)،
// پاییز = پرنده‌ی مهاجر از نمای بالا (بزرگ‌تر، آروم و صاف؛ چندتا بال می‌زنه و بعد سر می‌خوره)
const flyerConfigs: Partial<Record<Season, FlyerConfig>> = {
  summer: {
    kind: 'butterfly',
    size: [16, 24],
    dur: [46, 66],
    swayA: [1.2, 2.5],
    swayADur: [5, 9],
    swayB: [0.4, 0.9],
    swayBDur: [1.8, 3.2],
    wobbleDur: [2.8, 4.4],
    flap: [0.35, 0.55],
    opacity: [0.55, 0.7],
    up: [true, false],
  },
  spring: {
    kind: 'bee',
    size: [15, 21],
    dur: [38, 54],
    swayA: [1, 2],
    swayADur: [4, 7],
    swayB: [0.5, 1.1],
    swayBDur: [1, 1.8],
    wobbleDur: [1.2, 2],
    flap: [0.12, 0.18],
    opacity: [0.6, 0.78],
    up: [true, false],
  },
  autumn: {
    kind: 'bird',
    size: [20, 28],
    dur: [52, 72],
    swayA: [1.5, 2.6],
    swayADur: [8, 12],
    swayB: [0.2, 0.4],
    swayBDur: [3, 5],
    wobbleDur: [5, 8],
    flap: [3.6, 4.6],
    opacity: [0.5, 0.65],
    up: [false, false],
  },
}

// همه‌ی ذرات فقط از رنگ primary همون تم استفاده می‌کنن (دو درجه برای کمی عمق)
const colors = [
  'text-primary-300 dark:text-primary-200',
  'text-primary-400 dark:text-primary-300',
]

// random قابل‌تکرار: چیدمان ذرات بین رندرها و تعویض تم‌ها ثابت می‌مونه
function createRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const uiStore = useUiStore()
const season = computed<Season>(() => (seasonByTheme[uiStore.theme] ?? 'summer') as Season)

const particles = computed<Particle[]>(() => {
  const cfg = configs[season.value]
  const rnd = createRng(season.value.length * 7919 + 13)
  const range = ([a, b]: [number, number]) => a + rnd() * (b - a)
  const totalWeight = cfg.kinds.reduce((sum, k) => sum + k.weight, 0)

  return Array.from({ length: cfg.count }, (_, i) => {
    let pick = rnd() * totalWeight
    const kindCfg = cfg.kinds.find(k => (pick -= k.weight) < 0) ?? cfg.kinds[0]!
    const fall = range(kindCfg.fall ?? cfg.fall)
    // فقط دو حاشیه: ۱ تا ۱۴٪ از چپ یا ۸۶ تا ۹۶٪؛ وسط صفحه هیچ‌وقت نه
    const x = i % 2 === 0 ? 1 + rnd() * 13 : 86 + rnd() * 10
    return {
      id: i,
      kind: kindCfg.kind,
      x,
      size: range(kindCfg.size),
      color: colors[Math.floor(rnd() * colors.length)]!,
      opacity: range(kindCfg.opacity ?? cfg.opacity),
      fall,
      delay: rnd() * fall,
      sway: range(cfg.sway),
      swayDur: range(cfg.swayDur),
      swayDelay: rnd() * 8,
      spin: range(cfg.spin),
      spinReverse: rnd() > 0.5,
      drift: (rnd() * 2 - 1) * cfg.drift,
      extra: i >= cfg.mobileCount,
    }
  })
})

// فقط دو موجود زنده (پروانه/زنبور/پرنده بسته به فصل)، هرکدوم کنار یکی از لبه‌ها: عمودی و آروم حرکت
// می‌کنن و دو لایه‌ی چپ-راست با دوره‌ی متفاوت، مسیرشون رو منحنی و نامنظم می‌کنه
const flyers = computed<Flyer[]>(() => {
  const cfg = flyerConfigs[season.value]
  if (!cfg) return []
  const rnd = createRng(season.value === 'summer' ? 424242 : 424242 + season.value.length * 101)
  const range = ([a, b]: [number, number]) => a + rnd() * (b - a)
  return cfg.up.map((up, i) => {
    const dur = range(cfg.dur)
    return {
      id: i,
      kind: cfg.kind,
      x: i === 0 ? 3 + rnd() * 8 : 89 + rnd() * 6,
      size: range(cfg.size),
      color: colors[i % colors.length]!,
      opacity: range(cfg.opacity),
      dur,
      delay: rnd() * dur,
      up,
      swayA: range(cfg.swayA),
      swayADur: range(cfg.swayADur),
      swayB: range(cfg.swayB),
      swayBDur: range(cfg.swayBDur),
      wobbleDur: range(cfg.wobbleDur),
      flap: range(cfg.flap),
      extra: i >= 1,
    }
  })
})

// زمستون: ستاره‌های چشمک‌زن ثابت کنار لبه‌ها (شب‌های بلند زمستون)
const sparkles = computed<Sparkle[]>(() => {
  if (season.value !== 'winter') return []
  const rnd = createRng(777)
  return Array.from({ length: 7 }, (_, i) => ({
    id: i,
    x: i % 2 === 0 ? 2 + rnd() * 11 : 87 + rnd() * 9,
    y: 6 + rnd() * 86,
    size: 8 + rnd() * 7,
    color: colors[Math.floor(rnd() * colors.length)]!,
    opacity: 0.45 + rnd() * 0.3,
    dur: 2.6 + rnd() * 2.8,
    delay: rnd() * 6,
    extra: i >= 4,
  }))
})

// زمستون: دو شهاب که هر ~۳۰ ثانیه یه بار، چند ثانیه از کنار صفحه رد می‌شن (نزدیک لبه‌ها می‌مونن)
const comets = computed<Comet[]>(() => {
  if (season.value !== 'winter') return []
  const rnd = createRng(31337)
  return Array.from({ length: 2 }, (_, i) => {
    const dir = i === 0 ? 1 : -1
    const dur = 24 + rnd() * 12
    return {
      id: i,
      x: i === 0 ? 2 + rnd() * 5 : 91 + rnd() * 5,
      dur,
      delay: rnd() * dur,
      drift: dir * 5,
      tilt: -dir * 6,
      peak: 0.55 + rnd() * 0.2,
      extra: i >= 1,
    }
  })
})

const rootClass = computed(() => props.variant === 'fixed' ? 'fixed inset-0 -z-10' : 'absolute inset-0')
const spins = (kind: Kind) => kind !== 'dot' && kind !== 'firefly'
</script>

<template>
  <div
    aria-hidden="true"
    class="season-bg pointer-events-none select-none overflow-hidden"
    :class="rootClass"
  >
    <!-- key=فصل: با عوض شدن تم، لایه‌ی جدید با fade میاد -->
    <div
      :key="season"
      class="sb-layer"
    >
      <span
        v-for="p in particles"
        :key="`${season}-${p.id}`"
        class="sb-fall"
        :class="{ 'sb-up': p.kind === 'firefly', 'sb-extra': p.extra }"
        :style="{
          left: `${p.x}%`,
          opacity: p.opacity,
          '--dur': `${p.fall}s`,
          '--delay': `${p.delay}s`,
          '--drift': `${p.drift}vw`,
        }"
      >
        <span
          class="sb-sway"
          :style="{
            '--sway': `${p.sway}vw`,
            '--sway-dur': `${p.swayDur}s`,
            '--sway-delay': `${p.swayDelay}s`,
          }"
        >
          <svg
            :width="p.size"
            :height="p.size"
            viewBox="0 0 24 24"
            :class="[p.color, spins(p.kind) ? 'sb-spin' : 'sb-twinkle']"
            :style="{
              '--spin': `${p.spin}s`,
              '--dir': p.spinReverse ? 'reverse' : 'normal',
            }"
          >
            <!-- زمستان: دانه‌ی برف شش‌پر -->
            <g
              v-if="p.kind === 'flake'"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <g
                v-for="a in [0, 60, 120]"
                :key="a"
                :transform="`rotate(${a} 12 12)`"
              >
                <path d="M12 2.5v19M9.6 5 12 7.4 14.4 5M9.6 19 12 16.6 14.4 19" />
              </g>
            </g>
            <!-- زمستان: دونه‌ی گرد و محو -->
            <circle
              v-else-if="p.kind === 'dot'"
              cx="12"
              cy="12"
              r="6"
              fill="currentColor"
            />

            <!-- پاییز: برگ بیضی با رگبرگ -->
            <g v-else-if="p.kind === 'leaf'">
              <path
                d="M12 2C6.5 6 4.5 11.5 6.5 17c1.2 3.2 3.4 4.8 5.5 5 2.1-.2 4.3-1.8 5.5-5 2-5.5 0-11-5.5-15z"
                fill="currentColor"
              />
              <path
                d="M12 4.5V23M12 9.5 9 7.5M12 13.5 8.7 11.2M12 9.5l3-2M12 13.5l3.3-2.3"
                fill="none"
                stroke="rgb(0 0 0 / .28)"
                stroke-width=".9"
                stroke-linecap="round"
              />
            </g>
            <!-- پاییز: برگ افرا -->
            <g v-else-if="p.kind === 'maple'">
              <path
                d="M12 2 14 6.8 17.8 4.8 16.8 9.4 21.8 9.6 18.2 13.2 19.8 17.8 14.4 16.4 12 22 9.6 16.4 4.2 17.8 5.8 13.2 2.2 9.6 7.2 9.4 6.2 4.8 10 6.8Z"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="1"
                stroke-linejoin="round"
              />
              <path
                d="M12 6v17M12 12l-4-3M12 12l4-3"
                fill="none"
                stroke="rgb(0 0 0 / .28)"
                stroke-width=".9"
                stroke-linecap="round"
              />
            </g>

            <!-- بهار: شکوفه‌ی پنج‌پر -->
            <g v-else-if="p.kind === 'blossom'">
              <path
                v-for="n in 5"
                :key="n"
                :transform="`rotate(${(n - 1) * 72} 12 12)`"
                d="M12 12C8.6 9.6 8.4 5 10.2 2.6 11 3.4 11.5 3.9 12 4.1 12.5 3.9 13 3.4 13.8 2.6 15.6 5 15.4 9.6 12 12Z"
                fill="currentColor"
              />
              <circle
                cx="12"
                cy="12"
                r="1.7"
                fill="rgb(0 0 0 / .22)"
              />
            </g>
            <!-- بهار: گلبرگ تکی -->
            <path
              v-else-if="p.kind === 'petal'"
              d="M12 2C16.5 6 17 14 12 22 7 14 7.5 6 12 2Z"
              fill="currentColor"
            />

            <!-- تابستون: ذره‌ی نور با هاله -->
            <g
              v-else
              fill="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                opacity=".22"
              />
              <circle
                cx="12"
                cy="12"
                r="3.2"
              />
            </g>
          </svg>
        </span>
      </span>

      <!-- زمستون: ستاره‌های چشمک‌زن -->
      <span
        v-for="st in sparkles"
        :key="`st-${st.id}`"
        class="sb-star"
        :class="{ 'sb-extra': st.extra }"
        :style="{ left: `${st.x}%`, top: `${st.y}%`, opacity: st.opacity }"
      >
        <svg
          :width="st.size"
          :height="st.size"
          viewBox="0 0 24 24"
          class="sb-twinkle"
          :class="st.color"
          :style="{ '--spin': `${st.dur}s`, 'animationDelay': `-${st.delay}s` }"
        >
          <path
            d="M12 2 14.2 9.8 22 12 14.2 14.2 12 22 9.8 14.2 2 12 9.8 9.8Z"
            fill="currentColor"
          />
        </svg>
      </span>

      <!-- زمستون: شهاب -->
      <span
        v-for="c in comets"
        :key="`cm-${c.id}`"
        class="sb-comet"
        :class="{ 'sb-extra': c.extra }"
        :style="{ left: `${c.x}%`, '--dur': `${c.dur}s`, '--delay': `${c.delay}s`, '--drift': `${c.drift}vw`, '--peak': c.peak }"
      >
        <svg
          width="8"
          height="52"
          viewBox="0 0 8 52"
          class="text-primary-300 dark:text-primary-200"
          :style="{ transform: `rotate(${c.tilt}deg)` }"
        >
          <defs>
            <linearGradient
              :id="`sb-tail-${c.id}`"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0"
                stop-color="currentColor"
                stop-opacity="0"
              />
              <stop
                offset="1"
                stop-color="currentColor"
                stop-opacity=".85"
              />
            </linearGradient>
          </defs>
          <path
            d="M4 0 6.6 46H1.4Z"
            :fill="`url(#sb-tail-${c.id})`"
          />
          <circle
            cx="4"
            cy="47"
            r="4.4"
            fill="currentColor"
            opacity=".22"
          />
          <circle
            cx="4"
            cy="47"
            r="2.2"
            fill="currentColor"
          />
        </svg>
      </span>

      <!-- تابستون: پروانه | بهار: زنبور | پاییز: پرنده‌ی مهاجر (کنار لبه‌ها) -->
      <span
        v-for="b in flyers"
        :key="`fl-${season}-${b.id}`"
        class="sb-fly"
        :class="[b.up ? 'sb-flyup' : 'sb-flydown', { 'sb-extra': b.extra }]"
        :style="{ left: `${b.x}%`, opacity: b.opacity, '--dur': `${b.dur}s`, '--delay': `${b.delay}s` }"
      >
        <span
          class="sb-bob"
          :style="{ '--bob': `${b.swayA}vw`, '--bob-dur': `${b.swayADur}s` }"
        >
          <span
            class="sb-bob"
            :style="{ '--bob': `${b.swayB}vw`, '--bob-dur': `${b.swayBDur}s` }"
          >
            <span
              class="sb-wobble"
              :class="{ 'sb-wobble-soft': b.kind === 'bird' }"
              :style="{ '--wobble-dur': `${b.wobbleDur}s` }"
            >
              <svg
                :width="b.size"
                :height="b.size"
                viewBox="0 0 24 24"
                :class="b.color"
                :style="{
                  '--flap': `${b.flap}s`,
                  'transform': b.up ? 'none' : 'rotate(180deg)',
                }"
              >
                <!-- پروانه -->
                <template v-if="b.kind === 'butterfly'">
                  <g
                    class="sb-wing sb-wing-l"
                    fill="currentColor"
                  >
                    <path d="M12 11C9 4 3 2 2.5 6 2 9.5 7 12 12 12Z" />
                    <path d="M12 12.5C8 12.5 4 14 5 18 6 21 10 19 12 14.5Z" />
                    <circle
                      cx="6.6"
                      cy="6.6"
                      r="1.2"
                      fill="rgb(255 255 255 / .4)"
                    />
                  </g>
                  <g
                    class="sb-wing sb-wing-r"
                    fill="currentColor"
                  >
                    <path d="M12 11C15 4 21 2 21.5 6 22 9.5 17 12 12 12Z" />
                    <path d="M12 12.5C16 12.5 20 14 19 18 18 21 14 19 12 14.5Z" />
                    <circle
                      cx="17.4"
                      cy="6.6"
                      r="1.2"
                      fill="rgb(255 255 255 / .4)"
                    />
                  </g>
                  <ellipse
                    cx="12"
                    cy="12"
                    rx=".9"
                    ry="5"
                    fill="rgb(0 0 0 / .5)"
                  />
                  <path
                    d="M11.6 7.5C11 5.5 10 4.5 9.2 4.2M12.4 7.5C13 5.5 14 4.5 14.8 4.2"
                    fill="none"
                    stroke="rgb(0 0 0 / .5)"
                    stroke-width=".6"
                    stroke-linecap="round"
                  />
                </template>

                <!-- زنبور عسل -->
                <template v-else-if="b.kind === 'bee'">
                  <g
                    class="sb-wing sb-wing-l"
                    fill="currentColor"
                    opacity=".5"
                  >
                    <ellipse
                      cx="7.2"
                      cy="10.2"
                      rx="5.2"
                      ry="2.7"
                      transform="rotate(-28 7.2 10.2)"
                    />
                  </g>
                  <g
                    class="sb-wing sb-wing-r"
                    fill="currentColor"
                    opacity=".5"
                  >
                    <ellipse
                      cx="16.8"
                      cy="10.2"
                      rx="5.2"
                      ry="2.7"
                      transform="rotate(28 16.8 10.2)"
                    />
                  </g>
                  <ellipse
                    cx="12"
                    cy="14.2"
                    rx="3.6"
                    ry="5.8"
                    fill="currentColor"
                  />
                  <path
                    d="M8.6 12.9h6.8M8.6 15.9h6.8M9.7 18.6h4.6"
                    fill="none"
                    stroke="rgb(0 0 0 / .42)"
                    stroke-width="1.5"
                  />
                  <circle
                    cx="12"
                    cy="7.4"
                    r="2.5"
                    fill="currentColor"
                  />
                  <path
                    d="M11 5.4C10.6 4.2 10 3.6 9.2 3.3M13 5.4C13.4 4.2 14 3.6 14.8 3.3"
                    fill="none"
                    stroke="rgb(0 0 0 / .5)"
                    stroke-width=".7"
                    stroke-linecap="round"
                  />
                </template>

                <!-- پرنده‌ی مهاجر (نمای بالا) -->
                <template v-else>
                  <g
                    class="sb-wing sb-wing-bird sb-wing-l"
                    fill="currentColor"
                  >
                    <path d="M10.7 9C8 8.4 4 9.8 1.5 13.6c3-1.4 5.6-1.6 9.2-.9Z" />
                  </g>
                  <g
                    class="sb-wing sb-wing-bird sb-wing-r"
                    fill="currentColor"
                  >
                    <path d="M13.3 9C16 8.4 20 9.8 22.5 13.6c-3-1.4-5.6-1.6-9.2-.9Z" />
                  </g>
                  <path
                    d="M12 3c1.5 1.7 2 4.4 1.7 7.4L12.9 16 12 21l-.9-5-.8-5.6C10 7.4 10.5 4.7 12 3Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 16.2 14.4 21.6 12 20 9.6 21.6Z"
                    fill="currentColor"
                  />
                </template>
              </svg>
            </span>
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.sb-layer {
  position: absolute;
  inset: 0;
  animation: sb-in 1.6s ease both;
}

/* ---- سقوط (برف/برگ/شکوفه) و شناور شدن به بالا (ذرات نور) ---- */
.sb-fall {
  position: absolute;
  top: 0;
  animation: sb-fall var(--dur) linear infinite;
  animation-delay: calc(var(--delay) * -1);
  will-change: transform;
}
.sb-fall.sb-up {
  top: auto;
  bottom: 0;
  animation-name: sb-rise;
}
.sb-sway {
  display: block;
  animation: sb-sway var(--sway-dur) ease-in-out infinite alternate;
  animation-delay: calc(var(--sway-delay) * -1);
}
.sb-spin {
  display: block;
  animation: sb-spin var(--spin) linear infinite;
  animation-direction: var(--dir);
}
.sb-twinkle {
  display: block;
  animation: sb-twinkle var(--spin) ease-in-out infinite alternate;
}

/* ---- پروانه: مسیر عمودی کنار لبه + تاب چپ و راست ---- */
.sb-fly {
  position: absolute;
  top: 0;
  will-change: transform;
  animation-duration: var(--dur);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-delay: calc(var(--delay) * -1);
}
.sb-flyup { animation-name: sb-fly-up; }
.sb-flydown { animation-name: sb-fly-down; }
.sb-bob {
  display: block;
  animation: sb-bob var(--bob-dur) ease-in-out infinite alternate;
}
.sb-wobble {
  display: block;
  animation: sb-wobble var(--wobble-dur) ease-in-out infinite;
}
.sb-wing {
  transform-box: fill-box;
  animation: sb-flap var(--flap) ease-in-out infinite alternate;
}
.sb-wing-l { transform-origin: 100% 50%; }
.sb-wing-r { transform-origin: 0% 50%; }

.sb-wobble-soft { animation-name: sb-wobble-soft; }
.sb-wing-bird { animation: sb-bird-flap var(--flap) ease-in-out infinite; }

/* ---- زمستون: ستاره و شهاب ---- */
.sb-star {
  position: absolute;
  display: block;
}
.sb-comet {
  position: absolute;
  top: 0;
  display: block;
  opacity: 0;
  will-change: transform, opacity;
  animation: sb-comet var(--dur) linear infinite;
  animation-delay: calc(var(--delay) * -1);
}

@keyframes sb-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes sb-fall {
  from { transform: translate3d(0, -12vh, 0); }
  to { transform: translate3d(var(--drift), 112vh, 0); }
}
@keyframes sb-rise {
  from { transform: translate3d(0, 12vh, 0); }
  to { transform: translate3d(var(--drift), -112vh, 0); }
}
@keyframes sb-sway {
  from { transform: translateX(calc(var(--sway) * -1)); }
  to { transform: translateX(var(--sway)); }
}
@keyframes sb-spin {
  to { transform: rotate(360deg); }
}
@keyframes sb-twinkle {
  from { opacity: 0.35; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1.05); }
}
@keyframes sb-fly-up {
  from { transform: translate3d(0, 112vh, 0); }
  to { transform: translate3d(0, -12vh, 0); }
}
@keyframes sb-fly-down {
  from { transform: translate3d(0, -12vh, 0); }
  to { transform: translate3d(0, 112vh, 0); }
}
@keyframes sb-bob {
  from { transform: translateX(calc(var(--bob) * -1)); }
  to { transform: translateX(var(--bob)); }
}
@keyframes sb-wobble {
  0%, 100% { transform: rotate(-12deg); }
  25% { transform: rotate(7deg); }
  50% { transform: rotate(-5deg); }
  75% { transform: rotate(10deg); }
}
@keyframes sb-flap {
  from { transform: scaleX(1); }
  to { transform: scaleX(0.35); }
}
/* پرنده: چندتا بال زدن پشت‌سرهم و بعد سر خوردن */
@keyframes sb-bird-flap {
  0%, 32%, 100% { transform: scaleX(1); }
  8%, 24% { transform: scaleX(0.5); }
  16% { transform: scaleX(1); }
}
@keyframes sb-wobble-soft {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(4deg); }
}
/* شهاب: ~۱۳٪ از چرخه حرکت می‌کنه (چند ثانیه)، بقیه‌ی وقت نامرئیه؛ سرعت ثابت */
@keyframes sb-comet {
  0% { transform: translate3d(0, -14vh, 0); opacity: 0; }
  2% { opacity: var(--peak); }
  10% { opacity: var(--peak); }
  13%, 100% { transform: translate3d(calc(var(--drift) * 1.3), 87vh, 0); opacity: 0; }
}

/* موبایل: ذرات اضافه مخفی می‌شن تا سبک بمونه */
@media (max-width: 639px) {
  .sb-extra { display: none; }
}

/* کاربرانی که انیمیشن کم می‌خوان */
@media (prefers-reduced-motion: reduce) {
  .season-bg { display: none; }
}
</style>