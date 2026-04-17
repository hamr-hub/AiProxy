# ── Stage 1: 编译 Go TLS sidecar ──
FROM golang:1.22-alpine AS sidecar-builder

ARG HTTP_PROXY
ARG HTTPS_PROXY
ENV HTTP_PROXY=$HTTP_PROXY
ENV HTTPS_PROXY=$HTTPS_PROXY

RUN apk add --no-cache git

WORKDIR /build
COPY packages/go-sidecar/go.mod packages/go-sidecar/go.sum* ./
RUN go mod download || true

COPY packages/go-sidecar/ ./
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o tls-sidecar .

# ── Stage 2: Node.js 应用 ──
FROM node:20-alpine

LABEL maintainer="AiProxy Team"
LABEL description="Docker image for AiProxy server"

ARG HTTP_PROXY
ARG HTTPS_PROXY

RUN apk add --no-cache tar git procps curl

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/node-proxy/package.json ./packages/node-proxy/

RUN pnpm install --filter aiclient-2-api --prod || pnpm install --prod --ignore-scripts

COPY packages/node-proxy/ ./packages/node-proxy/

COPY --from=sidecar-builder /build/tls-sidecar /app/packages/node-proxy/tls-sidecar/tls-sidecar
RUN chmod +x /app/packages/node-proxy/tls-sidecar/tls-sidecar

USER root

RUN mkdir -p /app/logs

EXPOSE 3000 8085 8086 19876-19880

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["sh", "-c", "node packages/node-proxy/src/core/master.js $ARGS"]
