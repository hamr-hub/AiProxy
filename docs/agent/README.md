# AI Flow 文档索引

> 重要：YAML 协议见 yaml-contracts.md（tech/plan/verify 统一口径）

---

## 📋 文档索引

| 我想做的事 | 先看 | 再看 |
|---|---|---|
| 了解项目架构 | README.md | AGENTS.md |
| 开发规范 | .codeflicker/rules.md | conventions.md |
| 新增 API 接口/路由 | architecture.md | conventions.md |
| 数据库/ORM 操作 | architecture.md | conventions.md |
| 安全合规/敏感信息 | security-guidelines.md | conventions.md |
| 从需求到代码 | requirement-to-code-workflow.md | requirement-template.md |

---

## 🚀 快速参考

### 常用命令

```bash
# 开发
npm run dev

# 测试
npm test

# 代码质量
npm run lint

# 构建
npm run build
```

### 四条硬规则

1. 所有 API 必须有请求验证
2. 敏感信息（密码、Token）必须加密存储
3. 所有数据库查询必须防止 SQL 注入
4. 不在日志中输出敏感信息（密码、Token、身份证等）

---

## 📚 目录结构

```
src/
├── auth/                 # OAuth 认证模块
├── core/                 # 核心模块（Master, Config, Plugin）
├── converters/           # 协议转换引擎
├── handlers/            # 请求处理
├── plugins/             # 插件系统
├── providers/           # AI 提供商适配器
├── services/            # 服务层
├── ui-modules/          # UI 后端 API
├── utils/               # 工具函数
└── views/               # Vue 视图组件
```

---

## 🔧 关键约束

- 接口模型统一出口
- 错误处理与兜底统一
- 配置通过环境变量管理，不硬编码

---

*最后更新: 2026-04-17*
