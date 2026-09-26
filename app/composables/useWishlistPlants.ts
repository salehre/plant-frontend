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

  const plants = ref<Plant[]>([])
  const loading = ref(false)

  async function load() {
    if (!wishlistStore.slugs.length) {
      plants.value = []
      return
    }
    loading.value = true
    try {
      plants.value = await getPlantsBySlugs(wishlistStore.slugs)
    }
    finally {
      loading.value = false
    }
  }

  watch(() => wishlistStore.slugs.length, load)

  return { plants, loading, load }
}
