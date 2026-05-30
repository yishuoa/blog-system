<template>
  <div v-loading="articleStore.loading" class="detail">
    <template v-if="articleStore.current">
      <el-button :icon="ArrowLeft" text @click="router.back()">返回</el-button>

      <article class="article">
        <h1 class="title">{{ articleStore.current.title }}</h1>
        <div class="meta">
          <el-tag size="small">{{ articleStore.current.categoryName }}</el-tag>
          <time>{{ formatDate(articleStore.current.createdAt) }}</time>
        </div>
        <MdPreview :model-value="articleStore.current.content" />
      </article>
    </template>

    <el-empty v-else-if="!articleStore.loading" description="文章不存在" />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useArticleStore } from '@/stores/article'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

onMounted(() => {
  articleStore.fetchOne(Number(route.params.id))
})

watch(
  () => route.params.id,
  id => articleStore.fetchOne(Number(id))
)
</script>

<style scoped lang="scss">
.detail {
  max-width: 800px;
  margin: 0 auto;
  min-height: 300px;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin: 16px 0;
  line-height: 1.3;
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;

  time {
    color: #909399;
    font-size: 0.875rem;
  }
}

html.dark .meta {
  border-color: #414243;
}

@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }
}
</style>
