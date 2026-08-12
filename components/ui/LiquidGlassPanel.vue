<!--
  کامپوننت شیشه‌ی مایع - نسخه‌ی reusable از الگوی Liquid Glass.
  فقط ظرفه (سایز و پس‌زمینه رو خودش تحمیل نمی‌کنه)؛ محتوا از طریق slot میاد.
  فیلتر SVG داخل خودشه چون فعلاً فقط یه‌جا (صفحات auth) استفاده می‌شه.
  اگه یه‌روز چند نمونه هم‌زمان روی یه صفحه لازم شد، id فیلتر باید یکتا بشه (useId).
-->
<script setup lang="ts">
withDefaults(defineProps<{ rounded?: string }>(), { rounded: '28px' })
</script>

<template>
  <div class="relative">
    <svg
      width="0"
      height="0"
      class="absolute"
    >
      <defs>
        <filter
          id="glass-distortion"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feTurbulence
            type="fractalNoise"
            base-frequency="0.008 0.008"
            num-octaves="2"
            seed="92"
            result="noise"
          />
          <feGaussianBlur
            in="noise"
            std-deviation="2"
            result="blurred"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="150"
            x-channel-selector="R"
            y-channel-selector="G"
          />
        </filter>
      </defs>
    </svg>

    <div
      class="liquid-glass-panel relative isolate shadow-[0px_0px_21px_-8px_rgba(255,255,255,0.35)]"
      :style="{ borderRadius: rounded }"
    >
      <div class="relative z-10">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* لایه‌ی تینت و سایه‌ی داخلی */
.liquid-glass-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 16px -4px rgba(255, 255, 255, 0.6);
  pointer-events: none;
}

/* لایه‌ی بلور و دیستورشن پس‌زمینه */
.liquid-glass-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  filter: url(#glass-distortion);
  -webkit-filter: url(#glass-distortion);
  isolation: isolate;
  pointer-events: none;
}
</style>
