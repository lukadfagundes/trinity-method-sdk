# Trinity Method SDK - Command Reference

Complete reference guide for all Trinity Method SDK commands and slash commands.

---

## Table of Contents

1. [CLI Commands](#cli-commands)
2. [Slash Commands (Claude Code)](#slash-commands-claude-code)
3. [Git Workflow](#git-workflow)
4. [npm Commands](#npm-commands)
5. [Usage Examples](#usage-examples)

---

## CLI Commands

### Installation

```bash
# Install globally
npm install -g @trinity-method/cli

# Verify installation
trinity --version
```

### Core Commands

#### `trinity deploy`
Deploy Trinity Method to your current project.

```bash
# Interactive deployment (recommended)
trinity deploy

# With options
trinity deploy --name "MyProject"              # Specify project name
trinity deploy --yes                           # Skip confirmation prompts
trinity deploy --dry-run                       # Preview without writing files
trinity deploy --force                         # Overwrite existing deployment
trinity deploy --skip-audit                    # Skip codebase metrics (faster)
trinity deploy --ci-deploy                     # Include CI/CD templates
```

**What it does:**
- Creates `trinity/` directory structure
- Deploys 7 AI agents to `.claude/agents/`
- Creates 8 slash commands in `.claude/commands/`
- Sets up knowledge base (ARCHITECTURE.md, ISSUES.md, To-do.md, etc.)
- Configures linting (ESLint, Prettier, Black, etc.)
- Optionally sets up CI/CD workflows
- Injects Trinity Method section into README.md

---

#### `trinity update`
Update Trinity Method to the latest version.

```bash
# Update current project
trinity update

# Update all registered projects
trinity update --all

# Preview changes
trinity update --dry-run
```

**What it does:**
- Updates agents to latest version
- Refreshes templates
- Migrates configuration files
- Preserves custom modifications

---

#### `trinity status`
Show Trinity Method deployment status.

```bash
trinity status
```

**Displays:**
- Trinity version installed
- Deployment date
- Agent count
- Template count
- Knowledge base status
- Linting configuration

---

#### `trinity review`
Review archived sessions for patterns.

```bash
# Review all sessions
trinity review

# Review since specific date
trinity review --since "2025-09-01"

# Review specific project
trinity review --project "MyApp"
```

**What it does:**
- Analyzes session archives
- Identifies common patterns
- Suggests improvements
- Generates pattern documentation

---

### Version & Help

```bash
# Show version
trinity --version
trinity -v

# Show help
trinity --help
trinity -h

# Command-specific help
trinity deploy --help
trinity update --help
```

---

## Slash Commands (Claude Code)

These commands are available in Claude Code after running `trinity deploy`.

### Initialization & Setup

#### `/trinity-init`
Complete Trinity integration (runs TAN, ZEN, INO, then JUNO audit).

```
/trinity-init
```

**What it does:**
1. **TAN** - Verifies directory structure
2. **ZEN** - Populates knowledge base
3. **INO** - Sets up context hierarchy
4. **JUNO** - Runs initial quality audit

**Use when:**
- First time setup after deployment
- After major structural changes
- When restarting a project

---

#### `/trinity-verify`
Verify Trinity Method installation completeness.

```
/trinity-verify
```

**What it checks:**
- All agents deployed correctly
- Knowledge base files present
- Templates available
- CLAUDE.md hierarchy valid
- Hooks configured

---

### Session Management

#### `/trinity-start`
Guide through your first Trinity workflow.

```
/trinity-start
```

**What it does:**
- Reviews current tasks (To-do.md)
- Shows known issues (ISSUES.md)
- Recommends starting point
- Sets up session tracking

**Use when:**
- Starting a new development session
- Beginning work on a feature
- After a break from the project

---

#### `/trinity-continue`
Resume work after interruption (ALY reviews state).

```
/trinity-continue
```

**What it does:**
- Checks latest session state
- Reviews uncommitted changes
- Shows active work orders
- Recommends next steps

**Use when:**
- Returning after context loss
- Continuing from previous session
- Claude Code session restarted

---

#### `/trinity-end`
End session and archive work to `trinity/archive/`.

```
/trinity-end
```

**What it does:**
- Archives current session
- Saves work order progress
- Updates knowledge base
- Creates session summary

**Use when:**
- Ending work day
- Switching to different feature
- Before major context switch

---

### Work Orders

#### `/trinity-workorder`
Create Trinity Method work orders interactively.

```
/trinity-workorder
```

**Work Order Types:**
- **Investigation** - Research and analysis
- **Implementation** - Feature development
- **Analysis** - Code review and optimization
- **Audit** - Quality assessment
- **Pattern** - Document reusable solutions
- **Verification** - Test and validate

**Creates:**
- Numbered work order file (WO-XXX-name.md)
- Investigation template
- Acceptance criteria
- Progress tracking

---

### Documentation & Help

#### `/trinity-docs`
Quick access to Trinity documentation.

```
/trinity-docs
```

**Shows:**
- Methodology overview
- Agent capabilities
- Command reference
- Best practices
- Troubleshooting guide

---

#### `/trinity-agents`
Display Trinity agent directory and information.

```
/trinity-agents
```

**Shows:**
- All 7 agents with descriptions
- Specializations
- When to use each agent
- Agent collaboration patterns

---

## Git Workflow

### Initial Setup

```bash
# Remove old Git history (if needed)
rm -rf .git

# Initialize fresh repository
git init

# Set default branch
git branch -M main

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Trinity Method SDK v1.0.0"

# Create version tag
git tag -a v1.0.0 -m "Release v1.0.0 - Trinity Method SDK"

# Add remote
git remote add origin https://github.com/username/repo.git

# Push to GitHub
git push -u origin main --force
git push --tags --force
```

---

### Branch Management

```bash
# Create dev branch
git checkout -b dev

# Push dev and set upstream
git push -u origin dev

# Check branch status
git branch -vv

# Switch branches
git checkout main
git checkout dev
```

---

### Daily Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit with work order reference
git commit -m "WO-042: Implement real-time notifications"

# Push to current branch
git push

# View tags
git tag -l

# Create new tag
git tag -a v1.1.0 -m "Release v1.1.0"

# Push tags
git push --tags
```

---

## npm Commands

### Publishing

```bash
# Login to npm
npm login

# Check who you're logged in as
npm whoami

# Publish package (from packages/cli/)
cd packages/cli
npm publish --access public

# View published package
npm view @trinity-method/cli

# Check package info
npm info @trinity-method/cli
```

---

### Testing & Development

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format

# Build all packages
npm run build
```

---

### Installation & Updates

```bash
# Install globally
npm install -g @trinity-method/cli

# Update to latest
npm update -g @trinity-method/cli

# Uninstall
npm uninstall -g @trinity-method/cli

# Link for local development
npm link
```

---

## Usage Examples

### Example 1: New Project Setup

```bash
# 1. Install Trinity SDK
npm install -g @trinity-method/cli

# 2. Navigate to project
cd my-project

# 3. Deploy Trinity Method
trinity deploy

# 4. Initialize in Claude Code
# Open Claude Code, then run:
/trinity-init

# 5. Start first session
/trinity-start
```

---

### Example 2: Create Feature with Work Order

```bash
# In Claude Code:

# 1. Create work order
/trinity-workorder
# Select: Implementation
# Name: Add user authentication

# 2. Work on feature (Trinity guides you)

# 3. End session when done
/trinity-end

# 4. Commit changes
git add .
git commit -m "WO-043: Add user authentication"
git push
```

---

### Example 3: Resume Work After Break

```bash
# In Claude Code:

# 1. Continue from previous session
/trinity-continue

# 2. Review current state
# Trinity shows:
# - Active work orders
# - Uncommitted changes
# - Next recommended steps

# 3. Continue work

# 4. End session
/trinity-end
```

---

### Example 4: Investigation-First Debugging

```bash
# In Claude Code:

# 1. Create investigation work order
/trinity-workorder
# Select: Investigation
# Name: Slow dashboard performance

# 2. Follow investigation template
# - Identify symptoms
# - Collect metrics
# - Analyze root cause
# - Document findings

# 3. Create implementation work order
/trinity-workorder
# Select: Implementation
# Name: Optimize dashboard queries

# 4. Implement fix based on investigation

# 5. Archive session
/trinity-end
```

---

### Example 5: Team Collaboration

```bash
# Developer A:
/trinity-workorder
# Creates WO-044: Add payment integration

# Commits to trinity/work-orders/WO-044-payment.md
git add trinity/work-orders/WO-044-payment.md
git commit -m "WO-044: Investigation complete"
git push

# Developer B:
git pull
/trinity-continue
# Trinity shows WO-044 is available
# Continues work on implementation
```

---

### Example 6: Publishing Updates

```bash
# 1. Update version in package.json
# Change "version": "1.0.0" → "1.1.0"

# 2. Update CHANGELOG.md
# Add new version section

# 3. Run tests
npm test

# 4. Commit changes
git add .
git commit -m "Release v1.1.0"

# 5. Create tag
git tag -a v1.1.0 -m "Release v1.1.0"

# 6. Publish to npm
cd packages/cli
npm publish --access public

# 7. Push to GitHub
git push origin main
git push --tags
```

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Install Trinity SDK | `npm install -g @trinity-method/cli` |
| Deploy to project | `trinity deploy` |
| Initialize agents | `/trinity-init` |
| Start session | `/trinity-start` |
| Create work order | `/trinity-workorder` |
| Continue work | `/trinity-continue` |
| End session | `/trinity-end` |
| Show agents | `/trinity-agents` |
| View docs | `/trinity-docs` |
| Check status | `trinity status` |
| Update Trinity | `trinity update` |

---

## Environment Variables

```bash
# Optional: Set default project name
export TRINITY_PROJECT_NAME="MyApp"

# Optional: Skip audit by default
export TRINITY_SKIP_AUDIT=true

# Optional: Default to yes on prompts
export TRINITY_AUTO_YES=true
```

---

## Troubleshooting

### Command not found after install
```bash
# Verify npm global bin path is in PATH
npm config get prefix

# Manually link (if needed)
npm link @trinity-method/cli
```

### Permission errors on macOS/Linux
```bash
# Use sudo (not recommended)
sudo npm install -g @trinity-method/cli

# Or fix npm permissions (recommended)
# See: https://docs.npmjs.com/resolving-eacces-permissions-errors
```

### Slash commands not showing in Claude Code
```bash
# Verify deployment
trinity status

# Re-deploy if needed
trinity deploy --force

# Restart Claude Code
```

---

**Trinity Method SDK v1.0.0**
Documentation: https://github.com/lukadfagundes/trinity-method-sdk
npm: https://www.npmjs.com/package/@trinity-method/cli
