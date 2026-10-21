import { defineStore } from 'pinia'
import type { ChatMessage } from '~/types/ai-doctor.types'
import type { MockLocale } from '~/services/mock/mock-locale'
import { askAiDoctor } from '~/services/ai-doctor.service'

let counter = 0
// با هر clear() زیاد می‌شه تا جواب‌های دیررسیده‌ی گفتگوی قبلی نادیده گرفته بشن
let epoch = 0
const uid = () => `m${Date.now().toString(36)}${(counter++).toString(36)}`

/**
 * چت «دکتر گیاه». تاریخچه‌ی گفتگو فقط توی حافظه‌ی همین نشسته (با رفرش پاک می‌شه)،
 * چون عکس‌های پیوست به‌صورت data URL هستن و توی localStorage جا نمی‌شن.
 */
export const useAiDoctorStore = defineStore('aiDoctor', {
  state: () => ({
    messages: [] as ChatMessage[],
    /** منتظر رسیدن جواب از AI هستیم (برای نشانگر «در حال نوشتن») */
    waiting: false,
    /** جواب رسیده و داره کلمه‌به‌کلمه نمایش داده می‌شه */
    revealing: false,
  }),
  getters: {
    isEmpty: state => state.messages.length === 0,
    busy: state => state.waiting || state.revealing,
  },
  actions: {
    async send(text: string, image?: string, locale: MockLocale = 'fa') {
      const content = text.trim()
      if ((!content && !image) || this.busy) return
      this.messages.push({ id: uid(), role: 'user', content, image })
      await this.requestReply(locale)
    },
    /** تلاش دوباره بعد از خطا: پیام ناموفق حذف می‌شه و همون تاریخچه دوباره فرستاده می‌شه */
    async retry(locale: MockLocale = 'fa') {
      if (this.busy) return
      this.messages = this.messages.filter(m => !m.failed)
      if (this.messages.at(-1)?.role !== 'user') return
      await this.requestReply(locale)
    },
    async requestReply(locale: MockLocale) {
      const current = epoch
      this.waiting = true
      try {
        const reply = await askAiDoctor(this.messages, locale)
        if (current !== epoch) return
        const id = uid()
        this.messages.push({ id, role: 'assistant', content: '' })
        this.waiting = false
        await this.revealReply(id, reply, current)
      }
      catch {
        if (current !== epoch) return
        this.messages.push({ id: uid(), role: 'assistant', content: '', failed: true })
      }
      finally {
        if (current === epoch) {
          this.waiting = false
          this.revealing = false
        }
      }
    },
    /** متن رو تکه‌تکه نشون می‌ده تا حس تایپ‌شدن بده؛ اگه گفتگو وسطش پاک شد، متوقف می‌شه */
    async revealReply(id: string, full: string, current: number) {
      this.revealing = true
      const tokens = full.split(/(\s+)/)
      let shown = ''
      for (let i = 0; i < tokens.length; i += 2) {
        shown += tokens.slice(i, i + 2).join('')
        if (current !== epoch) return
        const message = this.messages.find(m => m.id === id)
        if (!message) return
        message.content = shown
        await new Promise(resolve => setTimeout(resolve, 28))
      }
    },
    clear() {
      epoch++
      this.messages = []
      this.waiting = false
      this.revealing = false
    },
  },
})
