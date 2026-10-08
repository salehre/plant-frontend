<script setup lang="ts">
const emit = defineEmits<{ select: [string] }>()
const { t } = useI18n()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

function openFileDialog() {
  fileInput.value?.click()
}

function handleFile(file: File | undefined) {
  if (!file || !file.type.startsWith('image/')) return
  const url = URL.createObjectURL(file)
  emit('select', url)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  handleFile(file)
}

function onInputChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  handleFile(file)
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-10 text-center transition-colors"
    :class="isDragging ? 'border-primary-500 bg-primary-50' : 'border-ink/15 bg-surface'"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <div class="flex size-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
      <Icon
        name="lucide:image-plus"
        class="size-8"
      />
    </div>
    <div>
      <p class="font-medium text-ink">
        {{ t('components.imageUploader.dropPrompt') }}
      </p>
      <p class="mt-1 text-sm text-ink-muted">
        {{ t('components.imageUploader.supportedFormats') }}
      </p>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-3">
      <AppButton
        variant="primary"
        @click="openFileDialog"
      >
        <Icon
          name="lucide:upload"
          class="size-4"
        />
        {{ $t('identify.uploadCta') }}
      </AppButton>
      <slot name="camera-trigger" />
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
