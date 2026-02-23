# Trinity Method SDK

[![npm version](https://img.shields.io/npm/v/trinity-method-sdk?color=success)](https://www.npmjs.com/package/trinity-method-sdk)
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
- **18-agent team coordination** → Right specialist for each task
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

### The 18-Agent Team

Trinity SDK includes **18 specialized agents** organized across 5 functional teams:

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
- **AJ MAESTRO** - Orchestrator (multi-agent workflow orchestration, task delegation)

**Deployment:**

- **TAN** - Structure Specialist (directory structure validation)
- **ZEN** - Knowledge Base Specialist (comprehensive documentation)
- **INO** - Context Specialist (CLAUDE.md hierarchy management)
- **EIN** - CI/CD Specialist (continuous integration/deployment automation)

**Audit:**

- **JUNO** - Quality Auditor (comprehensive codebase audits, deployment verification)

### What Gets Deployed

Trinity deploys **88 production-ready components** in 90 seconds:

**Methodology Infrastructure:**

- `.claude/trinity/knowledge-base/` - 9 living documentation files
  - ARCHITECTURE.md (codebase metrics, architecture documentation)
  - ISSUES.md (known issues and bug tracking)
  - To-do.md (task management and priorities)
  - Technical-Debt.md (technical debt tracking)
  - Trinity.md (project-specific Trinity guide)
  - TESTING-PRINCIPLES.md (testing standards)
  - CODING-PRINCIPLES.md (code quality standards)
  - DOCUMENTATION-CRITERIA.md (documentation standards)
  - AI-DEVELOPMENT-GUIDE.md (AI-assisted development best practices)
- `.claude/trinity/templates/` - Reusable templates
  - `documentation/` - Documentation templates (2 README templates + 23 report templates)
  - `investigations/` - 5 investigation templates (bug, feature, performance, security, technical)
  - `work-orders/` - 6 work order templates
- `.claude/trinity/investigations/` - Active investigations with execution plans
- `.claude/trinity/sessions/` - Session archives
- `.claude/trinity/reports/` - Audit and integration reports
- `.claude/trinity/work-orders/` - Active work orders
- `.claude/trinity/archive/` - Archived sessions, reports, and investigations

**Agent System:**

- `.claude/agents/` - 18 specialized agents organized by category:
  - `aj-team/` - 7 execution agents (APO, BAS, BON, CAP, DRA, KIL, URO)
  - `audit/` - 1 quality auditor (JUNO)
  - `deployment/` - 4 infrastructure agents (EIN, INO, TAN, ZEN)
  - `leadership/` - 2 orchestration agents (ALY, AJ MAESTRO)
  - `planning/` - 4 planning agents (MON, ROR, EUS, TRA)
- `.claude/commands/` - 21 slash commands organized in 7 categories:
  - `execution/` - 3 commands (orchestrate, audit, breakdown)
  - `infrastructure/` - 1 command (init)
  - `investigation/` - 3 commands (create-investigation, plan-investigation, investigate-templates)
  - `maintenance/` - 4 commands (readme, docs, docs-update, changelog)
  - `planning/` - 4 commands (requirements, design, decompose, plan)
  - `session/` - 3 commands (start, continue, end)
  - `utility/` - 3 commands (verify, agents, workorder)
- `.claude/EMPLOYEE-DIRECTORY.md` - Complete 18-agent team guide

**Context Hierarchy:**

- Root `CLAUDE.md` - Global project context
- `.claude/trinity/CLAUDE.md` - Trinity Method enforcement
- `src/CLAUDE.md` - Technology-specific rules

**Quality Automation:**

- Linting tools (ESLint, Prettier, Black, Flake8, Clippy, Rustfmt)
- Pre-commit hooks (Husky + lint-staged for Node.js; Python's pre-commit framework for Python, Flutter, Rust)
- Automatic dependency injection to package.json/requirements.txt
- Real codebase metrics: TODO counts, console statements, file complexity, git metrics

---

## How Trinity Works

### Installation

**Option 1: Use npx (Recommended - No installation needed)**

```bash
# Runs latest version without installing
npx trinity-method-sdk deploy
```

**Option 2: Global Installation**

```bash
# Install once globally
npm install -g trinity-method-sdk

# Then use anywhere
trinity deploy
```

### Quick Start (90 Seconds to Production)

```bash
# Navigate to your project
cd your-project

# Deploy Trinity Method (using npx)
npx trinity-method-sdk deploy
```

**Interactive Wizard:**

1. ✅ **Stack Detection**: Automatically detects framework (Node.js, Python, Rust, Flutter, Go)
2. ✅ **Linting Setup**: Choose "Recommended" for one-click best practices
3. ✅ **Deploy**: 90-second deployment with full infrastructure
4. ✅ **Install Dependencies**: `npm install` (or `pip install -r requirements-dev.txt`)
5. ✅ **Setup Hooks**: Automatic for Node.js (Husky via `npm install`); for Python/Flutter/Rust: `pip install pre-commit && pre-commit install`

**Result:** Production-ready development environment with 18 agents, 21 slash commands, quality gates, and documentation.

### Available Commands

```bash
# Deploy Trinity to your project
npx trinity-method-sdk deploy

# Update Trinity to latest version
npx trinity-method-sdk update
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
- `/trinity-breakdown` - Guided step-by-step implementation walkthrough

**Maintenance:**

- `/trinity-readme` - Update README coverage (APO)
- `/trinity-docs` - Generate new documentation (JUNO + 3 parallel APOs)
- `/trinity-docs-update` - Update existing documentation (JUNO audit → 3 APOs → verification loop)
- `/trinity-changelog` - Maintain CHANGELOG.md (APO)

**Investigation:**

- `/trinity-create-investigation` - Create structured investigation
- `/trinity-plan-investigation` - Generate investigation plan
- `/trinity-investigate-templates` - View investigation templates

**Infrastructure:**

- `/trinity-init` - Initialize Trinity configuration

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
2. Run `npm install` (3-5 minutes, automatically sets up Husky hooks for Node.js)
3. For Python/Flutter/Rust only: `pip install pre-commit && pre-commit install` (30 seconds)

**Supported Frameworks:**

- **Node.js/React**: ESLint + Prettier + Husky + lint-staged
- **Python**: Black + Flake8 + isort + Pre-commit
- **Flutter**: Dart Analyzer + Pre-commit
- **Rust**: Clippy + Rustfmt + Pre-commit

---

## Designed for Claude Code

Trinity Method SDK is built exclusively for [Claude Code](https://claude.com/claude-code), Anthropic's AI pair programming environment.

### Why Claude Code?

- **Deep Integration**: Trinity's 18-agent team leverages Claude Code's agent architecture
- **Slash Commands**: Built-in `/trinity-*` commands for instant workflow access
- **Context System**: Layered CLAUDE.md hierarchy for persistent project knowledge
- **Quality Focus**: Exceptional single-agent experience optimized for Claude

### Other AI Assistants?

The Trinity Method **philosophy** is agent-agnostic, but this SDK is optimized for Claude Code's capabilities. Want to use Trinity with Cursor, Copilot, or others? We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Examples & Documentation

### Real-World Deployments

```bash
# Node.js/Express API
cd my-api && npx trinity-method-sdk deploy
# Result: API with ESLint, Prettier, Husky, 18 agents, quality gates

# Python/Django Project
cd my-django && npx trinity-method-sdk deploy
# Result: Django with Black, Flake8, isort, pre-commit, full Trinity infrastructure

# Flutter Mobile App
cd my-flutter-app && npx trinity-method-sdk deploy
# Result: Flutter with Dart Analyzer, pre-commit, investigation templates

# Rust CLI Tool
cd my-rust-cli && npx trinity-method-sdk deploy
# Result: Rust with Clippy, Rustfmt, pre-commit, crisis management
```

### Documentation

After deploying Trinity to your project, comprehensive documentation is available in your project:

**Trinity Knowledge Base:**

- `.claude/trinity/knowledge-base/ARCHITECTURE.md` - System architecture with codebase metrics
- `.claude/trinity/knowledge-base/ISSUES.md` - Known issues and bug tracking
- `.claude/trinity/knowledge-base/To-do.md` - Task management and priorities
- `.claude/trinity/knowledge-base/Technical-Debt.md` - Technical debt tracking
- `.claude/trinity/knowledge-base/Trinity.md` - Project-specific Trinity guide
- `.claude/trinity/knowledge-base/TESTING-PRINCIPLES.md` - Testing standards
- `.claude/trinity/knowledge-base/CODING-PRINCIPLES.md` - Code quality standards

**Agent System:**

- `.claude/EMPLOYEE-DIRECTORY.md` - Complete agent reference and selection guide
- `.claude/agents/` - 18 specialized agent markdown files

**SDK Documentation:**

- [API Documentation](docs/) - TypeDoc-generated API reference
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development setup, workflow, and standards
- [CHANGELOG.md](CHANGELOG.md) - Version history and release notes

### After Deployment

Your project contains:

- **88 production-ready components** deployed in 90 seconds
- **18 specialized agents** in `.claude/agents/` (7 execution + 1 audit + 4 deployment + 2 leadership + 4 planning)
- **21 slash commands** in `.claude/commands/` (3 execution + 1 infrastructure + 3 investigation + 4 maintenance + 4 planning + 3 session + 3 utility)
- **Complete knowledge base** in `.claude/trinity/knowledge-base/` (ARCHITECTURE.md, ISSUES.md, To-do.md, Technical-Debt.md)
- **Investigation templates** in `.claude/trinity/templates/investigations/` (bug, feature, performance, security, technical)
- **Work order templates** in `.claude/trinity/templates/work-orders/`
- **Session archives** in `.claude/trinity/sessions/`
- **Audit reports** in `.claude/trinity/reports/`
- **Linting tools** configured for your framework

**Complete Deployed Structure:**

```
your-project/
├── .claude/
│   ├── agents/
│   │   ├── aj-team/              # 7 execution agents (APO, BAS, BON, CAP, DRA, KIL, URO)
│   │   ├── audit/                # 1 quality auditor (JUNO)
│   │   ├── deployment/           # 4 infrastructure agents (EIN, INO, TAN, ZEN)
│   │   ├── leadership/           # 2 orchestration agents (ALY, AJ MAESTRO)
│   │   └── planning/             # 4 planning agents (MON, ROR, EUS, TRA)
│   ├── commands/
│   │   ├── execution/            # trinity-orchestrate, trinity-audit, trinity-breakdown
│   │   ├── infrastructure/       # trinity-init
│   │   ├── investigation/        # trinity-create-investigation, trinity-plan-investigation, trinity-investigate-templates
│   │   ├── maintenance/          # trinity-readme, trinity-docs, trinity-docs-update, trinity-changelog
│   │   ├── planning/             # trinity-requirements, trinity-design, trinity-decompose, trinity-plan
│   │   ├── session/              # trinity-start, trinity-continue, trinity-end
│   │   └── utility/              # trinity-verify, trinity-agents, trinity-workorder
│   ├── trinity/
│   │   ├── knowledge-base/       # ARCHITECTURE.md, ISSUES.md, To-do.md, Technical-Debt.md, Trinity.md
│   │   ├── templates/
│   │   │   ├── documentation/    # 2 README templates + 23 report templates
│   │   │   ├── investigations/   # 5 investigation templates (bug, feature, performance, security, technical)
│   │   │   └── work-orders/      # 6 work order templates
│   │   ├── investigations/       # Active investigations
│   │   │   └── plans/            # Investigation execution plans
│   │   ├── sessions/             # Session archives
│   │   ├── reports/              # Audit and integration reports
│   │   ├── work-orders/          # Active work orders
│   │   └── archive/              # Archived sessions, reports, investigations
│   └── EMPLOYEE-DIRECTORY.md     # 18-agent team guide
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

Trinity uses GitHub Actions for comprehensive continuous integration and deployment with BAS 6-phase quality gates.

#### Continuous Integration (CI)

**Automated Quality Checks on Every Push:**

- ✅ Multi-platform testing (Ubuntu, Windows, macOS)
- ✅ Multi-version testing (Node.js 18.x, 20.x, 22.x)
- ✅ Trinity component validation (18 agents, 21 slash commands, knowledge base, CI/CD templates)
- ✅ Test suite execution (unit, integration, e2e, performance)
- ✅ Code coverage validation (80%+ threshold enforced)
- ✅ Linting and type checking
- ✅ Security scanning (npm audit, dependency checks)
- ✅ Build verification with artifact validation
- ✅ Documentation validation

**BAS 6-Phase Quality Gates:**

1. **Phase 1**: Code Quality (Linting, type checking, formatting)
2. **Phase 2**: Structure Validation (Trinity template validation)
3. **Phase 3**: Build Validation (TypeScript compilation, artifact verification)
4. **Phase 4**: Testing (All test suites across platforms)
5. **Phase 5**: Coverage Check (≥80% threshold)
6. **Phase 6**: Documentation (API docs, README validation)

**CI Workflow Location:** [.github/workflows/ci.yml](.github/workflows/ci.yml)

#### Publishing to npm

**Manual Publishing Workflow:**

```bash
# 1. Update version and changelog
npm version patch  # or minor, major

# 2. Build and publish
npm run build
npm publish --access public

# 3. Create git tag and push
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin main --follow-tags
```

**Automated Checks Before Publishing:**

The `prepublishOnly` script runs automatically before every publish:

1. TypeScript compilation (`npm run build`)
2. Template copying to dist/
3. Full test suite execution (`npm run test`)
4. Only publishes if all checks pass

---

## License

MIT License - see [LICENSE](LICENSE) for details

---

## Links

### Project Resources

- **npm Package**: [trinity-method-sdk](https://www.npmjs.com/package/trinity-method-sdk)
- **GitHub**: [lukadfagundes/trinity-method-sdk](https://github.com/lukadfagundes/trinity-method-sdk)
- **Issues**: [GitHub Issues](https://github.com/lukadfagundes/trinity-method-sdk/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lukadfagundes/trinity-method-sdk/discussions)

### Documentation

- **API Documentation**: [docs/](docs/) - Generated TypeDoc API reference
- **Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md) - Development setup, workflow, and standards
- **Changelog**: [CHANGELOG.md](CHANGELOG.md) - Version history and release notes

---

**Built with ❤️ by the Trinity Method Team**

_Trinity Method: Investigation-first development for the AI age_
