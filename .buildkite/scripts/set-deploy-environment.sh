#!/bin/bash
# Set bk metadata `deploy-environment-name` as appropriate.
#
# If `DEPLOY_ENVIRONMENT_NAME` env is set, use that value.
# If bk metadata deploy-environment-name is already set, short circuit.
# If we are on master or staging, 

set -eu

source buildkite-scripts/utils/logging.sh

log-debug "Setting metadata environment based on branch or DEPLOY_ENVIRONMENT_NAME env var"

if [[ -z ${DEPLOY_ENVIRONMENT_NAME:-} ]]; then
  # This is in case we've already set this in a previous step.
  DEPLOY_ENVIRONMENT_NAME=$(buildkite-agent meta-data get "deploy-environment-name" --default "")
fi

if [[ -z ${DEPLOY_ENVIRONMENT_NAME:-} ]]; then
  if [[ "${BUILDKITE_BRANCH}" = master ]] || [[ "${BUILDKITE_BRANCH}" = staging ]] || [[ "${BUILDKITE_BRANCH}" = release/* ]]; then
    buildkite-agent meta-data set "deploy-environment-name" "staging"
    log-info "Setting deploy-environment-name metadata to staging"
  else
    buildkite-agent meta-data set "deploy-environment-name" "develop01"
    log-info "Setting deploy-environment-name metadata to develop01"
  fi
else
  buildkite-agent meta-data set "deploy-environment-name" "${DEPLOY_ENVIRONMENT_NAME}"
  log-info "Setting deploy-environment-name metadata to ${DEPLOY_ENVIRONMENT_NAME}"
fi
