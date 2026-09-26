export type LightLevel = 'low' | 'medium' | 'high' | 'direct'
export type WaterLevel = 'low' | 'medium' | 'high'
export type HumidityLevel = 'low' | 'medium' | 'high'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface PlantCare {
  light: LightLevel
  water: WaterLevel
  temperatureRange: [number, number]
  soil: string
  humidity: HumidityLevel
  wateringFrequencyDays: number
}

export interface PlantToxicity {
  isToxic: boolean
  toxicTo: ('human' | 'cat' | 'dog')[]
}

export interface Plant {
  id: string
  slug: string
  name: string
  scientificName: string
  /** خانواده‌ی تاکسونومیک، مثلاً Araceae — پایه‌ی فیلتر Explore */
  family: string
  /** جنس تاکسونومیک، مثلاً Monstera */
  genus: string
  images: string[]
  description: string
  care: PlantCare
  toxicity: PlantToxicity
  commonIssues: string[]
  category: string
  difficulty: Difficulty
}

export interface PlantSummary {
  id: string
  slug: string
  name: string
  scientificName: string
  family: string
  genus: string
  image: string
  category: string
  difficulty: Difficulty
}
