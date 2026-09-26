import type { Plant } from '~/types/plant.types'

export const mockPlants: Plant[] = [
  {
    id: 'p1',
    slug: 'monstera-deliciosa',
    name: 'مونستِرا',
    scientificName: 'Monstera deliciosa',
    images: [
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800',
    ],
    description:
      'مونستِرا یکی از محبوب‌ترین گیاهان آپارتمانی است که با برگ‌های بزرگ و شکاف‌دار خود فضای هر خانه‌ای را دگرگون می‌کند. این گیاه نسبتاً کم‌توقع است و برای مبتدیان مناسب است.',
    care: {
      light: 'medium',
      water: 'medium',
      temperatureRange: [18, 27],
      soil: 'خاک سبک و زهکش‌دار با کمپوست برگ',
      humidity: 'medium',
      wateringFrequencyDays: 7,
    },
    toxicity: { isToxic: true, toxicTo: ['cat', 'dog'] },
    commonIssues: ['d1', 'd3'],
    category: 'آپارتمانی',
    family: 'Araceae',
    genus: 'Monstera',
    difficulty: 'easy',
  },
  {
    id: 'p2',
    slug: 'sansevieria-trifasciata',
    name: 'زبان مادرشوهر',
    scientificName: 'Sansevieria trifasciata',
    images: ['https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=800'],
    description:
      'یکی از مقاوم‌ترین گیاهان آپارتمانی که در کم‌نوری و بی‌توجهی هم زنده می‌ماند. انتخابی عالی برای کسانی که تازه شروع به نگهداری گیاه کرده‌اند.',
    care: {
      light: 'low',
      water: 'low',
      temperatureRange: [15, 30],
      soil: 'خاک کاکتوسی با زهکش بالا',
      humidity: 'low',
      wateringFrequencyDays: 14,
    },
    toxicity: { isToxic: true, toxicTo: ['cat', 'dog'] },
    commonIssues: ['d3'],
    category: 'آپارتمانی',
    family: 'Asparagaceae',
    genus: 'Sansevieria',
    difficulty: 'easy',
  },
  {
    id: 'p3',
    slug: 'ficus-lyrata',
    name: 'فیکوس برگ انجیری',
    scientificName: 'Ficus lyrata',
    images: ['https://images.unsplash.com/photo-1616500163246-742b4b5c15a1?w=800'],
    description:
      'با برگ‌های بزرگ و براق شبیه به برگ انجیر، این گیاه به‌عنوان یک المان دکوراتیو محبوب شناخته می‌شود، اما نسبت به تغییر محیط حساس است.',
    care: {
      light: 'high',
      water: 'medium',
      temperatureRange: [18, 24],
      soil: 'خاک غنی و زهکش‌دار',
      humidity: 'medium',
      wateringFrequencyDays: 7,
    },
    toxicity: { isToxic: true, toxicTo: ['cat', 'dog'] },
    commonIssues: ['d1', 'd2'],
    category: 'آپارتمانی',
    family: 'Moraceae',
    genus: 'Ficus',
    difficulty: 'medium',
  },
  {
    id: 'p4',
    slug: 'aloe-vera',
    name: 'صبر زرد (آلوئه‌ورا)',
    scientificName: 'Aloe vera',
    images: ['https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800'],
    description:
      'گیاهی دارویی و مقاوم که در نور مستقیم آفتاب بهترین رشد را دارد. برای فضاهای آفتاب‌گیر و کسانی که کمتر به آبیاری می‌رسند مناسب است.',
    care: {
      light: 'direct',
      water: 'low',
      temperatureRange: [13, 30],
      soil: 'خاک کاکتوسی',
      humidity: 'low',
      wateringFrequencyDays: 18,
    },
    toxicity: { isToxic: true, toxicTo: ['cat', 'dog'] },
    commonIssues: ['d3'],
    category: 'دارویی',
    family: 'Asphodelaceae',
    genus: 'Aloe',
    difficulty: 'easy',
  },
  {
    id: 'p5',
    slug: 'epipremnum-aureum',
    name: 'پوتوس (گندمی)',
    scientificName: 'Epipremnum aureum',
    images: ['https://images.unsplash.com/photo-1598880940639-84d0bb2f9b96?w=800'],
    description:
      'گیاهی آویز و رونده، بسیار مقاوم و سریع‌الرشد که در انواع شرایط نوری زنده می‌ماند. انتخاب کلاسیک برای دفتر کار و آشپزخانه.',
    care: {
      light: 'low',
      water: 'medium',
      temperatureRange: [16, 28],
      soil: 'خاک معمولی گلدانی',
      humidity: 'medium',
      wateringFrequencyDays: 7,
    },
    toxicity: { isToxic: true, toxicTo: ['cat', 'dog'] },
    commonIssues: ['d1'],
    category: 'آویز',
    family: 'Araceae',
    genus: 'Epipremnum',
    difficulty: 'easy',
  },
  {
    id: 'p6',
    slug: 'spathiphyllum',
    name: 'گل صدتومانی',
    scientificName: 'Spathiphyllum wallisii',
    images: ['https://images.unsplash.com/photo-1620127252536-03bcfe0aeda6?w=800'],
    description:
      'با گل‌های سفید ظریف، این گیاه هم زیبایی می‌آورد و هم به تصفیه هوای داخل خانه کمک می‌کند. به رطوبت نسبتاً بالا نیاز دارد.',
    care: {
      light: 'medium',
      water: 'high',
      temperatureRange: [18, 26],
      soil: 'خاک مرطوب و غنی از مواد آلی',
      humidity: 'high',
      wateringFrequencyDays: 5,
    },
    toxicity: { isToxic: true, toxicTo: ['cat', 'dog'] },
    commonIssues: ['d2', 'd4'],
    category: 'آپارتمانی',
    family: 'Araceae',
    genus: 'Spathiphyllum',
    difficulty: 'medium',
  },
]

export function findPlantBySlug(slug: string): Plant | undefined {
  return mockPlants.find(p => p.slug === slug)
}

export function searchPlants(
  query: string,
  category?: string,
  difficulty?: string,
  light?: string,
  family?: string,
  genus?: string,
): Plant[] {
  return mockPlants.filter((p) => {
    const matchQuery
      = !query
        || p.name.includes(query)
        || p.scientificName.toLowerCase().includes(query.toLowerCase())
    const matchCategory = !category || category === 'all' || p.category === category
    const matchDifficulty = !difficulty || difficulty === 'all' || p.difficulty === difficulty
    const matchLight = !light || light === 'all' || p.care.light === light
    const matchFamily = !family || family === 'all' || p.family === family
    const matchGenus = !genus || genus === 'all' || p.genus === genus
    return matchQuery && matchCategory && matchDifficulty && matchLight && matchFamily && matchGenus
  })
}

/** لیست یکتای خانواده‌های موجود در دیتابیس، برای پر کردن پنل فیلتر */
export function listFamilies(): string[] {
  return Array.from(new Set(mockPlants.map(p => p.family))).sort()
}

/** لیست یکتای جنس‌های موجود، اختیاری فیلترشده بر اساس خانواده‌ی انتخاب‌شده */
export function listGenera(family?: string): string[] {
  const source = !family || family === 'all' ? mockPlants : mockPlants.filter(p => p.family === family)
  return Array.from(new Set(source.map(p => p.genus))).sort()
}

export function suggestPlants(query: string, limit = 5): Plant[] {
  if (!query.trim()) return []
  const q = query.trim()
  return mockPlants
    .filter(p => p.name.includes(q) || p.scientificName.toLowerCase().includes(q.toLowerCase()))
    .slice(0, limit)
}
