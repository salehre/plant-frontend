<script setup lang="ts">
import type { ChatFeedback, ChatMessage } from '~/types/ai-doctor.types'

const props = defineProps<{
  message: ChatMessage
  /** این جواب همین الان داره کلمه‌به‌کلمه نوشته می‌شه */
  streaming?: boolean
  /** آخرین پیام گفتگوئه (فقط روی آخرین جواب «تولید دوباره» نشون داده می‌شه) */
  isLast?: boolean
}>()
const emit = defineEmits<{
  retry: []
  preview: [string]
  regenerate: []
  feedback: [ChatFeedback]
}>()

type Block
  = | { type: 'p', text: string }
    | { type: 'h', text: string }
    | { type: 'ul' | 'ol', items: string[] }

interface Part { text: string, bold?: boolean, code?: boolean }

// رندر ساده و امن‌ی Markdown (بدون v-html): عنوان «# »، پاراگراف، لیست «- » و «۱. »، **بولد** و `کد`
const blocks = computed<Block[]>(() => {
  const result: Block[] = []
  for (const raw of props.message.content.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    const heading = line.match(/^#{1,4}\s+(.*)$/)
    if (heading) {
      result.push({ type: 'h', text: heading[1] ?? '' })
      continue
    }
    const ul = line.match(/^[-•*]\s+(.*)$/)
    const ol = line.match(/^(?:\d+|[۰-۹]+)[.)]\s+(.*)$/)
    const kind = ul ? 'ul' : ol ? 'ol' : null
    const text = (ul ?? ol)?.[1] ?? line
    const last = result.at(-1)
    if (kind && last?.type === kind) last.items.push(text)
    else if (kind) result.push({ type: kind, items: [text] })
    else result.push({ type: 'p', text })
  }
  return result
})

// تکه‌های یک خط: **بولد**، `کد` و متن عادی؛ ** یا ` نیمه‌کاره‌ی وسط نمایش تدریجی پاک می‌شه
function parts(text: string): Part[] {
  return text
    .split(/(\*\*.+?\*\*|`[^`]+`)/g)
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.length > 4 && chunk.startsWith('**') && chunk.endsWith('**')) return { text: chunk.slice(2, -2), bold: true }
      if (chunk.length > 2 && chunk.startsWith('`') && chunk.endsWith('`')) return { text: chunk.slice(1, -1), code: true }
      return { text: chunk.replace(/\*\*/g, '').replace(/`/g, '') }
    })
}

const isUser = computed(() => props.message.role === 'user')
const hasActions = computed(() => !isUser.value && !props.message.failed && !props.streaming && !!props.message.content)

const { copy, copied } = useClipboard({ copiedDuring: 1500, legacy: true })

const actionClass = 'flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink focus-visible:outline-2 focus-visible:outline-primary-500'
</script>

<template>
  <!-- پیام کاربر: حباب ملایم، همیشه سمت راست (مثل ChatGPT و Claude) -->
  <article
    v-if="isUser"
    class="flex max-w-[85%] flex-col gap-2 rounded-3xl bg-ink/[0.06] px-4 py-2.5 text-ink ltr:self-end rtl:self-start sm:max-w-[75%]"
  >
    <button
      v-if="message.image"
      type="button"
      class="block overflow-hidden rounded-2xl"
      @click="emit('preview', message.image)"
    >
      <img
        loading="lazy"
        decoding="async"
        :src="message.image"
        :alt="$t('aiDoctor.userImageAlt')"
        class="max-h-56 w-full object-cover"
      >
    </button>
    <p
      v-if="message.content"
      class="whitespace-pre-wrap break-words text-[15px] leading-7"
      dir="auto"
    >
      {{ message.content }}
    </p>
  </article>

  <!-- پیام دکتر گیاه: بدون حباب، تمام‌عرض، با آواتار کنارش -->
  <article
    v-else
    class="flex w-full gap-3"
  >
    <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-white/10">
      <Icon
        name="lucide:stethoscope"
        class="size-4"
      />
    </span>

    <div class="flex min-w-0 flex-1 flex-col gap-2.5 text-ink">
      <!-- خطا در دریافت جواب -->
      <div
        v-if="message.failed"
        class="flex flex-col items-start gap-2"
      >
        <p class="text-sm leading-7 text-status-danger">
          {{ $t('aiDoctor.error') }}
        </p>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full border border-primary-500/40 px-3 py-1.5 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-50"
          @click="emit('retry')"
        >
          <Icon
            name="lucide:rotate-ccw"
            class="size-3.5"
          />
          {{ $t('aiDoctor.retry') }}
        </button>
      </div>

      <template v-else>
        <template
          v-for="(block, index) in blocks"
          :key="index"
        >
          <h3
            v-if="block.type === 'h'"
            class="mt-1 text-base font-bold leading-8"
            dir="auto"
          >
            <template
              v-for="(part, i) in parts(block.text)"
              :key="i"
            >{{ part.text }}</template>
          </h3>
          <p
            v-else-if="block.type === 'p'"
            class="break-words text-[15px] leading-8"
            dir="auto"
          >
            <template
              v-for="(part, i) in parts(block.text)"
              :key="i"
            >
              <strong v-if="part.bold">{{ part.text }}</strong>
              <code
                v-else-if="part.code"
                class="rounded-md bg-ink/[0.07] px-1.5 py-0.5 font-mono text-[13px]"
              >{{ part.text }}</code>
              <template v-else>{{ part.text }}</template>
            </template>
          </p>
          <component
            :is="block.type"
            v-else
            class="flex flex-col gap-1.5 ps-6 text-[15px] leading-8 marker:text-primary-600"
            :class="block.type === 'ul' ? 'list-disc' : 'list-decimal'"
          >
            <li
              v-for="(item, itemIndex) in block.items"
              :key="itemIndex"
              class="break-words"
              dir="auto"
            >
              <template
                v-for="(part, i) in parts(item)"
                :key="i"
              >
                <strong v-if="part.bold">{{ part.text }}</strong>
                <code
                  v-else-if="part.code"
                  class="rounded-md bg-ink/[0.07] px-1.5 py-0.5 font-mono text-[13px]"
                >{{ part.text }}</code>
                <template v-else>{{ part.text }}</template>
              </template>
            </li>
          </component>
        </template>

        <!-- نشانگر نوشته‌شدن -->
        <span
          v-if="streaming"
          class="inline-block size-2.5 rounded-full bg-ink/70 motion-safe:animate-pulse"
          aria-hidden="true"
        />

        <!-- دکمه‌های زیر جواب: کپی، پسندیدن، نپسندیدن، تولید دوباره -->
        <div
          v-if="hasActions"
          class="-ms-2 flex items-center gap-0.5"
        >
          <button
            type="button"
            :class="actionClass"
            :aria-label="copied ? $t('aiDoctor.copied') : $t('aiDoctor.copy')"
            :title="copied ? $t('aiDoctor.copied') : $t('aiDoctor.copy')"
            @click="copy(message.content)"
          >
            <Icon
              :name="copied ? 'lucide:check' : 'lucide:copy'"
              class="size-4"
              :class="copied ? 'text-primary-600' : ''"
            />
          </button>
          <button
            type="button"
            :class="actionClass"
            :aria-pressed="message.feedback === 'up'"
            :aria-label="$t('aiDoctor.goodReply')"
            :title="$t('aiDoctor.goodReply')"
            @click="emit('feedback', 'up')"
          >
            <Icon
              name="lucide:thumbs-up"
              class="size-4"
              :class="message.feedback === 'up' ? 'fill-primary-600/20 text-primary-600' : ''"
            />
          </button>
          <button
            type="button"
            :class="actionClass"
            :aria-pressed="message.feedback === 'down'"
            :aria-label="$t('aiDoctor.badReply')"
            :title="$t('aiDoctor.badReply')"
            @click="emit('feedback', 'down')"
          >
            <Icon
              name="lucide:thumbs-down"
              class="size-4"
              :class="message.feedback === 'down' ? 'fill-status-danger/20 text-status-danger' : ''"
            />
          </button>
          <button
            v-if="isLast"
            type="button"
            :class="actionClass"
            :aria-label="$t('aiDoctor.regenerate')"
            :title="$t('aiDoctor.regenerate')"
            @click="emit('regenerate')"
          >
            <Icon
              name="lucide:refresh-cw"
              class="size-4"
            />
          </button>
        </div>
      </template>
    </div>
  </article>
</template>