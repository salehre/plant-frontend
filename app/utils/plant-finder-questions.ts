import type { FinderQuestion } from '~/types/plant-finder.types'

/**
 * ساختار سؤال‌های «پیدا کردن گیاه» (id، آیکن و value گزینه‌ها).
 * متن عنوان و گزینه‌ها توی i18n ریشه‌ست:
 *   home.plantFinder.questions.<id>.title
 *   home.plantFinder.questions.<id>.options.<value>
 * پس برای اضافه‌کردن سؤال یا گزینه‌ی جدید، هم این فایل و هم fa.json/en.json رو آپدیت کن.
 */
export const plantFinderQuestions: FinderQuestion[] = [
  {
    id: 'place',
    icon: 'lucide:map-pin',
    options: [
      { value: 'living', icon: 'lucide:sofa' },
      { value: 'bedroom', icon: 'lucide:bed-double' },
      { value: 'office', icon: 'lucide:briefcase' },
      { value: 'balcony', icon: 'lucide:trees' },
    ],
  },
  {
    id: 'light',
    icon: 'lucide:sun',
    options: [
      { value: 'low', icon: 'lucide:moon' },
      { value: 'medium', icon: 'lucide:cloud-sun' },
      { value: 'high', icon: 'lucide:sun' },
      { value: 'direct', icon: 'lucide:flame' },
    ],
  },
  {
    id: 'watering',
    icon: 'lucide:droplets',
    options: [
      { value: 'often', icon: 'lucide:droplets' },
      { value: 'weekly', icon: 'lucide:droplet' },
      { value: 'rarely', icon: 'lucide:hourglass' },
    ],
  },
  {
    id: 'experience',
    icon: 'lucide:sprout',
    options: [
      { value: 'beginner', icon: 'lucide:sprout' },
      { value: 'intermediate', icon: 'lucide:leaf' },
      { value: 'expert', icon: 'lucide:award' },
    ],
  },
  {
    id: 'pets',
    icon: 'lucide:paw-print',
    options: [
      { value: 'safe', icon: 'lucide:paw-print' },
      { value: 'any', icon: 'lucide:smile' },
    ],
  },
]
