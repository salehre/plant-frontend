<template>
  <div
    class="mx-auto flex max-w-5xl flex-col gap-5 pb-10"
    aria-hidden="true"
  >
    <!-- هدر -->
    <div class="glass-card flex flex-col gap-5 p-4 sm:flex-row sm:p-6">
      <div class="aspect-square w-full shrink-0 animate-pulse rounded-2xl bg-ink/10 sm:size-56 sm:w-56 lg:size-64 lg:w-64" />
      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <AppSkeleton
          height="2rem"
          width="55%"
        />
        <AppSkeleton
          height="1rem"
          width="35%"
        />
        <div class="mt-2 flex flex-wrap gap-2">
          <AppSkeleton
            v-for="i in 3"
            :key="i"
            height="1.75rem"
            width="5.5rem"
            rounded="rounded-full"
          />
        </div>
        <div class="mt-3 flex flex-col gap-2">
          <AppSkeleton height="0.875rem" />
          <AppSkeleton height="0.875rem" />
          <AppSkeleton
            height="0.875rem"
            width="75%"
          />
        </div>
      </div>
    </div>

    <!-- کارت‌های نگهداری -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div
        v-for="i in 4"
        :key="i"
        class="glass-card flex flex-col items-center gap-2 p-4"
      >
        <AppSkeleton
          height="2.5rem"
          width="2.5rem"
          rounded="rounded-full"
        />
        <AppSkeleton
          height="0.75rem"
          width="60%"
        />
        <AppSkeleton
          height="0.875rem"
          width="40%"
        />
      </div>
    </div>

    <!-- بخش توضیحات -->
    <div class="glass-card flex flex-col gap-3 p-5">
      <AppSkeleton
        height="1.25rem"
        width="30%"
      />
      <AppSkeleton height="0.875rem" />
      <AppSkeleton height="0.875rem" />
      <AppSkeleton
        height="0.875rem"
        width="80%"
      />
    </div>
  </div>
</template>