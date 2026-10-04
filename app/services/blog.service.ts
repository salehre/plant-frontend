import { getMockBlogCategories, getMockBlogPosts, findBlogPostBySlug, getMockRelatedBlogPosts } from './mock/blog.mock'
import { useApiClient } from './api/client'
import type { BlogCategory, BlogPost, BlogPostSummary } from '~/types/blog.types'
import type { MockLocale } from './mock/mock-locale'

/**
 * مرز رسمی بین Mock Data و API واقعی برای بلاگ (مثل plant.service.ts).
 * وقتی Backend آماده شد، فقط بدنه‌ی شرط `useMockApi` حذف و مسیرهای زیر با API واقعی هماهنگ می‌شه.
 * مسیرهای فرضی: GET /blog/posts, /blog/posts/{slug}, /blog/posts/{slug}/related, /blog/categories
 * (پارامتر locale برای دریافت محتوای فارسی/انگلیسی از سمت سرور فرض شده.)
 */

export async function getBlogPosts(locale: MockLocale = 'fa', category = '', limit = 0): Promise<BlogPostSummary[]> {
  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay(250)
    const posts = getMockBlogPosts(locale, category)
    return limit > 0 ? posts.slice(0, limit) : posts
  }
  const { get } = useApiClient()
  const categoryParam = category && category !== 'all' ? category : ''
  return get<BlogPostSummary[]>(`/blog/posts?locale=${locale}&category=${categoryParam}&limit=${limit || ''}`)
}

export async function getBlogPostBySlug(slug: string, locale: MockLocale = 'fa'): Promise<BlogPost | undefined> {
  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay(300)
    return findBlogPostBySlug(slug, locale)
  }
  const { get } = useApiClient()
  return get<BlogPost>(`/blog/posts/${slug}?locale=${locale}`)
}

export async function getRelatedBlogPosts(slug: string, locale: MockLocale = 'fa', limit = 3): Promise<BlogPostSummary[]> {
  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay(150)
    return getMockRelatedBlogPosts(slug, locale, limit)
  }
  const { get } = useApiClient()
  return get<BlogPostSummary[]>(`/blog/posts/${slug}/related?locale=${locale}&limit=${limit}`)
}

export async function getBlogCategories(locale: MockLocale = 'fa'): Promise<BlogCategory[]> {
  const { public: pub } = useRuntimeConfig()
  if (pub.useMockApi) {
    await simulateDelay(100)
    return getMockBlogCategories(locale)
  }
  const { get } = useApiClient()
  return get<BlogCategory[]>(`/blog/categories?locale=${locale}`)
}