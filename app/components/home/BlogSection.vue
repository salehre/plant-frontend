<script setup lang="ts">
import { en, fa } from '~/i18n/blogMessages'

const blogStore = useBlogStore()
const { t } = useI18n({ messages: { en, fa }, useScope: 'local' })
const { locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

// بدون await تا رندر بقیه‌ی صفحه‌ی اصلی منتظر بلاگ نمونه؛ با تغییر زبان دوباره دریافت می‌شه
const { status } = useAsyncData(
  'home-blog-featured',
  () => blogStore.fetchFeatured(activeLocale.value, t('blog.errorList')).then(() => true),
  { watch: [activeLocale] },
)
const pending = computed(() => status.value === 'pending' && !blogStore.featured.length)
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-14">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-ink">
          {{ t('blog.title') }}
        </h2>
        <p class="mt-1 text-sm text-ink-muted">
          {{ t('blog.subtitle') }}
        </p>
      </div>
      <NuxtLink
        to="/blog"
        class="shrink-0 text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        {{ t('blog.seeAll') }}
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <template v-if="pending">
        <AppSkeleton
          v-for="n in 3"
          :key="n"
          height="18rem"
          rounded="rounded-lg"
        />
      </template>
      <template v-else>
        <BlogCard
          v-for="post in blogStore.featured"
          :key="post.id"
          :post="post"
        />
      </template>
    </div>
  </section>
</template>