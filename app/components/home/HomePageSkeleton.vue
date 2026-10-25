<script setup lang="ts">
const { localeProperties } = useI18n()
</script>

<template>
  <div
    :dir="localeProperties.dir"
    class="flex flex-col gap-10"
    aria-hidden="true"
  >
    <section class="relative isolate flex min-h-[240px] flex-col justify-center gap-5 overflow-hidden rounded-[19px] bg-primary-900 px-4 py-8 sm:min-h-[340px] sm:px-6 sm:py-12">
      <div class="absolute inset-0 motion-safe:animate-pulse bg-white/5" />
      <div class="relative z-10 h-8 w-3/4 max-w-md motion-safe:animate-pulse rounded bg-white/20 sm:h-12" />
      <div class="relative z-10 space-y-2">
        <div class="h-3 w-full max-w-md motion-safe:animate-pulse rounded bg-white/15 sm:h-4" />
        <div class="h-3 w-2/3 max-w-md motion-safe:animate-pulse rounded bg-white/15 sm:h-4" />
      </div>
      <div class="relative z-10 flex gap-3">
        <div class="h-10 w-32 motion-safe:animate-pulse rounded-xl bg-white/20" />
        <div class="hidden h-10 w-28 motion-safe:animate-pulse rounded-xl border border-white/20 bg-white/10 sm:block" />
      </div>
    </section>

    <section class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      <div
        v-for="index in 5"
        :key="index"
        class="glass-card flex min-h-[116px] flex-col items-center justify-center gap-3 p-4 last:col-span-2 sm:last:col-span-1"
      >
        <div class="size-12 motion-safe:animate-pulse rounded-full bg-ink/10" />
        <div class="flex w-full flex-col items-center gap-2">
          <div class="h-3 w-3/5 motion-safe:animate-pulse rounded bg-ink/10" />
          <div class="h-2.5 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
        </div>
      </div>
    </section>

    <section class="glass-card p-4 sm:p-5">
      <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div class="min-w-0">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div class="flex flex-1 flex-col gap-2">
              <div class="h-5 w-40 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="h-4 w-56 max-w-full motion-safe:animate-pulse rounded bg-ink/10" />
            </div>
            <div class="h-4 w-14 motion-safe:animate-pulse rounded bg-ink/10" />
          </div>

          <div class="-mx-4 flex gap-4 overflow-hidden px-4 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0">
            <div
              v-for="index in 4"
              :key="index"
              class="flex basis-[68%] shrink-0 flex-col rounded-2xl border border-ink/5 bg-surface p-3 shadow-card sm:basis-[calc((100%-22.4px)/2.4)] lg:basis-[calc((100%-32px)/3)] lg:rounded-3xl lg:p-3.5"
            >
              <div class="relative aspect-[5/4] overflow-hidden rounded-xl bg-primary-50 lg:aspect-[4/3.4] lg:rounded-2xl">
                <div class="absolute inset-0 motion-safe:animate-pulse bg-ink/10" />
                <div class="absolute end-2 top-2 size-8 motion-safe:animate-pulse rounded-full bg-ink/10" />
              </div>
              <div class="flex flex-col gap-2 px-1.5 pb-1.5 pt-3.5 lg:px-2 lg:pb-2 lg:pt-4">
                <div class="h-4 w-3/4 motion-safe:animate-pulse rounded bg-ink/10 lg:h-5" />
                <div class="h-3 w-1/2 motion-safe:animate-pulse rounded bg-ink/10 lg:h-4" />
              </div>
            </div>
          </div>
        </div>

        <div class="relative hidden min-h-[260px] flex-col justify-center gap-4 overflow-hidden rounded-3xl bg-ink/5 p-8 md:flex">
          <div class="h-8 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
          <div class="space-y-2">
            <div class="h-3 w-full motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="h-3 w-3/4 motion-safe:animate-pulse rounded bg-ink/10" />
          </div>
          <div class="h-10 w-36 motion-safe:animate-pulse rounded-full bg-ink/10" />
        </div>
      </div>
    </section>

    <section class="relative flex min-h-[400px] flex-col justify-center gap-6 overflow-hidden rounded-2xl bg-primary-900 p-6 sm:min-h-[460px] sm:p-10">
      <div class="absolute inset-0 motion-safe:animate-pulse bg-white/5" />
      <div class="relative flex flex-col gap-6">
        <div class="h-5 w-48 motion-safe:animate-pulse rounded bg-white/20" />
        <div class="h-3 w-full max-w-xl motion-safe:animate-pulse rounded bg-white/15" />
        <div class="h-3 w-2/3 max-w-xl motion-safe:animate-pulse rounded bg-white/15" />
        <div class="mt-2 h-2 w-full max-w-2xl motion-safe:animate-pulse rounded-full bg-white/20" />
        <div class="h-6 w-56 motion-safe:animate-pulse rounded bg-white/20" />
        <div class="grid gap-3 sm:grid-cols-2">
          <div v-for="index in 4" :key="index" class="h-14 motion-safe:animate-pulse rounded-xl border border-white/20 bg-white/10" />
        </div>
        <div class="flex items-center justify-between">
          <div class="h-8 w-20 motion-safe:animate-pulse rounded bg-white/10" />
          <div class="h-8 w-24 motion-safe:animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </section>

    <section class="mx-auto w-full max-w-3xl">
      <div class="mb-6 flex flex-col items-center gap-2">
        <div class="h-6 w-44 motion-safe:animate-pulse rounded bg-ink/10" />
        <div class="h-4 w-64 max-w-full motion-safe:animate-pulse rounded bg-ink/10" />
      </div>
      <div class="flex flex-col gap-3">
        <div v-for="index in 6" :key="index" class="glass-card overflow-hidden">
          <div class="flex h-[58px] items-center justify-between gap-3 px-5 py-4">
            <div class="h-4 w-3/4 motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="size-5 shrink-0 motion-safe:animate-pulse rounded-full bg-ink/10" />
          </div>
          <div v-if="index === 1" class="space-y-2 px-5 pb-4">
            <div class="h-3 w-full motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="h-3 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="mb-4 h-5 w-40 motion-safe:animate-pulse rounded bg-ink/10" />
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div v-for="index in 4" :key="index" class="glass-card flex flex-col gap-3 p-2.5">
          <div class="h-28 w-full motion-safe:animate-pulse rounded-xl bg-ink/10" />
          <div class="mb-1 h-4 w-3/4 motion-safe:animate-pulse rounded bg-ink/10 px-1.5" />
        </div>
      </div>
    </section>

    <section class="mx-auto w-full max-w-6xl">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div class="flex flex-col gap-2">
          <div class="h-6 w-40 motion-safe:animate-pulse rounded bg-ink/10" />
          <div class="h-4 w-56 motion-safe:animate-pulse rounded bg-ink/10" />
        </div>
        <div class="h-4 w-14 motion-safe:animate-pulse rounded bg-ink/10" />
      </div>
      <div class="flex flex-col">
        <div v-for="index in 3" :key="index" class="flex flex-col gap-4 border-b border-ink/10 py-6 first:pt-0 last:border-b-0 sm:flex-row sm:gap-8">
          <div class="aspect-[2/1] w-full shrink-0 motion-safe:animate-pulse rounded-xl bg-ink/10 sm:w-72 lg:w-80" />
          <div class="flex min-w-0 flex-1 flex-col gap-3 sm:py-1">
            <div class="h-3 w-24 motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="space-y-2">
              <div class="h-5 w-full motion-safe:animate-pulse rounded bg-ink/10 sm:h-6" />
              <div class="h-5 w-2/3 motion-safe:animate-pulse rounded bg-ink/10 sm:h-6" />
            </div>
            <div class="space-y-2">
              <div class="h-3 w-full motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="h-3 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
            </div>
            <div class="mt-auto flex gap-4 pt-1">
              <div class="h-3 w-20 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="h-3 w-16 motion-safe:animate-pulse rounded bg-ink/10" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-[19px] bg-primary-900 px-4 py-10 sm:px-8 sm:py-14">
      <div class="mx-auto flex max-w-xl flex-col items-center gap-3">
        <div class="h-8 w-56 max-w-full motion-safe:animate-pulse rounded bg-white/20" />
        <div class="h-3 w-full motion-safe:animate-pulse rounded bg-white/15" />
        <div class="h-3 w-3/4 motion-safe:animate-pulse rounded bg-white/15" />
      </div>
      <div class="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="index in 4" :key="index" class="flex min-h-48 flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div class="flex items-center justify-between">
            <div class="size-12 motion-safe:animate-pulse rounded-xl bg-white/15" />
            <div class="h-10 w-8 motion-safe:animate-pulse rounded bg-white/10" />
          </div>
          <div class="mt-auto flex flex-col gap-3">
            <div class="h-4 w-3/4 motion-safe:animate-pulse rounded bg-white/20" />
            <div class="h-3 w-full motion-safe:animate-pulse rounded bg-white/10" />
            <div class="h-3 w-4/5 motion-safe:animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </div>
      <div class="mt-10 flex justify-center">
        <div class="h-11 w-36 motion-safe:animate-pulse rounded-xl bg-white/20" />
      </div>
    </section>
  </div>
</template>
