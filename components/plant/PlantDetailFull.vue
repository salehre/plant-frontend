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
const uiStore = useUiStore()

const targetSection = ref<HTMLElement | null>(null)

function goToTarget() {
  targetSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ============ اطلاعات اصلی گیاه ============
const plantName = ref('شیرین بیان')
const scientificName = ref('Glycyrrhiza glabra L.')
const plantImage = ref('plant1.png')

const toxitcityStatus = ref({
  lame: 'در معرض تهدید',
  extinct: 'منقرض شده',
  stable: 'وضعیت پایدار',
  notFound: 'اطلاعات کافی موجود نیست',
})

const plantGallery = ref([
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Glycyrrhiza_glabra_LC0256.jpg/400px-Glycyrrhiza_glabra_LC0256.jpg',
    full: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Glycyrrhiza_glabra_LC0256.jpg',
    title: 'گل و برگ شیرین بیان',
  },
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Glycyrrhiza_glabra_-_Köhler–s_Medizinal-Pflanzen-069.jpg/400px-Glycyrrhiza_glabra_-_Köhler–s_Medizinal-Pflanzen-069.jpg',
    full: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Glycyrrhiza_glabra_-_Köhler–s_Medizinal-Pflanzen-069.jpg',
    title: 'نقشه علمی گیاه',
  },
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Liquorice_roots.jpg/400px-Liquorice_roots.jpg',
    full: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Liquorice_roots.jpg',
    title: 'ریشه شیرین بیان',
  },
  {
    thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Glycyrrhiza_glabra_001.JPG/400px-Glycyrrhiza_glabra_001.JPG',
    full: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Glycyrrhiza_glabra_001.JPG',
    title: 'گل‌های بنفش شیرین بیان',
  },
])

const galleryOpen = ref(false)
const galleryIndex = ref(0)
const galleryCurrentImage = computed(() => plantGallery.value[galleryIndex.value])
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
  const shareData = { title: plantName.value, text: scientificName.value, url: window.location.href }
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
  uiStore.showToast('لینک صفحه کپی شد')
}

const taxonomy = ref({
  kingdom: 'Plantae',
  division: 'Magnoliophyta',
  class: 'Magnoliopsida',
  order: 'Fabales',
  family: 'Fabaceae',
  genus: 'Glycyrrhiza',
  species: 'Glycyrrhiza glabra',
  subspecies: 'معمولاً زیرگونه‌های شناخته‌شده ندارد',
  authority: 'Linnaeus (L.)',
})
const filteredTaxonomy = computed(() => {
  const { authority, ...rest } = taxonomy.value
  return rest
})

const morphology = ref({
  plantType: 'علفی چندساله (perennial herb)',
  leaf: 'مرکب شانه‌ای، حاشیه صاف، آرایش متناوب روی ساقه',
  flower: 'بنفش کم‌رنگ تا آبی، گلبرگ‌های پروانه‌ای',
  stem: 'راست یا متمایل، نیمه‌چوبی در پایه',
  root: 'غده‌ای ـ راست ـ بسیار گسترده و منشعب (بخش دارویی اصلی)',
  fruit: 'نیام کوچک',
  seed: 'کوچک، تخم‌مرغی',
  bark: 'پوست زرد ـ قهوه‌ای',
  latex: 'ندارد (فاقد شیرابه لاتکسی)',
})

const chemicalCompounds = ref({
  majorCompound: 'گلیسیریزین (Glycyrrhizin) - یک ساپونین تری‌ترپنوئیدی',
  categories: [
    {
      name: 'آلکالوئیدها',
      total: 'بسیار کم (Trace, <0.01%)',
      compounds: [
        { name: 'ترموپسین (Thermopsine)', amount: 'trace' },
        { name: 'سیتیسین (Cytisine)', amount: 'trace' },
      ],
    },
    {
      name: 'گلیکوزیدها',
      total: '2-5% (عمدتاً گلیسیریزین)',
      compounds: [
        { name: 'اسید گلیسیریزیک (Glycyrrhizic acid)', amount: '2-4%' },
        { name: 'لیکوریتین (Liquiritin)', amount: '0.5-1%' },
      ],
    },
    {
      name: 'فلاونوئیدها',
      total: '0.5-2.5%',
      compounds: [
        { name: 'لیکوکالکون A (Licochalcone A)', amount: '0.1-0.5%' },
        { name: 'گلابریدین (Glabridin)', amount: '0.1-0.3%' },
        { name: 'لیکوریتین (Liquiritin)', amount: '0.2-0.5%' },
        { name: 'گلابرن (Glabrene)', amount: '0.05-0.1%' },
      ],
    },
    {
      name: 'تانن‌ها',
      total: '5-15%',
      compounds: [
        { name: 'تانن‌های هیدرولیز شونده (گالوتانن‌ها)', amount: '3-10%' },
        { name: 'پروآنتوسیانیدین‌ها', amount: '2-5%' },
      ],
    },
    {
      name: 'اسانس‌ها (روغن فرار)',
      total: 'کمتر از 0.1%',
      compounds: [
        { name: 'اکسید کاریوفیلن (Caryophyllene oxide)', amount: 'اصلی' },
        { name: 'لینالول (Linalool)', amount: 'فرعی' },
        { name: 'یوژنول (Eugenol)', amount: 'trace' },
      ],
    },
    {
      name: 'ساپونین‌ها',
      total: '5-15%',
      compounds: [
        { name: 'اسید گلیسیریزیک (Glycyrrhizic acid)', amount: '2-4%' },
        { name: 'ساپونین‌های مرتبط (Glycyrrhizin analogues)', amount: '1-3%' },
      ],
    },
    {
      name: 'ترکیبات فنولی',
      total: 'متنوع، شامل فلاونوئیدها و کومارین‌ها',
      compounds: [
        { name: 'کومارین‌ها (مانند هیدروکسی کومارین)', amount: '0.1-0.5%' },
        { name: 'فنولیک اسیدها (p-coumaric, ferulic)', amount: '0.2-0.8%' },
      ],
    },
  ],
})

const growthNeeds = ref({
  light: 'آفتاب کامل',
  water: 'متوسط؛ تحمل خشکی دارد',
  soil: 'لومی، سبک، عمیق، با زهکشی خوب',
  temperature: 'معتدل تا گرم؛ مقاومت مناسب در برابر گرما',
  growthAltitude: 'حدود ۲۰۰ تا ۱۵۰۰ متر از سطح دریا',
})

const applications = ref({
  food: [
    'شیرین‌کننده طبیعی در دمنوش‌ها',
    'طعم‌دهنده در صنعت شیرینی‌پزی',
    'ماده اولیه نوشیدنی‌های سنتی',
  ],
  industrial: [
    'عصاره‌گیری برای صنایع داروسازی',
    'افزودنی در محصولات آرایشی‌بهداشتی',
    'ماده اولیه در تولید شیرین‌کننده‌های صنعتی',
  ],
  therapeutic: [
    'درمان زخم معده و التهاب دستگاه گوارش',
    'کاهش سرفه و خلط‌آوری',
    'ضدویروس در درمان تبخال',
    'ملین ملایم و ضد یبوست',
  ],
})

const toxicity = ref({
  toxicity: 'مصرف زیاد باعث افزایش فشار خون، احتباس آب و سدیم، کاهش پتاسیم',
  conservationStatus: 'در برخی مناطق ایران برداشت بی‌رویه باعث تهدید جمعیت طبیعی شده، اما به‌طور رسمی در لیست انقراض جهانی نیست',
})

const localNames = ref([
  { name: 'مهک', region: 'لرستان' },
  { name: 'مهوک', region: 'کردستان' },
  { name: 'اصل‌السوس', region: 'فارس و خوزستان' },
  { name: 'سقزبیان', region: 'آذربایجان' },
  { name: 'شیرین‌بویه', region: 'خراسان' },
])

const scientificSynonyms = ref([
  'Glycyrrhiza glabra var. glandulifera',
  'Liquiritia officinalis',
])

const fossilPeriod = ref(
  'شواهد نشان می‌دهد جنس Glycyrrhiza در دوران پلیوسن حضور داشته؛ تاریخچه تکاملی چندمیلیون ساله دارد.',
)

const plantStory = ref(
  'شیرین‌بیان یکی از کهن‌ترین گیاهان دارویی دنیاست؛ در متون پزشکی مصر باستان، چین و ایران باستان از آن نام برده شده. سربازان ایرانی در دوره هخامنشی برای جلوگیری از تشنگی در سفرهای طولانی ریشهٔ آن را می‌جویدند، زیرا گلیسیریزین سبب احساس شیرینی و افزایش ترشح بزاق می‌شود.',
)

const quickStats = ref([
  { label: 'مبدا', value: 'مدیترانه شرقی' },
  { label: 'زیستگاه', value: 'مناطق خشک، نیمه‌خشک' },
  { label: 'گستره ایران', value: 'آذربایجان، خراسان، لرستان، فارس' },
  { label: 'گستره جهانی', value: 'مدیترانه تا آسیا' },
])

const taxonomyLabels: Record<string, string> = {
  kingdom: 'فرمانرو',
  division: 'دسته',
  class: 'رده',
  order: 'راسته',
  family: 'تیره',
  genus: 'جنس',
  species: 'گونه',
  subspecies: 'زیرگونه',
}
function getTaxonomyLabel(key: string) {
  return taxonomyLabels[key] ?? key
}

const morphLabels: Record<string, string> = {
  plantType: 'نوع گیاه',
  leaf: 'برگ',
  flower: 'گل',
  stem: 'ساقه',
  root: 'ریشه',
  fruit: 'میوه',
  seed: 'دانه',
  bark: 'پوست',
  latex: 'شیرابه',
}
function getMorphLabel(key: string) {
  return morphLabels[key] ?? key
}

const needLabels: Record<string, string> = {
  light: 'نور',
  water: 'آب',
  soil: 'خاک',
  temperature: 'دما',
  growthAltitude: 'ارتفاع رویش',
}
function getNeedLabel(key: string) {
  return needLabels[key] ?? key
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
            وضع‌کننده: {{ taxonomy.authority }}
          </p>

          <button
            type="button"
            class="mt-4 inline-flex items-center rounded-full bg-accent-400/90 px-3.5 py-1.5 text-xs font-semibold text-primary-900 transition-colors hover:bg-accent-400"
            @click="goToTarget"
          >
            وضعیت حفاظتی: {{ toxitcityStatus.lame }}
          </button>

          <div class="mt-4 flex justify-center gap-2 md:justify-start">
            <button
              type="button"
              class="flex size-10 items-center justify-center rounded-full bg-white/90 text-primary-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-500 hover:text-white hover:shadow-lg"
              aria-label="ذخیره در نشان‌شده‌ها"
            >
              <Icon
                name="lucide:bookmark"
                class="size-4"
              />
            </button>
            <button
              type="button"
              class="flex size-10 items-center justify-center rounded-full bg-white/90 text-primary-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-500 hover:text-white hover:shadow-lg"
              aria-label="اشتراک‌گذاری"
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
            title="ویژگی‌های زیست‌شناسی"
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
            title="کاربردها"
            title-en="Applications"
          >
            <div class="flex flex-col gap-3">
              <div>
                <span class="me-1.5 inline-block w-4 text-xs text-primary-600">●</span>
                <strong class="text-ink">خوراکی:</strong>
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
                <strong class="text-ink">صنعتی:</strong>
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
                <strong class="text-ink">درمانی:</strong>
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
            title="ترکیبات شیمیایی"
            title-en="Phytochemistry"
          >
            <div class="rounded-xl border-e-4 border-accent-500 bg-primary-50/60 p-4">
              <span class="mb-1 block text-xs font-semibold text-ink-muted">ماده مؤثره اصلی:</span>
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
            title="طبقه‌بندی علمی"
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
                    وضع‌کننده (Authority)
                  </td>
                  <td class="px-4 py-3 text-sm text-ink">
                    {{ taxonomy.authority }}
                  </td>
                </tr>
              </tbody>
            </table>
          </DetailSectionCard>

          <DetailSectionCard
            title="نیازهای رشدی"
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
            title="داستان گیاه"
            title-en="Plant Story"
          >
            <p class="text-justify text-[0.95rem] leading-loose text-ink">
              {{ plantStory }}
            </p>
          </DetailSectionCard>

          <DetailSectionCard
            title="سمّیت"
            title-en="Toxicity"
          >
            <div class="flex items-center gap-3 rounded-xl border-s-4 border-amber-500 bg-amber-50 p-4">
              <span class="text-xl">⚠</span>
              <div class="text-sm text-ink">
                <strong>سمیت:</strong> {{ toxicity.toxicity }}
              </div>
            </div>
          </DetailSectionCard>

          <div ref="targetSection" class="scroll-mt-24">
            <DetailSectionCard
              title="حفاظت"
              title-en="Status"
            >
              <div class="flex items-center gap-3 rounded-xl border-s-4 border-sky-500 bg-sky-50 p-4">
                <Icon
                  name="lucide:shield"
                  class="size-5 shrink-0 text-sky-600"
                />
                <div class="text-sm text-ink">
                  <strong>وضعیت حفاظتی:</strong> {{ toxicity.conservationStatus }}
                </div>
              </div>
            </DetailSectionCard>
          </div>

          <DetailSectionCard
            title="نام‌های محلی"
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
            title="مترادف‌های علمی"
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
            title="دوره فسیلی"
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
          title="گالری تصاویر"
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
                aria-label="بستن"
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
                aria-label="قبلی"
                @click="prevImage"
              >
                <Icon
                  name="lucide:chevron-right"
                  class="size-5"
                />
              </button>
              <span class="text-sm tabular-nums">{{ galleryIndex + 1 }} / {{ plantGallery.length }}</span>
              <button
                type="button"
                class="rounded-full p-2 hover:bg-white/10 disabled:opacity-30"
                :disabled="galleryIndex === plantGallery.length - 1"
                aria-label="بعدی"
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
