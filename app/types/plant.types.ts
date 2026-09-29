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

// ============ دیتای غنی صفحه‌ی جزئیات (بر اساس طرح testdetail.vue) ============

export interface PlantGalleryImage {
  thumb: string
  full: string
  title: string
}

export interface PlantChemicalCompound {
  name: string
  amount: string
}

export interface PlantChemicalCategory {
  name: string
  total: string
  compounds: PlantChemicalCompound[]
}

export interface PlantTaxonomy {
  kingdom: string
  division: string
  class: string
  order: string
  family: string
  genus: string
  species: string
  subspecies: string
  authority: string
}

export interface PlantMorphology {
  plantType: string
  leaf: string
  flower: string
  stem: string
  root: string
  fruit: string
  seed: string
  bark: string
  latex: string
}

export interface PlantGrowthNeeds {
  light: string
  water: string
  soil: string
  temperature: string
  growthAltitude: string
}

export interface PlantApplications {
  food: string[]
  industrial: string[]
  therapeutic: string[]
}

export interface PlantLocalName {
  name: string
  region: string
}

export interface PlantQuickStat {
  label: string
  value: string
}

export interface PlantDetail {
  slug: string
  /** عکس دایره‌ای هدر */
  image: string
  gallery: PlantGalleryImage[]
  taxonomy: PlantTaxonomy
  morphology: PlantMorphology
  chemicalCompounds: {
    majorCompound: string
    categories: PlantChemicalCategory[]
  }
  growthNeeds: PlantGrowthNeeds
  applications: PlantApplications
  /** متن توصیفی سمیت (مستقل از toxicity.isToxic ساده‌ی Plant) */
  toxicityText: string
  /** برچسب کوتاه برای دکمه‌ی هدر، مثلاً «وضعیت پایدار» */
  conservationBadge: string
  /** متن کامل توضیحی برای بخش «حفاظت» */
  conservationStatus: string
  localNames: PlantLocalName[]
  scientificSynonyms: string[]
  fossilPeriod: string
  plantStory: string
  quickStats: PlantQuickStat[]
}