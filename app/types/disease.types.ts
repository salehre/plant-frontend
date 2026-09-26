export type DiseaseCategory = 'fungal' | 'pest' | 'nutrient' | 'environmental'

export interface Disease {
  id: string
  slug: string
  name: string
  category: DiseaseCategory
  symptoms: string[]
  causes: string[]
  treatment: string[]
  image: string
  severity: 'low' | 'medium' | 'high'
}
