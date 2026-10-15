<script setup lang="ts">
import type { NuxtError } from '#app'
import type { ThemeKey } from '~/stores/ui.store'

definePageMeta({
  layout: false
})

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const uiStore = useUiStore()
const i18nHead = useLocaleHead()

// هر تم یه عکس 404 داره. اسم‌ها تستی‌ان؛ بعداً فقط همین مسیرها رو عوض کن.
const errorImages: Record<ThemeKey, string> = {
  wine: '/images/error/404-wine.png',
  forest: '/images/error/404-forest.png',
  brown: '/images/error/404-brown.png',
  navy: '/images/error/404-navy.png',
}
const errorImage = computed(() => errorImages[uiStore.theme] ?? errorImages.forest)

const statusCode = computed(() => props.error?.statusCode || 404)
const isNotFound = computed(() => statusCode.value === 404)

const errorMessage = computed(() =>
  props.error?.statusMessage || props.error?.message || t('errors.unknown'),
)
const title = computed(() => isNotFound.value ? t('errors.notFoundTitle') : t('errors.serverTitle'))
const description = computed(() => isNotFound.value ? t('errors.notFoundText') : errorMessage.value)

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
  title: `${statusCode.value} | ${t('brand.name')}`,
}))

function goTo(path: string) {
  clearError({ redirect: path })
}

function refreshPage() {
  clearError()
  location.reload()
}
</script>

<template>
  <NuxtLayout name="sidebar-only">
    <section class="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-2 py-12 text-center">
      <!-- بلاب پس‌زمینه -->
      <div class="absolute left-1/2 top-[6%] -z-10 h-72 w-[min(36rem,92%)] -translate-x-1/2 rounded-[45%_55%_50%_50%/55%_45%_55%_45%] bg-primary-100/70 dark:bg-primary-500/15" />

      <!-- 404: عکس مخصوص تم -->
      <img
        v-if="isNotFound"
        :src="errorImage"
        :alt="t('errors.statusLabel', { status: statusCode })"
        class="-mt-6 w-full max-w-xl select-none sm:max-w-2xl"
        fetchpriority="high"
      >

      <!-- سایر خطاها: چون عکس‌ها عدد 404 رو توی خودشون دارن، فقط کد خطا رو بزرگ نشون می‌دیم -->
      <span
        v-else
        class="select-none text-8xl font-black leading-none text-primary-700 dark:text-primary-300 sm:text-9xl"
        dir="ltr"
        role="img"
        :aria-label="t('errors.statusLabel', { status: statusCode })"
      >{{ statusCode }}</span>

      <h1 class="mt-8 text-2xl font-extrabold text-ink sm:text-4xl">
        {{ title }}
      </h1>
      <p class="mt-3 max-w-md text-sm leading-8 text-ink-muted sm:text-base">
        {{ description }}
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full bg-primary-700 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-800"
          @click="goTo('/')"
        >
          <Icon
            name="lucide:house"
            class="size-4"
          />
          {{ t('errors.backHome') }}
        </button>
        <button
          v-if="isNotFound"
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-primary-600/40 px-7 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-500/10"
          @click="goTo('/plants')"
        >
          <Icon
            name="lucide:search"
            class="size-4"
          />
          {{ t('errors.explorePlants') }}
        </button>
        <button
          v-else
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-primary-600/40 px-7 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-500/10"
          @click="refreshPage"
        >
          <Icon
            name="lucide:rotate-cw"
            class="size-4"
          />
          {{ t('errors.retry') }}
        </button>
      </div>

      <div class="mt-14 flex w-full max-w-sm items-center justify-center gap-2 border-t border-ink/10 pt-5 text-sm">
        <span class="text-ink-muted">{{ t('errors.needHelp') }}</span>
        <button
          type="button"
          class="inline-flex items-center gap-1 font-medium text-primary-700 hover:underline dark:text-primary-300"
          @click="goTo('/support')"
        >
          {{ t('errors.contactSupport') }}
          <Icon
            name="lucide:arrow-left"
            class="size-3.5 ltr:rotate-180"
          />
        </button>
      </div>
    </section>
  </NuxtLayout>
</template>