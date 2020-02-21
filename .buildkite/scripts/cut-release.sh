#!/bin/bash
# Tag the origin repository's branch as v{VERSION}, extracted from the source
# code in the repository, if a tag with that name doesn't exist yet.
#
# Supported sources of VERSION information:
# 
#   package.json (node projects, preferred)
#   VERSION (C++ and other unixy projects)
# 
# Variables:
#     SKIP_TAG: if 'true', disable this method
#     DEPLOY_ENVIRONMENT_NAME: Deployment environment, e.g. develop01 or production
#     BUILDKITE_COMMIT: current commit id
#     IGNORE_TAG_CHECK: Allow tag conflict 
# 
# Effects:
#
#  git tag -a v$( guess_version ) && git push 
#
set -eu

source buildkite-scripts/utils/logging.sh

: ${SKIP_TAG:=false}
if [ ${SKIP_TAG,,} == 'true' ]; then
  exit 0
  log-info "Skipping: SKIP_TAG set true"
fi


function set_tag {
  log-info "Creating tag ${TAG_VERSION}"
  git tag -a "${TAG_VERSION}" -m "Buildkite Build #${BUILDKITE_BUILD_NUMBER}"

  log-info "Pushing tag to origin"
  git push origin "${TAG_VERSION}"
}

log-debug "Extract latest version of library from package.json or VERSION file"

if [[ ! -f package.json ]]; then
  log-debug "Finding version in VERSION file"
  TAG_VERSION=v$(cat VERSION)
else
  log-debug "Finding version in package.json file"
  TAG_VERSION=v$(cat package.json | jq -r '.version')
fi
log-info "TAG_VERSION: ${TAG_VERSION}"

# Check for an existing tag and get the commit if present
TAG_COMMIT=$(git rev-list -n 1 "${TAG_VERSION}" 2> /dev/null || true)
if [[ -n "${TAG_COMMIT}" ]]; then
  log-debug "TAG_COMMIT: ${TAG_COMMIT}"
fi

if [[ -z "${TAG_COMMIT}" ]]; then
  # No tag set
  set_tag
else
  # The tag exists..
  if [[ "${TAG_COMMIT}" != "${BUILDKITE_COMMIT}" ]]; then
    # And doesn't match
    log-info "Version ${TAG_VERSION} exists at ${TAG_COMMIT}. Current commit is ${BUILDKITE_COMMIT}"
    if [[ "${DEPLOY_ENVIRONMENT_NAME}" == "*production*" || "${IGNORE_TAG_CHECK:-false}" != "true" ]]; then
      # If we are in production OR ignore-tag-check isn't set, abort.
      log-error "Tag ${TAG_VERSION} already exists and environment is production or IGNORE_TAG_CHECK is false."
      if [[ "${DEPLOY_ENVIRONMENT_NAME}" != "*production*" ]]; then
        log-error "If you are sure you want to move the ${TAG_VERSION} tag, set IGNORE_TAG_CHECK to 'true'."
      fi
      exit 1
    elif [[ "${IGNORE_TAG_CHECK:-false}" == "true" ]]; then
      # Allow the tag to be overridden in non-production environments
      log-info "Removing tag from ${TAG_COMMIT} because IGNORE_TAG_CHECK is true."
      git tag -d "${TAG_VERSION}"
      git push origin ":regs/tags/${TAG_VERSION}"
      TAG_COMMIT=""
      set_tag
    fi
  else
    # Exists and matches, do nothing.
    log-debug "Tag ${TAG_VERSION} already exists for commit ${TAG_COMMIT}."
  fi
fi
