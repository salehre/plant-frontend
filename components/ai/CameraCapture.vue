<script setup lang="ts">
const emit = defineEmits<{ capture: [string], close: [] }>()

const videoEl = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const error = ref('')

async function startCamera() {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    if (videoEl.value) videoEl.value.srcObject = stream.value
  }
  catch {
    error.value = 'دسترسی به دوربین ممکن نشد. مرورگر یا دستگاهت اجازه نداده.'
  }
}

function stopCamera() {
  stream.value?.getTracks().forEach(track => track.stop())
  stream.value = null
}

function capture() {
  if (!videoEl.value) return
  const canvas = document.createElement('canvas')
  canvas.width = videoEl.value.videoWidth
  canvas.height = videoEl.value.videoHeight
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(videoEl.value, 0, 0)
  canvas.toBlob((blob) => {
    if (blob) emit('capture', URL.createObjectURL(blob))
  }, 'image/jpeg', 0.92)
  stopCamera()
}

onMounted(startCamera)
onBeforeUnmount(stopCamera)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div
      v-if="error"
      class="rounded-md bg-status-danger/10 p-4 text-sm text-status-danger"
    >
      {{ error }}
    </div>
    <div
      v-else
      class="relative w-full overflow-hidden rounded-lg bg-ink"
    >
      <video
        ref="videoEl"
        autoplay
        playsinline
        class="aspect-[4/3] w-full object-cover"
      />
    </div>
    <div class="flex gap-3">
      <AppButton
        variant="ghost"
        @click="emit('close')"
      >
        {{ $t('common.cancel') }}
      </AppButton>
      <AppButton
        v-if="!error"
        variant="primary"
        @click="capture"
      >
        <Icon
          name="lucide:camera"
          class="size-4"
        />
        {{ $t('identify.cameraCta') }}
      </AppButton>
    </div>
  </div>
</template>
