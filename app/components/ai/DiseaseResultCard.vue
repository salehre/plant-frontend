<script setup lang="ts">
// 🧊 فریز‌شده برای فاز ۲ (طبق mvp-alignment-checklist.md).
// Health Check/Disease Detection از MVP فعلی کنار گذاشته شده؛ این کامپوننت جایی
// استفاده نمی‌شه، فقط برای وقتی که آن فیچر برگرده نگه داشته شده - حذفش نکن.
import type { DiseaseDetectionResult } from '~/types/identify.types'
import { en, fa } from '~/i18n/componentMessages'

const props = defineProps<{ result: DiseaseDetectionResult }>()
const { t } = useI18n({ messages: { en, fa }, useScope: 'local' })

const severityMap = {
  low: { label: 'components.diseaseResultCard.severityLow', class: 'bg-status-info/10 text-status-info' },
  medium: { label: 'components.diseaseResultCard.severityMedium', class: 'bg-status-warning/10 text-status-warning' },
  high: { label: 'components.diseaseResultCard.severityHigh', class: 'bg-status-danger/10 text-status-danger' },
}
</script>

<template>
  <div class="glass-card p-5">
    <div class="flex items-center justify-between">
      <h3 class="flex items-center gap-2 font-bold text-ink">
        <Icon
            name="lucide:shield-alert"
            class="size-5 text-status-danger"
        />
        {{ props.result.diseaseName }}
      </h3>
      <span
          class="rounded-full px-2.5 py-1 text-xs font-medium"
          :class="severityMap[props.result.severity].class"
      >
        {{ t(severityMap[props.result.severity].label) }}
      </span>
    </div>

    <p class="mt-3 text-sm leading-relaxed text-ink-muted">
      {{ props.result.description }}
    </p>

    <div class="mt-4">
      <p class="mb-2 text-sm font-medium text-ink">
        {{ t('components.diseaseResultCard.treatmentSteps') }}
      </p>
      <ul class="flex flex-col gap-1.5">
        <li
            v-for="(step, i) in props.result.treatmentSteps"
            :key="i"
            class="flex items-start gap-2 text-sm text-ink-muted"
        >
          <Icon
              name="lucide:check"
              class="mt-0.5 size-4 shrink-0 text-primary-600"
          />
          {{ step }}
        </li>
      </ul>
    </div>
  </div>
</template>