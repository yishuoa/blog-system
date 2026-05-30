import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const FrontLayout = () => import('@/layouts/FrontLayout.vue')
const AdminLayout = () => import('@/layouts/AdminLayout.vue')

const publicRoutes = [
  {
    path: '/',
    component: FrontLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/front/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'article/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/front/ArticleDetail.vue'),
        meta: { title: '文章详情' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', guest: true }
  }
]

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/articles'
      },
      {
        path: 'articles',
        name: 'AdminArticles',
        component: () => import('@/views/admin/ArticleManage.vue'),
        meta: { title: '文章管理', requiresAuth: true }
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/CategoryManage.vue'),
        meta: { title: '分类管理', requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...adminRoutes],
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 博客系统` : '博客系统'

  const userStore = useUserStore()
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)

  if (requiresAuth && !userStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && userStore.isLoggedIn) {
    next('/admin')
  } else {
    next()
  }
})

export default router
