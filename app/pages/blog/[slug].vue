<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const blogStore = useBlogStore()
const uiStore = useUiStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

const slug = route.params.slug as string

async function load(lang: 'fa' | 'en') {
  await Promise.all([
    blogStore.fetchBySlug(slug, lang, t('errors.blogPost')),
    blogStore.fetchRelated(slug, lang),
  ])
  return true
}

// اگه از مقاله‌ی قبلی اومده باشیم، تا لود شدن این یکی نباید محتوای قبلی دیده بشه
if (blogStore.current?.slug !== slug) blogStore.current = null
await useAsyncData(`blog-post-${slug}-${activeLocale.value}`, () => load(activeLocale.value))
watch(activeLocale, lang => load(lang))

const post = computed(() => blogStore.current)

useHead(() => ({ title: post.value?.title }))

async function sharePost() {
  if (!post.value) return
  const shareData = { title: post.value.title, text: post.value.excerpt, url: window.location.href }
  try {
    if (navigator.share) {
      await navigator.share(shareData)
    }
    else {
      await navigator.clipboard.writeText(window.location.href)
      uiStore.showToast(t('pages.blog.linkCopied'), 'success')
    }
  }
  catch {
    // کاربر اشتراک‌گذاری رو لغو کرده - نیازی به توست خطا نیست
  }
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10">
    <div class="mx-auto max-w-3xl">
      <NuxtLink
        to="/blog"
        class="mb-6 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-primary-700"
      >
        <Icon
          name="lucide:arrow-right"
          class="size-4 ltr:rotate-180"
        />
        {{ t('pages.blog.backToBlog') }}
      </NuxtLink>

      <div
        v-if="blogStore.loading && !post"
        class="flex flex-col gap-4"
      >
        <AppSkeleton height="2rem" width="70%" />
        <AppSkeleton height="1rem" width="40%" />
        <AppSkeleton height="18rem" rounded="rounded-lg" />
      </div>

      <article
        v-else-if="post"
        class="flex flex-col gap-6"
      >
        <header class="flex flex-col gap-4">
          <span class="w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
            {{ post.categoryLabel }}
          </span>
          <h1 class="text-2xl font-extrabold leading-10 text-ink sm:text-3xl">
            {{ post.title }}
          </h1>
          <p class="leading-8 text-ink-muted">
            {{ post.excerpt }}
          </p>

          <div class="flex flex-wrap items-center justify-between gap-3 border-y border-ink/5 py-3">
            <div class="flex items-center gap-3">
              <img
                :src="post.author.avatar"
                :alt="post.author.name"
                class="size-10 rounded-full object-cover"
              >
              <div class="text-sm">
                <div class="font-medium text-ink">
                  {{ t('pages.blog.by') }} {{ post.author.name }}
                </div>
                <div class="text-xs text-ink-muted">
                  {{ toJalaliDate(post.publishedAt) }} · {{ t('pages.blog.readTime', { n: toPersianDigits(post.readMinutes) }) }}
                </div>
              </div>
            </div>
            <button
              type="button"
              class="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary-50 px-3 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-100"
              @click="sharePost"
            >
              <Icon
                name="lucide:share-2"
                class="size-4"
              />
              {{ t('pages.blog.share') }}
            </button>
          </div>
        </header>

        <img
          :src="post.image"
          :alt="post.title"
          class="aspect-[16/9] w-full rounded-2xl object-cover"
        >

        <div class="flex flex-col gap-4">
          <template
            v-for="(block, i) in post.content"
            :key="i"
          >
            <h2
              v-if="block.type === 'heading'"
              class="mt-4 text-xl font-bold text-ink"
            >
              {{ block.text }}
            </h2>
            <p
              v-else-if="block.type === 'paragraph'"
              class="leading-8 text-ink"
            >
              {{ block.text }}
            </p>
            <ul
              v-else-if="block.type === 'list'"
              class="flex list-disc flex-col gap-2 ps-6 leading-8 text-ink marker:text-primary-500"
            >
              <li
                v-for="item in block.items"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
            <aside
              v-else-if="block.type === 'tip'"
              class="flex gap-3 rounded-lg border border-primary-200 bg-primary-50 p-4"
            >
              <Icon
                name="lucide:lightbulb"
                class="mt-1 size-5 shrink-0 text-primary-600"
              />
              <p class="leading-8 text-ink">
                <span class="font-bold text-primary-700">{{ t('pages.blog.tip') }}:</span>
                {{ block.text }}
              </p>
            </aside>
          </template>
        </div>

        <div
          v-if="post.tags.length"
          class="flex flex-wrap gap-2 border-t border-ink/5 pt-4"
        >
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-muted"
          >
            # {{ tag }}
          </span>
        </div>
      </article>

      <div
        v-else
        class="py-16 text-center"
      >
        <h1 class="mb-2 text-xl font-bold text-ink">
          {{ t('pages.blog.notFoundTitle') }}
        </h1>
        <p class="text-ink-muted">
          {{ t('pages.blog.notFoundText') }}
        </p>
      </div>

    </div>

    <section
      v-if="post && blogStore.related.length"
      class="mt-14"
    >
      <h2 class="mb-4 text-xl font-bold text-ink">
        {{ t('pages.blog.related') }}
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BlogCard
          v-for="item in blogStore.related"
          :key="item.id"
          :post="item"
        />
      </div>
    </section>
  </div>
</template>