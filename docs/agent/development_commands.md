# 开发命令

## 启动服务

```bash
# 启动 Node.js API 网关（Worker 进程）
cd packages/node-proxy && node src/main.js

# 启动前端开发服务器（Vue 3）
npm run dev

# 预览构建结果
npm run preview
```

## 构建

```bash
# 构建前端静态资源
npm run build

# 构建 Go TLS Sidecar
cd packages/go-sidecar && go build -o tls-sidecar
```

## 测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npx jest ./tests/api-integration.test.js

# 运行特定测试用例
npx jest ./tests/api-integration.test.js -t "OpenAI Compatible Endpoints"
```

## 环境变量覆盖

```bash
# 覆盖端口
SERVER_PORT=3001 node src/main.js

# 标识 Worker 进程（由 Master 自动设置，无需手动）
IS_WORKER_PROCESS=true node src/main.js
```

## 系统服务管理（生产环境）

```bash
sudo systemctl restart aiclient-node
sudo systemctl restart aiclient-python
sudo systemctl status aiclient-node
journalctl -u aiclient-node -f
```

## 端口说明

| 端口 | 用途 |
|------|------|
| 3000 | Worker API 服务（默认） |
| 3100 | Master 管理端点（/master/status, /master/restart 等） |

## 配置文件路径

| 文件 | 用途 |
|------|------|
| `configs/config.json` | 主配置（端口、API Key、提供商等） |
| `configs/plugins.json` | 插件启用/禁用 |
| `configs/provider_pools.json` | 提供商池定义 |
| `configs/pwd` | Web UI 密码 |

---

*最后更新: 2026-04-17*
