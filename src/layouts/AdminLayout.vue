<template>
  <el-container class="admin-layout">
    <el-aside :width="collapsed ? '64px' : '220px'" class="aside">
      <div class="aside-title">
        <span v-if="!collapsed">博客后台</span>
        <span v-else>📝</span>
      </div>
      <el-menu
        :default-active="route.path"
        :collapse="collapsed"
        router
        background-color="#001529"
        text-color="#ffffffa6"
        active-text-color="#fff"
      >
        <el-menu-item index="/admin/articles">
          <el-icon><Document /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/categories">
          <el-icon><Folder /></el-icon>
          <span>分类管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="collapsed = !collapsed">
            <Fold v-if="!collapsed" />
            <Expand v-else />
          </el-icon>
          <span class="page-name">{{ route.meta.title }}</span>
        </div>
        <div class="header-right">
          <span class="username">{{ userStore.user?.username }}</span>
          <el-button type="danger" size="small" @click="handleLogout">退出</el-button>
          <el-button size="small" @click="router.push('/')">前台</el-button>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, Folder, Fold, Expand } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useBreakpoints } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const breakpoints = useBreakpoints({ mobile: 768 })
const collapsed = ref(breakpoints.smaller('mobile').value)

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
}

.aside {
  background: #001529;
  transition: width 0.3s;
  overflow: hidden;
}

.aside-title {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.125rem;
  font-weight: 700;
  border-bottom: 1px solid #ffffff1a;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  padding: 0 20px;
}

html.dark .header {
  background: #1d1e1f;
  border-color: #414243;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}

.page-name {
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  color: #909399;
  font-size: 0.875rem;
}

.main {
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

html.dark .main {
  background: #141414;
}

@media (max-width: 768px) {
  .username {
    display: none;
  }
}
</style>
