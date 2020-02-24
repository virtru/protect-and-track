#!/bin/bash

set -eu

# TEST_MARKER is the test suite that will be selected to run
if [ -z "${TEST_MARKER:-}" ]; then
  echo "TEST_ENVIRONMENT_NAME: ${TEST_ENVIRONMENT_NAME}; TEST_MARKER: ${TEST_MARKER}"
  dash_m=-m "$TEST_MARKER"
else
  echo "TEST_ENVIRONMENT_NAME: ${TEST_ENVIRONMENT_NAME}"
  dash_m=
fi


docker run --rm $(env | cut -f1 -d= | sed 's/^/-e /') \
  virtru/automated-test:latest pytest \
  -v -s -n2 protect-and-track-website \
  $dash_m \
  --cucumberjson=reports/cucumber_report.json --cucumber-json-expanded --html=reports/general_report.html --self-contained-html
