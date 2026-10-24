<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const uiStore = useUiStore()

useHead(() => ({ title: t('contact.pageTitle') }))

const email = 'salehrezaeipoor123@gmail.com'
const phone = '0930 037 7838'

const mapCenter: [number, number] = [52.349051, 36.452597]
const mapLink = computed(() => `https://www.google.com/maps?q=${mapCenter[1]},${mapCenter[0]}`)

const infoCards = computed(() => [
  {
    key: 'email',
    icon: 'lucide:mail',
    label: t('contact.emailLabel'),
    value: email,
    href: `mailto:${email}`,
  },
  {
    key: 'phone',
    icon: 'lucide:phone',
    label: t('contact.phoneLabel'),
    value: phone,
    href: `tel:${phone.replace(/\s/g, '')}`,
  },
  {
    key: 'hours',
    icon: 'lucide:clock',
    label: t('contact.hoursLabel'),
    value: t('contact.hoursValue'),
    href: undefined,
  },
])

const schema = toTypedSchema(z.object({
  name: z.string().trim().min(2, 'contact.errors.nameMin'),
  email: z.string().trim().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
  phone: z.string().optional().refine(v => !v || isValidIranMobile(v), 'contact.errors.phoneInvalid'),
  subject: z.string().trim().min(3, 'contact.errors.subjectMin'),
  message: z.string().trim().min(10, 'contact.errors.messageMin').max(1000, 'contact.errors.messageMax'),
}))

const { handleSubmit, defineField, errors, resetForm } = useForm({ validationSchema: schema })

const [name, nameAttrs] = defineField('name')
const [senderEmail, senderEmailAttrs] = defineField('email')
const [senderPhone, senderPhoneAttrs] = defineField('phone')
const [subject, subjectAttrs] = defineField('subject')
const [message, messageAttrs] = defineField('message')

const sending = ref(false)

const onSubmit = handleSubmit(async (values) => {
  sending.value = true
  try {
    await simulateDelay(700)
    uiStore.showToast(t('contact.success'))
    resetForm()
  }
  catch {
    uiStore.showToast(t('contact.error'), 'error')
  }
  finally {
    sending.value = false
  }
})
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <header class="mb-8 max-w-2xl">
      <h1 class="text-2xl font-bold text-ink sm:text-3xl">
        {{ t('contact.title') }}
      </h1>
      <p class="mt-2 text-sm leading-7 text-ink-muted sm:text-base">
        {{ t('contact.subtitle') }}
      </p>
    </header>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <!-- اطلاعات تماس -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
        <component
          :is="card.href ? 'a' : 'div'"
          v-for="card in infoCards"
          :key="card.key"
          :href="card.href"
          class="glass-card flex items-start gap-4 p-5 transition-transform duration-200"
          :class="{ 'hover:-translate-y-0.5': card.href }"
        >
          <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
            <Icon
              :name="card.icon"
              class="size-5"
            />
          </span>
          <span class="min-w-0">
            <span class="block text-xs text-ink-muted">{{ card.label }}</span>
            <span
              class="mt-0.5 block text-sm font-medium leading-6 text-ink"
              :dir="card.key === 'email' || card.key === 'phone' ? 'ltr' : undefined"
              :class="{ 'text-end': card.key === 'email' || card.key === 'phone' }"
            >{{ card.value }}</span>
          </span>
        </component>

        <!-- کارت تیکت: لینک به صفحه‌ی تیکت‌های پشتیبانی -->
        <NuxtLink
          to="/tickets"
          class="glass-card group flex flex-col gap-3 border-primary-500/30 p-5 transition-transform duration-200 hover:-translate-y-0.5 sm:col-span-2 lg:col-span-1"
        >
          <span class="flex items-start gap-4">
            <span class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Icon
                name="lucide:ticket"
                class="size-5"
              />
            </span>
            <span class="min-w-0">
              <span class="block text-sm font-bold text-ink">{{ t('contact.ticketTitle') }}</span>
              <span class="mt-1 block text-sm leading-7 text-ink-muted">{{ t('contact.ticketText') }}</span>
            </span>
          </span>
          <span class="inline-flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-700">
            {{ t('contact.ticketCta') }}
            <Icon
              name="lucide:arrow-left"
              class="size-4 rtl:rotate-0 ltr:rotate-180"
            />
          </span>
        </NuxtLink>
      </div>

      <!-- فرم پیام -->
      <form
        class="glass-card flex flex-col gap-4 p-5 sm:p-8 lg:col-span-3"
        novalidate
        @submit="onSubmit"
      >
        <h2 class="text-lg font-bold text-ink">
          {{ t('contact.formTitle') }}
        </h2>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              for="contact-name"
              class="mb-1 block text-sm font-medium text-ink"
            >{{ t('contact.name') }}</label>
            <input
              id="contact-name"
              v-model="name"
              v-bind="nameAttrs"
              type="text"
              autocomplete="name"
              class="field"
              :aria-invalid="!!errors.name"
            >
            <p
              v-if="errors.name"
              class="mt-1 text-xs text-status-danger"
            >
              {{ t(errors.name) }}
            </p>
          </div>

          <div>
            <label
              for="contact-email"
              class="mb-1 block text-sm font-medium text-ink"
            >{{ t('contact.email') }}</label>
            <input
              id="contact-email"
              v-model="senderEmail"
              v-bind="senderEmailAttrs"
              type="email"
              dir="ltr"
              autocomplete="email"
              placeholder="you@example.com"
              class="field text-start"
              :aria-invalid="!!errors.email"
            >
            <p
              v-if="errors.email"
              class="mt-1 text-xs text-status-danger"
            >
              {{ t(errors.email) }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              for="contact-phone"
              class="mb-1 block text-sm font-medium text-ink"
            >
              {{ t('contact.phone') }}
              <span class="text-xs font-normal text-ink-muted">({{ t('contact.optional') }})</span>
            </label>
            <input
              id="contact-phone"
              v-model="senderPhone"
              v-bind="senderPhoneAttrs"
              type="tel"
              dir="ltr"
              inputmode="tel"
              autocomplete="tel"
              placeholder="09123456789"
              class="field text-start"
              :aria-invalid="!!errors.phone"
            >
            <p
              v-if="errors.phone"
              class="mt-1 text-xs text-status-danger"
            >
              {{ t(errors.phone) }}
            </p>
          </div>

          <div>
            <label
              for="contact-subject"
              class="mb-1 block text-sm font-medium text-ink"
            >{{ t('contact.subject') }}</label>
            <input
              id="contact-subject"
              v-model="subject"
              v-bind="subjectAttrs"
              type="text"
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
        </div>

        <div>
          <label
            for="contact-message"
            class="mb-1 block text-sm font-medium text-ink"
          >{{ t('contact.message') }}</label>
          <textarea
            id="contact-message"
            v-model="message"
            v-bind="messageAttrs"
            rows="6"
            maxlength="1000"
            class="field resize-y"
            :aria-invalid="!!errors.message"
          />
          <p
            v-if="errors.message"
            class="mt-1 text-xs text-status-danger"
          >
            {{ t(errors.message) }}
          </p>
        </div>

        <AppButton
          type="submit"
          :loading="sending"
          class="self-start sm:min-w-40"
        >
          <Icon
            name="lucide:send"
            class="size-4"
          />
          {{ t('contact.send') }}
        </AppButton>
      </form>
    </div>

    <!-- آدرس و نقشه: کل عرض، زیر هر دو ستون -->
    <section
      class="glass-card mt-6 grid grid-cols-1 gap-6 overflow-hidden p-5 sm:p-8 md:grid-cols-5"
      :aria-label="t('contact.addressLabel')"
    >
      <div class="flex flex-col justify-center gap-4 md:col-span-2">
        <span class="flex size-11 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
          <Icon
            name="lucide:map-pin"
            class="size-5"
          />
        </span>
        <div>
          <h2 class="text-lg font-bold text-ink">
            {{ t('contact.addressLabel') }}
          </h2>
          <p class="mt-2 text-sm leading-8 text-ink-muted">
            {{ t('contact.addressValue') }}
          </p>
        </div>
        <a
          v-if="mapLink"
          :href="mapLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {{ t('contact.openMap') }}
          <Icon
            name="lucide:external-link"
            class="size-4"
          />
        </a>
      </div>

      <div class="h-64 overflow-hidden rounded-lg sm:h-72 md:col-span-3 md:h-80">
        <ClientOnly>
          <GoogleMap :center="mapCenter" />
          <template #fallback>
            <div class="flex size-full items-center justify-center bg-primary-50 text-sm text-ink-muted">
              {{ t('contact.mapLoading') }}
            </div>
          </template>
        </ClientOnly>
      </div>
    </section>
  </div>
</template>