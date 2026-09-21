import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/layouts/BackendLayout.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import { isLoggedIn } from '@/utils/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/Register.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: UserLayout,
    redirect: '/chat',
    children: [
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/user/Chat.vue'),
        meta: { title: 'AI 咨询' }
      },
      {
        path: 'diary',
        name: 'Diary',
        component: () => import('@/views/user/Diary.vue'),
        meta: { title: '情绪日记' }
      },
      {
        path: 'knowledge',
        name: 'UserKnowledge',
        component: () => import('@/views/user/Knowledge.vue'),
        meta: { title: '知识库' }
      },
      {
        path: 'knowledge/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/user/ArticleDetail.vue'),
        meta: { title: '文章详情' }
      }
    ]
  },
  {
    path: '/admin',
    component: BackendLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '数据分析' }
      },
      {
        path: 'knowledge',
        name: 'AdminKnowledge',
        component: () => import('@/views/admin/Knowledge.vue'),
        meta: { title: '知识文章' }
      },
      {
        path: 'consult',
        name: 'AdminConsult',
        component: () => import('@/views/admin/Placeholder.vue'),
        meta: { title: '咨询记录' }
      },
      {
        path: 'emotion-log',
        name: 'AdminEmotionLog',
        component: () => import('@/views/admin/Placeholder.vue'),
        meta: { title: '情绪日志' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 登录守卫：管理后台独立，用户端除登录页外需登录态
router.beforeEach((to) => {
  if (to.path.startsWith('/admin')) return true
  if (to.meta.public || isLoggedIn()) return true
  return { path: '/login', query: { redirect: to.fullPath } }
})

export default router
