<script setup lang="ts">
import type { ChatMessage } from '~/types/ai-doctor.types'

const props = defineProps<{ message: ChatMessage }>()
const emit = defineEmits<{ retry: [], preview: [string] }>()

type Block
  = | { type: 'p', text: string }
    | { type: 'ul' | 'ol', items: string[] }

// رندر ساده و امن‌ی Markdown (بدون v-html): پاراگراف، لیست «- » و «۱. »، و **بولد**
const blocks = computed<Block[]>(() => {
  const result: Block[] = []
  for (const raw of props.message.content.split('\n')) {
    const line = raw.trim()
    if (!line) continue
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

// تکه‌های یک خط: زوج‌ها متن عادی، فردها بولد؛ ** نیمه‌کاره‌ی وسط نمایش تدریجی پاک می‌شه
function parts(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) => ({
    text: part.replace(/\*\*/g, ''),
    bold: index % 2 === 1,
  }))
}

const isUser = computed(() => props.message.role === 'user')
</script>

<template>
  <article
    class="flex max-w-[90%] flex-col gap-2 rounded-2xl px-4 py-3 shadow-sm sm:max-w-[80%]"
    :class="isUser
      ? 'self-start rounded-ss-sm bg-primary-600 text-white'
      : 'self-end rounded-se-sm border border-ink/10 bg-white/60 text-ink dark:bg-white/10'"
  >
    <span
      v-if="!isUser"
      class="flex items-center gap-1.5 text-xs font-medium text-primary-700"
    >
      <Icon
        name="lucide:stethoscope"
        class="size-3.5"
      />
      {{ $t('aiDoctor.title') }}
    </span>

    <button
      v-if="message.image"
      type="button"
      class="block overflow-hidden rounded-xl"
      @click="emit('preview', message.image)"
    >
      <img
        :src="message.image"
        :alt="$t('aiDoctor.userImageAlt')"
        class="max-h-56 w-full object-cover"
      >
    </button>

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
        <p
          v-if="block.type === 'p'"
          class="text-sm leading-7"
          dir="auto"
        >
          <template
            v-for="(part, i) in parts(block.text)"
            :key="i"
          >
            <strong v-if="part.bold">{{ part.text }}</strong>
            <template v-else>{{ part.text }}</template>
          </template>
        </p>
        <component
          :is="block.type"
          v-else
          class="flex flex-col gap-1.5 ps-5 text-sm leading-7"
          :class="block.type === 'ul' ? 'list-disc' : 'list-decimal'"
        >
          <li
            v-for="(item, itemIndex) in block.items"
            :key="itemIndex"
            dir="auto"
          >
            <template
              v-for="(part, i) in parts(item)"
              :key="i"
            >
              <strong v-if="part.bold">{{ part.text }}</strong>
              <template v-else>{{ part.text }}</template>
            </template>
          </li>
        </component>
      </template>
    </template>
  </article>
</template>
