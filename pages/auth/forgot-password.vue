<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const uiStore = useUiStore()

const schema = toTypedSchema(z.object({
  email: z.string().min(1, 'ایمیل را وارد کن').email('ایمیل معتبر نیست'),
}))

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })

const [email, emailAttrs] = defineField('email')

// Phase 3: با وصل‌شدن بک‌اند واقعی، این صفحه فقط پیام «ایمیل بازیابی ارسال شد» رو
// نشون می‌ده و کاربر از طریق لینک همون ایمیل به reset-password می‌ره (با توکن، نه با
// ایمیل در query). فعلاً چون ایمیل واقعی ارسال نمی‌شه، مستقیم به reset-password هدایتش می‌کنیم.
const onSubmit = handleSubmit(async (values) => {
  const ok = await authStore.forgotPassword(values.email)
  if (ok) {
    uiStore.showToast('لینک بازیابی رمز عبور ارسال شد 📩')
    navigateTo({ path: '/auth/reset-password', query: { email: values.email } })
  }
})
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">
      بازیابی رمز عبور
    </h1>
    <p class="mb-6 text-sm text-white/70">
      ایمیلت را وارد کن تا لینک بازیابی رمز عبور را برایت بفرستیم.
    </p>

    <form
      class="flex flex-col gap-4"
      novalidate
      @submit="onSubmit"
    >
      <div>
        <label class="glass-label">ایمیل</label>
        <input
          v-model="email"
          v-bind="emailAttrs"
          type="email"
          class="glass-input"
          :class="{ 'glass-input--error': errors.email }"
          placeholder="you@example.com"
        >
        <p
          v-if="errors.email"
          class="mt-1 text-xs text-red-200"
        >
          {{ errors.email }}
        </p>
      </div>

      <p
        v-if="authStore.error"
        class="rounded-lg border border-red-300/30 bg-red-500/15 p-2 text-sm text-red-100"
      >
        {{ authStore.error }}
      </p>

      <AppButton
        type="submit"
        variant="accent"
        block
        :loading="authStore.loading"
      >
        ارسال لینک بازیابی
      </AppButton>
    </form>

    <p class="mt-5 text-center text-sm text-white/70">
      رمزت را یادت آمد؟
      <NuxtLink
        to="/auth/login"
        class="font-medium text-accent-200 hover:text-accent-100"
      >
        وارد شو
      </NuxtLink>
    </p>
  </div>
</template>
