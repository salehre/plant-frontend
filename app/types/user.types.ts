export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinedAt: string
}

export interface UserPlant {
  id: string
  plantSlug: string
  nickname: string
  photo: string
  acquiredAt: string
  location: string
  healthStatus: 'healthy' | 'needs_attention' | 'sick'
  lastWateredAt: string | null
  nextWateringAt: string | null
}

export type TaskType = 'water' | 'fertilize' | 'prune' | 'repot' | 'mist'

export interface CareTask {
  id: string
  userPlantId: string
  type: TaskType
  dueDate: string
  done: boolean
}
