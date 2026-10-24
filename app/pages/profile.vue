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
          <div class="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              v-for="tab in mainProfileTabs"
              :key="tab.key"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab.key"
              class="relative shrink-0 px-3 py-3.5 text-sm font-semibold transition-colors"
              :class="activeTab === tab.key ? 'text-primary-700' : 'text-ink-muted hover:text-ink'"
              @click="setTab(tab.key)"
            >
              {{ t(tab.label) }}
              <span
                v-if="activeTab === tab.key"
                class="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary-600"
              />
            </button>

            <button
              v-for="tab in settingsProfileTabs"
              :key="tab.key"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab.key"
              class="relative shrink-0 px-3 py-3.5 text-sm font-semibold transition-colors"
              :class="activeTab === tab.key ? 'text-primary-700' : 'text-ink-muted hover:text-ink'"
              @click="setTab(tab.key)"
            >
              {{ t(tab.label) }}
              <span
                v-if="activeTab === tab.key"
                class="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary-600"
              />
            </button>
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

<style scoped>
@property --stat-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 20;
  padding: 1px;
  border-radius: inherit;
  pointer-events: none;
  background: conic-gradient(
    from var(--stat-angle),
    transparent 0%,
    transparent 65%,
    rgb(var(--color-primary-500)) 90%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: stat-border-spin 2.5s linear infinite;
}

.stat-card:hover::before {
  opacity: 1;
}

@keyframes stat-border-spin {
  to {
    --stat-angle: 360deg;
  }
}
</style>