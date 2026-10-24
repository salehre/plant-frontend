export type ProfileTabKey =
  | 'overview'
  | 'myPlants'
  | 'achievements'
  | 'activity'
  | 'account'
  | 'appearance'
  | 'addresses'
  | 'about'

export interface ProfileTab {
  key: ProfileTabKey
  /** کلید ترجمه */
  label: string
}

/** تب‌های اصلی پروفایل */
export const mainProfileTabs: ProfileTab[] = [
  { key: 'overview', label: 'pages.profile.tabs.overview' },
  { key: 'myPlants', label: 'pages.profile.tabs.myPlants' },
  { key: 'achievements', label: 'pages.profile.tabs.achievements' },
  { key: 'activity', label: 'pages.profile.tabs.activity' },
]

/** بخش‌های قبلی صفحه‌ی تنظیمات که حالا تب‌های همین صفحه‌ی پروفایل‌ان */
export const settingsProfileTabs: ProfileTab[] = [
  { key: 'account', label: 'pages.profile.tabs.account' },
  { key: 'appearance', label: 'pages.profile.tabs.appearance' },
  { key: 'addresses', label: 'pages.profile.tabs.addresses' },
  { key: 'about', label: 'pages.profile.tabs.about' },
]

const ALL_KEYS: string[] = [...mainProfileTabs, ...settingsProfileTabs].map(tab => tab.key)

export function isProfileTabKey(value: unknown): value is ProfileTabKey {
  return typeof value === 'string' && ALL_KEYS.includes(value)
}

/** تب فعال از ?tab= خونده می‌شه؛ نبودنش یعنی نمای کلی */
export function useProfileTabs() {
  const route = useRoute()
  const router = useRouter()

  const activeTab = computed<ProfileTabKey>(() => {
    const value = route.query.tab
    return isProfileTabKey(value) ? value : 'overview'
  })

  function setTab(key: ProfileTabKey) {
    return router.replace({ path: '/profile', query: key === 'overview' ? {} : { tab: key } })
  }

  return { activeTab, setTab, mainProfileTabs, settingsProfileTabs }
}
