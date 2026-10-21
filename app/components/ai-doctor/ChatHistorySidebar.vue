<script setup lang="ts">
import type { ChatConversation } from '~/types/ai-doctor.types'

/** سایدبار تاریخچه‌ی گفتگوها (مثل ChatGPT/Claude): گفتگوی جدید، جستجو، گروه‌بندی با تاریخ، تغییر نام و حذف */
const props = defineProps<{
  /** جدیدترین اول */
  conversations: ChatConversation[]
  activeId: string | null
}>()
const emit = defineEmits<{
  new: []
  select: [id: string]
  rename: [id: string, title: string]
  remove: [id: string]
}>()

const { t } = useI18n()

const root = ref<HTMLElement | null>(null)
const query = ref('')
const editingId = ref<string | null>(null)
const editTitle = ref('')
const confirmId = ref<string | null>(null)

const DAY = 24 * 60 * 60 * 1000

const groups = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = q
    ? props.conversations.filter(c => (c.title || t('aiDoctor.untitled')).toLowerCase().includes(q))
    : props.conversations

  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const buckets = [
    { key: 'groupToday', items: [] as ChatConversation[] },
    { key: 'groupYesterday', items: [] as ChatConversation[] },
    { key: 'groupWeek', items: [] as ChatConversation[] },
    { key: 'groupOlder', items: [] as ChatConversation[] },
  ] as const
  for (const conv of list) {
    const age = startOfToday - conv.updatedAt
    const index = conv.updatedAt >= startOfToday ? 0 : age <= DAY ? 1 : age <= 6 * DAY ? 2 : 3
    buckets[index]!.items.push(conv)
  }
  return buckets.filter(b => b.items.length)
})

function startRename(conv: ChatConversation) {
  confirmId.value = null
  editingId.value = conv.id
  editTitle.value = conv.title
  nextTick(() => root.value?.querySelector<HTMLInputElement>('[data-rename]')?.select())
}

function saveRename(id: string) {
  // Enter و blur هر دو صدا زده می‌شن؛ فقط بار اول مهمه
  if (editingId.value !== id) return
  editingId.value = null
  if (editTitle.value.trim()) emit('rename', id, editTitle.value)
}

function askDelete(id: string) {
  editingId.value = null
  confirmId.value = id
}

function confirmDelete(id: string) {
  confirmId.value = null
  emit('remove', id)
}
</script>

<template>
  <div
    ref="root"
    class="flex h-full min-h-0 flex-col gap-3"
  >
    <button
      type="button"
      class="flex items-center gap-2 rounded-xl border border-ink/10 px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-primary-50 hover:text-primary-700"
      @click="emit('new')"
    >
      <Icon
        name="lucide:square-pen"
        class="size-4"
      />
      {{ t('aiDoctor.newChat') }}
    </button>

    <NuxtLink
      to="/ai-doctor-plants"
      class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-primary-50 hover:text-primary-700"
    >
      <Icon
        name="lucide:sprout"
        class="size-4"
      />
      {{ t('aiDoctor.myPlants') }}
    </NuxtLink>

    <label class="relative block">
      <Icon
        name="lucide:search"
        class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
      />
      <input
        v-model="query"
        type="search"
        dir="auto"
        :placeholder="t('aiDoctor.searchChats')"
        :aria-label="t('aiDoctor.searchChats')"
        class="w-full rounded-xl border border-ink/10 bg-transparent py-2 ps-9 pe-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-primary-500/60"
      >
    </label>

    <nav
      class="-mx-1 min-h-0 flex-1 overflow-y-auto px-1"
      :aria-label="t('aiDoctor.history')"
    >
      <p
        v-if="!conversations.length"
        class="px-2 py-6 text-center text-xs leading-6 text-ink-muted"
      >
        {{ t('aiDoctor.noChats') }}
      </p>
      <p
        v-else-if="!groups.length"
        class="px-2 py-6 text-center text-xs leading-6 text-ink-muted"
      >
        {{ t('aiDoctor.noResults') }}
      </p>

      <section
        v-for="group in groups"
        :key="group.key"
        class="mb-3"
      >
        <h3 class="px-2 pb-1 text-[11px] font-bold text-ink-muted">
          {{ t(`aiDoctor.${group.key}`) }}
        </h3>
        <ul class="flex flex-col gap-0.5">
          <li
            v-for="conv in group.items"
            :key="conv.id"
          >
            <!-- تغییر نام -->
            <input
              v-if="editingId === conv.id"
              v-model="editTitle"
              data-rename
              dir="auto"
              maxlength="80"
              :aria-label="t('aiDoctor.rename')"
              class="w-full rounded-lg border border-primary-500/60 bg-surface px-3 py-2 text-sm text-ink outline-none"
              @keydown.enter.prevent="saveRename(conv.id)"
              @keydown.esc.prevent="editingId = null"
              @blur="saveRename(conv.id)"
            >

            <!-- تأیید حذف -->
            <div
              v-else-if="confirmId === conv.id"
              class="flex items-center gap-1 rounded-lg bg-status-danger/10 py-1 ps-3 pe-1"
              role="alertdialog"
            >
              <span class="min-w-0 flex-1 truncate text-xs text-status-danger">{{ t('aiDoctor.confirmDelete') }}</span>
              <button
                type="button"
                class="flex size-7 shrink-0 items-center justify-center rounded-md text-status-danger transition-colors hover:bg-status-danger/15"
                :aria-label="t('common.delete')"
                :title="t('common.delete')"
                @click="confirmDelete(conv.id)"
              >
                <Icon
                  name="lucide:check"
                  class="size-4"
                />
              </button>
              <button
                type="button"
                class="flex size-7 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-ink/[0.06]"
                :aria-label="t('common.cancel')"
                :title="t('common.cancel')"
                @click="confirmId = null"
              >
                <Icon
                  name="lucide:x"
                  class="size-4"
                />
              </button>
            </div>

            <!-- ردیف عادی -->
            <div
              v-else
              class="group flex items-center rounded-lg transition-colors"
              :class="conv.id === activeId ? 'bg-primary-50 text-primary-700' : 'text-ink hover:bg-ink/[0.05]'"
            >
              <button
                type="button"
                class="min-w-0 flex-1 truncate px-3 py-2 text-start text-sm"
                :aria-current="conv.id === activeId ? 'true' : undefined"
                :title="conv.title || t('aiDoctor.untitled')"
                dir="auto"
                @click="emit('select', conv.id)"
              >
                {{ conv.title || t('aiDoctor.untitled') }}
              </button>
              <div class="flex shrink-0 items-center pe-1 lg:hidden lg:group-focus-within:flex lg:group-hover:flex">
                <button
                  type="button"
                  class="flex size-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-ink/[0.08] hover:text-ink"
                  :aria-label="t('aiDoctor.rename')"
                  :title="t('aiDoctor.rename')"
                  @click="startRename(conv)"
                >
                  <Icon
                    name="lucide:pencil"
                    class="size-3.5"
                  />
                </button>
                <button
                  type="button"
                  class="flex size-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-status-danger/10 hover:text-status-danger"
                  :aria-label="t('aiDoctor.deleteChat')"
                  :title="t('aiDoctor.deleteChat')"
                  @click="askDelete(conv.id)"
                >
                  <Icon
                    name="lucide:trash-2"
                    class="size-3.5"
                  />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </nav>
  </div>
</template>