<script setup lang="ts">
import type { IdentifyResult } from '~/types/identify.types'

const props = defineProps<{ result: IdentifyResult }>()
</script>

<template>
  <div class="overflow-hidden glass-card">
    <div class="flex items-center gap-2 bg-primary-50 px-5 py-3 text-primary-700">
      <Icon
          name="lucide:sparkles"
          class="size-5"
      />
      <span class="text-sm font-medium">گیاه تو شناسایی شد</span>
    </div>

    <div class="flex flex-col gap-4 p-5 sm:flex-row">
      <img
          :src="props.result.image"
          :alt="props.result.plantName"
          class="h-32 w-32 shrink-0 rounded-md object-cover"
      >
      <div class="flex-1">
        <h3 class="text-xl font-bold text-ink">
          {{ props.result.plantName }}
        </h3>
        <p class="text-sm italic text-ink-muted">
          {{ props.result.scientificName }}
        </p>

        <div class="mt-3">
          <span class="mb-1 block text-xs text-ink-muted">{{ $t('identify.confidence') }}</span>
          <ConfidenceScore :value="props.result.confidence" />
        </div>

        <NuxtLink
            v-if="props.result.slug"
            :to="`/plants/${props.result.slug}`"
            class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          مشاهده اطلاعات کامل گیاه
          <Icon
              name="lucide:arrow-left"
              class="size-4"
          />
        </NuxtLink>
      </div>
    </div>

    <div
        v-if="props.result.similarSpecies.length"
        class="border-t border-ink/5 px-5 py-4"
    >
      <p class="mb-2 text-xs font-medium text-ink-muted">
        گونه‌های مشابه احتمالی
      </p>
      <div class="flex flex-col gap-2">
        <div
            v-for="sp in props.result.similarSpecies"
            :key="sp.scientificName"
            class="flex items-center justify-between text-sm"
        >
          <span class="text-ink">{{ sp.name }}</span>
          <span class="text-ink-muted">{{ toPersianDigits(Math.round(sp.confidence * 100)) }}٪</span>
        </div>
      </div>
    </div>
  </div>
</template>