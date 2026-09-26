import { mockPlants } from './plants.mock'
import type { IdentifyResult } from '~/types/identify.types'

/**
 * شبیه‌سازی فراخوانی مدل AI تشخیص گیاه.
 * در Phase 4 این تابع با فراخوانی واقعی به AI Service جایگزین می‌شود
 * بدون این‌که نوع خروجی (IdentifyResult) تغییر کند.
 */
export function fakeIdentify(): Promise<IdentifyResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plant = mockPlants[Math.floor(Math.random() * mockPlants.length)] ?? mockPlants[0]!
      resolve({
        plantName: plant.name,
        scientificName: plant.scientificName,
        confidence: 0.82 + Math.random() * 0.15,
        image: plant.images[0] ?? '',
        slug: plant.slug,
        similarSpecies: mockPlants
          .filter(p => p.id !== plant.id)
          .slice(0, 2)
          .map(p => ({
            name: p.name,
            scientificName: p.scientificName,
            confidence: 0.3 + Math.random() * 0.3,
          })),
      })
    }, 2200)
  })
}
