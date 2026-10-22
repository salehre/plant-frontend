<script setup lang="ts">
definePageMeta({ layout: "ai-doctor" });

const aiDoctorStore = useAiDoctorStore();
const authStore = useAuthStore()
const route = useRoute()
const uiStore = useUiStore();
const plantOptions = useUserPlantOptions();
const { t, locale } = useI18n();
const activeLocale = computed(() => (locale.value === "fa" ? "fa" : "en"));

const attachedPlants = computed(() =>
  plantOptions.value.filter((p) =>
    aiDoctorStore.attachedPlantIds.includes(p.id),
  ),
);

const firstName = computed(() => authStore.user?.name?.trim().split(/\s+/)[0] ?? '')
const greeting = computed(() => firstName.value
  ? t('aiDoctor.greeting', { name: firstName.value })
  : t('aiDoctor.greetingAnon'))

const conversation = ref<{ pin: (smooth?: boolean) => void } | null>(null);
const promptInput = ref<{ focus: () => void } | null>(null);
const previewUrl = ref<string | null>(null);
// سایدبار تاریخچه روی موبایل/تبلت به‌صورت کشو باز می‌شه (روی دسکتاپ همیشه کناره)
const historyOpen = ref(false);

const sidebarCollapsed = useLocalStorage(
  "golban-ai-doctor-sidebar-collapsed",
  false,
);
const searchOpen = ref(false);

useEventListener("keydown", (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.code === "KeyK") {
    e.preventDefault();
    searchOpen.value = !searchOpen.value;
  }
});

const lastIndex = computed(() => aiDoctorStore.messages.length - 1);

useEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key !== "Escape") return;
  if (previewUrl.value) previewUrl.value = null;
  else historyOpen.value = false;
});

// با عوض شدن گفتگو، پایین‌ترین پیام رو نشون بده
watch(
  () => aiDoctorStore.activeId,
  () => conversation.value?.pin(),
);

function onSubmit(payload: { text: string; image?: string }) {
  conversation.value?.pin();
  aiDoctorStore.send(payload.text, payload.image, activeLocale.value);
}

function onRegenerate() {
  conversation.value?.pin();
  aiDoctorStore.regenerate(activeLocale.value);
}

function newChat() {
  aiDoctorStore.newChat();
  historyOpen.value = false;
  nextTick(() => promptInput.value?.focus());
}

function selectChat(id: string) {
  aiDoctorStore.select(id);
  historyOpen.value = false;
}

async function shareChat(id: string) {
  const conv = aiDoctorStore.conversations.find((c) => c.id === id);
  if (!conv) return;
  const title = conv.title || t("aiDoctor.untitled");
  const body = conv.messages
    .filter((m) => !m.failed && m.content)
    .map(
      (m) =>
        `${m.role === "user" ? t("aiDoctor.shareYou") : t("aiDoctor.title")}: ${m.content}`,
    )
    .join("\n\n");
  try {
    if (navigator.share) {
      await navigator.share({ title, text: body });
    } else {
      await navigator.clipboard.writeText(`${title}\n\n${body}`);
      uiStore.showToast(t("aiDoctor.shareCopied"));
    }
  } catch (e) {
    if ((e as DOMException).name !== "AbortError")
      uiStore.showToast(t("aiDoctor.shareFailed"), "error");
  }
}

onMounted(() => {
  // روی موبایل خودکار فوکوس نمی‌کنیم تا کیبورد یهو باز نشه
  if (window.matchMedia("(pointer: fine)").matches) promptInput.value?.focus();
});
</script>

<template>
  <div class="flex h-dvh w-full gap-3 sm:p-3 lg:p-4">
    <!-- سایدبار AI (دسکتاپ): جای سایدبار اصلی رو می‌گیره؛ جمع‌شده = ریل آیکن‌ها -->
    <aside
      class="relative hidden shrink-0 overflow-hidden rounded-3xl border border-ink/5 bg-surface transition-[width] duration-300 ease-in-out motion-reduce:transition-none lg:flex"
      :class="sidebarCollapsed ? 'w-16' : 'w-72'"
    >
      <!-- لایه‌ی باز: عرض ثابت تا موقع انیمیشن محتوا reflow نشه -->
      <div
        class="flex h-full w-72 shrink-0 flex-col gap-3 p-3 transition-opacity duration-200 motion-reduce:transition-none"
        :class="
          sidebarCollapsed
            ? 'pointer-events-none opacity-0'
            : 'opacity-100 delay-100'
        "
        :inert="sidebarCollapsed || undefined"
      >
        <div class="flex items-center gap-1">
          <NuxtLink
            to="/"
            class="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-primary-50"
            :title="t('common.back')"
          >
          <img
            src="/images/logo.png"
            :alt="$t('brand.name')"
            class="h-10 w-auto object-contain"
          >
            <span
              class="min-w-0 flex-1 truncate text-base font-extrabold text-primary-800"
              >{{ t("brand.name") }}</span
            >
          </NuxtLink>
          <button
            type="button"
            class="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
            :aria-label="t('aiDoctor.search')"
            :title="t('aiDoctor.search')"
            @click="searchOpen = true"
          >
            <Icon name="lucide:search" class="size-4" />
          </button>
          <button
            type="button"
            class="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
            :aria-label="t('aiDoctor.collapseSidebar')"
            :title="t('aiDoctor.collapseSidebar')"
            @click="sidebarCollapsed = true"
          >
            <Icon
              name="lucide:panel-right-close"
              class="size-5 ltr:-scale-x-100"
            />
          </button>
        </div>

        <div class="min-h-0 flex-1">
          <ChatHistorySidebar
            :conversations="aiDoctorStore.sorted"
            :active-id="aiDoctorStore.activeId"
            @new="newChat"
            @select="selectChat"
            @rename="aiDoctorStore.rename"
            @remove="aiDoctorStore.remove"
            @pin="aiDoctorStore.togglePin"
            @share="shareChat"
          />
        </div>
        <ChatAccountCard />
      </div>

      <!-- لایه‌ی جمع‌شده: ریل آیکن‌ها؛ دکمه‌ی باز کردن به‌جای لوگو بالای ریله -->
      <div
        class="absolute inset-y-0 start-0 flex w-16 flex-col items-center gap-3 p-3 transition-opacity duration-200 motion-reduce:transition-none"
        :class="
          sidebarCollapsed
            ? 'opacity-100 delay-150'
            : 'pointer-events-none opacity-0'
        "
        :inert="!sidebarCollapsed || undefined"
      >
        <button
          type="button"
          class="flex size-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
          :aria-label="t('aiDoctor.expandSidebar')"
          :title="t('aiDoctor.expandSidebar')"
          @click="sidebarCollapsed = false"
        >
          <Icon
            name="lucide:panel-right-open"
            class="size-5 ltr:-scale-x-100"
          />
        </button>
        <div class="my-1 w-8 border-t border-ink/5" />
        <button
          type="button"
          class="flex size-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
          :aria-label="t('aiDoctor.newChat')"
          :title="t('aiDoctor.newChat')"
          @click="newChat"
        >
          <Icon name="lucide:square-pen" class="size-5" />
        </button>
        <button
          type="button"
          class="flex size-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
          :aria-label="t('aiDoctor.search')"
          :title="t('aiDoctor.search')"
          @click="searchOpen = true"
        >
          <Icon name="lucide:search" class="size-5" />
        </button>
        <NuxtLink
          to="/ai-doctor-plants"
          class="flex size-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
          :aria-label="t('aiDoctor.myPlants')"
          :title="t('aiDoctor.myPlants')"
        >
          <Icon name="lucide:sprout" class="size-5" />
        </NuxtLink>
        <div class="mt-auto">
          <NuxtLink
            :to="authStore.isLoggedIn ? '/profile' : { path: '/auth/login', query: { redirect: route.fullPath } }"
            class="flex size-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
            :aria-label="authStore.isLoggedIn ? t('nav.profile') : t('auth.login')"
            :title="authStore.isLoggedIn ? t('nav.profile') : t('auth.login')"
          >
            <UserAvatar
              v-if="authStore.isLoggedIn"
              :src="authStore.user?.avatar"
              :name="authStore.user?.name"
              class="size-8"
            />
            <Icon
              v-else
              name="lucide:log-in"
              class="size-5 rtl:-scale-x-100"
            />
          </NuxtLink>
        </div>

      </div>
    </aside>

    <!-- سایدبار تاریخچه (کشو برای موبایل و تبلت) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-150"
        leave-to-class="opacity-0"
      >
        <div
          v-if="historyOpen"
          class="fixed inset-0 z-50 bg-ink/40 lg:hidden"
          @click.self="historyOpen = false"
        >
          <aside
            class="absolute inset-y-0 start-0 flex w-[19rem] max-w-[85vw] flex-col gap-3 bg-surface p-3 shadow-xl"
            role="dialog"
            aria-modal="true"
            :aria-label="t('aiDoctor.history')"
          >
            <div class="flex items-center justify-between px-1">
              <h2 class="text-sm font-bold text-ink">
                {{ t("aiDoctor.history") }}
              </h2>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
                  :aria-label="t('aiDoctor.search')"
                  :title="t('aiDoctor.search')"
                  @click="searchOpen = true"
                >
                  <Icon name="lucide:search" class="size-5" />
                </button>
                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
                  :aria-label="t('aiDoctor.closeHistory')"
                  :title="t('aiDoctor.closeHistory')"
                  @click="historyOpen = false"
                >
                  <Icon name="lucide:x" class="size-5" />
                </button>
              </div>
            </div>
            <div class="min-h-0 flex-1">
              <ChatHistorySidebar
                :conversations="aiDoctorStore.sorted"
                :active-id="aiDoctorStore.activeId"
                @new="newChat"
                @select="selectChat"
                @rename="aiDoctorStore.rename"
                @remove="aiDoctorStore.remove"
              />
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>

    <!-- ستون چت -->
    <div
      class="flex min-w-0 flex-1 flex-col overflow-hidden border-ink/5 bg-surface sm:rounded-3xl sm:border"
    >
      <!-- هدر -->
      <header
        class="flex items-center gap-3 border-b border-ink/5 px-3 py-3 sm:px-5"
      >
        <NuxtLink
          to="/"
          class="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700 lg:hidden"
          :aria-label="t('common.back')"
          :title="t('common.back')"
        >
          <Icon name="lucide:arrow-right" class="size-5 ltr:rotate-180" />
        </NuxtLink>
        <button
          type="button"
          class="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700 lg:hidden"
          :aria-label="t('aiDoctor.openHistory')"
          :title="t('aiDoctor.openHistory')"
          @click="historyOpen = true"
        >
          <Icon name="lucide:panel-right-close" class="size-5" />
        </button>
        <span
          class="hidden size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-white/10 sm:flex"
        >
          <Icon name="lucide:stethoscope" class="size-5" />
        </span>
        <div class="min-w-0 flex-1">
          <h1 class="truncate text-base font-bold text-ink sm:text-lg">
            {{ t("aiDoctor.title") }}
          </h1>
          <p class="truncate text-xs text-ink-muted">
            {{ t("aiDoctor.subtitle") }}
          </p>
        </div>
        <button
          v-if="!aiDoctorStore.isEmpty"
          type="button"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3.5 py-2 text-xs font-medium text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700 lg:hidden"
          @click="newChat"
        >
          <Icon name="lucide:square-pen" class="size-4" />
          <span class="max-sm:sr-only">{{ t("aiDoctor.newChat") }}</span>
        </button>
      </header>

      <!-- گفتگو -->
      <ChatConversation
        ref="conversation"
        :empty="aiDoctorStore.isEmpty"
        :label="t('aiDoctor.title')"
      >
        <template #empty>
          <div
            class="m-auto flex w-full max-w-xl flex-col items-center py-4 text-center"
          >
            <div class="flex flex-col items-center gap-4">
              <img
                v-if="attachedPlants[0]"
                :src="attachedPlants[0].photo"
                :alt="attachedPlants[0].nickname"
                class="size-28 rounded-3xl object-cover shadow-sm sm:size-32"
              >
              <span
                v-else
                class="flex size-16 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-white/10"
              >
                <Icon name="lucide:leaf" class="size-8" />
              </span>
              <div>
                <h2 class="text-xl font-bold text-ink sm:text-2xl">
                  {{ greeting }}
                </h2>
              </div>
            </div>
          </div>
        </template>

        <ChatMessageItem
          v-for="(message, index) in aiDoctorStore.messages"
          :key="message.id"
          :message="message"
          :is-last="index === lastIndex"
          :streaming="
            aiDoctorStore.revealing &&
            index === lastIndex &&
            message.role === 'assistant'
          "
          @retry="aiDoctorStore.retry(activeLocale)"
          @regenerate="onRegenerate"
          @feedback="aiDoctorStore.setFeedback(message.id, $event)"
          @preview="previewUrl = $event"
        />

        <!-- در حال فکر کردن -->
        <div v-if="aiDoctorStore.waiting" class="flex w-full gap-3">
          <span
            class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-white/10"
          >
            <Icon name="lucide:stethoscope" class="size-4" />
          </span>
          <ChatLoader :label="t('aiDoctor.thinking')" />
        </div>
      </ChatConversation>

      <!-- ورودی -->
      <footer
        class="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 pb-3 pt-2"
      >
        <ChatPromptInput
          ref="promptInput"
          :streaming="aiDoctorStore.busy"
          :plants="plantOptions"
          :selected-plants="aiDoctorStore.attachedPlantIds"
          @submit="onSubmit"
          @stop="aiDoctorStore.stop()"
          @toggle-plant="aiDoctorStore.togglePlant"
        />
        <p class="text-center text-[11px] leading-5 text-ink-muted">
          {{ t("aiDoctor.disclaimer") }}
        </p>
      </footer>
    </div>

    <ChatPlantPanel
      class="hidden xl:flex"
      :options="plantOptions"
      :selected="aiDoctorStore.attachedPlantIds"
      @toggle="aiDoctorStore.togglePlant"
    />

    <!-- پیش‌نمایش عکس -->
    <Teleport to="body">
      <div
        v-if="previewUrl"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
        role="dialog"
        aria-modal="true"
        @click="previewUrl = null"
      >
        <img
          :src="previewUrl"
          :alt="t('aiDoctor.userImageAlt')"
          class="max-h-full max-w-full rounded-xl object-contain"
        >
        <button
          type="button"
          class="absolute end-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
          :aria-label="t('common.close')"
          @click="previewUrl = null"
        >
          <Icon name="lucide:x" class="size-5" />
        </button>
      </div>
    </Teleport>

    <ChatSearchDialog
      v-model="searchOpen"
      :conversations="aiDoctorStore.sorted"
      @select="selectChat"
    />
  </div>
</template>
