<script setup lang="ts" generic="T">
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperType } from 'swiper'
import type { SwiperOptions } from 'swiper/types'
import 'swiper/css'

// اسلایدر عمومی روی Swiper: کلاس‌های ظاهری (مثل -mx-4 px-4 برای بیرون‌زدگی لبه‌ها) از بیرون روی خود Swiper میشینن.
// هر آیتم با اسلات پیش‌فرض رندر می‌شه: <template #default="{ item, index }">...</template>
// کارت داخل اسلات باید h-full داشته باشه تا همه‌ی اسلایدها هم‌قد بشن.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  items: T[]
  itemKey?: (item: T, index: number) => string | number
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  breakpoints?: SwiperOptions['breakpoints']
  arrows?: boolean
}>(), {
  slidesPerView: 1.45,
  spaceBetween: 16,
  arrows: true,
})

defineSlots<{
  default(props: { item: T, index: number }): unknown
}>()

const { localeProperties } = useI18n()
// Swiper جهت RTL رو از attribute `dir` می‌فهمه؛ با عوض شدن زبان با key دوباره ساخته می‌شه
const dir = computed(() => localeProperties.value.dir ?? 'rtl')

const atStart = ref(true)
const atEnd = ref(true)
let instance: SwiperType | null = null

function onSwiper(swiper: SwiperType) {
  instance = swiper
}
function sync(swiper: SwiperType) {
  atStart.value = swiper.isBeginning
  atEnd.value = swiper.isEnd
}
const slidePrev = () => instance?.slidePrev()
const slideNext = () => instance?.slideNext()
</script>

<template>
  <div class="relative">
    <Swiper
      :key="dir"
      v-bind="$attrs"
      :dir="dir"
      class="-my-2 py-2"
      :slides-per-view="props.slidesPerView"
      :space-between="props.spaceBetween"
      :breakpoints="props.breakpoints"
      grab-cursor
      @swiper="onSwiper"
      @init="sync"
      @slide-change="sync"
      @from-edge="sync"
      @breakpoint="sync"
      @resize="sync"
      @update="sync"
    >
      <SwiperSlide
        v-for="(item, index) in props.items"
        :key="props.itemKey ? props.itemKey(item, index) : index"
        class="!h-auto"
      >
        <slot
          :item="item"
          :index="index"
        />
      </SwiperSlide>
    </Swiper>

    <!-- فلش‌های دسکتاپ؛ روی موبایل با کشیدن انگشت اسلاید می‌شه -->
    <template v-if="props.arrows">
      <button
        type="button"
        class="absolute start-1 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink shadow-card transition hover:bg-primary-50 hover:text-primary-700 max-md:hidden"
        :class="atStart ? 'pointer-events-none opacity-0' : 'opacity-100'"
        :aria-label="$t('components.plantDetailFull.previousImage')"
        :tabindex="atStart ? -1 : 0"
        @click="slidePrev"
      >
        <Icon
          name="lucide:chevron-left"
          class="size-5 rtl:-scale-x-100"
        />
      </button>
      <button
        type="button"
        class="absolute end-1 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink shadow-card transition hover:bg-primary-50 hover:text-primary-700 max-md:hidden"
        :class="atEnd ? 'pointer-events-none opacity-0' : 'opacity-100'"
        :aria-label="$t('components.plantDetailFull.nextImage')"
        :tabindex="atEnd ? -1 : 0"
        @click="slideNext"
      >
        <Icon
          name="lucide:chevron-right"
          class="size-5 rtl:-scale-x-100"
        />
      </button>
    </template>
  </div>
</template>