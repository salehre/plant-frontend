<script setup lang="ts">
const { t, locale } = useI18n()

const steps = [
  { key: 'upload', icon: 'lucide:image-up' },
  { key: 'analyze', icon: 'lucide:sparkles' },
  { key: 'result', icon: 'lucide:book-open-check' },
]

function formatNumber(value: number) {
  return new Intl.NumberFormat(locale.value, { useGrouping: false }).format(value)
}
</script>

<template>
  <section class="relative overflow-hidden rounded-[19px] bg-primary-50/50 px-4 py-8 sm:px-8 sm:py-10">
    <!-- برگ تزئینی -->
    <Icon
      name="lucide:leaf"
      class="pointer-events-none absolute -bottom-6 -end-6 size-40 -rotate-12 text-primary-200/60"
      aria-hidden="true"
    />

    <div class="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
      <!-- عنوان -->
      <div class="lg:w-72 lg:shrink-0">
        <span class="text-xs font-medium text-ink-muted">
          {{ t('home.steps.badge', { count: formatNumber(steps.length) }) }}
        </span>
        <h2 class="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
          {{ t('home.steps.title') }}
        </h2>
        <p class="mt-3 text-sm leading-7 text-ink-muted">
          {{ t('home.steps.description') }}
        </p>
      </div>

      <!-- کارت‌ها -->
      <div class="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-0">
        <template
          v-for="(step, index) in steps"
          :key="step.key"
        >
          <article class="glass-card relative flex min-w-0 flex-1 flex-col items-center gap-3 p-5 text-center">
            <span class="absolute start-3 top-3 flex size-7 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
              {{ formatNumber(index + 1) }}
            </span>
            <span class="flex size-20 items-center justify-center rounded-full bg-primary-50 text-primary-700 ring-4 ring-white/70">
              <Icon
                :name="step.icon"
                class="size-9"
              />
            </span>
            <h3 class="font-bold text-ink">
              {{ t(`home.steps.${step.key}.title`) }}
            </h3>
            <p class="text-xs leading-6 text-ink-muted">
              {{ t(`home.steps.${step.key}.description`) }}
            </p>
          </article>

          <div
            v-if="index < steps.length - 1"
            class="hidden shrink-0 items-center px-2 text-ink-muted sm:flex"
            aria-hidden="true"
          >
            <Icon
              name="lucide:arrow-right"
              class="size-5 rtl:-scale-x-100"
            />
          </div>
        </template>
      </div>
    </div>
  </section>
</template>