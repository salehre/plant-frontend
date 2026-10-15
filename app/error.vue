<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()

const statusCode = computed(() => props.error?.statusCode || 404)
const isNotFound = computed(() => statusCode.value === 404)

const errorMessage = computed(() =>
  props.error?.statusMessage || props.error?.message || t('errors.unknown'),
)
const title = computed(() => isNotFound.value ? t('errors.notFoundTitle') : t('errors.serverTitle'))
const description = computed(() => isNotFound.value ? t('errors.notFoundText') : errorMessage.value)

useHead(() => ({ title: `${statusCode.value} | ${t('brand.name')}` }))

function goTo(path: string) {
  clearError({ redirect: path })
}

function refreshPage() {
  clearError()
  location.reload()
}
</script>

<template>
  <NuxtLayout name="default">
    <section class="relative isolate flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center overflow-hidden px-2 py-12 text-center">
      <!-- بلاب پس‌زمینه -->
      <div class="absolute left-1/2 top-[6%] -z-10 h-72 w-[min(36rem,92%)] -translate-x-1/2 rounded-[45%_55%_50%_50%/55%_45%_55%_45%] bg-primary-100/70 dark:bg-primary-500/15" />

      <!-- برگ‌های دکوری گوشه‌ها -->
      <MonsteraLeaf class="pointer-events-none absolute -bottom-12 -start-10 -z-10 w-48 rotate-[28deg] text-primary-700 sm:w-72" />
      <MonsteraLeaf class="pointer-events-none absolute -bottom-20 start-24 -z-10 hidden w-40 rotate-[-12deg] text-primary-300/60 sm:block" />
      <MonsteraLeaf class="pointer-events-none absolute -bottom-16 -end-12 -z-10 w-52 -rotate-[32deg] text-primary-800 sm:w-80" />

      <!-- ۴ گلدان ۴ -->
      <div
        v-if="isNotFound"
        class="flex items-end justify-center gap-0 sm:gap-2"
        dir="ltr"
        role="img"
        :aria-label="t('errors.statusLabel', { status: statusCode })"
      >
        <span class="select-none text-[8rem] font-black leading-[0.8] text-primary-700 dark:text-primary-300 sm:text-[12rem]">4</span>
        <PottedMonstera class="-mx-2 mb-1 w-28 shrink-0 sm:-mx-3 sm:w-44" />
        <span class="select-none text-[8rem] font-black leading-[0.8] text-primary-700 dark:text-primary-300 sm:text-[12rem]">4</span>
      </div>

      <!-- سایر خطاها: گلدان بالای کد خطا -->
      <div
        v-else
        class="flex flex-col items-center gap-2"
        dir="ltr"
        role="img"
        :aria-label="t('errors.statusLabel', { status: statusCode })"
      >
        <PottedMonstera class="w-28 sm:w-36" />
        <span class="select-none text-7xl font-black leading-none text-primary-700 dark:text-primary-300 sm:text-8xl">{{ statusCode }}</span>
      </div>

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