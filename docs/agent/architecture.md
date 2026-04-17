# 架构设计

## 进程模型

```
主进程 (master.js, port 3100)
    └── fork() → Worker 进程 (api-server.js, port 3000)
```

- 主进程监控 Worker，崩溃后自动重启
- `IS_WORKER_PROCESS=true` 环境变量标识 Worker
- 优雅关闭：SIGTERM → 5秒超时 → SIGKILL

## 请求处理管道

```
HTTP Request → request-handler.js
  1. CORS 处理
  2. 静态文件（/static/, /login.html）
  3. 插件路由分发
  4. UI API（/api/config, /api/providers 等）
  5. 健康检查（/health）
  6. 提供商路径重写（/gemini-cli-oauth/v1/... → 切换 MODEL_PROVIDER）
  7. 认证（AUTH 类型插件）
  8. 中间件（MIDDLEWARE 类型插件）
  9. API 分发（api-manager.js）
```

## 提供商适配器

所有提供商通过 `src/providers/adapter.js` 统一注册，实现 `ApiServiceAdapter` 接口：

```javascript
generateContent(model, requestBody)
generateContentStream(model, requestBody)
listModels()
refreshToken() / forceRefreshToken()
isExpiryDateNear()
```

| 提供商常量 | 协议 | 认证 |
|-----------|------|------|
| `gemini-cli-oauth` | Gemini/OpenAI | OAuth 2.0 |
| `openai-custom` | OpenAI | API Key |
| `claude-custom` | Claude | API Key |
| `claude-kiro-oauth` | Claude/OpenAI | OAuth 2.0 |
| `openai-codex-oauth` | Responses | OAuth 2.0 |
| `grok-custom` | OpenAI | Cookie/SSO |
| `local-model` | OpenAI | 无 |

## 提供商池管理器

`provider-pool-manager.js` 核心机制：

- **LRU 评分**：`Score = baseScore + usageScore + sequenceScore + loadScore + freshBonus`
- **故障转移链**：`providerFallbackChain` 配置，主提供商全部不健康时切换
- **模型降级**：`modelFallbackMapping` 配置，特定模型不可用时映射替代
- **并发控制**：`concurrencyLimit + queueLimit`
- **令牌刷新**：缓冲队列去重，全局 2 个并行，每提供商内部 1 个

## 插件系统

插件位于 `src/plugins/`，分两类：

- `AUTH`：参与认证流程（`authenticate()` 方法）
- `MIDDLEWARE`：标准请求中间件（`middleware()` 方法）

内置插件：`default-auth`、`ai-monitor`（全链路抓包）、`api-potluck`（Key 管理）、`model-usage-stats`

新增插件：创建 `src/plugins/{name}/index.js`，实现接口，在 `configs/plugins.json` 中启用。

## 协议转换

`src/converters/strategies/` 中的双向转换：

- `OpenAIConverter`：OpenAI → Claude 格式
- `ClaudeConverter`：Claude → OpenAI 格式
- `GeminiConverter`：Gemini → OpenAI 格式
- `GrokConverter`：Grok → OpenAI 格式

## 设计模式

| 模式 | 位置 |
|------|------|
| 策略模式 | 各提供商 `*-core.js`、转换器策略 |
| 适配器模式 | `ApiServiceAdapter` 接口 |
| 工厂模式 | `getServiceAdapter(config)` |
| 单例模式 | `PluginManager`、服务实例缓存 |
| 观察者模式 | `event-broadcast.js` |
| 责任链模式 | `providerFallbackChain` |

---

*最后更新: 2026-04-17*
