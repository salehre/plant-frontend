<script setup lang="ts">
definePageMeta({ layout: 'default' })

const uiStore = useUiStore()
const historyStore = useHistoryStore()
const { t } = useI18n()

const items = computed(() => historyStore.sorted.map(fromHistoryEntry))

function removeHistoryEntry(id: string) {
  historyStore.remove(id)
  uiStore.showToast(t('pages.history.removed'), 'info')
}

function clearHistory() {
  historyStore.clear()
  uiStore.showToast(t('pages.history.cleared'), 'info')
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
    <NuxtLink
        to="/profile"
        class="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-primary-700"
    >
      <Icon
          name="lucide:arrow-right"
          class="size-4"
      />
      {{ t('pages.common.backToProfile') }}
    </NuxtLink>

    <div class="flex items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-ink">
          {{ t('pages.history.title') }}
          <span class="text-base font-normal text-ink-muted">({{ toPersianDigits(historyStore.count) }})</span>
        </h1>
        <p class="text-ink-muted">
          {{ t('pages.history.subtitle') }}
        </p>
      </div>
      <button
          v-if="historyStore.count"
          type="button"
          class="shrink-0 text-sm text-status-danger hover:underline"
          @click="clearHistory"
      >
        {{ t('pages.history.clearAll') }}
      </button>
    </div>

    <PlantResultList
        v-if="items.length"
        :items="items"
        variant="history"
        @remove="removeHistoryEntry($event.id)"
    />

    <div
        v-else
        class="rounded-lg border border-dashed border-ink/15 px-4 py-8 text-center text-sm text-ink-muted"
    >
      {{ t('pages.history.empty') }}
      <NuxtLink
          to="/identify"
          class="text-primary-700 hover:underline"
      >
        {{ t('pages.history.tryOne') }}
      </NuxtLink>
    </div>
  </div>
</template>