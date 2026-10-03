<script setup lang="ts">
definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

const communityStore = useCommunityStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-6">
    <div>
      <h1 class="text-2xl font-bold text-ink">
        {{ t('pages.community.feedTitle') }}
      </h1>
      <p class="text-ink-muted">
        {{ t('pages.community.feedSubtitle') }}
      </p>
    </div>

    <UserProfileCard :user="communityStore.currentUserFor(activeLocale)" />

    <div class="flex flex-col gap-6">
      <PostCard
        v-for="post in communityStore.localizedPosts(activeLocale)"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>
