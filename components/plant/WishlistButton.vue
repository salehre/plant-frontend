<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    slug: string
    /** variant سبک برای روی کارت‌ها (فقط آیکون)، variant کامل برای صفحه‌ی جزئیات */
    compact?: boolean
  }>(),
  { compact: false },
)

const wishlistStore = useWishlistStore()
const isSaved = computed(() => wishlistStore.isWishlisted(props.slug))

function onClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  wishlistStore.toggle(props.slug)
}
</script>

<template>
  <button
    v-if="compact"
    type="button"
    class="flex size-8 items-center justify-center rounded-full bg-surface/90 text-ink shadow-card backdrop-blur transition-colors hover:text-status-danger"
    :class="{ 'text-status-danger': isSaved }"
    :aria-label="isSaved ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'"
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
    {{ isSaved ? 'در علاقه‌مندی‌هاست' : 'افزودن به علاقه‌مندی‌ها' }}
  </AppButton>
</template>
