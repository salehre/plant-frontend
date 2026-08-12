<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const uiStore = useUiStore()

const schema = toTypedSchema(
  z.object({
    name: z.string().min(2, 'اسم باید حداقل ۲ حرف باشد'),
    email: z.string().min(1, 'ایمیل را وارد کن').email('ایمیل معتبر نیست'),
    password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
    passwordConfirm: z.string(),
  }).refine(data => data.password === data.passwordConfirm, {
    message: 'تکرار رمز عبور مطابقت ندارد',
    path: ['passwordConfirm'],
  }),
)

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirm, passwordConfirmAttrs] = defineField('passwordConfirm')

const onSubmit = handleSubmit(async (values) => {
  const ok = await authStore.register(values.name, values.email, values.password)
  if (ok) {
    uiStore.showToast('حساب تو با موفقیت ساخته شد 🌱')
    navigateTo('/dashboard')
  }
})
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">
      ساخت حساب کاربری
    </h1>
    <p class="mb-6 text-sm text-white/70">
      رایگان ثبت‌نام کن و شروع کن به مراقبت هوشمند از گیاهانت.
    </p>

    <form
      class="flex flex-col gap-4"
      novalidate
      @submit="onSubmit"
    >
      <div>
        <label class="glass-label">اسم</label>
        <input
          v-model="name"
          v-bind="nameAttrs"
          type="text"
          class="glass-input"
          :class="{ 'glass-input--error': errors.name }"
          placeholder="اسم و فامیل"
        >
        <p
          v-if="errors.name"
          class="mt-1 text-xs text-red-200"
        >
          {{ errors.name }}
        </p>
      </div>

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

      <div>
        <label class="glass-label">تکرار رمز عبور</label>
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
          {{ errors.passwordConfirm }}
        </p>
      </div>

      <AppButton
        type="submit"
        variant="accent"
        block
        :loading="authStore.loading"
      >
        ثبت‌نام
      </AppButton>
    </form>

    <p class="mt-5 text-center text-sm text-white/70">
      قبلاً حساب ساختی؟
      <NuxtLink
        to="/auth/login"
        class="font-medium text-accent-200 hover:text-accent-100"
      >
        وارد شو
      </NuxtLink>
    </p>
  </div>
</template>
