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
  <footer class="relative overflow-hidden bg-primary-900 pb-24 text-white md:pb-0">
    <!-- تزئین برگ -->
    <img
      src="/images/plants/botanical-1.webp"
      alt=""
      class="pointer-events-none absolute inset-0 size-full object-cover opacity-15 mix-blend-luminosity"
    >
    <div class="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-900/95 to-primary-800/90" />

    <div class="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div class="grid grid-cols-2 gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <!-- برند -->
        <div class="col-span-2 lg:col-span-1">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2.5"
          >
            <span class="flex size-10 items-center justify-center rounded-xl bg-white/10">
              <Icon
                name="lucide:leaf"
                class="size-5"
              />
            </span>
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
            عضویت در انجمن گیاه‌دوستان
          </p>
          <p class="mt-2 text-sm leading-6 text-white/70">
            برای دریافت آموزش‌ها، نکات مراقبت از گیاهان و اخبار انجمن ایمیل خود را وارد کنید.
          </p>

          <form
            class="mt-4 flex flex-col gap-2"
            @submit.prevent="subscribeToNewsletter"
          >
            <label
              for="newsletter-email"
              class="sr-only"
            >
              ایمیل شما
            </label>
            <input
              id="newsletter-email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="example@email.com"
              class="h-11 w-full border-0 bg-white px-3 text-sm text-ink outline-none placeholder:text-ink-muted/70 focus:ring-2 focus:ring-primary-300"
            >
            <button
              type="submit"
              class="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-600 text-sm font-bold text-white transition-colors hover:bg-primary-500"
            >
              <Icon
                name="lucide:send"
                class="size-4"
              />
              عضویت در انجمن
            </button>
          </form>

          <div class="mt-4 space-y-2 text-sm text-white/70">
            <a
              href="tel:+989121234567"
              dir="ltr"
              class="flex w-fit items-center gap-2 transition-colors hover:text-white"
            >
              <Icon
                name="lucide:phone"
                class="size-4"
              />
              <span>0930 037 7838</span>
            </a>
            <a
              href="mailto:salehrezaeipoor123@gmail.com"
              class="flex w-fit items-center gap-2 transition-colors hover:text-white"
            >
              <Icon
                name="lucide:mail"
                class="size-4"
              />
              <span>salehrezaeipoor123@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      <!-- نوار پایین -->
      <div class="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-xs text-white/60">
        <p>
          {{ t('components.theFooter.poweredBy') }}
          <span class="text-white">Saleh Rezaei</span>
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
