<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import type { Gender } from '~/types/user.types'

const authStore = useAuthStore()
const uiStore = useUiStore()
const { t } = useI18n()

const today = new Date().toISOString().slice(0, 10)
const showPasswordModal = ref(false)

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().min(2, 'auth.nameMin'),
    birthDate: z
      .string()
      .min(1, 'pages.profile.errors.birthDateRequired')
      .refine(value => value >= '1900-01-01' && value <= today, 'pages.profile.errors.birthDateInvalid'),
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
const [birthDate, birthDateAttrs] = defineField('birthDate')
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

const birthDateLabel = computed(() => (birthDate.value ? toJalaliDate(birthDate.value) : ''))

const inputClass = 'w-full rounded-md border bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 outline-none transition-colors focus:border-primary-500'

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
    class="rounded-lg bg-surface p-4 shadow-card"
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
            :class="[inputClass, errors.name ? 'border-status-danger' : 'border-ink/15']"
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
              class="w-full rounded-md border border-ink/10 bg-ink/5 px-3 py-2.5 pe-10 text-start text-sm text-ink outline-none"
            >
            <!-- ایمیل با کد تایید وریفای شده -->
            <Icon
              name="lucide:badge-check"
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
            :class="[inputClass, 'text-start', errors.phone ? 'border-status-danger' : 'border-ink/15']"
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
            :class="[inputClass, 'text-start', errors.nationalId ? 'border-status-danger' : 'border-ink/15']"
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

        <!-- تاریخ تولد (فعلاً input پیش‌فرض؛ در مرحله‌ی بعد با دیت‌پیکر شمسی عوض می‌شه) -->
        <div>
          <label class="mb-1 block text-sm font-medium text-ink">{{ t('pages.profile.birthDate') }}</label>
          <input
            v-model="birthDate"
            v-bind="birthDateAttrs"
            type="date"
            min="1900-01-01"
            :max="today"
            autocomplete="bday"
            :class="[inputClass, errors.birthDate ? 'border-status-danger' : 'border-ink/15']"
          >
          <p
            v-if="birthDateLabel && !errors.birthDate"
            class="mt-1 text-xs text-ink-muted"
          >
            {{ birthDateLabel }}
          </p>
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
          class="flex w-full items-center justify-between rounded-md border border-ink/15 px-3 py-2.5 text-sm text-ink transition-colors hover:bg-ink/5"
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
        class="flex w-full items-center justify-center gap-2 rounded-md border border-status-danger/30 px-4 py-2.5 text-sm font-medium text-status-danger transition-colors hover:bg-status-danger/10"
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
    class="flex flex-col items-start gap-3 rounded-lg bg-surface p-4 shadow-card"
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