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
const bioMaxLength = 200
const showPasswordModal = ref(false)
const editing = ref(false)

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
    bio: z.string().max(bioMaxLength, 'pages.profile.errors.bioMax').optional(),
  }),
)

function userValues() {
  return {
    name: authStore.user?.name ?? '',
    birthDate: authStore.user?.birthDate ?? '',
    gender: authStore.user?.gender,
    phone: authStore.user?.phone ?? '',
    nationalId: authStore.user?.nationalId ?? '',
    bio: authStore.user?.bio ?? '',
  }
}

const { handleSubmit, defineField, errors, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: userValues(),
})

const [name, nameAttrs] = defineField('name')
const [birthDate] = defineField('birthDate')
const [gender] = defineField('gender')
const [phone, phoneAttrs] = defineField('phone')
const [nationalId, nationalIdAttrs] = defineField('nationalId')
const [bio, bioAttrs] = defineField('bio')

const user = computed(() => authStore.user)
const isFa = computed(() => locale.value === 'fa')
const intlLocale = computed(() => isFa.value ? 'fa-IR' : 'en-US')

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

// تاریخ میلادی (YYYY-MM-DD) رو به متن شمسی (YYYY/MM/DD) تبدیل می‌کنه.
function toJalaliText(value?: string) {
  if (!value) return ''
  const [y, m, d] = value.slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return ''
  const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).formatToParts(new Date(Date.UTC(y, m - 1, d)))
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  return `${get('relatedYear') || get('year')}/${get('month')}/${get('day')}`
}

// مقدار فرم/ذخیره همیشه میلادی می‌مونه؛ فقط نمایشش شمسیه.
const birthDateDisplay = computed(() => toJalaliText(birthDate.value))

const inputClass = 'field'

// ردیف‌های حالت نمایش (مثل کارت «اطلاعات کاربر»)
const rows = computed(() => {
  const u = user.value
  const digits = (v: string) => isFa.value ? toPersianDigits(v) : v
  const genderLabel = u?.gender
    ? t(u.gender === 'male' ? 'pages.profile.genderMale' : 'pages.profile.genderFemale')
    : ''
  const joined = u?.joinedAt
    ? new Intl.DateTimeFormat(intlLocale.value, { month: 'long', year: 'numeric' }).format(new Date(u.joinedAt))
    : ''

  return [
    { key: 'name', icon: 'lucide:user', label: t('auth.name'), value: u?.name ?? '' },
    { key: 'email', icon: 'lucide:mail', label: t('auth.email'), value: u?.email ?? '', ltr: true },
    { key: 'phone', icon: 'lucide:phone', label: t('pages.profile.phone'), value: digits(u?.phone ?? ''), ltr: !isFa.value },
    { key: 'gender', icon: 'lucide:venus-and-mars', label: t('pages.profile.gender'), value: genderLabel },
    { key: 'nationalId', icon: 'lucide:id-card', label: t('pages.profile.nationalId'), value: digits(u?.nationalId ?? ''), ltr: !isFa.value },
    { key: 'birthDate', icon: 'lucide:cake', label: t('pages.profile.birthDate'), value: digits(toJalaliText(u?.birthDate)), ltr: !isFa.value },
    { key: 'bio', icon: 'lucide:text-quote', label: t('pages.profile.bio'), value: u?.bio ?? '', multiline: true },
    { key: 'joined', icon: 'lucide:calendar', label: t('pages.profile.memberSince'), value: joined },
  ]
})

function startEdit() {
  resetForm({ values: userValues() })
  editing.value = true
}

function cancelEdit() {
  resetForm({ values: userValues() })
  editing.value = false
}

// والد (تب حساب در پروفایل) از این می‌تونه دایلوگ ویرایش رو باز کنه
defineExpose({ startEdit })

const onSubmit = handleSubmit(async (values) => {
  const ok = await authStore.updateProfile({
    name: values.name,
    birthDate: values.birthDate,
    gender: values.gender,
    phone: normalizeDigits(values.phone.trim()),
    nationalId: normalizeDigits(values.nationalId.trim()),
    bio: (values.bio ?? '').trim(),
  })
  if (ok) {
    resetForm({ values: userValues() })
    editing.value = false
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
    class="glass-card w-full p-4 sm:p-6"
  >
    <!-- سربرگ -->
    <header class="mb-5 flex items-center justify-between gap-3">
      <h2 class="text-lg font-bold text-ink">
        {{ t('pages.profile.account') }}
      </h2>

      <button
        v-if="!editing"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3.5 py-1.5 text-xs font-bold text-ink transition-colors hover:border-primary-500/40 hover:bg-primary-50 hover:text-primary-700"
        @click="startEdit"
      >
        <Icon
          name="lucide:pencil"
          class="size-3.5"
        />
        {{ t('pages.profile.edit') }}
      </button>
    </header>

    <!-- حالت نمایش -->
    <div>
      <dl class="mt-5 divide-y divide-ink/5 border-t border-ink/5 text-sm">
        <div
          v-for="row in rows"
          :key="row.key"
          class="flex gap-3 py-3.5"
          :class="row.multiline ? 'items-start' : 'items-center'"
        >
          <div class="flex w-32 shrink-0 حس items-center gap-2.5 text-ink-muted sm:w-52">
            <Icon
              :name="row.icon"
              class="size-4 shrink-0"
            />
            <dt class="truncate">
              {{ row.label }}
            </dt>
          </div>
          <dd
            class="min-w-0 flex-1 font-medium text-ink"
            :class="row.multiline ? 'whitespace-pre-line break-words leading-relaxed' : 'truncate'"
          >
            <span
              v-if="row.value"
              :dir="row.ltr ? 'ltr' : undefined"
              :class="row.ltr && isFa ? 'inline-block' : ''"
            >{{ row.value }}</span>
            <span
              v-else
              class="font-normal text-ink-muted"
            >—</span>
          </dd>
        </div>

        <!-- رمز عبور -->
        <div class="flex items-center gap-3 py-3.5">
          <div class="flex w-32 shrink-0 items-center gap-2.5 text-ink-muted sm:w-52">
            <Icon
              name="lucide:shield"
              class="size-4 shrink-0"
            />
            <dt class="truncate">
              {{ t('auth.password') }}
            </dt>
          </div>
          <dd class="flex min-w-0 flex-1 items-center justify-between gap-3">
            <span
              class="tracking-widest text-ink-muted"
              dir="ltr"
            >••••••••</span>
            <button
              type="button"
              class="inline-flex size-9 items-center justify-center rounded-full border border-ink/10 bg-surface py-1.5 text-xs font-bold text-ink transition-colors hover:border-primary-500/40 hover:bg-primary-50 hover:text-primary-700 sm:size-auto sm:justify-start sm:gap-1.5 sm:px-3.5"
              :aria-label="t('pages.profile.password.change')"
              @click="showPasswordModal = true"
            >
              <Icon
                name="lucide:pencil"
                class="size-4 sm:hidden"
              />
              <Icon
                name="lucide:key-round"
                class="hidden size-4 sm:block"
              />
              <span class="hidden sm:inline">{{ t('pages.profile.password.change') }}</span>
            </button>
          </dd>
        </div>
      </dl>
    </div>

    <!-- حالت ویرایش: توی دایلوگ -->
    <AppModal
      v-model="editing"
      :title="t('pages.profile.editProfile')"
      max-width="max-w-xl"
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

        <!-- بیو -->
        <div class="sm:col-span-2">
          <div class="mb-1 flex items-center justify-between gap-2">
            <label class="block text-sm font-medium text-ink">{{ t('pages.profile.bio') }}</label>
            <span class="text-xs text-ink-muted">
              {{ isFa ? toPersianDigits((bio ?? '').length) : (bio ?? '').length }}/{{ isFa ? toPersianDigits(bioMaxLength) : bioMaxLength }}
            </span>
          </div>
          <textarea
            v-model="bio"
            v-bind="bioAttrs"
            rows="3"
            :maxlength="bioMaxLength"
            :class="[inputClass, 'resize-none leading-relaxed', errors.bio ? 'border-status-danger' : '']"
            :placeholder="t('pages.profile.bioPlaceholder')"
          />
          <p
            v-if="errors.bio"
            class="mt-1 text-xs text-status-danger"
          >
            {{ t(errors.bio) }}
          </p>
        </div>
      </div>

      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <AppButton
          type="button"
          variant="ghost"
          :disabled="authStore.loading"
          @click="cancelEdit"
        >
          {{ t('common.cancel') }}
        </AppButton>
        <AppButton
          type="submit"
          :loading="authStore.loading"
          :disabled="!meta.dirty"
        >
          {{ t('pages.profile.saveChanges') }}
        </AppButton>
      </div>
    </form>
    </AppModal>

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