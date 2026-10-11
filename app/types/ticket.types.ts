/** وضعیت تیکت: در انتظار پاسخ پشتیبانی، پاسخ داده‌شده (منتظر کاربر)، بسته‌شده */
export type TicketStatus = 'pending' | 'answered' | 'closed'
export type TicketPriority = 'low' | 'normal' | 'high'
export type TicketCategory = 'technical' | 'account' | 'plants' | 'suggestion' | 'other'

export type TicketAuthor = 'user' | 'support'

export interface TicketMessage {
  id: string
  author: TicketAuthor
  body: string
  createdAt: string // ISO
}

export interface Ticket {
  id: string
  /** شناسه‌ی داخل URL و شماره‌ی تیکت، مثلاً tk-1001 (نمایش: TK-1001) */
  slug: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  createdAt: string // ISO
  updatedAt: string // ISO
  messages: TicketMessage[]
}

export interface CreateTicketPayload {
  subject: string
  category: TicketCategory
  priority: TicketPriority
  message: string
}

export const ticketCategories: TicketCategory[] = ['technical', 'account', 'plants', 'suggestion', 'other']
export const ticketPriorities: TicketPriority[] = ['low', 'normal', 'high']
