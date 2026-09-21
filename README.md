# 心理健康 AI 助手 · 前端

一个以 AI 对话为核心的心理健康自助辅助平台前端，提供情绪倾诉、心理状态可视化与心理知识学习。后端为 Spring Boot 服务（独立仓库）。

> 本产品是心理支持 / 自助工具，不是医疗产品。AI 建议仅供参考，不构成医学诊断。

## 技术栈

- Vue 3（`<script setup>` Composition API）
- Vite 8
- Vue Router 4
- Element Plus 2
- ECharts 6
- Axios

## 功能

- 账号密码登录 / 邮箱验证码注册
- AI 咨询对话（含心理状态雷达图 + 等级趋势图）
- 情绪日记
- 心理知识库（分类、收藏、文章详情）
- 管理后台（数据分析看板）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

## 后端对接

前端统一通过 `/api/**` 请求后端，开发环境由 Vite 代理转发到 `http://localhost:8080`（见 `vite.config.js`），无需处理 CORS。

- 接口约定：统一返回 `{ code, data, message }`，`code === 0` 表示成功。
- 鉴权方式：请求头 `Authorization: Bearer <JWT>`。

## 目录结构

```
src/
├── api/          # axios 实例与接口封装
├── components/   # 通用组件（图表、状态面板、气泡等）
├── layouts/      # 用户端 / 管理端布局
├── router/       # 路由与登录守卫
├── utils/        # token、政策确认等工具
└── views/
    ├── user/     # 用户端页面
    └── admin/    # 管理端页面
```

## 免责声明

本产品提供的 AI 建议与心理状态评估仅供心理健康自助参考，不构成医学诊断或治疗建议。如你正面临严重的心理困扰或危机，请及时联系专业医疗机构或心理援助热线。

## 协议

[MIT](LICENSE)
