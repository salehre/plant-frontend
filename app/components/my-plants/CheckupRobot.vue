<script setup lang="ts">
defineProps<{ state?: 'idle' | 'analyzing' | 'done' }>()
</script>

<template>
  <!-- ربات بررسی گیاه؛ رنگ‌ها از تم فعلی میان و انیمیشنش وقتی از دید خارج بشه متوقف می‌شه -->
  <svg
    v-offscreen-pause
    viewBox="0 0 200 190"
    fill="none"
    class="select-none"
    aria-hidden="true"
    focusable="false"
  >
    <ellipse cx="100" cy="179" rx="46" ry="5" class="fill-ink/5" />

    <g class="robot-float">
      <!-- بدنه -->
      <rect x="68" y="108" width="64" height="58" rx="26" class="fill-surface stroke-ink/10" stroke-width="1.5" />
      <circle cx="100" cy="140" r="8" class="fill-primary-500" />
      <circle cx="98" cy="138" r="2.4" fill="#fff" opacity=".7" />

      <!-- شاخه‌ی چپ -->
      <path d="M44 132 C40 118 38 106 42 92" class="stroke-primary-500" stroke-width="2.4" stroke-linecap="round" />
      <path d="M0 0 C-7 -7 -7 -17 0 -24 C7 -17 7 -7 0 0Z" transform="translate(42 92) rotate(-8)" class="fill-primary-500" />
      <path d="M0 0 C-7 -7 -7 -17 0 -24 C7 -17 7 -7 0 0Z" transform="translate(40 108) rotate(-58) scale(.8)" class="fill-primary-400" />
      <path d="M0 0 C-7 -7 -7 -17 0 -24 C7 -17 7 -7 0 0Z" transform="translate(41 121) rotate(52) scale(.75)" class="fill-primary-300" />

      <!-- شاخه‌ی راست -->
      <path d="M156 128 C160 114 160 102 156 90" class="stroke-primary-500" stroke-width="2.4" stroke-linecap="round" />
      <path d="M0 0 C-7 -7 -7 -17 0 -24 C7 -17 7 -7 0 0Z" transform="translate(156 90) rotate(10)" class="fill-primary-500" />
      <path d="M0 0 C-7 -7 -7 -17 0 -24 C7 -17 7 -7 0 0Z" transform="translate(158 106) rotate(58) scale(.8)" class="fill-primary-400" />
      <path d="M0 0 C-7 -7 -7 -17 0 -24 C7 -17 7 -7 0 0Z" transform="translate(157 118) rotate(-50) scale(.75)" class="fill-primary-300" />

      <!-- بازوها -->
      <path d="M72 124 C60 126 52 130 46 133" class="stroke-ink/10" stroke-width="11" stroke-linecap="round" />
      <path d="M72 124 C60 126 52 130 46 133" class="stroke-surface" stroke-width="8" stroke-linecap="round" />
      <path d="M128 122 C140 122 148 125 155 128" class="stroke-ink/10" stroke-width="11" stroke-linecap="round" />
      <path d="M128 122 C140 122 148 125 155 128" class="stroke-surface" stroke-width="8" stroke-linecap="round" />
      <circle cx="44" cy="132" r="5.5" class="fill-surface stroke-ink/10" stroke-width="1.5" />
      <circle cx="156" cy="128" r="5.5" class="fill-surface stroke-ink/10" stroke-width="1.5" />

      <!-- سر -->
      <circle cx="52" cy="78" r="8" class="fill-surface stroke-ink/10" stroke-width="1.5" />
      <circle cx="148" cy="78" r="8" class="fill-surface stroke-ink/10" stroke-width="1.5" />
      <rect x="56" y="44" width="88" height="66" rx="30" class="fill-surface stroke-ink/10" stroke-width="1.5" />
      <rect x="66" y="54" width="68" height="46" rx="22" class="fill-primary-900" />
      <path d="M100 44 V35" class="stroke-ink/20" stroke-width="2" stroke-linecap="round" />
      <circle cx="100" cy="31" r="4" class="fill-primary-300" />

      <!-- صورت -->
      <g v-if="state === 'done'" stroke="#67e8f9" stroke-width="3.6" stroke-linecap="round">
        <path d="M82 77 q6 -9 12 0" />
        <path d="M106 77 q6 -9 12 0" />
        <path d="M92 88 q8 7 16 0" />
      </g>
      <g v-else-if="state === 'analyzing'" fill="#67e8f9" class="robot-scan">
        <circle cx="88" cy="76" r="4" />
        <circle cx="112" cy="76" r="4" />
        <rect x="93" y="87" width="14" height="3.4" rx="1.7" />
      </g>
      <g v-else fill="#67e8f9">
        <circle cx="88" cy="76" r="4" />
        <circle cx="112" cy="76" r="4" />
        <path d="M93 88 q7 5 14 0" stroke="#67e8f9" stroke-width="3" stroke-linecap="round" fill="none" />
      </g>
    </g>

    <!-- جرقه‌ها -->
    <path d="M26 56 l1.8 -4.6 l1.8 4.6 l4.6 1.8 l-4.6 1.8 l-1.8 4.6 l-1.8 -4.6 l-4.6 -1.8Z" class="fill-status-warning" opacity=".85" />
    <path transform="translate(14 -34)" d="M172 98 l1.4 -3.6 l1.4 3.6 l3.6 1.4 l-3.6 1.4 l-1.4 3.6 l-1.4 -3.6 l-3.6 -1.4Z" class="fill-status-warning" opacity=".7" />

    <!-- حباب تأیید -->
    <g v-if="state === 'done'">
      <path d="M142 46 l-8 12 l14 -4Z" class="fill-surface stroke-ink/10" stroke-width="1.5" stroke-linejoin="round" />
      <circle cx="158" cy="30" r="20" class="fill-surface stroke-ink/10" stroke-width="1.5" />
      <path d="M149 30 l6 6 l11 -12" class="stroke-primary-600" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  </svg>
</template>

<style scoped>
.robot-float {
  animation: robot-float 3.4s ease-in-out infinite;
}

.robot-scan {
  animation: robot-scan 0.9s ease-in-out infinite alternate;
}

@keyframes robot-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes robot-scan {
  from { opacity: 0.35; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .robot-float,
  .robot-scan {
    animation: none;
  }
}
</style>
