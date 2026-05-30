<template>
  <article class="article-card" @click="router.push(`/article/${article.id}`)">
    <div class="card-meta">
      <el-tag size="small" type="info">{{ article.categoryName }}</el-tag>
      <time>{{ formatDate(article.createdAt) }}</time>
    </div>
    <h2 class="card-title">{{ article.title }}</h2>
    <p class="card-summary">{{ article.summary }}</p>
    <span class="read-more">阅读全文 →</span>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/format'

defineProps({
  article: { type: Object, required: true }
})

const router = useRouter()
</script>

<style scoped lang="scss">
.article-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.2s;
  border: 1px solid #ebeef5;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

html.dark .article-card {
  background: #1d1e1f;
  border-color: #414243;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  time {
    font-size: 0.8125rem;
    color: #909399;
  }
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
}

.card-summary {
  color: #606266;
  font-size: 0.9375rem;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

html.dark .card-summary {
  color: #a3a6ad;
}

.read-more {
  color: #409eff;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
