<template>
  <div class="home">
    <h1 class="page-title">最新文章</h1>

    <SearchBar
      :categories="categoryStore.list"
      :initial-search="route.query.search"
      :initial-category="route.query.categoryId"
      @search="handleSearch"
    />

    <div v-loading="articleStore.loading" class="article-list">
      <ArticleCard
        v-for="article in articleStore.list"
        :key="article.id"
        :article="article"
      />
      <el-empty v-if="!articleStore.loading && !articleStore.list.length" description="暂无文章" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleCard from '@/components/ArticleCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useArticleStore } from '@/stores/article'
import { useCategoryStore } from '@/stores/category'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const categoryStore = useCategoryStore()

async function loadArticles() {
  const params = {}
  if (route.query.search) params.search = route.query.search
  if (route.query.categoryId) params.categoryId = route.query.categoryId
  await articleStore.fetchList(params)
}

function handleSearch({ search, categoryId }) {
  const query = {}
  if (search) query.search = search
  if (categoryId) query.categoryId = categoryId
  router.replace({ query })
}

onMounted(async () => {
  await categoryStore.fetchList()
  await loadArticles()
})

watch(() => route.query, loadArticles)
</script>

<style scoped lang="scss">
.article-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 200px;
}
</style>
