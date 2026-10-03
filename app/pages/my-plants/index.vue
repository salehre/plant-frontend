<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { mockPlants } from '~/services/mock/plants.mock'

definePageMeta({ layout: 'dashboard' }) // middleware: 'auth' فعلاً موقتاً غیرفعاله تا فرانت بدون لاگین قابل تست باشه؛ وقتی auth واقعی وصل شد برگردون

const userPlantsStore = useUserPlantsStore()
const uiStore = useUiStore()
const showAddModal = ref(false)

const plantOptions = mockPlants.map(p => ({ label: p.name, value: p.slug }))

const schema = toTypedSchema(z.object({
  nickname: z.string().min(2, 'اسم مستعار باید حداقل ۲ حرف باشد').max(30, 'اسم مستعار خیلی بلنده'),
  plantSlug: z.string().min(1, 'یک گیاه انتخاب کن'),
  location: z.string().max(40, 'محل نگهداری خیلی بلنده').optional(),
}))

const { handleSubmit, defineField, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { nickname: '', plantSlug: '', location: '' },
})

const [nickname, nicknameAttrs] = defineField('nickname')
const [plantSlug] = defineField('plantSlug')
const [location, locationAttrs] = defineField('location')

const onSubmit = handleSubmit((values) => {
  const plant = mockPlants.find(p => p.slug === values.plantSlug)
  userPlantsStore.addPlant({
    plantSlug: values.plantSlug,
    nickname: values.nickname,
    photo: plant?.images[0] ?? '/images/plants/botanical-1.webp',
    acquiredAt: new Date().toISOString().slice(0, 10),
    location: values.location || 'خانه',
    healthStatus: 'healthy',
    lastWateredAt: null,
    nextWateringAt: null,
  })
  uiStore.showToast(`${values.nickname} به گیاهان تو اضافه شد`)
  showAddModal.value = false
  resetForm()
})

function removePlant(id: string, nickname: string) {
  userPlantsStore.removePlant(id)
  uiStore.showToast(`${nickname} حذف شد`, 'info')
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-ink">
        {{ $t('myPlants') }}
      </h1>
      <AppButton
          variant="primary"
          @click="showAddModal = true"
      >
        <Icon
            name="lucide:plus"
            class="size-4"
        />
        {{ $t('common.add') }}
      </AppButton>
    </div>

    <div
        v-if="userPlantsStore.plants.length"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
          v-for="p in userPlantsStore.plants"
          :key="p.id"
          class="glass-card group relative flex flex-col overflow-hidden"
      >
        <img
            :src="p.photo"
            :alt="p.nickname"
            class="h-40 w-full object-cover"
            loading="lazy"
        >
        <div class="flex flex-1 flex-col gap-1 p-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-ink">
              {{ p.nickname }}
            </h3>
            <button
                aria-label="حذف"
                class="text-ink-muted hover:text-status-danger"
                @click="removePlant(p.id, p.nickname)"
            >
              <Icon
                  name="lucide:trash-2"
                  class="size-4"
              />
            </button>
          </div>
          <p class="text-xs text-ink-muted">
            {{ p.location }} · {{ healthLabel(p.healthStatus) }}
          </p>
          <p
              v-if="p.nextWateringAt"
              class="mt-2 flex items-center gap-1 text-xs text-primary-700"
          >
            <Icon
                name="lucide:droplets"
                class="size-3.5"
            />
            آبیاری بعدی: {{ toJalaliDate(p.nextWateringAt) }}
          </p>
        </div>
      </div>
    </div>

    <div
        v-else
        class="flex flex-col items-center gap-3 py-16 text-center text-ink-muted"
    >
      <Icon
          name="lucide:sprout"
          class="size-10"
      />
      هنوز گیاهی اضافه نکرده‌ای.
    </div>

    <AppModal
        v-model="showAddModal"
        title="افزودن گیاه جدید"
    >
      <form
          class="flex flex-col gap-4"
          novalidate
          @submit="onSubmit"
      >
        <div>
          <label class="mb-1 block text-sm text-ink">اسم مستعار</label>
          <input
              v-model="nickname"
              v-bind="nicknameAttrs"
              type="text"
              class="w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              :class="errors.nickname ? 'border-status-danger' : 'border-ink/10'"
              placeholder="مثلاً مونی"
          >
          <p
              v-if="errors.nickname"
              class="mt-1 text-xs text-status-danger"
          >
            {{ errors.nickname }}
          </p>
        </div>
        <div>
          <label class="mb-1 block text-sm text-ink">نوع گیاه</label>
          <AppDropdown
              v-model="plantSlug"
              :options="plantOptions"
              placeholder="یک گیاه انتخاب کن"
          />
          <p
              v-if="errors.plantSlug"
              class="mt-1 text-xs text-status-danger"
          >
            {{ errors.plantSlug }}
          </p>
        </div>
        <div>
          <label class="mb-1 block text-sm text-ink">محل نگهداری</label>
          <input
              v-model="location"
              v-bind="locationAttrs"
              type="text"
              class="w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              :class="errors.location ? 'border-status-danger' : 'border-ink/10'"
              placeholder="مثلاً پذیرایی"
          >
          <p
              v-if="errors.location"
              class="mt-1 text-xs text-status-danger"
          >
            {{ errors.location }}
          </p>
        </div>
        <AppButton
            type="submit"
            variant="primary"
            block
        >
          {{ $t('common.save') }}
        </AppButton>
      </form>
    </AppModal>
  </div>
</template>