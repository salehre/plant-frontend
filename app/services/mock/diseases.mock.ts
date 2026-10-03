import type { Disease } from '~/types/disease.types'

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

export function findDiseaseBySlug(slug: string): Disease | undefined {
  return mockDiseases.find(d => d.slug === slug)
}