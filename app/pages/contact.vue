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
  name: z.string({ required_error: 'contact.errors.required' }).trim().min(2, 'contact.errors.nameMin'),
  email: z.string({ required_error: 'contact.errors.required' }).trim().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
  phone: z.string().optional().refine(v => !v || isValidIranMobile(v), 'contact.errors.phoneInvalid'),
  subject: z.string({ required_error: 'contact.errors.required' }).trim().min(3, 'contact.errors.subjectMin'),
  message: z.string({ required_error: 'contact.errors.required' }).trim().min(10, 'contact.errors.messageMin').max(1000, 'contact.errors.messageMax'),
}))

const { handleSubmit, defineField, errors, resetForm } = useForm({ validationSchema: schema })

const [name, nameAttrs] = defineField('name')
const [senderEmail, senderEmailAttrs] = defineField('email')
const [senderPhone, senderPhoneAttrs] = defineField('phone')
const [subject, subjectAttrs] = defineField('subject')
const [message, messageAttrs] = defineField('message')

function onNameInput(event: Event) {
  const input = event.target as HTMLInputElement
  const clean = input.value.replace(/\p{N}/gu, '')

  if (input.value !== clean) {
    const caret = input.value
      .slice(0, input.selectionStart ?? input.value.length)
      .replace(/\p{N}/gu, '')
      .length

    input.value = clean
    input.setSelectionRange(caret, caret)
  }

  name.value = clean
}

function onEmailInput(event: Event) {
  const input = event.target as HTMLInputElement
  const clean = Array.from(input.value)
    .filter(character => (character.codePointAt(0) ?? 0) <= 0x7F)
    .join('')

  if (input.value !== clean)
    input.value = clean

  senderEmail.value = clean
}

function onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  const clean = onlyDigits(input.value)

  if (input.value !== clean) {
    const caret = onlyDigits(
      input.value.slice(0, input.selectionStart ?? input.value.length),
    ).length

    input.value = clean
    input.setSelectionRange(caret, caret)
  }

  senderPhone.value = clean
}

const sending = ref(false)

const onSubmit = handleSubmit(async () => {
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

/* ---------- Animation Logic ---------- */
let observer: IntersectionObserver | null = null

function handleTiltMove(event: Event) {
  const mouseEvent = event as MouseEvent
  const card = mouseEvent.currentTarget as HTMLElement
  if (!card)
    return

  const rect = card.getBoundingClientRect()
  const x = mouseEvent.clientX - rect.left
  const y = mouseEvent.clientY - rect.top
  const rx = ((y / rect.height) - 0.5) * -6
  const ry = ((x / rect.width) - 0.5) * 6

  card.style.setProperty('--rx', `${rx}deg`)
  card.style.setProperty('--ry', `${ry}deg`)
}

function handleTiltLeave(event: Event) {
  const card = event.currentTarget as HTMLElement
  if (!card)
    return

  card.style.setProperty('--rx', '0deg')
  card.style.setProperty('--ry', '0deg')
}

onMounted(() => {
  nextTick(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' })

    document.querySelectorAll('.reveal').forEach(el => observer?.observe(el))

    document.querySelectorAll<HTMLElement>('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', handleTiltMove)
      card.addEventListener('mouseleave', handleTiltLeave)
    })
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()

  document.querySelectorAll<HTMLElement>('.tilt-card').forEach((card) => {
    card.removeEventListener('mousemove', handleTiltMove)
    card.removeEventListener('mouseleave', handleTiltLeave)
  })
})
</script>

<template>
  <div class="contact-page mx-auto max-w-6xl">
    <div
      class="contact-atmosphere"
      aria-hidden="true"
    >
      <span class="contact-orb contact-orb-one text-primary-500/10" />
      <span class="contact-orb contact-orb-two text-primary-400/10" />
    </div>

    <header class="mb-8 max-w-2xl">
      <span
        class="reveal contact-eyebrow border border-primary-500/20 bg-primary-50 text-primary-700"
        style="--enter-delay: 0ms"
      >
        <span
          class="contact-eyebrow-dot"
          aria-hidden="true"
        />
        <Icon
          name="lucide:messages-square"
          class="size-4"
        />
        {{ t('contact.pageTitle') }}
      </span>

      <h1
        class="reveal contact-title mt-3 text-2xl font-bold text-ink sm:text-3xl"
        style="--enter-delay: 80ms"
      >
        {{ t('contact.title') }}
      </h1>

      <p
        class="reveal mt-2 text-sm leading-7 text-ink-muted sm:text-base"
        style="--enter-delay: 160ms"
      >
        {{ t('contact.subtitle') }}
      </p>
    </header>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <!-- اطلاعات تماس -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
        <component
          :is="card.href ? 'a' : 'div'"
          v-for="(card, index) in infoCards"
          :key="card.key"
          :href="card.href"
          class="reveal tilt-card contact-info-card glass-card group flex items-start gap-4 p-5"
          :class="{ 'contact-info-link': card.href }"
          :style="{ '--enter-delay': `${220 + index * 80}ms` }"
        >
          <span class="contact-icon-box flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
            <Icon
              :name="card.icon"
              class="size-5"
            />
          </span>

          <span class="min-w-0">
            <span class="block text-xs text-ink-muted">
              {{ card.label }}
            </span>
            <span
              class="mt-0.5 block text-sm font-medium leading-6 text-ink"
              :dir="card.key === 'email' || card.key === 'phone' ? 'ltr' : undefined"
              :class="{ 'text-end': card.key === 'email' || card.key === 'phone' }"
            >
              {{ card.value }}
            </span>
          </span>
        </component>

        <!-- کارت تیکت -->
        <NuxtLink
          to="/tickets"
          class="reveal tilt-card contact-ticket-card glass-card group flex flex-col gap-3 border-primary-500/30 p-5 sm:col-span-2 lg:col-span-1"
          style="--enter-delay: 460ms"
        >
          <span class="flex items-start gap-4">
            <span class="contact-ticket-icon flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Icon
                name="lucide:ticket"
                class="size-5"
              />
            </span>

            <span class="min-w-0">
              <span class="block text-sm font-bold text-ink">
                {{ t('contact.ticketTitle') }}
              </span>
              <span class="mt-1 block text-sm leading-7 text-ink-muted">
                {{ t('contact.ticketText') }}
              </span>
            </span>
          </span>

          <span class="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors duration-200 group-hover:text-primary-700">
            {{ t('contact.ticketCta') }}
            <Icon
              name="lucide:arrow-left"
              class="ticket-arrow size-4 rtl:rotate-0 ltr:rotate-180"
            />
          </span>
        </NuxtLink>
      </div>

      <!-- فرم پیام -->
      <form
        class="reveal contact-form glass-card flex flex-col gap-4 p-5 sm:p-8 lg:col-span-3"
        style="--enter-delay: 200ms"
        novalidate
        @submit="onSubmit"
      >
        <div
          class="reveal flex items-center gap-3"
          style="--enter-delay: 260ms"
        >
          <span class="contact-form-title-icon flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
            <Icon
              name="lucide:send"
              class="size-5"
            />
          </span>

          <h2 class="text-lg font-bold text-ink">
            {{ t('contact.formTitle') }}
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            class="form-field-group reveal relative"
            style="--enter-delay: 320ms"
          >
            <input
              id="contact-name"
              :value="name"
              v-bind="nameAttrs"
              type="text"
              autocomplete="name"
              class="field peer !pt-6 !pb-2"
              placeholder=" "
              :aria-invalid="!!errors.name"
              @input="onNameInput"
            >
            <label
              for="contact-name"
              class="floating-label"
            >
              {{ t('contact.name') }}
            </label>

            <p
              v-if="errors.name"
              class="form-error mt-1 text-xs text-status-danger"
            >
              {{ t(errors.name) }}
            </p>
          </div>

          <div
            class="form-field-group reveal relative"
            style="--enter-delay: 380ms"
          >
            <input
              id="contact-email"
              :value="senderEmail"
              v-bind="senderEmailAttrs"
              type="email"
              dir="ltr"
              autocomplete="email"
              class="field peer !pt-6 !pb-2 text-start"
              placeholder=" "
              :aria-invalid="!!errors.email"
              @input="onEmailInput"
            >
            <label
              for="contact-email"
              class="floating-label"
            >
              {{ t('contact.email') }}
            </label>

            <p
              v-if="errors.email"
              class="form-error mt-1 text-xs text-status-danger"
            >
              {{ t(errors.email) }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            class="form-field-group reveal relative"
            style="--enter-delay: 440ms"
          >
            <input
              id="contact-phone"
              :value="senderPhone"
              v-bind="senderPhoneAttrs"
              type="tel"
              dir="ltr"
              inputmode="numeric"
              autocomplete="tel"
              class="field peer !pt-6 !pb-2 text-start"
              placeholder=" "
              :aria-invalid="!!errors.phone"
              @input="onPhoneInput"
            >
            <label
              for="contact-phone"
              class="floating-label"
            >
              {{ t('contact.phone') }}
              <span class="text-xs font-normal text-ink-muted">
                ({{ t('contact.optional') }})
              </span>
            </label>

            <p
              v-if="errors.phone"
              class="form-error mt-1 text-xs text-status-danger"
            >
              {{ t(errors.phone) }}
            </p>
          </div>

          <div
            class="form-field-group reveal relative"
            style="--enter-delay: 500ms"
          >
            <input
              id="contact-subject"
              v-model="subject"
              v-bind="subjectAttrs"
              type="text"
              class="field peer !pt-6 !pb-2"
              placeholder=" "
              :aria-invalid="!!errors.subject"
            >
            <label
              for="contact-subject"
              class="floating-label"
            >
              {{ t('contact.subject') }}
            </label>

            <p
              v-if="errors.subject"
              class="form-error mt-1 text-xs text-status-danger"
            >
              {{ t(errors.subject) }}
            </p>
          </div>
        </div>

        <div
          class="form-field-group reveal relative"
          style="--enter-delay: 560ms"
        >
          <textarea
            id="contact-message"
            v-model="message"
            v-bind="messageAttrs"
            rows="6"
            maxlength="1000"
            class="field peer !pt-6 resize-y"
            placeholder=" "
            :aria-invalid="!!errors.message"
          />
          <label
            for="contact-message"
            class="floating-label"
          >
            {{ t('contact.message') }}
          </label>

          <p
            v-if="errors.message"
            class="form-error mt-1 text-xs text-status-danger"
          >
            {{ t(errors.message) }}
          </p>
        </div>

        <AppButton
          type="submit"
          :loading="sending"
          class="reveal contact-submit-button self-start sm:min-w-40"
          style="--enter-delay: 620ms"
        >
          <Icon
            name="lucide:send"
            class="size-4"
          />
          {{ t('contact.send') }}
        </AppButton>
      </form>
    </div>

    <!-- آدرس و نقشه -->
    <section
      class="reveal contact-location glass-card mt-6 grid grid-cols-1 gap-6 overflow-hidden p-5 sm:p-8 md:grid-cols-5"
      style="--enter-delay: 520ms"
      :aria-label="t('contact.addressLabel')"
    >
      <div class="flex flex-col justify-center gap-4 md:col-span-2">
        <span class="contact-location-icon flex size-11 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
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
          class="contact-map-link inline-flex w-fit items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {{ t('contact.openMap') }}
          <Icon
            name="lucide:external-link"
            class="size-4"
          />
        </a>
      </div>

      <div class="contact-map-frame h-64 overflow-hidden rounded-lg sm:h-72 md:col-span-3 md:h-80">
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

<style scoped>
.contact-page {
  position: relative;
  isolation: isolate;
}

.contact-atmosphere {
  position: absolute;
  inset: -2rem -1rem;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.contact-orb {
  position: absolute;
  display: block;
  width: clamp(16rem, 38vw, 25rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, currentColor 0%, transparent 70%);
  filter: blur(6px);
}

.contact-orb-one {
  top: -8rem;
  inset-inline-start: -9rem;
  animation: contact-orb-drift 18s ease-in-out infinite alternate;
}

.contact-orb-two {
  top: 48%;
  inset-inline-end: -10rem;
  width: clamp(14rem, 30vw, 21rem);
  animation: contact-orb-drift-reverse 22s ease-in-out infinite alternate;
}

/* Reveal on scroll */
.reveal {
  opacity: 0;
}

.reveal.is-visible {
  animation: reveal-anim 720ms cubic-bezier(0.16, 1, 0.3, 1) var(--enter-delay, 0ms) both;
}

@keyframes reveal-anim {
  from {
    opacity: 0;
    translate: 0 22px;
    scale: 0.98;
  }

  to {
    opacity: 1;
    translate: 0 0;
    scale: 1;
  }
}

.contact-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.contact-eyebrow-dot {
  position: relative;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: currentColor;
}

.contact-eyebrow-dot::after {
  position: absolute;
  inset: -0.2rem;
  border: 1px solid currentColor;
  border-radius: 50%;
  content: '';
  animation: contact-dot-pulse 1.8s ease-out infinite;
}

.contact-title {
  width: fit-content;
}

.contact-title::after {
  display: block;
  width: 2.75rem;
  height: 3px;
  margin-block-start: 0.55rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgb(var(--color-primary-400)), rgb(var(--color-primary-700)));
  content: '';
  transform: scaleX(0);
  transform-origin: right;
  animation: contact-title-mark 620ms cubic-bezier(0.16, 1, 0.3, 1) 360ms both;
}

:global([dir='ltr']) .contact-title::after {
  transform-origin: left;
}

/* 3D Tilt Cards */
.tilt-card {
  transition:
    transform 180ms ease-out,
    box-shadow 260ms ease,
    border-color 260ms ease;
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(0);
  will-change: transform;
}

.contact-info-card,
.contact-ticket-card {
  position: relative;
  isolation: isolate;
}

.contact-info-card::before,
.contact-ticket-card::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: linear-gradient(
    110deg,
    transparent 34%,
    rgb(255 255 255 / 0.42) 49%,
    transparent 64%
  );
  background-size: 220% 100%;
  background-position: 100% 0;
  content: '';
  opacity: 0;
  pointer-events: none;
  transition:
    background-position 700ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 220ms ease;
}

.contact-info-card > span,
.contact-ticket-card > span {
  position: relative;
  z-index: 1;
}

.contact-info-link:focus-visible,
.contact-ticket-card:focus-visible,
.contact-map-link:focus-visible {
  outline: 2px solid rgb(var(--color-primary-600) / 0.7);
  outline-offset: 4px;
}

.contact-icon-box,
.contact-ticket-icon,
.contact-form-title-icon {
  transition:
    transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 260ms ease;
}

.ticket-arrow {
  transition: translate 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.contact-form {
  position: relative;
  transition:
    transform 260ms ease,
    box-shadow 260ms ease;
}

.contact-form:focus-within {
  box-shadow:
    0 0 0 1px rgb(var(--color-primary-600) / 0.1),
    0 18px 42px rgb(var(--color-ink) / 0.06);
}

.contact-form-title-icon {
  transform-origin: center;
}

/* Floating Label */
.form-field-group :deep(.field) {
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease;
}

.form-field-group :deep(.field:focus) {
  border-color: rgb(var(--color-primary-500));
  box-shadow: 0 0 0 3px rgb(var(--color-primary-600) / 0.12);
}

.floating-label {
  position: absolute;
  inset-block-start: 0.9rem;
  inset-inline-start: 0.9rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(var(--color-ink-muted));
  pointer-events: none;
  transition:
    inset-block-start 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
    font-size 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
    color 220ms ease,
    background-color 220ms ease;
  z-index: 2;
}

.form-field-group :deep(.field:focus) ~ .floating-label,
.form-field-group :deep(.field:not(:placeholder-shown)) ~ .floating-label {
  inset-block-start: -0.5rem;
  inset-inline-start: 0.7rem;
  padding-inline: 0.25rem;
  background-color: rgb(var(--color-surface));
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(var(--color-primary-700));
}

.form-error {
  animation: error-in 220ms ease-out both;
}

@keyframes error-in {
  from {
    opacity: 0;
    translate: 0 -4px;
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

.contact-submit-button {
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
}

.contact-submit-button :deep(svg) {
  transition: transform 200ms ease;
}

.contact-location {
  transition:
    transform 260ms ease,
    box-shadow 260ms ease;
}

.contact-location-icon {
  position: relative;
  isolation: isolate;
  transition: transform 240ms ease;
}

.contact-location-icon::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  border: 1px solid currentColor;
  border-radius: inherit;
  content: '';
  opacity: 0;
  pointer-events: none;
  transform: scale(0.8);
}

.contact-location-icon :deep(svg) {
  position: relative;
  z-index: 1;
}

.contact-map-frame {
  border: 1px solid rgb(var(--color-ink) / 0.05);
  transition:
    border-color 240ms ease,
    box-shadow 240ms ease;
}

.contact-map-link :deep(svg) {
  transition: transform 200ms ease;
}

/* Hover Effects */
@media (hover: hover) {
  .tilt-card:hover {
    transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(-4px);
    box-shadow: 0 20px 45px rgb(var(--color-ink) / 0.12);
  }

  .tilt-card:hover::before {
    background-position: 0 0;
    opacity: 1;
  }

  .contact-info-link:hover {
    border-color: rgb(var(--color-primary-600) / 0.28);
  }

  .contact-info-link:hover .contact-icon-box {
    transform: rotate(-7deg) scale(1.07);
    box-shadow: 0 7px 16px rgb(var(--color-primary-600) / 0.16);
  }

  .contact-ticket-card:hover {
    border-color: rgb(var(--color-primary-600) / 0.45);
  }

  .contact-ticket-card:hover .contact-ticket-icon {
    transform: rotate(-7deg) scale(1.06);
  }

  .contact-ticket-card:dir(rtl):hover .ticket-arrow {
    translate: -4px 0;
  }

  .contact-ticket-card:dir(ltr):hover .ticket-arrow {
    translate: 4px 0;
  }

  .contact-form:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 42px rgb(var(--color-ink) / 0.06);
  }

  .contact-form:hover .contact-form-title-icon {
    transform: rotate(-6deg) scale(1.04);
  }

  .contact-submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgb(var(--color-primary-600) / 0.2);
  }

  .contact-submit-button:hover:not(:disabled) :deep(svg) {
    transform: translateY(-1px) rotate(-8deg);
  }

  .contact-location:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 36px rgb(var(--color-ink) / 0.06);
  }

  .contact-location:hover .contact-location-icon {
    transform: translateY(-2px) rotate(-5deg);
  }

  .contact-location:hover .contact-location-icon::after {
    animation: contact-pin-pulse 1.2s ease-out infinite;
  }

  .contact-location:hover .contact-map-frame {
    border-color: rgb(var(--color-primary-600) / 0.2);
    box-shadow: 0 10px 24px rgb(var(--color-ink) / 0.06);
  }

  .contact-map-link:hover :deep(svg) {
    transform: translate(2px, -2px);
  }
}

.contact-info-link:active,
.contact-ticket-card:active {
  transform: translateY(-1px) scale(0.99);
}

.contact-submit-button:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

@keyframes contact-title-mark {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@keyframes contact-dot-pulse {
  0% { opacity: 0.5; transform: scale(0.7); }
  100% { opacity: 0; transform: scale(1.7); }
}

@keyframes contact-pin-pulse {
  0% { opacity: 0.4; transform: scale(0.8); }
  100% { opacity: 0; transform: scale(1.65); }
}

@keyframes contact-orb-drift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(18px, 12px, 0); }
}

@keyframes contact-orb-drift-reverse {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-14px, 16px, 0); }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .contact-orb,
  .reveal.is-visible,
  .contact-eyebrow-dot::after,
  .contact-location-icon::after,
  .form-error {
    animation: none !important;
  }

  .reveal {
    opacity: 1;
    translate: none;
    scale: 1;
  }

  .contact-title::after {
    transform: scaleX(1);
    animation: none !important;
  }

  .tilt-card,
  .contact-info-card,
  .contact-ticket-card,
  .contact-form,
  .contact-location,
  .contact-icon-box,
  .contact-ticket-icon,
  .contact-form-title-icon,
  .contact-location-icon,
  .ticket-arrow,
  .form-field-group,
  .floating-label,
  .contact-submit-button,
  .contact-submit-button :deep(svg),
  .contact-map-frame,
  .contact-map-link :deep(svg),
  .contact-info-card::before,
  .contact-ticket-card::before {
    transition: none !important;
  }

  .tilt-card:hover,
  .contact-info-link:hover,
  .contact-info-link:active,
  .contact-ticket-card:hover,
  .contact-ticket-card:active,
  .contact-form:hover,
  .contact-location:hover,
  .contact-submit-button:hover:not(:disabled),
  .contact-submit-button:active:not(:disabled) {
    transform: none !important;
    box-shadow: none !important;
  }

  .contact-info-link:hover .contact-icon-box,
  .contact-ticket-card:hover .contact-ticket-icon,
  .contact-form:hover .contact-form-title-icon,
  .contact-location:hover .contact-location-icon,
  .contact-submit-button:hover:not(:disabled) :deep(svg),
  .contact-map-link:hover :deep(svg) {
    transform: none !important;
  }

  .contact-ticket-card:hover .ticket-arrow {
    translate: none !important;
  }

  .tilt-card:hover::before,
  .contact-info-link:hover::before,
  .contact-ticket-card:hover::before {
    opacity: 0 !important;
  }
}
</style>