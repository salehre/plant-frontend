import type { Plant } from '~/types/plant.types'
import { getPlantsBySlugs } from '~/services/plant.service'

/**
 * علاقه‌مندی‌ها فقط slug نگه می‌دارن (wishlist.store.ts)؛ این composable همون
 * لیست slug رو به آبجکت کامل Plant resolve می‌کنه و state لودینگ خودش رو مدیریت می‌کنه.
 * قبلاً این منطق مستقیم داخل pages/profile.vue بود - اینجا آوردیمش تا هر صفحه‌ی
 * دیگه‌ای (مثلاً یک صفحه‌ی مستقل Wishlist در آینده) بتونه همین رو دوباره استفاده کنه.
 */
export function useWishlistPlants() {
  const wishlistStore = useWishlistStore()
  const { locale } = useI18n()
  const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

  const plants = ref<Plant[]>([])
  const loading = ref(false)

  async function load() {
    if (!wishlistStore.slugs.length) {
      plants.value = []
      return
    }
    loading.value = true
    try {
      plants.value = await getPlantsBySlugs(wishlistStore.slugs, activeLocale.value)
    }
    finally {
      loading.value = false
    }
  }

  watch([() => wishlistStore.slugs.length, activeLocale], load)

  return { plants, loading, load }
}
