#!/bin/bash

set -e

ROOT_DIR=$(dirname "$(realpath "$0")")/..
LOGS_DIR="$ROOT_DIR/logs"
PIDS=()

cleanup() {
  echo "Stopping background processes..."
  for pid in "${PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" && echo "Killed process $pid"
    else
      echo "Process $pid already killed"
    fi
  done
  exit 0
}

trap cleanup EXIT

mkdir -p "$LOGS_DIR"

# backend
cd "$ROOT_DIR/api"
echo "Starting backend..."
go run main.go > "$LOGS_DIR/api.log" 2>&1 &
PIDS+=($!)

# frontend
cd "$ROOT_DIR/frontend"
echo "Starting frontend..."
npm run dev > "$LOGS_DIR/frontend.log" 2>&1 &
PIDS+=($!)

# proxy
cd "$ROOT_DIR" # detached and send logs to "$ROOT_DIR/logs/nginx.log"
echo "Starting nginx proxy..."
docker run --rm \
  -p 80:80 \
  -v "$ROOT_DIR/nginx.dev.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx > "$LOGS_DIR/nginx.log" 2>&1 &
PIDS+=($!)

wait