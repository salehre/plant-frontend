const MONTH_MS = 30 * 24 * 60 * 60 * 1000

/**
 * آمار پروفایل فقط از استورهای واقعی محاسبه می‌شه؛ بخش‌های header، نمای کلی و دستاوردها
 * همه از همین composable می‌خونن تا عددها همیشه یکی باشن.
 */
export function useProfileStats() {
  const userPlantsStore = useUserPlantsStore()
  const historyStore = useHistoryStore()

  const plantCount = computed(() => userPlantsStore.plants.length)
  const healthyCount = computed(() =>
    userPlantsStore.plants.filter(p => p.healthStatus === 'healthy').length,
  )
  const healthRate = computed(() =>
    plantCount.value ? Math.round((healthyCount.value / plantCount.value) * 100) : 0,
  )

  const scanCount = computed(() => historyStore.count)

  /** اولین زمان دیده‌شدن هر گونه (بر اساس نام علمی) */
  const firstSeenBySpecies = computed(() => {
    const map = new Map<string, number>()
    for (const entry of historyStore.entries) {
      const prev = map.get(entry.scientificName)
      if (prev === undefined || entry.timestamp < prev) map.set(entry.scientificName, entry.timestamp)
    }
    return map
  })
  const speciesCount = computed(() => firstSeenBySpecies.value.size)

  // تغییرات ۳۰ روز اخیر
  const plantsThisMonth = computed(() =>
    userPlantsStore.plants.filter(p => new Date(p.acquiredAt).getTime() >= Date.now() - MONTH_MS).length,
  )
  const scansThisMonth = computed(() =>
    historyStore.entries.filter(e => e.timestamp >= Date.now() - MONTH_MS).length,
  )
  const speciesThisMonth = computed(() =>
    [...firstSeenBySpecies.value.values()].filter(ts => ts >= Date.now() - MONTH_MS).length,
  )

  const achievements = computed(() =>
    [
      { key: 'firstPlant', icon: 'lucide:sprout', current: Math.min(plantCount.value, 1), target: 1 },
      { key: 'scanner', icon: 'lucide:scan-line', current: Math.min(scanCount.value, 10), target: 10 },
      { key: 'collector', icon: 'lucide:leaf', current: Math.min(speciesCount.value, 10), target: 10 },
      { key: 'greenThumb', icon: 'lucide:heart-pulse', current: Math.min(healthyCount.value, 5), target: 5 },
    ].map(a => ({ ...a, unlocked: a.current >= a.target })),
  )

  return {
    plantCount,
    healthyCount,
    healthRate,
    scanCount,
    speciesCount,
    plantsThisMonth,
    scansThisMonth,
    speciesThisMonth,
    achievements,
  }
}
