/**
 * عکس رو کوچیک می‌کنه (بلندترین ضلع حداکثر maxSide) و به data URL تبدیل می‌کنه،
 * تا عکس‌های چندمگابایتی توی localStorage جا بشن.
 */
export async function resizeImageToDataUrl(file: File, maxSide = 900, quality = 0.82): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('image-load-failed'))
      image.src = objectUrl
    })
    const longest = Math.max(img.naturalWidth, img.naturalHeight)
    if (!longest) throw new Error('image-empty')

    const scale = Math.min(1, maxSide / longest)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('canvas-unsupported')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const webp = canvas.toDataURL('image/webp', quality)
    return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', quality)
  }
  finally {
    URL.revokeObjectURL(objectUrl)
  }
}
