# Slash Command Recommendations - Migration v2.0

**Date:** 2025-01-06
**Branch:** migration-implementations
**Purpose:** Recommended slash command updates based on new features

---

## Executive Summary

After auditing the migration-implementations branch, I've identified **3 new slash commands to create** and **8 existing slash commands to update** to reflect the new v2.0 features:

- **Crisis Management System** (new)
- **Workflow Orchestration** (update existing)
- **Learning Metrics Dashboard** (update existing)
- **Investigation Templates** (new)
- **Knowledge Preservation** (new)

---

## Table of Contents

- [New Slash Commands (3)](#new-slash-commands)
- [Slash Commands to Update (8)](#slash-commands-to-update)
- [Slash Commands Unchanged (14)](#slash-commands-unchanged)
- [Implementation Priority](#implementation-priority)
- [Template Drafts](#template-drafts)

---

## New Slash Commands

### 1. `/trinity-crisis` - Crisis Management

**Priority:** 🔴 HIGH (Brand new system, 2,814 lines of code)

**Why Create:**
- Complete new crisis management system with 6 files
- `trinity crisis` CLI command with 7 modes
- Auto-detection, recovery, validation, documentation workflow
- No existing slash command covers this functionality

**Functionality:**
```
/trinity-crisis
```
Should:
1. Explain crisis management system (5 crisis types)
2. Run `trinity crisis` command (auto-detect mode)
3. Guide user through interactive recovery
4. Document results to trinity/archive/crisis/
5. Extract learned patterns for learning system

**Template Structure:**
- **Overview:** Crisis management philosophy
- **Crisis Types:** Build Failure, Test Failure, Error Pattern, Performance Degradation, Security Vulnerability
- **Workflow:** Detection → Investigation → Diagnostics → Recovery → Validation → Documentation
- **Usage Modes:**
  - Auto-detect (default)
  - Specify type: `--type build_failure`
  - Health check: `--health`
  - Search archive: `--search "jwt"`
  - View stats: `--stats`

**Related Files:**
- src/cli/commands/crisis.ts
- src/cli/commands/crisis/detector.ts
- src/cli/commands/crisis/recovery.ts
- src/cli/commands/crisis/validator.ts
- src/cli/commands/crisis/documenter.ts

---

### 2. `/trinity-investigate-templates` - Investigation Template Guide

**Priority:** 🟡 MEDIUM (5 new templates, 2,452 lines)

**Why Create:**
- 5 comprehensive investigation templates added
- Guided investigation process with Trinity Method best practices
- Bug, Performance, Security, Technical, Feature investigations
- No existing command covers template usage

**Functionality:**
```
/trinity-investigate-templates [type]
```
Should:
1. List available investigation types
2. If type specified, create investigation from template
3. Guide user through template sections
4. Explain template structure and best practices

**Template Types:**
- **bug** - Reproduction, debugging, Five Whys, testing strategy
- **performance** - Profiling, optimization, benchmarks, budgets
- **security** - CVSS scoring, PoC, remediation, disclosure
- **technical** - Architecture, design decisions, ADRs
- **feature** - User stories, acceptance criteria, feature flags

**Template Structure:**
- **Overview:** Investigation template philosophy
- **Template Types:** Brief description of each
- **Usage:** How to create investigation from template
- **Best Practices:** Template completion tips
- **Examples:** Sample investigations using templates

**Related Files:**
- src/templates/investigations/bug.md.template
- src/templates/investigations/performance.md.template
- src/templates/investigations/security.md.template
- src/templates/investigations/technical.md.template
- src/templates/investigations/feature.md.template

---

### 3. `/trinity-knowledge-preservation` - Knowledge Preservation Guide

**Priority:** 🟢 LOW (Documentation-focused, reference material)

**Why Create:**
- Major new documentation (521 lines)
- 3-layer learning architecture explanation
- Pattern recognition and confidence scoring
- Real-world examples and ROI calculations
- Educational/reference command

**Functionality:**
```
/trinity-knowledge-preservation
```
Should:
1. Explain knowledge preservation philosophy
2. Describe 3-layer architecture (Storage → Matching → Reinforcement)
3. Show pattern lifecycle examples
4. Explain confidence scoring algorithm
5. Provide best practices for pattern quality
6. Link to full documentation

**Template Structure:**
- **Philosophy:** "Every investigation teaches"
- **3-Layer Architecture:**
  - Layer 1: Pattern Recognition (Automatic)
  - Layer 2: Pattern Matching (Investigation-Time)
  - Layer 3: Reinforcement Learning (Continuous)
- **Pattern Lifecycle:** Discovery → Validation → Established → Authoritative → Deprecated
- **Real-World Impact:** JWT example (14h → 5.5h, 61% savings)
- **Confidence Scoring:** Formula explanation with example
- **Best Practices:** For developers, teams, organizations

**Related Files:**
- docs/knowledge-preservation.md
- src/learning/LearningDataStore.ts
- src/learning/StrategySelectionEngine.ts
- src/learning/PerformanceTracker.ts
- src/learning/KnowledgeSharingBus.ts

---

## Slash Commands to Update

### 1. `/trinity-orchestrate` - Update for Workflow Visualization

**Priority:** 🔴 HIGH (New CLI command, major feature)

**Current State:**
- Describes v1.0 agent orchestration
- Focuses on 11-agent team coordination
- Scale-based workflows (Small/Medium/Large)

**What's New:**
- New `trinity orchestrate` CLI command (250 lines)
- AJ MAESTRO workflow plan generator (778 lines)
- Workflow visualizer with tree structure (469 lines)
- Interactive prompts for investigation requirements
- Visual workflow plans with color coding
- User approval before execution

**Recommended Changes:**
1. **Add Section:** "Workflow Visualization"
   - Explain new `trinity orchestrate` CLI command
   - Show workflow plan generation
   - Display tree visualization with color coding

2. **Add Section:** "Interactive Mode"
   - Gather investigation requirements (title, type, scale, complexity)
   - Generate and display workflow plan
   - Prompt for approval

3. **Add Examples:**
   ```
   # Interactive workflow generation
   trinity orchestrate

   # Specify details upfront
   trinity orchestrate \
     --title "Implement user auth" \
     --type feature \
     --scale MEDIUM \
     --complexity 6

   # Generate and execute
   trinity orchestrate --execute
   ```

4. **Update Scale Descriptions:**
   - SMALL: 2 phases, 0 stop points, 1-4h
   - MEDIUM: 4 phases, 2 stop points, 4-8h
   - LARGE: 6 phases, 4 stop points, >8h
   - Include parallelization and time savings info

5. **Keep Existing:** Agent team descriptions still relevant

**Related Files:**
- src/cli/commands/orchestrate.ts
- src/coordination/AJMaestro.ts
- src/coordination/WorkflowVisualizer.ts
- src/coordination/types.ts

---

### 2. `/trinity-learning-status` - Update for Dashboard

**Priority:** 🔴 HIGH (New dashboard feature, 559 lines)

**Current State:**
- Shows basic learning system status
- Pattern counts and configuration

**What's New:**
- New `--dashboard` flag for comprehensive metrics
- LearningMetricsDashboard with 5 sections
- System health scoring (0-100)
- Visual bars and color coding
- Time savings calculations
- Recommendations engine

**Recommended Changes:**
1. **Add Section:** "Metrics Dashboard"
   - Explain `--dashboard` flag
   - Show dashboard sections:
     - System Health Overview
     - Pattern Library Metrics
     - Performance Metrics
     - Agent Performance Breakdown
     - Recommendations

2. **Add Examples:**
   ```
   # Simple status (default)
   trinity learning-status

   # Comprehensive dashboard (NEW)
   trinity learning-status --dashboard

   # Detailed patterns
   trinity learning-status --verbose

   # Dashboard with details
   trinity learning-status --dashboard --verbose
   ```

3. **Add Metrics Explanation:**
   - Pattern discovery rate (patterns per investigation)
   - Match success rate (percentage)
   - High confidence patterns (≥0.8)
   - Time savings calculation (15% faster with patterns)
   - Health scoring algorithm

4. **Keep Existing:** Basic status information still relevant

**Related Files:**
- src/cli/commands/learning-status.ts
- src/learning/LearningMetricsDashboard.ts

---

### 3. `/trinity-plan` - Update for Workflow Planning

**Priority:** 🟡 MEDIUM (Relates to orchestrate update)

**Current State:**
- Describes TRA (Work Planner) agent
- 3-phase implementation plan structure

**What's New:**
- AJ MAESTRO now generates complete workflow plans
- Scale-based phase generation
- Dependency analysis and parallelization
- Time estimates with optimization

**Recommended Changes:**
1. **Add Reference:** Link to `/trinity-orchestrate` for workflow visualization
2. **Add Section:** "Automated Plan Generation"
   - Explain how AJ MAESTRO generates plans
   - Show scale-based phase structures
   - Mention parallelization opportunities
3. **Add Note:** "For visual workflow planning, use `/trinity-orchestrate`"

**Related Files:**
- src/coordination/AJMaestro.ts
- src/coordination/types.ts

---

### 4. `/trinity-requirements` - Update for MON Agent

**Priority:** 🟢 LOW (TSDoc updates only)

**Current State:**
- Describes MON (Requirements Analyst) agent

**What's New:**
- Enhanced TSDoc with Trinity Principle
- Cross-references to documentation
- Practical examples

**Recommended Changes:**
1. **Minor Update:** Add mention of enhanced documentation
2. **Add Reference:** Link to quality-standards.md for requirements quality
3. **Optional:** Add example of MON usage in LARGE scale workflow

**Related Files:**
- src/agents/SelfImprovingAgent.ts (MON inherits from this)

---

### 5. `/trinity-design` - Update for ROR Agent

**Priority:** 🟢 LOW (TSDoc updates only)

**Current State:**
- Describes ROR (Design Architect) agent

**What's New:**
- Enhanced TSDoc with Trinity Principle
- Cross-references to documentation

**Recommended Changes:**
1. **Minor Update:** Add mention of enhanced documentation
2. **Add Reference:** Link to technical investigation template
3. **Optional:** Add example of ROR usage in workflow

**Related Files:**
- src/agents/SelfImprovingAgent.ts (ROR inherits from this)

---

### 6. `/trinity-decompose` - Update for EUS Agent

**Priority:** 🟢 LOW (TSDoc updates only)

**Current State:**
- Describes EUS (Task Decomposer) agent

**What's New:**
- Enhanced TSDoc with Trinity Principle

**Recommended Changes:**
1. **Minor Update:** Add mention of enhanced documentation
2. **Add Reference:** Link to workflow task decomposition

**Related Files:**
- src/agents/SelfImprovingAgent.ts (EUS inherits from this)

---

### 7. `/trinity-init` - Update for Complete Setup

**Priority:** 🟡 MEDIUM (New features to mention)

**Current State:**
- Describes complete Trinity integration
- TAN, ZEN, INO, JUNO deployment

**What's New:**
- Crisis management system
- Workflow orchestration
- Learning dashboard
- Investigation templates

**Recommended Changes:**
1. **Add Section:** "New v2.0 Features"
   - Crisis management: `trinity crisis`
   - Workflow orchestration: `trinity orchestrate`
   - Learning dashboard: `trinity learning-status --dashboard`
   - Investigation templates

2. **Update Post-Init Steps:**
   - Suggest trying `/trinity-crisis --health`
   - Suggest trying `/trinity-orchestrate` for first workflow
   - Suggest viewing `/trinity-learning-status --dashboard`

**Related Files:**
- (No direct files, but references all new systems)

---

### 8. `/trinity-docs` - Update Documentation Index

**Priority:** 🟢 LOW (Documentation reference)

**Current State:**
- Quick access to Trinity documentation

**What's New:**
- knowledge-preservation.md (521 lines)
- quality-standards.md (890 lines)
- README restructured

**Recommended Changes:**
1. **Add New Docs:**
   - Knowledge Preservation: docs/knowledge-preservation.md
   - Quality Standards: docs/quality-standards.md

2. **Update README Reference:**
   - Note restructured with philosophy-first approach

**Related Files:**
- docs/knowledge-preservation.md
- docs/quality-standards.md
- README.md

---

## Slash Commands Unchanged

The following 14 existing slash commands **do not need updates** as they are not affected by migration changes:

1. `/trinity-agents` - Agent directory (no changes to agent roles)
2. `/trinity-analytics` - Analytics dashboard (no changes)
3. `/trinity-benchmark` - Performance benchmarks (no changes)
4. `/trinity-cache-clear` - Cache clearing (no changes)
5. `/trinity-cache-stats` - Cache statistics (no changes)
6. `/trinity-cache-warm` - Cache warming (no changes)
7. `/trinity-config` - Configuration management (no changes)
8. `/trinity-continue` - Resume work (no changes)
9. `/trinity-create-investigation` - Investigation creation (complementary to templates)
10. `/trinity-end` - End session (no changes)
11. `/trinity-history` - Session history (no changes)
12. `/trinity-hooks` - Hook management (no changes)
13. `/trinity-learning-export` - Learning export (no changes)
14. `/trinity-plan-investigation` - Investigation planning (complementary to templates)
15. `/trinity-start` - Getting started (could mention new features, optional)
16. `/trinity-verify` - Verification (no changes)
17. `/trinity-workorder` - Work order creation (no changes)

---

## Implementation Priority

### Phase 1: Critical Updates (Do First) 🔴

**New Commands:**
1. `/trinity-crisis` - Brand new system, high value

**Updates:**
1. `/trinity-orchestrate` - Major functionality change
2. `/trinity-learning-status` - New dashboard feature

**Estimated Effort:** 4-6 hours
**Impact:** High - Core new features

---

### Phase 2: Supporting Updates (Do Second) 🟡

**New Commands:**
1. `/trinity-investigate-templates` - Complement investigation workflow

**Updates:**
1. `/trinity-plan` - Links to orchestrate
2. `/trinity-init` - Reference new features

**Estimated Effort:** 2-3 hours
**Impact:** Medium - Improved user experience

---

### Phase 3: Nice-to-Have (Do Later) 🟢

**New Commands:**
1. `/trinity-knowledge-preservation` - Educational/reference

**Updates:**
1. `/trinity-requirements` - Minor updates
2. `/trinity-design` - Minor updates
3. `/trinity-decompose` - Minor updates
4. `/trinity-docs` - Documentation index

**Estimated Effort:** 2-3 hours
**Impact:** Low - Documentation improvements

---

## Template Drafts

### Draft 1: `/trinity-crisis`

```markdown
---
description: Detect and recover from system crises using Trinity Method protocols
---

# Trinity Crisis Management

**Purpose:** Automatically detect and recover from system crises with guided protocols.

## Overview

Trinity's crisis management system provides systematic detection and recovery for 5 crisis types:

1. **Build Failure** - Compilation errors, dependency issues
2. **Test Failure** - Failing tests, coverage drops
3. **Error Pattern** - Repeated errors in logs, systematic failures
4. **Performance Degradation** - Slowdowns, memory leaks, bottlenecks
5. **Security Vulnerability** - CVEs, exposed secrets, vulnerabilities

## Crisis Management Workflow

### 1. Detection
Automatically scans your system for crisis indicators:
- Build status and compilation errors
- Test results and coverage metrics
- Error logs and patterns
- Performance metrics
- Security scans

### 2. Investigation
Guided prompts to gather evidence:
- What triggered the crisis?
- What changed recently?
- What's the blast radius?
- Who's affected?

### 3. Diagnostics
Runs diagnostic commands with your approval:
- npm run build / test
- git diff / git log
- Performance profiling
- Security scans

### 4. Recovery
Executes recovery steps interactively:
- Step-by-step recovery protocol
- User approval at each step
- Rollback plan if needed
- Progress tracking

### 5. Validation
Verifies crisis resolution:
- Re-runs detection
- Validates success criteria (≥80% must pass)
- Checks for new crises
- Confirms resolution

### 6. Documentation
Archives crisis for learning:
- Generates markdown + JSON report
- Saves to trinity/archive/crisis/
- Extracts learned patterns
- Updates learning system

## Usage

### Auto-Detect Mode (Default)
Let Trinity detect the crisis automatically:

```bash
trinity crisis
```

### Specify Crisis Type
If you know the crisis type:

```bash
trinity crisis --type build_failure
trinity crisis --type test_failure
trinity crisis --type error_pattern
trinity crisis --type performance_degradation
trinity crisis --type security_vulnerability
```

### Quick Health Check
Fast system health scan:

```bash
trinity crisis --health
```

### Search Crisis Archive
Find similar past crises:

```bash
trinity crisis --search "jwt token"
trinity crisis --search "memory leak"
```

### View Statistics
See crisis history and patterns:

```bash
trinity crisis --stats
```

## Crisis Protocols

Each crisis type has a complete protocol with:
- **Detection Steps:** How to identify the crisis
- **Investigation Prompts:** Questions to ask
- **Diagnostic Commands:** Commands to run
- **Recovery Steps:** How to fix it
- **Validation Criteria:** How to verify success
- **Rollback Plan:** What to do if recovery fails
- **Common Causes:** Why this happens
- **Prevention Strategies:** How to avoid it

## Example: Build Failure Crisis

```
$ trinity crisis --type build_failure

🔍 Crisis Detection: BUILD_FAILURE detected (confidence: 0.95)

Evidence:
- npm run build exited with code 1
- TypeScript compilation error in src/auth.ts:42
- Missing type definition for 'jsonwebtoken'

Investigation Questions:
1. What changed in the last commit?
2. Were any dependencies updated?
3. Is this a new file or existing file?

Running diagnostics...
✓ git log -1 --stat
✓ git diff HEAD~1
✓ npm ls jsonwebtoken

Recovery Steps:
1. Install missing type definitions: npm install --save-dev @types/jsonwebtoken
2. Fix type error in src/auth.ts:42
3. Re-run build: npm run build

Execute step 1? (yes/no): yes
...

✅ Crisis resolved! Build now passing.

Report archived: trinity/archive/crisis/2025-01-06/crisis-abc123.md
Learned pattern: "Missing @types/ packages after dependency updates"
```

## Learning Integration

Crisis recovery automatically:
- Extracts patterns from successful recoveries
- Updates learning system confidence scores
- Helps future crisis detection
- Builds organizational knowledge

**Time Savings:** Teams report 60-70% faster crisis recovery with Trinity protocols.

## What would you like to do?

Choose an option:
1. Auto-detect crisis
2. Specify crisis type
3. Run health check
4. Search crisis archive
5. View statistics
```

---

### Draft 2: `/trinity-orchestrate` (Updated)

```markdown
---
description: Orchestrate implementation using AJ MAESTRO with workflow visualization
---

# Trinity Orchestration - AJ MAESTRO

**Purpose:** Orchestrate complex implementations with visual workflow planning and the 11-agent team.

## Overview

AJ MAESTRO provides two powerful orchestration modes:

1. **Workflow Visualization** (NEW) - Interactive workflow planning with visual tree display
2. **Agent Orchestration** - Coordinate 11-agent team for implementation

## Workflow Visualization (NEW)

Generate and visualize investigation workflows before execution:

```bash
# Interactive workflow generation
trinity orchestrate

# Or specify details upfront
trinity orchestrate \
  --title "Implement user authentication" \
  --type feature \
  --scale MEDIUM \
  --complexity 6 \
  --files "src/auth/,src/middleware/"
```

### Interactive Prompts

AJ MAESTRO asks:
1. **Investigation title:** What are you building?
2. **Investigation type:** bug, feature, performance, security, technical
3. **Scale:** SMALL, MEDIUM, or LARGE
4. **Complexity:** 1-10 (where 10 is most complex)
5. **Files affected:** Which parts of codebase?

### Workflow Plan Output

Visual tree structure with:

```
🎼 WORKFLOW PLAN: Implement user authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Overview
  Scale:           MEDIUM
  Total Time:      7.5h estimated
  Optimized:       6.0h (20% savings through parallelization)
  Tasks:           8 tasks
  Stop Points:     2 stop points for approval
  Agents:          MON, ROR, TRA, EUS, KIL, BAS, DRA, APO

📋 Phases

  Phase 1: Requirements Analysis
  ├── Task 1 (MON): Analyze functional requirements [1.0h]
  └── Task 2 (MON): Analyze non-functional requirements [1.0h] (parallel)

  Phase 2: Technical Design (STOP POINT 1)
  ├── Task 3 (ROR): Create technical design [2.0h]
  └── Task 4 (ROR): Document architecture decisions [1.0h]

  Phase 3: Implementation
  ├── Task 5 (EUS): Decompose into atomic tasks [0.5h]
  └── Task 6 (KIL): Implement feature functionality [4.8h] → BAS 6-phase gates

  Phase 4: Code Review (STOP POINT 2)
  ├── Task 7 (DRA): Review implementation against design [1.5h]
  └── Task 8 (APO): Document API and comments [1.0h] (parallel)

⚠️  Execute this workflow? (yes/no):
```

### Scale-Based Workflows

#### Small Scale (0 stop points, 1-4h)
- **Use Case:** Simple bug fixes, small features (1-2 files)
- **Phases:** Investigation → Implementation
- **Agents:** MON, TRA, KIL, BAS
- **Workflow:**
  1. Quick analysis and planning
  2. Direct implementation with BAS quality gates

#### Medium Scale (2 stop points, 4-8h)
- **Use Case:** Features, refactoring (3-5 files)
- **Phases:** Requirements → Design → Implementation → Review
- **Agents:** MON, ROR, TRA, EUS, KIL, BAS, DRA, APO
- **Stop Points:**
  - Stop 1: Design approval (after Phase 2)
  - Stop 2: Final review (after Phase 4)

#### Large Scale (4 stop points, >8h)
- **Use Case:** Major features, architecture changes (6+ files)
- **Phases:** Requirements → Design → Planning → Implementation → Testing → Review
- **Agents:** All 11 agents
- **Stop Points:**
  - Stop 1: Requirements approval (after Phase 1)
  - Stop 2: Design approval (after Phase 2)
  - Stop 3: Plan approval (after Phase 3)
  - Stop 4: Final review with JUNO audit (after Phase 6)

### Time Optimization

AJ MAESTRO calculates:
- **Parallelization opportunities:** Tasks that can run simultaneously
- **Dependency analysis:** Task execution order
- **Time savings:** Optimized duration vs. sequential execution
- **Agent utilization:** Efficient agent coordination

Example: 8 tasks totaling 10h can complete in 6h (40% savings) through parallelization.

## Agent Orchestration

The 11-agent team coordinates execution:

### Planning Layer
- **MON** - Requirements analysis and user story validation
- **ROR** - Technical design, architecture decisions, ADRs
- **TRA** - Work planning, task breakdown, time estimation
- **EUS** - Atomic task decomposition, dependency resolution

### Execution Layer
- **KIL** - TDD implementation (RED-GREEN-REFACTOR cycle)
- **BAS** - 6-phase quality gate (Lint → Structure → Build → Test → Coverage → Review)
- **DRA** - Code review, Design Doc compliance validation

### Support Layer
- **APO** - API documentation, inline comment generation
- **BON** - Dependency management, package auditing
- **CAP** - Configuration file management, environment variables
- **URO** - Code refactoring, technical debt reduction

## Workflow + Execution

Complete workflow:

1. **Plan** - Generate workflow with `trinity orchestrate`
2. **Review** - Examine phases, tasks, time estimates
3. **Approve** - Confirm workflow before execution
4. **Execute** - AJ MAESTRO coordinates agent team
5. **Stop Points** - User approval at each stop point
6. **Quality Gates** - BAS validates at each phase
7. **Complete** - Final review and documentation

## Example Usage

```bash
# Interactive planning
$ trinity orchestrate

Investigation title: Add JWT token refresh
Investigation type (bug/feature/performance/security/technical): feature
Investigation scale (SMALL/MEDIUM/LARGE): MEDIUM
Complexity (1-10): 6
Files affected: src/auth/token-service.ts,src/middleware/auth.ts

[Displays workflow plan with tree visualization]

⚠️  Execute this workflow? (yes/no): yes

Phase 1: Requirements Analysis
  ✓ Task 1: Analyze functional requirements (MON) [1.0h]
  ✓ Task 2: Analyze non-functional requirements (MON) [1.0h]

Phase 2: Technical Design
  🔄 Task 3: Create technical design (ROR) [in progress...]
```

## Progress Tracking

For in-progress workflows:

```bash
trinity orchestrate --progress
```

Shows:
- Overall progress bar
- Phase-by-phase completion
- Current task status
- Time elapsed vs. estimated

## Best Practices

1. **Start with Planning:** Always visualize workflow before execution
2. **Honest Complexity:** Accurate complexity ratings improve time estimates
3. **Review Stop Points:** Use stop points to validate direction
4. **Trust the Process:** Let agents handle details, you handle approvals
5. **Learn from Workflows:** Completed workflows improve future estimates

## What would you like AJ MAESTRO to orchestrate?

Describe your implementation task to begin workflow planning.
```

---

### Draft 3: `/trinity-learning-status` (Updated)

```markdown
---
description: Display learning system status and comprehensive metrics dashboard
---

# Trinity Learning System Status

**Purpose:** Monitor and analyze Trinity's learning system performance.

## Overview

Trinity learns from every investigation, building institutional knowledge that accelerates future work. The learning system has two views:

1. **Simple Status** - Quick overview (default)
2. **Metrics Dashboard** - Comprehensive analytics (NEW)

## Simple Status

Quick view of learning system health:

```bash
trinity learning-status
```

Shows:
- System status (Active/Disabled)
- Learning rate
- Feature flags (Pattern Detection, Self Improvement, Knowledge Sharing)
- Total patterns learned
- Agents with learning data

Example output:
```
🧠 Trinity Learning System Status

📊 Learning System:
   Status: Active
   Learning Rate: 0.1

⚙️  Features:
   Pattern Detection: ✓
   Self Improvement: ✓
   Knowledge Sharing: ✓

📚 Learned Patterns:
   Total Patterns: 47
   Agents with Data: 8

💡 Use `trinity learning-status --dashboard` for detailed metrics dashboard
```

## Metrics Dashboard (NEW)

Comprehensive learning analytics:

```bash
trinity learning-status --dashboard
```

### Dashboard Sections

#### 1. System Health Overview

Health scoring (0-100) based on:
- Pattern library size (max 20 points)
- High confidence patterns ≥0.8 (max 25 points)
- Match success rate (max 25 points)
- Average confidence (max 20 points)
- Pattern discovery rate (max 10 points)

Health levels:
- **Excellent** (≥80): 🌟 System performing optimally
- **Good** (60-79): ✅ System healthy, minor improvements possible
- **Fair** (40-59): ⚠️ System functional, improvements recommended
- **Poor** (<40): 🔴 System needs attention

Example:
```
📊 System Health Overview

  🌟 Status: EXCELLENT
  🎯 Health Score: ████████████████████ 87/100
  📈 Total Investigations: 156
  🧠 Total Patterns: 47
  ⚡ Time Savings: 234 min (18.2%)
```

#### 2. Pattern Library Metrics

Shows:
- Total patterns across all agents
- High confidence patterns (≥0.8 threshold)
- Recent patterns (last 30 days)
- Pattern discovery rate (patterns per investigation)
- Top pattern categories with visual bars

Example:
```
🧠 Pattern Library Metrics

  Total Patterns: 47
  High Confidence (≥0.8): 32 (68.1%)
  Recent (30 days): 12
  Discovery Rate: 0.30 patterns/investigation

  Pattern Categories:
    code-smell           ████████████████ 16
    best-practice        ████████████ 12
    architectural        ████████ 8
    performance          █████ 6
    security             ███ 5
```

#### 3. Performance Metrics

Shows:
- Pattern matches (times patterns were used)
- Match success rate (percentage)
- Average confidence across patterns
- Average investigation time
- **Time savings calculation** (NEW)

Time Savings:
- Estimates 15% faster investigations when patterns match
- Calculates total minutes saved
- Shows percentage improvement
- Converts to hours for visibility

Example:
```
⚡ Performance Metrics

  Pattern Matches: 89
  Match Success Rate: 82.0%
  Average Confidence: 75.3%
  Avg Investigation Time: 45 min

  💰 Estimated Time Savings:
     234 minutes saved through pattern reuse
     18.2% faster investigations with patterns
     ~4 hours of developer time saved
```

#### 4. Agent Performance Breakdown

Shows per-agent metrics:
- Patterns learned
- Investigations completed
- Success rate (color-coded)
- Average duration

Color coding:
- 🟢 Green (≥80%): Excellent performance
- 🟡 Yellow (60-79%): Good performance
- 🔴 Red (<60%): Needs improvement

Example:
```
🤖 Agent Performance

  Agent        Patterns    Investigations    Success Rate    Avg Duration
  ──────────────────────────────────────────────────────────────────────
  MON          12          45                85.5%           32min
  ROR          8           34                82.3%           56min
  KIL          15          52                79.8%           67min
  BAS          0           52                100.0%          12min
  DRA          6           28                92.8%           28min
```

#### 5. Recommendations

Actionable suggestions based on metrics:

- **Small library:** "Complete more investigations to build pattern library"
- **Low confidence:** "Focus on validating patterns through repeated use"
- **Low success rate:** "Review pattern matching criteria and refine patterns"
- **Outdated patterns:** "Run new investigations to refresh library"
- **Limited history:** "Complete more investigations to improve learning"

Example:
```
💡 Recommendations

  1. Pattern library is healthy. Continue current investigation pace.
  2. High confidence patterns are strong (68.1%). Excellent validation!
  3. Consider adding more security-related patterns (only 5 currently).
```

## Usage Options

```bash
# Simple status (default)
trinity learning-status

# Comprehensive dashboard
trinity learning-status --dashboard

# Detailed pattern information
trinity learning-status --verbose

# Dashboard with detailed patterns
trinity learning-status --dashboard --verbose
```

## Understanding Metrics

### Pattern Confidence (0.0-1.0)

Calculated from:
- **Occurrence Count** (weight: 0.3) - More occurrences = higher confidence
- **Success Rate** (weight: 0.4) - Higher success = higher confidence
- **Recency** (weight: 0.2) - More recent = higher confidence
- **Context Match** (weight: 0.1) - Better match = higher confidence

Example:
```
Pattern: "React useEffect missing dependencies"
Occurrences: 8 investigations → 0.8
Success Rate: 7/8 = 87.5% → 0.875
Recency: Last 2 weeks → 0.95
Context Match: 4/5 indicators → 0.8

Final Confidence = (0.8 × 0.3) + (0.875 × 0.4) + (0.95 × 0.2) + (0.8 × 0.1)
                 = 0.24 + 0.35 + 0.19 + 0.08
                 = 0.86 (86% confidence)
```

### Pattern Lifecycle

1. **Discovery** (confidence <0.5) - New pattern, needs validation
2. **Validation** (0.5-0.7) - Pattern being tested
3. **Established** (0.7-0.9) - Pattern proven effective
4. **Authoritative** (≥0.9) - Pattern consistently successful
5. **Deprecated** - Pattern unused for 6+ months

### Time Savings

Formula:
```
Time Savings = Successful Matches × Avg Investigation Time × 0.15

Example:
89 successful matches × 45 min avg × 15% speed improvement
= 89 × 45 × 0.15
= 600.75 minutes
= ~10 hours saved
```

## Learning System Architecture

Trinity uses a 3-layer learning architecture:

**Layer 1: Pattern Recognition (Automatic)**
- Extracts patterns from completed investigations
- Stores in `.trinity/learning/` directory
- Creates structured pattern data

**Layer 2: Pattern Matching (Investigation-Time)**
- Matches current investigation against historical patterns
- Surfaces relevant matches with confidence scores
- Recommends proven solutions

**Layer 3: Reinforcement Learning (Continuous)**
- Measures investigation outcomes
- Updates pattern confidence scores
- Self-optimizes over time

## Best Practices

1. **Regular Monitoring:** Check dashboard weekly to track improvement
2. **Investigate Consistently:** More investigations = better learning
3. **Complete Thoroughly:** High-quality investigations create better patterns
4. **Review Recommendations:** Act on suggestions to optimize learning
5. **Share Patterns:** Enable knowledge sharing across team

## What would you like to see?

- Simple status: `trinity learning-status`
- Full dashboard: `trinity learning-status --dashboard`
- Pattern details: `trinity learning-status --verbose`
```

---

## Summary

**Total Recommendations:**
- **3 new slash commands** to create
- **8 existing slash commands** to update
- **14 slash commands** remain unchanged

**Estimated Total Effort:** 8-12 hours across all phases

**Priority Order:**
1. 🔴 Phase 1 (4-6h): Crisis, Orchestrate, Learning Status
2. 🟡 Phase 2 (2-3h): Templates, Plan, Init
3. 🟢 Phase 3 (2-3h): Knowledge Preservation, Agent updates, Docs

**Recommended Next Steps:**
1. Review these recommendations
2. Prioritize which to implement first
3. Create templates in `src/templates/shared/claude-commands/`
4. Test slash commands in development
5. Deploy with next Trinity Method SDK release

---

**Document Version:** 1.0
**Last Updated:** 2025-01-06
**Status:** Recommendations Ready for Review
