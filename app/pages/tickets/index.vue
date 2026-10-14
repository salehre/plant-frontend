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
    <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div class="max-w-2xl">
        <h1 class="text-2xl font-bold text-ink sm:text-3xl">
          {{ t('tickets.title') }}
        </h1>
        <p class="mt-1 text-sm leading-7 text-ink-muted">
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
        class="chip shrink-0"
        :class="{ 'chip--active': tab === item.key }"
        @click="tab = item.key"
      >
        {{ item.label }} ({{ toPersianDigits(item.count) }})
      </button>
    </div>

    <!-- لیست -->
    <div
      v-if="list.length"
      class="glass-card overflow-hidden"
    >
      <div
        class="hidden border-b border-ink/5 px-5 py-3 text-xs text-ink-muted sm:grid sm:grid-cols-[minmax(0,1fr)_9rem_8rem_9.5rem_1.25rem] sm:gap-x-4"
        aria-hidden="true"
      >
        <span>{{ t('tickets.columns.subject') }}</span>
        <span>{{ t('tickets.columns.category') }}</span>
        <span>{{ t('tickets.columns.status') }}</span>
        <span>{{ t('tickets.columns.date') }}</span>
        <span />
      </div>
      <div class="divide-y divide-ink/5">
        <TicketCard
          v-for="ticket in list"
          :key="ticket.id"
          :ticket="ticket"
        />
      </div>
    </div>

    <!-- حالت خالی -->
    <div
      v-else
      class="glass-card flex flex-col items-center gap-3 px-6 py-14 text-center"
    >
      <span class="flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
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
