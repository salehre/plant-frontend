const MAX_INPUT_SIZE = 5 * 1024 * 1024 // ۵ مگابایت (قبل از فشرده‌سازی)
const AVATAR_SIZE = 256 // خروجی نهایی: مربع ۲۵۶×۲۵۶

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
 * عکس رو وسط‌چین و مربعی برش می‌ده و به ۲۵۶×۲۵۶ کوچیک می‌کنه تا به‌جای چند مگابایت،
 * چند ده کیلوبایت توی localStorage ذخیره بشه.
 */
async function toAvatarDataUrl(file: File): Promise<string> {
  const img = await loadImage(file)
  const side = Math.min(img.naturalWidth, img.naturalHeight)
  if (!side) throw new Error('image-empty')

  const canvas = document.createElement('canvas')
  canvas.width = AVATAR_SIZE
  canvas.height = AVATAR_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas-unsupported')

  const sx = (img.naturalWidth - side) / 2
  const sy = (img.naturalHeight - side) / 2
  ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE)

  const webp = canvas.toDataURL('image/webp', 0.85)
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.85)
}

export function useAvatarUpload() {
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
      const dataUrl = await toAvatarDataUrl(file)
      if (authStore.setAvatar(dataUrl)) {
        uiStore.showToast(t('pages.profile.avatarUpdated'))
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

  return { processing, pick }
}