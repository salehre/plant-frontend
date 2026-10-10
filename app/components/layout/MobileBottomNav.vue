<script setup lang="ts">
import { isNavigationFailure, NavigationFailureType } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

interface NavItem {
  to: string
  icon: string
  label: string
  badge?: number
}

const items: NavItem[] = [
  { to: '/', icon: 'lucide:home', label: 'components.mobileBottomNav.home' },
  { to: '/identify', icon: 'lucide:scan-line', label: 'components.mobileBottomNav.identify' },
  { to: '/plants', icon: 'lucide:sprout', label: 'components.mobileBottomNav.plants' },
  { to: '/profile', icon: 'lucide:user', label: 'components.mobileBottomNav.profile' },
]

// تطبیق با مرز سگمنت: /plants و /plants/rose فعالن ولی /plants-xyz نه
function isActive(to: string) {
  return to === '/' ? route.path === '/' : (route.path === to || route.path.startsWith(`${to}/`))
}

// -1 = صفحه‌ای که توی نوار نیست (مثلاً /blog یا /contact): هیچ تبی هایلایت نمی‌شه
// (قبلاً اینجا ۰ برمی‌گشت و تب «خانه» اشتباهی فعال می‌شد)
const activeIndex = computed(() => items.findIndex(item => isActive(item.to)))

// ---------- Spring physics ----------

interface Spring {
  value: number
  velocity: number
  target: number
}

function makeSpring(value = 0): Spring {
  return { value, velocity: 0, target: value }
}

function stepSpring(s: Spring, stiffness: number, dampingRatio: number, dt: number) {
  const damping = dampingRatio * 2 * Math.sqrt(stiffness)
  const force = -stiffness * (s.value - s.target) - damping * s.velocity
  s.velocity += force * dt
  s.value += s.velocity * dt
}

function springSettled(s: Spring, posEps = 0.05, velEps = 2) {
  return Math.abs(s.value - s.target) < posEps && Math.abs(s.velocity) < velEps
}

// ---------- Refs ----------

const navRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLElement[]>([])
const pillRef = ref<HTMLElement | null>(null)
const feedbackRef = ref<HTMLElement | null>(null)

function setItemRef(el: any, index: number) {
  const node = el?.$el ?? el
  if (node) itemRefs.value[index] = node as HTMLElement
}

// ---------- Springs ----------

const posSpring = makeSpring(0)
const widthSpring = makeSpring(0)
const scaleXSpring = makeSpring(1)
const scaleYSpring = makeSpring(1)
const pressSpring = makeSpring(1)

// pendingIndex = index the pill is animating toward optimistically,
// before the route has actually changed (set on pointerdown).
const pendingIndex = ref<number | null>(null)
const displayActiveIndex = computed(() => pendingIndex.value ?? activeIndex.value)
const pillHidden = ref(activeIndex.value === -1)

// Safety-net timer: آخرین خط دفاع اگه هیچ‌کدوم از راه‌های عادی پاک کردن pending
// (رسیدن به مسیر، شکست ناوبری، pointercancel) اتفاق نیفتاد. عمداً طولانیه؛ صفحه‌هایی
// که داده‌ی async دارن ممکنه چند ثانیه طول بکشن تا مسیر واقعاً عوض بشه و با تایمر کوتاه
// پیل قبل از رسیدن مسیر به تب قبلی برمی‌گشت و بعد دوباره می‌پرید.
const PENDING_TIMEOUT_MS = 10000
let pendingFallbackTimer: number | null = null

function clearPendingFallbackTimer() {
  if (pendingFallbackTimer != null) {
    window.clearTimeout(pendingFallbackTimer)
    pendingFallbackTimer = null
  }
}

function clearPending() {
  pendingIndex.value = null
  clearPendingFallbackTimer()
}

let pillH = 0
let pillTop = 0
let initialized = false
let rafId: number | null = null
let lastTime = 0

function measureAndSetTarget(instant = false) {
  const nav = navRef.value
  // همیشه به تبی که «نمایش داده می‌شه» (pending یا مسیر فعلی) اشاره می‌کنیم، نه فقط مسیر.
  // قبلاً با activeIndex اندازه می‌گرفت و هر resize/watch وسط ناوبری پیل رو به تب قبلی برمی‌گردوند.
  const index = displayActiveIndex.value
  if (index === -1) {
    pillHidden.value = true
    return
  }
  const el = itemRefs.value[index]
  if (!nav || !el) return

  // اگه پیل مخفی بوده، بدون «کشیده شدن» از جای قبلی مستقیم میاد روی تب جدید
  if (pillHidden.value) {
    pillHidden.value = false
    instant = true
  }

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

  stepSpring(posSpring, 1000, 1, dt)
  stepSpring(widthSpring, 900, 0.78, dt)
  stepSpring(pressSpring, 300, 0.6, dt)

  const speed = Math.abs(posSpring.velocity) // px/s
  const stretch = Math.min(speed / 2200, 0.35)
  scaleXSpring.target = pressSpring.value + stretch
  scaleYSpring.target = pressSpring.value - stretch * 0.6

  stepSpring(scaleXSpring, 250, 0.55, dt)
  stepSpring(scaleYSpring, 250, 0.65, dt)

  applyFrame()

  const settled
    = springSettled(posSpring)
      && springSettled(widthSpring)
      && Math.abs(scaleXSpring.value - 1) < 0.002
      && Math.abs(scaleYSpring.value - 1) < 0.002
      && Math.abs(pressSpring.value - pressSpring.target) < 0.002

  if (settled) {
    rafId = null
    return
  }
  rafId = requestAnimationFrame(tick)
}

// ---------- Pointer interaction ----------

function onPointerDown(index: number, e: PointerEvent) {
  // کلیک راست/دکمه‌های غیر اصلی ناوبری نمی‌سازن
  if (e.pointerType === 'mouse' && e.button !== 0) return

  // روی تب فعال: ناوبری‌ای در کار نیست، فقط انیمیشن فشردن. اگه pending ست می‌شد هیچ‌وقت
  // پاک نمی‌شد و بعداً با رفتن به صفحه‌ی دیگه، تب اشتباه هایلایت می‌موند.
  if (index === displayActiveIndex.value && pendingIndex.value === null) {
    pressSpring.target = 1.1
    triggerFeedback(e)
    ensureLoop()
    return
  }

  pendingIndex.value = index
  pressSpring.target = 1.1

  // پیل رو همین حالا (خوش‌بینانه) به تب لمس‌شده می‌بره؛ مسیر که برسه همین‌جا می‌مونه
  measureAndSetTarget(false)

  triggerFeedback(e)
  ensureLoop()

  clearPendingFallbackTimer()
  pendingFallbackTimer = window.setTimeout(() => {
    if (pendingIndex.value === index) {
      clearPending()
      measureAndSetTarget(false)
    }
  }, PENDING_TIMEOUT_MS)
}

function onPointerUp() {
  // Intentionally does NOT clear pendingIndex: we want the pill to
  // stay put while the route transition completes, rather than
  // springing back and then forward again. pendingIndex is cleared
  // once activeIndex actually matches it (see watcher below), or by
  // the cancel handler / fallback timer if the tap didn't go through.
  pressSpring.target = 1
  ensureLoop()
}

function onPointerLeave() {
  // NOTE: on touch devices, many mobile browsers synthesize a
  // pointerleave/pointerout right after pointerup on every single
  // tap (touch has no real "hover" concept, so once the finger
  // lifts the pointer is considered to have "left" the element).
  // If we treated that as a real cancellation here, pendingIndex
  // would get cleared on *every* tap, causing the pill to snap back
  // and then jump forward again once the route actually changes.
  // So pointerleave only releases the press animation — it must NOT
  // touch pendingIndex. Genuine cancellations are handled by
  // onPointerCancel, and truly stuck taps are caught by the
  // fallback timer in onPointerDown.
  pressSpring.target = 1
  ensureLoop()
}

function onPointerCancel() {
  // A genuinely cancelled/aborted pointer interaction (common on
  // mobile: scroll, viewport shift from the URL bar, etc.) means no
  // navigation is coming — clear the optimistic state immediately
  // and let the pill snap back to the real active item.
  clearPending()
  pressSpring.target = 1
  ensureLoop()
  measureAndSetTarget(false)
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

// ---------- Watchers ----------

// مسیر عوض شد (از هر راهی: تب، لینک داخل صفحه، دکمه‌ی back)
watch(activeIndex, (val) => {
  if (pendingIndex.value !== null && val === pendingIndex.value) {
    clearPending()
  }
  nextTick(() => measureAndSetTarget(false))
})

// ناوبری شکست خورد یا لغو/تکراری شد (مثلاً guard، یا کلیک روی همون صفحه): pending نباید
// بمونه. ناوبری «cancelled» رو نادیده می‌گیریم چون یعنی ناوبری جدیدتری (تپ بعدی) جاش اومده
// و pending جدیدش باید دست‌نخورده بمونه.
const removeAfterEach = router.afterEach((_to, _from, failure) => {
  if (failure && !isNavigationFailure(failure, NavigationFailureType.cancelled)) {
    clearPending()
    nextTick(() => measureAndSetTarget(false))
  }
})

// ---------- Lifecycle ----------

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => measureAndSetTarget(true))

  // فقط وقتی اندازه‌ی خود نوار واقعاً عوض می‌شه دوباره اندازه می‌گیریم. listener روی
  // window resize حذف شد: مرورگرهای موبایل با کوچک/بزرگ شدن نوار آدرس هنگام اسکرول
  // resize می‌فرستن و پیل وسط انیمیشن به‌صورت instant می‌پرید.
  resizeObserver = new ResizeObserver(() => measureAndSetTarget(true))
  if (navRef.value) resizeObserver.observe(navRef.value)
})

onBeforeUnmount(() => {
  if (rafId != null) cancelAnimationFrame(rafId)
  clearPendingFallbackTimer()
  removeAfterEach()
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    class="fixed inset-x-0 z-40 flex justify-center px-3 md:hidden"
    style="bottom: calc(1.25rem + env(safe-area-inset-bottom));"
  >
    <nav
      ref="navRef"
      class="jelly-nav relative isolate flex w-full max-w-[330px] items-center justify-between gap-0.5 overflow-hidden rounded-full px-2 py-1.5 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.18)]"
      :aria-label="t('components.mobileBottomNav.navigation')"
    >
      <span
        ref="feedbackRef"
        class="jelly-feedback pointer-events-none absolute rounded-full"
      />

      <div
        ref="pillRef"
        class="jelly-pill pointer-events-none absolute rounded-full"
        :class="{ 'jelly-pill--hidden': pillHidden }"
      />

      <NuxtLink
        v-for="(item, index) in items"
        :key="item.to"
        :ref="(el) => setItemRef(el, index)"
        :to="item.to"
        :aria-label="t(item.label)"
        class="jelly-item relative z-10 flex items-center justify-center gap-1 rounded-full px-3.5 py-2.5 transition-colors"
        :class="index === displayActiveIndex ? 'text-white' : 'text-ink-muted hover:text-ink'"
        @pointerdown="onPointerDown(index, $event)"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
        @pointerleave="onPointerLeave"
      >
        <span class="relative flex shrink-0 items-center justify-center">
          <Icon
            :name="item.icon"
            class="size-6"
          />
          <span
            v-if="item.badge"
            class="jelly-badge absolute flex items-center justify-center rounded-full text-[10px] font-bold text-white"
          >
            {{ item.badge > 9 ? '9+' : item.badge }}
          </span>
        </span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.jelly-nav {
  background-color: rgb(255 255 255 / 0.55);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

.jelly-item {
  /* Prevents mobile browsers from turning taps into scroll/zoom
     gestures, which is what causes stray pointercancel events. */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.jelly-pill {
  z-index: 1;
  transition: opacity 0.2s ease;
  background: rgb(var(--color-primary-500));
  box-shadow:
    0 3px 10px -2px rgb(var(--color-primary-500) / 0.55),
    inset 0 1px 0 0 rgb(255 255 255 / 0.25);
  transform-origin: center;
  will-change: left, width, transform;
}

.jelly-pill--hidden {
  opacity: 0;
}

.jelly-badge {
  top: -5px;
  right: -6px;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  background: #ef4444;
  box-shadow: 0 0 0 2px rgb(255 255 255 / 0.55);
}

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