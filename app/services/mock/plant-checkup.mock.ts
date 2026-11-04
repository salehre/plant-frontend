import type { PlantCheckupResult } from '~/types/checkup.types'

const outcomes: PlantCheckupResult[] = [
  { verdict: 'improving', leaves: 'healthier', disease: 'none', action: 'none', nextStep: 'monitorSoil', confidence: 0.92 },
  { verdict: 'stable', leaves: 'same', disease: 'none', action: 'none', nextStep: 'checkLight', confidence: 0.88 },
  { verdict: 'needs_review', leaves: 'same', disease: 'suspected', action: 'soon', nextStep: 'adjustWatering', confidence: 0.81 },
  { verdict: 'declining', leaves: 'worse', disease: 'suspected', action: 'urgent', nextStep: 'inspectLeaves', confidence: 0.85 },
]

/** نتیجه‌ی نمونه؛ برای هر عکس یک خروجی ثابت (بر اساس حجم عکس) تا تست‌کردن حالت‌ها راحت باشه */
export function checkupMock(seed: number): PlantCheckupResult {
  return outcomes[Math.abs(seed) % outcomes.length]!
}
