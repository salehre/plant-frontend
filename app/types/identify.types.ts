export interface SimilarSpecies {
  name: string
  scientificName: string
  confidence: number
  slug?: string
  image?: string
}

export interface IdentifyResult {
  plantName: string
  scientificName: string
  confidence: number
  image: string
  similarSpecies: SimilarSpecies[]
  slug?: string
}

export interface DiseaseDetectionResult {
  diseaseName: string
  confidence: number
  severity: 'low' | 'medium' | 'high'
  description: string
  treatmentSteps: string[]
}

export type IdentifyStatus = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error'