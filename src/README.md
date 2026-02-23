# src/ - Trinity Method SDK Source Code

**Framework:** Node.js (TypeScript)
**Purpose:** Trinity Method SDK implementation - CLI, templates, and agent system

## Overview

The `src/` directory contains the complete Trinity Method SDK source code, including the CLI commands, template processing system, and all agent/command templates.

## Directory Structure

```
src/
├── index.ts            # Main entry point (CLI-only, no programmatic exports)
├── cli/                # Command-line interface implementation
│   ├── index.ts        # CLI entry point (Commander.js program definition)
│   ├── types.ts        # Shared CLI type definitions
│   ├── commands/       # CLI command implementations
│   │   ├── deploy/     # Deploy command (modular: pre-flight, config, agents, etc.)
│   │   └── update/     # Update command (modular: backup, version, verification, etc.)
│   └── utils/          # Shared utilities (template processor, error handler, etc.)
└── templates/          # All deployment templates
    ├── .claude/        # Claude Code templates (agents, commands)
    │   ├── agents/     # 18 agent templates (leadership, planning, aj-team, etc.)
    │   └── commands/   # 21 slash command templates (7 categories)
    ├── root/           # Root file templates (CLAUDE.md)
    ├── trinity/        # Trinity infrastructure templates (knowledge-base, etc.)
    ├── linting/        # Linting configuration templates per framework
    └── ci/             # CI/CD workflow templates (GitHub Actions, GitLab CI)
```

## Key Components

### CLI (`cli/`)

Command-line interface for Trinity deployment and management:

- **deploy/** - Trinity deployment orchestration
- **update/** - SDK update management with backup/restore
- **utils/** - Template processing, path validation, error handling

### Templates (`templates/`)

#### Agent Templates (`templates/.claude/agents/`)

18 specialized agent templates deployed to `.claude/agents/`:

- **leadership/** - ALY (CTO), AJ MAESTRO (Orchestrator)
- **audit/** - JUNO (Quality Auditor)
- **planning/** - MON, ROR, TRA, EUS (Requirements, Design, Planning, Decomposition)
- **aj-team/** - KIL, BAS, DRA, APO, BON, CAP, URO (Execution and Support agents)
- **deployment/** - TAN, ZEN, INO, EIN (Infrastructure agents)

#### Command Templates (`templates/.claude/commands/`)

21 Trinity slash command templates across 7 categories:

- **Session** (3): start, continue, end
- **Planning** (4): requirements, design, decompose, plan
- **Execution** (3): orchestrate, audit, breakdown
- **Maintenance** (4): readme, docs, docs-update, changelog
- **Investigation** (3): create-investigation, plan-investigation, investigate-templates
- **Infrastructure** (1): init
- **Utility** (3): verify, agents, workorder

### Technology Stack

**Language:** TypeScript
**Runtime:** Node.js ≥16.9.0
**Build:** TypeScript compiler + template copying
**Testing:** Jest (464 tests)
**Package Manager:** npm

## Development

### Build Process

```bash
# Install dependencies
npm install

# Build TypeScript and copy templates
npm run build

# Output: dist/ directory with compiled JS + templates
```

### Testing

```bash
# Run all tests
npm test

# Type checking only
npm run type-check

# Watch mode
npm run test:watch
```

### Template System

Templates use variable substitution:

- `{{PROJECT_NAME}}` - Project name
- `{{FRAMEWORK}}` - Detected framework
- `{{SOURCE_DIR}}` - Source directory path
- `{{DEPLOYMENT_TIMESTAMP}}` - Deployment timestamp
- `{{CURRENT_DATE}}` - Current date

## Architecture

**Design Principles:**

- **Modular CLI architecture** - Commands organized by responsibility (deploy, update)
- **Template-driven deployment** - Variable substitution for framework-agnostic templates
- **ESLint flat config** - Modern ESLint configuration for Node.js ≥16.9.0
- **Comprehensive testing** - 464 tests across unit, integration, and e2e suites

## Node.js Best Practices

As defined in [src/CLAUDE.md](CLAUDE.md):

- Async/await for all asynchronous operations
- Event loop optimization (no blocking operations)
- Memory management and garbage collection awareness
- Proper error handling with try/catch
- ES6 modules for modern code, CommonJS for compatibility

## Documentation

See [src/CLAUDE.md](CLAUDE.md) for Node.js-specific debugging standards, performance optimization patterns, and testing requirements.

---

**Built with TypeScript** - Type-safe, production-ready SDK for Trinity Method
