<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'
import type { IdentifyResult } from '~/types/identify.types'

const props = defineProps<{ result: IdentifyResult }>()
const { t } = useI18n({ messages: { en, fa }, useScope: 'local' })
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="glass-card flex items-center gap-2 bg-primary-50 px-5 py-3 text-primary-700">
      <Icon
        name="lucide:sparkles"
        class="size-5"
      />
      <span class="text-sm font-medium">{{ t('components.predictionCard.identified') }}</span>
    </div>

    <!-- نتیجه‌ی اصلی: هم‌شکل کارت‌های تاریخچه و علاقه‌مندی‌ها، ولی از اول بازه -->
    <PlantResultCard
      :name="props.result.plantName"
      :scientific-name="props.result.scientificName"
      :image="props.result.image"
      :slug="props.result.slug"
      :confidence="props.result.confidence"
      default-open
    />

    <section v-if="props.result.similarSpecies.length">
      <p class="mb-2 text-xs font-medium text-ink-muted">
        {{ t('components.predictionCard.similarSpecies') }}
      </p>
      <div class="flex flex-col gap-3">
        <PlantResultCard
          v-for="sp in props.result.similarSpecies"
          :key="sp.scientificName"
          :name="sp.name"
          :scientific-name="sp.scientificName"
          :image="sp.image"
          :slug="sp.slug"
          :confidence="sp.confidence"
        />
      </div>
    </section>
  </div>
</template>