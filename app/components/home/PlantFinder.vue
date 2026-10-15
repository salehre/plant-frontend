<script setup lang="ts">
import type { MockLocale } from '~/services/mock/mock-locale'
import { seasonByTheme } from '~/stores/ui.store'

const { t, locale } = useI18n()
const store = usePlantFinderStore()
const uiStore = useUiStore()

// بک‌گراند داینامیک (عکس فصل بر اساس تم) که قبلاً پشت hero بود
const bgImage = computed(() => `/images/bg-image/${seasonByTheme[uiStore.theme]}.webp`)

const activeLocale = computed<MockLocale>(() => (locale.value === 'fa' ? 'fa' : 'en'))
const question = computed(() => store.currentQuestion)
// هدر معرفی فقط وقتی سؤال‌ها نشون داده می‌شن دیده بشه
const isAsking = computed(() => !store.loading && !store.done)

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

// با انتخاب یه گزینه، بعد از یه مکث کوتاه (که کاربر انتخابش رو ببینه) خودکار می‌ره سؤال بعد؛
// توی آخرین سؤال هم مستقیم پیشنهاد گرفته می‌شه
const ADVANCE_DELAY = 220
let advanceTimer: ReturnType<typeof setTimeout> | undefined

function onSelect(value: string) {
  if (advanceTimer || store.loading) return
  store.select(question.value.id, value)
  advanceTimer = setTimeout(() => {
    advanceTimer = undefined
    onNext()
  }, ADVANCE_DELAY)
}

onBeforeUnmount(() => clearTimeout(advanceTimer))

// اگه کاربر وسط دیدن نتایج زبان رو عوض کرد، پیشنهادها (اسم گیاه‌ها) با زبان جدید دوباره گرفته می‌شن
watch(activeLocale, () => {
  if (store.done) submit()
})
</script>

<template>
  <!-- باکس پیدا کردن گیاه با بک‌گراند داینامیک -->
  <section
    class="relative isolate flex min-h-[400px] flex-col justify-center overflow-hidden rounded-2xl p-6 text-white sm:min-h-[460px] sm:p-10"
    aria-labelledby="plant-finder-title"
  >
    <h2
      id="plant-finder-title"
      :class="isAsking
        ? 'text-lg font-extrabold text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.35)] sm:text-xl'
        : 'sr-only'"
    >
      {{ t('home.plantFinder.title') }}
    </h2>
    <p
      v-if="isAsking"
      class="mb-7 mt-2 max-w-2xl text-xs leading-6 text-white/85 sm:text-sm"
    >
      {{ t('home.plantFinder.introDescription') }}
    </p>

    <Transition name="bg-fade">
      <img
        :key="bgImage"
        :src="bgImage"
        alt=""
        class="bg-float absolute inset-0 -z-20 size-full object-cover"
      >
    </Transition>
    <div class="absolute inset-0 -z-10 bg-black/45" />

    <!-- در حال دریافت پیشنهاد (AI داره فکر می‌کنه) -->
    <div
      v-if="store.loading"
      class="flex min-h-64 flex-col items-center justify-center gap-3.5 py-10 text-center"
      role="status"
      aria-live="polite"
    >
      <span class="relative flex size-12 items-center justify-center">
        <span class="absolute inset-0 animate-ping rounded-full bg-white/25 motion-reduce:animate-none" />
        <span class="relative flex size-12 items-center justify-center rounded-full bg-white/20">
          <Icon
            name="svg-spinners:180-ring"
            class="size-6 text-white"
          />
        </span>
      </span>
      <p class="text-sm text-white/85">
        {{ t('home.plantFinder.loading') }}
      </p>
    </div>

    <!-- نتایج -->
    <div v-else-if="store.done">
      <h3 class="text-base font-bold text-white">
        {{ t('home.plantFinder.resultsTitle') }}
      </h3>
      <p class="mb-5 mt-1 text-xs text-white/80 sm:text-sm">
        {{ t('home.plantFinder.resultsSubtitle') }}
      </p>

      <p
        v-if="!store.suggestions.length"
        class="rounded-lg bg-white/15 p-3 text-xs text-white/90 sm:text-sm"
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
            class="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface text-ink transition-shadow hover:shadow-card-hover"
          >
            <div class="relative aspect-[16/10] overflow-hidden bg-primary-50">
              <img
                :src="item.plant.image"
                :alt="item.plant.name"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              >
              <span class="absolute end-2 top-2 rounded-md bg-primary-600 px-2 py-0.5 text-[11px] font-medium text-white">
                {{ t('home.plantFinder.match') }} {{ formatScore(item.matchScore) }}
              </span>
            </div>

            <div class="flex flex-1 flex-col gap-2 p-4">
              <div>
                <h4 class="text-sm font-bold text-ink">
                  {{ item.plant.name }}
                </h4>
                <p class="text-xs italic text-ink-muted">
                  {{ item.plant.scientificName }}
                </p>
              </div>

              <!-- اگه AI توضیح متنی داده همونو نشون می‌دیم، وگرنه چیپ‌های «چی با چی جور شد» -->
              <p
                v-if="item.reason"
                class="text-xs leading-5 text-ink-muted"
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
                  class="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-2 py-0.5 text-xs text-primary-700"
                >
                  <Icon
                    name="lucide:check"
                    class="size-3"
                  />
                  {{ t(`home.plantFinder.matched.${id}`) }}
                </li>
              </ul>

              <span class="mt-auto pt-1 text-xs text-ink-muted">
                {{ t(difficultyKeys[item.plant.difficulty] ?? '') }}
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>

      <div class="mt-5 flex justify-end">
        <AppButton
          variant="secondary"
          size="sm"
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
      <div class="mb-6">
        <div class="mb-2.5 text-xs text-white/85">
          {{ t('home.plantFinder.stepOf', {
            current: percentFormatter.format(store.step + 1),
            total: percentFormatter.format(store.totalSteps),
          }) }}
        </div>
        <!-- نوار مراحل: هر مرحله یه تکه‌ی جدا با فاصله -->
        <div
          class="flex gap-1.5"
          role="progressbar"
          :aria-valuemin="1"
          :aria-valuemax="store.totalSteps"
          :aria-valuenow="store.step + 1"
        >
          <span
            v-for="i in store.totalSteps"
            :key="i"
            class="h-1.5 flex-1 rounded-full transition-colors duration-300"
            :class="i <= store.step + 1 ? 'bg-white' : 'bg-white/30'"
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
            class="mb-5 text-base font-bold text-white sm:text-lg"
          >
            {{ t(`home.plantFinder.questions.${question.id}.title`) }}
          </h3>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              v-for="option in question.options"
              :key="option.value"
              type="button"
              :aria-pressed="store.currentAnswer === option.value"
              class="flex items-center gap-3 rounded-xl border px-4 py-4 text-start text-sm backdrop-blur-sm transition-colors"
              :class="store.currentAnswer === option.value
                ? 'border-white bg-white text-primary-700'
                : 'border-white/30 bg-white/10 text-white hover:bg-white/20'"
              @click="onSelect(option.value)"
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
        class="mt-3 rounded-lg bg-status-danger/90 p-2.5 text-xs text-white"
        role="alert"
      >
        {{ store.error }}
      </p>

      <div class="mt-7 flex items-center justify-between gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
          :disabled="store.isFirstStep"
          @click="store.back()"
        >
          <Icon
            name="lucide:arrow-right"
            class="size-4 ltr:rotate-180"
          />
          {{ t('home.plantFinder.back') }}
        </button>

        <!-- دکمه‌ی «بعدی» حذف شده؛ فقط وقتی گرفتن پیشنهاد خطا داد، تلاش دوباره لازمه -->
        <AppButton
          v-if="store.isLastStep && store.error"
          variant="primary"
          size="sm"
          @click="submit"
        >
          {{ t('home.plantFinder.retry') }}
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 0.6s ease;
}
.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}

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

/* عکس بک‌گراند ثابت نیست؛ خیلی کم و آروم شناور می‌شه (بدون زوم) */
.bg-float {
  scale: 1.04;
  animation: bg-float 15s ease-in-out infinite;
  will-change: transform;
}
@keyframes bg-float {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(-1%, -0.8%, 0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .bg-float {
    animation: none;
  }
}
</style>