import { mockPlants } from './plants.mock'
import type { CareTask, TaskType, UserPlant, UserProfileData } from '~/types/user.types'
import type { HistoryEntry } from '~/stores/history.store'

/**
 * داده‌ی نمونه‌ی تست برای همه‌ی بخش‌هایی که به کاربر وابسته‌ان
 * (گیاهان من، وظایف مراقبت، تاریخچه‌ی اسکن، علاقه‌مندی‌ها و حساب کاربری).
 *
 * بخش‌های عمومی (کاتالوگ گیاهان، بلاگ، آب‌وهوا، انجمن، بیماری‌ها و ...) از قبل mock خودشون رو
 * توی بقیه‌ی فایل‌های این پوشه دارن. این فایل فقط داده‌ی «کاربر» رو می‌سازه.
 *
 * همه‌ی تاریخ‌ها نسبت به «امروز» ساخته می‌شن، پس هر بار که تست می‌گیری وظیفه‌ی عقب‌افتاده،
 * وظیفه‌ی امروز و وظیفه‌ی روزهای بعد توی داشبورد و تقویم مراقبت دیده می‌شه (برخلاف
 * seedهای قبلی که تاریخ ثابت داشتن و بعد از چند وقت همه‌شون «عقب‌افتاده» می‌شدن).
 *
 * این فایل رو plugins/demo-data.client.ts استفاده می‌کنه. وقتی Backend واقعی وصل شد،
 * هر دو رو حذف کن.
 */

/** با عوض کردن این عدد، سید دمو دوباره برای همه اعمال می‌شه */
export const DEMO_SEED_VERSION = '2026-10-14.1'

/** اگه true باشه، بعد از اولین سید کاربر دمو خودکار وارد می‌شه (برای تست صفحه‌های نیازمند ورود) */
export const DEMO_AUTO_LOGIN = true

export const DEMO_ACCOUNT = {
  email: 'demo@golban.app',
  password: 'Demo@1234',
}

export const demoProfile: UserProfileData = {
  name: 'saleh rezaei',
  birthDate: '1995-04-12',
  gender: 'male',
  phone: '09121234567',
  nationalId: '0012345678',
}

/** عکس پروفایل SVG (بدون نیاز به فایل تصویر)؛ حرف اول اسم روی دایره‌ی سبز */
export function demoAvatar(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#2d8659"/><text x="48" y="64" font-size="44" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#fff">${demoProfile.name.charAt(0)}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/** تاریخ YYYY-MM-DD با آفست روز نسبت به امروز (همون فرمتی که بقیه‌ی پروژه استفاده می‌کنه) */
export function dayOffset(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function plantPhoto(slug: string): string {
  return mockPlants.find(p => p.slug === slug)?.images[0] ?? '/images/plants/header.png'
}

interface PlantSpec {
  slug: string
  nickname: string
  location: string
  healthStatus: UserPlant['healthStatus']
  /** چند روز پیش خریده/گرفته شده */
  acquiredDaysAgo: number
  /** هر چند روز یه بار آبیاری می‌شه */
  waterEvery: number
  /** آخرین آبیاری چند روز پیش بوده */
  lastWateredDaysAgo: number
}

// 7 گیاه با وضعیت‌های مختلف: 4 سالم، 2 نیازمند توجه، 1 بیمار
const plantSpecs: PlantSpec[] = [
  { slug: 'monstera-deliciosa', nickname: 'مونی', location: 'پذیرایی', healthStatus: 'healthy', acquiredDaysAgo: 340, waterEvery: 7, lastWateredDaysAgo: 3 },
  { slug: 'ficus-lyrata', nickname: 'فیکوسی', location: 'اتاق کار', healthStatus: 'needs_attention', acquiredDaysAgo: 240, waterEvery: 7, lastWateredDaysAgo: 8 },
  { slug: 'sansevieria-trifasciata', nickname: 'زبونی', location: 'راهرو', healthStatus: 'healthy', acquiredDaysAgo: 430, waterEvery: 14, lastWateredDaysAgo: 6 },
  { slug: 'aloe-vera', nickname: 'آلوئه‌جون', location: 'آشپزخانه', healthStatus: 'healthy', acquiredDaysAgo: 150, waterEvery: 12, lastWateredDaysAgo: 12 },
  { slug: 'epipremnum-aureum', nickname: 'پوتوس طلایی', location: 'اتاق خواب', healthStatus: 'healthy', acquiredDaysAgo: 90, waterEvery: 6, lastWateredDaysAgo: 2 },
  { slug: 'calathea-orbifolia', nickname: 'کالاتیا خانم', location: 'پذیرایی', healthStatus: 'needs_attention', acquiredDaysAgo: 60, waterEvery: 5, lastWateredDaysAgo: 5 },
  { slug: 'echeveria-elegans', nickname: 'اکوریای کوچولو', location: 'بالکن', healthStatus: 'sick', acquiredDaysAgo: 30, waterEvery: 14, lastWateredDaysAgo: 4 },
]

export function buildDemoUserPlants(): UserPlant[] {
  return plantSpecs.map((spec, i) => ({
    id: `up${i + 1}`,
    plantSlug: spec.slug,
    nickname: spec.nickname,
    photo: plantPhoto(spec.slug),
    acquiredAt: dayOffset(-spec.acquiredDaysAgo),
    location: spec.location,
    healthStatus: spec.healthStatus,
    lastWateredAt: dayOffset(-spec.lastWateredDaysAgo),
    nextWateringAt: dayOffset(spec.waterEvery - spec.lastWateredDaysAgo),
  }))
}

export function buildDemoTasks(): CareTask[] {
  const plants = buildDemoUserPlants()
  const tasks: CareTask[] = []
  let n = 0
  const add = (userPlantId: string, type: TaskType, offsetDays: number, done = false) => {
    n += 1
    tasks.push({ id: `t${n}`, userPlantId, type, dueDate: dayOffset(offsetDays), done })
  }

  // آبیاری هر گیاه سر موعد خودش (بعضی عقب‌افتاده، بعضی امروز، بعضی فردا یا چند روز بعد)
  plants.forEach((plant) => {
    if (plant.nextWateringAt) {
      const diff = Math.round((new Date(plant.nextWateringAt).getTime() - new Date(dayOffset(0)).getTime()) / 86_400_000)
      add(plant.id, 'water', diff)
    }
  })

  // کارهای دیگه: انواع مختلف، روزهای مختلف داخل و بیرون از هفته‌ی جاری
  add('up1', 'mist', 1)
  add('up2', 'fertilize', 0)
  add('up2', 'prune', 4)
  add('up3', 'fertilize', 9)
  add('up4', 'repot', 12)
  add('up5', 'prune', 2)
  add('up6', 'mist', 0)
  add('up6', 'mist', 2)
  add('up6', 'fertilize', 6)
  add('up7', 'repot', 3)

  // کارهای انجام‌شده‌ی قبلی (نباید توی لیست‌ها دیده بشن)
  add('up1', 'water', -4, true)
  add('up5', 'water', -4, true)
  add('up3', 'fertilize', -10, true)

  return tasks
}

// نتیجه‌های اسکن تأییدشده: [slug، چند روز پیش، دقت]
const scanSpecs: [string, number, number][] = [
  ['monstera-deliciosa', 0, 0.96],
  ['aloe-vera', 1, 0.91],
  ['ficus-lyrata', 3, 0.88],
  ['epipremnum-aureum', 4, 0.94],
  ['spathiphyllum', 6, 0.83],
  ['sansevieria-trifasciata', 9, 0.97],
  ['zamioculcas-zamiifolia', 12, 0.86],
  ['calathea-orbifolia', 16, 0.79],
  ['philodendron-hederaceum', 21, 0.9],
]

export function buildDemoHistory(): HistoryEntry[] {
  const now = Date.now()
  return scanSpecs.flatMap(([slug, daysAgo, confidence], i) => {
    const plant = mockPlants.find(p => p.slug === slug)
    if (!plant) return []
    return [{
      id: `demo-scan-${i + 1}`,
      // ساعت‌های مختلف تا ترتیب مرتب‌سازی و تاریخ‌ها طبیعی به نظر بیاد
      timestamp: now - daysAgo * 86_400_000 - (i % 5) * 3_600_000 - 40 * 60_000,
      image: plant.images[0] ?? '/images/plants/header.png',
      plantName: plant.name,
      scientificName: plant.scientificName,
      confidence,
      slug: plant.slug,
    }]
  })
}

/** علاقه‌مندی‌ها: گیاه‌هایی که توی «گیاهان من» نیستن تا لیست معنی‌دار باشه */
export const demoWishlistSlugs = [
  'philodendron-hederaceum',
  'zamioculcas-zamiifolia',
  'spathiphyllum',
  'lavandula-angustifolia',
  'rosa-chinensis',
]

/** انجمن: کاربرهایی که دمو دنبال می‌کنه، پست‌هایی که لایک کرده و کامنتش */
export const demoCommunity = {
  followingIds: ['u2', 'u3'],
  likedPostIds: ['post1', 'post3'],
  comment: { postId: 'post1', content: 'چقدر قشنگه! مال من هم همین‌قدر شاداب بشه خوشحال می‌شم 🌿' },
}