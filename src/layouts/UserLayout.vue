<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { ChatDotRound, Notebook, Collection } from '@element-plus/icons-vue'
import { removeToken } from '@/utils/auth'

const route = useRoute()
const router = useRouter()

const navItems = [
  { path: '/chat', label: 'AI 咨询', icon: ChatDotRound },
  { path: '/diary', label: '情绪日记', icon: Notebook },
  { path: '/knowledge', label: '知识库', icon: Collection }
]

function isActive(path) {
  if (path === '/knowledge') return route.path.startsWith('/knowledge')
  return route.path.startsWith(path)
}

function handleLogout() {
  ElMessageBox.confirm('确定退出登录吗？', '提示', {
    type: 'warning',
    confirmButtonText: '退出',
    cancelButtonText: '取消'
  })
    .then(() => {
      removeToken()
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="user-layout">
    <header class="topbar">
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </div>
        <span class="brand-name">心理健康 AI 助手</span>
      </div>

      <nav class="nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="actions">
        <el-button text class="logout" @click="handleLogout">退出</el-button>
      </div>
    </header>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.user-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f4faf4;
}

.topbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e8f0e8;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 32px;
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #52c41a, #8ed98a);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-name {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e2c;
}

.nav {
  display: flex;
  gap: 8px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  color: #5a6b5a;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f0f7f0;
  color: #3a7d34;
}

.nav-item.active {
  background: #e6f5e4;
  color: #3a7d34;
  font-weight: 600;
}

.actions {
  flex-shrink: 0;
}

.logout {
  color: #6b7280;
}

.content {
  flex: 1;
  overflow: auto;
}

@media (max-width: 768px) {
  .topbar {
    gap: 12px;
    padding: 0 12px;
  }
  .brand-name {
    display: none;
  }
  .nav-item {
    padding: 8px 10px;
  }
}
</style>
