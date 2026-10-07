import type { InjectionKey, Ref } from 'vue'

export interface ComparePair {
  from: string
  to: string
}

/** فاصله‌ی برآمدگی منحنی از ستون چک‌باکس‌ها (px) */
const BULGE = 22
/** کمتر از این مقدار جابه‌جایی = کلیک، نه drag (px) */
const CLICK_THRESHOLD = 6

/**
 * منطق وصل کردن دو نتیجه برای مقایسه:
 *  - از چک‌باکس کنار هر کارت drag می‌کنی و روی نتیجه‌ی دیگه رها می‌کنی → خط وصل می‌شه
 *  - جایگزین بدون drag (موبایل / کیبورد): کلیک روی یه چک‌باکس و بعد کلیک روی چک‌باکس دومی
 *  - فقط یک جفت هم‌زمان؛ وصل کردن جفت جدید، قبلی رو جایگزین می‌کنه
 *
 * بعد از وصل شدن، `line` مسیر SVG و نقطه‌ی وسط خط رو می‌ده تا آیکن مقایسه اون‌جا بیاد.
 * آیتم‌هایی که slug ندارن (مقایسه‌ناپذیر) قابل انتخاب نیستن.
 */
export function useCompareLink(
  container: Ref<HTMLElement | null>,
  getSlug: (id: string) => string | undefined,
) {
  const pair = ref<ComparePair | null>(null)
  const pendingId = ref('')
  const dragFromId = ref('')
  const hoverId = ref('')
  const pointer = ref<{ x: number, y: number } | null>(null)
  // با هر تغییر چیدمان (resize، باز و بسته شدن کارت) زیاد می‌شه تا خط دوباره محاسبه بشه
  const layoutTick = ref(0)

  let resizeObserver: ResizeObserver | null = null
  let stopDrag: (() => void) | null = null

  function relayout() {
    layoutTick.value++
  }

  function handleCenter(id: string) {
    const root = container.value
    if (!root) return null
    const el = root.querySelector<HTMLElement>(`[data-compare-handle="${CSS.escape(id)}"]`)
    if (!el) return null
    const r = el.getBoundingClientRect()
    const c = root.getBoundingClientRect()
    return { x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height / 2 }
  }

  /** خط وصل‌شده: مسیر منحنی + نقطه‌ی وسطش (محل آیکن مقایسه) */
  const line = computed(() => {
    void layoutTick.value
    const p = pair.value
    if (!p) return null
    const a = handleCenter(p.from)
    const b = handleCenter(p.to)
    if (!a || !b) return null
    const width = container.value?.clientWidth ?? 0
    const dir = a.x > width / 2 ? 1 : -1
    const bulge = dir * BULGE
    return {
      d: `M ${a.x} ${a.y} C ${a.x + bulge} ${a.y}, ${b.x + bulge} ${b.y}, ${b.x} ${b.y}`,
      // نقطه‌ی t=0.5 منحنی بزیه
      mid: { x: (a.x + b.x) / 2 + 0.75 * bulge, y: (a.y + b.y) / 2 },
    }
  })

  /** خط نقطه‌چین موقع drag: از چک‌باکس مبدا تا مکان فعلی موس/انگشت */
  const dragLine = computed(() => {
    void layoutTick.value
    if (!dragFromId.value || !pointer.value) return ''
    const a = handleCenter(dragFromId.value)
    if (!a) return ''
    return `M ${a.x} ${a.y} L ${pointer.value.x} ${pointer.value.y}`
  })

  const compareUrl = computed(() => {
    const p = pair.value
    if (!p) return ''
    const a = getSlug(p.from)
    const b = getSlug(p.to)
    // from=identify یعنی صفحه‌ی مقایسه می‌دونه کاربر از نتایج تشخیص اومده
    return a && b ? `/compare/${a}/${b}?from=identify` : ''
  })

  function isChecked(id: string) {
    return pair.value?.from === id
      || pair.value?.to === id
      || pendingId.value === id
      || dragFromId.value === id
  }

  function clear() {
    pair.value = null
    pendingId.value = ''
  }

  /** حالت کلیک (بدون drag) */
  function toggle(id: string) {
    if (!getSlug(id)) return
    if (pair.value && (pair.value.from === id || pair.value.to === id)) {
      clear()
      return
    }
    if (!pendingId.value) {
      pendingId.value = id
      return
    }
    if (pendingId.value === id) {
      pendingId.value = ''
      return
    }
    pair.value = { from: pendingId.value, to: id }
    pendingId.value = ''
  }

  /** شروع drag از چک‌باکس؛ اگه جابه‌جایی کم بود همون کلیک حساب می‌شه */
  function start(id: string, e: PointerEvent) {
    if (!getSlug(id)) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const root = container.value
    if (!root) return
    e.preventDefault()

    const startX = e.clientX
    const startY = e.clientY
    let moved = false
    dragFromId.value = id

    function onMove(ev: PointerEvent) {
      if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < CLICK_THRESHOLD) return
      moved = true
      const rect = root!.getBoundingClientRect()
      pointer.value = { x: ev.clientX - rect.left, y: ev.clientY - rect.top }
      const target = document.elementFromPoint(ev.clientX, ev.clientY)
        ?.closest<HTMLElement>('[data-compare-id]')
        ?.dataset.compareId ?? ''
      hoverId.value = target && target !== id && getSlug(target) ? target : ''
    }

    function finish(cancelled: boolean) {
      stopDrag?.()
      const target = hoverId.value
      dragFromId.value = ''
      hoverId.value = ''
      pointer.value = null
      if (cancelled) return
      if (!moved) {
        toggle(id)
        return
      }
      if (target) {
        pair.value = { from: id, to: target }
        pendingId.value = ''
      }
    }

    const onUp = () => finish(false)
    const onCancel = () => finish(true)

    stopDrag = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      stopDrag = null
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
  }

  onMounted(() => {
    relayout()
    if (container.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(relayout)
      resizeObserver.observe(container.value)
    }
    window.addEventListener('resize', relayout)
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    window.removeEventListener('resize', relayout)
    stopDrag?.()
  })

  return reactive({
    pair,
    pendingId,
    dragFromId,
    hoverId,
    line,
    dragLine,
    compareUrl,
    isChecked,
    clear,
    toggle,
    start,
  })
}

export type CompareLinkApi = ReturnType<typeof useCompareLink>

export const compareLinkKey: InjectionKey<CompareLinkApi> = Symbol('compare-link')