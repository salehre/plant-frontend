<script setup lang="ts">
const tips = [
  { icon: 'lucide:image', label: 'identify.tips.clear' },
  { icon: 'lucide:sun', label: 'identify.tips.light' },
  { icon: 'lucide:maximize', label: 'identify.tips.frame' },
  { icon: 'lucide:focus', label: 'identify.tips.blur' },
]
</script>

<template>
  <div class="glass-card p-5">
    <h2 class="mb-4 text-sm font-bold text-ink">
      {{ $t('identify.tipsTitle') }}
    </h2>
    <ul class="flex flex-col gap-4">
      <li
        v-for="tip in tips"
        :key="tip.label"
        class="flex items-center gap-3"
      >
        <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
          <Icon
            :name="tip.icon"
            class="size-5"
          />
        </span>
        <span class="text-sm leading-6 text-ink-muted">{{ $t(tip.label) }}</span>
      </li>
    </ul>
  </div>
</template>
