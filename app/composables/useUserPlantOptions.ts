import { getMockPlants } from '~/services/mock/plants.mock'

export interface PlantOption {
  id: string
  nickname: string
  /** نام گونه (مثلاً مونسترا) */
  species: string
  photo: string
}

/** گیاه‌های «گیاهان من» به‌شکل ساده، برای انتخابگر چت و صفحه‌ی گیاهان دکتر گیاه */
export function useUserPlantOptions() {
  const userPlantsStore = useUserPlantsStore()
  const { locale } = useI18n()

  return computed<PlantOption[]>(() => {
    const species = new Map(
      getMockPlants(locale.value === 'fa' ? 'fa' : 'en').map(p => [p.slug, p.name]),
    )
    return userPlantsStore.plants.map(p => ({
      id: p.id,
      nickname: p.nickname,
      species: species.get(p.plantSlug) ?? '',
      photo: p.photo,
    }))
  })
}