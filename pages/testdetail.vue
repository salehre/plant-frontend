<!--
  صفحه‌ی جزئیات گیاه - بازنویسی‌شده با Tailwind (بدون Vuetify)
  عمداً همه‌چیز توی همین یک فایل نگه داشته شده (طبق درخواست)، بدون تقسیم به
  کامپوننت‌های جدا. برای استفاده کافیه این فایل رو توی pages/ یا هرجای دیگه‌ی
  پروژه بذاری و دیتای واقعی (props / fetch) رو جایگزین دیتای نمونه‌ی پایین کنی.
-->
<script setup lang="ts">
import { ref, computed } from 'vue'

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
  uiStore.showToast(isBookmarked.value ? 'به نشان‌شده‌ها اضافه شد' : 'از نشان‌شده‌ها حذف شد', 'success')
}
const sharePlant = async () => {
  const shareData = { title: plantName.value, text: scientificName.value, url: window.location.href }
  try {
    if (navigator.share) {
      await navigator.share(shareData)
    }
    else {
      await navigator.clipboard.writeText(window.location.href)
      uiStore.showToast('لینک کپی شد', 'success')
    }
  }
  catch {
    // کاربر اشتراک‌گذاری رو لغو کرده - نیازی به توست خطا نیست
  }
}

// ============ اطلاعات اصلی گیاه ============
const plantName = ref('شیرین بیان')
const scientificName = ref('Glycyrrhiza glabra L.')
const plantImage = ref('plant1.png')

const toxitcityStatus = ref({
  lame: 'درمعرض تهدید',
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
  majorCompound: 'گلیسیریزین (Glycyrrhizin) - یک ساپونین تری ترپنوئیدی',
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
  growthAltitude: 'حدود 200 تا 1500 متر از سطح دریا',
})
const growthIcons: Record<string, string> = {
  light: 'lucide:sun',
  water: 'lucide:droplets',
  soil: 'lucide:mountain',
  temperature: 'lucide:thermometer',
  growthAltitude: 'lucide:trending-up',
}

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
const getTaxonomyLabel = (key: string) => taxonomyLabels[key] || key

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
const getMorphLabel = (key: string) => morphLabels[key] || key

const needLabels: Record<string, string> = {
  light: 'نور',
  water: 'آب',
  soil: 'خاک',
  temperature: 'دما',
  growthAltitude: 'ارتفاع رویش',
}
const getNeedLabel = (key: string) => needLabels[key] || key
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
            وضع‌کننده: {{ taxonomy.authority }}
          </p>

          <button
            class="mt-1 inline-flex items-center gap-1 rounded-full bg-accent-400/90 px-3 py-1.5 text-xs font-semibold text-primary-900 transition hover:bg-accent-300"
            @click="goToTarget"
          >
            وضعیت حفاظتی: {{ toxitcityStatus.lame }}
          </button>

          <div class="mt-1 flex items-center gap-2">
            <button
              class="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-accent-400 hover:text-primary-900"
              :aria-pressed="isBookmarked"
              @click="toggleBookmark"
            >
              <Icon :name="isBookmarked ? 'lucide:bookmark-check' : 'lucide:bookmark'" class="size-4" />
            </button>
            <button
              class="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-accent-400 hover:text-primary-900"
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
          class="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-ink/10 bg-surface px-3 py-4 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
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
          <section class="rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              طبقه‌بندی علمی
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
                    وضع‌کننده (Authority)
                  </td>
                  <td class="px-4 py-3 text-xs text-ink">
                    {{ taxonomy.authority }}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ویژگی‌های مورفولوژیک -->
          <section class="rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              ویژگی‌های زیست‌شناسی
              <span class="text-xs font-normal tracking-wide text-ink-muted">Morphology</span>
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
          <section class="rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              کاربردها
              <span class="text-xs font-normal tracking-wide text-ink-muted">Applications</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="space-y-3">
              <div>
                <span class="text-status-success">●</span>
                <strong class="text-sm"> خوراکی:</strong>
                <ul class="mr-5 mt-1.5 list-none space-y-1.5">
                  <li v-for="item in applications.food" :key="item" class="text-sm text-ink">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <span class="text-status-info">●</span>
                <strong class="text-sm"> صنعتی:</strong>
                <ul class="mr-5 mt-1.5 list-none space-y-1.5">
                  <li v-for="item in applications.industrial" :key="item" class="text-sm text-ink">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <span class="text-accent-600">●</span>
                <strong class="text-sm"> درمانی:</strong>
                <ul class="mr-5 mt-1.5 list-none space-y-1.5">
                  <li v-for="item in applications.therapeutic" :key="item" class="text-sm text-ink">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- ترکیبات شیمیایی -->
          <section class="rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              ترکیبات شیمیایی
              <span class="text-xs font-normal tracking-wide text-ink-muted">Phytochemistry</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />

            <div class="rounded-md border-r-4 border-accent-400 bg-bg px-4 py-3">
              <span class="block text-xs font-semibold text-ink-muted">ماده مؤثره اصلی:</span>
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
          <section class="rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              نیازهای رشدی
              <span class="text-xs font-normal tracking-wide text-ink-muted">Growth Requirements</span>
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
          <section class="rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              داستان گیاه
              <span class="text-xs font-normal tracking-wide text-ink-muted">Plant Story</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <p class="text-justify text-sm leading-8 text-ink">
              {{ plantStory }}
            </p>
          </section>

          <!-- سمیت -->
          <section class="rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              سمّیت
              <span class="text-xs font-normal tracking-wide text-ink-muted">Toxicity</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex items-center gap-3 rounded-md border-r-4 border-status-warning bg-amber-50 px-4 py-3">
              <Icon name="lucide:triangle-alert" class="size-5 shrink-0 text-status-warning" />
              <div class="text-sm text-ink"><strong>سمیت:</strong> {{ toxicity.toxicity }}</div>
            </div>
          </section>

          <!-- حفاظت -->
          <section ref="targetSection" class="rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              حفاظت
              <span class="text-xs font-normal tracking-wide text-ink-muted">Status</span>
            </h2>
            <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
            <div class="flex items-center gap-3 rounded-md border-r-4 border-status-info bg-sky-50 px-4 py-3">
              <Icon name="lucide:shield" class="size-5 shrink-0 text-status-info" />
              <div class="text-sm text-ink"><strong>وضعیت حفاظتی:</strong> {{ toxicity.conservationStatus }}</div>
            </div>
          </section>

          <!-- نام‌های محلی -->
          <section class="rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              نام‌های محلی
              <span class="text-xs font-normal tracking-wide text-ink-muted">Local Names</span>
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
          <section class="rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              مترادف‌های علمی
              <span class="text-xs font-normal tracking-wide text-ink-muted">Synonyms</span>
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
          <section class="rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
            <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
              دوره فسیلی
              <span class="text-xs font-normal tracking-wide text-ink-muted">Fossil Record</span>
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
      <section class="mt-6 rounded-lg border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
        <h2 class="flex items-baseline gap-2 font-serif text-lg font-semibold text-primary-900">
          گالری تصاویر
          <span class="text-xs font-normal tracking-wide text-ink-muted">Image Gallery</span>
        </h2>
        <div class="mt-2 mb-4 h-0.5 w-14 bg-accent-400" />
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <button
            v-for="(image, index) in plantGallery"
            :key="index"
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
            <button class="flex size-8 items-center justify-center rounded-full text-ink-muted hover:bg-bg" @click="closeGallery">
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
              @click="prevImage"
            >
              <Icon name="lucide:chevron-right" class="size-4" />
            </button>
            <span class="text-sm text-ink-muted">{{ galleryIndex + 1 }} / {{ plantGallery.length }}</span>
            <button
              class="flex size-9 items-center justify-center rounded-full border border-ink/10 text-ink disabled:opacity-30"
              :disabled="galleryIndex === plantGallery.length - 1"
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