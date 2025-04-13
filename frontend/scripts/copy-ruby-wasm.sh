#!/bin/bash

FRONTEND_DIR=$(dirname "$(realpath "$0")")/..
mkdir -p "$FRONTEND_DIR/public/wasm"
cp "$FRONTEND_DIR/node_modules/@ruby/3.4-wasm-wasi/dist/ruby+stdlib.wasm" "$FRONTEND_DIR/public/wasm/ruby.wasm"
cp "$FRONTEND_DIR/node_modules/@ruby/wasm-wasi/dist/browser.script.umd.js" "$FRONTEND_DIR/public/wasm/browser.js"