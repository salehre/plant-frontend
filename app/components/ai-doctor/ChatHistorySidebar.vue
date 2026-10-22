<script setup lang="ts">
import type { ChatConversation } from '~/types/ai-doctor.types'

/** سایدبار تاریخچه‌ی گفتگوها: گفتگوی جدید، جستجو، پین، گروه‌بندی با تاریخ، و منوی هر گفتگو (اشتراک‌گذاری، تغییر نام، حذف) */
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
  pin: [id: string]
  share: [id: string]
}>()

const { t } = useI18n()

const root = ref<HTMLElement | null>(null)
const editingId = ref<string | null>(null)
const editTitle = ref('')
const confirmId = ref<string | null>(null)

const DAY = 24 * 60 * 60 * 1000

const groups = computed(() => {
const list = props.conversations

  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const buckets = [
    { key: 'groupPinned', items: [] as ChatConversation[] },
    { key: 'groupToday', items: [] as ChatConversation[] },
    { key: 'groupYesterday', items: [] as ChatConversation[] },
    { key: 'groupWeek', items: [] as ChatConversation[] },
    { key: 'groupOlder', items: [] as ChatConversation[] },
  ] as const
  for (const conv of list) {
    const age = startOfToday - conv.updatedAt
    const index = conv.pinned
      ? 0
      : conv.updatedAt >= startOfToday ? 1 : age <= DAY ? 2 : age <= 6 * DAY ? 3 : 4
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

// ─── منوی سه‌نقطه ───
// منو به body teleport می‌شه چون nav اسکرول داره (overflow) و منوی داخلش بریده می‌شد.
const MENU_W = 176
const MENU_H = 132
const menu = ref<{ id: string, top: number, left: number } | null>(null)
const menuEl = ref<HTMLElement | null>(null)

function closeMenu() {
  menu.value = null
}

function toggleMenu(conv: ChatConversation, e: MouseEvent) {
  if (menu.value?.id === conv.id) return closeMenu()
  const button = e.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  const rtl = getComputedStyle(button).direction === 'rtl'
  // لبه‌ی end منو با لبه‌ی end دکمه هم‌تراز می‌شه (راست در LTR، چپ در RTL)
  const left = rtl ? rect.left : rect.right - MENU_W
  const top = rect.bottom + 4 + MENU_H > window.innerHeight - 8
    ? Math.max(8, rect.top - MENU_H - 4)
    : rect.bottom + 4
  menu.value = {
    id: conv.id,
    top,
    left: Math.min(Math.max(left, 8), window.innerWidth - MENU_W - 8),
  }
}

function menuAction(action: 'share' | 'rename' | 'delete') {
  const id = menu.value?.id
  if (!id) return
  closeMenu()
  if (action === 'share') emit('share', id)
  else if (action === 'delete') askDelete(id)
  else {
    const conv = props.conversations.find(c => c.id === id)
    if (conv) startRename(conv)
  }
}

onClickOutside(menuEl, closeMenu, { ignore: ['[data-menu-trigger]'] })
useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeMenu()
})
useEventListener('resize', closeMenu)
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

    <nav
      class="-mx-1 min-h-0 flex-1 overflow-y-auto px-1"
      :aria-label="t('aiDoctor.history')"
      @scroll.passive="closeMenu"
    >
      <p
        v-if="!conversations.length"
        class="px-2 py-6 text-center text-xs leading-6 text-ink-muted"
      >
        {{ t('aiDoctor.noChats') }}
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
              maxlength="80"
              :aria-label="t('aiDoctor.rename')"
              class="w-full rounded-lg border border-primary-500/60 bg-surface px-3 py-2 text-start text-sm text-ink outline-none"
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
              class="group relative flex items-center rounded-lg transition-colors"
              :class="conv.id === activeId
                ? 'bg-primary-50 text-primary-700'
                : menu?.id === conv.id ? 'bg-ink/[0.05] text-ink' : 'text-ink hover:bg-ink/[0.05]'"
            >
              <!-- اسم: همیشه از start شروع می‌شه (جهتش از جهت UI می‌آد، نه از محتوای متن) -->
              <button
                type="button"
                class="min-w-0 flex-1 truncate py-2 ps-3 pe-3 text-start text-sm max-lg:pe-[4.75rem] lg:group-focus-within:pe-[4.75rem] lg:group-hover:pe-[4.75rem]"
                :class="menu?.id === conv.id ? 'lg:pe-[4.75rem]' : ''"
                :aria-current="conv.id === activeId ? 'true' : undefined"
                :title="conv.title || t('aiDoctor.untitled')"
                @click="emit('select', conv.id)"
              >
                {{ conv.title || t('aiDoctor.untitled') }}
              </button>

              <!-- آیکن‌ها: همیشه سمت end (راست در LTR، چپ در RTL)؛ روی دسکتاپ فقط با هاور/فوکوس -->
              <div
                class="absolute inset-y-0 end-1 flex items-center gap-0.5 transition-opacity lg:opacity-0 lg:focus-within:opacity-100 lg:group-hover:opacity-100"
                :class="menu?.id === conv.id ? 'lg:!opacity-100' : ''"
              >
                <button
                  type="button"
                  class="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-ink/[0.08]"
                  :class="conv.pinned ? 'text-primary-700' : 'text-ink-muted hover:text-ink'"
                  :aria-label="conv.pinned ? t('aiDoctor.unpin') : t('aiDoctor.pin')"
                  :title="conv.pinned ? t('aiDoctor.unpin') : t('aiDoctor.pin')"
                  :aria-pressed="!!conv.pinned"
                  @click="emit('pin', conv.id)"
                >
                  <Icon
                    name="lucide:pin"
                    class="size-3.5"
                    :class="conv.pinned ? 'fill-current' : ''"
                  />
                </button>
                <button
                  type="button"
                  data-menu-trigger
                  class="flex size-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-ink/[0.08] hover:text-ink"
                  :aria-label="t('aiDoctor.moreActions')"
                  :title="t('aiDoctor.moreActions')"
                  aria-haspopup="menu"
                  :aria-expanded="menu?.id === conv.id"
                  @click="toggleMenu(conv, $event)"
                >
                  <Icon
                    name="lucide:ellipsis"
                    class="size-4"
                  />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </nav>

    <!-- منوی سه‌نقطه -->
    <Teleport to="body">
      <div
        v-if="menu"
        ref="menuEl"
        role="menu"
        class="fixed z-[70] w-44 rounded-xl border border-ink/10 bg-surface p-1 shadow-lg"
        :style="{ top: `${menu.top}px`, left: `${menu.left}px` }"
      >
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm text-ink transition-colors hover:bg-ink/[0.06]"
          @click="menuAction('share')"
        >
          <Icon
            name="lucide:share-2"
            class="size-4 text-ink-muted"
          />
          {{ t('aiDoctor.share') }}
        </button>
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm text-ink transition-colors hover:bg-ink/[0.06]"
          @click="menuAction('rename')"
        >
          <Icon
            name="lucide:pencil"
            class="size-4 text-ink-muted"
          />
          {{ t('aiDoctor.rename') }}
        </button>
        <div class="my-1 border-t border-ink/5" />
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm text-status-danger transition-colors hover:bg-status-danger/10"
          @click="menuAction('delete')"
        >
          <Icon
            name="lucide:trash-2"
            class="size-4"
          />
          {{ t('aiDoctor.deleteChat') }}
        </button>
      </div>
    </Teleport>
  </div>
</template>