#!/bin/bash

set -eu

# TEST_MARKER is the test suite that will be selected to run, by default it is regression suite
TEST_MARKER=${TEST_MARKER:-regression}

# PYTEST_CONCURRENCY_NUM is the number of concurrent test runs
PYTEST_CONCURRENCY_NUM=${PYTEST_CONCURRENCY_NUM:-"2"}
echo "TEST_ENVIRONMENT_NAME: $TEST_ENVIRONMENT_NAME; TEST_MARKER: $TEST_MARKER; PYTEST_CONCURRENCY_NUM: $PYTEST_CONCURRENCY_NUM"

docker run --rm -it $(env | cut -f1 -d= | sed 's/^/-e /')
-v "$PWD/e2e:/virtru/e2e" \
  -v "$PWD/e2e/reports:/virtru/reports" \
  -v "$PWD/.buildkite/scripts:/virtru/e2e/scripts" \
  virtru/automated-test:latest \
  pytest -v -s -n$PYTEST_CONCURRENCY_NUM \
  -n2 e2e -m $TEST_MARKER \
  --use-bp=chrome_store
--cucumberjson=reports/cucumber_report.json --cucumber-json-expanded --html=reports/general_report.html --self-contained-html
