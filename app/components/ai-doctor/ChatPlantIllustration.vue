<template>
  <!-- تصویر حالت خالی پنل گیاه: گلدون با جوانه‌ی نرم؛ رنگ‌ها از تم فعلی (primary/ink) میان -->
  <svg
    viewBox="0 0 160 150"
    fill="none"
    class="select-none"
    aria-hidden="true"
    focusable="false"
  >
    <!-- سایه‌ی زمین -->
    <ellipse cx="80" cy="139" rx="46" ry="6" class="fill-ink/5" />

    <!-- برگ‌ها -->
    <path d="M80 84 C62 84 44 74 38 52 C58 48 76 60 80 84 Z" class="fill-primary-200" />
    <path d="M80 84 C66 72 52 62 42 54" class="stroke-primary-500/30" stroke-width="1.4" stroke-linecap="round" />

    <path d="M80 76 C96 78 114 68 122 44 C102 38 82 52 80 76 Z" class="fill-primary-300" />
    <path d="M80 76 C96 64 110 54 118 46" class="stroke-primary-600/30" stroke-width="1.4" stroke-linecap="round" />

    <!-- ساقه و جوانه‌ی بالا -->
    <path d="M80 96 C80 80 79 66 80 50" class="stroke-primary-400" stroke-width="3" stroke-linecap="round" />
    <path d="M80 52 C70 44 69 30 80 20 C91 30 90 44 80 52 Z" class="fill-primary-100" />
    <path d="M80 50 V28" class="stroke-primary-400/50" stroke-width="1.2" stroke-linecap="round" />

    <!-- گلدون -->
    <path
      d="M53 104 H107 L100.5 133 Q99.5 138 94.5 138 H65.5 Q60.5 138 59.5 133 Z"
      class="fill-surface stroke-ink/10"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <path d="M57 112 H103 L100.5 133 Q99.5 138 94.5 138 H65.5 Q60.5 138 59.5 133 Z" class="fill-ink/[0.04]" />
    <rect x="48" y="92" width="64" height="13" rx="6" class="fill-surface stroke-ink/10" stroke-width="1.5" />
    <path d="M56 97 H80" class="stroke-ink/10" stroke-width="1.5" stroke-linecap="round" />

    <!-- جرقه‌های کوچک -->
    <circle cx="128" cy="78" r="3" class="fill-primary-200" />
    <circle cx="30" cy="92" r="2.2" class="fill-primary-200" />
    <path d="M118 108 v8 M114 112 h8" class="stroke-primary-300" stroke-width="1.6" stroke-linecap="round" />
  </svg>
</template>
