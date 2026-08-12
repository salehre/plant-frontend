# برگ‌یار — پلتفرم هوش گیاهی (Frontend کامل: Phase 1 + 2 + رفع شکاف‌ها)

نسخه فارسی ترکیبی از PlantNet + RHS Grow + PlantIn + Planta + Plantix.
این ریپو فقط شامل **Frontend** است (طبق تصمیم پروژه: هر فاز کامل می‌شود قبل از رفتن به فاز بعد).

## Stack

Nuxt **4.5.1** · Vue 3 · TypeScript (Strict) · TailwindCSS 3 · Pinia · @nuxtjs/i18n 10 · VeeValidate + Zod · Vitest + @nuxt/test-utils · @nuxt/icon (Lucide, محلی)

## اجرای پروژه

```bash
npm install --legacy-peer-deps
npm run dev
```

سپس `http://localhost:3000` را باز کنید. برای امتحان کردن بخش‌های کاربری (Dashboard، My Plants، Care Calendar، Profile، Community) باید اول از `/auth/register` ثبت‌نام کنید — این صفحات با میدلور `auth` محافظت می‌شوند.

> **چرا `--legacy-peer-deps`؟**
> فعلاً یک باگ در Arborist خود npm (نه در پکیج‌های ما) با گراف وابستگی پیچیده‌ی Nuxt 4.5 برخورد می‌کند
> (`Cannot read properties of null (reading 'edgesOut')`). تا رفع رسمی npm، این فلگ لازم است.

## دستورات مفید

| دستور | کاربرد |
|---|---|
| `npm run dev` | سرور توسعه |
| `npm run build` | بیلد production |
| `npm run test` | اجرای ۲۱ تست واحد (Vitest) |
| `npm run test:watch` | تست در حالت watch |
| `npx eslint . --ext .vue,.ts` | بررسی سبک کد |
| `npx nuxi typecheck` | بررسی نوع TypeScript (نیازمند `vue-tsc`، نصب‌شده) |

## معماری (خلاصه)

- **`app/services/`** — مرز رسمی بین Mock Data و Laravel API واقعی. با فلگ `runtimeConfig.public.useMockApi` در `nuxt.config.ts` سوییچ می‌شود. در Phase 3 فقط این لایه تغییر می‌کند، نه کامپوننت‌ها.
- **`app/services/mock/`** — دیتای فیک (۶ گیاه، ۴ بیماری، ۶ شهر، ۳ کاربر/۴ پست انجمن) + شبیه‌سازی تأخیر واقعی AI.
- **`app/stores/`** — شش Pinia Store: `plant`, `userPlants`, `identify`, `ui`, `community`, `auth`.
- **`app/stores/auth.store.ts`** — لاگین/ثبت‌نام/خروج Mock با پایداری از طریق کوکی (`useCookie`)؛ در Phase 3 فقط به Laravel Sanctum وصل می‌شود.
- **`app/middleware/auth.ts`** — Guard واقعی؛ کاربر مهمان به `/auth/login?redirect=...` هدایت می‌شود.
- **`app/error.vue`** — صفحه سفارشی ۴۰۴ و خطاهای دیگر.
- **`i18n/i18n.config.ts`** — پیام‌های فارسی مستقیم این‌جا تعریف شده‌اند (نه فایل JSON جدا؛ دلیل در بخش «نکات فنی» زیر).
- **`nuxt.config.ts`** — کامپوننت‌های هر ساب‌فولدر با `pathPrefix: false` ثبت شده‌اند تا نام کامپوننت‌ها ساده بمانند (مثلاً `<TheHeader>` نه `<LayoutTheHeader>`).
- **`tests/`** — تست‌های واحد با Vitest + `@nuxt/test-utils` (محیط کامل Nuxt، auto-import کار می‌کند).

سند کامل معماری/Roadmap در فایل جداگانه `phase-0-architecture.md` (تحویل‌شده در گفتگوی قبلی) موجود است.

## فرم‌ها و اعتبارسنجی

فرم‌های ثبت‌نام، ورود و افزودن گیاه (My Plants) با **VeeValidate + Zod** اعتبارسنجی واقعی دارند (نه فقط `if` ساده) — طول رشته، فرمت ایمیل، تطابق تکرار رمز، و اجباری بودن انتخاب گیاه. برای فرم بعدی از همین الگو استفاده کنید:

```ts
const schema = toTypedSchema(z.object({ ... }))
const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })
```

## تصمیم درباره NuxtImage

ماژول `@nuxt/image` نصب و در `nuxt.config.ts` فعال است، اما فعلاً **از `<NuxtImg>` استفاده نمی‌کنیم** و همه‌جا `<img loading="lazy">` ساده به‌کار رفته. دلیل:

تصاویر فعلی همه از Unsplash هات‌لینک شده‌اند (Mock Data موقت) و در Phase 3/4، وقتی Backend واقعی و فضای ذخیره‌سازی (Laravel Storage/S3) وصل شد، **کاملاً جایگزین می‌شوند**. سرمایه‌گذاری روی بهینه‌سازی IPX برای عکس‌های موقتی که قرار است دور ریخته شوند، منطقی نیست. وقتی دامنه‌ی واقعی assets مشخص شد، سراغ `<NuxtImg>` بروید و آن دامنه را در `image.domains` اضافه کنید — کد نمونه (که تست و rollback شد) در تاریخچه‌ی توسعه این پروژه موجود است.

## نکات فنی مهم (برای تیم توسعه)

1. **باگ Vite 8 + `@nuxtjs/i18n`:** بارگذاری فایل‌های ترجمه JSON خارجی خطای
   `Unexpected token 'c', "const reso"... is not valid JSON` می‌داد (ایشو باز:
   nuxt-modules/i18n#3953).
   **راه‌حل فعلی:** پیام‌ها مستقیم در `i18n/i18n.config.ts` تعریف شده‌اند. وقتی این ایشو در
   نسخه‌ی بعدی ماژول رفع شد، می‌توان به فایل‌های JSON جدا (بهتر برای مقیاس چندزبانه) برگشت.
2. **نام‌گذاری کامپوننت‌های سراسری:** Nuxt به‌طور پیش‌فرض نام پوشه را prefix می‌کند. این پروژه
   با `components: [{ path: '...', pathPrefix: false }]` در `nuxt.config.ts` این رفتار را
   خاموش کرده. **در افزودن کامپوننت جدید حواستان باشد نام فایل در کل پروژه یکتا باشد**، چون
   دیگر namespace پوشه‌ای وجود ندارد. **هر ساب‌فولدر جدید داخل `app/components/` باید دستی به
   همین آرایه اضافه شود** وگرنه کامپوننت‌هایش resolve نمی‌شوند (خطای بی‌صدا که فقط در لاگ dev
   دیده می‌شود، نه در پاسخ HTTP) — دقیقاً همین اتفاق برای `components/community/` افتاد و بعداً پیدا و رفع شد.
3. **آیکون‌ها محلی نصب شده‌اند** (`@iconify-json/lucide`, `@iconify-json/svg-spinners`) تا
   `@nuxt/icon` نیازی به فراخوانی شبکه‌ی `api.iconify.design` نداشته باشد. اگر آیکون جدیدی از
   ست دیگری لازم شد، پکیج `@iconify-json/<set-name>` مربوطه را نصب کنید.
4. **دو خطای typecheck باقی‌مانده** (`npx nuxi typecheck`) مربوط به کد ما نیستند:
   - یک باگ نوع داخلی در `@nuxt/image` (`NuxtPicture.vue`) — حتی بدون استفاده از `<NuxtImg>` چون ماژول فعال است
   - یک تداخل نسخه‌های تودرتوی بسته `nuxt` در `node_modules` که با `--legacy-peer-deps` ایجاد
     می‌شود (`nuxt.config.ts: DefineNuxtConfig has no call signatures`) — runtime و ESLint را
     تحت تأثیر قرار نمی‌دهد.
5. **صفحه ۴۰۴ فقط با درخواست HTML رندر می‌شود:** `curl` بدون هدر `Accept: text/html` خروجی
   JSON خام از Nitro می‌گیرد (رفتار استاندارد H3/Nuxt content negotiation) — این باگ نیست؛
   مرورگر واقعی همیشه `error.vue` را نشان می‌دهد.
6. **کوکی Auth:** `auth_user` به‌صورت JSON خام (نه توکن امضاشده) در کوکی ذخیره می‌شود چون
   احراز هویت فعلاً کاملاً Mock است. **در Phase 3 این باید با توکن واقعی Sanctum جایگزین شود**
   و هرگز دیتای کاربر خام در کوکی سمت کلاینت نگه‌داری نشود.

## وضعیت فعلی

**Phase 1 — Frontend MVP** ✅
- [x] Home، Identify (Upload + Camera + Fake AI Result)، Plant Catalog، Plant Detail
- [x] Dashboard، My Plants (افزودن/حذف)، Care Calendar، Profile
- [x] Design System پایه (رنگ، تایپوگرافی Vazirmatn، RTL کامل)

**Phase 2 — Frontend Advanced Features** ✅
- [x] Smart Search: پیشنهاد زنده‌ی جستجو (`SearchSuggestions`) + فیلتر پیشرفته (سطح مراقبت، نیاز نوری)
- [x] Compare Plants: `/compare/[...slugs]` با انتخاب‌گر دو گیاه و جدول مقایسه
- [x] Climate Pages: `/climate` — گیاه پیشنهادی بر اساس اقلیم ۶ شهر ایران
- [x] Community UI: `/community` — فید پست، لایک/کامنت تعاملی، پروفایل عمومی `/community/[id]`، دنبال‌کردن واقعی

**رفع شکاف‌ها (تکمیل نهایی Frontend)** ✅
- [x] Auth واقعی: لاگین/ثبت‌نام/خروج + Guard صفحات کاربری + ریدایرکت با `redirect` query
- [x] صفحه ۴۰۴/خطای سفارشی (`error.vue`)
- [x] اعتبارسنجی واقعی فرم‌ها با Zod (ثبت‌نام، ورود، افزودن گیاه)
- [x] ۲۱ تست واحد با Vitest (فرمترها، ۴ Pinia Store) — همه پاس
- [x] مدیریت خطای شبکه با Toast در `plant.store`
- [x] بررسی ریسپانسیو موبایل (بدون Horizontal Overflow، منوی موبایل صحیح)

- [x] ESLint تمیز، TypeScript Strict روی کل کد پروژه (به‌جز دو مورد بیرونی ذکرشده)
- [ ] Backend واقعی (Laravel API) → **Phase 3**
