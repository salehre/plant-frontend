<script setup lang="ts">
definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

const userPlantsStore = useUserPlantsStore()
const { t } = useI18n()

function plantNickname(userPlantId: string) {
  return userPlantsStore.plants.find(p => p.id === userPlantId)?.nickname ?? ''
}

const stats = computed(() => [
  { icon: 'lucide:sprout', value: userPlantsStore.plants.length, label: 'pages.dashboard.plant', tone: 'bg-primary-50 text-primary-700' },
  { icon: 'lucide:calendar-check', value: userPlantsStore.todayTasks.length, label: 'pages.dashboard.todayTask', tone: 'bg-accent-50 text-accent-700' },
  { icon: 'lucide:heart-pulse', value: userPlantsStore.plants.filter(p => p.healthStatus === 'healthy').length, label: 'pages.dashboard.healthy', tone: 'bg-primary-50 text-primary-700' },
  { icon: 'lucide:triangle-alert', value: userPlantsStore.plants.filter(p => p.healthStatus !== 'healthy').length, label: 'pages.dashboard.needsAttention', tone: 'bg-status-danger/10 text-status-danger' },
])

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