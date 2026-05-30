<template>
  <div class="front-layout">
    <header class="header">
      <div class="container header-inner">
        <router-link to="/" class="logo">📝 技术博客</router-link>

        <nav class="nav" :class="{ open: menuOpen }">
          <router-link to="/" @click="menuOpen = false">首页</router-link>
          <router-link to="/login" @click="menuOpen = false">后台</router-link>
        </nav>

        <button class="menu-btn" @click="menuOpen = !menuOpen" aria-label="菜单">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <router-view />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>© 2026 博客系统 · Vue3 + Vite + Pinia</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
</script>

<style scoped lang="scss">
.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  position: sticky;
  top: 0;
  z-index: 100;
}

html.dark .header {
  background: #1d1e1f;
  border-color: #414243;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #409eff;
}

.nav {
  display: flex;
  gap: 24px;

  a {
    font-weight: 500;
    transition: color 0.2s;

    &:hover,
    &.router-link-active {
      color: #409eff;
    }
  }
}

.menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  span {
    display: block;
    width: 22px;
    height: 2px;
    background: #606266;
    transition: 0.3s;
  }
}

.main {
  flex: 1;
  padding: 32px 0;
}

.footer {
  padding: 24px 0;
  text-align: center;
  color: #909399;
  font-size: 0.875rem;
  border-top: 1px solid #ebeef5;
}

html.dark .footer {
  border-color: #414243;
}

@media (max-width: 768px) {
  .menu-btn {
    display: flex;
  }

  .nav {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    padding: 16px;
    gap: 12px;
    border-bottom: 1px solid #ebeef5;
    transform: translateY(-120%);
    opacity: 0;
    transition: 0.3s;
    pointer-events: none;

    &.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
  }

  html.dark .nav {
    background: #1d1e1f;
    border-color: #414243;
  }
}
</style>
