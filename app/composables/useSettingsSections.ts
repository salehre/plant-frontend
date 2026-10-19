export type SettingsSectionKey = 'account' | 'appearance' | 'locations' | 'about'

export function useSettingsSections() {
  const { t } = useI18n()
  const route = useRoute()

  const sections = computed<{ key: SettingsSectionKey, icon: string, label: string }[]>(() => [
    { key: 'account', icon: 'lucide:user', label: t('pages.profile.account') },
    { key: 'appearance', icon: 'lucide:palette', label: `${t('pages.profile.appearance')} / ${t('pages.profile.language')}` },
    { key: 'locations', icon: 'lucide:map-pin', label: t('pages.profile.addresses') },
    { key: 'about', icon: 'lucide:info', label: t('components.theFooter.about') },
  ])

  // بخش فعال از query خونده می‌شه تا ساید بار و صفحه همیشه هماهنگ باشن
  const active = computed<SettingsSectionKey>(() => {
    const q = String(route.query.section ?? '')
    return sections.value.some(s => s.key === q) ? (q as SettingsSectionKey) : 'account'
  })

  return { sections, active }
}