<script setup lang="ts"></script>

<template>
  <svg
    viewBox="0 0 160 150"
    fill="none"
    class="select-none"
    aria-hidden="true"
    focusable="false"
  >
    <!-- هاله‌ی پس‌زمینه -->
    <circle cx="80" cy="70" r="51" class="fill-primary-100/40" />
    <circle cx="80" cy="70" r="39" class="fill-surface/40" />

    <!-- سایه‌ی زمین -->
    <ellipse cx="80" cy="140" rx="43" ry="5" class="fill-ink/5" />
    <ellipse cx="80" cy="139" rx="29" ry="3" class="fill-ink/5" />

    <!-- ساقه‌ها -->
    <path
      d="M80 101 C80 83 79 64 80 44"
      class="stroke-primary-500"
      stroke-width="3"
      stroke-linecap="round"
    />
    <path
      d="M79 86 C70 76 61 68 51 61 M81 82 C91 70 102 60 113 52"
      class="stroke-primary-500"
      stroke-width="2.5"
      stroke-linecap="round"
    />

    <!-- برگ چپ -->
    <path
      d="M79 84 C59 85 43 75 38 53 C58 49 76 59 79 84 Z"
      class="fill-primary-200"
    />
    <path
      d="M44 56 C56 60 68 69 78 81"
      class="stroke-primary-500/40"
      stroke-width="1.4"
      stroke-linecap="round"
    />
    <path
      d="M58 61 L58 69 M68 68 L68 75"
      class="stroke-primary-500/20"
      stroke-width="1"
      stroke-linecap="round"
    />

    <!-- برگ راست -->
    <path
      d="M81 78 C101 80 117 68 122 45 C102 40 84 51 81 78 Z"
      class="fill-primary-300"
    />
    <path
      d="M117 48 C104 53 92 63 82 76"
      class="stroke-primary-600/40"
      stroke-width="1.4"
      stroke-linecap="round"
    />
    <path
      d="M104 54 L104 62 M94 61 L94 69"
      class="stroke-primary-600/20"
      stroke-width="1"
      stroke-linecap="round"
    />

    <!-- جوانه‌ی بالا -->
    <path
      d="M80 53 C69 45 68 31 80 20 C92 31 91 45 80 53 Z"
      class="fill-primary-200"
    />
    <path
      d="M80 49 V28"
      class="stroke-primary-500/50"
      stroke-width="1.3"
      stroke-linecap="round"
    />

    <!-- بدنه‌ی گلدان -->
    <path
      d="M53 102 H107 L101 131.5 C100.2 135.5 98 138 94 138 H66 C62 138 59.8 135.5 59 131.5 Z"
      class="fill-surface stroke-ink/10"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <path
      d="M57 111 H103 L101 131.5 C100.2 135.5 98 138 94 138 H66 C62 138 59.8 135.5 59 131.5 Z"
      class="fill-ink/[0.04]"
    />
    <path
      d="M65 114 L67.5 130"
      class="stroke-surface/80"
      stroke-width="2"
      stroke-linecap="round"
    />

    <!-- لبه‌ی گلدان -->
    <rect
      x="48"
      y="92"
      width="64"
      height="13"
      rx="6.5"
      class="fill-surface stroke-ink/10"
      stroke-width="1.5"
    />
    <path
      d="M57 97 H76"
      class="stroke-ink/10"
      stroke-width="1.5"
      stroke-linecap="round"
    />

    <!-- جزئیات اطراف -->
    <circle cx="128" cy="75" r="3" class="fill-primary-200" />
    <circle cx="31" cy="91" r="2.5" class="fill-primary-200" />
    <circle cx="119" cy="28" r="1.8" class="fill-primary-300/70" />
    <path
      d="M125 105 V113 M121 109 H129"
      class="stroke-primary-300"
      stroke-width="1.6"
      stroke-linecap="round"
    />
    <path
      d="M34 40 V46 M31 43 H37"
      class="stroke-primary-300/70"
      stroke-width="1.4"
      stroke-linecap="round"
    />
  </svg>
</template>