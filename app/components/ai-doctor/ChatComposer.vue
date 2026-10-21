<script setup lang="ts">
const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ send: [payload: { text: string, image?: string }] }>()

const { t } = useI18n()
const uiStore = useUiStore()

const MAX_IMAGE_MB = 5
const MAX_LENGTH = 1000

const text = ref('')
const image = ref('')
const inputEl = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const canSend = computed(() => !props.disabled && (!!text.value.trim() || !!image.value))

function autoGrow() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 128)}px`
}
watch(text, () => nextTick(autoGrow))

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function onFilePicked(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !file.type.startsWith('image/')) return
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    uiStore.showToast(t('aiDoctor.imageTooLarge', { max: MAX_IMAGE_MB }), 'error')
    return
  }
  image.value = await readAsDataUrl(file)
}

function submit() {
  if (!canSend.value) return
  emit('send', { text: text.value.trim(), image: image.value || undefined })
  text.value = ''
  image.value = ''
  nextTick(autoGrow)
}

function onEnter(e: KeyboardEvent) {
  // Enter ارسال، Shift+Enter خط جدید؛ وسط تایپ با IME (کیبورد فارسی/ژاپنی...) کاری نکن
  if (e.isComposing || e.shiftKey) return
  e.preventDefault()
  submit()
}

defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- عکس آماده‌ی ارسال -->
    <div
      v-if="image"
      class="flex w-fit items-center gap-2 rounded-xl border border-ink/10 bg-ink/[0.04] p-1.5"
    >
      <img
        :src="image"
        :alt="$t('aiDoctor.userImageAlt')"
        class="size-12 rounded-lg object-cover"
      >
      <button
        type="button"
        class="flex size-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-ink/10 hover:text-status-danger"
        :aria-label="$t('aiDoctor.removeImage')"
        @click="image = ''"
      >
        <Icon
          name="lucide:x"
          class="size-4"
        />
      </button>
    </div>

    <div class="flex items-end gap-2">
      <button
        type="button"
        class="flex size-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700 disabled:opacity-50"
        :disabled="disabled"
        :aria-label="$t('aiDoctor.attachImage')"
        :title="$t('aiDoctor.attachImage')"
        @click="fileInput?.click()"
      >
        <Icon
          name="lucide:image-plus"
          class="size-5"
        />
      </button>

      <textarea
        ref="inputEl"
        v-model="text"
        rows="1"
        dir="auto"
        :maxlength="MAX_LENGTH"
        :placeholder="$t('aiDoctor.inputPlaceholder')"
        :aria-label="$t('aiDoctor.inputPlaceholder')"
        class="max-h-32 min-h-11 flex-1 resize-none rounded-3xl border border-ink/10 bg-surface px-4 py-2.5 text-sm leading-6 text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-primary-500"
        @keydown.enter="onEnter"
      />

      <button
        type="button"
        class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:bg-primary-200"
        :disabled="!canSend"
        :aria-label="$t('aiDoctor.send')"
        @click="submit"
      >
        <Icon
          name="lucide:send"
          class="size-5 rtl:-scale-x-100"
        />
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFilePicked"
    >
  </div>
</template>
