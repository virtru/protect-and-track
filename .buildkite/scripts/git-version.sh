#!/bin/bash
# Generate GitVersion prerelease (or release) semantic version information.
#
# The version number generated will be:
#   <package.json version number>-<prerelease type>.<sequence number>
# 
# Pre-release type:
#   - rc: release/ branches and v* tags
#   - beta: main branch
#   - alpha: feature branch
#   - aleph: other builds
# 
# Sequence Number:
#   if a tag a<version> is found, number of commits since that build
#   Otherwise, a dotted pair: <commit count since release>.<commit count since beta>
#
#   Example, assuming semver is 1.0.0 at C and 1.0.1 at F and later:
#               D - E (v1.0.0)
#             /
#   A - B - C - F - G (main)
#                    \
#                      h - i - j (feature/pr)
#
#  will result in:
#     E: 1.0.0-rc.2
#     G: 1.0.1-beta.2
#     j: 1.0.1-alpha.2.3
#
#
# Basic ideas:
#   The 'release goal version' should be specified in the code manually, via package.json.
#      This must be greater-than the last released version, otherwise this must fail.
#   Released versions are specified with (notionally static) version tags.
#   Everybody uses SemVer, preferably with pre-release (section 9) and build metadata (section 10).
#   Releases are built from release/<release-goal-version>
#   Tags are added in the form v<release-version> after the goal is achieved
#

log () {
  local log_level="$1"
  local msg="$2"
  if [[ -z "$msg" ]]; then
    return 0
  fi
  echo -e "[${log_level}] $msg"  >&2
}

if [ -f buildkite-scripts/utils/logging.sh ]; then
  source buildkite-scripts/utils/logging.sh
fi

eout () {
  log ERROR "$1"
  if [ $BUILDKITE ]; then
    buildkite-agent annotate --style "error" --context version "git-version.sh: ${1}"
  fi
  exit 1
}

git-sequence-number () {
  # Finds the commit we want to count up to
  # to get the sequence number.
  # Options:
  #    a<MMP>, a manually tagged shared base thing. TODO: automate this
  #    last branch to a release?
  local next_version=$1
  local build_number=$2
  # Okay maybe it is time to use python, since we should really be doing something to:
  # TODO Make sure there is no version already released with a greater patch number at this minor version
  if [ $(git tag -l "v$next_version") ]; then
    if [[ ${BUILDKITE_TAG:-$(git tag --points-at HEAD)} == v$next_version ]]; then
      echo 0
      return
    fi
    eout "Another commit has already been tagged [v$next_version]"
  fi
  if [ $(git tag -l "a$next_version") ]; then
    git rev-list "a$next_version".. --count
    return
  fi
  # TODO Filter out versions greater than next_version
  local latest=$(git tag | sort -r --version-sort | head -n1)
  if [ $latest ]; then
    local mainline=$(git merge-base $latest HEAD)
    local feature=$(git merge-base main HEAD)
    local m1=$(git rev-list ${mainline}..${feature} --count)
    local m2=$(git rev-list ${feature}..HEAD --count)
    if [[ $m2 > 0 ]]; then
      echo $m1.$m2
    else
      echo $m1
    fi
  else
    log WARNING "Unable to find latest v.* tag; falling back to build number [${build_number}] for [${build_number}]"
    echo "$build_number"
  fi
}

# Derive information from git
BRANCH_NAME=${BUILDKITE_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}
TAG_NAME=$(git tag --points-at HEAD)
log INFO "BRANCH_NAME=[$BRANCH_NAME], TAG_NAME=[$TAG_NAME]"
if [[ $TAG_NAME == v*.*.* ]]; then
  log INFO "Forcing to [$TAG_NAME]"
  BRANCH_NAME="${TAG_NAME}"
fi

# I'd rather this be 'fishfood' or something, but it needs to sort 
# before alpha lexicographically. 
PRE_RELEASE_TAG=aleph
case "$BRANCH_NAME" in
   main)
     PRE_RELEASE_TAG=beta
     ;;
   release/*)
     PRE_RELEASE_TAG=rc
     ;;
   feature*)
     PRE_RELEASE_TAG=alpha
     ;;
   v*)
     PRE_RELEASE_TAG=rc
     ;;
esac
log INFO "PRE_RELEASE_TAG=[${PRE_RELEASE_TAG}]"


# Package Information
MMP_VER=$(node -p "require('./package.json').version")
if [[ ! $MMP_VER =~ ^[0-9]+[.][0-9]+[.][0-9]+$ ]]; then
  eout "Invalid package.json version: [${MMP_VER}]"
fi
log INFO "MMP_VER=[${MMP_VER}]"

# Build Information
SEQUENCE_NUMBER=$(git-sequence-number "${MMP_VER}" "${BUILD_NUMBER:-0000}")
if (( $? != 0 )); then
  exit 1
fi

if [[ ! $SEQUENCE_NUMBER =~ ^[0-9]+(.[0-9]+)*$ ]]; then
  eout "Invalid sequence number: [${SEQUENCE_NUMBER}]"
fi
log INFO "SEQUENCE_NUMBER=[${SEQUENCE_NUMBER}]"

SEM_VER="${MMP_VER}-${PRE_RELEASE_TAG}.${SEQUENCE_NUMBER}"
INFO="sha.${BUILDKITE_COMMIT:-$(git rev-parse --short HEAD)}"
INFO_VER="${SEM_VER}+${INFO}"
log INFO "INFO_VER=[${INFO_VER}]"

cat << EOF
{
  "semantic-version": "${SEM_VER}",
  "informational-version": "${INFO_VER}",
  "mmp-version": "${MMP_VER}"
}
EOF

if [[ $BUILDKITE_TAG == v* ]]; then
  poster="Release version **${MMP_VER}**"
else
  poster="Version **${SEM_VER}**"
fi
log INFO "${poster}"

if [ $BUILDKITE ]; then
  buildkite-agent meta-data set "semantic-version" "${SEM_VER}"
  buildkite-agent meta-data set "informational-version" "${INFO_VER}"
  buildkite-agent meta-data set "mmp-version" "${MMP_VER}"
  buildkite-agent annotate --style "info" --context version "${poster}"
fi
