import { defineStore } from 'pinia'
import type { IdentifyResult } from '~/types/identify.types'

export interface HistoryEntry {
  id: string
  timestamp: number
  image: string
  plantName: string
  scientificName: string
  confidence: number
  slug?: string
}

const MAX_ENTRIES = 50

/**
 * History = لاگ خودکار اسکن‌های Identify.
 * برخلاف Wishlist، این هیچ تصمیمی از کاربر نمی‌گیره - هر اسکنی، موفق یا ناموفق،
 * خودش این‌جا ثبت می‌شه تا جواب «قبلاً چی اسکن کرده بودم؟» رو بده.
 */
export const useHistoryStore = defineStore('history', {
  state: () => ({
    entries: useLocalStorage<HistoryEntry[]>('bargyar-scan-history', []),
  }),
  getters: {
    count: state => state.entries.length,
    /** جدیدترین اول */
    sorted: state => [...state.entries].sort((a, b) => b.timestamp - a.timestamp),
  },
  actions: {
    logScan(result: IdentifyResult) {
      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
        image: result.image,
        plantName: result.plantName,
        scientificName: result.scientificName,
        confidence: result.confidence,
        slug: result.slug,
      }
      this.entries = [entry, ...this.entries].slice(0, MAX_ENTRIES)
    },
    remove(id: string) {
      this.entries = this.entries.filter(e => e.id !== id)
    },
    clear() {
      this.entries = []
    },
  },
})
