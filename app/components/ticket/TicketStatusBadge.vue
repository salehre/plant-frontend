<script setup lang="ts">
import type { TicketStatus } from '~/types/ticket.types'

const props = defineProps<{ status: TicketStatus }>()
const { t } = useI18n()

const styles: Record<TicketStatus, string> = {
  pending: 'bg-status-warning/10 text-status-warning',
  answered: 'bg-status-success/10 text-status-success',
  closed: 'bg-ink/5 text-ink-muted',
}
const icons: Record<TicketStatus, string> = {
  pending: 'lucide:clock',
  answered: 'lucide:message-circle-reply',
  closed: 'lucide:lock',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium"
    :class="styles[props.status]"
  >
    <Icon
      :name="icons[props.status]"
      class="size-3.5"
    />
    {{ t(`tickets.status.${props.status}`) }}
  </span>
</template>
