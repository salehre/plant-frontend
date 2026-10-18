const MAX_INPUT_SIZE = 5 * 1024 * 1024 // ۵ مگابایت (قبل از فشرده‌سازی)
const COVER_WIDTH = 1200 // خروجی نهایی: ۱۲۰۰×۴۰۰ (نسبت ۳:۱)
const COVER_HEIGHT = 400

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image-load-failed'))
    }
    img.src = url
  })
}

/**
 * عکس رو وسط‌چین با نسبت ۳:۱ برش می‌ده و به ۱۲۰۰×۴۰۰ کوچیک می‌کنه
 * تا حجمش برای ذخیره توی localStorage کم باشه.
 */
async function toCoverDataUrl(file: File): Promise<string> {
  const img = await loadImage(file)
  const { naturalWidth: w, naturalHeight: h } = img
  if (!w || !h) throw new Error('image-empty')

  const targetRatio = COVER_WIDTH / COVER_HEIGHT
  let sw = w
  let sh = w / targetRatio
  if (sh > h) {
    sh = h
    sw = h * targetRatio
  }
  const sx = (w - sw) / 2
  const sy = (h - sh) / 2

  const canvas = document.createElement('canvas')
  canvas.width = COVER_WIDTH
  canvas.height = COVER_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas-unsupported')

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, COVER_WIDTH, COVER_HEIGHT)

  const webp = canvas.toDataURL('image/webp', 0.8)
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.8)
}

export function useCoverUpload() {
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  const { t } = useI18n()
  const processing = ref(false)

  async function pick(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    input.value = '' // تا انتخاب دوباره‌ی همون فایل هم کار کنه
    if (!file) return

    if (!file.type.startsWith('image/')) {
      uiStore.showToast(t('pages.profile.avatarInvalid'), 'error')
      return
    }
    if (file.size > MAX_INPUT_SIZE) {
      uiStore.showToast(t('pages.profile.avatarTooLarge'), 'error')
      return
    }

    processing.value = true
    try {
      const dataUrl = await toCoverDataUrl(file)
      if (authStore.setCover(dataUrl)) {
        uiStore.showToast(t('pages.profile.coverUpdated'))
      }
      else if (authStore.error) {
        uiStore.showToast(t(authStore.error), 'error')
      }
    }
    catch {
      uiStore.showToast(t('pages.profile.avatarFailed'), 'error')
    }
    finally {
      processing.value = false
    }
  }

  function remove() {
    if (authStore.setCover(null)) {
      uiStore.showToast(t('pages.profile.coverRemoved'))
    }
  }

  return { processing, pick, remove }
}