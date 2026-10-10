<script setup lang="ts">
/**
 * قالب مشترک صفحات حقوقی (قوانین و مقررات، حریم خصوصی).
 * متن‌ها از i18n میان: legal.<ns>.title / intro / sections[i].title|body
 * body می‌تونه چند پاراگراف باشه که با خط جدید (\n) از هم جدا شدن.
 * count باید با تعداد آیتم‌های sections توی fa.json و en.json یکی باشه.
 */
const props = defineProps<{ ns: 'terms' | 'privacy', count: number }>()

const { t } = useI18n()

useHead(() => ({ title: t(`legal.${props.ns}.title`) }))

const sections = computed(() =>
  Array.from({ length: props.count }, (_, i) => ({
    id: `sec-${i + 1}`,
    title: t(`legal.${props.ns}.sections[${i}].title`),
    paragraphs: t(`legal.${props.ns}.sections[${i}].body`).split('\n').filter(Boolean),
  })),
)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:py-14">
    <header class="mb-8 max-w-3xl">
      <h1 class="text-2xl font-bold text-ink sm:text-3xl">
        {{ t(`legal.${ns}.title`) }}
      </h1>
      <p class="mt-1 text-xs text-ink-muted">
        {{ t('legal.lastUpdated') }}: {{ t('legal.updatedDate') }}
      </p>
      <p class="mt-4 text-sm leading-7 text-ink-muted sm:text-base">
        {{ t(`legal.${ns}.intro`) }}
      </p>
    </header>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <!-- فهرست بخش‌ها -->
      <nav
        class="glass-card h-fit p-5 lg:sticky lg:top-24"
        :aria-label="t('legal.toc')"
      >
        <p class="mb-3 text-sm font-medium text-ink">
          {{ t('legal.toc') }}
        </p>
        <ol class="flex flex-col gap-2 text-sm text-ink-muted">
          <li
            v-for="(s, i) in sections"
            :key="s.id"
          >
            <a
              :href="`#${s.id}`"
              class="transition-colors hover:text-primary-700"
            >{{ i + 1 }}. {{ s.title }}</a>
          </li>
        </ol>
      </nav>

      <!-- متن -->
      <article class="glass-card flex flex-col gap-8 p-5 sm:p-8 lg:col-span-3">
        <section
          v-for="(s, i) in sections"
          :id="s.id"
          :key="s.id"
          class="scroll-mt-24"
        >
          <h2 class="mb-3 text-lg font-bold text-ink">
            {{ i + 1 }}. {{ s.title }}
          </h2>
          <p
            v-for="(p, j) in s.paragraphs"
            :key="j"
            class="mb-3 text-sm leading-8 text-ink-muted last:mb-0"
          >
            {{ p }}
          </p>
        </section>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-6">
          <p class="text-sm text-ink-muted">
            {{ t('legal.questions') }}
          </p>
          <NuxtLink
            to="/contact"
            class="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {{ t('legal.contactUs') }}
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>
