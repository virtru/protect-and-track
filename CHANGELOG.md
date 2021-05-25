# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [v1.2.6](https://github.com/virtru/protect-and-track/pull/)

- [i185]

  - Set current virtru-sdk to 2.3.2

## [v1.2.5](https://github.com/virtru/protect-and-track/pull/180)

- [180]

  - update SDK version to 2.3.1, smaller and no public key

## [v1.2.4](https://github.com/virtru/protect-and-track/pull/171)

- [171]

  - update SDK version to 2.1.3 to enable TDF3 -> ie11 workflow and related

## [Unreleased](https://github.com/virtru/protect-and-track/compare/master...HEAD)

- [162](https://github.com/virtru/protect-and-track/pull/162): PLAT-259: Set mime type

## [v1.2.3](https://github.com/virtru/protect-and-track/compare/v1.2.2...v1.2.3) - 2020-02-19

- PLAT-261: _patch_

  - [146](https://github.com/virtru/protect-and-track/pull/146): Default target backend based on host:
    - [production](https://demos.developer.virtru.com/protect/) targets prod
    - [staging](https://demos.developer.virtru.com/protect-staging/) targets staging
    - [develop](https://demos.developer.virtru.com/protect-develop/) targets dev01]
  - [149](https://github.com/virtru/protect-and-track/pull/149): Allow selecting between current
    and lts versions of virtru-sdk via the `zver` query parameter
  - [152](https://github.com/virtru/protect-and-track/pull/152): Allow backend selection via
    `zapi` query parameter

    | Backend\SDK | beta                                                                | lts                                                                          |
    | ----------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
    | develop01   | https://demos.developer.virtru.com/protect-develop/?zapi=develop    | https://demos.developer.virtru.com/protect-develop/?zapi=develop&zver=lts    |
    | develop02   | https://demos.developer.virtru.com/protect-develop/?zapi=develop02  | https://demos.developer.virtru.com/protect-develop/?zapi=develop02&zver=lts  |
    | staging     | https://demos.developer.virtru.com/protect-develop/?zapi=staging    | https://demos.developer.virtru.com/protect-develop/?zapi=staging&zver=lts    |
    | production  | https://demos.developer.virtru.com/protect-develop/?zapi=production | https://demos.developer.virtru.com/protect-develop/?zapi=production&zver=lts |

- [NO-REF](https://github.com/virtru/protect-and-track/pull/147): _patch_
  - Defaults SDK version to 2.0.1-beta.108 (the current beta)

## [v1.2.2](https://github.com/virtru/protect-and-track/compare/v1.2.1...v1.2.2) - 2020-02-12

- [NOREF](https://github.com/virtru/protect-and-track/pull/144): _patch_
  - Fixed bug in sample file dragging
  - Update react-scripts to 3.2.0

## [v1.2.1](https://github.com/virtru/protect-and-track/compare/v1.2.0...v1.2.1) - 2019-08-06

- [NOREF](https://github.com/virtru/protect-and-track/pull/119): _patch_
  - modified license section of readme

## [v1.2.0](https://github.com/virtru/protect-and-track/compare/v1.1.1...v1.2.0) - 2019-08-06

- [NOREF](https://github.com/virtru/protect-and-track/pull/118): _minor_
  - Removed metrics

## [v1.1.1](https://github.com/virtru/protect-and-track/compare/v1.1.0...v1.1.1) - 2019-08-06

- Adds License
- [NOREF](https://github.com/virtru/protect-and-track/pull/117): _patch_

## [v1.1.3](https://github.com/virtru/protect-and-track/compare/v1.1.2...v1.1.3) - 2019-09-06

- [WS-9600](https://virtru.atlassian.net/browse/WS-9600): _minor_
  - Add audit to pipeline

## [v1.1.2](https://github.com/virtru/protect-and-track/compare/v1.1.1...v1.1.2) - 2019-09-06

- [WS-9606](https://virtru.atlassian.net/browse/WS-9606): _minor_
  - Ensure protect and track is using SDK properly

## [v1.1.1](https://github.com/virtru/protect-and-track/compare/v1.1.0...v1.1.1) - 2019-08-06

- Adds License
- [NOREF](https://github.com/virtru/protect-and-track/pull/117): _patch_

## [v1.1.0](https://github.com/virtru/protect-and-track/compare/v1.0.3...v1.1.0) - 2019-08-06

- [NOREF](https://github.com/virtru/protect-and-track/pull/117): _patch_
  - Pulling in new TDF3-js
- [DSAT-161](https://github.com/virtru/protect-and-track/pull/116): _patch_
  - README updates, cleanup and test fixes
- [DSAT-151](https://github.com/virtru/protect-and-track/pull/107): _minor_
  - Add Amplitude metrics
- [NO-REF](https://github.com/virtru/protect-and-track/pull/111): _patch_
  - Remove scrolling constraints on access list
- [NO-REF](https://github.com/virtru/protect-and-track/pull/114): _patch_
  - Strengthen client-side email validation on grant form to match auth widget
- [DSAT-135](https://github.com/virtru/protect-and-track/pull/113)
  - Remove the virtru email from query string
  - Store email in localStorage
- [DSAT-162](https://github.com/virtru/protect-and-track/pull/115)
  - Improve error handling and viewing for share wizard

## [v1.0.3](https://github.com/virtru/protect-and-track/compare/v1.0.2...v1.0.3) - 2019-08-05

- [DSAT-142](https://github.com/virtru/protect-and-track/pull/109): _patch_
  - Save SDK logs in `localStorage` so they are retained after auth. Only cleared on reset
- [DSAT-143](https://github.com/virtru/protect-and-track/pull/110): _patch_
  - Show close button for auth modal

## [v1.0.2](https://github.com/virtru/protect-and-track/compare/v1.0.1...v1.0.2) - 2019-08-04

- [DSAT-144](https://github.com/virtru/protect-and-track/pull/104): _patch_
  - Update Dropbox error message to recognize conflicting file name error
  - Also add random numbers to Dropbox-shared file names to try avoiding conflict errors in the first place
- [NO-REF](https://github.com/virtru/protect-and-track/pull/94): _patch_
  - Clean up "Start over":
    - copy: "Start over" => "Reset"
    - move "Reset" (fka "Start over") to header to appear before signing in
    - copy: "Sign out" => "Reset & Sign Out"
  - Clarify revoking a policy: - copy: "Revoke File" => "Revoke Policy" - ui: give "Revoke Policy" the subtle link treatment - fix: long file names ellipsize, show in tooltip, and don't conflict with policy revoke
    fix: ellipsize file names that are too long (but keep .tdf extension and leave room for "Revoke Policy")
- [DSAT-122](https://github.com/virtru/protect-and-track/pull/85): _patch_
  - Added restricting of downloads when policies have watermark and pfp
- [NO-REF](https://github.com/virtru/protect-and-track/pull/105): _patch_
  - Use `await` on `Virtru.Auth.logout()`
- [NO-REF](https://github.com/virtru/protect-and-track/pull/86): _patch_
  - Clarify default and dragging UI states
- [DSAT-106](https://github.com/virtru/protect-and-track/pull/78): _patch_
  - Update UI to better support "Revoke Policy" workflow
- [NO-REF](https://github.com/virtru/protect-and-track/pull/81): _patch_
  - Fix downloads by not using `FileSaver`
- [NO-REF](https://github.com/virtru/protect-and-track/pull/80): _patch_
  - Fix being able to attempt encrypting without actually being logged in
- [DSAT-92](https://github.com/virtru/protect-and-track/pull/88): _patch_
  - Fix dragging demo file in Firefox
- [NO-REF](https://github.com/virtru/protect-and-track/pull/79): _patch_
  - Better layout support: scales down to 1024x768, up to 1280x960, and does sensible centering at larger resolutions.
- [DSAT-123](https://github.com/virtru/protect-and-track/pull/91): _patch_
  - Use a fake policyId for workaround with current SDK
  - Track policyId better and fix some state/localstorage issues with it
- [DSAT-130](https://github.com/virtru/protect-and-track/pull/99): _patch_
  - Removed unused metadata scope which is not used.

## [v1.0.1](https://github.com/virtru/protect-and-track/compare/v1.0.0...v1.0.1) - 2019-08-02

- [NO-REF](https://github.com/virtru/protect-and-track/pull/77): _patch_
  - Fix policy building by using `policy.builder()`
- [NO-REF](https://github.com/virtru/protect-and-track/pull/75): _patch_
  - Use Audit from SDK

## [v1.0.0](https://github.com/virtru/protect-and-track/compare/v0.1.2...v1.0.0) - 2019-08-02

- Initial release
