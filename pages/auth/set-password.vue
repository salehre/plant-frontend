<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const uiStore = useUiStore()
const route = useRoute()

// Phase 3: به‌جای email در query، یک توکن یک‌بارمصرف از لینک ایمیل خونده می‌شه
// و اعتبارش سمت بک‌اند چک می‌شه. فعلاً (بدون بک‌اند واقعی) ایمیلِ همون کاربری که
// از forgot-password اومده رو نگه می‌داریم تا بشه فلو رو کامل تست کرد.
const email = computed(() => (route.query.email as string) || '')

if (!email.value) {
  navigateTo('/auth/forgot-password')
}

const schema = toTypedSchema(
  z.object({
    password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
    passwordConfirm: z.string(),
  }).refine(data => data.password === data.passwordConfirm, {
    message: 'تکرار رمز عبور مطابقت ندارد',
    path: ['passwordConfirm'],
  }),
)

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })

const [password, passwordAttrs] = defineField('password')
const [passwordConfirm, passwordConfirmAttrs] = defineField('passwordConfirm')

const onSubmit = handleSubmit(async (values) => {
  const ok = await authStore.resetPassword(email.value, values.password)
  if (ok) {
    uiStore.showToast('رمز عبورت با موفقیت تغییر کرد 🌿')
    navigateTo('/auth/login')
  }
})
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">
      انتخاب رمز عبور جدید
    </h1>
    <p class="mb-6 text-sm text-white/70">
      یک رمز عبور جدید برای حسابت انتخاب کن.
    </p>

    <form
      class="flex flex-col gap-4"
      novalidate
      @submit="onSubmit"
    >
      <div>
        <label class="glass-label">رمز عبور جدید</label>
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
        <label class="glass-label">تکرار رمز عبور جدید</label>
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
        ثبت رمز عبور جدید
      </AppButton>
    </form>

    <p class="mt-5 text-center text-sm text-white/70">
      <NuxtLink
        to="/auth/login"
        class="font-medium text-accent-200 hover:text-accent-100"
      >
        بازگشت به ورود
      </NuxtLink>
    </p>
  </div>
</template>
