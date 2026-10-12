<script setup lang="ts">
import {
  TICKET_MAX_ATTACHMENTS,
  TICKET_MAX_FILE_BYTES,
  TICKET_MAX_VOICE_SECONDS,
  type TicketAttachment,
} from '~/types/ticket.types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const store = useTicketStore()
const uiStore = useUiStore()
const { formatDateTime, formatFileSize, formatDuration, ticketCode } = useTicketFormat()

store.ensureSeeded()

const ticket = computed(() => store.getById(String(route.params.id)))

useHead(() => ({
  title: ticket.value ? `${ticketCode(ticket.value.id)} | ${ticket.value.subject}` : t('tickets.detail.notFoundTitle'),
}))

const reply = ref('')
const replyError = ref('')
const pending = ref<TicketAttachment[]>([])
const previewUrl = ref<string | null>(null)
const threadEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const recorder = useVoiceRecorder(TICKET_MAX_VOICE_SECONDS, () => finishVoice())

const hasContent = computed(() => !!reply.value.trim() || pending.value.length > 0)
const showMic = computed(() => recorder.supported && !hasContent.value)

async function scrollToEnd(smooth = true) {
  await nextTick()
  const el = threadEl.value
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
}

onMounted(() => scrollToEnd(false))
useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') previewUrl.value = null
})

function autoGrow() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 128)}px`
}

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error)
    r.readAsDataURL(blob)
  })
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

/* ---------- فایل ---------- */
async function onFilesPicked(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ''
  for (const file of files) {
    if (pending.value.length >= TICKET_MAX_ATTACHMENTS) {
      uiStore.showToast(t('tickets.errors.tooManyFiles', { max: TICKET_MAX_ATTACHMENTS }), 'error')
      break
    }
    if (file.size > TICKET_MAX_FILE_BYTES) {
      uiStore.showToast(t('tickets.errors.fileTooLarge', { max: formatFileSize(TICKET_MAX_FILE_BYTES) }), 'error')
      continue
    }
    pending.value.push({
      id: uid(),
      kind: file.type.startsWith('image/') ? 'image' : 'file',
      name: file.name,
      mime: file.type,
      size: file.size,
      url: await readAsDataUrl(file),
    })
  }
  replyError.value = ''
}

function removePending(id: string) {
  pending.value = pending.value.filter(a => a.id !== id)
}

/* ---------- ارسال ---------- */
async function submit(body: string, attachments: TicketAttachment[]): Promise<boolean> {
  if (!ticket.value) return false
  const ok = await store.reply(ticket.value.id, body, attachments)
  if (ok) {
    uiStore.showToast(t('tickets.detail.replySent'))
    scrollToEnd()
  }
  else {
    uiStore.showToast(t('tickets.new.error'), 'error')
  }
  return ok
}

async function sendReply() {
  if (!ticket.value || store.submitting) return
  const body = reply.value.trim()
  if (!pending.value.length && body.length < 2) {
    replyError.value = t('tickets.errors.replyMin')
    return
  }
  if (body.length > 2000) {
    replyError.value = t('tickets.errors.messageMax')
    return
  }
  replyError.value = ''
  const ok = await submit(body, [...pending.value])
  if (ok) {
    reply.value = ''
    pending.value = []
    await nextTick()
    autoGrow()
  }
}

function onEnter(e: KeyboardEvent) {
  if (e.isComposing || e.shiftKey) return
  e.preventDefault()
  sendReply()
}

/* ---------- پیام صوتی ---------- */
async function startVoice() {
  try {
    await recorder.start()
  }
  catch {
    uiStore.showToast(t('tickets.errors.micDenied'), 'error')
  }
}

async function finishVoice() {
  const result = await recorder.stop()
  if (!result) return
  if (result.duration < 1) {
    uiStore.showToast(t('tickets.errors.voiceTooShort'), 'error')
    return
  }
  if (result.blob.size > TICKET_MAX_FILE_BYTES * 2) {
    uiStore.showToast(t('tickets.errors.fileTooLarge', { max: formatFileSize(TICKET_MAX_FILE_BYTES * 2) }), 'error')
    return
  }
  const ext = result.mime.includes('mp4') ? 'm4a' : result.mime.includes('ogg') ? 'ogg' : 'webm'
  await submit('', [{
    id: uid(),
    kind: 'voice',
    name: `voice.${ext}`,
    mime: result.mime,
    size: result.blob.size,
    duration: result.duration,
    url: await readAsDataUrl(result.blob),
  }])
}

async function toggleClosed() {
  if (!ticket.value) return
  const close = ticket.value.status !== 'closed'
  const ok = await store.setClosed(ticket.value.id, close)
  if (ok) uiStore.showToast(t(close ? 'tickets.detail.closedToast' : 'tickets.detail.reopenedToast'))
}

watch(reply, () => {
  if (replyError.value) replyError.value = ''
  nextTick(autoGrow)
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10 sm:py-14">
    <NuxtLink
      to="/tickets"
      class="mb-6 inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-primary-700"
    >
      <Icon
        name="lucide:arrow-right"
        class="size-4 rtl:rotate-0 ltr:rotate-180"
      />
      {{ t('tickets.backToList') }}
    </NuxtLink>

    <!-- تیکت پیدا نشد -->
    <div
      v-if="!ticket"
      class="glass-card flex flex-col items-center gap-3 px-6 py-14 text-center"
    >
      <span class="flex size-14 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
        <Icon
          name="lucide:search-x"
          class="size-7"
        />
      </span>
      <h1 class="text-lg font-bold text-ink">
        {{ t('tickets.detail.notFoundTitle') }}
      </h1>
      <p class="max-w-md text-sm leading-7 text-ink-muted">
        {{ t('tickets.detail.notFoundText') }}
      </p>
      <NuxtLink to="/tickets">
        <AppButton variant="primary">
          {{ t('tickets.backToList') }}
        </AppButton>
      </NuxtLink>
    </div>

    <template v-else>
      <!-- کادر چت -->
      <div class="glass-card flex flex-col overflow-hidden">
        <!-- هدر چت -->
        <header class="flex flex-col gap-3 border-b border-ink/10 p-4 sm:p-5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span
                class="text-sm font-medium text-ink-muted"
                dir="ltr"
              >{{ ticketCode(ticket.id) }}</span>
              <TicketStatusBadge :status="ticket.status" />
            </div>
            <AppButton
              v-if="ticket.status === 'closed'"
              variant="secondary"
              :loading="store.submitting"
              @click="toggleClosed"
            >
              <Icon
                name="lucide:lock-open"
                class="size-4"
              />
              {{ t('tickets.detail.reopen') }}
            </AppButton>
            <AppButton
              v-else
              variant="ghost"
              :disabled="store.submitting"
              @click="toggleClosed"
            >
              <Icon
                name="lucide:lock"
                class="size-4"
              />
              {{ t('tickets.detail.close') }}
            </AppButton>
          </div>
          <h1 class="text-lg font-bold leading-8 text-ink sm:text-xl">
            {{ ticket.subject }}
          </h1>
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-lg bg-ink/[0.06] px-2.5 py-1 text-xs text-ink">
              <Icon
                name="lucide:tag"
                class="size-3.5 text-ink-muted"
              />
              {{ t(`tickets.category.${ticket.category}`) }}
            </span>
            <span
              class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs"
              :class="ticket.priority === 'high' ? 'bg-status-danger/10 font-medium text-status-danger' : 'bg-ink/[0.06] text-ink'"
            >
              <Icon
                name="lucide:flag"
                class="size-3.5"
                :class="ticket.priority === 'high' ? '' : 'text-ink-muted'"
              />
              {{ t(`tickets.priority.${ticket.priority}`) }}
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-lg bg-ink/[0.06] px-2.5 py-1 text-xs text-ink">
              <Icon
                name="lucide:calendar"
                class="size-3.5 text-ink-muted"
              />
              {{ formatDateTime(ticket.createdAt) }}
            </span>
          </div>
        </header>

        <!-- پیام‌ها -->
        <section
          ref="threadEl"
          class="flex min-h-64 max-h-[55vh] flex-col gap-3 overflow-y-auto bg-ink/[0.03] p-4 sm:p-5"
          :aria-label="t('tickets.detail.conversation')"
        >
          <article
            v-for="m in ticket.messages"
            :key="m.id"
            class="flex max-w-[90%] flex-col gap-2 rounded-2xl px-4 py-3 shadow-sm sm:max-w-[80%]"
            :class="m.author === 'user'
              ? 'self-start rounded-ss-sm bg-primary-600 text-white'
              : 'self-end rounded-se-sm border border-ink/10 bg-white/60 text-ink dark:bg-white/10'"
          >
            <span
              v-if="m.author === 'support'"
              class="text-xs font-medium text-primary-700"
            >{{ t(`tickets.author.${m.author}`) }}</span>

            <div
              v-if="m.attachments?.length"
              class="flex flex-col gap-2"
            >
              <TicketAttachmentItem
                v-for="a in m.attachments"
                :key="a.id"
                :attachment="a"
                :own="m.author === 'user'"
                @preview="previewUrl = $event"
              />
            </div>

            <p
              v-if="m.body"
              class="whitespace-pre-line text-sm leading-7"
            >
              {{ m.body }}
            </p>

            <time
              :datetime="m.createdAt"
              class="text-[11px]"
              :class="m.author === 'user' ? 'text-white/70' : 'text-ink-muted'"
            >{{ formatDateTime(m.createdAt) }}</time>
          </article>
        </section>

        <!-- ورودی پاسخ / وضعیت بسته -->
        <footer class="border-t border-ink/10 p-3 sm:p-4">
          <p
            v-if="ticket.status === 'closed'"
            class="flex items-center gap-2 text-sm text-ink-muted"
          >
            <Icon
              name="lucide:lock"
              class="size-4 shrink-0"
            />
            {{ t('tickets.detail.closedNote') }}
          </p>

          <div
            v-else
            class="flex flex-col gap-2"
          >
            <!-- پیوست‌های آماده‌ی ارسال -->
            <ul
              v-if="pending.length"
              class="flex flex-wrap gap-2"
            >
              <li
                v-for="a in pending"
                :key="a.id"
                class="flex max-w-full items-center gap-2 rounded-xl border border-ink/10 bg-ink/[0.04] py-1.5 pe-1.5 ps-2"
              >
                <img
                  v-if="a.kind === 'image'"
                  :src="a.url"
                  :alt="a.name"
                  class="size-8 rounded-md object-cover"
                >
                <Icon
                  v-else
                  name="lucide:file-text"
                  class="size-5 shrink-0 text-primary-700"
                />
                <span class="flex min-w-0 flex-col">
                  <span
                    class="max-w-40 truncate text-xs text-ink"
                    dir="auto"
                  >{{ a.name }}</span>
                  <span class="text-[10px] text-ink-muted">{{ formatFileSize(a.size) }}</span>
                </span>
                <button
                  type="button"
                  class="flex size-6 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-ink/10 hover:text-status-danger"
                  :aria-label="t('tickets.detail.removeAttachment')"
                  @click="removePending(a.id)"
                >
                  <Icon
                    name="lucide:x"
                    class="size-3.5"
                  />
                </button>
              </li>
            </ul>

            <!-- حالت ضبط صدا -->
            <div
              v-if="recorder.recording.value"
              class="flex items-center gap-3"
            >
              <button
                type="button"
                class="flex size-11 shrink-0 items-center justify-center rounded-lg text-status-danger transition-colors hover:bg-status-danger/10"
                :aria-label="t('tickets.detail.cancelRecording')"
                @click="recorder.cancel()"
              >
                <Icon
                  name="lucide:trash-2"
                  class="size-5"
                />
              </button>
              <div
                class="flex min-h-11 flex-1 items-center gap-3 rounded-lg bg-status-danger/10 px-4"
                role="status"
              >
                <span class="size-2.5 animate-pulse rounded-full bg-status-danger" />
                <span class="text-sm text-ink">{{ t('tickets.detail.recording') }}</span>
                <span class="ms-auto text-sm tabular-nums text-ink-muted">{{ formatDuration(recorder.seconds.value) }}</span>
              </div>
              <button
                type="button"
                class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
                :disabled="store.submitting"
                :aria-label="t('tickets.detail.sendVoice')"
                @click="finishVoice"
              >
                <Icon
                  name="lucide:send"
                  class="size-5 rtl:-scale-x-100"
                />
              </button>
            </div>

            <!-- حالت عادی -->
            <form
              v-else
              class="flex flex-col gap-1"
              novalidate
              @submit.prevent="sendReply"
            >
              <label
                for="ticket-reply"
                class="sr-only"
              >{{ t('tickets.detail.replyTitle') }}</label>
              <div class="flex items-end gap-2">
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  class="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                  @change="onFilesPicked"
                >
                <button
                  type="button"
                  class="flex size-11 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink/10 hover:text-primary-700"
                  :aria-label="t('tickets.detail.attach')"
                  :title="t('tickets.detail.attach')"
                  @click="fileInput?.click()"
                >
                  <Icon
                    name="lucide:paperclip"
                    class="size-5"
                  />
                </button>
                <textarea
                  id="ticket-reply"
                  ref="inputEl"
                  v-model="reply"
                  rows="1"
                  maxlength="2000"
                  class="field max-h-32 min-h-11 flex-1 resize-none"
                  :placeholder="t('tickets.detail.replyPlaceholder')"
                  :aria-invalid="!!replyError"
                  @keydown.enter="onEnter"
                />
                <button
                  v-if="showMic"
                  type="button"
                  class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white transition-colors hover:bg-primary-700"
                  :aria-label="t('tickets.detail.recordVoice')"
                  :title="t('tickets.detail.recordVoice')"
                  @click="startVoice"
                >
                  <Icon
                    name="lucide:mic"
                    class="size-5"
                  />
                </button>
                <AppButton
                  v-else
                  type="submit"
                  :loading="store.submitting"
                  :aria-label="t('tickets.detail.send')"
                >
                  <Icon
                    name="lucide:send"
                    class="size-4 rtl:-scale-x-100"
                  />
                  <span class="hidden sm:inline">{{ t('tickets.detail.send') }}</span>
                </AppButton>
              </div>
              <p
                v-if="replyError"
                class="text-xs text-status-danger"
              >
                {{ replyError }}
              </p>
            </form>
          </div>
        </footer>
      </div>
    </template>

    <!-- پیش‌نمایش تصویر -->
    <Teleport to="body">
      <div
        v-if="previewUrl"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        role="dialog"
        aria-modal="true"
        @click="previewUrl = null"
      >
        <button
          type="button"
          class="absolute end-4 top-4 flex size-10 items-center justify-center rounded-lg bg-white/15 text-white hover:bg-white/25"
          :aria-label="t('tickets.detail.closePreview')"
          @click="previewUrl = null"
        >
          <Icon
            name="lucide:x"
            class="size-5"
          />
        </button>
        <img
          :src="previewUrl"
          alt=""
          class="max-h-full max-w-full rounded-xl object-contain"
          @click.stop
        >
      </div>
    </Teleport>
  </div>
</template>
