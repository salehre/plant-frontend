<script setup lang="ts">
import { ref, computed } from 'vue'
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
type MobileTab = 'overview' | 'care' | 'health' | 'scientific'
const mobileTabs: MobileTab[] = ['overview', 'care', 'health', 'scientific']
const mobileTab = ref<MobileTab>('overview')
// توی دسکتاپ همه‌ی سکشن‌ها دیده می‌شن؛ توی موبایل فقط سکشن‌های تب فعال
function tabShow(tab: MobileTab) {
  return mobileTab.value === tab ? '' : 'max-md:hidden'
}
const statIcons = ['lucide:globe', 'lucide:trees', 'lucide:map-pin', 'lucide:earth']
// بج درصد اطمینان فقط وقتی از نتیجه‌ی اسکن اومده باشیم (?confidence=0.98)
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

function addToGarden() {
  if (!plant.value || !detail.value) return
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

// گروه‌های بخش «کاربردها»: آیکن + رنگ نرم مخصوص هر دسته (توی حالت تیره هم ملایم می‌مونن)
const applicationGroups = computed(() => {
  const apps = detail.value?.applications
  if (!apps) return []
  return [
    { key: 'food' as const, label: t('plantDetail.edible'), items: apps.food, tone: 'bg-[#4a7c3c]/15 text-[#4a7c3c]' },
    { key: 'industrial' as const, label: t('plantDetail.industrial'), items: apps.industrial, tone: 'bg-[#3178c6]/15 text-[#3178c6]' },
    { key: 'therapeutic' as const, label: t('plantDetail.therapeutic'), items: apps.therapeutic, tone: 'bg-[#a5692c]/15 text-[#a5692c] dark:text-[#cd8742]' },
  ]
})

const growthIcons: Record<string, string> = {
  light: 'lucide:sun',
  water: 'lucide:droplets',
  soil: 'lucide:mountain',
  temperature: 'lucide:thermometer',
  growthAltitude: 'lucide:trending-up',
}
</script>

<template>
    <template v-if="plantStore.loading" />
  <div
      v-else-if="plant && detail"
      class="plant-detail-page text-readable pb-10"
  >
    <!-- ========== هیرو موبایل (تمام‌عرض) ========== -->
    <div class="relative -mx-4 -mt-4 h-[320px] sm:-mx-6 md:hidden">
      <img
          :src="detail.image"
          :alt="plant.name"
          class="size-full object-cover"
      >
      <div class="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent" />
      <button
          type="button"
          class="absolute start-4 top-4 flex size-10 items-center justify-center rounded-full bg-surface/90 text-ink shadow-card backdrop-blur"
          :aria-label="t('common.back')"
          @click="goBack"
      >
        <Icon name="lucide:arrow-left" class="size-5 rtl:-scale-x-100" />
      </button>
      <div class="absolute end-4 top-4 flex items-center gap-2">
        <button
            type="button"
            class="flex size-10 items-center justify-center rounded-full bg-surface/90 text-ink shadow-card backdrop-blur"
            :aria-label="t('plantDetail.compare')"
            @click="navigateTo(`/compare/${slug}`)"
        >
          <Icon name="lucide:git-compare" class="size-5" />
        </button>
        <button
            type="button"
            class="flex size-10 items-center justify-center rounded-full bg-surface/90 text-ink shadow-card backdrop-blur"
            :aria-label="t('plantDetail.share')"
            @click="sharePlant"
        >
          <Icon name="lucide:share-2" class="size-5" />
        </button>
        <button
            type="button"
            class="flex size-10 items-center justify-center rounded-full bg-surface/90 text-primary-700 shadow-card backdrop-blur"
            :aria-pressed="isBookmarked"
            :aria-label="isBookmarked ? t('plantDetail.removeFromWishlist') : t('plantDetail.addToWishlist')"
            @click="toggleBookmark"
        >
          <Icon name="lucide:heart" class="size-5" :class="isBookmarked ? 'fill-current' : ''" />
        </button>
      </div>
    </div>

    <!-- ========== هدر دسکتاپ ========== -->
    <div class="glass-card flex flex-col gap-5 p-4 max-md:hidden sm:flex-row sm:p-6">
      <img
          :src="detail.image"
          :alt="plant.name"
          class="aspect-square w-full shrink-0 rounded-2xl object-cover sm:size-56 sm:w-56 lg:size-64 lg:w-64"
      >

      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h1 class="text-2xl font-bold text-ink sm:text-3xl">
              {{ plant.name }}
            </h1>
            <p class="text-sm italic text-ink-muted sm:text-base">
              {{ plant.scientificName }}
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <button
                type="button"
                class="flex size-9 items-center justify-center rounded-xl border border-ink/10 text-primary-700 transition-colors hover:bg-primary-50"
                :aria-pressed="isBookmarked"
                :aria-label="isBookmarked ? t('plantDetail.removeFromWishlist') : t('plantDetail.addToWishlist')"
                @click="toggleBookmark"
            >
              <Icon :name="isBookmarked ? 'lucide:bookmark-check' : 'lucide:bookmark'" class="size-4" />
            </button>
            <button
                type="button"
                class="flex size-9 items-center justify-center rounded-xl border border-ink/10 text-primary-700 transition-colors hover:bg-primary-50"
                :aria-label="t('plantDetail.share')"
                @click="sharePlant"
            >
              <Icon name="lucide:share-2" class="size-4" />
            </button>
            <button
                type="button"
                class="flex size-9 items-center justify-center rounded-xl border border-ink/10 text-primary-700 transition-colors hover:bg-primary-50"
                :aria-label="t('plantDetail.compare')"
                @click="navigateTo(`/compare/${slug}`)"
            >
              <Icon name="lucide:git-compare" class="size-4" />
            </button>
          </div>
        </div>

        <!-- چیپ‌های خانواده / جنس / وضعیت حفاظتی -->
        <div class="flex flex-wrap gap-2">
          <NuxtLink
              :to="{ path: '/plants', query: { family: plant.family } }"
              class="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
          >
            {{ t('components.plantDetailHeader.family') }} {{ plant.family }}
          </NuxtLink>
          <NuxtLink
              :to="{ path: '/plants', query: { genus: plant.genus } }"
              class="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
          >
            {{ t('components.plantDetailHeader.genus') }} {{ plant.genus }}
          </NuxtLink>
          <button
              type="button"
              class="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700 hover:bg-accent-100"
              @click="goToTarget"
          >
            {{ t('plantDetail.conservationStatus') }}: {{ detail.conservationBadge }}
          </button>
        </div>

        <p class="text-xs text-ink-muted">
          {{ t('plantDetail.authority') }}: {{ detail.taxonomy.authority }}
        </p>

        <!-- نیازهای اصلی نگهداری -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-2.5 rounded-xl bg-primary-50/70 p-3">
            <Icon name="lucide:sun" class="size-5 shrink-0 text-primary-600" />
            <span class="text-sm font-bold text-ink">{{ careLabel(lightKeys, plant.care.light) }}</span>
          </div>
          <div class="flex items-center gap-2.5 rounded-xl bg-primary-50/70 p-3">
            <Icon name="lucide:droplets" class="size-5 shrink-0 text-primary-600" />
            <span class="text-sm font-bold text-ink">{{ careLabel(waterKeys, plant.care.water) }}</span>
          </div>
        </div>

        <div class="mt-auto pt-1">
          <AppButton variant="primary" @click="addToGarden">
            {{ $t('identify.addToGarden') }}
          </AppButton>
        </div>
      </div>
    </div>

    <div class="detail-sheet pt-6 max-md:relative max-md:-mx-4 max-md:-mt-7 max-md:rounded-t-[28px] max-md:bg-surface max-md:px-4 max-md:pt-5 sm:max-md:-mx-6 sm:max-md:px-6">
      <!-- ========== هدر موبایل: نام، چیپ‌ها، تب‌ها ========== -->
      <div class="md:hidden">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h1 class="text-2xl font-extrabold text-ink">
              {{ plant.name }}
            </h1>
            <p class="mt-0.5 text-sm italic text-ink-muted">
              {{ plant.scientificName }}
            </p>
          </div>
          <span
              v-if="confidenceLabel"
              class="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700"
          >
            <Icon name="lucide:badge-check" class="size-3.5" />
            {{ confidenceLabel }}
          </span>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <NuxtLink
              :to="{ path: '/plants', query: { family: plant.family } }"
              class="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-muted"
          >
            {{ plant.family }}
          </NuxtLink>
          <NuxtLink
              :to="{ path: '/plants', query: { genus: plant.genus } }"
              class="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-muted"
          >
            {{ plant.genus }}
          </NuxtLink>
          <span class="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-muted">
            {{ plant.category }}
          </span>
        </div>

        <!-- تب‌ها -->
        <div
            role="tablist"
            class="-mx-4 mt-4 flex gap-6 overflow-x-auto border-b border-ink/10 px-4 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
              v-for="tab in mobileTabs"
              :key="tab"
              type="button"
              role="tab"
              :aria-selected="mobileTab === tab"
              class="relative shrink-0 pb-3 text-sm transition-colors"
              :class="mobileTab === tab ? 'font-bold text-primary-700' : 'font-medium text-ink-muted'"
              @click="mobileTab = tab"
          >
            {{ t(tab === 'health' ? 'plantDetail.tabs.healthToxicity' : `plantDetail.tabs.${tab}`) }}
            <span
                v-if="mobileTab === tab"
                class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-700"
            />
          </button>
        </div>

        <!-- تب نمای کلی: توضیح + ردیف‌های اطلاعات -->
        <div v-show="mobileTab === 'overview'" class="flex flex-col gap-6 pt-4">
          <section class="glass-card mobile-card p-5">
            <p class="text-sm leading-7 text-ink">
              {{ plant.description }}
            </p>
          </section>
          <ul class="glass-card mobile-card divide-y divide-ink/10 px-5 py-2">
            <li
                v-for="(stat, index) in detail.quickStats"
                :key="stat.label"
                class="flex items-center gap-3 py-3"
            >
              <Icon :name="statIcons[index] ?? 'lucide:info'" class="size-5 shrink-0 text-primary-600" />
              <span class="shrink-0 text-sm text-ink-muted">{{ stat.label }}</span>
              <span class="ms-auto min-w-0 text-end text-sm font-semibold text-ink">{{ stat.value }}</span>
            </li>
          </ul>
        </div>

        <p
            v-if="!plant.commonIssues.length"
            v-show="mobileTab === 'health'"
            class="pt-4 text-sm text-ink-muted"
        >
          {{ t('plantDetail.noIssues') }}
        </p>
      </div>

      <!-- ========== آمار سریع (فقط دسکتاپ) ========== -->
      <div class="grid grid-cols-2 gap-3 max-md:hidden sm:grid-cols-4 sm:gap-4">
        <div
            v-for="stat in detail.quickStats"
            :key="stat.label"
            class="glass-card flex flex-col items-center justify-center gap-1.5 px-3 py-4 text-center"
        >
          <span class="text-sm font-bold text-ink">{{ stat.value }}</span>
          <span class="text-[0.65rem] uppercase tracking-wide text-ink-muted">{{ stat.label }}</span>
        </div>
      </div>

      <!-- ========== محتوای اصلی ========== -->
      <div class="mt-6 grid grid-cols-1 gap-6 md:mt-8 lg:grid-cols-12">
        <!-- ستون اول -->
        <div class="flex flex-col gap-6 max-md:contents lg:col-span-7">
          <!-- راهنمای نگهداری روزانه -->
<!--          <section class="glass-card p-5 sm:p-6">-->
<!--            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">-->
<!--              راهنمای نگهداری روزانه-->
<!--              <span class="text-xs font-normal tracking-wide text-ink-muted">Care Guide</span>-->
<!--            </h2>-->
<!--            <div class="mb-4" />-->
<!--            <CareInfoCard :plant="plant" />-->
<!--          </section>-->

          <!-- طبقه‌بندی علمی -->
          <section class="glass-card p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
              {{ t('plantDetail.taxonomyTitle') }}
            </h2>
            <div class="mb-4" />
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
                  {{ t('plantDetail.authority') }}
                </td>
                <td class="px-4 py-3 text-xs text-ink">
                  {{ detail.taxonomy.authority }}
                </td>
              </tr>
              </tbody>
            </table>
          </section>

          <!-- ویژگی‌های زیست‌شناسی -->
          <section class="glass-card p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
              {{ t('plantDetail.morphologyTitle') }}
            </h2>
            <div class="mb-4" />
            <div class="grid grid-cols-2 gap-3">
              <div
                  v-for="(value, key) in detail.morphology"
                  :key="key"
                  class="rounded-md border border-ink/10 bg-bg p-3 transition hover:-translate-x-1 hover:shadow-card"
              >
                <div class="flex items-center gap-1.5 border-b border-dashed border-ink/15 pb-2 text-xs text-ink-muted">
                  <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-primary-300/10 dark:text-primary-300">
                    <MorphologyIcon :name="String(key)" class="size-5" />
                  </span>
                  <strong>{{ getMorphLabel(key) }}</strong>
                </div>
                <div class="mt-2 text-sm leading-relaxed text-ink">
                  {{ value }}
                </div>
              </div>
            </div>
          </section>

          <!-- کاربردها -->
          <section class="glass-card p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
              {{ t('plantDetail.applicationsTitle') }}
            </h2>
            <div class="mb-4" />
            <div class="space-y-3">
              <div
                  v-for="group in applicationGroups"
                  :key="group.key"
                  class="rounded-md border border-ink/10 bg-bg p-3"
              >
                <div class="flex items-center gap-2.5 border-b border-dashed border-ink/15 pb-2.5">
                  <span
                      class="flex size-9 shrink-0 items-center justify-center rounded-full"
                      :class="group.tone"
                  >
                    <ApplicationIcon :name="group.key" class="size-6" />
                  </span>
                  <strong class="text-sm">{{ group.label }}</strong>
                </div>
                <ul class="mt-2.5 list-none space-y-1.5">
                  <li v-for="item in group.items" :key="item" class="text-sm text-ink">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- ترکیبات شیمیایی -->
          <section class="glass-card p-5 sm:p-6 max-md:order-3" :class="tabShow('health')">
            <div class="flex items-center justify-between gap-3">
              <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
                {{ t('plantDetail.chemicalCompounds') }}
              </h2>
              <button
                  v-if="detail.chemicalCompounds.categories.length"
                  type="button"
                  class="flex size-9 shrink-0 items-center justify-center rounded-lg text-primary-900 border border-primary-700 transition hover:border-primary-200 hover:text-primary-900"
                  :aria-expanded="chemicalCompoundsExpanded"
                  aria-controls="chemical-compound-details"
                  :aria-label="t(chemicalCompoundsExpanded ? 'plantDetail.hideCompounds' : 'plantDetail.showCompounds')"
                  @click="chemicalCompoundsExpanded = !chemicalCompoundsExpanded"
              >
                <Icon :name="chemicalCompoundsExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="size-4" />
              </button>
            </div>

            <div class="mb-4" />

            <div class="rounded-md border-s-4 border-accent-400 bg-bg px-4 py-3">
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
        <div class="flex flex-col gap-6 max-md:contents lg:col-span-5">
          <!-- نیازهای رشدی -->
          <section class="glass-card p-5 sm:p-6" :class="tabShow('care')">
            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
              {{ t('plantDetail.growthRequirements') }}
            </h2>
            <div class="mb-4" />
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
                  <div class="text-[0.7rem] mb-2 font-semibold uppercase tracking-wide text-primary-900">
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
          <section class="glass-card mobile-card p-5 sm:p-6" :class="tabShow('overview')">
            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
              {{ t('plantDetail.story') }}
            </h2>
            <div class="mb-4" />
            <p class="text-justify text-sm leading-6 text-ink">
              {{ detail.plantStory }}
            </p>
          </section>

          <!-- سمّیت -->
          <section class="glass-card p-5 sm:p-6 max-md:order-2" :class="tabShow('health')">
            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
              {{ t('plantDetail.toxicity') }}
            </h2>
            <div class="mb-4" />
            <div class="flex items-center gap-3 rounded-md border-s-4 border-status-warning bg-status-warning/10 px-4 py-3">
              <Icon name="lucide:triangle-alert" class="size-5 shrink-0 text-status-warning" />
              <div class="text-sm text-ink"><strong>{{ t('plantDetail.toxicity') }}:</strong> {{ detail.toxicityText }}</div>
            </div>
          </section>

          <!-- مشکلات رایج -->
          <section
              v-if="plant.commonIssues.length"
              class="glass-card p-5 sm:p-6 max-md:order-1" :class="tabShow('health')"
          >
            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
              {{ t('plantDetail.commonProblems') }}
            </h2>
            <div class="mb-4" />
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
          <section ref="targetSection" class="glass-card p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
              {{ t('plantDetail.conservation') }}
            </h2>
            <div class="mb-4" />
            <div class="flex items-center gap-3 rounded-md border-s-4 border-status-info bg-status-info/10 px-4 py-3">
              <Icon name="lucide:shield" class="size-5 shrink-0 text-status-info" />
              <div class="text-sm text-ink"><strong>{{ t('plantDetail.conservationStatus') }}:</strong> {{ detail.conservationStatus }}</div>
            </div>
          </section>

          <!-- نام‌های محلی -->
          <section class="glass-card mobile-card p-5 sm:p-6" :class="tabShow('overview')">
            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
              {{ t('plantDetail.localNames') }}
            </h2>
            <div class="mb-4" />
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
          <section class="glass-card p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
              {{ t('plantDetail.scientificSynonyms') }}
            </h2>
            <div class="mb-4" />
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
          <section class="glass-card p-5 sm:p-6" :class="tabShow('scientific')">
            <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
              {{ t('plantDetail.fossilPeriod') }}
            </h2>
            <div class="mb-4" />
            <div class="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
              <span class="mt-0.5 shrink-0 text-accent-500">◈</span>
              {{ detail.fossilPeriod }}
            </div>
          </section>
        </div>
      </div>

      <!-- ========== گالری تصاویر ========== -->
      <section class="glass-card mobile-card group mt-7 p-5 overflow-hidden text-right transition hover:-translate-y-1 max-md:mt-6" :class="tabShow('overview')">
        <h2 class="flex items-baseline gap-2 text-base font-bold text-primary-800">
          {{ t('plantDetail.gallery') }}
        </h2>
        <div class="mb-4" />
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

    <!-- ========== دکمه‌ی ثابت پایین (موبایل) ========== -->
    <div
        class="fixed inset-x-0 bottom-0 z-40 border-t border-ink/5 bg-surface/90 px-4 pt-3 backdrop-blur md:hidden"
        style="padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));"
    >
      <button
          type="button"
          class="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-700 text-sm font-bold text-white transition-colors hover:bg-primary-600"
          @click="addToGarden"
      >
        <Icon name="lucide:sprout" class="size-5" />
        {{ $t('identify.addToGarden') }}
      </button>
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