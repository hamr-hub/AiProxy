# 研发资产报告

> 本报告由 rd-asset-review 自动生成，基于实际代码扫描

## 项目概览

| 属性 | 值 |
|------|-----|
| **项目名称** | AiProxy |
| **项目类型** | Node.js API 代理中间件 (Monorepo) |
| **主框架** | 自定义 HTTP 服务器 + Vue.js 3 |
| **语言** | JavaScript (ES Modules) |
| **包管理** | pnpm workspaces |
| **生成时间** | 2026-04-17 |

---

## 目录结构

```
packages/
├── node-proxy/src/         # 主 Node.js 代理服务
│   ├── auth/               # OAuth 认证模块 (7 文件)
│   ├── core/               # 核心模块 (3 文件)
│   ├── converters/         # 协议转换 (10 文件)
│   ├── handlers/           # 请求处理 (1 文件)
│   ├── plugins/            # 插件系统 (4 目录)
│   ├── providers/          # AI 提供商 (30+ 文件)
│   ├── services/           # 服务层 (5 文件)
│   ├── ui-modules/         # UI 后端 API (15 文件)
│   ├── utils/              # 工具函数 (17 文件)
│   └── views/              # Vue 视图
├── go-sidecar/             # Go TLS 指纹 Sidecar
└── python-controller/      # Python FastAPI 本地 LLM 控制器
```

---

## 核心模块

### 提供商适配器

| 提供商常量 | 核心文件 | 认证方式 | 说明 |
|-----------|---------|---------|------|
| `gemini-cli-oauth` | `src/providers/gemini/gemini-core.js` | OAuth 2.0 | Gemini API |
| `gemini-antigravity` | `src/providers/gemini/antigravity-core.js` | Cookie/SSO | Gemini 反重力 |
| `claude-custom` | `src/providers/claude/claude-core.js` | API Key | Claude API |
| `claude-kiro-oauth` | `src/providers/claude/claude-kiro.js` | OAuth 2.0 | Kiro API |
| `openai-custom` | `src/providers/openai/openai-core.js` | API Key | OpenAI API |
| `openaiResponses-custom` | `src/providers/openai/openai-responses-core.js` | API Key | OpenAI Responses API |
| `openai-codex-oauth` | `src/providers/openai/codex-core.js` | OAuth 2.0 | Codex API |
| `openai-qwen-oauth` | `src/providers/openai/qwen-core.js` | OAuth 2.0 | Qwen API |
| `openai-iflow` | `src/providers/openai/iflow-core.js` | OAuth 2.0 | iFlow API |
| `grok-custom` | `src/providers/grok/grok-core.js` | Cookie/SSO | Grok API |
| `forward-api` | `src/providers/forward/forward-core.js` | API Key | 透明转发 |
| `local-model` | `src/providers/local/local-core.js` | 无 | 本地模型 |
| `auto` | `src/providers/adapter.js` | - | 自动选择 |

### OAuth 认证模块

| 文件 | 说明 |
|------|------|
| `src/auth/gemini-oauth.js` | Gemini OAuth 2.0 |
| `src/auth/kiro-oauth.js` | Kiro OAuth 2.0 |
| `src/auth/codex-oauth.js` | Codex OAuth 2.0 |
| `src/auth/qwen-oauth.js` | Qwen OAuth 2.0 |
| `src/auth/iflow-oauth.js` | iFlow OAuth 2.0 |
| `src/auth/oauth-handlers.js` | OAuth 路由分发 |
| `src/auth/index.js` | 模块入口 |

### 协议转换

| 转换器 | 文件 | 说明 |
|--------|------|------|
| `ClaudeConverter` | `src/converters/strategies/ClaudeConverter.js` | Claude → OpenAI |
| `OpenAIConverter` | `src/converters/strategies/OpenAIConverter.js` | OpenAI → Claude |
| `GeminiConverter` | `src/converters/strategies/GeminiConverter.js` | Gemini → OpenAI |
| `GrokConverter` | `src/converters/strategies/GrokConverter.js` | Grok → OpenAI |
| `CodexConverter` | `src/converters/strategies/CodexConverter.js` | Codex Responses → OpenAI |
| `OpenAIResponsesConverter` | `src/converters/strategies/OpenAIResponsesConverter.js` | OpenAI Responses → Claude |

### 插件系统

| 插件 | 类型 | 说明 |
|------|------|------|
| `src/plugins/default-auth/` | AUTH | 默认 API Key 认证 |
| `src/plugins/ai-monitor/` | MIDDLEWARE | 全链路请求/响应抓包 |
| `src/plugins/api-potluck/` | MIDDLEWARE | API Key 池管理 |
| `src/plugins/model-usage-stats/` | MIDDLEWARE | 模型用量统计 |

---

## 服务层

| 文件 | 说明 |
|------|------|
| `src/services/api-server.js` | HTTP 服务器主体 |
| `src/services/api-manager.js` | API 请求分发 |
| `src/services/service-manager.js` | 服务生命周期管理 |
| `src/services/ui-manager.js` | UI API 路由 |
| `src/services/usage-service.js` | 用量统计服务 |

---

## 工具函数

| 文件 | 说明 |
|------|------|
| `src/utils/logger.js` | 统一日志 |
| `src/utils/error-handler.js` | 错误处理 |
| `src/utils/auth-utils.js` | 认证工具 |
| `src/utils/constants.js` | 常量定义 (MODEL_PROVIDER, MODEL_PROTOCOL_PREFIX 等) |
| `src/utils/network-utils.js` | 网络工具 |
| `src/utils/provider-utils.js` | 提供商工具 |
| `src/utils/content-handler.js` | 内容处理 |
| `src/utils/format-utils.js` | 格式转换 |
| `src/utils/model-list-handler.js` | 模型列表处理 |
| `src/utils/request-handlers.js` | 请求处理工具 |
| `src/utils/tls-sidecar.js` | TLS Sidecar 通信 |
| `src/utils/token-utils.js` | Token 工具 |
| `src/utils/proxy-utils.js` | 代理工具 |
| `src/utils/provider-strategy.js` | 提供商策略 |
| `src/utils/grok-assets-proxy.js` | Grok 资产代理 |

---

## 配置管理

| 配置 | 路径 |
|------|------|
| 主配置 | `configs/config.json` |
| 插件配置 | `configs/plugins.json` |
| 提供商池 | `configs/provider_pools.json` |
| Web UI 密码 | `configs/pwd` |

---

## Sidecar & Controller

| 组件 | 路径 | 说明 |
|------|------|------|
| Go TLS Sidecar | `packages/go-sidecar/main.go` | TLS 指纹代理，用于规避 TLS 检测 |
| Python Controller | `packages/python-controller/main.py` | FastAPI 本地 LLM 控制器 (vLLM 等) |

---

## 代码片段

已提取到 `.codeflicker/snippets/`：

- `utils/logger.js` - 日志工具
- `utils/constants.js` - 常量定义
- `utils/error-handler.js` - 错误处理
- `utils/format-utils.js` - 格式转换
- `services/usage-service.ts` - 用量服务
- `views/Dashboard.vue` - 仪表盘视图
- `views/Config.vue` - 配置视图
- `views/Providers.vue` - 提供商视图
- `views/Logs.vue` - 日志视图
- `views/Plugins.vue` - 插件视图
- `tests/adapter.test.js` - 适配器测试
- `tests/provider-pool-manager.test.js` - 池管理测试

---

*报告生成时间: 2026-04-17*
*AI Flow rd-asset-review v0.4.7*
