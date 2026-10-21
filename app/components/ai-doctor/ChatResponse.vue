<script setup lang="ts">
/**
 * معادل Response در localmode.ai: رندر Markdown ساده و امن (بدون v-html) با نشانگر نوشته‌شدن.
 * پشتیبانی: عنوان «# »، پاراگراف، لیست «- » و «۱. »، **بولد** و `کد`.
 * Markdown نیمه‌کاره‌ی وسط استریم (مثل ** باز) خرابی نمی‌سازه.
 */
const props = defineProps<{
  content: string
  /** هنوز داره جواب می‌رسه: نشانگر چشمک‌زن آخر متن نشون داده می‌شه */
  streaming?: boolean
}>()

type Block
  = | { type: 'p' | 'h', text: string }
    | { type: 'ul' | 'ol', items: string[] }

interface Part { text: string, bold?: boolean, code?: boolean }

const blocks = computed<Block[]>(() => {
  const result: Block[] = []
  for (const raw of props.content.split('\n')) {
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

const lastIndex = computed(() => blocks.value.length - 1)
</script>

<template>
  <div class="flex min-w-0 flex-col gap-2.5 text-ink">
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
        >{{ part.text }}</template><span
          v-if="streaming && index === lastIndex"
          class="chat-cursor"
          aria-hidden="true"
        />
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
        </template><span
          v-if="streaming && index === lastIndex"
          class="chat-cursor"
          aria-hidden="true"
        />
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
          </template><span
            v-if="streaming && index === lastIndex && itemIndex === block.items.length - 1"
            class="chat-cursor"
            aria-hidden="true"
          />
        </li>
      </component>
    </template>

    <!-- هنوز هیچ متنی نیومده -->
    <span
      v-if="streaming && !blocks.length"
      class="chat-cursor"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.chat-cursor {
  display: inline-block;
  width: 0.625rem;
  height: 0.625rem;
  margin-inline-start: 0.25rem;
  border-radius: 9999px;
  background-color: rgb(var(--color-ink) / 0.7);
  vertical-align: middle;
}
@media (prefers-reduced-motion: no-preference) {
  .chat-cursor {
    animation: chat-cursor-blink 1s ease-in-out infinite;
  }
}
@keyframes chat-cursor-blink {
  50% { opacity: 0.25; }
}
</style>