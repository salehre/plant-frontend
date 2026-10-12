<script setup lang="ts">
import type { Ticket } from '~/types/ticket.types'

const props = defineProps<{ ticket: Ticket }>()
const { t } = useI18n()
const { formatDateTime, ticketCode } = useTicketFormat()
</script>

<template>
  <NuxtLink
    :to="`/tickets/${props.ticket.id}`"
    class="glass-card grid grid-cols-1 gap-x-4 gap-y-2 px-5 py-4 transition-transform duration-200 hover:-translate-y-0.5 sm:grid-cols-[minmax(0,1fr)_8rem_9.5rem_8.5rem] sm:items-center"
  >
    <!-- موضوع + شناسه -->
    <div class="flex min-w-0 flex-col gap-1">
      <h3 class="truncate text-sm font-medium text-ink">
        {{ props.ticket.subject }}
      </h3>
      <span
        class="text-[11px] text-ink-muted"
        dir="ltr"
      >{{ ticketCode(props.ticket.id) }}</span>
    </div>

    <!-- دسته‌بندی -->
    <span class="inline-flex items-center gap-1.5 text-xs text-ink-muted">
      <Icon
        name="lucide:tag"
        class="size-3.5 shrink-0"
      />
      <span class="truncate">{{ t(`tickets.category.${props.ticket.category}`) }}</span>
    </span>

    <!-- تاریخ -->
    <span class="inline-flex items-center gap-1.5 text-xs text-ink-muted">
      <Icon
        name="lucide:clock"
        class="size-3.5 shrink-0"
      />
      {{ formatDateTime(props.ticket.updatedAt) }}
    </span>

    <!-- وضعیت -->
    <div class="sm:justify-self-end">
      <TicketStatusBadge :status="props.ticket.status" />
    </div>
  </NuxtLink>
</template>
