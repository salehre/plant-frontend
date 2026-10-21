<script setup lang="ts">
import type { DiagnosisResult } from '~/types/disease.types'
import type { UserPlant } from '~/types/user.types'

const props = defineProps<{ result: DiagnosisResult, photo?: string }>()
const { t, locale } = useI18n()
const userPlantsStore = useUserPlantsStore()
const uiStore = useUiStore()

type Tab = 'treatment' | 'symptoms' | 'causes'
const tabs: Tab[] = ['treatment', 'symptoms', 'causes']

const tab = ref<Tab>('treatment')
const selectedSlug = ref(props.result.candidates[0]!.disease.slug)
const targetPlantId = ref('')
const applied = ref(false)

const selected = computed(() =>
  props.result.candidates.find(c => c.disease.slug === selectedSlug.value) ?? props.result.candidates[0]!,
)
const disease = computed(() => selected.value.disease)

// اسکن جدید = نتیجه‌ی جدید
watch(() => props.result, () => {
  selectedSlug.value = props.result.candidates[0]!.disease.slug
  tab.value = 'treatment'
  applied.value = false
})
watch([selectedSlug, targetPlantId], () => {
  applied.value = false
})

const severityKeys = {
  low: 'components.diseaseResultCard.severityLow',
  medium: 'components.diseaseResultCard.severityMedium',
  high: 'components.diseaseResultCard.severityHigh',
} as const
const severityClasses = {
  low: 'bg-primary-50 text-primary-700',
  medium: 'bg-status-warning/15 text-status-warning',
  high: 'bg-status-danger/10 text-status-danger',
} as const

// شدت مشکل → وضعیت سلامتی که روی گیاه ثبت می‌شه
const severityToHealth: Record<'low' | 'medium' | 'high', UserPlant['healthStatus']> = {
  low: 'needs_attention',
  medium: 'needs_attention',
  high: 'sick',
}

const plantOptions = computed(() =>
  userPlantsStore.plants.map(p => ({ label: p.nickname, value: p.id })),
)

const tabItems = computed(() => ({
  treatment: disease.value.treatment,
  symptoms: disease.value.symptoms,
  causes: disease.value.causes,
}))

function formatPercent(value: number) {
  return t('components.confidenceScore.percentage', {
    value: new Intl.NumberFormat(locale.value, { useGrouping: false }).format(Math.round(value * 100)),
  })
}
function formatCount(value: number) {
  return new Intl.NumberFormat(locale.value, { useGrouping: false }).format(value)
}

function applyStatus() {
  const plant = userPlantsStore.plants.find(p => p.id === targetPlantId.value)
  if (!plant) return
  const status = severityToHealth[disease.value.severity]
  userPlantsStore.updateHealthStatus(plant.id, status)
  applied.value = true
  uiStore.showToast(t('aiDoctor.result.applied', { name: plant.nickname, status: healthLabel(status) }))
}
</script>

<template>
  <div class="glass-card flex flex-col gap-5 p-4 sm:p-5">
    <!-- هدر تشخیص -->
    <div class="flex items-start gap-3">
      <span class="relative size-16 shrink-0 overflow-hidden rounded-xl bg-primary-50">
        <Icon
          name="lucide:stethoscope"
          class="absolute inset-0 m-auto size-6 text-primary-500"
        />
        <img
          v-if="photo"
          :src="photo"
          alt=""
          class="relative size-full object-cover"
        >
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-lg font-bold text-ink">
          {{ disease.name }}
        </h2>
        <div class="mt-1.5 flex flex-wrap gap-1.5">
          <span class="rounded-lg bg-primary-50 px-2 py-1 text-xs text-primary-700">
            {{ $t(`aiDoctor.categories.${disease.category}`) }}
          </span>
          <span
            class="rounded-lg px-2 py-1 text-xs font-medium"
            :class="severityClasses[disease.severity]"
          >
            {{ $t('aiDoctor.result.severity') }}: {{ $t(severityKeys[disease.severity]) }}
          </span>
        </div>
      </div>
    </div>

    <!-- میزان اطمینان -->
    <div>
      <span class="mb-1 block text-xs text-ink-muted">{{ $t('aiDoctor.result.confidence') }}</span>
      <ConfidenceScore :value="selected.confidence" />
    </div>

    <!-- احتمال‌های دیگر -->
    <div
      v-if="result.candidates.length > 1"
      class="flex flex-col gap-2"
    >
      <h3 class="text-xs font-bold text-ink-muted">
        {{ $t('aiDoctor.result.otherPossibilities') }}
      </h3>
      <ol class="flex flex-col gap-2">
        <li
          v-for="(c, index) in result.candidates"
          :key="c.disease.slug"
        >
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl border p-2.5 text-start transition-colors"
            :class="c.disease.slug === selectedSlug ? 'border-primary-500/50 bg-primary-50/60' : 'border-ink/5 hover:bg-primary-50/40'"
            :aria-pressed="c.disease.slug === selectedSlug"
            @click="selectedSlug = c.disease.slug"
          >
            <span class="w-5 shrink-0 text-center text-sm font-bold text-ink-muted">{{ formatCount(index + 1) }}</span>
            <span class="min-w-0 flex-1 truncate text-sm font-bold text-ink">{{ c.disease.name }}</span>
            <span class="shrink-0 text-sm font-bold text-primary-700">{{ formatPercent(c.confidence) }}</span>
          </button>
        </li>
      </ol>
    </div>

    <!-- تب‌ها: درمان / علائم / علل -->
    <div class="flex flex-col gap-3">
      <div class="flex gap-2 overflow-x-auto">
        <button
          v-for="item in tabs"
          :key="item"
          type="button"
          class="chip"
          :class="{ 'chip--active': tab === item }"
          @click="tab = item"
        >
          {{ $t(`aiDoctor.result.tabs.${item}`) }}
        </button>
      </div>

      <ol
        v-if="tab === 'treatment'"
        class="flex flex-col gap-2.5"
      >
        <li
          v-for="(step, index) in tabItems.treatment"
          :key="step"
          class="flex items-start gap-3"
        >
          <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">
            {{ formatCount(index + 1) }}
          </span>
          <span class="text-sm leading-6 text-ink-muted">{{ step }}</span>
        </li>
      </ol>
      <ul
        v-else
        class="flex flex-col gap-2.5"
      >
        <li
          v-for="item in tabItems[tab]"
          :key="item"
          class="flex items-start gap-3"
        >
          <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary-500" />
          <span class="text-sm leading-6 text-ink-muted">{{ item }}</span>
        </li>
      </ul>
    </div>

    <!-- ثبت وضعیت روی یکی از گیاه‌های کاربر -->
    <div class="flex flex-col gap-3 rounded-xl bg-primary-50/60 p-3">
      <h3 class="text-sm font-bold text-ink">
        {{ $t('aiDoctor.result.applyTitle') }}
      </h3>
      <template v-if="plantOptions.length">
        <FormSelect
          v-model="targetPlantId"
          :options="plantOptions"
          :placeholder="$t('aiDoctor.result.choosePlant')"
        />
        <AppButton
          class="!rounded-full"
          variant="primary"
          :disabled="!targetPlantId || applied"
          @click="applyStatus"
        >
          <Icon
            :name="applied ? 'lucide:check' : 'lucide:clipboard-check'"
            class="size-4"
          />
          {{ $t('aiDoctor.result.apply') }}
        </AppButton>
      </template>
      <div
        v-else
        class="flex flex-wrap items-center justify-between gap-2"
      >
        <p class="text-sm text-ink-muted">
          {{ $t('aiDoctor.result.noPlants') }}
        </p>
        <NuxtLink
          to="/my-plants"
          class="text-sm font-bold text-primary-700 hover:text-primary-600"
        >
          {{ $t('aiDoctor.result.addPlantCta') }}
        </NuxtLink>
      </div>
    </div>

    <p class="flex items-start gap-2 text-xs leading-6 text-ink-muted">
      <Icon
        name="lucide:info"
        class="mt-1 size-3.5 shrink-0"
      />
      {{ $t('aiDoctor.result.disclaimer') }}
    </p>
  </div>
</template>
