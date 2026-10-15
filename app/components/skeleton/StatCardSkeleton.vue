<template>
  <div
    class="glass-card flex items-center gap-3 p-4"
    aria-hidden="true"
  >
    <AppSkeleton
      height="2.75rem"
      width="2.75rem"
      rounded="rounded-full"
    />
    <div class="flex min-w-0 flex-1 flex-col gap-2">
      <AppSkeleton
        height="1.5rem"
        width="40%"
      />
      <AppSkeleton
        height="0.75rem"
        width="70%"
      />
    </div>
  </div>
</template>