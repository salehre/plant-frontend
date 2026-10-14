<script setup lang="ts">
definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

const userPlantsStore = useUserPlantsStore()
const historyStore = useHistoryStore()
const { t } = useI18n()

function plantNickname(userPlantId: string) {
  return userPlantsStore.plants.find(p => p.id === userPlantId)?.nickname ?? ''
}

const stats = computed(() => [
  { icon: 'lucide:sprout', value: userPlantsStore.plants.length, label: 'pages.dashboard.plant', tone: 'bg-primary-50 text-primary-700' },
  { icon: 'lucide:scan-line', value: historyStore.count, label: 'pages.dashboard.totalScans', tone: 'bg-primary-50 text-primary-700' },
  { icon: 'lucide:leaf', value: new Set(historyStore.entries.map(e => e.scientificName)).size, label: 'pages.dashboard.speciesIdentified', tone: 'bg-primary-50 text-primary-700' },
  { icon: 'lucide:calendar-check', value: userPlantsStore.todayTasks.length, label: 'pages.dashboard.todayTask', tone: 'bg-accent-50 text-accent-700' },
])

// درصد سلامت: سهم گیاه‌های سالم از کل
const healthyCount = computed(() => userPlantsStore.plants.filter(p => p.healthStatus === 'healthy').length)
const healthRate = computed(() => {
  const total = userPlantsStore.plants.length
  return total ? Math.round(healthyCount.value / total * 100) : 0
})
const RING_RADIUS = 34
const ringCircumference = 2 * Math.PI * RING_RADIUS
const ringOffset = computed(() => ringCircumference * (1 - healthRate.value / 100))

function completeTask(id: string) {
  userPlantsStore.completeTask(id)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-2xl font-bold text-ink">
        {{ t('pages.dashboard.greeting') }} 👋
      </h1>
      <p class="text-ink-muted">
        {{ t('pages.dashboard.subtitle') }}
      </p>
    </div>

    <!-- خلاصه وضعیت -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div
          v-for="stat in stats"
          :key="stat.label"
          class="glass-card flex items-center gap-3 p-4"
      >
        <span
            class="flex size-11 shrink-0 items-center justify-center rounded-full"
            :class="stat.tone"
        >
          <Icon
              :name="stat.icon"
              class="size-5"
          />
        </span>
        <div class="min-w-0">
          <p class="text-2xl font-extrabold leading-none text-ink">
            {{ toPersianDigits(stat.value) }}
          </p>
          <p class="mt-1 truncate text-xs text-ink-muted">
            {{ t(stat.label) }}
          </p>
        </div>
      </div>
    </div>

    <!-- نرخ سلامت -->
    <div class="glass-card flex items-center gap-5 p-4">
      <div class="relative size-24 shrink-0">
        <svg
          viewBox="0 0 80 80"
          class="size-full -rotate-90"
        >
          <circle
            cx="40"
            cy="40"
            :r="RING_RADIUS"
            fill="none"
            stroke-width="7"
            class="stroke-primary-100"
          />
          <circle
            cx="40"
            cy="40"
            :r="RING_RADIUS"
            fill="none"
            stroke-width="7"
            stroke-linecap="round"
            class="stroke-primary-600 transition-all duration-700"
            :stroke-dasharray="ringCircumference"
            :stroke-dashoffset="ringOffset"
          />
        </svg>
        <span class="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-ink">
          {{ toPersianDigits(healthRate) }}٪
        </span>
      </div>
      <div>
        <p class="font-bold text-ink">
          {{ t('pages.dashboard.healthRate') }}
        </p>
        <p class="mt-1 text-sm text-ink-muted">
          {{ toPersianDigits(healthyCount) }} / {{ toPersianDigits(userPlantsStore.plants.length) }} {{ t('pages.dashboard.healthy') }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- گیاهان -->
      <div class="lg:col-span-2">
        <h2 class="mb-3 font-bold text-ink">
          {{ t('pages.dashboard.myPlants') }}
        </h2>
        <div class="flex flex-col gap-2">
          <PlantWidget
              v-for="p in userPlantsStore.plants"
              :key="p.id"
              :user-plant="p"
          />
        </div>
        <NuxtLink
            to="/my-plants"
            class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {{ t('pages.dashboard.managePlants') }}
          <Icon
              name="lucide:arrow-left"
              class="size-4"
          />
        </NuxtLink>

        <div class="mt-6">
          <GrowthChart />
        </div>
      </div>

      <!-- وظایف امروز -->
      <div>
        <h2 class="mb-3 font-bold text-ink">
          {{ t('pages.dashboard.todayTasks') }}
        </h2>
        <div
            v-if="userPlantsStore.todayTasks.length"
            class="flex flex-col gap-2"
        >
          <TaskCard
              v-for="task in userPlantsStore.todayTasks"
              :key="task.id"
              :task="task"
              :plant-name="plantNickname(task.userPlantId)"
              @done="completeTask"
          />
        </div>
        <p
            v-else
            class="rounded-md bg-primary-50 p-4 text-sm text-primary-700"
        >
          {{ t('pages.dashboard.noTasks') }} 🌿
        </p>
      </div>
    </div>
  </div>
</template>