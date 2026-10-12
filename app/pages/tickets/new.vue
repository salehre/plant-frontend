<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import {
  TICKET_MAX_ATTACHMENTS,
  TICKET_MAX_FILE_BYTES,
  ticketCategories,
  ticketPriorities,
  type TicketAttachment,
} from '~/types/ticket.types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const store = useTicketStore()
const uiStore = useUiStore()
const { formatFileSize } = useTicketFormat()

useHead(() => ({ title: t('tickets.new.pageTitle') }))

const schema = toTypedSchema(z.object({
  subject: z.string().trim().min(3, 'tickets.errors.subjectMin').max(120, 'tickets.errors.subjectMax'),
  category: z.enum(['technical', 'account', 'plants', 'suggestion', 'other']),
  priority: z.enum(['low', 'normal', 'high']),
  message: z.string().trim().min(10, 'tickets.errors.messageMin').max(2000, 'tickets.errors.messageMax'),
}))

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema,
  initialValues: { subject: '', category: 'technical', priority: 'normal', message: '' },
})

const [subject, subjectAttrs] = defineField('subject')
const [category] = defineField('category')
const [priority] = defineField('priority')
const [message, messageAttrs] = defineField('message')

const categoryOptions = computed(() => ticketCategories.map(c => ({ value: c, label: t(`tickets.category.${c}`) })))
const priorityOptions = computed(() => ticketPriorities.map(p => ({ value: p, label: t(`tickets.priority.${p}`) })))

/* ---------- پیوست‌ها ---------- */
const attachments = ref<TicketAttachment[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error)
    r.readAsDataURL(blob)
  })
}

async function addFiles(files: File[]) {
  for (const file of files) {
    if (attachments.value.length >= TICKET_MAX_ATTACHMENTS) {
      uiStore.showToast(t('tickets.errors.tooManyFiles', { max: TICKET_MAX_ATTACHMENTS }), 'error')
      break
    }
    if (file.size > TICKET_MAX_FILE_BYTES) {
      uiStore.showToast(t('tickets.errors.fileTooLarge', { max: formatFileSize(TICKET_MAX_FILE_BYTES) }), 'error')
      continue
    }
    attachments.value.push({
      id: Math.random().toString(36).slice(2, 10),
      kind: file.type.startsWith('image/') ? 'image' : 'file',
      name: file.name,
      mime: file.type,
      size: file.size,
      url: await readAsDataUrl(file),
    })
  }
}

async function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ''
  await addFiles(files)
}

async function onDrop(e: DragEvent) {
  dragging.value = false
  await addFiles(Array.from(e.dataTransfer?.files ?? []))
}

function removeAttachment(id: string) {
  attachments.value = attachments.value.filter(a => a.id !== id)
}

const onSubmit = handleSubmit(async (values) => {
  try {
    const id = await store.create({ ...values, attachments: attachments.value })
    uiStore.showToast(t('tickets.new.success'))
    await navigateTo(`/tickets/${id}`)
  }
  catch {
    uiStore.showToast(t('tickets.new.error'), 'error')
  }
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

    <header class="mb-6">
      <h1 class="text-2xl font-bold text-ink sm:text-3xl">
        {{ t('tickets.new.title') }}
      </h1>
      <p class="mt-2 text-sm leading-7 text-ink-muted sm:text-base">
        {{ t('tickets.new.subtitle') }}
      </p>
    </header>

    <form
      class="glass-card flex flex-col gap-4 p-5 sm:p-8"
      novalidate
      @submit="onSubmit"
    >
      <div>
        <label
          for="ticket-subject"
          class="mb-1 block text-sm font-medium text-ink"
        >{{ t('tickets.new.subject') }}</label>
        <input
          id="ticket-subject"
          v-model="subject"
          v-bind="subjectAttrs"
          type="text"
          maxlength="120"
          class="field"
          :aria-invalid="!!errors.subject"
        >
        <p
          v-if="errors.subject"
          class="mt-1 text-xs text-status-danger"
        >
          {{ t(errors.subject) }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <span class="mb-1 block text-sm font-medium text-ink">{{ t('tickets.new.category') }}</span>
          <FormSelect
            v-model="category"
            :options="categoryOptions"
            :aria-label="t('tickets.new.category')"
          />
        </div>

        <div>
          <span class="mb-1 block text-sm font-medium text-ink">{{ t('tickets.new.priority') }}</span>
          <FormSelect
            v-model="priority"
            :options="priorityOptions"
            :aria-label="t('tickets.new.priority')"
          />
        </div>
      </div>

      <div>
        <label
          for="ticket-message"
          class="mb-1 block text-sm font-medium text-ink"
        >{{ t('tickets.new.message') }}</label>
        <textarea
          id="ticket-message"
          v-model="message"
          v-bind="messageAttrs"
          rows="8"
          maxlength="2000"
          class="field resize-y"
          :placeholder="t('tickets.new.messageHint')"
          :aria-invalid="!!errors.message"
        />
        <div class="mt-1 flex items-start justify-between gap-3">
          <p
            v-if="errors.message"
            class="text-xs text-status-danger"
          >
            {{ t(errors.message) }}
          </p>
          <span
            v-else
            class="text-xs text-ink-muted"
          >{{ t('tickets.new.messageNote') }}</span>
          <span class="shrink-0 text-xs text-ink-muted">{{ toPersianDigits((message ?? '').length) }} / {{ toPersianDigits(2000) }}</span>
        </div>
      </div>

      <!-- پیوست -->
      <div>
        <span class="mb-1 block text-sm font-medium text-ink">{{ t('tickets.new.attachments') }}</span>
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.zip"
          @change="onPick"
        >
        <button
          type="button"
          class="flex w-full flex-col items-center gap-1 rounded-[var(--radius-control)] border-2 border-dashed px-4 py-6 text-center transition-colors"
          :class="dragging ? 'border-primary-500 bg-primary-50' : 'border-ink/15 hover:border-primary-500/60 hover:bg-ink/[0.03]'"
          @click="fileInput?.click()"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="onDrop"
        >
          <Icon
            name="lucide:upload-cloud"
            class="size-7 text-primary-700"
          />
          <span class="text-sm font-medium text-ink">{{ t('tickets.new.attachDrop') }}</span>
          <span class="text-xs text-ink-muted">{{ t('tickets.new.attachHint', { count: locale === 'fa' ? toPersianDigits(TICKET_MAX_ATTACHMENTS) : TICKET_MAX_ATTACHMENTS, size: formatFileSize(TICKET_MAX_FILE_BYTES) }) }}</span>
        </button>

        <ul
          v-if="attachments.length"
          class="mt-3 flex flex-col gap-2"
        >
          <li
            v-for="a in attachments"
            :key="a.id"
            class="flex items-center gap-3 rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2"
          >
            <img
              v-if="a.kind === 'image'"
              :src="a.url"
              :alt="a.name"
              class="size-10 shrink-0 rounded-lg object-cover"
            >
            <span
              v-else
              class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700"
            >
              <Icon
                name="lucide:file-text"
                class="size-5"
              />
            </span>
            <span class="flex min-w-0 flex-1 flex-col">
              <span
                class="truncate text-sm text-ink"
                dir="auto"
              >{{ a.name }}</span>
              <span class="text-xs text-ink-muted">{{ formatFileSize(a.size) }}</span>
            </span>
            <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink/10 hover:text-status-danger"
              :aria-label="t('tickets.detail.removeAttachment')"
              @click="removeAttachment(a.id)"
            >
              <Icon
                name="lucide:x"
                class="size-4"
              />
            </button>
          </li>
        </ul>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <AppButton
          type="submit"
          :loading="store.submitting"
          class="sm:min-w-40"
        >
          <Icon
            name="lucide:send"
            class="size-4"
          />
          {{ t('tickets.new.submit') }}
        </AppButton>
        <NuxtLink to="/tickets">
          <AppButton variant="ghost">
            {{ t('common.cancel') }}
          </AppButton>
        </NuxtLink>
      </div>
    </form>
  </div>
</template>
