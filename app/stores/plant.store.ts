import { defineStore } from 'pinia'
import type { Plant } from '~/types/plant.types'
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
    async fetchList() {
      const result = await runAsyncAction(this, () =>
        getPlantList(this.query, this.category, this.difficulty, this.light, this.family, this.genus), {
        errorMessage: 'مشکلی در دریافت لیست گیاهان پیش اومد.',
      })
      if (result) this.list = result
    },
    // خودش loading/error مشترک استور رو دست نمی‌زنه (fetchFeatured مستقل از لیست اصلیه)،
    // برای همین به‌جای runAsyncAction فقط toast خطا رو نگه می‌داریم.
    async fetchFeatured() {
      try {
        this.featured = await getFeaturedPlants()
      }
      catch {
        useUiStore().showToast('مشکلی در بارگذاری گیاهان شاخص پیش اومد.', 'error')
      }
    },
    async fetchBySlug(slug: string) {
      const result = await runAsyncAction(this, () => getPlantBySlug(slug), {
        errorMessage: 'مشکلی در دریافت اطلاعات گیاه پیش اومد.',
      })
      this.current = result ?? null
    },
    /** خانواده‌ها همیشه ثابتن؛ جنس‌ها بسته به خانواده‌ی انتخاب‌شده دوباره محاسبه می‌شن */
    async fetchFilterOptions() {
      try {
        const { families, genera } = await getFilterOptions(this.family)
        this.familyOptions = families
        this.genusOptions = genera
      }
      catch {
        useUiStore().showToast('مشکلی در بارگذاری فیلترها پیش اومد.', 'error')
      }
    },
  },
})
