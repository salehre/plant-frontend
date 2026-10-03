<script setup lang="ts">
definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

const userPlantsStore = useUserPlantsStore()
const { t } = useI18n()

function plantNickname(userPlantId: string) {
  return userPlantsStore.plants.find(p => p.id === userPlantId)?.nickname ?? ''
}

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
      <div class="glass-card p-4 text-center">
        <p class="text-2xl font-bold text-primary-700">
          {{ toPersianDigits(userPlantsStore.plants.length) }}
        </p>
        <p class="text-xs text-ink-muted">
          {{ t('pages.dashboard.plant') }}
        </p>
      </div>
      <div class="glass-card p-4 text-center">
        <p class="text-2xl font-bold text-status-warning">
          {{ toPersianDigits(userPlantsStore.todayTasks.length) }}
        </p>
        <p class="text-xs text-ink-muted">
          {{ t('pages.dashboard.todayTask') }}
        </p>
      </div>
      <div class="glass-card p-4 text-center">
        <p class="text-2xl font-bold text-primary-700">
          {{ toPersianDigits(userPlantsStore.plants.filter(p => p.healthStatus === 'healthy').length) }}
        </p>
        <p class="text-xs text-ink-muted">
          {{ t('pages.dashboard.healthy') }}
        </p>
      </div>
      <div class="glass-card p-4 text-center">
        <p class="text-2xl font-bold text-status-danger">
          {{ toPersianDigits(userPlantsStore.plants.filter(p => p.healthStatus !== 'healthy').length) }}
        </p>
        <p class="text-xs text-ink-muted">
          {{ t('pages.dashboard.needsAttention') }}
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