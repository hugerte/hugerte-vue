# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The HugeRTE Vue component 1.0.0 is based on the TinyMCE Vue component 6.1.0.

## 1.0.2 - 2024-12-19

### Fixed
- Fixed license header not being included in the minified browser build
- Fixed `rollup-plugin-license` having been a normal dependency instead of a dev dependency

## 1.0.1 - 2024-12-18

### Removed
- Removed info about composer installation method in README.md as it is not supported for now

## 1.0.0 - 2024-12-18

### Added
- Added `cdnVersion` prop

### Changed
- Renamed `tinymceScriptSrc` prop to `hugerteScriptSrc`

### Removed
- Removed `apiKey` prop
- Removed `licenseKey` prop
- Removed `cloudChannel` prop
