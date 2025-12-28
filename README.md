# Trinity Method SDK

[![npm version](https://img.shields.io/npm/v/@trinity-method/cli?color=success)](https://www.npmjs.com/package/@trinity-method/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.9.0-brightgreen)](https://nodejs.org/)
[![AI Agents](https://img.shields.io/badge/AI%20Agent-Claude%20Code-blue)](https://github.com/lukadfagundes/trinity-method-sdk)

> Investigation-first development methodology for Claude Code

---

## Why Trinity Method Exists

### The Problem with Traditional AI-Assisted Development

AI coding assistants are powerful, but without structure they become expensive guessing machines:

**❌ Jump-to-Code Anti-Pattern:**

- AI generates code without understanding the problem
- No investigation phase → immediate implementation
- Context lost between sessions → repeated mistakes
- No institutional knowledge → every session starts from zero
- Inconsistent quality → success depends on prompt luck
- Manual quality setup → 50 minutes configuring linters per project

**The Cost:**

- Developers waste time debugging AI-generated code that solves the wrong problem
- Teams lose hard-won lessons when developers leave
- Technical debt accumulates invisibly
- Code quality varies wildly across sessions

### Our Philosophy: Investigation-First Development

Trinity Method rejects "prompt and pray" development. Instead, we enforce **systematic investigation before implementation**:

**1. Investigation-First Principle**

```
WRONG: "Build authentication" → AI generates code → Debug for hours
RIGHT: "Investigate authentication requirements" → Understand problem → Design solution → Implement correctly
```

**2. Evidence-Based Decisions**
Every decision backed by documentation, codebase metrics, and historical patterns. No guessing.

**3. Knowledge Preservation**
Lessons learned persist across sessions through institutional memory. Agents get smarter over time.

**4. Systematic Quality Assurance**
Quality isn't aspirational—it's systematically enforced through automated gates (BAS 6-phase validation).

### The Trinity Transformation

**✅ With Trinity Method:**

- **Investigation before coding** → Understand the problem first
- **Persistent knowledge base** → Learn from every session
- **Automated quality enforcement** → BAS gates ensure standards
- **19-agent team coordination** → Right specialist for each task
- **Institutional memory** → Patterns, strategies, and lessons preserved
- **90-second deployment** → Complete development environment instantly

---

## What is Trinity Method SDK?

Trinity Method SDK is a **production-ready development methodology** that transforms AI-assisted coding from random generation into systematic engineering.

### Core Philosophy

**Trinity Method enforces three pillars:**

1. **Investigation-First Development**
   - Systematic investigation using MON (Requirements), ROR (Design), TRA (Planning)
   - Evidence-based decisions backed by documentation and metrics
   - Scale-based workflows: SMALL (0 stop points) → MEDIUM (2 stop points) → LARGE (4 stop points)

2. **Knowledge Preservation**
   - Learning system captures patterns from every investigation
   - Cross-session persistence through filesystem storage
   - Agent knowledge sharing via pub/sub bus (≥0.8 confidence threshold)

3. **Systematic Quality Assurance**
   - BAS 6-phase quality gate: Lint → Structure → Build → Test → Coverage (≥80%) → Review
   - Crisis management system for 5 crisis types (build, test, error, performance, security)
   - Automated codebase metrics collection and technical debt tracking

### The 19-Agent Team

Trinity SDK includes **19 specialized agents** (core team of 14 primary agents + 5 infrastructure agents):

**Planning Layer:**

- **MON** - Requirements Analyst (functional & non-functional requirements)
- **ROR** - Design Architect (technical design, ADRs)
- **TRA** - Work Planner (implementation sequencing, BAS integration)
- **EUS** - Task Decomposer (atomic task breakdown)

**Execution Layer:**

- **KIL** - Task Executor (TDD implementation: RED → GREEN → REFACTOR)
- **BAS** - Quality Gate (6-phase validation enforcer)
- **DRA** - Code Reviewer (design doc compliance, quality escalation)

**Support Layer:**

- **APO** - Documentation Specialist (API docs, inline comments)
- **BON** - Dependency Manager (package security, version management)
- **CAP** - Configuration Specialist (env vars, config files)
- **URO** - Refactoring Specialist (technical debt reduction)

**Leadership & Audit:**

- **ALY** - Chief Technology Officer (investigation orchestration, strategic coordination)
- **JUNO** - Quality Auditor (comprehensive codebase audits, deployment verification)

**Infrastructure (5 agents):**

- **TAN** - Structure Specialist (directory structure validation)
- **ZEN** - Knowledge Base Specialist (comprehensive documentation)
- **INO** - Context Specialist (CLAUDE.md hierarchy management)
- **EIN** - CI/CD Specialist (continuous integration/deployment automation)
- **AJ MAESTRO** - Legacy Orchestrator (deprecated v1.0, replaced by ALY in v2.0)

### What Gets Deployed

Trinity deploys **64 production-ready components** in 90 seconds:

**Methodology Infrastructure:**

- `trinity/knowledge-base/` - 9 living documentation files
  - ARCHITECTURE.md (codebase metrics, architecture documentation)
  - ISSUES.md (known issues and bug tracking)
  - To-do.md (task management and priorities)
  - Technical-Debt.md (technical debt tracking)
  - Trinity.md (project-specific Trinity guide)
  - TESTING-PRINCIPLES.md (testing standards)
  - CODING-PRINCIPLES.md (code quality standards)
  - DOCUMENTATION-CRITERIA.md (documentation standards)
  - AI-DEVELOPMENT-GUIDE.md (AI-assisted development best practices)
- `trinity/templates/` - Reusable templates
  - `documentation/` - Documentation templates
  - `investigations/` - 5 investigation templates (Bug, Performance, Security, System Analysis, Incident)
  - `work-orders/` - Work order templates
- `trinity/investigations/` - Active investigations with execution plans
- `trinity/sessions/` - Session archives
- `trinity/reports/` - Audit and integration reports
- `trinity/work-orders/` - Active work orders
- `trinity/patterns/` - Reusable patterns library
- `trinity/archive/` - Archived sessions, reports, and investigations

**Agent System:**

- `.claude/agents/` - 19 specialized agents organized by category:
  - `aj-team/` - AJ MAESTRO orchestration agents
  - `audit/` - JUNO quality auditor
  - `deployment/` - 6 deployment specialists (BON, CAP, EIN, INO, TAN, ZEN)
  - `leadership/` - ALY strategic leadership
  - `planning/` - 4 planning agents (MON, ROR, EUS, TRA)
- `.claude/commands/` - 20 slash commands organized in 6 categories:
  - `execution/` - 5 commands (orchestrate, audit, readme, docs, changelog)
  - `infrastructure/` - 1 command (trinity-init)
  - `investigation/` - 3 commands (create, plan, templates)
  - `planning/` - 4 commands (requirements, design, decompose, plan)
  - `session/` - 3 commands (start, continue, end)
  - `utility/` - 3 commands (verify, agents, workorder)
- `.claude/EMPLOYEE-DIRECTORY.md` - Complete 19-agent team guide

**Context Hierarchy:**

- Root `CLAUDE.md` - Global project context
- `trinity/CLAUDE.md` - Trinity Method enforcement
- `src/CLAUDE.md` - Technology-specific rules

**Quality Automation:**

- Linting tools (ESLint, Prettier, Black, Flake8, Clippy, Rustfmt)
- Pre-commit hooks (Python's pre-commit framework for ALL languages)
- Automatic dependency injection to package.json/requirements.txt
- Real codebase metrics: TODO counts, console statements, file complexity, git metrics

---

## How Trinity Works

### Quick Start (90 Seconds to Production)

```bash
# Navigate to your project
cd your-project

# Deploy Trinity Method
npx @trinity-method/cli deploy
```

**Interactive Wizard:**

1. ✅ **Stack Detection**: Automatically detects framework (Node.js, Python, Rust, Flutter, Go)
2. ✅ **Linting Setup**: Choose "Recommended" for one-click best practices
3. ✅ **Deploy**: 90-second deployment with full infrastructure
4. ✅ **Install Dependencies**: `npm install` (or `pip install -r requirements-dev.txt`)
5. ✅ **Setup Pre-commit**: `pip install pre-commit && pre-commit install`

**Result:** Production-ready development environment with 19 agents, 20 slash commands, quality gates, and documentation.

### Available Commands

```bash
# Deploy Trinity to your project
npx @trinity-method/cli deploy

# Update Trinity to latest version
npx @trinity-method/cli update
```

### Using Trinity Method (Slash Commands)

After deployment, access Trinity functionality through Claude Code slash commands:

**Session Management:**

- `/trinity-start` - Start workflow guide
- `/trinity-continue` - Resume after interruption
- `/trinity-end` - End session and archive

**Planning:**

- `/trinity-requirements` - Analyze requirements (MON)
- `/trinity-design` - Create technical design (ROR)
- `/trinity-decompose` - Break down tasks (EUS)
- `/trinity-plan` - Create implementation plan (TRA)

**Execution:**

- `/trinity-orchestrate` - Execute with ALY orchestration
- `/trinity-audit` - Run codebase audit (JUNO)
- `/trinity-readme` - Update README coverage (APO)
- `/trinity-docs` - Organize docs/ directory (APO)
- `/trinity-changelog` - Maintain CHANGELOG.md (APO)

**Investigation:**

- `/trinity-create-investigation` - Create structured investigation
- `/trinity-plan-investigation` - Generate investigation plan
- `/trinity-investigate-templates` - View investigation templates

**Utility:**

- `/trinity-verify` - Verify Trinity deployment
- `/trinity-agents` - View agent directory
- `/trinity-workorder` - Create work orders

### Linting & Code Quality (85-90% Time Savings)

**Before Trinity (Manual Setup): ~50 minutes per project**

1. Research tools for your framework
2. Install dependencies
3. Create configuration files
4. Configure pre-commit hooks
5. Test and debug configuration

**With Trinity (Automated): ~6 minutes per project**

1. Select "Recommended" during deployment (30 seconds)
2. Run `npm install` (3-5 minutes)
3. Setup pre-commit: `pip install pre-commit && pre-commit install` (30 seconds)

**Supported Frameworks:**

- **Node.js/React**: ESLint + Prettier + Pre-commit
- **Python**: Black + Flake8 + isort + Pre-commit
- **Flutter**: Dart Analyzer + Pre-commit
- **Rust**: Clippy + Rustfmt + Pre-commit

---

## Designed for Claude Code

Trinity Method SDK is built exclusively for [Claude Code](https://claude.com/claude-code), Anthropic's AI pair programming environment.

### Why Claude Code?

- **Deep Integration**: Trinity's 19-agent team leverages Claude Code's agent architecture
- **Slash Commands**: Built-in `/trinity-*` commands for instant workflow access
- **Hooks System**: Pre/post-action automation via Claude Code hooks
- **Quality Focus**: Exceptional single-agent experience optimized for Claude

### Other AI Assistants?

The Trinity Method **philosophy** is agent-agnostic, but this SDK is optimized for Claude Code's capabilities. Want to use Trinity with Cursor, Copilot, or others? We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Examples & Documentation

### Real-World Deployments

```bash
# Node.js/Express API
cd my-api && npx @trinity-method/cli deploy
# Result: API with ESLint, Prettier, pre-commit, 19 agents, quality gates

# Python/Django Project
cd my-django && npx @trinity-method/cli deploy
# Result: Django with Black, Flake8, isort, pre-commit, full Trinity infrastructure

# Flutter Mobile App
cd my-flutter-app && npx @trinity-method/cli deploy
# Result: Flutter with Dart Analyzer, pre-commit, investigation templates

# Rust CLI Tool
cd my-rust-cli && npx @trinity-method/cli deploy
# Result: Rust with Clippy, Rustfmt, pre-commit, crisis management
```

### Documentation

After deploying Trinity to your project, comprehensive documentation is available in your project:

**Trinity Knowledge Base:**

- `trinity/knowledge-base/ARCHITECTURE.md` - System architecture with codebase metrics
- `trinity/knowledge-base/ISSUES.md` - Known issues and bug tracking
- `trinity/knowledge-base/To-do.md` - Task management and priorities
- `trinity/knowledge-base/Technical-Debt.md` - Technical debt tracking
- `trinity/knowledge-base/Trinity.md` - Project-specific Trinity guide
- `trinity/knowledge-base/TESTING-PRINCIPLES.md` - Testing standards
- `trinity/knowledge-base/CODING-PRINCIPLES.md` - Code quality standards

**Agent System:**

- `.claude/EMPLOYEE-DIRECTORY.md` - Complete agent reference and selection guide
- `.claude/agents/` - 19 specialized agent markdown files

**SDK Documentation:**

- [API Documentation](docs/) - TypeDoc-generated API reference
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development setup, workflow, and standards
- [CHANGELOG.md](CHANGELOG.md) - Version history and release notes

### After Deployment

Your project contains:

- **64 production-ready components** deployed in 90 seconds
- **19 specialized agents** in `.claude/agents/` (organized by category: aj-team, audit, deployment, leadership, planning)
- **20 slash commands** in `.claude/commands/` (organized by category: execution, infrastructure, investigation, planning, session, utility)
- **Complete knowledge base** in `trinity/knowledge-base/` (ARCHITECTURE.md, ISSUES.md, To-do.md, Technical-Debt.md)
- **Investigation templates** in `trinity/templates/investigations/` (bug, performance, security, system analysis, incident)
- **Work order templates** in `trinity/templates/work-orders/`
- **Session archives** in `trinity/sessions/`
- **Audit reports** in `trinity/reports/`
- **Linting tools** configured for your framework

**Complete Deployed Structure:**

```
your-project/
├── .claude/
│   ├── agents/
│   │   ├── aj-team/              # AJ MAESTRO orchestration agents
│   │   ├── audit/                # JUNO quality auditor
│   │   ├── deployment/           # Deployment specialists (BON, CAP, EIN, INO, TAN, ZEN)
│   │   ├── leadership/           # ALY strategic leadership
│   │   └── planning/             # MON, ROR, EUS, TRA agents
│   ├── commands/
│   │   ├── execution/            # trinity-orchestrate, trinity-audit, trinity-readme, trinity-docs, trinity-changelog
│   │   ├── infrastructure/       # trinity-init
│   │   ├── investigation/        # trinity-create-investigation, trinity-plan-investigation, trinity-investigate-templates
│   │   ├── planning/             # trinity-requirements, trinity-design, trinity-decompose, trinity-plan
│   │   ├── session/              # trinity-start, trinity-continue, trinity-end
│   │   └── utility/              # trinity-verify, trinity-agents, trinity-workorder
│   └── EMPLOYEE-DIRECTORY.md     # 19-agent team guide
├── trinity/
│   ├── knowledge-base/           # ARCHITECTURE.md, ISSUES.md, To-do.md, Technical-Debt.md, Trinity.md
│   ├── templates/
│   │   ├── documentation/        # Documentation templates
│   │   ├── investigations/       # Bug, performance, security, system analysis, incident templates
│   │   └── work-orders/          # Work order templates
│   ├── investigations/           # Active investigations
│   │   └── plans/                # Investigation execution plans
│   ├── sessions/                 # Session archives
│   ├── reports/                  # Audit and integration reports
│   ├── work-orders/              # Active work orders
│   ├── patterns/                 # Reusable patterns library
│   └── archive/                  # Archived sessions, reports, investigations
├── CLAUDE.md                     # Root context file
└── src/CLAUDE.md                 # Framework-specific context
```

- **Pre-commit hooks** automatically enforcing quality standards

---

## Contributing

Trinity Method SDK is open source and welcomes contributions!

**Ways to Contribute:**

- 🐛 Report bugs and issues
- 💡 Suggest new features or agent improvements
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository if you find it useful

**Development Setup:**

```bash
# Clone repository
git clone https://github.com/lukadfagundes/trinity-method-sdk.git
cd trinity-method-sdk

# Install dependencies
npm install

# Build SDK
npm run build

# Test locally
npm link
trinity deploy
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## Development & Publishing

### CI/CD Pipeline

Trinity uses GitHub Actions for comprehensive continuous integration:

**Automated Quality Checks:**

- ✅ Multi-platform testing (Ubuntu, Windows, macOS)
- ✅ Multi-version testing (Node.js 18.x, 20.x, 22.x)
- ✅ Test suite execution (unit, integration, e2e, performance)
- ✅ Code coverage validation (80%+ threshold enforced)
- ✅ Linting and type checking
- ✅ Security scanning (npm audit, dependency checks)
- ✅ Build verification

**CI Workflow Location:** [.github/workflows/ci.yml](.github/workflows/ci.yml)

### Publishing to npm

**Current Process:** Manual publishing after CI validation

```bash
# After pushing to main and CI passes
npm login                    # Authenticate with npm
npm publish                  # Publishes with prepublishOnly checks
```

**Automated Checks Before Publishing:**

1. `prepublishOnly` script runs automatically
2. TypeScript compilation (`npm run build`)
3. Template copying to dist/
4. Full test suite execution (`npm run test`)
5. Only publishes if all checks pass

**Note:** Automated npm publishing is not currently configured. Publishing requires manual `npm publish` after successful CI validation.

---

## License

MIT License - see [LICENSE](LICENSE) for details

---

## Links

### Project Resources

- **npm Package**: [@trinity-method/cli](https://www.npmjs.com/package/@trinity-method/cli)
- **GitHub**: [lukadfagundes/trinity-method-sdk](https://github.com/lukadfagundes/trinity-method-sdk)
- **Issues**: [GitHub Issues](https://github.com/lukadfagundes/trinity-method-sdk/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lukadfagundes/trinity-method-sdk/discussions)

### Documentation

- **API Documentation**: [docs/](docs/) - Generated TypeDoc API reference
- **Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md) - Development setup, workflow, and standards
- **Architectural Decisions**: [docs/adr/](docs/adr/) - ADRs documenting major technical decisions
  - [ADR-001: CLI Architecture](docs/adr/ADR-001-cli-architecture.md)
  - [ADR-002: Template System Design](docs/adr/ADR-002-template-system-design.md)
  - [ADR-003: ESLint Flat Config](docs/adr/ADR-003-eslint-flat-config.md)
  - [ADR-004: Test Strategy](docs/adr/ADR-004-test-strategy.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md) - Version history and release notes

---

**Built with ❤️ by the Trinity Method Team**

_Trinity Method: Investigation-first development for the AI age_
