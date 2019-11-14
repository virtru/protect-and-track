#!/bin/bash

set -eu

pytest -v -s -n2 e2e --use-bp=chrome_store --cucumberjson=reports/cucumber_report.json --cucumber-json-expanded --html=reports/general_report.html --self-contained-html

FILE=reports/cucumber_report.json
# generate html report if there are test report json available
if test -f "$FILE"; then
    cd tools/cucumber-html-reporter/
    npm i
    node index.js
    cd -

    # slack integration
    PYTHONPATH=. python3 tools/send_slack_notification.py

    # pagerduty integration
    PYTHONPATH=. python3 tools/send_pagerduty_notification.py
fi
