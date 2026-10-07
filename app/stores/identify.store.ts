import { defineStore } from 'pinia'
import type { IdentifyResult, IdentifyStatus } from '~/types/identify.types'
import type { ScanLogInput } from '~/stores/history.store'
import type { MockLocale } from '~/services/mock/mock-locale'
import { fakeIdentify } from '~/services/mock/identify.mock'

export const useIdentifyStore = defineStore('identify', {
  state: () => ({
    status: 'idle' as IdentifyStatus,
    previewUrl: '' as string,
    result: null as IdentifyResult | null,
    error: '' as string,
    // نتیجه‌ای که کاربر تأیید کرده (scientificName) و id رکوردش در تاریخچه
    confirmedScientificName: '' as string,
    confirmedEntryId: '' as string,
  }),
  getters: {
    /** آیا این نتیجه الان تأیید شده؟ (اگه رکوردش از تاریخچه پاک شده باشه، تأییدشده حساب نمی‌شه) */
    isConfirmed: state => (scientificName: string) =>
        !!state.confirmedEntryId
        && state.confirmedScientificName === scientificName
        && useHistoryStore().entries.some(e => e.id === state.confirmedEntryId),
  },
  actions: {
    setPreview(url: string) {
      this.previewUrl = url
      this.result = null
      this.status = 'idle'
      this.error = ''
      this.clearConfirmation()
    },
    clearConfirmation() {
      this.confirmedScientificName = ''
      this.confirmedEntryId = ''
    },
    /**
     * تأیید / لغو تأیید یک نتیجه. فقط یک نتیجه می‌تونه تأیید بشه:
     * تأیید یه نتیجه‌ی دیگه، تأیید قبلی رو از تاریخچه برمی‌داره و این یکی رو جاش می‌ذاره.
     * عکس خودِ کاربر (previewUrl) نگه داشته می‌شه، نه عکس استوک گونه‌ی تشخیص‌داده‌شده.
     * خروجی: true یعنی تأیید شد، false یعنی تأیید لغو شد.
     */
    toggleConfirm(candidate: ScanLogInput): boolean {
      const history = useHistoryStore()
      const wasThis = this.isConfirmed(candidate.scientificName)
      if (this.confirmedEntryId) history.remove(this.confirmedEntryId)
      this.clearConfirmation()
      if (wasThis) return false
      this.confirmedEntryId = history.logScan({ ...candidate, image: this.previewUrl || candidate.image })
      this.confirmedScientificName = candidate.scientificName
      return true
    },
    async runIdentify(locale: MockLocale = 'fa') {
      if (!this.previewUrl) return
      this.status = 'analyzing'
      this.clearConfirmation()
      try {
        this.result = await fakeIdentify(locale)
        this.status = 'done'
        // دیگه خودکار تو History ثبت نمی‌شه؛ فقط وقتی کاربر یه نتیجه رو تأیید کنه (toggleConfirm)
      }
      catch {
        this.status = 'error'
        this.error = 'identify.errors.analysisFailed'
      }
    },
    reset() {
      this.status = 'idle'
      this.previewUrl = ''
      this.result = null
      this.error = ''
      this.clearConfirmation()
    },
  },
})