# Changelog

All notable changes to Trinity Method SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [2.0.2] - 2026-01-02

### Added

- **DOCUMENTATION RULES** section to all APO documentation commands (`/trinity-docs`, `/trinity-readme`, `/trinity-changelog`)
  - Rule 1: No Self-Serving Trinity Documentation - Prevents APO from including Trinity Method information in user project documentation
  - Provides clear ✅/❌ examples and rationale for focusing exclusively on user's codebase
- Explicit **Write tool execution commands** throughout `/trinity-docs` Phase 2
  - Added 🚨 CRITICAL EXECUTION REQUIREMENT section at Phase 2 start
  - Added **EXECUTION REQUIRED** code blocks for each seeding step
  - Added **Phase 2 Execution Summary** with mandatory file creation checklist
  - Ensures APO creates actual documentation files instead of just showing templates

### Changed

- **`/trinity-docs` command:** Enhanced Phase 2 with explicit Write tool requirements
  - Step 2 (Guides): Added execution requirements for getting-started.md and framework-specific guides
  - Step 3 (API): Added execution requirements for api/README.md
  - Step 4 (Architecture): Added execution requirements for architecture/overview.md
  - Step 5 (Reference): Added execution requirements for reference/README.md
  - Phase now requires minimum 4 files to be created: getting-started.md, api/README.md, architecture/overview.md, reference/README.md

### Fixed

- **APO file creation issue:** `/trinity-docs` now explicitly commands APO to use Write tool, preventing scenario where directory structure is created but documentation files are not written

## [2.0.1] - 2025-12-29

### Added

- Installation instructions in README.md with npx and global install options
- Automatic npm deployment on every push to main branch via GitHub Actions CD workflow

### Changed

- **CD Workflow:** Modified to deploy to npm on all main branch pushes (not just version tags)
- **CD Workflow:** GitHub releases now only created for version tags, not regular commits
- Updated all package references from `@trinity-method/cli` to `trinity-method-sdk`

### Fixed

- Removed redundant `node_modules/` from Trinity's .gitignore additions

## [2.0.0] - 2025-12-21

### Added

- **Agent System Expansion:** Grew from 7 to 19 specialized agents
  - **Planning Layer (4 agents):** MON (Requirements Analyst), ROR (Design Architect), TRA (Work Planner), EUS (Task Decomposer)
  - **Execution Layer (3 agents):** KIL (Task Executor), BAS (Quality Gate), DRA (Code Reviewer)
  - **Support Layer (4 agents):** APO (Documentation Specialist), BON (Dependency Manager), CAP (Configuration Specialist), URO (Refactoring Specialist)
  - **Leadership & Audit (2 agents):** ALY (Chief Technology Officer), JUNO (Quality Auditor)
  - **Infrastructure (5 agents):** TAN, ZEN, INO, EIN, AJ MAESTRO (legacy)
- Increased deployment from 49 to 64 production-ready components
- Expanded slash commands from 8 to 20 commands across 6 categories
  - Session Management: `/trinity-start`, `/trinity-continue`, `/trinity-end`
  - Planning: `/trinity-requirements`, `/trinity-design`, `/trinity-decompose`, `/trinity-plan`
  - Execution: `/trinity-orchestrate`, `/trinity-audit`, `/trinity-readme`, `/trinity-docs`, `/trinity-changelog`
  - Investigation: `/trinity-create-investigation`, `/trinity-plan-investigation`, `/trinity-investigate-templates`
  - Infrastructure: `/trinity-init`
  - Utility: `/trinity-verify`, `/trinity-agents`, `/trinity-workorder`
- Enhanced `/trinity-readme` command template to v2.0.0 with comprehensive validation phases
  - Phase 2h: Command/Script/CLI Validation - Verifies all documented commands exist in codebase
  - Phase 2i: Code Example Validation - Checks code examples match current API signatures
  - Phase 2j: API/Function Reference Validation - Verifies documented functions/classes exist
  - Phase 2k: Dependency Claims Validation - Cross-references README with package manifests
  - Phase 2l: Stale Content Detection - Finds TODO markers, outdated dates, placeholder text

### Changed

- **BREAKING:** Updated Trinity Method to v2.0.0 architecture
- **Agent System:** Complete agent architecture redesign with specialized layers
- **Documentation System:** Enhanced APO capabilities with comprehensive audit phases
- Refactored 7 functions to reduce cyclomatic complexity (all ≤15)
- Improved code maintainability and readability across codebase
- Enhanced test coverage and reliability (405 tests, 100% passing)

### Deprecated

- AJ MAESTRO orchestrator (v1.0) replaced by ALY in v2.0

### Fixed

- Template path resolution in integration tests
- Linting deployment tests now correctly locate template files
- **Documentation Accuracy:** Fixed 6 critical inaccuracies in README.md
  - Removed 24+ non-existent CLI commands (`npx trinity investigate`, `crisis`, `analytics`, etc.)
  - Fixed 13 broken documentation links (docs/methodology/, docs/adr/, docs/workflows/)
  - Corrected agent count inconsistencies throughout documentation (unified to 19 agents)
  - Updated deployment examples to reflect actual CLI (`npx @trinity-method/cli deploy/update`)
- Fixed broken ADR links in src/README.md (replaced with design principles summary)
- Fixed broken ADR links in docs/README.md (removed non-existent file references)

---

## [1.0.1] - 2025-10-02 (Legacy - @trinity-method/cli)

### Fixed

- **Critical:** Missing template files in npm package (only 9 of 36 were included)
- Fixed file paths to use bundled templates instead of workspace structure
- All `.md.template` files now properly included in published package
- Updated `deploy.js` and `update.js` to reference correct template locations
- Bundled agents and hooks directly into CLI package for standalone operation

### Changed

- Reorganized package structure to be self-contained when published to npm
- Templates, agents, and hooks now bundled in `packages/cli/templates/`

**Note:** This version was published as `@trinity-method/cli`. Starting with v2.0.0, the package was renamed to `trinity-method-sdk`.

---

## [1.0.0] - 2025-10-01 (Legacy - @trinity-method/cli)

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

**Note:** This version was published as `@trinity-method/cli`. Starting with v2.0.0, the package was renamed to `trinity-method-sdk`.

[1.0.0]: https://github.com/lukadfagundes/trinity-method-sdk/releases/tag/v1.0.0
