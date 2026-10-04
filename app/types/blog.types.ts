export type BlogCategoryKey = 'watering' | 'light' | 'pests' | 'soil' | 'propagation' | 'decor'

export interface BlogCategory {
  key: BlogCategoryKey
  label: string
}

export interface BlogAuthor {
  id: string
  name: string
  role: string
  avatar: string
}

/**
 * بدنه‌ی مقاله به‌صورت آرایه‌ای از بلاک‌ها ذخیره می‌شه (نه HTML خام) تا بدون v-html
 * و به‌صورت امن رندر بشه. بک‌اند هم می‌تونه همین ساختار JSON رو برگردونه.
 */
export type BlogBlock =
  | { type: 'heading', text: string }
  | { type: 'paragraph', text: string }
  | { type: 'list', items: string[] }
  | { type: 'tip', text: string }

/** نسخه‌ی سبک مقاله برای لیست‌ها و کارت‌ها (بدون بدنه) */
export interface BlogPostSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  category: BlogCategoryKey
  categoryLabel: string
  image: string
  author: BlogAuthor
  publishedAt: string
  readMinutes: number
}

export interface BlogPost extends BlogPostSummary {
  tags: string[]
  content: BlogBlock[]
}