<script setup>
const props = defineProps({
  error: Object,
})
const { t } = useI18n()

const statusCode = props.error?.statusCode || 404
const spinPool = [
  ['4', '8', 'K', '2'],
  ['0', '3', 'X', '7'],
  ['4', '9', 'A', '1'],
]

const flapDigits = computed(() => String(statusCode).padStart(3, '0').split(''))

const flapStrips = computed(() =>
  flapDigits.value.map((digit, i) => [...spinPool[i], digit]),
)

const errorMessage = computed(() =>
  props.error?.statusMessage || props.error?.message || t('errors.unknown'),
)

const router = useRouter()

function goHome() {
  clearError({ redirect: '/' })
}

function refreshPage() {
  clearError()
  location.reload()
}

function goBack() {
  clearError()
  router.back()
}
</script>

<template>
  <div class="hero-leaves relative flex min-h-screen items-center overflow-hidden px-4 py-10">
    <div class="relative z-10 mx-auto w-full max-w-5xl">
      <LiquidGlassPanel>
        <div class="flex flex-col gap-8 p-6 sm:p-10">
          <!-- نوار بالا -->
          <div class="flex items-center gap-3 text-white/90">
            <Icon
              name="lucide:leaf"
              class="size-5 text-accent-300"
            />
            <span class="text-sm">{{ t('brand.name') }}</span>
          </div>

          <div class="grid grid-cols-1 items-center gap-8 sm:grid-cols-[220px_1fr]">
            <div
              class="flap-404"
              role="img"
              :aria-label="t('errors.animation', { status: statusCode, digits: flapDigits.join('') })"
            >
              <div class="flap-row">
                <span
                  v-for="(strip, i) in flapStrips"
                  :key="i"
                  class="flap-tile"
                >
                  <span
                    class="flap-strip"
                    :class="`flap-strip-${i}`"
                  >
                    <span
                      v-for="(char, j) in strip"
                      :key="j"
                      class="flap-char"
                    >{{ char }}</span>
                  </span>
                </span>
              </div>
            </div>

            <div>
              <h1 class="mb-6 text-3xl font-extrabold leading-tight text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.35)] sm:text-5xl">
                {{ t('errors.pathLost') }}
              </h1>

              <div class="max-w-md border-t border-white/25 pt-4">
                <h2 class="mb-3 text-lg font-semibold text-white sm:text-xl">
                  {{ t('errors.unavailable') }}
                </h2>
                <p class="text-sm leading-7 text-white/80">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5">
            <span class="text-sm text-white/90">{{ t('errors.returnTo') }}</span>
            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2 text-sm text-white transition-colors hover:bg-white/10"
                @click="goHome"
              >
                {{ t('errors.home') }}
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2 text-sm text-white transition-colors hover:bg-white/10"
                @click="refreshPage"
              >
                {{ t('errors.retry') }}
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2 text-sm text-white transition-colors hover:bg-white/10"
                @click="goBack"
              >
                {{ t('errors.previousPage') }}
              </button>
            </div>
          </div>
        </div>
      </LiquidGlassPanel>
    </div>
  </div>
</template>

<style scoped>
.hero-leaves {
  min-height: 100vh;
  background:
      radial-gradient(90% 70% at 50% 18%, #3a6b48 0%, #2a4f38 35%, transparent 65%),
      radial-gradient(140% 140% at 50% 50%, transparent 20%, #0d1f14 100%),#1e3d2a;
}

.flap-404 {
  --fl-accent: #f4f8ef;
  --fl-line: rgba(255, 255, 255, 0.22);
  display: grid;
  place-items: center;
  font-family: inherit;
}

.flap-row {
  display: flex;
  gap: 8px;
}
.flap-tile {
  position: relative;
  isolation: isolate;
  width: 44px;
  height: 58px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--fl-line);
  border-radius: var(--radius-control);
}
.flap-tile::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: rgba(255, 255, 255, 0.16);
  z-index: 1;
}
.flap-strip {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}
.flap-char {
  display: block;
  width: 100%;
  height: 58px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  line-height: 58px;
  color: var(--fl-accent);
}
.flap-strip-0 { animation: flap-roll 7s cubic-bezier(.65,0,.35,1) infinite; }
.flap-strip-1 { animation: flap-roll-b 7s cubic-bezier(.65,0,.35,1) infinite; }
.flap-strip-2 { animation: flap-roll-c 7s cubic-bezier(.65,0,.35,1) infinite; }
@keyframes flap-roll {
  0%, 6%    { transform: translateY(0); }
  30%, 100% { transform: translateY(-232px); }
}
@keyframes flap-roll-b {
  0%, 12%   { transform: translateY(0); }
  38%, 100% { transform: translateY(-232px); }
}
@keyframes flap-roll-c {
  0%, 18%   { transform: translateY(0); }
  46%, 100% { transform: translateY(-232px); }
}
@media (prefers-reduced-motion: reduce) {
  .flap-404 .flap-strip { animation: none; }
  .flap-404 .flap-strip { transform: translateY(-232px); }
}
</style>
