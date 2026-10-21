import { defineStore } from 'pinia'
import type { TaskType } from '~/types/user.types'

export type ActivityType = 'scan' | 'plant_added' | 'task_done'

export interface ActivityEntry {
  id: string
  type: ActivityType
  timestamp: number
  /** نام گیاه: نام شناسایی‌شده (scan) یا نام مستعار گیاه توی باغچه (plant_added / task_done) */
  title: string
  image?: string
  slug?: string
  /** فقط برای scan */
  confidence?: number
  /** فقط برای task_done */
  taskType?: TaskType
}

export type ActivityInput = Omit<ActivityEntry, 'id' | 'timestamp'>

const MAX_ENTRIES = 100

/**
 * لاگ فعالیت‌های کاربر: اسکن‌ها، اضافه‌شدن گیاه به باغچه و انجام تسک‌ها.
 * ثبت از داخل اکشن‌های استورها انجام می‌شه، پس هر جایی از اپ که اون اکشن‌ها صدا زده بشن لاگ می‌شن.
 */
export const useActivityStore = defineStore('activity', {
  state: () => ({
    entries: useLocalStorage<ActivityEntry[]>('Golban-activity-log', []),
  }),
  getters: {
    count: state => state.entries.length,
    /** جدیدترین اول */
    sorted: state => [...state.entries].sort((a, b) => b.timestamp - a.timestamp),
  },
  actions: {
    log(input: ActivityInput) {
      const entry: ActivityEntry = {
        ...input,
        // عکس blob/data بعد از رفرش از بین می‌ره و localStorage رو هم سنگین می‌کنه
        image: input.image && !/^(blob|data):/.test(input.image) ? input.image : undefined,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
      }
      this.entries = [entry, ...this.entries].slice(0, MAX_ENTRIES)
    },
    clear() {
      this.entries = []
    },
  },
})