<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const route = useRoute()
const uiStore = useUiStore()

const schema = toTypedSchema(z.object({
  email: z.string().min(1, 'ایمیل را وارد کن').email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
}))

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  const ok = await authStore.login(values.email, values.password)
  if (ok) {
    uiStore.showToast('خوش اومدی 🌿')
    const redirect = (route.query.redirect as string) || '/dashboard'
    navigateTo(redirect)
  }
})
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">
      ورود به حساب
    </h1>
    <p class="mb-6 text-sm text-white/70">
      برای مدیریت گیاهانت وارد شو.
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

      <div>
        <label class="glass-label">رمز عبور</label>
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
          {{ errors.password }}
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
        ورود
      </AppButton>
    </form>

    <p class="mt-5 text-center text-sm text-white/70">
      حساب نداری؟
      <NuxtLink
        to="/auth/register"
        class="font-medium text-accent-200 hover:text-accent-100"
      >
        ثبت‌نام کن
      </NuxtLink>
    </p>
  </div>
</template>
