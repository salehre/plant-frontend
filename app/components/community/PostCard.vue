<script setup lang="ts">
import type { Post } from '~/types/community.types'

const props = defineProps<{ post: Post }>()

const communityStore = useCommunityStore()
const showComments = ref(false)
const commentText = ref('')

const comments = computed(() => communityStore.comments[props.post.id] ?? [])

function toggleComments() {
  showComments.value = !showComments.value
  if (showComments.value) communityStore.loadComments(props.post.id)
}

function submitComment() {
  communityStore.addComment(props.post.id, commentText.value)
  commentText.value = ''
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diffMs / 3_600_000)
  if (hours < 1) return 'چند دقیقه پیش'
  if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`
  return `${toPersianDigits(Math.floor(hours / 24))} روز پیش`
}
</script>

<template>
  <article class="overflow-hidden rounded-lg bg-surface shadow-card">
    <div class="flex items-center gap-3 p-4">
      <NuxtLink :to="`/community/${props.post.author.id}`">
        <img
          :src="props.post.author.avatar"
          :alt="props.post.author.name"
          class="size-10 rounded-full object-cover"
        >
      </NuxtLink>
      <div class="min-w-0 flex-1">
        <NuxtLink
          :to="`/community/${props.post.author.id}`"
          class="truncate text-sm font-medium text-ink hover:underline"
        >
          {{ props.post.author.name }}
        </NuxtLink>
        <p class="text-xs text-ink-muted">
          {{ relativeTime(props.post.createdAt) }}
        </p>
      </div>
      <NuxtLink
        v-if="props.post.plantTag"
        :to="`/plants/${props.post.plantTag}`"
        class="rounded-full bg-primary-50 px-2.5 py-1 text-xs text-primary-700 hover:bg-primary-100"
      >
        <Icon
          name="lucide:leaf"
          class="inline size-3"
        />
      </NuxtLink>
    </div>

    <img
      :src="props.post.image"
      :alt="props.post.caption"
      class="aspect-square w-full object-cover"
      loading="lazy"
    >

    <div class="flex flex-col gap-3 p-4">
      <div class="flex items-center gap-4">
        <button
          class="flex items-center gap-1.5 text-sm"
          :class="props.post.likedByMe ? 'text-status-danger' : 'text-ink-muted'"
          @click="communityStore.toggleLike(props.post.id)"
        >
          <Icon
            :name="props.post.likedByMe ? 'lucide:heart' : 'lucide:heart'"
            class="size-5"
            :class="props.post.likedByMe ? 'fill-status-danger' : ''"
          />
          {{ toPersianDigits(props.post.likesCount) }}
        </button>
        <button
          class="flex items-center gap-1.5 text-sm text-ink-muted"
          @click="toggleComments"
        >
          <Icon
            name="lucide:message-circle"
            class="size-5"
          />
          {{ toPersianDigits(props.post.commentsCount) }}
        </button>
      </div>

      <p class="text-sm text-ink">
        <span class="font-medium">{{ props.post.author.name }}</span>
        {{ props.post.caption }}
      </p>

      <div
        v-if="showComments"
        class="flex flex-col gap-3 border-t border-ink/5 pt-3"
      >
        <div
          v-for="c in comments"
          :key="c.id"
          class="flex items-start gap-2"
        >
          <img
            :src="c.author.avatar"
            :alt="c.author.name"
            class="size-7 shrink-0 rounded-full object-cover"
          >
          <p class="text-sm text-ink">
            <span class="font-medium">{{ c.author.name }}</span>
            {{ c.content }}
          </p>
        </div>

        <form
          class="flex gap-2"
          @submit.prevent="submitComment"
        >
          <input
            v-model="commentText"
            type="text"
            placeholder="نظرت رو بنویس..."
            class="flex-1 rounded-md border border-ink/10 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
          <AppButton
            type="submit"
            variant="secondary"
            size="sm"
          >
            ارسال
          </AppButton>
        </form>
      </div>
    </div>
  </article>
</template>
