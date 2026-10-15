<template>
  <div
    class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_9rem_8rem_9.5rem_1.25rem] sm:px-5"
    aria-hidden="true"
  >
    <div class="flex min-w-0 items-center gap-3">
      <AppSkeleton
        height="2.5rem"
        width="2.5rem"
        rounded="rounded-xl"
      />
      <div class="flex min-w-0 flex-1 flex-col gap-1.5">
        <AppSkeleton
          height="0.875rem"
          width="60%"
        />
        <AppSkeleton
          height="0.75rem"
          width="80%"
        />
      </div>
    </div>
    <div class="justify-self-end sm:order-3 sm:justify-self-start">
      <AppSkeleton
        height="1.5rem"
        width="5rem"
        rounded="rounded-full"
      />
    </div>
    <AppSkeleton
      class="col-span-2 sm:order-2 sm:col-span-1"
      height="0.75rem"
      width="6rem"
    />
    <AppSkeleton
      class="col-span-2 sm:order-4 sm:col-span-1"
      height="0.75rem"
      width="7rem"
    />
  </div>
</template>