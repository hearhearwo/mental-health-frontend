import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 本地后端地址。前端统一用相对路径请求 /api/...，由这里转发过去，
// 这样开发环境不用配 CORS，也不会出现 https 页面请求 http 接口的混合内容拦截。
const BACKEND = 'http://localhost:8080'

const apiProxy = {
  '/api': { target: BACKEND, changeOrigin: true }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // 监听所有网卡，手机等局域网设备才能打开 dev server
    host: true,
    port: 5173,
    proxy: apiProxy
  },
  preview: {
    // 打包产物本地预览时也走同样的代理
    host: true,
    proxy: apiProxy
  }
})
