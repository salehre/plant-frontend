import { getMockDiseases } from './diseases.mock'
import type { MockLocale } from './mock-locale'
import type { DiagnosisResult } from '~/types/disease.types'

/**
 * شبیه‌سازی فراخوانی مدل AI تشخیص بیماری گیاه.
 * وقتی API واقعی وصل شد فقط بدنه‌ی این تابع عوض می‌شه و نوع خروجی (DiagnosisResult) ثابت می‌مونه.
 */
export function fakeDiagnose(locale: MockLocale = 'fa'): Promise<DiagnosisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const shuffled = [...getMockDiseases(locale)].sort(() => Math.random() - 0.5)
      const [top, ...others] = shuffled
      resolve({
        candidates: [
          { disease: top!, confidence: 0.8 + Math.random() * 0.15 },
          ...others.slice(0, 2).map((disease, index) => ({
            disease,
            confidence: (index === 0 ? 0.35 : 0.15) + Math.random() * 0.15,
          })),
        ],
      })
    }, 2200)
  })
}
