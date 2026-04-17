# 开发命令

## 环境说明

- development（开发环境）
- staging（预发布环境）
- production（生产环境）

## 开发

```bash
# 启动开发服务器
npm run dev

# 监听文件变化自动重启
npm run dev:watch
```

## 构建

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 代码质量

```bash
# ESLint 检查
npm run lint

# 自动修复
npm run lint:fix
```

## 测试

```bash
# 运行所有测试
npm test

# 运行测试并监听
npm run test:watch
```

## 常见问题

### 端口占用

修改 `configs/config.json` 中的 `SERVER_PORT` 配置，或设置环境变量：

```bash
SERVER_PORT=3001 npm run dev
```

### 数据库连接失败

检查 `configs/config.json` 中的数据库配置。

---

*最后更新: 2026-04-17*
