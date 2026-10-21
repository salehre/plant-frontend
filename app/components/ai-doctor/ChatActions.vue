<script setup lang="ts">
import type { ChatFeedback } from '~/types/ai-doctor.types'

/** معادل Actions + CopyAction + RegenerateAction + FeedbackBar در localmode.ai */
const props = defineProps<{
  /** متنی که دکمه‌ی کپی کپی می‌کنه */
  text: string
  feedback?: ChatFeedback
  /** فقط روی آخرین جواب «تولید دوباره» نشون داده می‌شه */
  canRegenerate?: boolean
}>()
const emit = defineEmits<{
  regenerate: []
  feedback: [ChatFeedback]
}>()

const { copy, copied } = useClipboard({ copiedDuring: 1500, legacy: true })

const actionClass = 'flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink focus-visible:outline-2 focus-visible:outline-primary-500'
</script>

<template>
  <div
    class="-ms-2 flex items-center gap-0.5"
    role="toolbar"
  >
    <button
      type="button"
      :class="actionClass"
      :aria-label="copied ? $t('aiDoctor.copied') : $t('aiDoctor.copy')"
      :title="copied ? $t('aiDoctor.copied') : $t('aiDoctor.copy')"
      @click="copy(props.text)"
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
      :aria-pressed="feedback === 'up'"
      :aria-label="$t('aiDoctor.goodReply')"
      :title="$t('aiDoctor.goodReply')"
      @click="emit('feedback', 'up')"
    >
      <Icon
        name="lucide:thumbs-up"
        class="size-4"
        :class="feedback === 'up' ? 'fill-primary-600/20 text-primary-600' : ''"
      />
    </button>
    <button
      type="button"
      :class="actionClass"
      :aria-pressed="feedback === 'down'"
      :aria-label="$t('aiDoctor.badReply')"
      :title="$t('aiDoctor.badReply')"
      @click="emit('feedback', 'down')"
    >
      <Icon
        name="lucide:thumbs-down"
        class="size-4"
        :class="feedback === 'down' ? 'fill-status-danger/20 text-status-danger' : ''"
      />
    </button>
    <button
      v-if="canRegenerate"
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