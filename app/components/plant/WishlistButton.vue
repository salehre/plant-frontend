<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'

const props = withDefaults(
  defineProps<{
    slug: string
    /** variant سبک برای روی کارت‌ها (فقط آیکون)، variant کامل برای صفحه‌ی جزئیات */
    compact?: boolean
  }>(),
  { compact: false },
)

const wishlistStore = useWishlistStore()
const { t } = useI18n({ messages: { en, fa }, useScope: 'local' })
const isSaved = computed(() => wishlistStore.isWishlisted(props.slug))

function onClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  wishlistStore.toggle(props.slug, {
    added: t('components.wishlistButton.addedToast'),
    removed: t('components.wishlistButton.removedToast'),
  })
}
</script>

<template>
  <button
    v-if="compact"
    type="button"
    class="flex size-8 items-center justify-center rounded-full bg-surface/90 text-ink shadow-card backdrop-blur transition-colors hover:text-status-danger"
    :class="{ 'text-status-danger': isSaved }"
    :aria-label="isSaved ? t('components.wishlistButton.remove') : t('components.wishlistButton.add')"
    @click="onClick"
  >
    <Icon
      :name="isSaved ? 'lucide:heart' : 'lucide:heart'"
      class="size-4"
      :class="isSaved ? 'fill-current' : ''"
    />
  </button>

  <AppButton
    v-else
    :variant="isSaved ? 'secondary' : 'ghost'"
    type="button"
    @click="onClick"
  >
    <Icon
      name="lucide:heart"
      class="size-4"
      :class="isSaved ? 'fill-current text-status-danger' : ''"
    />
    {{ isSaved ? t('components.wishlistButton.saved') : t('components.wishlistButton.add') }}
  </AppButton>
</template>
