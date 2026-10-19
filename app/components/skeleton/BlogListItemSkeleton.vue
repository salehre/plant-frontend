<template>
  <!-- هم‌اندازه‌ی دقیق BlogListItem: عکس ۲:۱، دسته، عنوان ۲ خطی، خلاصه ۲ خطی و متای تاریخ/زمان مطالعه -->
  <div
    class="flex flex-col gap-4 border-b border-ink/10 py-6 first:pt-0 last:border-b-0 sm:flex-row sm:gap-8"
    aria-hidden="true"
  >
    <div class="aspect-[2/1] w-full shrink-0 animate-pulse rounded-xl bg-ink/10 sm:w-72 lg:w-80" />

    <div class="flex min-w-0 flex-1 flex-col gap-2.5 sm:py-1">
      <!-- دسته: text-xs (۱rem) -->
      <div class="flex h-4 items-center">
        <AppSkeleton
          height="0.625rem"
          width="5rem"
        />
      </div>

      <!-- عنوان: ۲ خط با leading-8 (sm: leading-9) -->
      <div class="flex flex-col">
        <div class="flex h-8 items-center sm:h-9">
          <AppSkeleton
            height="1.125rem"
            width="90%"
          />
        </div>
        <div class="flex h-8 items-center sm:h-9">
          <AppSkeleton
            height="1.125rem"
            width="55%"
          />
        </div>
      </div>

      <!-- خلاصه: ۲ خط با leading-7 -->
      <div class="flex flex-col">
        <div class="flex h-7 items-center">
          <AppSkeleton
            height="0.75rem"
            width="100%"
          />
        </div>
        <div class="flex h-7 items-center">
          <AppSkeleton
            height="0.75rem"
            width="70%"
          />
        </div>
      </div>

      <!-- متا: pt-1 + text-xs (۱rem) -->
      <div class="mt-auto flex h-5 items-center gap-4 pt-1">
        <AppSkeleton
          height="0.625rem"
          width="5.5rem"
        />
        <AppSkeleton
          height="0.625rem"
          width="4.5rem"
        />
      </div>
    </div>
  </div>
</template>