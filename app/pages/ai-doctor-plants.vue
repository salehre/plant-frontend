<script setup lang="ts">
definePageMeta({ layout: 'ai-doctor' })

const { t } = useI18n()
const aiDoctorStore = useAiDoctorStore()
const plants = useUserPlantOptions()

// تعداد گفتگوهای وصل‌شده به هر گیاه
const chatCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const conv of aiDoctorStore.conversations) {
    for (const id of conv.plantIds ?? []) counts[id] = (counts[id] ?? 0) + 1
  }
  return counts
})

function chatAbout(id: string) {
  aiDoctorStore.newChat([id])
  navigateTo('/ai-doctor')
}

// برای انیمیشن ورود کارت‌ها به‌صورت متوالی
const cardDelay = (index: number) => `${index * 80}ms`
</script>

<template>
  <div class="plants-page flex h-full min-h-0 flex-col">
    <header
      class="page-header relative z-10 flex shrink-0 items-center gap-3 border-b border-ink/5 bg-surface/90 px-4 py-4 backdrop-blur-xl sm:px-6"
    >
      <NuxtLink
        to="/ai-doctor"
        class="back-button flex size-10 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink-muted hover:border-primary-600/30 hover:text-primary-700"
        :aria-label="t('common.back')"
        :title="t('common.back')"
      >
        <Icon
          name="lucide:arrow-right"
          class="size-5 ltr:rotate-180"
          aria-hidden="true"
        />
      </NuxtLink>

      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <h1 class="truncate text-base font-bold text-ink sm:text-lg">
            {{ t('aiDoctor.myPlants') }}
          </h1>

          <span
            v-if="plants.length"
            class="count-badge inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-50 px-1.5 text-xs font-bold text-primary-700"
          >
            {{ plants.length }}
          </span>
        </div>

        <p class="mt-1 truncate text-xs text-ink-muted">
          {{ t('aiDoctor.myPlantsSubtitle') }}
        </p>
      </div>

      <div
        class="hidden size-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 sm:flex"
        aria-hidden="true"
      >
        <Icon name="lucide:sprout" class="size-5" />
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
      <!-- Empty state -->
      <div
        v-if="!plants.length"
        class="empty-state mx-auto my-10 flex max-w-sm flex-col items-center rounded-3xl border border-dashed border-primary-600/20 bg-surface p-8 text-center sm:my-16"
      >
        <div
          class="relative mb-7 flex size-28 items-center justify-center"
          aria-hidden="true"
        >
          <div class="empty-ring absolute inset-0 rounded-full border border-primary-600/15" />
          <div class="absolute inset-3 rounded-full bg-primary-50/60" />

          <div
            class="floating-plant relative flex size-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-600 shadow-lg shadow-primary-600/10"
          >
            <Icon name="lucide:sprout" class="size-10" />
          </div>

          <span
            class="floating-spark absolute end-0 top-1 flex size-8 items-center justify-center rounded-full border border-primary-600/10 bg-surface text-primary-600 shadow-sm"
          >
            <Icon name="lucide:sparkles" class="size-4" />
          </span>
        </div>

        <p class="text-sm leading-7 text-ink-muted">
          {{ t('aiDoctor.noPlants') }}
        </p>

        <NuxtLink
          to="/my-plants"
          class="action-button mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/15 hover:bg-primary-700"
        >
          <Icon name="lucide:plus" class="size-4" aria-hidden="true" />
          <span>{{ t('pages.myPlants.addPlant') }}</span>
        </NuxtLink>
      </div>

      <!-- Staggered entrance -->
      <ul
        v-else
        class="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <li
          v-for="(plant, index) in plants"
          :key="plant.id"
          class="plant-entry min-w-0"
          :style="{ '--enter-delay': `${Math.min(index, 8) * 70}ms` }"
        >
          <!-- Separate wrapper so hover doesn't conflict with entrance -->
          <div
            class="plant-card relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/5 bg-surface p-4"
          >
            <div
              class="card-glow pointer-events-none absolute -end-10 -top-10 size-36 rounded-full bg-primary-100/50 blur-2xl"
              aria-hidden="true"
            />

            <div class="relative flex items-start gap-3.5">
              <div
                class="plant-photo relative size-20 shrink-0 overflow-hidden rounded-2xl bg-primary-50 ring-1 ring-ink/5"
              >
                <img
                  loading="lazy"
                  decoding="async"
                  :src="plant.photo"
                  alt=""
                  class="size-full object-cover"
                >
              </div>

              <div class="min-w-0 flex-1 py-1">
                <h2 class="plant-name truncate text-sm font-bold text-ink sm:text-base">
                  {{ plant.nickname }}
                </h2>

                <p class="mt-1 truncate text-xs text-ink-muted">
                  {{ plant.species }}
                </p>

                <div class="mt-3 min-h-6">
                  <span
                    v-if="chatCounts[plant.id]"
                    class="chat-badge inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-medium text-primary-700"
                  >
                    <Icon
                      name="lucide:messages-square"
                      class="size-3.5 shrink-0"
                      aria-hidden="true"
                    />

                    <span class="truncate">
                      {{ t('aiDoctor.plantChatsCount', { count: chatCounts[plant.id] }) }}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div class="card-divider my-4 h-px bg-ink/5" />

            <button
              type="button"
              class="action-button plant-action mt-auto flex min-h-11 w-full items-center gap-2 rounded-2xl bg-primary-50 px-4 py-3 text-xs font-semibold text-primary-700"
              :aria-label="`${t('aiDoctor.chatAboutPlant')} — ${plant.nickname}`"
              @click="chatAbout(plant.id)"
            >
              <Icon
                name="lucide:stethoscope"
                class="action-icon size-4 shrink-0"
                aria-hidden="true"
              />

              <span>{{ t('aiDoctor.chatAboutPlant') }}</span>

              <span class="action-arrow ms-auto inline-flex" aria-hidden="true">
                <Icon
                  name="lucide:arrow-left"
                  class="size-4 ltr:rotate-180"
                />
              </span>
            </button>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
.plants-page {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ورود صفحه */
.page-header {
  animation: header-enter 550ms var(--ease-out) both;
}

.count-badge {
  animation: badge-enter 550ms var(--ease-spring) 180ms both;
}

.plant-entry {
  animation: card-enter 650ms var(--ease-out) both;
  animation-delay: var(--enter-delay, 0ms);
}

.empty-state {
  animation: card-enter 750ms var(--ease-out) both;
}

/* کارت‌ها */
.plant-card {
  box-shadow: 0 3px 12px -6px rgb(0 0 0 / 8%);
  transition:
    transform 420ms var(--ease-out),
    border-color 300ms ease,
    box-shadow 420ms ease;
}

.card-glow {
  opacity: 0.25;
  transform: scale(0.8);
  transition:
    opacity 500ms ease,
    transform 650ms var(--ease-out);
}

.plant-photo {
  transition: box-shadow 400ms ease;
}

.plant-photo img {
  transition: transform 750ms var(--ease-out);
}

.plant-name {
  transition: color 250ms ease;
}

.chat-badge {
  transition: transform 400ms var(--ease-spring);
}

.card-divider {
  transform-origin: center;
  transition:
    transform 450ms var(--ease-out),
    background-color 300ms ease;
}

/* دکمه‌ها */
.back-button {
  transition:
    transform 300ms var(--ease-spring),
    border-color 250ms ease,
    color 250ms ease,
    background-color 250ms ease;
}

.action-button {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  transition:
    transform 250ms var(--ease-spring),
    background-color 250ms ease,
    color 250ms ease,
    box-shadow 300ms ease;
}

/* برق ملایم روی دکمه */
.action-button::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    110deg,
    transparent 25%,
    rgb(255 255 255 / 30%) 48%,
    transparent 72%
  );
  transform: translateX(-150%);
}

.action-icon {
  transition: transform 400ms var(--ease-spring);
}

.action-arrow {
  transition: transform 350ms var(--ease-out);
}

.back-button:active,
.action-button:active {
  transform: scale(0.96);
}

.back-button:focus-visible,
.action-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}

.plant-card:focus-within {
  border-color: rgb(22 163 74 / 35%);
  box-shadow: 0 10px 28px -14px rgb(22 101 52 / 20%);
}

/* Hover فقط روی دستگاه‌هایی که واقعاً هاور دارند */
@media (hover: hover) and (pointer: fine) {
  .back-button:hover {
    transform: translateY(-2px);
  }

  .plant-card:hover {
    transform: translateY(-7px);
    border-color: rgb(22 163 74 / 25%);
    box-shadow:
      0 18px 36px -20px rgb(22 101 52 / 28%),
      0 6px 14px -8px rgb(0 0 0 / 10%);
  }

  .plant-card:hover .card-glow {
    opacity: 0.85;
    transform: scale(1.3);
  }

  .plant-card:hover .plant-photo img {
    transform: scale(1.09) rotate(-2deg);
  }

  .plant-card:hover .chat-badge {
    transform: translateY(-2px);
  }

  .plant-card:hover .card-divider {
    transform: scaleX(0.94);
    background-color: rgb(22 163 74 / 15%);
  }

  .action-button:hover::after {
    animation: button-shine 750ms var(--ease-out);
  }

  .plant-action:hover .action-icon {
    transform: rotate(-12deg) scale(1.12);
  }

  .plant-action:hover .action-arrow {
    transform: translateX(-4px);
  }

  .plant-action:dir(ltr):hover .action-arrow {
    transform: translateX(4px);
  }
}

/* انیمیشن کوتاه و آرام برای حالت خالی */
.floating-plant {
  animation: gentle-float 4s ease-in-out 3;
}

.floating-spark {
  animation: gentle-float 3s ease-in-out 300ms 4;
}

.empty-ring {
  animation: ring-breathe 4s ease-in-out 3;
}

@keyframes header-enter {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(22px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes badge-enter {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes button-shine {
  from {
    transform: translateX(-150%);
  }
  to {
    transform: translateX(150%);
  }
}

@keyframes gentle-float {
  0%, 100% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(-8px) rotate(3deg);
  }
}

@keyframes ring-breathe {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.94);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.06);
  }
}

/* احترام به تنظیمات دسترس‌پذیری کاربر */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }

  .plant-card,
  .plant-photo img,
  .chat-badge,
  .card-divider,
  .back-button,
  .action-button,
  .action-icon,
  .action-arrow {
    transform: none !important;
  }

  .action-button::after {
    display: none;
  }
}
</style>