#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

start_node_proxy() {
    echo "Starting Node.js API Gateway..."
    "$SCRIPT_DIR/start-node.sh" &
}

start_python_controller() {
    echo "Starting Python Controller..."
    "$SCRIPT_DIR/start-python.sh" &
}

case "${1:-all}" in
    all)
        start_node_proxy
        start_python_controller
        ;;
    node)
        start_node_proxy
        ;;
    python)
        start_python_controller
        ;;
    *)
        echo "Usage: $0 [all|node|python]"
        exit 1
        ;;
esac

wait
