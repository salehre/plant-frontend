<script setup lang="ts">
import { mockPlants } from '~/services/mock/plants.mock'

const route = useRoute()

const slugs = computed(() => {
  const param = route.params.slugs
  return Array.isArray(param) ? param : param ? [param] : []
})

const selectedPlants = computed(() =>
    slugs.value.map(slug => mockPlants.find(p => p.slug === slug)).filter((p): p is NonNullable<typeof p> => !!p),
)

const pickerA = ref(slugs.value[0] ?? '')
const pickerB = ref(slugs.value[1] ?? '')

const plantOptions = mockPlants.map(p => ({ label: p.name, value: p.slug }))

function goCompare() {
  if (!pickerA.value || !pickerB.value) return
  navigateTo(`/compare/${pickerA.value}/${pickerB.value}`)
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10">
    <h1 class="mb-2 text-2xl font-bold text-ink">
      مقایسه گیاهان
    </h1>
    <p class="mb-6 text-ink-muted">
      دو گیاه را انتخاب کن تا شرایط نگهداری‌شان را کنار هم ببینی.
    </p>

    <div class="glass-card mb-8 flex flex-col items-center gap-3 p-4 sm:flex-row">
      <div class="w-full flex-1">
        <AppDropdown
            v-model="pickerA"
            :options="plantOptions"
            placeholder="گیاه اول"
        />
      </div>
      <Icon
          name="lucide:arrow-left-right"
          class="size-5 shrink-0 text-ink-muted"
      />
      <div class="w-full flex-1">
        <AppDropdown
            v-model="pickerB"
            :options="plantOptions"
            placeholder="گیاه دوم"
        />
      </div>
      <AppButton
          variant="primary"
          @click="goCompare"
      >
        مقایسه کن
      </AppButton>
    </div>

    <CompareTable
        v-if="selectedPlants.length >= 2"
        :plants="selectedPlants"
    />

    <div
        v-else
        class="flex flex-col items-center gap-3 py-16 text-center text-ink-muted"
    >
      <Icon
          name="lucide:git-compare"
          class="size-10"
      />
      برای شروع، دو گیاه از بالا انتخاب کن.
    </div>
  </div>
</template>