<script setup lang="ts">
const { t } = useI18n()

const rows = computed(() => [
  { to: '/about', icon: 'lucide:info', label: t('components.theFooter.about') },
  { to: '/support', icon: 'lucide:life-buoy', label: t('support.nav') },
  { to: '/tickets', icon: 'lucide:message-square-text', label: t('components.theFooter.tickets') },
  { to: '/contact', icon: 'lucide:mail', label: t('components.theFooter.contact') },
  { to: '/terms', icon: 'lucide:file-text', label: t('components.theFooter.terms') },
  { to: '/privacy', icon: 'lucide:shield-check', label: t('components.theFooter.privacy') },
])
</script>

<template>
  <div class="glass-card p-4 sm:p-5">
    <h2 class="mb-2 font-bold text-ink">
      {{ t('components.theFooter.about') }}
    </h2>
    <ul class="divide-y divide-ink/5">
      <li
        v-for="row in rows"
        :key="row.to"
      >
        <NuxtLink
          :to="row.to"
          class="flex items-center gap-3 py-4"
        >
          <Icon
            :name="row.icon"
            class="size-5 shrink-0 text-primary-700"
          />
          <span class="flex-1 text-sm font-medium text-ink">{{ row.label }}</span>
          <Icon
            name="lucide:chevron-left"
            class="size-4 shrink-0 text-ink-muted ltr:rotate-180"
          />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
