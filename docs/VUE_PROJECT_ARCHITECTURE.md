# AIClient-2-API Vue 前端项目架构文档

> 版本: 1.1.0 | 更新日期: 2026-04-17

---

## 一、项目概述

AIClient-2-API 是一个 API 代理中间件，将多种 AI 提供商（Gemini、Claude、Grok、Codex、Kiro 等）的 API 统一转换为标准的 OpenAI 兼容接口。

### 前端技术栈
- **框架**: Vue 3 (Composition API + `<script setup>`)
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **图标**: Font Awesome 6
- **状态管理**: Vue Composition API (ref/reactive)
- **HTTP 客户端**: 原生 fetch API

---

## 二、目录结构

```
src/
├── api/                    # 前端 API 封装层
│   └── index.js           # Vue Composables (useSystemMonitor, useProviderPool, useModelList)
├── components/             # 公共组件
│   └── common/            # 通用组件
│       ├── Toast.vue      # Toast 通知组件
│       ├── GlobalToast.vue # 全局 Toast 容器
│       ├── Skeleton.vue   # 骨架屏组件
│       └── ConfirmModal.vue # 确认弹窗组件
├── composables/            # 组合式函数
│   ├── useToast.js        # Toast 通知
│   ├── useConfirm.js      # 确认对话框
│   └── useLoading.js      # 加载状态
├── views/                  # 页面组件
│   ├── Login.vue          # 登录页
│   ├── Dashboard.vue      # 仪表盘 (系统监控、GPU 状态、路由示例)
│   ├── Config.vue         # 系统配置管理
│   ├── Providers.vue      # 提供商池管理
│   ├── Usage.vue          # 用量统计
│   ├── Plugins.vue        # 插件管理
│   ├── Logs.vue           # 日志管理
│   ├── UploadConfig.vue    # 配置文件上传
│   ├── Guide.vue          # 使用指南
│   └── Tutorial.vue       # 教程
├── App.vue                 # 根组件
└── main.js                 # 入口文件
```

---

## 三、功能模块与 API 对应关系

### 3.1 Dashboard.vue

**功能**: 系统监控仪表盘

| 功能点 | 调用的 API | 说明 |
|--------|-----------|------|
| 运行时间/系统信息 | `GET /api/system` | 版本、Node.js、操作系统 |
| CPU/内存/GPU 监控 | `GET /api/system/monitor` | 实时监控数据 (5000ms 轮询) |
| GPU 状态 | `http://localhost:5000/gpu/status` | Python 控制器 |
| 提供商状态 | `GET /api/providers` | 各提供商健康状态 |
| 模型列表 | `GET /api/models` | 可用模型列表 |

**依赖的 Composables**:
```javascript
import { useSystemMonitor, useProviderPool, useModelList } from '@/api'

const { systemInfo, cpuHistory, memoryHistory, gpuHistory, fetchSystemMonitor, fetchGpuStatus } = useSystemMonitor()
const { providers, fetchProviders } = useProviderPool()
const { models, routingExamples, fetchModels } = useModelList()
```

---

### 3.2 Providers.vue

**功能**: 提供商池管理 (CRUD)

| 功能点 | HTTP 方法 | API 端点 |
|--------|----------|----------|
| 列表查询 | GET | `/api/providers` |
| 添加提供商 | POST | `/api/providers` |
| 更新提供商 | PUT | `/api/providers/{id}` |
| 删除提供商 | DELETE | `/api/providers/{id}` |
| 健康检查 | POST | `/api/providers/{type}/{uuid}/health-check` |
| 批量启用/禁用 | POST | `/api/providers/{type}/{uuid}/enable/disable` |
| OAuth 授权 | POST | `/api/providers/{type}/generate-auth-url` |

**依赖的 Composables**:
```javascript
const { providers, loading, fetchProviders, addProvider, updateProvider, deleteProvider } = useProviderPool()
```

---

### 3.3 Config.vue

**功能**: 系统配置管理

| 功能点 | HTTP 方法 | API 端点 |
|--------|----------|----------|
| 获取配置 | GET | `/api/config` |
| 更新配置 | POST | `/api/config` |
| 重载配置 | POST | `/api/reload-config` |
| 修改密码 | POST | `/api/admin-password` |

---

### 3.4 Usage.vue

**功能**: 用量统计查询

| 功能点 | HTTP 方法 | API 端点 |
|--------|----------|----------|
| 所有用量 | GET | `/api/usage` |
| 特定类型 | GET | `/api/usage/{providerType}` |
| 支持的提供商 | GET | `/api/usage/supported-providers` |

**支持的提供商**: `claude-kiro-oauth`, `gemini-cli-oauth`, `gemini-antigravity`, `openai-codex-oauth`, `grok-custom`

---

### 3.5 Plugins.vue

**功能**: 插件启用/禁用管理

| 功能点 | HTTP 方法 | API 端点 |
|--------|----------|----------|
| 插件列表 | GET | `/api/plugins` |
| 切换状态 | POST | `/api/plugins/{name}/toggle` |

**内置插件**:
- `default-auth` - API Key 认证
- `ai-monitor` - AI 接口监控
- `api-potluck` - Key 管理和用量统计
- `model-usage-stats` - 模型用量统计

---

### 3.6 Logs.vue

**功能**: 日志管理

| 功能点 | HTTP 方法 | API 端点 |
|--------|----------|----------|
| 下载日志 | GET | `/api/system/download-log` |
| 清空日志 | POST | `/api/system/clear-log` |

---

### 3.7 UploadConfig.vue

**功能**: 配置文件上传管理

| 功能点 | HTTP 方法 | API 端点 |
|--------|----------|----------|
| 配置文件列表 | GET | `/api/upload-configs` |
| 查看内容 | GET | `/api/upload-configs/view/{path}` |
| 下载配置 | GET | `/api/upload-configs/download/{path}` |
| 删除配置 | DELETE | `/api/upload-configs/{path}` |
| 上传凭据 | POST | `/api/upload-oauth-credentials` |

---

### 3.8 Login.vue

**功能**: 用户认证

| 功能点 | HTTP 方法 | API 端点 |
|--------|----------|----------|
| 登录 | POST | `/api/login` |
| 健康检查 | GET | `/api/health` |

---

## 四、API 层设计

### 4.1 Composables 模式

```javascript
// src/api/index.js
export function useSystemMonitor() {
  const systemInfo = ref({})
  const cpuHistory = ref([])
  const memoryHistory = ref([])
  const gpuHistory = ref([])

  const fetchSystemMonitor = async () => { /* ... */ }
  const fetchGpuStatus = async () => { /* ... */ }

  return { systemInfo, cpuHistory, memoryHistory, gpuHistory, fetchSystemMonitor, fetchGpuStatus }
}

export function useProviderPool() {
  const providers = ref([])
  const loading = ref(false)

  const fetchProviders = async () => { /* ... */ }
  const addProvider = async (data) => { /* ... */ }
  const updateProvider = async (id, data) => { /* ... */ }
  const deleteProvider = async (id) => { /* ... */ }

  return { providers, loading, fetchProviders, addProvider, updateProvider, deleteProvider }
}
```

### 4.2 请求封装

```javascript
// 统一的请求方法
async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}
```

---

## 五、后端 API 结构

### 5.1 UI Modules (src/ui-modules/)

| 模块 | 文件 | 端点前缀 | 功能 |
|------|------|----------|------|
| 认证 | `auth.js` | `/api/login`, `/api/health` | 登录、Token 验证 |
| 配置 | `config-api.js` | `/api/config` | 配置 CRUD |
| 提供商 | `provider-api.js` | `/api/providers` | 提供商管理 |
| 用量 | `usage-api.js` | `/api/usage` | 用量统计 |
| OAuth | `oauth-api.js` | `/api/oauth` | OAuth 认证 |
| 插件 | `plugin-api.js` | `/api/plugins` | 插件管理 |
| 系统 | `system-api.js` | `/api/system` | 系统信息、日志 |
| 更新 | `update-api.js` | `/api/check-update`, `/api/update` | 版本更新 |
| 上传 | `upload-config-api.js` | `/api/upload-configs` | 配置上传 |
| 自定义模型 | `custom-models-api.js` | `/api/custom-models` | 模型管理 |
| 事件广播 | `event-broadcast.js` | `/api/events` | SSE 实时推送 |

### 5.2 请求处理管道

```
HTTP Request
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                   Request Handler                            │
│              src/handlers/request-handler.js                 │
├─────────────────────────────────────────────────────────────┤
│  1. CORS 处理                                                │
│  2. 静态文件服务                                             │
│  3. 插件路由分发                                             │
│  4. UI API 请求处理 (ui-modules/*.js)                      │
│  5. 健康检查 (/health)                                       │
│  6. 提供商路径重写                                           │
│  7. 认证流程 (插件 type='auth')                             │
│  8. 中间件流程 (插件 type='middleware')                     │
│  9. API 请求分发                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 六、事件广播机制

### 6.1 SSE 实时推送

```javascript
// 前端监听
const eventSource = new EventSource('/api/events')
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  switch (data.type) {
    case 'config_update':
      // 刷新配置
      break
    case 'provider_status_change':
      // 刷新提供商状态
      break
    case 'plugin_update':
      // 刷新插件状态
      break
  }
}
```

### 6.2 事件类型

| 事件类型 | 触发时机 |
|----------|----------|
| `config_update` | 配置更新时 |
| `provider_status_change` | 提供商状态变化时 |
| `plugin_update` | 插件状态变化时 |
| `log_cleared` | 日志清空时 |
| `service_restart` | 服务重启时 |

---

## 七、已知功能缺口分析

### 7.1 前端缺口

| 缺口 | 说明 | 状态 |
|------|------|------|
| 缺少错误边界 | 组件错误处理不完善 | 待修复 |
| 缺少加载状态管理 | 部分页面无骨架屏 | ✅ 已添加 Skeleton 组件 |
| 缺少表单验证 | Config.vue 表单校验 | ✅ Providers.vue 已完善 |
| 缺少操作确认 | 删除操作无二次确认弹窗 | ✅ 已添加 ConfirmModal + useConfirm |
| 缺少 Toast 通知 | 操作成功/失败无提示 | ✅ 已实现 useToast + GlobalToast |
| 缺少响应式优化 | 移动端适配不完整 | 待修复 |
| 缺少主题切换 | 无深色模式 | 待修复 |
| 缺少国际化 | 硬编码中文 | 待修复 |

### 7.2 后端缺口

| 缺口 | 说明 | 优先级 |
|------|------|--------|
| 缺少批量操作 API | 批量启用/禁用/删除节点 | P1 |
| 缺少配置备份/恢复 | 仅支持下载全部配置 | P1 |
| 缺少 WebSocket | 实时监控推荐 WebSocket | P2 |
| 缺少 API 文档 | 无 OpenAPI/Swagger | P2 |
| 缺少审计日志 | 操作记录不可追溯 | P2 |
| 缺少用户管理 | 仅单一管理员账户 | P3 |

---

## 八、组件依赖关系图

```
┌─────────────────────────────────────────────────────────────┐
│                        App.vue                              │
│                    (根组件/路由)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     src/views/                              │
├─────────────────────────────────────────────────────────────┤
│  Login.vue ──────► useAuth() ──────► /api/login             │
│                                                              │
│  Dashboard.vue ──► useSystemMonitor() ──► /api/system      │
│           ├──► useProviderPool() ──► /api/providers        │
│           └──► useModelList() ──► /api/models               │
│                                                              │
│  Config.vue ────► useConfig() ────────► /api/config         │
│                                                              │
│  Providers.vue ─► useProviderPool() ─► /api/providers      │
│           └──► useOAuth() ────────► /api/oauth               │
│                                                              │
│  Usage.vue ─────► useUsage() ───────► /api/usage            │
│                                                              │
│  Plugins.vue ───► usePlugins() ─────► /api/plugins          │
│                                                              │
│  Logs.vue ──────► useLogs() ────────► /api/system          │
│                                                              │
│  UploadConfig.vue ► useUploadConfig() ─► /api/upload-configs│
└─────────────────────────────────────────────────────────────┘
```

---

## 九、完善计划

### Phase 1: 基础体验优化 ✅ 已完成

1. **添加 Toast 通知系统** ✅
   - ✅ `useToast` composable (`src/composables/useToast.js`)
   - ✅ `GlobalToast.vue` 全局容器组件
   - ✅ 支持成功、警告、错误类型

2. **完善表单验证** ✅
   - ✅ Providers.vue 表单校验 (API Key 非空、URL 格式验证)
   - ✅ 实时错误提示

3. **添加加载骨架屏** ✅
   - ✅ `Skeleton.vue` 组件 (`src/components/common/Skeleton.vue`)
   - ✅ 支持 rect/circular/text/card 变体

4. **操作二次确认** ✅
   - ✅ `ConfirmModal.vue` 确认弹窗组件
   - ✅ `useConfirm` composable (`src/composables/useConfirm.js`)
   - ✅ Providers.vue 删除操作已集成

### Phase 2: 功能增强 (P1)

5. **批量操作支持**
   - 批量启用/禁用提供商
   - 批量删除不健康节点
   - 批量刷新 Token

6. **配置备份与恢复**
   - 单个配置文件备份
   - 一键恢复功能
   - 配置版本历史

### Phase 3: 交互优化 (P2)

7. **实时通知集成**
   - WebSocket 连接 (替代 SSE)
   - 实时推送告警

8. **Dashboard 图表优化**
   - 引入 ECharts 或 Chart.js 替代手绘 Canvas
   - 支持更多图表类型

### Phase 4: 长期优化 (P3)

9. **主题切换**
   - 深色模式支持
   - 主题持久化

10. **国际化**
    - i18n 框架集成
    - 中英文切换

11. **单元测试**
    - 引入 Vitest + Vue Test Utils
    - 关键组件测试覆盖

---

## 十、技术债务

| 债务项 | 说明 | 修复建议 |
|--------|------|----------|
| API 分散在 views 中 | 无统一的 API 管理中心 | 建立 `src/api/services/` 目录 |
| 硬编码 API 地址 | `http://localhost:5000` 硬编码 | 提取到环境变量 |
| 样式重复 | 多个组件样式相似 | 提取公共组件 |
| 无单元测试 | 前端无测试覆盖 | 引入 Vitest + Vue Test Utils |
| 图表自实现 | Dashboard.vue 手绘 Canvas 图表 | 引入 ECharts 或 Chart.js |

---

## 附录: API 端点完整列表

### 认证相关
- `POST /api/login` - 用户登录
- `GET /api/health` - Token 验证

### 配置相关
- `GET /api/config` - 获取配置
- `POST /api/config` - 更新配置
- `POST /api/reload-config` - 重载配置
- `POST /api/admin-password` - 修改密码

### 提供商相关
- `GET /api/providers` - 获取所有提供商
- `POST /api/providers` - 添加提供商
- `PUT /api/providers/{id}` - 更新提供商
- `DELETE /api/providers/{id}` - 删除提供商
- `POST /api/providers/{type}/{uuid}/health-check` - 健康检查
- `POST /api/providers/{type}/generate-auth-url` - 生成 OAuth URL

### 用量相关
- `GET /api/usage` - 获取所有用量
- `GET /api/usage/{providerType}` - 获取特定用量

### 插件相关
- `GET /api/plugins` - 获取插件列表
- `POST /api/plugins/{name}/toggle` - 切换插件状态

### 系统相关
- `GET /api/system` - 获取系统信息
- `GET /api/system/monitor` - 获取监控数据
- `GET /api/system/download-log` - 下载日志
- `POST /api/system/clear-log` - 清空日志
- `GET /api/check-update` - 检查更新
- `POST /api/update` - 执行更新

### 配置文件相关
- `GET /api/upload-configs` - 获取配置列表
- `GET /api/upload-configs/view/{path}` - 查看配置
- `GET /api/upload-configs/download/{path}` - 下载配置
- `DELETE /api/upload-configs/{path}` - 删除配置
- `POST /api/upload-oauth-credentials` - 上传凭据

### 事件推送
- `GET /api/events` - SSE 实时事件流
