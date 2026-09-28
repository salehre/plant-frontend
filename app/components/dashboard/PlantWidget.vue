<script setup lang="ts">
import type { UserPlant } from '~/types/user.types'

const props = defineProps<{ userPlant: UserPlant }>()

const statusClass: Record<string, string> = {
  healthy: 'bg-primary-500',
  needs_attention: 'bg-status-warning',
  sick: 'bg-status-danger',
}
</script>

<template>
  <NuxtLink
      :to="`/my-plants/${props.userPlant.id}`"
      class="glass-card flex items-center gap-3 p-3"
  >
    <div class="relative">
      <img
          :src="props.userPlant.photo"
          :alt="props.userPlant.nickname"
          class="size-14 rounded-md object-cover"
      >
      <span
          class="absolute -bottom-0.5 -end-0.5 size-3 rounded-full ring-2 ring-surface"
          :class="statusClass[props.userPlant.healthStatus]"
      />
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate font-medium text-ink">{{ props.userPlant.nickname }}</p>
      <p class="truncate text-xs text-ink-muted">{{ props.userPlant.location }} · {{ healthLabel(props.userPlant.healthStatus) }}</p>
    </div>
    <Icon
        name="lucide:chevron-left"
        class="size-4 shrink-0 text-ink-muted"
    />
  </NuxtLink>
</template>