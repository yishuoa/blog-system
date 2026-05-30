<template>
  <div class="category-manage">
    <el-card shadow="never">
      <template #header>
        <span>新增分类</span>
      </template>

      <el-form inline @submit.prevent="handleCreate">
        <el-form-item label="名称">
          <el-input v-model="newName" placeholder="分类名称" />
        </el-form-item>
        <el-form-item label="标识">
          <el-input v-model="newSlug" placeholder="slug（可选）" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="creating" @click="handleCreate">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="list-card">
      <template #header>
        <span>分类列表 ({{ categoryStore.list.length }})</span>
      </template>

      <el-table :data="categoryStore.list" v-loading="categoryStore.loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" min-width="160">
          <template #default="{ row }">
            <el-input
              v-if="editingId === row.id"
              v-model="editForm.name"
              size="small"
            />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="slug" label="标识" min-width="160">
          <template #default="{ row }">
            <el-input
              v-if="editingId === row.id"
              v-model="editForm.slug"
              size="small"
            />
            <span v-else>{{ row.slug }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <template v-if="editingId === row.id">
              <el-button type="primary" link @click="handleSave(row.id)">保存</el-button>
              <el-button link @click="editingId = null">取消</el-button>
            </template>
            <template v-else>
              <el-button type="primary" link @click="startEdit(row)">编辑</el-button>
              <el-popconfirm title="确定删除该分类？" @confirm="handleDelete(row.id)">
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()
const newName = ref('')
const newSlug = ref('')
const creating = ref(false)
const editingId = ref(null)
const editForm = reactive({ name: '', slug: '' })

function startEdit(row) {
  editingId.value = row.id
  editForm.name = row.name
  editForm.slug = row.slug
}

async function handleCreate() {
  if (!newName.value.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }

  creating.value = true
  try {
    await categoryStore.create({
      name: newName.value,
      slug: newSlug.value || undefined
    })
    ElMessage.success('分类已添加')
    newName.value = ''
    newSlug.value = ''
  } finally {
    creating.value = false
  }
}

async function handleSave(id) {
  await categoryStore.update(id, { ...editForm })
  ElMessage.success('已保存')
  editingId.value = null
}

async function handleDelete(id) {
  await categoryStore.remove(id)
  ElMessage.success('已删除')
}

onMounted(() => categoryStore.fetchList())
</script>

<style scoped lang="scss">
.category-manage {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 768px) {
  :deep(.el-form--inline) {
    display: flex;
    flex-direction: column;

    .el-form-item {
      margin-right: 0;
    }
  }
}
</style>
