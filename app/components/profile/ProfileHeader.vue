<script setup lang="ts">
// هدر پروفایل: کاور، آواتار، اسم، نشان‌ها، تاریخ عضویت و دکمه‌ی ویرایش.
// دکمه‌ی ویرایش فقط رویداد می‌فرسته؛ باز کردن تب و دایلوگ با والد (pages/profile.vue) است.
const emit = defineEmits<{ edit: [] }>()

const { t, locale } = useI18n()
const authStore = useAuthStore()
const { processing: coverProcessing, pick: pickCover, remove: removeCover } = useCoverUpload()
const { plantCount } = useProfileStats()

const coverInput = ref<HTMLInputElement | null>(null)
const user = computed(() => authStore.user)
const displayName = computed(() => user.value?.name || t('pages.profile.account'))
const intlLocale = computed(() => (locale.value === 'fa' ? 'fa-IR' : 'en-US'))

const joinedLabel = computed(() => {
  if (!user.value?.joinedAt) return ''
  const date = new Intl.DateTimeFormat(intlLocale.value, { month: 'long', year: 'numeric' })
    .format(new Date(user.value.joinedAt))
  return t('pages.profile.joined', { date })
})

// سطح ساده بر اساس تعداد گیاه‌ها
const levelKey = computed(() =>
  plantCount.value >= 10 ? 'pages.profile.level.lover' : 'pages.profile.level.beginner',
)
</script>

<template>
  <div>
    <!-- کاور -->
    <div class="relative h-44 sm:h-60">
      <img
        :src="user?.cover || '/images/plants/header.webp'"
        :alt="$t('home.greenLeavesAlt')"
        class="size-full object-cover"
      >
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

      <div
        v-if="coverProcessing"
        class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <Icon
          name="svg-spinners:ring-resize"
          class="size-8 text-white"
        />
      </div>

      <div
        v-if="authStore.isLoggedIn"
        class="absolute end-3 top-3 flex items-center gap-1 rounded-full border border-white/10 bg-black/30 p-1 backdrop-blur-md sm:end-4 sm:top-4"
      >
        <button
          v-if="user?.cover"
          type="button"
          class="flex size-8 items-center justify-center rounded-full text-white/90 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
          :aria-label="$t('pages.profile.removeCover')"
          :title="$t('pages.profile.removeCover')"
          :disabled="coverProcessing"
          @click="removeCover"
        >
          <Icon
            name="lucide:trash-2"
            class="size-4"
          />
        </button>
        <button
          type="button"
          class="flex size-8 items-center justify-center rounded-full text-white/90 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
          :aria-label="$t('pages.profile.changeCover')"
          :title="$t('pages.profile.changeCover')"
          :disabled="coverProcessing"
          @click="coverInput?.click()"
        >
          <Icon
            name="lucide:camera"
            class="size-4"
          />
        </button>
      </div>

      <input
        ref="coverInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="pickCover"
      >
    </div>

    <!-- آواتار و مشخصات -->
    <div class="relative px-4 pb-5 sm:px-8 sm:pb-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
          <div class="relative z-10 -mt-12 w-fit shrink-0 sm:-mt-16">
            <AvatarUploader avatar-class="size-24 sm:size-32 shadow-card ring-4 ring-surface" />
          </div>

          <div class="min-w-0 max-w-full sm:pb-1">
            <div class="flex flex-wrap items-center gap-2 pt-4">
              <h1 class="truncate text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                {{ displayName }}
              </h1>
              <span
                v-if="authStore.isLoggedIn"
                class="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-700"
              >
                <Icon
                  name="lucide:badge-check"
                  class="size-3.5"
                />
                {{ t('pages.profile.verified') }}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-bold text-accent-700">
                <Icon
                  name="lucide:leaf"
                  class="size-3.5"
                />
                {{ t(levelKey) }}
              </span>
            </div>

            <p
              v-if="user?.email"
              class="mt-1 truncate text-sm text-ink-muted"
              dir="ltr"
            >
              {{ user.email }}
            </p>

            <div class="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
              <span
                v-if="joinedLabel"
                class="inline-flex items-center gap-1.5"
              >
                <Icon
                  name="lucide:calendar"
                  class="size-3.5"
                />
                {{ joinedLabel }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <Icon
                  name="lucide:sprout"
                  class="size-3.5"
                />
                {{ t('pages.profile.plantsMeta', { n: plantCount }) }}
              </span>
            </div>
          </div>
        </div>

        <button
          v-if="authStore.isLoggedIn"
          type="button"
          class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-ink/10 bg-surface px-4 py-2.5 text-sm font-bold text-ink shadow-xs transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 sm:w-auto"
          @click="emit('edit')"
        >
          <Icon
            name="lucide:pencil"
            class="size-4"
          />
          {{ $t('pages.profile.editProfile') }}
        </button>
      </div>
    </div>
  </div>
</template>
