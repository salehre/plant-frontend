<script setup lang="ts">
import { en, fa } from '~/i18n/componentMessages'

const { t } = useI18n({ messages: { en, fa }, useScope: 'local' })
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
            {{ t('components.theFooter.brand') }}
          </span>
          <p class="mt-2 text-sm text-ink-muted">
            {{ t('components.theFooter.tagline') }}
          </p>
        </div>
        <div>
          <p class="mb-3 text-sm font-medium text-ink">
            {{ t('components.theFooter.platform') }}
          </p>
          <ul class="flex flex-col gap-2 text-sm text-ink-muted">
            <li>
              <NuxtLink
                to="/identify"
                class="hover:text-primary-700"
              >{{ t('components.theFooter.identify') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/plants"
                class="hover:text-primary-700"
              >{{ t('components.theFooter.encyclopedia') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/compare"
                class="hover:text-primary-700"
              >{{ t('components.theFooter.compare') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/climate"
                class="hover:text-primary-700"
              >{{ t('components.theFooter.city') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/community"
                class="hover:text-primary-700"
              >{{ t('components.theFooter.community') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/dashboard"
                class="hover:text-primary-700"
              >{{ t('components.theFooter.dashboard') }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <p class="mb-3 text-sm font-medium text-ink">
            {{ t('components.theFooter.account') }}
          </p>
          <ul class="flex flex-col gap-2 text-sm text-ink-muted">
            <li>
              <NuxtLink
                to="/my-plants"
                class="hover:text-primary-700"
              >{{ t('components.theFooter.myPlants') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/care-calendar"
                class="hover:text-primary-700"
              >{{ t('components.theFooter.careCalendar') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/profile"
                class="hover:text-primary-700"
              >{{ t('components.theFooter.profile') }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-8 border-t border-ink/5 pt-6 text-center text-xs text-ink-muted">
        {{ t('components.theFooter.poweredBy') }} <span class="text-primary-700">Saleh Rezaei</span>
      </div>
    </div>
  </footer>
</template>
