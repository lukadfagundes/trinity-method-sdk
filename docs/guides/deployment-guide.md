# Deployment Guide: Advanced Trinity Method Scenarios

**Trinity Version:** 2.0.9
**Last Updated:** 2026-01-12

## Overview

This guide covers advanced Trinity Method deployment scenarios beyond the basic installation covered in the [Getting Started Guide](getting-started.md). Learn how to customize deployments, handle edge cases, and optimize Trinity for your specific project needs.

## Table of Contents

- [Basic Deployment Review](#basic-deployment-review)
- [Custom Deployment Scenarios](#custom-deployment-scenarios)
- [Multi-Project Deployments](#multi-project-deployments)
- [Monorepo Support](#monorepo-support)
- [Custom Configuration](#custom-configuration)
- [Framework-Specific Deployments](#framework-specific-deployments)
- [CI/CD Integration](#cicd-integration)
- [Deployment Troubleshooting](#deployment-troubleshooting)
- [Update Strategies](#update-strategies)

---

## Basic Deployment Review

### Standard Deployment

```bash
# Global installation (recommended)
npm install -g trinity-method-sdk

# Deploy to project
cd /path/to/your/project
trinity deploy
```

**Interactive Prompts:**

1. **Framework Selection** - Node.js, Python, Rust, Flutter, Go
2. **Linting Tools** - ESLint, Black, Clippy, Dart Analyzer, etc.
3. **CI/CD Platform** - GitHub Actions, GitLab CI, CircleCI, Jenkins
4. **Project Name** - Your project name (default: from package.json)

**What Gets Deployed:**

- 19 agents → `.claude/agents/`
- 20 slash commands → `.claude/commands/`
- Knowledge base → `trinity/knowledge-base/`
- Investigation templates → `trinity/templates/`
- Linting configs → Root directory
- CI/CD workflows → `.github/workflows/`, `.gitlab-ci.yml`, etc.

---

## Custom Deployment Scenarios

### Deploying to a Specific Directory

If you want Trinity deployed to a non-standard location:

```bash
# Deploy from within target directory
cd /path/to/specific/directory
trinity deploy
```

**Note:** Trinity always deploys relative to the current working directory.

### Selective Component Deployment

**Scenario:** You only want certain Trinity components (e.g., agents but not CI/CD)

**Solution:** Deploy fully, then remove unwanted components

```bash
# Full deployment
trinity deploy

# Remove CI/CD workflows (if not needed)
rm -rf .github/workflows/
rm .gitlab-ci.yml

# Keep agents, commands, and knowledge base
```

**Recommended Approach:** Deploy all components initially. Trinity components are designed to work together.

### Deploying Without Interactive Prompts

**Scenario:** Automated deployment in CI/CD or scripts

**Current Limitation:** Trinity v2.0 requires interactive prompts.

**Workaround:** Use `expect` or similar tool to automate responses:

```bash
# Example with expect (Linux/macOS)
expect << EOF
spawn trinity deploy
expect "Select your framework:"
send "Node.js\r"
expect "Select linting tools:"
send "ESLint + Prettier\r"
expect "Select CI/CD platform:"
send "GitHub Actions\r"
expect "Project name:"
send "my-project\r"
expect eof
EOF
```

---

## Multi-Project Deployments

### Deploying to Multiple Projects

**Scenario:** You have multiple projects and want Trinity in each

```bash
# Project 1 (Node.js)
cd ~/projects/frontend-app
trinity deploy
# Select: Node.js, ESLint + Prettier, GitHub Actions

# Project 2 (Python)
cd ~/projects/backend-api
trinity deploy
# Select: Python, Black + Flake8, GitHub Actions

# Project 3 (Rust)
cd ~/projects/rust-tool
trinity deploy
# Select: Rust, Clippy + Rustfmt, GitLab CI
```

**Best Practice:** Deploy separately to each project. Trinity customizes to each project's framework.

### Shared Configuration Across Projects

**Scenario:** You want consistent Trinity configuration across multiple projects

**Solution:** Create a deployment script

```bash
#!/bin/bash
# deploy-trinity.sh

PROJECTS=(
    "~/projects/frontend-app"
    "~/projects/backend-api"
    "~/projects/rust-tool"
)

for project in "${PROJECTS[@]}"; do
    echo "Deploying Trinity to $project"
    cd "$project" || exit
    trinity deploy
    # Use expect for automated responses if needed
done
```

---

## Monorepo Support

### Deploying Trinity to a Monorepo

**Scenario:** You have a monorepo with multiple packages

```
my-monorepo/
├── packages/
│   ├── frontend/
│   ├── backend/
│   └── shared/
├── package.json (root)
└── pnpm-workspace.yaml
```

**Option 1: Root-Level Deployment (Recommended)**

Deploy Trinity at the monorepo root:

```bash
cd my-monorepo
trinity deploy
```

**Benefits:**

- Single Trinity instance for entire monorepo
- Centralized knowledge base
- Consistent methodology across packages

**Configuration:**

- Framework: Select primary framework (usually Node.js for monorepos)
- Linting: Configure root-level linting (ESLint with monorepo support)
- CI/CD: Single workflow for entire monorepo

**Option 2: Per-Package Deployment**

Deploy Trinity to each package individually:

```bash
cd my-monorepo/packages/frontend
trinity deploy

cd ../backend
trinity deploy

cd ../shared
trinity deploy
```

**Benefits:**

- Package-specific agent teams
- Framework-specific configurations (frontend: React, backend: Node.js, shared: TypeScript)

**Drawbacks:**

- Duplicate Trinity infrastructure
- More complex to maintain

**Recommendation:** Use Option 1 (root-level) for most monorepos.

---

## Custom Configuration

### Customizing Deployed Components

#### Modifying Agent Configurations

After deployment, you can customize agent prompts:

```bash
# Edit an agent's prompt
code .claude/agents/kil-task-executor.md

# Add project-specific instructions
# Example: Add custom TDD workflow steps
```

**Caution:** Modifications will be overwritten on `trinity update`. Back up customizations first.

#### Customizing Slash Commands

```bash
# Edit a slash command
code .claude/commands/execution/trinity-orchestrate.md

# Add project-specific workflow steps
```

#### Customizing Knowledge Base

```bash
# Customize Trinity.md for your project
code trinity/knowledge-base/Trinity.md

# Add project-specific guidelines
# Update ARCHITECTURE.md with your architecture
code trinity/knowledge-base/ARCHITECTURE.md
```

**Safe to Customize:**

- `trinity/knowledge-base/ARCHITECTURE.md` - Preserved on update
- `trinity/knowledge-base/ISSUES.md` - Preserved on update
- `trinity/knowledge-base/To-do.md` - Preserved on update
- `trinity/knowledge-base/Technical-Debt.md` - Preserved on update

**Not Safe (Overwritten on Update):**

- `.claude/agents/*` - Agent prompts
- `.claude/commands/*` - Slash commands
- `trinity/knowledge-base/Trinity.md` - Base template
- `trinity/knowledge-base/TESTING-PRINCIPLES.md` - Base template

### Custom Template Variables

**Scenario:** You want to add custom variables to templates

**Current Limitation:** Template variables are fixed in v2.0.

**Workaround:** Manually edit deployed files after deployment

```bash
# After deployment, manually replace custom placeholders
find .claude -type f -exec sed -i 's/{{MY_CUSTOM_VAR}}/actual_value/g' {} +
```

---

## Framework-Specific Deployments

### Node.js / React

**Recommended Configuration:**

- **Framework:** Node.js
- **Linting:** ESLint + Prettier
- **CI/CD:** GitHub Actions (includes Node.js workflow)

**Deployed Files:**

- `eslint.config.js` (flat config)
- `.prettierrc`
- `.pre-commit-config.yaml` (ESLint + Prettier hooks)
- `.github/workflows/nodejs.yml`

**Post-Deployment:**

```bash
# Install linting dependencies
npm install -D eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier

# Install pre-commit
pip install pre-commit
pre-commit install
```

### Python

**Recommended Configuration:**

- **Framework:** Python
- **Linting:** Black + Flake8 + isort
- **CI/CD:** GitHub Actions (includes Python workflow)

**Deployed Files:**

- `pyproject.toml` (Black + isort config)
- `.flake8`
- `.isort.cfg`
- `.pre-commit-config.yaml` (Black + Flake8 + isort hooks)
- `.github/workflows/python.yml`

**Post-Deployment:**

```bash
# Install linting tools
pip install black flake8 isort pre-commit

# Install pre-commit hooks
pre-commit install
```

### Rust

**Recommended Configuration:**

- **Framework:** Rust
- **Linting:** Clippy + Rustfmt
- **CI/CD:** GitHub Actions (includes Rust workflow)

**Deployed Files:**

- `clippy.toml`
- `rustfmt.toml`
- `.pre-commit-config.yaml` (Clippy + Rustfmt hooks)
- `.github/workflows/rust.yml`

**Post-Deployment:**

```bash
# Install Rust toolchain components
rustup component add clippy rustfmt

# Install pre-commit (requires Python)
pip install pre-commit
pre-commit install
```

### Flutter

**Recommended Configuration:**

- **Framework:** Flutter
- **Linting:** Dart Analyzer
- **CI/CD:** GitHub Actions (includes Flutter workflow)

**Deployed Files:**

- `analysis_options.yaml`
- `.pre-commit-config.yaml` (Dart Analyzer hooks)
- `.github/workflows/flutter.yml`

**Post-Deployment:**

```bash
# Ensure Flutter is installed
flutter doctor

# Install pre-commit (requires Python)
pip install pre-commit
pre-commit install
```

### Go

**Recommended Configuration:**

- **Framework:** Go
- **Linting:** gofmt (standard Go tooling)
- **CI/CD:** GitHub Actions (includes Go workflow)

**Deployed Files:**

- `.github/workflows/go.yml`
- Basic pre-commit support

**Post-Deployment:**

```bash
# Go tooling is built-in
go version

# Install pre-commit (optional)
pip install pre-commit
pre-commit install
```

---

## CI/CD Integration

### GitHub Actions

**Deployed Workflow:** `.github/workflows/{framework}.yml`

**Features:**

- Automated testing on push/PR
- Linting and formatting checks
- Build verification
- Multi-OS support (Ubuntu, macOS, Windows)

**Customization:**

```yaml
# Edit .github/workflows/nodejs.yml
name: Node.js CI

on:
  push:
    branches: [main, develop] # Add your branches
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20] # Add/remove versions
```

### GitLab CI

**Deployed Workflow:** `.gitlab-ci.yml`

**Features:**

- Pipeline stages: test, lint, build
- Caching for faster runs
- Artifact generation

**Customization:**

```yaml
# Edit .gitlab-ci.yml
stages:
  - test
  - lint
  - build
  - deploy # Add custom stages

variables:
  NODE_VERSION: '20' # Customize versions
```

### CircleCI

**Deployed Workflow:** `.circleci/config.yml`

**Features:**

- Parallel job execution
- Docker-based builds
- Workflow orchestration

### Jenkins

**Deployed Workflow:** `Jenkinsfile`

**Features:**

- Declarative pipeline
- Multi-stage builds
- Integration with existing Jenkins infrastructure

---

## Deployment Troubleshooting

### Issue: "Trinity already deployed"

**Problem:** Attempting to deploy when Trinity already exists

**Solution:**

```bash
# Option 1: Update instead
trinity update

# Option 2: Remove and redeploy
rm -rf .claude/ trinity/
trinity deploy
```

### Issue: Framework Not Detected

**Problem:** Trinity can't detect your framework

**Symptoms:** No auto-detection, prompted to select manually

**Solution:**

1. Ensure framework manifest exists:
   - Node.js: `package.json`
   - Python: `requirements.txt` or `pyproject.toml`
   - Rust: `Cargo.toml`
   - Flutter: `pubspec.yaml`
   - Go: `go.mod`

2. Deploy from correct directory (where manifest is)

3. Manually select framework when prompted

### Issue: Linting Config Conflicts

**Problem:** Trinity linting config conflicts with existing config

**Solution:**

```bash
# Backup existing config
mv .eslintrc.js .eslintrc.js.backup

# Deploy Trinity
trinity deploy

# Merge configurations manually
# Review .eslintrc.js.backup and eslint.config.js
# Combine rules as needed
```

### Issue: CI/CD Workflow Conflicts

**Problem:** Existing CI/CD workflow conflicts with Trinity workflow

**Solution:**

```bash
# Backup existing workflow
mv .github/workflows/ci.yml .github/workflows/ci.yml.backup

# Deploy Trinity
trinity deploy

# Option 1: Use Trinity workflow exclusively
# Option 2: Merge workflows
# Copy relevant jobs from backup into Trinity workflow
```

### Issue: Permission Errors

**Problem:** Cannot write to directories

**Solution:**

```bash
# Check directory permissions
ls -la

# Fix permissions (Unix/macOS)
chmod -R u+w .

# On Windows, run terminal as Administrator
```

### Issue: Node.js Version Too Old

**Problem:** Trinity requires Node.js ≥16.9.0

**Solution:**

```bash
# Check current version
node --version

# Install newer Node.js
# Using nvm (recommended)
nvm install 20
nvm use 20

# Verify
node --version  # Should be ≥16.9.0

# Redeploy Trinity
trinity deploy
```

---

## Update Strategies

### Standard Update

```bash
cd /path/to/project
trinity update
```

**Update Process:**

1. Version check (reads `trinity/VERSION`)
2. Backup creation (`trinity/backups/backup-{timestamp}.tar.gz`)
3. User content preservation (ARCHITECTURE.md, ISSUES.md, To-do.md, Technical-Debt.md)
4. New template deployment
5. User content restoration
6. Verification
7. Optional backup cleanup

### Update with Backup Retention

```bash
trinity update
# When prompted: "Remove backup?" → Select "No"
```

**Backups Location:** `trinity/backups/`

**Backup Naming:** `backup-2025-12-28T12-30-00.tar.gz`

### Manual Rollback

If update fails or introduces issues:

```bash
# Navigate to backups
cd trinity/backups/

# List available backups
ls -lh

# Extract backup
tar -xzf backup-2025-12-28T12-30-00.tar.gz -C ../../

# Verify rollback
cat trinity/VERSION
```

### Selective Update

**Scenario:** You only want to update specific components

**Solution:**

1. Create manual backup
2. Run `trinity update`
3. Restore specific files from backup

```bash
# Backup before update
cp -r .claude .claude.backup
cp -r trinity trinity.backup

# Update
trinity update

# Restore specific files
cp .claude.backup/agents/kil-task-executor.md .claude/agents/
```

---

## Best Practices

### 1. Always Deploy to Clean Directory

Deploy Trinity to projects without existing `.claude/` or `trinity/` directories for cleanest setup.

### 2. Use Version Control

Commit Trinity deployment to git for team collaboration:

```bash
git add .claude/ trinity/ .eslintrc.js .github/workflows/
git commit -m "Deploy Trinity Method v2.0.0"
git push
```

### 3. Document Customizations

If you customize Trinity components, document changes in `trinity/knowledge-base/ARCHITECTURE.md`.

### 4. Keep Trinity Updated

Regularly update Trinity to get latest agents, commands, and features:

```bash
# Check for updates monthly
trinity update
```

### 5. Test After Deployment

After deploying Trinity, verify everything works:

```bash
# Run linting
npm run lint

# Run tests
npm test

# Verify CI/CD
git push  # Triggers CI/CD workflow
```

### 6. Framework-Specific Best Practices

- **Node.js:** Use `eslint.config.js` flat config (deployed by Trinity)
- **Python:** Use `pyproject.toml` for centralized config
- **Rust:** Keep `clippy.toml` and `rustfmt.toml` up to date
- **Flutter:** Regularly update `analysis_options.yaml` with new Dart lints

---

## Advanced Topics

### Deploying Trinity in Docker Containers

**Scenario:** Your project runs in Docker

**Solution:** Include Trinity in Dockerfile

```dockerfile
FROM node:20

WORKDIR /app

# Install Trinity globally
RUN npm install -g trinity-method-sdk

# Copy project files
COPY . .

# Deploy Trinity (requires expect for non-interactive)
RUN apt-get update && apt-get install -y expect
RUN expect << EOF
spawn trinity deploy
expect "Select your framework:"
send "Node.js\r"
expect eof
EOF

# Continue with app setup
RUN npm install
```

### Deploying Trinity in CI/CD

**Scenario:** Auto-deploy Trinity in CI/CD pipeline

**GitHub Actions Example:**

```yaml
name: Deploy Trinity

on:
  push:
    branches: [main]

jobs:
  deploy-trinity:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Trinity
        run: npm install -g trinity-method-sdk

      - name: Deploy Trinity
        run: |
          # Note: Trinity requires interactive deployment
          # Use expect or similar for automation

      - name: Commit Trinity Files
        run: |
          git config user.name "Trinity Bot"
          git config user.email "bot@trinity.dev"
          git add .claude/ trinity/
          git commit -m "chore: Deploy Trinity Method"
          git push
```

---

## Additional Resources

- **Getting Started:** [Getting Started Guide](getting-started.md)
- **Agent Guide:** [Agent Guide](agent-guide.md)
- **Multi-Framework:** [Multi-Framework Guide](multi-framework-guide.md)
- **CLI Reference:** [CLI Commands Reference](../reference/cli-commands.md)
- **Architecture:** [Architecture Overview](../architecture/overview.md)

---

**Trinity Method SDK v2.0.9** - Investigation-first development methodology
