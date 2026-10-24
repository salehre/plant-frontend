<script setup lang="ts">
import type { ProfileTabKey } from '~/composables/useProfileTabs'

definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()
const authStore = useAuthStore()
const uiStore = useUiStore()
const addressStore = useAddressStore()
const activityStore = useActivityStore()
const userPlantsStore = useUserPlantsStore()
const { activeTab, setTab, mainProfileTabs, settingsProfileTabs } = useProfileTabs()
const { plantCount, healthyCount, scanCount, speciesCount } = useProfileStats()

// هر پنل بعد از اولین باز شدن مونت می‌شه و بعدش با v-show نگه داشته می‌شه تا state تب‌ها (مثل فیلتر فعالیت) نپره.
// v-memo: پنل‌های مخفی وقتی والد دوباره رندر می‌شه دوباره diff نمی‌شن؛ deps هم زبان و داده‌های همون پنل‌ان.
const visited = reactive(new Set<ProfileTabKey>(['overview']))
watch(activeTab, key => visited.add(key), { immediate: true })

// ---- خط متحرک زیر تب‌ها: یه indicator واحد که به تب فعال می‌لغزه ----
const tabsEl = ref<HTMLElement | null>(null)
const tabButtons = new Map<ProfileTabKey, HTMLElement>()
const indicator = reactive({ left: 0, width: 0, ready: false })

function setTabButton(key: ProfileTabKey, el: unknown) {
  if (el) tabButtons.set(key, el as HTMLElement)
  else tabButtons.delete(key)
}

function updateIndicator() {
  const el = tabButtons.get(activeTab.value)
  if (!el) return
  indicator.left = el.offsetLeft
  indicator.width = el.offsetWidth
}

watch(activeTab, async (key) => {
  await nextTick()
  updateIndicator()
  // توی موبایل تب فعال رو وسط نوار بیار
  tabButtons.get(key)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
})
watch(locale, async () => {
  await nextTick()
  updateIndicator()
})

onMounted(() => {
  updateIndicator()
  // اولین موقعیت‌دهی بدون انیمیشن؛ بعدش transition فعال می‌شه
  requestAnimationFrame(() => { indicator.ready = true })
  document.fonts?.ready.then(updateIndicator)
})
useResizeObserver(tabsEl, updateIndicator)

const accountForm = ref<{ startEdit: () => void } | null>(null)

// «ویرایش پروفایل» تب حساب رو باز می‌کنه و دایلوگ ویرایش رو بالا میاره
async function openEdit() {
  visited.add('account')
  await setTab('account')
  await nextTick()
  accountForm.value?.startEdit()
}
</script>

<template>
  <div class="relative min-h-screen">
    <!-- حباب‌های نوری پس‌زمینه -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -start-20 size-96 rounded-full bg-primary-100/40 blur-3xl" />
      <div class="absolute top-1/3 -end-20 size-80 rounded-full bg-emerald-100/30 blur-3xl" />
      <div class="absolute bottom-0 start-1/2 size-80 rounded-full bg-teal-100/20 blur-3xl" />
    </div>

    <div class="flex flex-col gap-5 pb-6 sm:gap-6">
      <!-- هدر پروفایل + نوار تب‌ها -->
      <section class="glass-card overflow-hidden">
        <ProfileHeader @edit="openEdit" />

        <nav
          class="border-t border-ink/5 px-4 sm:px-8"
          role="tablist"
          :aria-label="t('pages.profile.title')"
        >
          <div
            ref="tabsEl"
            class="relative flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              v-for="tab in mainProfileTabs"
              :key="tab.key"
              :ref="el => setTabButton(tab.key, el)"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab.key"
              class="shrink-0 px-3 py-3.5 text-sm font-semibold transition-colors"
              :class="activeTab === tab.key ? 'text-primary-700' : 'text-ink-muted hover:text-ink'"
              @click="setTab(tab.key)"
            >
              {{ t(tab.label) }}
            </button>

            <!-- جداکننده‌ی تب‌های اصلی از تب‌های تنظیمات -->
            <span
              class="mx-1 h-5 w-px shrink-0 bg-ink/10"
              aria-hidden="true"
            />

            <button
              v-for="tab in settingsProfileTabs"
              :key="tab.key"
              :ref="el => setTabButton(tab.key, el)"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab.key"
              class="shrink-0 px-3 py-3.5 text-sm font-semibold transition-colors"
              :class="activeTab === tab.key ? 'text-primary-700' : 'text-ink-muted hover:text-ink'"
              @click="setTab(tab.key)"
            >
              {{ t(tab.label) }}
            </button>

            <span
              class="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-primary-600 motion-reduce:transition-none"
              :class="indicator.ready ? 'transition-[transform,width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''"
              :style="{
                width: `${Math.max(indicator.width - 16, 0)}px`,
                transform: `translateX(${indicator.left + 8}px)`,
                opacity: indicator.width ? 1 : 0,
              }"
              aria-hidden="true"
            />
          </div>
        </nav>
      </section>

      <!-- پنل‌های تب -->
      <div
        v-if="visited.has('overview')"
        v-show="activeTab === 'overview'"
        v-memo="[activeTab === 'overview', locale]"
        role="tabpanel"
      >
        <OverviewTab />
      </div>

      <div
        v-if="visited.has('myPlants')"
        v-show="activeTab === 'myPlants'"
        v-memo="[activeTab === 'myPlants', locale, userPlantsStore.plants]"
        role="tabpanel"
      >
        <MyPlantsTab />
      </div>

      <div
        v-if="visited.has('achievements')"
        v-show="activeTab === 'achievements'"
        v-memo="[activeTab === 'achievements', locale, plantCount, healthyCount, scanCount, speciesCount]"
        role="tabpanel"
      >
        <AchievementsTab />
      </div>

      <div
        v-if="visited.has('activity')"
        v-show="activeTab === 'activity'"
        v-memo="[activeTab === 'activity', locale, activityStore.entries]"
        role="tabpanel"
      >
        <ActivityFeed />
      </div>

      <div
        v-if="visited.has('account')"
        v-show="activeTab === 'account'"
        v-memo="[activeTab === 'account', locale, authStore.user]"
        role="tabpanel"
      >
        <ProfileInfoForm ref="accountForm" />
      </div>

      <div
        v-if="visited.has('appearance')"
        v-show="activeTab === 'appearance'"
        v-memo="[activeTab === 'appearance', locale, uiStore.mode, uiStore.theme]"
        role="tabpanel"
      >
        <AppearanceSettings />
      </div>

      <div
        v-if="visited.has('addresses')"
        v-show="activeTab === 'addresses'"
        v-memo="[activeTab === 'addresses', locale, addressStore.items]"
        role="tabpanel"
      >
        <AddressManager />
      </div>

      <div
        v-if="visited.has('about')"
        v-show="activeTab === 'about'"
        v-memo="[activeTab === 'about', locale]"
        role="tabpanel"
      >
        <AboutLinks />
      </div>
    </div>
  </div>
</template>