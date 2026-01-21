# Architecture Overview

**Project:** trinity-method-sdk
**Type:** Node.js
**Framework:** TypeScript CLI
**Version:** 2.1.0
**Last Updated**: 2026-01-12

## System Overview

Trinity Method SDK is a Node.js/TypeScript CLI tool that deploys a complete investigation-first development methodology to projects across multiple frameworks. It provides a 19-agent team, 20 slash commands, and comprehensive investigation templates for structured, quality-driven development.

## Technology Stack

**Runtime/Language:** Node.js ≥16.9.0 / TypeScript
**Package Manager:** npm
**Build Tool:** TypeScript compiler + template copying
**Testing:** Jest (405 tests, 16 suites)

**Key Dependencies:**

- **commander** (v14.0.2) - CLI framework for command parsing
- **inquirer** (v13.1.0) - Interactive CLI prompts
- **fs-extra** (v11.3.3) - Enhanced file system operations
- **glob** (v13.0.0) - File pattern matching
- **chalk** (v5.3.0) - Terminal string styling
- **ora** (v9.0.0) - Elegant terminal spinners

**Development Dependencies:**

- **TypeScript** (v5.9.3) - Type-safe development
- **ESLint** (v9.39.2) - Code quality and linting
- **Jest** (v30.2.0) - Testing framework
- **Prettier** (v3.0.0) - Code formatting
- **TypeDoc** (v0.28.15) - API documentation generation
- **Husky** (v9.1.7) - Git hooks

## Architecture Pattern

**Pattern:** Modular CLI Architecture

This project follows a modular command-line application architecture:

- **CLI Layer** - Command orchestration and user interaction
- **Template Engine** - Variable substitution and file processing
- **Deployment System** - Multi-framework template deployment
- **Testing Infrastructure** - Comprehensive test coverage (405 tests)

## Directory Structure

```
trinity-method-sdk/
├── dist/                 # Compiled JavaScript output
│   ├── cli/              # CLI implementation
│   └── templates/        # Deployed templates
├── src/                  # Source code
│   ├── cli/              # CLI commands and utilities
│   │   ├── commands/     # deploy, update commands
│   │   └── utils/        # Template processing, validation
│   ├── templates/        # Agent and command templates
│   │   ├── agents/       # 19 agent templates
│   │   ├── shared/       # Slash command templates
│   │   ├── claude/       # CLAUDE.md context files
│   │   ├── knowledge-base/ # Living documentation templates
│   │   ├── investigations/ # Investigation templates
│   │   ├── linting/      # Linting configuration templates
│   │   ├── ci/           # CI/CD templates
│   │   └── work-orders/  # Work order templates
│   └── index.ts          # Main entry point
├── tests/                # Test suite (405 tests)
│   ├── unit/             # Unit tests (~200 tests)
│   └── integration/      # Integration tests (~200 tests)
├── docs/                 # Documentation
├── .claude/              # Trinity deployment (self-hosted)
└── trinity/              # Trinity knowledge base (self-hosted)
```

**Key Directories:**

- **src/cli/commands/** - CLI command implementations (deploy, update)
- **src/cli/utils/** - Shared utilities (template processing, validation, error handling)
- **src/templates/** - All deployment templates (agents, commands, configurations)
- **tests/** - Comprehensive test suite covering all functionality
- **docs/** - TypeDoc-generated API documentation + markdown guides

## Entry Points

**Main Entry:** dist/index.js (exported SDK functions)
**CLI Binary:** dist/cli/index.js (trinity command)

**CLI Commands:**

- `trinity deploy` - Deploy Trinity Method to project
- `trinity update` - Update Trinity deployment with backup/restore
- `trinity --version` - Display SDK version
- `trinity --help` - Show command help

**npm Scripts:**

- `npm run build` - Compile TypeScript and copy templates
- `npm test` - Run all 405 tests
- `npm run lint` - Run ESLint on src/ and tests/
- `npm run type-check` - TypeScript type validation
- `npm run docs:generate` - Generate TypeDoc API documentation

## Data Flow

### Trinity Deployment Flow

1. **User invokes CLI:** `trinity deploy`
2. **Interactive Configuration:**
   - Framework detection (Node.js, Python, Rust, Flutter, Go)
   - Linting tool selection
   - CI/CD platform selection
3. **Template Processing:**
   - Variable substitution ({{PROJECT_NAME}}, {{FRAMEWORK}}, etc.)
   - Directory structure creation (14 directories)
   - File deployment (64 components)
4. **Deployment Execution:**
   - Agent deployment (19 agents → `.claude/agents/`)
   - Command deployment (20 commands → `.claude/commands/`)
   - Knowledge base deployment (9 files → `trinity/knowledge-base/`)
   - Template deployment (work orders, investigations)
   - Linting configuration deployment (framework-specific)
   - CI/CD workflow deployment (platform-specific)
5. **Validation:**
   - Directory structure verification
   - .gitignore updates
   - Success confirmation

### Trinity Update Flow

1. **Version Detection:** Read `trinity/VERSION` file
2. **Backup Creation:** Create `trinity/backups/backup-{timestamp}.tar.gz`
3. **User Content Preservation:** Save ARCHITECTURE.md, ISSUES.md, To-do.md, Technical-Debt.md
4. **Update Deployment:** Deploy new templates while preserving user content
5. **Restore on Failure:** Rollback to backup if deployment fails
6. **Cleanup:** Remove backup after successful update (optional)

## Configuration

**TypeScript Configuration:** tsconfig.json

- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Source maps generated

**Package Manifests:**

- package.json - SDK metadata, dependencies, scripts
- package-lock.json - Dependency lock file

**Build Output:** dist/

- Compiled JavaScript (ES modules)
- Copied templates (agents, commands, knowledge-base)
- Type definitions (.d.ts files)

## Build & Deployment

**Build Command:** `npm run build`

1. Clean dist/ directory (`rimraf dist`)
2. Compile TypeScript (`tsc`)
3. Copy templates (`fs-extra.copySync`)

**Development:** `npm run test:watch` (Jest watch mode)

**Production:** `npm run prepublishOnly` (build + test before publish)

**Publishing:**

- Build → Test → Publish to npm registry
- Package includes dist/, README.md, LICENSE, CHANGELOG.md

## Architecture Diagrams

Visual representations of Trinity Method SDK architecture and workflows:

### [Trinity Deployment Architecture](../images/trinity-deployment-architecture.md)

Complete deployment flow showing how Trinity deploys 64 components (19 agents, 20 slash commands, knowledge base, linting configs, CI/CD workflows) to a target project. Illustrates the CLI entry point, framework detection, interactive configuration, template processing, and component deployment to `.claude/` and `trinity/` directories.

### [CLI Command Flow](../images/cli-command-flow.md)

Detailed flowcharts for `trinity deploy` and `trinity update` commands:

- **Deploy Flow**: Environment validation, framework detection, interactive prompts, directory creation, component deployment, and verification
- **Update Flow**: Version checking, backup creation, user content preservation, template deployment, rollback on failure, and optional cleanup

### [Template Processing Pipeline](../images/template-processing-pipeline.md)

End-to-end template processing system showing variable substitution flow:

- Template sources (agents, commands, knowledge base, framework configs)
- User configuration capture (project name, framework, linting, CI/CD)
- Variable registry with 8+ supported variables ({{PROJECT_NAME}}, {{FRAMEWORK}}, etc.)
- Processing engine (reader, parser, substitutor, validator)
- Output generation with permission handling
- Example: Template → Variable substitution → Deployed file

### [Multi-Framework Support Matrix](../images/multi-framework-support-matrix.md)

Comprehensive framework compatibility matrix and detection logic:

- Framework detection engine (auto-detection via package.json, requirements.txt, Cargo.toml, pubspec.yaml, go.mod)
- Support matrix for Node.js, Python, Rust, Flutter, Go
- Framework-specific components (linting tools, CI/CD workflows, package managers)
- Compatibility table showing feature support across frameworks
- Extension points for community-contributed frameworks

All diagrams use Mermaid syntax for version control-friendly visualization.

## Design Decisions

Architecture Decision Records (ADRs) document key technical decisions and their rationale:

### [ADR-001: CLI Architecture](adr/ADR-001-cli-architecture.md)

**Decision:** Use Commander.js + Inquirer.js for CLI framework

**Context:** Trinity SDK needed a robust, user-friendly CLI to support multiple commands, interactive prompts, framework detection, and TypeScript integration.

**Key Points:**

- Commander.js (35M+ weekly downloads) for command structure
- Inquirer.js for rich interactive prompts (select, confirm, input)
- Chalk for terminal styling, Ora for spinners
- Industry standard with excellent TypeScript support
- Clear separation of command logic and user interaction

**Consequences:** Clean command structure, professional UX, easy to extend with new commands

**Alternatives Considered:** Oclif, Yargs, CAC

---

### [ADR-002: Template System Design](adr/ADR-002-template-system-design.md)

**Decision:** Custom variable substitution with `{{VAR}}` syntax

**Context:** Trinity deploys 64 components that need customization based on project name, framework, package manager, linting tools, CI/CD platform, and deployment date.

**Key Points:**

- Simple `{{VARIABLE_NAME}}` syntax (e.g., `{{PROJECT_NAME}}`)
- Regex-based string replacement (50-100ms per template)
- Zero dependencies (no template engine needed)
- Framework-agnostic (works in Markdown, YAML, JSON, TOML, etc.)
- Validation ensures no unresolved variables in deployment

**Consequences:** Fast processing (2-3 seconds for 64 files), minimal dependencies, easy to maintain

**Alternatives Considered:** Handlebars, Mustache, EJS, Template Literals

---

### [ADR-003: ESLint Flat Config Adoption](adr/ADR-003-eslint-flat-config.md)

**Decision:** Use ESLint flat config (`eslint.config.js`) format

**Context:** ESLint introduced flat config in v8.21.0 and made it default in v9.0.0. SDK needed to decide between legacy `.eslintrc.js` and modern flat config.

**Key Points:**

- Future-proof (default in ESLint v9.0.0+)
- Requires Node.js ≥16.9.0 (SDK already has this requirement)
- Better TypeScript integration with explicit parser configuration
- ES modules align with modern JavaScript practices
- Array-based configuration makes cascade explicit

**Consequences:** Improved linting, cleaner configuration, future-proof, better TypeScript support

**Alternatives Considered:** Legacy .eslintrc.js, Support Both Formats

---

### [ADR-004: Comprehensive Test Strategy](adr/ADR-004-test-strategy.md)

**Decision:** Jest testing framework with 405+ comprehensive tests

**Context:** SDK is a critical tool that deploys development infrastructure to user projects. Bugs could corrupt files, break CI/CD, or cause data loss.

**Key Points:**

- 405 tests across 16 suites (Unit: ~200, Integration: ~200)
- 95%+ code coverage (branches, functions, lines, statements)
- Unit tests: Template processing, framework detection, path validation, backup/restore
- Integration tests: Full deploy/update flows, multi-framework, rollback scenarios
- Jest with ts-jest for TypeScript support
- Snapshot testing for template outputs
- CI/CD runs tests on Windows, macOS, Linux with Node.js 16, 18, 20

**Consequences:** High confidence in deployments, regression prevention, production-ready quality, fast feedback loop

**Alternatives Considered:** Mocha + Chai + Sinon, Vitest, AVA

## Performance Considerations

- **Template Processing:** In-memory operations for fast substitution
- **File Operations:** Async/await for non-blocking I/O
- **Deployment Speed:** ~2-3 seconds for complete Trinity deployment
- **Build Time:** ~5-8 seconds for TypeScript compilation + template copying
- **Test Suite:** ~12 seconds for 405 tests

## Security Considerations

- **Path Validation:** Prevent directory traversal attacks
- **Symlink Detection:** Avoid symlink vulnerabilities
- **Input Sanitization:** Validate all user inputs from CLI prompts
- **No Eval:** No dynamic code execution (eval, Function)
- **Dependencies:** Regular security audits with `npm audit`

## Quality Metrics

**Test Coverage:**

- 405 tests across 16 test suites
- Unit tests: ~200 tests
- Integration tests: ~200 tests
- All tests passing ✅

**Code Quality:**

- ESLint: 0 warnings, 0 errors
- Prettier: All files formatted
- TypeScript: Strict mode, no type errors

**Documentation:**

- TypeDoc: Complete API documentation
- README.md: Comprehensive project overview
- CONTRIBUTING.md: Contribution guidelines
- CHANGELOG.md: Version history

---

For detailed API documentation, see [TypeDoc API Reference](../index.html).
For SDK usage, see [Getting Started Guide](../guides/getting-started.md).
