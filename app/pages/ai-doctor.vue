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
  'aiDoctor.suggestions.yellow',
  'aiDoctor.suggestions.spots',
  'aiDoctor.suggestions.pests',
  'aiDoctor.suggestions.watering',
]

const lastLength = computed(() => aiDoctorStore.messages.at(-1)?.content.length ?? 0)

function onScroll() {
  const el = threadEl.value
  if (el) stickToBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 80
}

async function scrollToEnd() {
  await nextTick()
  const el = threadEl.value
  if (el) el.scrollTop = el.scrollHeight
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

function newChat() {
  aiDoctorStore.clear()
  nextTick(() => composer.value?.focus())
}

onMounted(scrollToEnd)
</script>

<template>
  <div class="glass-card mx-auto flex h-[calc(100dvh-12rem)] min-h-[26rem] w-full max-w-3xl flex-col overflow-hidden md:h-[calc(100dvh-8.5rem)]">
    <!-- هدر -->
    <header class="flex items-center gap-3 border-b border-ink/10 p-3 sm:p-4">
      <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
        <Icon
          name="lucide:stethoscope"
          class="size-6"
        />
      </span>
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
        class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
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
    <section
      ref="threadEl"
      class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-ink/[0.03] p-4 sm:p-5"
      :aria-label="t('aiDoctor.title')"
      aria-live="polite"
      @scroll.passive="onScroll"
    >
      <!-- حالت اولیه -->
      <div
        v-if="aiDoctorStore.isEmpty"
        class="m-auto flex w-full max-w-md flex-col items-center gap-5 py-4 text-center"
      >
        <span class="flex size-16 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          <Icon
            name="lucide:leaf"
            class="size-8"
          />
        </span>
        <div>
          <h2 class="text-lg font-bold text-ink">
            {{ t('aiDoctor.welcomeTitle') }}
          </h2>
          <p class="mt-2 text-sm leading-7 text-ink-muted">
            {{ t('aiDoctor.welcomeText') }}
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="key in suggestions"
            :key="key"
            type="button"
            class="chip"
            @click="onSuggestion(key)"
          >
            {{ t(key) }}
          </button>
        </div>
      </div>

      <template v-else>
        <ChatBubble
          v-for="message in aiDoctorStore.messages"
          :key="message.id"
          :message="message"
          @retry="aiDoctorStore.retry(activeLocale)"
          @preview="previewUrl = $event"
        />

        <!-- در حال نوشتن -->
        <div
          v-if="aiDoctorStore.waiting"
          class="flex w-fit items-center gap-1.5 self-end rounded-2xl rounded-se-sm border border-ink/10 bg-white/60 px-4 py-3.5 dark:bg-white/10"
          role="status"
          :aria-label="t('aiDoctor.thinking')"
        >
          <span
            v-for="i in 3"
            :key="i"
            class="size-2 rounded-full bg-primary-500 motion-safe:animate-bounce"
            :style="{ animationDelay: `${(i - 1) * 150}ms` }"
          />
        </div>
      </template>
    </section>

    <!-- ورودی -->
    <footer class="flex flex-col gap-2 border-t border-ink/10 p-3 sm:p-4">
      <ChatComposer
        ref="composer"
        :disabled="aiDoctorStore.busy"
        @send="onSend"
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
