<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Fold,
  Expand,
  DataAnalysis,
  Document,
  ChatDotRound,
  Notebook,
  User,
  ArrowDown
} from '@element-plus/icons-vue'

const collapsed = ref(false)
const route = useRoute()

const menuItems = [
  { path: '/admin/dashboard', label: '数据分析', icon: DataAnalysis },
  { path: '/admin/knowledge', label: '知识文章', icon: Document },
  { path: '/admin/consult', label: '咨询记录', icon: ChatDotRound },
  { path: '/admin/emotion-log', label: '情绪日志', icon: Notebook }
]

const pageTitle = computed(() => {
  const item = menuItems.find((m) => m.path === route.path)
  return item ? item.label : ''
})
</script>

<template>
  <el-container class="layout">
    <el-aside :width="collapsed ? '64px' : '220px'" class="aside">
      <div class="logo" :class="{ collapsed }">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </div>
        <div v-show="!collapsed" class="logo-text">
          <div class="logo-title">心理健康 AI 助手</div>
          <div class="logo-sub">管理后台</div>
        </div>
      </div>

      <el-menu
        router
        :collapse="collapsed"
        :collapse-transition="false"
        :default-active="route.path"
        background-color="#ffffff"
        text-color="#6b7280"
        active-text-color="#7c5cfc"
        class="menu"
      >
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.label }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="right">
      <el-header class="header">
        <div class="header-left">
          <el-icon class="fold-btn" @click="collapsed = !collapsed">
            <Expand v-if="collapsed" />
            <Fold v-else />
          </el-icon>
          <h2 class="page-title">{{ pageTitle }}</h2>
        </div>

        <div class="header-right">
          <el-dropdown>
            <span class="user-trigger">
              <el-avatar :size="32" class="avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="user-name">admin</span>
              <el-icon class="caret"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>账号设置</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout {
  height: 100%;
}

.aside {
  background: #fff;
  border-right: 1px solid #e5e7eb;
  transition: width 0.2s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 60px;
  padding: 0 16px;
  white-space: nowrap;
  flex-shrink: 0;
}

.logo.collapsed {
  padding: 0;
  justify-content: center;
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.logo-title {
  font-size: 14px;
  font-weight: 700;
  color: #1f2329;
}

.logo-sub {
  font-size: 11px;
  color: #9ca3af;
}

.menu {
  border-right: none;
}

.menu :deep(.el-menu-item.is-active) {
  background: #f3f0ff;
}

.menu :deep(.el-menu-item:hover) {
  background: #f7f7fa;
}

.right {
  min-width: 0;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.fold-btn {
  font-size: 20px;
  cursor: pointer;
  color: #4b5563;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2329;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}

.user-name {
  font-size: 14px;
  color: #1f2329;
}

.caret {
  font-size: 12px;
  color: #6b7280;
}

.avatar {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #fff;
}

.main {
  padding: 24px;
  overflow: auto;
}
</style>
