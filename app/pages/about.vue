<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

useHead(() => ({ title: t('about.pageTitle') }))

const features = [
  { key: 'identify', icon: 'lucide:camera', to: '/identify' },
  { key: 'finder', icon: 'lucide:sprout', to: '/' },
  { key: 'care', icon: 'lucide:calendar-check', to: '/care-calendar' },
  { key: 'community', icon: 'lucide:users', to: '/community' },
]

const values = [
  { key: 'simple', icon: 'lucide:lightbulb' },
  { key: 'honest', icon: 'lucide:shield-check' },
  { key: 'care', icon: 'lucide:heart' },
]
</script>

<template>
  <div>
    <!-- معرفی -->
    <section class="mx-auto max-w-4xl px-4 py-12 text-center sm:py-20">
      <span class="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
        <Icon
          name="lucide:leaf"
          class="size-7"
        />
      </span>
      <h1 class="text-3xl font-bold text-ink sm:text-4xl">
        {{ t('about.title') }}
      </h1>
      <p class="mx-auto mt-4 max-w-2xl text-base leading-8 text-ink-muted">
        {{ t('about.intro') }}
      </p>
    </section>

    <!-- داستان و ماموریت -->
    <section class="mx-auto max-w-5xl px-4">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="glass-card p-6 sm:p-8">
          <h2 class="mb-3 text-lg font-bold text-ink">
            {{ t('about.storyTitle') }}
          </h2>
          <p class="text-sm leading-8 text-ink-muted">
            {{ t('about.storyBody') }}
          </p>
        </div>
        <div class="glass-card p-6 sm:p-8">
          <h2 class="mb-3 text-lg font-bold text-ink">
            {{ t('about.missionTitle') }}
          </h2>
          <p class="text-sm leading-8 text-ink-muted">
            {{ t('about.missionBody') }}
          </p>
        </div>
      </div>
    </section>

    <!-- چی ارائه می‌دیم -->
    <section class="mx-auto max-w-6xl px-4 pt-14">
      <h2 class="mb-6 text-xl font-bold text-ink">
        {{ t('about.featuresTitle') }}
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="f in features"
          :key="f.key"
          :to="f.to"
          class="glass-card flex flex-col gap-3 p-5 transition-transform duration-200 hover:-translate-y-1"
        >
          <span class="flex size-11 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
            <Icon
              :name="f.icon"
              class="size-5"
            />
          </span>
          <h3 class="font-medium text-ink">
            {{ t(`about.features.${f.key}.title`) }}
          </h3>
          <p class="text-sm leading-7 text-ink-muted">
            {{ t(`about.features.${f.key}.description`) }}
          </p>
        </NuxtLink>
      </div>
    </section>

    <!-- ارزش‌ها -->
    <section class="mt-14 bg-primary-50/50 py-14">
      <div class="mx-auto max-w-6xl px-4">
        <h2 class="mb-6 text-xl font-bold text-ink">
          {{ t('about.valuesTitle') }}
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            v-for="v in values"
            :key="v.key"
            class="rounded-lg border border-ink/5 bg-surface p-5"
          >
            <Icon
              :name="v.icon"
              class="mb-3 size-6 text-primary-600"
            />
            <h3 class="mb-1 font-medium text-ink">
              {{ t(`about.values.${v.key}.title`) }}
            </h3>
            <p class="text-sm leading-7 text-ink-muted">
              {{ t(`about.values.${v.key}.description`) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- دعوت به اقدام -->
    <section class="mx-auto max-w-3xl px-4 py-14 text-center">
      <h2 class="text-xl font-bold text-ink">
        {{ t('about.ctaTitle') }}
      </h2>
      <p class="mt-2 text-sm leading-7 text-ink-muted">
        {{ t('about.ctaText') }}
      </p>
      <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
        <NuxtLink to="/identify">
          <AppButton variant="primary">
            {{ t('about.ctaIdentify') }}
          </AppButton>
        </NuxtLink>
        <NuxtLink to="/contact">
          <AppButton variant="secondary">
            {{ t('about.ctaContact') }}
          </AppButton>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
