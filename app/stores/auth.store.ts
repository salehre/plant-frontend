import { defineStore } from 'pinia'
import type { User, UserProfileData } from '~/types/user.types'

type OtpPurpose = 'register' | 'reset'
interface OtpEntry { code: string, expiresAt: number }
interface PendingRegistration { name: string, email: string, verified: boolean }

const OTP_TTL_MS = 10 * 60 * 1000

const emailKey = (email: string) => email.trim().toLowerCase()

function mockHash(value: string): string {
  let h1 = 0xDEADBEEF
  let h2 = 0x41C6CE57
  for (let i = 0; i < value.length; i++) {
    const ch = value.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage<User | null>('bargyar-auth-user', null),
    pendingRegistration: useLocalStorage<PendingRegistration | null>('bargyar-pending-registration', null),
    otps: useLocalStorage<Record<string, OtpEntry>>('bargyar-otp-codes', {}),
    credentials: useLocalStorage<Record<string, string>>('bargyar-credentials', {}),
    profiles: useLocalStorage<Record<string, UserProfileData>>('bargyar-user-profiles', {}),
    loading: false,
    error: '',
  }),
  getters: {
    isLoggedIn: state => !!state.user,
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!email.includes('@')) {
          this.error = 'auth.errors.invalidCredentials'
          return false
        }
        const key = emailKey(email)
        const storedHash = this.credentials[key]
        if (storedHash && storedHash !== mockHash(password)) {
          this.error = 'auth.errors.invalidCredentials'
          return false
        }
        if (!storedHash) {
          this.credentials[key] = mockHash(password)
        }
        this.user = {
          id: 'u_current',
          name: email.split('@')[0] ?? 'کاربر',
          email,
          joinedAt: new Date().toISOString().slice(0, 10),
          ...this.profiles[key],
        }
        return true
      }
      finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
    },

    async sendOtp(email: string, purpose: OtpPurpose) {
      await simulateDelay(400)
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      this.otps[`${purpose}:${email}`] = { code, expiresAt: Date.now() + OTP_TTL_MS }
      return code
    },

    verifyOtpCode(email: string, purpose: OtpPurpose, code: string) {
      const key = `${purpose}:${email}`
      const entry = this.otps[key]
      if (!entry || entry.expiresAt < Date.now() || entry.code !== code) {
        return false
      }
      delete this.otps[key]
      return true
    },

    async register(name: string, email: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        this.pendingRegistration = { name, email, verified: false }
        const code = await this.sendOtp(email, 'register')
        return code
      }
      finally {
        this.loading = false
      }
    },

    async verifyRegisterOtp(email: string, code: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!this.verifyOtpCode(email, 'register', code)) {
          this.error = 'auth.errors.invalidCode'
          return false
        }
        if (this.pendingRegistration && this.pendingRegistration.email === email) {
          this.pendingRegistration.verified = true
        }
        return true
      }
      finally {
        this.loading = false
      }
    },

    async setPassword(password: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!this.pendingRegistration?.verified) {
          this.error = 'auth.errors.verifyEmailFirst'
          return false
        }
        const key = emailKey(this.pendingRegistration.email)
        this.credentials[key] = mockHash(password)
        this.user = {
          id: 'u_current',
          name: this.pendingRegistration.name,
          email: this.pendingRegistration.email,
          joinedAt: new Date().toISOString().slice(0, 10),
          ...this.profiles[key],
        }
        this.pendingRegistration = null
        return true
      }
      finally {
        this.loading = false
      }
    },

    /** بازیابی رمز قدم ۱: OTP برای ایمیل می‌فرسته. */
    async forgotPassword(email: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!email.includes('@')) {
          this.error = 'auth.errors.emailInvalid'
          return null
        }
        const code = await this.sendOtp(email, 'reset')
        return code
      }
      finally {
        this.loading = false
      }
    },

    async resetPassword(email: string, code: string, newPassword: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!this.verifyOtpCode(email, 'reset', code)) {
          this.error = 'auth.errors.invalidCode'
          return false
        }
        this.credentials[emailKey(email)] = mockHash(newPassword)
        return true
      }
      finally {
        this.loading = false
      }
    },

    async updateProfile(data: UserProfileData) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!this.user) {
          this.error = 'pages.profile.errors.notLoggedIn'
          return false
        }
        this.user = { ...this.user, ...data }
        this.profiles[emailKey(this.user.email)] = { ...data }
        return true
      }
      finally {
        this.loading = false
      }
    },

    async verifyCurrentPassword(password: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(400)
        return this.checkCurrentPassword(password)
      }
      finally {
        this.loading = false
      }
    },

    async changePassword(currentPassword: string, newPassword: string) {
      this.loading = true
      this.error = ''
      try {
        await simulateDelay(500)
        if (!this.checkCurrentPassword(currentPassword)) {
          return false
        }
        this.credentials[emailKey(this.user!.email)] = mockHash(newPassword)
        return true
      }
      finally {
        this.loading = false
      }
    },

    checkCurrentPassword(password: string) {
      if (!this.user) {
        this.error = 'pages.profile.errors.notLoggedIn'
        return false
      }
      const key = emailKey(this.user.email)
      const storedHash = this.credentials[key]
      if (!storedHash) {
        this.credentials[key] = mockHash(password)
        return true
      }
      if (storedHash !== mockHash(password)) {
        this.error = 'pages.profile.errors.currentPasswordWrong'
        return false
      }
      return true
    },
  },
})