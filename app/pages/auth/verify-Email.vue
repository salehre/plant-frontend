<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const uiStore = useUiStore()
const { t } = useI18n()

// بدون verified بودن ایمیل (از قدم قبل)، این صفحه معنی نداره؛ برگرد به ثبت‌نام.
if (!authStore.pendingRegistration?.verified) {
  navigateTo('/auth/register')
}

const schema = toTypedSchema(
  z.object({
    password: z.string().min(8, 'auth.passwordMin8'),
    passwordConfirm: z.string(),
  }).refine(data => data.password === data.passwordConfirm, {
    message: 'auth.passwordMismatch',
    path: ['passwordConfirm'],
  }),
)

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })

const [password, passwordAttrs] = defineField('password')
const [passwordConfirm, passwordConfirmAttrs] = defineField('passwordConfirm')

const onSubmit = handleSubmit(async (values) => {
  const ok = await authStore.setPassword(values.password)
  if (ok) {
    uiStore.showToast(t('auth.welcomeUser', { name: authStore.user?.name ?? '' }) + ' 🌿')
    navigateTo('/dashboard')
  }
})
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">
      {{ t('auth.setPasswordTitle') }}
    </h1>
    <p class="mb-6 text-sm text-white/70">
      {{ t('auth.setPasswordSubtitle') }}
    </p>

    <form
      class="flex flex-col gap-4"
      novalidate
      @submit="onSubmit"
    >
      <div>
        <label class="glass-label">{{ t('auth.password') }}</label>
        <input
          v-model="password"
          v-bind="passwordAttrs"
          type="password"
          class="glass-input"
          :class="{ 'glass-input--error': errors.password }"
          placeholder="••••••••"
        >
        <p
          v-if="errors.password"
          class="mt-1 text-xs text-red-200"
        >
          {{ errors.password ? t(errors.password) : '' }}
        </p>
      </div>

      <div>
        <label class="glass-label">{{ t('auth.confirmPassword') }}</label>
        <input
          v-model="passwordConfirm"
          v-bind="passwordConfirmAttrs"
          type="password"
          class="glass-input"
          :class="{ 'glass-input--error': errors.passwordConfirm }"
          placeholder="••••••••"
        >
        <p
          v-if="errors.passwordConfirm"
          class="mt-1 text-xs text-red-200"
        >
          {{ errors.passwordConfirm ? t(errors.passwordConfirm) : '' }}
        </p>
      </div>

      <p
        v-if="authStore.error"
        class="rounded-lg border border-red-300/30 bg-red-500/15 p-2 text-sm text-red-100"
      >
        {{ t(authStore.error) }}
      </p>

      <AppButton
        type="submit"
        variant="accent"
        block
        :loading="authStore.loading"
      >
        {{ t('auth.completeRegistration') }}
      </AppButton>
    </form>
  </div>
</template>
