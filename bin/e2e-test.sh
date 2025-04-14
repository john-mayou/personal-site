#!/bin/bash

ROOT_DIR=$(dirname "$(realpath "$0")")/..
docker-compose -f "$ROOT_DIR/docker-compose.ci.yml" up --build -d

cd "$ROOT_DIR/tests/e2e"
npm install
npx playwright test

docker-compose -f "$ROOT_DIR/docker-compose.ci.yml" down