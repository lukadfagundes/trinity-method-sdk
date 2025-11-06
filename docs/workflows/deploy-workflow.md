# Deploy Workflow

**Trinity Method SDK Deployment to Your Project**

---

## Overview

Deploying Trinity SDK to a project initializes the complete Trinity Method development environment: folder structure, AI agents, knowledge base, learning system, and hooks. This workflow guides you through deployment, baseline establishment, and validation.

---

## Deployment Process

### Phase 1: Pre-Deployment (Planning)

**Before running deployment, determine:**

```yaml
Project Context:
  - Project type: Web app, API, CLI tool, library, etc.
  - Technology stack: TypeScript, Python, Java, etc.
  - Framework: Express, React, Next.js, etc.
  - Current state: New project or existing codebase

Deployment Options:
  - Linting: Recommended (best practices) or Custom (existing config)
  - Hooks: Enabled (automatic) or Manual (custom setup)
  - Learning: Enabled (pattern extraction) or Disabled (privacy-sensitive)
  - Agents: All 18 agents or Subset (minimal setup)

Team Context:
  - Team size: Solo developer or team
  - Experience level: Junior, mid-level, senior
  - CI/CD: Existing pipeline or new setup
```

**Recommendation:** Use "Recommended" defaults for new projects or teams new to Trinity Method.

---

### Phase 2: SDK Deployment

#### Step 1: Install Trinity Method SDK

```bash
# NPM
npm install --save-dev @trinity-method/sdk

# Yarn
yarn add --dev @trinity-method/sdk

# PNPM
pnpm add -D @trinity-method/sdk
```

---

#### Step 2: Run Deployment Command

```bash
npx trinity deploy
```

**Interactive prompts:**

```
┌───────────────────────────────────────────────┐
│   Trinity Method SDK Deployment Wizard       │
└───────────────────────────────────────────────┘

? Select project type:
  ❯ Web Application (Express, React, etc.)
    API Server (REST, GraphQL)
    CLI Tool
    Library/Package
    Other

? Select technology stack:
  ❯ TypeScript
    JavaScript
    Python
    Java
    Other

? Select linting configuration:
  ❯ Recommended (Trinity best practices)
    Custom (use existing .eslintrc)
    Skip (manual setup later)

? Enable pre-commit hooks?
  ❯ Yes (automatic quality checks)
    No (manual setup later)

? Enable Learning System?
  ❯ Yes (pattern extraction and suggestions)
    No (privacy-sensitive projects)

? Select agents to deploy:
  ❯ All 18 agents (recommended)
    Leadership only (ALY, AJ MAESTRO)
    Custom selection

? Initialize git repository? (if not already initialized)
  ❯ Yes
    No

Deployment starting...
```

---

#### Step 3: Deployment Execution

**TAN (Structure Specialist) creates folder structure:**

```bash
[1/8] Creating Trinity folder structure...

Created: trinity/
├── .claude/
│   ├── agents/
│   │   ├── leadership/
│   │   │   ├── aly-cto.md
│   │   │   └── aj-maestro.md
│   │   ├── planning/
│   │   │   ├── mon-requirements.md
│   │   │   ├── ror-design.md
│   │   │   ├── tra-planner.md
│   │   │   └── eus-decomposer.md
│   │   ├── execution/
│   │   │   ├── kil-executor.md
│   │   │   ├── bas-quality.md
│   │   │   └── dra-reviewer.md
│   │   ├── support/
│   │   │   ├── apo-docs.md
│   │   │   ├── bon-deps.md
│   │   │   ├── cap-config.md
│   │   │   └── uro-refactor.md
│   │   ├── deployment/
│   │   │   ├── tan-structure.md
│   │   │   ├── zen-knowledge.md
│   │   │   ├── ino-context.md
│   │   │   └── ein-cicd.md
│   │   └── audit/
│   │       └── juno-auditor.md
│   ├── commands/
│   │   ├── trinity-plan.md
│   │   ├── trinity-orchestrate.md
│   │   ├── trinity-workorder.md
│   │   └── ... (all 25+ slash commands)
│   └── hooks/
│       ├── session-start.sh
│       ├── session-end.sh
│       ├── pre-commit.sh
│       └── post-commit.sh
├── knowledge-base/
│   ├── Trinity.md
│   ├── ARCHITECTURE.md
│   ├── ISSUES.md
│   ├── To-do.md
│   └── PATTERNS.md
├── learning/
│   ├── patterns/
│   ├── strategies/
│   └── metrics/
├── investigations/
├── design-docs/
├── work-orders/
├── sessions/
├── audits/
└── cache/

✓ Folder structure created (2.3s)
```

---

**ZEN (Knowledge Base Specialist) initializes knowledge base:**

```bash
[2/8] Initializing Knowledge Base...

Creating: trinity/knowledge-base/Trinity.md
Creating: trinity/knowledge-base/ARCHITECTURE.md
Creating: trinity/knowledge-base/ISSUES.md
Creating: trinity/knowledge-base/To-do.md
Creating: trinity/knowledge-base/PATTERNS.md

✓ Knowledge Base initialized (1.1s)
```

---

**INO (Context Specialist) creates CLAUDE.md hierarchy:**

```bash
[3/8] Creating CLAUDE.md hierarchy...

Creating: CLAUDE.md (project root)
Creating: src/CLAUDE.md (source directory)
Creating: trinity/CLAUDE.md (Trinity enforcement)

✓ Context hierarchy established (0.8s)
```

---

**BON (Dependency Manager) configures linting:**

```bash
[4/8] Configuring linting...

Selected: Recommended (Trinity best practices)

Installing: eslint, prettier, @trinity-method/eslint-config
Creating: .eslintrc.json
Creating: .prettierrc.json
Creating: .eslintignore

✓ Linting configured (8.2s)
```

---

**CAP (Configuration Specialist) sets up hooks:**

```bash
[5/8] Setting up hooks...

Installing: pre-commit (Python framework)
Creating: .pre-commit-config.yaml
Configuring hooks:
  ✓ session-start
  ✓ session-end
  ✓ pre-commit (lint, test, format)
  ✓ post-commit (archive, learning)

Running: pre-commit install

✓ Hooks configured (4.5s)
```

---

**Ein (CI/CD Specialist) analyzes existing pipeline:**

```bash
[6/8] Analyzing CI/CD configuration...

Detected: .github/workflows/ci.yml (GitHub Actions)

Recommendations:
  - Add Trinity quality gates to CI pipeline
  - Configure BAS integration for PR checks
  - Enable JUNO audits on release branches

Guide: See docs/cicd/deployment-guide.md

✓ CI/CD analysis complete (1.2s)
```

---

**BAS (Quality Gate) establishes baseline:**

```bash
[7/8] Establishing quality baseline...

Running lint check...
  ✓ No linting errors

Running build...
  ✓ Build successful

Running tests...
  ✓ 127 tests passed
  ✓ Coverage: 88.3%

Measuring performance...
  ✓ Response times captured
  ✓ Memory usage recorded

Creating baseline report: trinity/baselines/2025-11-05-initial.json

✓ Baseline established (45.3s)
```

---

**JUNO (Quality Auditor) performs initial audit:**

```bash
[8/8] Performing initial audit...

Security scan...
  ⚠️ 2 findings (MEDIUM severity)

Performance analysis...
  ✓ All endpoints <200ms

Technical debt...
  ✓ Low debt (estimated 4 hours)

Audit report: trinity/audits/2025-11-05-initial-deployment.md

✓ Initial audit complete (124.7s)
```

---

#### Step 4: Deployment Complete

```bash
┌─────────────────────────────────────────────────────┐
│   Trinity Method SDK Deployment Complete!          │
└─────────────────────────────────────────────────────┘

✓ Folder structure created
✓ 18 AI agents deployed
✓ Knowledge Base initialized
✓ CLAUDE.md hierarchy established
✓ Linting configured (ESLint + Prettier)
✓ Hooks installed (pre-commit, session-start, session-end)
✓ Quality baseline established
✓ Initial audit completed

Next Steps:
1. Review: trinity/audits/2025-11-05-initial-deployment.md
2. Customize: CLAUDE.md with project-specific instructions
3. Start work: /trinity-plan or /trinity-workorder

Documentation: https://docs.trinity-method.dev
Support: https://github.com/trinity-method/sdk/issues

Total deployment time: 3m 8s
```

---

### Phase 3: Post-Deployment Configuration

#### Step 1: Review Initial Audit Report

**Open and review:** `trinity/audits/2025-11-05-initial-deployment.md`

**Key sections:**
- Security findings (address MEDIUM+ immediately)
- Performance baseline (reference for future comparisons)
- Technical debt assessment (plan remediation)
- Recommendations (quick wins for quality improvement)

**Example findings:**
```markdown
## Security Findings

⚠️ MEDIUM: Missing security headers
Fix: Install helmet middleware (15 minutes)

⚠️ MEDIUM: Outdated dependency (lodash@4.17.19)
Fix: Update to lodash@4.17.21 (5 minutes)

## Performance Baseline

Response Times (p95):
- GET /api/users: 145ms ✓
- POST /api/users: 98ms ✓
- GET /api/projects: 450ms ⚠️ (exceeds 200ms threshold)

## Technical Debt

Total Estimated: 4 hours
- Missing tests: 2 hours
- Long functions (>200 lines): 1 hour
- Documentation gaps: 1 hour
```

**Action:** Create work orders for MEDIUM+ security findings.

---

#### Step 2: Customize CLAUDE.md

**Project-specific customization:**

```markdown
# Project Name - Claude Code Memory

**Framework:** [Your framework]
**Tech Stack:** [Your stack]
**Source Directory:** [Your src directory]
**Trinity Version:** 2.0.0
**Deployed:** 2025-11-05

---

## Project Overview

[Your project description]

## Architecture

[Your architecture notes - or reference trinity/knowledge-base/ARCHITECTURE.md]

## Current Tasks

See: [trinity/knowledge-base/To-do.md](trinity/knowledge-base/To-do.md)

## Known Issues

See: [trinity/knowledge-base/ISSUES.md](trinity/knowledge-base/ISSUES.md)

---

## Project-Specific Instructions for Claude

### [Technology-Specific Rules]

Example for React project:
- Use functional components with hooks (not class components)
- State management: Redux Toolkit
- Styling: Tailwind CSS
- Testing: React Testing Library

### [Team Conventions]

Example:
- Branch naming: feature/TICKET-123-description
- Commit messages: Conventional Commits format
- PR requirements: 2 approvals + CI pass

### [Domain-Specific Patterns]

Example for e-commerce:
- All prices in cents (integer) to avoid floating-point errors
- Order status: pending → processing → shipped → delivered
- Inventory checks before order confirmation
```

---

#### Step 3: Configure Learning System (Optional)

**If Learning System enabled:**

```bash
# Configure learning preferences
npx trinity config learning

? Enable automatic pattern extraction?
  ❯ Yes (recommended)
    No

? Share patterns with team?
  ❯ Yes (save to git)
    No (local only)

? Pattern confidence threshold (0.0-1.0):
  ❯ 0.7 (recommended)
    Custom: [enter value]

? Enable cross-session learning?
  ❯ Yes (load patterns from previous sessions)
    No (fresh start each session)

Configuration saved to: .trinity/config.json
```

---

#### Step 4: Set Up Team Access (Multi-Developer Teams)

**For teams, configure shared knowledge:**

```bash
# Add .trinity/ to git (shared across team)
git add .trinity/

# Commit Trinity configuration
git commit -m "feat(trinity): Deploy Trinity Method SDK v2.0"

# Push to remote
git push origin main
```

**Each team member then:**
```bash
# Pull Trinity configuration
git pull origin main

# Initialize hooks locally
pre-commit install
```

**Result:** All team members share agents, patterns, baselines.

---

### Phase 4: Validation

#### Validation Checklist

**Run validation to ensure deployment success:**

```bash
npx trinity verify
```

**Checks performed:**

```bash
┌─────────────────────────────────────────────────────┐
│   Trinity Method SDK Verification                  │
└─────────────────────────────────────────────────────┘

[1/10] Folder structure...
  ✓ trinity/ directory exists
  ✓ All required subdirectories present
  ✓ .claude/ directory exists with agents

[2/10] Agents...
  ✓ All 18 agents deployed
  ✓ Agent files readable and valid

[3/10] Knowledge Base...
  ✓ Trinity.md exists
  ✓ ARCHITECTURE.md exists
  ✓ ISSUES.md exists
  ✓ To-do.md exists

[4/10] Context Hierarchy...
  ✓ CLAUDE.md exists (project root)
  ✓ src/CLAUDE.md exists
  ✓ trinity/CLAUDE.md exists

[5/10] Linting...
  ✓ ESLint configured
  ✓ Prettier configured
  ✓ Lint command works: npm run lint

[6/10] Hooks...
  ✓ pre-commit installed
  ✓ session-start hook exists
  ✓ session-end hook exists
  ✓ pre-commit hook exists

[7/10] Learning System...
  ✓ Learning data store initialized
  ✓ Pattern extraction enabled
  ✓ Strategy selection configured

[8/10] Baseline...
  ✓ Baseline report exists
  ✓ Performance metrics captured
  ✓ Test coverage recorded

[9/10] Audit...
  ✓ Initial audit report exists
  ✓ Security scan completed
  ✓ Technical debt assessed

[10/10] Git Integration...
  ✓ .gitignore includes trinity/cache/
  ✓ .gitignore includes trinity/sessions/
  ✓ Trinity files committed

┌─────────────────────────────────────────────────────┐
│   ✓ Trinity Method SDK Verified Successfully       │
└─────────────────────────────────────────────────────┘

Deployment is complete and functional.

Next: Start your first session with /trinity-plan or /trinity-workorder
```

---

#### Manual Validation Steps

**If `npx trinity verify` is not available yet, manually check:**

1. **Folder Structure:**
```bash
ls -la trinity/
# Should see: knowledge-base, investigations, design-docs, work-orders, etc.
```

2. **Agents:**
```bash
ls -la .claude/agents/
# Should see: leadership, planning, execution, support, deployment, audit
```

3. **Hooks:**
```bash
pre-commit run --all-files
# Should execute linting and tests
```

4. **Baseline:**
```bash
cat trinity/baselines/2025-11-05-initial.json
# Should contain performance metrics
```

5. **Audit:**
```bash
cat trinity/audits/2025-11-05-initial-deployment.md
# Should contain security, performance, debt findings
```

---

### Phase 5: First Session

**Start your first Trinity Method session:**

#### Option 1: Plan a Feature (/trinity-plan)

```bash
# In Claude Code
/trinity-plan

# Follow prompts:
? What do you want to build?
  > Add pagination to user list API

? Investigation needed?
  > Yes (technical + performance investigation)

# ALY creates investigation document
# MON/ZEN/BAS gather evidence
# ROR creates design document (if Medium/Large)
# TRA creates implementation plan
# EUS decomposes into atomic tasks

# Output: Complete work plan with investigation + design + tasks
```

---

#### Option 2: Create Work Order (/trinity-workorder)

```bash
# In Claude Code
/trinity-workorder

# Follow prompts:
? Work order type?
  ❯ Implementation
    Investigation
    Refactoring
    Bug Fix
    Security Fix

? Priority?
  ❯ CRITICAL
    HIGH
    MEDIUM
    LOW

? Estimated time?
  > 8 hours

? Dependencies?
  > None

? Deliverables?
  > - API endpoint with pagination
    - Unit tests (≥80% coverage)
    - Design document
    - Performance benchmarks

# Output: Work order saved to trinity/work-orders/WO-001-feature-name.md
```

---

#### Option 3: Orchestrate Implementation (/trinity-orchestrate)

```bash
# In Claude Code
/trinity-orchestrate

# AJ MAESTRO coordinates:
# 1. ALY determines scale (Small/Medium/Large)
# 2. MON/ROR/TRA/EUS plan (if Medium/Large)
# 3. KIL implements with TDD
# 4. BAS enforces quality gates
# 5. DRA reviews (if Medium/Large)
# 6. JUNO audits (if Large)

# Automatic stop points for user review
# Complete implementation with all quality checks
```

---

## Deployment Scenarios

### Scenario 1: New TypeScript Project

**Context:** Starting from scratch

```bash
# Initialize project
mkdir my-project && cd my-project
npm init -y

# Install Trinity SDK
npm install --save-dev @trinity-method/sdk

# Deploy with recommended defaults
npx trinity deploy
# Select: TypeScript, Recommended linting, Enable hooks, Enable learning

# Customize CLAUDE.md
# Start first session: /trinity-plan
```

**Timeline:** 5-10 minutes

---

### Scenario 2: Existing TypeScript Project

**Context:** Mature codebase with existing conventions

```bash
# Install Trinity SDK
npm install --save-dev @trinity-method/sdk

# Deploy with custom configuration
npx trinity deploy
# Select: TypeScript, Custom linting (keep existing .eslintrc), Enable hooks

# Review initial audit report
# Address MEDIUM+ security findings
# Customize CLAUDE.md with existing patterns

# Start first session: /trinity-workorder (use existing backlog)
```

**Timeline:** 15-30 minutes (includes audit review and remediation planning)

---

### Scenario 3: Team Migration to Trinity Method

**Context:** Team of 5 developers adopting Trinity Method

**Week 1: Pilot Deployment**
```bash
# Single developer deploys on pilot branch
git checkout -b trinity-pilot

npm install --save-dev @trinity-method/sdk
npx trinity deploy

# Work on 2-3 tasks using Trinity workflows
# Document learnings in trinity/sessions/
# Share findings with team
```

**Week 2: Team Training**
- Team reviews pilot results
- Walk through agent roles and workflows
- Practice with /trinity-plan, /trinity-orchestrate
- Each developer runs `pre-commit install`

**Week 3: Full Adoption**
```bash
# Merge pilot branch to main
git checkout main
git merge trinity-pilot

# All developers pull latest
git pull origin main

# Each developer initializes hooks
pre-commit install

# Start using Trinity Method for all new work
```

**Timeline:** 3 weeks (pilot → training → adoption)

---

### Scenario 4: CI/CD Integration

**Context:** Existing GitHub Actions pipeline

**Step 1: Deploy Trinity SDK locally**
```bash
npx trinity deploy
```

**Step 2: Add Trinity quality gates to CI**
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  trinity-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      # Install dependencies
      - run: npm ci

      # BAS Phase 1: Linting
      - run: npm run lint

      # BAS Phase 3: Build
      - run: npm run build

      # BAS Phase 4: Testing
      - run: npm test

      # BAS Phase 5: Coverage
      - run: npm run test:coverage
      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi

      # JUNO Security Audit (weekly)
      - name: Security audit
        if: github.event_name == 'schedule'
        run: npm audit --audit-level=moderate
```

**Step 3: Enable audit on release branches**
```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches:
      - release/*

jobs:
  juno-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - run: npm ci

      # Full JUNO audit before release
      - run: npx trinity audit
      - name: Upload audit report
        uses: actions/upload-artifact@v3
        with:
          name: juno-audit-report
          path: trinity/audits/*.md
```

**Timeline:** 1-2 hours (CI configuration + testing)

---

## Troubleshooting Deployment Issues

### Issue 1: Hooks Not Working

**Symptom:** `pre-commit` not running on git commit

**Solution:**
```bash
# Reinstall pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Test hooks
pre-commit run --all-files
```

---

### Issue 2: Linting Conflicts

**Symptom:** ESLint configuration conflicts with existing rules

**Solution:**
```bash
# Option 1: Merge configs manually
# Edit .eslintrc.json to combine Trinity + existing rules

# Option 2: Use Trinity rules as base, extend with overrides
{
  "extends": ["@trinity-method/eslint-config"],
  "rules": {
    "your-custom-rule": "override-value"
  }
}

# Option 3: Skip linting during deployment, configure manually later
npx trinity deploy
# Select: Skip linting (manual setup later)
```

---

### Issue 3: Learning System Not Extracting Patterns

**Symptom:** No patterns in `trinity/learning/patterns/`

**Solution:**
```bash
# Check Learning System configuration
npx trinity config learning

# Verify confidence threshold (should be ≤0.7 for most projects)
# Lower threshold if too restrictive

# Manually trigger pattern extraction
npx trinity learn --extract-from-sessions
```

---

### Issue 4: Baseline Establishment Failed

**Symptom:** No baseline report in `trinity/baselines/`

**Solution:**
```bash
# Check if tests are passing
npm test

# Check if build is successful
npm run build

# Manually establish baseline
npx trinity baseline --create

# If tests or build failing, fix issues first, then re-run deployment
```

---

## Related Workflows

- **After Deployment:** [Session Workflow](./session-workflow.md)
- **First Investigation:** [Investigation Workflow](./investigation-workflow.md)
- **First Implementation:** [Implementation Workflow](./implementation-workflow.md)

---

**Deploy with confidence. Build with discipline. Ship with quality.**
