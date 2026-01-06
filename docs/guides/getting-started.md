# Getting Started with Trinity Method SDK

**Trinity Version:** 2.0.5
**Last Updated:** 2026-01-02

## Overview

Trinity Method SDK - Investigation-first development methodology for any project. This CLI tool deploys a complete 19-agent team, 20 slash commands, and comprehensive investigation templates to transform your development workflow.

## Prerequisites

- Node.js ≥ 16.9.0
- npm or yarn package manager
- Git (for version control)

## Installation

### Global Installation (Recommended)

```bash
# Install Trinity Method SDK globally
npm install -g trinity-method-sdk

# Verify installation
trinity --version
```

### Local Project Installation

```bash
# Navigate to your project
cd your-project

# Install Trinity SDK
npm install --save-dev trinity-method-sdk

# Run Trinity CLI
npx trinity deploy
```

## Quick Start

### 1. Deploy Trinity to Your Project

```bash
# Navigate to your project root
cd your-project

# Deploy Trinity Method
trinity deploy

# Follow the interactive wizard:
# - Select framework (Node.js, Python, Rust, Flutter, Go)
# - Choose linting tools (ESLint, Prettier, etc.)
# - Configure CI/CD (GitHub Actions, GitLab CI)
```

### 2. What Gets Deployed

Trinity deploys **64 production-ready components** to your project:

**Agent System (19 agents):**

- `.claude/agents/leadership/` - ALY (CTO)
- `.claude/agents/audit/` - JUNO (Quality Auditor)
- `.claude/agents/planning/` - MON, ROR, TRA, EUS
- `.claude/agents/aj-team/` - KIL, BAS, DRA, APO, BON, CAP, URO
- `.claude/agents/deployment/` - TAN, ZEN, INO, EIN, AJ MAESTRO

**Slash Commands (20 commands):**

- `.claude/commands/session/` - start, continue, end
- `.claude/commands/planning/` - requirements, design, decompose, plan
- `.claude/commands/execution/` - orchestrate, audit, readme, docs, changelog
- `.claude/commands/investigation/` - create, plan, templates
- `.claude/commands/infrastructure/` - init
- `.claude/commands/utility/` - verify, agents, workorder

**Knowledge Base:**

- `trinity/knowledge-base/` - 9 living documentation files
- ARCHITECTURE.md, ISSUES.md, To-do.md, Technical-Debt.md, etc.

**Templates:**

- `trinity/templates/` - Work orders, investigations, documentation

### 3. Using Trinity Commands

```bash
# Start a new Trinity session
/trinity-start

# Analyze requirements
/trinity-requirements "Add user authentication"

# Create technical design
/trinity-design

# Decompose into tasks
/trinity-decompose

# Execute with orchestration
/trinity-orchestrate

# Update README
/trinity-readme

# Audit codebase
/trinity-audit
```

## Project Structure

After deploying Trinity, your project structure includes:

```
your-project/
├── .claude/
│   ├── agents/
│   │   ├── aj-team/              # AJ MAESTRO orchestration agents
│   │   ├── audit/                # JUNO quality auditor
│   │   ├── deployment/           # Deployment specialists
│   │   ├── leadership/           # ALY strategic leadership
│   │   └── planning/             # MON, ROR, EUS, TRA agents
│   ├── commands/
│   │   ├── execution/            # Orchestrate, audit, docs commands
│   │   ├── infrastructure/       # Trinity initialization
│   │   ├── investigation/        # Investigation workflows
│   │   ├── planning/             # Requirements, design, decompose, plan
│   │   ├── session/              # Start, continue, end session
│   │   └── utility/              # Verify, agents, workorder commands
│   └── EMPLOYEE-DIRECTORY.md     # 19-agent team guide
├── trinity/
│   ├── knowledge-base/           # ARCHITECTURE.md, ISSUES.md, To-do.md
│   ├── templates/
│   │   ├── documentation/        # Documentation templates
│   │   ├── investigations/       # Bug, performance, security templates
│   │   └── work-orders/          # Work order templates
│   ├── investigations/
│   │   └── plans/                # Investigation plans
│   ├── sessions/                 # Session archives
│   ├── reports/                  # Audit and integration reports
│   ├── work-orders/              # Active work orders
│   ├── patterns/                 # Reusable patterns
│   └── archive/                  # Archived sessions, reports, investigations
├── CLAUDE.md                     # Root context file
└── src/CLAUDE.md                 # Framework-specific context
```

## Core Workflow

### Investigation-First Development

1. **Requirements** (`/trinity-requirements`) - Analyze and define acceptance criteria
2. **Design** (`/trinity-design`) - Create technical design and ADRs
3. **Decompose** (`/trinity-decompose`) - Break into atomic tasks
4. **Plan** (`/trinity-plan`) - Sequence tasks with quality gates
5. **Orchestrate** (`/trinity-orchestrate`) - Execute with AJ MAESTRO coordination
6. **Audit** (`/trinity-audit`) - Comprehensive quality validation

### Quality Gates

Every task completion triggers BAS (Quality Gate) validation:

- ✅ Tests pass
- ✅ Linting passes
- ✅ Type checking passes
- ✅ Documentation updated
- ✅ ISSUES.md / Technical-Debt.md updated

## Next Steps

- [Architecture Overview](../architecture/overview.md) - Understand SDK design
- [API Documentation](../api/) - Explore Trinity SDK API
- [Agent Directory](../../.claude/EMPLOYEE-DIRECTORY.md) - Meet the 19-agent team
- [Investigation Templates](../../trinity/templates/investigations/) - Investigation workflows

## Common Issues

### "Module not found" errors

- Ensure you've run `npm install`
- Verify Node.js version: `node --version` (≥16.9.0 required)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### "trinity: command not found"

- For global install: Ensure npm global bin is in PATH
- For local install: Use `npx trinity` instead of `trinity`

### TypeScript errors during build

- Run type check: `npm run type-check`
- Verify tsconfig.json configuration
- Ensure all @types/\* packages are installed

## Framework-Specific Guides

After deploying Trinity to your project:

- **Node.js projects:** ESLint flat config, npm scripts integration
- **Python projects:** Black, Flake8, pytest integration
- **Rust projects:** Clippy, Rustfmt, Cargo integration
- **Flutter projects:** Dart Analyzer integration

## Support

- **GitHub Issues:** [trinity-method-sdk/issues](https://github.com/lukadfagundes/trinity-method-sdk/issues)
- **Documentation:** [docs/](../)
- **Contributing:** [CONTRIBUTING.md](../../CONTRIBUTING.md)

---

**Trinity Method SDK** - Investigation-first development for modern teams
