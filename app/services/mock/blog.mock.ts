import type { BlogAuthor, BlogBlock, BlogCategory, BlogCategoryKey, BlogPost, BlogPostSummary } from '~/types/blog.types'
import type { MockLocale } from './mock-locale'

interface RawAuthor {
  id: string
  avatar: string
  text: Record<MockLocale, { name: string, role: string }>
}

interface RawPost {
  id: string
  slug: string
  category: BlogCategoryKey
  image: string
  authorId: string
  publishedAt: string
  readMinutes: number
  text: Record<MockLocale, { title: string, excerpt: string, tags: string[], content: BlogBlock[] }>
}

const categoryLabels: Record<BlogCategoryKey, Record<MockLocale, string>> = {
  watering: { fa: 'آبیاری', en: 'Watering' },
  light: { fa: 'نور', en: 'Light' },
  pests: { fa: 'بیماری و آفت', en: 'Pests & diseases' },
  soil: { fa: 'خاک و کود', en: 'Soil & fertilizer' },
  propagation: { fa: 'تکثیر', en: 'Propagation' },
  decor: { fa: 'چیدمان', en: 'Styling' },
}

const rawAuthors: RawAuthor[] = [
  {
    id: 'a1',
    avatar: '/images/plants/botanical-4.webp',
    text: {
      fa: { name: 'نیلوفر رستمی', role: 'کارشناس گیاهان آپارتمانی' },
      en: { name: 'Niloofar Rostami', role: 'Indoor plant specialist' },
    },
  },
  {
    id: 'a2',
    avatar: '/images/plants/botanical-5.webp',
    text: {
      fa: { name: 'رضا کریمی', role: 'باغبان و نویسنده' },
      en: { name: 'Reza Karimi', role: 'Gardener & writer' },
    },
  },
]

const rawPosts: RawPost[] = [
  {
    id: 'b1',
    slug: 'how-to-tell-when-your-plant-is-thirsty',
    category: 'watering',
    image: '/images/plants/botanical-1.webp',
    authorId: 'a1',
    publishedAt: '2026-09-28',
    readMinutes: 5,
    text: {
      fa: {
        title: 'چطور بفهمیم گیاه‌مان تشنه است؟',
        excerpt: 'نشانه‌های کم‌آبی و پرآبی را بشناس و برنامه‌ی آبیاری درست را پیدا کن.',
        tags: ['آبیاری', 'مبتدی', 'گیاهان آپارتمانی'],
        content: [
          { type: 'paragraph', text: 'بیشتر گیاهان آپارتمانی نه از تشنگی، بلکه از آبیاری زیاد از بین می‌روند. خبر خوب این است که گیاه‌ها خیلی خوب نشان می‌دهند چه چیزی لازم دارند؛ فقط باید زبانشان را بلد باشیم.' },
          { type: 'heading', text: 'تست انگشت؛ ساده‌ترین روش' },
          { type: 'paragraph', text: 'انگشتت را تا دومین بند داخل خاک فرو کن. اگر خاک خشک بود و به انگشتت نچسبید، وقت آبیاری است. اگر هنوز نم داشت، یکی دو روز صبر کن.' },
          { type: 'heading', text: 'نشانه‌های کم‌آبی' },
          { type: 'list', items: ['برگ‌ها پژمرده و آویزان می‌شوند', 'لبه‌ی برگ‌ها قهوه‌ای و خشک می‌شود', 'خاک از لبه‌ی گلدان جدا شده است', 'گلدان به‌طرز عجیبی سبک است'] },
          { type: 'heading', text: 'نشانه‌های پرآبی' },
          { type: 'list', items: ['برگ‌های پایینی زرد می‌شوند', 'خاک همیشه خیس است و بوی بد می‌دهد', 'ساقه‌ی نزدیک خاک نرم و تیره است', 'پشه‌های ریز دور گلدان پرواز می‌کنند'] },
          { type: 'tip', text: 'آب را آرام و تا زمانی که از سوراخ ته گلدان خارج شود بریز، بعد آب جمع‌شده زیر گلدان را خالی کن. کم‌وبیش‌کردن مداوم آب بهتر از آبیاری زیاد و ناگهانی است.' },
        ],
      },
      en: {
        title: 'How to tell when your plant is thirsty',
        excerpt: 'Learn the signs of under- and overwatering and find the right schedule.',
        tags: ['Watering', 'Beginner', 'Houseplants'],
        content: [
          { type: 'paragraph', text: 'Most houseplants don’t die from thirst; they die from too much water. The good news is that plants show quite clearly what they need, as long as you know how to read the signs.' },
          { type: 'heading', text: 'The finger test: the simplest method' },
          { type: 'paragraph', text: 'Push your finger into the soil up to the second knuckle. If the soil is dry and doesn’t stick to your finger, it’s time to water. If it still feels damp, wait another day or two.' },
          { type: 'heading', text: 'Signs of underwatering' },
          { type: 'list', items: ['Leaves wilt and droop', 'Leaf edges turn brown and crispy', 'Soil pulls away from the edge of the pot', 'The pot feels surprisingly light'] },
          { type: 'heading', text: 'Signs of overwatering' },
          { type: 'list', items: ['Lower leaves turn yellow', 'Soil stays wet and smells bad', 'The stem near the soil is soft and dark', 'Tiny gnats hover around the pot'] },
          { type: 'tip', text: 'Water slowly until it drains from the bottom hole, then empty the saucer. Steady, moderate watering beats occasional heavy soaking.' },
        ],
      },
    },
  },
  {
    id: 'b2',
    slug: 'best-light-spot-for-indoor-plants',
    category: 'light',
    image: '/images/plants/botanical-2.webp',
    authorId: 'a2',
    publishedAt: '2026-09-20',
    readMinutes: 4,
    text: {
      fa: {
        title: 'راهنمای انتخاب بهترین جای نور برای گیاهان آپارتمانی',
        excerpt: 'هر گیاه نور مخصوص خودش را می‌خواهد؛ جای مناسب را در خانه پیدا کن.',
        tags: ['نور', 'چیدمان', 'گیاهان آپارتمانی'],
        content: [
          { type: 'paragraph', text: 'نور مهم‌ترین «غذای» گیاه است. اگر گیاهی کشیده و رنگ‌پریده شده یا برگ‌هایش سوخته، احتمالاً جایش مناسب نیست.' },
          { type: 'heading', text: 'پنجره‌های جنوبی' },
          { type: 'paragraph', text: 'بیشترین نور را می‌گیرند و برای کاکتوس، ساکولنت و گیاهان آفتاب‌دوست عالی‌اند. برای بقیه، کمی عقب‌تر از پنجره یا پشت پرده‌ی نازک مناسب‌تر است.' },
          { type: 'heading', text: 'پنجره‌های شمالی' },
          { type: 'paragraph', text: 'نور ملایم و ثابتی دارند. پوتوس، سانسوریا و زاموکولکاس این‌جا خوشحال می‌مانند.' },
          { type: 'heading', text: 'پنجره‌های شرقی و غربی' },
          { type: 'list', items: ['شرقی: آفتاب ملایم صبحگاهی، مناسب بیشتر گیاهان', 'غربی: آفتاب قوی بعدازظهر، برای گیاهان مقاوم‌تر'] },
          { type: 'tip', text: 'هر چند هفته گلدان را یک‌چهارم بچرخان تا همه‌ی طرف‌های گیاه نور بگیرد و یک‌وری رشد نکند.' },
        ],
      },
      en: {
        title: 'Choosing the best light spot for indoor plants',
        excerpt: 'Every plant has its own light needs; find the right place in your home.',
        tags: ['Light', 'Styling', 'Houseplants'],
        content: [
          { type: 'paragraph', text: 'Light is a plant’s most important food. If a plant is leggy and pale, or its leaves look scorched, its spot probably isn’t right.' },
          { type: 'heading', text: 'South-facing windows' },
          { type: 'paragraph', text: 'They get the most light and suit cacti, succulents and other sun lovers. For most other plants, a little distance from the glass or a sheer curtain works better.' },
          { type: 'heading', text: 'North-facing windows' },
          { type: 'paragraph', text: 'They offer gentle, steady light. Pothos, snake plants and ZZ plants stay happy here.' },
          { type: 'heading', text: 'East- and west-facing windows' },
          { type: 'list', items: ['East: soft morning sun, good for most plants', 'West: strong afternoon sun, better for tougher plants'] },
          { type: 'tip', text: 'Rotate the pot a quarter turn every few weeks so all sides get light and the plant doesn’t grow lopsided.' },
        ],
      },
    },
  },
  {
    id: 'b3',
    slug: 'common-houseplant-pests-and-how-to-deal-with-them',
    category: 'pests',
    image: '/images/plants/botanical-3.webp',
    authorId: 'a1',
    publishedAt: '2026-09-12',
    readMinutes: 6,
    text: {
      fa: {
        title: 'شایع‌ترین آفت‌های گیاهان خانگی و روش‌های مقابله',
        excerpt: 'از شته تا کنه‌ی تارتن؛ علائم اولیه و راه‌های ساده‌ی درمان.',
        tags: ['آفت', 'درمان', 'پیشگیری'],
        content: [
          { type: 'paragraph', text: 'حتی مراقب‌ترین باغبان‌ها هم گاهی با آفت روبه‌رو می‌شوند. مهم این است که زود متوجه شوی و سریع اقدام کنی.' },
          { type: 'heading', text: 'شته' },
          { type: 'paragraph', text: 'حشره‌های ریز سبز یا سیاه که روی جوانه‌ها و زیر برگ‌ها جمع می‌شوند و شیره‌ی گیاه را می‌مکند. با شستن گیاه با آب ولرم و صابون ملایم می‌توان جمعیتشان را کم کرد.' },
          { type: 'heading', text: 'کنه‌ی تارتن' },
          { type: 'paragraph', text: 'لکه‌های ریز زرد روی برگ و تارهای نازک سفید نشانه‌ی آن است. هوای خشک این آفت را تشویق می‌کند؛ مه‌پاشی و شستن برگ‌ها کمک می‌کند.' },
          { type: 'heading', text: 'سیکادای قارچی (پشه‌ی خاک)' },
          { type: 'paragraph', text: 'در خاک همیشه‌مرطوب زندگی می‌کنند. اجازه بده سطح خاک بین دو آبیاری خشک شود.' },
          { type: 'list', items: ['گیاه تازه‌خریداری‌شده را دو هفته جدا نگه دار', 'برگ‌ها را گاهی از هر دو طرف بررسی کن', 'گیاه آلوده را از بقیه دور کن', 'برگ‌های شدیداً آلوده را هرس کن'] },
          { type: 'tip', text: 'اگر نمی‌دانی مشکل گیاهت چیست، از بخش شناسایی اپ عکسی بگیر و علائم را با بیماری‌های رایج مقایسه کن.' },
        ],
      },
      en: {
        title: 'Common houseplant pests and how to deal with them',
        excerpt: 'From aphids to spider mites: early signs and simple treatments.',
        tags: ['Pests', 'Treatment', 'Prevention'],
        content: [
          { type: 'paragraph', text: 'Even the most careful gardeners meet pests sometimes. What matters is spotting them early and acting fast.' },
          { type: 'heading', text: 'Aphids' },
          { type: 'paragraph', text: 'Tiny green or black insects that cluster on new growth and under leaves, sucking sap. Rinsing the plant with lukewarm water and mild soap keeps their numbers down.' },
          { type: 'heading', text: 'Spider mites' },
          { type: 'paragraph', text: 'Look for tiny yellow speckles on leaves and fine white webbing. Dry air encourages them; misting and wiping the leaves helps.' },
          { type: 'heading', text: 'Fungus gnats' },
          { type: 'paragraph', text: 'They breed in constantly damp soil. Let the top of the soil dry out between waterings.' },
          { type: 'list', items: ['Quarantine new plants for two weeks', 'Check both sides of the leaves regularly', 'Move infested plants away from the others', 'Prune heavily damaged leaves'] },
          { type: 'tip', text: 'Not sure what’s wrong? Take a photo in the app’s identify section and compare the symptoms with common diseases.' },
        ],
      },
    },
  },
  {
    id: 'b4',
    slug: 'choosing-the-right-potting-mix',
    category: 'soil',
    image: '/images/plants/botanical-4.webp',
    authorId: 'a2',
    publishedAt: '2026-09-03',
    readMinutes: 5,
    text: {
      fa: {
        title: 'خاک مناسب برای هر گیاه؛ چطور انتخاب کنیم؟',
        excerpt: 'خاک فقط جای ایستادن گیاه نیست؛ زهکشی و تغذیه‌ی آن سلامت ریشه را تعیین می‌کند.',
        tags: ['خاک', 'کود', 'گلدان'],
        content: [
          { type: 'paragraph', text: 'خاک باغچه‌ای معمولاً برای گلدان سنگین است و آب را زیادی نگه می‌دارد. خاک گلدانی خوب باید همزمان آب را نگه دارد و هوا به ریشه برساند.' },
          { type: 'heading', text: 'اجزای اصلی' },
          { type: 'list', items: ['کوکوپیت یا پیت‌ماس: نگه‌داری رطوبت', 'پرلیت: سبک‌کردن خاک و بهبود زهکشی', 'کمپوست یا ورمی‌کمپوست: مواد مغذی', 'ماسه‌ی درشت: مخصوص کاکتوس و ساکولنت'] },
          { type: 'heading', text: 'ترکیب پیشنهادی' },
          { type: 'paragraph', text: 'برای بیشتر گیاهان برگ‌دار، دو قسمت خاک گلدانی، یک قسمت پرلیت و یک قسمت کمپوست ترکیب خوبی است. برای کاکتوس‌ها نسبت پرلیت و ماسه را بیشتر کن.' },
          { type: 'heading', text: 'کوددهی' },
          { type: 'paragraph', text: 'در فصل رشد (بهار و تابستان) هر دو تا چهار هفته یک بار کود مایع رقیق‌شده بده و در زمستان تقریباً قطعش کن.' },
          { type: 'tip', text: 'کود بیشتر یعنی رشد بیشتر نیست. زیاده‌روی در کود باعث سوختن ریشه و رسوب نمک در خاک می‌شود.' },
        ],
      },
      en: {
        title: 'Choosing the right potting mix for each plant',
        excerpt: 'Soil isn’t just something for a plant to stand in; drainage and nutrition decide root health.',
        tags: ['Soil', 'Fertilizer', 'Pots'],
        content: [
          { type: 'paragraph', text: 'Garden soil is usually too heavy for pots and holds too much water. A good potting mix should hold moisture while still letting air reach the roots.' },
          { type: 'heading', text: 'Key ingredients' },
          { type: 'list', items: ['Coco coir or peat moss: holds moisture', 'Perlite: lightens the mix and improves drainage', 'Compost or worm castings: nutrients', 'Coarse sand: for cacti and succulents'] },
          { type: 'heading', text: 'A reliable recipe' },
          { type: 'paragraph', text: 'For most leafy plants, two parts potting soil, one part perlite and one part compost works well. For cacti, increase the perlite and sand.' },
          { type: 'heading', text: 'Fertilizing' },
          { type: 'paragraph', text: 'During the growing season (spring and summer), feed with diluted liquid fertilizer every two to four weeks, and nearly stop in winter.' },
          { type: 'tip', text: 'More fertilizer doesn’t mean more growth. Overfeeding burns roots and leaves salt deposits in the soil.' },
        ],
      },
    },
  },
  {
    id: 'b5',
    slug: 'propagate-pothos-in-water',
    category: 'propagation',
    image: '/images/plants/botanical-5.webp',
    authorId: 'a1',
    publishedAt: '2026-08-25',
    readMinutes: 4,
    text: {
      fa: {
        title: 'تکثیر پوتوس در آب، قدم‌به‌قدم',
        excerpt: 'با یک قلمه و یک لیوان آب، گیاه جدیدی بساز؛ بدون هزینه و بدون دردسر.',
        tags: ['تکثیر', 'پوتوس', 'قلمه'],
        content: [
          { type: 'paragraph', text: 'پوتوس یکی از آسان‌ترین گیاهان برای تکثیر است و برای اولین تجربه‌ی تکثیر گزینه‌ی عالی‌ای است.' },
          { type: 'heading', text: 'مراحل کار' },
          { type: 'list', items: ['ساقه‌ی سالمی با حداقل دو گره انتخاب کن', 'درست زیر یک گره را با قیچی تمیز ببر', 'برگ‌های پایینی را بچین تا داخل آب نماند', 'قلمه را در لیوان آب ولرم بگذار', 'لیوان را کنار نور غیرمستقیم قرار بده'] },
          { type: 'heading', text: 'مراقبت در حین ریشه‌زایی' },
          { type: 'paragraph', text: 'آب را هر یک تا دو هفته عوض کن. معمولاً بعد از دو تا چهار هفته ریشه‌های سفید ظاهر می‌شوند.' },
          { type: 'heading', text: 'انتقال به خاک' },
          { type: 'paragraph', text: 'وقتی ریشه‌ها به طول پنج تا هفت سانتی‌متر رسیدند، قلمه را در خاک سبک بکار و در هفته‌های اول خاک را کمی مرطوب نگه دار.' },
          { type: 'tip', text: 'چند قلمه را داخل یک لیوان بگذار؛ گیاه نهایی پرپشت‌تر و زیباتر می‌شود.' },
        ],
      },
      en: {
        title: 'Propagating pothos in water, step by step',
        excerpt: 'Make a brand-new plant from one cutting and a glass of water, no cost and no fuss.',
        tags: ['Propagation', 'Pothos', 'Cuttings'],
        content: [
          { type: 'paragraph', text: 'Pothos is one of the easiest plants to propagate, which makes it a perfect first attempt.' },
          { type: 'heading', text: 'Steps' },
          { type: 'list', items: ['Pick a healthy stem with at least two nodes', 'Cut just below a node with clean scissors', 'Remove the lower leaves so none sit in the water', 'Place the cutting in a glass of lukewarm water', 'Keep it in bright, indirect light'] },
          { type: 'heading', text: 'Care while it roots' },
          { type: 'paragraph', text: 'Change the water every week or two. White roots usually appear within two to four weeks.' },
          { type: 'heading', text: 'Moving to soil' },
          { type: 'paragraph', text: 'When the roots reach five to seven centimeters, plant the cutting in light soil and keep it slightly moist for the first few weeks.' },
          { type: 'tip', text: 'Put several cuttings in the same glass; the finished plant will be fuller and more attractive.' },
        ],
      },
    },
  },
  {
    id: 'b6',
    slug: 'best-plants-for-small-apartments',
    category: 'decor',
    image: '/images/plants/botanical-2.webp',
    authorId: 'a2',
    publishedAt: '2026-08-14',
    readMinutes: 5,
    text: {
      fa: {
        title: 'بهترین گیاهان برای آپارتمان‌های کوچک',
        excerpt: 'فضای کم دلیل نمی‌شود خانه‌ات سبز نباشد؛ با این گیاه‌ها و چیدمان‌ها شروع کن.',
        tags: ['چیدمان', 'آپارتمان', 'فضای کم'],
        content: [
          { type: 'paragraph', text: 'در خانه‌ی کوچک باید هوشمندانه‌تر گیاه انتخاب و جایگذاری کرد. خوشبختانه گزینه‌های زیادی هست که کم‌جا و کم‌توقع‌اند.' },
          { type: 'heading', text: 'گیاه‌های پیشنهادی' },
          { type: 'list', items: ['پوتوس: آویزان، مقاوم و مناسب قفسه', 'سانسوریا: عمودی و بسیار کم‌توقع', 'زاموکولکاس: تحمل نور کم و آبیاری کم', 'ساکولنت‌های کوچک: مناسب لبه‌ی پنجره'] },
          { type: 'heading', text: 'از ارتفاع استفاده کن' },
          { type: 'paragraph', text: 'قفسه‌ی دیواری، گلدان آویز و پایه‌های بلند جا را روی زمین باز می‌کنند و گیاه‌ها را به نور نزدیک‌تر می‌کنند.' },
          { type: 'heading', text: 'گروه‌بندی کن' },
          { type: 'paragraph', text: 'چند گلدان کوچک کنار هم هم زیباتر دیده می‌شوند و هم رطوبت اطراف گیاهان را کمی بالا می‌برند.' },
          { type: 'tip', text: 'گیاه‌هایی با نیاز آبی و نوری مشابه را کنار هم بگذار تا مراقبت از آن‌ها ساده‌تر شود.' },
        ],
      },
      en: {
        title: 'The best plants for small apartments',
        excerpt: 'Limited space is no reason to skip the greenery; start with these plants and layouts.',
        tags: ['Styling', 'Apartment', 'Small spaces'],
        content: [
          { type: 'paragraph', text: 'In a small home, plants have to be chosen and placed more thoughtfully. Fortunately, there are plenty of compact, easygoing options.' },
          { type: 'heading', text: 'Recommended plants' },
          { type: 'list', items: ['Pothos: trailing, tough and perfect for shelves', 'Snake plant: upright and very low-maintenance', 'ZZ plant: tolerates low light and little water', 'Small succulents: great for window sills'] },
          { type: 'heading', text: 'Use vertical space' },
          { type: 'paragraph', text: 'Wall shelves, hanging pots and tall stands free up floor space and bring plants closer to the light.' },
          { type: 'heading', text: 'Group your pots' },
          { type: 'paragraph', text: 'Several small pots together look better and slightly raise the humidity around the plants.' },
          { type: 'tip', text: 'Group plants with similar light and water needs so caring for them stays simple.' },
        ],
      },
    },
  },
]

function localizeAuthor(raw: RawAuthor, locale: MockLocale): BlogAuthor {
  return { id: raw.id, avatar: raw.avatar, ...raw.text[locale] }
}

function localizePost(raw: RawPost, locale: MockLocale): BlogPost {
  const author = rawAuthors.find(a => a.id === raw.authorId) ?? rawAuthors[0]!
  const { title, excerpt, tags, content } = raw.text[locale]
  return {
    id: raw.id,
    slug: raw.slug,
    title,
    excerpt,
    category: raw.category,
    categoryLabel: categoryLabels[raw.category][locale],
    image: raw.image,
    author: localizeAuthor(author, locale),
    publishedAt: raw.publishedAt,
    readMinutes: raw.readMinutes,
    tags,
    content,
  }
}

function toSummary(post: BlogPost): BlogPostSummary {
  const { tags: _tags, content: _content, ...summary } = post
  return summary
}

/** جدیدترین مقاله اول */
function sortedRaw(): RawPost[] {
  return [...rawPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getMockBlogCategories(locale: MockLocale = 'fa'): BlogCategory[] {
  return (Object.keys(categoryLabels) as BlogCategoryKey[]).map(key => ({
    key,
    label: categoryLabels[key][locale],
  }))
}

export function getMockBlogPosts(locale: MockLocale = 'fa', category = ''): BlogPostSummary[] {
  return sortedRaw()
    .filter(p => !category || category === 'all' || p.category === category)
    .map(p => toSummary(localizePost(p, locale)))
}

export function findBlogPostBySlug(slug: string, locale: MockLocale = 'fa'): BlogPost | undefined {
  const raw = rawPosts.find(p => p.slug === slug)
  return raw ? localizePost(raw, locale) : undefined
}

/** مقاله‌های هم‌دسته اول، بعد بقیه؛ خود مقاله حذف می‌شه */
export function getMockRelatedBlogPosts(slug: string, locale: MockLocale = 'fa', limit = 3): BlogPostSummary[] {
  const current = rawPosts.find(p => p.slug === slug)
  return sortedRaw()
    .filter(p => p.slug !== slug)
    .sort((a, b) => Number(b.category === current?.category) - Number(a.category === current?.category))
    .slice(0, limit)
    .map(p => toSummary(localizePost(p, locale)))
}