<script setup lang="ts">
const identifyStore = useIdentifyStore()
const { locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

const hasResult = computed(() => identifyStore.status === 'done' && !!identifyStore.result)

function onImageSelected(url: string) {
  identifyStore.setPreview(url)
  identifyStore.runIdentify(activeLocale.value)
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div>
      <h1 class="text-2xl font-bold text-ink">
        {{ $t('identify.title') }}
      </h1>
      <p class="mt-1 text-sm text-ink-muted">
        {{ $t('identify.subtitle') }}
      </p>
    </div>

    <div
      class="grid items-start gap-5"
      :class="identifyStore.previewUrl ? 'lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]' : 'lg:grid-cols-[minmax(0,1fr)_320px]'"
    >
      <!-- دوربین / عکس -->
      <ScanViewfinder
        :preview-url="identifyStore.previewUrl"
        :analyzing="identifyStore.status === 'analyzing'"
        @select="onImageSelected"
        @reset="identifyStore.reset()"
      />

      <!-- نتیجه / لودینگ / خطا / نکته‌ها -->
      <ScanResultPanel
        v-if="hasResult && identifyStore.result"
        :result="identifyStore.result"
      />

      <div
        v-else-if="identifyStore.status === 'analyzing'"
        class="glass-card flex flex-col gap-4 p-5"
      >
        <div class="flex items-center gap-3">
          <AppSkeleton
            height="4rem"
            width="4rem"
            rounded="rounded-xl"
          />
          <div class="flex flex-1 flex-col gap-2">
            <AppSkeleton
              height="1.25rem"
              width="55%"
            />
            <AppSkeleton
              height="0.875rem"
              width="35%"
            />
          </div>
        </div>
        <AppSkeleton
          height="2.25rem"
          width="60%"
          rounded="rounded-full"
        />
        <AppSkeleton height="4rem" />
      </div>

      <div
        v-else-if="identifyStore.status === 'error'"
        class="flex flex-col gap-4"
      >
        <div class="rounded-xl bg-status-danger/10 p-4 text-sm text-status-danger">
          {{ $t(identifyStore.error) }}
        </div>
        <ScanTips />
      </div>

      <ScanTips v-else />
    </div>
  </div>
</template>
