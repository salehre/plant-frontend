<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const store = useTicketStore()
const uiStore = useUiStore()
const { formatDateTime, ticketCode } = useTicketFormat()

store.ensureSeeded()

const ticket = computed(() => store.getBySlug(String(route.params.slug)))

useHead(() => ({
  title: ticket.value ? `${ticketCode(ticket.value.slug)} | ${ticket.value.subject}` : t('tickets.detail.notFoundTitle'),
}))

const reply = ref('')
const replyError = ref('')
const threadEl = ref<HTMLElement | null>(null)

async function scrollToEnd(smooth = true) {
  await nextTick()
  const el = threadEl.value
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
}

onMounted(() => scrollToEnd(false))

async function sendReply() {
  if (!ticket.value) return
  const body = reply.value.trim()
  if (body.length < 2) {
    replyError.value = t('tickets.errors.replyMin')
    return
  }
  if (body.length > 2000) {
    replyError.value = t('tickets.errors.messageMax')
    return
  }
  replyError.value = ''
  const ok = await store.reply(ticket.value.slug, body)
  if (ok) {
    reply.value = ''
    uiStore.showToast(t('tickets.detail.replySent'))
    scrollToEnd()
  }
  else {
    uiStore.showToast(t('tickets.new.error'), 'error')
  }
}

async function toggleClosed() {
  if (!ticket.value) return
  const close = ticket.value.status !== 'closed'
  const ok = await store.setClosed(ticket.value.slug, close)
  if (ok) uiStore.showToast(t(close ? 'tickets.detail.closedToast' : 'tickets.detail.reopenedToast'))
}

watch(() => reply.value, () => {
  if (replyError.value) replyError.value = ''
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
              >{{ ticketCode(ticket.slug) }}</span>
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
          <dl class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
            <div>
              <dt class="text-xs text-ink-muted">
                {{ t('tickets.detail.category') }}
              </dt>
              <dd class="mt-0.5 text-ink">
                {{ t(`tickets.category.${ticket.category}`) }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-ink-muted">
                {{ t('tickets.detail.priority') }}
              </dt>
              <dd
                class="mt-0.5"
                :class="ticket.priority === 'high' ? 'font-medium text-status-danger' : 'text-ink'"
              >
                {{ t(`tickets.priority.${ticket.priority}`) }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-ink-muted">
                {{ t('tickets.detail.createdAt') }}
              </dt>
              <dd class="mt-0.5 text-ink">
                {{ formatDateTime(ticket.createdAt) }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-ink-muted">
                {{ t('tickets.detail.updatedAt') }}
              </dt>
              <dd class="mt-0.5 text-ink">
                {{ formatDateTime(ticket.updatedAt) }}
              </dd>
            </div>
          </dl>
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
            class="flex max-w-[90%] flex-col gap-1 rounded-2xl px-4 py-3 shadow-sm sm:max-w-[80%]"
            :class="m.author === 'user'
              ? 'self-start rounded-ss-sm bg-primary-600 text-white'
              : 'self-end rounded-se-sm border border-ink/10 bg-white/60 text-ink dark:bg-white/10'"
          >
            <div
              class="flex items-center justify-between gap-4 text-xs"
              :class="m.author === 'user' ? 'text-white/80' : 'text-ink-muted'"
            >
              <span class="font-medium">{{ t(`tickets.author.${m.author}`) }}</span>
              <time :datetime="m.createdAt">{{ formatDateTime(m.createdAt) }}</time>
            </div>
            <p
              class="whitespace-pre-line text-sm leading-7"
              :class="m.author === 'user' ? 'text-white' : 'text-ink'"
            >
              {{ m.body }}
            </p>
          </article>
        </section>

        <!-- ورودی پاسخ / وضعیت بسته -->
        <footer class="border-t border-ink/10 p-4 sm:p-5">
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

          <form
            v-else
            class="flex flex-col gap-2"
            novalidate
            @submit.prevent="sendReply"
          >
            <label
              for="ticket-reply"
              class="sr-only"
            >{{ t('tickets.detail.replyTitle') }}</label>
            <div class="flex items-end gap-2">
              <textarea
                id="ticket-reply"
                v-model="reply"
                rows="2"
                maxlength="2000"
                class="field min-h-12 resize-none"
                :placeholder="t('tickets.detail.replyPlaceholder')"
                :aria-invalid="!!replyError"
                @keydown.enter.exact.prevent="sendReply"
              />
              <AppButton
                type="submit"
                :loading="store.submitting"
                :aria-label="t('tickets.detail.send')"
              >
                <Icon
                  name="lucide:send"
                  class="size-4 rtl:-scale-x-100"
                />
                {{ t('tickets.detail.send') }}
              </AppButton>
            </div>
            <p
              v-if="replyError"
              class="text-xs text-status-danger"
            >
              {{ replyError }}
            </p>
          </form>
        </footer>
      </div>
    </template>
  </div>
</template>