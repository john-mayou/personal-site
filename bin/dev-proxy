#!/bin/bash

ROOT_DIR=$(dirname "$(realpath "$0")")/..
docker run --rm -p 80:80 -v "$ROOT_DIR/nginx.dev.conf:/etc/nginx/conf.d/default.conf:ro" nginx