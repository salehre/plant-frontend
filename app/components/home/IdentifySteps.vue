<script setup lang="ts">
const { t, locale } = useI18n()

const steps = [
  { key: 'upload', icon: 'lucide:camera' },
  { key: 'analyze', icon: 'lucide:scan-line' },
  { key: 'result', icon: 'lucide:sparkles' },
  { key: 'details', icon: 'lucide:book-open' },
] as const

function formatNumber(value: number) {
  return new Intl.NumberFormat(locale.value, { useGrouping: false }).format(value)
}
</script>

<template>
  <section class="rounded-[19px] bg-gradient-to-br from-primary-900 to-primary-800 px-4 py-10 text-white sm:px-8 sm:py-14">
    <!-- عنوان -->
    <div class="mx-auto max-w-xl text-center">
      <h2 class="text-2xl font-extrabold sm:text-3xl">
        {{ t('home.steps.title') }}
      </h2>
      <p class="mt-3 text-sm leading-7 text-white/70 sm:text-base">
        {{ t('home.steps.description') }}
      </p>
    </div>

    <!-- مراحل -->
    <ol class="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <li
        v-for="(step, index) in steps"
        :key="step.key"
        class="relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
      >
        <div class="flex items-center justify-between">
          <span class="flex size-12 items-center justify-center rounded-xl bg-primary-500/25 text-primary-200">
            <Icon
              :name="step.icon"
              class="size-6"
            />
          </span>
          <span class="text-4xl font-extrabold leading-none text-white/10">
            {{ formatNumber(index + 1) }}
          </span>
        </div>

        <div>
          <h3 class="text-base font-bold">
            {{ t(`home.steps.${step.key}.title`) }}
          </h3>
          <p class="mt-2 text-sm leading-7 text-white/70">
            {{ t(`home.steps.${step.key}.description`) }}
          </p>
        </div>

        <!-- فلش بین مراحل (فقط دسکتاپ) -->
        <span
          v-if="index < steps.length - 1"
          class="absolute top-1/2 z-10 hidden size-7 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 text-white -end-[22px] lg:flex"
          aria-hidden="true"
        >
          <Icon
            name="lucide:arrow-right"
            class="size-4 rtl:-scale-x-100"
          />
        </span>
      </li>
    </ol>

    <!-- دکمه -->
    <div class="mt-10 text-center">
      <NuxtLink
        to="/identify"
        class="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-400"
      >
        <Icon
          name="lucide:scan-line"
          class="size-4"
        />
        {{ t('home.identifyCta') }}
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.steps-scan-line {
  stroke: none;
}
</style>