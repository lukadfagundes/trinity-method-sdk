# Architecture Documentation

System architecture and design documentation for Trinity Method SDK.

## Architecture Overview

**Main Document:** [Architecture Overview](overview.md) - Complete system architecture

This document provides detailed information about:

- Technology stack (Node.js, TypeScript, Jest)
- Architecture pattern (Modular CLI Architecture)
- Directory structure and key components
- Data flow (deployment and update flows)
- Configuration and build process
- Performance and security considerations
- Quality metrics (405 tests, 16 suites)

## Key Architecture Documents

- **[Architecture Overview](overview.md)** - Comprehensive system design documentation

## Architecture Decision Records (ADRs)

Architecture Decision Records document significant architectural decisions made during development. Each ADR follows the standard format: Status, Context, Decision, Consequences, and Alternatives Considered.

**Available ADRs:**

- **[ADR-001: CLI Architecture](adr/ADR-001-cli-architecture.md)** - Commander.js + Inquirer.js selection for CLI framework
  - Evaluated: Commander.js, Oclif, Yargs, CAC
  - Decision: Commander.js (35M+ weekly downloads) with Inquirer.js for interactive prompts
  - Rationale: Industry standard, excellent TypeScript support, professional UX

- **[ADR-002: Template System Design](adr/ADR-002-template-system-design.md)** - Custom variable substitution with `{{VAR}}` syntax
  - Evaluated: Custom {{VAR}}, Handlebars, Mustache, EJS, Template Literals
  - Decision: Simple regex-based replacement with zero dependencies
  - Rationale: Fast (2-3 seconds for 64 files), framework-agnostic, easy to maintain

- **[ADR-003: ESLint Flat Config Adoption](adr/ADR-003-eslint-flat-config.md)** - Modern ESLint configuration format
  - Evaluated: Flat config vs. legacy .eslintrc.js vs. support both
  - Decision: Adopt eslint.config.js flat config exclusively
  - Rationale: Future-proof (ESLint v9.0.0+ default), better TypeScript integration

- **[ADR-004: Comprehensive Test Strategy](adr/ADR-004-test-strategy.md)** - Jest with 405+ tests for production-ready quality
  - Evaluated: Jest, Mocha + Chai + Sinon, Vitest, AVA
  - Decision: Jest with 405+ tests (Unit: ~200, Integration: ~200)
  - Rationale: Production-ready SDK quality, 95%+ coverage, regression prevention

## Architecture Diagrams

Visual representations of Trinity Method SDK architecture and workflows are available in the [../images/](../images/) directory:

**Available Diagrams:**

- **[Trinity Deployment Architecture](../images/trinity-deployment-architecture.md)** - Complete deployment flow showing how 64 components are deployed
- **[CLI Command Flow](../images/cli-command-flow.md)** - Flowcharts for `trinity deploy` and `trinity update` commands
- **[Template Processing Pipeline](../images/template-processing-pipeline.md)** - End-to-end variable substitution system
- **[Multi-Framework Support Matrix](../images/multi-framework-support-matrix.md)** - Framework compatibility and detection logic

All diagrams use Mermaid syntax for version control-friendly visualization.

## Technology Stack

See [Architecture Overview](overview.md#technology-stack) for complete technology stack details:

- Node.js ≥16.9.0 / TypeScript
- Commander.js, Inquirer, fs-extra, Glob
- Jest (405 tests), ESLint, Prettier, TypeDoc

---

See [../README.md](../README.md) for complete documentation index.
