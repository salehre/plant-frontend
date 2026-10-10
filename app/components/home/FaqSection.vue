<script setup lang="ts">
const { t } = useI18n()

interface FaqItem { q: string, a: string }

// تعداد سؤال‌ها باید با آرایه‌ی home.faq.items در fa.json و en.json یکی باشه
const FAQ_COUNT = 6
const items = computed<FaqItem[]>(() =>
  Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: t(`home.faq.items[${i}].q`),
    a: t(`home.faq.items[${i}].a`),
  })),
)

// فقط یک سؤال در لحظه باز می‌مونه
const openIndex = ref<number | null>(0)
function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <section
    class="mx-auto max-w-3xl px-4 pt-14"
    aria-labelledby="faq-title"
  >
    <div class="mb-6 text-center">
      <h2
        id="faq-title"
        class="text-xl font-bold text-ink"
      >
        {{ t('home.faq.title') }}
      </h2>
      <p class="mt-1 text-sm text-ink-muted">
        {{ t('home.faq.subtitle') }}
      </p>
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="glass-card overflow-hidden"
      >
        <h3>
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 px-5 py-4 text-start text-sm font-medium text-ink sm:text-base"
            :aria-expanded="openIndex === i"
            :aria-controls="`faq-panel-${i}`"
            @click="toggle(i)"
          >
            <span>{{ item.q }}</span>
            <Icon
              name="lucide:chevron-down"
              class="size-5 shrink-0 text-primary-600 transition-transform duration-300"
              :class="{ 'rotate-180': openIndex === i }"
            />
          </button>
        </h3>
        <div
          :id="`faq-panel-${i}`"
          class="faq-panel"
          :class="{ 'faq-panel--open': openIndex === i }"
          role="region"
        >
          <div class="overflow-hidden">
            <p class="px-5 pb-4 text-sm leading-7 text-ink-muted">
              {{ item.a }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* باز و بسته شدن نرم بدون محاسبه‌ی ارتفاع با JS */
.faq-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}
.faq-panel--open {
  grid-template-rows: 1fr;
}
@media (prefers-reduced-motion: reduce) {
  .faq-panel {
    transition: none;
  }
}
</style>
