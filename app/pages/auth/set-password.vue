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
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

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
        <div class="relative">
          <input
            v-model="password"
            v-bind="passwordAttrs"
            :type="showPassword ? 'text' : 'password'"
            class="glass-input pe-10"
            :class="{ 'glass-input--error': errors.password }"
            placeholder="••••••••"
          >
          <button
            type="button"
            class="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-white/60 hover:text-white"
            :aria-label="showPassword ? t('auth.hidePassword') : t('auth.showPassword')"
            @click="showPassword = !showPassword"
          >
            <Icon
              :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
              class="size-4"
            />
          </button>
        </div>
        <p
          v-if="errors.password"
          class="mt-1 text-xs text-red-200"
        >
          {{ errors.password ? t(errors.password) : '' }}
        </p>
      </div>

      <div>
        <label class="glass-label">{{ t('auth.confirmPassword') }}</label>
        <div class="relative">
          <input
            v-model="passwordConfirm"
            v-bind="passwordConfirmAttrs"
            :type="showPasswordConfirm ? 'text' : 'password'"
            class="glass-input pe-10"
            :class="{ 'glass-input--error': errors.passwordConfirm }"
            placeholder="••••••••"
          >
          <button
            type="button"
            class="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-white/60 hover:text-white"
            :aria-label="showPasswordConfirm ? t('auth.hidePassword') : t('auth.showPassword')"
            @click="showPasswordConfirm = !showPasswordConfirm"
          >
            <Icon
              :name="showPasswordConfirm ? 'lucide:eye-off' : 'lucide:eye'"
              class="size-4"
            />
          </button>
        </div>
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
