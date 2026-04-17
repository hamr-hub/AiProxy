# 测试

## 框架

Jest（ES Modules），配置见根目录 `.babelrc`。

## 运行测试

```bash
# 全部测试
npm test

# 指定文件
npx jest ./tests/api-integration.test.js

# 指定用例
npx jest ./tests/api-integration.test.js -t "OpenAI Compatible Endpoints"
```

## 测试文件结构

```
tests/
├── api-integration.test.js          # HTTP 集成测试（需要运行中的服务器）
├── security-fixes.test.js           # 安全集成测试
├── claude-kiro.unit.test.js         # Kiro 单元测试
├── codex-oauth.unit.test.js         # Codex OAuth 单元测试
├── provider-enhancements.unit.test.js # 提供商增强单元测试
├── provider-models.unit.test.js     # 提供商模型单元测试
├── security-fixes.unit.test.js      # 安全单元测试
├── concurrent-test.js               # 并发手动测试
├── health-concurrent-test.js        # 健康检查并发手动测试
└── fixtures/                        # 测试数据
    ├── claude/                      # Claude 请求/响应 fixtures
    ├── gemini/                      # Gemini 请求/响应 fixtures
    ├── openai/                      # OpenAI 请求/响应 fixtures
    └── openaiResponses/             # OpenAI Responses API fixtures
```

## 测试类型

- **单元测试** (`*.unit.test.js`)：独立模块测试，不依赖外部服务
- **集成测试** (`*integration*.test.js`, `security-fixes.test.js`)：需要启动服务器
- **手动并发测试** (`concurrent-test.js`)：手动执行的压力测试

## Fixtures 使用约定

Fixtures 存放在 `tests/fixtures/{provider}/` 下，格式为 JSON，包含请求体和预期响应，用于协议转换测试。

---

*最后更新: 2026-04-17 (已验证测试文件与实际一致)*
