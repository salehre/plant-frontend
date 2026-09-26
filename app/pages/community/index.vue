<script setup lang="ts">
definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

const communityStore = useCommunityStore()
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-6">
    <div>
      <h1 class="text-2xl font-bold text-ink">
        فید گیاه‌دوستان
      </h1>
      <p class="text-ink-muted">
        تجربه‌ی نگهداری گیاه دیگران را ببین و تجربه‌ات را به اشتراک بگذار.
      </p>
    </div>

    <UserProfileCard :user="communityStore.currentUser" />

    <div class="flex flex-col gap-6">
      <PostCard
        v-for="post in communityStore.posts"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>
