import { aiDoctorReplyMock } from './mock/ai-doctor.mock'
import { useApiClient } from './api/client'
import type { MockLocale } from './mock/mock-locale'
import type { AiDoctorRequest, AiDoctorResponse, ChatMessage } from '~/types/ai-doctor.types'

/** فقط آخرین پیام‌ها برای مدل فرستاده می‌شه تا درخواست بزرگ نشه */
const MAX_HISTORY = 20

/**
 * مرز رسمی بین Mock و AI واقعی برای «دکتر گیاه».
 * وقتی AI آماده شد:
 *  - بک‌اند باید روی POST /ai-doctor/chat بدنه‌ی AiDoctorRequest (types/ai-doctor.types.ts) رو بگیره
 *    و { reply: string } برگردونه.
 *  - اینجا فقط کافیه `useMockApi` رو false کنی؛ هیچ تغییری توی store و کامپوننت‌ها لازم نیست.
 *  - اگه بک‌اند استریم کرد، فقط همین تابع و revealReply توی store عوض می‌شه.
 */
export async function askAiDoctor(history: ChatMessage[], locale: MockLocale = 'fa'): Promise<string> {
  const messages = history
    .filter(m => !m.failed && (m.content || m.image))
    .slice(-MAX_HISTORY)
    .map(m => ({ role: m.role, content: m.content, ...(m.image ? { image: m.image } : {}) }))

  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay(1200)
    const last = messages.filter(m => m.role === 'user').at(-1)
    return aiDoctorReplyMock(last?.content ?? '', !!last?.image, locale)
  }
  const { post } = useApiClient()
  const body: AiDoctorRequest = { messages, locale }
  const res = await post<AiDoctorResponse>('/ai-doctor/chat', body as unknown as Record<string, unknown>)
  return res.reply
}
