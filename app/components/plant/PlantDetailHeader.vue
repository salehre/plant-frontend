<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'
import type { Plant } from '~/types/plant.types'

const props = defineProps<{ plant: Plant }>()
const { t } = useI18n({ messages: { en, fa }, useScope: 'local' })

const difficultyClass: Record<string, string> = {
  easy: 'bg-primary-50 text-primary-700',
  medium: 'bg-status-warning/10 text-status-warning',
  hard: 'bg-status-danger/10 text-status-danger',
}
const difficultyKeys: Record<string, string> = {
  easy: 'components.common.difficultyEasy',
  medium: 'components.common.difficultyMedium',
  hard: 'components.common.difficultyHard',
}
const difficultyLabel = computed(() => {
  const key = difficultyKeys[props.plant.difficulty]
  return key ? t(key) : props.plant.difficulty
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-wrap items-center gap-2">
      <span class="rounded-full bg-ink/5 px-2.5 py-1 text-xs text-ink-muted">{{ props.plant.category }}</span>
      <span
        class="rounded-full px-2.5 py-1 text-xs font-medium"
        :class="difficultyClass[props.plant.difficulty]"
      >
        {{ t('components.plantDetailHeader.careLevel', { level: difficultyLabel }) }}
      </span>
      <span
        v-if="props.plant.toxicity.isToxic"
        class="inline-flex items-center gap-1 rounded-full bg-status-danger/10 px-2.5 py-1 text-xs text-status-danger"
      >
        <Icon
          name="lucide:alert-triangle"
          class="size-3.5"
        />
        {{ t('components.plantDetailHeader.toxicForPets') }}
      </span>
    </div>
    <h1 class="text-2xl font-bold text-ink sm:text-3xl">
      {{ props.plant.name }}
    </h1>
    <p class="text-sm italic text-ink-muted">
      {{ props.plant.scientificName }}
    </p>
    <p class="text-xs text-ink-muted">
      {{ t('components.plantDetailHeader.family') }} <NuxtLink
        :to="{ path: '/plants', query: { family: props.plant.family } }"
        class="text-primary-700 hover:underline"
      >{{ props.plant.family }}</NuxtLink>
      · {{ t('components.plantDetailHeader.genus') }} <NuxtLink
        :to="{ path: '/plants', query: { genus: props.plant.genus } }"
        class="text-primary-700 hover:underline"
      >{{ props.plant.genus }}</NuxtLink>
    </p>
  </div>
</template>
