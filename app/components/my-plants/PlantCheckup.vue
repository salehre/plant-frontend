<script setup lang="ts">
import { checkPlantHealth } from '~/services/plant-checkup.service'
import type { CheckupVerdict, PlantCheckupResult } from '~/types/checkup.types'
import type { UserPlant } from '~/types/user.types'

const props = defineProps<{ plant: UserPlant }>()

const { t, locale } = useI18n()
const userPlantsStore = useUserPlantsStore()
const uiStore = useUiStore()

const MAX_INPUT_SIZE = 8 * 1024 * 1024 // ۸ مگابایت (قبل از کوچک‌سازی)

type Phase = 'idle' | 'analyzing' | 'done'

const phase = ref<Phase>('idle')
const newPhoto = ref('')
const result = ref<PlantCheckupResult | null>(null)
const showMore = ref(false)
const dragging = ref(false)
const processing = ref(false)
const galleryInput = ref<HTMLInputElement | null>(null)
const cameraInput = ref<HTMLInputElement | null>(null)

let runId = 0

const busy = computed(() => processing.value || phase.value === 'analyzing')
const previousPhoto = computed(() => props.plant.photos?.at(-1)?.url ?? props.plant.photo)

const k = (key: string, params: Record<string, unknown> = {}) => t(`pages.myPlants.checkup.${key}`, params)

const verdictToHealth: Record<CheckupVerdict, UserPlant['healthStatus']> = {
  improving: 'healthy',
  stable: 'healthy',
  needs_review: 'needs_attention',
  declining: 'sick',
}

const verdictMeta: Record<CheckupVerdict, { icon: string, title: string, badge: string, ring: string }> = {
  improving: { icon: 'lucide:check', title: 'text-primary-800', badge: 'bg-primary-600', ring: 'ring-primary-100' },
  stable: { icon: 'lucide:check', title: 'text-primary-800', badge: 'bg-primary-600', ring: 'ring-primary-100' },
  needs_review: { icon: 'lucide:triangle-alert', title: 'text-ink', badge: 'bg-status-warning', ring: 'ring-status-warning/20' },
  declining: { icon: 'lucide:triangle-alert', title: 'text-status-danger', badge: 'bg-status-danger', ring: 'ring-status-danger/15' },
}

const meta = computed(() => result.value ? verdictMeta[result.value.verdict] : null)

const detailRows = computed(() => {
  const r = result.value
  if (!r) return []
  return [
    { key: 'leaves', ok: r.leaves !== 'worse', label: k('leaves.label'), value: k(`leaves.${r.leaves}`) },
    { key: 'disease', ok: r.disease === 'none', label: k('disease.label'), value: k(`disease.${r.disease}`) },
    { key: 'action', ok: r.action === 'none', label: k('action.label'), value: k(`action.${r.action}`) },
  ]
})

function reset() {
  runId++
  phase.value = 'idle'
  newPhoto.value = ''
  result.value = null
  showMore.value = false
}

async function analyze() {
  const current = ++runId
  phase.value = 'analyzing'
  result.value = null
  showMore.value = false
  try {
    const res = await checkPlantHealth({
      plantId: props.plant.id,
      previousPhoto: previousPhoto.value,
      newPhoto: newPhoto.value,
      locale: locale.value === 'fa' ? 'fa' : 'en',
    })
    if (current !== runId) return
    result.value = res
    phase.value = 'done'
  }
  catch {
    if (current !== runId) return
    phase.value = 'idle'
    uiStore.showToast(k('analyzeFailed'), 'error')
  }
}

async function handleFile(file?: File | null) {
  if (!file || busy.value) return
  if (!file.type.startsWith('image/')) {
    uiStore.showToast(k('invalidFile'), 'error')
    return
  }
  if (file.size > MAX_INPUT_SIZE) {
    uiStore.showToast(k('fileTooLarge'), 'error')
    return
  }

  processing.value = true
  try {
    newPhoto.value = await resizeImageToDataUrl(file)
  }
  catch {
    uiStore.showToast(k('processFailed'), 'error')
    return
  }
  finally {
    processing.value = false
  }
  await analyze()
}

function onPick(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = '' // تا انتخاب دوباره‌ی همون فایل هم کار کنه
  handleFile(file)
}

function onDrop(event: DragEvent) {
  dragging.value = false
  handleFile(event.dataTransfer?.files?.[0])
}

function saveAndClose() {
  if (!result.value || !newPhoto.value) return
  const saved = userPlantsStore.saveCheckup(props.plant.id, newPhoto.value, verdictToHealth[result.value.verdict])
  if (saved) uiStore.showToast(k('saved', { name: props.plant.nickname }))
  reset()
}

// گیاه عوض شد (مثلاً ناوبری بین دو گیاه) = بررسی تازه
watch(() => props.plant.id, reset)
onBeforeUnmount(() => { runId++ })
</script>

<template>
  <section
    class="flex flex-col gap-5"
    :aria-label="k('title')"
  >
    <!-- افزودن عکس و مقایسه -->
    <div class="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
      <header class="flex items-start gap-3">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
          <Icon
            name="lucide:camera"
            class="size-5"
          />
        </span>
        <div>
          <h2 class="text-lg font-bold text-ink">
            {{ k('title') }}
          </h2>
          <p class="mt-0.5 text-sm text-ink-muted">
            {{ k('hint') }}
          </p>
        </div>
      </header>

      <div class="mt-5 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.25fr)]">
        <!-- عکس جدید / عکس قبلی -->
        <div class="relative grid grid-cols-2 gap-4">
          <figure class="relative aspect-[4/5] overflow-hidden rounded-2xl bg-primary-50/70">
            <img
              v-if="newPhoto"
              :src="newPhoto"
              :alt="k('newPhoto')"
              class="size-full object-cover"
              decoding="async"
            >
            <div
              v-else
              class="flex size-full flex-col items-center justify-center gap-2 p-4 text-center text-ink-muted"
            >
              <Icon
                name="lucide:image"
                class="size-8 opacity-50"
              />
              <span class="text-xs leading-6">{{ k('newPhotoEmpty') }}</span>
            </div>
            <div
              v-if="phase === 'analyzing'"
              class="absolute inset-0 bg-primary-700/10 motion-safe:animate-pulse"
              aria-hidden="true"
            />
            <figcaption class="absolute start-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur-sm">
              {{ k('newPhoto') }}
            </figcaption>
          </figure>

          <figure class="relative aspect-[4/5] overflow-hidden rounded-2xl bg-primary-50/70">
            <img
              :src="previousPhoto"
              :alt="k('previousPhoto')"
              class="size-full object-cover"
              loading="lazy"
              decoding="async"
            >
            <figcaption class="absolute start-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur-sm">
              {{ k('previousPhoto') }}
            </figcaption>
          </figure>

          <span
            class="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink shadow-card"
            aria-hidden="true"
          >
            <Icon
              name="lucide:arrow-left-right"
              class="size-5"
            />
          </span>
        </div>

        <!-- ناحیه‌ی آپلود -->
        <div
          class="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-5 text-center transition-colors"
          :class="dragging ? 'border-primary-500 bg-primary-50' : 'border-ink/15 bg-surface'"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="onDrop"
        >
          <button
            type="button"
            class="flex flex-col items-center gap-3 rounded-xl p-2 text-ink-muted outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="busy"
            @click="galleryInput?.click()"
          >
            <Icon
              :name="processing ? 'svg-spinners:ring-resize' : 'lucide:cloud-upload'"
              class="size-12"
            />
            <span class="max-w-52 text-sm font-medium leading-7">{{ k('dropTitle') }}</span>
          </button>

          <div class="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-primary-500/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="busy"
              @click="cameraInput?.click()"
            >
              <Icon
                name="lucide:camera"
                class="size-4"
              />
              {{ k('takePhoto') }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-primary-500/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="busy"
              @click="galleryInput?.click()"
            >
              <Icon
                name="lucide:image"
                class="size-4"
              />
              {{ k('fromGallery') }}
            </button>
          </div>

          <input
            ref="galleryInput"
            type="file"
            accept="image/*"
            class="sr-only"
            tabindex="-1"
            @change="onPick"
          >
          <input
            ref="cameraInput"
            type="file"
            accept="image/*"
            capture="environment"
            class="sr-only"
            tabindex="-1"
            @change="onPick"
          >
        </div>
      </div>
    </div>

    <!-- نتیجه‌ی بررسی AI -->
    <div
      class="rounded-2xl border border-primary-200/70 bg-primary-50/60 p-5 sm:p-6"
      aria-live="polite"
    >
      <h2 class="flex items-center gap-2 text-base font-bold text-ink">
        <Icon
          name="lucide:sparkles"
          class="size-5 text-primary-600"
        />
        {{ k('resultTitle') }}
      </h2>

      <div class="mt-4 grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]">
        <!-- متن نتیجه -->
        <div class="flex flex-col gap-5">
          <div
            v-if="phase === 'done' && result && meta"
            class="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-card"
          >
            <div class="min-w-0 flex-1">
              <h3
                class="text-xl font-bold"
                :class="meta.title"
              >
                {{ k(`verdict.${result.verdict}.title`) }}
              </h3>
              <p class="mt-2 text-sm leading-7 text-ink-muted">
                {{ k(`verdict.${result.verdict}.text`) }}
              </p>
            </div>
            <span
              class="flex size-16 shrink-0 items-center justify-center rounded-full ring-8"
              :class="[meta.badge, meta.ring]"
            >
              <Icon
                :name="meta.icon"
                class="size-8 text-white"
              />
            </span>
          </div>

          <div
            v-else-if="phase === 'analyzing'"
            class="flex items-center gap-3 rounded-2xl bg-surface p-5 shadow-card"
          >
            <Icon
              name="svg-spinners:ring-resize"
              class="size-6 shrink-0 text-primary-600"
            />
            <div>
              <p class="font-bold text-ink">
                {{ k('analyzing') }}
              </p>
              <p class="mt-1 text-sm text-ink-muted">
                {{ k('analyzingHint') }}
              </p>
            </div>
          </div>

          <div
            v-else
            class="rounded-2xl bg-surface p-5 text-sm leading-7 text-ink-muted shadow-card"
          >
            {{ k('idleText') }}
          </div>

          <div v-if="phase === 'done' && result">
            <h3 class="flex items-center gap-2 text-sm font-bold text-ink">
              <Icon
                name="lucide:lightbulb"
                class="size-5 text-status-warning"
              />
              {{ k('nextTitle') }}
            </h3>
            <div class="mt-2 flex items-center gap-3 rounded-xl bg-primary-100/60 px-4 py-3 text-sm text-ink">
              <span class="min-w-0 flex-1">{{ k(`next.${result.nextStep}`) }}</span>
              <Icon
                name="lucide:calendar-check"
                class="size-5 shrink-0 text-primary-700"
              />
            </div>
          </div>
        </div>

        <!-- ربات و جزئیات تحلیل -->
        <div class="flex flex-col items-center gap-3 max-lg:order-first">
          <CheckupRobot
            :state="phase"
            class="h-40 w-auto"
          />
          <div
            v-if="phase === 'done' && result"
            class="w-full rounded-2xl bg-surface p-4 shadow-card"
          >
            <h3 class="flex items-center gap-2 text-sm font-bold text-ink">
              <Icon
                name="lucide:scan-search"
                class="size-5 text-primary-600"
              />
              {{ k('detailsTitle') }}
            </h3>
            <ul class="mt-3 space-y-2.5 text-sm">
              <li
                v-for="row in detailRows"
                :key="row.key"
                class="flex items-center gap-2"
              >
                <Icon
                  :name="row.ok ? 'lucide:circle-check' : 'lucide:triangle-alert'"
                  class="size-5 shrink-0"
                  :class="row.ok ? 'text-primary-600' : 'text-status-warning'"
                />
                <span class="text-ink">{{ row.label }}: {{ row.value }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- جزئیات بیشتر -->
      <div
        v-if="showMore && result"
        id="checkup-more"
        class="mt-5 rounded-2xl bg-surface p-5 text-sm leading-7 text-ink-muted shadow-card"
      >
        <p>{{ k('moreConfidence', { value: formatConfidence(result.confidence) }) }}</p>
        <p class="mt-1">
          {{ k('moreDisclaimer') }}
        </p>
        <NuxtLink
          v-if="result.verdict === 'needs_review' || result.verdict === 'declining'"
          to="/ai-doctor"
          class="mt-3 inline-flex items-center gap-2 font-bold text-primary-700 hover:underline"
        >
          <Icon
            name="lucide:stethoscope"
            class="size-4"
          />
          {{ k('askDoctor') }}
        </NuxtLink>
      </div>
    </div>

    <!-- اقدام‌ها -->
    <div
      v-if="phase === 'done' && result"
      class="flex flex-wrap items-center justify-between gap-3"
    >
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-primary-700/60 bg-surface px-6 py-3 text-sm font-bold text-primary-800 transition-colors hover:bg-primary-50"
        :aria-expanded="showMore"
        aria-controls="checkup-more"
        @click="showMore = !showMore"
      >
        <Icon
          name="lucide:chevron-down"
          class="size-4 transition-transform motion-reduce:transition-none"
          :class="showMore && 'rotate-180'"
        />
        {{ showMore ? k('less') : k('more') }}
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full bg-primary-700 px-8 py-3 text-sm font-bold text-white shadow-card transition-colors hover:bg-primary-800"
        @click="saveAndClose"
      >
        <Icon
          name="lucide:check"
          class="size-4"
        />
        {{ k('saveClose') }}
      </button>
    </div>
  </section>
</template>
