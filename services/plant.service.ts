import { mockPlants, findPlantBySlug, searchPlants, listFamilies, listGenera } from './mock/plants.mock'
import { useApiClient } from './api/client'
import type { Plant } from '~/types/plant.types'

/**
 * هر تابع این فایل، مرز رسمی بین Mock Data و Laravel API واقعی است.
 * وقتی Backend آماده شد، فقط بدنه‌ی شرط `useMockApi` حذف و مسیر واقعی جایگزین می‌شود.
 */

export async function getPlantList(
  query = '',
  category = '',
  difficulty = '',
  light = '',
  family = '',
  genus = '',
): Promise<Plant[]> {
  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay()
    return searchPlants(query, category, difficulty, light, family, genus)
  }
  const { get } = useApiClient()
  return get<Plant[]>(
    `/plants?q=${query}&category=${category}&difficulty=${difficulty}&light=${light}&family=${family}&genus=${genus}`,
  )
}

export async function getFilterOptions(family = ''): Promise<{ families: string[], genera: string[] }> {
  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay(100)
    return { families: listFamilies(), genera: listGenera(family) }
  }
  const { get } = useApiClient()
  return get<{ families: string[], genera: string[] }>(`/plants/filter-options?family=${family}`)
}

export async function getPlantBySlug(slug: string): Promise<Plant | undefined> {
  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay(300)
    return findPlantBySlug(slug)
  }
  const { get } = useApiClient()
  return get<Plant>(`/plants/${slug}`)
}

export async function getFeaturedPlants(): Promise<Plant[]> {
  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay(200)
    return mockPlants.slice(0, 4)
  }
  const { get } = useApiClient()
  return get<Plant[]>('/plants/featured')
}

/** برای رزولوکردن لیست Wishlist (که فقط slug نگه می‌داره) به آبجکت کامل گیاه */
export async function getPlantsBySlugs(slugs: string[]): Promise<Plant[]> {
  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay(150)
    return mockPlants.filter(p => slugs.includes(p.slug))
  }
  const { get } = useApiClient()
  return get<Plant[]>(`/plants/by-slugs?slugs=${slugs.join(',')}`)
}
