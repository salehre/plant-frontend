<script setup lang="ts">
</script>

<template>
  <footer class="mt-16 border-t border-ink/5 bg-surface">
    <div class="mx-auto max-w-6xl px-4 py-10">
      <div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
        <div class="col-span-2 sm:col-span-1">
          <span class="flex items-center gap-2 text-lg font-bold text-primary-700">
            <Icon
              name="lucide:leaf"
              class="size-5"
            />
            برگ‌یار
          </span>
          <p class="mt-2 text-sm text-ink-muted">
            پلتفرم هوشمند شناخت و مراقبت از گیاهان
          </p>
        </div>
        <div>
          <p class="mb-3 text-sm font-medium text-ink">
            پلتفرم
          </p>
          <ul class="flex flex-col gap-2 text-sm text-ink-muted">
            <li>
              <NuxtLink
                to="/identify"
                class="hover:text-primary-700"
              >تشخیص گیاه</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/plants"
                class="hover:text-primary-700"
              >دایرةالمعارف گیاهان</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/compare"
                class="hover:text-primary-700"
              >مقایسه گیاهان</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/climate"
                class="hover:text-primary-700"
              >گیاه مناسب شهر</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/community"
                class="hover:text-primary-700"
              >انجمن گیاه‌دوستان</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/dashboard"
                class="hover:text-primary-700"
              >داشبورد</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <p class="mb-3 text-sm font-medium text-ink">
            حساب کاربری
          </p>
          <ul class="flex flex-col gap-2 text-sm text-ink-muted">
            <li>
              <NuxtLink
                to="/my-plants"
                class="hover:text-primary-700"
              >گیاهان من</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/care-calendar"
                class="hover:text-primary-700"
              >تقویم مراقبت</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/profile"
                class="hover:text-primary-700"
              >پروفایل</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-8 border-t border-ink/5 pt-6 text-center text-xs text-ink-muted">
        powered By <span class="text-primary-700"> Saleh Rezaei</span>
      </div>
    </div>
  </footer>
</template>
