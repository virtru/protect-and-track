#!/bin/bash

set -eu

# TEST_MARKER is the test suite that will be selected to run, by default it is regression suite
TEST_MARKER=${TEST_MARKER:-regression}
echo "TEST_ENVIRONMENT_NAME: ${TEST_ENVIRONMENT_NAME}; TEST_MARKER: ${TEST_MARKER}"

docker run --rm $(env | cut -f1 -d= | sed 's/^/-e /') \
  virtru/automated-test:latest pytest \
  -v -s -n2 protect-and-track-website \
  -m $TEST_MARKER \
  --cucumberjson=reports/cucumber_report.json --cucumber-json-expanded --html=reports/general_report.html --self-contained-html
