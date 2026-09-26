<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const uiStore = useUiStore()

// بدون verified بودن ایمیل (از قدم قبل)، این صفحه معنی نداره؛ برگرد به ثبت‌نام.
if (!authStore.pendingRegistration?.verified) {
  navigateTo('/auth/register')
}

const schema = toTypedSchema(
  z.object({
    password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
    passwordConfirm: z.string(),
  }).refine(data => data.password === data.passwordConfirm, {
    message: 'تکرار رمز عبور مطابقت ندارد',
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
    uiStore.showToast(`خوش اومدی ${authStore.user?.name} 🌿`)
    navigateTo('/dashboard')
  }
})
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">
      تنظیم رمز عبور
    </h1>
    <p class="mb-6 text-sm text-white/70">
      یک رمز عبور قوی برای حسابت انتخاب کن.
    </p>

    <form
      class="flex flex-col gap-4"
      novalidate
      @submit="onSubmit"
    >
      <div>
        <label class="glass-label">رمز عبور</label>
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
            :aria-label="showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'"
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
          {{ errors.password }}
        </p>
      </div>

      <div>
        <label class="glass-label">تکرار رمز عبور</label>
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
            :aria-label="showPasswordConfirm ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'"
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
        تکمیل ثبت‌نام
      </AppButton>
    </form>
  </div>
</template>
