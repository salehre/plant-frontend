<script setup lang="ts">
import { ref } from 'vue'

const { t } = useI18n()

const email = ref('')

const socialLinks = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/your-handle',
    icon: 'lucide:twitter',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/your-handle',
    icon: 'lucide:instagram',
  },
  {
    name: 'Gmail',
    href: 'mailto:yourname@gmail.com',
    icon: 'lucide:mail',
  },
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
  <footer class="mt-16 border-t border-ink/5 bg-surface">
    <div class="mx-auto max-w-6xl px-4 py-10">
      <div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
        <!-- Brand and social media -->
        <div class="col-span-2 sm:col-span-1">
          <span class="flex items-center gap-2 text-lg font-bold text-primary-700">
            <Icon
              name="lucide:leaf"
              class="size-5"
            />
            {{ t('components.theFooter.brand') }}
          </span>

          <p class="mt-2 text-sm text-ink-muted">
            {{ t('components.theFooter.tagline') }}
          </p>

          <!-- Social cards -->
          <div class="mt-5 flex flex-wrap gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              :target="social.href.startsWith('http') ? '_blank' : undefined"
              :rel="social.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              :aria-label="social.name"
              class="group flex size-12 items-center justify-center rounded-xl border border-ink/10 bg-surface p-3 text-ink-muted shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary-700/30 hover:bg-primary-50 hover:text-primary-700 hover:shadow-md"
            >
              <Icon
                :name="social.icon"
                class="size-5 transition-transform duration-200 group-hover:scale-110"
              />
            </a>
          </div>
        </div>

        <!-- Platform links -->
        <div>
          <p class="mb-3 text-sm font-medium text-ink">
            {{ t('components.theFooter.platform') }}
          </p>

          <ul class="flex flex-col gap-2 text-sm text-ink-muted">
            <li>
              <NuxtLink to="/identify" class="transition-colors hover:text-primary-700">
                {{ t('components.theFooter.identify') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/plants" class="transition-colors hover:text-primary-700">
                {{ t('components.theFooter.encyclopedia') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compare" class="transition-colors hover:text-primary-700">
                {{ t('components.theFooter.compare') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/climate" class="transition-colors hover:text-primary-700">
                {{ t('components.theFooter.city') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/community" class="transition-colors hover:text-primary-700">
                {{ t('components.theFooter.community') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/dashboard" class="transition-colors hover:text-primary-700">
                {{ t('components.theFooter.dashboard') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="transition-colors hover:text-primary-700">
                {{ t('components.theFooter.contact') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Account links -->
        <div>
          <p class="mb-3 text-sm font-medium text-ink">
            {{ t('components.theFooter.account') }}
          </p>

          <ul class="flex flex-col gap-2 text-sm text-ink-muted">
            <li>
              <NuxtLink to="/my-plants" class="transition-colors hover:text-primary-700">
                {{ t('components.theFooter.myPlants') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/care-calendar" class="transition-colors hover:text-primary-700">
                {{ t('components.theFooter.careCalendar') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/profile" class="transition-colors hover:text-primary-700">
                {{ t('components.theFooter.profile') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Newsletter and contact -->
        <div class="col-span-2 sm:col-span-1">
          <p class="text-sm font-medium text-ink">
            عضویت در انجمن گیاه‌دوستان
          </p>

          <p class="mt-2 text-sm leading-6 text-ink-muted">
            برای دریافت آموزش‌ها، نکات مراقبت از گیاهان و اخبار انجمن ایمیل خود را وارد کنید.
          </p>

          <form
            class="mt-4 flex gap-2"
            @submit.prevent="subscribeToNewsletter"
          >
            <label for="newsletter-email" class="sr-only">
              ایمیل شما
            </label>

            <input
              id="newsletter-email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="example@email.com"
              class="min-w-0 flex-1 rounded-xl border border-ink/10 bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus:border-primary-600 focus:ring-4 focus:ring-primary-700/10"
            >

            <button
              type="submit"
              aria-label="عضویت در انجمن"
              class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-700 text-white shadow-sm transition-all hover:bg-primary-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary-700/20"
            >
              <Icon name="lucide:send" class="size-4" />
            </button>
          </form>

          <!-- Contact details -->
          <div class="mt-5 space-y-2 border-t border-ink/5 pt-4 text-sm">
            <a
              href="tel:+989121234567"
              dir="ltr"
              class="flex w-fit items-center gap-2 text-ink-muted transition-colors hover:text-primary-700"
            >
              <Icon name="lucide:phone" class="size-4" />
              <span>+98 912 123 4567</span>
            </a>

            <a
              href="mailto:yourname@gmail.com"
              class="flex w-fit items-center gap-2 text-ink-muted transition-colors hover:text-primary-700"
            >
              <Icon name="lucide:mail" class="size-4" />
              <span>yourname@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-8 border-t border-ink/5 pt-6 text-center text-xs text-ink-muted">
        <nav class="mb-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <NuxtLink to="/about" class="transition-colors hover:text-primary-700">
            {{ t('components.theFooter.about') }}
          </NuxtLink>
          <NuxtLink to="/terms" class="transition-colors hover:text-primary-700">
            {{ t('components.theFooter.terms') }}
          </NuxtLink>
          <NuxtLink to="/privacy" class="transition-colors hover:text-primary-700">
            {{ t('components.theFooter.privacy') }}
          </NuxtLink>
        </nav>
        {{ t('components.theFooter.poweredBy') }}
        <span class="text-primary-700">Saleh Rezaei</span>
      </div>
    </div>
  </footer>
</template>
