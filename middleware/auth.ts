/**
 * Guard واقعی صفحات کاربری. کاربر مهمان به صفحه ورود هدایت می‌شود
 * و مسیر مقصد در query نگه داشته می‌شود تا بعد از ورود به همان‌جا برگردد.
 */
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (!authStore.isLoggedIn) {
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
  }
})
