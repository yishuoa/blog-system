import { defineStore } from 'pinia'
import { getArticles, getArticle, createArticle, updateArticle, deleteArticle } from '@/api/article'

export const useArticleStore = defineStore('article', {
  state: () => ({
    list: [],
    current: null,
    loading: false
  }),
  actions: {
    async fetchList(params = {}) {
      this.loading = true
      try {
        this.list = await getArticles(params)
      } finally {
        this.loading = false
      }
    },
    async fetchOne(id) {
      this.loading = true
      try {
        this.current = await getArticle(id)
      } finally {
        this.loading = false
      }
    },
    async create(data) {
      const article = await createArticle(data)
      this.list.unshift(article)
      return article
    },
    async update(id, data) {
      const article = await updateArticle(id, data)
      const idx = this.list.findIndex(a => a.id === id)
      if (idx !== -1) this.list[idx] = article
      return article
    },
    async remove(id) {
      await deleteArticle(id)
      this.list = this.list.filter(a => a.id !== id)
    }
  }
})
