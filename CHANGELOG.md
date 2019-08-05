# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/virtru/protect-and-track/compare/master...HEAD)

- [DSAT-142](https://github.com/virtru/protect-and-track/pull/109): _patch_
  - Save SDK logs in `localStorage` so they are retained after auth. Only cleared on reset

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
