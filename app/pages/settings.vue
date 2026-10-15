<script setup lang="ts">
import { themes } from '~/stores/ui.store'

definePageMeta({ layout: 'default' })

const { locale, setLocale, t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const historyStore = useHistoryStore()
const wishlistStore = useWishlistStore()

const isDark = computed(() => uiStore.mode === 'dark')
const user = computed(() => authStore.user)
const intlLocale = computed(() => locale.value === 'fa' ? 'fa-IR' : 'en-US')
const memberSince = computed(() => user.value?.joinedAt
  ? new Intl.DateTimeFormat(intlLocale.value, { month: 'long', year: 'numeric' }).format(new Date(user.value.joinedAt))
  : '')

type SectionKey = 'account' | 'appearance' | 'library' | 'about'

// روی دسکتاپ فقط بخش انتخاب‌شده دیده می‌شه؛ روی موبایل همه‌ی بخش‌ها زیر هم‌ان
const active = ref<SectionKey>('account')
const sections = computed<{ key: SectionKey, icon: string, label: string }[]>(() => [
  { key: 'account', icon: 'lucide:user', label: t('pages.profile.account') },
  { key: 'appearance', icon: 'lucide:palette', label: `${t('pages.profile.appearance')} / ${t('pages.profile.language')}` },
  { key: 'library', icon: 'lucide:heart', label: t('pages.profile.library') },
  { key: 'about', icon: 'lucide:info', label: t('components.theFooter.about') },
])

function panelClass(key: SectionKey) {
  return active.value === key ? '' : 'lg:hidden'
}

const languages = [
  { code: 'fa', label: 'فارسی' },
  { code: 'en', label: 'English' },
] as const

const libraryRows = computed(() => [
  { to: '/wishlist', icon: 'lucide:heart', label: t('pages.profile.wishlist'), hint: t('pages.profile.wishlistDescription'), value: toPersianDigits(wishlistStore.count) },
  { to: '/history', icon: 'lucide:history', label: t('pages.profile.history'), hint: t('pages.profile.historyDescription'), value: toPersianDigits(historyStore.count) },
])
const aboutRows = computed(() => [
  { to: '/about', icon: 'lucide:info', label: t('components.theFooter.about') },
  { to: '/support', icon: 'lucide:life-buoy', label: t('support.nav') },
  { to: '/tickets', icon: 'lucide:message-square-text', label: t('components.theFooter.tickets') },
  { to: '/contact', icon: 'lucide:mail', label: t('components.theFooter.contact') },
  { to: '/terms', icon: 'lucide:file-text', label: t('components.theFooter.terms') },
  { to: '/privacy', icon: 'lucide:shield-check', label: t('components.theFooter.privacy') },
])
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- عنوان -->
    <div class="flex items-start gap-2">
      <button
        type="button"
        class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-primary-50 md:hidden"
        :aria-label="t('common.back')"
        @click="router.back()"
      >
        <Icon
          name="lucide:chevron-right"
          class="size-6 ltr:rotate-180"
        />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-ink sm:text-3xl">
          {{ t('pages.profile.settings') }}
        </h1>
        <p class="mt-1 text-sm text-ink-muted">
          {{ t('pages.profile.settingsSubtitle') }}
        </p>
      </div>
    </div>

    <div class="grid items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
      <!-- منوی بخش‌ها (فقط دسکتاپ) -->
      <nav
        class="glass-card hidden flex-col gap-1 p-2 lg:flex"
        :aria-label="t('pages.profile.settings')"
      >
        <button
          v-for="section in sections"
          :key="section.key"
          type="button"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-medium transition-colors"
          :class="active === section.key
            ? 'bg-primary-50 font-bold text-primary-700'
            : 'text-ink-muted hover:bg-primary-50/70 hover:text-primary-700'"
          :aria-current="active === section.key ? 'page' : undefined"
          @click="active = section.key"
        >
          <Icon
            :name="section.icon"
            class="size-[18px]"
          />
          {{ section.label }}
        </button>
      </nav>

      <div class="flex min-w-0 flex-col gap-5">
        <!-- حساب -->
        <section
          class="flex flex-col gap-5"
          :class="panelClass('account')"
        >
          <div class="glass-card p-4 sm:p-5">
            <h2 class="mb-4 font-bold text-ink">
              {{ t('pages.profile.account') }}
            </h2>
            <div class="mb-4 flex items-center gap-4">
              <AvatarUploader avatar-class="size-16" />
              <div class="min-w-0">
                <p class="truncate text-lg font-bold text-ink">
                  {{ user?.name || t('pages.profile.account') }}
                </p>
                <p
                  v-if="user?.email"
                  class="truncate text-sm text-ink-muted"
                >
                  {{ user.email }}
                </p>
              </div>
            </div>
            <dl
              v-if="user"
              class="divide-y divide-ink/5 text-sm"
            >
              <div class="flex items-center justify-between gap-3 py-3">
                <dt class="text-ink-muted">
                  {{ t('auth.email') }}
                </dt>
                <dd class="truncate font-medium text-ink">
                  {{ user.email }}
                </dd>
              </div>
              <div
                v-if="memberSince"
                class="flex items-center justify-between gap-3 py-3"
              >
                <dt class="text-ink-muted">
                  {{ t('pages.profile.memberSince') }}
                </dt>
                <dd class="font-medium text-ink">
                  {{ memberSince }}
                </dd>
              </div>
            </dl>
          </div>

          <ProfileInfoForm />
        </section>

        <!-- ظاهر و زبان -->
        <section
          class="flex flex-col gap-5"
          :class="panelClass('appearance')"
        >
          <div class="glass-card p-4 sm:p-5">
            <h2 class="mb-2 font-bold text-ink">
              {{ t('pages.profile.appearance') }}
            </h2>
            <div class="divide-y divide-ink/5">
              <div class="flex items-center gap-3 py-4">
                <ThemeModeIcon
                  :dark="isDark"
                  class="size-5 shrink-0 text-primary-700"
                />
                <span class="flex-1 text-sm font-medium text-ink">{{ isDark ? t('pages.profile.dark') : t('pages.profile.light') }}</span>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="isDark"
                  :aria-label="isDark ? t('pages.profile.switchToLight') : t('pages.profile.switchToDark')"
                  class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
                  :class="isDark ? 'bg-primary-600' : 'bg-ink/20'"
                  @click="uiStore.toggleMode()"
                >
                  <span
                    class="absolute top-0.5 size-5 rounded-full bg-white shadow transition-all"
                    :class="isDark ? 'start-[1.375rem]' : 'start-0.5'"
                  />
                </button>
              </div>
              <div class="flex items-center gap-3 py-4">
                <Icon
                  name="lucide:palette"
                  class="size-5 shrink-0 text-primary-700"
                />
                <span class="flex-1 text-sm font-medium text-ink">{{ t('pages.profile.colorTheme') }}</span>
                <div
                  class="flex items-center gap-2"
                  role="radiogroup"
                  :aria-label="t('pages.profile.colorTheme')"
                >
                  <button
                    v-for="theme in themes"
                    :key="theme.key"
                    type="button"
                    role="radio"
                    :aria-checked="uiStore.theme === theme.key"
                    :aria-label="t(`pages.profile.themes.${theme.key}`)"
                    :title="t(`pages.profile.themes.${theme.key}`)"
                    class="flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-surface transition-all"
                    :class="uiStore.theme === theme.key ? 'ring-2 ring-ink/60' : 'ring-1 ring-ink/10'"
                    @click="uiStore.setTheme(theme.key)"
                  >
                    <span
                      class="size-5 rounded-full"
                      :style="{ backgroundColor: theme.swatch }"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-card p-4 sm:p-5">
            <h2 class="mb-2 font-bold text-ink">
              {{ t('pages.profile.language') }}
            </h2>
            <div
              class="divide-y divide-ink/5"
              role="radiogroup"
              :aria-label="t('pages.profile.language')"
            >
              <button
                v-for="lang in languages"
                :key="lang.code"
                type="button"
                role="radio"
                :aria-checked="locale === lang.code"
                class="flex w-full items-center gap-3 py-4 text-start"
                @click="setLocale(lang.code)"
              >
                <span class="flex-1 text-sm font-medium text-ink">{{ lang.label }}</span>
                <span
                  class="flex size-5 items-center justify-center rounded-full border-2 transition-colors"
                  :class="locale === lang.code ? 'border-primary-600 bg-primary-600' : 'border-ink/20'"
                >
                  <Icon
                    v-if="locale === lang.code"
                    name="lucide:check"
                    class="size-3 text-white"
                  />
                </span>
              </button>
            </div>
          </div>
        </section>

        <!-- علاقه‌مندی‌ها و تاریخچه -->
        <section
          class="glass-card p-4 sm:p-5"
          :class="panelClass('library')"
        >
          <h2 class="mb-2 font-bold text-ink">
            {{ t('pages.profile.library') }}
          </h2>
          <ul class="divide-y divide-ink/5">
            <li
              v-for="row in libraryRows"
              :key="row.to"
            >
              <NuxtLink
                :to="row.to"
                class="flex items-center gap-3 py-4"
              >
                <Icon
                  :name="row.icon"
                  class="size-5 shrink-0 text-primary-700"
                />
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-medium text-ink">{{ row.label }}</span>
                  <span class="block truncate text-xs text-ink-muted">{{ row.hint }}</span>
                </span>
                <span class="text-sm text-ink-muted">{{ row.value }}</span>
                <Icon
                  name="lucide:chevron-left"
                  class="size-4 shrink-0 text-ink-muted ltr:rotate-180"
                />
              </NuxtLink>
            </li>
          </ul>
        </section>

        <!-- درباره / پشتیبانی -->
        <section
          class="glass-card p-4 sm:p-5"
          :class="panelClass('about')"
        >
          <h2 class="mb-2 font-bold text-ink">
            {{ t('components.theFooter.about') }}
          </h2>
          <ul class="divide-y divide-ink/5">
            <li
              v-for="row in aboutRows"
              :key="row.to"
            >
              <NuxtLink
                :to="row.to"
                class="flex items-center gap-3 py-4"
              >
                <Icon
                  :name="row.icon"
                  class="size-5 shrink-0 text-primary-700"
                />
                <span class="flex-1 text-sm font-medium text-ink">{{ row.label }}</span>
                <Icon
                  name="lucide:chevron-left"
                  class="size-4 shrink-0 text-ink-muted ltr:rotate-180"
                />
              </NuxtLink>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>