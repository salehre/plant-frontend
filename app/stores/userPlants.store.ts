import { defineStore } from 'pinia'
import type { UserPlant, CareTask } from '~/types/user.types'

const seedUserPlants: UserPlant[] = [
  {
    id: 'up1',
    plantSlug: 'monstera-deliciosa',
    nickname: 'مونی',
    photo: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400',
    acquiredAt: '2025-11-02',
    location: 'پذیرایی',
    healthStatus: 'healthy',
    lastWateredAt: '2026-07-24',
    nextWateringAt: '2026-07-31',
  },
  {
    id: 'up2',
    plantSlug: 'ficus-lyrata',
    nickname: 'فیکوسی',
    photo: 'https://images.unsplash.com/photo-1616500163246-742b4b5c15a1?w=400',
    acquiredAt: '2026-02-14',
    location: 'اتاق کار',
    healthStatus: 'needs_attention',
    lastWateredAt: '2026-07-20',
    nextWateringAt: '2026-07-27',
  },
  {
    id: 'up3',
    plantSlug: 'sansevieria-trifasciata',
    nickname: 'زبونی',
    photo: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400',
    acquiredAt: '2025-08-01',
    location: 'راهرو',
    healthStatus: 'healthy',
    lastWateredAt: '2026-07-15',
    nextWateringAt: '2026-07-29',
  },
]

const seedTasks: CareTask[] = [
  { id: 't1', userPlantId: 'up1', type: 'water', dueDate: '2026-07-31', done: false },
  { id: 't2', userPlantId: 'up2', type: 'water', dueDate: '2026-07-27', done: false },
  { id: 't3', userPlantId: 'up2', type: 'fertilize', dueDate: '2026-08-05', done: false },
  { id: 't4', userPlantId: 'up3', type: 'water', dueDate: '2026-07-29', done: false },
  { id: 't5', userPlantId: 'up1', type: 'mist', dueDate: '2026-08-02', done: false },
]

export const useUserPlantsStore = defineStore('userPlants', {
  state: () => ({
    // useLocalStorage: تا وصل‌شدن Backend، گیاه‌ها/تسک‌هایی که کاربر اضافه می‌کنه
    // باید بعد از رفرش هم بمونن. seed فقط برای اولین بار (وقتی هنوز چیزی در
    // localStorage نیست) استفاده می‌شه.
    plants: useLocalStorage<UserPlant[]>('bargyar-user-plants', [...seedUserPlants]),
    tasks: useLocalStorage<CareTask[]>('bargyar-user-plant-tasks', [...seedTasks]),
  }),
  getters: {
    todayTasks(state) {
      const today = new Date().toISOString().slice(0, 10)
      return state.tasks.filter(t => !t.done && t.dueDate <= today)
    },
    upcomingTasks(state) {
      const today = new Date().toISOString().slice(0, 10)
      return state.tasks.filter(t => !t.done && t.dueDate > today)
    },
  },
  actions: {
    addPlant(plant: Omit<UserPlant, 'id'>) {
      this.plants.push({ ...plant, id: `up${Date.now()}` })
    },
    removePlant(id: string) {
      this.plants = this.plants.filter(p => p.id !== id)
      this.tasks = this.tasks.filter(t => t.userPlantId !== id)
    },
    completeTask(id: string) {
      const task = this.tasks.find(t => t.id === id)
      if (task) task.done = true
    },
  },
})
