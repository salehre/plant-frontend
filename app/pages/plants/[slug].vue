<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { getMockDiseases } from '~/services/mock/diseases.mock'
import { findPlantDetailBySlug } from '~/services/mock/plant-details.mock'
import MorphologyIcon from '~/components/plant/MorphologyIcon.vue'
import ApplicationIcon from '~/components/plant/ApplicationIcon.vue'

const route = useRoute()
const plantStore = usePlantStore()
const wishlistStore = useWishlistStore()
const userPlantsStore = useUserPlantsStore()
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

// ============ حالت موبایل: تب‌ها ============
const router = useRouter()
const pageRoot = ref<HTMLElement | null>(null)

type MobileTab = 'overview' | 'care' | 'health' | 'scientific'

const mobileTabs: MobileTab[] = ['overview', 'care', 'health', 'scientific']
const mobileTab = ref<MobileTab>('overview')

let revealObserver: IntersectionObserver | null = null

function tabShow(tab: MobileTab) {
  return mobileTab.value === tab ? '' : 'max-md:hidden'
}

const statIcons = ['lucide:globe', 'lucide:trees', 'lucide:map-pin', 'lucide:earth']
const TILT_MAX_DEG = 9

function onStatCardMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5

  card.style.setProperty('--tilt-x', `${(-y * 2 * TILT_MAX_DEG).toFixed(2)}deg`)
  card.style.setProperty('--tilt-y', `${(x * 2 * TILT_MAX_DEG).toFixed(2)}deg`)
}

function onStatCardLeave(event: PointerEvent) {
  const card = event.currentTarget as HTMLElement
  card.style.removeProperty('--tilt-x')
  card.style.removeProperty('--tilt-y')
}

const confidenceLabel = computed(() => {
  const value = Number(route.query.confidence)
  if (!Number.isFinite(value) || value <= 0) return ''
  return t('components.confidenceScore.percentage', {
    value: new Intl.NumberFormat(locale.value, { useGrouping: false }).format(Math.round(value * 100)),
  })
})

function goBack() {
  if (window.history.length > 1) router.back()
  else navigateTo('/plants')
}

function findDisease(id: string) {
  return getMockDiseases(activeLocale.value).find(d => d.id === id)
}

const targetSection = ref<HTMLElement | null>(null)
function goToTarget() {
  const el = targetSection.value
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 70
  window.scrollTo({ top, behavior: 'smooth' })
}

const isBookmarked = computed(() => wishlistStore.isWishlisted(slug))
const isHeartBursting = ref(false)

function toggleBookmark() {
  isHeartBursting.value = true
  setTimeout(() => isHeartBursting.value = false, 450)
  wishlistStore.toggle(slug, {
    added: t('plantDetail.addedToWishlist'),
    removed: t('plantDetail.removedFromWishlist'),
  })
}

const lightKeys: Record<string, string> = {
  low: 'components.common.lightLow',
  medium: 'components.common.lightMedium',
  high: 'components.common.lightHigh',
  direct: 'components.common.lightDirect',
}

const waterKeys: Record<string, string> = {
  low: 'components.common.waterLow',
  medium: 'components.common.waterMedium',
  high: 'components.common.waterHigh',
}

function careLabel(keys: Record<string, string>, value: string) {
  const key = keys[value]
  return key ? t(key) : value
}

const isSprouting = ref(false)
function addToGarden() {
  if (!plant.value || !detail.value) return
  isSprouting.value = true
  setTimeout(() => isSprouting.value = false, 700)
  userPlantsStore.addPlant({
    plantSlug: slug,
    nickname: plant.value.name,
    photo: detail.value.image,
    acquiredAt: new Date().toISOString().slice(0, 10),
    location: t('pages.myPlants.home'),
    healthStatus: 'healthy',
    lastWateredAt: null,
    nextWateringAt: null,
  })
  uiStore.showToast(t('pages.myPlants.addedToast', { name: plant.value.name }))
}

async function sharePlant() {
  if (!plant.value) return
  const shareData = { title: plant.value.name, text: plant.value.scientificName, url: window.location.href }
  try {
    if (navigator.share) await navigator.share(shareData)
    else {
      await navigator.clipboard.writeText(window.location.href)
      uiStore.showToast(t('plantDetail.linkCopied'), 'success')
    }
  }
  catch {}
}

const galleryDialog = ref(false)
const galleryIndex = ref(0)
const galleryCurrentImage = computed(() => detail.value?.gallery[galleryIndex.value])

function openGallery(index: number) { galleryIndex.value = index; galleryDialog.value = true }
function closeGallery() { galleryDialog.value = false }
function nextImage() { if (detail.value && galleryIndex.value < detail.value.gallery.length - 1) galleryIndex.value++ }
function prevImage() { if (galleryIndex.value > 0) galleryIndex.value-- }

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

const applicationGroups = computed(() => {
  const apps = detail.value?.applications
  if (!apps) return []
  return [
    { key: 'food' as const, label: t('plantDetail.edible'), items: apps.food, tone: 'bg-[#4a7c3c]/15 text-[#4a7c3c]', hoverGlow: 'hover:border-[#4a7c3c]/40' },
    { key: 'industrial' as const, label: t('plantDetail.industrial'), items: apps.industrial, tone: 'bg-[#3178c6]/15 text-[#3178c6]', hoverGlow: 'hover:border-[#3178c6]/40' },
    { key: 'therapeutic' as const, label: t('plantDetail.therapeutic'), items: apps.therapeutic, tone: 'bg-[#a5692c]/15 text-[#a5692c] dark:text-[#cd8742]', hoverGlow: 'hover:border-[#a5692c]/40' },
  ]
})

const growthIcons: Record<string, string> = {
  light: 'lucide:sun',
  water: 'lucide:droplets',
  soil: 'lucide:mountain',
  temperature: 'lucide:thermometer',
  growthAltitude: 'lucide:trending-up',
}

watch(mobileTab, async () => {
  await nextTick()
  if (typeof window === 'undefined' || !pageRoot.value || !window.matchMedia('(max-width: 767px)').matches) return
  const panels = pageRoot.value.querySelectorAll<HTMLElement>('.detail-sheet .glass-card, .detail-sheet .mobile-tab-panel')
  panels.forEach((panel) => {
    if (!panel.getClientRects().length) return
    panel.classList.remove('tab-content-enter')
    void panel.offsetWidth
    panel.classList.add('tab-content-enter')
  })
})

onMounted(() => {
  const root = pageRoot.value
  if (!root) return

  root.classList.add('plant-page-ready')
  const targets = Array.from(root.querySelectorAll<HTMLElement>('.glass-card, .plant-detail-hero'))

  targets.forEach((element, index) => {
    element.classList.add('plant-reveal')
    element.style.setProperty('--reveal-delay', `${(index % 5) * 60}ms`)
  })

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach(element => element.classList.add('is-visible'))
    return
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
  )

  targets.forEach(element => revealObserver?.observe(element))
})

onUnmounted(() => {
  revealObserver?.disconnect()
})
</script>

<template>
  <PlantDetailSkeleton v-if="plantStore.loading" />

  <div
    v-else-if="plant && detail"
    ref="pageRoot"
    class="plant-detail-page text-readable pb-10"
  >
    <!-- ========== هیرو موبایل ========== -->
    <div class="plant-detail-hero relative -mx-4 -mt-4 h-[320px] overflow-hidden sm:-mx-6 md:hidden">
      <img
        :src="detail.image"
        :alt="plant.name"
        class="plant-detail-hero-image size-full object-cover"
      >
      <div class="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />

      <!-- دکمه‌ی بازگشت (داور 태양전지) -->
      <button
        type="button"
        class="hero-action plant-action stacked hero-btn hero-btn--back"
        :aria-label="t('common.back')"
        @click="goBack"
      >
        <Icon name="lucide:arrow-left" class="size-5 rtl:-scale-x-100" />
      </button>

      <!-- سه دکمه‌ی سمت راست (مقایسه، اشتراک، علاقه‌مندی) -->
      <div class="hero-actions absolute end-4 top-4 flex items-center gap-2">
        <button
          type="button"
          class="hero-action plant-action hero-btn hero-btn--compare"
          :aria-label="t('plantDetail.compare')"
          @click="navigateTo(`/compare/${slug}`)"
        >
          <Icon name="lucide:git-compare" class="size-5" />
        </button>

        <button
          type="button"
          class="hero-action plant-action hero-btn hero-btn--share"
          :aria-label="t('plantDetail.share')"
          @click="sharePlant"
        >
          <Icon name="lucide:share-2" class="size-5" />
        </button>

        <button
          type="button"
          class="hero-action plant-action hero-btn hero-btn--heart"
          :aria-pressed="isBookmarked"
          :aria-label="isBookmarked ? t('plantDetail.removeFromWishlist') : t('plantDetail.addToWishlist')"
          @click="toggleBookmark"
        >
          <Icon
            name="lucide:heart"
            class="size-5 transition-transform"
            :class="{
              'fill-current text-rose-500': isBookmarked,
              'heart-burst': isHeartBursting,
            }"
          />
        </button>
      </div>
    </div>

    <!-- ========== هدر دسکتاپ ========== -->
    <div class="glass-card plant-detail-desktop-header group relative flex flex-col gap-6 overflow-hidden p-5 max-md:hidden sm:flex-row sm:p-7">
      <div class="relative shrink-0 overflow-hidden rounded-2xl shadow-md sm:size-56 lg:size-64">
        <img
          :src="detail.image"
          :alt="plant.name"
          class="plant-detail-desktop-image size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        >
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-3.5">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h1 class="text-2xl font-black text-ink sm:text-3xl">
              {{ plant.name }}
            </h1>
            <p class="mt-0.5 text-sm italic text-ink-muted sm:text-base">
              {{ plant.scientificName }}
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <button
              type="button"
              class="plant-action flex size-9 items-center justify-center rounded-xl border border-ink/10 text-primary-700 transition-colors hover:bg-primary-50 active:scale-90"
              :aria-pressed="isBookmarked"
              :aria-label="isBookmarked ? t('plantDetail.removeFromWishlist') : t('plantDetail.addToWishlist')"
              @click="toggleBookmark"
            >
              <Icon
                :name="isBookmarked ? 'lucide:bookmark-check' : 'lucide:bookmark'"
                class="size-4.5"
                :class="{ 'heart-burst text-primary-600': isHeartBursting }"
              />
            </button>

            <button
              type="button"
              class="plant-action flex size-9 items-center justify-center rounded-xl border border-ink/10 text-primary-700 transition-colors hover:bg-primary-50 active:scale-90"
              :aria-label="t('plantDetail.share')"
              @click="sharePlant"
            >
              <Icon name="lucide:share-2" class="size-4.5" />
            </button>

            <button
              type="button"
              class="plant-action flex size-9 items-center justify-center rounded-xl border border-ink/10 text-primary-700 transition-colors hover:bg-primary-50 active:scale-90"
              :aria-label="t('plantDetail.compare')"
              @click="navigateTo(`/compare/${slug}`)"
            >
              <Icon name="lucide:git-compare" class="size-4.5" />
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink
            :to="{ path: '/plants', query: { family: plant.family } }"
            class="chip-tag rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 transition-all hover:bg-primary-500/20 hover:scale-105"
          >
            {{ t('components.plantDetailHeader.family') }} {{ plant.family }}
          </NuxtLink>
          <NuxtLink
            :to="{ path: '/plants', query: { genus: plant.genus } }"
            class="chip-tag rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 transition-all hover:bg-primary-500/20 hover:scale-105"
          >
            {{ t('components.plantDetailHeader.genus') }} {{ plant.genus }}
          </NuxtLink>
          <button
            type="button"
            class="chip-tag rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-700 transition-all hover:bg-accent-500/20 hover:scale-105"
            @click="goToTarget"
          >
            {{ t('plantDetail.conservationStatus') }}: {{ detail.conservationBadge }}
          </button>
        </div>

        <p class="text-xs text-ink-muted">
          {{ t('plantDetail.authority') }}: {{ detail.taxonomy.authority }}
        </p>

        <div class="grid grid-cols-2 gap-3.5">
          <div class="care-card-item care-card-sun group/sun flex items-center gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-3.5 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:shadow-sm">
            <span class="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 transition-transform duration-500 group-hover/sun:rotate-45 group-hover/sun:scale-110">
              <Icon name="lucide:sun" class="size-5 transition-transform" />
            </span>
            <div class="flex flex-col">
              <span class="text-[0.7rem] font-bold text-amber-700/70">{{ t('plantDetail.requirements.light') }}</span>
              <span class="text-sm font-extrabold text-ink">{{ careLabel(lightKeys, plant.care.light) }}</span>
            </div>
          </div>

          <div class="care-card-item care-card-water group/water flex items-center gap-3 rounded-2xl border border-sky-500/10 bg-sky-500/5 p-3.5 transition-all hover:border-sky-500/30 hover:bg-sky-500/10 hover:shadow-sm">
            <span class="flex size-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-600 transition-transform duration-500 group-hover/water:scale-110">
              <Icon name="lucide:droplets" class="size-5 transition-transform group-hover/water:animate-liquid-drop" />
            </span>
            <div class="flex flex-col">
              <span class="text-[0.7rem] font-bold text-sky-700/70">{{ t('plantDetail.requirements.water') }}</span>
              <span class="text-sm font-extrabold text-ink">{{ careLabel(waterKeys, plant.care.water) }}</span>
            </div>
          </div>
        </div>

        <div class="mt-auto pt-2">
          <button
            type="button"
            class="btn-shimmer group relative flex h-11 w-full sm:w-auto items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-primary-600 px-6 font-bold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/30 active:scale-95"
            @click="addToGarden"
          >
            <Icon
              name="lucide:sprout"
              class="size-5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-125"
              :class="{ 'animate-sprout-grow': isSprouting }"
            />
            <span>{{ $t('identify.addToGarden') }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="detail-sheet pt-6 max-md:relative max-md:-mx-4 max-md:-mt-7 max-md:rounded-t-[28px] max-md:bg-surface max-md:px-4 max-md:pt-5 sm:max-md:-mx-6 sm:max-md:px-6">
      <!-- ========== هدر موبایل ========== -->
      <div class="md:hidden">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h1 class="text-2xl font-black text-ink">{{ plant.name }}</h1>
            <p class="mt-0.5 text-sm italic text-ink-muted">{{ plant.scientificName }}</p>
          </div>

          <span
            v-if="confidenceLabel"
            class="badge-shimmer relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-xs font-black text-primary-700 shadow-sm"
          >
            <Icon name="lucide:badge-check" class="size-4 text-primary-600" />
            {{ confidenceLabel }}
          </span>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <NuxtLink :to="{ path: '/plants', query: { family: plant.family } }" class="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-muted transition-colors hover:border-primary-500/30">{{ plant.family }}</NuxtLink>
          <NuxtLink :to="{ path: '/plants', query: { genus: plant.genus } }" class="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-muted transition-colors hover:border-primary-500/30">{{ plant.genus }}</NuxtLink>
          <span class="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-muted">{{ plant.category }}</span>
        </div>

        <div role="tablist" class="plant-detail-tablist -mx-4 mt-5 flex gap-6 overflow-x-auto border-b border-ink/10 px-4 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            v-for="tab in mobileTabs"
            :key="tab"
            type="button"
            role="tab"
            :aria-selected="mobileTab === tab"
            class="relative shrink-0 pb-3 text-sm transition-all"
            :class="mobileTab === tab ? 'font-black text-primary-700 scale-105' : 'font-medium text-ink-muted'"
            @click="mobileTab = tab"
          >
            {{ t(tab === 'health' ? 'plantDetail.tabs.healthToxicity' : `plantDetail.tabs.${tab}`) }}
            <span v-if="mobileTab === tab" class="plant-tab-indicator absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-700" />
          </button>
        </div>

        <div v-show="mobileTab === 'overview'" class="mobile-tab-panel flex flex-col gap-5 pt-4">
          <section class="glass-card mobile-card p-5 leading-relaxed">
            <p class="text-sm leading-7 text-ink">{{ plant.description }}</p>
          </section>
          <ul class="glass-card mobile-card divide-y divide-ink/10 px-5 py-2">
            <li v-for="(stat, index) in detail.quickStats" :key="stat.label" class="flex items-center gap-3 py-3.5">
              <Icon :name="statIcons[index] ?? 'lucide:info'" class="size-5 shrink-0 text-primary-600" />
              <span class="shrink-0 text-sm text-ink-muted">{{ stat.label }}</span>
              <span class="ms-auto min-w-0 text-end text-sm font-bold text-ink">{{ stat.value }}</span>
            </li>
          </ul>
        </div>

        <p v-if="!plant.commonIssues.length" v-show="mobileTab === 'health'" class="mobile-tab-panel pt-4 text-sm text-ink-muted">
          {{ t('plantDetail.noIssues') }}
        </p>
      </div>

      <!-- ========== آمار سریع: دسکتاپ ========== -->
      <div class="grid grid-cols-2 gap-3 max-md:hidden sm:grid-cols-4 sm:gap-4">
        <div
          v-for="stat in detail.quickStats"
          :key="stat.label"
          class="glass-card plant-stat-card group flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-ink/5 p-4 text-center hover:border-primary-500/30 hover:shadow-md"
          @pointermove="onStatCardMove"
          @pointerleave="onStatCardLeave"
        >
          <span class="text-base font-black text-ink transition-transform duration-300 group-hover:scale-110">{{ stat.value }}</span>
          <span class="text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted">{{ stat.label }}</span>
        </div>
      </div>

      <!-- ========== محتوای اصلی ========== -->
      <div class="mt-6 grid grid-cols-1 gap-6 md:mt-8 lg:grid-cols-12">
        <!-- ستون اول -->
        <div class="flex flex-col gap-6 max-md:contents lg:col-span-7">
          <!-- طبقه‌بندی علمی -->
          <section class="glass-card rounded-3xl p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.taxonomyTitle') }}</h2>
            <div class="mb-4" />
            <div class="overflow-hidden rounded-xl border border-ink/10">
              <table class="w-full text-center text-sm">
                <tbody>
                  <tr v-for="(value, key) in filteredTaxonomy" :key="key" class="border-b border-ink/10 transition-colors hover:bg-primary-50/30 last:border-0">
                    <td class="w-2/5 bg-bg/50 px-4 py-3 text-xs font-bold text-primary-900">{{ getTaxonomyLabel(key) }}</td>
                    <td class="px-4 py-3 text-xs font-semibold text-ink">{{ value }}</td>
                  </tr>
                  <tr class="transition-colors hover:bg-primary-50/30">
                    <td class="w-2/5 bg-bg/50 px-4 py-3 text-xs font-bold text-primary-900">{{ t('plantDetail.authority') }}</td>
                    <td class="px-4 py-3 text-xs font-semibold text-ink">{{ detail.taxonomy.authority }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- ویژگی‌های زیست‌شناسی -->
          <section class="glass-card rounded-3xl p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.morphologyTitle') }}</h2>
            <div class="mb-4" />
            <div class="grid grid-cols-2 gap-3.5">
              <div v-for="(value, key) in detail.morphology" :key="key" class="morph-card group relative flex flex-col rounded-2xl border border-ink/10 bg-bg/60 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:bg-surface hover:shadow-card">
                <div class="flex items-center gap-2 border-b border-dashed border-ink/15 pb-2 text-xs text-ink-muted">
                  <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-primary-600 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                    <MorphologyIcon :name="String(key)" class="size-4" />
                  </span>
                  <strong class="font-bold">{{ getMorphLabel(key) }}</strong>
                </div>
                <div class="mt-2 text-sm leading-relaxed text-ink">{{ value }}</div>
              </div>
            </div>
          </section>

          <!-- کاربردها -->
          <section class="glass-card rounded-3xl p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.applicationsTitle') }}</h2>
            <div class="mb-4" />
            <div class="space-y-3.5">
              <div v-for="group in applicationGroups" :key="group.key" class="group rounded-2xl border border-ink/10 bg-bg/60 p-4 transition-all duration-300 hover:border-primary-500/30 hover:shadow-sm" :class="group.hoverGlow">
                <div class="flex items-center gap-2.5 border-b border-dashed border-ink/15 pb-3">
                  <span class="flex size-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" :class="group.tone">
                    <ApplicationIcon :name="group.key" class="size-5" />
                  </span>
                  <strong class="text-sm font-bold">{{ group.label }}</strong>
                </div>
                <ul class="mt-3 list-none space-y-1.5">
                  <li v-for="item in group.items" :key="item" class="flex items-center gap-2 text-sm text-ink transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                    <span class="size-1.5 rounded-full bg-ink/30" />
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- ترکیبات شیمیایی -->
          <section class="glass-card rounded-3xl p-5 sm:p-6 max-md:order-3" :class="tabShow('health')">
            <div class="flex items-center justify-between gap-3">
              <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.chemicalCompounds') }}</h2>
              <button
                v-if="detail.chemicalCompounds.categories.length"
                type="button"
                class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/5 text-primary-800 transition-all hover:bg-primary-500/15 active:scale-90"
                :aria-expanded="chemicalCompoundsExpanded"
                aria-controls="chemical-compound-details"
                :aria-label="t(chemicalCompoundsExpanded ? 'plantDetail.hideCompounds' : 'plantDetail.showCompounds')"
                @click="chemicalCompoundsExpanded = !chemicalCompoundsExpanded"
              >
                <Icon name="lucide:chevron-down" class="size-4.5 transition-transform duration-300" :class="{ 'rotate-180': chemicalCompoundsExpanded }" />
              </button>
            </div>
            <div class="mb-4" />
            <div class="rounded-2xl border-s-4 border-accent-500 bg-accent-500/5 px-4 py-3.5">
              <span class="block text-xs font-bold text-ink-muted">{{ t('plantDetail.mainActiveCompound') }}:</span>
              <span class="text-sm font-extrabold text-primary-900">{{ detail.chemicalCompounds.majorCompound }}</span>
            </div>
            <div id="chemical-compound-details" class="chemical-compound-panel grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" :class="chemicalCompoundsExpanded ? 'grid-rows-[1fr] is-expanded' : 'grid-rows-[0fr] is-collapsed'">
              <div class="chemical-compound-content min-h-0 overflow-hidden" :inert="!chemicalCompoundsExpanded">
                <div class="flex flex-col gap-4 pt-5">
                  <div v-for="(cat, idx) in detail.chemicalCompounds.categories" :key="idx" class="rounded-xl border border-ink/5 bg-bg/40 p-3.5 transition-all hover:bg-bg/80">
                    <div class="mb-2.5 flex flex-wrap items-baseline justify-between gap-1">
                      <strong class="text-sm font-bold text-primary-900">{{ cat.name }}</strong>
                      <span class="rounded-lg bg-surface px-2.5 py-0.5 text-xs font-bold text-ink-muted shadow-sm">{{ cat.total }}</span>
                    </div>
                    <ul v-if="cat.compounds?.length" class="list-none space-y-2">
                      <li v-for="(comp, cidx) in cat.compounds" :key="cidx" class="flex items-baseline justify-between gap-2 border-b border-dashed border-ink/10 pb-1.5 text-xs last:border-0 last:pb-0">
                        <span class="font-medium text-ink">{{ comp.name }}</span>
                        <span class="shrink-0 rounded-md bg-surface px-2 py-0.5 font-bold text-primary-700 shadow-sm">{{ comp.amount }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- ستون دوم -->
        <div class="flex flex-col gap-6 max-md:contents lg:col-span-5">
          <!-- نیازهای رشدی -->
          <section class="glass-card rounded-3xl p-5 sm:p-6" :class="tabShow('care')">
            <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.growthRequirements') }}</h2>
            <div class="mb-4" />
            <div class="flex flex-col gap-3">
              <div v-for="(value, key) in detail.growthNeeds" :key="key" class="plant-growth-row group flex items-center gap-3.5 rounded-2xl border border-transparent p-2 transition-all duration-300 hover:border-ink/10 hover:bg-bg/50">
                <span class="plant-growth-icon flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-700 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon :name="growthIcons[key]" class="size-5" />
                </span>
                <div>
                  <div class="text-[0.7rem] font-extrabold uppercase tracking-wider text-primary-900">{{ getNeedLabel(key) }}</div>
                  <div class="text-sm font-semibold text-ink-muted">{{ value }}</div>
                </div>
              </div>
            </div>
          </section>

          <!-- داستان گیاه -->
          <section class="glass-card mobile-card rounded-3xl p-5 sm:p-6" :class="tabShow('overview')">
            <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.story') }}</h2>
            <div class="mb-4" />
            <p class="text-justify text-sm leading-7 text-ink">{{ detail.plantStory }}</p>
          </section>

          <!-- سمّیت -->
          <section class="glass-card rounded-3xl p-5 sm:p-6 max-md:order-2" :class="tabShow('health')">
            <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.toxicity') }}</h2>
            <div class="mb-4" />
            <div class="relative overflow-hidden flex items-center gap-3.5 rounded-2xl border-s-4 border-status-warning bg-status-warning/10 p-4">
              <span class="relative flex size-6 shrink-0 items-center justify-center">
                <span class="absolute inline-flex size-full animate-ping rounded-full bg-status-warning opacity-30" />
                <Icon name="lucide:triangle-alert" class="relative size-5 text-status-warning" />
              </span>
              <div class="text-sm leading-relaxed text-ink"><strong class="font-black text-status-warning">{{ t('plantDetail.toxicity') }}:</strong> {{ detail.toxicityText }}</div>
            </div>
          </section>

          <!-- مشکلات رایج -->
          <section v-if="plant.commonIssues.length" class="glass-card rounded-3xl p-5 sm:p-6 max-md:order-1" :class="tabShow('health')">
            <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.commonProblems') }}</h2>
            <div class="mb-4" />
            <div class="flex flex-col gap-3">
              <template v-for="issueId in plant.commonIssues" :key="issueId">
                <NuxtLink v-if="findDisease(issueId)" to="/identify" class="group flex gap-3.5 rounded-2xl border border-ink/10 p-3 transition-all duration-300 hover:-translate-x-1 hover:border-primary-500/40 hover:shadow-md">
                  <img :src="findDisease(issueId)!.image" :alt="findDisease(issueId)!.name" class="size-14 shrink-0 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  <div>
                    <p class="text-sm font-bold text-ink transition-colors group-hover:text-primary-700">{{ findDisease(issueId)!.name }}</p>
                    <p class="mt-1 text-xs text-ink-muted">{{ findDisease(issueId)!.symptoms[0] }}</p>
                  </div>
                </NuxtLink>
              </template>
            </div>
          </section>

          <!-- حفاظت -->
          <section ref="targetSection" class="glass-card rounded-3xl p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.conservation') }}</h2>
            <div class="mb-4" />
            <div class="flex items-center gap-3.5 rounded-2xl border-s-4 border-status-info bg-status-info/10 p-4">
              <span class="relative flex size-6 shrink-0 items-center justify-center">
                <span class="absolute inline-flex size-full animate-ping rounded-full bg-status-info opacity-30" />
                <Icon name="lucide:shield-check" class="relative size-5 text-status-info" />
              </span>
              <div class="text-sm text-ink"><strong class="font-black text-status-info">{{ t('plantDetail.conservationStatus') }}:</strong> {{ detail.conservationStatus }}</div>
            </div>
          </section>

          <!-- نام‌های محلی -->
          <section class="glass-card mobile-card rounded-3xl p-5 sm:p-6" :class="tabShow('overview')">
            <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.localNames') }}</h2>
            <div class="mb-4" />
            <div class="flex flex-wrap gap-2.5">
              <div v-for="item in detail.localNames" :key="item.name" class="rounded-xl border border-ink/5 bg-bg/80 px-3.5 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:border-primary-500/20 shadow-sm">
                <span class="font-bold text-primary-900">{{ item.name }}</span>
                <span class="ms-1.5 text-xs text-ink-muted">({{ item.region }})</span>
              </div>
            </div>
          </section>

          <!-- مترادف‌های علمی -->
          <section class="glass-card rounded-3xl p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.scientificSynonyms') }}</h2>
            <div class="mb-4" />
            <div class="flex flex-col gap-2.5">
              <div v-for="synonym in detail.scientificSynonyms" :key="synonym" class="flex items-center gap-2 border-b border-ink/10 pb-2.5 text-sm last:border-0 last:pb-0">
                <span class="text-accent-500">▹</span>
                <span class="italic font-medium">{{ synonym }}</span>
              </div>
            </div>
          </section>

          <!-- دوره فسیلی -->
          <section class="glass-card rounded-3xl p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.fossilPeriod') }}</h2>
            <div class="mb-4" />
            <div class="flex items-start gap-2.5 text-sm leading-relaxed text-ink-muted">
              <span class="mt-0.5 shrink-0 text-accent-500">◈</span>
              {{ detail.fossilPeriod }}
            </div>
          </section>
        </div>
      </div>

      <!-- ========== گالری تصاویر ========== -->
      <section class="glass-card mobile-card group mt-7 overflow-hidden rounded-3xl p-5 text-right transition hover:-translate-y-1 max-md:mt-6 sm:p-7" :class="tabShow('overview')">
        <h2 class="flex items-baseline gap-2 text-base font-black text-primary-800">{{ t('plantDetail.gallery') }}</h2>
        <div class="mb-4" />
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <button v-for="(image, index) in detail.gallery" :key="index" type="button" class="plant-gallery-thumb group/thumb relative overflow-hidden rounded-2xl border border-ink/10 bg-bg text-right shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-500/40 hover:shadow-md" @click="openGallery(index)">
            <div class="h-[140px] overflow-hidden sm:h-[180px]">
              <img :src="image.thumb" :alt="image.title" loading="lazy" class="plant-gallery-thumb-image size-full object-cover" />
            </div>
            <div class="p-2.5 text-center text-xs font-bold text-ink-muted">{{ image.title }}</div>
          </button>
        </div>
      </section>
    </div>

    <!-- ========== دکمه‌ی شناور پایین موبایل ========== -->
    <div class="plant-bottom-cta fixed inset-x-0 bottom-0 z-40 border-t border-ink/5 bg-surface/90 px-4 pt-3 backdrop-blur-lg md:hidden" style="padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));">
      <button type="button" class="btn-shimmer relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary-700 text-sm font-black text-white shadow-lg shadow-primary-700/30 transition-transform active:scale-95" @click="addToGarden">
        <Icon name="lucide:sprout" class="size-5" :class="{ 'animate-sprout-grow': isSprouting }" />
        {{ $t('identify.addToGarden') }}
      </button>
    </div>

    <!-- ========== لایت‌باکس گالری ========== -->
    <Teleport to="body">
      <Transition name="plant-gallery">
        <div v-if="galleryDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" @click.self="closeGallery">
          <div class="plant-gallery-card w-full max-w-2xl overflow-hidden rounded-3xl bg-surface shadow-2xl">
            <div class="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <span class="text-sm font-bold text-ink">{{ galleryCurrentImage?.title }}</span>
              <button type="button" class="flex size-8 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-bg hover:text-ink active:scale-90" @click="closeGallery"><Icon name="lucide:x" class="size-4.5" /></button>
            </div>
            <div class="relative flex items-center justify-center bg-black/5 p-4">
              <img :src="galleryCurrentImage?.full" :alt="galleryCurrentImage?.title" class="max-h-[60vh] w-full rounded-xl object-contain shadow-sm" />
            </div>
            <div class="flex items-center justify-center gap-4 py-4">
              <button type="button" class="flex size-10 items-center justify-center rounded-xl border border-ink/10 text-ink transition-transform hover:bg-bg active:scale-90 disabled:opacity-30" :disabled="galleryIndex === 0" @click="prevImage"><Icon name="lucide:chevron-right" class="size-5 rtl:-scale-x-100" /></button>
              <span class="text-sm font-bold text-ink-muted">{{ galleryIndex + 1 }} / {{ detail.gallery.length }}</span>
              <button type="button" class="flex size-10 items-center justify-center rounded-xl border border-ink/10 text-ink transition-transform hover:bg-bg active:scale-90 disabled:opacity-30" :disabled="galleryIndex === detail.gallery.length - 1" @click="nextImage"><Icon name="lucide:chevron-left" class="size-5 rtl:-scale-x-100" /></button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>

  <div v-else class="mx-auto max-w-5xl px-4 py-20 text-center text-ink-muted">
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

/* ورود نرم بخش‌ها هنگام رسیدن به محدوده‌ی دید */
.plant-detail-page .plant-reveal {
  opacity: 0;
  transform: translate3d(0, 22px, 0) scale(0.985);
  transition:
    opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}

.plant-detail-page .plant-reveal.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
}

.plant-detail-page .plant-stat-card {
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  transition:
    opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.plant-detail-page .plant-stat-card.is-visible {
  transform: perspective(700px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) scale3d(1, 1, 1);
}

@media (hover: hover) and (pointer: fine) {
  .plant-detail-page .plant-stat-card.is-visible:hover {
    transform: perspective(700px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) scale3d(0.97, 0.97, 0.97);
    transition:
      opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.12s ease-out,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
  }
}

@property --plant-stat-border-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.plant-detail-page .plant-stat-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  padding: 1px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--plant-stat-border-angle),
    transparent 0%,
    transparent 55%,
    rgb(var(--color-primary-300)) 80%,
    rgb(var(--color-primary-500)) 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.plant-detail-page .plant-stat-card:hover::before {
  opacity: 1;
  animation: plant-stat-border-spin 2.4s linear infinite;
}

@keyframes plant-stat-border-spin {
  to { --plant-stat-border-angle: 360deg; }
}

/* ========== دکمه‌های بالای صفحه (هیرو موبایل) ========== */

.hero-action {
  --btn-delay: 0ms;
  --btn-hover-lift: 3px;
  position: absolute;
  inset-block: auto;
  inset-inline: auto;
  z-index: 5;
}

/* ورود هم‌زمان但是 با تأخیر استاگراژه */
.plant-detail-hero.is-visible .hero-action {
  animation: hero-pop-in 420ms cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

.hero-btn--back {
  inset-inline-start: 16px;
  inset-block-start: 16px;
  --btn-delay: 60ms;
  animation-name: hero-pop-in-left;
}

.hero-btn--compare {
  --btn-delay: 130ms;
  animation-name: hero-pop-in-right;
}
.hero-btn--share {
  --btn-delay: 190ms;
  animation-name: hero-pop-in-right;
}
.hero-btn--heart {
  --btn-delay: 250ms;
  animation-name: hero-pop-in-right;
}

@keyframes hero-pop-in {
  from { opacity: 0; transform: translateY(10px) scale(0.92); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes hero-pop-in-left {
  from { opacity: 0; transform: translateX(-6px) translateY(10px) scale(0.92); }
  to { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
}
@keyframes hero-pop-in-right {
  from { opacity: 0; transform: translateX(6px) translateY(10px) scale(0.92); }
  to { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
}

/* هاور و کلیک نرم */
.hero-action {
  transition:
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 220ms ease,
    color 220ms ease,
    background-color 220ms ease;
}

.hero-action:hover {
  transform: translateY(calc(var(--btn-hover-lift) * -1)) scale(1.04);
  box-shadow: 0 12px 24px rgb(0 0 0 / 0.25);
}

.hero-action:active {
  transform: scale(0.94);
}

/* افکت شاین روی بج درصد اطمینان */
.badge-shimmer::after {
  content: '';
  position: absolute;
  top: 0; left: -150%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transform: skewX(-20deg);
  animation: badge-shimmer-sweep 4.5s ease-in-out infinite;
}
@keyframes badge-shimmer-sweep {
  0%, 65% { left: -150%; }
  100% { left: 200%; }
}

/* پالش قلب وقتی کاربر کلیک می‌کنه */
@keyframes heart-burst-anim {
  0% { transform: scale(1); }
  35% { transform: scale(0.6); }
  65% { transform: scale(1.35) rotate(-12deg); }
  100% { transform: scale(1) rotate(0); }
}
.heart-burst {
  animation: heart-burst-anim 420ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ========== تب‌های موبایل ========== */
.plant-tab-indicator {
  transform-origin: center;
  animation: tab-indicator-in 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes tab-indicator-in {
  from { opacity: 0; transform: scaleX(0.3); }
  to { opacity: 1; transform: scaleX(1); }
}
.tab-content-enter {
  animation: tab-content-in 350ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes tab-content-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== کارت‌های محتوای زیر هیرو ========== */

/* ورود کارت‌ها با افکت "فاصله بندی بهدن" (Fade + subtle lift) */
.glass-card {
  transition:
    transform 280ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 280ms ease,
    border-color 280ms ease,
    background-color 280ms ease;
}

/* هاور: بالا رفتن ملایم + سایه‌ی نرم +assan بردر کمی شفاف‌تر */
.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgb(0 0 0 / 0.12);
  border-color: rgb(255 255 255 / 0.18);
}

/* افکت میکروی روی آیکون‌های کارت‌ها */
.glass-card .icon-ripple,
.glass-card .group [class*="group-hover"] {
  transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* واکنش آیکون مورفولوژی */
.morph-card .flex.size-7 {
  transform-origin: center;
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}
.morph-card:hover .flex.size-7 {
  transform: scale(1.18) rotate(8deg);
}

/* واکنش آیکون کاربردها */
.group.rounded-2xl .flex.size-9 {
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}
.group.rounded-2xl:hover .flex.size-9 {
  transform: scale(1.12) rotate(-4deg);
}

/* افکت نرم روی ردیف‌های نیاز رشد */
.plant-growth-row {
  transition: border-color 280ms ease, background-color 280ms ease;
}
.plant-growth-icon {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.plant-growth-row:hover .plant-growth-icon {
  transform: scale(1.12) rotate(-6deg);
}

/* باز شدن آکاردئون ترکیبات (نرم و طولانی‌تر) */
.chemical-compound-content {
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 260ms ease, transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.chemical-compound-panel.is-expanded .chemical-compound-content {
  opacity: 1;
  transform: translateY(0);
}

/* دکمه‌ی افزودن به باغچه (جوانه رویشی) */
@keyframes sprout-grow {
  0% { transform: translateY(8px) scale(0.5); opacity: 0; }
  60% { transform: translateY(-4px) scale(1.3) rotate(-10deg); opacity: 1; }
  100% { transform: translateY(0) scale(1) rotate(0); }
}
.animate-sprout-grow {
  animation: sprout-grow 650ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.btn-shimmer::after {
  content: '';
  position: absolute;
  top: 0; left: -150%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.22), transparent);
  transform: skewX(-20deg);
  animation: btn-shimmer-sweep 5s ease-in-out infinite;
}
@keyframes btn-shimmer-sweep {
  0%, 65% { left: -150%; }
  100% { left: 200%; }
}

/* قطره آب مایع */
@keyframes liquid-drop {
  0%, 100% { transform: scale(1); }
  30% { transform: scale(1.15, 0.85); }
  60% { transform: scale(0.85, 1.2); }
  80% { transform: scale(1.05, 0.95); }
}
.animate-liquid-drop {
  animation: liquid-drop 800ms ease-in-out;
}

/* ========== لایت‌باکس ========== */
.plant-gallery-enter-active,
.plant-gallery-leave-active {
  transition: opacity 240ms ease;
}
.plant-gallery-enter-from,
.plant-gallery-leave-to {
  opacity: 0;
}
.plant-gallery-enter-active .plant-gallery-card,
.plant-gallery-leave-active .plant-gallery-card {
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
}
.plant-gallery-enter-from .plant-gallery-card,
.plant-gallery-leave-to .plant-gallery-card {
  transform: translateY(16px) scale(0.96);
}

/* ========== کاهش حرکت برای دسترس‌پذیری ========== */
@media (prefers-reduced-motion: reduce) {
  .plant-detail-page .plant-stat-card,
  .plant-detail-page .plant-stat-card:hover {
    transform: none !important;
    transition: none !important;
  }

  .plant-detail-page .plant-stat-card:hover::before {
    animation: none;
  }

  .plant-detail-page *,
  .plant-detail-page *::before,
  .plant-detail-page *::after {
    animation: none !important;
    transition: none !important;
  }
  .plant-detail-page .plant-reveal {
    opacity: 1 !important;
    transform: none !important;
  }
  .hero-action,
  .btn-shimmer::after,
  .badge-shimmer::after,
  .heart-burst,
  .animate-sprout-grow,
  .animate-liquid-drop {
    animation: none !important;
    transition: none !important;
  }
  .plant-detail-hero.is-visible .hero-action {
    opacity: 1 !important;
    transform: none !important;
  }
  .plant-gallery-enter-active,
  .plant-gallery-leave-active,
  .plant-gallery-card {
    transition: none !important;
  }
  .plant-gallery-enter-from,
  .plant-gallery-leave-to {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>