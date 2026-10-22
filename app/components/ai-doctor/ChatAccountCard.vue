<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()

// TODO: وقتی صفحه/API پلن‌ها آماده شد، اینجا به صفحه‌ی خرید هدایت کن (مثلاً navigateTo('/pricing'))
function upgrade() {
  uiStore.showToast(t('aiDoctor.account.premiumSoon'), 'info')
}
</script>

<template>
  <div class="flex flex-col gap-3 border-t border-ink/5 pt-3">
    <!-- وارد شده: آواتار + اسم + پلن، و دکمه‌ی خرید پریمیوم -->
    <template v-if="authStore.isLoggedIn && authStore.user">
      <NuxtLink
        to="/profile"
        class="flex items-center gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-primary-50"
        :title="t('nav.profile')"
      >
        <UserAvatar
          :src="authStore.user.avatar"
          :name="authStore.user.name"
          class="size-10"
        />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold text-ink">
            {{ authStore.user.name }}
          </p>
          <p class="truncate text-xs text-ink-muted">
            {{ t('aiDoctor.account.freePlan') }}
          </p>
        </div>
      </NuxtLink>
      <button
        type="button"
        class="flex items-center justify-center gap-2 rounded-full border border-ink/10 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-primary-50 hover:text-primary-700"
        @click="upgrade"
      >
        <Icon
          name="lucide:crown"
          class="size-4 text-accent-700"
        />
        {{ t('aiDoctor.account.upgrade') }}
      </button>
    </template>

    <!-- وارد نشده: دکمه‌ی ورود -->
    <NuxtLink
      v-else
      :to="{ path: '/auth/login', query: { redirect: route.fullPath } }"
      class="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
    >
      <Icon
        name="lucide:log-in"
        class="size-4 rtl:-scale-x-100"
      />
      {{ t('auth.login') }}
    </NuxtLink>
  </div>
</template>