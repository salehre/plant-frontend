<template>
  <div class="flex min-h-screen flex-col">
    <TheHeader />
    <div class="mx-auto flex w-full max-w-6xl flex-1">
      <TheSidebar />
      <main class="min-w-0 flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
