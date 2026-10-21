<script setup lang="ts">
/**
 * معادل Prompt Input + Prompt Input Attachments در localmode.ai:
 * Enter ارسال، Shift+Enter خط جدید، دکمه‌ی ارسال هنگام استریم به «توقف» تبدیل می‌شه،
 * عکس با دکمه‌ی +، چسباندن (Ctrl+V) یا کشیدن و رها کردن اضافه می‌شه.
 */
const props = defineProps<{
  /** AI داره جواب می‌ده */
  streaming?: boolean
}>()
const emit = defineEmits<{
  submit: [payload: { text: string, image?: string }]
  stop: []
}>()

const { t } = useI18n()
const uiStore = useUiStore()

const MAX_IMAGE_MB = 5
const MAX_LENGTH = 1000

const text = ref('')
const image = ref('')
const dragging = ref(false)
const inputEl = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const canSend = computed(() => !props.streaming && (!!text.value.trim() || !!image.value))

function autoGrow() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 192)}px`
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

async function setImageFile(file?: File | null) {
  if (!file || !file.type.startsWith('image/')) return
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    uiStore.showToast(t('aiDoctor.imageTooLarge', { max: MAX_IMAGE_MB }), 'error')
    return
  }
  image.value = await readAsDataUrl(file)
  inputEl.value?.focus()
}

function onFilePicked(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  setImageFile(file)
}

function onPaste(e: ClipboardEvent) {
  const file = Array.from(e.clipboardData?.files ?? []).find(f => f.type.startsWith('image/'))
  if (!file) return
  e.preventDefault()
  setImageFile(file)
}

function onDrop(e: DragEvent) {
  dragging.value = false
  setImageFile(e.dataTransfer?.files?.[0])
}

function submit() {
  if (!canSend.value) return
  emit('submit', { text: text.value.trim(), image: image.value || undefined })
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
  <form
    class="flex flex-col gap-2 rounded-[28px] border bg-surface p-2.5 shadow-sm transition-colors focus-within:border-primary-500/60"
    :class="dragging ? 'border-primary-500 bg-primary-50' : 'border-ink/10'"
    @submit.prevent="submit"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDrop"
  >
    <!-- عکس آماده‌ی ارسال -->
    <div
      v-if="image"
      class="relative w-fit"
    >
      <img
        :src="image"
        :alt="$t('aiDoctor.userImageAlt')"
        class="size-16 rounded-2xl object-cover"
      >
      <button
        type="button"
        class="absolute -end-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-ink text-surface shadow transition-opacity hover:opacity-80"
        :aria-label="$t('aiDoctor.removeImage')"
        @click="image = ''"
      >
        <Icon
          name="lucide:x"
          class="size-3.5"
        />
      </button>
    </div>

    <textarea
      ref="inputEl"
      v-model="text"
      rows="1"
      dir="auto"
      :maxlength="MAX_LENGTH"
      :placeholder="$t('aiDoctor.inputPlaceholder')"
      :aria-label="$t('aiDoctor.inputPlaceholder')"
      class="max-h-48 min-h-11 w-full resize-none bg-transparent px-3 py-2.5 text-[15px] leading-6 text-ink outline-none placeholder:text-ink-muted"
      @keydown.enter="onEnter"
      @paste="onPaste"
    />

    <div class="flex items-center justify-between gap-2">
      <button
        type="button"
        class="flex size-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
        :aria-label="$t('aiDoctor.attachImage')"
        :title="$t('aiDoctor.attachImage')"
        @click="fileInput?.click()"
      >
        <Icon
          name="lucide:plus"
          class="size-5"
        />
      </button>

      <!-- وقتی AI در حال جواب دادنه: توقف؛ وگرنه ارسال -->
      <button
        v-if="streaming"
        type="button"
        class="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-surface transition-opacity hover:opacity-80"
        :aria-label="$t('aiDoctor.stop')"
        :title="$t('aiDoctor.stop')"
        @click="emit('stop')"
      >
        <Icon
          name="lucide:square"
          class="size-4 fill-current"
        />
      </button>
      <button
        v-else
        type="submit"
        class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:bg-ink/15 disabled:text-ink-muted"
        :disabled="!canSend"
        :aria-label="$t('aiDoctor.send')"
        :title="$t('aiDoctor.send')"
      >
        <Icon
          name="lucide:arrow-up"
          class="size-5"
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
  </form>
</template>