<script setup lang="ts">
const { localeProperties } = useI18n()
</script>

<template>
  <aside
    :dir="localeProperties.dir"
    class="fixed inset-y-0 start-0 z-40 hidden w-64 flex-col gap-6 rounded-e-3xl border-e border-ink/5 bg-surface px-4 py-5 md:flex"
    aria-hidden="true"
  >
    <div class="flex items-center gap-2.5 px-2">
      <div class="size-10 shrink-0 motion-safe:animate-pulse rounded-lg bg-ink/10" />
      <div class="h-5 w-28 motion-safe:animate-pulse rounded bg-ink/10" />
    </div>

    <nav class="flex min-h-0 flex-1 flex-col gap-1">
      <div
        v-for="index in 7"
        :key="index"
        class="flex h-10 items-center gap-3 rounded-xl px-3 py-2.5"
      >
        <div class="size-5 shrink-0 motion-safe:animate-pulse rounded bg-ink/10" />
        <div
          class="h-3 motion-safe:animate-pulse rounded bg-ink/10"
          :class="index % 3 === 0 ? 'w-24' : 'w-32'"
        />
      </div>

      <div class="my-2 border-t border-ink/5" />

      <div
        v-for="index in 4"
        :key="`secondary-${index}`"
        class="flex h-9 items-center gap-3 rounded-xl px-3 py-2"
      >
        <div class="size-4 shrink-0 motion-safe:animate-pulse rounded bg-ink/10" />
        <div class="h-3 w-24 motion-safe:animate-pulse rounded bg-ink/10" />
      </div>
    </nav>

    <div class="flex min-h-32 flex-col justify-end gap-3 overflow-hidden rounded-2xl bg-primary-900 p-4">
      <div class="h-4 w-4/5 motion-safe:animate-pulse rounded bg-white/20" />
      <div class="h-3 w-full motion-safe:animate-pulse rounded bg-white/15" />
      <div class="h-8 w-28 motion-safe:animate-pulse rounded-lg bg-white/20" />
    </div>
  </aside>
</template>
