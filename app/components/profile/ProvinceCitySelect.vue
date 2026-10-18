<script setup lang="ts">
import { getMockCities, mockCities } from '~/services/mock/climate.mock'

/**
 * انتخاب دو مرحله‌ای: اول استان، بعد شهرِ همون استان.
 * v-model = id شهر. دو فیلد رو به‌صورت دو ستون جدا رندر می‌کنه تا والد توی گریدش بچینه.
 */
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const { t, locale } = useI18n()
const activeLocale = computed(() => locale.value === 'fa' ? 'fa' : 'en')
const cities = computed(() => getMockCities(activeLocale.value))

// کلید استان همیشه نام فارسیه تا با عوض‌شدن زبان انتخاب کاربر خراب نشه؛ برچسبش بر اساس زبان فعلیه
const provinceKeyByCity = new Map(mockCities.map(c => [c.id, c.province]))
const provinceOptions = computed(() => {
  const seen = new Map<string, string>()
  for (const city of cities.value) {
    const key = provinceKeyByCity.get(city.id) ?? city.province
    if (!seen.has(key)) seen.set(key, city.province)
  }
  return [...seen].map(([value, label]) => ({ label, value }))
})

const provinceId = ref(provinceKeyByCity.get(props.modelValue) ?? '')

const cityOptions = computed(() =>
  cities.value
    .filter(c => provinceKeyByCity.get(c.id) === provinceId.value)
    .map(c => ({ label: c.name, value: c.id })),
)

// عوض‌کردن استان شهر قبلی رو پاک می‌کنه؛ اگه استان فقط یک شهر داشته باشه همون انتخاب می‌شه
watch(provinceId, (key) => {
  if (provinceKeyByCity.get(props.modelValue) === key) return
  emit('update:modelValue', cityOptions.value.length === 1 ? cityOptions.value[0]!.value : '')
})

// اگه والد شهر رو از بیرون عوض کرد (مثلاً ریست یا انتخاب برنامه‌ای)، استان هم هماهنگ می‌شه
watch(() => props.modelValue, (id) => {
  const key = provinceKeyByCity.get(id)
  if (key && key !== provinceId.value) provinceId.value = key
})
</script>

<template>
  <div>
    <label class="mb-1 block text-sm font-medium text-ink">{{ t('pages.profile.addressProvince') }}</label>
    <AppDropdown
      v-model="provinceId"
      :options="provinceOptions"
      :placeholder="t('pages.profile.addressSelectProvince')"
    />
  </div>
  <div>
    <label class="mb-1 block text-sm font-medium text-ink">{{ t('pages.profile.addressCity') }}</label>
    <!-- تا استان انتخاب نشده غیرفعاله -->
    <div
      :class="provinceId ? '' : 'pointer-events-none opacity-50'"
      :aria-disabled="!provinceId"
    >
      <AppDropdown
        :key="provinceId"
        :model-value="modelValue"
        :options="cityOptions"
        :placeholder="provinceId ? t('pages.profile.addressSelectCity') : t('pages.profile.addressSelectProvinceFirst')"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>