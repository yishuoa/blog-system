import { defineStore } from 'pinia'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/category'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    list: [],
    loading: false
  }),
  actions: {
    async fetchList() {
      this.loading = true
      try {
        this.list = await getCategories()
      } finally {
        this.loading = false
      }
    },
    async create(data) {
      const category = await createCategory(data)
      this.list.push(category)
      return category
    },
    async update(id, data) {
      const category = await updateCategory(id, data)
      const idx = this.list.findIndex(c => c.id === id)
      if (idx !== -1) this.list[idx] = category
      return category
    },
    async remove(id) {
      await deleteCategory(id)
      this.list = this.list.filter(c => c.id !== id)
    }
  }
})
