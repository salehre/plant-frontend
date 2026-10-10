<script setup lang="ts">
import { ref, computed } from 'vue'
import { getMockDiseases } from '~/services/mock/diseases.mock'
import { findPlantDetailBySlug } from '~/services/mock/plant-details.mock'

const route = useRoute()
const plantStore = usePlantStore()
const wishlistStore = useWishlistStore()
const uiStore = useUiStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

const slug = route.params.slug as string
await useAsyncData(
  `plant-${slug}-${activeLocale.value}`,
  () => plantStore.fetchBySlug(slug, activeLocale.value, t('errors.plantDetail')).then(() => true),
)
watch(activeLocale, locale => plantStore.fetchBySlug(slug, locale, t('errors.plantDetail')))

const plant = computed(() => plantStore.current)
const detail = computed(() => findPlantDetailBySlug(slug, activeLocale.value))
const chemicalCompoundsExpanded = ref(false)

function findDisease(id: string) {
  return getMockDiseases(activeLocale.value).find(d => d.id === id)
}

// ============ اسکرول به بخش حفاظت (از روی بج وضعیت حفاظتی) ============
const targetSection = ref<HTMLElement | null>(null)
function goToTarget() {
  const el = targetSection.value
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 70
  window.scrollTo({ top, behavior: 'smooth' })
}

// ============ نشان‌کردن (وصل به wishlistStore واقعی) و اشتراک‌گذاری ============
const isBookmarked = computed(() => wishlistStore.isWishlisted(slug))
function toggleBookmark() {
  wishlistStore.toggle(slug, {
    added: t('plantDetail.addedToWishlist'),
    removed: t('plantDetail.removedFromWishlist'),
  })
}
async function sharePlant() {
  if (!plant.value) return
  const shareData = { title: plant.value.name, text: plant.value.scientificName, url: window.location.href }
  try {
    if (navigator.share) {
      await navigator.share(shareData)
    }
    else {
      await navigator.clipboard.writeText(window.location.href)
      uiStore.showToast(t('plantDetail.linkCopied'), 'success')
    }
  }
  catch {
    // کاربر اشتراک‌گذاری رو لغو کرده - نیازی به توست خطا نیست
  }
}

// ============ گالری تصاویر ============
const galleryDialog = ref(false)
const galleryIndex = ref(0)
const galleryCurrentImage = computed(() => detail.value?.gallery[galleryIndex.value])
function openGallery(index: number) {
  galleryIndex.value = index
  galleryDialog.value = true
}
function closeGallery() {
  galleryDialog.value = false
}
function nextImage() {
  if (detail.value && galleryIndex.value < detail.value.gallery.length - 1) galleryIndex.value++
}
function prevImage() {
  if (galleryIndex.value > 0) galleryIndex.value--
}

// ============ برچسب‌های جدول‌ها ============
const filteredTaxonomy = computed(() => {
  if (!detail.value) return {}
  const { authority, ...rest } = detail.value.taxonomy
  return rest
})

const taxonomyLabels = computed<Record<string, string>>(() => ({
  kingdom: t('plantDetail.taxonomy.kingdom'),
  division: t('plantDetail.taxonomy.division'),
  class: t('plantDetail.taxonomy.class'),
  order: t('plantDetail.taxonomy.order'),
  family: t('plantDetail.taxonomy.family'),
  genus: t('plantDetail.taxonomy.genus'),
  species: t('plantDetail.taxonomy.species'),
  subspecies: t('plantDetail.taxonomy.subspecies'),
}))
const getTaxonomyLabel = (key: string) => taxonomyLabels.value[key] || key

const morphLabels = computed<Record<string, string>>(() => ({
  plantType: t('plantDetail.morphology.plantType'),
  leaf: t('plantDetail.morphology.leaf'),
  flower: t('plantDetail.morphology.flower'),
  stem: t('plantDetail.morphology.stem'),
  root: t('plantDetail.morphology.root'),
  fruit: t('plantDetail.morphology.fruit'),
  seed: t('plantDetail.morphology.seed'),
  bark: t('plantDetail.morphology.bark'),
  latex: t('plantDetail.morphology.latex'),
}))
const getMorphLabel = (key: string) => morphLabels.value[key] || key

const needLabels = computed<Record<string, string>>(() => ({
  light: t('plantDetail.requirements.light'),
  water: t('plantDetail.requirements.water'),
  soil: t('plantDetail.requirements.soil'),
  temperature: t('plantDetail.requirements.temperature'),
  growthAltitude: t('plantDetail.requirements.growthAltitude'),
}))
const getNeedLabel = (key: string) => needLabels.value[key] || key

const growthIcons: Record<string, string> = {
  light: 'lucide:sun',
  water: 'lucide:droplets',
  soil: 'lucide:mountain',
  temperature: 'lucide:thermometer',
  growthAltitude: 'lucide:trending-up',
}
</script>

<template>
  <div
      v-if="plantStore.loading"
      class="mx-auto max-w-5xl px-4 py-10"
  >
    <AppSkeleton
        height="400px"
        rounded="rounded-lg"
    />
  </div>

  <div
      v-else-if="plant && detail"
      class="plant-detail-page text-readable min-h-screen bg-bg pb-10"
  >
    <!-- ========== هدر ========== -->
    <div class="relative overflow-visible bg-gradient-to-l from-primary-900 via-primary-800 to-primary-700 px-4 pb-4 pt-10 text-white sm:px-8 sm:pt-14">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:items-end">
        <div class="relative -mb-14 shrink-0 sm:-mb-16">
          <img
              :src="detail.image"
              :alt="plant.name"
              class="size-28 rounded-full border-4 border-surface object-cover shadow-card-hover sm:size-40"
          >
        </div>

        <div class="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-right">
          <h1 class="text-2xl font-bold sm:text-4xl">
            {{ plant.name }}
          </h1>
          <p class="text-sm italic opacity-85 sm:text-base">
            {{ plant.scientificName }}
          </p>
          <p class="text-xs opacity-70 sm:text-sm">
            {{ t('plantDetail.authority') }}: {{ detail.taxonomy.authority }}
          </p>

          <button
              type="button"
              class="mt-1 inline-flex items-center gap-1 rounded-lg bg-accent-400/90 px-3 py-1.5 text-xs font-semibold text-primary-900 transition hover:bg-accent-300"
              @click="goToTarget"
          >
            {{ t('plantDetail.conservationStatus') }}: {{ detail.conservationBadge }}
          </button>

          <div class="mt-1 flex items-center gap-2">
            <button
                type="button"
                class="flex size-9 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-accent-400 hover:text-primary-900"
                :aria-pressed="isBookmarked"
                :aria-label="isBookmarked ? t('plantDetail.removeFromWishlist') : t('plantDetail.addToWishlist')"
                @click="toggleBookmark"
            >
              <Icon :name="isBookmarked ? 'lucide:bookmark-check' : 'lucide:bookmark'" class="size-4" />
            </button>
            <button
                type="button"
                class="flex size-9 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-accent-400 hover:text-primary-900"
                :aria-label="t('plantDetail.share')"
                @click="sharePlant"
            >
              <Icon name="lucide:share-2" class="size-4" />
            </button>
            <button
                type="button"
                class="flex size-9 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-accent-400 hover:text-primary-900"
                :aria-label="t('plantDetail.compare')"
                @click="navigateTo(`/compare/${slug}`)"
            >
              <Icon name="lucide:git-compare" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-4 pt-16 sm:px-8 sm:pt-20">
      <!-- ========== آمار سریع ========== -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div
            v-for="stat in detail.quickStats"
            :key="stat.label"
            class="glass-card flex flex-col items-center justify-center gap-1.5 px-3 py-4 text-center transition hover:-translate-y-0.5"
        >
          <span class="text-sm font-bold text-primary-900">{{ stat.value }}</span>
          <span class="text-[0.65rem] uppercase tracking-wide text-ink-muted">{{ stat.label }}</span>
        </div>
      </div>

      <!-- ========== محتوای اصلی ========== -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- ستون اول -->
        <div class="flex flex-col gap-6 lg:col-span-7">
          <!-- راهنمای نگهداری روزانه -->
<!--          <section class="glass-card p-5 sm:p-6">-->
<!--            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">-->
<!--              راهنمای نگهداری روزانه-->
<!--              <span class="text-xs font-normal tracking-wide text-ink-muted">Care Guide</span>-->
<!--            </h2>-->
<!--            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />-->
<!--            <CareInfoCard :plant="plant" />-->
<!--          </section>-->

          <!-- طبقه‌بندی علمی -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('plantDetail.taxonomyTitle') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">Taxonomy</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <table class="w-full overflow-hidden rounded-md text-center text-sm">
              <tbody>
              <tr v-for="(value, key) in filteredTaxonomy" :key="key" class="border-b border-ink/10 last:border-0">
                <td class="w-2/5 bg-bg px-4 py-3 text-xs font-semibold text-primary-900">
                  {{ getTaxonomyLabel(key) }}
                </td>
                <td class="px-4 py-3 text-xs text-ink">
                  {{ value }}
                </td>
              </tr>
              <tr>
                <td class="w-2/5 bg-bg px-4 py-3 text-xs font-semibold text-primary-900">
                  {{ t('plantDetail.authority') }} (Authority)
                </td>
                <td class="px-4 py-3 text-xs text-ink">
                  {{ detail.taxonomy.authority }}
                </td>
              </tr>
              </tbody>
            </table>
          </section>

          <!-- ویژگی‌های زیست‌شناسی -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('plantDetail.morphologyTitle') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">Morphology</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="grid grid-cols-2 gap-3">
              <div
                  v-for="(value, key) in detail.morphology"
                  :key="key"
                  class="rounded-md border border-ink/10 bg-bg p-3 transition hover:-translate-x-1 hover:shadow-card"
              >
                <div class="flex items-center gap-1.5 border-b border-dashed border-ink/15 pb-1.5 text-xs text-ink-muted">
                  <span class="text-accent-500">●</span>
                  <strong>{{ getMorphLabel(key) }}</strong>
                </div>
                <div class="mt-2 text-sm leading-relaxed text-ink">
                  {{ value }}
                </div>
              </div>
            </div>
          </section>

          <!-- کاربردها -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('plantDetail.applicationsTitle') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">Applications</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="space-y-3">
              <div>
                <span class="text-status-success">● </span>
                <strong class="text-sm">{{ t('plantDetail.edible') }} :</strong>
                <ul class="mr-5 mt-1.5 list-none space-y-1.5">
                  <li v-for="item in detail.applications.food" :key="item" class="text-sm text-ink">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <span class="text-status-info">● </span>
                <strong class="text-sm">{{ t('plantDetail.industrial') }} :</strong>
                <ul class="mr-5 mt-1.5 list-none space-y-1.5">
                  <li v-for="item in detail.applications.industrial" :key="item" class="text-sm text-ink">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <span class="text-accent-600">● </span>
                <strong class="text-sm">{{ t('plantDetail.therapeutic') }} :</strong>
                <ul class="mr-5 mt-1.5 list-none space-y-1.5">
                  <li v-for="item in detail.applications.therapeutic" :key="item" class="text-sm text-ink">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- ترکیبات شیمیایی -->
          <section class="glass-card p-5 sm:p-6">
            <div class="flex items-center justify-between gap-3">
              <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
                {{ t('plantDetail.chemicalCompounds') }}
                <span class="text-xs font-normal tracking-wide text-ink-muted">Phytochemistry</span>
              </h2>
              <button
                  v-if="detail.chemicalCompounds.categories.length"
                  type="button"
                  class="flex size-9 shrink-0 items-center justify-center rounded-lg text-primary-900 border border-transparent transition hover:border-primary-200 hover:text-primary-900"
                  :aria-expanded="chemicalCompoundsExpanded"
                  aria-controls="chemical-compound-details"
                  :aria-label="t(chemicalCompoundsExpanded ? 'plantDetail.hideCompounds' : 'plantDetail.showCompounds')"
                  @click="chemicalCompoundsExpanded = !chemicalCompoundsExpanded"
              >
                <Icon :name="chemicalCompoundsExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="size-4" />
              </button>
            </div>

            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />

            <div class="rounded-[14px] border-s-4 border-accent-400 bg-bg px-4 py-3">
              <span class="block text-xs font-semibold text-ink-muted">{{ t('plantDetail.mainActiveCompound') }}:</span>
              <span class="text-sm font-medium text-primary-900">{{ detail.chemicalCompounds.majorCompound }}</span>
            </div>
            <div
                id="chemical-compound-details"
                class="grid transition-[grid-template-rows] duration-300 ease-out"
                :class="chemicalCompoundsExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="min-h-0 overflow-hidden" :inert="!chemicalCompoundsExpanded">
                <div class="flex flex-col gap-5 pt-5">
                  <div
                      v-for="(cat, idx) in detail.chemicalCompounds.categories"
                      :key="idx"
                      class="border-b border-ink/10 pb-3 last:border-0 last:pb-0"
                  >
                    <div class="mb-2 flex flex-wrap items-baseline justify-between gap-1">
                      <strong class="text-sm text-primary-900">{{ cat.name }}</strong>
                      <span class="rounded-lg bg-bg px-2 py-0.5 text-xs text-ink-muted">{{ cat.total }}</span>
                    </div>
                    <ul v-if="cat.compounds?.length" class="list-none space-y-1">
                      <li
                          v-for="(comp, cidx) in cat.compounds"
                          :key="cidx"
                          class="flex items-baseline justify-between gap-2 border-b border-dashed border-ink/10 py-1 text-xs last:border-0"
                      >
                        <span class="font-medium text-ink">{{ comp.name }}</span>
                        <span class="shrink-0 rounded-lg bg-bg px-2 py-0.5 text-ink-muted">{{ comp.amount }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- ستون دوم -->
        <div class="flex flex-col gap-6 lg:col-span-5">
          <!-- نیازهای رشدی -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('plantDetail.growthRequirements') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">Growth Requirements</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex flex-col gap-3">
              <div
                  v-for="(value, key) in detail.growthNeeds"
                  :key="key"
                  class="flex items-center gap-3 border-b border-ink/10 pb-3 last:border-0 last:pb-0"
              >
                <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                  <Icon :name="growthIcons[key]" class="size-4" />
                </span>
                <div>
                  <div class="text-[0.7rem] font-semibold uppercase tracking-wide text-primary-900">
                    {{ getNeedLabel(key) }}
                  </div>
                  <div class="text-sm text-ink-muted">
                    {{ value }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- داستان گیاه -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('plantDetail.story') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">Plant Story</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <p class="text-justify text-sm leading-8 text-ink">
              {{ detail.plantStory }}
            </p>
          </section>

          <!-- سمّیت -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('plantDetail.toxicity') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">Toxicity</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex items-center gap-3 rounded-[14px] border-s-4 border-status-warning bg-status-warning/10 px-4 py-3">
              <Icon name="lucide:triangle-alert" class="size-5 shrink-0 text-status-warning" />
              <div class="text-sm text-ink"><strong>{{ t('plantDetail.toxicity') }}:</strong> {{ detail.toxicityText }}</div>
            </div>
          </section>

          <!-- مشکلات رایج -->
          <section
              v-if="plant.commonIssues.length"
              class="glass-card p-5 sm:p-6"
          >
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('plantDetail.commonProblems') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">Common Issues</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex flex-col gap-3">
              <template v-for="issueId in plant.commonIssues" :key="issueId">
                <NuxtLink
                    v-if="findDisease(issueId)"
                    to="/identify"
                    class="flex gap-3 rounded-md border border-ink/10 p-3 transition hover:-translate-x-1 hover:shadow-card"
                >
                  <img
                      :src="findDisease(issueId)!.image"
                      :alt="findDisease(issueId)!.name"
                      class="size-14 shrink-0 rounded-md object-cover"
                      loading="lazy"
                  >
                  <div>
                    <p class="text-sm font-medium text-ink">
                      {{ findDisease(issueId)!.name }}
                    </p>
                    <p class="mt-1 text-xs text-ink-muted">
                      {{ findDisease(issueId)!.symptoms[0] }}
                    </p>
                  </div>
                </NuxtLink>
              </template>
            </div>
          </section>

          <!-- حفاظت -->
          <section ref="targetSection" class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('plantDetail.conservation') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">Status</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex items-center gap-3 rounded-[14px] border-s-4 border-status-info bg-status-info/10 px-4 py-3">
              <Icon name="lucide:shield" class="size-5 shrink-0 text-status-info" />
              <div class="text-sm text-ink"><strong>{{ t('plantDetail.conservationStatus') }}:</strong> {{ detail.conservationStatus }}</div>
            </div>
          </section>

          <!-- نام‌های محلی -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('plantDetail.localNames') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">Local Names</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex flex-wrap gap-3">
              <div
                  v-for="item in detail.localNames"
                  :key="item.name"
                  class="rounded-lg bg-bg px-3.5 py-1.5 text-sm"
              >
                <span class="font-semibold text-primary-900">{{ item.name }}</span>
                <span class="mr-1 text-xs text-ink-muted">({{ item.region }})</span>
              </div>
            </div>
          </section>

          <!-- مترادف‌های علمی -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('plantDetail.scientificSynonyms') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">Synonyms</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex flex-col gap-2.5">
              <div
                  v-for="synonym in detail.scientificSynonyms"
                  :key="synonym"
                  class="flex items-center gap-2 border-b border-ink/10 pb-2.5 text-sm last:border-0 last:pb-0"
              >
                <span class="text-accent-500">▹</span>
                <span class="italic">{{ synonym }}</span>
              </div>
            </div>
          </section>

          <!-- دوره فسیلی -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('plantDetail.fossilPeriod') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">Fossil Record</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
              <span class="mt-0.5 shrink-0 text-accent-500">◈</span>
              {{ detail.fossilPeriod }}
            </div>
          </section>
        </div>
      </div>

      <!-- ========== گالری تصاویر ========== -->
      <section class="glass-card group mt-7 p-5 overflow-hidden text-right transition hover:-translate-y-1">
        <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
          {{ t('plantDetail.gallery') }}
          <span class="text-xs font-normal tracking-wide text-ink-muted">Image Gallery</span>
        </h2>
        <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <button
              v-for="(image, index) in detail.gallery"
              :key="index"
              type="button"
              class="group overflow-hidden rounded-lg border border-ink/10 text-right transition hover:-translate-y-1 hover:shadow-card-hover"
              @click="openGallery(index)"
          >
            <div class="h-[140px] overflow-hidden sm:h-[180px]">
              <img
                  :src="image.thumb"
                  :alt="image.title"
                  loading="lazy"
                  class="size-full object-cover transition duration-300 group-hover:scale-105"
              >
            </div>
            <div class="p-2 text-center text-xs text-ink-muted">
              {{ image.title }}
            </div>
          </button>
        </div>
      </section>
    </div>

    <!-- ========== لایت‌باکس گالری ========== -->
    <Teleport to="body">
      <div
          v-if="galleryDialog"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          @click.self="closeGallery"
      >
        <div class="w-full max-w-2xl overflow-hidden rounded-lg bg-surface">
          <div class="flex items-center justify-between px-4 py-3">
            <span class="text-sm font-semibold text-ink">{{ galleryCurrentImage?.title }}</span>
            <button type="button" class="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-bg" @click="closeGallery">
              <Icon name="lucide:x" class="size-4" />
            </button>
          </div>
          <img
              :src="galleryCurrentImage?.full"
              :alt="galleryCurrentImage?.title"
              class="max-h-[60vh] w-full object-contain"
          >
          <div class="flex items-center justify-center gap-3 py-4">
            <button
                type="button"
                class="flex size-9 items-center justify-center rounded-lg border border-ink/10 text-ink disabled:opacity-30"
                :disabled="galleryIndex === 0"
                @click="prevImage"
            >
              <Icon name="lucide:chevron-right" class="size-4" />
            </button>
            <span class="text-sm text-ink-muted">{{ galleryIndex + 1 }} / {{ detail.gallery.length }}</span>
            <button
                type="button"
                class="flex size-9 items-center justify-center rounded-lg border border-ink/10 text-ink disabled:opacity-30"
                :disabled="galleryIndex === detail.gallery.length - 1"
                @click="nextImage"
            >
              <Icon name="lucide:chevron-left" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>

  <div
      v-else
      class="mx-auto max-w-5xl px-4 py-20 text-center text-ink-muted"
  >
    {{ t('plantDetail.notFound') }}
  </div>
</template>

<style scoped>
.plant-detail-page {
  --plant-ink: var(--color-ink);
  --plant-ink-muted: var(--color-ink-muted);
}

.plant-detail-page :deep(.glass-card) {
  --color-ink: var(--plant-ink);
  --color-ink-muted: var(--plant-ink-muted);
  color: rgb(var(--plant-ink));
  text-shadow: none;
}

.plant-detail-page :deep(.glass-card .text-primary-900) {
  color: rgb(var(--plant-ink));
}

.plant-detail-page :deep(.font-serif) {
  font-family: inherit;
}
</style>