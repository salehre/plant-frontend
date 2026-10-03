import { getMockPlants } from './plants.mock'
import type { MockLocale } from './mock-locale'
import type { IdentifyResult } from '~/types/identify.types'

/**
 * شبیه‌سازی فراخوانی مدل AI تشخیص گیاه.
 * در Phase 4 این تابع با فراخوانی واقعی به AI Service جایگزین می‌شود
 * بدون این‌که نوع خروجی (IdentifyResult) تغییر کند.
 */
export function fakeIdentify(locale: MockLocale = 'fa'): Promise<IdentifyResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plants = getMockPlants(locale)
      const plant = plants[Math.floor(Math.random() * plants.length)] ?? plants[0]!
      resolve({
        plantName: plant.name,
        scientificName: plant.scientificName,
        confidence: 0.82 + Math.random() * 0.15,
        image: plant.images[0] ?? '',
        slug: plant.slug,
        similarSpecies: plants
          .filter(p => p.id !== plant.id)
          .slice(0, 2)
          .map(p => ({
            name: p.name,
            scientificName: p.scientificName,
            confidence: 0.3 + Math.random() * 0.3,
            slug: p.slug,
            image: p.images[0] ?? '',
          })),
      })
    }, 2200)
  })
}