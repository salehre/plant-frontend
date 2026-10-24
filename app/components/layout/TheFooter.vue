<script setup lang="ts">
const { t, locale, setLocale } = useI18n()

const email = ref('')

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/your-handle', icon: 'lucide:twitter' },
  { name: 'Instagram', href: 'https://instagram.com/your-handle', icon: 'lucide:instagram' },
  { name: 'Gmail', href: 'mailto:salehrezaeipoor123@gmail.com', icon: 'lucide:mail' },
]

const quickLinks = [
  { to: '/', label: 'nav.home' },
  { to: '/my-plants', label: 'components.theFooter.myPlants' },
  { to: '/plants', label: 'components.theFooter.encyclopedia' },
  { to: '/identify', label: 'components.theFooter.identify' },
  { to: '/care-calendar', label: 'components.theFooter.careCalendar' },
  { to: '/climate', label: 'components.theFooter.city' },
]

const supportLinks = [
  { to: '/support', label: 'support.nav' },
  { to: '/contact', label: 'components.theFooter.contact' },
  { to: '/tickets', label: 'components.theFooter.tickets' },
  { to: '/about', label: 'components.theFooter.about' },
  { to: '/terms', label: 'components.theFooter.terms' },
  { to: '/privacy', label: 'components.theFooter.privacy' },
]

function subscribeToNewsletter() {
  if (!email.value)
    return

  // این بخش را به API یا سرویس عضویت خبرنامه خودت متصل کن.
  // مثال: await $fetch('/api/newsletter', { method: 'POST', body: { email: email.value } })

  console.log('Newsletter email:', email.value)
  email.value = ''
}
</script>

<template>
  <footer class="relative overflow-hidden rounded-t-lg bg-primary-900 pb-24 text-white md:pb-0">
    <!-- تزئین برگ -->
    <img
      src="/images/plants/foot.webp"
      alt=""
      class="pointer-events-none absolute inset-0 size-full object-cover"
    >
    <div class="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-900/70 to-primary-800/60" />

    <div class="relative mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12 sm:pb-6">
      <div class="grid grid-cols-2 gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <!-- برند -->
        <div class="col-span-2 lg:col-span-1">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2.5"
          >
          <img
            src="/images/logo.png"
            :alt="$t('brand.name')"
            class="h-10 w-auto object-contain"
          >
            <span class="text-xl font-extrabold">{{ t('components.theFooter.brand') }}</span>
          </NuxtLink>
          <p class="mt-3 max-w-xs text-sm leading-7 text-white/70">
            {{ t('components.theFooter.tagline') }}
          </p>
          <div class="mt-5 flex gap-2.5">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              :target="social.href.startsWith('http') ? '_blank' : undefined"
              :rel="social.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              :aria-label="social.name"
              class="flex size-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <Icon
                :name="social.icon"
                class="size-[18px]"
              />
            </a>
          </div>
        </div>

        <!-- لینک‌های سریع -->
        <div>
          <p class="mb-4 text-sm font-bold">
            {{ t('components.theFooter.platform') }}
          </p>
          <ul class="flex flex-col gap-2.5 text-sm text-white/70">
            <li
              v-for="link in quickLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="transition-colors hover:text-white"
              >
                {{ t(link.label) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- پشتیبانی -->
        <div>
          <p class="mb-4 text-sm font-bold">
            {{ t('support.nav') }}
          </p>
          <ul class="flex flex-col gap-2.5 text-sm text-white/70">
            <li
              v-for="link in supportLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="transition-colors hover:text-white"
              >
                {{ t(link.label) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- خبرنامه و تماس -->
        <div class="col-span-2 lg:col-span-1">
          <p class="text-sm font-bold">
            {{ t('components.theFooter.newsletterTitle') }}
          </p>
          <p class="mt-2 text-sm leading-6 text-white/70">
            {{ t('components.theFooter.newsletterDescription') }}
          </p>

          <form
            class="mt-4 flex flex-row-reverse items-stretch gap-2 lg:flex-col"
            @submit.prevent="subscribeToNewsletter"
          >
            <label
              for="newsletter-email"
              class="sr-only"
            >
              {{ t('components.theFooter.newsletterEmail') }}
            </label>
            <input
              id="newsletter-email"
              v-model="email"
              dir="ltr"
              type="email"
              required
              autocomplete="email"
              placeholder="example@email.com"
              class="h-11 min-w-0 w-full flex-1 border-0 bg-white px-3 text-sm text-ink outline-none placeholder:text-ink-muted/70 focus:ring-2 focus:ring-primary-300 lg:flex-none"
            >
            <button
              type="submit"
              class="flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary-600 px-4 text-sm font-bold text-white transition-colors hover:bg-primary-500 lg:w-full"
            >
              <Icon
                name="lucide:send"
                class="size-4"
              />
              {{ t('components.theFooter.newsletterSubscribe') }}
            </button>
          </form>
        </div>
      </div>

      <!-- نوار پایین -->
      <div class="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-xs text-white/60">
        <p>
          {{ t('components.theFooter.poweredBy') }}
          <span class="text-white">صالح رضایی</span>
        </p>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            :aria-label="locale === 'fa' ? t('common.switchToEnglish') : t('common.switchToPersian')"
            @click="setLocale(locale === 'fa' ? 'en' : 'fa')"
          >
            <Icon
              name="lucide:globe"
              class="size-4"
            />
            {{ locale === 'fa' ? 'English' : 'فارسی' }}
          </button>
          <NuxtLink
            to="/contact"
            class="transition-colors hover:text-white"
          >
            {{ t('components.theFooter.contact') }}
          </NuxtLink>
          <NuxtLink
            to="/terms"
            class="transition-colors hover:text-white"
          >
            {{ t('components.theFooter.terms') }}
          </NuxtLink>
          <NuxtLink
            to="/privacy"
            class="transition-colors hover:text-white"
          >
            {{ t('components.theFooter.privacy') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>