<script setup lang="ts">
/**
 * معادل Conversation + ConversationScrollAnchor + ConversationScrollButton + ConversationEmptyState
 * در localmode.ai. تا وقتی کاربر پایین گفتگوئه، با هر محتوای جدید (استریم) خودکار پایین می‌ره؛
 * اگه بالا اسکرول کنه آزاد می‌شه و دکمه‌ی «رفتن به آخرین پیام» ظاهر می‌شه.
 */
defineProps<{
  /** هنوز پیامی نیست: اسلات empty نشون داده می‌شه */
  empty?: boolean
  label?: string
}>()

const scrollEl = ref<HTMLElement | null>(null)
const contentEl = ref<HTMLElement | null>(null)
const pinned = ref(true)

function scrollToEnd(smooth = false) {
  const el = scrollEl.value
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
}

function pin(smooth = false) {
  pinned.value = true
  nextTick(() => scrollToEnd(smooth))
}

function onScroll() {
  const el = scrollEl.value
  if (el) pinned.value = el.scrollHeight - el.scrollTop - el.clientHeight < 80
}

// هر بار ارتفاع محتوا عوض شد (پیام جدید، کلمه‌ی جدید استریم، عکس لود شد) و پین بود، برو پایین
useResizeObserver(contentEl, () => {
  if (pinned.value) scrollToEnd()
})

onMounted(scrollToEnd)

defineExpose({ pin })
</script>

<template>
  <div class="relative min-h-0 flex-1">
    <div
      ref="scrollEl"
      class="h-full overflow-y-auto px-1 pb-6 pt-2"
      :aria-label="label"
      aria-live="polite"
      @scroll.passive="onScroll"
    >
      <div
        ref="contentEl"
        class="flex min-h-full flex-col gap-6"
      >
        <slot
          v-if="empty"
          name="empty"
        />
        <slot v-else />
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-150"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="translate-y-2 opacity-0"
    >
      <button
        v-if="!pinned && !empty"
        type="button"
        class="absolute bottom-3 start-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink shadow-md transition-colors hover:bg-primary-50 rtl:translate-x-1/2"
        :aria-label="$t('aiDoctor.scrollDown')"
        :title="$t('aiDoctor.scrollDown')"
        @click="pin(true)"
      >
        <Icon
          name="lucide:arrow-down"
          class="size-4"
        />
      </button>
    </Transition>
  </div>
</template>