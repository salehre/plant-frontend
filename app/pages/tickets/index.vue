<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useTicketStore()

useHead(() => ({ title: t('tickets.pageTitle') }))

store.ensureSeeded()

type Tab = 'all' | 'pending' | 'answered' | 'closed'
const tabKeys: Tab[] = ['all', 'pending', 'answered', 'closed']

// تب فعال توی query ذخیره می‌شه (?status=pending) تا با رفرش و دکمه‌ی back حفظ بشه
const tab = computed<Tab>({
  get() {
    const q = route.query.status
    return typeof q === 'string' && (tabKeys as string[]).includes(q) ? (q as Tab) : 'all'
  },
  set(value) {
    router.replace({ query: value === 'all' ? {} : { status: value } })
  },
})

const tabs = computed(() => tabKeys.map(key => ({
  key,
  label: t(`tickets.tabs.${key}`),
  count: store.counts[key],
})))

const list = computed(() => tab.value === 'all'
  ? store.tickets
  : store.tickets.filter(x => x.status === tab.value))
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <header class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div class="max-w-2xl">
        <h1 class="text-2xl font-bold text-ink sm:text-3xl">
          {{ t('tickets.title') }}
        </h1>
        <p class="mt-2 text-sm leading-7 text-ink-muted sm:text-base">
          {{ t('tickets.subtitle') }}
        </p>
      </div>
      <NuxtLink to="/tickets/new">
        <AppButton variant="primary">
          <Icon
            name="lucide:plus"
            class="size-4"
          />
          {{ t('tickets.newTicket') }}
        </AppButton>
      </NuxtLink>
    </header>

    <!-- فیلتر وضعیت -->
    <div
      class="mb-6 flex gap-2 overflow-x-auto pb-1"
      role="tablist"
      :aria-label="t('tickets.filterLabel')"
    >
      <button
        v-for="item in tabs"
        :key="item.key"
        type="button"
        role="tab"
        :aria-selected="tab === item.key"
        class="inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="tab === item.key
          ? 'bg-primary-600 text-white'
          : 'bg-primary-50 text-primary-700 hover:bg-primary-100'"
        @click="tab = item.key"
      >
        {{ item.label }}
        <span
          class="rounded-md px-1.5 text-xs"
          :class="tab === item.key ? 'bg-white/20' : 'bg-primary-100'"
        >{{ toPersianDigits(item.count) }}</span>
      </button>
    </div>

    <!-- لیست -->
    <div
      v-if="list.length"
      class="flex flex-col gap-3"
    >
      <div
        class="hidden px-5 text-xs text-ink-muted sm:grid sm:grid-cols-[minmax(0,1fr)_8rem_9.5rem_8.5rem] sm:gap-x-4"
        aria-hidden="true"
      >
        <span>{{ t('tickets.columns.subject') }}</span>
        <span>{{ t('tickets.columns.category') }}</span>
        <span>{{ t('tickets.columns.date') }}</span>
        <span class="justify-self-end">{{ t('tickets.columns.status') }}</span>
      </div>
      <TicketCard
        v-for="ticket in list"
        :key="ticket.id"
        :ticket="ticket"
      />
    </div>

    <!-- حالت خالی -->
    <div
      v-else
      class="glass-card flex flex-col items-center gap-3 px-6 py-14 text-center"
    >
      <span class="flex size-14 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
        <Icon
          name="lucide:inbox"
          class="size-7"
        />
      </span>
      <h2 class="text-lg font-bold text-ink">
        {{ store.counts.all === 0 ? t('tickets.emptyTitle') : t('tickets.emptyFilterTitle') }}
      </h2>
      <p class="max-w-md text-sm leading-7 text-ink-muted">
        {{ store.counts.all === 0 ? t('tickets.emptyText') : t('tickets.emptyFilterText') }}
      </p>
      <NuxtLink
        v-if="store.counts.all === 0"
        to="/tickets/new"
      >
        <AppButton variant="primary">
          {{ t('tickets.newTicket') }}
        </AppButton>
      </NuxtLink>
    </div>
  </div>
</template>
