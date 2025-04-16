#!/bin/bash

ROOT_DIR=$(dirname "$(realpath "$0")")/..
docker-compose -f "$ROOT_DIR/docker-compose.ci.yml" up --build -d

cd "$ROOT_DIR/tests/e2e"
npm install
npx playwright test --reporter=html
success=$?

docker-compose -f "$ROOT_DIR/docker-compose.ci.yml" down

if [ $success -ne 0 ]; then
  npx playwright show-report
fi

exit $success