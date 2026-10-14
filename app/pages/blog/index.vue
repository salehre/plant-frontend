<script setup lang="ts">
definePageMeta({ layout: 'default' })

const blogStore = useBlogStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

useHead(() => ({ title: t('blog.pageTitle') }))

blogStore.category = 'all'

await Promise.all([
  blogStore.fetchCategories(activeLocale.value),
  useAsyncData(
    `blog-list-${activeLocale.value}`,
    () => blogStore.fetchList(activeLocale.value, t('blog.errorList')).then(() => true),
  ),
])

watch(activeLocale, (value) => {
  blogStore.fetchCategories(value)
  blogStore.fetchList(value, t('blog.errorList'))
})
watch(() => blogStore.category, () => blogStore.fetchList(activeLocale.value, t('blog.errorList')))

const chips = computed(() => [
  { key: 'all', label: t('blog.allCategories') },
  ...blogStore.categories,
])
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-ink">
        {{ t('blog.pageTitle') }}
      </h1>
      <p class="text-ink-muted">
        {{ t('blog.pageSubtitle') }}
      </p>
    </div>

    <div class="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
      <button
        v-for="chip in chips"
        :key="chip.key"
        type="button"
        class="shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="blogStore.category === chip.key
          ? 'bg-primary-600 text-white'
          : 'bg-primary-50 text-primary-700 hover:bg-primary-100'"
        @click="blogStore.category = chip.key"
      >
        {{ chip.label }}
      </button>
    </div>

    <div
      v-if="blogStore.loading"
      class="flex flex-col"
    >
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
    </div>

    <div
      v-else-if="blogStore.list.length"
      class="flex flex-col"
    >
      <BlogListItem
        v-for="post in blogStore.list"
        :key="post.id"
        :post="post"
      />
    </div>

    <p
      v-else
      class="py-16 text-center text-ink-muted"
    >
      {{ t('blog.empty') }}
    </p>
  </div>
</template>