<div align="center">

<img src="src/img/logo-mid.webp" alt="logo"  style="width: 128px; height: 128px;margin-bottom: 3px;">

# AiProxy 🚀

**A powerful proxy that converts client-only AI model APIs (Gemini CLI, Antigravity, Codex, Grok, Kiro...) into unified OpenAI-compatible local interfaces.**

<a href="https://trendshift.io/repositories/15832" target="_blank"><img src="https://trendshift.io/api/badge/repositories/15832" alt="justlovemaki%2FAiProxy | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>
</div>

<div align="center">

<a href="https://deepwiki.com/justlikemaki/AiProxy"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"  style="width: 134px; height: 23px;margin-bottom: 3px;"></a>

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js](https://img.shields.io/badge/Node.js-≥20.0.0-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-≥20.0.0-blue.svg)](https://hub.docker.com/r/justlikemaki/aiclient-2-api)
[![GitHub stars](https://img.shields.io/github/stars/justlovemaki/AiProxy.svg?style=flat&label=Star)](https://github.com/justlovemaki/AiProxy/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/justlovemaki/AiProxy.svg)](https://github.com/justlovemaki/AiProxy/issues)

[**🔧 OpenClaw Configuration**](./docs/OPENCLAW_CONFIG_GUIDE.md) | [**👈 中文**](./README-ZH.md) | [English](./README.md) | [日本語](./README-JA.md) | [**📚 Full Documentation**](https://aiproxy.justlikemaki.vip/zh/)

</div>

## 💎 Sponsors

<table width="100%">
  <tr>
    <td width="25%" align="center" valign="middle">
      <a href="https://www.packyapi.com/register?aff=AiProxy">
        <img src="static/packycode.png" alt="PackyCode Sponsor" width="180">
      </a>
    </td>
    <td width="75%" align="left" valign="middle">
      PackyCode is a reliable API proxy service providing Claude Code, Codex, Gemini and more. Use code <strong>AiProxy</strong> for <strong>10% discount</strong>. <a href="https://www.packyapi.com/register?aff=AiProxy">Register here</a>
    </td>
  </tr>
  <tr>
    <td width="25%" align="center" valign="middle">
      <a href="https://www.aicodemirror.com/register?invitecode=5BUE62">
        <img src="static/aicodemirror.jpg" alt="AICodeMirror Sponsor" width="180">
      </a>
    </td>
    <td width="75%" align="left" valign="middle">
      AICodeMirror offers enterprise-grade API relay for Claude Code / Codex / Gemini CLI. Use <a href="https://www.aicodemirror.com/register?invitecode=5BUE62">this link</a> for <strong>20% off your first charge</strong>, up to 25% for enterprise!
    </td>
  </tr>
  <tr>
    <td width="25%" align="center" valign="middle">
      <a href="https://www.lingtrue.com/register?aff=MP34">
        <img src="static/lingtrueapi.png" alt="LingtrueAPI Sponsor" width="180">
      </a>
    </td>
    <td width="75%" align="left" valign="middle">
      LingtrueAPI provides global AI model API relay including Claude opus 4.6, GPT 5.4, Gemini 3.1 pro. Use code <strong>LingtrueAPI</strong> for <strong>10% discount</strong>. <a href="https://www.lingtrue.com/register?aff=MP34">Register here</a>
    </td>
  </tr>
  <tr>
    <td width="25%" align="center" valign="middle">
      <a href="https://poixe.com/i/ebmvga">
        <img src="static/poixeai.png" alt="Poixe AI Sponsor" width="180">
      </a>
    </td>
    <td width="75%" align="left" valign="middle">
      Poixe AI provides reliable AI model API services. <a href="https://poixe.com/i/ebmvga">Register with this link</a> and get an extra <strong>$5 credit</strong>.
    </td>
  </tr>
  <tr>
    <td width="25%" align="center" valign="middle">
      <img src="static/wechat.png" alt="Sponsor Contact" width="150">
    </td>
    <td width="75%" align="left" valign="middle">
      <strong>Become a Sponsor</strong><br>
      Add our WeChat (please specify: <strong>Sponsor</strong>).
    </td>
  </tr>
</table>

---

## 🚀 Project Overview

`AiProxy` is an API proxy service that breaks client-only limitations, converting free AI models like Gemini, Antigravity, Codex, Grok, and Kiro into standard OpenAI-compatible interfaces. Built on Node.js with intelligent protocol conversion between OpenAI, Claude, and Gemini, enabling tools like Cherry-Studio, NextChat, and Cline to freely use premium models like Claude Opus 4.5 and Gemini 3.0 Pro. The project uses modular architecture with strategy and adapter patterns, featuring account pool management, intelligent polling, automatic failover, and health checks ensuring 99.9% service availability.

> [!NOTE]
> **🎉 Milestones**
>
> - Thanks to Ruan Yifeng's recommendation in [Weekly Issue 359](https://www.ruanyifeng.com/blog/2025/08/weekly-issue-359.html)

> **📅 Changelog**
>
> <details>
> <summary>Click to expand full version history</summary>
>
> - **2026.03.02** - Added Grok protocol support with Cookie/SSO access to xAI Grok models (Grok 3/4), multimodal input, image/video generation, auto token refresh, and streaming
> - **2026.01.26** - Added Codex protocol support with OpenAI Codex OAuth authorization
> - **2026.01.25** - Enhanced AI Monitor plugin with pre/post conversion request/response monitoring. Optimized log management with unified format and visual config
> - **2026.01.15** - Optimized Provider Pool Manager with async refresh queue, deduplication buffer, global concurrency control, node preheating and auto expiry detection
> - **2026.01.03** - Added theme switching and optimized provider pool initialization, removed fallback to provider default config strategy
> - **2025.12.30** - Added master process management and auto-update
> - **2025.12.25** - Unified config management: all configs moved to `configs/` directory. Docker users must update mount path to `-v "local-path:/app/configs"`
> - **2025.12.11** - Docker image auto-build and publish to Docker Hub: [justlikemaki/aiclient-2-api](https://hub.docker.com/r/justlikemaki/aiclient-2-api)
> - **2025.11.30** - Added Antigravity protocol support for Google internal Gemini 3 Pro, Claude Sonnet 4.5 access
> - **2025.11.11** - Added Web UI management console with real-time config management and health monitoring
> - **2025.11.06** - Added Gemini 3 preview support, enhanced model compatibility
> - **2025.10.18** - Kiro opens registration, 500 credits for new users, full Claude Sonnet 4.5 support
> - **2025.08.29** - Released account pool management with multi-account polling, intelligent failover and auto degradation
>   - Config: Add `PROVIDER_POOLS_FILE_PATH` in `configs/config.json`
>   - Reference: [provider_pools.json](./configs/provider_pools.json.example)
> - **Historical**
>   - Gemini CLI, Kiro client to API support
>   - OpenAI, Claude, Gemini protocol conversion with intelligent switching
> </details>

---

## 💡 Core Features

### 🎯 Unified Access, One-Stop Management
*   **Multi-Model Unified Interface**: Standard OpenAI-compatible protocol for Gemini, Claude, Grok, Codex, Kimi K2, MiniMax M2 and more
*   **Flexible Switching**: Path routing, startup parameters, and environment variables for dynamic model switching
*   **Zero Migration Cost**: Fully OpenAI API compatible, use with Cherry-Studio, NextChat, Cline without modifications
*   **Multi-Protocol Intelligent Conversion**: OpenAI, Claude, Gemini protocol conversion for cross-protocol model calls

### 🚀 Break Limitations, Improve Efficiency
*   **Bypass Official Limits**: OAuth authorization effectively breaks free API rate and quota limits for Gemini, Antigravity and more
*   **TLS Fingerprint Bypass**: Built-in TLS Sidecar (Go uTLS) simulates browser fingerprints to bypass Cloudflare 403 blocks
*   **Free Premium Models**: Use Claude Opus 4.5 free via Kiro API mode
*   **Account Pool Scheduling**: Multi-account polling, auto failover and degradation for 99.9% availability

### 🛡️ Secure & Controllable, Data Transparent
*   **Full-Chain Logging**: Capture all request/response data for audit and debugging
*   **Private Dataset Building**: Build exclusive training datasets from logs
*   **System Prompt Management**: Override and append modes for unified base instructions

### 🔧 Developer Friendly, Easy to Extend
*   **Web UI Management Console**: Real-time config, health monitoring, API testing, log viewing
*   **Modular Architecture**: Strategy and adapter patterns - add new providers in 3 steps
*   **Complete Test Coverage**: Integration and unit tests at 90%+
*   **Containerized Deployment**: Docker support for cross-platform one-click deployment

---

## 📑 Quick Navigation

- [💡 Core Features](#-core-features)
- [🚀 Quick Start](#-quick-start)
  - [🐳 Docker Deployment](#-docker-deployment)
  - [⚙️ Local Deployment](#️-local-deployment)
  - [🔧 Frontend Structure](#-frontend-structure)
  - [🤝 App-Controller Integration](#-app-controller-integration)
- [📋 Core Functions](#-core-functions)
- [🔐 Authorization Guide](#-authorization-guide)
- [📁 Credential Storage Paths](#-credential-storage-paths)
- [⚙️ Advanced Configuration](#advanced-configuration)
- [❓ FAQ](#-faq)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)
- [⚠️ Disclaimer](#️-disclaimer)

---

## 🔧 Usage Guide

### 🚀 Quick Start

Recommended way to start AiProxy is via automated script with **Web UI Console** for visual configuration.

---

### 🐳 Docker Deployment

#### Method 1: Docker Run (Recommended)

```bash
docker run -d \
  -p 3000:3000 \
  -p 8085-8087:8085-8087 \
  -p 1455:1455 \
  -p 19876-19880:19876-19880 \
  --restart=always \
  -v "your-path:/app/configs" \
  --name aiproxy \
  justlikemaki/aiclient-2-api
```

**Parameters**:
- `-p 3000:3000`: Web UI port
- `-p 8085-8087:8085-8087`: OAuth callback ports (Gemini: 8085, Antigravity: 8086, Reserved: 8087)
- `-p 1455:1455`: Codex OAuth callback
- `-p 19876-19880:19876-19880`: Kiro OAuth callback range
- `-v "your-path:/app/configs"`: Mount config directory
- `--restart=always`: Auto-restart policy

#### Method 2: Docker Compose

```bash
cd docker
mkdir -p configs
docker compose up -d
```

To build from source instead of using pre-built image:
1. Comment out `image: justlikemaki/aiclient-2-api:latest`
2. Uncomment the `build:` section
3. Run `docker compose up -d --build`

---

### ⚙️ Local Deployment

#### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Go >= 1.20 (for TLS Sidecar)

#### Installation

**1. Clone the project**
```bash
git clone https://github.com/justlovemaki/AiProxy.git
cd AiProxy
```

**2. Install dependencies**
```bash
npm install
```

**3. (Optional) Compile TLS Sidecar**

For Grok and TLS fingerprint bypass services:
```bash
cd tls-sidecar
go build -o tls-sidecar
cd ..
```

**4. Start service**

Using automated script (recommended):
```bash
# Linux/macOS
chmod +x install-and-run.sh && ./install-and-run.sh

# Windows
double-click install-and-run.bat
```

Or manual start:
```bash
npm start
```

#### Startup Parameters

| Parameter | Description | Example |
|------|------|------|
| `--dev` | Development mode | `npm start -- --dev` |
| `--port` | Specify port | `npm start -- --port 3001` |
| `--project-id` | Google Cloud project ID | `npm start -- --project-id my-project` |
| `--provider-pools-file` | Provider pools config path | `npm start -- --provider-pools-file ./configs/provider_pools.json` |

---

### 🔧 Frontend Structure

The frontend is pure static HTML/CSS/JavaScript, no build tools needed, deployed with the server.

#### Frontend File Structure

```
static/
├── index.html          # Main entry
├── login.html          # Login page
├── favicon.ico         # Favicon
├── app/                # Frontend app logic
│   ├── app.js          # Main entry
│   ├── config-manager.js   # Config management
│   ├── provider-manager.js # Provider management
│   ├── event-handlers.js   # Event handlers
│   └── ...
├── components/         # UI components
│   ├── header.html     # Header
│   ├── sidebar.html    # Sidebar
│   ├── section-config.html    # Config page
│   ├── section-dashboard.html # Dashboard
│   └── ...
└── img/                # Images
```

#### Frontend Features

- **Responsive Design**: Desktop and mobile
- **Theme Switching**: Light/dark mode
- **Multi-language**: Chinese, English, Japanese
- **Real-time Logs**: WebSocket push
- **Hot Config Reload**: No restart needed

#### Access Frontend

After starting, open browser:
- **Web UI Console**: http://localhost:3000
- **Default Password**: `admin123` (can change in console or `pwd` file)

---

### 🤝 App-Controller Integration

`app-controller` is a Python FastAPI-based local LLM management service that works with AiProxy.

#### Architecture

```
┌──────────────────────────┐
│   AiProxy        │  ← Entry: Auth, UI, Protocol Proxy (Node.js)
└──────────┬──────────────┘
           │ OpenAI Protocol
           ▼
┌──────────────────────────┐
│   AI Controller         │  ← Control: Scheduling, Monitoring, Queue (Python/FastAPI)
└──────────┬──────────────┘
           │
           ▼
┌──────────────────────────┐
│     vLLM Instance       │  ← Inference: Actual Model
└──────────────────────────┘
```

#### Integration Steps

**1. Start app-controller**

```bash
cd app-controller
pip install -r requirements.txt
python main.py
```

Service starts at `http://localhost:5000`

**2. Configure Custom Provider in AiProxy**

Login to Web UI:
1. Go to **"Config Management"** → **"Provider Config"**
2. Add new custom provider
3. Set:
   - **Type**: Custom or OpenAI
   - **Base URL**: `http://localhost:5000`
   - **API Key**: Any value (local use doesn't verify)

**3. Configure Models**

Edit `app-controller/config.yaml`:
```yaml
models:
  gemma-2-9b:
    service: vllm-gemma
    port: 8000
    required_memory: 12GB

settings:
  concurrency_limit: 4
  min_available_memory: 2GB
```

#### App-Controller Deployment

**Docker Compose**:
```bash
cd app-controller
docker compose up -d
```

**Systemd**:
```bash
sudo cp app-controller/systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable ai-controller
sudo systemctl start ai-controller
```

---

## 📋 Core Functions

#### Web UI Management Console

![Web UI](src/img/en.png)

Full-featured web management interface:

**📊 Dashboard**: System overview, interactive route examples, client config guide

**⚙️ Config Management**: Real-time parameter editing for all providers (Gemini, Antigravity, OpenAI, Claude, Kiro), advanced settings, file upload

**🔗 Provider Pool**: Active connections, health stats, enable/disable management

**📁 Config Files**: OAuth credentials management, search, file operations

**📜 Real-time Logs**: System and request logs, management controls

**🔐 Login**: Default password `admin123`, changeable via console or `pwd` file

Access: `http://localhost:3000` → Login → Sidebar → Effective immediately

#### Multimodal Input
Supports images, documents and more for richer interaction.

#### Latest Model Support
Seamlessly supports latest models:
*   **Grok 3 / Grok 4** - xAI flagship models via Grok Cookie/SSO, thinking models, image/video generation
*   **Claude 4.5 Opus** - Anthropic's strongest model via Kiro, Antigravity
*   **Gemini 3 Pro** - Google next-gen preview via Gemini, Antigravity
*   **Kimi K2 / MiniMax M2** - Via custom OpenAI, Claude providers

---

## 🔐 Authorization Guide

<details>
<summary>Click to expand authorization configuration details</summary>

> **💡 Tip**: Best experience via **Web UI Console** for visual auth management.

#### 🌐 Web UI Quick Auth (Recommended)
1. **Generate Auth**: In **"Provider Pool"** or **"Config Management"**, click **"Generate Auth"** for your provider
2. **Scan/Login**: Dialog opens. Click **"Open in Browser"** for login. Gemini, Antigravity need Google account auth
3. **Auto Save**: System auto-saves credentials to `configs/` directory, visible in **"Config Files"** page
4. **Management**: Upload, delete credentials, or **"Quick Link"** existing credentials

#### Gemini CLI OAuth Config
1. **Get OAuth credentials**: Visit [Google Cloud Console](https://console.cloud.google.com/) to create project, enable Gemini API
2. **Project config**: May need valid Google Cloud project ID via `--project-id` parameter
3. **Ensure ID match**: Project ID in Web UI must match Google Cloud Console and Gemini CLI

#### Antigravity OAuth Config
1. **Personal account**: Separate auth required, application closed
2. **Pro members**: Antigravity open to Pro members only, purchase Pro first
3. **Organization**: Separate auth, contact admin

#### Kiro API Config
1. **Environment**: [Download and install Kiro client](https://kiro.dev/pricing/)
2. **Auth**: Login in client, generate `kiro-auth-token.json`
3. **Best practice**: Use with **Claude Code** for optimal experience
4. **Important**: Check official website for latest usage limits

#### Kiro Extended Thinking (Claude Models)
AiProxy supports Kiro extended thinking when routing to `claude-kiro-oauth` via Claude-compatible (`/v1/messages`) or OpenAI-compatible (`/v1/chat/completions`) requests.

**Claude-compatible (`/v1/messages`)**:
```bash
curl http://localhost:3000/claude-kiro-oauth/v1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "thinking": { "type": "enabled", "budget_tokens": 10000 },
    "messages": [{ "role": "user", "content": "Solve this step by step." }]
  }'
```

**OpenAI-compatible (`/v1/chat/completions`)**:
```bash
curl http://localhost:3000/claude-kiro-oauth/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [{ "role": "user", "content": "Solve this step by step." }],
    "extra_body": {
      "anthropic": {
        "thinking": { "type": "enabled", "budget_tokens": 10000 }
      }
    }
  }'
```

**Adaptive Mode**:
- Claude: `"thinking": { "type": "adaptive", "effort": "high" }`
- OpenAI: `"extra_body.anthropic.thinking": { "type": "adaptive", "effort": "high" }`

Note:
- `budget_tokens` limited to `[1024, 24576]` (default `20000` if omitted/invalid)
- Token refresh/pool rotation unchanged

#### Codex OAuth Config
1. **Generate Auth**: In Web UI **"Provider Pool"** or **"Config Management"**, click Codex **"Generate Auth"**
2. **Browser Login**: System opens OpenAI Codex auth page, complete OAuth login
3. **Auto Save**: System auto-saves Codex OAuth credentials
4. **Callback Port**: Ensure port `1455` is not occupied

#### Grok Cookie/SSO Config
1. **Get SSO Token**: Login [Grok官网](https://grok.com/), copy `sso` value from browser DevTools → Application → Cookies
2. **Fill Config**: In Web UI **"Config Management"** or config file, fill token as `GROK_COOKIE_TOKEN`
3. **Supported**: Chat, thinking models (Grok 3 Thinking), image generation (Grok Imagine), video generation (Grok Video)
4. **Note**: Ensure `GROK_USER_AGENT` matches browser used to get Cookie to avoid blocks

#### Account Pool Management Config
1. **Create pool config**: Reference [provider_pools.json.example](./configs/provider_pools.json.example)
2. **Set pool path**: Set `PROVIDER_POOLS_FILE_PATH` in `configs/config.json` to pool config path
3. **Startup parameter**: Use `--provider-pools-file <path>` to specify pool config
4. **Health Check**: System auto health checks, unhealthy providers excluded

</details>

### 📁 Credential Storage Paths

<details>
<summary>Click to expand credential storage locations</summary>

| Service | Default Path | Description |
|------|---------|------|
| **Gemini** | `~/.gemini/oauth_creds.json` | OAuth credentials |
| **Kiro** | `~/.aws/sso/cache/kiro-auth-token.json` | Kiro auth token |
| **Antigravity** | `~/.antigravity/oauth_creds.json` | Antigravity OAuth (Claude 4.5 Opus support) |
| **Codex** | `~/.codex/oauth_creds.json` | Codex OAuth credentials |

> **Note**: `~` is user home directory (Windows: `C:\Users\username`, Linux/macOS: `/home/username` or `/Users/username`)

> **Custom Path**: Can specify custom storage via config or environment variables

</details>

---

### Advanced Configuration

<details>
<summary>Click to expand proxy config, model filtering, and Fallback</summary>

#### 1. Proxy Configuration

Flexible proxy for different providers or use provider's proxied endpoints.

**Configuration Methods**:

1. **Web UI** (Recommended)

In Web UI **"Config Management"**:
   - **Global Proxy**: Fill proxy address in "Proxy Settings", check providers to use proxy
   - **Provider Endpoints**: Modify Base URL in each provider section to proxied endpoint
   - Click **"Save Config"**

2. **Global Proxy Config**: Configure global proxy, specify which providers use it

   - **Web UI**: Fill proxy address in "Proxy Settings", check providers
   - **Config file**: In `configs/config.json`
   ```json
   {
     "PROXY_URL": "http://127.0.0.1:7890",
     "PROXY_ENABLED_PROVIDERS": [
       "gemini-cli-oauth",
       "gemini-antigravity",
       "claude-kiro-oauth",
       "grok-custom"
     ]
   }
   ```

3. **Provider Proxied Endpoints**: Some providers (OpenAI, Claude) support configured proxy endpoints

   - **Web UI**: Modify Base URL in each provider section
   - **Config file**: In `configs/config.json`
   ```json
   {
     "OPENAI_BASE_URL": "https://your-proxy-endpoint.com/v1",
     "CLAUDE_BASE_URL": "https://your-proxy-endpoint.com"
   }
   ```

**Proxy Types**:
- **HTTP**: `http://127.0.0.1:7890`
- **HTTPS**: `https://127.0.0.1:7890`
- **SOCKS5**: `socks5://127.0.0.1:1080`

**Use Cases**:
- Network-restricted environments
- Mixed config: some providers global proxy, some direct
- Flexible switching: enable/disable per provider

**Notes**:
- Priority: Global proxy > Provider endpoint > Direct
- Ensure proxy is stable
- SOCKS5 typically faster than HTTP

#### 2. Model Filtering Config

Exclude unsupported models via `notSupportedModels`. System auto-skips these providers.

**Config**: In `configs/provider_pools.json`, add `notSupportedModels` to provider:

```json
{
  "gemini-cli-oauth": [
    {
      "uuid": "provider-1",
      "notSupportedModels": ["gemini-3.0-pro", "gemini-3.5-flash"],
      "checkHealth": true
    }
  ]
}
```

**How it works**:
- When requesting specific model, system filters providers with that model marked unsupported
- Only providers supporting the model process requests

**Use Cases**:
- Some accounts have quota/permission limits
- Different model access per account

#### 3. Cross-Type Fallback Config

When a Provider Type's all accounts are unhealthy (429 quota exhausted or marked unhealthy), system auto falls back to compatible Provider Type.

**Config**: In `configs/config.json` add `providerFallbackChain`:

```json
{
  "providerFallbackChain": {
    "gemini-cli-oauth": ["gemini-antigravity"],
    "gemini-antigravity": ["gemini-cli-oauth"],
    "claude-kiro-oauth": ["claude-custom"],
    "claude-custom": ["claude-kiro-oauth"]
  }
}
```

**How it works**:
1. Try selecting healthy account from primary Provider Type
2. If all unhealthy:
   - Find fallback type in config
   - Check if fallback supports current model (protocol compatibility)
   - Select healthy account from fallback
3. Multi-level chain: `gemini-cli-oauth → gemini-antigravity → openai-custom`
4. Only return error if all fallback unavailable

**Use Cases**:
- Batch scenarios where single Provider's free RPD quota easily exhausted
- Cross-type Fallback maximizes multiple Providers' independent quotas

**Notes**:
- Fallback only between protocol-compatible types
- System auto-checks if target Provider Type supports the model

#### 4. TLS Sidecar (Bypass 403/Cloudflare)

For services strict on TLS fingerprint (JA3/JA4) like Grok, project integrates Go uTLS Sidecar to simulate browser TLS fingerprint and solve 403 Forbidden.

**Setup**:

1. **Compile binary**:
   TLS simulation requires Go. Compile sidecar first:
   ```bash
   cd tls-sidecar
   go build -o tls-sidecar
   ```
   *Windows users: ensure `tls-sidecar.exe` in `tls-sidecar/` or root.*

2. **Enable config**:
   In Web UI **"Config Management"** enable **TLS Sidecar**, or in `configs/config.json`:
   ```json
   {
     "TLS_SIDECAR_ENABLED": true,
     "TLS_SIDECAR_PORT": 9090
   }
   ```

3. **How it works**:
   - System auto starts/manages Go process when enabled
   - Requests to specific providers (e.g., Grok) auto-route to Sidecar
   - Sidecar uses latest Chrome fingerprint for TLS handshake, HTTP/2 auto-negotiation

**Notes**:
- Local needs Go 1.20+
- **Docker**: Image has pre-built binary, just enable in config

</details>

---

## ❓ FAQ

<details>
<summary>Click to expand FAQ and solutions</summary>

### 1. OAuth Authorization Failed

**Issue**: Click "Generate Auth", browser opens auth page but fails.

**Solutions**:
- Check network: Ensure access to Google, Alibaba Cloud
- Check port occupancy: OAuth callback needs specific ports (Gemini: 8085, Antigravity: 8086, Codex: 1455, Kiro: 19876-19880)
- Clear browser cache: Try incognito mode
- Check firewall: Allow local callback port access
- **Docker users**: Ensure all OAuth callback ports mapped

### 2. Port Already in Use

**Issue**: Service start fails with `EADDRINUSE`.

**Solutions**:
```bash
# Windows - Find process using port
netstat -ano | findstr :3000
# End process in Task Manager

# Linux/macOS - Find and kill process
lsof -i :3000
kill -9 <PID>
```

Or change port in `configs/config.json`.

### 3. Docker Container Won't Start

**Issue**: Container fails or exits immediately.

**Solutions**:
- **Check logs**: `docker logs aiproxy`
- **Check mount path**: Ensure `-v` local path exists with read/write permissions
- **Check port conflicts**: All mapped ports available
- **Re-pull image**: `docker pull justlikemaki/aiclient-2-api:latest`

### 4. Credential File Not Recognized

**Issue**: Upload or configure credential file, system says unrecognized or format error.

**Solutions**:
- Check file format: Ensure valid JSON
- Check file path: Docker users ensure file in mount directory
- Check file permissions: Service can read credential file
- Re-generate credentials: If expired, re-do OAuth auth

### 5. Request Returns 429 Error

**Issue**: API frequently returns 429 Too Many Requests.

**Solutions**:
- Configure account pool: Add multiple accounts to `provider_pools.json`, enable polling
- Configure Fallback: Set `providerFallbackChain` in `config.json` for cross-type degradation
- Reduce request frequency
- Wait for quota reset: Free quotas usually reset daily or per minute

### 6. Model Unavailable or Error

**Issue**: Request specific model returns error or unavailable.

**Solutions**:
- Check model name: Use correct name (case-sensitive)
- Check provider support: Confirm provider supports the model
- Check account permissions: Some premium models need specific permissions
- Configure model filtering: Use `notSupportedModels` to exclude

### 7. Web UI Not Accessible

**Issue**: Browser can't open `http://localhost:3000`.

**Solutions**:
- Check service status: Confirm started successfully
- Check port mapping: Docker users ensure `-p 3000:3000` correct
- Try other address: `http://127.0.0.1:3000`
- Check firewall: Allow port 3000

### 8. Streaming Response Interrupted

**Issue**: Streaming output stops mid-response or incomplete.

**Solutions**:
- Check network stability
- Increase timeout in client config
- Check proxy settings if using proxy
- Check service logs for errors

### 9. Config Changes Not Taking Effect

**Issue**: Service behavior unchanged after Web UI config modification.

**Solutions**:
- Refresh page
- Check save status
- Restart service for some configs
- Check `configs/config.json` directly

### 10. API Returns 404

**Issue**: API call returns 404 Not Found.

**Solutions**:
- Check API path: Use correct path like `/v1/chat/completions`
- Check client auto-complete: Some clients (Cherry-Studio, NextChat) auto-append path to Base URL causing duplication. Check actual request URL in console, remove extra path
- Check service status: Confirm running, access `http://localhost:3000` for Web UI
- Check port: Requests to correct port (default 3000)
- Check routes: View "Interactive Route Examples" in Dashboard

### 11. Unauthorized: API key is invalid or missing

**Issue**: API returns `Unauthorized: API key is invalid or missing.`

**Solutions**:
- Check API Key config: Ensure correct in `configs/config.json` or Web UI
- Check Authorization header: Must be `Authorization: Bearer your-api-key`
- Check service logs: View "Real-time Logs" in Web UI for details

### 12. No available and healthy providers for type

**Issue**: API returns `No available and healthy providers for type xxx`.

**Solutions**:
- Check provider status: View provider type in Web UI **"Provider Pool"**
- Check credential validity: OAuth credentials may be expired, re-auth if needed
- Check quota limits: Provider may have exhausted free quota, wait or add more accounts
- Enable Fallback: Set `providerFallbackChain` in `config.json`
- Check detailed logs: View "Real-time Logs" for health check failure reasons

### 13. Request Returns 403 Forbidden

**Issue**: API returns 403 Forbidden.

**Solutions**:
- **Enable TLS Sidecar**: For Grok and similar, 403 usually due to TLS fingerprint block. See [Advanced Config - TLS Sidecar](#4-tls-sidecar-bypass-403cloudflare) to enable and compile
- **Check node status**: If Web UI **"Provider Pool"** shows normal (health check passed), ignore this error, system auto-handles
- **Check account permissions**: Confirm account has access to requested model/service
- **Check API Key permissions**: Some provider keys have access scope limits
- **Check regional restrictions**: Some services have regional limits, try proxy/VPN
- **Check credential status**: OAuth credentials may be revoked/invalidated, re-authenticate
- **Check request frequency**: Some providers have strict rate limits, reduce frequency
- **Check provider docs**: Visit provider's official docs for access restrictions

</details>

---

## 📄 License

This project is licensed under [**GNU General Public License v3 (GPLv3)**](https://www.gnu.org/licenses/gpl-3.0). See `LICENSE` file for details.

## 🙏 Acknowledgments

This project was greatly inspired by Google's official Gemini CLI and referenced code from Cline 3.18.0's `gemini-cli.ts`. Special thanks to Google and Cline teams for their excellent work!

### Contributors

[![Contributors](https://contrib.rocks/image?repo=justlovemaki/AiProxy)](https://github.com/justlovemaki/AiProxy/graphs/contributors)

### 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=justlovemaki/AiProxy&type=Timeline)](https://star-history.com/#justlovemaki/AiProxy&Timeline)

---

## ⚠️ Disclaimer

### Usage Risk Notice
This project (AiProxy) is for learning and research only. Users assume all risks when using this project. The author is not responsible for any direct, indirect, or consequential damages from using this project.

### Third-Party Service Disclaimer
This project is an API proxy tool and does not provide any AI model services. All AI model services are provided by third-party providers (Google, OpenAI, Anthropic, etc.). Users must comply with third-party terms and policies when accessing these services. The author is not responsible for third-party service availability, quality, security, or legality.

### Data Privacy Notice
This project runs locally and does not collect or upload user data. Users should protect their API keys and sensitive information. Regularly check and update API keys, avoid using in unsecured network environments.

### Legal Compliance Notice
Users must comply with local laws and regulations. Do not use this project for any illegal purposes. Users assume full responsibility for any consequences from violating laws.
