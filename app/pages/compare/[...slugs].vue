<script setup lang="ts">
import { getMockPlants } from '~/services/mock/plants.mock'

const route = useRoute()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')
const localizedPlants = computed(() => getMockPlants(activeLocale.value))

const slugs = computed(() => {
  const param = route.params.slugs
  return Array.isArray(param) ? param : param ? [param] : []
})

const selectedPlants = computed(() =>
    slugs.value.map(slug => localizedPlants.value.find(p => p.slug === slug)).filter((p): p is NonNullable<typeof p> => !!p),
)

const pickerA = ref(slugs.value[0] ?? '')
const pickerB = ref(slugs.value[1] ?? '')

const plantOptions = computed(() => localizedPlants.value.map(p => ({ label: p.name, value: p.slug })))

function goCompare() {
  if (!pickerA.value || !pickerB.value) return
  navigateTo(`/compare/${pickerA.value}/${pickerB.value}`)
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10">
    <h1 class="mb-2 text-2xl font-bold text-ink">
      {{ t('pages.compare.title') }}
    </h1>
    <p class="mb-6 text-ink-muted">
      {{ t('pages.compare.subtitle') }}
    </p>

    <div class="glass-card mb-8 flex flex-col items-center gap-3 p-4 sm:flex-row">
      <div class="w-full flex-1">
        <AppDropdown
            v-model="pickerA"
            :options="plantOptions"
            :placeholder="t('pages.compare.firstPlant')"
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
            :placeholder="t('pages.compare.secondPlant')"
        />
      </div>
      <AppButton
          variant="primary"
          @click="goCompare"
      >
        {{ t('pages.compare.compare') }}
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
      {{ t('pages.compare.empty') }}
    </div>
  </div>
</template>