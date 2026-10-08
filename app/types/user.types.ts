export type Gender = 'male' | 'female'

/** اطلاعات قابل‌ویرایش پروفایل کاربر */
export interface UserProfileData {
  name: string
  birthDate: string // YYYY-MM-DD
  gender: Gender
  phone: string
  nationalId: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinedAt: string
  birthDate?: string
  gender?: Gender
  phone?: string
  nationalId?: string
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