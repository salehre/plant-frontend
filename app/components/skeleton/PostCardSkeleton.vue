<template>
  <article
    class="overflow-hidden glass-card"
    aria-hidden="true"
  >
    <div class="flex items-center gap-3 p-4">
      <AppSkeleton
        height="2.5rem"
        width="2.5rem"
        rounded="rounded-full"
      />
      <div class="flex flex-1 flex-col gap-2">
        <AppSkeleton
          height="0.875rem"
          width="35%"
        />
        <AppSkeleton
          height="0.75rem"
          width="20%"
        />
      </div>
    </div>
    <div class="aspect-square w-full animate-pulse bg-ink/10" />
    <div class="flex flex-col gap-3 p-4">
      <div class="flex gap-4">
        <AppSkeleton
          height="1.25rem"
          width="3rem"
        />
        <AppSkeleton
          height="1.25rem"
          width="3rem"
        />
      </div>
      <AppSkeleton height="0.875rem" />
      <AppSkeleton
        height="0.875rem"
        width="60%"
      />
    </div>
  </article>
</template>