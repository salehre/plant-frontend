<script setup lang="ts">
// آیکن SVG بخش «کاربردها» (خوراکی / صنعتی / درمانی) هم‌سبک MorphologyIcon:
// خطوط اصلی با currentColor و جزئیات تزئینی با رنگ accent
defineProps<{ name: 'food' | 'industrial' | 'therapeutic' }>()
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
    <!-- خوراکی: سیب با برگ -->
    <g v-if="name === 'food'">
      <path
        d="M24 15.5c-2.6-2.4-8.5-3-11 2.5-2.4 5.4.4 15.2 5 20 1.8 1.9 4 1.5 6 .5 2 1 4.2 1.4 6-.5 4.6-4.8 7.4-14.6 5-20-2.5-5.5-8.4-4.9-11-2.5Z"
        fill="currentColor"
        fill-opacity=".14"
      />
      <path d="M24 15.5c0-3 .8-5.2 2.4-7" />
      <path
        d="M16.5 22.5c.4-2 1.6-3.3 3.3-3.7"
        stroke-width="1"
      />
      <g
        class="text-accent-500"
        stroke="currentColor"
      >
        <path
          d="M26.8 9.4c2.6-2.3 5.9-2.3 8.2-.8-1.6 3.1-5.2 3.9-8.2.8Z"
          fill="currentColor"
          fill-opacity=".25"
        />
        <path
          d="M27.5 9.6c2-.4 4-.1 5.6.8"
          stroke-width="1"
        />
      </g>
    </g>

    <!-- صنعتی: کارخانه با دودکش -->
    <g v-else-if="name === 'industrial'">
      <path
        d="M7 40V25l10 6v-6l10 6v-6l10 6V40H7Z"
        fill="currentColor"
        fill-opacity=".14"
      />
      <path
        d="M37 40V14h6v26"
        fill="currentColor"
        fill-opacity=".22"
      />
      <path d="M5 40h40" />
      <path
        d="M36 14h8"
        stroke-width="1"
      />
      <g
        class="text-accent-500"
        stroke="currentColor"
      >
        <path d="M13 36h3M21 36h3M29 36h3" />
        <path
          d="M40 10c-1.6-1.4-1.6-3.2 0-4.6M43.5 8.5c-1-1-1-2.2 0-3.2"
          stroke-width="1"
        />
      </g>
    </g>

    <!-- درمانی: هاون و دسته با برگ -->
    <g v-else>
      <path
        d="M9 25h30c0 8-5 15-15 15S9 33 9 25Z"
        fill="currentColor"
        fill-opacity=".14"
      />
      <path d="M7.5 25h33" />
      <path d="M18 42h12" />
      <path
        d="M27.5 23.5 36 10.5"
        stroke-width="3"
      />
      <path
        d="M14 31c1.4 2.6 3.6 4.4 6.5 5"
        stroke-width="1"
      />
      <g
        class="text-accent-500"
        stroke="currentColor"
      >
        <path
          d="M17.5 21.5c-4-.4-6.2-3.2-6-7.5 4.2.2 6.6 3 6 7.5Z"
          fill="currentColor"
          fill-opacity=".25"
        />
        <path
          d="M17.5 21.5c-1.4-2.4-3-4.2-5-5.6"
          stroke-width="1"
        />
      </g>
    </g>
  </svg>
</template>