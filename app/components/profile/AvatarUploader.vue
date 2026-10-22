<script setup lang="ts">
/** آواتار کاربر با دکمه‌ی تغییر و حذف عکس؛ اندازه‌ش با avatarClass تنظیم می‌شه. */
withDefaults(defineProps<{ avatarClass?: string }>(), { avatarClass: 'size-20' })

const authStore = useAuthStore()
const { t } = useI18n()
const { processing, pick } = useAvatarUpload()

const input = ref<HTMLInputElement | null>(null)
</script>

<template>
  <div class="relative flex shrink-0">
    <UserAvatar
      :src="authStore.user?.avatar"
      :name="authStore.user?.name"
      :class="avatarClass"
    />

    <div
      v-if="processing"
      class="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white"
    >
      <Icon
        name="svg-spinners:ring-resize"
        class="size-6"
      />
    </div>

    <template v-if="authStore.isLoggedIn">
      <button
        type="button"
        class="absolute bottom-2 -end-1 flex size-6 items-center justify-center rounded-full bg-primary-600 text-white shadow ring-2 ring-surface transition-colors hover:bg-primary-700 disabled:opacity-60"
        :aria-label="t('pages.profile.changeAvatar')"
        :title="t('pages.profile.changeAvatar')"
        :disabled="processing"
        @click="input?.click()"
      >
        <Icon
          name="lucide:edit-2"
          class="size-3"
        />
      </button>

      <input
        ref="input"
        type="file"
        accept="image/*"
        class="hidden"
        @change="pick"
      >
    </template>
  </div>
</template>