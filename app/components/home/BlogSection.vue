<script setup lang="ts">
const blogStore = useBlogStore()
const { t, locale } = useI18n()
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
  <section class="mx-auto w-full max-w-6xl">
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

    <div class="flex flex-col">
      <template v-if="pending">
        <div
          v-for="n in 3"
          :key="n"
          class="flex flex-col gap-4 border-b border-ink/10 py-6 first:pt-0 last:border-b-0 sm:flex-row sm:gap-8"
        >
          <div class="aspect-[2/1] w-full shrink-0 animate-pulse rounded-xl bg-ink/10 sm:w-72 lg:w-80" />
          <div class="flex flex-1 flex-col gap-3 sm:py-1">
            <AppSkeleton
              width="6rem"
              height="0.75rem"
            />
            <AppSkeleton height="1.5rem" />
            <AppSkeleton
              width="80%"
              height="1rem"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <BlogListItem
          v-for="post in blogStore.featured"
          :key="post.id"
          :post="post"
        />
      </template>
    </div>
  </section>
</template>