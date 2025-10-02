# Trinity Method SDK Deployment Guide

Complete guide to deploying Trinity Method SDK to your projects using the CLI.

## Quick Start

```bash
cd your-project
trinity deploy
```

This interactive command guides you through deployment in ~10 seconds.

## What Gets Deployed

Trinity creates ~30 files in 4 main areas:

### 1. Trinity Core (trinity/)
- **knowledge-base/** - 5 markdown documentation files
- **investigations/** - Investigation reports
- **patterns/** - Reusable solutions
- **sessions/** - Session tracking
- **templates/** - 6 work order templates (.md)
- **work-orders/** - Active work orders
- **CLAUDE.md** - Trinity context
- **VERSION** - SDK version

### 2. Claude Code Integration (.claude/)
- **agents/** - 7 specialized AI agents
- **commands/** - 8 slash commands
- **hooks/** - 2 automation hooks
- **EMPLOYEE-DIRECTORY.md** - Agent docs
- **settings.json** - Claude configuration

### 3. Session Management (trinity-hooks/)
- **session-end-archive.sh**
- **prevent-git.sh**

### 4. Context Hierarchy
- Root **CLAUDE.md** - Global context
- Root **TRINITY.md** - Method guide
- **src/CLAUDE.md** - Tech-specific context

## Deployment Options

### Basic Deployment

```bash
# Interactive with prompts
trinity deploy

# Non-interactive (defaults)
trinity deploy --yes

# Custom project name
trinity deploy --name "MyApp"
```

### Advanced Options

```bash
# Preview before deploying
trinity deploy --dry-run

# Force overwrite existing
trinity deploy --force

# Skip metrics collection (faster)
trinity deploy --skip-audit

# Include CI/CD templates
trinity deploy --ci-deploy
```

## Linting Configuration

During deployment, Trinity offers to configure linting tools:

### Options

1. **Recommended** - Best-practice setup for your stack
2. **Custom** - Choose specific tools
3. **Skip** - No linting setup

### Framework Support

**Node.js/TypeScript:**
- ESLint + Prettier + Pre-commit hooks

**Python:**
- Black + Flake8 + isort + Pre-commit hooks

**Flutter:**
- Dart Analyzer + Pre-commit hooks

**Rust:**
- Clippy + Rustfmt + Pre-commit hooks

### Post-Deployment Installation

```bash
# Node.js
npm install

# Python
pip install -r requirements-dev.txt

# Pre-commit hooks (all)
pip install pre-commit
pre-commit install
```

## Verification

### Check Status

```bash
trinity status
```

Expected output confirms all directories, agents, and commands deployed.

### In Claude Code

```bash
# Verify slash commands
/trinity-verify

# List agents
/trinity-agents

# Initialize all agents
/trinity-init
```

## Framework-Specific Deployments

Trinity auto-detects your stack and configures appropriately:

- **React/Next.js** - ESLint with React rules
- **Vue/Nuxt** - ESLint with Vue rules
- **Python/FastAPI** - Black + Flake8
- **Node.js/Express** - ESLint for Node
- **React Native** - React Native linting
- **Flutter** - Dart Analyzer

## Updating

```bash
# Update to latest SDK
trinity update

# Preview update
trinity update --dry-run
```

Updates templates, agents, commands, and hooks while preserving your investigations, work orders, and patterns.

## Troubleshooting

### Already Deployed

```bash
# Force overwrite
trinity deploy --force

# Or remove manually
rm -rf trinity/ .claude/ trinity-hooks/
trinity deploy
```

### Slash Commands Not Working

1. Restart Claude Code
2. Check `.claude/commands/` exists
3. Run `/trinity-verify`

### Linting Not Working

```bash
# Install dependencies
npm install  # or pip install -r requirements-dev.txt

# Setup hooks
pre-commit install
```

## Best Practices

✅ **DO:**
- Deploy early in project
- Use `--yes` for CI/CD
- Commit Trinity structure
- Update regularly
- Configure linting

❌ **DON'T:**
- Skip verification
- Modify templates directly
- Ignore SDK updates
- Deploy without backup on existing projects

## See Also

- [Getting Started](getting-started.md) - Quick start guide
- [CLI Commands](api/cli-commands.md) - Complete reference
- [Slash Commands](guides/slash-commands.md) - Command usage
- [Customization Guide](customization-guide.md) - Tailoring Trinity