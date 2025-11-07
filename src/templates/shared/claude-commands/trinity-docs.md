---
description: Quick access to Trinity Method documentation
---

# Trinity Documentation

**Purpose:** Comprehensive guide to all Trinity Method documentation, organized by category.

## Core Documentation

### Trinity Method Overview
**File:** `trinity/knowledge-base/Trinity.md`

Overview of Trinity Method philosophy, investigation-first development, and quality-as-infrastructure principles.

### Knowledge Preservation
**File:** `docs/knowledge-preservation.md` (521 lines)

Complete knowledge preservation philosophy and architecture:
- Why knowledge preservation matters (cost vs. value)
- 3-layer learning system (Pattern Recognition → Matching → Reinforcement)
- Pattern recognition with confidence scoring
- Real-world examples and ROI calculations (JWT bug: 14h → 5.5h, 61% savings)
- Best practices for developers, teams, and organizations

**See also:** `/trinity-knowledge-preservation` for guided overview

### Quality Standards
**File:** `docs/quality-standards.md` (890 lines)

Comprehensive quality standards and enforcement:
- 6 quality standards with examples (Functions, Complexity, Error Handling, Testing, Documentation, Architecture)
- BAS 6-phase quality gate (Lint → Structure → Build → Test → Coverage → Review)
- Good vs. bad code examples for each standard
- Enforcement strategies (pre-commit hooks, CI/CD integration)
- Quality metrics and compliance scoring

### Project Architecture
**File:** `trinity/knowledge-base/ARCHITECTURE.md`

Project architecture analysis including:
- System architecture overview
- Component structure
- Technology stack
- Design patterns used
- Integration points

### Known Issues
**File:** `trinity/knowledge-base/ISSUES.md`

Database of known issues, bugs, and limitations:
- Active issues with severity
- Workarounds and mitigation strategies
- Issue resolution tracking
- Related investigations

### Task Tracking
**File:** `trinity/knowledge-base/To-do.md`

Current tasks and priorities:
- High-priority tasks
- Backlog items
- Future enhancements
- Investigation queue

### Technical Debt
**File:** `trinity/knowledge-base/Technical-Debt.md`

Technical debt assessment and tracking:
- Identified technical debt
- Debt prioritization
- Remediation plans
- Debt metrics and trends

## Project Overview

### README
**File:** `README.md`

Restructured with philosophy-first approach:
- Why Trinity Method exists
- Investigation-first development methodology
- Knowledge preservation value proposition
- Quality as infrastructure approach
- Getting started guide

## Investigation Templates

Location: `src/templates/investigations/`

### Bug Investigation Template
**File:** `bug.md.template`

For reproducing, debugging, and fixing defects:
- Issue description and reproduction steps
- Root cause analysis (Five Whys)
- Debugging strategy
- Solution implementation
- Testing strategy and lessons learned

### Performance Investigation Template
**File:** `performance.md.template`

For diagnosing and optimizing performance issues:
- Performance problem statement
- Profiling strategy (browser, backend, database, APM)
- Bottleneck analysis
- Optimization strategy
- Benchmarks (before/after)
- Performance budgets

### Security Investigation Template
**File:** `security.md.template`

For assessing and remediating security vulnerabilities:
- Vulnerability overview
- CVSS v3.1 scoring
- Proof of concept (PoC)
- Impact assessment
- Remediation plan
- Validation and disclosure timeline

### Technical Investigation Template
**File:** `technical.md.template`

For architecture decisions and design choices:
- Context and problem statement
- Requirements analysis (functional + non-functional)
- Architecture options evaluation
- Decision matrix with weighted criteria
- ADR (Architecture Decision Record)
- Implementation plan (4-phase approach)

### Feature Investigation Template
**File:** `feature.md.template`

For planning and implementing new functionality:
- Feature overview
- User stories with acceptance criteria
- Design mockups and user flows
- Technical design
- Implementation breakdown (4 phases)
- Feature flags and rollout strategy
- Success metrics

**See also:** `/trinity-investigate-templates` for template guide

## Migration & Changes

### Migration Changes
**File:** `MIGRATION-CHANGES.md` (1,200+ lines)

Complete audit of v2.0 migration implementation:
- All changes between testing and migration-implementations branches
- 58 files changed, 11,781+ insertions
- New systems documented (Crisis Management, Workflow Orchestration, Dashboard)
- 19 new files with purpose and line counts
- 38 modified files with before/after comparisons
- Breaking changes analysis (none - all backward compatible)
- Migration checklist (pre-merge, merge, post-merge)
- Risk assessment and rollback plan

### Slash Command Recommendations
**File:** `SLASH-COMMAND-RECOMMENDATIONS.md` (800+ lines)

Recommendations for slash command updates based on v2.0 features:
- 3 new slash commands to create
- 8 existing slash commands to update
- Complete template drafts provided
- Implementation phases with effort estimates

## Agent Documentation

### Employee Directory
**File:** `.claude/EMPLOYEE-DIRECTORY.md`

Complete directory of all 11 Trinity agents:
- Agent roles and responsibilities
- When to use each agent
- Agent coordination in workflows
- Contact information (metaphorically)

### Agent TSDoc
**Location:** `src/agents/SelfImprovingAgent.ts`

Enhanced TSDoc documentation for all agents:
- Trinity Principle explanations
- "Why This Exists" sections
- Practical usage examples
- Cross-references to related components

## v2.0 Features Documentation

### Crisis Management
**Files:**
- `src/cli/commands/crisis.ts` - CLI implementation
- `src/cli/commands/crisis/detector.ts` - Detection logic
- `src/cli/commands/crisis/recovery.ts` - Recovery protocols
- `src/cli/commands/crisis/validator.ts` - Validation
- `src/cli/commands/crisis/documenter.ts` - Documentation

**Slash Command:** `/trinity-crisis`

### Workflow Orchestration
**Files:**
- `src/cli/commands/orchestrate.ts` - CLI implementation (250 lines)
- `src/coordination/AJMaestro.ts` - Workflow plan generator (778 lines)
- `src/coordination/WorkflowVisualizer.ts` - Tree visualization (469 lines)
- `src/coordination/types.ts` - Type definitions

**Slash Command:** `/trinity-orchestrate`

### Learning Metrics Dashboard
**Files:**
- `src/cli/commands/learning-status.ts` - CLI implementation
- `src/learning/LearningMetricsDashboard.ts` - Dashboard logic (559 lines)
- `src/learning/LearningDataStore.ts` - Layer 1: Storage
- `src/learning/StrategySelectionEngine.ts` - Layer 2: Matching
- `src/learning/PerformanceTracker.ts` - Layer 3: Reinforcement

**Slash Command:** `/trinity-learning-status`

## Quick Links

**Core Documentation:**
- [Trinity.md](trinity/knowledge-base/Trinity.md)
- [Knowledge Preservation](docs/knowledge-preservation.md)
- [Quality Standards](docs/quality-standards.md)
- [ARCHITECTURE.md](trinity/knowledge-base/ARCHITECTURE.md)
- [README.md](README.md)

**Investigation Templates:**
- [Bug Template](src/templates/investigations/bug.md.template)
- [Performance Template](src/templates/investigations/performance.md.template)
- [Security Template](src/templates/investigations/security.md.template)
- [Technical Template](src/templates/investigations/technical.md.template)
- [Feature Template](src/templates/investigations/feature.md.template)

**Migration:**
- [Migration Changes](MIGRATION-CHANGES.md)
- [Slash Command Recommendations](SLASH-COMMAND-RECOMMENDATIONS.md)

**Employee Directory:**
- [Agent Directory](.claude/EMPLOYEE-DIRECTORY.md)

## Related Slash Commands

- `/trinity-knowledge-preservation` - Knowledge preservation guide
- `/trinity-investigate-templates` - Investigation template guide
- `/trinity-crisis` - Crisis management system
- `/trinity-orchestrate` - Workflow orchestration
- `/trinity-learning-status` - Learning metrics dashboard

## What would you like to explore?

Choose a category:
1. **Core Documentation** - Philosophy, quality standards, architecture
2. **Investigation Templates** - Template guides for structured investigations
3. **v2.0 Features** - Crisis management, orchestration, learning dashboard
4. **Migration** - Changes and recommendations from v2.0 migration
5. **Agents** - Agent directory and documentation

Trinity documentation is comprehensive and continuously updated. Use slash commands for guided access to specific topics.