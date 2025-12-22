# Changelog

All notable changes to Trinity Method SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-21

### Changed

- **BREAKING:** Updated Trinity Method to v2.0.0
- Refactored 7 functions to reduce cyclomatic complexity (all ≤15)
- Improved code maintainability and readability across codebase
- Enhanced test coverage and reliability (405 tests, 100% passing)

### Fixed

- Template path resolution in integration tests
- Linting deployment tests now correctly locate template files

---

## [1.0.1] - 2025-10-02

### Fixed

- **Critical:** Missing template files in npm package (only 9 of 36 were included)
- Fixed file paths to use bundled templates instead of workspace structure
- All `.md.template` files now properly included in published package
- Updated `deploy.js` and `update.js` to reference correct template locations
- Bundled agents and hooks directly into CLI package for standalone operation

### Changed

- Reorganized package structure to be self-contained when published to npm
- Templates, agents, and hooks now bundled in `packages/cli/templates/`

---

## [1.0.0] - 2025-10-01

### Added

- Initial release of Trinity Method SDK for Claude Code
- 7 specialized Trinity agents (Aly, AJ, TAN, ZEN, INO, Ein, JUNO)
- Claude Code-exclusive deployment
- Interactive deployment with linting and CI/CD configuration
- Linting configuration (ESLint, Prettier, etc.)
- CI/CD automation (GitHub Actions, GitLab CI)
- Matrix testing support
- Coverage integration (Codecov, Coveralls)
- Employee Directory with agent documentation
- Trinity structure (knowledge-base, templates)
- CLAUDE.md context file deployment
- README injection for Trinity Method section
- 8 slash commands (/trinity-init, /trinity-verify, /trinity-docs, /trinity-start, /trinity-continue, /trinity-end, /trinity-workorder, /trinity-agents)
- Session management with archival system
- Comprehensive CLI documentation

### Strategic Decision

- Focused exclusively on Claude Code for exceptional user experience
- Community contributions welcome for other coding agents

[1.0.0]: https://github.com/lukadfagundes/trinity-method-sdk/releases/tag/v1.0.0
