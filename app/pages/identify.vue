<script setup lang="ts">
const identifyStore = useIdentifyStore()
const showCamera = ref(false)

function onImageSelected(url: string) {
  identifyStore.setPreview(url)
  identifyStore.runIdentify()
}

function onCameraCapture(url: string) {
  showCamera.value = false
  onImageSelected(url)
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-12">
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold text-ink sm:text-3xl">
        {{ $t('identify.title') }}
      </h1>
      <p class="mt-2 text-ink-muted">
        {{ $t('identify.subtitle') }}
      </p>
    </div>

    <!-- حالت اولیه: آپلود -->
    <div v-if="identifyStore.status === 'idle' && !identifyStore.previewUrl">
      <ImageUploader @select="onImageSelected">
        <template #camera-trigger>
          <AppButton
            variant="secondary"
            @click="showCamera = true"
          >
            <Icon
              name="lucide:camera"
              class="size-4"
            />
            {{ $t('identify.cameraCta') }}
          </AppButton>
        </template>
      </ImageUploader>
    </div>

    <!-- حالت دوربین -->
    <AppModal
      v-model="showCamera"
      title="گرفتن عکس"
    >
      <CameraCapture
        @capture="onCameraCapture"
        @close="showCamera = false"
      />
    </AppModal>

    <!-- پیش‌نمایش + لودینگ / نتیجه -->
    <div
      v-if="identifyStore.previewUrl"
      class="flex flex-col items-center gap-6"
    >
      <div class="relative w-full max-w-sm overflow-hidden rounded-lg">
        <img
          :src="identifyStore.previewUrl"
          alt="تصویر بارگذاری‌شده"
          class="aspect-square w-full object-cover"
        >
        <div
          v-if="identifyStore.status === 'analyzing'"
          class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/50 text-white"
        >
          <Icon
            name="svg-spinners:180-ring"
            class="size-8"
          />
          <span class="text-sm">{{ $t('identify.analyzing') }}</span>
        </div>
      </div>

      <div
        v-if="identifyStore.status === 'analyzing'"
        class="w-full max-w-sm"
      >
        <AppSkeleton
          height="1.5rem"
          width="60%"
          class="mb-2"
        />
        <AppSkeleton
          height="1rem"
          width="90%"
        />
      </div>

      <PredictionCard
        v-else-if="identifyStore.status === 'done' && identifyStore.result"
        :result="identifyStore.result"
        class="w-full"
      />

      <div
        v-else-if="identifyStore.status === 'error'"
        class="rounded-md bg-status-danger/10 p-4 text-sm text-status-danger"
      >
        {{ identifyStore.error }}
      </div>

      <AppButton
        variant="ghost"
        @click="identifyStore.reset()"
      >
        <Icon
          name="lucide:rotate-ccw"
          class="size-4"
        />
        {{ $t('identify.tryAgain') }}
      </AppButton>
    </div>
  </div>
</template>
