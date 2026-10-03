import { defineStore } from 'pinia'
import type { Plant } from '~/types/plant.types'
import type { MockLocale } from '~/services/mock/mock-locale'
import { getPlantList, getPlantBySlug, getFeaturedPlants, getFilterOptions } from '~/services/plant.service'

export const usePlantStore = defineStore('plant', {
  state: () => ({
    list: [] as Plant[],
    featured: [] as Plant[],
    current: null as Plant | null,
    loading: false,
    error: '',
    query: '',
    category: '',
    difficulty: '',
    light: '',
    family: '',
    genus: '',
    // فیلد‌های موجود برای پر کردن فیلترهای Family/Genus - از دیتاست واقعی می‌آید، نه هاردکد
    familyOptions: [] as string[],
    genusOptions: [] as string[],
  }),
  actions: {
    async fetchList(locale: MockLocale, errorMessage: string) {
      const result = await runAsyncAction(this, () =>
        getPlantList(this.query, this.category, this.difficulty, this.light, this.family, this.genus, locale), {
        errorMessage,
      })
      if (result) this.list = result
    },
    // خودش loading/error مشترک استور رو دست نمی‌زنه (fetchFeatured مستقل از لیست اصلیه)،
    // برای همین به‌جای runAsyncAction فقط toast خطا رو نگه می‌داریم.
    async fetchFeatured(locale: MockLocale, errorMessage: string) {
      try {
        this.featured = await getFeaturedPlants(locale)
      }
      catch {
        useUiStore().showToast(errorMessage, 'error')
      }
    },
    async fetchBySlug(slug: string, locale: MockLocale, errorMessage: string) {
      const result = await runAsyncAction(this, () => getPlantBySlug(slug, locale), {
        errorMessage,
      })
      this.current = result ?? null
    },
    /** خانواده‌ها همیشه ثابتن؛ جنس‌ها بسته به خانواده‌ی انتخاب‌شده دوباره محاسبه می‌شن */
    async fetchFilterOptions(errorMessage: string) {
      try {
        const { families, genera } = await getFilterOptions(this.family)
        this.familyOptions = families
        this.genusOptions = genera
      }
      catch {
        useUiStore().showToast(errorMessage, 'error')
      }
    },
  },
})
