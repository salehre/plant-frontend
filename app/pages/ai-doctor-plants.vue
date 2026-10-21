<script setup lang="ts">
definePageMeta({ layout: 'ai-doctor' })

const { t } = useI18n()
const aiDoctorStore = useAiDoctorStore()
const plants = useUserPlantOptions()

// تعداد گفتگوهای وصل‌شده به هر گیاه
const chatCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const conv of aiDoctorStore.conversations) {
    for (const id of conv.plantIds ?? []) counts[id] = (counts[id] ?? 0) + 1
  }
  return counts
})

function chatAbout(id: string) {
  aiDoctorStore.newChat([id])
  navigateTo('/ai-doctor')
}
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="flex items-center gap-3 px-4 py-3 sm:px-6">
      <NuxtLink
        to="/ai-doctor"
        class="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
        :aria-label="t('common.back')"
        :title="t('common.back')"
      >
        <Icon
          name="lucide:arrow-right"
          class="size-5 ltr:rotate-180"
        />
      </NuxtLink>
      <div class="min-w-0 flex-1">
        <h1 class="truncate text-base font-bold text-ink sm:text-lg">
          {{ t('aiDoctor.myPlants') }}
        </h1>
        <p class="truncate text-xs text-ink-muted">
          {{ t('aiDoctor.myPlantsSubtitle') }}
        </p>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-y-auto px-4 pb-8 sm:px-6">
      <div
        v-if="!plants.length"
        class="mx-auto mt-16 flex max-w-sm flex-col items-center gap-4 text-center"
      >
        <p class="text-sm leading-7 text-ink-muted">
          {{ t('aiDoctor.noPlants') }}
        </p>
        <NuxtLink
          to="/my-plants"
          class="rounded-full bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {{ t('pages.myPlants.addPlant') }}
        </NuxtLink>
      </div>

      <ul
        v-else
        class="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        <li
          v-for="plant in plants"
          :key="plant.id"
          class="flex flex-col gap-3 rounded-2xl border border-ink/5 bg-surface p-3"
        >
          <div class="flex items-center gap-3">
            <img
              :src="plant.photo"
              alt=""
              class="size-14 shrink-0 rounded-xl object-cover"
            >
            <div class="min-w-0 flex-1">
              <h2 class="truncate text-sm font-bold text-ink">
                {{ plant.nickname }}
              </h2>
              <p class="truncate text-xs text-ink-muted">
                {{ plant.species }}
              </p>
              <p
                v-if="chatCounts[plant.id]"
                class="mt-1 text-[11px] text-primary-700"
              >
                {{ t('aiDoctor.plantChatsCount', { count: chatCounts[plant.id] }) }}
              </p>
            </div>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-ink/10 px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-primary-50 hover:text-primary-700"
            @click="chatAbout(plant.id)"
          >
            <Icon
              name="lucide:stethoscope"
              class="size-4"
            />
            {{ t('aiDoctor.chatAboutPlant') }}
          </button>
        </li>
      </ul>
    </main>
  </div>
</template>