<template>
  <!-- هم‌اندازه‌ی دقیق کارت «گیاهان شاخص» توی index.vue (همون عرض، پدینگ، نسبت عکس و ارتفاع خط‌های متن) -->
  <div
    class="flex w-[68%] shrink-0 snap-start flex-col rounded-2xl border border-ink/5 bg-surface p-3 shadow-card sm:w-[42%] lg:w-auto lg:rounded-3xl lg:p-3.5 lg:[&:nth-child(4)]:hidden"
    aria-hidden="true"
  >
    <div class="aspect-[5/4] animate-pulse rounded-xl bg-ink/10 lg:aspect-[4/3.4] lg:rounded-2xl" />

    <div class="flex flex-col px-1.5 pb-1.5 pt-3.5 lg:px-2 lg:pb-2 lg:pt-4">
      <!-- اسم: text-base (۱.۵rem) / lg:text-lg (۱.۷۵rem) -->
      <div class="flex h-6 items-center lg:h-7">
        <AppSkeleton
          height="0.875rem"
          width="65%"
        />
      </div>
      <!-- نام علمی: mt-1 + text-sm (۱.۲۵rem) / lg:text-base (۱.۵rem) -->
      <div class="mt-1 flex h-5 items-center lg:h-6">
        <AppSkeleton
          height="0.75rem"
          width="45%"
        />
      </div>
    </div>
  </div>
</template>