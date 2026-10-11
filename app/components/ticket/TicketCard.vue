<script setup lang="ts">
import type { Ticket } from '~/types/ticket.types'

const props = defineProps<{ ticket: Ticket }>()
const { t } = useI18n()
const { formatDateTime, ticketCode } = useTicketFormat()

const lastMessage = computed(() => props.ticket.messages[props.ticket.messages.length - 1])
</script>

<template>
  <NuxtLink
    :to="`/tickets/${props.ticket.slug}`"
    class="glass-card flex flex-col gap-3 p-5 transition-transform duration-200 hover:-translate-y-0.5"
  >
    <div class="flex flex-wrap items-center justify-between gap-2">
      <span
        class="text-xs font-medium text-ink-muted"
        dir="ltr"
      >{{ ticketCode(props.ticket.slug) }}</span>
      <TicketStatusBadge :status="props.ticket.status" />
    </div>

    <h3 class="font-medium leading-7 text-ink">
      {{ props.ticket.subject }}
    </h3>

    <p
      v-if="lastMessage"
      class="line-clamp-2 text-sm leading-7 text-ink-muted"
    >
      <span class="font-medium text-ink">{{ t(`tickets.author.${lastMessage.author}`) }}:</span>
      {{ lastMessage.body }}
    </p>

    <div class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
      <span class="inline-flex items-center gap-1">
        <Icon
          name="lucide:tag"
          class="size-3.5"
        />
        {{ t(`tickets.category.${props.ticket.category}`) }}
      </span>
      <span class="inline-flex items-center gap-1">
        <Icon
          name="lucide:messages-square"
          class="size-3.5"
        />
        {{ t('tickets.messagesCount', { count: toPersianDigits(props.ticket.messages.length) }) }}
      </span>
      <span class="inline-flex items-center gap-1">
        <Icon
          name="lucide:clock"
          class="size-3.5"
        />
        {{ formatDateTime(props.ticket.updatedAt) }}
      </span>
    </div>
  </NuxtLink>
</template>
