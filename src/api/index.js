// 统一响应格式由后端约定：{ code: 0, data, message: 'ok' }
// 所有请求收口在这里，页面通过 api.xxx() 调用，不直接发 HTTP。
import request from './request'

/* ---------------- 前端常量（非接口，用于渲染分类/情绪标签） ---------------- */

export const CATEGORIES = ['焦虑缓解', '抑郁认知', '睡眠改善', '人际关系', '压力管理', '正念冥想', '心理百科']
export const MOODS = ['开心', '平静', '焦虑', '难过', '愤怒']
export const LEVEL_ORDER = ['L1', 'L2', 'L3', 'L4', 'L5']

/* ---------------- API ---------------- */

export const api = {
  // 认证
  login: (payload) => request.post('/api/auth/login', payload),
  sendEmailCode: (email) => request.post('/api/auth/email-code', { email }),
  register: (payload) => request.post('/api/auth/register', payload),
  logout: () => request.post('/api/auth/logout'),

  // 心理状态
  getStatus: () => request.get('/api/profile/status'),

  // 会话
  getConversations: () => request.get('/api/conversations'),
  createConversation: () => request.post('/api/conversations'),
  getMessages: (id) => request.get(`/api/conversations/${id}/messages`),
  sendMessage: (id, content) => request.post(`/api/conversations/${id}/messages`, { content }),
  deleteConversation: (id) => request.delete(`/api/conversations/${id}`),

  // 情绪日记
  getDiaries: () => request.get('/api/diaries'),
  createDiary: (diary) => request.post('/api/diaries', diary),

  // 知识库文章
  getArticles: (params) => request.get('/api/articles', { params }),
  getArticle: (id) => request.get(`/api/articles/${id}`),
  toggleFavorite: (id) => request.post(`/api/articles/${id}/favorite`)
}
