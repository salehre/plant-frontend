<script setup lang="ts">
import { computed } from 'vue'

// آیکن SVG مرتبط با هر بخش از گیاه (برگ، گل، ریشه، ...)
// خطوط اصلی با currentColor کشیده می‌شن و جزئیات تزئینی با رنگ accent
const props = defineProps<{ name: string }>()

const known = ['plantType', 'leaf', 'flower', 'stem', 'root', 'fruit', 'seed', 'bark', 'latex']
const icon = computed(() => (known.includes(props.name) ? props.name : 'plantType'))
</script>

<template>
  <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
  >
    <!-- نوع گیاه: گیاه گلدانی -->
    <g v-if="icon === 'plantType'">
      <path d="M14 31h20l-2.2 11.4a2.4 2.4 0 0 1-2.4 2H18.6a2.4 2.4 0 0 1-2.4-2L14 31Z" fill="currentColor" fill-opacity=".14" />
      <path d="M12.5 31h23a1 1 0 0 0 0-2h-23a1 1 0 0 0 0 2Z" fill="currentColor" fill-opacity=".22" />
      <path d="M24 29V15" />
      <path d="M24 26c-5.5 0-9.5-2.8-10.5-8.5C19 17.5 23 20.5 24 26Z" fill="currentColor" fill-opacity=".14" />
      <path d="M24 26c-3.5-2-6.5-4.5-8.5-7.5" stroke-width="1" />
      <path d="M24 22.5c5-.2 9-2.8 10-8-5 0-9 2.7-10 8Z" fill="currentColor" fill-opacity=".14" />
      <path d="M24 22.5c3-1.5 5.5-3.7 7.5-6.5" stroke-width="1" />
      <g class="text-accent-500" stroke="currentColor">
        <path d="M24 15c-3.2-1-4.5-4-4-7.5 3.2 1 4.5 4 4 7.5Z" fill="currentColor" fill-opacity=".25" />
        <path d="M24 15c3.2-1 4.7-3.8 4.3-7 -3.2.8-4.7 3.6-4.3 7Z" fill="currentColor" fill-opacity=".25" />
        <path d="M17 35.5h14M18 39h12" stroke-width="1" />
      </g>
    </g>

    <!-- برگ -->
    <g v-else-if="icon === 'leaf'">
      <path d="M9 40C6.5 24 15 9.5 38 7.5c1.8 22-8.5 33.5-24.5 33C11.5 40.5 10 40.3 9 40Z" fill="currentColor" fill-opacity=".14" />
      <path d="M5.5 43.5 9 40" />
      <path d="M9 40C17 31.5 26 21 35 11" />
      <g class="text-accent-500" stroke="currentColor" stroke-width="1.1">
        <path d="M15.5 32.8c-1.5-3-2.4-5.5-2.6-8" />
        <path d="M20.7 27c-1.2-3-1.8-5.8-1.8-8.5" />
        <path d="M25.9 21.2c-.8-2.5-1.1-4.5-1-6.5" />
        <path d="M15.5 32.8c3.5.2 6.5-.5 9.5-2.5" />
        <path d="M20.7 27c3.5.5 6.8.2 9.8-1.5" />
        <path d="M25.9 21.2c3 .6 5.5.4 7.5-.6" />
      </g>
    </g>

    <!-- گل -->
    <g v-else-if="icon === 'flower'">
      <path d="M24 24V45" />
      <path d="M24 40c-4.5.5-8-1.5-9.5-5.5 4.5-.5 8 1.5 9.5 5.5Z" fill="currentColor" fill-opacity=".14" />
      <path d="M24 36c4-.5 7-2.5 8.2-6.3-4 .3-7 2.3-8.2 6.3Z" fill="currentColor" fill-opacity=".14" />
      <g fill="currentColor" fill-opacity=".14">
        <path d="M24 15.5C19.5 13 19.5 6 24 2.5 28.5 6 28.5 13 24 15.5Z" transform="translate(0 2)" />
        <path d="M24 15.5C19.5 13 19.5 6 24 2.5 28.5 6 28.5 13 24 15.5Z" transform="translate(0 2) rotate(72 24 15.5)" />
        <path d="M24 15.5C19.5 13 19.5 6 24 2.5 28.5 6 28.5 13 24 15.5Z" transform="translate(0 2) rotate(144 24 15.5)" />
        <path d="M24 15.5C19.5 13 19.5 6 24 2.5 28.5 6 28.5 13 24 15.5Z" transform="translate(0 2) rotate(216 24 15.5)" />
        <path d="M24 15.5C19.5 13 19.5 6 24 2.5 28.5 6 28.5 13 24 15.5Z" transform="translate(0 2) rotate(288 24 15.5)" />
      </g>
      <g class="text-accent-500" stroke="currentColor">
        <circle cx="24" cy="17.5" r="3.8" fill="currentColor" fill-opacity=".3" />
        <circle cx="22.5" cy="16.2" r=".6" fill="currentColor" stroke="none" />
        <circle cx="25.5" cy="16.2" r=".6" fill="currentColor" stroke="none" />
        <circle cx="24" cy="19" r=".6" fill="currentColor" stroke="none" />
        <path d="M21.5 25c.8-1 1.6-1.5 2.5-1.5s1.7.5 2.5 1.5" stroke-width="1" />
      </g>
    </g>

    <!-- ساقه -->
    <g v-else-if="icon === 'stem'">
      <path d="M23 45c1.5-8 0-14 1-20s0-12 1.5-17" />
      <path d="M26.5 45c-1-8 .5-14-.5-20s.5-12-.5-17" stroke-width="1" />
      <path d="M24.5 14.5c-3.5-1.5-5.5-4.5-5-8.5 3.5 1.5 5.5 4.5 5 8.5Z" fill="currentColor" fill-opacity=".2" />
      <path d="M24 22.5c-5.5.3-9.5-2.2-11-7 5.5-.3 9.5 2.2 11 7Z" fill="currentColor" fill-opacity=".14" />
      <path d="M25 31c5.5 0 9.8-2.5 11-7.5-5.5 0-9.8 2.5-11 7.5Z" fill="currentColor" fill-opacity=".14" />
      <path d="M23.5 39c-4.5.2-8-1.8-9.5-5.8 4.5-.2 8 1.8 9.5 5.8Z" fill="currentColor" fill-opacity=".14" />
      <g class="text-accent-500" stroke="currentColor" stroke-width="1.2">
        <path d="M21.2 22.5h5.2" />
        <path d="M22 31h5" />
        <path d="M21.5 39h5" />
        <path d="M21.5 15h5" />
        <path d="M20 45h9" />
      </g>
    </g>

    <!-- ریشه -->
    <g v-else-if="icon === 'root'">
      <path d="M4 15.5h40" stroke-dasharray="1 3" />
      <path d="M24 15.5V4" />
      <path d="M24 9c-3 0-5-1.5-5.5-4.2 3 0 5 1.5 5.5 4.2Z" fill="currentColor" fill-opacity=".14" />
      <path d="M24 7.5c2.8 0 4.8-1.5 5.3-4-2.8 0-4.8 1.5-5.3 4Z" fill="currentColor" fill-opacity=".14" />
      <path d="M22.5 15.5c.3 6 .5 9-.5 14s-2 9-3.5 14.5" />
      <path d="M25.5 15.5c-.3 6-.2 9 .8 14s1.5 8 2.5 13" />
      <path d="M22.3 22c-3.5 1-7 3-9.5 7.5" />
      <path d="M25.8 24c3.5.5 7 2.5 10 7" />
      <path d="M12.8 29.5c-1.5 1-2.5 3-2.8 5.5" stroke-width="1" />
      <path d="M36 31c1.5 1 2.5 3 3 5.5" stroke-width="1" />
      <g class="text-accent-500" stroke="currentColor" stroke-width="1">
        <path d="M19 38c-2.5 0-4.5 1-6 3M18.5 43c-1.8.2-3.2 1-4 2.5" />
        <path d="M28.2 36c2.5.3 4.5 1.5 6 3.5M27 41c1.8.5 3 1.5 3.5 3" />
        <path d="M17 26.5c-2 .2-3 1-3.8 2.2M32 28.5c1.8.5 2.8 1.5 3.5 2.7" />
        <circle cx="8" cy="22" r=".6" fill="currentColor" stroke="none" />
        <circle cx="40" cy="21" r=".6" fill="currentColor" stroke="none" />
        <circle cx="35" cy="44" r=".6" fill="currentColor" stroke="none" />
        <circle cx="10" cy="43" r=".6" fill="currentColor" stroke="none" />
      </g>
    </g>

    <!-- میوه -->
    <g v-else-if="icon === 'fruit'">
      <path d="M24 15c-4.5-3.5-15-2.5-15 11.5 0 9.5 6.5 17 12 17 1.5 0 2.2-.7 3-.7s1.5.7 3 .7c5.5 0 12-7.5 12-17C39 12.5 28.5 11.5 24 15Z" fill="currentColor" fill-opacity=".14" />
      <path d="M24 15c0-3 .8-6.2 2.8-8.5" />
      <g class="text-accent-500" stroke="currentColor">
        <path d="M26.5 10.5c.5-4 4.5-6 9.5-5.2-.2 4.2-4.5 7.2-9.5 5.2Z" fill="currentColor" fill-opacity=".25" />
        <path d="M27 9.5c3-.8 5.5-2 7.5-3.5" stroke-width=".9" />
        <path d="M14.5 24c.2-3.2 2.2-5.5 5-6.2" stroke-width="1.2" />
        <path d="M13.5 28.5c0 1 .2 2 .5 3" stroke-width="1.2" />
      </g>
      <path d="M21 15.5c1.5 1.2 4.5 1.2 6 0" stroke-width="1" />
    </g>

    <!-- دانه / بذر -->
    <g v-else-if="icon === 'seed'">
      <path d="M22 4c9 7 11.5 19 7 29.5-2 4.5-4 7.5-7 9.5-3-2-5-5-7-9.5C10.5 23 13 11 22 4Z" fill="currentColor" fill-opacity=".14" />
      <path d="M22 9.5c6 5.5 7.5 14.5 4.5 22.5-1.2 3-2.7 5.3-4.5 7-1.8-1.7-3.3-4-4.5-7C14.5 24 16 15 22 9.5Z" stroke-width="1" />
      <g class="text-accent-500" stroke="currentColor" stroke-width="1.1">
        <path d="M22 14v22" />
        <path d="M22 20c-1.8-.5-3-1.5-3.8-3M22 20c1.8-.5 3-1.5 3.8-3" />
        <path d="M22 27c-1.8-.5-3-1.5-3.8-3M22 27c1.8-.5 3-1.5 3.8-3" />
      </g>
      <path d="M38.5 24.5c2.5 2.5 3.5 6 1.7 8.5-3-.5-5-3.8-3.5-7.2.5-.5 1-.9 1.8-1.3Z" fill="currentColor" fill-opacity=".14" stroke-width="1.1" />
      <path d="M7.5 38c1.8-1.8 4.5-1.8 6-.2-.5 2.3-3.5 3.5-6 .2Z" fill="currentColor" fill-opacity=".14" stroke-width="1.1" />
    </g>

    <!-- پوست / تنه درخت -->
    <g v-else-if="icon === 'bark'">
      <path d="M15 5c1 5-1 9 0 14s-1 10-.5 15c0 3.5-2.5 6-5.5 8.5h30c-3-2.5-5.5-5-5.5-8.5.5-5-1.5-10-.5-15s-1-9 0-14H15Z" fill="currentColor" fill-opacity=".14" />
      <path d="M15 5c0-1.2 4-2 9-2s9 .8 9 2" />
      <path d="M4 42.5h40" />
      <g class="text-accent-500" stroke="currentColor" stroke-width="1.2">
        <path d="M19.5 8c1 4-.5 8 .5 12s-.5 8 .5 12" />
        <path d="M28 9c-1 4 .5 8-.5 12s1 7 0 11" />
        <path d="M32 24c.5 4-.5 8 .5 11" />
        <path d="M17 26c-.5 3 .5 6-.5 9" />
        <path d="M23.5 35c1 2 .5 4 1 6.5" />
        <path d="M18 40c.5-1.5 1.2-2.5 2-3.2M30.5 40c-.5-1.5-1.2-2.5-2-3.2" stroke-width="1" />
      </g>
      <ellipse cx="24.5" cy="16" rx="2.3" ry="3.3" stroke-width="1.1" />
      <ellipse cx="24.5" cy="16" rx="1" ry="1.5" stroke-width=".8" />
    </g>

    <!-- شیره / لاتکس -->
    <g v-else>
      <path d="M16 44V20a6 2.2 0 0 1 12 0v24" fill="currentColor" fill-opacity=".14" />
      <ellipse cx="22" cy="20" rx="6" ry="2.2" fill="currentColor" fill-opacity=".1" />
      <path d="M19 23v18" stroke-width="1" />
      <path d="M16 36c-3.5.3-6.2-1.2-7.5-4.5 3.5-.3 6.2 1.2 7.5 4.5Z" fill="currentColor" fill-opacity=".14" />
      <g class="text-accent-500" stroke="currentColor">
        <path d="M17 19.5c-1.3-3.5 1.7-5.8 5-5.3 3.3-.5 6.3 1.8 5 5.3-1.5 1.2-3.2 1.7-5 1.7s-3.5-.5-5-1.7Z" fill="currentColor" fill-opacity=".3" />
        <path d="M27.2 21c.5 2.5.5 4 .3 5.5" stroke-width="1.2" />
        <path d="M27.5 26.5c-1.5 2.2-2.2 3.6-2.2 4.8a2.2 2.2 0 0 0 4.4 0c0-1.2-.7-2.6-2.2-4.8Z" fill="currentColor" fill-opacity=".3" />
        <path d="M37 17c-1.6 2.4-2.4 4-2.4 5.4a2.4 2.4 0 0 0 4.8 0c0-1.4-.8-3-2.4-5.4Z" fill="currentColor" fill-opacity=".25" />
        <path d="M36 32c-1.1 1.6-1.6 2.7-1.6 3.7a1.6 1.6 0 0 0 3.2 0c0-1-.5-2.1-1.6-3.7Z" fill="currentColor" fill-opacity=".25" />
        <path d="M30.5 44.5c2.5-1 6-1 9 0" stroke-width="1" />
      </g>
    </g>
  </svg>
</template>