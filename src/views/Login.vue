<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <h2>后台登录</h2>
      <p class="hint">默认账号：admin / admin123</p>

      <el-form :model="form" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            placeholder="密码"
            type="password"
            show-password
            :prefix-icon="Lock"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleLogin">
          登录
        </el-button>
      </el-form>

      <router-link to="/" class="back-link">← 返回首页</router-link>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

async function handleLogin() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    await userStore.login(form)
    ElMessage.success('登录成功')
    router.push(route.query.redirect || '/admin')
  } catch {
    /* error handled by interceptor */
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 8px;

  h2 {
    text-align: center;
    margin-bottom: 8px;
  }
}

.hint {
  text-align: center;
  color: #909399;
  font-size: 0.8125rem;
  margin-bottom: 24px;
}

.login-btn {
  width: 100%;
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #409eff;
  font-size: 0.875rem;
}
</style>
