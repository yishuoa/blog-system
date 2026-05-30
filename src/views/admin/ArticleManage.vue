<template>
  <div class="article-manage">
    <el-card shadow="never" class="editor-card">
      <template #header>
        <span>{{ editingId ? '编辑文章' : '发布文章' }}</span>
      </template>

      <el-form label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="文章标题" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.summary" placeholder="文章摘要（可选）" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="选择分类" style="width: 100%">
            <el-option v-for="cat in categoryStore.list" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <MdEditor v-model="form.content" language="zh-CN" style="height: 400px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            {{ editingId ? '保存修改' : '发布文章' }}
          </el-button>
          <el-button v-if="editingId" @click="resetForm">取消编辑</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="list-card">
      <template #header>
        <span>文章列表 ({{ articleStore.list.length }})</span>
      </template>

      <el-table :data="articleStore.list" v-loading="articleStore.loading" stripe>
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column label="发布时间" width="160">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="startEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该文章？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ElMessage } from 'element-plus'
import { useArticleStore } from '@/stores/article'
import { useCategoryStore } from '@/stores/category'
import { formatDate } from '@/utils/format'

const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const editingId = ref(null)
const submitting = ref(false)

const form = reactive({
  title: '',
  summary: '',
  content: '# 标题\n\n正文内容...',
  categoryId: null
})

function resetForm() {
  editingId.value = null
  form.title = ''
  form.summary = ''
  form.content = '# 标题\n\n正文内容...'
  form.categoryId = categoryStore.list[0]?.id ?? null
}

function startEdit(article) {
  editingId.value = article.id
  form.title = article.title
  form.summary = article.summary
  form.content = article.content
  form.categoryId = article.categoryId
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSubmit() {
  if (!form.title.trim() || !form.content.trim()) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  submitting.value = true
  try {
    if (editingId.value) {
      await articleStore.update(editingId.value, { ...form })
      ElMessage.success('文章已更新')
    } else {
      await articleStore.create({ ...form })
      ElMessage.success('文章已发布')
    }
    resetForm()
    await articleStore.fetchList()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id) {
  await articleStore.remove(id)
  ElMessage.success('已删除')
  if (editingId.value === id) resetForm()
}

onMounted(async () => {
  await categoryStore.fetchList()
  form.categoryId = categoryStore.list[0]?.id ?? null
  await articleStore.fetchList()
})
</script>

<style scoped lang="scss">
.article-manage {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 768px) {
  :deep(.el-table) {
    font-size: 0.8125rem;
  }
}
</style>
