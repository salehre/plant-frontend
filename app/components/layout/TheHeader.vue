<script setup lang="ts">
const uiStore = useUiStore()
const userPlantsStore = useUserPlantsStore()
const { locale, setLocale } = useI18n()

const query = ref('')
const isDark = computed(() => uiStore.mode === 'dark')
const todayCount = computed(() => userPlantsStore.todayTasks.length)

function toggleLocale() {
  setLocale(locale.value === 'fa' ? 'en' : 'fa')
}

function onSearch() {
  navigateTo({ path: '/plants', query: query.value ? { q: query.value } : {} })
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-bg/85 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
      <!-- لوگو (فقط موبایل؛ تو دسکتاپ لوگو توی سایدبار هست) -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-primary-800 md:hidden"
        :aria-label="$t('brand.name')"
      >
        <span class="flex size-9 items-center justify-center rounded-xl bg-primary-700 text-white">
          <Icon
            name="lucide:leaf"
            class="size-5"
          />
        </span>
      </NuxtLink>

      <!-- جستجو -->
      <form
        class="relative max-w-xl flex-1"
        @submit.prevent="onSearch"
      >
        <Icon
          name="lucide:search"
          class="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
        />
        <input
          v-model="query"
          type="search"
          :placeholder="$t('common.searchPlaceholder')"
          class="h-11 w-full border border-ink/10 bg-surface ps-10 pe-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
        >
      </form>

      <div class="ms-auto flex items-center gap-2">
        <!-- تغییر زبان -->
        <button
          type="button"
          class="flex size-10 items-center justify-center rounded-xl border border-ink/5 bg-surface text-xs font-bold text-primary-700 transition-colors hover:bg-primary-50"
          :aria-label="locale === 'fa' ? $t('common.switchToEnglish') : $t('common.switchToPersian')"
          :title="locale === 'fa' ? $t('common.switchToEnglish') : $t('common.switchToPersian')"
          @click="toggleLocale"
        >
          {{ locale === 'fa' ? 'EN' : 'فا' }}
        </button>

        <!-- دارک / لایت مود -->
        <button
          type="button"
          class="flex size-10 items-center justify-center rounded-xl border border-ink/5 bg-surface text-primary-700 transition-colors hover:bg-primary-50"
          :aria-label="isDark ? $t('pages.profile.switchToLight') : $t('pages.profile.switchToDark')"
          :title="isDark ? $t('pages.profile.switchToLight') : $t('pages.profile.switchToDark')"
          @click="uiStore.toggleMode()"
        >
          <Icon
            :name="isDark ? 'lucide:sun' : 'lucide:moon'"
            class="size-[18px]"
          />
        </button>

        <!-- اعلان: تسک‌های امروز -->
        <NuxtLink
          to="/care-calendar"
          class="relative flex size-10 items-center justify-center rounded-xl border border-ink/5 bg-surface text-primary-700 transition-colors hover:bg-primary-50"
          :aria-label="$t('nav.careCalendar')"
        >
          <Icon
            name="lucide:bell"
            class="size-[18px]"
          />
          <span
            v-if="todayCount"
            class="absolute end-2 top-2 size-2 rounded-full bg-status-danger ring-2 ring-surface"
          />
        </NuxtLink>

        <!-- پروفایل -->
        <NuxtLink
          to="/profile"
          class="flex size-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 transition-colors hover:bg-primary-200"
          :aria-label="$t('nav.profile')"
        >
          <Icon
            name="lucide:user"
            class="size-[18px]"
          />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
