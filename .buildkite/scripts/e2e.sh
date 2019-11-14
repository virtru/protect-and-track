#!/bin/bash

set -eu

echo "+++ PWD: $PWD"

docker run --rm -it $(env | cut -f1 -d= | sed 's/^/-e /') -v ${PWD}/e2e:/virtru/e2e -v ${PWD}/reports:/virtru/reports -v ${PWD}/.buildkite/scripts:/virtru/e2e/scripts  virtru/automated-test:latest pytest -v -s -n2 e2e --cucumberjson=reports/cucumber_report.json --cucumber-json-expanded --html=reports/general_report.html --self-contained-html

FILE=reports/cucumber_report.json
# generate html report if there are test report json available
if test -f "$FILE"; then
  docker run -w /virtru/tools/cucumber-html-reporter --rm -it $(env | cut -f1 -d= | sed 's/^/-e /') -v ${PWD}/reports:/virtru/reports virtru/automated-test:latest /bin/bash -c "npm i && node index.js"

  # slack integration
  docker run -w /virtru/tools/cucumber-html-reporter --rm -it $(env | cut -f1 -d= | sed 's/^/-e /') -v ${PWD}/reports:/virtru/reports virtru/automated-test:latest PYTHONPATH=. python3 tools/send_slack_notification.py

  # pagerduty integration
  docker run -w /virtru/tools/cucumber-html-reporter --rm -it $(env | cut -f1 -d= | sed 's/^/-e /') -v ${PWD}/reports:/virtru/reports virtru/automated-test:latest PYTHONPATH=. python3 tools/send_pagerduty_notification.py
fi
