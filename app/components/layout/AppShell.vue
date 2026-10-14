<script setup lang="ts">
import MobileBottomNav from '~/components/layout/MobileBottomNav.vue'
import TheHeader from '~/components/layout/TheHeader.vue'
import TheSidebar from '~/components/layout/TheSidebar.vue'

const footerLinks = [
  { to: '/about', label: 'components.theFooter.about' },
  { to: '/blog', label: 'pages.blog.title' },
  { to: '/contact', label: 'components.theFooter.contact' },
  { to: '/tickets', label: 'components.theFooter.tickets' },
  { to: '/terms', label: 'components.theFooter.terms' },
  { to: '/privacy', label: 'components.theFooter.privacy' },
]
</script>

<template>
  <div class="min-h-screen bg-bg">
    <TheSidebar />

    <!-- md:ps-64 = عرض سایدبار (در RTL سایدبار سمت راسته و در LTR سمت چپ) -->
    <div class="flex min-h-screen min-w-0 flex-col md:ps-64">
      <TheHeader />
      <main class="mx-auto w-full max-w-6xl flex-1 px-4 pt-4 sm:px-6">
        <slot />
      </main>

      <!-- لینک‌های فوتر (قبلاً فقط توی TheFooter صفحه‌ی اصلی بودن) -->
      <footer class="mx-auto w-full max-w-6xl px-4 pb-28 pt-10 sm:px-6 md:pb-8">
        <nav class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-ink/5 pt-5 text-xs text-ink-muted">
          <NuxtLink
            v-for="link in footerLinks"
            :key="link.to"
            :to="link.to"
            class="transition-colors hover:text-primary-700"
          >
            {{ $t(link.label) }}
          </NuxtLink>
        </nav>
      </footer>
    </div>

    <MobileBottomNav />
  </div>
</template>
