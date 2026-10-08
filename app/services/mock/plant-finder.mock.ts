import { getMockPlants } from './plants.mock'
import type { MockLocale } from './mock-locale'
import type { Difficulty, LightLevel, WaterLevel } from '~/types/plant.types'
import type { FinderAnswers, FinderQuestionId, PlantSuggestion } from '~/types/plant-finder.types'

/**
 * جایگزین موقت AI: یه امتیازدهی ساده‌ی قانون‌محور روی دیتای mock.
 * وقتی AI واقعی آماده شد، فقط `getPlantSuggestions` توی plant-finder.service.ts به API وصل می‌شه
 * و این فایل بی‌استفاده می‌شه؛ شکل خروجی (PlantSuggestion) ثابت می‌مونه.
 *
 * نکته: سؤال `place` فعلاً امتیازی نداره و فقط برای AI آینده توی answers ارسال می‌شه.
 */

const lightOrder: LightLevel[] = ['low', 'medium', 'high', 'direct']
const waterOrder: WaterLevel[] = ['low', 'medium', 'high']
const difficultyOrder: Difficulty[] = ['easy', 'medium', 'hard']

const wateringToLevel: Record<string, WaterLevel> = { often: 'high', weekly: 'medium', rarely: 'low' }
const experienceToDifficulty: Record<string, Difficulty> = { beginner: 'easy', intermediate: 'medium', expert: 'hard' }

const weights = { light: 30, watering: 25, experience: 25, pets: 20 } as const
const MAX_RESULTS = 3

/** ۱ = دقیقاً یکی، ۰.۵ = یک پله فاصله، ۰ = دورتر */
function closeness<T>(order: T[], a: T, b: T) {
  const distance = Math.abs(order.indexOf(a) - order.indexOf(b))
  if (distance === 0) return 1
  if (distance === 1) return 0.5
  return 0
}

export function suggestPlantsMock(answers: FinderAnswers, locale: MockLocale = 'fa'): PlantSuggestion[] {
  const scored = getMockPlants(locale)
    // اگه کاربر گیاه بی‌خطر خواسته، گیاه سمی اصلاً پیشنهاد نمی‌شه
    .filter(plant => answers.pets !== 'safe' || !plant.toxicity.isToxic)
    .map((plant) => {
      let earned = 0
      let possible = 0
      const matchedOn: FinderQuestionId[] = []

      const light = answers.light as LightLevel | undefined
      if (light) {
        const fit = closeness(lightOrder, plant.care.light, light)
        earned += fit * weights.light
        possible += weights.light
        if (fit === 1) matchedOn.push('light')
      }

      const wateringLevel = answers.watering ? wateringToLevel[answers.watering] : undefined
      if (wateringLevel) {
        const fit = closeness(waterOrder, plant.care.water, wateringLevel)
        earned += fit * weights.watering
        possible += weights.watering
        if (fit === 1) matchedOn.push('watering')
      }

      const maxDifficulty = answers.experience ? experienceToDifficulty[answers.experience] : undefined
      if (maxDifficulty) {
        const ok = difficultyOrder.indexOf(plant.difficulty) <= difficultyOrder.indexOf(maxDifficulty)
        if (ok) earned += weights.experience
        possible += weights.experience
        if (ok) matchedOn.push('experience')
      }

      if (answers.pets) {
        // تا اینجا فقط گیاه‌های بی‌خطر مونده‌ن (در حالت safe)، پس همه امتیاز کامل می‌گیرن
        earned += weights.pets
        possible += weights.pets
        if (answers.pets === 'safe') matchedOn.push('pets')
      }

      return {
        plant,
        matchScore: possible ? Math.round((earned / possible) * 100) : 0,
        matchedOn,
      }
    })
    // امتیاز بالاتر اول؛ بین امتیاز مساوی، گیاه راحت‌تر اول
    .sort((a, b) =>
      b.matchScore - a.matchScore
      || difficultyOrder.indexOf(a.plant.difficulty) - difficultyOrder.indexOf(b.plant.difficulty),
    )
    .slice(0, MAX_RESULTS)

  return scored.map(({ plant, matchScore, matchedOn }) => ({
    plant: {
      id: plant.id,
      slug: plant.slug,
      name: plant.name,
      scientificName: plant.scientificName,
      family: plant.family,
      genus: plant.genus,
      image: plant.images[0] ?? '',
      category: plant.category,
      difficulty: plant.difficulty,
    },
    matchScore,
    matchedOn,
  }))
}
