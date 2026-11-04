export type Gender = 'male' | 'female'

/** اطلاعات قابل‌ویرایش پروفایل کاربر */
export interface UserProfileData {
  name: string
  birthDate: string // YYYY-MM-DD
  gender: Gender
  phone: string
  nationalId: string
  bio?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  cover?: string
  joinedAt: string
  birthDate?: string
  gender?: Gender
  phone?: string
  nationalId?: string
  bio?: string
}

/** عکس‌های ثبت‌شده‌ی یک گیاه (برای مقایسه‌ی «قبلی / جدید» توی بررسی وضعیت) */
export interface PlantPhoto {
  id: string
  url: string
  takenAt: string
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
  photos?: PlantPhoto[]
}

export type TaskType = 'water' | 'fertilize' | 'prune' | 'repot' | 'mist'

export interface CareTask {
  id: string
  userPlantId: string
  type: TaskType
  dueDate: string
  done: boolean
}