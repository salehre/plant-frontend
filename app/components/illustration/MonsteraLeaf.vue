<script setup lang="ts">
// برگ مونسترا به‌صورت SVG؛ رنگش از currentColor می‌آد (مثلاً text-primary-600) پس با تم/دارک‌مود عوض می‌شه
const id = useId()
</script>

<template>
  <svg
    viewBox="0 0 200 200"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <mask :id="`${id}-leaf`">
        <path
          d="M100 192C44 176 6 116 22 62 34 24 82 8 100 34 118 8 166 24 178 62 194 116 156 176 100 192Z"
          fill="#fff"
        />
        <!-- شکاف‌های کناری و سوراخ‌های برگ -->
        <g
          stroke="#000"
          stroke-width="7"
          stroke-linecap="round"
        >
          <path d="M8 104 58 108M16 142 64 134M26 74 70 88" />
          <path d="M192 104 142 108M184 142 136 134M174 74 130 88" />
        </g>
        <g fill="#000">
          <ellipse
            cx="80"
            cy="122"
            rx="5"
            ry="9"
          />
          <ellipse
            cx="120"
            cy="122"
            rx="5"
            ry="9"
          />
          <ellipse
            cx="84"
            cy="84"
            rx="4"
            ry="7"
          />
          <ellipse
            cx="116"
            cy="84"
            rx="4"
            ry="7"
          />
        </g>
      </mask>
    </defs>
    <g :mask="`url(#${id}-leaf)`">
      <path
        d="M100 192C44 176 6 116 22 62 34 24 82 8 100 34 118 8 166 24 178 62 194 116 156 176 100 192Z"
        fill="currentColor"
      />
      <!-- رگبرگ‌ها -->
      <g
        stroke="#fff"
        stroke-opacity=".3"
        stroke-linecap="round"
      >
        <path
          d="M100 192V40"
          stroke-width="3"
        />
        <path
          d="M100 160 56 124M100 128 48 96M100 160 144 124M100 128 152 96"
          stroke-width="2"
        />
      </g>
    </g>
  </svg>
</template>