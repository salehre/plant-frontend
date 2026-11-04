<script setup lang="ts">
import { getPlantBySlug } from '~/services/plant.service'

definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

const route = useRoute()
const userPlantsStore = useUserPlantsStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

const userPlant = computed(() => userPlantsStore.plants.find(p => p.id === route.params.id))
const relatedTasks = computed(() => userPlantsStore.tasks.filter(task => task.userPlantId === route.params.id))

// نام علمی گیاه برای هدر؛ لود نشدنش صفحه رو نمی‌شکنه (می‌افته روی محل نگهداری)
const { data: plantInfo } = useAsyncData(
  `user-plant-info-${route.params.id}`,
  async () => userPlant.value?.plantSlug ? await getPlantBySlug(userPlant.value.plantSlug, activeLocale.value) ?? null : null,
  { watch: [activeLocale], lazy: true },
)

const taskLabelKeys: Record<string, string> = {
  water: 'components.common.taskWater',
  fertilize: 'components.common.taskFertilize',
  prune: 'components.common.taskPrune',
  repot: 'components.common.taskRepot',
  mist: 'components.common.taskMist',
}
const pendingTask = computed(() => relatedTasks.value.find(task => !task.done))
const pendingTaskLabel = computed(() => {
  const task = pendingTask.value
  if (!task) return ''
  const key = taskLabelKeys[task.type]
  return key ? t(key) : task.type
})

const healthChip: Record<string, { icon: string, class: string }> = {
  healthy: { icon: 'lucide:circle-check', class: 'bg-primary-100 text-primary-800' },
  needs_attention: { icon: 'lucide:circle-alert', class: 'bg-status-warning/20 text-ink' },
  sick: { icon: 'lucide:circle-alert', class: 'bg-status-danger/15 text-status-danger' },
}
</script>

<template>
  <div
    v-if="userPlant"
    class="flex flex-col gap-6"
  >
    <NuxtLink
      to="/my-plants"
      class="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-primary-700"
    >
      <Icon
        name="lucide:arrow-right"
        class="size-4"
      />
      {{ t('pages.myPlants.back') }}
    </NuxtLink>

    <!-- هدر گیاه -->
    <div class="flex flex-wrap items-center gap-4 rounded-2xl border border-ink/10 bg-surface p-4 shadow-card sm:p-5">
      <img
        :src="userPlant.photo"
        :alt="t('pages.myPlants.checkup.photoAlt', { name: userPlant.nickname })"
        class="size-24 shrink-0 rounded-2xl object-cover sm:size-28"
      >
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold text-ink">
          {{ userPlant.nickname }}
        </h1>
        <p
          v-if="plantInfo?.scientificName"
          class="mt-1 text-sm italic text-ink-muted"
          dir="ltr"
          :class="locale === 'fa' && 'text-end'"
        >
          {{ plantInfo.scientificName }}
        </p>
        <p class="mt-1 text-sm text-ink-muted">
          {{ userPlant.location }} · {{ t('pages.myPlants.sinceDate', { date: toJalaliDate(userPlant.acquiredAt) }) }}
        </p>
      </div>

      <span
        class="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold"
        :class="(healthChip[userPlant.healthStatus] ?? healthChip.healthy)!.class"
      >
        <Icon
          :name="(healthChip[userPlant.healthStatus] ?? healthChip.healthy)!.icon"
          class="size-5"
        />
        {{ healthLabel(userPlant.healthStatus) }}
      </span>
      <span
        v-if="pendingTaskLabel"
        class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-4 py-2.5 text-sm font-medium text-ink"
      >
        <Icon
          name="lucide:clipboard-check"
          class="size-5 text-ink-muted"
        />
        {{ t('pages.myPlants.checkup.relatedTask', { task: pendingTaskLabel }) }}
      </span>
    </div>

    <!-- بررسی وضعیت با عکس جدید -->
    <PlantCheckup :plant="userPlant" />

    <GrowthChart />

    <div>
      <h2 class="mb-3 font-bold text-ink">
        {{ t('pages.myPlants.careTasks') }}
      </h2>
      <div
        v-if="relatedTasks.length"
        class="flex flex-col gap-2"
      >
        <TaskCard
          v-for="task in relatedTasks"
          :key="task.id"
          :task="task"
          :plant-name="userPlant.nickname"
          @done="userPlantsStore.completeTask"
        />
      </div>
      <p
        v-else
        class="text-sm text-ink-muted"
      >
        {{ t('pages.myPlants.noTasks') }}
      </p>
    </div>
  </div>

  <div
    v-else
    class="py-16 text-center text-ink-muted"
  >
    {{ t('pages.myPlants.notFound') }}
  </div>
</template>
