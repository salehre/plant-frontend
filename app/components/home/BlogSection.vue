<script setup lang="ts">
const blogStore = useBlogStore()
const { t } = useI18n()
</script>

<template>
  <section class="mx-auto w-full max-w-6xl">
    <div class="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <div class="flex items-start gap-3">
        <span class="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
          <Icon name="lucide:book-open-text" class="size-5" />
        </span>
        <div>
          <h2 class="text-xl font-bold text-ink sm:text-2xl">
          {{ t('blog.title') }}
          </h2>
          <p class="mt-1 text-sm text-ink-muted">
            {{ t('blog.subtitle') }}
          </p>
        </div>
      </div>
      <NuxtLink
        to="/blog"
        class="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary-600/15 bg-white px-3 py-2 text-sm font-semibold text-primary-700 transition-colors hover:border-primary-600/30 hover:bg-primary-50"
      >
        {{ t('blog.seeAll') }}
        <Icon name="lucide:arrow-left" class="size-4 rtl:rotate-180" />
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      <BlogCard
        v-for="post in blogStore.featured"
        :key="post.id"
        :post="post"
      />
    </div>
  </section>
</template>