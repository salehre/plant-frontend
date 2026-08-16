<script setup lang="ts">
const route = useRoute()

// `badge` is optional — wire it up to a real count (unread messages,
// notifications, etc.) from a store/composable when you have one; it stays
// hidden when omitted or falsy.
const items = [
  { to: '/', icon: 'lucide:home', label: 'خانه', badge: undefined as number | undefined },
  { to: '/identify', icon: 'lucide:scan-line', label: 'شناسایی', badge: undefined as number | undefined },
  { to: '/plants', icon: 'lucide:sprout', label: 'گیاهان', badge: undefined as number | undefined },
  { to: '/profile', icon: 'lucide:user', label: 'پروفایل', badge: undefined as number | undefined },
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
   - `pos`/`width` : critically-damped springs -> the pill smoothly slides
                     AND grows/shrinks to wrap the active item's icon+label,
                     no positional/size overshoot.
   - `scaleX`/`scaleY` : driven by pos's velocity (fast move => stretch),
                         lightly underdamped so it settles with a tiny wobble.
   - `press` : inflates the pill on pointerdown and snaps toward the touch.
   ========================================================================= */

interface Spring { value: number, velocity: number, target: number }

function makeSpring(value = 0): Spring {
  return { value, velocity: 0, target: value }
}

function stepSpring(s: Spring, stiffness: number, dampingRatio: number, dt: number) {
  const damping = dampingRatio * 2 * Math.sqrt(stiffness)
  const force = -stiffness * (s.value - s.target) - damping * s.velocity
  s.velocity += force * dt
  s.value += s.velocity * dt
}

const navRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLElement[]>([])
const pillRef = ref<HTMLElement | null>(null)
const feedbackRef = ref<HTMLElement | null>(null)

function setItemRef(el: any, index: number) {
  const node = el?.$el ?? el
  if (node) itemRefs.value[index] = node as HTMLElement
}

const posSpring = makeSpring(0)
const widthSpring = makeSpring(0)
const scaleXSpring = makeSpring(1)
const scaleYSpring = makeSpring(1)
const pressSpring = makeSpring(1)

let pillH = 0
let pillTop = 0
let initialized = false
let rafId: number | null = null
let lastTime = 0

function measureAndSetTarget(instant = false) {
  const nav = navRef.value
  const el = itemRefs.value[activeIndex.value]
  if (!nav || !el) return

  const navRect = nav.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()

  pillH = elRect.height
  pillTop = elRect.top - navRect.top

  posSpring.target = elRect.left - navRect.left
  widthSpring.target = elRect.width

  if (instant || !initialized) {
    posSpring.value = posSpring.target
    posSpring.velocity = 0
    widthSpring.value = widthSpring.target
    widthSpring.velocity = 0
    initialized = true
    applyFrame()
  }
  ensureLoop()
}

function applyFrame() {
  const pill = pillRef.value
  if (!pill) return

  pill.style.width = `${widthSpring.value}px`
  pill.style.height = `${pillH}px`
  pill.style.top = `${pillTop}px`
  pill.style.left = `${posSpring.value}px`
  pill.style.transform = `scaleX(${scaleXSpring.value}) scaleY(${scaleYSpring.value})`
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

  // position + width: critically damped, no overshoot
  stepSpring(posSpring, 1000, 1, dt)
  // slight elastic settle on width growth for a satisfying "grow" feel
  stepSpring(widthSpring, 900, 0.78, dt)

  // press inflation
  stepSpring(pressSpring, 300, 0.6, dt)

  // stretch/squash target driven by current sliding speed
  const speed = Math.abs(posSpring.velocity) // px/s
  const stretch = Math.min(speed / 2200, 0.35)
  scaleXSpring.target = pressSpring.value + stretch
  scaleYSpring.target = pressSpring.value - stretch * 0.6

  stepSpring(scaleXSpring, 250, 0.55, dt)
  stepSpring(scaleYSpring, 250, 0.65, dt)

  applyFrame()

  const settled
    = Math.abs(posSpring.value - posSpring.target) < 0.05 && Math.abs(posSpring.velocity) < 2
      && Math.abs(widthSpring.value - widthSpring.target) < 0.05 && Math.abs(widthSpring.velocity) < 2
      && Math.abs(scaleXSpring.value - 1) < 0.002 && Math.abs(scaleYSpring.value - 1) < 0.002
      && Math.abs(pressSpring.value - pressSpring.target) < 0.002

  if (settled) {
    rafId = null
    return
  }
  rafId = requestAnimationFrame(tick)
}

function onPointerDown(index: number, e: PointerEvent) {
  pressSpring.target = 1.1
  // snap toward the touched tab immediately, before the route even changes
  const el = itemRefs.value[index]
  const nav = navRef.value
  if (el && nav) {
    const navRect = nav.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    posSpring.target = elRect.left - navRect.left
    widthSpring.target = elRect.width
  }
  triggerFeedback(e)
  ensureLoop()
}

function onPointerUp() {
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
    <nav
      ref="navRef"
      class="jelly-nav relative isolate flex items-center gap-1 overflow-hidden rounded-full px-2 py-2 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.45)]"
      aria-label="ناوبری اصلی"
    >
      <!-- touch feedback ripple -->
      <span
        ref="feedbackRef"
        class="jelly-feedback pointer-events-none absolute rounded-full"
      />

      <!-- the jelly pill: solid, themed capsule that slides + grows/shrinks
           to wrap whichever item is active -->
      <div
        ref="pillRef"
        class="jelly-pill pointer-events-none absolute rounded-full"
      />

      <NuxtLink
        v-for="(item, index) in items"
        :key="item.to"
        :ref="(el) => setItemRef(el, index)"
        :to="item.to"
        class="relative z-10 flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors"
        :class="isActive(item.to) ? 'text-white' : 'text-ink-muted hover:text-ink'"
        @pointerdown="onPointerDown(index, $event)"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="onPointerUp"
      >
        <span class="relative shrink-0">
          <Icon
            :name="item.icon"
            class="size-5"
          />
          <span
            v-if="item.badge"
            class="jelly-badge absolute flex items-center justify-center rounded-full text-[10px] font-bold text-white"
          >
            {{ item.badge > 9 ? '9+' : item.badge }}
          </span>
        </span>

        <Transition name="jelly-label">
          <span
            v-if="isActive(item.to)"
            class="whitespace-nowrap text-sm font-medium"
          >
            {{ item.label }}
          </span>
        </Transition>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.jelly-nav {
  background-color: rgb(20 18 16 / 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* ---- jelly pill: solid themed capsule behind the active tab ---- */
.jelly-pill {
  z-index: 1;
  background: rgb(var(--color-primary-500));
  box-shadow:
    0 3px 10px -2px rgb(var(--color-primary-500) / 0.55),
    inset 0 1px 0 0 rgb(255 255 255 / 0.25);
  transform-origin: center;
  will-change: left, width, transform;
}

/* ---- badge ---- */
.jelly-badge {
  top: -5px;
  right: -6px;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  background: #ef4444;
  box-shadow: 0 0 0 2px rgb(20 18 16 / 0.92);
}

/* ---- label reveal ---- */
.jelly-label-enter-active,
.jelly-label-leave-active {
  transition: opacity 0.15s ease;
}

.jelly-label-enter-from,
.jelly-label-leave-to {
  opacity: 0;
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
    rgb(var(--color-primary-500) / 0.35) 0%,
    rgb(var(--color-primary-500) / 0.15) 45%,
    rgb(var(--color-primary-500) / 0) 70%
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
    transform: scale(24);
  }
}

@media (prefers-reduced-motion: reduce) {
  .jelly-feedback.is-active {
    animation: none;
  }
}
</style>