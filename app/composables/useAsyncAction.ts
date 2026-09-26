/**
 * الگوی loading/error/try-catch/finally در تقریباً همه‌ی actionهای async استورها
 * (مثلاً plant.store.ts) عیناً تکرار شده بود. این composable همون الگو رو یک‌جا پیاده
 * می‌کنه: state استور رو می‌گیره، تابع async رو اجرا می‌کنه، در صورت خطا پیام مشخص‌شده
 * رو روی state.error می‌ذاره و اختیاری toast نشون می‌ده، و همیشه loading رو در finally
 * خاموش می‌کنه.
 *
 * استفاده در یک Pinia action:
 *   async fetchList() {
 *     const result = await runAsyncAction(this, () => getPlantList(...), {
 *       errorMessage: 'مشکلی در دریافت لیست گیاهان پیش اومد.',
 *     })
 *     if (result) this.list = result
 *   }
 */
export interface AsyncActionTarget {
  loading: boolean
  error: string
}

export interface AsyncActionOptions {
  /** پیامی که در صورت خطا روی target.error ست می‌شه */
  errorMessage: string
  /** پیش‌فرض true — همون پیام رو به‌صورت toast خطا هم نشون بده */
  toast?: boolean
}

export async function runAsyncAction<T>(
  target: AsyncActionTarget,
  action: () => Promise<T>,
  options: AsyncActionOptions,
): Promise<T | undefined> {
  target.loading = true
  target.error = ''
  try {
    return await action()
  }
  catch (err) {
    target.error = options.errorMessage
    if (options.toast ?? true) {
      useUiStore().showToast(options.errorMessage, 'error')
    }
    if (import.meta.dev) {
      // لاگ خطای واقعی فقط در dev - پیام فارسی کاربرپسند برای toast/UI جداست
      console.error('[runAsyncAction]', err)
    }
    return undefined
  }
  finally {
    target.loading = false
  }
}
