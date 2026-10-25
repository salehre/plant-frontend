<template>
  <div
    class="plant-detail-page text-readable pb-10"
    role="status"
    :aria-label="$t('common.loading')"
    aria-busy="true"
  >
    <div class="relative -mx-4 -mt-4 h-[320px] overflow-hidden bg-ink/5 sm:-mx-6 md:hidden">
      <div class="absolute inset-0 motion-safe:animate-pulse bg-ink/10" />
      <div class="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/20 to-transparent" />
      <div class="absolute start-4 top-4 size-10 motion-safe:animate-pulse rounded-full bg-surface/80" />
      <div class="absolute end-4 top-4 flex items-center gap-2">
        <div v-for="index in 3" :key="index" class="size-10 motion-safe:animate-pulse rounded-full bg-surface/80" />
      </div>
    </div>

    <section class="glass-card hidden gap-5 p-4 md:flex sm:p-6">
      <div class="aspect-square w-full shrink-0 motion-safe:animate-pulse rounded-2xl bg-ink/10 sm:size-56 sm:w-56 lg:size-64 lg:w-64" />
      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 flex-1 flex-col gap-3">
            <div class="h-8 w-2/3 motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="h-4 w-1/3 motion-safe:animate-pulse rounded bg-ink/10" />
          </div>
          <div class="flex shrink-0 gap-2">
            <div v-for="index in 3" :key="index" class="size-9 motion-safe:animate-pulse rounded-xl bg-ink/10" />
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <div v-for="index in 3" :key="index" class="h-7 w-24 motion-safe:animate-pulse rounded-full bg-ink/10" />
        </div>

        <div class="h-3 w-2/5 motion-safe:animate-pulse rounded bg-ink/10" />

        <div class="grid grid-cols-2 gap-3">
          <div v-for="index in 2" :key="index" class="flex h-12 items-center gap-2.5 rounded-xl bg-primary-50/70 p-3">
            <div class="size-5 shrink-0 motion-safe:animate-pulse rounded-full bg-ink/10" />
            <div class="h-3 w-2/3 motion-safe:animate-pulse rounded bg-ink/10" />
          </div>
        </div>

        <div class="mt-auto h-10 w-36 motion-safe:animate-pulse rounded-xl bg-primary-700/20" />
      </div>
    </section>

    <div class="detail-sheet pt-6 max-md:relative max-md:-mx-4 max-md:-mt-7 max-md:rounded-t-[28px] max-md:bg-surface max-md:px-4 max-md:pt-5 sm:max-md:-mx-6 sm:max-md:px-6">
      <div class="md:hidden">
        <div class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 flex-1 flex-col gap-2">
            <div class="h-7 w-3/4 motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="h-4 w-1/2 motion-safe:animate-pulse rounded bg-ink/10" />
          </div>
          <div class="size-7 shrink-0 motion-safe:animate-pulse rounded-full bg-ink/10" />
        </div>

        <div class="mt-3 flex gap-2">
          <div v-for="index in 3" :key="index" class="h-7 w-20 motion-safe:animate-pulse rounded-full bg-ink/10" />
        </div>

        <div class="-mx-4 mt-4 flex gap-6 overflow-hidden border-b border-ink/10 px-4 sm:-mx-6 sm:px-6">
          <div v-for="index in 4" :key="index" class="h-8 w-16 shrink-0 motion-safe:animate-pulse rounded-t bg-ink/10" />
        </div>

        <div class="flex flex-col gap-6 pt-4">
          <section class="glass-card mobile-card space-y-3 p-5">
            <div v-for="index in 4" :key="index" class="h-3 motion-safe:animate-pulse rounded bg-ink/10" :class="index === 4 ? 'w-3/5' : 'w-full'" />
          </section>

          <div class="glass-card mobile-card divide-y divide-ink/10 px-5 py-2">
            <div v-for="index in 4" :key="index" class="flex items-center gap-3 py-3">
              <div class="size-5 shrink-0 motion-safe:animate-pulse rounded-full bg-ink/10" />
              <div class="h-3 w-20 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="ms-auto h-3 w-24 motion-safe:animate-pulse rounded bg-ink/10" />
            </div>
          </div>

          <section class="glass-card mobile-card space-y-4 p-5">
            <div class="h-5 w-36 motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="space-y-2">
              <div class="h-3 w-full motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="h-3 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="h-3 w-2/3 motion-safe:animate-pulse rounded bg-ink/10" />
            </div>
          </section>

          <section class="glass-card mobile-card space-y-4 p-5">
            <div class="h-5 w-32 motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="flex flex-wrap gap-3">
              <div v-for="index in 3" :key="index" class="h-8 w-24 motion-safe:animate-pulse rounded-lg bg-ink/10" />
            </div>
          </section>

          <section class="glass-card mobile-card p-5">
            <div class="mb-4 h-5 w-28 motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div v-for="index in 4" :key="index" class="overflow-hidden rounded-lg border border-ink/10">
                <div class="h-[140px] motion-safe:animate-pulse bg-ink/10" />
                <div class="h-8 motion-safe:animate-pulse bg-ink/5" />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div class="hidden md:block">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div v-for="index in 4" :key="index" class="glass-card flex min-h-20 flex-col items-center justify-center gap-2 px-3 py-4">
            <div class="h-4 w-2/3 motion-safe:animate-pulse rounded bg-ink/10" />
            <div class="h-3 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-6 md:mt-8 lg:grid-cols-12">
          <div class="flex flex-col gap-6 lg:col-span-7">
            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-40 motion-safe:animate-pulse rounded bg-ink/10" />
              <div v-for="index in 6" :key="index" class="grid grid-cols-[2fr_3fr] gap-3 border-b border-ink/10 pb-3 last:border-0">
                <div class="h-4 motion-safe:animate-pulse rounded bg-ink/10" />
                <div class="h-4 motion-safe:animate-pulse rounded bg-ink/10" />
              </div>
            </section>

            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-44 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="grid grid-cols-2 gap-3">
                <div v-for="index in 8" :key="index" class="space-y-3 rounded-md border border-ink/10 bg-bg p-3">
                  <div class="flex items-center gap-2 border-b border-dashed border-ink/15 pb-2">
                    <div class="size-7 shrink-0 motion-safe:animate-pulse rounded-full bg-ink/10" />
                    <div class="h-3 w-2/3 motion-safe:animate-pulse rounded bg-ink/10" />
                  </div>
                  <div class="h-3 w-full motion-safe:animate-pulse rounded bg-ink/10" />
                  <div class="h-3 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
                </div>
              </div>
            </section>

            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-32 motion-safe:animate-pulse rounded bg-ink/10" />
              <div v-for="index in 3" :key="index" class="space-y-3 rounded-md border border-ink/10 bg-bg p-3">
                <div class="flex items-center gap-3 border-b border-dashed border-ink/15 pb-3">
                  <div class="size-9 shrink-0 motion-safe:animate-pulse rounded-full bg-ink/10" />
                  <div class="h-4 w-1/3 motion-safe:animate-pulse rounded bg-ink/10" />
                </div>
                <div class="h-3 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
                <div class="h-3 w-3/5 motion-safe:animate-pulse rounded bg-ink/10" />
              </div>
            </section>

            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-40 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="h-16 motion-safe:animate-pulse rounded-md bg-ink/10" />
              <div class="space-y-3">
                <div v-for="index in 3" :key="index" class="flex justify-between border-b border-ink/10 pb-3">
                  <div class="h-3 w-1/3 motion-safe:animate-pulse rounded bg-ink/10" />
                  <div class="h-3 w-1/4 motion-safe:animate-pulse rounded bg-ink/10" />
                </div>
              </div>
            </section>
          </div>

          <div class="flex flex-col gap-6 lg:col-span-5">
            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-40 motion-safe:animate-pulse rounded bg-ink/10" />
              <div v-for="index in 5" :key="index" class="flex items-center gap-3 border-b border-ink/10 pb-3 last:border-0">
                <div class="size-8 shrink-0 motion-safe:animate-pulse rounded-full bg-ink/10" />
                <div class="flex flex-1 flex-col gap-2">
                  <div class="h-3 w-1/3 motion-safe:animate-pulse rounded bg-ink/10" />
                  <div class="h-3 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
                </div>
              </div>
            </section>

            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-32 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="space-y-2">
                <div class="h-3 w-full motion-safe:animate-pulse rounded bg-ink/10" />
                <div class="h-3 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
                <div class="h-3 w-2/3 motion-safe:animate-pulse rounded bg-ink/10" />
              </div>
            </section>

            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-24 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="h-16 motion-safe:animate-pulse rounded-md bg-ink/10" />
            </section>

            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-40 motion-safe:animate-pulse rounded bg-ink/10" />
              <div v-for="index in 2" :key="index" class="flex gap-3 rounded-md border border-ink/10 p-3">
                <div class="size-14 shrink-0 motion-safe:animate-pulse rounded-md bg-ink/10" />
                <div class="flex flex-1 flex-col justify-center gap-2">
                  <div class="h-3 w-3/4 motion-safe:animate-pulse rounded bg-ink/10" />
                  <div class="h-3 w-full motion-safe:animate-pulse rounded bg-ink/10" />
                </div>
              </div>
            </section>

            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-32 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="h-16 motion-safe:animate-pulse rounded-md bg-ink/10" />
            </section>

            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-36 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="flex flex-wrap gap-3">
                <div v-for="index in 4" :key="index" class="h-8 w-24 motion-safe:animate-pulse rounded-lg bg-ink/10" />
              </div>
            </section>

            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-44 motion-safe:animate-pulse rounded bg-ink/10" />
              <div v-for="index in 4" :key="index" class="h-4 w-4/5 motion-safe:animate-pulse rounded bg-ink/10" />
            </section>

            <section class="glass-card space-y-4 p-5 sm:p-6">
              <div class="h-5 w-28 motion-safe:animate-pulse rounded bg-ink/10" />
              <div class="h-12 w-full motion-safe:animate-pulse rounded bg-ink/10" />
            </section>
          </div>
        </div>

        <section class="glass-card mt-7 p-5">
          <div class="mb-4 h-5 w-32 motion-safe:animate-pulse rounded bg-ink/10" />
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            <div v-for="index in 8" :key="index" class="overflow-hidden rounded-lg border border-ink/10">
              <div class="h-[180px] motion-safe:animate-pulse bg-ink/10" />
              <div class="h-8 motion-safe:animate-pulse bg-ink/5" />
            </div>
          </div>
        </section>
      </div>
    </div>

    <div
      class="fixed inset-x-0 bottom-0 z-40 border-t border-ink/5 bg-surface/90 px-4 pt-3 backdrop-blur md:hidden"
      style="padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));"
    >
      <div class="h-12 w-full motion-safe:animate-pulse rounded-xl bg-primary-700/20" />
    </div>
  </div>
</template>
