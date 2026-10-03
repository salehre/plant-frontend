import type { Disease } from '~/types/disease.types'
import type { MockLocale } from './mock-locale'

export const mockDiseases: Disease[] = [
  {
    id: 'd1',
    slug: 'leaf-spot-fungal',
    name: 'لکه برگی قارچی',
    category: 'fungal',
    symptoms: ['لکه‌های قهوه‌ای یا سیاه روی برگ', 'حاشیه زرد دور لکه‌ها', 'ریزش برگ‌های آلوده'],
    causes: ['رطوبت بیش‌ازحد روی برگ', 'تهویه ضعیف', 'آبیاری از بالای برگ'],
    treatment: ['حذف برگ‌های آلوده', 'کاهش رطوبت اطراف گیاه', 'استفاده از قارچ‌کش مناسب در صورت گسترش'],
    image: '/images/plants/botanical-1.webp',
    severity: 'medium',
  },
  {
    id: 'd2',
    slug: 'spider-mites',
    name: 'کنه تارتن',
    category: 'pest',
    symptoms: ['تارهای ریز زیر برگ', 'نقاط زرد کمرنگ روی سطح برگ', 'ضعف عمومی گیاه'],
    causes: ['هوای خشک و گرم', 'عدم بازرسی دوره‌ای گیاه'],
    treatment: ['شست‌وشوی برگ‌ها با آب', 'افزایش رطوبت محیط', 'استفاده از روغن نیم یا صابون حشره‌کش'],
    image: '/images/plants/botanical-2.webp',
    severity: 'high',
  },
  {
    id: 'd3',
    slug: 'root-rot',
    name: 'پوسیدگی ریشه',
    category: 'environmental',
    symptoms: ['زرد شدن و افتادگی برگ‌ها', 'بوی نامطبوع از خاک', 'نرم و سیاه شدن ریشه‌ها'],
    causes: ['آبیاری بیش‌ازحد', 'خاک بدون زهکش مناسب', 'گلدان بدون سوراخ زهکشی'],
    treatment: ['کاهش دفعات آبیاری', 'تعویض خاک و هرس ریشه‌های پوسیده', 'استفاده از گلدان با زهکش مناسب'],
    image: '/images/plants/botanical-3.webp',
    severity: 'high',
  },
  {
    id: 'd4',
    slug: 'nutrient-deficiency',
    name: 'کمبود مواد غذایی',
    category: 'nutrient',
    symptoms: ['زرد شدن یکنواخت برگ‌های قدیمی', 'رشد کند', 'کوچک ماندن برگ‌های جدید'],
    causes: ['کمبود نیتروژن یا آهن در خاک', 'عدم کوددهی طولانی‌مدت'],
    treatment: ['استفاده از کود مایع متعادل هر ۲ هفته', 'بررسی pH خاک'],
    image: '/images/plants/botanical-5.webp',
    severity: 'low',
  },
]

const englishDiseases: Record<string, Pick<Disease, 'name' | 'symptoms' | 'causes' | 'treatment'>> = {
  'leaf-spot-fungal': {
    name: 'Fungal Leaf Spot',
    symptoms: ['Brown or black spots on leaves', 'Yellow halos around the spots', 'Infected leaves dropping'],
    causes: ['Excess moisture on leaves', 'Poor ventilation', 'Watering from above the foliage'],
    treatment: ['Remove infected leaves', 'Reduce humidity around the plant', 'Apply a suitable fungicide if the infection spreads'],
  },
  'spider-mites': {
    name: 'Spider Mites',
    symptoms: ['Fine webbing under leaves', 'Pale yellow dots on leaf surfaces', 'General weakening of the plant'],
    causes: ['Hot, dry air', 'Infrequent plant inspections'],
    treatment: ['Rinse leaves with water', 'Increase ambient humidity', 'Use neem oil or insecticidal soap'],
  },
  'root-rot': {
    name: 'Root Rot',
    symptoms: ['Yellowing and drooping leaves', 'Unpleasant odor from the soil', 'Soft, blackened roots'],
    causes: ['Overwatering', 'Poorly draining soil', 'A pot without drainage holes'],
    treatment: ['Water less often', 'Replace the soil and trim rotted roots', 'Use a pot with adequate drainage'],
  },
  'nutrient-deficiency': {
    name: 'Nutrient Deficiency',
    symptoms: ['Uniform yellowing of older leaves', 'Slow growth', 'New leaves remaining small'],
    causes: ['Low nitrogen or iron in the soil', 'Going too long without fertilizing'],
    treatment: ['Apply a balanced liquid fertilizer every two weeks', 'Check the soil pH'],
  },
}

function localizeDisease(disease: Disease, locale: MockLocale): Disease {
  const translation = locale === 'en' ? englishDiseases[disease.slug] : undefined
  return {
    ...disease,
    name: translation?.name ?? disease.name,
    symptoms: [...(translation?.symptoms ?? disease.symptoms)],
    causes: [...(translation?.causes ?? disease.causes)],
    treatment: [...(translation?.treatment ?? disease.treatment)],
  }
}

export function getMockDiseases(locale: MockLocale = 'fa'): Disease[] {
  return mockDiseases.map(disease => localizeDisease(disease, locale))
}

export function findDiseaseBySlug(slug: string, locale: MockLocale = 'fa'): Disease | undefined {
  const disease = mockDiseases.find(d => d.slug === slug)
  return disease ? localizeDisease(disease, locale) : undefined
}