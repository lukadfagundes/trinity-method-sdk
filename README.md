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
- **11-agent team coordination** → Right specialist for each task
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

### The 11-Agent Team

Trinity coordinates **11 specialized agents** through intelligent orchestration:

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

**Leadership:**

- **ALY** - Chief Technology Officer (investigation orchestration, strategic coordination)

_(Note: AJ MAESTRO is deprecated v1.0 orchestrator, replaced by ALY in v2.0)_

### What Gets Deployed

Trinity deploys **75+ production-ready components** in 90 seconds:

**Methodology Infrastructure:**

- `trinity/` - Complete Trinity Method structure
- `trinity/work-orders/` - 6 work order templates (Investigation, Implementation, Analysis, Audit, Pattern, Verification)
- `trinity/knowledge-base/` - 5 documentation files (ARCHITECTURE, ISSUES, To-do, Technical-Debt, Trinity)
- `trinity/investigations/` - Investigation artifacts with guided questions
- `trinity/archive/` - Session history and crisis reports

**Agent System:**

- `.claude/agents/` - 18 agent markdown files (11 agents deployed to user projects)
- `.claude/commands/` - 25 Trinity slash commands
- `.claude/EMPLOYEE-DIRECTORY.md` - Agent selection guide

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

**Result:** Production-ready development environment with 11 agents, 25 commands, quality gates, and documentation.

### The Investigation Workflow

Trinity enforces investigation-first through scale-based workflows:

#### SMALL Scale (1-2 files, 0 stop points)

```bash
npx trinity investigate --type technical
# Direct execution by KIL with BAS quality gate
# Fast iteration for simple tasks
```

#### MEDIUM Scale (3-5 files, 2 stop points)

```bash
npx trinity investigate --type feature
# Stop 1: Design approval (ROR)
# Implementation by KIL with BAS gates
# Stop 2: Final review (DRA + user approval)
```

#### LARGE Scale (6+ files, 4 stop points)

```bash
npx trinity investigate --type architecture
# Stop 1: Requirements review (MON)
# Stop 2: Design approval (ROR)
# Stop 3: Plan approval (TRA)
# Implementation with full BAS 6-phase gates
# Stop 4: Comprehensive review (DRA + JUNO audit)
```

### Key Features in Action

#### 1. Investigation Templates with Guided Questions

Create investigations with Trinity Method's systematic approach:

```bash
# Crisis investigation with guided recovery
npx trinity create-investigation --template crisis

# Performance analysis with profiling questions
npx trinity create-investigation --template performance

# Security assessment with CVSS scoring
npx trinity create-investigation --template security
```

Each template includes Trinity-guided questions ensuring comprehensive investigation.

#### 2. Crisis Management System

Automated detection and guided recovery for 5 crisis types:

```bash
npx trinity crisis

# Detects: BUILD_FAILURE, TEST_FAILURE, ERROR_PATTERN,
#          PERFORMANCE_DEGRADATION, SECURITY_VULNERABILITY
# Guides: Step-by-step recovery with validation
# Archives: Crisis reports to trinity/archive/crisis/
```

#### 3. Learning System Visibility

Monitor institutional knowledge growth:

```bash
# View learned patterns with confidence scores
npx trinity knowledge

# Export learning data
npx trinity knowledge --export

# Display system metrics
npx trinity analytics --period 30d
```

#### 4. Workflow Visualization

See complete investigation plan before execution:

```bash
npx trinity orchestrate

# Displays:
# - Investigation scale (SMALL/MEDIUM/LARGE)
# - All phases with agents assigned
# - Stop points for user review
# - Task dependencies and parallelization
# - Estimated duration
```

### Commands Reference

```bash
# Core Commands
npx trinity deploy          # Deploy Trinity to project
npx trinity investigate     # Create investigation
npx trinity status          # Check deployment status
npx trinity update          # Update to latest version

# Quality & Monitoring
npx trinity crisis          # Crisis detection and recovery
npx trinity analytics       # Performance analytics
npx trinity benchmark       # Performance benchmarks
npx trinity cache-stats     # Cache effectiveness metrics
npx trinity learning-status # Learning system status

# Session Management
npx trinity review          # Review session history
npx trinity dashboard       # Launch web dashboard

# Development
npx trinity analyze <file>  # Quick code analysis
```

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

- **Deep Integration**: Trinity's 11 agents leverage Claude Code's agent architecture
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
cd my-api && npx trinity deploy
# Result: API with ESLint, Prettier, pre-commit, 11 agents, quality gates

# Python/Django Project
cd my-django && npx trinity deploy
# Result: Django with Black, Flake8, isort, pre-commit, full Trinity infrastructure

# Flutter Mobile App
cd my-flutter-app && npx trinity deploy
# Result: Flutter with Dart Analyzer, pre-commit, investigation templates

# Rust CLI Tool
cd my-rust-cli && npx trinity deploy
# Result: Rust with Clippy, Rustfmt, pre-commit, crisis management
```

### Documentation

**Core Methodology:**

- [Investigation-First Development](docs/methodology/investigation-first-complete.md)
- [Trinity Framework](docs/methodology/trinity-framework.md)
- [Agent Selection Guide](docs/agents/agent-selection-guide.md)

**Workflows:**

- [Deployment Workflow](docs/workflows/deploy-workflow.md)
- [Investigation Workflow](docs/workflows/investigation-workflow.md)
- [Session Workflow](docs/workflows/session-workflow.md)

**Best Practices:**

- [Testing Standards](docs/best-practices.md)
- [Caching Strategies](docs/best-practices.md#caching-strategies)
- [Quality Standards](docs/quality-standards.md) _(WO-023)_

### After Deployment

Your project contains:

- `.claude/EMPLOYEE-DIRECTORY.md` - Complete agent reference
- `trinity/knowledge-base/Trinity.md` - Project-specific Trinity guide
- `trinity/knowledge-base/ARCHITECTURE.md` - System architecture with metrics
- `trinity/templates/` - 6 work order templates for complex tasks

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
