export type CheckupVerdict = 'improving' | 'stable' | 'needs_review' | 'declining'
export type CheckupLeaves = 'healthier' | 'same' | 'worse'
export type CheckupDisease = 'none' | 'suspected'
export type CheckupAction = 'none' | 'soon' | 'urgent'
export type CheckupNextStep = 'monitorSoil' | 'checkLight' | 'adjustWatering' | 'inspectLeaves'

/** خروجی مقایسه‌ی عکس قبلی و جدید یک گیاه (متن‌ها از i18n و با همین کلیدها ساخته می‌شن) */
export interface PlantCheckupResult {
  verdict: CheckupVerdict
  leaves: CheckupLeaves
  disease: CheckupDisease
  action: CheckupAction
  nextStep: CheckupNextStep
  /** بین ۰ تا ۱ */
  confidence: number
}

export interface PlantCheckupRequest {
  plantId: string
  previousPhoto: string
  newPhoto: string
  locale: 'fa' | 'en'
}
