# src/ - Trinity Method SDK Source Code

**Framework:** Node.js (TypeScript)
**Purpose:** Trinity Method SDK implementation - CLI, templates, and agent system

## Overview

The `src/` directory contains the complete Trinity Method SDK source code, including the CLI commands, template processing system, and all agent/command templates.

## Directory Structure

```
src/
├── CLAUDE.md           # Node.js technology-specific rules and debugging standards
├── index.ts            # Main entry point for SDK
├── cli/                # Command-line interface implementation
│   ├── commands/       # All Trinity CLI commands (deploy, update, etc.)
│   └── utils/          # Shared utilities and helpers
└── templates/          # Agent and command templates
    ├── agents/         # 19 agent templates
    ├── shared/         # Shared command templates
    └── framework/      # Framework-specific templates
```

## Key Components

### CLI (`cli/`)

Command-line interface for Trinity deployment and management:

- **deploy/** - Trinity deployment orchestration
- **update/** - SDK update management with backup/restore
- **utils/** - Template processing, path validation, error handling

### Templates (`templates/`)

#### Agent Templates (`templates/agents/`)

19 specialized agent templates deployed to `.claude/agents/`:

- **leadership/** - ALY (Chief Technology Officer)
- **audit/** - JUNO (Quality Auditor)
- **planning/** - MON, ROR, TRA, EUS (Requirements, Design, Planning, Decomposition)
- **aj-team/** - KIL, BAS, DRA, APO, BON, CAP, URO (Execution and Support agents)
- **infrastructure/** - TAN, ZEN, INO, EIN, AJ MAESTRO (Infrastructure agents)

#### Command Templates (`templates/shared/claude-commands/`)

20 Trinity slash command templates:

- **Session**: start, continue, end
- **Planning**: requirements, design, decompose, plan
- **Execution**: orchestrate, audit, readme, docs, changelog
- **Investigation**: create-investigation, plan-investigation, investigate-templates
- **Infrastructure**: init
- **Utility**: verify, agents, workorder

### Technology Stack

**Language:** TypeScript
**Runtime:** Node.js ≥16.9.0
**Build:** TypeScript compiler + template copying
**Testing:** Jest (405 tests)
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
- **Comprehensive testing** - 405 tests across unit, integration, and e2e suites

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
