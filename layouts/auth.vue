<!--
  Layout صفحات auth - «نگاه از پشت شیشه‌ی گلخانه، شب».
  این صفحه عمداً هویت بصری مستقلی از بقیه‌ی اپ داره (پس‌زمینه‌ی تیره‌ی ثابت،
  مستقل از سوییچ دارک‌مود) چون یه لحظه‌ی ورودی متمایزه، نه یه صفحه‌ی محتوایی معمولی.
-->
<template>
  <div class="greenhouse-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="glow-blob glow-blob--green" />
      <div class="glow-blob glow-blob--gold" />
      <div class="glow-blob glow-blob--green-2" />
    </div>

    <div class="relative z-10 w-full max-w-md">
      <NuxtLink
        to="/"
        class="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]"
      >
        <Icon
          name="lucide:leaf"
          class="size-6 text-accent-300"
        />
        برگ‌یار
      </NuxtLink>

      <LiquidGlassPanel>
        <div class="p-7 sm:p-8">
          <slot />
        </div>
      </LiquidGlassPanel>
    </div>

    <AppToast />
  </div>
</template>

<style scoped>
.greenhouse-bg {
  background:
    radial-gradient(circle at 18% 15%, rgba(102, 164, 89, 0.25), transparent 45%),
    radial-gradient(circle at 85% 80%, rgba(209, 153, 63, 0.22), transparent 45%),
    linear-gradient(160deg, #16241a 0%, #1c2a1a 45%, #241a12 100%);
}

.glow-blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(70px);
  opacity: 0.5;
  animation: drift ease-in-out infinite;
}
.glow-blob--green {
  top: -80px;
  left: -60px;
  width: 320px;
  height: 320px;
  background: #66a459;
  animation-duration: 22s;
}
.glow-blob--gold {
  right: -50px;
  bottom: -90px;
  width: 300px;
  height: 300px;
  background: #d1993f;
  animation-duration: 26s;
  animation-delay: -6s;
}
.glow-blob--green-2 {
  left: 6%;
  bottom: 12%;
  width: 220px;
  height: 220px;
  background: #3b6430;
  animation-duration: 19s;
  animation-delay: -3s;
}
@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(28px, -22px) scale(1.08);
  }
}
@media (prefers-reduced-motion: reduce) {
  .glow-blob {
    animation: none;
  }
}
</style>
