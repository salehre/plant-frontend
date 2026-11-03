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
    class="w-80 shrink-0 flex-col gap-4 overflow-y-auto rounded-s-3xl border-s border-ink/5 bg-surface p-4"
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
      <ChatPlantIllustration class="h-28 w-auto" />
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
    <div class="mt-auto flex flex-col">
      <!-- دکمه افزودن گیاه (زمانی که هیچ گیاهی وجود ندارد) -->
      <NuxtLink
        v-if="!options.length"
        to="/my-plants"
        class="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-ink/10 px-4 py-3 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 hover:shadow-md hover:shadow-primary-500/10 active:translate-y-0 active:scale-[0.98]"
      >
        <Icon
          name="lucide:plus"
          class="size-4 transition-transform duration-300 ease-out group-hover:rotate-90 group-hover:scale-125"
        />
        <span>{{ t('pages.myPlants.addPlant') }}</span>
      </NuxtLink>

      <template v-else-if="available.length">
        <!-- کانتینر بازشو با انیمیشن روان ارتفاع و مات شدن -->
        <div
          class="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          :class="listOpen ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0 mb-0 pointer-events-none'"
        >
          <div class="overflow-hidden min-h-0">
            <ul
              class="flex max-h-56 flex-col gap-1 overflow-y-auto rounded-2xl border border-ink/5 bg-surface p-1.5 shadow-md shadow-ink/5 transition-transform duration-300"
              :class="listOpen ? 'translate-y-0 scale-100' : 'translate-y-2 scale-95'"
            >
              <li
                v-for="(plant, index) in available"
                :key="plant.id"
                class="transition-all duration-300 ease-out"
                :style="{ transitionDelay: listOpen ? `${Math.min(index * 40, 240)}ms` : '0ms' }"
                :class="listOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'"
              >
                <button
                  type="button"
                  class="group/item flex w-full items-center gap-3 rounded-xl px-2 py-2 text-start transition-all duration-200 hover:bg-primary-50 active:scale-[0.98]"
                  @click="connect(plant.id)"
                >
                  <img
                    :src="plant.photo"
                    alt=""
                    class="size-9 shrink-0 rounded-lg object-cover transition-transform duration-300 group-hover/item:scale-105"
                  >
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-medium text-ink transition-colors group-hover/item:text-primary-800">{{ plant.nickname }}</span>
                    <span class="block truncate text-xs text-ink-muted">{{ plant.species }}</span>
                  </span>
                  <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-50/60 transition-all duration-200 group-hover/item:bg-primary-100 group-hover/item:scale-110">
                    <Icon
                      name="lucide:plus"
                      class="size-4 text-primary-700 transition-transform duration-200 group-hover/item:rotate-90"
                    />
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- دکمه اتصال گیاه -->
        <button
          type="button"
          class="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-ink/10 px-4 py-3 text-sm font-medium text-primary-50 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-700/30 active:translate-y-0 active:scale-[0.98]"
          :class="listOpen ? 'bg-primary-800 ring-2 ring-primary-500/20' : 'bg-primary-700 hover:bg-primary-600'"
          :aria-expanded="listOpen"
          @click="listOpen = !listOpen"
        >
          <!-- افکت موج نوری (Shine) هنگام هاور -->
          <span
            class="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"
          />

          <!-- آیکون مثبت که با باز شدن منو به ضربدر تبدیل می‌شود -->
          <Icon
            name="lucide:plus"
            class="relative size-4 transition-transform duration-300 ease-out"
            :class="listOpen ? 'rotate-45 scale-110 text-primary-200' : 'group-hover:rotate-90 group-hover:scale-125'"
          />
          <span class="relative">
            {{ connected.length ? t('aiDoctor.panel.connectAnother') : t('aiDoctor.panel.connect') }}
          </span>
        </button>
      </template>
    </div>
  </aside>
</template>