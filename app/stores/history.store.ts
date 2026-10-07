import { defineStore } from 'pinia'
import type { IdentifyResult } from '~/types/identify.types'

/** حداقل چیزی که برای ثبت یک اسکن تاییدشده لازمه (نتیجه‌ی اصلی یا یکی از گونه‌های مشابه) */
export type ScanLogInput = Pick<IdentifyResult, 'plantName' | 'scientificName' | 'confidence' | 'image' | 'slug'>

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
 * History = نتیجه‌هایی از Identify که کاربر خودش با دکمه‌ی «تأیید» قبولشون کرده.
 * اسکنی که تأیید نشه این‌جا ثبت نمی‌شه.
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
    /** یک نتیجه‌ی تاییدشده رو ثبت می‌کنه و id رکورد رو برمی‌گردونه */
    logScan(result: ScanLogInput): string {
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
      return entry.id
    },
    remove(id: string) {
      this.entries = this.entries.filter(e => e.id !== id)
    },
    clear() {
      this.entries = []
    },
  },
})