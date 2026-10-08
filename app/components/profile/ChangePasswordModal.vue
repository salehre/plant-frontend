<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const authStore = useAuthStore()
const uiStore = useUiStore()
const { t } = useI18n()

// مرحله‌ی ۱: وارد کردن رمز فعلی | مرحله‌ی ۲: وارد کردن رمز جدید
const step = ref<'verify' | 'change'>('verify')
const verifiedPassword = ref('')

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const inputClass = 'w-full rounded-lg border bg-transparent px-3 py-2.5 pe-10 text-sm text-ink placeholder:text-ink-muted/60 outline-none transition-colors focus:border-primary-500'

/* ---------- مرحله‌ی ۱: رمز فعلی ---------- */
const verifyForm = useForm({
  validationSchema: toTypedSchema(z.object({
    currentPassword: z.string().min(1, 'pages.profile.errors.currentPasswordRequired'),
  })),
})
const [currentPassword, currentPasswordAttrs] = verifyForm.defineField('currentPassword')

const onVerify = verifyForm.handleSubmit(async (values) => {
  const ok = await authStore.verifyCurrentPassword(values.currentPassword)
  if (ok) {
    verifiedPassword.value = values.currentPassword
    authStore.error = ''
    step.value = 'change'
  }
})

/* ---------- مرحله‌ی ۲: رمز جدید ---------- */
const changeForm = useForm({
  validationSchema: toTypedSchema(
    z.object({
      newPassword: z.string().min(8, 'auth.passwordMin8'),
      newPasswordConfirm: z.string(),
    })
      .refine(data => data.newPassword === data.newPasswordConfirm, {
        message: 'auth.passwordMismatch',
        path: ['newPasswordConfirm'],
      })
      .refine(data => data.newPassword !== verifiedPassword.value, {
        message: 'pages.profile.errors.sameAsOld',
        path: ['newPassword'],
      }),
  ),
})
const [newPassword, newPasswordAttrs] = changeForm.defineField('newPassword')
const [newPasswordConfirm, newPasswordConfirmAttrs] = changeForm.defineField('newPasswordConfirm')

const onChange = changeForm.handleSubmit(async (values) => {
  const ok = await authStore.changePassword(verifiedPassword.value, values.newPassword)
  if (ok) {
    uiStore.showToast(t('pages.profile.password.changed'))
    close()
  }
})

function close() {
  emit('update:modelValue', false)
}

// هر بار که مودال باز می‌شه از اول شروع کن و چیزی از دفعه‌ی قبل نمونه.
watch(() => props.modelValue, (open) => {
  if (!open) return
  step.value = 'verify'
  verifiedPassword.value = ''
  showCurrent.value = false
  showNew.value = false
  showConfirm.value = false
  authStore.error = ''
  verifyForm.resetForm()
  changeForm.resetForm()
})
</script>

<template>
  <AppModal
    :model-value="props.modelValue"
    :title="t('pages.profile.password.title')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <!-- مرحله‌ی ۱ -->
    <form
      v-if="step === 'verify'"
      class="flex flex-col gap-4"
      novalidate
      @submit="onVerify"
    >
      <p class="text-sm leading-relaxed text-ink-muted">
        {{ t('pages.profile.password.verifySubtitle') }}
      </p>

      <div>
        <label class="mb-1 block text-sm font-medium text-ink">{{ t('pages.profile.password.current') }}</label>
        <div class="relative">
          <input
            v-model="currentPassword"
            v-bind="currentPasswordAttrs"
            :type="showCurrent ? 'text' : 'password'"
            autocomplete="current-password"
            :class="[inputClass, verifyForm.errors.value.currentPassword ? 'border-status-danger' : 'border-ink/15']"
            placeholder="••••••••"
          >
          <button
            type="button"
            class="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-ink-muted hover:text-ink"
            :aria-label="showCurrent ? t('auth.hidePassword') : t('auth.showPassword')"
            @click="showCurrent = !showCurrent"
          >
            <Icon
              :name="showCurrent ? 'lucide:eye-off' : 'lucide:eye'"
              class="size-4"
            />
          </button>
        </div>
        <p
          v-if="verifyForm.errors.value.currentPassword"
          class="mt-1 text-xs text-status-danger"
        >
          {{ t(verifyForm.errors.value.currentPassword) }}
        </p>
      </div>

      <p
        v-if="authStore.error"
        class="rounded-lg border border-status-danger/30 bg-status-danger/10 p-2 text-sm text-status-danger"
      >
        {{ t(authStore.error) }}
      </p>

      <div class="flex gap-2">
        <AppButton
          variant="ghost"
          class="flex-1"
          @click="close"
        >
          {{ t('common.cancel') }}
        </AppButton>
        <AppButton
          type="submit"
          class="flex-1"
          :loading="authStore.loading"
        >
          {{ t('common.continue') }}
        </AppButton>
      </div>
    </form>

    <!-- مرحله‌ی ۲ -->
    <form
      v-else
      class="flex flex-col gap-4"
      novalidate
      @submit="onChange"
    >
      <p class="text-sm leading-relaxed text-ink-muted">
        {{ t('pages.profile.password.changeSubtitle') }}
      </p>

      <div>
        <label class="mb-1 block text-sm font-medium text-ink">{{ t('auth.newPassword') }}</label>
        <div class="relative">
          <input
            v-model="newPassword"
            v-bind="newPasswordAttrs"
            :type="showNew ? 'text' : 'password'"
            autocomplete="new-password"
            :class="[inputClass, changeForm.errors.value.newPassword ? 'border-status-danger' : 'border-ink/15']"
            placeholder="••••••••"
          >
          <button
            type="button"
            class="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-ink-muted hover:text-ink"
            :aria-label="showNew ? t('auth.hidePassword') : t('auth.showPassword')"
            @click="showNew = !showNew"
          >
            <Icon
              :name="showNew ? 'lucide:eye-off' : 'lucide:eye'"
              class="size-4"
            />
          </button>
        </div>
        <p
          v-if="changeForm.errors.value.newPassword"
          class="mt-1 text-xs text-status-danger"
        >
          {{ t(changeForm.errors.value.newPassword) }}
        </p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-ink">{{ t('auth.confirmPassword') }}</label>
        <div class="relative">
          <input
            v-model="newPasswordConfirm"
            v-bind="newPasswordConfirmAttrs"
            :type="showConfirm ? 'text' : 'password'"
            autocomplete="new-password"
            :class="[inputClass, changeForm.errors.value.newPasswordConfirm ? 'border-status-danger' : 'border-ink/15']"
            placeholder="••••••••"
          >
          <button
            type="button"
            class="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-ink-muted hover:text-ink"
            :aria-label="showConfirm ? t('auth.hidePassword') : t('auth.showPassword')"
            @click="showConfirm = !showConfirm"
          >
            <Icon
              :name="showConfirm ? 'lucide:eye-off' : 'lucide:eye'"
              class="size-4"
            />
          </button>
        </div>
        <p
          v-if="changeForm.errors.value.newPasswordConfirm"
          class="mt-1 text-xs text-status-danger"
        >
          {{ t(changeForm.errors.value.newPasswordConfirm) }}
        </p>
      </div>

      <p
        v-if="authStore.error"
        class="rounded-lg border border-status-danger/30 bg-status-danger/10 p-2 text-sm text-status-danger"
      >
        {{ t(authStore.error) }}
      </p>

      <div class="flex gap-2">
        <AppButton
          variant="ghost"
          class="flex-1"
          @click="close"
        >
          {{ t('common.cancel') }}
        </AppButton>
        <AppButton
          type="submit"
          class="flex-1"
          :loading="authStore.loading"
        >
          {{ t('pages.profile.password.save') }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>