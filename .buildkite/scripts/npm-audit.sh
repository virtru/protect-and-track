#!/bin/bash

# This script will generate code audit reports using the
# `audit` target defined in the package.json.

set -eu

source buildkite-scripts/utils/logging.sh

buildkite-scripts/scripts/verify-node-modules.sh

log-debug "Generate code audit reports"
buildkite-scripts/wrap/npm.sh audit --production
buildkite-scripts/wrap/npm.sh audit --only=dev || echo "NPM audit dev still failing, fix by updating CRA"
