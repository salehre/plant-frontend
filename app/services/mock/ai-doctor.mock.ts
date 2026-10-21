import type { MockLocale } from './mock-locale'

interface Topic {
  /** روی متن نرمال‌شده‌ی کاربر تست می‌شه؛ ترتیب آرایه = اولویت */
  test: RegExp
  fa: string
  en: string
}

const topics: Topic[] = [
  {
    test: /پوسید|ریشه|بوی بد|بو می|root|rot|smell/,
    fa: `پوسیدگی ریشه معمولاً نتیجه‌ی آبیاری زیاد یا زهکشی بده:
- **علائم**: زرد و افتاده شدن برگ‌ها، بوی بد خاک، ریشه‌های نرم و سیاه.
- **اول از همه** آبیاری رو متوقف کن و گیاه رو از گلدان دربیار.
- ریشه‌های سیاه و نرم رو با قیچی تمیز ببر و فقط ریشه‌های سفید و سفت رو نگه دار.
- گیاه رو توی خاک تازه و گلدانی که سوراخ زهکشی داره بکار.

ریشه‌هاش رو دیدی؟ چه رنگی و چه حالتی دارن؟`,
    en: `Root rot is usually caused by overwatering or poor drainage:
- **Signs**: yellowing and drooping leaves, a bad smell from the soil, soft black roots.
- **First**, stop watering and take the plant out of its pot.
- Trim the soft, black roots with clean scissors and keep only the firm white ones.
- Repot into fresh soil in a pot with drainage holes.

Have you looked at the roots? What colour and texture are they?`,
  },
  {
    test: /تار|کنه|آفت|حشره|شته|سفید ?بال|mite|pest|bug|web|aphid|gnat/,
    fa: `تار ریز زیر برگ‌ها معمولاً نشونه‌ی **کنه تارتن** هست، به‌خصوص توی هوای خشک و گرم:
- گیاه رو از بقیه جدا کن تا آفت پخش نشه.
- برگ‌ها (مخصوصاً زیرشون) رو با آب ولرم بشور.
- رطوبت اطراف گیاه رو بالا ببر.
- هر ۵ تا ۷ روز یک‌بار روغن نیم یا صابون حشره‌کش اسپری کن، تا حدود سه هفته.

لکه‌های زرد کمرنگ هم روی برگ‌ها می‌بینی؟`,
    en: `Fine webbing under the leaves usually points to **spider mites**, especially in hot, dry air:
- Move the plant away from others so the pests don't spread.
- Rinse the leaves (especially the undersides) with lukewarm water.
- Raise the humidity around the plant.
- Spray neem oil or insecticidal soap every 5 to 7 days for about three weeks.

Do you also see pale yellow dots on the leaves?`,
  },
  {
    test: /لکه|spot|blotch/,
    fa: `لکه‌های قهوه‌ای یا سیاه روی برگ معمولاً **لکه برگی قارچی** هستن:
- برگ‌های آلوده رو حذف کن و دور بنداز (نه توی کمپوست).
- آبیاری رو از پای گیاه انجام بده و برگ‌ها رو خیس نکن.
- تهویه‌ی محیط رو بهتر کن و گیاه‌ها رو خیلی چسبیده به هم نذار.
- اگه لکه‌ها گسترش پیدا کرد، از قارچ‌کش مناسب استفاده کن.

لکه‌ها حاشیه‌ی زرد دارن یا فقط قهوه‌ای‌ان؟`,
    en: `Brown or black spots on leaves are often **fungal leaf spot**:
- Remove the infected leaves and bin them (not in the compost).
- Water at the base and keep the foliage dry.
- Improve air circulation and don't crowd your plants.
- If the spots keep spreading, use a suitable fungicide.

Do the spots have a yellow halo, or are they just brown?`,
  },
  {
    test: /زرد|yellow/,
    fa: `زرد شدن برگ‌ها معمولاً یکی از این دلیل‌هاست:
- **آبیاری زیاد**: اگه خاک همیشه خیسه، ریشه خفه می‌شه و برگ‌های پایینی اول زرد می‌شن.
- **کمبود نور یا کود**: اگه برگ‌های قدیمی یکدست زرد می‌شن و رشد کنده، احتمالاً کود می‌خواد.
- **تغییر محیط**: جابه‌جایی گیاه می‌تونه چند تا برگ رو زرد کنه.

انگشتت رو ۳ سانت توی خاک فرو کن؛ اگه هنوز خیسه آبیاری رو عقب بنداز. گیاه از چه موقع این‌طوری شده و خاکش الان چه حالی داره؟`,
    en: `Yellowing leaves usually come down to one of these:
- **Overwatering**: if the soil stays soggy, the roots suffocate and the lower leaves yellow first.
- **Too little light or fertiliser**: if older leaves yellow evenly and growth is slow, it probably needs feeding.
- **A change of scene**: moving a plant can make a few leaves yellow.

Push a finger about 3 cm into the soil; if it's still wet, hold off watering. How long has it looked like this, and how does the soil feel right now?`,
  },
  {
    test: /نوک|قهوه|خشک|سوخت|brown|crisp|dry tip/,
    fa: `خشک و قهوه‌ای شدن نوک برگ‌ها معمولاً این دلیل‌ها رو داره:
- **هوای خشک** یا نزدیک بودن به بخاری و کولر.
- **آبیاری نامنظم** یا آب خیلی سخت (پر از املاح).
- **آفتاب مستقیم و شدید** که برگ رو می‌سوزونه.

نوک‌های خشک شده رو می‌تونی با قیچی تمیز و به‌صورت دنباله‌دار ببری. گیاه کنار کدوم پنجره یا وسیله‌ی گرمایشیه؟`,
    en: `Dry, brown leaf tips usually come from:
- **Dry air**, or sitting near a heater or AC.
- **Irregular watering**, or very hard water (high in minerals).
- **Strong direct sun** scorching the leaves.

You can trim the dried tips with clean scissors, following the leaf's natural shape. Which window or appliance is the plant near?`,
  },
  {
    test: /افتاده|پژمرد|آویزان|خمیده|droop|wilt|limp/,
    fa: `افتادگی گیاه دو علت کاملاً متضاد می‌تونه داشته باشه:
- **تشنگی**: خاک خشکه، گلدان سبکه و برگ‌ها نرم و بی‌حال‌ان؛ بعد از آبیاری معمولاً توی چند ساعت جون می‌گیره.
- **آبیاری زیاد**: خاک خیسه ولی گیاه همچنان افتاده؛ اینجا خطر پوسیدگی ریشه هست.

اول خاک رو چک کن. الان خشکه یا خیس؟`,
    en: `A drooping plant can have two opposite causes:
- **Thirst**: dry soil, a light pot and soft limp leaves; it usually perks up within hours of watering.
- **Overwatering**: wet soil but the plant still droops, which risks root rot.

Check the soil first. Is it dry or wet right now?`,
  },
  {
    test: /کود|fertiliz|feed/,
    fa: `برای کوددهی:
- توی فصل رشد (بهار و تابستون) هر ۲ تا ۴ هفته یک‌بار کود مایع متعادل بده.
- توی پاییز و زمستان کوددهی رو خیلی کم یا متوقف کن.
- کود رو همیشه رقیق‌تر از مقدار پشت بسته بزن و روی خاک خشک نریز.

کدوم گیاه رو می‌خوای کود بدی؟`,
    en: `For fertilising:
- In the growing season (spring and summer), feed a balanced liquid fertiliser every 2 to 4 weeks.
- Cut back or stop in autumn and winter.
- Always dilute it more than the label says, and never pour it onto bone-dry soil.

Which plant are you planning to feed?`,
  },
  {
    test: /نور|آفتاب|light|sun/,
    fa: `نیاز نوری گیاه‌ها فرق می‌کنه، ولی یه قاعده‌ی کلی:
- بیشتر گیاه‌های آپارتمانی **نور زیاد ولی غیرمستقیم** دوست دارن، مثلاً کنار پنجره‌ی رو به شرق.
- برگ‌های رنگ‌پریده و ساقه‌های دراز یعنی نور کمه.
- لکه‌های سوخته و خشک یعنی آفتاب مستقیم زیاد بوده.

گیاهت الان کجا قرار داره و اسمش چیه؟`,
    en: `Light needs vary by species, but as a rule of thumb:
- Most houseplants like **bright but indirect light**, for example near an east-facing window.
- Pale leaves and leggy stems mean too little light.
- Dry, scorched patches mean too much direct sun.

Where is your plant right now, and what is it?`,
  },
  {
    test: /آب|آبیاری|water/,
    fa: `برنامه‌ی ثابت برای آبیاری وجود نداره؛ بهتر از روی خاک تصمیم بگیری:
- انگشتت رو ۳ تا ۵ سانت توی خاک فرو کن؛ اگه خشک بود آب بده.
- گیاه‌های گوشتی و کاکتوس‌ها وقتی خاک کامل خشک شد، بقیه وقتی لایه‌ی بالایی خشک شد.
- موقع آبیاری اون‌قدر آب بده که از سوراخ ته گلدان بیرون بیاد، و آب جمع‌شده توی زیرگلدونی رو خالی کن.
- توی زمستان آبیاری رو کم کن.

چه گیاهی داری؟ بر اساس اون دقیق‌تر بهت می‌گم.`,
    en: `There's no fixed schedule; it's better to let the soil decide:
- Push a finger 3 to 5 cm into the soil and water if it's dry.
- Succulents and cacti want the soil completely dry; most others want the top layer dry.
- Water until it drains out of the bottom, then empty the saucer.
- Water less in winter.

What plant do you have? I can be more specific once I know.`,
  },
]

const greeting = {
  test: /^(سلام|درود|hi|hello|hey)/,
  fa: 'سلام! من دکتر گیاه‌ام 🌿 بگو گیاهت چه مشکلی داره؟ مثلاً برگ‌ها زرد شدن، لکه افتاده یا آفت دیدی؟ اگه عکسش رو داری هم می‌تونی بفرستی.',
  en: 'Hi! I\'m the Plant Doctor 🌿 Tell me what\'s wrong with your plant. Yellow leaves, spots, pests? You can send a photo too if you have one.',
}

const imageOnly = {
  fa: `عکست رسید 🌿 برای اینکه دقیق‌تر کمکت کنم چند چیز بگو:
- اسم گیاه چیه؟
- چه علامتی می‌بینی (زرد شدن، لکه، افتادگی، آفت)؟
- از چه موقع شروع شده؟`,
  en: `Got your photo 🌿 To help more accurately, tell me:
- What's the plant called?
- What symptoms do you see (yellowing, spots, drooping, pests)?
- When did it start?`,
}

const fallback = {
  fa: `برای اینکه درست راهنمایی‌ت کنم، یه کم بیشتر توضیح بده:
- اسم گیاه چیه و کجا نگهداری می‌شه؟
- دقیقاً چه علامتی می‌بینی؟
- هر چند وقت آبیاریش می‌کنی؟`,
  en: `To guide you properly, tell me a bit more:
- What's the plant and where do you keep it?
- Exactly what symptoms do you see?
- How often do you water it?`,
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, ' ')
    .trim()
}

/**
 * جواب شبیه‌سازی‌شده‌ی دکتر گیاه بر اساس کلمه‌های کلیدی پیام آخر کاربر.
 * وقتی AI واقعی وصل شد این فایل دیگه استفاده نمی‌شه (نگاه کن به services/ai-doctor.service.ts).
 */
export function aiDoctorReplyMock(text: string, hasImage: boolean, locale: MockLocale = 'fa'): string {
  const normalized = normalize(text)
  if (!normalized) return hasImage ? imageOnly[locale] : fallback[locale]
  if (greeting.test.test(normalized) && normalized.length < 25) return greeting[locale]
  const topic = topics.find(t => t.test.test(normalized))
  return topic ? topic[locale] : fallback[locale]
}
