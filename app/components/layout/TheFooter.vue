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

<style scoped>
/* ═══════════════════════════════════════════
   ۱. ورود کل فوتر (Fade + Slide)
   ═══════════════════════════════════════════ */
footer {
  animation: footerReveal 800ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 80ms;
}

@keyframes footerReveal {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.985);
    filter: blur(7px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* ═══════════════════════════════════════════
   ۲. تصویر تزئینی برگ پشت‌زمینه
   ═══════════════════════════════════════════ */
img[src="/images/plants/foot.webp"] {
  animation: leafBreathe 14s ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes leafBreathe {
  0% {
    transform: scale(1.05) translateY(0);
    opacity: 0.7;
  }
  50% {
    opacity: 0.85;
  }
  100% {
    transform: scale(1.15) translateY(-2%);
    opacity: 0.6;
  }
}

/* ═══════════════════════════════════════════
   ۳. ورود آبشاری ستون‌ها (Staggered Columns)
   ═══════════════════════════════════════════ */
.grid > div:nth-child(1) {
  animation: colUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 120ms;
}
.grid > div:nth-child(2) {
  animation: colUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 200ms;
}
.grid > div:nth-child(3) {
  animation: colUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 280ms;
}
.grid > div:nth-child(4) {
  animation: colUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 360ms;
}

@keyframes colUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══════════════════════════════════════════
   ۴. آیکون‌های شبکه اجتماعی (Spring Bounce)
   ═══════════════════════════════════════════ */
.flex.gap-2\.5 > a {
  position: relative;
  overflow: hidden;
  transition:
    transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1),
    background-color 250ms ease,
    color 250ms ease,
    box-shadow 300ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .flex.gap-2\.5 > a:hover {
    transform: translateY(-4px) scale(1.12);
    background: rgba(255, 255, 255, 0.25);
    box-shadow:
      0 0 0 2px rgba(255, 255, 255, 0.2),
      0 12px 24px rgba(0, 0, 0, 0.2);
  }

  .flex.gap-2\.5 > a:active {
    transform: translateY(-1px) scale(0.95);
    transition-duration: 80ms;
  }

  /* انیمیشن چرخش آیکون */
  .flex.gap-2\.5 > a:hover :deep(.size-\[18px\]) {
    animation: iconSpinSpring 450ms ease;
  }
}

@keyframes iconSpinSpring {
  0%   { transform: rotate(0deg) scale(1); }
  30%  { transform: rotate(-20deg) scale(1.15); }
  60%  { transform: rotate(15deg) scale(0.9); }
  100% { transform: rotate(0deg) scale(1); }
}

/* ═══════════════════════════════════════════
   ۵. لینک‌های ستون‌ها (Underline Growth)
   ═══════════════════════════════════════════ */
ul.flex.flex-col > li > a {
  position: relative;
  display: inline-block;
  text-decoration: none;
  transition: color 200ms ease;
}

ul.flex.flex-col > li > a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  inset-inline-start: 0;
  height: 1.5px;
  width: 0%;
  background: linear-gradient(90deg, #86efac, #fff);
  border-radius: 1px;
  transition: width 350ms cubic-bezier(0.16, 1, 0.3, 1);
}

:dir(rtl) ul.flex.flex-col > li > a::after {
  inset-inline-start: auto;
  inset-inline-end: 0;
}

@media (hover: hover) and (pointer: fine) {
  ul.flex.flex-col > li > a:hover {
    color: #fff;
  }

  ul.flex.flex-col > li > a:hover::after {
    width: 105%;
  }
}

/* ═══════════════════════════════════════════
   ۶. فرم خبرنامه (Focus Glowing Input + Shine Button)
   ═══════════════════════════════════════════ */
form[method="post"],
form[@submit.prevent] {
  position: relative;
}

form input[type="email"] {
  transition:
    box-shadow 300ms ease,
    border-color 300ms ease,
    background-color 300ms ease;
}

form input[type="email"]:focus {
  box-shadow:
    0 0 0 3px rgba(134, 239, 172, 0.25),
    inset 0 2px 4px rgba(0, 0, 0, 0.05);
  border-color: rgba(134, 239, 172, 0.5);
  background: rgba(255, 255, 255, 0.98);
}

/* درخشش دکمه ارسال */
button[type="submit"] {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transition:
    background-color 250ms ease,
    transform 200ms ease,
    box-shadow 250ms ease;
}

button[type="submit"]::after {
  content: '';
  position: absolute;
  inset-inline-start: -100%;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 70%
  );
  animation: buttonShine 2.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes buttonShine {
  0%, 100% {
    inset-inline-start: -100%;
  }
  30% {
    inset-inline-start: 110%;
  }
  60% {
    inset-inline-start: 110%;
  }
}

@media (hover: hover) and (pointer: fine) {
  button[type="submit"]:hover {
    transform: translateY(-3px);
    box-shadow:
      0 12px 28px rgba(21, 128, 61, 0.3),
      0 0 0 2px rgba(134, 239, 172, 0.3);
    background-color: #059669;
  }

  button[type="submit"]:active {
    transform: translateY(-1px);
  }
}

/* ═══════════════════════════════════════════
   ۷. نوار پایین (Bottom Bar)
   ═══════════════════════════════════════════ */
footer .border-t {
  animation: bottomFadeIn 600ms ease-out 700ms both;
}

@keyframes bottomFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══════════════════════════════════════════
   ۸. دکمه زبان در پایین (Hover Glow)
   ═══════════════════════════════════════════ */
button[aria-label*="English"],
button[aria-label*="فارسی"] {
  transition:
    transform 250ms ease,
    color 200ms ease,
    background-color 200ms ease;
}

@media (hover: hover) and (pointer: fine) {
  button[aria-label*="English"]:hover,
  button[aria-label*="فارسی"]:hover {
    transform: translateY(-2px);
    background-color: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
}

/* ═══════════════════════════════════════════
   ۹. دسترس‌پذیری
   ═══════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  footer,
  img[src="/images/plants/foot.webp"],
  .grid > div,
  .flex.gap-2\.5 > a,
  ul.flex.flex-col > li > a,
  button[type="submit"],
  button[type="submit"]::after,
  footer .border-t,
  button[aria-label*="English"],
  button[aria-label*="فارسی"] {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }

  button[type="submit"]::after {
    display: none !important;
  }
}
</style>