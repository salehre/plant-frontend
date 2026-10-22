import { defineStore } from 'pinia'
import type { ChatConversation, ChatFeedback, ChatMessage } from '~/types/ai-doctor.types'
import type { UserPlant } from '~/types/user.types'
import type { MockLocale } from '~/services/mock/mock-locale'
import { askAiDoctor } from '~/services/ai-doctor.service'

let counter = 0
// با هر newChat() / select() / stop() / remove() زیاد می‌شه تا جواب‌های دیررسیده نادیده گرفته بشن
let epoch = 0
const uid = () => `m${Date.now().toString(36)}${(counter++).toString(36)}`

const MAX_CONVERSATIONS = 50
const MAX_TITLE = 40

/**
 * موقع ذخیره توی localStorage: پیام‌های ناموفق و خالی حذف می‌شن و عکس‌ها (data URL، سنگین)
 * ذخیره نمی‌شن؛ به‌جاشون فقط یه نشانگر `imageOmitted` می‌مونه.
 */
function serialize(list: ChatConversation[]): string {
  return JSON.stringify(list.map(c => ({
    ...c,
    messages: c.messages
      .filter(m => !m.failed && (m.content || m.image || m.imageOmitted))
      .map(m => (m.image ? { ...m, image: undefined, imageOmitted: true } : m)),
  })))
}

/**
 * چت «دکتر گیاه» با تاریخچه‌ی گفتگوها (سایدبار). گفتگوها روی همین دستگاه (localStorage) می‌مونن.
 * activeId = null یعنی «گفتگوی جدید» که تا اولین پیام ساخته نمی‌شه (گفتگوی خالی ذخیره نمی‌شه).
 */
export const useAiDoctorStore = defineStore('aiDoctor', {
  state: () => ({
    conversations: useLocalStorage<ChatConversation[]>('golban-ai-doctor-chats', [], {
      serializer: { read: raw => JSON.parse(raw) as ChatConversation[], write: serialize },
    }),
    activeId: null as string | null,
    pendingPlantIds: [] as string[],
    /** منتظر رسیدن جواب از AI هستیم (برای نشانگر «در حال نوشتن») */
    waiting: false,
    /** جواب رسیده و داره کلمه‌به‌کلمه نمایش داده می‌شه */
    revealing: false,
  }),
  getters: {
    active(state): ChatConversation | null {
      return state.conversations.find(c => c.id === state.activeId) ?? null
    },
    /** پیام‌های گفتگوی فعلی */
    messages(): ChatMessage[] {
      return this.active?.messages ?? []
    },
    isEmpty(): boolean {
      return this.messages.length === 0
    },
      attachedPlantIds(state): string[] {
      return this.active ? (this.active.plantIds ?? []) : state.pendingPlantIds
    },
    busy: state => state.waiting || state.revealing,
    /** جدیدترین اول */
    sorted: state => [...state.conversations].sort((a, b) => b.updatedAt - a.updatedAt),
  },
  actions: {
    /** گفتگوی جدید: خالیه و با اولین پیام توی تاریخچه ثبت می‌شه */
      newChat(plantIds: string[] = []) {
      this.stop()
      this.activeId = null
      this.pendingPlantIds = [...plantIds]
    },
    select(id: string) {
      if (id === this.activeId || !this.conversations.some(c => c.id === id)) return
      this.stop()
      this.activeId = id
    },
    rename(id: string, title: string) {
      const conv = this.conversations.find(c => c.id === id)
      const clean = title.trim().slice(0, 80)
      if (conv && clean) conv.title = clean
    },
    togglePin(id: string) {
      const conv = this.conversations.find(c => c.id === id)
      if (conv) conv.pinned = !conv.pinned
    },
    remove(id: string) {
      if (id === this.activeId) {
        this.stop()
        this.activeId = null
      }
      this.conversations = this.conversations.filter(c => c.id !== id)
    },
    togglePlant(id: string) {
      const conv = this.active
      const list = conv ? (conv.plantIds ??= []) : this.pendingPlantIds
      const index = list.indexOf(id)
      if (index === -1) list.push(id)
      else list.splice(index, 1)
    },
    async send(text: string, image?: string, locale: MockLocale = 'fa') {
      const content = text.trim()
      if ((!content && !image) || this.busy) return

      let conv = this.active
      if (!conv) {
        const now = Date.now()
        const created: ChatConversation = {
          id: uid(),
          title: content.replace(/\s+/g, ' ').slice(0, MAX_TITLE),
          createdAt: now,
          updatedAt: now,
          messages: [],
          plantIds: [...this.pendingPlantIds],
        }
        const all = [created, ...this.conversations]
        this.conversations = [...all.filter(c => c.pinned), ...all.filter(c => !c.pinned)].slice(0, MAX_CONVERSATIONS)
        this.activeId = created.id
        this.pendingPlantIds = []
        conv = this.active
      }
      if (!conv) return

      conv.messages.push({ id: uid(), role: 'user', content, image })
      conv.updatedAt = Date.now()
      await this.requestReply(locale)
    },
    /** تلاش دوباره بعد از خطا: پیام ناموفق حذف می‌شه و همون تاریخچه دوباره فرستاده می‌شه */
    async retry(locale: MockLocale = 'fa') {
      const conv = this.active
      if (!conv || this.busy) return
      conv.messages = conv.messages.filter(m => !m.failed)
      if (conv.messages.at(-1)?.role !== 'user') return
      await this.requestReply(locale)
    },
    /** تولید دوباره‌ی آخرین جواب: جواب(های) آخر حذف می‌شن و برای همون سؤال جواب تازه گرفته می‌شه */
    async regenerate(locale: MockLocale = 'fa') {
      const conv = this.active
      if (!conv || this.busy) return
      while (conv.messages.at(-1)?.role === 'assistant') conv.messages.pop()
      if (conv.messages.at(-1)?.role !== 'user') return
      await this.requestReply(locale)
    },
    async requestReply(locale: MockLocale) {
      const conv = this.active
      if (!conv) return
      const convId = conv.id
      const current = epoch
      const userPlants = useUserPlantsStore().plants
      const plants = (conv.plantIds ?? [])
        .map(id => userPlants.find(p => p.id === id))
        .filter((p): p is UserPlant => !!p)
        .map(p => ({
          nickname: p.nickname,
          plantSlug: p.plantSlug,
          location: p.location,
          healthStatus: p.healthStatus,
          lastWateredAt: p.lastWateredAt,
        }))
      this.waiting = true
      try {
        const reply = await askAiDoctor(conv.messages, locale, plants)
        if (current !== epoch) return
        const id = uid()
        conv.messages.push({ id, role: 'assistant', content: '' })
        this.waiting = false
        await this.revealReply(convId, id, reply, current)
      }
      catch {
        if (current !== epoch) return
        conv.messages.push({ id: uid(), role: 'assistant', content: '', failed: true })
      }
      finally {
        if (current === epoch) {
          this.waiting = false
          this.revealing = false
          const done = this.conversations.find(c => c.id === convId)
          if (done) done.updatedAt = Date.now()
        }
      }
    },
    /** متن رو تکه‌تکه نشون می‌ده تا حس تایپ‌شدن بده؛ اگه گفتگو عوض یا متوقف شد، متوقف می‌شه */
    async revealReply(convId: string, id: string, full: string, current: number) {
      this.revealing = true
      const tokens = full.split(/(\s+)/)
      let shown = ''
      for (let i = 0; i < tokens.length; i += 2) {
        shown += tokens.slice(i, i + 2).join('')
        if (current !== epoch) return
        const message = this.conversations.find(c => c.id === convId)?.messages.find(m => m.id === id)
        if (!message) return
        message.content = shown
        await new Promise(resolve => setTimeout(resolve, 28))
      }
    },
    /** دکمه‌ی «توقف»: جواب نیمه‌کاره همون‌طور که هست می‌مونه، جواب دیررسیده نادیده گرفته می‌شه */
    stop() {
      if (!this.busy) return
      epoch++
      this.waiting = false
      this.revealing = false
      // اگه هنوز هیچ متنی نیومده بود، حباب خالی نمونه
      const messages = this.active?.messages
      const last = messages?.at(-1)
      if (messages && last?.role === 'assistant' && !last.content && !last.failed) messages.pop()
    },
    /** 👍 / 👎 زیر جواب؛ زدن دوباره‌ی همون دکمه نظر رو برمی‌داره */
    setFeedback(id: string, value: ChatFeedback) {
      const message = this.active?.messages.find(m => m.id === id)
      if (message) message.feedback = message.feedback === value ? undefined : value
    },
  },
})