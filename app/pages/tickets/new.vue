<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { ticketCategories, ticketPriorities } from '~/types/ticket.types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const store = useTicketStore()
const uiStore = useUiStore()

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
const [category, categoryAttrs] = defineField('category')
const [priority, priorityAttrs] = defineField('priority')
const [message, messageAttrs] = defineField('message')

const onSubmit = handleSubmit(async (values) => {
  try {
    const slug = await store.create(values)
    uiStore.showToast(t('tickets.new.success'))
    await navigateTo(`/tickets/${slug}`)
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
          <label
            for="ticket-category"
            class="mb-1 block text-sm font-medium text-ink"
          >{{ t('tickets.new.category') }}</label>
          <select
            id="ticket-category"
            v-model="category"
            v-bind="categoryAttrs"
            class="field"
          >
            <option
              v-for="c in ticketCategories"
              :key="c"
              :value="c"
            >
              {{ t(`tickets.category.${c}`) }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="ticket-priority"
            class="mb-1 block text-sm font-medium text-ink"
          >{{ t('tickets.new.priority') }}</label>
          <select
            id="ticket-priority"
            v-model="priority"
            v-bind="priorityAttrs"
            class="field"
          >
            <option
              v-for="p in ticketPriorities"
              :key="p"
              :value="p"
            >
              {{ t(`tickets.priority.${p}`) }}
            </option>
          </select>
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
