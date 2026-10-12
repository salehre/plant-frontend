import { defineStore } from 'pinia'
import type { CreateTicketPayload, Ticket, TicketAttachment, TicketMessage, TicketStatus } from '~/types/ticket.types'

const SLUG_PREFIX = 'tk-'
const FIRST_NUMBER = 1001

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function daysAgo(days: number, hours = 0) {
  return new Date(Date.now() - days * 86_400_000 - hours * 3_600_000).toISOString()
}

/**
 * تیکت‌ها فعلاً Mock هستن و بعد از رفرش هم می‌مونن (localStorage، جدا برای هر کاربر با کلید ایمیل).
 * وقتی Backend آماده شد، actionها (create / reply / close / reopen) و fetch لیست رو به API وصل کن
 * و seed دمو (ensureSeeded) رو حذف کن.
 */
export const useTicketStore = defineStore('tickets', {
  state: () => ({
    byUser: useLocalStorage<Record<string, Ticket[]>>('bargyar-tickets', {}),
    seeded: useLocalStorage<Record<string, boolean>>('bargyar-tickets-seeded', {}),
    submitting: false,
  }),
  getters: {
    userKey(): string {
      const email = useAuthStore().user?.email
      return email ? email.trim().toLowerCase() : ''
    },
    /** تیکت‌های کاربر فعلی، جدیدترین فعالیت اول */
    tickets(): Ticket[] {
      const list = this.byUser[this.userKey] ?? []
      return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    },
    counts(): Record<'all' | TicketStatus, number> {
      const list = this.byUser[this.userKey] ?? []
      return {
        all: list.length,
        pending: list.filter(t => t.status === 'pending').length,
        answered: list.filter(t => t.status === 'answered').length,
        closed: list.filter(t => t.status === 'closed').length,
      }
    },
  },
  actions: {
    getBySlug(slug: string): Ticket | undefined {
      const s = slug.toLowerCase()
      return (this.byUser[this.userKey] ?? []).find(t => t.slug === s)
    },

    nextSlug(): string {
      const numbers = Object.values(this.byUser)
        .flat()
        .map(t => Number(t.slug.replace(SLUG_PREFIX, '')))
        .filter(n => Number.isFinite(n))
      return `${SLUG_PREFIX}${Math.max(FIRST_NUMBER - 1, ...numbers) + 1}`
    },

    /** فقط برای دمو: اولین بار که کاربر وارد بخش تیکت می‌شه چند تیکت نمونه می‌سازه */
    ensureSeeded() {
      const key = this.userKey
      if (!key || this.seeded[key]) return

      const { t } = useNuxtApp().$i18n
      const msg = (author: TicketMessage['author'], body: string, createdAt: string): TicketMessage => ({
        id: uid(),
        author,
        body,
        createdAt,
      })
      const base = Math.max(FIRST_NUMBER - 1, ...Object.values(this.byUser).flat().map(x => Number(x.slug.replace(SLUG_PREFIX, ''))).filter(Number.isFinite))

      const demo: Ticket[] = [
        {
          id: uid(),
          slug: `${SLUG_PREFIX}${base + 1}`,
          subject: t('tickets.seed.answered.subject'),
          category: 'technical',
          priority: 'normal',
          status: 'answered',
          createdAt: daysAgo(4),
          updatedAt: daysAgo(3, 5),
          messages: [
            msg('user', t('tickets.seed.answered.question'), daysAgo(4)),
            msg('support', t('tickets.seed.answered.answer'), daysAgo(3, 5)),
          ],
        },
        {
          id: uid(),
          slug: `${SLUG_PREFIX}${base + 2}`,
          subject: t('tickets.seed.pending.subject'),
          category: 'suggestion',
          priority: 'low',
          status: 'pending',
          createdAt: daysAgo(1),
          updatedAt: daysAgo(1),
          messages: [msg('user', t('tickets.seed.pending.question'), daysAgo(1))],
        },
        {
          id: uid(),
          slug: `${SLUG_PREFIX}${base + 3}`,
          subject: t('tickets.seed.closed.subject'),
          category: 'account',
          priority: 'high',
          status: 'closed',
          createdAt: daysAgo(12),
          updatedAt: daysAgo(10),
          messages: [
            msg('user', t('tickets.seed.closed.question'), daysAgo(12)),
            msg('support', t('tickets.seed.closed.answer'), daysAgo(10)),
          ],
        },
      ]

      this.byUser[key] = [...(this.byUser[key] ?? []), ...demo]
      this.seeded[key] = true
    },

    async create(payload: CreateTicketPayload): Promise<string> {
      this.submitting = true
      try {
        await simulateDelay(500)
        const now = new Date().toISOString()
        const slug = this.nextSlug()
        const ticket: Ticket = {
          id: uid(),
          slug,
          subject: payload.subject.trim(),
          category: payload.category,
          priority: payload.priority,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
          messages: [{ id: uid(), author: 'user', body: payload.message.trim(), createdAt: now }],
        }
        this.byUser[this.userKey] = [...(this.byUser[this.userKey] ?? []), ticket]
        return slug
      }
      finally {
        this.submitting = false
      }
    },

    /** پاسخ کاربر: تیکت دوباره «در انتظار» پشتیبانی می‌شه (تیکت بسته‌شده اول باید باز بشه) */
    async reply(slug: string, body: string, attachments: TicketAttachment[] = []): Promise<boolean> {
      const ticket = this.getBySlug(slug)
      if (!ticket || ticket.status === 'closed') return false
      this.submitting = true
      try {
        await simulateDelay(350)
        const now = new Date().toISOString()
        ticket.messages = [
          ...ticket.messages,
          {
            id: uid(),
            author: 'user',
            body: body.trim(),
            ...(attachments.length ? { attachments } : {}),
            createdAt: now,
          },
        ]
        ticket.status = 'pending'
        ticket.updatedAt = now
        return true
      }
      finally {
        this.submitting = false
      }
    },

    async setClosed(slug: string, closed: boolean): Promise<boolean> {
      const ticket = this.getBySlug(slug)
      if (!ticket) return false
      this.submitting = true
      try {
        await simulateDelay(250)
        // بازکردن دوباره: اگه پشتیبانی قبلاً جواب داده بود «پاسخ داده‌شده» وگرنه «در انتظار»
        const hasSupportReply = ticket.messages.some(m => m.author === 'support')
        ticket.status = closed ? 'closed' : (hasSupportReply ? 'answered' : 'pending')
        ticket.updatedAt = new Date().toISOString()
        return true
      }
      finally {
        this.submitting = false
      }
    },
  },
})
