---
description: Complete Trinity integration with v2.0 features and intelligent CLAUDE.md placement
---

# Trinity Initialization

**Purpose:** Complete Trinity Method integration with comprehensive setup, intelligent CLAUDE.md placement, and v2.0 feature activation.

## Overview

Trinity initialization deploys the complete Trinity Method infrastructure with:
- ✨ **NEW v2.0 Features:** Crisis management, workflow orchestration, learning dashboard
- 🧠 **Intelligent CLAUDE.md Placement:** Adaptive detection for complex repository structures
- 📚 **Knowledge Base Population:** Architecture analysis and issue tracking
- ✅ **Quality Verification:** JUNO audit for compliance

**Context:** User has run `trinity deploy` and basic Trinity structure exists. Deployment team will now populate and verify all Trinity documents.

**IMPORTANT:** All folders and basic files already exist from deployment. DO NOT attempt to create folders that already exist (trinity/, .claude/, trinity-hooks/, etc.). Focus on POPULATING and VERIFYING content.

## New v2.0 Features

Trinity Method SDK v2.0 introduces powerful new capabilities:

### Crisis Management System
Automatic detection and guided recovery for 5 crisis types:
- **Build Failure** - Compilation errors, dependency issues
- **Test Failure** - Failing tests, coverage drops
- **Error Pattern** - Repeated errors, systematic failures
- **Performance Degradation** - Slowdowns, memory leaks, bottlenecks
- **Security Vulnerability** - CVEs, exposed secrets, vulnerabilities

**Try it:** `trinity crisis --health` or `/trinity-crisis`

**Benefits:**
- 60-70% faster crisis recovery
- Systematic 6-phase recovery protocols
- Automatic pattern learning
- Crisis archive for organizational memory

### Workflow Orchestration
Visual workflow planning with AJ MAESTRO:
- **Interactive workflow generation** with guided prompts
- **Tree visualization** with color coding and progress tracking
- **Scale-based phase structures** (SMALL/MEDIUM/LARGE)
- **Time optimization** through parallelization analysis
- **User approval** at stop points before execution

**Try it:** `trinity orchestrate` or `/trinity-orchestrate`

**Benefits:**
- 20-40% time savings through parallelization
- Visual workflow plans with dependencies
- Predictable timelines with accurate estimates
- Quality gates built into every phase

### Learning Metrics Dashboard
Comprehensive learning analytics with health scoring:
- **System health overview** (0-100 scoring)
- **Pattern library metrics** with visual breakdowns
- **Performance metrics** with time savings calculation
- **Agent performance** breakdown with success rates
- **Actionable recommendations** based on metrics

**Try it:** `trinity learning-status --dashboard` or `/trinity-learning-status`

**Benefits:**
- Track organizational learning growth
- Measure ROI from pattern reuse
- Identify knowledge gaps
- Optimize agent performance

### Investigation Templates
5 comprehensive templates for guided investigations:
- **Bug** - Reproduction, debugging, Five Whys, testing
- **Performance** - Profiling, optimization, benchmarks
- **Security** - CVSS scoring, PoC, remediation
- **Technical** - Architecture decisions, ADRs
- **Feature** - User stories, acceptance criteria, epic breakdown

**Explore:** `/trinity-investigate-templates`

**Benefits:**
- Consistent investigation quality
- Comprehensive documentation
- Knowledge preservation
- Integration with orchestration

## Intelligent CLAUDE.md Placement

Trinity requires CLAUDE.md files for context, but intelligently adapts to your repository structure rather than forcing a rigid setup.

### Standard 3-File Setup

Trinity creates 3 CLAUDE.md files minimum:

1. **Root CLAUDE.md** (required) - Project-level context and overview
2. **Tests CLAUDE.md** (required) - Testing standards, patterns, and conventions
3. **Source CLAUDE.md** (adaptive) - Source code context and architecture

### Adaptive Source Placement

Trinity automatically detects your source directory and places CLAUDE.md appropriately:

**Common Source Directory Patterns:**
- `src/` - Most common (Node.js, TypeScript, React, Vue, Angular)
- `lib/` - Library projects (npm packages, Ruby gems)
- `app/` - Rails, Laravel, Django, some web frameworks
- `source/` - Some documentation projects, Sphinx docs
- `code/` - Legacy projects or specific naming conventions
- Root level - Small projects without dedicated source folder

**Detection Logic:**
1. Check for `src/` directory → Place CLAUDE.md in `src/`
2. If not found, check for `lib/` → Place CLAUDE.md in `lib/`
3. If not found, check for `app/` → Place CLAUDE.md in `app/`
4. If none found → Place `SOURCE.CLAUDE.md` in root directory

### Multi-Directory Repositories

For complex repositories with multiple distinct source directories, Trinity detects and creates additional CLAUDE.md files automatically:

#### Pattern 1: Frontend + Backend

**Detection Triggers:**
- Directories named: `frontend/`, `backend/`, `client/`, `server/`
- Multiple `package.json` files in separate directories
- Framework markers: React/Vue/Angular + Express/NestJS/Fastify

**Result:**
```
project/
├── CLAUDE.md                    # Root context (project overview)
├── frontend/
│   ├── CLAUDE.md                # Frontend-specific context
│   └── src/...
├── backend/
│   ├── CLAUDE.md                # Backend-specific context
│   └── src/...
└── tests/
    └── CLAUDE.md                # Testing context
```

**Frontend CLAUDE.md should include:**
- UI component architecture (component tree, state flow)
- State management patterns (Redux, Zustand, Context API)
- Routing structure and navigation
- API integration approach and data fetching
- Styling conventions (CSS-in-JS, Tailwind, modules)

**Backend CLAUDE.md should include:**
- API design and endpoint structure
- Database schema and migrations approach
- Authentication/authorization patterns
- Business logic organization
- External service integrations

#### Pattern 2: Monorepo

**Detection Triggers:**
- Presence of `packages/`, `apps/`, or `services/` directory
- Multiple `package.json` files across subdirectories
- Monorepo tool markers: `lerna.json`, `nx.json`, `turbo.json`, `pnpm-workspace.yaml`

**Result:**
```
monorepo/
├── CLAUDE.md                    # Monorepo root context
├── packages/
│   ├── api/
│   │   ├── CLAUDE.md            # API package context
│   │   └── src/...
│   ├── web/
│   │   ├── CLAUDE.md            # Web app context
│   │   └── src/...
│   └── mobile/
│       ├── CLAUDE.md            # Mobile app context
│       └── src/...
└── tests/
    └── CLAUDE.md                # Shared tests context
```

**Each package CLAUDE.md should include:**
- Package purpose and responsibilities
- Internal dependencies (other packages)
- External dependencies (npm packages)
- Package-specific conventions
- Build and test scripts

#### Pattern 3: Microservices Architecture

**Detection Triggers:**
- Multiple service directories with independent codebases
- `docker-compose.yml` file with multiple services
- Kubernetes manifests with multiple deployments
- Service directories: `*-service/`, `services/*/`

**Result:**
```
services/
├── CLAUDE.md                    # Services root context
├── auth-service/
│   ├── CLAUDE.md                # Auth microservice context
│   └── src/...
├── payment-service/
│   ├── CLAUDE.md                # Payment microservice context
│   └── src/...
└── user-service/
    ├── CLAUDE.md                # User microservice context
    └── src/...
```

**Each service CLAUDE.md should include:**
- Service boundaries and responsibilities
- Inter-service communication (gRPC, REST, message queue)
- Service-specific data stores
- Deployment configuration
- Health checks and monitoring

#### Pattern 4: Mobile + Web Application

**Detection Triggers:**
- `ios/`, `android/` directories
- React Native, Flutter, or native mobile project markers
- Paired with web application directory

**Result:**
```
app/
├── CLAUDE.md                    # Application root
├── web/
│   ├── CLAUDE.md                # Web app context
│   └── src/...
├── ios/
│   ├── CLAUDE.md                # iOS-specific context
│   └── ...
└── android/
    ├── CLAUDE.md                # Android-specific context
    └── ...
```

**Platform CLAUDE.md files should include:**
- Platform-specific conventions
- Native module integration
- Platform navigation patterns
- Build and deployment processes

#### Pattern 5: Documentation Projects

**Detection Triggers:**
- `docs/`, `documentation/`, `sphinx/` directories
- Documentation framework files: `conf.py`, `mkdocs.yml`, `_config.yml`

**Result:**
```
project/
├── CLAUDE.md                    # Project root
├── docs/
│   ├── CLAUDE.md                # Documentation context
│   └── ...
└── src/
    ├── CLAUDE.md                # Source context
    └── ...
```

### Detection Rules Summary

Trinity creates additional CLAUDE.md files when it detects:

**1. Frontend + Backend Split:**
- **Triggers:** `frontend/`, `backend/`, `client/`, `server/` directories
- **Files:** Multiple `package.json` in subdirectories
- **Frameworks:** React/Vue/Angular + Express/NestJS markers
- **Result:** 2 additional CLAUDE.md files (frontend + backend)

**2. Monorepo Structure:**
- **Triggers:** `packages/`, `apps/`, `services/` directories
- **Files:** Multiple `package.json` files
- **Config:** `lerna.json`, `nx.json`, `turbo.json`, `pnpm-workspace.yaml`
- **Result:** 1 CLAUDE.md per package/app

**3. Microservices Architecture:**
- **Triggers:** Multiple `*-service/` or `services/*/` directories
- **Files:** `docker-compose.yml` with multiple services
- **Config:** Kubernetes manifests for multiple deployments
- **Result:** 1 CLAUDE.md per service

**4. Mobile + Web Application:**
- **Triggers:** `ios/`, `android/` directories + web directory
- **Files:** `package.json`, `build.gradle`, `Podfile`
- **Frameworks:** React Native, Flutter markers
- **Result:** 1 CLAUDE.md per platform (3 total: web, ios, android)

**5. Documentation Projects:**
- **Triggers:** `docs/`, `documentation/`, `sphinx/` directories
- **Files:** `conf.py`, `mkdocs.yml`, `_config.yml`
- **Result:** 1 CLAUDE.md in docs directory

### Configuration Override

You can manually specify CLAUDE.md locations in `trinity/config.json`:

```json
{
  "claudeFiles": {
    "auto": true,
    "locations": [
      "CLAUDE.md",
      "src/CLAUDE.md",
      "tests/CLAUDE.md",
      "frontend/CLAUDE.md",
      "backend/CLAUDE.md",
      "docs/CLAUDE.md"
    ],
    "detection": {
      "enableFrontendBackend": true,
      "enableMonorepo": true,
      "enableMicroservices": true,
      "enableMobile": true,
      "customPatterns": [
        "custom-dir/CLAUDE.md"
      ]
    }
  }
}
```

**Configuration Options:**
- `auto`: Enable/disable automatic detection (default: `true`)
- `locations`: Explicit CLAUDE.md locations (overrides detection when `auto: false`)
- `detection.enable*`: Toggle specific detection patterns
- `customPatterns`: Additional directories to include

**When to use manual configuration:**
- Non-standard repository structure
- Custom directory naming that doesn't match patterns
- Specific CLAUDE.md placement requirements
- Disabling automatic detection for control

### Verification

After `trinity init`, verify CLAUDE.md placement:

```bash
trinity verify
```

**Verification shows:**
- **Detected Structure:** Repository type (standard, frontend+backend, monorepo, etc.)
- **CLAUDE.md Locations:** All detected CLAUDE.md files
- **Coverage Analysis:** Percentage of codebase covered by nearest CLAUDE.md
- **Suggestions:** Recommendations for additional CLAUDE.md files
- **Validation:** Confirms all required CLAUDE.md files present

**Example output:**
```
✅ Trinity Verification Report

Repository Structure: Frontend + Backend
CLAUDE.md Files: 4 detected
  ✓ CLAUDE.md (root)
  ✓ frontend/CLAUDE.md
  ✓ backend/CLAUDE.md
  ✓ tests/CLAUDE.md

Coverage Analysis:
  Frontend: 98% (242/247 files within 2 directory levels)
  Backend: 100% (189/189 files within 2 directory levels)
  Tests: 100% (67/67 files within 2 directory levels)
  Overall: 99% (498/503 files)

Suggestions:
  • Consider adding CLAUDE.md to docs/ directory (15 files, 2% uncovered)

✨ Verification complete!
```

### Why Adaptive Placement Matters

**Context Density:**
- **Without adaptive placement:** Single massive root CLAUDE.md (1000+ lines, hard to maintain)
- **With adaptive placement:** Distributed context across directories (100-200 lines each, focused and relevant)
- **Agent efficiency:** Agents read nearest CLAUDE.md first for focused context

**Maintainability:**
- Team members update only relevant CLAUDE.md files
- Reduces context drift and outdated information
- Clear ownership per directory/subsystem

**Scalability:**
- Monorepos can have 50+ packages
- One CLAUDE.md per package = manageable
- Single root CLAUDE.md = unmaintainable at scale

**Example:** Frontend changes don't need backend context. Adaptive placement ensures agents get only relevant context.

## Initialization Process
1. **TAN (Structure Specialist)** - Verify Trinity structure:
   - Check that all folders exist (they should from deploy)
   - Verify folder permissions
   - Report any structural issues (don't create folders - they already exist)

2. **ZEN (Knowledge Base Specialist)** - Populate Trinity documentation:
   - Analyze existing codebase
   - POPULATE trinity/knowledge-base/ARCHITECTURE.md with detailed architecture analysis
   - POPULATE trinity/knowledge-base/ISSUES.md with discovered issues
   - POPULATE trinity/knowledge-base/To-do.md with identified tasks
   - POPULATE trinity/knowledge-base/Technical-Debt.md with technical debt assessment
   - Update existing Trinity.md if needed

3. **INO (Context Specialist)** - Establish context hierarchy:
   - Analyze codebase context and complexity
   - UPDATE existing CLAUDE.md files with project-specific instructions
   - POPULATE trinity/knowledge-base/ISSUES.md database structure
   - Verify CLAUDE.md hierarchy is complete

4. **JUNO (Quality Auditor)** - Perform comprehensive audit:
   - Verify all folders exist and are writable
   - Verify all documentation files are populated (not empty)
   - Validate CLAUDE.md hierarchy completeness
   - Check that knowledge base documents have real content
   - Generate audit report in trinity/reports/
   - Report findings to user with compliance score

**Outcome:** Trinity Method fully integrated and audited, ready for first workflow with v2.0 features activated.

**Note:** This command should be run once after initial deployment. The deployment created the structure; this command populates it with project-specific content.

## Post-Init Next Steps

After Trinity initialization, explore new v2.0 features:

### 1. Check System Health
```bash
trinity crisis --health
```
or `/trinity-crisis`

Quick system health check using crisis detection. Establishes baseline health metrics.

### 2. Plan Your First Workflow
```bash
trinity orchestrate
```
or `/trinity-orchestrate`

Generate visual workflow plan for your first task. See time estimates and parallelization opportunities.

### 3. View Learning Metrics
```bash
trinity learning-status --dashboard
```
or `/trinity-learning-status`

See comprehensive learning system analytics. Track pattern library growth and time savings.

### 4. Explore Investigation Templates
```
/trinity-investigate-templates
```

Learn about 5 investigation template types. Choose the right template for your first investigation.

### 5. Verify CLAUDE.md Placement
```bash
trinity verify
```

Confirm adaptive CLAUDE.md placement and coverage analysis. Ensure all critical directories have context.

### 6. Create Your First Investigation
```bash
trinity create-investigation
```
or `/trinity-create-investigation`

Use investigation wizard to create structured investigation from template.

### 7. Run Your First Workflow
After planning with orchestrate, execute workflow with AJ MAESTRO coordination:
- User approval at stop points
- BAS quality gates automatic
- Progress tracking throughout
- Pattern learning on completion

## Related Commands

- `/trinity-crisis` - Crisis management system guide
- `/trinity-orchestrate` - Workflow orchestration guide
- `/trinity-learning-status` - Learning system dashboard
- `/trinity-investigate-templates` - Investigation template guide
- `/trinity-verify` - Verification command documentation
- `/trinity-knowledge-preservation` - Learn about learning system philosophy

## What's Next?

Trinity is now fully integrated with v2.0 features. Your next steps:

1. **Verify Setup:** Run `trinity verify` to confirm CLAUDE.md coverage
2. **Health Baseline:** Run `trinity crisis --health` to establish baseline
3. **First Investigation:** Create investigation from template
4. **First Workflow:** Use `trinity orchestrate` to plan and execute
5. **Monitor Learning:** Check `trinity learning-status --dashboard` regularly

Trinity will learn and improve with every investigation you complete. The more you use it, the more valuable it becomes.
