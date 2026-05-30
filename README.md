# 博客前台 + 后台管理系统

Vue 3 全栈博客项目，包含文章浏览、分类筛选、搜索，以及后台文章/分类管理与 JWT 登录认证。

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Vue 3 + Vite |
| 状态管理 | Pinia |
| 路由 | Vue Router（懒加载 + 动态路由守卫） |
| UI | Element Plus |
| Markdown | md-editor-v3 |
| HTTP | Axios（请求/响应拦截器） |
| 工具库 | VueUse（防抖、断点、暗色模式） |
| 后端 | Express + JWT + bcrypt |
| 测试 | Vitest |

## 所需软件

1. **Node.js**（推荐 v18 或 v20+）  
   下载：https://nodejs.org/

2. **npm**（随 Node.js 安装）或 **pnpm** / **yarn**

3. **代码编辑器**（推荐 VS Code 或 Cursor）

4. **浏览器**（Chrome / Edge / Firefox）

## 快速开始

```bash
# 1. 进入项目目录
cd blog-system

# 2. 安装依赖
npm install

# 3. 同时启动后端 API (3001) 和前端 (5173)
npm run dev
```

启动后访问：

- **前台首页**：http://localhost:5173
- **后台登录**：http://localhost:5173/login
- **API 服务**：http://localhost:3001/api

### 默认管理员账号

| 用户名 | 密码 |
|--------|------|
| admin  | admin123 |

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 同时启动前后端（开发模式） |
| `npm run client` | 仅启动前端 Vite 开发服务器 |
| `npm run server` | 仅启动后端 Express API |
| `npm run build` | 构建前端生产包到 `dist/` |
| `npm run preview` | 预览构建结果 |
| `npm test` | 运行 Vitest 单元测试 |

## 功能说明

### 前台

- 文章列表展示
- 文章详情（Markdown 渲染）
- 按分类筛选
- 关键词搜索（标题 + 摘要）

### 后台（需登录）

- 文章发布 / 编辑 / 删除（md-editor-v3 编辑器）
- 分类增删改
- JWT Token 认证，路由守卫保护

## 项目结构

```
blog-system/
├── server/                 # Express 后端
│   ├── index.js            # API 入口
│   ├── middleware/auth.js  # JWT 中间件
│   ├── utils/db.js         # JSON 文件读写
│   └── data/db.json        # 数据存储
├── src/
│   ├── api/                # Axios 封装 & API 接口
│   ├── components/         # 公共组件
│   ├── layouts/            # 布局组件
│   ├── router/             # 路由（懒加载）
│   ├── stores/             # Pinia 状态
│   ├── views/              # 页面
│   │   ├── front/          # 前台页面
│   │   └── admin/          # 后台页面
│   └── utils/              # 工具函数
└── tests/                  # Vitest 测试
```

## 关键技术点

### 1. Axios 拦截器

- **请求拦截**：自动附加 `Authorization: Bearer <token>`
- **响应拦截**：统一错误提示，401 自动跳转登录页

### 2. Vue Router 动态路由守卫

后台路由设置 `meta.requiresAuth: true`，`beforeEach` 中检查 Pinia 登录状态，未登录重定向到 `/login`。

### 3. 模块懒加载

所有页面和布局组件使用 `() => import(...)` 动态导入，减小首屏加载体积。

### 4. VueUse 应用

- `useDebounceFn` — 搜索防抖
- `useBreakpoints` — 响应式断点（后台侧边栏折叠）
- `useDark` / `usePreferredDark` — 系统暗色模式适配

### 5. JWT 认证流程

```
登录 → 服务端 bcrypt 验证 → 签发 JWT → 前端存储 localStorage
后续请求 → Axios 拦截器携带 Token → 服务端 authMiddleware 验证
```

## 部署说明

前端可部署到 Vercel / Netlify，后端需单独部署到支持 Node.js 的平台（如 Railway、Render）。

部署时需配置 API 代理地址，或将 `vite.config.js` 中的 proxy 改为生产环境 API 地址。

## 在线预览

本地运行 `npm run dev` 即可体验完整功能。部署后在此填写预览链接。
