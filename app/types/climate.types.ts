export interface CityClimate {
  id: string
  name: string
  province: string
  avgTemp: [number, number]
  humidity: 'low' | 'medium' | 'high'
  climateType: 'خشک' | 'معتدل' | 'مرطوب' | 'کوهستانی'
  suitablePlantSlugs: string[]
}
