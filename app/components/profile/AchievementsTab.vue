<script setup lang="ts">
const { t } = useI18n()
const { achievements } = useProfileStats()

const unlockedCount = computed(() => achievements.value.filter(a => a.unlocked).length)
</script>

<template>
  <section class="glass-card p-5 sm:p-6">
    <header class="mb-5">
      <h2 class="text-lg font-bold text-ink">
        {{ t('pages.profile.achievements.title') }}
      </h2>
      <p class="text-xs text-ink-muted">
        {{ t('pages.profile.achievements.unlockedCount', { n: unlockedCount, total: achievements.length }) }}
      </p>
    </header>

    <div class="grid gap-3 sm:grid-cols-2">
      <div
        v-for="item in achievements"
        :key="item.key"
        class="flex items-start gap-4 rounded-2xl border p-4 transition-colors"
        :class="item.unlocked ? 'border-primary-300/60 bg-primary-50/50' : 'border-ink/10 bg-surface'"
      >
        <span
          class="flex size-11 shrink-0 items-center justify-center rounded-xl"
          :class="item.unlocked ? 'bg-primary-600 text-white' : 'bg-ink/5 text-ink-muted'"
        >
          <Icon
            :name="item.icon"
            class="size-5"
          />
        </span>

        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <p class="truncate text-sm font-bold text-ink">
              {{ t(`pages.profile.achievements.items.${item.key}.title`) }}
            </p>
            <span
              class="shrink-0 text-xs font-bold"
              :class="item.unlocked ? 'text-primary-700' : 'text-ink-muted'"
            >
              {{ item.unlocked
                ? t('pages.profile.achievements.unlocked')
                : t('pages.profile.achievements.progress', { current: item.current, target: item.target }) }}
            </span>
          </div>
          <p class="mt-0.5 text-xs leading-5 text-ink-muted">
            {{ t(`pages.profile.achievements.items.${item.key}.description`) }}
          </p>
          <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/5">
            <div
              class="h-full rounded-full bg-primary-500 transition-[width] duration-500"
              :style="{ width: `${(item.current / item.target) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
