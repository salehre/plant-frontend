import {
  DEMO_ACCOUNT,
  DEMO_AUTO_LOGIN,
  DEMO_SEED_VERSION,
  buildDemoHistory,
  buildDemoTasks,
  buildDemoUserPlants,
  demoAvatar,
  demoCommunity,
  demoProfile,
  demoWishlistSlugs,
} from '~/services/mock/demo-data.mock'
import { getMockPosts } from '~/services/mock/community.mock'

/**
 * پر کردن داده‌ی نمونه‌ی تست (گیاهان من، وظایف، تاریخچه‌ی اسکن، علاقه‌مندی‌ها، انجمن، تیکت‌ها
 * و حساب کاربری دمو) فقط وقتی `useMockApi` روشنه.
 *
 *  - فقط یک بار اجرا می‌شه (با نسخه‌ی DEMO_SEED_VERSION توی localStorage علامت می‌خوره)،
 *    پس تغییراتی که موقع تست می‌دی (افزودن گیاه، تیک‌زدن وظیفه و ...) با رفرش از بین نمی‌ره.
 *  - برای برگردوندن همه‌چیز به حالت اولیه: آدرس رو با `?resetDemo=1` باز کن
 *    یا توی کنسول مرورگر بنویس: resetDemoData()
 *  - حساب دمو: demo@golban.app / Demo@1234 (DEMO_AUTO_LOGIN روشنه، پس بعد از اولین سید خودکار وارد می‌شه)
 *
 * وقتی Backend واقعی وصل شد این فایل و services/mock/demo-data.mock.ts رو حذف کن.
 */
const FLAG_KEY = 'bargyar-demo-seed'

export default defineNuxtPlugin(async () => {
  const { public: pub } = useRuntimeConfig()
  if (!pub.useMockApi) return

  const url = new URL(window.location.href)
  const force = url.searchParams.get('resetDemo') === '1'

  const resetter = () => {
    try {
      localStorage.removeItem(FLAG_KEY)
    }
    catch { /* localStorage در دسترس نیست */ }
    window.location.reload()
  }
  ;(window as unknown as { resetDemoData?: () => void }).resetDemoData = resetter

  let seededVersion = ''
  try {
    seededVersion = localStorage.getItem(FLAG_KEY) ?? ''
  }
  catch { /* localStorage در دسترس نیست */ }
  if (!force && seededVersion === DEMO_SEED_VERSION) return

  // هر بخش جدا اجرا می‌شه تا خطا توی یکی (مثلاً داده‌ی قدیمی و خراب توی localStorage) هیچ‌وقت
  // کل اپ رو از کار نندازه و بقیه‌ی بخش‌ها هم سید بشن.
  const seed = async (label: string, fn: () => void | Promise<void>) => {
    try {
      await fn()
    }
    catch (error) {
      console.warn(`[demo] سید «${label}» انجام نشد:`, error)
    }
  }

  // ---- گیاهان من + وظایف مراقبت + تاریخچه + علاقه‌مندی‌ها ----
  await seed('گیاهان من', () => {
    const userPlants = useUserPlantsStore()
    userPlants.plants = buildDemoUserPlants()
    userPlants.tasks = buildDemoTasks()
  })
  await seed('تاریخچه', () => {
    useHistoryStore().entries = buildDemoHistory()
  })
  await seed('علاقه‌مندی‌ها', () => {
    useWishlistStore().slugs = [...demoWishlistSlugs]
  })

  // ---- انجمن: فالو، لایک و یک کامنت از طرف کاربر دمو ----
  await seed('انجمن', () => {
    const community = useCommunityStore()
    community.posts = getMockPosts().map((post) => {
      const shouldLike = demoCommunity.likedPostIds.includes(post.id) && !post.likedByMe
      return shouldLike ? { ...post, likedByMe: true, likesCount: post.likesCount + 1 } : post
    })
    community.comments = {}
    community.followingIds = new Set(demoCommunity.followingIds)
    // اول کامنت‌های seed بارگذاری می‌شن تا اضافه‌کردن کامنت جدید اون‌ها رو پاک نکنه
    community.loadComments(demoCommunity.comment.postId)
    community.addComment(demoCommunity.comment.postId, demoCommunity.comment.content)
  })

  // ---- تیکت‌ها: seed خودِ استور (ensureSeeded) موقع ورود به صفحه‌ی تیکت‌ها دوباره ۳ تیکت می‌سازه ----
  await seed('تیکت‌ها', () => {
    const tickets = useTicketStore()
    delete tickets.byUser[DEMO_ACCOUNT.email]
    delete tickets.seeded[DEMO_ACCOUNT.email]
  })

  // ---- حساب کاربری دمو ----
  await seed('حساب کاربری', async () => {
    const auth = useAuthStore()
    auth.profiles[DEMO_ACCOUNT.email] = { ...demoProfile }
    auth.avatars[DEMO_ACCOUNT.email] = demoAvatar()

    // به ساختار auth.user اعتماد نمی‌کنیم: مقدار قدیمی/خراب (مثلاً رشته‌ی "[object Object]" که نسخه‌های
    // قبلی استور توی localStorage می‌نوشتن) ایمیل نداره و حساب‌نشده حساب می‌شه.
    const rawUser = auth.user as unknown
    const currentEmail = rawUser && typeof rawUser === 'object' && typeof (rawUser as { email?: unknown }).email === 'string'
      ? (rawUser as { email: string }).email.trim().toLowerCase()
      : ''

    // اگه کاربر واقعی دیگه‌ای لاگین باشه، خرابش نمی‌کنیم
    if (!currentEmail || currentEmail === DEMO_ACCOUNT.email) {
      const ok = await auth.login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password)
      if (ok && !DEMO_AUTO_LOGIN) auth.logout()
      auth.error = ''
    }
  })

  try {
    localStorage.setItem(FLAG_KEY, DEMO_SEED_VERSION)
  }
  catch { /* localStorage در دسترس نیست */ }

  // پارامتر resetDemo رو از آدرس برمی‌داریم تا با هر رفرش دوباره ریست نشه
  if (force) {
    url.searchParams.delete('resetDemo')
    window.history.replaceState(null, '', url.pathname + url.search + url.hash)
  }

  if (import.meta.dev) {
    console.info(`[demo] داده‌ی نمونه اعمال شد. ورود: ${DEMO_ACCOUNT.email} / ${DEMO_ACCOUNT.password} — ریست: ?resetDemo=1 یا resetDemoData()`)
  }
})