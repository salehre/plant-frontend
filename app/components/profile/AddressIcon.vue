<script setup lang="ts">
/**
 * آیکن آدرس: برای سه عنوان پیش‌فرض (خانه، محل کار، ویلا) آیکن سفارشی،
 * برای هر عنوان دیگه همون آیکن عمومی پین مکان.
 */
const props = defineProps<{ label?: string }>()
const kind = computed(() => addressKindOf(props.label ?? ''))
</script>

<template>
  <!-- خانه -->
  <svg
    v-if="kind === 'home'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M5.5 10.2v9.3a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9.3L12 4.5l-6.5 5.7Z" fill="currentColor" fill-opacity=".15" />
    <path d="M3 11.2 12 3.5l9 7.7" />
    <path d="M16.5 6.8V4h2.2v4.7" />
    <path d="M10 20.5v-4.3a2 2 0 0 1 4 0v4.3" />
    <circle cx="12" cy="10.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>

  <!-- محل کار -->
  <svg
    v-else-if="kind === 'work'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="8" width="18" height="12" rx="2.5" fill="currentColor" fill-opacity=".15" />
    <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" />
    <path d="M3 13.2c3 1.3 6 1.9 9 1.9s6-.6 9-1.9" />
    <rect x="10.5" y="12.2" width="3" height="3.6" rx=".8" fill="currentColor" fill-opacity=".35" />
  </svg>

  <!-- ویلا -->
  <svg
    v-else-if="kind === 'cabin'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 20.5 9.5 6.5l7 14Z" fill="currentColor" fill-opacity=".15" />
    <path d="M9.5 3.5v3" />
    <path d="M8 20.5v-4a1.5 1.5 0 0 1 3 0v4" />
    <path d="M6.3 14.5h6.4" />
    <path d="M19.5 20.5v-2.2M19.5 8.5l-2.7 4.5h1.8L16 17.3h7l-2.6-4.3h1.8L19.5 8.5Z" fill="currentColor" fill-opacity=".15" />
    <path d="M1.5 20.5h21" />
  </svg>

  <!-- هر عنوان دیگه -->
  <Icon
    v-else
    name="lucide:map-pin"
  />
</template>