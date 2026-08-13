<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  links: { to: string, label: string }[]
}>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()
</script>

<template>
  <AppDrawer
    :model-value="props.modelValue"
    side="end"
    @update:model-value="v => emit('update:modelValue', v)"
  >
    <div class="flex items-center justify-between border-b border-ink/5 pb-4">
      <span class="flex items-center gap-2 font-bold text-primary-700">
        <Icon
          name="lucide:leaf"
          class="size-5"
        />
        برگ‌یار
      </span>
      <button
        aria-label="بستن منو"
        @click="emit('update:modelValue', false)"
      >
        <Icon
          name="lucide:x"
          class="size-5 text-ink-muted"
        />
      </button>
    </div>
    <nav class="mt-4 flex flex-col gap-1">
      <NuxtLink
        v-for="link in props.links"
        :key="link.to"
        :to="link.to"
        class="rounded-md px-3 py-3 text-sm font-medium text-ink hover:bg-primary-50"
        active-class="text-primary-700 bg-primary-50"
        @click="emit('update:modelValue', false)"
      >
        {{ $t(link.label) }}
      </NuxtLink>
    </nav>
  </AppDrawer>
</template>
