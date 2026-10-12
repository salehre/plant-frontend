/** وضعیت تیکت: در انتظار پاسخ پشتیبانی، پاسخ داده‌شده (منتظر کاربر)، بسته‌شده */
export type TicketStatus = 'pending' | 'answered' | 'closed'
export type TicketPriority = 'low' | 'normal' | 'high'
export type TicketCategory = 'technical' | 'account' | 'plants' | 'suggestion' | 'other'

export type TicketAuthor = 'user' | 'support'

export type TicketAttachmentKind = 'image' | 'file' | 'voice'

export interface TicketAttachment {
  id: string
  kind: TicketAttachmentKind
  name: string
  mime: string
  /** حجم به بایت */
  size: number
  /** فعلاً Data URL (Mock)؛ با Backend بشه آدرس فایل آپلودشده */
  url: string
  /** فقط برای پیام صوتی، به ثانیه */
  duration?: number
}

export interface TicketMessage {
  id: string
  author: TicketAuthor
  /** برای پیام فقط-پیوست می‌تونه خالی باشه */
  body: string
  attachments?: TicketAttachment[]
  createdAt: string // ISO
}

export interface Ticket {
  /** شناسه‌ی عددی تیکت (توی URL و نمایش): ‎/tickets/1001 و ‎#1001 */
  id: string
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
  attachments?: TicketAttachment[]
}

export const ticketCategories: TicketCategory[] = ['technical', 'account', 'plants', 'suggestion', 'other']
export const ticketPriorities: TicketPriority[] = ['low', 'normal', 'high']

/** محدودیت‌های پیوست (Mock: چون توی localStorage ذخیره می‌شن کوچیک نگه‌شون داشتیم) */
export const TICKET_MAX_ATTACHMENTS = 3
export const TICKET_MAX_FILE_BYTES = 1.5 * 1024 * 1024
export const TICKET_MAX_VOICE_SECONDS = 120
