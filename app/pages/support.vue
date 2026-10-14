<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
useHead(() => ({ title: t('support.nav') }))

// تعداد سؤال‌ها باید با آرایه‌ی home.faq.items در fa.json و en.json یکی باشه
const FAQ_COUNT = 6
const topics = computed(() =>
  Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: t(`home.faq.items[${i}].q`),
    a: t(`home.faq.items[${i}].a`),
  })),
)

const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? topics.value.filter(item => `${item.q} ${item.a}`.toLowerCase().includes(q)) : topics.value
})

const openIndex = ref<number | null>(null)
function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

const cards = [
  { to: '#topics', icon: 'lucide:circle-help', title: 'home.faq.title', hint: 'support.cards.faqHint' },
  { to: '/blog', icon: 'lucide:book-open', title: 'pages.blog.title', hint: 'support.cards.guideHint' },
  { to: '/contact', icon: 'lucide:messages-square', title: 'contact.title', hint: 'support.cards.contactHint' },
  { to: '/tickets/new', icon: 'lucide:triangle-alert', title: 'tickets.newTicket', hint: 'support.cards.reportHint' },
]
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-8">
    <!-- هیرو + جستجو -->
    <section class="relative overflow-hidden rounded-[22px] bg-primary-900 text-white">
      <img
        src="/images/plants/botanical-1.webp"
        alt=""
        class="absolute inset-0 size-full object-cover opacity-60"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/70 to-primary-900/30" />
      <div class="relative flex flex-col gap-4 p-6 sm:p-10">
        <h1 class="text-2xl font-extrabold sm:text-4xl">
          {{ t('support.title') }}
        </h1>
        <p class="max-w-xl text-sm leading-7 text-white/80">
          {{ t('support.subtitle') }}
        </p>
        <form
          class="relative max-w-2xl"
          role="search"
          @submit.prevent
        >
          <input
            v-model="query"
            type="search"
            :placeholder="t('support.searchPlaceholder')"
            class="h-12 w-full border-0 bg-surface pe-12 ps-4 text-sm text-ink outline-none placeholder:text-ink-muted/70"
          >
          <Icon
            name="lucide:search"
            class="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-ink-muted"
          />
        </form>
      </div>
    </section>

    <!-- کارت‌های دسترسی -->
    <section class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <NuxtLink
        v-for="card in cards"
        :key="card.to"
        :to="card.to"
        class="glass-card flex flex-col gap-3 p-4"
      >
        <span class="flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
          <Icon
            :name="card.icon"
            class="size-5"
          />
        </span>
        <span>
          <span class="block text-sm font-bold text-ink">{{ t(card.title) }}</span>
          <span class="mt-0.5 block text-xs leading-5 text-ink-muted">{{ t(card.hint) }}</span>
        </span>
      </NuxtLink>
    </section>

    <!-- پرسش‌های پرتکرار -->
    <section
      id="topics"
      class="scroll-mt-24"
    >
      <h2 class="mb-3 text-lg font-bold text-ink">
        {{ t('support.popularTopics') }}
      </h2>
      <div
        v-if="filtered.length"
        class="glass-card divide-y divide-ink/5 overflow-hidden"
      >
        <div
          v-for="(item, i) in filtered"
          :key="item.q"
        >
          <button
            type="button"
            class="flex w-full items-center gap-3 px-4 py-4 text-start transition-colors hover:bg-primary-50/40"
            :aria-expanded="openIndex === i"
            @click="toggle(i)"
          >
            <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <Icon
                name="lucide:circle-help"
                class="size-5"
              />
            </span>
            <span class="flex-1 text-sm font-bold text-ink">{{ item.q }}</span>
            <Icon
              name="lucide:chevron-down"
              class="size-4 shrink-0 text-ink-muted transition-transform"
              :class="{ 'rotate-180': openIndex === i }"
            />
          </button>
          <p
            v-if="openIndex === i"
            class="px-4 pb-4 ps-[4.25rem] text-sm leading-7 text-ink-muted"
          >
            {{ item.a }}
          </p>
        </div>
      </div>
      <p
        v-else
        class="glass-card px-4 py-8 text-center text-sm text-ink-muted"
      >
        {{ t('support.noResults') }}
      </p>
    </section>

    <!-- هنوز کمک می‌خوای؟ -->
    <section class="relative overflow-hidden rounded-2xl bg-primary-50 p-5 dark:bg-primary-900/30 sm:p-6">
      <Icon
        name="lucide:leaf"
        class="absolute -bottom-4 -start-4 size-28 -rotate-12 text-primary-200/60"
      />
      <div class="relative flex flex-wrap items-center gap-4">
        <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface text-primary-700">
          <Icon
            name="lucide:headset"
            class="size-5"
          />
        </span>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-ink">
            {{ t('support.stillNeedHelp') }}
          </p>
          <p class="text-sm text-ink-muted">
            {{ t('support.stillNeedHelpText') }}
          </p>
        </div>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-800"
        >
          {{ t('components.theFooter.contact') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
