```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const blogStore = useBlogStore()
const { t } = useI18n()

const section = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let revealObserver: IntersectionObserver | null = null

onMounted(() => {
  const element = section.value
  if (!element) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    isVisible.value = true
    return
  }

  revealObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      isVisible.value = true
      revealObserver?.unobserve(element)
    },
    { threshold: 0.12, rootMargin: '0px 0px -24px 0px' },
  )
  revealObserver.observe(element)
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>

<template>
  <section
    ref="section"
    class="blog-section mx-auto w-full max-w-6xl"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <div
        class="blog-header flex items-start gap-3"
      >
        <span
          class="blog-icon mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"
        >
          <Icon
            name="lucide:book-open-text"
            class="size-5"
          />
        </span>

        <div>
          <h2
            class="text-xl font-bold text-ink sm:text-2xl"
          >
            {{ t('blog.title') }}
          </h2>

          <p
            class="mt-1 text-sm text-ink-muted"
          >
            {{ t('blog.subtitle') }}
          </p>
        </div>
      </div>

      <NuxtLink
        to="/blog"
        class="blog-see-all group inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary-600/15 bg-white px-3 py-2 text-sm font-semibold text-primary-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-600/30 hover:bg-primary-50 hover:shadow-md hover:shadow-primary-900/5"
      >
        {{ t('blog.seeAll') }}

        <Icon
          name="lucide:arrow-left"
          class="size-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:rotate-180"
        />
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      <div
        v-for="(post, index) in blogStore.featured"
        :key="post.id"
        class="blog-card-wrapper min-w-0"
        :style="{ '--card-index': index }"
      >
        <BlogCard :post="post" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-section {
  isolation: isolate;
}

.blog-header,
.blog-see-all,
.blog-card-wrapper {
  opacity: 0;
  transform: translateY(20px);
}

.blog-section.is-visible .blog-header,
.blog-section.is-visible .blog-see-all,
.blog-section.is-visible .blog-card-wrapper {
  animation: blog-rise-in 650ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
}

.blog-section.is-visible .blog-see-all {
  animation-delay: 100ms;
}

.blog-section.is-visible .blog-card-wrapper {
  animation-delay: calc(160ms + var(--card-index) * 110ms);
}

.blog-icon {
  transition:
    transform 350ms ease,
    box-shadow 350ms ease,
    background-color 350ms ease;
}

.blog-icon:hover {
  transform: translateY(-3px) rotate(-4deg);
  box-shadow: 0 8px 20px rgb(79 70 229 / 10%);
}

.blog-see-all {
  text-decoration: none;
}

.blog-see-all:hover :deep(svg) {
  transform: translateX(-3px);
}

.blog-card-wrapper {
  transition:
    transform 300ms ease,
    filter 300ms ease;
}

.blog-card-wrapper:hover {
  transform: translateY(-4px);
}

@keyframes blog-rise-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-header,
  .blog-icon,
  .blog-see-all,
  .blog-card-wrapper {
    transition: none !important;
    animation: none !important;
    opacity: 1;
  }

  .blog-card-wrapper:hover,
  .blog-icon:hover {
    transform: none;
  }
}
</style>
```