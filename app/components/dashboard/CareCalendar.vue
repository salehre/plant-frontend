<script setup lang="ts">
import type { CareTask } from '~/types/user.types'

const props = defineProps<{ tasks: CareTask[] }>()
const selected = defineModel<string | null>({ default: null })
const { locale } = useI18n()

const intlLocale = computed(() => locale.value === 'fa' ? 'fa-IR' : 'en-US')
const monthLabel = computed(() =>
  new Intl.DateTimeFormat(intlLocale.value, { month: 'long', year: 'numeric' }).format(new Date()),
)

// ۷ روز از امروز؛ نام روز و عدد از خود تاریخ ساخته می‌شن (قبلاً نام روزها ثابت بود و با تاریخ واقعی نمی‌خوند)
const days = computed(() => Array.from({ length: 7 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() + i)
  const iso = date.toISOString().slice(0, 10)
  return {
    iso,
    isToday: i === 0,
    weekday: new Intl.DateTimeFormat(intlLocale.value, { weekday: 'short' }).format(date),
    day: new Intl.DateTimeFormat(intlLocale.value, { day: 'numeric' }).format(date),
    count: props.tasks.filter(task => task.dueDate === iso).length,
  }
}))

function toggle(iso: string) {
  selected.value = selected.value === iso ? null : iso
}
</script>

<template>
  <div class="glass-card p-4">
    <p class="mb-3 text-sm font-bold text-ink">
      {{ monthLabel }}
    </p>
    <div class="grid grid-cols-7 gap-1.5">
      <button
        v-for="d in days"
        :key="d.iso"
        type="button"
        class="flex flex-col items-center gap-1.5 rounded-xl py-1.5 transition-colors"
        :class="selected === d.iso ? 'bg-primary-50' : 'hover:bg-primary-50/60'"
        :aria-pressed="selected === d.iso"
        @click="toggle(d.iso)"
      >
        <span class="text-[11px] text-ink-muted">{{ d.weekday }}</span>
        <span
          class="flex size-9 items-center justify-center rounded-full text-sm font-bold"
          :class="d.isToday ? 'bg-primary-600 text-white' : (selected === d.iso ? 'text-primary-700' : 'text-ink')"
        >
          {{ d.day }}
        </span>
        <span
          class="size-1.5 rounded-full"
          :class="d.count ? 'bg-primary-500' : 'bg-transparent'"
        />
      </button>
    </div>
  </div>
</template>
