<script setup lang="ts">
import type { ChatSuggestion } from '~/components/ai-doctor/ChatSuggestions.vue'

definePageMeta({ layout: 'ai-doctor' })

const aiDoctorStore = useAiDoctorStore()
const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')

const conversation = ref<{ pin: (smooth?: boolean) => void } | null>(null)
const promptInput = ref<{ focus: () => void } | null>(null)
const previewUrl = ref<string | null>(null)
// سایدبار تاریخچه روی موبایل/تبلت به‌صورت کشو باز می‌شه (روی دسکتاپ همیشه کناره)
const historyOpen = ref(false)

const suggestions = computed<ChatSuggestion[]>(() => [
  { id: 'yellow', icon: 'lucide:leaf', label: t('aiDoctor.suggestions.yellow') },
  { id: 'spots', icon: 'lucide:circle-dot', label: t('aiDoctor.suggestions.spots') },
  { id: 'pests', icon: 'lucide:bug', label: t('aiDoctor.suggestions.pests') },
  { id: 'watering', icon: 'lucide:droplets', label: t('aiDoctor.suggestions.watering') },
])

const lastIndex = computed(() => aiDoctorStore.messages.length - 1)

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  if (previewUrl.value) previewUrl.value = null
  else historyOpen.value = false
})

// با عوض شدن گفتگو، پایین‌ترین پیام رو نشون بده
watch(() => aiDoctorStore.activeId, () => conversation.value?.pin())

function onSubmit(payload: { text: string, image?: string }) {
  conversation.value?.pin()
  aiDoctorStore.send(payload.text, payload.image, activeLocale.value)
}

function onSuggestion(item: ChatSuggestion) {
  conversation.value?.pin()
  aiDoctorStore.send(item.label, undefined, activeLocale.value)
}

function onRegenerate() {
  conversation.value?.pin()
  aiDoctorStore.regenerate(activeLocale.value)
}

function newChat() {
  aiDoctorStore.newChat()
  historyOpen.value = false
  nextTick(() => promptInput.value?.focus())
}

function selectChat(id: string) {
  aiDoctorStore.select(id)
  historyOpen.value = false
}

onMounted(() => {
  // روی موبایل خودکار فوکوس نمی‌کنیم تا کیبورد یهو باز نشه
  if (window.matchMedia('(pointer: fine)').matches) promptInput.value?.focus()
})
</script>

<template>
  <div class="flex h-dvh w-full">
    <!-- سایدبار AI (دسکتاپ): جای سایدبار اصلی رو می‌گیره -->
    <aside class="hidden w-72 shrink-0 flex-col gap-3 border-e border-ink/5 bg-surface p-3 lg:flex">
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-primary-50"
        :title="t('common.back')"
      >
        <span class="flex size-9 items-center justify-center rounded-xl bg-primary-700 text-white">
          <Icon
            name="lucide:leaf"
            class="size-5"
          />
        </span>
        <span class="min-w-0 flex-1 truncate text-base font-extrabold text-primary-800">{{ t('brand.name') }}</span>
      </NuxtLink>
      <div class="min-h-0 flex-1">
        <ChatHistorySidebar
          :conversations="aiDoctorStore.sorted"
          :active-id="aiDoctorStore.activeId"
          @new="newChat"
          @select="selectChat"
          @rename="aiDoctorStore.rename"
          @remove="aiDoctorStore.remove"
        />
      </div>
    </aside>

    <!-- سایدبار تاریخچه (کشو برای موبایل و تبلت) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-150"
        leave-to-class="opacity-0"
      >
        <div
          v-if="historyOpen"
          class="fixed inset-0 z-50 bg-ink/40 lg:hidden"
          @click.self="historyOpen = false"
        >
          <aside
            class="absolute inset-y-0 start-0 flex w-[19rem] max-w-[85vw] flex-col gap-3 bg-surface p-3 shadow-xl"
            role="dialog"
            aria-modal="true"
            :aria-label="t('aiDoctor.history')"
          >
            <div class="flex items-center justify-between px-1">
              <h2 class="text-sm font-bold text-ink">
                {{ t('aiDoctor.history') }}
              </h2>
              <button
                type="button"
                class="flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
                :aria-label="t('aiDoctor.closeHistory')"
                @click="historyOpen = false"
              >
                <Icon
                  name="lucide:x"
                  class="size-5"
                />
              </button>
            </div>
            <div class="min-h-0 flex-1">
              <ChatHistorySidebar
                :conversations="aiDoctorStore.sorted"
                :active-id="aiDoctorStore.activeId"
                @new="newChat"
                @select="selectChat"
                @rename="aiDoctorStore.rename"
                @remove="aiDoctorStore.remove"
              />
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>

    <!-- ستون چت -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- هدر -->
      <header class="flex items-center gap-2 px-3 py-2.5 sm:px-4">
        <NuxtLink
          to="/"
          class="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700 lg:hidden"
          :aria-label="t('common.back')"
          :title="t('common.back')"
        >
          <Icon
            name="lucide:arrow-right"
            class="size-5 ltr:rotate-180"
          />
        </NuxtLink>
        <button
          type="button"
          class="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700 lg:hidden"
          :aria-label="t('aiDoctor.openHistory')"
          :title="t('aiDoctor.openHistory')"
          @click="historyOpen = true"
        >
          <Icon
            name="lucide:history"
            class="size-5"
          />
        </button>
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
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3.5 py-2 text-xs font-medium text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700 lg:hidden"
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
      <ChatConversation
        ref="conversation"
        :empty="aiDoctorStore.isEmpty"
        :label="t('aiDoctor.title')"
      >
        <template #empty>
          <div class="m-auto flex w-full max-w-xl flex-col items-center gap-8 py-4 text-center">
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
            <ChatSuggestions
              :items="suggestions"
              @select="onSuggestion"
            />
          </div>
        </template>

        <ChatMessageItem
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
        >
          <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-white/10">
            <Icon
              name="lucide:stethoscope"
              class="size-4"
            />
          </span>
          <ChatLoader :label="t('aiDoctor.thinking')" />
        </div>
      </ChatConversation>

      <!-- ورودی -->
      <footer class="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 pb-3 pt-2">
        <ChatPromptInput
          ref="promptInput"
          :streaming="aiDoctorStore.busy"
          @submit="onSubmit"
          @stop="aiDoctorStore.stop()"
        />
        <p class="text-center text-[11px] leading-5 text-ink-muted">
          {{ t('aiDoctor.disclaimer') }}
        </p>
      </footer>
    </div>

    <!-- پیش‌نمایش عکس -->
    <Teleport to="body">
      <div
        v-if="previewUrl"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
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