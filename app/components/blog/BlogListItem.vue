<script setup lang="ts">
import type { BlogPostSummary } from '~/types/blog.types'

const props = defineProps<{ post: BlogPostSummary }>()
const { t } = useI18n()
</script>

<template>
  <NuxtLink
    :to="`/blog/${props.post.slug}`"
    class="group flex flex-col gap-4 border-b border-ink/10 py-6 first:pt-0 last:border-b-0 sm:flex-row sm:gap-8"
  >
    <div class="aspect-[2/1] w-full shrink-0 overflow-hidden rounded-xl bg-primary-50 sm:w-72 lg:w-80">
      <img
        :src="props.post.image"
        :alt="props.post.title"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        decoding="async"
      >
    </div>

    <div class="flex min-w-0 flex-1 flex-col gap-2.5 sm:py-1">
      <span class="text-xs font-bold uppercase tracking-wider text-primary-600">
        {{ props.post.categoryLabel }}
      </span>

      <h3 class="line-clamp-2 text-lg font-bold leading-8 text-ink transition-colors group-hover:text-primary-600 sm:text-xl sm:leading-9">
        {{ props.post.title }}
      </h3>

      <p class="line-clamp-2 text-sm leading-7 text-ink-muted">
        {{ props.post.excerpt }}
      </p>

      <div class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-ink-muted">
        <span class="flex items-center gap-1.5">
          <Icon
            name="lucide:calendar"
            class="size-3.5"
          />
          {{ toJalaliDate(props.post.publishedAt) }}
        </span>
        <span class="flex items-center gap-1.5">
          <Icon
            name="lucide:clock"
            class="size-3.5"
          />
          {{ t('blog.readTime', { n: toPersianDigits(props.post.readMinutes) }) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>