import type { Plant } from '~/types/plant.types'

export const mockPlants: Plant[] = [
  {
    id: 'p1',
    slug: 'monstera-deliciosa',
    name: 'مونستِرا',
    scientificName: 'Monstera deliciosa',
    images: [
      '/images/plants/botanical-1.webp',
      '/images/plants/botanical-2.webp',
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
    images: ['/images/plants/botanical-3.webp'],
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
    images: ['/images/plants/botanical-4.webp'],
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
    images: ['/images/plants/botanical-5.webp'],
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
    images: ['/images/plants/botanical-1.webp'],
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
    images: ['/images/plants/botanical-2.webp'],
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
  {
    id: 'p7',
    slug: 'zamioculcas-zamiifolia',
    name: 'زامیفولیا',
    scientificName: 'Zamioculcas zamiifolia',
    images: ['/images/plants/botanical-3.webp'],
    description:
        'گیاهی تقریباً نابودنشدنی با برگ‌های براق و ضخیم که هفته‌ها بدون آبیاری هم دوام می‌آورد. انتخابی عالی برای فضاهای کم‌نور اداری و خانگی.',
    care: {
      light: 'low',
      water: 'low',
      temperatureRange: [18, 26],
      soil: 'خاک سبک و زهکش‌دار',
      humidity: 'low',
      wateringFrequencyDays: 16,
    },
    toxicity: { isToxic: true, toxicTo: ['cat', 'dog'] },
    commonIssues: ['d3'],
    category: 'آپارتمانی',
    family: 'Araceae',
    genus: 'Zamioculcas',
    difficulty: 'easy',
  },
  {
    id: 'p8',
    slug: 'chlorophytum-comosum',
    name: 'گیاه عنکبوتی',
    scientificName: 'Chlorophytum comosum',
    images: ['/images/plants/botanical-4.webp'],
    description:
        'با برگ‌های نواری راه‌راه و ساقه‌های آویزی که جوانه‌های کوچک تولید می‌کنند. رشدش سریع است و برای پرورش در آب هم مناسب است.',
    care: {
      light: 'medium',
      water: 'medium',
      temperatureRange: [15, 25],
      soil: 'خاک معمولی گلدانی با زهکش خوب',
      humidity: 'medium',
      wateringFrequencyDays: 7,
    },
    toxicity: { isToxic: false, toxicTo: [] },
    commonIssues: ['d1'],
    category: 'آویز',
    family: 'Asparagaceae',
    genus: 'Chlorophytum',
    difficulty: 'easy',
  },
  {
    id: 'p9',
    slug: 'dracaena-marginata',
    name: 'دراسینا مارجیناتا',
    scientificName: 'Dracaena marginata',
    images: ['/images/plants/botanical-5.webp'],
    description:
        'با ساقه‌های نازک و باریک و برگ‌های سرخ‌حاشیه، ظاهری شبیه درخت مینیاتوری دارد. نسبت به کم‌آبی مقاوم است ولی از آب سنگین (فلوراید) آسیب می‌بیند.',
    care: {
      light: 'medium',
      water: 'low',
      temperatureRange: [18, 27],
      soil: 'خاک سبک و زهکش‌دار',
      humidity: 'medium',
      wateringFrequencyDays: 10,
    },
    toxicity: { isToxic: true, toxicTo: ['cat', 'dog'] },
    commonIssues: ['d3', 'd1'],
    category: 'آپارتمانی',
    family: 'Asparagaceae',
    genus: 'Dracaena',
    difficulty: 'medium',
  },
  {
    id: 'p10',
    slug: 'philodendron-hederaceum',
    name: 'فیلودندرون برگ قلبی',
    scientificName: 'Philodendron hederaceum',
    images: ['/images/plants/botanical-1.webp'],
    description:
        'گیاهی آویز با برگ‌های قلبی‌شکل که به‌سرعت رشد می‌کند و در نور کم هم شاداب می‌ماند. یکی از راحت‌ترین گیاهان برای نگهداری مبتدیان.',
    care: {
      light: 'low',
      water: 'medium',
      temperatureRange: [18, 27],
      soil: 'خاک سبک با کمپوست برگ',
      humidity: 'medium',
      wateringFrequencyDays: 7,
    },
    toxicity: { isToxic: true, toxicTo: ['cat', 'dog'] },
    commonIssues: ['d1'],
    category: 'آویز',
    family: 'Araceae',
    genus: 'Philodendron',
    difficulty: 'easy',
  },
  {
    id: 'p11',
    slug: 'calathea-orbifolia',
    name: 'کالاتیا اوربیفولیا',
    scientificName: 'Calathea orbifolia',
    images: ['/images/plants/botanical-2.webp'],
    description:
        'با برگ‌های گرد و راه‌راه نقره‌ای، یکی از زیباترین ولی حساس‌ترین گیاهان آپارتمانی است. به رطوبت بالا و دوری از آفتاب مستقیم نیاز دارد.',
    care: {
      light: 'medium',
      water: 'high',
      temperatureRange: [18, 24],
      soil: 'خاک مرطوب و غنی از مواد آلی',
      humidity: 'high',
      wateringFrequencyDays: 5,
    },
    toxicity: { isToxic: false, toxicTo: [] },
    commonIssues: ['d2', 'd4'],
    category: 'آپارتمانی',
    family: 'Marantaceae',
    genus: 'Calathea',
    difficulty: 'hard',
  },
  {
    id: 'p12',
    slug: 'peperomia-obtusifolia',
    name: 'پپرومیا',
    scientificName: 'Peperomia obtusifolia',
    images: ['/images/plants/botanical-3.webp'],
    description:
        'گیاهی کوچک و فشرده با برگ‌های ضخیم و گوشتی که مثل ساکولنت‌ها آب ذخیره می‌کند. برای میز کار و فضاهای کوچک بسیار مناسب است.',
    care: {
      light: 'medium',
      water: 'low',
      temperatureRange: [18, 26],
      soil: 'خاک سبک و زهکش‌دار',
      humidity: 'medium',
      wateringFrequencyDays: 10,
    },
    toxicity: { isToxic: false, toxicTo: [] },
    commonIssues: ['d3'],
    category: 'آپارتمانی',
    family: 'Piperaceae',
    genus: 'Peperomia',
    difficulty: 'easy',
  },
  {
    id: 'p13',
    slug: 'crassula-ovata',
    name: 'درخت یادبود (جید)',
    scientificName: 'Crassula ovata',
    images: ['/images/plants/botanical-4.webp'],
    description:
        'ساکولنتی با برگ‌های گرد و ضخیم که به‌مرور شکل درخت کوچک پیدا می‌کند. نیاز آبی بسیار کمی دارد و در نور مستقیم بهترین رشد را نشان می‌دهد.',
    care: {
      light: 'direct',
      water: 'low',
      temperatureRange: [15, 27],
      soil: 'خاک کاکتوسی با زهکش بالا',
      humidity: 'low',
      wateringFrequencyDays: 16,
    },
    toxicity: { isToxic: true, toxicTo: ['cat', 'dog'] },
    commonIssues: ['d3'],
    category: 'کاکتوس و ساکولنت',
    family: 'Crassulaceae',
    genus: 'Crassula',
    difficulty: 'easy',
  },
  {
    id: 'p14',
    slug: 'echeveria-elegans',
    name: 'اچوریا',
    scientificName: 'Echeveria elegans',
    images: ['/images/plants/botanical-5.webp'],
    description:
        'ساکولنتی با شکل گلی و برگ‌های آبی‌رنگ که روی هم ردیف شده‌اند. برای گلدان‌های کوچک و پنجره‌های آفتاب‌گیر بسیار محبوب است.',
    care: {
      light: 'direct',
      water: 'low',
      temperatureRange: [13, 26],
      soil: 'خاک کاکتوسی',
      humidity: 'low',
      wateringFrequencyDays: 14,
    },
    toxicity: { isToxic: false, toxicTo: [] },
    commonIssues: ['d3'],
    category: 'کاکتوس و ساکولنت',
    family: 'Crassulaceae',
    genus: 'Echeveria',
    difficulty: 'easy',
  },
  {
    id: 'p15',
    slug: 'rosa-chinensis',
    name: 'رز مینیاتوری',
    scientificName: 'Rosa chinensis',
    images: ['/images/plants/botanical-1.webp'],
    description:
        'گونه‌ای فشرده از رز که برای کشت گلدانی و بالکن مناسب است. برای گلدهی مداوم به نور مستقیم زیاد و هرس منظم نیاز دارد.',
    care: {
      light: 'direct',
      water: 'medium',
      temperatureRange: [15, 28],
      soil: 'خاک غنی از کمپوست با زهکش خوب',
      humidity: 'medium',
      wateringFrequencyDays: 4,
    },
    toxicity: { isToxic: false, toxicTo: [] },
    commonIssues: ['d2', 'd4'],
    category: 'گلدار',
    family: 'Rosaceae',
    genus: 'Rosa',
    difficulty: 'medium',
  },
  {
    id: 'p16',
    slug: 'lavandula-angustifolia',
    name: 'اسطوخودوس',
    scientificName: 'Lavandula angustifolia',
    images: ['/images/plants/botanical-2.webp'],
    description:
        'گیاهی معطر و دارویی با گل‌های بنفش که در آفتاب کامل و خاک خشک بهترین رشد را دارد. علاوه بر خواص آرام‌بخش، برای باغچه هم زینتی است.',
    care: {
      light: 'direct',
      water: 'low',
      temperatureRange: [15, 30],
      soil: 'خاک سبک، آهکی و زهکش‌دار',
      humidity: 'low',
      wateringFrequencyDays: 10,
    },
    toxicity: { isToxic: true, toxicTo: ['cat', 'dog'] },
    commonIssues: ['d3'],
    category: 'دارویی',
    family: 'Lamiaceae',
    genus: 'Lavandula',
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