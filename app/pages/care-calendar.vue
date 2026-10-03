<script setup lang="ts">
definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

const userPlantsStore = useUserPlantsStore()
const { t } = useI18n()

function plantNickname(userPlantId: string) {
  return userPlantsStore.plants.find(p => p.id === userPlantId)?.nickname ?? ''
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-2xl font-bold text-ink">
      {{ t('nav.careCalendar') }}
    </h1>

    <CareCalendar :tasks="[...userPlantsStore.todayTasks, ...userPlantsStore.upcomingTasks]" />

    <div>
      <h2 class="mb-3 font-bold text-ink">
        {{ t('pages.careCalendar.upcoming') }}
      </h2>
      <div
        v-if="userPlantsStore.upcomingTasks.length"
        class="flex flex-col gap-2"
      >
        <TaskCard
          v-for="task in userPlantsStore.upcomingTasks"
          :key="task.id"
          :task="task"
          :plant-name="plantNickname(task.userPlantId)"
          @done="userPlantsStore.completeTask"
        />
      </div>
      <p
        v-else
        class="text-sm text-ink-muted"
      >
        {{ t('pages.careCalendar.empty') }}
      </p>
    </div>
  </div>
</template>
