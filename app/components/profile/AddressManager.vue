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
        <AddressIcon
          :label="preset"
          class="size-4"
        />
        {{ preset }}
      </button>
      <AppButton
        type="button"
        class="ms-auto"
        @click="add"
      >
        <Icon
          name="lucide:plus"
          class="size-4"
        />
        {{ t('pages.profile.addAddress') }}
      </AppButton>
    </div>

    <!-- لیست آدرس‌ها -->
    <ul
      v-if="rows.length"
      class="mt-5 divide-y divide-ink/5 border-t border-ink/5"
    >
      <li
        v-for="row in rows"
        :key="row.id"
        class="flex items-center gap-3 py-3.5"
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
          <span class="flex items-center gap-2">
            <span class="truncate text-sm font-bold text-ink">{{ row.label || row.cityName }}</span>
            <span
              v-if="row.isActive"
              class="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700"
            >
              {{ t('pages.profile.addressDefault') }}
            </span>
          </span>
          <span
            v-if="row.label"
            class="block truncate text-xs text-ink-muted"
          >{{ row.cityName }}</span>
        </span>
        <button
          v-if="!row.isActive"
          type="button"
          class="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-primary-50 hover:text-primary-700"
          :aria-label="t('pages.profile.addressSetDefault')"
          :title="t('pages.profile.addressSetDefault')"
          @click="addressStore.setActive(row.id)"
        >
          <Icon
            name="lucide:star"
            class="size-4"
          />
        </button>
        <button
          type="button"
          class="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-status-danger/10 hover:text-status-danger"
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