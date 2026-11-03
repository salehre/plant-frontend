<script setup lang="ts">
import type { ChatConversation } from '~/types/ai-doctor.types'

/** سایدبار تاریخچه‌ی گفتگوها */
const props = defineProps<{
  /** جدیدترین گفتگوها در ابتدا */
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

const GROUP_KEYS = [
  'groupPinned',
  'groupToday',
  'groupYesterday',
  'groupWeek',
  'groupOlder',
] as const

type GroupKey = typeof GROUP_KEYS[number]

const DAY_MS = 24 * 60 * 60 * 1000

function localDayKey(timestamp: number) {
  const date = new Date(timestamp)

  // با کلید روز تقویمی، تغییر ساعت تابستانی روی گروه‌بندی اثر نمی‌گذارد.
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
}

const groups = computed(() => {
  const buckets: Record<GroupKey, ChatConversation[]> = {
    groupPinned: [],
    groupToday: [],
    groupYesterday: [],
    groupWeek: [],
    groupOlder: [],
  }

  const todayKey = localDayKey(Date.now())

  for (const conversation of props.conversations) {
    let group: GroupKey

    if (conversation.pinned) {
      group = 'groupPinned'
    }
    else {
      const daysAgo = Math.floor(
        (todayKey - localDayKey(conversation.updatedAt)) / DAY_MS,
      )

      if (daysAgo <= 0)
        group = 'groupToday'
      else if (daysAgo === 1)
        group = 'groupYesterday'
      else if (daysAgo <= 6)
        group = 'groupWeek'
      else
        group = 'groupOlder'
    }

    buckets[group].push(conversation)
  }

  return GROUP_KEYS
    .map(key => ({ key, items: buckets[key] }))
    .filter(group => group.items.length > 0)
})

function focusConversationTitle(id: string) {
  nextTick(() => {
    const buttons = root.value?.querySelectorAll<HTMLButtonElement>(
      '[data-conversation-title]',
    )

    const button = Array.from(buttons ?? [])
      .find(item => item.dataset.conversationTitle === id)

    button?.focus()
  })
}

function startRename(conversation: ChatConversation) {
  confirmId.value = null
  editingId.value = conversation.id
  editTitle.value = conversation.title

  nextTick(() => {
    const input = root.value?.querySelector<HTMLInputElement>('[data-rename]')
    input?.focus()
    input?.select()
  })
}

function saveRename(id: string, restoreFocus = false) {
  // Enter و blur ممکن است هر دو اجرا شوند؛ فقط بار اول ذخیره می‌کنیم.
  if (editingId.value !== id)
    return

  const title = editTitle.value.trim()
  const original = props.conversations.find(conversation => conversation.id === id)

  editingId.value = null

  if (title && original && title !== original.title)
    emit('rename', id, title)

  if (restoreFocus)
    focusConversationTitle(id)
}

function cancelRename(id: string) {
  if (editingId.value !== id)
    return

  editingId.value = null
  focusConversationTitle(id)
}

function askDelete(id: string) {
  editingId.value = null
  confirmId.value = id

  nextTick(() => {
    root.value
      ?.querySelector<HTMLButtonElement>('[data-delete-cancel]')
      ?.focus()
  })
}

function confirmDelete(id: string) {
  if (confirmId.value !== id)
    return

  confirmId.value = null
  emit('remove', id)
}

function cancelDelete(id: string) {
  if (confirmId.value !== id)
    return

  confirmId.value = null
  focusConversationTitle(id)
}

// منو به body منتقل می‌شود تا در محدوده‌ی اسکرول nav بریده نشود.
interface MenuState {
  id: string
  top: number
  left: number
}

const menu = ref<MenuState | null>(null)
const menuEl = ref<HTMLElement | null>(null)
const menuTrigger = ref<HTMLElement | null>(null)

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function closeMenu() {
  menu.value = null
  menuTrigger.value = null
}

function focusElement(element: HTMLElement | null | undefined) {
  if (!element)
    return

  nextTick(() => {
    if (element.isConnected)
      element.focus()
  })
}

function dismissMenu() {
  const trigger = menuTrigger.value
  closeMenu()
  focusElement(trigger)
}

function positionMenu(id: string, trigger: HTMLElement) {
  if (menu.value?.id !== id || !menuEl.value)
    return

  const triggerRect = trigger.getBoundingClientRect()
  const menuRect = menuEl.value.getBoundingClientRect()
  const padding = 8
  const gap = 6
  const rtl = getComputedStyle(trigger).direction === 'rtl'

  // در RTL لبه‌ی چپ منو و دکمه، و در LTR لبه‌ی راست آن‌ها هم‌تراز می‌شوند.
  const preferredLeft = rtl
    ? triggerRect.left
    : triggerRect.right - menuRect.width

  const maxLeft = Math.max(
    padding,
    window.innerWidth - menuRect.width - padding,
  )

  const left = Math.min(
    Math.max(preferredLeft, padding),
    maxLeft,
  )

  const fitsBelow =
    triggerRect.bottom + gap + menuRect.height <= window.innerHeight - padding

  const top = fitsBelow
    ? triggerRect.bottom + gap
    : Math.max(padding, triggerRect.top - menuRect.height - gap)

  menu.value = { id, top, left }
}

function toggleMenu(conversation: ChatConversation, event: MouseEvent) {
  if (menu.value?.id === conversation.id) {
    closeMenu()
    return
  }

  const trigger = event.currentTarget as HTMLElement

  menuTrigger.value = trigger
  menu.value = {
    id: conversation.id,
    top: 0,
    left: 0,
  }

  nextTick(() => {
    if (menu.value?.id !== conversation.id)
      return

    positionMenu(conversation.id, trigger)
    focusMenuItem(0)
  })
}

function focusMenuItem(index: number) {
  const items = menuEl.value?.querySelectorAll<HTMLButtonElement>(
    '[role="menuitem"]',
  )

  if (!items?.length)
    return

  const normalizedIndex = (index + items.length) % items.length
  items[normalizedIndex]?.focus()
}

function focusOutsideMenu(backwards: boolean) {
  const trigger = menuTrigger.value
  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => {
    return !menuEl.value?.contains(element)
      && !element.closest('[hidden], [inert], [aria-hidden="true"]')
      && getComputedStyle(element).visibility !== 'hidden'
      && element.getClientRects().length > 0
  })

  const triggerIndex = trigger
    ? focusableElements.indexOf(trigger)
    : -1

  const direction = backwards ? -1 : 1
  const nextElement = triggerIndex >= 0
    ? focusableElements[triggerIndex + direction]
    : trigger

  closeMenu()
  focusElement(nextElement ?? trigger)
}

function onMenuKeydown(event: KeyboardEvent) {
  const items = Array.from(
    menuEl.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
  )

  if (!items.length)
    return

  const currentIndex = items.findIndex(item => item === document.activeElement)

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusMenuItem(currentIndex + 1)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusMenuItem(currentIndex - 1)
  }
  else if (event.key === 'Home') {
    event.preventDefault()
    focusMenuItem(0)
  }
  else if (event.key === 'End') {
    event.preventDefault()
    focusMenuItem(items.length - 1)
  }
  else if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    dismissMenu()
  }
  else if (event.key === 'Tab') {
    event.preventDefault()
    focusOutsideMenu(event.shiftKey)
  }
}

function menuAction(action: 'share' | 'rename' | 'delete') {
  const id = menu.value?.id
  const trigger = menuTrigger.value

  if (!id)
    return

  closeMenu()

  if (action === 'share') {
    emit('share', id)
    focusElement(trigger)
  }
  else if (action === 'delete') {
    askDelete(id)
  }
  else {
    const conversation = props.conversations.find(item => item.id === id)

    if (conversation)
      startRename(conversation)
    else
      focusElement(trigger)
  }
}

onClickOutside(menuEl, closeMenu, {
  ignore: ['[data-menu-trigger]'],
})

useEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && menu.value)
    dismissMenu()
})

useEventListener('resize', closeMenu)
</script>

<template>
  <div
    ref="root"
    class="flex h-full min-h-0 min-w-0 flex-col gap-4"
  >
    <div class="space-y-1.5">
      <button
        type="button"
        class="group flex w-full items-center gap-3 rounded-xl bg-primary-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700/90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        @click="emit('new')"
      >
        <span
          aria-hidden="true"
          class="grid size-8 shrink-0 place-items-center rounded-lg bg-white/15"
        >
          <Icon
            name="lucide:square-pen"
            class="size-4"
          />
        </span>

        <span class="min-w-0 flex-1 truncate text-start">
          {{ t('aiDoctor.newChat') }}
        </span>

        <span
          aria-hidden="true"
          class="grid size-6 shrink-0 place-items-center rounded-md bg-white/10 transition-colors group-hover:bg-white/15"
        >
          <Icon
            name="lucide:plus"
            class="size-4"
          />
        </span>
      </button>

      <NuxtLink
        to="/ai-doctor-plants"
        class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <span
          aria-hidden="true"
          class="grid size-8 shrink-0 place-items-center rounded-lg bg-ink/[0.04] text-ink-muted transition-colors group-hover:bg-primary-100 group-hover:text-primary-700"
        >
          <Icon
            name="lucide:sprout"
            class="size-4"
          />
        </span>

        {{ t('aiDoctor.myPlants') }}
      </NuxtLink>
    </div>

    <div
      aria-hidden="true"
      class="mx-2 border-t border-ink/10"
    />

    <nav
      class="-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-1"
      :aria-label="t('aiDoctor.history')"
      @scroll.passive="closeMenu"
    >
      <div
        v-if="!conversations.length"
        class="mx-2 my-8 flex flex-col items-center gap-3 text-center"
      >
        <span class="grid size-10 place-items-center rounded-2xl bg-ink/[0.04] text-ink-muted">
          <Icon
            name="lucide:messages-square"
            class="size-5"
          />
        </span>

        <p class="max-w-[13rem] text-xs leading-6 text-ink-muted">
          {{ t('aiDoctor.noChats') }}
        </p>
      </div>

      <section
        v-for="group in groups"
        :key="group.key"
        class="mb-4 last:mb-0"
      >
        <h3 class="px-3 pb-1.5 pt-2 text-[11px] font-semibold text-ink-muted">
          {{ t(`aiDoctor.${group.key}`) }}
        </h3>

        <ul class="flex flex-col gap-1">
          <li
            v-for="conversation in group.items"
            :key="conversation.id"
            class="min-w-0"
          >
            <!-- تغییر نام -->
            <input
              v-if="editingId === conversation.id"
              v-model="editTitle"
              data-rename
              maxlength="80"
              :aria-label="t('aiDoctor.rename')"
              class="w-full rounded-xl border border-primary-500/50 bg-surface px-3 py-2.5 text-start text-sm text-ink shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              @keydown.enter.prevent="saveRename(conversation.id, true)"
              @keydown.esc.prevent="cancelRename(conversation.id)"
              @blur="saveRename(conversation.id)"
            >

            <!-- تأیید حذف -->
            <div
              v-else-if="confirmId === conversation.id"
              role="group"
              :aria-label="t('aiDoctor.confirmDelete')"
              class="flex items-center gap-1 rounded-xl border border-status-danger/15 bg-status-danger/5 py-1 ps-3 pe-1"
              @keydown.esc.stop.prevent="cancelDelete(conversation.id)"
            >
              <span class="min-w-0 flex-1 truncate text-xs text-status-danger">
                {{ t('aiDoctor.confirmDelete') }}
              </span>

              <button
                type="button"
                class="flex size-8 shrink-0 items-center justify-center rounded-lg text-status-danger transition-colors hover:bg-status-danger/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-danger"
                :aria-label="t('common.delete')"
                :title="t('common.delete')"
                @click="confirmDelete(conversation.id)"
              >
                <Icon
                  name="lucide:check"
                  class="size-4"
                />
              </button>

              <button
                type="button"
                data-delete-cancel
                class="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                :aria-label="t('common.cancel')"
                :title="t('common.cancel')"
                @click="cancelDelete(conversation.id)"
              >
                <Icon
                  name="lucide:x"
                  class="size-4"
                />
              </button>
            </div>

            <!-- ردیف گفتگو -->
            <div
              v-else
              class="group relative flex min-w-0 items-center rounded-xl transition-colors"
              :class="conversation.id === activeId
                ? 'bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-500/15'
                : menu?.id === conversation.id
                  ? 'bg-ink/[0.05] text-ink'
                  : 'text-ink hover:bg-ink/[0.05]'"
            >
              <button
                type="button"
                :data-conversation-title="conversation.id"
                class="min-w-0 flex-1 truncate rounded-xl py-2.5 ps-3 pe-3 text-start text-sm transition-[padding] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 max-lg:pe-[4.75rem] lg:group-hover:pe-[4.75rem] lg:group-focus-within:pe-[4.75rem]"
                :class="[
                  conversation.id === activeId ? 'font-semibold' : 'font-medium',
                  menu?.id === conversation.id ? 'lg:pe-[4.75rem]' : '',
                ]"
                :aria-current="conversation.id === activeId ? 'true' : undefined"
                :title="conversation.title || t('aiDoctor.untitled')"
                @click="emit('select', conversation.id)"
              >
                {{ conversation.title || t('aiDoctor.untitled') }}
              </button>

              <div
                class="absolute inset-y-0 end-1 flex items-center gap-0.5 transition-opacity duration-150 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
                :class="menu?.id === conversation.id ? 'lg:!opacity-100' : ''"
              >
                <button
                  type="button"
                  class="flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-ink/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                  :class="conversation.pinned
                    ? 'text-primary-700'
                    : 'text-ink-muted hover:text-ink'"
                  :aria-label="conversation.pinned ? t('aiDoctor.unpin') : t('aiDoctor.pin')"
                  :title="conversation.pinned ? t('aiDoctor.unpin') : t('aiDoctor.pin')"
                  :aria-pressed="Boolean(conversation.pinned)"
                  @click="emit('pin', conversation.id)"
                >
                  <Icon
                    name="lucide:pin"
                    class="size-3.5"
                    :class="conversation.pinned ? 'fill-current' : ''"
                  />
                </button>

                <button
                  type="button"
                  data-menu-trigger
                  class="flex size-7 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink/[0.08] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                  :aria-label="t('aiDoctor.moreActions')"
                  :title="t('aiDoctor.moreActions')"
                  aria-haspopup="menu"
                  :aria-expanded="menu?.id === conversation.id"
                  :aria-controls="menu?.id === conversation.id ? 'conversation-actions-menu' : undefined"
                  @click="toggleMenu(conversation, $event)"
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

    <!-- منوی گفتگو -->
    <Teleport to="body">
      <div
        v-if="menu"
        id="conversation-actions-menu"
        ref="menuEl"
        role="menu"
        :aria-label="t('aiDoctor.moreActions')"
        class="fixed z-[70] max-h-[calc(100vh-1rem)] w-48 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-xl border border-ink/10 bg-surface p-1.5 shadow-xl shadow-ink/10"
        :style="{ top: `${menu.top}px`, left: `${menu.left}px` }"
        @keydown="onMenuKeydown"
      >
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm text-ink transition-colors hover:bg-ink/[0.06] focus-visible:bg-ink/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
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
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm text-ink transition-colors hover:bg-ink/[0.06] focus-visible:bg-ink/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
          @click="menuAction('rename')"
        >
          <Icon
            name="lucide:pencil"
            class="size-4 text-ink-muted"
          />
          {{ t('aiDoctor.rename') }}
        </button>

        <div
          role="separator"
          class="my-1 border-t border-ink/10"
        />

        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm text-status-danger transition-colors hover:bg-status-danger/10 focus-visible:bg-status-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-status-danger"
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