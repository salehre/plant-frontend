import type { CityClimate } from '~/types/climate.types'
import type { MockLocale } from './mock-locale'

export const mockCities: CityClimate[] = [
  {
    id: 'tehran',
    name: 'تهران',
    province: 'تهران',
    avgTemp: [8, 32],
    humidity: 'low',
    climateType: 'خشک',
    suitablePlantSlugs: ['sansevieria-trifasciata', 'aloe-vera', 'epipremnum-aureum'],
  },
  {
    id: 'rasht',
    name: 'رشت',
    province: 'گیلان',
    avgTemp: [10, 28],
    humidity: 'high',
    climateType: 'مرطوب',
    suitablePlantSlugs: ['monstera-deliciosa', 'spathiphyllum', 'ficus-lyrata'],
  },
  {
    id: 'yazd',
    name: 'یزد',
    province: 'یزد',
    avgTemp: [6, 38],
    humidity: 'low',
    climateType: 'خشک',
    suitablePlantSlugs: ['aloe-vera', 'sansevieria-trifasciata'],
  },
  {
    id: 'tabriz',
    name: 'تبریز',
    province: 'آذربایجان شرقی',
    avgTemp: [-2, 30],
    humidity: 'medium',
    climateType: 'کوهستانی',
    suitablePlantSlugs: ['epipremnum-aureum', 'sansevieria-trifasciata'],
  },
  {
    id: 'bandar-abbas',
    name: 'بندرعباس',
    province: 'هرمزگان',
    avgTemp: [18, 40],
    humidity: 'high',
    climateType: 'مرطوب',
    suitablePlantSlugs: ['monstera-deliciosa', 'spathiphyllum'],
  },
  {
    id: 'isfahan',
    name: 'اصفهان',
    province: 'اصفهان',
    avgTemp: [5, 35],
    humidity: 'low',
    climateType: 'خشک',
    suitablePlantSlugs: ['aloe-vera', 'ficus-lyrata', 'epipremnum-aureum'],
  },
]

const englishCityText: Record<string, Pick<CityClimate, 'name' | 'province' | 'climateType'>> = {
  tehran: { name: 'Tehran', province: 'Tehran', climateType: 'dry' },
  rasht: { name: 'Rasht', province: 'Gilan', climateType: 'humid' },
  yazd: { name: 'Yazd', province: 'Yazd', climateType: 'dry' },
  tabriz: { name: 'Tabriz', province: 'East Azerbaijan', climateType: 'mountainous' },
  'bandar-abbas': { name: 'Bandar Abbas', province: 'Hormozgan', climateType: 'humid' },
  isfahan: { name: 'Isfahan', province: 'Isfahan', climateType: 'dry' },
}

function localizeCity(city: CityClimate, locale: MockLocale): CityClimate {
  return {
    ...city,
    ...(locale === 'en' ? englishCityText[city.id] : undefined),
    avgTemp: [...city.avgTemp],
    suitablePlantSlugs: [...city.suitablePlantSlugs],
  }
}

export function getMockCities(locale: MockLocale = 'fa'): CityClimate[] {
  return mockCities.map(city => localizeCity(city, locale))
}

export function findCityById(id: string, locale: MockLocale = 'fa'): CityClimate | undefined {
  const city = mockCities.find(c => c.id === id)
  return city ? localizeCity(city, locale) : undefined
}
