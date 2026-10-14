<script setup lang="ts">
definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

const userPlantsStore = useUserPlantsStore()
const { t } = useI18n()

type Tab = 'upcoming' | 'week' | 'all'
const tab = ref<Tab>('upcoming')
const selectedDay = ref<string | null>(null) // روز انتخاب‌شده توی نوار هفته؛ null = بدون فیلتر روز
const tabs: { key: Tab, label: string }[] = [
  { key: 'upcoming', label: 'pages.careCalendar.upcoming' },
  { key: 'week', label: 'pages.careCalendar.thisWeek' },
  { key: 'all', label: 'common.all' },
]

const allTasks = computed(() => [...userPlantsStore.todayTasks, ...userPlantsStore.upcomingTasks])

const visibleTasks = computed(() => {
  if (selectedDay.value) return allTasks.value.filter(task => task.dueDate === selectedDay.value)
  if (tab.value === 'all') return allTasks.value
  if (tab.value === 'week') {
    const limit = new Date()
    limit.setDate(limit.getDate() + 7)
    const limitIso = limit.toISOString().slice(0, 10)
    return allTasks.value.filter(task => task.dueDate <= limitIso)
  }
  return userPlantsStore.upcomingTasks
})

function plantNickname(userPlantId: string) {
  return userPlantsStore.plants.find(p => p.id === userPlantId)?.nickname ?? ''
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold text-ink">
      {{ t('nav.careCalendar') }}
    </h1>

    <CareCalendar
      v-model="selectedDay"
      :tasks="allTasks"
    />

    <div>
      <div class="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="item in tabs"
          :key="item.key"
          type="button"
          class="chip"
          :class="{ 'chip--active': tab === item.key && !selectedDay }"
          @click="tab = item.key; selectedDay = null"
        >
          {{ t(item.label) }}
        </button>
      </div>

      <div
        v-if="visibleTasks.length"
        class="flex flex-col gap-2"
      >
        <TaskCard
          v-for="task in visibleTasks"
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
