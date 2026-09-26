import type { CityClimate } from '~/types/climate.types'

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

export function findCityById(id: string): CityClimate | undefined {
  return mockCities.find(c => c.id === id)
}
