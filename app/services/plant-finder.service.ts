import { suggestPlantsMock } from './mock/plant-finder.mock'
import { useApiClient } from './api/client'
import type { MockLocale } from './mock/mock-locale'
import type { FinderAnswers, PlantSuggestion } from '~/types/plant-finder.types'

/**
 * مرز رسمی بین Mock و AI واقعی برای «پیدا کردن گیاه».
 * وقتی AI آماده شد:
 *  - بک‌اند باید روی POST /plants/suggest بدنه‌ی { answers, locale } رو بگیره
 *    و آرایه‌ای از PlantSuggestion (types/plant-finder.types.ts) برگردونه.
 *  - اینجا فقط کافیه `useMockApi` رو false کنی؛ هیچ تغییری توی store و کامپوننت لازم نیست.
 */
export async function getPlantSuggestions(
  answers: FinderAnswers,
  locale: MockLocale = 'fa',
): Promise<PlantSuggestion[]> {
  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay(1400)
    return suggestPlantsMock(answers, locale)
  }
  const { post } = useApiClient()
  return post<PlantSuggestion[]>('/plants/suggest', { answers, locale })
}
