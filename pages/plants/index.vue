<script setup lang="ts">
const route = useRoute()
const plantStore = usePlantStore()

plantStore.query = (route.query.q as string) ?? ''

const categories = [
  { label: 'همه دسته‌ها', value: 'all' },
  { label: 'آپارتمانی', value: 'آپارتمانی' },
  { label: 'آویز', value: 'آویز' },
  { label: 'دارویی', value: 'دارویی' },
]
const difficulties = [
  { label: 'همه سطوح مراقبت', value: 'all' },
  { label: 'آسان', value: 'easy' },
  { label: 'متوسط', value: 'medium' },
  { label: 'سخت', value: 'hard' },
]
const lightOptions = [
  { label: 'همه نیازهای نوری', value: 'all' },
  { label: 'کم‌نور', value: 'low' },
  { label: 'نور غیرمستقیم', value: 'medium' },
  { label: 'نور زیاد', value: 'high' },
  { label: 'آفتاب مستقیم', value: 'direct' },
]

// گزینه‌های فیلتر تاکسونومیک (family/genus) از دیتاست واقعی می‌آیند، نه هاردکد
const familyDropdownOptions = computed(() => [
  { label: 'همه خانواده‌ها', value: 'all' },
  ...plantStore.familyOptions.map(f => ({ label: f, value: f })),
])
const genusDropdownOptions = computed(() => [
  { label: 'همه جنس‌ها', value: 'all' },
  ...plantStore.genusOptions.map(g => ({ label: g, value: g })),
])

plantStore.category = 'all'
plantStore.difficulty = 'all'
plantStore.light = 'all'
plantStore.family = (route.query.family as string) ?? 'all'
plantStore.genus = (route.query.genus as string) ?? 'all'

const showAdvanced = ref(!!route.query.family || !!route.query.genus)

await plantStore.fetchFilterOptions()
await useAsyncData('plant-list', () => plantStore.fetchList().then(() => true), {
  watch: [
    () => plantStore.query,
    () => plantStore.category,
    () => plantStore.difficulty,
    () => plantStore.light,
    () => plantStore.family,
    () => plantStore.genus,
  ],
})

watch(
  [() => plantStore.query, () => plantStore.category, () => plantStore.difficulty, () => plantStore.light, () => plantStore.genus],
  () => plantStore.fetchList(),
)

// وقتی خانواده عوض میشه، لیست جنس‌ها باید دوباره محاسبه بشه و جنس انتخاب‌شده‌ی قبلی معتبر نمونه
watch(
  () => plantStore.family,
  async () => {
    plantStore.genus = 'all'
    await plantStore.fetchFilterOptions()
    await plantStore.fetchList()
  },
)

function resetFilters() {
  plantStore.category = 'all'
  plantStore.difficulty = 'all'
  plantStore.light = 'all'
  plantStore.family = 'all'
  plantStore.genus = 'all'
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10">
    <h1 class="mb-2 text-2xl font-bold text-ink">
      {{ $t('nav.catalog') }}
    </h1>
    <p class="mb-6 text-ink-muted">
      هر آنچه برای شناخت و انتخاب گیاه مناسب نیاز داری.
    </p>

    <div class="mb-4 flex flex-col gap-3 sm:flex-row">
      <div class="relative flex-1">
        <SearchSuggestions v-model="plantStore.query" />
      </div>
      <div class="sm:w-52">
        <AppDropdown
          v-model="plantStore.category"
          :options="categories"
        />
      </div>
      <AppButton
        variant="ghost"
        @click="showAdvanced = !showAdvanced"
      >
        <Icon
          name="lucide:sliders-horizontal"
          class="size-4"
        />
        فیلتر پیشرفته
      </AppButton>
    </div>

    <Transition name="dropdown-fade">
      <div
        v-if="showAdvanced"
        class="mb-6 flex flex-col flex-wrap gap-3 rounded-lg bg-primary-50/50 p-4 sm:flex-row sm:items-center"
      >
        <div class="sm:w-56">
          <AppDropdown
            v-model="plantStore.difficulty"
            :options="difficulties"
          />
        </div>
        <div class="sm:w-56">
          <AppDropdown
            v-model="plantStore.light"
            :options="lightOptions"
          />
        </div>
        <div class="sm:w-56">
          <AppDropdown
            v-model="plantStore.family"
            :options="familyDropdownOptions"
            placeholder="خانواده (Family)"
          />
        </div>
        <div class="sm:w-56">
          <AppDropdown
            v-model="plantStore.genus"
            :options="genusDropdownOptions"
            placeholder="جنس (Genus)"
          />
        </div>
        <button
          class="text-sm text-primary-700 hover:underline"
          @click="resetFilters"
        >
          پاک کردن فیلترها
        </button>
      </div>
    </Transition>

    <div
      v-if="plantStore.loading"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      <div
        v-for="i in 8"
        :key="i"
        class="flex flex-col gap-2"
      >
        <AppSkeleton
          height="180px"
          rounded="rounded-lg"
        />
        <AppSkeleton
          height="1rem"
          width="70%"
        />
        <AppSkeleton
          height="0.75rem"
          width="50%"
        />
      </div>
    </div>

    <div
      v-else-if="plantStore.list.length"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      <PlantCard
        v-for="plant in plantStore.list"
        :key="plant.id"
        :plant="plant"
      />
    </div>

    <div
      v-else
      class="flex flex-col items-center gap-3 py-16 text-center"
    >
      <Icon
        name="lucide:search-x"
        class="size-10 text-ink-muted"
      />
      <p class="text-ink-muted">
        گیاهی با این مشخصات پیدا نشد. عبارت دیگری را امتحان کن.
      </p>
    </div>
  </div>
</template>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.15s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
