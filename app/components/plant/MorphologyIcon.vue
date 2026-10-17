<script setup lang="ts">
// آیکن SVG مرتبط با هر بخش از گیاه (برگ، گل، ریشه، ...)
// رنگ اصلی از currentColor می‌آد و جزئیات تزئینی با رنگ accent کشیده می‌شن
const props = defineProps<{ name: string }>()

const known = ['plantType', 'leaf', 'flower', 'stem', 'root', 'fruit', 'seed', 'bark', 'latex']
const icon = computed(() => (known.includes(props.name) ? props.name : 'plantType'))
</script>

<template>
  <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
  >
    <!-- نوع گیاه: گیاه در گلدان -->
    <g v-if="icon === 'plantType'">
      <path d="M15 32h18l-2 11a2 2 0 0 1-2 1.6H19a2 2 0 0 1-2-1.6L15 32Z" fill="currentColor" fill-opacity=".15" />
      <path d="M13 32h22" />
      <path d="M24 32V18" />
      <path d="M24 24c-6 0-10-3-10-9 6 0 10 3 10 9Z" fill="currentColor" fill-opacity=".15" />
      <g class="text-accent-500" stroke="currentColor">
        <path d="M24 20c0-6 3.5-10 9-10 0 6-3.5 10-9 10Z" fill="currentColor" fill-opacity=".2" />
      </g>
    </g>

    <!-- برگ -->
    <g v-else-if="icon === 'leaf'">
      <path d="M10 38C8 22 18 9 38 8c1 20-9 31-24 31" fill="currentColor" fill-opacity=".15" />
      <path d="M10 38 30 17" />
      <g class="text-accent-500" stroke="currentColor">
        <path d="M19 28v-8M24 23v-9M25 29h9M20 33h8" />
      </g>
    </g>

    <!-- گل -->
    <g v-else-if="icon === 'flower'">
      <path d="M24 28v16" />
      <path d="M24 38c-4 0-7-2-8-5 4 0 7 2 8 5Z" fill="currentColor" fill-opacity=".15" />
      <g fill="currentColor" fill-opacity=".15">
        <ellipse cx="24" cy="11" rx="4.5" ry="6" />
        <ellipse cx="24" cy="29" rx="4.5" ry="6" />
        <ellipse cx="15" cy="20" rx="6" ry="4.5" />
        <ellipse cx="33" cy="20" rx="6" ry="4.5" />
      </g>
      <g class="text-accent-500" stroke="currentColor">
        <circle cx="24" cy="20" r="3.5" fill="currentColor" fill-opacity=".35" />
      </g>
    </g>

    <!-- ساقه -->
    <g v-else-if="icon === 'stem'">
      <path d="M24 44V8" />
      <path d="M24 34c-6 0-10-3-11-8 6 0 10 3 11 8Z" fill="currentColor" fill-opacity=".15" />
      <path d="M24 22c6 0 10-3 11-8-6 0-10 3-11 8Z" fill="currentColor" fill-opacity=".15" />
      <g class="text-accent-500" stroke="currentColor">
        <path d="M20 40h8M20 28h8M20 16h8" />
      </g>
    </g>

    <!-- ریشه -->
    <g v-else-if="icon === 'root'">
      <path d="M6 14h36" stroke-dasharray="2 4" />
      <path d="M24 6v12" />
      <path d="M24 18c-1 6-2 10-2 14s-2 8-4 11" />
      <path d="M24 18c1 6 2 10 4 14s3 7 6 9" />
      <path d="M23 26c-4 1-8 3-11 8" />
      <path d="M26 24c4 0 8 2 11 6" />
      <g class="text-accent-500" stroke="currentColor">
        <path d="M18 43c-1 1-3 2-5 2M34 41c1 1 3 2 5 2M12 34c-2-1-3-2-4-4" />
      </g>
    </g>

    <!-- میوه -->
    <g v-else-if="icon === 'fruit'">
      <path d="M24 14c-4-3-14-2-14 12 0 9 6 16 11 16 1.5 0 2-.5 3-.5s1.5.5 3 .5c5 0 11-7 11-16 0-14-10-15-14-12Z" fill="currentColor" fill-opacity=".15" />
      <path d="M24 14c0-3 1-6 3-8" />
      <g class="text-accent-500" stroke="currentColor">
        <path d="M27 9c3-3 8-3 10-2-1 4-6 6-10 2Z" fill="currentColor" fill-opacity=".25" />
        <path d="M16 24c0-3 2-5 4-5" />
      </g>
    </g>

    <!-- دانه / بذر -->
    <g v-else-if="icon === 'seed'">
      <path d="M24 6c8 6 12 14 12 22a12 12 0 0 1-24 0c0-8 4-16 12-22Z" fill="currentColor" fill-opacity=".15" />
      <g class="text-accent-500" stroke="currentColor">
        <path d="M24 14v26" />
        <path d="M24 24c-3 0-6-2-7-5M24 31c3 0 6-2 7-5" />
      </g>
    </g>

    <!-- پوست / تنه درخت -->
    <g v-else-if="icon === 'bark'">
      <path d="M14 6c1 6-1 10 0 16s-1 12 0 20h20c1-8-1-14 0-20s-1-10 0-16H14Z" fill="currentColor" fill-opacity=".15" />
      <path d="M10 42h28" />
      <g class="text-accent-500" stroke="currentColor">
        <path d="M20 12c1 4 0 8 1 12M28 16c-1 4 0 9-1 13M21 32c1 3 0 6 1 9M30 36v5" />
        <ellipse cx="24" cy="22" rx="2" ry="3" />
      </g>
    </g>

    <!-- شیره / لاتکس -->
    <g v-else>
      <path d="M8 18h32v8H8z" fill="currentColor" fill-opacity=".15" />
      <path d="M16 18V8M32 18V8" />
      <g class="text-accent-500" stroke="currentColor">
        <path d="M16 26c-2 3-3 5-3 7a3 3 0 0 0 6 0c0-2-1-4-3-7Z" fill="currentColor" fill-opacity=".3" />
        <path d="M32 26c-1.5 2-2 3.5-2 5a2 2 0 0 0 4 0c0-1.5-.5-3-2-5Z" fill="currentColor" fill-opacity=".3" />
        <path d="M24 30c-2 3-3 5-3 7a3 3 0 0 0 6 0c0-2-1-4-3-7Z" fill="currentColor" fill-opacity=".3" />
      </g>
    </g>
  </svg>
</template>