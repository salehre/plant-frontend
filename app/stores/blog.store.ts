import { defineStore } from 'pinia'
import type { BlogCategory, BlogPost, BlogPostSummary } from '~/types/blog.types'
import type { MockLocale } from '~/services/mock/mock-locale'
import { getBlogPosts, getBlogPostBySlug, getRelatedBlogPosts, getBlogCategories } from '~/services/blog.service'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    list: [] as BlogPostSummary[],
    featured: [] as BlogPostSummary[],
    related: [] as BlogPostSummary[],
    categories: [] as BlogCategory[],
    current: null as BlogPost | null,
    category: 'all',
    loading: false,
    error: '',
  }),
  actions: {
    async fetchList(locale: MockLocale, errorMessage: string) {
      const result = await runAsyncAction(this, () => getBlogPosts(locale, this.category), { errorMessage })
      if (result) this.list = result
    },
    // مستقل از لیست اصلیه (برای بخش صفحه‌ی اصلی)، پس loading/error مشترک رو دست نمی‌زنه
    async fetchFeatured(locale: MockLocale, errorMessage: string, limit = 3) {
      try {
        this.featured = await getBlogPosts(locale, '', limit)
      }
      catch {
        useUiStore().showToast(errorMessage, 'error')
      }
    },
    async fetchBySlug(slug: string, locale: MockLocale, errorMessage: string) {
      const result = await runAsyncAction(this, () => getBlogPostBySlug(slug, locale), { errorMessage })
      this.current = result ?? null
    },
    async fetchRelated(slug: string, locale: MockLocale) {
      try {
        this.related = await getRelatedBlogPosts(slug, locale)
      }
      catch {
        // مقاله‌های مرتبط اختیاری‌ان؛ شکست در دریافتشون نباید صفحه‌ی مقاله رو خراب کنه
        this.related = []
      }
    },
    async fetchCategories(locale: MockLocale) {
      try {
        this.categories = await getBlogCategories(locale)
      }
      catch {
        this.categories = []
      }
    },
  },
})