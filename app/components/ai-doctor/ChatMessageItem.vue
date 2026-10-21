<script setup lang="ts">
import type { ChatFeedback, ChatMessage as Msg } from '~/types/ai-doctor.types'

/**
 * معادل Message + MessageAvatar + MessageContent در localmode.ai:
 * پیام کاربر = حباب ملایم سمت راست؛ پیام AI = بدون حباب، تمام‌عرض، با آواتار و Actions.
 */
const props = defineProps<{
  message: Msg
  /** این جواب همین الان داره نوشته می‌شه */
  streaming?: boolean
  /** آخرین پیام گفتگوئه */
  isLast?: boolean
}>()
const emit = defineEmits<{
  retry: []
  preview: [string]
  regenerate: []
  feedback: [ChatFeedback]
}>()

const isUser = computed(() => props.message.role === 'user')
const showActions = computed(() => !isUser.value && !props.message.failed && !props.streaming && !!props.message.content)
</script>

<template>
  <article
    v-if="isUser"
    data-role="user"
    class="flex max-w-[85%] flex-col gap-2 rounded-3xl bg-ink/[0.06] px-4 py-2.5 text-ink ltr:self-end rtl:self-start sm:max-w-[75%]"
  >
    <button
      v-if="message.image"
      type="button"
      class="block overflow-hidden rounded-2xl"
      @click="emit('preview', message.image)"
    >
      <img
        :src="message.image"
        :alt="$t('aiDoctor.userImageAlt')"
        class="max-h-56 w-full object-cover"
      >
    </button>
    <span
      v-else-if="message.imageOmitted"
      class="flex w-fit items-center gap-1.5 rounded-xl bg-ink/[0.06] px-2.5 py-1.5 text-xs text-ink-muted"
    >
      <Icon
        name="lucide:image"
        class="size-4"
      />
      {{ $t('aiDoctor.imageOmitted') }}
    </span>
    <p
      v-if="message.content"
      class="whitespace-pre-wrap break-words text-[15px] leading-7"
      dir="auto"
    >
      {{ message.content }}
    </p>
  </article>

  <article
    v-else
    data-role="assistant"
    class="flex w-full gap-3"
  >
    <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-white/10">
      <Icon
        name="lucide:stethoscope"
        class="size-4"
      />
    </span>

    <div class="flex min-w-0 flex-1 flex-col gap-2.5">
      <ChatInMessageError
        v-if="message.failed"
        :message="$t('aiDoctor.error')"
        :retry-label="$t('aiDoctor.retry')"
        @retry="emit('retry')"
      />
      <template v-else>
        <ChatResponse
          :content="message.content"
          :streaming="streaming"
        />
        <ChatActions
          v-if="showActions"
          :text="message.content"
          :feedback="message.feedback"
          :can-regenerate="isLast"
          @regenerate="emit('regenerate')"
          @feedback="emit('feedback', $event)"
        />
      </template>
    </div>
  </article>
</template>