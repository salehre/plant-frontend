<script setup lang="ts">
const route = useRoute()

const items = [
  { to: '/', icon: 'lucide:home' },
  { to: '/identify', icon: 'lucide:scan-line' },
  { to: '/plants', icon: 'lucide:sprout' },
  { to: '/profile', icon: 'lucide:user' },
]

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

const activeIndex = computed(() => {
  const idx = items.findIndex(item => isActive(item.to))
  return idx === -1 ? 0 : idx
})

/* =========================================================================
   Jelly physics
   Real spring simulation (not a fixed CSS keyframe):
   - `pos`   : critically-damped spring -> smooth move, no positional overshoot
   - `scaleX`/`scaleY` : driven by pos's own velocity (fast move => stretch),
                         each is itself a lightly-underdamped spring so it
                         settles with a tiny wobble, like real jelly.
   - `press` : inflates the pill on pointerdown and snaps toward the touch.
   ========================================================================= */

interface Spring { value: number, velocity: number, target: number }

function makeSpring(value = 0): Spring {
  return { value, velocity: 0, target: value }
}

// advances a spring by dt (seconds) given stiffness + damping ratio
function stepSpring(s: Spring, stiffness: number, dampingRatio: number, dt: number) {
  const damping = dampingRatio * 2 * Math.sqrt(stiffness)
  const force = -stiffness * (s.value - s.target) - damping * s.velocity
  s.velocity += force * dt
  s.value += s.velocity * dt
}

const navRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLElement[]>([])
const pillRef = ref<HTMLElement | null>(null)
const clipRef = ref<HTMLElement | null>(null)
const feedbackRef = ref<HTMLElement | null>(null)

function setItemRef(el: any, index: number) {
  const node = el?.$el ?? el
  if (node) itemRefs.value[index] = node as HTMLElement
}

const posSpring = makeSpring(0)
const scaleXSpring = makeSpring(1)
const scaleYSpring = makeSpring(1)
const pressSpring = makeSpring(1)

let pillW = 0
let pillH = 0
let pillTop = 0
let navW = 0
let navH = 0
let initialized = false
let rafId: number | null = null
let lastTime = 0
let pressed = false

function measureAndSetTarget(instant = false) {
  const nav = navRef.value
  const el = itemRefs.value[activeIndex.value]
  if (!nav || !el) return

  const navRect = nav.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()

  navW = navRect.width
  navH = navRect.height
  pillW = elRect.width
  pillH = elRect.height
  pillTop = elRect.top - navRect.top

  posSpring.target = elRect.left - navRect.left

  if (instant || !initialized) {
    posSpring.value = posSpring.target
    posSpring.velocity = 0
    initialized = true
    applyFrame()
  }
  ensureLoop()
}

function applyFrame() {
  const pill = pillRef.value
  const clip = clipRef.value
  if (!pill || !clip) return

  pill.style.width = `${pillW}px`
  pill.style.height = `${pillH}px`
  pill.style.top = `${pillTop}px`
  pill.style.left = `${posSpring.value}px`
  pill.style.transform = `scaleX(${scaleXSpring.value}) scaleY(${scaleYSpring.value})`

  const left = posSpring.value
  const right = navW - left - pillW
  const top = pillTop
  const bottom = navH - pillTop - pillH
  clip.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round 999px)`
}

function ensureLoop() {
  if (rafId == null) {
    lastTime = performance.now()
    rafId = requestAnimationFrame(tick)
  }
}

function tick(now: number) {
  const dt = Math.min((now - lastTime) / 1000, 1 / 30)
  lastTime = now

  // 1) position: critically damped, no overshoot
  stepSpring(posSpring, 1000, 1, dt)

  // 2) press inflation
  stepSpring(pressSpring, 300, 0.6, dt)

  // 3) stretch/squash target driven by current speed
  const speed = Math.abs(posSpring.velocity) // px/s
  const stretch = Math.min(speed / 2200, 0.4)
  scaleXSpring.target = pressSpring.value + stretch
  scaleYSpring.target = pressSpring.value - stretch * 0.6

  stepSpring(scaleXSpring, 250, 0.55, dt)
  stepSpring(scaleYSpring, 250, 0.65, dt)

  applyFrame()

  const settled
    = Math.abs(posSpring.value - posSpring.target) < 0.05 && Math.abs(posSpring.velocity) < 2
      && Math.abs(scaleXSpring.value - 1) < 0.002 && Math.abs(scaleYSpring.value - 1) < 0.002
      && Math.abs(pressSpring.value - pressSpring.target) < 0.002

  if (settled) {
    rafId = null
    return
  }
  rafId = requestAnimationFrame(tick)
}

function onPointerDown(index: number, e: PointerEvent) {
  pressed = true
  pressSpring.target = 1.14
  // snap toward the touched tab immediately, before the route even changes
  const el = itemRefs.value[index]
  const nav = navRef.value
  if (el && nav) {
    const navRect = nav.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    posSpring.target = elRect.left - navRect.left
  }
  triggerFeedback(e)
  ensureLoop()
}

function onPointerUp() {
  pressed = false
  pressSpring.target = 1
  ensureLoop()
}

function triggerFeedback(e: PointerEvent) {
  const fb = feedbackRef.value
  const nav = navRef.value
  if (!fb || !nav) return
  const navRect = nav.getBoundingClientRect()
  fb.style.left = `${e.clientX - navRect.left}px`
  fb.style.top = `${e.clientY - navRect.top}px`
  fb.classList.remove('is-active')
  // force reflow so the animation restarts on rapid taps
  void fb.offsetWidth
  fb.classList.add('is-active')
}

watch(activeIndex, () => nextTick(() => measureAndSetTarget(false)))

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => measureAndSetTarget(true))
  resizeObserver = new ResizeObserver(() => measureAndSetTarget(true))
  if (navRef.value) resizeObserver.observe(navRef.value)
  window.addEventListener('resize', () => measureAndSetTarget(true))
})

onBeforeUnmount(() => {
  if (rafId != null) cancelAnimationFrame(rafId)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    class="fixed inset-x-0 z-40 flex justify-center px-4 md:hidden"
    style="bottom: calc(1.25rem + env(safe-area-inset-bottom));"
  >
    <svg
      width="0"
      height="0"
      class="absolute"
    >
      <defs>
        <filter
          id="glass-distortion-nav"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feTurbulence
            type="fractalNoise"
            base-frequency="0.015 0.015"
            num-octaves="2"
            seed="92"
            result="noise"
          />
          <feGaussianBlur
            in="noise"
            std-deviation="2"
            result="blurred"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="95"
            x-channel-selector="R"
            y-channel-selector="G"
          />
        </filter>
      </defs>
    </svg>

    <nav
      ref="navRef"
      class="glass-bottom-nav relative isolate flex items-center gap-1 rounded-full px-2 py-2 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.35)]"
      aria-label="ناوبری اصلی"
    >
      <!-- touch feedback ripple -->
      <span
        ref="feedbackRef"
        class="jelly-feedback pointer-events-none absolute rounded-full"
      />

      <!-- the jelly pill itself (colored shape, squashes & stretches) -->
      <div
        ref="pillRef"
        class="jelly-pill pointer-events-none absolute rounded-full"
      />

      <!-- base row: icons in inactive/muted color -->
      <NuxtLink
        v-for="(item, index) in items"
        :key="item.to"
        :ref="(el) => setItemRef(el, index)"
        :to="item.to"
        class="relative z-10 flex min-w-[68px] flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-ink-muted transition-colors"
        :class="isActive(item.to) ? 'text-primary-700' : 'hover:text-ink'"
        @pointerdown="onPointerDown(index, $event)"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="onPointerUp"
      >
        <Icon
          :name="item.icon"
          class="size-5"
        />
      </NuxtLink>

      <!-- clipped duplicate row: only visible inside the pill window, in the
           "active" color, giving the icon-color-swap as the pill covers it -->
      <div
        ref="clipRef"
        class="jelly-clip pointer-events-none absolute inset-0 flex items-center gap-1 px-2 py-2"
        aria-hidden="true"
      >
        <div
          v-for="item in items"
          :key="item.to"
          class="flex min-w-[68px] flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-primary-700"
        >
          <Icon
            :name="item.icon"
            class="size-5"
          />
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.glass-bottom-nav {
  background-color: rgb(var(--color-surface) / 0.55);
}

.glass-bottom-nav::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 9999px;
  box-shadow: inset 0 0 12px -6px rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.glass-bottom-nav::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 9999px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  filter: url(#glass-distortion-nav);
  -webkit-filter: url(#glass-distortion-nav);
  isolation: isolate;
  pointer-events: none;
}

/* ---- jelly pill: solid raised shape behind the active tab ---- */
.jelly-pill {
  z-index: 1;
  top: 0;
  left: 0;
  background: rgb(var(--color-surface-2, 255 255 255) / 0.92);
  box-shadow:
    0 2px 6px -1px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgb(255 255 255 / 0.6);
  transform-origin: center;
  will-change: left, transform;
}

/* ---- clipped duplicate row: reveals active-colored icon only where the
   pill currently covers, via clip-path (kept unscaled so icons never
   distort) ---- */
.jelly-clip {
  z-index: 2;
}

/* ---- touch feedback: a soft ripple where the finger lands ---- */
.jelly-feedback {
  z-index: 0;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  margin-top: -2px;
  background: radial-gradient(
    circle,
    rgb(var(--color-primary-700) / 0.35) 0%,
    rgb(var(--color-primary-700) / 0.15) 45%,
    rgb(var(--color-primary-700) / 0) 70%
  );
  opacity: 0;
  transform: scale(1);
}

.jelly-feedback.is-active {
  animation: jelly-ripple 0.5s ease-out;
}

@keyframes jelly-ripple {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(28);
  }
}

@media (prefers-reduced-motion: reduce) {
  .jelly-feedback.is-active {
    animation: none;
  }
}
</style>