# OpenClaw Configuration Guide

Quick configuration guide for using AiProxy with OpenClaw.

---

## Prerequisites

1. Start AiProxy service
2. Configure at least one provider in Web UI (`http://localhost:3000`)
3. Note the API Key from configuration file
4. Install OpenClaw
   - Docker version: [justlikemaki/openclaw-docker-cn-im](https://hub.docker.com/r/justlikemaki/openclaw-docker-cn-im)
   - Or use other installation methods

---

## Configuration Methods

### Method 1: OpenAI Protocol (Recommended)

**Use Case**: For Gemini models

```json5
{
  env: {
    AICLIENT2API_KEY: "your-api-key"
  },
  agents: {
    defaults: {
      model: { primary: "aiproxy/gemini-3-flash-preview" },
      models: {
        "aiproxy/gemini-3-flash-preview": { alias: "Gemini 3 Flash" }
      }
    }
  },
  models: {
    mode: "merge",
    providers: {
      aiproxy: {
        baseUrl: "http://localhost:3000/v1",
        apiKey: "${AICLIENT2API_KEY}",
        api: "openai-completions",
        models: [
          {
            id: "gemini-3-flash-preview",
            name: "Gemini 3 Flash Preview",
            reasoning: false,
            input: ["text", "image"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 1000000,
            maxTokens: 8192
          }
        ]
      }
    }
  }
}
```

### Method 2: Claude Protocol

**Use Case**: For Claude models with features like Prompt Caching

```json5
{
  env: {
    AICLIENT2API_KEY: "your-api-key"
  },
  agents: {
    defaults: {
      model: { primary: "aiproxy/claude-sonnet-4-5" },
      models: {
        "aiproxy/claude-sonnet-4-5": { alias: "Claude Sonnet 4.5" }
      }
    }
  },
  models: {
    mode: "merge",
    providers: {
      aiproxy: {
        baseUrl: "http://localhost:3000",
        apiKey: "${AICLIENT2API_KEY}",
        api: "anthropic-messages",
        models: [
          {
            id: "claude-sonnet-4-5",
            name: "Claude Sonnet 4.5",
            reasoning: false,
            input: ["text", "image"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 200000,
            maxTokens: 8192
          }
        ]
      }
    }
  }
}
```

---

## Specify Provider (Optional)

Specify a specific provider via routing parameters:

```json5
{
  models: {
    providers: {
      // Kiro Claude (OpenAI Protocol)
      "aiproxy-kiro": {
        baseUrl: "http://localhost:3000/claude-kiro-oauth/v1",
        apiKey: "${AICLIENT2API_KEY}",
        api: "openai-completions",
        models: [...]
      },
      
      // Kiro Claude (Claude Protocol)
      "aiproxy-kiro-claude": {
        baseUrl: "http://localhost:3000/claude-kiro-oauth",
        apiKey: "${AICLIENT2API_KEY}",
        api: "anthropic-messages",
        models: [...]
      },
      
      // Gemini CLI (OpenAI Protocol)
      "aiproxy-gemini": {
        baseUrl: "http://localhost:3000/gemini-cli-oauth/v1",
        apiKey: "${AICLIENT2API_KEY}",
        api: "openai-completions",
        models: [...]
      },
      
      // Antigravity (OpenAI Protocol)
      "aiproxy-antigravity": {
        baseUrl: "http://localhost:3000/gemini-antigravity/v1",
        apiKey: "${AICLIENT2API_KEY}",
        api: "openai-completions",
        models: [...]
      }
    }
  }
}
```

---

## Configure Fallback

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "aiproxy/claude-sonnet-4-5",
        fallbacks: [
          "aiproxy/gemini-3-flash-preview"
        ]
      }
    }
  }
}
```

---

## Common Commands

```bash
# List all models
openclaw models list

# Switch model
openclaw models set aiproxy/claude-sonnet-4-5

# Chat with specific model
openclaw chat --model aiproxy/gemini-3-flash-preview "your question"
```

---

## Protocol Comparison

| Feature | OpenAI Protocol | Claude Protocol |
|---------|----------------|-----------------|
| Base URL | `http://localhost:3000/v1` | `http://localhost:3000` |
| API Type | `openai-completions` | `anthropic-messages` |
| Supported Models | All models | Claude only |
| Special Features | - | Prompt Caching, Extended Thinking |

---

## FAQ

**Q: Connection failed?**
- Confirm AiProxy service is running
- Check if Base URL is correct (OpenAI protocol needs `/v1` suffix)
- Try using `127.0.0.1` instead of `localhost`

**Q: 401 error?**
- Check if API Key is correctly configured
- Confirm environment variable `AICLIENT2API_KEY` is set

**Q: Model unavailable?**
- Confirm provider is configured in AiProxy Web UI
- Run `openclaw gateway restart` to restart gateway
- Run `openclaw models list` to verify model list

---

For more information, see [AiProxy Documentation](../README.md)
