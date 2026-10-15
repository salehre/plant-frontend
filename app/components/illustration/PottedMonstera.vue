<script setup lang="ts">
// گلدان + مونسترا برای صفحه‌ی خطا. جعبه‌ی ۲۴۰×۳۰۰ ـه؛ ساقه‌ها و گلدان توی SVG پایین و برگ‌ها
// (HTML) با درصد روی همون جعبه نشسته‌ان تا هر سایزی که بدی نسبت‌ها حفظ بشه.
</script>

<template>
  <div
    class="relative aspect-[4/5] w-full"
    aria-hidden="true"
  >
    <svg
      class="absolute inset-0 size-full"
      viewBox="0 0 240 300"
      fill="none"
    >
      <!-- ساقه‌ها -->
      <g
        class="text-primary-700"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
      >
        <path d="M120 210V146" />
        <path d="M116 210Q96 200 83 181" />
        <path d="M124 210Q146 200 162 180" />
      </g>
      <!-- گلدان -->
      <path
        d="M72 206H168L158 290H82Z"
        style="fill: rgb(var(--color-surface))"
      />
      <path
        d="M120 206H168L158 290H120Z"
        style="fill: rgb(var(--color-ink) / 0.07)"
      />
      <rect
        x="66"
        y="200"
        width="108"
        height="14"
        rx="7"
        style="fill: rgb(var(--color-surface)); stroke: rgb(var(--color-ink) / 0.12)"
      />
      <!-- خاک -->
      <ellipse
        cx="120"
        cy="206"
        rx="46"
        ry="5"
        fill="#4a3426"
      />
      <g fill="#4a3426">
        <circle
          cx="52"
          cy="292"
          r="2"
        />
        <circle
          cx="64"
          cy="296"
          r="1.6"
        />
        <circle
          cx="178"
          cy="293"
          r="2"
        />
        <circle
          cx="192"
          cy="297"
          r="1.5"
        />
        <circle
          cx="94"
          cy="297"
          r="1.4"
        />
      </g>
    </svg>

    <!-- برگ‌ها -->
    <MonsteraLeaf class="absolute left-[4.2%] top-[30%] aspect-square w-[41.7%] -rotate-[30deg] text-primary-500" />
    <MonsteraLeaf class="absolute left-[55.8%] top-[30%] aspect-square w-[40%] rotate-[26deg] text-primary-700" />
    <MonsteraLeaf class="absolute left-[22.9%] top-[6.7%] aspect-square w-[54.2%] text-primary-600" />
  </div>
</template>