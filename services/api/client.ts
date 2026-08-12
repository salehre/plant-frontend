/**
 * لایه واحد فراخوانی API.
 * در Phase 3، فقط baseURL و هدرهای احراز هویت (Sanctum Token) به این‌جا اضافه می‌شود؛
 * کامپوننت‌ها و Storeها هیچ تغییری نیاز ندارند.
 */
export function useApiClient() {
  const config = useRuntimeConfig()

  const get = <T>(path: string) =>
    $fetch<T>(path, { baseURL: config.public.apiBaseUrl })

  const post = <T>(path: string, body: Record<string, unknown>) =>
    $fetch<T>(path, { baseURL: config.public.apiBaseUrl, method: 'POST', body })

  return { get, post }
}
