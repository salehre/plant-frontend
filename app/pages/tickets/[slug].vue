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
const threadEnd = ref<HTMLElement | null>(null)

async function scrollToEnd() {
  await nextTick()
  threadEnd.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

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
      <!-- مشخصات تیکت -->
      <header class="glass-card mb-6 flex flex-col gap-4 p-5 sm:p-6">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span
            class="text-sm font-medium text-ink-muted"
            dir="ltr"
          >{{ ticketCode(ticket.slug) }}</span>
          <TicketStatusBadge :status="ticket.status" />
        </div>
        <h1 class="text-xl font-bold leading-8 text-ink sm:text-2xl">
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

      <!-- گفتگو -->
      <section
        class="flex flex-col gap-4"
        :aria-label="t('tickets.detail.conversation')"
      >
        <article
          v-for="m in ticket.messages"
          :key="m.id"
          class="flex max-w-[92%] flex-col gap-1 rounded-lg p-4 sm:max-w-[85%]"
          :class="m.author === 'user'
            ? 'self-start bg-primary-600 text-white'
            : 'glass-card self-end'"
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
        <div ref="threadEnd" />
      </section>

      <!-- پاسخ / بستن -->
      <section class="mt-6">
        <div
          v-if="ticket.status === 'closed'"
          class="glass-card flex flex-wrap items-center justify-between gap-3 p-5"
        >
          <p class="flex items-center gap-2 text-sm text-ink-muted">
            <Icon
              name="lucide:lock"
              class="size-4"
            />
            {{ t('tickets.detail.closedNote') }}
          </p>
          <AppButton
            variant="secondary"
            :loading="store.submitting"
            @click="toggleClosed"
          >
            {{ t('tickets.detail.reopen') }}
          </AppButton>
        </div>

        <form
          v-else
          class="glass-card flex flex-col gap-3 p-5"
          novalidate
          @submit.prevent="sendReply"
        >
          <label
            for="ticket-reply"
            class="text-sm font-medium text-ink"
          >{{ t('tickets.detail.replyTitle') }}</label>
          <textarea
            id="ticket-reply"
            v-model="reply"
            rows="4"
            maxlength="2000"
            class="field resize-y"
            :placeholder="t('tickets.detail.replyPlaceholder')"
            :aria-invalid="!!replyError"
          />
          <p
            v-if="replyError"
            class="text-xs text-status-danger"
          >
            {{ replyError }}
          </p>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <AppButton
              type="submit"
              :loading="store.submitting"
            >
              <Icon
                name="lucide:send"
                class="size-4"
              />
              {{ t('tickets.detail.send') }}
            </AppButton>
            <AppButton
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
        </form>
      </section>
    </template>
  </div>
</template>
