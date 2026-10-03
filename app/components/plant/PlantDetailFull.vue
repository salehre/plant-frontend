<!--
  نسخه‌ی کامل و «غنی» صفحه‌ی جزئیات گیاه (تاکسونومی، مورفولوژی، شیمی، سمیت،
  حفاظت، نام‌های محلی، مترادف، دوره‌ی فسیلی، داستان، گالری) - پیاده‌سازی بازنویسی‌شده
  با Tailwind از یه نسخه‌ی Vuetify. این کامپوننت جدا و مستقل از pages/plants/[slug].vue
  فعلیه (که ساده‌تره و از plantStore/types/plant.types.ts می‌خونه) - دیتای این
  کامپوننت هنوز محلی و mock‌ه (عیناً همون ساختار نسخه‌ی Vuetify)، چون شکل دیتاش
  (taxonomy/morphology/chemicalCompounds/...) با Plant type فعلی پروژه یکی نیست.
  خودت تصمیم بگیر کجا/چطور وصلش کنی به دیتای واقعی - یا این تایپ‌ها رو به
  types/plant.types.ts اضافه کن، یا این کامپوننت رو props-based کن.

  تفاوت ساختاری آگاهانه با نسخه‌ی اصلی: نسخه‌ی Vuetify یه قالب کامل جدا برای
  موبایل داشت (v-for روی mobileSections + یه پشته‌ی template v-if تکراری) چون
  Vuetify grid برای این‌کار به دوتا ساختار جدا نیاز داشت. توی Tailwind لازم نیست -
  همون کارت‌ها رو توی دو ستون (grid-cols-1 md:grid-cols-12) گذاشتم که خودشون
  زیر md یک‌ستونی می‌شن، بدون تکرار مارک‌آپ. توی موبایل، کارت‌های ستون راست بعد از
  کارت‌های ستون چپ میان (نه دقیقاً همون ترتیب اختصاصی موبایل نسخه‌ی قبلی) - در
  ازاش نصف حجم کد و یه نقطه‌ی نگهداری داریم.
-->
<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'

const uiStore = useUiStore()
const { t, locale } = useI18n({ messages: { en, fa }, useScope: 'local' })

const targetSection = ref<HTMLElement | null>(null)

function goToTarget() {
  targetSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ============ اطلاعات اصلی گیاه ============
const plantName = computed(() => t('components.plantDetailFull.plantName'))
const scientificName = 'Glycyrrhiza glabra L.'
const plantImage = 'plant1.png'

const toxitcityStatus = computed(() => ({
  lame: t('components.plantDetailFull.threatened'),
  extinct: t('components.plantDetailFull.extinct'),
  stable: t('components.plantDetailFull.stable'),
  notFound: t('components.plantDetailFull.noStatusData'),
}))

const plantGallery = computed(() => [
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Glycyrrhiza_glabra_LC0256.jpg/400px-Glycyrrhiza_glabra_LC0256.jpg',
    full: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Glycyrrhiza_glabra_LC0256.jpg',
    title: t('components.plantDetailFull.galleryFlowerLeaves'),
  },
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Glycyrrhiza_glabra_-_Köhler–s_Medizinal-Pflanzen-069.jpg/400px-Glycyrrhiza_glabra_-_Köhler–s_Medizinal-Pflanzen-069.jpg',
    full: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Glycyrrhiza_glabra_-_Köhler–s_Medizinal-Pflanzen-069.jpg',
    title: t('components.plantDetailFull.galleryBotanicalIllustration'),
  },
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Liquorice_roots.jpg/400px-Liquorice_roots.jpg',
    full: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Liquorice_roots.jpg',
    title: t('components.plantDetailFull.galleryRoots'),
  },
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Glycyrrhiza_glabra_001.JPG/400px-Glycyrrhiza_glabra_001.JPG',
    full: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Glycyrrhiza_glabra_001.JPG',
    title: t('components.plantDetailFull.galleryPurpleFlowers'),
  },
])

const galleryOpen = ref(false)
const galleryIndex = ref(0)
const galleryCurrentImage = computed(() => plantGallery.value[galleryIndex.value])
const formattedGalleryIndex = computed(() =>
  new Intl.NumberFormat(locale.value, { useGrouping: false }).format(galleryIndex.value + 1),
)
const formattedGalleryLength = computed(() =>
  new Intl.NumberFormat(locale.value, { useGrouping: false }).format(plantGallery.value.length),
)
function openGallery(index: number) {
  galleryIndex.value = index
  galleryOpen.value = true
}
function nextImage() {
  if (galleryIndex.value < plantGallery.value.length - 1) galleryIndex.value++
}
function prevImage() {
  if (galleryIndex.value > 0) galleryIndex.value--
}

async function sharePlant() {
  const shareData = { title: plantName.value, text: scientificName, url: window.location.href }
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    }
    catch {
      // کاربر خودش لغو کرده - نیازی به toast خطا نیست
    }
    return
  }
  await navigator.clipboard.writeText(window.location.href)
  uiStore.showToast(t('components.plantDetailFull.copiedLink'))
}

const taxonomy = computed(() => ({
  kingdom: 'Plantae',
  division: 'Magnoliophyta',
  class: 'Magnoliopsida',
  order: 'Fabales',
  family: 'Fabaceae',
  genus: 'Glycyrrhiza',
  species: 'Glycyrrhiza glabra',
  subspecies: t('components.plantDetailFull.taxonomy.subspecies'),
  authority: 'Linnaeus (L.)',
}))
const filteredTaxonomy = computed(() => {
  const { authority, ...rest } = taxonomy.value
  return rest
})

const morphology = computed(() => ({
  plantType: t('components.plantDetailFull.morphology.plantType'),
  leaf: t('components.plantDetailFull.morphology.leaf'),
  flower: t('components.plantDetailFull.morphology.flower'),
  stem: t('components.plantDetailFull.morphology.stem'),
  root: t('components.plantDetailFull.morphology.root'),
  fruit: t('components.plantDetailFull.morphology.fruit'),
  seed: t('components.plantDetailFull.morphology.seed'),
  bark: t('components.plantDetailFull.morphology.bark'),
  latex: t('components.plantDetailFull.morphology.latex'),
}))

const chemicalCompounds = computed(() => ({
  majorCompound: t('components.plantDetailFull.chemical.majorCompound'),
  categories: [
    {
      name: t('components.plantDetailFull.chemical.alkaloids'),
      total: t('components.plantDetailFull.chemical.traceBelow001'),
      compounds: [
        { name: t('components.plantDetailFull.chemical.thermopsine'), amount: 'trace' },
        { name: t('components.plantDetailFull.chemical.cytisine'), amount: 'trace' },
      ],
    },
    {
      name: t('components.plantDetailFull.chemical.glycosides'),
      total: t('components.plantDetailFull.chemical.mainlyGlycyrrhizin'),
      compounds: [
        { name: t('components.plantDetailFull.chemical.glycyrrhizicAcid'), amount: '2-4%' },
        { name: t('components.plantDetailFull.chemical.liquiritin'), amount: '0.5-1%' },
      ],
    },
    {
      name: t('components.plantDetailFull.chemical.flavonoids'),
      total: '0.5-2.5%',
      compounds: [
        { name: t('components.plantDetailFull.chemical.licochalcone'), amount: '0.1-0.5%' },
        { name: t('components.plantDetailFull.chemical.glabridin'), amount: '0.1-0.3%' },
        { name: t('components.plantDetailFull.chemical.liquiritin'), amount: '0.2-0.5%' },
        { name: t('components.plantDetailFull.chemical.glabrene'), amount: '0.05-0.1%' },
      ],
    },
    {
      name: t('components.plantDetailFull.chemical.tannins'),
      total: '5-15%',
      compounds: [
        { name: t('components.plantDetailFull.chemical.hydrolyzableTannins'), amount: '3-10%' },
        { name: t('components.plantDetailFull.chemical.proanthocyanidins'), amount: '2-5%' },
      ],
    },
    {
      name: t('components.plantDetailFull.chemical.essentialOils'),
      total: t('components.plantDetailFull.chemical.belowPointOne'),
      compounds: [
        { name: t('components.plantDetailFull.chemical.caryophylleneOxide'), amount: t('components.plantDetailFull.chemical.primary') },
        { name: t('components.plantDetailFull.chemical.linalool'), amount: t('components.plantDetailFull.chemical.secondary') },
        { name: t('components.plantDetailFull.chemical.eugenol'), amount: 'trace' },
      ],
    },
    {
      name: t('components.plantDetailFull.chemical.saponins'),
      total: '5-15%',
      compounds: [
        { name: t('components.plantDetailFull.chemical.glycyrrhizicAcid'), amount: '2-4%' },
        { name: t('components.plantDetailFull.chemical.relatedSaponins'), amount: '1-3%' },
      ],
    },
    {
      name: t('components.plantDetailFull.chemical.phenolicCompounds'),
      total: t('components.plantDetailFull.chemical.variedFlavonoidsCoumarins'),
      compounds: [
        { name: t('components.plantDetailFull.chemical.coumarins'), amount: '0.1-0.5%' },
        { name: t('components.plantDetailFull.chemical.phenolicAcids'), amount: '0.2-0.8%' },
      ],
    },
  ],
}))

const growthNeeds = computed(() => ({
  light: t('components.plantDetailFull.growthNeeds.light'),
  water: t('components.plantDetailFull.growthNeeds.water'),
  soil: t('components.plantDetailFull.growthNeeds.soil'),
  temperature: t('components.plantDetailFull.growthNeeds.temperature'),
  growthAltitude: t('components.plantDetailFull.growthNeeds.growthAltitude'),
}))

const applications = computed(() => ({
  food: [
    t('components.plantDetailFull.applications.foodTea'),
    t('components.plantDetailFull.applications.foodFlavor'),
    t('components.plantDetailFull.applications.foodDrinks'),
  ],
  industrial: [
    t('components.plantDetailFull.applications.industrialExtract'),
    t('components.plantDetailFull.applications.industrialCosmetics'),
    t('components.plantDetailFull.applications.industrialSweeteners'),
  ],
  therapeutic: [
    t('components.plantDetailFull.applications.therapeuticUlcer'),
    t('components.plantDetailFull.applications.therapeuticCough'),
    t('components.plantDetailFull.applications.therapeuticAntiviral'),
    t('components.plantDetailFull.applications.therapeuticLaxative'),
  ],
}))

const toxicity = computed(() => ({
  toxicity: t('components.plantDetailFull.toxicity'),
  conservationStatus: t('components.plantDetailFull.conservationStatus'),
}))

const localNames = computed(() => [
  { name: t('components.plantDetailFull.localNames.mahak'), region: t('components.plantDetailFull.localNames.lorestan') },
  { name: t('components.plantDetailFull.localNames.mahuk'), region: t('components.plantDetailFull.localNames.kurdistan') },
  { name: t('components.plantDetailFull.localNames.aslAlSus'), region: t('components.plantDetailFull.localNames.farsKhuzestan') },
  { name: t('components.plantDetailFull.localNames.saqezbian'), region: t('components.plantDetailFull.localNames.azerbaijan') },
  { name: t('components.plantDetailFull.localNames.shirinBuyeh'), region: t('components.plantDetailFull.localNames.khorasan') },
])

const scientificSynonyms = ref([
  'Glycyrrhiza glabra var. glandulifera',
  'Liquiritia officinalis',
])

const fossilPeriod = computed(() => t('components.plantDetailFull.fossilPeriod'))
const plantStory = computed(() => t('components.plantDetailFull.plantStory'))

const quickStats = computed(() => [
  { label: t('components.plantDetailFull.quickStats.origin'), value: t('components.plantDetailFull.quickStats.easternMediterranean') },
  { label: t('components.plantDetailFull.quickStats.habitat'), value: t('components.plantDetailFull.quickStats.dryRegions') },
  { label: t('components.plantDetailFull.quickStats.iranRange'), value: t('components.plantDetailFull.quickStats.iranProvinces') },
  { label: t('components.plantDetailFull.quickStats.worldRange'), value: t('components.plantDetailFull.quickStats.mediterraneanAsia') },
])

const taxonomyLabels: Record<string, string> = {
  kingdom: 'components.plantDetailFull.taxonomy.kingdom',
  division: 'components.plantDetailFull.taxonomy.division',
  class: 'components.plantDetailFull.taxonomy.class',
  order: 'components.plantDetailFull.taxonomy.order',
  family: 'components.plantDetailFull.taxonomy.family',
  genus: 'components.plantDetailFull.taxonomy.genus',
  species: 'components.plantDetailFull.taxonomy.species',
  subspecies: 'components.plantDetailFull.taxonomy.subspeciesLabel',
}
function getTaxonomyLabel(key: string) {
  const labelKey = taxonomyLabels[key]
  return labelKey ? t(labelKey) : key
}

const morphLabels: Record<string, string> = {
  plantType: 'components.plantDetailFull.morphology.plantTypeLabel',
  leaf: 'components.plantDetailFull.morphology.leafLabel',
  flower: 'components.plantDetailFull.morphology.flowerLabel',
  stem: 'components.plantDetailFull.morphology.stemLabel',
  root: 'components.plantDetailFull.morphology.rootLabel',
  fruit: 'components.plantDetailFull.morphology.fruitLabel',
  seed: 'components.plantDetailFull.morphology.seedLabel',
  bark: 'components.plantDetailFull.morphology.barkLabel',
  latex: 'components.plantDetailFull.morphology.latexLabel',
}
function getMorphLabel(key: string) {
  const labelKey = morphLabels[key]
  return labelKey ? t(labelKey) : key
}

const needLabels: Record<string, string> = {
  light: 'components.plantDetailFull.growthNeeds.lightLabel',
  water: 'components.plantDetailFull.growthNeeds.waterLabel',
  soil: 'components.plantDetailFull.growthNeeds.soilLabel',
  temperature: 'components.plantDetailFull.growthNeeds.temperatureLabel',
  growthAltitude: 'components.plantDetailFull.growthNeeds.growthAltitudeLabel',
}
function getNeedLabel(key: string) {
  const labelKey = needLabels[key]
  return labelKey ? t(labelKey) : key
}
</script>

<template>
  <div class="min-h-screen bg-bg">
    <!-- هدر با عکس شناور -->
    <div class="relative overflow-visible bg-gradient-to-br from-primary-900 to-primary-600 px-4 pb-16 pt-10 text-white sm:px-8 md:px-16 md:pb-6 md:pt-12 lg:px-20">
      <div class="mx-auto max-w-6xl md:flex md:items-center md:gap-10">
        <!-- توجه: این عکس عمداً فیزیکی روی «چپ» ثابت شده (نه start/end منطقی) چون
             بخشی از طراحی تصویریِ هدره، نه یه چیدمان متنی که باید با جهت زبان بچرخه. -->
        <div class="relative z-10 order-first mx-auto -mb-4 flex justify-center md:order-last md:mx-0 md:mb-0 md:block md:w-[280px] md:shrink-0">
          <img
            :src="plantImage"
            :alt="plantName"
            class="size-28 rounded-full border-4 border-white object-cover shadow-xl md:size-[280px]"
          >
        </div>

        <div class="text-center md:text-start">
          <h1 class="text-3xl font-bold sm:text-4xl">
            {{ plantName }}
          </h1>
          <p class="mt-1.5 text-base italic opacity-85">
            {{ scientificName }}
          </p>
          <p class="mt-2 text-sm opacity-75">
            {{ t('components.plantDetailFull.taxonomy.authorityPrefix') }}: {{ taxonomy.authority }}
          </p>

          <button
            type="button"
            class="mt-4 inline-flex items-center rounded-full bg-accent-400/90 px-3.5 py-1.5 text-xs font-semibold text-primary-900 transition-colors hover:bg-accent-400"
            @click="goToTarget"
          >
            {{ t('components.plantDetailFull.statusLabel', { status: toxitcityStatus.lame }) }}
          </button>

          <div class="mt-4 flex justify-center gap-2 md:justify-start">
            <button
              type="button"
              class="flex size-10 items-center justify-center rounded-full bg-white/90 text-primary-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-500 hover:text-white hover:shadow-lg"
              :aria-label="t('components.plantDetailFull.save')"
            >
              <Icon
                name="lucide:bookmark"
                class="size-4"
              />
            </button>
            <button
              type="button"
              class="flex size-10 items-center justify-center rounded-full bg-white/90 text-primary-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-500 hover:text-white hover:shadow-lg"
              :aria-label="t('components.plantDetailFull.share')"
              @click="sharePlant"
            >
              <Icon
                name="lucide:share-2"
                class="size-4"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-8 md:px-16 lg:px-20">
      <!-- آمار سریع -->
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div
          v-for="stat in quickStats"
          :key="stat.label"
          class="flex flex-col items-center justify-center rounded-xl border border-ink/10 bg-surface p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="text-sm font-bold text-primary-800">
            {{ stat.value }}
          </div>
          <div class="mt-1.5 text-[11px] uppercase tracking-wide text-ink-muted">
            {{ stat.label }}
          </div>
        </div>
      </div>

      <!-- دو ستون؛ زیر md خودکار یک‌ستونی می‌شه -->
      <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
        <!-- ستون سمت راست بصری / اول در DOM: بخش‌های تشریحی -->
        <div class="flex flex-col gap-5 md:col-span-7">
          <DetailSectionCard
            :title="t('components.plantDetailFull.biology')"
            title-en="Morphology"
          >
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                v-for="(value, key) in morphology"
                :key="key"
                class="rounded-xl border border-ink/10 bg-bg/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div class="flex items-center border-b border-dashed border-ink/15 pb-1.5 text-xs text-ink-muted">
                  <span class="me-1.5 text-[10px] text-accent-500">●</span>
                  <strong class="text-ink">{{ getMorphLabel(key) }}</strong>
                </div>
                <div class="mt-2 text-sm leading-relaxed text-ink">
                  {{ value }}
                </div>
              </div>
            </div>
          </DetailSectionCard>

          <DetailSectionCard
            :title="t('components.plantDetailFull.applicationsTitle')"
            title-en="Applications"
          >
            <div class="flex flex-col gap-3">
              <div>
                <span class="me-1.5 inline-block w-4 text-xs text-primary-600">●</span>
                <strong class="text-ink">{{ t('components.plantDetailFull.applications.food') }}</strong>
                <ul class="mt-1.5 list-disc ps-5 text-sm leading-relaxed text-ink-muted">
                  <li
                    v-for="item in applications.food"
                    :key="item"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <span class="me-1.5 inline-block w-4 text-xs text-sky-600">●</span>
                <strong class="text-ink">{{ t('components.plantDetailFull.applications.industrial') }}</strong>
                <ul class="mt-1.5 list-disc ps-5 text-sm leading-relaxed text-ink-muted">
                  <li
                    v-for="item in applications.industrial"
                    :key="item"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <span class="me-1.5 inline-block w-4 text-xs text-purple-600">●</span>
                <strong class="text-ink">{{ t('components.plantDetailFull.applications.therapeutic') }}</strong>
                <ul class="mt-1.5 list-disc ps-5 text-sm leading-relaxed text-ink-muted">
                  <li
                    v-for="item in applications.therapeutic"
                    :key="item"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </DetailSectionCard>

          <DetailSectionCard
            :title="t('components.plantDetailFull.phytochemistry')"
            title-en="Phytochemistry"
          >
            <div class="rounded-xl border-e-4 border-accent-500 bg-primary-50/60 p-4">
              <span class="mb-1 block text-xs font-semibold text-ink-muted">{{ t('components.plantDetailFull.chemical.primaryIngredient') }}</span>
              <span class="text-sm font-medium text-primary-800">{{ chemicalCompounds.majorCompound }}</span>
            </div>

            <div class="mt-5 flex flex-col gap-5">
              <div
                v-for="(cat, idx) in chemicalCompounds.categories"
                :key="idx"
                class="border-b border-ink/10 pb-3 last:border-0 last:pb-0"
              >
                <div class="mb-2 flex flex-wrap items-baseline justify-between gap-1">
                  <strong class="text-sm font-semibold text-primary-800">{{ cat.name }}</strong>
                  <span class="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs text-ink-muted">{{ cat.total }}</span>
                </div>
                <ul
                  v-if="cat.compounds?.length"
                  class="flex flex-col"
                >
                  <li
                    v-for="(comp, cidx) in cat.compounds"
                    :key="cidx"
                    class="flex items-baseline justify-between border-b border-dashed border-ink/10 py-1 text-sm last:border-0"
                  >
                    <span class="font-medium text-ink-muted">{{ comp.name }}</span>
                    <span class="rounded-full bg-bg px-2 py-0.5 text-[11px] text-ink-muted">{{ comp.amount }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </DetailSectionCard>
        </div>

        <!-- ستون سمت چپ بصری / دوم در DOM: مرجع سریع -->
        <div class="flex flex-col gap-5 md:col-span-5">
          <DetailSectionCard
            :title="t('components.plantDetailFull.taxonomyTitle')"
            title-en="Taxonomy"
          >
            <table class="w-full text-center">
              <tbody>
                <tr
                  v-for="(value, key) in filteredTaxonomy"
                  :key="key"
                  class="border-b border-ink/10 last:border-0"
                >
                  <td class="w-[35%] bg-bg px-4 py-3 text-sm font-semibold text-primary-800">
                    {{ getTaxonomyLabel(key) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-ink">
                    {{ value }}
                  </td>
                </tr>
                <tr>
                  <td class="w-[35%] bg-bg px-4 py-3 text-sm font-semibold text-primary-800">
                    {{ t('components.plantDetailFull.taxonomy.authority') }}
                  </td>
                  <td class="px-4 py-3 text-sm text-ink">
                    {{ taxonomy.authority }}
                  </td>
                </tr>
              </tbody>
            </table>
          </DetailSectionCard>

          <DetailSectionCard
            :title="t('components.plantDetailFull.growthRequirements')"
            title-en="Growth Requirements"
          >
            <div class="flex flex-col gap-3">
              <div
                v-for="(value, key) in growthNeeds"
                :key="key"
                class="flex border-b border-ink/5 pb-2 last:border-0 last:pb-0"
              >
                <div class="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-primary-800">
                  {{ getNeedLabel(key) }}
                </div>
                <div class="text-sm text-ink-muted">
                  {{ value }}
                </div>
              </div>
            </div>
          </DetailSectionCard>

          <DetailSectionCard
            :title="t('components.plantDetailFull.plantStoryTitle')"
            title-en="Plant Story"
          >
            <p class="text-justify text-[0.95rem] leading-loose text-ink">
              {{ plantStory }}
            </p>
          </DetailSectionCard>

          <DetailSectionCard
            :title="t('components.plantDetailFull.toxicityTitle')"
            title-en="Toxicity"
          >
            <div class="flex items-center gap-3 rounded-xl border-s-4 border-amber-500 bg-amber-50 p-4">
              <span class="text-xl">⚠</span>
              <div class="text-sm text-ink">
                <strong>{{ t('components.plantDetailFull.toxicLabel') }}</strong> {{ toxicity.toxicity }}
              </div>
            </div>
          </DetailSectionCard>

          <div ref="targetSection" class="scroll-mt-24">
            <DetailSectionCard
              :title="t('components.plantDetailFull.conservationTitle')"
              title-en="Status"
            >
              <div class="flex items-center gap-3 rounded-xl border-s-4 border-sky-500 bg-sky-50 p-4">
                <Icon
                  name="lucide:shield"
                  class="size-5 shrink-0 text-sky-600"
                />
                <div class="text-sm text-ink">
                  <strong>{{ t('components.plantDetailFull.conservationLabel') }}</strong> {{ toxicity.conservationStatus }}
                </div>
              </div>
            </DetailSectionCard>
          </div>

          <DetailSectionCard
            :title="t('components.plantDetailFull.localNamesTitle')"
            title-en="Local Names"
          >
            <div class="flex flex-wrap gap-3">
              <div
                v-for="item in localNames"
                :key="item.name"
                class="rounded-full bg-primary-50 px-3.5 py-1.5 text-sm"
              >
                <span class="font-semibold text-primary-800">{{ item.name }}</span>
                <span class="me-1 text-[11px] text-ink-muted">({{ item.region }})</span>
              </div>
            </div>
          </DetailSectionCard>

          <DetailSectionCard
            :title="t('components.plantDetailFull.synonymsTitle')"
            title-en="Synonyms"
          >
            <div class="flex flex-col gap-2.5">
              <div
                v-for="synonym in scientificSynonyms"
                :key="synonym"
                class="flex items-center gap-2 border-b border-ink/5 py-1.5 last:border-0 last:pb-0"
              >
                <span class="text-accent-500">▹</span>
                <span class="italic text-ink">{{ synonym }}</span>
              </div>
            </div>
          </DetailSectionCard>

          <DetailSectionCard
            :title="t('components.plantDetailFull.fossilRecordTitle')"
            title-en="Fossil Record"
          >
            <div class="text-sm leading-relaxed text-ink-muted">
              <span class="me-2 text-accent-500">◈</span>{{ fossilPeriod }}
            </div>
          </DetailSectionCard>
        </div>
      </div>

      <!-- گالری تصاویر -->
      <div class="mt-8">
        <DetailSectionCard
          :title="t('components.plantDetailFull.imageGalleryTitle')"
          title-en="Image Gallery"
        >
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            <button
              v-for="(image, index) in plantGallery"
              :key="index"
              type="button"
              class="group overflow-hidden rounded-xl border border-ink/10 text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              @click="openGallery(index)"
            >
              <img
                :src="image.thumb"
                :alt="image.title"
                loading="lazy"
                class="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              >
              <div class="p-2 text-center text-xs text-ink-muted">
                {{ image.title }}
              </div>
            </button>
          </div>
        </DetailSectionCard>
      </div>
    </div>

    <!-- لایت‌باکس گالری -->
    <Teleport to="body">
      <Transition name="gallery-fade">
        <div
          v-if="galleryOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
          @click.self="galleryOpen = false"
        >
          <div class="w-full max-w-3xl">
            <div class="mb-3 flex items-center justify-between text-white">
              <span class="text-sm font-medium">{{ galleryCurrentImage?.title }}</span>
              <button
                type="button"
                class="rounded-full p-1.5 hover:bg-white/10"
                :aria-label="t('components.plantDetailFull.closeGallery')"
                @click="galleryOpen = false"
              >
                <Icon
                  name="lucide:x"
                  class="size-5"
                />
              </button>
            </div>

            <img
              :src="galleryCurrentImage?.full"
              :alt="galleryCurrentImage?.title"
              class="max-h-[70vh] w-full rounded-lg object-contain"
            >

            <div class="mt-4 flex items-center justify-center gap-4 text-white">
              <button
                type="button"
                class="rounded-full p-2 hover:bg-white/10 disabled:opacity-30"
                :disabled="galleryIndex === 0"
                :aria-label="t('components.plantDetailFull.previousImage')"
                @click="prevImage"
              >
                <Icon
                  name="lucide:chevron-right"
                  class="size-5"
                />
              </button>
              <span class="text-sm tabular-nums">{{ formattedGalleryIndex }} / {{ formattedGalleryLength }}</span>
              <button
                type="button"
                class="rounded-full p-2 hover:bg-white/10 disabled:opacity-30"
                :disabled="galleryIndex === plantGallery.length - 1"
                :aria-label="t('components.plantDetailFull.nextImage')"
                @click="nextImage"
              >
                <Icon
                  name="lucide:chevron-left"
                  class="size-5"
                />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: opacity 0.2s ease;
}
.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
}
</style>
