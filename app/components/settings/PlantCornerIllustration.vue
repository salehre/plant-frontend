<script setup lang="ts"></script>

<template>
  <svg
    viewBox="-80 0 340 320"
    class="plant-corner pointer-events-none select-none rtl:-scale-x-100"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <g id="pc-leaf">
        <path d="M0 0 C8 -17 32 -22 50 -9 C36 9 10 11 0 0 Z" class="fill-primary-500" />
        <path d="M2 0 C16 -3 32 -6 46 -9" class="stroke-primary-800/40" stroke-width="1.4" stroke-linecap="round" />
      </g>
      <g id="pc-leaf-light">
        <path d="M0 0 C8 -17 32 -22 50 -9 C36 9 10 11 0 0 Z" class="fill-primary-300" />
        <path d="M2 0 C16 -3 32 -6 46 -9" class="stroke-primary-700/30" stroke-width="1.4" stroke-linecap="round" />
      </g>
      <g id="pc-round">
        <ellipse cx="13" cy="0" rx="13" ry="10" class="fill-primary-400" />
        <path d="M1 0 H22" class="stroke-primary-800/30" stroke-width="1.2" stroke-linecap="round" />
      </g>
      <g id="pc-blade">
        <path d="M-7 0 C-11 -40 -5 -82 2 -122 C10 -82 12 -40 7 0 Z" class="fill-primary-600" />
        <path d="M0 -4 C0 -45 1 -85 2 -112" class="stroke-primary-300/50" stroke-width="1.6" stroke-linecap="round" />
      </g>
      <ellipse id="pc-petal" cx="0" cy="-11" rx="6.5" ry="11" class="fill-accent-400" />
    </defs>

    <path d="M-80 320 C-40 302 60 296 150 301 C190 292 225 290 260 296 L260 320 Z" class="fill-primary-700/25" />
    <path d="M-30 320 C20 308 100 305 170 308 C205 303 235 303 260 305 L260 320 Z" class="fill-primary-700/30" />

    <g class="pc-sway pc-sway-slow" style="transform-origin: 236px 308px">
      <path d="M236 308 C236 280 246 258 244 232" class="stroke-primary-400" stroke-width="4" stroke-linecap="round" />
      <use href="#pc-leaf-light" transform="translate(240 270) rotate(-25) scale(.7)" />
      <use href="#pc-leaf-light" transform="translate(242 250) rotate(-150) scale(.62)" />
      <use href="#pc-leaf-light" transform="translate(244 232) rotate(-80) scale(.55)" />
    </g>

    <g class="pc-sway pc-sway-mid" style="transform-origin: 128px 316px">
      <g transform="translate(-22 0)">
      <path d="M150 318 C153 285 145 255 150 218" class="stroke-primary-600" stroke-width="3.5" stroke-linecap="round" />
      <use href="#pc-leaf" transform="translate(151 290) rotate(-20) scale(.6)" />
      <use href="#pc-leaf" transform="translate(148 262) rotate(-160) scale(.55)" />
      <g transform="translate(150 212)">
        <use href="#pc-petal" />
        <use href="#pc-petal" transform="rotate(60)" />
        <use href="#pc-petal" transform="rotate(120)" />
        <use href="#pc-petal" transform="rotate(180)" />
        <use href="#pc-petal" transform="rotate(240)" />
        <use href="#pc-petal" transform="rotate(300)" />
        <circle r="6" class="fill-accent-700" />
      </g>
      </g>
    </g>

    <g class="pc-sway" style="transform-origin: 104px 318px">
      <path d="M104 318 C102 292 94 272 80 250" class="stroke-primary-500" stroke-width="3.5" stroke-linecap="round" />
      <path d="M99 290 C108 276 118 266 130 262" class="stroke-primary-500" stroke-width="3" stroke-linecap="round" />
      <use href="#pc-round" transform="translate(103 306) rotate(-170)" />
      <use href="#pc-round" transform="translate(101 286) rotate(-15)" />
      <use href="#pc-round" transform="translate(94 268) rotate(-165)" />
      <use href="#pc-round" transform="translate(86 256) rotate(-40)" />
      <use href="#pc-round" transform="translate(80 250) rotate(-110)" />
      <use href="#pc-round" transform="translate(116 272) rotate(-30) scale(.9)" />
      <use href="#pc-round" transform="translate(130 262) rotate(-70) scale(.85)" />
    </g>

    <g class="pc-sway pc-sway-slow" style="transform-origin: 30px 318px">
      <use href="#pc-blade" transform="translate(30 318) rotate(-30) scale(.8)" />
      <use href="#pc-blade" transform="translate(30 318) rotate(26) scale(.85)" />
      <use href="#pc-blade" transform="translate(30 318) rotate(-12)" />
      <use href="#pc-blade" transform="translate(30 318) rotate(10) scale(.92)" />
    </g>

    <g class="pc-sway" style="transform-origin: 226px 312px">
      <path d="M226 312 C224 262 206 214 170 174 C148 150 134 122 130 86" class="stroke-primary-600" stroke-width="5.5" stroke-linecap="round" />
      <use href="#pc-leaf" transform="translate(222 284) rotate(-165) scale(1.05)" />
      <use href="#pc-leaf" transform="translate(214 244) rotate(-20) scale(1)" />
      <use href="#pc-leaf" transform="translate(197 208) rotate(-158) scale(1.1)" />
      <use href="#pc-leaf" transform="translate(178 181) rotate(-28) scale(.95)" />
      <use href="#pc-leaf" transform="translate(156 153) rotate(-152) scale(.95)" />
      <use href="#pc-leaf" transform="translate(141 124) rotate(-35) scale(.8)" />
      <use href="#pc-leaf" transform="translate(130 86) rotate(-105) scale(.75)" />
    </g>

    <g class="pc-sway pc-sway-mid" style="transform-origin: 214px 314px">
      <path d="M214 314 C196 292 170 282 140 280" class="stroke-primary-500" stroke-width="4" stroke-linecap="round" />
      <use href="#pc-leaf" transform="translate(190 289) rotate(-60) scale(.7)" />
      <use href="#pc-leaf" transform="translate(166 282) rotate(-170) scale(.8)" />
      <use href="#pc-leaf" transform="translate(140 280) rotate(160) scale(.7)" />
    </g>

    <g class="pc-sway pc-sway-slow" style="transform-origin: 186px 318px">
      <path d="M176 318 C176 302 170 290 160 282" class="stroke-primary-400" stroke-width="3" stroke-linecap="round" />
      <path d="M184 318 C184 298 182 286 180 272" class="stroke-primary-500" stroke-width="3" stroke-linecap="round" />
      <path d="M192 318 C194 302 200 292 210 286" class="stroke-primary-400" stroke-width="3" stroke-linecap="round" />
      <path d="M198 318 C202 306 210 300 220 298" class="stroke-primary-500" stroke-width="3" stroke-linecap="round" />
    </g>

    <g class="pc-sway pc-sway-mid" style="transform-origin: -42px 318px">
      <path d="M-42 318 C-44 304 -38 292 -32 284" class="stroke-primary-500" stroke-width="3" stroke-linecap="round" />
      <use href="#pc-round" transform="translate(-41 306) rotate(-170) scale(.7)" />
      <use href="#pc-round" transform="translate(-36 292) rotate(-25) scale(.75)" />
      <use href="#pc-round" transform="translate(-32 284) rotate(-100) scale(.7)" />
    </g>
  </svg>
</template>

<style scoped>
.plant-corner {
  overflow: visible;
}
.pc-sway {
  transform-box: view-box;
  animation: pc-sway 7s ease-in-out infinite;
}
.pc-sway-slow {
  animation-duration: 9s;
  animation-delay: -2s;
}
.pc-sway-mid {
  animation-duration: 8s;
  animation-delay: -4s;
}
@keyframes pc-sway {
  0%, 100% { transform: rotate(-1.2deg); }
  50% { transform: rotate(1.4deg); }
}
@media (prefers-reduced-motion: reduce) {
  .pc-sway { animation: none; }
}
</style>
