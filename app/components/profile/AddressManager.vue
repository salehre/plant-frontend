<script setup lang="ts">
import { getMockCities } from '~/services/mock/climate.mock'

const { t, locale } = useI18n()
const addressStore = useAddressStore()
const uiStore = useUiStore()

const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')
const cities = computed(() => getMockCities(activeLocale.value))

const cityId = ref('')
// بعد از افزودن آدرس، با عوض‌شدن key فرم انتخاب استان/شهر از نو ساخته می‌شه
const formKey = ref(0)
const label = ref('')
const presets = computed(() => [t('pages.profile.addressHome'), t('pages.profile.addressWork'), t('pages.profile.addressOther')])

const rows = computed(() =>
  addressStore.items.map((address) => {
    const city = cities.value.find(c => c.id === address.cityId)
    return {
      ...address,
      cityName: city ? `${city.name} · ${city.province}` : address.cityId,
      isActive: addressStore.active?.id === address.id,
    }
  }),
)

function add() {
  if (!cityId.value) {
    uiStore.showToast(t('pages.profile.addressSelectCity'), 'error')
    return
  }
  const added = addressStore.add(cityId.value, label.value)
  if (!added) {
    uiStore.showToast(t('pages.profile.addressDuplicate'), 'info')
    return
  }
  uiStore.showToast(t('pages.profile.addressAdded'))
  cityId.value = ''
  label.value = ''
  formKey.value++
}

// انتخاب آدرس پیش‌فرض (همون آدرسی که توی «گیاه مناسب شهر تو» اول نشون داده می‌شه)
function selectDefault(row: (typeof rows.value)[number]) {
  if (row.isActive) return
  addressStore.setActive(row.id)
  uiStore.showToast(t('pages.profile.addressDefaultSet', { name: row.label || row.cityName }))
}

// حذف آدرس بعد از تأیید کاربر
const pendingRemove = ref<(typeof rows.value)[number] | null>(null)
const confirmOpen = computed({
  get: () => !!pendingRemove.value,
  set: (open: boolean) => { if (!open) pendingRemove.value = null },
})

function askRemove(row: (typeof rows.value)[number]) {
  pendingRemove.value = row
}

function confirmRemove() {
  if (!pendingRemove.value) return
  addressStore.remove(pendingRemove.value.id)
  pendingRemove.value = null
  uiStore.showToast(t('pages.profile.addressRemoved'), 'info')
}
</script>

<template>
  <div class="glass-card p-4 sm:p-5">
    <h2 class="font-bold text-ink">
      {{ t('pages.profile.addresses') }}
    </h2>
    <p class="mt-1 text-sm leading-6 text-ink-muted">
      {{ t('pages.profile.addressesDescription') }}
    </p>

    <!-- افزودن آدرس -->
    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      <ProvinceCitySelect
        :key="formKey"
        v-model="cityId"
      />
      <div>
        <label class="mb-1 block text-sm font-medium text-ink">{{ t('pages.profile.addressLabel') }}</label>
        <input
          v-model="label"
          type="text"
          maxlength="24"
          class="field"
          :placeholder="t('pages.profile.addressLabelPlaceholder')"
          @keydown.enter.prevent="add"
        >
      </div>
    </div>

    <div class="mt-3 flex flex-wrap items-center gap-2">
      <button
        v-for="preset in presets"
        :key="preset"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1 text-xs text-ink-muted transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
        @click="label = preset"
      >
 
        {{ preset }}
      </button>
      <AppButton
        type="button"
        class="ms-auto"
        @click="add"
      >
        {{ t('pages.profile.addAddress') }}
      </AppButton>
    </div>

    <!-- لیست آدرس‌ها: انتخاب آدرس پیش‌فرض -->
    <div v-if="rows.length">
      <ul
        class="mt-5 flex flex-col gap-2"
        role="radiogroup"
        :aria-label="t('pages.profile.addressDefaultTitle')"
      >
        <li
          v-for="row in rows"
          :key="row.id"
          class="flex items-center gap-1 rounded-2xl border p-1.5 transition-colors"
          :class="row.isActive ? 'border-primary-500/60 bg-primary-50/60' : 'border-ink/10 hover:border-primary-300'"
        >
          <button
            type="button"
            role="radio"
            :aria-checked="row.isActive"
            :title="row.isActive ? undefined : t('pages.profile.addressSetDefault')"
            class="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1.5 text-start"
            @click="selectDefault(row)"
          >
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-xl"
              :class="row.isActive ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700'"
            >
              <AddressIcon
                :label="row.label"
                class="size-5"
              />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-bold text-ink">{{ row.label || row.cityName }}</span>
              <span
                v-if="row.label"
                class="block truncate text-xs text-ink-muted"
              >{{ row.cityName }}</span>
            </span>
            <!-- ستاره‌ی پیش‌فرض -->
            <svg
              viewBox="0 0 24 24"
              class="size-5 shrink-0 transition-colors"
              :class="row.isActive ? 'text-primary-700' : 'text-ink-muted/50'"
              :fill="row.isActive ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              role="img"
              :aria-label="row.isActive ? t('pages.profile.addressDefault') : undefined"
              :aria-hidden="row.isActive ? undefined : true"
            >
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
          </button>
          <button
            type="button"
            class="flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-status-danger/10 hover:text-status-danger"
            :aria-label="t('pages.profile.addressRemove')"
            :title="t('pages.profile.addressRemove')"
            @click="askRemove(row)"
          >
            <Icon
              name="lucide:trash-2"
              class="size-4"
            />
          </button>
        </li>
      </ul>
    </div>
    <p
      v-else
      class="mt-5 rounded-xl bg-primary-50/60 px-4 py-6 text-center text-sm text-ink-muted"
    >
      {{ t('pages.profile.addressEmpty') }}
    </p>
    <!-- تأیید حذف آدرس -->
    <AppModal
      v-model="confirmOpen"
      :title="t('pages.profile.addressRemoveTitle')"
    >
      <div class="flex items-start gap-3">
        <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-status-danger/10 text-status-danger">
          <Icon
            name="lucide:trash-2"
            class="size-5"
          />
        </span>
        <p class="text-sm leading-7 text-ink-muted">
          {{ t('pages.profile.addressRemoveConfirm', { name: pendingRemove?.label || pendingRemove?.cityName || '' }) }}
        </p>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <AppButton
          variant="secondary"
          @click="confirmOpen = false"
        >
          {{ t('common.cancel') }}
        </AppButton>
        <AppButton
          variant="danger"
          @click="confirmRemove"
        >
          {{ t('common.delete') }}
        </AppButton>
      </div>
    </AppModal>
  </div>
</template>