<script setup lang="ts">
import type { BlogPostSummary } from '~/types/blog.types'

const props = defineProps<{ post: BlogPostSummary }>()
const { t } = useI18n()
</script>

<template>
  <NuxtLink
    :to="`/blog/${props.post.slug}`"
    class="glass-card group flex flex-col overflow-hidden"
  >
    <div class="aspect-[16/10] overflow-hidden bg-primary-50">
      <img
        :src="props.post.image"
        :alt="props.post.title"
        class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      >
    </div>
    <div class="flex flex-1 flex-col gap-2 p-5">
      <div class="flex items-center justify-between gap-2 text-xs">
        <span class="rounded-lg bg-primary-50 px-2.5 py-1 font-medium text-primary-700">
          {{ props.post.categoryLabel }}
        </span>
        <span class="flex items-center gap-1 text-ink-muted">
          <Icon
            name="lucide:clock"
            class="size-3.5"
          />
          {{ t('blog.readTime', { n: toPersianDigits(props.post.readMinutes) }) }}
        </span>
      </div>
      <h3 class="line-clamp-2 font-bold leading-7 text-ink">
        {{ props.post.title }}
      </h3>
      <p class="line-clamp-2 text-sm leading-6 text-ink-muted">
        {{ props.post.excerpt }}
      </p>
      <span class="mt-auto pt-2 text-xs text-ink-muted">
        {{ toJalaliDate(props.post.publishedAt) }}
      </span>
    </div>
  </NuxtLink>
</template>