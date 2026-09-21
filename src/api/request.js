import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router'

// baseURL 默认留空 = 用相对路径（同源请求）。
// 这样本地开发由 Vite proxy 转发到 8080，打包后由后端或隧道提供，都不用改代码：
//   - 手机通过内网穿透访问时，若写死 localhost，localhost 指的是手机自己 → Network Error
//   - 页面是 https 而请求是 http 时，浏览器会按混合内容拦截 → 也是 Network Error
// 相对路径两个问题都没有。
// 需要指向独立域名时再用 VITE_API_BASE 覆盖。
// 注意这里必须用 ?? 而不是 ||：空串是合法值（表示同源），用 || 会被当成未设置而回退。
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? '',
  timeout: 30000
})

// 请求拦截：自动带 JWT
request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

function handleAuthExpired() {
  removeToken()
  ElMessage.error('登录已过期，请重新登录')
  router.push('/login')
}

// 响应拦截：后端统一 HTTP 200 + body.code（0 成功，非 0 业务错误）。
// 这里统一提示错误、处理 401 跳转，但始终返回结果对象（不 reject），
// 这样页面里既有的 `if (res.code === 0) ... res.data` 判断保持不变。
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 0) return res
    if (res.code === 401) {
      handleAuthExpired()
    } else {
      ElMessage.error(res.message || '请求失败')
    }
    return res
  },
  (error) => {
    // 网络错误 / 真实 HTTP 4xx-5xx（后端目前不会，这里兜底）
    if (error.response?.status === 401) {
      handleAuthExpired()
    }
    const msg = error.response?.data?.message || error.message || '网络异常，请稍后重试'
    ElMessage.error(msg)
    return { code: -1, data: null, message: msg }
  }
)

export default request
