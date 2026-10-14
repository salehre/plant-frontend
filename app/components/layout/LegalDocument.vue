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

// بخشِ در حال مشاهده توی فهرست هایلایت می‌شه (scroll-spy)
const activeId = ref('sec-1')
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) activeId.value = visible[0].target.id
    },
    { rootMargin: '-90px 0px -60% 0px' },
  )
  sections.value.forEach((s) => {
    const el = document.getElementById(s.id)
    if (el) observer?.observe(el)
  })
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <!-- نوار تصویری بالای صفحه -->
    <div class="mb-6 h-24 overflow-hidden sm:h-32 lg:h-40 [margin-inline:calc(50%_-_50vw)] md:[margin-inline:calc(50%_-_50vw_+_8rem)]">
      <img
        src="/images/plants/header.png"
        alt=""
        class="size-full object-cover"
      >
    </div>

    <header class="mb-6 max-w-3xl">
      <h1 class="text-2xl font-bold text-ink sm:text-3xl">
        {{ t(`legal.${ns}.title`) }}
      </h1>
      <p class="mt-2 text-sm leading-7 text-ink-muted">
        {{ t(`legal.${ns}.intro`) }}
      </p>
      <p class="mt-1 text-xs text-ink-muted">
        {{ t('legal.lastUpdated') }}: {{ t('legal.updatedDate') }}
      </p>
    </header>

    <div class="grid grid-cols-1 items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <!-- فهرست بخش‌ها -->
      <nav
        class="glass-card p-2 lg:sticky lg:top-24"
        :aria-label="t('legal.toc')"
      >
        <ol class="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          <li
            v-for="(s, i) in sections"
            :key="s.id"
            class="shrink-0"
          >
            <a
              :href="`#${s.id}`"
              class="flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors lg:whitespace-normal"
              :class="activeId === s.id
                ? 'bg-primary-50 font-bold text-primary-700'
                : 'text-ink-muted hover:bg-primary-50/60 hover:text-primary-700'"
              :aria-current="activeId === s.id ? 'true' : undefined"
              @click="activeId = s.id"
            >
              <span class="w-5 shrink-0 text-xs">{{ toPersianDigits(i + 1) }}.</span>
              {{ s.title }}
            </a>
          </li>
        </ol>
      </nav>

      <div class="flex min-w-0 flex-col gap-5">
        <!-- متن -->
        <article class="glass-card flex flex-col gap-8 p-5 sm:p-8">
          <section
            v-for="(s, i) in sections"
            :id="s.id"
            :key="s.id"
            class="scroll-mt-24"
          >
            <h2 class="mb-3 text-base font-bold text-ink sm:text-lg">
              {{ toPersianDigits(i + 1) }}. {{ s.title }}
            </h2>
            <p
              v-for="(p, j) in s.paragraphs"
              :key="j"
              class="mb-3 text-sm leading-8 text-ink-muted last:mb-0"
            >
              {{ p }}
            </p>
          </section>
        </article>

        <!-- کارت سؤال -->
        <div class="flex flex-wrap items-center gap-4 rounded-2xl bg-primary-50 p-5 dark:bg-primary-900/30">
          <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface text-primary-700">
            <Icon
              name="lucide:shield-question"
              class="size-5"
            />
          </span>
          <p class="min-w-0 flex-1 text-sm font-medium text-ink">
            {{ t('legal.questions') }}
          </p>
          <NuxtLink
            to="/contact"
            class="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-800"
          >
            {{ t('legal.contactUs') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
