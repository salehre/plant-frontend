import type { PlantSummary } from '~/types/plant.types'

export type FinderQuestionId = 'place' | 'light' | 'watering' | 'experience' | 'pets'

/** جواب هر سؤال = value گزینه‌ی انتخاب‌شده (مثلاً { light: 'low', pets: 'safe' }) */
export type FinderAnswers = Partial<Record<FinderQuestionId, string>>

export interface FinderOption {
  value: string
  icon: string
}

export interface FinderQuestion {
  id: FinderQuestionId
  icon: string
  options: FinderOption[]
}

/**
 * خروجی استاندارد پیشنهاد گیاه — مرز بین Mock و AI واقعی.
 * AI سرویس هم باید دقیقاً همین شکل رو برگردونه:
 *  - matchedOn: کدوم سؤال‌ها با این گیاه جور شدن (UI ازش چیپ نشون می‌ده)
 *  - reason: توضیح متنی اختیاری؛ اگه AI پر کنه، به‌جای چیپ‌ها نمایش داده می‌شه
 */
export interface PlantSuggestion {
  plant: PlantSummary
  /** ۰ تا ۱۰۰ */
  matchScore: number
  matchedOn: FinderQuestionId[]
  reason?: string
}
