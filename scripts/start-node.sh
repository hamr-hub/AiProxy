#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
NODE_PROXY_DIR="$ROOT_DIR/packages/node-proxy"

cd "$NODE_PROXY_DIR"

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    if command -v pnpm > /dev/null 2>&1; then
        pnpm install
    else
        npm install
    fi
fi

echo "Starting Node.js API Gateway on port 9001..."
node "$NODE_PROXY_DIR/src/core/master.js" --port 9001
