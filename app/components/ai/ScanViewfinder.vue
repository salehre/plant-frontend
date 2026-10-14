<script setup lang="ts">
/**
 * ویوفایندر صفحه‌ی اسکن: دوربین زنده + کادر نشانه‌گیری + دکمه‌ی گالری / شاتر / تعویض دوربین.
 * - دوربین تا وقتی کاربر دکمه‌ی شاتر رو نزنه روشن نمی‌شه (درخواست مجوز بی‌موقع نداریم).
 * - وقتی previewUrl داده بشه، عکس انتخاب‌شده/گرفته‌شده نمایش داده می‌شه و کنترل‌ها عوض می‌شن.
 */
const props = defineProps<{ previewUrl?: string, analyzing?: boolean }>()
const emit = defineEmits<{ select: [string], reset: [] }>()
const { t } = useI18n()

const videoEl = ref<HTMLVideoElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const stream = shallowRef<MediaStream | null>(null)
const facing = ref<'environment' | 'user'>('environment')
const error = ref('')
const isDragging = ref(false)
const cameraOn = computed(() => !!stream.value)

function stopCamera() {
  stream.value?.getTracks().forEach(track => track.stop())
  stream.value = null
}

async function startCamera() {
  stopCamera()
  error.value = ''
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing.value } })
    await nextTick()
    if (videoEl.value) videoEl.value.srcObject = stream.value
  }
  catch {
    error.value = t('components.cameraCapture.permissionDenied')
  }
}

function capture() {
  const video = videoEl.value
  if (!video) return
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d')?.drawImage(video, 0, 0)
  canvas.toBlob((blob) => {
    if (blob) emit('select', URL.createObjectURL(blob))
  }, 'image/jpeg', 0.92)
  stopCamera()
}

function onShutter() {
  if (cameraOn.value) capture()
  else void startCamera()
}

function switchCamera() {
  facing.value = facing.value === 'environment' ? 'user' : 'environment'
  if (cameraOn.value) void startCamera()
}

function handleFile(file: File | undefined) {
  if (!file || !file.type.startsWith('image/')) return
  stopCamera()
  emit('select', URL.createObjectURL(file))
}

function onInputChange(e: Event) {
  handleFile((e.target as HTMLInputElement).files?.[0])
  ;(e.target as HTMLInputElement).value = ''
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  handleFile(e.dataTransfer?.files?.[0])
}

onBeforeUnmount(stopCamera)
</script>

<template>
  <div
    class="relative aspect-[3/4] w-full sm:aspect-[4/5] overflow-hidden rounded-[22px] bg-primary-900 ring-2 transition-shadow lg:max-h-[620px]"
    :class="isDragging ? 'ring-primary-400' : 'ring-transparent'"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <!-- دوربین زنده -->
    <video
      v-show="cameraOn && !previewUrl"
      ref="videoEl"
      autoplay
      playsinline
      muted
      class="absolute inset-0 size-full object-cover"
    />

    <!-- عکس انتخاب‌شده -->
    <img
      v-if="previewUrl"
      :src="previewUrl"
      :alt="$t('identify.uploadedImageAlt')"
      class="absolute inset-0 size-full object-cover"
    >

    <!-- حالت اولیه (دوربین خاموش) -->
    <div
      v-if="!cameraOn && !previewUrl"
      class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-primary-800 to-primary-900 px-10 text-center text-white/80"
    >
      <Icon
        name="lucide:scan-line"
        class="size-12 text-primary-300"
      />
      <p
        class="max-w-xs text-sm leading-7"
        :class="error ? 'text-red-200' : ''"
      >
        {{ error || $t('identify.viewfinderHint') }}
      </p>
    </div>

    <!-- کادر نشانه‌گیری -->
    <div class="pointer-events-none absolute inset-8 sm:inset-12">
      <span class="absolute left-0 top-0 size-12 rounded-tl-3xl border-l-4 border-t-4 border-white" />
      <span class="absolute right-0 top-0 size-12 rounded-tr-3xl border-r-4 border-t-4 border-white" />
      <span class="absolute bottom-0 left-0 size-12 rounded-bl-3xl border-b-4 border-l-4 border-white" />
      <span class="absolute bottom-0 right-0 size-12 rounded-br-3xl border-b-4 border-r-4 border-white" />
    </div>

    <!-- راهنمای زیر کادر -->
    <p
      v-if="!previewUrl"
      class="pointer-events-none absolute inset-x-8 bottom-36 text-center text-sm leading-6 text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]"
    >
      {{ $t('identify.pointHint') }}
    </p>

    <!-- در حال تحلیل -->
    <div
      v-if="analyzing"
      class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-primary-900/55 text-white"
    >
      <span class="scan-line absolute inset-x-8 h-0.5 rounded-full bg-primary-300 shadow-[0_0_16px_4px_rgba(138,197,163,0.8)]" />
      <Icon
        name="svg-spinners:180-ring"
        class="size-8"
      />
      <span class="text-sm font-medium">{{ $t('identify.analyzing') }}</span>
    </div>

    <!-- کنترل‌ها: قبل از عکس -->
    <div
      v-if="!previewUrl"
      class="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/75 via-black/40 to-transparent px-6 pb-5 pt-16"
    >
      <button
        type="button"
        class="flex w-16 flex-col items-center gap-1 text-xs text-white/90"
        @click="fileInput?.click()"
      >
        <span class="flex size-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <Icon
            name="lucide:image"
            class="size-5"
          />
        </span>
        {{ $t('identify.gallery') }}
      </button>

      <button
        type="button"
        class="flex size-[72px] items-center justify-center rounded-full border-4 border-white bg-white/90 text-primary-800 ring-4 ring-white/25 transition-transform active:scale-95"
        :aria-label="cameraOn ? $t('components.cameraCapture.capture') : $t('identify.cameraCta')"
        @click="onShutter"
      >
        <Icon
          v-if="!cameraOn"
          name="lucide:camera"
          class="size-7"
        />
      </button>

      <button
        type="button"
        class="flex w-16 flex-col items-center gap-1 text-xs text-white/90"
        :aria-label="$t('identify.switchCamera')"
        @click="switchCamera"
      >
        <span class="flex size-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <Icon
            name="lucide:switch-camera"
            class="size-5"
          />
        </span>
        {{ $t('identify.switchCamera') }}
      </button>
    </div>

    <!-- کنترل: بعد از عکس -->
    <div
      v-else-if="!analyzing"
      class="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/70 to-transparent px-6 pb-5 pt-14"
    >
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-white/90 px-5 py-2.5 text-sm font-bold text-primary-800 transition-colors hover:bg-white"
        @click="emit('reset')"
      >
        <Icon
          name="lucide:rotate-ccw"
          class="size-4"
        />
        {{ $t('identify.tryAgain') }}
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onInputChange"
    >
  </div>
</template>

<style scoped>
.scan-line {
  top: 12%;
  animation: scan-sweep 2s ease-in-out infinite;
}
@keyframes scan-sweep {
  0%, 100% { top: 12%; }
  50% { top: 86%; }
}
@media (prefers-reduced-motion: reduce) {
  .scan-line { animation: none; }
}
</style>
