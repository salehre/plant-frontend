<script setup lang="ts">
definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

const route = useRoute()
const communityStore = useCommunityStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

const userId = route.params.id as string
const user = computed(() => communityStore.getUser(userId, activeLocale.value))
const posts = computed(() => communityStore.postsByUser(userId, activeLocale.value))
</script>

<template>
  <div
    v-if="user"
    class="mx-auto flex max-w-2xl flex-col gap-6"
  >
    <NuxtLink
      to="/community"
      class="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-primary-700"
    >
      <Icon
        name="lucide:arrow-right"
        class="size-4"
      />
      {{ t('pages.community.backToFeed') }}
    </NuxtLink>

    <UserProfileCard
      :user="user"
      show-follow
    />

    <div>
      <h2 class="mb-3 font-bold text-ink">
        {{ t('pages.community.userPosts', { name: user.name }) }}
      </h2>
      <div
        v-if="posts.length"
        class="flex flex-col gap-6"
      >
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </div>
      <p
        v-else
        class="text-sm text-ink-muted"
      >
        {{ t('pages.community.noPosts') }}
      </p>
    </div>
  </div>

  <div
    v-else
    class="py-16 text-center text-ink-muted"
  >
    {{ t('pages.community.userNotFound') }}
  </div>
</template>
