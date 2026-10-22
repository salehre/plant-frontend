<script setup lang="ts">
import type { ChatConversation } from '~/types/ai-doctor.types'

/** دیالوگ جستجو بین گفتگوها (عنوان + متن پیام‌ها)؛ بدون متن، گفتگوهای اخیر رو نشون می‌ده */
const props = defineProps<{
  /** جدیدترین اول */
  conversations: ChatConversation[]
}>()
const emit = defineEmits<{ select: [id: string] }>()
const open = defineModel<boolean>({ default: false })

const { t } = useI18n()

const MAX_RECENT = 8
const SNIPPET_LENGTH = 70

const query = ref('')
const active = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)
const listEl = ref<HTMLElement | null>(null)

// ي/ك عربی رو با ی/ک فارسی یکی می‌گیره (طول متن عوض نمی‌شه)
const normalize = (s: string) => s.toLowerCase().replace(/ي/g, 'ی').replace(/ك/g, 'ک')

interface Result {
  conv: ChatConversation
  snippet: string
}

const results = computed<Result[]>(() => {
  const q = normalize(query.value.trim())
  if (!q) return props.conversations.slice(0, MAX_RECENT).map(conv => ({ conv, snippet: '' }))

  const found: Result[] = []
  for (const conv of props.conversations) {
    if (normalize(conv.title || t('aiDoctor.untitled')).includes(q)) {
      found.push({ conv, snippet: '' })
      continue
    }
    for (const message of conv.messages) {
      const index = normalize(message.content).indexOf(q)
      if (index === -1) continue
      const start = Math.max(0, index - 20)
      const text = message.content.slice(start, start + SNIPPET_LENGTH).replace(/\s+/g, ' ')
      found.push({ conv, snippet: `${start > 0 ? '…' : ''}${text}` })
      break
    }
  }
  return found
})

watch(open, (value) => {
  if (!value) return
  query.value = ''
  active.value = 0
  nextTick(() => inputEl.value?.focus())
})
watch(results, () => { active.value = 0 })
watch(active, () => {
  nextTick(() => listEl.value?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' }))
})

function close() {
  open.value = false
}

function choose(id: string) {
  close()
  emit('select', id)
}

function move(step: 1 | -1) {
  const count = results.value.length
  if (count) active.value = (active.value + step + count) % count
}

function onEnter(e: KeyboardEvent) {
  // وسط تایپ با IME (کیبورد فارسی/ژاپنی...) کاری نکن
  if (e.isComposing) return
  const result = results.value[active.value]
  if (result) choose(result.conv.id)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[70] flex items-start justify-center bg-ink/40 p-4 pt-[32vh]"
        @click.self="close"
        @keydown.esc.stop="close"
      >
        <div
          role="dialog"
          aria-modal="true"
          :aria-label="t('aiDoctor.search')"
          class="flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-xl"
        >
          <div class="flex items-center gap-2 border-b border-ink/5 px-4">
            <Icon
              name="lucide:search"
              class="size-4 shrink-0 text-ink-muted"
            />
            <input
              ref="inputEl"
              v-model="query"
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="chat-search-list"
              :aria-activedescendant="results[active] ? `chat-search-${results[active].conv.id}` : undefined"
              autocomplete="off"
              :placeholder="t('aiDoctor.searchChats')"
              :aria-label="t('aiDoctor.searchChats')"
              class="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-ink outline-none placeholder:text-ink-muted"
              @keydown.down.prevent="move(1)"
              @keydown.up.prevent="move(-1)"
              @keydown.enter.prevent="onEnter"
            >
            <button
              type="button"
              class="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
              :aria-label="t('common.close')"
              :title="t('common.close')"
              @click="close"
            >
              <Icon
                name="lucide:x"
                class="size-4"
              />
            </button>
          </div>

          <ul
            id="chat-search-list"
            ref="listEl"
            role="listbox"
            class="min-h-0 flex-1 overflow-y-auto p-2"
          >
            <li
              v-if="!query.trim() && results.length"
              class="px-3 pb-1 pt-1 text-[11px] font-bold text-ink-muted"
            >
              {{ t('aiDoctor.recentChats') }}
            </li>
            <li
              v-for="(result, index) in results"
              :id="`chat-search-${result.conv.id}`"
              :key="result.conv.id"
              role="option"
              :aria-selected="index === active"
              :data-active="index === active"
            >
              <button
                type="button"
                class="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-start transition-colors"
                :class="index === active ? 'bg-primary-50 text-primary-700' : 'text-ink hover:bg-ink/[0.05]'"
                @mousemove="active = index"
                @click="choose(result.conv.id)"
              >
                <Icon
                  :name="result.conv.pinned ? 'lucide:pin' : 'lucide:message-square'"
                  class="mt-0.5 size-4 shrink-0 text-ink-muted"
                />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-medium">
                    {{ result.conv.title || t('aiDoctor.untitled') }}
                  </span>
                  <span
                    v-if="result.snippet"
                    class="mt-0.5 block truncate text-xs text-ink-muted"
                  >
                    {{ result.snippet }}
                  </span>
                </span>
              </button>
            </li>
            <li
              v-if="!results.length"
              class="px-3 py-8 text-center text-xs leading-6 text-ink-muted"
            >
              {{ conversations.length ? t('aiDoctor.noResults') : t('aiDoctor.noChats') }}
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>