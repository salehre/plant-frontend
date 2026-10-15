<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import type { Gender } from '~/types/user.types'

const authStore = useAuthStore()
const uiStore = useUiStore()
const { t, locale } = useI18n()

const today = new Date().toISOString().slice(0, 10)
const minBirthDate = '1900-01-01'
const showPasswordModal = ref(false)

// پکیج تقویم به window وابسته‌ست؛ فقط سمت کلاینت و به‌صورت lazy لود می‌شه.
const PersianDatePicker = defineAsyncComponent(async () => {
  const mod: any = await import('vue3-persian-datetime-picker')
  return mod.default?.default ?? mod.default ?? mod
})
const birthDateInputId = `birth-date-${useId()}`

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().min(2, 'auth.nameMin'),
    birthDate: z
      .string()
      .min(1, 'pages.profile.errors.birthDateRequired')
      .refine(value => value >= minBirthDate && value <= today, 'pages.profile.errors.birthDateInvalid'),
    gender: z.enum(['male', 'female'], {
      errorMap: () => ({ message: 'pages.profile.errors.genderRequired' }),
    }),
    phone: z
      .string()
      .min(1, 'pages.profile.errors.phoneRequired')
      .refine(isValidIranMobile, 'pages.profile.errors.phoneInvalid'),
    nationalId: z
      .string()
      .min(1, 'pages.profile.errors.nationalIdRequired')
      .refine(isValidNationalId, 'pages.profile.errors.nationalIdInvalid'),
  }),
)

const { handleSubmit, defineField, errors, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: authStore.user?.name ?? '',
    birthDate: authStore.user?.birthDate ?? '',
    gender: authStore.user?.gender,
    phone: authStore.user?.phone ?? '',
    nationalId: authStore.user?.nationalId ?? '',
  },
})

const [name, nameAttrs] = defineField('name')
const [birthDate] = defineField('birthDate')
const [gender] = defineField('gender')
const [phone, phoneAttrs] = defineField('phone')
const [nationalId, nationalIdAttrs] = defineField('nationalId')

const genderOptions = computed<{ value: Gender, label: string }[]>(() => [
  { value: 'female', label: t('pages.profile.genderFemale') },
  { value: 'male', label: t('pages.profile.genderMale') },
])

// فقط رقم قبول می‌کنه (تایپ، پیست و اعداد فارسی/عربی). مکان نشانگر هم حفظ می‌شه.
function onDigitsInput(event: Event, set: (value: string) => void) {
  const el = event.target as HTMLInputElement
  const clean = onlyDigits(el.value)
  if (el.value !== clean) {
    const caret = onlyDigits(el.value.slice(0, el.selectionStart ?? el.value.length)).length
    el.value = clean
    el.setSelectionRange(caret, caret)
  }
  set(clean)
}

// مقدار فرم/ذخیره همیشه میلادی (YYYY-MM-DD) می‌مونه؛ فقط نمایشش شمسیه (YYYY/MM/DD).
const birthDateDisplay = computed(() => {
  if (!birthDate.value) return ''
  const [y, m, d] = birthDate.value.slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return ''
  const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).formatToParts(new Date(Date.UTC(y, m - 1, d)))
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  return `${get('relatedYear') || get('year')}/${get('month')}/${get('day')}`
})

const inputClass = 'field'

function onLogout() {
  authStore.logout()
  navigateTo('/')
}

const onSubmit = handleSubmit(async (values) => {
  const ok = await authStore.updateProfile({
    name: values.name,
    birthDate: values.birthDate,
    gender: values.gender,
    phone: normalizeDigits(values.phone.trim()),
    nationalId: normalizeDigits(values.nationalId.trim()),
  })
  if (ok) {
    // فرم رو با مقادیر ذخیره‌شده (اعداد نرمال‌شده) دوباره مقداردهی می‌کنیم تا دکمه‌ی ذخیره غیرفعال بشه.
    resetForm({
      values: {
        name: authStore.user?.name ?? '',
        birthDate: authStore.user?.birthDate ?? '',
        gender: authStore.user?.gender,
        phone: authStore.user?.phone ?? '',
        nationalId: authStore.user?.nationalId ?? '',
      },
    })
    uiStore.showToast(t('pages.profile.saved'))
  }
  else if (authStore.error) {
    uiStore.showToast(t(authStore.error), 'error')
  }
})
</script>

<template>
  <div
    v-if="authStore.isLoggedIn"
    class="glass-card p-4"
  >
    <form
      class="flex flex-col gap-4"
      novalidate
      @submit="onSubmit"
    >
      <div class="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
        <!-- اسم -->
        <div>
          <label class="mb-1 block text-sm font-medium text-ink">{{ t('auth.name') }}</label>
          <input
            v-model="name"
            v-bind="nameAttrs"
            type="text"
            autocomplete="name"
            :class="[inputClass, errors.name ? 'border-status-danger' : '']"
            :placeholder="t('auth.namePlaceholder')"
          >
          <p
            v-if="errors.name"
            class="mt-1 text-xs text-status-danger"
          >
            {{ t(errors.name) }}
          </p>
        </div>

        <!-- ایمیل (فقط نمایش) -->
        <div>
          <label class="mb-1 block text-sm font-medium text-ink">{{ t('auth.email') }}</label>
          <div class="relative">
            <input
              :value="authStore.user?.email ?? ''"
              type="email"
              readonly
              tabindex="-1"
              dir="ltr"
              class="field pe-10 text-start"
            >
            <!-- ایمیل با کد تایید وریفای شده -->
            <Icon
              name="lucide:badge-check"
              dir="ltr"
              class="pointer-events-none absolute inset-y-0 end-3 my-auto size-5 text-primary-600"
            />
          </div>
        </div>

        <!-- شماره تلفن -->
        <div>
          <label class="mb-1 block text-sm font-medium text-ink">{{ t('pages.profile.phone') }}</label>
          <input
            :value="phone"
            v-bind="phoneAttrs"
            type="tel"
            inputmode="numeric"
            autocomplete="tel"
            maxlength="11"
            dir="ltr"
            :class="[inputClass, 'text-start', errors.phone ? 'border-status-danger' : '']"
            placeholder="09123456789"
            @input="onDigitsInput($event, v => (phone = v))"
          >
          <p
            v-if="errors.phone"
            class="mt-1 text-xs text-status-danger"
          >
            {{ t(errors.phone) }}
          </p>
        </div>

        <!-- جنسیت -->
        <div>
          <span class="mb-1 block text-sm font-medium text-ink">{{ t('pages.profile.gender') }}</span>
          <FormSelect
            :model-value="gender"
            :options="genderOptions"
            :invalid="!!errors.gender"
            :aria-label="t('pages.profile.gender')"
            @update:model-value="gender = $event as Gender"
          />
          <p
            v-if="errors.gender"
            class="mt-1 text-xs text-status-danger"
          >
            {{ t(errors.gender) }}
          </p>
        </div>

        <!-- کد ملی -->
        <div>
          <label class="mb-1 block text-sm font-medium text-ink">{{ t('pages.profile.nationalId') }}</label>
          <input
            :value="nationalId"
            v-bind="nationalIdAttrs"
            type="text"
            inputmode="numeric"
            maxlength="10"
            dir="ltr"
            :class="[inputClass, 'text-start', errors.nationalId ? 'border-status-danger' : '']"
            placeholder="0123456789"
            @input="onDigitsInput($event, v => (nationalId = v))"
          >
          <p
            v-if="errors.nationalId"
            class="mt-1 text-xs text-status-danger"
          >
            {{ t(errors.nationalId) }}
          </p>
        </div>

        <!-- تاریخ تولد (دیت‌پیکر شمسی؛ مقدار ذخیره‌شده میلادیه) -->
        <div>
          <label
            :for="birthDateInputId"
            class="mb-1 block text-sm font-medium text-ink"
          >{{ t('pages.profile.birthDate') }}</label>
          <div class="relative">
            <input
              :id="birthDateInputId"
              :value="birthDateDisplay"
              type="text"
              readonly
              autocomplete="off"
              :dir="locale === 'fa' ? 'rtl' : 'ltr'"
              placeholder="1370/01/01"
              :class="[inputClass, '!cursor-pointer pe-10 text-start', errors.birthDate ? 'border-status-danger' : '']"
            >
            <Icon
              name="lucide:calendar"
              class="pointer-events-none absolute inset-y-0 end-3 my-auto size-5 text-ink-muted"
            />
            <PersianDatePicker
              :model-value="birthDate"
              type="date"
              locale="fa"
              simple
              :show-now-btn="false"
              color="#2b6955"
              format="YYYY-MM-DD"
              display-format="jYYYY/jMM/jDD"
              :min="minBirthDate"
              :max="today"
              :custom-input="`#${birthDateInputId}`"
              append-to="body"
              @update:model-value="birthDate = $event || ''"
            />
          </div>
          <p
            v-if="errors.birthDate"
            class="mt-1 text-xs text-status-danger"
          >
            {{ t(errors.birthDate) }}
          </p>
        </div>
      </div>

      <!-- رمز عبور: با کلیک، اول رمز فعلی پرسیده می‌شه و بعد رمز جدید -->
      <div>
        <label class="mb-1 block text-sm font-medium text-ink">{{ t('auth.password') }}</label>
        <button
          type="button"
          class="field flex items-center justify-between"
          @click="showPasswordModal = true"
        >
          <span
            class="tracking-widest text-ink-muted"
            dir="ltr"
          >••••••••</span>
          <span class="flex items-center gap-1 text-xs font-bold text-primary-700">
            <Icon
              name="lucide:key-round"
              class="size-4"
            />
            {{ t('pages.profile.password.change') }}
          </span>
        </button>
      </div>

      <AppButton
        type="submit"
        block
        :loading="authStore.loading"
        :disabled="!meta.dirty"
      >
        {{ t('pages.profile.saveChanges') }}
      </AppButton>

      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] border border-status-danger/30 px-4 py-2.5 text-sm font-medium text-status-danger transition-colors hover:bg-status-danger/10"
        @click="onLogout"
      >
        <Icon
          name="lucide:log-out"
          class="size-4"
        />
        {{ t('pages.profile.logout') }}
      </button>
    </form>

    <ChangePasswordModal v-model="showPasswordModal" />
  </div>

  <!-- کاربر مهمان -->
  <div
    v-else
    class="glass-card flex flex-col items-start gap-3 p-4"
  >
    <p class="text-sm leading-relaxed text-ink-muted">
      {{ t('pages.profile.loginRequired') }}
    </p>
    <NuxtLink
      :to="{ path: '/auth/login', query: { redirect: '/profile' } }"
      class="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
    >
      {{ t('auth.login') }}
    </NuxtLink>
  </div>
</template>

<style>
/*
  تم تقویم (vue3-persian-datetime-picker) هماهنگ با تم‌های پروژه (forest/wine/brown/navy) و حالت تاریک.
  پاپ‌آپ با append-to="body" بیرون از کامپوننت رندر می‌شه، پس این استایل‌ها عمداً سراسری‌ان
  و از همون CSS variableهای main.css استفاده می‌کنن.
*/
.vpd-content {
  background-color: rgb(var(--color-surface)) !important;
  color: rgb(var(--color-ink));
  border: 1px solid rgb(var(--color-ink) / 0.08);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--card-shadow-hover) !important;
  font-family: inherit;
}
.vpd-header {
  background-color: rgb(var(--color-primary-700)) !important;
  color: #fff;
}
.dark .vpd-header {
  background-color: rgb(var(--color-primary-600)) !important;
}
.vpd-simple-content .vpd-column .vpd-column-header {
  color: rgb(var(--color-ink-muted));
}
.vpd-addon-list {
  background-color: rgb(var(--color-surface)) !important;
}
.vpd-addon-list-item {
  color: rgb(var(--color-ink));
  border-color: transparent !important;
  border-radius: var(--radius-control);
}
.vpd-addon-list-item:hover {
  background-color: rgb(var(--color-primary-500) / 0.1) !important;
}
.vpd-addon-list-item.vpd-selected {
  background-color: rgb(var(--color-primary-500) / 0.15) !important;
  color: rgb(var(--color-primary-700)) !important;
  font-weight: 700;
}
.dark .vpd-addon-list-item.vpd-selected {
  color: rgb(var(--color-primary-200)) !important;
}
.vpd-addon-list-item[disabled='true'] {
  color: rgb(var(--color-ink-muted)) !important;
  opacity: 0.4;
}
.vpd-actions button {
  color: rgb(var(--color-primary-700)) !important;
  border-radius: var(--radius-control);
}
.dark .vpd-actions button {
  color: rgb(var(--color-primary-200)) !important;
}
.vpd-actions button:hover {
  background-color: rgb(var(--color-primary-500) / 0.1) !important;
}
.vpd-simple-content .vpd-column .vpd-column-content::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
}
.vpd-simple-content .vpd-column .vpd-column-content::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}
</style>