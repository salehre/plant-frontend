import { defineStore } from 'pinia'
import type { IdentifyResult, IdentifyStatus } from '~/types/identify.types'
import { fakeIdentify } from '~/services/mock/identify.mock'

export const useIdentifyStore = defineStore('identify', {
  state: () => ({
    status: 'idle' as IdentifyStatus,
    previewUrl: '' as string,
    result: null as IdentifyResult | null,
    error: '' as string,
  }),
  actions: {
    setPreview(url: string) {
      this.previewUrl = url
      this.result = null
      this.status = 'idle'
      this.error = ''
    },
    async runIdentify() {
      if (!this.previewUrl) return
      this.status = 'analyzing'
      try {
        this.result = await fakeIdentify()
        this.status = 'done'
        // History خودکاره: هر اسکن موفق بدون تصمیمی از کاربر ثبت می‌شه.
        // عکس خودِ کاربر (previewUrl) رو نگه می‌داریم، نه عکس استوک گونه‌ی تشخیص‌داده‌شده.
        useHistoryStore().logScan({ ...this.result, image: this.previewUrl || this.result.image })
      }
      catch {
        this.status = 'error'
        this.error = 'مشکلی در تحلیل تصویر پیش آمد. دوباره تلاش کن.'
      }
    },
    reset() {
      this.status = 'idle'
      this.previewUrl = ''
      this.result = null
      this.error = ''
    },
  },
})
