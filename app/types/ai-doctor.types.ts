export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  /** عکس پیوست‌شده (data URL)؛ فقط توی حافظه‌ی همین نشست نگه داشته می‌شه */
  image?: string
  /** دریافت جواب AI شکست خورده (برای نمایش دکمه‌ی تلاش دوباره) */
  failed?: boolean
}

/** بدنه‌ای که برای POST /ai-doctor/chat به بک‌اند فرستاده می‌شه */
export interface AiDoctorRequest {
  messages: { role: ChatRole, content: string, image?: string }[]
  locale: 'fa' | 'en'
}

/** جواب بک‌اند: متن جواب دکتر گیاه (Markdown ساده: **بولد** و لیست‌های «- » و «۱. ») */
export interface AiDoctorResponse {
  reply: string
}
