<script setup lang="ts">
const aiDoctorStore = useAiDoctorStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

const threadEl = ref<HTMLElement | null>(null)
const composer = ref<{ focus: () => void } | null>(null)
const previewUrl = ref<string | null>(null)
// فقط وقتی کاربر نزدیک انتهای گفتگوئه، با پیام جدید خودکار پایین می‌ریم
const stickToBottom = ref(true)

const suggestions = [
  { key: 'aiDoctor.suggestions.yellow', icon: 'lucide:leaf' },
  { key: 'aiDoctor.suggestions.spots', icon: 'lucide:circle-dot' },
  { key: 'aiDoctor.suggestions.pests', icon: 'lucide:bug' },
  { key: 'aiDoctor.suggestions.watering', icon: 'lucide:droplets' },
]

const lastLength = computed(() => aiDoctorStore.messages.at(-1)?.content.length ?? 0)
const lastIndex = computed(() => aiDoctorStore.messages.length - 1)

function onScroll() {
  const el = threadEl.value
  if (el) stickToBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 80
}

async function scrollToEnd(smooth = false) {
  await nextTick()
  const el = threadEl.value
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
}

function jumpToEnd() {
  stickToBottom.value = true
  scrollToEnd(true)
}

watch(
  () => [aiDoctorStore.messages.length, lastLength.value, aiDoctorStore.waiting],
  () => {
    if (stickToBottom.value) scrollToEnd()
  },
)

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') previewUrl.value = null
})

function onSend(payload: { text: string, image?: string }) {
  stickToBottom.value = true
  aiDoctorStore.send(payload.text, payload.image, activeLocale.value)
}

function onSuggestion(key: string) {
  stickToBottom.value = true
  aiDoctorStore.send(t(key), undefined, activeLocale.value)
}

function onRegenerate() {
  stickToBottom.value = true
  aiDoctorStore.regenerate(activeLocale.value)
}

function newChat() {
  aiDoctorStore.clear()
  nextTick(() => composer.value?.focus())
}

onMounted(() => {
  scrollToEnd()
  // روی موبایل خودکار فوکوس نمی‌کنیم تا کیبورد یهو باز نشه
  if (window.matchMedia('(pointer: fine)').matches) composer.value?.focus()
})
</script>

<template>
  <div class="mx-auto flex h-[calc(100dvh-12rem)] min-h-[26rem] w-full max-w-3xl flex-col md:h-[calc(100dvh-8.5rem)]">
    <!-- هدر -->
    <header class="flex items-center gap-3 pb-3">
      <div class="min-w-0 flex-1">
        <h1 class="truncate text-base font-bold text-ink sm:text-lg">
          {{ t('aiDoctor.title') }}
        </h1>
        <p class="truncate text-xs text-ink-muted">
          {{ t('aiDoctor.subtitle') }}
        </p>
      </div>
      <button
        v-if="!aiDoctorStore.isEmpty"
        type="button"
        class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3.5 py-2 text-xs font-medium text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
        @click="newChat"
      >
        <Icon
          name="lucide:square-pen"
          class="size-4"
        />
        <span class="max-sm:sr-only">{{ t('aiDoctor.newChat') }}</span>
      </button>
    </header>

    <!-- گفتگو -->
    <div class="relative min-h-0 flex-1">
      <section
        ref="threadEl"
        class="flex h-full flex-col gap-6 overflow-y-auto px-1 pb-6 pt-2"
        :aria-label="t('aiDoctor.title')"
        aria-live="polite"
        @scroll.passive="onScroll"
      >
        <!-- حالت اولیه -->
        <div
          v-if="aiDoctorStore.isEmpty"
          class="m-auto flex w-full max-w-xl flex-col items-center gap-8 py-4 text-center"
        >
          <div class="flex flex-col items-center gap-4">
            <span class="flex size-16 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-white/10">
              <Icon
                name="lucide:leaf"
                class="size-8"
              />
            </span>
            <div>
              <h2 class="text-xl font-bold text-ink sm:text-2xl">
                {{ t('aiDoctor.welcomeTitle') }}
              </h2>
              <p class="mx-auto mt-2 max-w-md text-sm leading-7 text-ink-muted">
                {{ t('aiDoctor.welcomeText') }}
              </p>
            </div>
          </div>
          <div class="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              v-for="item in suggestions"
              :key="item.key"
              type="button"
              class="flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface p-3.5 text-start text-sm leading-6 text-ink transition-colors hover:border-primary-500/40 hover:bg-primary-50"
              @click="onSuggestion(item.key)"
            >
              <Icon
                :name="item.icon"
                class="size-5 shrink-0 text-primary-600"
              />
              <span>{{ t(item.key) }}</span>
            </button>
          </div>
        </div>

        <template v-else>
          <ChatBubble
            v-for="(message, index) in aiDoctorStore.messages"
            :key="message.id"
            :message="message"
            :is-last="index === lastIndex"
            :streaming="aiDoctorStore.revealing && index === lastIndex && message.role === 'assistant'"
            @retry="aiDoctorStore.retry(activeLocale)"
            @regenerate="onRegenerate"
            @feedback="aiDoctorStore.setFeedback(message.id, $event)"
            @preview="previewUrl = $event"
          />

          <!-- در حال فکر کردن -->
          <div
            v-if="aiDoctorStore.waiting"
            class="flex w-full gap-3"
            role="status"
            :aria-label="t('aiDoctor.thinking')"
          >
            <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-white/10">
              <Icon
                name="lucide:stethoscope"
                class="size-4"
              />
            </span>
            <div class="flex items-center gap-1.5 py-3">
              <span
                v-for="i in 3"
                :key="i"
                class="size-2 rounded-full bg-ink-muted motion-safe:animate-bounce"
                :style="{ animationDelay: `${(i - 1) * 150}ms` }"
              />
            </div>
          </div>
        </template>
      </section>

      <!-- رفتن به آخرین پیام -->
      <Transition
        enter-active-class="transition duration-150"
        enter-from-class="translate-y-2 opacity-0"
        leave-active-class="transition duration-150"
        leave-to-class="translate-y-2 opacity-0"
      >
        <button
          v-if="!stickToBottom && !aiDoctorStore.isEmpty"
          type="button"
          class="absolute bottom-3 start-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink shadow-md transition-colors hover:bg-primary-50 rtl:translate-x-1/2"
          :aria-label="t('aiDoctor.scrollDown')"
          :title="t('aiDoctor.scrollDown')"
          @click="jumpToEnd"
        >
          <Icon
            name="lucide:arrow-down"
            class="size-4"
          />
        </button>
      </Transition>
    </div>

    <!-- ورودی -->
    <footer class="flex flex-col gap-2 pt-2">
      <ChatComposer
        ref="composer"
        :busy="aiDoctorStore.busy"
        @send="onSend"
        @stop="aiDoctorStore.stop()"
      />
      <p class="text-center text-[11px] leading-5 text-ink-muted">
        {{ t('aiDoctor.disclaimer') }}
      </p>
    </footer>

    <!-- پیش‌نمایش عکس -->
    <Teleport to="body">
      <div
        v-if="previewUrl"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        role="dialog"
        aria-modal="true"
        @click="previewUrl = null"
      >
        <img
          :src="previewUrl"
          :alt="t('aiDoctor.userImageAlt')"
          class="max-h-full max-w-full rounded-xl object-contain"
        >
        <button
          type="button"
          class="absolute end-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
          :aria-label="t('common.close')"
          @click="previewUrl = null"
        >
          <Icon
            name="lucide:x"
            class="size-5"
          />
        </button>
      </div>
    </Teleport>
  </div>
</template>