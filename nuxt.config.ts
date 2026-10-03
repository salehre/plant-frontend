// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
  ],

  components: [
    { path: '~/components', pathPrefix: false },
  ],
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      useMockApi: true,
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
    },
  },

  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-07-15',

  typescript: {
    strict: true,
    typeCheck: false,
  },

  i18n: {
    locales: [
      { code: 'fa', iso: 'fa-IR', dir: 'rtl', name: 'فارسی', file: 'fa.json' },
      { code: 'en', iso: 'en-US', dir: 'ltr', name: 'English', file: 'en.json' },
    ],
    // نسبت به i18n/ (restructureDir پیش‌فرض ماژول) => فایل‌ها از i18n/locales/*.json خونده می‌شن
    langDir: 'locales',
    defaultLocale: 'fa',
    strategy: 'no_prefix',
  },

  image: {
    quality: 80,
    format: ['webp'],
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Golban',
      short_name: 'Golban',
      description: 'اپلیکیشن نگهداری و شناسایی گیاهان',
      lang: 'fa',
      dir: 'rtl',
      theme_color: '#ffffff',
      icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    devOptions: {
      enabled: true,
    },
  },
})
