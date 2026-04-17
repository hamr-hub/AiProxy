# AGENTS.md

This file provides guidance to codeflicker when working with code in this repository.

## WHY: Purpose and Goals

AIClient-2-API is an API proxy middleware that converts multiple AI providers (Gemini, Claude, Grok, Codex, Kiro, etc.) into unified OpenAI-compatible interfaces. It supports multi-account pool management, intelligent load balancing, automatic failover, and health checks.

## WHAT: Technical Stack

- **Runtime**: Node.js (ES Modules), pnpm monorepo
- **Frontend**: Vue 3 + Element Plus + Vite + Tailwind CSS
- **Backend**: Custom HTTP server (`packages/node-proxy/src/`)
- **Sidecar**: Go TLS fingerprint (`packages/go-sidecar/`)
- **Controller**: Python FastAPI for local LLM (`packages/python-controller/`)
- **Testing**: Jest
- **Key deps**: axios, ws, google-auth-library, @anthropic-ai/tokenizer

## HOW: Core Development Workflow

```bash
# Start Node.js API server
cd packages/node-proxy && node src/main.js

# Frontend dev server
npm run dev

# Build frontend
npm run build

# Run tests
npm test
```

## Progressive Disclosure

For detailed information, consult these documents as needed:

- `docs/agent/development_commands.md` - All build, test, lint, server commands
- `docs/agent/architecture.md` - Module structure and architectural patterns
- `docs/agent/testing.md` - Test setup, frameworks, and conventions
- `docs/agent/conventions.md` - Code conventions and API design rules
- `docs/agent/security-guidelines.md` - Security constraints and patterns

**When working on a task, first determine which documentation is relevant, then read only those files.**
