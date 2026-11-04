import { checkupMock } from './mock/plant-checkup.mock'
import { useApiClient } from './api/client'
import type { PlantCheckupRequest, PlantCheckupResult } from '~/types/checkup.types'

/**
 * مرز رسمی بین Mock و AI واقعی برای «بررسی وضعیت گیاه».
 * وقتی Backend آماده شد: POST /user-plants/:id/checkup با بدنه‌ی PlantCheckupRequest
 * و خروجی PlantCheckupResult؛ فقط `useMockApi` رو false کن.
 */
export async function checkPlantHealth(req: PlantCheckupRequest): Promise<PlantCheckupResult> {
  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay(1600)
    return checkupMock(req.newPhoto.length)
  }
  const { post } = useApiClient()
  const { plantId, ...body } = req
  return post<PlantCheckupResult>(`/user-plants/${plantId}/checkup`, body)
}
