<template>
  <!-- چند رگه‌ی گرادیان خطی نرم، پخش‌شده توی بک‌گراند (چپ و راست، از بالا تا پایین صفحه) -->
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
  >
    <div class="absolute top-[11.875rem] -left-12 h-[3.75rem] w-[25rem] rotate-[50deg] bg-gradient-to-br from-primary-400/40 via-primary-400/15 to-transparent blur-xl" />
    <div class="absolute top-[26%] -right-16 h-[4rem] w-[30rem] -rotate-[50deg] bg-gradient-to-bl from-accent-400/30 via-accent-400/10 to-transparent blur-xl" />
    <div class="absolute top-[46%] -left-16 h-[4.5rem] w-[28rem] rotate-[40deg] bg-gradient-to-br from-primary-400/35 via-primary-400/12 to-transparent blur-xl" />
    <div class="absolute top-[64%] -right-12 h-[3.75rem] w-[26rem] -rotate-[40deg] bg-gradient-to-bl from-primary-400/35 via-primary-400/12 to-transparent blur-xl" />
    <div class="absolute top-[84%] -left-14 h-[4rem] w-[30rem] rotate-[50deg] bg-gradient-to-br from-accent-400/30 via-accent-400/10 to-transparent blur-xl" />
  </div>
</template>
