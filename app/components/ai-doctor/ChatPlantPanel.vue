<script setup lang="ts">
import type { PlantOption } from '~/composables/useUserPlantOptions'

const props = defineProps<{
  /** همه‌ی گیاه‌های «گیاهان من» */
  options: PlantOption[]
  /** id گیاه‌های وصل‌شده به گفتگو */
  selected: string[]
}>()
const emit = defineEmits<{ toggle: [id: string] }>()

const { t } = useI18n()
const userPlantsStore = useUserPlantsStore()
const listOpen = ref(false)

const statusBadge: Record<string, string> = {
  healthy: 'bg-primary-50 text-primary-700',
  needs_attention: 'bg-accent-50 text-accent-700',
  sick: 'bg-status-danger/10 text-status-danger',
}

const connected = computed(() =>
  props.options
    .filter(o => props.selected.includes(o.id))
    .map((option) => {
      const plant = userPlantsStore.plants.find(p => p.id === option.id)
      return {
        ...option,
        status: plant?.healthStatus ?? 'healthy',
        location: plant?.location ?? '',
        lastWateredAt: plant?.lastWateredAt ?? null,
        nextWateringAt: plant?.nextWateringAt ?? null,
        doneTasks: userPlantsStore.tasks.filter(task => task.userPlantId === option.id && task.done).length,
      }
    }),
)
const available = computed(() => props.options.filter(o => !props.selected.includes(o.id)))

type Connected = (typeof connected.value)[number]

function rows(plant: Connected) {
  const date = (iso: string | null) => (iso ? toJalaliDate(iso) : '—')
  return [
    { key: 'last', label: t('aiDoctor.panel.lastWatered'), value: date(plant.lastWateredAt) },
    { key: 'next', label: t('aiDoctor.panel.nextWatering'), value: date(plant.nextWateringAt) },
    { key: 'location', label: t('aiDoctor.panel.location'), value: plant.location || '—' },
    {
      key: 'tasks',
      label: t('aiDoctor.panel.careHistory'),
      value: t('aiDoctor.panel.tasksDone', { count: toPersianDigits(plant.doneTasks) }),
    },
  ]
}

function connect(id: string) {
  emit('toggle', id)
  listOpen.value = false
}
</script>

<template>
  <!-- display (hidden / xl:flex) از بیرون داده می‌شه -->
  <aside
    class="w-80 shrink-0 flex-col gap-4 overflow-y-auto rounded-3xl border border-ink/5 bg-surface p-4"
    :aria-label="t('aiDoctor.panel.connectedPlant')"
  >
    <h2 class="text-base font-bold text-ink">
      {{ connected.length > 1 ? t('aiDoctor.panel.connectedPlants') : t('aiDoctor.panel.connectedPlant') }}
    </h2>

    <!-- حالت خالی -->
    <div
      v-if="!connected.length"
      class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 px-4 py-8 text-center"
    >
      <span class="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-white/10">
        <Icon
          name="lucide:sprout"
          class="size-6"
        />
      </span>
      <p class="text-xs leading-6 text-ink-muted">
        {{ t('aiDoctor.panel.emptyText') }}
      </p>
    </div>

    <!-- گیاه(های) وصل‌شده -->
    <article
      v-for="plant in connected"
      :key="plant.id"
      class="flex flex-col gap-3 rounded-2xl border border-ink/5 p-3"
    >
      <div class="relative">
        <img
          :src="plant.photo"
          :alt="plant.nickname"
          class="w-full rounded-xl object-cover"
          :class="connected.length > 1 ? 'aspect-[16/8]' : 'aspect-[4/3]'"
        >
        <button
          type="button"
          class="absolute end-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
          :aria-label="t('aiDoctor.detachPlant', { name: plant.nickname })"
          :title="t('aiDoctor.detachPlant', { name: plant.nickname })"
          @click="emit('toggle', plant.id)"
        >
          <Icon
            name="lucide:unlink"
            class="size-4"
          />
        </button>
      </div>

      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <h3 class="truncate text-sm font-bold text-ink">
            {{ plant.nickname }}
          </h3>
          <p class="truncate text-xs text-ink-muted">
            {{ plant.species }}
          </p>
        </div>
        <span
          class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold"
          :class="statusBadge[plant.status]"
        >
          {{ healthLabel(plant.status) }}
        </span>
      </div>

      <dl class="flex flex-col divide-y divide-ink/5 text-xs">
        <div
          v-for="row in rows(plant)"
          :key="row.key"
          class="flex items-center justify-between gap-3 py-2"
        >
          <dt class="text-ink-muted">
            {{ row.label }}
          </dt>
          <dd class="truncate font-medium text-ink">
            {{ row.value }}
          </dd>
        </div>
      </dl>

      <NuxtLink
        :to="`/my-plants/${plant.id}`"
        class="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50"
      >
        {{ t('aiDoctor.panel.viewPlant') }}
        <Icon
          name="lucide:arrow-up-left"
          class="size-3.5 ltr:rotate-90"
        />
      </NuxtLink>
    </article>

    <!-- اتصال گیاه -->
    <div class="mt-auto flex flex-col gap-2">
      <NuxtLink
        v-if="!options.length"
        to="/my-plants"
        class="flex items-center justify-center gap-2 rounded-2xl border border-ink/10 px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-primary-50 hover:text-primary-700"
      >
        <Icon
          name="lucide:plus"
          class="size-4"
        />
        {{ t('pages.myPlants.addPlant') }}
      </NuxtLink>

      <template v-else-if="available.length">
        <ul
          v-if="listOpen"
          class="flex max-h-56 flex-col gap-1 overflow-y-auto rounded-2xl border border-ink/5 p-1.5"
        >
          <li
            v-for="plant in available"
            :key="plant.id"
          >
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-start transition-colors hover:bg-primary-50"
              @click="connect(plant.id)"
            >
              <img
                :src="plant.photo"
                alt=""
                class="size-9 shrink-0 rounded-lg object-cover"
              >
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-ink">{{ plant.nickname }}</span>
                <span class="block truncate text-xs text-ink-muted">{{ plant.species }}</span>
              </span>
              <Icon
                name="lucide:plus"
                class="size-4 shrink-0 text-primary-700"
              />
            </button>
          </li>
        </ul>

        <button
          type="button"
          class="flex items-center justify-center gap-2 rounded-2xl border border-ink/10 px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-primary-50 hover:text-primary-700"
          :aria-expanded="listOpen"
          @click="listOpen = !listOpen"
        >
          <Icon
            :name="listOpen ? 'lucide:chevron-down' : 'lucide:plus'"
            class="size-4"
          />
          {{ connected.length ? t('aiDoctor.panel.connectAnother') : t('aiDoctor.panel.connect') }}
        </button>
      </template>
    </div>
  </aside>
</template>