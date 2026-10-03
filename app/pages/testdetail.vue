<script setup lang="ts">
import { ref, computed } from 'vue'
import { en, fa } from '~/i18n/testDetailMessages'

const { t } = useI18n({ messages: { fa, en }, useScope: 'local' })
const uiStore = useUiStore()

// ============ اسکرول به بخش حفاظت (از روی بج وضعیت حفاظتی) ============
const targetSection = ref<HTMLElement | null>(null)
const goToTarget = () => {
  const el = targetSection.value
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 70
  window.scrollTo({ top, behavior: 'smooth' })
}

// ============ اشتراک‌گذاری ============
const isBookmarked = ref(false)
const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
  uiStore.showToast(isBookmarked.value ? t('actions.bookmarkAdd') : t('actions.bookmarkRemove'), 'success')
}
const sharePlant = async () => {
  const shareData = { title: plantName.value, text: scientificName.value, url: window.location.href }
  try {
    if (navigator.share) {
      await navigator.share(shareData)
    }
    else {
      await navigator.clipboard.writeText(window.location.href)
      uiStore.showToast(t('actions.copyLink'), 'success')
    }
  }
  catch {
    // کاربر اشتراک‌گذاری رو لغو کرده - نیازی به توست خطا نیست
  }
}

// ============ اطلاعات اصلی گیاه ============
const plantName = computed(() => t('plant.name'))
const scientificName = ref('Glycyrrhiza glabra L.')
const plantImage = ref('plant1.png')

const toxitcityStatus = computed(() => ({
  lame: t('plant.conservation.threatened'),
  extinct: t('plant.conservation.extinct'),
  stable: t('plant.conservation.stable'),
  notFound: t('plant.conservation.insufficient'),
}))

const plantGallery = computed(() => [
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Glycyrrhiza_glabra_LC0256.jpg/400px-Glycyrrhiza_glabra_LC0256.jpg',
    full: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Glycyrrhiza_glabra_LC0256.jpg',
    title: t('plant.gallery.flowersLeaves'),
  },
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Glycyrrhiza_glabra_-_Köhler–s_Medizinal-Pflanzen-069.jpg/400px-Glycyrrhiza_glabra_-_Köhler–s_Medizinal-Pflanzen-069.jpg',
    full: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Glycyrrhiza_glabra_-_Köhler–s_Medizinal-Pflanzen-069.jpg',
    title: t('plant.gallery.botanicalIllustration'),
  },
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Liquorice_roots.jpg/400px-Liquorice_roots.jpg',
    full: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Liquorice_roots.jpg',
    title: t('plant.gallery.root'),
  },
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Glycyrrhiza_glabra_001.JPG/400px-Glycyrrhiza_glabra_001.JPG',
    full: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Glycyrrhiza_glabra_001.JPG',
    title: t('plant.gallery.purpleFlowers'),
  },
])

const galleryDialog = ref(false)
const galleryIndex = ref(0)
const galleryCurrentImage = computed(() => plantGallery.value[galleryIndex.value])
const openGallery = (index: number) => {
  galleryIndex.value = index
  galleryDialog.value = true
}
const closeGallery = () => { galleryDialog.value = false }
const nextImage = () => {
  if (galleryIndex.value < plantGallery.value.length - 1) galleryIndex.value++
}
const prevImage = () => {
  if (galleryIndex.value > 0) galleryIndex.value--
}

const taxonomy = computed(() => ({
  kingdom: 'Plantae',
  division: 'Magnoliophyta',
  class: 'Magnoliopsida',
  order: 'Fabales',
  family: 'Fabaceae',
  genus: 'Glycyrrhiza',
  species: 'Glycyrrhiza glabra',
  subspecies: t('plant.taxonomy.subspecies'),
  authority: 'Linnaeus (L.)',
}))
const filteredTaxonomy = computed(() => {
  const { authority, ...rest } = taxonomy.value
  return rest
})

const morphology = computed(() => ({
  plantType: t('plant.morphology.plantType'),
  leaf: t('plant.morphology.leaf'),
  flower: t('plant.morphology.flower'),
  stem: t('plant.morphology.stem'),
  root: t('plant.morphology.root'),
  fruit: t('plant.morphology.fruit'),
  seed: t('plant.morphology.seed'),
  bark: t('plant.morphology.bark'),
  latex: t('plant.morphology.latex'),
}))

const chemicalCompounds = computed(() => ({
  majorCompound: t('plant.chemistry.major'),
  categories: [
    {
      name: t('plant.chemistry.alkaloids'),
      total: t('plant.chemistry.trace'),
      compounds: [
        { name: t('plant.chemistry.thermopsine'), amount: 'trace' },
        { name: t('plant.chemistry.cytisine'), amount: 'trace' },
      ],
    },
    {
      name: t('plant.chemistry.glycosides'),
      total: t('plant.chemistry.mainlyGlycyrrhizin'),
      compounds: [
        { name: t('plant.chemistry.glycyrrhizicAcid'), amount: '2-4%' },
        { name: t('plant.chemistry.liquiritin'), amount: '0.5-1%' },
      ],
    },
    {
      name: t('plant.chemistry.flavonoids'),
      total: '0.5-2.5%',
      compounds: [
        { name: t('plant.chemistry.licochalcone'), amount: '0.1-0.5%' },
        { name: t('plant.chemistry.glabridin'), amount: '0.1-0.3%' },
        { name: t('plant.chemistry.liquiritin'), amount: '0.2-0.5%' },
        { name: t('plant.chemistry.glabrene'), amount: '0.05-0.1%' },
      ],
    },
    {
      name: t('plant.chemistry.tannins'),
      total: '5-15%',
      compounds: [
        { name: t('plant.chemistry.hydrolysableTannins'), amount: '3-10%' },
        { name: t('plant.chemistry.proanthocyanidins'), amount: '2-5%' },
      ],
    },
    {
      name: t('plant.chemistry.essentialOils'),
      total: t('plant.chemistry.lessThanPointOne'),
      compounds: [
        { name: t('plant.chemistry.caryophylleneOxide'), amount: t('plant.chemistry.primary') },
        { name: t('plant.chemistry.linalool'), amount: t('plant.chemistry.secondary') },
        { name: t('plant.chemistry.eugenol'), amount: 'trace' },
      ],
    },
    {
      name: t('plant.chemistry.saponins'),
      total: '5-15%',
      compounds: [
        { name: t('plant.chemistry.glycyrrhizicAcid'), amount: '2-4%' },
        { name: t('plant.chemistry.relatedSaponins'), amount: '1-3%' },
      ],
    },
    {
      name: t('plant.chemistry.phenolicCompounds'),
      total: t('plant.chemistry.variedFlavonoidsCoumarins'),
      compounds: [
        { name: t('plant.chemistry.coumarins'), amount: '0.1-0.5%' },
        { name: t('plant.chemistry.phenolicAcids'), amount: '0.2-0.8%' },
      ],
    },
  ],
}))

const growthNeeds = computed(() => ({
  light: t('plant.growth.light'),
  water: t('plant.growth.water'),
  soil: t('plant.growth.soil'),
  temperature: t('plant.growth.temperature'),
  growthAltitude: t('plant.growth.growthAltitude'),
}))
const growthIcons: Record<string, string> = {
  light: 'lucide:sun',
  water: 'lucide:droplets',
  soil: 'lucide:mountain',
  temperature: 'lucide:thermometer',
  growthAltitude: 'lucide:trending-up',
}

const applications = computed(() => ({
  food: [
    t('plant.applications.foodItems.0'),
    t('plant.applications.foodItems.1'),
    t('plant.applications.foodItems.2'),
  ],
  industrial: [
    t('plant.applications.industrialItems.0'),
    t('plant.applications.industrialItems.1'),
    t('plant.applications.industrialItems.2'),
  ],
  therapeutic: [
    t('plant.applications.therapeuticItems.0'),
    t('plant.applications.therapeuticItems.1'),
    t('plant.applications.therapeuticItems.2'),
    t('plant.applications.therapeuticItems.3'),
  ],
}))

const toxicity = computed(() => ({
  toxicity: t('plant.toxicity'),
  conservationStatus: t('plant.conservationStatus'),
}))

const localNames = computed(() => [0, 1, 2, 3, 4].map(index => ({
  name: t(`plant.localNames.${index}.name`),
  region: t(`plant.localNames.${index}.region`),
})))

const scientificSynonyms = ref([
  'Glycyrrhiza glabra var. glandulifera',
  'Liquiritia officinalis',
])

const fossilPeriod = computed(() => t('plant.fossilPeriod'))

const plantStory = computed(() => t('plant.story'))

const quickStats = computed(() => [
  { label: t('stats.originLabel'), value: t('stats.origin') },
  { label: t('stats.habitatLabel'), value: t('stats.habitat') },
  { label: t('stats.iranRangeLabel'), value: t('stats.iranRange') },
  { label: t('stats.worldRangeLabel'), value: t('stats.worldRange') },
])

const getTaxonomyLabel = (key: string) => t(`labels.taxonomyKeys.${key}`)
const getMorphLabel = (key: string) => t(`labels.morphologyKeys.${key}`)
const getNeedLabel = (key: string) => t(`labels.growthKeys.${key}`)
</script>

<template>
  <div class="min-h-screen bg-bg pb-10">
    <!-- ========== هدر ========== -->
    <div class="relative overflow-visible bg-gradient-to-l from-primary-900 via-primary-800 to-primary-700 px-4 pb-4 pt-10 text-white sm:px-8 sm:pt-14">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:items-end">
        <!-- عکس شناور -->
        <div class="relative -mb-14 shrink-0 sm:-mb-16">
          <img
              :src="plantImage"
              :alt="plantName"
              class="size-28 rounded-full border-4 border-surface object-cover shadow-card-hover sm:size-40"
          >
        </div>

        <div class="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-right">
          <h1 class="text-2xl font-bold sm:text-4xl">
            {{ plantName }}
          </h1>
          <p class="text-sm italic opacity-85 sm:text-base">
            {{ scientificName }}
          </p>
          <p class="text-xs opacity-70 sm:text-sm">
            {{ t('labels.authority') }}: {{ taxonomy.authority }}
          </p>

          <button
              class="mt-1 inline-flex items-center gap-1 rounded-full bg-accent-400/90 px-3 py-1.5 text-xs font-semibold text-primary-900 transition hover:bg-accent-300"
              @click="goToTarget"
          >
            {{ t('labels.conservation') }}: {{ toxitcityStatus.lame }}
          </button>

          <div class="mt-1 flex items-center gap-2">
            <button
                class="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-accent-400 hover:text-primary-900"
                :aria-pressed="isBookmarked"
                :aria-label="t('actions.bookmark')"
                @click="toggleBookmark"
            >
              <Icon :name="isBookmarked ? 'lucide:bookmark-check' : 'lucide:bookmark'" class="size-4" />
            </button>
            <button
                class="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-accent-400 hover:text-primary-900"
                :aria-label="t('actions.share')"
                @click="sharePlant"
            >
              <Icon name="lucide:share-2" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-4 pt-16 sm:px-8 sm:pt-20">
      <!-- ========== آمار سریع ========== -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div
            v-for="stat in quickStats"
            :key="stat.label"
            class="glass-card flex flex-col items-center justify-center gap-1.5 px-3 py-4 text-center transition hover:-translate-y-0.5"
        >
          <span class="text-sm font-bold text-primary-900">{{ stat.value }}</span>
          <span class="text-[0.65rem] uppercase tracking-wide text-ink-muted">{{ stat.label }}</span>
        </div>
      </div>

      <!-- ========== محتوای اصلی: دو ستون که روی موبایل خودشون زیر هم می‌شینن ========== -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- ستون اول -->
        <div class="flex flex-col gap-6 lg:col-span-7">
          <!-- طبقه‌بندی علمی -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('labels.taxonomy') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.taxonomyEnglish') }}</span>
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
                  {{ t('labels.taxonomyAuthority') }}
                </td>
                <td class="px-4 py-3 text-xs text-ink">
                  {{ taxonomy.authority }}
                </td>
              </tr>
              </tbody>
            </table>
          </section>

          <!-- ویژگی‌های مورفولوژیک -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('labels.morphology') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.morphologyEnglish') }}</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="grid grid-cols-2 gap-3">
              <div
                  v-for="(value, key) in morphology"
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
              {{ t('labels.applications') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.applicationsEnglish') }}</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="space-y-3">
              <div>
                <span class="text-status-success">●</span>
                <strong class="text-sm">{{ t('plant.applications.food') }}:</strong>
                <ul class="mr-5 mt-1.5 list-none space-y-1.5">
                  <li v-for="item in applications.food" :key="item" class="text-sm text-ink">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <span class="text-status-info">●</span>
                <strong class="text-sm">{{ t('plant.applications.industrial') }}:</strong>
                <ul class="mr-5 mt-1.5 list-none space-y-1.5">
                  <li v-for="item in applications.industrial" :key="item" class="text-sm text-ink">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <span class="text-accent-600">●</span>
                <strong class="text-sm">{{ t('plant.applications.therapeutic') }}:</strong>
                <ul class="mr-5 mt-1.5 list-none space-y-1.5">
                  <li v-for="item in applications.therapeutic" :key="item" class="text-sm text-ink">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- ترکیبات شیمیایی -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('labels.chemistry') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.chemistryEnglish') }}</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />

            <div class="rounded-md border-r-4 border-accent-400 bg-bg px-4 py-3">
              <span class="block text-xs font-semibold text-ink-muted">{{ t('labels.mainCompound') }}</span>
              <span class="text-sm font-medium text-primary-900">{{ chemicalCompounds.majorCompound }}</span>
            </div>

            <div class="mt-5 flex flex-col gap-5">
              <div
                  v-for="(cat, idx) in chemicalCompounds.categories"
                  :key="idx"
                  class="border-b border-ink/10 pb-3 last:border-0 last:pb-0"
              >
                <div class="mb-2 flex flex-wrap items-baseline justify-between gap-1">
                  <strong class="text-sm text-primary-900">{{ cat.name }}</strong>
                  <span class="rounded-full bg-bg px-2 py-0.5 text-xs text-ink-muted">{{ cat.total }}</span>
                </div>
                <ul v-if="cat.compounds?.length" class="list-none space-y-1">
                  <li
                      v-for="(comp, cidx) in cat.compounds"
                      :key="cidx"
                      class="flex items-baseline justify-between gap-2 border-b border-dashed border-ink/10 py-1 text-xs last:border-0"
                  >
                    <span class="font-medium text-ink">{{ comp.name }}</span>
                    <span class="shrink-0 rounded-full bg-bg px-2 py-0.5 text-ink-muted">{{ comp.amount }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <!-- ستون دوم -->
        <div class="flex flex-col gap-6 lg:col-span-5">
          <!-- نیازهای رشدی -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('labels.growth') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.growthEnglish') }}</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex flex-col gap-3">
              <div
                  v-for="(value, key) in growthNeeds"
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
              {{ t('labels.story') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.storyEnglish') }}</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <p class="text-justify text-sm leading-8 text-ink">
              {{ plantStory }}
            </p>
          </section>

          <!-- سمیت -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('labels.toxicity') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.toxicityEnglish') }}</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex items-center gap-3 rounded-md border-r-4 border-status-warning bg-amber-50 px-4 py-3">
              <Icon name="lucide:triangle-alert" class="size-5 shrink-0 text-status-warning" />
              <div class="text-sm text-ink"><strong>{{ t('labels.toxicity') }}:</strong> {{ toxicity.toxicity }}</div>
            </div>
          </section>

          <!-- حفاظت -->
          <section ref="targetSection" class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('labels.conservation') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.conservationEnglish') }}</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex items-center gap-3 rounded-md border-r-4 border-status-info bg-sky-50 px-4 py-3">
              <Icon name="lucide:shield" class="size-5 shrink-0 text-status-info" />
              <div class="text-sm text-ink"><strong>{{ t('labels.conservation') }}:</strong> {{ toxicity.conservationStatus }}</div>
            </div>
          </section>

          <!-- نام‌های محلی -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('labels.localNames') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.localNamesEnglish') }}</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex flex-wrap gap-3">
              <div
                  v-for="item in localNames"
                  :key="item.name"
                  class="rounded-full bg-bg px-3.5 py-1.5 text-sm"
              >
                <span class="font-semibold text-primary-900">{{ item.name }}</span>
                <span class="mr-1 text-xs text-ink-muted">({{ item.region }})</span>
              </div>
            </div>
          </section>

          <!-- مترادف‌های علمی -->
          <section class="glass-card p-5 sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              {{ t('labels.synonyms') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.synonymsEnglish') }}</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex flex-col gap-2.5">
              <div
                  v-for="synonym in scientificSynonyms"
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
              {{ t('labels.fossilRecord') }}
              <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.fossilRecordEnglish') }}</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
              <span class="mt-0.5 shrink-0 text-accent-500">◈</span>
              {{ fossilPeriod }}
            </div>
          </section>
        </div>
      </div>

      <!-- ========== گالری تصاویر ========== -->
      <section class="glass-card mt-6 p-5 sm:p-6">
        <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
          {{ t('labels.gallery') }}
          <span class="text-xs font-normal tracking-wide text-ink-muted">{{ t('labels.galleryEnglish') }}</span>
        </h2>
        <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <button
              v-for="(image, index) in plantGallery"
              :key="index"
              class="glass-card group overflow-hidden text-right transition hover:-translate-y-1"
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
            <button class="flex size-8 items-center justify-center rounded-full text-ink-muted hover:bg-bg" :aria-label="t('actions.close')" @click="closeGallery">
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
                class="flex size-9 items-center justify-center rounded-full border border-ink/10 text-ink disabled:opacity-30"
                :disabled="galleryIndex === 0"
                :aria-label="t('actions.previousImage')"
                @click="prevImage"
            >
              <Icon name="lucide:chevron-right" class="size-4" />
            </button>
            <span class="text-sm text-ink-muted">{{ galleryIndex + 1 }} / {{ plantGallery.length }}</span>
            <button
                class="flex size-9 items-center justify-center rounded-full border border-ink/10 text-ink disabled:opacity-30"
                :disabled="galleryIndex === plantGallery.length - 1"
                :aria-label="t('actions.nextImage')"
                @click="nextImage"
            >
              <Icon name="lucide:chevron-left" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>