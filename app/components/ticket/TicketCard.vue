<script setup lang="ts">
import type { Ticket } from '~/types/ticket.types'

const props = defineProps<{ ticket: Ticket }>()
const { t } = useI18n()
const { formatDateTime, ticketCode } = useTicketFormat()

// خط توضیح زیر موضوع: متن اولین پیام تیکت
const excerpt = computed(() => props.ticket.messages[0]?.body ?? '')
</script>

<template>
  <!-- یک ردیف از جدول تیکت‌ها (کانتینر کارت توی صفحه‌ی لیسته) -->
  <NuxtLink
    :to="`/tickets/${props.ticket.id}`"
    class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-4 transition-colors hover:bg-primary-50/40 sm:grid-cols-[minmax(0,1fr)_9rem_8rem_9.5rem_1.25rem] sm:px-5"
  >
    <!-- موضوع -->
    <div class="flex min-w-0 items-center gap-3">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
        <Icon
          name="lucide:message-square-text"
          class="size-5"
        />
      </span>
      <div class="min-w-0">
        <h3 class="truncate text-sm font-bold text-ink">
          {{ props.ticket.subject }}
        </h3>
        <p
          v-if="excerpt"
          class="truncate text-xs text-ink-muted"
        >
          {{ excerpt }}
        </p>
        <span
          class="text-[11px] text-ink-muted/80"
          dir="ltr"
        >{{ ticketCode(props.ticket.id) }}</span>
      </div>
    </div>

    <!-- وضعیت (موبایل: کنار موضوع) -->
    <div class="justify-self-end sm:order-3 sm:justify-self-start">
      <TicketStatusBadge :status="props.ticket.status" />
    </div>

    <!-- دسته‌بندی -->
    <span class="col-span-2 truncate text-xs text-ink-muted sm:order-2 sm:col-span-1">
      {{ t(`tickets.category.${props.ticket.category}`) }}
    </span>

    <!-- تاریخ -->
    <span class="col-span-2 text-xs text-ink-muted sm:order-4 sm:col-span-1">
      {{ formatDateTime(props.ticket.updatedAt) }}
    </span>

    <Icon
      name="lucide:chevron-left"
      class="hidden size-4 text-ink-muted sm:order-5 sm:block ltr:rotate-180"
    />
  </NuxtLink>
</template>
