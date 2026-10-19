<script setup lang="ts">
// اسکلتون هم‌ساختار با pages/plants/[slug].vue: هیرو/هدر موبایل و دسکتاپ، شیت، تب‌ها، آمار، دو ستون سکشن و گالری.
// کلاس‌های ریسپانسیو (max-md:hidden / md:hidden / tabShow) عیناً مثل صفحه‌ی اصلیه.
const taxonomyRows = 8
const morphologyItems = 6
const growthRows = 5
</script>

<template>
  <div
    class="plant-detail-skeleton text-readable pb-10"
    aria-hidden="true"
  >
    <!-- ========== هیرو موبایل ========== -->
    <div class="relative -mx-4 -mt-4 h-[320px] animate-pulse bg-ink/10 sm:-mx-6 md:hidden">
      <div class="absolute start-4 top-4 size-10 rounded-full bg-surface/70" />
      <div class="absolute end-4 top-4 flex items-center gap-2">
        <div class="size-10 rounded-full bg-surface/70" />
        <div class="size-10 rounded-full bg-surface/70" />
        <div class="size-10 rounded-full bg-surface/70" />
      </div>
    </div>

    <!-- ========== هدر دسکتاپ ========== -->
    <div class="glass-card flex flex-col gap-5 p-4 max-md:hidden sm:flex-row sm:p-6">
      <div class="aspect-square w-full shrink-0 animate-pulse rounded-2xl bg-ink/10 sm:size-56 sm:w-56 lg:size-64 lg:w-64" />

      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <!-- h1: text-2xl (۲rem) / sm:text-3xl (۲.۲۵rem) -->
            <div class="flex h-8 items-center sm:h-9">
              <AppSkeleton
                height="1.5rem"
                width="14rem"
              />
            </div>
            <!-- نام علمی: text-sm (۱.۲۵rem) / sm:text-base (۱.۵rem) -->
            <div class="flex h-5 items-center sm:h-6">
              <AppSkeleton
                height="0.875rem"
                width="9rem"
              />
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <AppSkeleton
              v-for="i in 3"
              :key="i"
              height="2.25rem"
              width="2.25rem"
              rounded="rounded-xl"
            />
          </div>
        </div>

        <!-- چیپ‌ها: py-1 + text-xs = ۱.۵rem -->
        <div class="flex flex-wrap gap-2">
          <AppSkeleton
            height="1.5rem"
            width="6.5rem"
            rounded="rounded-full"
          />
          <AppSkeleton
            height="1.5rem"
            width="6rem"
            rounded="rounded-full"
          />
          <AppSkeleton
            height="1.5rem"
            width="9.5rem"
            rounded="rounded-full"
          />
        </div>

        <!-- Authority: text-xs -->
        <div class="flex h-4 items-center">
          <AppSkeleton
            height="0.625rem"
            width="10rem"
          />
        </div>

        <!-- نیازهای اصلی: p-3 + text-sm = ۲.۷۵rem -->
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="i in 2"
            :key="i"
            class="flex h-11 items-center gap-2.5 rounded-xl bg-primary-50/70 px-3"
          >
            <AppSkeleton
              height="1.25rem"
              width="1.25rem"
              rounded="rounded-full"
            />
            <AppSkeleton
              height="0.75rem"
              width="45%"
            />
          </div>
        </div>

        <!-- دکمه‌ی افزودن به باغ: AppButton md = ۲.۵rem -->
        <div class="mt-auto pt-1">
          <AppSkeleton
            height="2.5rem"
            width="9.5rem"
            rounded="rounded-[var(--radius-control)]"
          />
        </div>
      </div>
    </div>

    <!-- ========== شیت اصلی ========== -->
    <div class="detail-sheet pt-6 max-md:relative max-md:-mx-4 max-md:-mt-7 max-md:rounded-t-[28px] max-md:bg-surface max-md:px-4 max-md:pt-5 sm:max-md:-mx-6 sm:max-md:px-6">
      <!-- ----- هدر موبایل: نام، چیپ‌ها، تب‌ها، نمای کلی ----- -->
      <div class="md:hidden">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <!-- h1: text-2xl (۲rem) -->
            <div class="flex h-8 items-center">
              <AppSkeleton
                height="1.5rem"
                width="11rem"
              />
            </div>
            <!-- mt-0.5 + text-sm (۱.۲۵rem) -->
            <div class="mt-0.5 flex h-5 items-center">
              <AppSkeleton
                height="0.875rem"
                width="8rem"
              />
            </div>
          </div>
        </div>

        <!-- چیپ‌ها: border + py-1 + text-xs -->
        <div class="mt-3 flex flex-wrap gap-2">
          <AppSkeleton
            height="1.625rem"
            width="5.5rem"
            rounded="rounded-full"
          />
          <AppSkeleton
            height="1.625rem"
            width="4.5rem"
            rounded="rounded-full"
          />
          <AppSkeleton
            height="1.625rem"
            width="5rem"
            rounded="rounded-full"
          />
        </div>

        <!-- تب‌ها: pb-3 + text-sm = ۲rem -->
        <div class="-mx-4 mt-4 flex gap-6 overflow-hidden border-b border-ink/10 px-4 sm:-mx-6 sm:px-6">
          <div
            v-for="(w, i) in ['3.5rem', '4rem', '6rem', '4.5rem']"
            :key="i"
            class="flex h-8 shrink-0 items-start pt-0.5"
          >
            <AppSkeleton
              height="0.875rem"
              :width="w"
            />
          </div>
        </div>

        <!-- تب نمای کلی -->
        <div class="flex flex-col gap-6 pt-4">
          <section class="glass-card mobile-card p-5">
            <!-- text-sm leading-7 (۱.۷۵rem) × ۴ خط -->
            <div
              v-for="(w, i) in ['100%', '100%', '92%', '60%']"
              :key="i"
              class="flex h-7 items-center"
            >
              <AppSkeleton
                height="0.75rem"
                :width="w"
              />
            </div>
          </section>

          <ul class="glass-card mobile-card divide-y divide-ink/10 px-5 py-2">
            <li
              v-for="i in 4"
              :key="i"
              class="flex items-center gap-3 py-3"
            >
              <AppSkeleton
                height="1.25rem"
                width="1.25rem"
                rounded="rounded-full"
              />
              <AppSkeleton
                height="0.75rem"
                width="3.5rem"
              />
              <AppSkeleton
                class="ms-auto"
                height="0.75rem"
                width="40%"
              />
            </li>
          </ul>
        </div>
      </div>

      <!-- ----- آمار سریع (فقط دسکتاپ) ----- -->
      <div class="grid grid-cols-2 gap-3 max-md:hidden sm:grid-cols-4 sm:gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="glass-card flex flex-col items-center justify-center gap-1.5 px-3 py-4"
        >
          <div class="flex h-5 items-center">
            <AppSkeleton
              height="0.75rem"
              width="6rem"
            />
          </div>
          <div class="flex h-4 items-center">
            <AppSkeleton
              height="0.5rem"
              width="3rem"
            />
          </div>
        </div>
      </div>

      <!-- ----- محتوای اصلی ----- -->
      <div class="mt-6 grid grid-cols-1 gap-6 md:mt-8 lg:grid-cols-12">
        <!-- ستون اول -->
        <div class="flex flex-col gap-6 max-md:contents lg:col-span-7">
          <!-- طبقه‌بندی علمی (جدول: هر ردیف py-3 + text-xs = ۲.۵rem) -->
          <PlantDetailSectionSkeleton
            class="max-md:hidden"
            title-width="8rem"
          >
            <div class="overflow-hidden rounded-md">
              <div
                v-for="i in taxonomyRows"
                :key="i"
                class="flex h-10 border-b border-ink/10 last:border-0"
              >
                <div class="flex w-2/5 items-center justify-center bg-bg">
                  <AppSkeleton
                    height="0.625rem"
                    width="45%"
                  />
                </div>
                <div class="flex flex-1 items-center justify-center">
                  <AppSkeleton
                    height="0.625rem"
                    width="40%"
                  />
                </div>
              </div>
            </div>
          </PlantDetailSectionSkeleton>

          <!-- ویژگی‌های زیست‌شناسی -->
          <PlantDetailSectionSkeleton
            class="max-md:hidden"
            title-width="9rem"
          >
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="i in morphologyItems"
                :key="i"
                class="rounded-md border border-ink/10 bg-bg p-3"
              >
                <div class="flex items-center gap-1.5 border-b border-dashed border-ink/15 pb-2">
                  <AppSkeleton
                    height="1.75rem"
                    width="1.75rem"
                    rounded="rounded-full"
                  />
                  <AppSkeleton
                    height="0.625rem"
                    width="40%"
                  />
                </div>
                <!-- text-sm leading-relaxed × ۲ خط -->
                <div class="mt-2">
                  <div class="flex h-[1.42rem] items-center">
                    <AppSkeleton
                      height="0.75rem"
                      width="90%"
                    />
                  </div>
                  <div class="flex h-[1.42rem] items-center">
                    <AppSkeleton
                      height="0.75rem"
                      width="60%"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PlantDetailSectionSkeleton>

          <!-- کاربردها: ۳ کارت جدا، هر کدوم آیکن گرد (size-9) + عنوان، خط‌چین و لیست (space-y-1.5) -->
          <PlantDetailSectionSkeleton
            class="max-md:hidden"
            title-width="6rem"
          >
            <div class="space-y-3">
              <div
                v-for="i in 3"
                :key="i"
                class="rounded-md border border-ink/10 bg-bg p-3"
              >
                <div class="flex items-center gap-2.5 border-b border-dashed border-ink/15 pb-2.5">
                  <AppSkeleton
                    height="2.25rem"
                    width="2.25rem"
                    rounded="rounded-full"
                  />
                  <AppSkeleton
                    height="0.75rem"
                    width="5rem"
                  />
                </div>
                <div class="mt-2.5 space-y-1.5">
                  <div
                    v-for="(w, j) in ['80%', '65%']"
                    :key="j"
                    class="flex h-5 items-center"
                  >
                    <AppSkeleton
                      height="0.75rem"
                      :width="w"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PlantDetailSectionSkeleton>

          <!-- ترکیبات شیمیایی -->
          <section
            class="glass-card p-5 sm:p-6 max-md:hidden"
            aria-hidden="true"
          >
            <div class="flex items-center justify-between gap-3">
              <AppSkeleton
                height="1rem"
                width="8rem"
              />
              <AppSkeleton
                height="2.25rem"
                width="2.25rem"
                rounded="rounded-lg"
              />
            </div>
            <div class="mb-4" />
            <!-- py-3 + label text-xs (۱rem) + مقدار text-sm (۱.۲۵rem) -->
            <div class="rounded-md border-s-4 border-ink/10 bg-bg px-4 py-3">
              <div class="flex h-4 items-center">
                <AppSkeleton
                  height="0.5rem"
                  width="35%"
                />
              </div>
              <div class="flex h-5 items-center">
                <AppSkeleton
                  height="0.75rem"
                  width="55%"
                />
              </div>
            </div>
          </section>
        </div>

        <!-- ستون دوم -->
        <div class="flex flex-col gap-6 max-md:contents lg:col-span-5">
          <!-- نیازهای رشدی -->
          <PlantDetailSectionSkeleton
            class="max-md:hidden"
            title-width="8rem"
          >
            <div class="flex flex-col gap-3">
              <div
                v-for="i in growthRows"
                :key="i"
                class="flex items-center gap-3 border-b border-ink/10 pb-3 last:border-0 last:pb-0"
              >
                <AppSkeleton
                  height="2rem"
                  width="2rem"
                  rounded="rounded-full"
                />
                <div class="flex-1">
                  <div class="mb-2 flex h-4 items-center">
                    <AppSkeleton
                      height="0.5rem"
                      width="4rem"
                    />
                  </div>
                  <div class="flex h-5 items-center">
                    <AppSkeleton
                      height="0.75rem"
                      width="70%"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PlantDetailSectionSkeleton>

          <!-- داستان گیاه (موبایل هم دیده می‌شه) — text-sm leading-6 × ۵ خط -->
          <PlantDetailSectionSkeleton
            class="mobile-card"
            title-width="6rem"
          >
            <div
              v-for="(w, i) in ['100%', '100%', '100%', '94%', '55%']"
              :key="i"
              class="flex h-6 items-center"
            >
              <AppSkeleton
                height="0.75rem"
                :width="w"
              />
            </div>
          </PlantDetailSectionSkeleton>

          <!-- سمّیت -->
          <PlantDetailSectionSkeleton
            class="max-md:hidden"
            title-width="5rem"
          >
            <div class="flex items-center gap-3 rounded-md border-s-4 border-ink/10 bg-ink/5 px-4 py-3">
              <AppSkeleton
                height="1.25rem"
                width="1.25rem"
                rounded="rounded-full"
              />
              <div class="flex flex-1 flex-col">
                <div class="flex h-5 items-center">
                  <AppSkeleton
                    height="0.75rem"
                    width="90%"
                  />
                </div>
                <div class="flex h-5 items-center">
                  <AppSkeleton
                    height="0.75rem"
                    width="50%"
                  />
                </div>
              </div>
            </div>
          </PlantDetailSectionSkeleton>

          <!-- مشکلات رایج: کارت‌ها rounded-md border p-3 با عکس size-14 -->
          <PlantDetailSectionSkeleton
            class="max-md:hidden"
            title-width="7rem"
          >
            <div class="flex flex-col gap-3">
              <div
                v-for="i in 2"
                :key="i"
                class="flex gap-3 rounded-md border border-ink/10 p-3"
              >
                <AppSkeleton
                  height="3.5rem"
                  width="3.5rem"
                  rounded="rounded-md"
                />
                <div class="flex flex-1 flex-col">
                  <div class="flex h-5 items-center">
                    <AppSkeleton
                      height="0.75rem"
                      width="55%"
                    />
                  </div>
                  <div class="mt-1 flex h-4 items-center">
                    <AppSkeleton
                      height="0.625rem"
                      width="80%"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PlantDetailSectionSkeleton>

          <!-- حفاظت -->
          <PlantDetailSectionSkeleton
            class="max-md:hidden"
            title-width="5rem"
          >
            <div class="flex items-center gap-3 rounded-md border-s-4 border-ink/10 bg-ink/5 px-4 py-3">
              <AppSkeleton
                height="1.25rem"
                width="1.25rem"
                rounded="rounded-full"
              />
              <AppSkeleton
                height="0.75rem"
                width="60%"
              />
            </div>
          </PlantDetailSectionSkeleton>

          <!-- نام‌های محلی (موبایل هم دیده می‌شه): چیپ‌ها px-3.5 py-1.5 + text-sm = ۲rem -->
          <PlantDetailSectionSkeleton
            class="mobile-card"
            title-width="6rem"
          >
            <div class="flex flex-wrap gap-3">
              <AppSkeleton
                v-for="(w, i) in ['6rem', '7rem', '5.5rem', '6.5rem']"
                :key="i"
                height="2rem"
                :width="w"
                rounded="rounded-lg"
              />
            </div>
          </PlantDetailSectionSkeleton>

          <!-- مترادف‌های علمی: هر ردیف text-sm + pb-2.5 -->
          <PlantDetailSectionSkeleton
            class="max-md:hidden"
            title-width="8rem"
          >
            <div class="flex flex-col gap-2.5">
              <div
                v-for="(w, i) in ['70%', '55%', '65%']"
                :key="i"
                class="flex items-center gap-2 border-b border-ink/10 pb-2.5 last:border-0 last:pb-0"
              >
                <div class="flex h-5 flex-1 items-center">
                  <AppSkeleton
                    height="0.75rem"
                    :width="w"
                  />
                </div>
              </div>
            </div>
          </PlantDetailSectionSkeleton>

          <!-- دوره فسیلی: text-sm leading-relaxed × ۲ خط -->
          <PlantDetailSectionSkeleton
            class="max-md:hidden"
            title-width="6rem"
          >
            <div class="flex h-[1.42rem] items-center">
              <AppSkeleton
                height="0.75rem"
                width="85%"
              />
            </div>
            <div class="flex h-[1.42rem] items-center">
              <AppSkeleton
                height="0.75rem"
                width="45%"
              />
            </div>
          </PlantDetailSectionSkeleton>
        </div>
      </div>

      <!-- ----- گالری تصاویر (موبایل هم دیده می‌شه) ----- -->
      <section class="glass-card mobile-card mt-7 overflow-hidden p-5 max-md:mt-6">
        <div class="flex h-6 items-center">
          <AppSkeleton
            height="1rem"
            width="5rem"
          />
        </div>
        <div class="mb-4" />
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <div
            v-for="i in 4"
            :key="i"
            class="overflow-hidden rounded-lg border border-ink/10"
          >
            <div class="h-[140px] animate-pulse bg-ink/10 sm:h-[180px]" />
            <!-- p-2 + text-xs (۱rem) -->
            <div class="flex h-8 items-center justify-center">
              <AppSkeleton
                height="0.5rem"
                width="50%"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ----- دکمه‌ی ثابت پایین (موبایل) ----- -->
    <div
      class="fixed inset-x-0 bottom-0 z-40 border-t border-ink/5 bg-surface/90 px-4 pt-3 backdrop-blur md:hidden"
      style="padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));"
    >
      <div class="h-12 w-full animate-pulse rounded-xl bg-ink/10" />
    </div>
  </div>
</template>

<style>
/* موبایل: سکشن‌ها داخل شیت سفید تخت می‌شن (مثل <style scoped> صفحه‌ی اصلی) */
@media (max-width: 767px) {
  .plant-detail-skeleton .detail-sheet .glass-card:not(.mobile-card) {
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
  }
}
</style>