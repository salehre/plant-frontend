import type { UserPlant } from '~/types/user.types'

export type ChatRole = 'user' | 'assistant'

/** نظر کاربر درباره‌ی جواب AI (👍 / 👎) */
export type ChatFeedback = 'up' | 'down'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  /** عکس پیوست‌شده (data URL)؛ فقط توی حافظه‌ی همین نشست نگه داشته می‌شه */
  image?: string
  /** دریافت جواب AI شکست خورده (برای نمایش دکمه‌ی تلاش دوباره) */
  failed?: boolean
  /** 👍 / 👎 که کاربر زیر جواب AI زده */
  feedback?: ChatFeedback
  /** عکسی داشته که بعد از رفرش دیگه نگه داشته نمی‌شه (فقط یه نشانگر «عکس» نشون داده می‌شه) */
  imageOmitted?: boolean
}

/** یک گفتگوی ذخیره‌شده توی تاریخچه‌ی سایدبار */
export interface ChatConversation {
  id: string
  /** خالی = هنوز عنوانی نداره (مثلاً اولین پیام فقط عکس بوده) */
  title: string
  createdAt: number
  updatedAt: number
  messages: ChatMessage[]
  plantIds?: string[]
 }

export interface AiDoctorPlantContext {
  nickname: string
  plantSlug: string
  location: string
  healthStatus: UserPlant['healthStatus']
  lastWateredAt: string | null
}

/** بدنه‌ای که برای POST /ai-doctor/chat به بک‌اند فرستاده می‌شه */
export interface AiDoctorRequest {
  messages: { role: ChatRole, content: string, image?: string }[]
  locale: 'fa' | 'en'
  plants?: AiDoctorPlantContext[]
}

/** جواب بک‌اند: متن جواب دکتر گیاه (Markdown ساده: **بولد** و لیست‌های «- » و «۱. ») */
export interface AiDoctorResponse {
  reply: string
}