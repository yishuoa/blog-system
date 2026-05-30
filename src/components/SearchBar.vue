<template>
  <div class="search-bar">
    <el-input
      v-model="keyword"
      placeholder="搜索文章标题或摘要..."
      clearable
      :prefix-icon="Search"
      @keyup.enter="emitSearch"
      @clear="emitSearch"
    />
    <el-select
      v-model="category"
      placeholder="全部分类"
      clearable
      class="category-select"
      @change="emitSearch"
    >
      <el-option
        v-for="cat in categories"
        :key="cat.id"
        :label="cat.name"
        :value="cat.id"
      />
    </el-select>
    <el-button type="primary" :icon="Search" @click="emitSearch">搜索</el-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  initialSearch: { type: String, default: '' },
  initialCategory: { type: [Number, String, null], default: null }
})

const emit = defineEmits(['search'])

const keyword = ref(props.initialSearch)
const category = ref(props.initialCategory ? Number(props.initialCategory) : null)

const emitSearch = useDebounceFn(() => {
  emit('search', {
    search: keyword.value.trim(),
    categoryId: category.value || undefined
  })
}, 300)

watch(
  () => [props.initialSearch, props.initialCategory],
  ([s, c]) => {
    keyword.value = s || ''
    category.value = c ? Number(c) : null
  }
)
</script>

<style scoped lang="scss">
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.category-select {
  width: 160px;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  .category-select {
    width: 100%;
  }
}
</style>
