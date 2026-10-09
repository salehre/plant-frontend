<script setup lang="ts">
import type { MockLocale } from '~/services/mock/mock-locale'

const { t, locale } = useI18n()
const store = usePlantFinderStore()

const activeLocale = computed<MockLocale>(() => (locale.value === 'fa' ? 'fa' : 'en'))
const question = computed(() => store.currentQuestion)

const percentFormatter = computed(() => new Intl.NumberFormat(locale.value, { useGrouping: false }))
const formatScore = (score: number) =>
  t('components.confidenceScore.percentage', { value: percentFormatter.value.format(score) })

const difficultyKeys: Record<string, string> = {
  easy: 'components.common.difficultyEasy',
  medium: 'components.common.difficultyMedium',
  hard: 'components.common.difficultyHard',
}

function submit() {
  return store.submit(activeLocale.value, t('home.plantFinder.error'))
}

function onNext() {
  if (store.isLastStep) return submit()
  store.next()
}

// اگه کاربر وسط دیدن نتایج زبان رو عوض کرد، پیشنهادها (اسم گیاه‌ها) با زبان جدید دوباره گرفته می‌شن
watch(activeLocale, () => {
  if (store.done) submit()
})
</script>

<template>
  <section
    class="glass-card p-5 sm:p-8"
    aria-labelledby="plant-finder-title"
  >
    <header class="mb-6 flex items-start gap-3">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Icon
          name="lucide:sparkles"
          class="size-5"
        />
      </span>
      <div>
        <h2
          id="plant-finder-title"
          class="text-xl font-bold text-ink"
        >
          {{ t('home.plantFinder.title') }}
        </h2>
        <p class="mt-1 text-sm leading-6 text-ink-muted">
          {{ t('home.plantFinder.subtitle') }}
        </p>
      </div>
    </header>

    <!-- در حال دریافت پیشنهاد (AI داره فکر می‌کنه) -->
    <div
      v-if="store.loading"
      class="flex min-h-64 flex-col items-center justify-center gap-4 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <span class="relative flex size-16 items-center justify-center">
        <span class="absolute inset-0 animate-ping rounded-full bg-primary-100 motion-reduce:animate-none" />
        <span class="relative flex size-16 items-center justify-center rounded-full bg-primary-50">
          <Icon
            name="svg-spinners:180-ring"
            class="size-8 text-primary-600"
          />
        </span>
      </span>
      <p class="text-sm text-ink-muted">
        {{ t('home.plantFinder.loading') }}
      </p>
    </div>

    <!-- نتایج -->
    <div v-else-if="store.done">
      <h3 class="text-lg font-bold text-ink">
        {{ t('home.plantFinder.resultsTitle') }}
      </h3>
      <p class="mb-5 mt-1 text-sm text-ink-muted">
        {{ t('home.plantFinder.resultsSubtitle') }}
      </p>

      <p
        v-if="!store.suggestions.length"
        class="rounded-lg bg-primary-50/60 p-4 text-sm text-ink-muted"
      >
        {{ t('home.plantFinder.noResults') }}
      </p>

      <ul
        v-else
        class="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <li
          v-for="item in store.suggestions"
          :key="item.plant.id"
        >
          <NuxtLink
            :to="`/plants/${item.plant.slug}`"
            class="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface transition-shadow hover:shadow-card-hover"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-primary-50">
              <img
                :src="item.plant.image"
                :alt="item.plant.name"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              >
              <span class="absolute end-2 top-2 rounded-full bg-primary-600 px-2.5 py-1 text-xs font-medium text-white">
                {{ t('home.plantFinder.match') }} {{ formatScore(item.matchScore) }}
              </span>
            </div>

            <div class="flex flex-1 flex-col gap-2 p-4">
              <div>
                <h4 class="font-bold text-ink">
                  {{ item.plant.name }}
                </h4>
                <p class="text-xs italic text-ink-muted">
                  {{ item.plant.scientificName }}
                </p>
              </div>

              <!-- اگه AI توضیح متنی داده همونو نشون می‌دیم، وگرنه چیپ‌های «چی با چی جور شد» -->
              <p
                v-if="item.reason"
                class="text-sm leading-6 text-ink-muted"
              >
                {{ item.reason }}
              </p>
              <ul
                v-else
                class="flex flex-wrap gap-1.5"
              >
                <li
                  v-for="id in item.matchedOn"
                  :key="id"
                  class="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700"
                >
                  <Icon
                    name="lucide:check"
                    class="size-3"
                  />
                  {{ t(`home.plantFinder.matched.${id}`) }}
                </li>
              </ul>

              <span class="mt-auto pt-2 text-xs text-ink-muted">
                {{ t(difficultyKeys[item.plant.difficulty] ?? '') }}
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>

      <div class="mt-6 flex justify-end">
        <AppButton
          variant="secondary"
          @click="store.reset()"
        >
          <Icon
            name="lucide:rotate-ccw"
            class="size-4"
          />
          {{ t('home.plantFinder.restart') }}
        </AppButton>
      </div>
    </div>

    <!-- سؤال‌ها -->
    <div v-else>
      <div class="mb-5">
        <div class="mb-2 flex items-center justify-between text-xs text-ink-muted">
          <span>
            {{ t('home.plantFinder.stepOf', {
              current: percentFormatter.format(store.step + 1),
              total: percentFormatter.format(store.totalSteps),
            }) }}
          </span>
        </div>
        <div
          class="h-1.5 overflow-hidden rounded-full bg-primary-100"
          role="progressbar"
          :aria-valuemin="1"
          :aria-valuemax="store.totalSteps"
          :aria-valuenow="store.step + 1"
        >
          <div
            class="h-full rounded-full bg-primary-500 transition-all duration-300"
            :style="{ width: `${store.progress}%` }"
          />
        </div>
      </div>

      <Transition
        name="finder-step"
        mode="out-in"
      >
        <div
          :key="question.id"
          role="group"
          :aria-labelledby="`finder-q-${question.id}`"
        >
          <h3
            :id="`finder-q-${question.id}`"
            class="mb-4 text-base font-semibold text-ink sm:text-lg"
          >
            {{ t(`home.plantFinder.questions.${question.id}.title`) }}
          </h3>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              v-for="option in question.options"
              :key="option.value"
              type="button"
              :aria-pressed="store.currentAnswer === option.value"
              class="flex items-center gap-3 rounded-xl border p-4 text-start text-sm transition-colors"
              :class="store.currentAnswer === option.value
                ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500'
                : 'border-ink/10 bg-surface text-ink hover:border-primary-300 hover:bg-primary-50/60'"
              @click="store.select(question.id, option.value)"
            >
              <Icon
                :name="option.icon"
                class="size-5 shrink-0"
              />
              <span>{{ t(`home.plantFinder.questions.${question.id}.options.${option.value}`) }}</span>
            </button>
          </div>
        </div>
      </Transition>

      <p
        v-if="store.error"
        class="mt-4 rounded-lg bg-status-danger/10 p-3 text-sm text-status-danger"
        role="alert"
      >
        {{ store.error }}
      </p>

      <div class="mt-6 flex items-center justify-between gap-3">
        <AppButton
          variant="ghost"
          :disabled="store.isFirstStep"
          @click="store.back()"
        >
          <Icon
            name="lucide:arrow-right"
            class="size-4 ltr:rotate-180"
          />
          {{ t('home.plantFinder.back') }}
        </AppButton>

        <AppButton
          variant="primary"
          :disabled="!store.currentAnswer"
          :loading="store.loading"
          @click="onNext"
        >
          {{ store.isLastStep
            ? (store.error ? t('home.plantFinder.retry') : t('home.plantFinder.submit'))
            : t('home.plantFinder.next') }}
          <Icon
            v-if="!store.isLastStep"
            name="lucide:arrow-left"
            class="size-4 ltr:rotate-180"
          />
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.finder-step-enter-active,
.finder-step-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.finder-step-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.finder-step-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>