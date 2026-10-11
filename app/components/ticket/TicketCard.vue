<script setup lang="ts">
import type { Ticket } from '~/types/ticket.types'

const props = defineProps<{ ticket: Ticket }>()
const { t } = useI18n()
const { formatDateTime, ticketCode } = useTicketFormat()
</script>

<template>
  <NuxtLink
    :to="`/tickets/${props.ticket.slug}`"
    class="glass-card flex flex-col gap-2 px-4 py-3 transition-transform duration-200 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:gap-4"
  >
    <div class="flex min-w-0 flex-1 items-center gap-3">
      <span
        class="shrink-0 text-xs font-medium text-ink-muted"
        dir="ltr"
      >{{ ticketCode(props.ticket.slug) }}</span>
      <h3 class="min-w-0 truncate text-sm font-medium text-ink">
        {{ props.ticket.subject }}
      </h3>
    </div>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
      <span class="inline-flex items-center gap-1">
        <Icon
          name="lucide:tag"
          class="size-3.5"
        />
        {{ t(`tickets.category.${props.ticket.category}`) }}
      </span>
      <span class="inline-flex items-center gap-1">
        <Icon
          name="lucide:clock"
          class="size-3.5"
        />
        {{ formatDateTime(props.ticket.updatedAt) }}
      </span>
      <TicketStatusBadge :status="props.ticket.status" />
    </div>
  </NuxtLink>
</template>
