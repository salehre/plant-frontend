<script setup lang="ts">
import { seasonByTheme } from '~/stores/ui.store'

/**
 * پس‌زمینه‌ی متحرک هر تم (فصل) - ظریف و کم‌مزاحمت:
 *  navy (زمستون)    -> دانه‌های برف که آروم می‌افتن
 *  brown (پاییز)    -> برگ‌هایی که آروم می‌چرخن و سقوط می‌کنن
 *  wine (بهار)      -> شکوفه‌هایی که خیلی آروم دریفت می‌شن
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

interface Butterfly {
  id: number
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

// فقط دو پروانه، هرکدوم کنار یکی از لبه‌ها: عمودی و آروم حرکت می‌کنن و
// دو لایه‌ی چپ-راست با دوره‌ی متفاوت، مسیرشون رو منحنی و نامنظم می‌کنه
const butterflies = computed<Butterfly[]>(() => {
  if (season.value !== 'summer') return []
  const rnd = createRng(424242)
  return Array.from({ length: 2 }, (_, i) => {
    const dur = 46 + rnd() * 20
    return {
      id: i,
      x: i === 0 ? 3 + rnd() * 8 : 89 + rnd() * 6,
      size: 16 + rnd() * 8,
      color: colors[i % colors.length]!,
      opacity: 0.55 + rnd() * 0.15,
      dur,
      delay: rnd() * dur,
      up: i === 0,
      swayA: 1.2 + rnd() * 1.3,
      swayADur: 5 + rnd() * 4,
      swayB: 0.4 + rnd() * 0.5,
      swayBDur: 1.8 + rnd() * 1.4,
      wobbleDur: 2.8 + rnd() * 1.6,
      flap: 0.35 + rnd() * 0.2,
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

      <!-- تابستون: پروانه‌ها (کنار لبه‌ها) -->
      <span
        v-for="b in butterflies"
        :key="`bf-${b.id}`"
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

/* موبایل: ذرات اضافه مخفی می‌شن تا سبک بمونه */
@media (max-width: 639px) {
  .sb-extra { display: none; }
}

/* کاربرانی که انیمیشن کم می‌خوان */
@media (prefers-reduced-motion: reduce) {
  .season-bg { display: none; }
}
</style>