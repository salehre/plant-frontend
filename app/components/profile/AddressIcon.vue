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
    <g transform="translate(12 12) scale(.85) translate(-12 -12)" stroke-width="2.05">
      <rect x="3" y="7" width="18" height="13.5" rx="2.5" fill="currentColor" fill-opacity=".15" />
      <path d="M9 7V5.5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V7" />
      <path d="M3 12.6c3 1.5 6 2.2 9 2.2s6-.7 9-2.2" />
      <rect x="10.5" y="11.6" width="3" height="3.8" rx=".8" fill="currentColor" fill-opacity=".35" />
    </g>
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
    <g transform="translate(12 12) scale(.85) translate(-12 -12)" stroke-width="2.05">
      <path d="M3 20.5 8.8 6l5.8 14.5Z" fill="currentColor" fill-opacity=".15" />
      <path d="M8.8 3.5V6" />
      <path d="M7.2 20.5v-3.6a1.6 1.6 0 0 1 3.2 0v3.6" />
      <path d="M5.9 13.8h5.8" />
      <path d="M17.8 8 15.3 12.4h1.5l-2.2 4.4H21l-2.2-4.4h1.5L17.8 8Z" fill="currentColor" fill-opacity=".15" />
      <path d="M17.8 16.8v3.7" />
      <path d="M3 20.5h18" />
    </g>
  </svg>

  <!-- هر عنوان دیگه -->
  <Icon
    v-else
    name="lucide:map-pin"
  />
</template>