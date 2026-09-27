<script setup lang="ts">
import type { CommunityUser } from '~/types/community.types'

const props = withDefaults(
    defineProps<{ user: CommunityUser, showFollow?: boolean }>(),
    { showFollow: false },
)

const communityStore = useCommunityStore()
const isOwnProfile = computed(() => props.user.id === communityStore.currentUser.id)
</script>

<template>
  <div class="glass-card p-4">
    <div class="flex items-center gap-3">
      <img
          :src="props.user.avatar"
          :alt="props.user.name"
          class="size-14 rounded-full object-cover"
      >
      <div class="min-w-0 flex-1">
        <p class="truncate font-bold text-ink">
          {{ props.user.name }}
        </p>
        <p class="line-clamp-1 text-xs text-ink-muted">
          {{ props.user.bio }}
        </p>
      </div>
      <AppButton
          v-if="props.showFollow && !isOwnProfile"
          :variant="communityStore.isFollowing(props.user.id) ? 'secondary' : 'primary'"
          size="sm"
          @click="communityStore.toggleFollow(props.user.id)"
      >
        {{ communityStore.isFollowing(props.user.id) ? 'دنبال می‌کنی' : 'دنبال کردن' }}
      </AppButton>
    </div>
    <div class="mt-4 grid grid-cols-3 gap-2 text-center">
      <div>
        <p class="font-bold text-ink">
          {{ toPersianDigits(props.user.plantsCount) }}
        </p>
        <p class="text-[11px] text-ink-muted">
          گیاه
        </p>
      </div>
      <div>
        <p class="font-bold text-ink">
          {{ toPersianDigits(props.user.followersCount) }}
        </p>
        <p class="text-[11px] text-ink-muted">
          دنبال‌کننده
        </p>
      </div>
      <div>
        <p class="font-bold text-ink">
          {{ toPersianDigits(props.user.followingCount) }}
        </p>
        <p class="text-[11px] text-ink-muted">
          دنبال‌شونده
        </p>
      </div>
    </div>
  </div>
</template>