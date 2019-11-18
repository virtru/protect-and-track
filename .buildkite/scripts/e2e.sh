#!/bin/bash

set -eu

echo "+++ PWD: $PWD"

docker run --rm -it $(env | cut -f1 -d= | sed 's/^/-e /') -v "$(PWD)/e2e:/virtru/e2e" -v "$(PWD)/reports:/virtru/reports" -v "$(PWD)/.buildkite/scripts:/virtru/e2e/scripts"  virtru/automated-test:latest pytest -v -s -n2 e2e --cucumberjson=reports/cucumber_report.json --cucumber-json-expanded --html=reports/general_report.html --self-contained-html
