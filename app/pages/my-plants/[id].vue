<script setup lang="ts">
definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

const route = useRoute()
const userPlantsStore = useUserPlantsStore()
const { t } = useI18n()

const userPlant = computed(() => userPlantsStore.plants.find(p => p.id === route.params.id))
const relatedTasks = computed(() => userPlantsStore.tasks.filter(t => t.userPlantId === route.params.id))
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

    <div class="flex flex-col gap-4 sm:flex-row">
      <img
        :src="userPlant.photo"
        :alt="userPlant.nickname"
        class="h-48 w-full rounded-lg object-cover sm:w-48"
      >
      <div>
        <h1 class="text-2xl font-bold text-ink">
          {{ userPlant.nickname }}
        </h1>
        <p class="text-ink-muted">
          {{ userPlant.location }}
        </p>
        <p class="mt-2 text-sm">
          {{ t('pages.myPlants.status') }}: <span class="font-medium text-ink">{{ healthLabel(userPlant.healthStatus) }}</span>
        </p>
        <p class="mt-1 text-sm text-ink-muted">
          {{ t('pages.myPlants.sinceDate', { date: toJalaliDate(userPlant.acquiredAt) }) }}
        </p>
      </div>
    </div>

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
