<script setup lang="ts">
import type { PlantOption } from '~/composables/useUserPlantOptions'

const props = defineProps<{
  streaming?: boolean
  plants?: PlantOption[]
  selectedPlants?: string[]
}>()
const emit = defineEmits<{
  submit: [payload: { text: string, image?: string }]
  togglePlant: [id: string]
  stop: []
}>()

const { t } = useI18n()
const uiStore = useUiStore()

const MAX_IMAGE_MB = 5
const MAX_LENGTH = 1000

const text = ref('')
const image = ref('')
const dragging = ref(false)
const inputEl = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const canSend = computed(() => !props.streaming && (!!text.value.trim() || !!image.value))

const menuOpen = ref(false)
const plantsOpen = ref(false)
const menuRoot = ref<HTMLElement | null>(null)

const attachedPlants = computed(() =>
  (props.plants ?? []).filter(p => props.selectedPlants?.includes(p.id)),
)

function closeMenu() {
  menuOpen.value = false
  plantsOpen.value = false
}
onClickOutside(menuRoot, closeMenu)

function onMenuEsc(e: KeyboardEvent) {
  if (!menuOpen.value) return
  e.stopPropagation()
  closeMenu()
}

function pickFile() {
  closeMenu()
  fileInput.value?.click()
}

function autoGrow() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 192)}px`
}
watch(text, () => nextTick(autoGrow))

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function setImageFile(file?: File | null) {
  if (!file || !file.type.startsWith('image/')) return
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    uiStore.showToast(t('aiDoctor.imageTooLarge', { max: MAX_IMAGE_MB }), 'error')
    return
  }
  image.value = await readAsDataUrl(file)
  inputEl.value?.focus()
}

function onFilePicked(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  setImageFile(file)
}

function onPaste(e: ClipboardEvent) {
  const file = Array.from(e.clipboardData?.files ?? []).find(f => f.type.startsWith('image/'))
  if (!file) return
  e.preventDefault()
  setImageFile(file)
}

function onDrop(e: DragEvent) {
  dragging.value = false
  setImageFile(e.dataTransfer?.files?.[0])
}

function submit() {
  if (!canSend.value) return
  emit('submit', { text: text.value.trim(), image: image.value || undefined })
  text.value = ''
  image.value = ''
  nextTick(autoGrow)
}

function onEnter(e: KeyboardEvent) {
  if (e.isComposing || e.shiftKey) return
  e.preventDefault()
  submit()
}

defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<template>
  <form
    class="flex flex-col gap-2 rounded-[28px] border bg-surface p-2.5 shadow-sm transition-colors focus-within:border-primary-500/60"
    :class="dragging ? 'border-primary-500 bg-primary-50' : 'border-ink/10'"
    @submit.prevent="submit"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDrop"
  >
    <div
      v-if="image || attachedPlants.length"
      class="flex flex-wrap items-center gap-2"
    >
      <div
        v-if="image"
        class="relative w-fit"
      >
      <button
        type="button"
        class="absolute -end-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-ink text-surface shadow transition-opacity hover:opacity-80"
        :aria-label="$t('aiDoctor.removeImage')"
        @click="image = ''"
      >
        <Icon
          name="lucide:x"
          class="size-3.5"
        />
      </button>
      </div>
      <span
        v-for="plant in attachedPlants"
        :key="plant.id"
        class="inline-flex items-center gap-1.5 rounded-full bg-primary-50 py-1 ps-1 pe-2 text-xs font-medium text-primary-700"
      >
        <img
          :src="plant.photo"
          alt=""
          class="size-5 rounded-full object-cover"
        >
        {{ plant.nickname }}
        <button
          type="button"
          class="flex size-4 items-center justify-center rounded-full transition-colors hover:bg-primary-700/10"
          :aria-label="$t('aiDoctor.detachPlant', { name: plant.nickname })"
          @click="emit('togglePlant', plant.id)"
        >
          <Icon
            name="lucide:x"
            class="size-3"
          />
        </button>
      </span>
    </div>

    <textarea
      ref="inputEl"
      v-model="text"
      rows="1"
      dir="auto"
      :maxlength="MAX_LENGTH"
      :placeholder="$t('aiDoctor.inputPlaceholder')"
      :aria-label="$t('aiDoctor.inputPlaceholder')"
      class="max-h-48 min-h-11 w-full resize-none bg-transparent px-3 py-2.5 text-[15px] leading-6 text-ink outline-none placeholder:text-ink-muted"
      @keydown.enter="onEnter"
      @paste="onPaste"
    />

    <div class="flex items-center justify-between gap-2">
     <div
       ref="menuRoot"
       class="relative"
       @keydown.esc="onMenuEsc"
     >
       <button
         type="button"
         class="flex size-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
         :aria-label="$t('aiDoctor.attachMenu')"
         :title="$t('aiDoctor.attachMenu')"
         aria-haspopup="menu"
         :aria-expanded="menuOpen"
         @click="menuOpen = !menuOpen"
       >
         <Icon
           name="lucide:plus"
           class="size-5 transition-transform duration-200"
           :class="menuOpen ? 'rotate-45' : ''"
         />
       </button>

       <div
         v-if="menuOpen"
         role="menu"
         class="absolute bottom-full start-0 z-20 mb-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-ink/10 bg-surface p-1.5 shadow-lg"
       >
         <button
           type="button"
           role="menuitem"
           class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm text-ink transition-colors hover:bg-ink/[0.05]"
           @click="pickFile"
         >
           <Icon
             name="lucide:image-plus"
             class="size-4 text-ink-muted"
           />
           {{ $t('aiDoctor.attachImage') }}
         </button>

         <button
           type="button"
           role="menuitem"
           class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm text-ink transition-colors hover:bg-ink/[0.05]"
           aria-haspopup="true"
           :aria-expanded="plantsOpen"
           @click="plantsOpen = !plantsOpen"
         >
           <Icon
             name="lucide:sprout"
             class="size-4 text-ink-muted"
           />
           <span class="flex-1">{{ $t('aiDoctor.attachPlants') }}</span>
           <Icon
             name="lucide:chevron-down"
             class="size-4 text-ink-muted transition-transform duration-200"
             :class="plantsOpen ? 'rotate-180' : ''"
           />
         </button>

         <div
           v-if="plantsOpen"
           class="mt-1 border-t border-ink/5 pt-1"
         >
           <p
             v-if="!plants?.length"
             class="px-3 py-3 text-center text-xs leading-6 text-ink-muted"
           >
             {{ $t('aiDoctor.noPlants') }}
           </p>
           <ul
             v-else
             class="max-h-52 overflow-y-auto"
           >
             <li
               v-for="plant in plants"
               :key="plant.id"
             >
               <button
                 type="button"
                 role="menuitemcheckbox"
                 :aria-checked="!!selectedPlants?.includes(plant.id)"
                 class="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-start transition-colors hover:bg-ink/[0.05]"
                 @click="emit('togglePlant', plant.id)"
               >
                 <img
                   :src="plant.photo"
                   alt=""
                   class="size-8 shrink-0 rounded-lg object-cover"
                 >
                 <span class="min-w-0 flex-1">
                   <span class="block truncate text-sm font-medium text-ink">{{ plant.nickname }}</span>
                   <span class="block truncate text-xs text-ink-muted">{{ plant.species }}</span>
                 </span>
                 <Icon
                   v-if="selectedPlants?.includes(plant.id)"
                   name="lucide:check"
                   class="size-4 shrink-0 text-primary-700"
                 />
               </button>
             </li>
           </ul>
         </div>
       </div>
     </div>

      <!-- وقتی AI در حال جواب دادنه: توقف؛ وگرنه ارسال -->
      <button
        v-if="streaming"
        type="button"
        class="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-surface transition-opacity hover:opacity-80"
        :aria-label="$t('aiDoctor.stop')"
        :title="$t('aiDoctor.stop')"
        @click="emit('stop')"
      >
        <Icon
          name="lucide:square"
          class="size-4 fill-current"
        />
      </button>
      <button
        v-else
        type="submit"
        class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:bg-ink/15 disabled:text-ink-muted"
        :disabled="!canSend"
        :aria-label="$t('aiDoctor.send')"
        :title="$t('aiDoctor.send')"
      >
        <Icon
          name="lucide:arrow-up"
          class="size-5"
        />
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFilePicked"
    >
  </form>
</template>