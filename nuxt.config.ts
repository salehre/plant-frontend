// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

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

  // یک ورودی روی خودِ components/ کافیه: اسکن Nuxt پیش‌فرض recursive هست،
  // پس هر زیرپوشه‌ی جدید (فعلی یا آینده) خودکار شناسایی می‌شه و دیگه لازم نیست
  // به‌ازای هر پوشه‌ی تازه، دستی یک ورودی این‌جا اضافه بشه.
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

  // فلگ سراسری برای سوییچ بین Mock Data و API واقعی (Phase 3 به بعد)
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

  // typeCheck عمداً false می‌مونه: تست شد و روشن‌کردنش باعث شکست npm run build می‌شه،
  // چون همون باگ ذاتی و غیرقابل‌رفع در @nuxt/image (که در README هم مستنده) با
  // vite-plugin-checker گلوگاه build رو هم می‌شکنه، نه فقط dev رو.
  // به‌جاش npm run typecheck رو به‌صورت جدا (مثلاً در CI یا pre-commit) اجرا کن؛
  // خروجیش رو دستی بخون و فقط دو خطای شناخته‌شده‌ی @nuxt/image رو نادیده بگیر -
  // دقیقاً همین‌طوری بود که باگ defineProps()() در DiseaseResultCard.vue پیدا و رفع شد.
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
      name: 'پلنت',
      short_name: 'پلنت',
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
