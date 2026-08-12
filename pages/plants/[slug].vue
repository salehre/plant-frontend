<script setup lang="ts">
import { mockDiseases } from '~/services/mock/diseases.mock'

const route = useRoute()
const plantStore = usePlantStore()

const slug = route.params.slug as string
await useAsyncData(`plant-${slug}`, () => plantStore.fetchBySlug(slug).then(() => true))

function findDisease(id: string) {
  return mockDiseases.find(d => d.id === id)
}
</script>

<template>
  <div
    v-if="plantStore.loading"
    class="mx-auto max-w-5xl px-4 py-10"
  >
    <AppSkeleton
      height="400px"
      rounded="rounded-lg"
    />
  </div>

  <div
    v-else-if="plantStore.current"
    class="mx-auto max-w-5xl px-4 py-10"
  >
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <PlantGallery
        :images="plantStore.current.images"
        :alt="plantStore.current.name"
      />

      <div class="flex flex-col gap-5">
        <PlantDetailHeader :plant="plantStore.current" />
        <p class="leading-relaxed text-ink-muted">
          {{ plantStore.current.description }}
        </p>

        <div class="flex flex-wrap gap-3">
          <WishlistButton :slug="slug" />
          <AppButton
            variant="ghost"
            @click="navigateTo(`/compare/${slug}`)"
          >
            <Icon
              name="lucide:git-compare"
              class="size-4"
            />
            مقایسه با گیاه دیگر
          </AppButton>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <h2 class="mb-4 text-lg font-bold text-ink">
        شرایط نگهداری
      </h2>
      <CareInfoCard :plant="plantStore.current" />
    </div>

    <div
      v-if="plantStore.current.commonIssues.length"
      class="mt-10"
    >
      <h2 class="mb-4 text-lg font-bold text-ink">
        مشکلات رایج
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          v-for="issueId in plantStore.current.commonIssues"
          :key="issueId"
          class="flex gap-3 rounded-lg border border-ink/5 p-4"
        >
          <template v-if="findDisease(issueId)">
            <img
              :src="findDisease(issueId)!.image"
              :alt="findDisease(issueId)!.name"
              class="size-14 shrink-0 rounded-md object-cover"
              loading="lazy"
            >
            <div>
              <p class="font-medium text-ink">
                {{ findDisease(issueId)!.name }}
              </p>
              <p class="mt-1 text-xs text-ink-muted">
                {{ findDisease(issueId)!.symptoms[0] }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>

  <div
    v-else
    class="mx-auto max-w-5xl px-4 py-20 text-center text-ink-muted"
  >
    گیاهی با این مشخصات پیدا نشد.
  </div>
</template>
