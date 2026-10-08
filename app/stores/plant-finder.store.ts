import { defineStore } from 'pinia'
import type { FinderAnswers, FinderQuestionId, PlantSuggestion } from '~/types/plant-finder.types'
import type { MockLocale } from '~/services/mock/mock-locale'
import { getPlantSuggestions } from '~/services/plant-finder.service'
import { plantFinderQuestions } from '~/utils/plant-finder-questions'

export const usePlantFinderStore = defineStore('plantFinder', {
  state: () => ({
    /** ایندکس سؤال فعلی */
    step: 0,
    answers: {} as FinderAnswers,
    suggestions: [] as PlantSuggestion[],
    /** true یعنی نتیجه‌ها آماده‌ن و باید صفحه‌ی نتایج نشون داده بشه */
    done: false,
    loading: false,
    error: '',
  }),
  getters: {
    totalSteps: () => plantFinderQuestions.length,
    currentQuestion: state => plantFinderQuestions[state.step]!,
    currentAnswer(state): string | undefined {
      return state.answers[plantFinderQuestions[state.step]!.id]
    },
    isLastStep: state => state.step === plantFinderQuestions.length - 1,
    isFirstStep: state => state.step === 0,
    progress: state => ((state.step + 1) / plantFinderQuestions.length) * 100,
  },
  actions: {
    select(id: FinderQuestionId, value: string) {
      this.answers = { ...this.answers, [id]: value }
    },
    next() {
      if (!this.currentAnswer || this.isLastStep) return
      this.step++
    },
    back() {
      if (this.step > 0) this.step--
    },
    /** اگه خطا بده، done=false می‌مونه و کاربر روی همون سؤال آخر دوباره امتحان می‌کنه */
    async submit(locale: MockLocale, errorMessage: string) {
      const result = await runAsyncAction(
        this,
        () => getPlantSuggestions(this.answers, locale),
        { errorMessage, toast: false },
      )
      if (result) {
        this.suggestions = result
        this.done = true
      }
    },
    reset() {
      this.step = 0
      this.answers = {}
      this.suggestions = []
      this.done = false
      this.error = ''
    },
  },
})
