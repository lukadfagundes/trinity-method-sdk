# Trinity Method SDK

[![npm version](https://img.shields.io/npm/v/@trinity-method/cli?color=success)](https://www.npmjs.com/package/@trinity-method/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.9.0-brightgreen)](https://nodejs.org/)
[![AI Agents](https://img.shields.io/badge/AI%20Agent-Claude%20Code-blue)](https://github.com/lukadfagundes/trinity-method-sdk)

> Investigation-first development methodology for Claude Code

## Designed for Claude Code

Trinity Method SDK is built for [Claude Code](https://claude.com/claude-code), Anthropic's AI pair programming environment.

### Why Claude Code?

- **Deep Integration:** Trinity's 7 specialized agents leverage Claude Code's advanced features
- **Quality Focus:** Exceptional single-agent experience
- **Slash Commands:** Built-in `/trinity-*` commands for instant access to Trinity workflows
- **Hooks System:** Custom pre/post-action hooks for Claude Code
- **Employee Directory:** Hierarchical agent system designed for Claude Code's architecture

### Other Coding Agents

Want to use Trinity Method with Cursor, Copilot, or other agents? We welcome contributions!

The Trinity Method philosophy and structure are agent-agnostic, but this SDK is optimized for Claude Code. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding support for additional agents.

## What is Trinity Method?

Trinity Method is a **proven development methodology** that brings structure, quality, and investigation-first principles to AI-assisted coding. Instead of jumping directly into implementation, Trinity emphasizes **understanding the problem first** through systematic investigation.

### 🎯 Why Trinity Method?

**Without Trinity:**
- ❌ AI generates code without understanding context
- ❌ No investigation before implementation
- ❌ Inconsistent code quality across sessions
- ❌ Lost knowledge between development sessions
- ❌ No systematic approach to debugging
- ❌ Manual linting setup for every project

**With Trinity:**
- ✅ Investigation-first: Understand before you build
- ✅ Persistent knowledge base across sessions
- ✅ Automatic code quality enforcement
- ✅ 7 specialized AI agents for different tasks
- ✅ Built-in linting and formatting (ESLint, Prettier, Black, etc.)
- ✅ Work order system for complex projects
- ✅ Technical debt tracking and metrics

### 🚀 From "Bare Structure" to "Production-Ready" in 90 Seconds

Trinity Method SDK doesn't just create folders—it deploys a complete development environment with:
- **Hierarchical context system** (3-tier CLAUDE.md files for AI agents)
- **Knowledge base** (Architecture, Issues, To-do, Technical Debt tracking)
- **Linting tools** (ESLint, Prettier, Black, Flake8, Clippy, etc.)
- **Pre-commit hooks** (Prevent bad commits automatically)
- **7 specialized agents** (ALY, AJ, TAN, ZEN, INO, EIN, JUNO)
- **Work order templates** (Investigation, Implementation, Analysis, Audit, Pattern, Verification)
- **Automatic metrics** (TODO count, file complexity, technical debt tracking)

## ✨ Features

### 🔍 Investigation-First Methodology
- **Systematic investigation** before implementation
- **Work order system** for complex tasks (6 template types: Investigation, Implementation, Analysis, Audit, Pattern, Verification)
- **Template types**:
  - `.md.template` files (knowledge-base, CLAUDE.md) - Variable substitution during deployment
  - `.md` files (work order templates) - Static templates copied as-is for manual completion
- **Pattern library** to learn from past sessions
- **Evidence-based decisions** backed by documentation

### 🤖 AI Agent Integration
- **7 Specialized Agents**:
  - **ALY (CTO)**: Strategic leadership and investigation orchestration
  - **AJ (Chief Code)**: Tactical implementation and code execution
  - **TAN**: Structure specialist for Trinity deployment
  - **ZEN**: Knowledge base maintenance and semantic analysis
  - **INO**: Context hierarchy specialist
  - **EIN**: CI/CD and deployment automation
  - **JUNO**: Quality auditor and security reviewer
- **Employee Directory**: Clear documentation of when to use each agent

### 🧹 Automatic Code Quality Setup
- **Interactive linting configuration** during deployment
- **One-click "Recommended" option** for instant best practices
- **Custom selection** for power users
- **Framework-specific tools**:
  - **Node.js/React**: ESLint, Prettier, Pre-commit hooks
  - **Python**: Black, Flake8, isort, Pre-commit hooks
  - **Flutter**: Dart Analyzer, Pre-commit hooks
  - **Rust**: Clippy, Rustfmt, Pre-commit hooks
- **Smart detection**: ESM vs CommonJS, TypeScript, framework versions
- **Dependency injection**: Automatically adds to package.json/requirements.txt
- **No auto-install**: Keeps deployment fast (~10 seconds), user installs when ready

### 📚 Knowledge Base System
- **Hierarchical CLAUDE.md** (3-tier context loading for AI agents)
- **ARCHITECTURE.md**: System architecture documentation
- **ISSUES.md**: Known issues and solutions
- **To-do.md**: Task tracking and planning
- **Technical-Debt.md**: Debt tracking with real metrics
- **Trinity.md**: Project-specific Trinity Method guide

### 📊 Automatic Codebase Metrics
- **Hybrid audit system** collects metrics during deployment:
  - TODO/FIXME/HACK comment counts
  - Console.log statement tracking
  - File complexity analysis (500/1000/3000 line thresholds)
  - Dependency parsing and version tracking
  - Git metrics (commits, contributors)
- **Technical debt baseline** established automatically
- **Trend tracking** across sessions

### 🚀 Lightning-Fast Deployment
- **90-second setup** (including linting configuration)
- **No global installation** required (uses `npx`)
- **Works with any project** (Node.js, Python, Rust, Flutter, Go, Generic)
- **Dry-run mode** to preview changes before deployment
- **Force mode** to update existing deployments

### 🔐 Pre-commit Quality Gates
- **Python's pre-commit framework** for ALL languages (consistency)
- **Automatic linting** before every commit
- **Prevents bad commits** from reaching repository
- **One-time setup**: `pip install pre-commit && pre-commit install`

## 🚀 Quick Start

### Installation

The Trinity SDK is designed to be used with `npx` - no global installation required:

```bash
# Deploy Trinity Method to your project
cd your-project
npx @trinity-method/cli deploy
```

**Interactive Deployment:**
1. **Stack Detection**: Automatically detects your framework (Node.js, Python, Rust, Flutter)
2. **Project Name**: Enter your project name (default: directory name)
3. **Linting Setup**: Choose linting configuration:
   - **Recommended**: Best practices for your framework (one-click)
   - **Custom**: Select specific tools (ESLint, Prettier, Black, etc.)
   - **Skip**: No linting setup (bare Trinity structure)
4. **Confirmation**: Review deployment summary
5. **Deploy**: 10-15 second deployment with all configurations

**What Gets Deployed:**
```
your-project/
├── CLAUDE.md                    # Global project context
├── TRINITY.md                   # Trinity Method guide
├── .eslintrc.json              # ESLint configuration (if selected)
├── .prettierrc.json            # Prettier configuration (if selected)
├── .pre-commit-config.yaml     # Pre-commit hooks (if selected)
├── trinity/
│   ├── CLAUDE.md               # Trinity Method enforcement
│   ├── knowledge-base/
│   │   ├── ARCHITECTURE.md     # System architecture
│   │   ├── ISSUES.md           # Known issues tracker
│   │   ├── To-do.md            # Task management
│   │   ├── Technical-Debt.md   # Debt tracking with metrics
│   │   └── Trinity.md          # Project-specific guide
│   ├── investigations/         # Investigation work products
│   ├── patterns/               # Reusable solution patterns
│   ├── sessions/               # Session artifacts
│   ├── templates/              # 6 work order templates (static .md files)
│   └── work-orders/            # Active work orders
├── src/ (or lib/)
│   └── CLAUDE.md               # Technology-specific rules
├── .claude/
│   ├── agents/                 # 7 specialized AI agents
│   │   ├── leadership/         # ALY (CTO), AJ (Chief Code)
│   │   ├── deployment/         # TAN, ZEN, INO, EIN
│   │   └── audit/              # JUNO
│   ├── commands/               # 8 Trinity slash commands
│   ├── hooks/                  # Claude Code automation hooks
│   ├── EMPLOYEE-DIRECTORY.md   # Agent documentation
│   └── settings.json           # Claude Code configuration
└── trinity-hooks/              # Session management hooks
```

### After Deployment

**1. Install Linting Dependencies** (if you selected linting):
```bash
# Node.js/React projects
npm install

# Python projects
pip install -r requirements-dev.txt
```

**2. Setup Pre-commit Hooks** (one-time):
```bash
pip install pre-commit
pre-commit install
```

**3. Test Your Linting Setup**:
```bash
# Node.js/React
npm run lint
npm run format

# Python
black --check .
flake8 .
```

**4. Start Using Trinity Method**:
- Open `.claude/EMPLOYEE-DIRECTORY.md` to see available agents
- Review `trinity/knowledge-base/ARCHITECTURE.md` for codebase overview
- Check `trinity/knowledge-base/To-do.md` for current tasks
- Use work order templates in `trinity/templates/` for complex tasks

## 🧹 Linting & Code Quality

Trinity Method SDK now includes **automatic linting configuration** during deployment, saving you 45+ minutes of manual setup per project.

### Interactive Linting Setup

During deployment, you'll be prompted:

```
📋 Optional: Code Quality Tools

Trinity can setup linting and formatting tools for Node.js projects.

? Setup linting configuration? (Use arrow keys)
❯ Recommended (Best practices for Node.js)
  Custom (Choose specific tools)
  Skip - No linting setup
```

### "Recommended" Option (One-Click)

Selects best practices for your framework:

**Node.js/React:**
- ✅ ESLint (JavaScript/TypeScript linting)
- ✅ Prettier (Code formatting)
- ✅ Pre-commit hooks (Automatic checks before commits)

**Python:**
- ✅ Black (Code formatter)
- ✅ Flake8 (Linter)
- ✅ isort (Import sorter)
- ✅ Pre-commit hooks

**Flutter:**
- ✅ Dart Analyzer (Linting)
- ✅ Pre-commit hooks

**Rust:**
- ✅ Clippy (Linting)
- ✅ Rustfmt (Formatting)
- ✅ Pre-commit hooks

### "Custom" Option (Power Users)

Select specific tools:
```
? Select tools to configure: (Press <space> to select, <a> to toggle all)
❯ ◉ ESLint (.eslintrc.json) - JavaScript/TypeScript linter
  ◉ Prettier (.prettierrc.json) - Code formatter
  ◉ Pre-commit hooks (.pre-commit-config.yaml) - Git hooks
```

### Smart Detection

Trinity automatically detects:
- **Module System**: ESM (`"type": "module"`) vs CommonJS
- **TypeScript**: Adds TypeScript ESLint rules if detected
- **Framework**: Tailors configuration to your tech stack

### Time Savings

**Before Trinity (Manual Setup):**
1. Research linting tools for your framework (10 min)
2. Install dependencies (5 min)
3. Create configuration files (15 min)
4. Configure pre-commit hooks (10 min)
5. Test and debug configuration (10 min)
**Total: ~50 minutes per project**

**With Trinity (Automated Setup):**
1. Select "Recommended" during deployment (30 seconds)
2. Run `npm install` (3-5 minutes)
3. Setup pre-commit: `pip install pre-commit && pre-commit install` (30 seconds)
**Total: ~6 minutes per project (85-90% time savings)**

### Example Deployment Output

```
✔ Linting configuration deployed (3 tools)
✔ Linting dependencies added to project configuration

📦 Next Steps:

   1. Install linting dependencies:
      npm install

   2. Setup pre-commit hooks (one-time):
      pip install pre-commit && pre-commit install

   3. Review trinity/knowledge-base/ARCHITECTURE.md
   4. Open .claude/EMPLOYEE-DIRECTORY.md to see available agents
   5. Start your first Trinity session!

🧪 Test Linting:

   After installing dependencies, try:
      npm run lint
      npm run format
```

## 📦 What You Get

### 49 Components Deployed

Trinity Method SDK deploys **49 production-ready components** in under 15 seconds:

**Structure (8 directories):**
- `trinity/` - Main Trinity Method directory
- `trinity/knowledge-base/` - Documentation and tracking
- `trinity/investigations/` - Investigation artifacts
- `trinity/patterns/` - Reusable patterns
- `trinity/sessions/` - Session history
- `trinity/templates/` - Work order templates
- `trinity/work-orders/` - Active tasks
- `.claude/` - Agent configurations

**Knowledge Base (5 files):**
- `ARCHITECTURE.md` - System architecture with metrics
- `ISSUES.md` - Known issues and solutions
- `To-do.md` - Task management
- `Technical-Debt.md` - Debt tracking with real data
- `Trinity.md` - Project-specific Trinity guide

**Context System (3 files):**
- Root `CLAUDE.md` - Global project context
- `trinity/CLAUDE.md` - Trinity Method enforcement
- `src/CLAUDE.md` - Technology-specific rules

**AI Agents (7 specialized):**
- ALY (CTO) - Strategic leadership
- AJ (Chief Code) - Implementation
- TAN - Structure specialist
- ZEN - Knowledge base maintenance
- INO - Context hierarchy
- EIN - CI/CD and deployment
- JUNO - Quality auditor

**Work Order Templates (6 types):**
- Investigation - Research and analysis
- Implementation - Feature development
- Analysis - Pattern extraction
- Audit - Quality review
- Pattern - Solution documentation
- Verification - Testing and validation

**Linting Tools (Optional):**
- ESLint, Prettier, Black, Flake8, Clippy, Rustfmt
- Pre-commit hooks for all frameworks
- Dependency injection to package.json/requirements.txt
- npm scripts for linting and formatting

### Real Metrics Collection

Trinity collects **real codebase metrics** during deployment:
- TODO/FIXME/HACK comments: Actual counts from your code
- Console statements: Real usage tracking
- File complexity: Files over 500/1000/3000 lines
- Dependencies: Version tracking and audit
- Git metrics: Commit history and contributors

These metrics appear in `trinity/knowledge-base/Technical-Debt.md` automatically.

## Commands

### Deploy Trinity Method

Deploy Trinity Method to any project:

```bash
npx @trinity-method/cli deploy
```

Options:
- `--name <name>` - Project name (default: current directory name)
- `--force` - Overwrite existing Trinity deployment
- `--yes` - Skip confirmation prompts
- `--dry-run` - Preview changes without writing files
- `--skip-audit` - Skip initial codebase audit

### Update Trinity Method

Update Trinity Method to the latest version:

```bash
npx @trinity-method/cli update
```

Options:
- `--force` - Force update without confirmation

### Check Status

Check Trinity Method deployment status and version:

```bash
npx @trinity-method/cli status
```

### Review Sessions

Analyze past sessions for patterns and improvements:

```bash
npx @trinity-method/cli review --sessions 10
```

Options:
- `--sessions <number>` - Number of recent sessions to analyze (default: 10)

## Optional: Create Shell Alias

For frequent use, create a shell alias:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias tm="npx @trinity-method/cli"

# Then use:
tm deploy
tm update
tm status
tm review
```

### Supported Technologies

- **JavaScript/TypeScript**: React, Vue, Angular, Next.js, Node.js
- **Python**: Flask, Django, FastAPI
- **Dart**: Flutter
- **Rust**: Cargo projects
- **Go**: Go modules
- **Generic**: Any project structure

## 📚 Documentation

### Core Documentation
- **[Getting Started Guide](docs/getting-started.md)** - Detailed setup instructions
- **[Deployment Guide](docs/deployment-guide.md)** - Complete deployment reference
- **[Customization Guide](docs/customization-guide.md)** - Customize Trinity for your workflow
- **[Implementation Guide](docs/implementation-guide.md)** - Trinity Method implementation patterns

### After Deployment
Once deployed, your project will have:
- **[EMPLOYEE-DIRECTORY.md](.claude/EMPLOYEE-DIRECTORY.md)** - Guide to all 6 AI agents
- **[Trinity.md](trinity/knowledge-base/Trinity.md)** - Project-specific Trinity guide
- **[ARCHITECTURE.md](trinity/knowledge-base/ARCHITECTURE.md)** - System architecture
- **Work Order Templates** in `trinity/templates/` - 6 template types

### Methodology Documentation
- **[Trinity Method Overview](docs/methodology/)** - Investigation-first principles
- **[Agent System](docs/guides/)** - When to use which agent
- **[Work Order System](docs/guides/)** - Complex task management

## 🎯 Examples

### Real-World Deployments

See Trinity Method in action:

```bash
# Example 1: Node.js/Express API
cd my-express-api
npx @trinity-method/cli deploy
# Select "Recommended" for linting
# Result: Express API with ESLint, Prettier, pre-commit hooks

# Example 2: Python/Django Project
cd my-django-project
npx @trinity-method/cli deploy
# Select "Recommended" for linting
# Result: Django project with Black, Flake8, isort, pre-commit

# Example 3: Flutter Mobile App
cd my-flutter-app
npx @trinity-method/cli deploy
# Select "Recommended" for linting
# Result: Flutter app with Dart Analyzer, pre-commit hooks

# Example 4: Rust CLI Tool
cd my-rust-cli
npx @trinity-method/cli deploy
# Select "Recommended" for linting
# Result: Rust CLI with Clippy, Rustfmt, pre-commit hooks
```

### Example Projects

Check out [examples/](examples/) for complete example deployments:
- **Node.js API** - Express with TypeScript
- **Python Web App** - Flask with SQLAlchemy
- **Flutter App** - Mobile app with state management
- **Rust CLI** - Command-line tool with Clap

## 🤝 Contributing

Trinity Method SDK is open source and welcomes contributions!

**Ways to Contribute:**
- 🐛 Report bugs and issues
- 💡 Suggest new features or improvements
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository if you find it useful

**Development:**
```bash
# Clone the repository
git clone https://github.com/lukadfagundes/trinity-method-sdk.git
cd sdk

# Install dependencies
npm install

# Build packages
npm run build

# Run tests
npm test

# Test deployment locally
cd packages/cli
npm link
tm deploy
```

**Project Structure:**
```
trinity-method-sdk/
├── packages/
│   ├── cli/          # CLI tool (@trinity-method/cli)
│   ├── core/         # Core library
│   └── templates/    # Deployment templates
├── docs/             # Documentation
├── examples/         # Example projects
└── README.md         # This file
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🔗 Links

- **npm Package**: [@trinity-method/cli](https://www.npmjs.com/package/@trinity-method/cli)
- **GitHub Repository**: [lukadfagundes/trinity-method-sdk](https://github.com/lukadfagundes/trinity-method-sdk)
- **Documentation**: [docs/](docs/)
- **Examples**: [examples/](examples/)
- **Issues**: [GitHub Issues](https://github.com/lukadfagundes/trinity-method-sdk/issues)

---

**Built with ❤️ by the Trinity Method Team**

*Trinity Method: Investigation-first development for the AI age*


## 🔱 Trinity Method

This project uses the **Trinity Method** - an investigation-first development methodology powered by AI agents.

### Quick Commands

#### Leadership Team
- **Aly (CTO)** - Strategic planning and work order creation
  ```bash
  /trinity-aly
  ```

- **AJ (Implementation Lead)** - Code execution and implementation
  ```bash
  /trinity-aj
  ```

#### Deployment Team
- **TAN (Structure Specialist)** - Directory architecture and organization
  ```bash
  /trinity-tan
  ```

- **ZEN (Knowledge Specialist)** - Documentation and knowledge base
  ```bash
  /trinity-zen
  ```

- **INO (Context Specialist)** - Codebase analysis and context building
  ```bash
  /trinity-ino
  ```

- **Ein (CI/CD Specialist)** - Continuous integration and deployment automation
  ```bash
  /trinity-ein
  ```

#### Audit Team
- **JUNO (Auditor)** - Quality assurance and comprehensive auditing
  ```bash
  /trinity-juno
  ```

### Documentation

All project knowledge is maintained in `trinity/knowledge-base/`:
- **ARCHITECTURE.md** - System design and technical decisions
- **ISSUES.md** - Known problems and their status
- **To-do.md** - Task tracking and priorities
- **Technical-Debt.md** - Debt management and refactoring plans
- **Trinity.md** - Trinity Method guidelines and protocols

### Session Management

Trinity Method uses investigation-first approach:
1. **Assess** - Understand current state
2. **Investigate** - Deep dive into root causes
3. **Plan** - Create comprehensive strategy
4. **Execute** - Implement with precision
5. **Verify** - Confirm success criteria met

Session archives are stored in `trinity/sessions/` for historical reference.

### Project Info

- **Framework:** Express
- **Trinity Version:** 1.0.0
- **Agent Configuration:** `.claude/`
- **Knowledge Base:** `trinity/knowledge-base/`

### Getting Started

1. Review the [Employee Directory](.claude/EMPLOYEE-DIRECTORY.md) for agent details
2. Check [Trinity.md](trinity/knowledge-base/Trinity.md) for methodology guidelines
3. Open Claude Code and invoke agents as needed
4. Agents automatically access project context and documentation

---

*Deployed with Trinity Method SDK v1.0.0*