<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const uiStore = useUiStore()

// این صفحه خودش سه قدمه (بدون رفتن به صفحه‌ی جدا): ایمیل → کد → رمز جدید.
// کد جداگانه وریفای نمی‌شه؛ همراه رمز جدید توی resetPassword با هم چک می‌شن -
// اگه کد غلط بود، برمی‌گردیم قدم کد (نه این‌که این‌جا خطا بدیم).
const step = ref<'email' | 'otp' | 'password'>('email')
const submittedEmail = ref('')

// ─── قدم ۱: ایمیل ───
const emailSchema = toTypedSchema(z.object({
  email: z.string().min(1, 'ایمیل را وارد کن').email('ایمیل معتبر نیست'),
}))
const { handleSubmit: handleEmailSubmit, defineField: defineEmailField, errors: emailErrors } = useForm({ validationSchema: emailSchema })
const [email, emailAttrs] = defineEmailField('email')

const onEmailSubmit = handleEmailSubmit(async (values) => {
  const code = await authStore.forgotPassword(values.email)
  if (code) {
    submittedEmail.value = values.email
    step.value = 'otp'
    startCountdown()
    // dev-only: چون ایمیل واقعی وصل نیست، کد رو همین‌جا نشون می‌دیم - Phase 3 حذف می‌شه.
    uiStore.showToast(`کد بازیابی ارسال شد (dev: ${code})`)
  }
})

// ─── قدم ۲: کد (۶ خونه‌ی جدا) ───
const digits = ref<string[]>(['', '', '', '', '', ''])
const digitRefs = ref<HTMLInputElement[]>([])
const isCodeComplete = computed(() => digits.value.every(d => d !== ''))

function onDigitInput(index: number, event: Event) {
  const val = (event.target as HTMLInputElement).value.replace(/\D/g, '')
  digits.value[index] = val.slice(-1)
  authStore.error = ''
  if (val && index < 5) digitRefs.value[index + 1]?.focus()
}
function onKeyDown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    digitRefs.value[index - 1]?.focus()
  }
}
function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) || ''
  pasted.split('').forEach((char, i) => { if (i < 6) digits.value[i] = char })
  digitRefs.value[Math.min(pasted.length, 5)]?.focus()
}

// کد این‌جا فقط لوکال چک می‌شه که خالی نباشه؛ اعتبار واقعیش رو resetPassword می‌سنجه.
function continueToPassword() {
  if (!isCodeComplete.value) return
  step.value = 'password'
}

const RESEND_SECONDS = 120
const countdown = ref(RESEND_SECONDS)
const resending = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
const formatCountdown = computed(() => {
  const m = Math.floor(countdown.value / 60)
  const s = countdown.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})
function startCountdown() {
  if (timer) clearInterval(timer)
  countdown.value = RESEND_SECONDS
  timer = setInterval(() => {
    if (countdown.value <= 0) clearInterval(timer!)
    else countdown.value--
  }, 1000)
}
onUnmounted(() => { if (timer) clearInterval(timer) })

async function resendCode() {
  resending.value = true
  try {
    const code = await authStore.sendOtp(submittedEmail.value, 'reset')
    uiStore.showToast(`کد جدید ارسال شد (dev: ${code})`, 'info')
    startCountdown()
    digits.value = ['', '', '', '', '', '']
    authStore.error = ''
  }
  finally {
    resending.value = false
  }
}

// ─── قدم ۳: رمز جدید ───
const passwordSchema = toTypedSchema(
    z.object({
      password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
      passwordConfirm: z.string(),
    }).refine(data => data.password === data.passwordConfirm, {
      message: 'تکرار رمز عبور مطابقت ندارد',
      path: ['passwordConfirm'],
    }),
)
const { handleSubmit: handlePasswordSubmit, defineField: definePasswordField, errors: passwordErrors } = useForm({ validationSchema: passwordSchema })
const [password, passwordAttrs] = definePasswordField('password')
const [passwordConfirm, passwordConfirmAttrs] = definePasswordField('passwordConfirm')

const onPasswordSubmit = handlePasswordSubmit(async (values) => {
  const ok = await authStore.resetPassword(submittedEmail.value, digits.value.join(''), values.password)
  if (ok) {
    uiStore.showToast('رمز عبورت با موفقیت تغییر کرد 🌿')
    navigateTo({ path: '/auth/login', query: { reset: 'true' } })
  }
  else {
    // کد اشتباه/منقضیه؛ برگرد قدم کد
    step.value = 'otp'
    digits.value = ['', '', '', '', '', '']
    setTimeout(() => digitRefs.value[0]?.focus(), 50)
  }
})

const stepNumber = computed(() => ({ email: 1, otp: 2, password: 3 }[step.value]))
</script>

<template>
  <div>
    <div class="mb-6 flex gap-2">
      <div
          v-for="s in 3"
          :key="s"
          class="h-1.5 flex-1 rounded-full transition-colors duration-300"
          :class="s <= stepNumber ? 'bg-accent-300' : 'bg-white/15'"
      />
    </div>

    <template v-if="step === 'email'">
      <h1 class="mb-1 text-xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">
        بازیابی رمز عبور
      </h1>
      <p class="mb-6 text-sm text-white/70">
        ایمیلت را وارد کن تا کد بازیابی رمز عبور را برایت بفرستیم.
      </p>

      <form
          class="flex flex-col gap-4"
          novalidate
          @submit="onEmailSubmit"
      >
        <div>
          <label class="glass-label">ایمیل</label>
          <input
              v-model="email"
              v-bind="emailAttrs"
              type="email"
              class="glass-input"
              :class="{ 'glass-input--error': emailErrors.email }"
              placeholder="you@example.com"
          >
          <p
              v-if="emailErrors.email"
              class="mt-1 text-xs text-red-200"
          >
            {{ emailErrors.email }}
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
          ارسال کد بازیابی
        </AppButton>
      </form>
    </template>

    <template v-else-if="step === 'otp'">
      <h1 class="mb-1 text-xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">
        تایید ایمیل
      </h1>
      <p class="mb-6 text-sm text-white/70">
        کد ۶ رقمی ارسال‌شده به <span class="font-medium text-white">{{ submittedEmail }}</span> را وارد کن.
      </p>

      <div class="flex flex-col gap-5">
        <div
            class="flex justify-center gap-2"
            dir="ltr"
        >
          <input
              v-for="(_, i) in 6"
              :key="i"
              :ref="el => (digitRefs[i] = el as HTMLInputElement)"
              v-model="digits[i]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              autocomplete="one-time-code"
              class="h-12 w-11 rounded-xl border-2 border-white/20 bg-white/10 text-center text-xl font-bold text-white outline-none backdrop-blur-sm transition-colors duration-150 focus-visible:border-accent-300/70 focus-visible:bg-white/15"
              :class="{ 'border-red-300/60 bg-red-500/10': authStore.error, 'border-accent-300/70': digits[i] && !authStore.error }"
              @input="onDigitInput(i, $event)"
              @keydown="onKeyDown(i, $event)"
              @paste="onPaste"
              @focus="($event.target as HTMLInputElement).select()"
          >
        </div>

        <p
            v-if="authStore.error"
            class="rounded-lg border border-red-300/30 bg-red-500/15 p-2 text-center text-sm text-red-100"
        >
          {{ authStore.error }}
        </p>

        <AppButton
            type="button"
            variant="accent"
            block
            :disabled="!isCodeComplete"
            @click="continueToPassword"
        >
          تایید کد
        </AppButton>

        <p class="text-center text-sm text-white/70">
          <span v-if="countdown > 0">
            ارسال مجدد تا
            <span class="font-bold tabular-nums text-accent-200">{{ formatCountdown }}</span>
          </span>
          <button
              v-else
              type="button"
              class="font-medium text-accent-200 hover:text-accent-100 disabled:opacity-60"
              :disabled="resending"
              @click="resendCode"
          >
            ارسال دوباره کد
          </button>
        </p>
      </div>
    </template>

    <template v-else>
      <h1 class="mb-1 text-xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">
        رمز جدید
      </h1>
      <p class="mb-6 text-sm text-white/70">
        یک رمز عبور جدید برای حسابت انتخاب کن.
      </p>

      <form
          class="flex flex-col gap-4"
          novalidate
          @submit="onPasswordSubmit"
      >
        <div>
          <label class="glass-label">رمز عبور جدید</label>
          <input
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
              class="glass-input"
              :class="{ 'glass-input--error': passwordErrors.password }"
              placeholder="••••••••"
          >
          <p
              v-if="passwordErrors.password"
              class="mt-1 text-xs text-red-200"
          >
            {{ passwordErrors.password }}
          </p>
        </div>

        <div>
          <label class="glass-label">تکرار رمز عبور</label>
          <input
              v-model="passwordConfirm"
              v-bind="passwordConfirmAttrs"
              type="password"
              class="glass-input"
              :class="{ 'glass-input--error': passwordErrors.passwordConfirm }"
              placeholder="••••••••"
          >
          <p
              v-if="passwordErrors.passwordConfirm"
              class="mt-1 text-xs text-red-200"
          >
            {{ passwordErrors.passwordConfirm }}
          </p>
        </div>

        <AppButton
            type="submit"
            variant="accent"
            block
            :loading="authStore.loading"
        >
          ذخیره رمز جدید
        </AppButton>
      </form>
    </template>

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