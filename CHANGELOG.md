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

## [2.0.9] - 2026-01-12

### Changed

- **Trinity-docs command specification** - Added evidence-based documentation verification
  - Added Rule 2: Evidence-Based Documentation Only - prevents documenting uninstalled tools
  - Added Phase 1 Step 6: Tool & Feature Verification for all project types
  - Added tool verification report to Phase 5 output
  - Prevents aspirational/best-practice content that doesn't exist in codebase
  - Addresses incident where Lighthouse was documented without being installed

- **Trinity-readme command specification** - Removed Trinity self-documentation conflicts
  - Deleted Type C Template that documented Trinity infrastructure (violated Rule 1)
  - Added Rule 1 Enforcement Checklist with verification commands
  - Added Phase 1 Step 4.5: Filter Gitignored and Trinity Directories
  - Added Trinity Detection Warning to explicitly skip trinity/ and .claude/
  - Removed trinity/ from glob patterns and project structure examples
  - Addresses incident where trinity/ was included in README file tree despite being gitignored

- **Trinity-readme command specification** - Added LICENSE file verification for badges
  - Added Phase 1 Step 7: License Verification - reads actual LICENSE file
  - LICENSE file is now source of truth (priority over package.json)
  - Detects license type from file header (MIT, ISC, Apache, GPL, BSD, etc.)
  - Warns when package.json license field doesn't match LICENSE file
  - Falls back to package.json only if LICENSE file doesn't exist
  - Addresses incident where ISC badge was generated despite MIT LICENSE file

- **Trinity-docs command specification** - Added Trinity reference sanitization enforcement
  - Added Rule 1 Forbidden Patterns - explicit list of patterns that must not appear in docs/
  - Added Phase 4.5: Trinity Reference Sanitization - scans and removes Trinity references
  - Added Rule 1 Compliance verification to Phase 5 report with pass/fail status
  - Removed Trinity report link from docs/README.md template footer
  - Prevents Trinity Method, agent names, commands, and infrastructure references in user docs
  - Addresses incident where 7 documentation files contained Trinity Method references

## [2.0.8] - 2026-01-08

### Added

- **Bot directory support** - Added `bot/` as a recognized source directory
  - `bot/` directory now detected during deployment
  - Framework-specific CLAUDE.md automatically deployed to `bot/` directory
  - Supports nested patterns: `bot/src`, `bot/lib`, `bot/app`, `src/bot`

- **Force update flag** - Added `--force` flag to `trinity update` command
  - Allows forcing re-update even when already at latest version
  - Useful for repairing corrupted deployments or applying template fixes
  - Usage: `trinity update --force`

## [2.0.7] - 2026-01-06

### Fixed

- **CRITICAL: Agent file extension handling** - Fixed agent updates to strip `.template` extension
  - Agents were being copied with `.md.template` extension, creating duplicates alongside old `.md` files
  - Now correctly strips `.template` extension during deployment to `.claude/agents/` subdirectories
  - Each agent file copied individually with proper extension handling

- **CRITICAL: Template directory structure** - Fixed template updates to use correct directory structure
  - Work order templates were being deployed to wrong directory (`trinity/templates/` instead of `trinity/templates/work-orders/`)
  - Documentation templates (`trinity/templates/documentation/`) were not being updated at all
  - Investigation templates (`trinity/templates/investigations/`) were not being updated at all
  - Now correctly deploys all 3 template types to their proper subdirectories with `.template` extension stripped
  - Total templates updated: 13 files (6 work-orders + 2 documentation + 5 investigations)

## [2.0.6] - 2026-01-06

### Fixed

- **CRITICAL: Command categorization logic** - Fixed `trinity update` to correctly categorize slash commands
  - Execution commands (`audit`, `changelog`, `docs`, `readme`) were falling through to utility category
  - Investigation commands containing `investigate` were not being matched properly
  - Commands now deploy to correct category directories (session, planning, execution, investigation, infrastructure, infrastructure, utility)
  - Prevents duplicate commands in wrong directories during updates

## [2.0.5] - 2026-01-06

### Fixed

- **CRITICAL: Slash command file updates** - Fixed `trinity update` command file extension handling
  - Update commands module was looking for `.md` files but templates use `.md.template` extension
  - Now correctly processes `.md.template` files and strips extension for deployed files
  - Slash commands now update properly (20 command files) when running `trinity update`
  - Matches the pattern used by knowledge-base update module

## [2.0.4] - 2026-01-06

### Fixed

- **CRITICAL: Update command path resolution** - Fixed `trinity update` to use centralized SDK path resolution
  - Update command was using hardcoded `@trinity-method/sdk` path instead of `trinity-method-sdk`
  - Commands, agents, templates, and knowledge base files now update correctly with global installations
  - Fixed "Commands template path not found, skipping" warning

## [2.0.3] - 2026-01-06

### Fixed

- **CRITICAL: Global install support** - Fixed SDK path resolution to work with global installations
  - Changed package name from incorrect `@trinity-method/sdk` to `trinity-method-sdk` in path resolution
  - Added `import.meta.url` support for resolving SDK location in global installs
  - `trinity update` command now works correctly when SDK is installed globally
  - Fixed "ENOENT: no such file or directory" error when running update command

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
