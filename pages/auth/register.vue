<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const uiStore = useUiStore()

// رمز عبور این‌جا گرفته نمی‌شه؛ فقط بعد از وریفای ایمیل (verify-email → set-password)
// کاربر صاحب حساب می‌شه. اینطوری نمی‌شه با یه ایمیل غیرواقعی حساب نیمه‌ساز با رمز ساخت.
const schema = toTypedSchema(
    z.object({
      name: z.string().min(2, 'اسم باید حداقل ۲ حرف باشد'),
      email: z.string().min(1, 'ایمیل را وارد کن').email('ایمیل معتبر نیست'),
    }),
)

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')

const onSubmit = handleSubmit(async (values) => {
  const code = await authStore.register(values.name, values.email)
  if (code) {
    // dev-only: چون ایمیل واقعی وصل نیست، کد رو همین‌جا نشون می‌دیم تا فلو قابل تست باشه.
    // Phase 3 این toast حذف می‌شه؛ کد واقعاً فقط توی ایمیل کاربر می‌ره.
    uiStore.showToast(`کد تایید ارسال شد (dev: ${code})`)
    navigateTo({ path: '/auth/verify-email', query: { email: values.email } })
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
        ادامه
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