# 研发资产报告

> 本报告由 rd-asset-review 自动生成，基于实际代码扫描

## 项目概览

| 属性 | 值 |
|------|-----|
| **项目名称** | AIClient-2-API |
| **项目类型** | Node.js API 代理中间件 |
| **主框架** | Express + Vue.js 3 |
| **语言** | JavaScript (ES Modules) |
| **生成时间** | 2026-04-17 |

---

## 目录结构

```
src/
├── auth/                     # OAuth 认证模块 (7 文件)
├── core/                     # 核心模块 (3 文件)
├── converters/               # 协议转换 (9 文件)
├── handlers/                 # 请求处理 (1 文件)
├── plugins/                  # 插件系统 (10 文件)
├── providers/                # AI 提供商 (26 文件)
├── services/                 # 服务层 (5 文件)
├── ui-modules/              # UI 后端 API (15 文件)
├── utils/                    # 工具函数 (17 文件)
├── views/                    # Vue 视图 (11 文件)
└── router/                   # 路由 (1 文件)
```

---

## 核心模块

### 提供商适配器

| 提供商 | 核心文件 | 说明 |
|--------|---------|------|
| Gemini | `src/providers/gemini/gemini-core.js` | Gemini API |
| Claude | `src/providers/claude/claude-core.js` | Claude API |
| Grok | `src/providers/grok/grok-core.js` | Grok API |
| OpenAI | `src/providers/openai/openai-core.js` | OpenAI API |
| Codex | `src/providers/openai/codex-core.js` | Codex API |
| Local | `src/providers/local/local-core.js` | 本地模型 |

### 协议转换

| 转换器 | 文件 |
|--------|------|
| OpenAI → Claude | `src/converters/strategies/ClaudeConverter.js` |
| Claude → OpenAI | `src/converters/strategies/OpenAIConverter.js` |
| Gemini → OpenAI | `src/converters/strategies/GeminiConverter.js` |
| Grok → OpenAI | `src/converters/strategies/GrokConverter.js` |

### 插件系统

- `src/plugins/ai-monitor/` - AI 接口监控
- `src/plugins/api-potluck/` - API Key 管理
- `src/plugins/model-usage-stats/` - 用量统计
- `src/plugins/default-auth/` - 默认认证

---

## 工具函数

| 分类 | 文件 |
|------|------|
| 日志 | `src/utils/logger.js` |
| 错误处理 | `src/utils/error-handler.js` |
| 认证 | `src/utils/auth-utils.js` |
| 常量 | `src/utils/constants.js` |
| 网络 | `src/utils/network-utils.js` |
| 提供商 | `src/utils/provider-utils.js` |

---

## 配置管理

| 配置 | 路径 |
|------|------|
| 主配置 | `configs/config.json` |
| 插件配置 | `configs/plugins.json` |
| 提供商池 | `configs/provider_pools.json` |

---

## 代码片段

已提取 13 个代码片段到 `.codeflicker/snippets/`：

- `services/usage-service.ts` - 用量服务
- `utils/logger.js` - 日志工具
- `utils/constants.js` - 常量定义
- `utils/error-handler.js` - 错误处理
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
