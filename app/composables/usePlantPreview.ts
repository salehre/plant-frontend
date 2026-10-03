import type { MaybeRefOrGetter } from 'vue'
import type { Plant } from '~/types/plant.types'
import type { MockLocale } from '~/services/mock/mock-locale'
import { getPlantBySlug } from '~/services/plant.service'
import { findPlantDetailBySlug } from '~/services/mock/plant-details.mock'

/**
 * منطق مشترک بخش بازشونده‌ی PlantResultCard:
 * اطلاعات گیاه (Plant + PlantDetail) رو از روی slug، فقط یک بار و در لحظه‌ی نیاز (lazy) می‌گیره.
 * اگه صفحه از قبل خود Plant رو داشته (مثلاً Wishlist)، همون رو به‌عنوان `initial` بده تا درخواست اضافه نره.
 */
export function usePlantPreview(
  slug: MaybeRefOrGetter<string | undefined>,
  initial: Plant | null | undefined,
  locale: MaybeRefOrGetter<MockLocale>,
) {
  const plant = ref<Plant | null>(initial ?? null)
  const loading = ref(false)
  let requested = !!initial
  let requestId = 0

  const detail = computed(() => {
    const s = toValue(slug)
    return s ? findPlantDetailBySlug(s, toValue(locale)) : undefined
  })

  async function load(force = false) {
    const s = toValue(slug)
    if ((requested && !force) || !s) return
    requested = true
    const currentRequest = ++requestId
    loading.value = true
    try {
      const result = (await getPlantBySlug(s, toValue(locale))) ?? null
      if (currentRequest === requestId) plant.value = result
    }
    finally {
      if (currentRequest === requestId) loading.value = false
    }
  }

  watch(
    () => toValue(locale),
    () => {
      if (requested) void load(true)
    },
  )

  return { plant, detail, loading, load }
}