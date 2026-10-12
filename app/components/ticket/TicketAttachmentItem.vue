<script setup lang="ts">
import type { TicketAttachment } from '~/types/ticket.types'

const props = defineProps<{
  attachment: TicketAttachment
  /** پیوست پیام خودِ کاربره (رنگ‌ها روی پس‌زمینه‌ی تیره) */
  own?: boolean
}>()
const emit = defineEmits<{ preview: [url: string] }>()

const { t } = useI18n()
const { formatFileSize, formatDuration } = useTicketFormat()

const audioEl = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const current = ref(0)

const total = computed(() => props.attachment.duration ?? 0)
const percent = computed(() => (total.value ? Math.min(100, (current.value / total.value) * 100) : 0))

function toggle() {
  const a = audioEl.value
  if (!a) return
  if (a.paused) a.play()
  else a.pause()
}

const soft = computed(() => (props.own ? 'bg-white/15 text-white' : 'bg-ink/[0.06] text-ink'))
</script>

<template>
  <!-- تصویر -->
  <button
    v-if="attachment.kind === 'image'"
    type="button"
    class="block overflow-hidden rounded-xl"
    :aria-label="attachment.name"
    @click="emit('preview', attachment.url)"
  >
    <img
      :src="attachment.url"
      :alt="attachment.name"
      class="max-h-52 w-full max-w-xs object-cover"
      loading="lazy"
    >
  </button>

  <!-- پیام صوتی -->
  <div
    v-else-if="attachment.kind === 'voice'"
    class="flex w-64 max-w-full items-center gap-3 rounded-xl px-3 py-2"
    :class="soft"
  >
    <button
      type="button"
      class="flex size-9 shrink-0 items-center justify-center rounded-full"
      :class="own ? 'bg-white text-primary-700' : 'bg-primary-600 text-white'"
      :aria-label="playing ? t('tickets.detail.pause') : t('tickets.detail.play')"
      @click="toggle"
    >
      <Icon
        :name="playing ? 'lucide:pause' : 'lucide:play'"
        class="size-4"
      />
    </button>
    <div class="flex min-w-0 flex-1 flex-col gap-1.5">
      <div
        class="h-1.5 overflow-hidden rounded-full"
        :class="own ? 'bg-white/25' : 'bg-ink/15'"
        dir="ltr"
      >
        <div
          class="h-full rounded-full transition-[width] duration-200"
          :class="own ? 'bg-white' : 'bg-primary-600'"
          :style="{ width: `${percent}%` }"
        />
      </div>
      <span class="text-[11px] opacity-80">
        {{ t('tickets.detail.voiceMessage') }} · {{ formatDuration(playing || current ? current : total) }}
      </span>
    </div>
    <audio
      ref="audioEl"
      :src="attachment.url"
      preload="metadata"
      class="hidden"
      @play="playing = true"
      @pause="playing = false"
      @ended="playing = false; current = 0"
      @timeupdate="current = audioEl?.currentTime ?? 0"
    />
  </div>

  <!-- فایل -->
  <a
    v-else
    :href="attachment.url"
    :download="attachment.name"
    class="flex w-64 max-w-full items-center gap-3 rounded-xl px-3 py-2 transition-opacity hover:opacity-90"
    :class="soft"
  >
    <span
      class="flex size-9 shrink-0 items-center justify-center rounded-lg"
      :class="own ? 'bg-white/20' : 'bg-primary-50 text-primary-700'"
    >
      <Icon
        name="lucide:file-text"
        class="size-4"
      />
    </span>
    <span class="flex min-w-0 flex-1 flex-col">
      <span
        class="truncate text-xs font-medium"
        dir="auto"
      >{{ attachment.name }}</span>
      <span class="text-[11px] opacity-75">{{ formatFileSize(attachment.size) }}</span>
    </span>
    <Icon
      name="lucide:download"
      class="size-4 shrink-0 opacity-80"
      :aria-label="t('tickets.detail.download')"
    />
  </a>
</template>
