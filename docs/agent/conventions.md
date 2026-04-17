# 目录结构约定

## 项目结构

```
src/
├── auth/                     # OAuth 认证模块
│   ├── gemini-oauth.js
│   ├── kiro-oauth.js
│   ├── codex-oauth.js
│   └── oauth-handlers.js
├── core/                     # 核心模块
│   ├── master.js             # 主进程管理
│   ├── config-manager.js    # 配置管理
│   └── plugin-manager.js     # 插件管理
├── converters/               # 协议转换
│   ├── strategies/           # 转换策略
│   │   ├── ClaudeConverter.js
│   │   ├── GeminiConverter.js
│   │   └── GrokConverter.js
│   └── register-converters.js
├── handlers/                 # 请求处理
│   └── request-handler.js
├── plugins/                  # 插件系统
│   ├── ai-monitor/
│   ├── api-potluck/
│   └── model-usage-stats/
├── providers/                # AI 提供商
│   ├── adapter.js           # 适配器注册表
│   ├── provider-pool-manager.js
│   ├── claude/
│   ├── gemini/
│   ├── grok/
│   └── openai/
├── services/                 # 服务层
├── ui-modules/              # UI 后端 API
├── utils/                    # 工具函数
└── views/                    # Vue 视图
```

## 配置目录

```
configs/
├── config.json              # 主配置
├── plugins.json             # 插件配置
└── provider_pools.json      # 提供商池配置
```

---

## 代码片段复用（Snippets）

**位置**：`.codeflicker/snippets/` 目录

**分类**：
- `controllers/`：控制器片段
- `middleware/`：中间件片段
- `services/`：服务层片段
- `utils/`：工具函数片段

**命名规则**：`{分类}-{功能描述}.js`

---

## API 设计规范

### RESTful API

- GET：获取资源
- POST：创建资源
- PUT/PATCH：更新资源
- DELETE：删除资源

### URL 命名

- 小写字母 + 连字符（如 `/api/v1/user-profiles`）

### HTTP 状态码

- 200 OK：成功
- 201 Created：创建成功
- 400 Bad Request：请求参数错误
- 401 Unauthorized：未认证
- 403 Forbidden：无权限
- 404 Not Found：资源不存在
- 500 Internal Server Error：服务器错误

---

## 错误处理

### 统一错误格式

```json
{
  "code": 400,
  "message": "Invalid request parameters",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 日志规范

- 日志级别：debug / info / warn / error
- 敏感信息：禁止记录密码、Token、身份证等

---

*最后更新: 2026-04-17*
