#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
PYTHON_DIR="$ROOT_DIR/packages/python-controller"

cd "$PYTHON_DIR"

if ! command -v python3 &> /dev/null; then
    echo "python3 not found, please install Python 3"
    exit 1
fi

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

if [ ! -f "venv/bin/activate" ]; then
    echo "Installing dependencies..."
    pip install -q fastapi uvicorn httpx pydantic pynvml prometheus-client websockets redis
fi

echo "Starting Python Controller service on port 9002..."
uvicorn main:app --host 0.0.0.0 --port 9002
