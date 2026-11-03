/**
 * دایرکتیو `v-offscreen-pause`: انیمیشن‌های داخل المنت رو وقتی از دید خارجه متوقف می‌کنه.
 * (اپ SPA هست و ssr: false، پس نیازی به getSSRProps نیست.)
 *
 *   <section v-offscreen-pause> ... </section>
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('offscreen-pause', {
    mounted: (el: HTMLElement) => observeOffscreen(el),
    beforeUnmount: (el: HTMLElement) => unobserveOffscreen(el),
  })
})
