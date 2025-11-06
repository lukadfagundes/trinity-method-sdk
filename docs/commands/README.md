# Trinity Method SDK - Commands Reference

**Complete Command Documentation for Trinity Method SDK v2.0**
**Last Updated:** 2025-11-05

---

## Overview

Trinity Method SDK provides 24 slash commands (for use within Claude Code) and CLI commands (for terminal use). This reference documents all commands, their purposes, and how to use them effectively.

---

## Command Categories

### Workflow Commands (Core Operations)
- `/trinity-plan` - Create implementation plan
- `/trinity-orchestrate` - Orchestrate implementation with 11-agent team
- `/trinity-workorder` - Create detailed work orders
- `/trinity-requirements` - Analyze requirements (MON)
- `/trinity-design` - Create technical design (ROR)
- `/trinity-decompose` - Decompose work into atomic tasks (EUS)

### Investigation Commands
- `/trinity-create-investigation` - Launch Investigation Wizard
- `/trinity-plan-investigation` - Generate AI-powered investigation plans

### Session Commands
- `/trinity-start` - Guide through first Trinity workflow
- `/trinity-continue` - Resume work after interruption
- `/trinity-end` - End session and archive work

### Quality & Audit Commands
- `/trinity-verify` - Verify Trinity installation completeness
- `/trinity-benchmark` - Run performance benchmarks
- `/trinity-analytics` - View performance analytics

### Learning System Commands
- `/trinity-learning-status` - Display learning system status
- `/trinity-learning-export` - Export learned patterns

### Configuration Commands
- `/trinity-config` - Configure Trinity settings interactively
- `/trinity-init` - Complete Trinity integration (TAN, ZEN, INO, JUNO)

### Cache Commands
- `/trinity-cache-stats` - Display cache statistics
- `/trinity-cache-warm` - Pre-populate cache with patterns
- `/trinity-cache-clear` - Clear Trinity cache system

### Utility Commands
- `/trinity-agents` - Display Trinity agent directory
- `/trinity-hooks` - Manage Trinity Hook Library
- `/trinity-history` - View Trinity session history
- `/trinity-docs` - Quick access to Trinity documentation

---

## Workflow Commands (Detailed)

### /trinity-plan

**Purpose:** Create comprehensive implementation plan for features or changes.

**Agent:** TRA (Work Planner)

**Usage:**
```
/trinity-plan
```

**Interactive Prompts:**
1. What do you want to build/change?
2. Investigation completed? (If no, triggers investigation first)
3. Scale estimate (Small/Medium/Large)

**Output:**
- `trinity/plans/YYYY-MM-DD-feature-name.md`
- Work breakdown with dependencies
- Time estimates per task
- Risk assessment
- Resource requirements

**Example:**
```
User: /trinity-plan
TRA: What feature would you like to plan?
User: Add pagination to user list API
TRA: [Analyzes requirements]
TRA: Created plan: trinity/plans/2025-11-05-user-list-pagination.md
     - 5 tasks identified
     - Estimated: 8 hours
     - Scale: Medium
     - Dependencies: None
```

**See Also:** [Implementation Workflow](../workflows/implementation-workflow.md)

---

### /trinity-orchestrate

**Purpose:** Orchestrate complete implementation with 11-agent team coordination.

**Agent:** AJ MAESTRO (Implementation Lead)

**Usage:**
```
/trinity-orchestrate
```

**What It Does:**
1. ALY determines scale (Small/Medium/Large)
2. MON analyzes requirements (if Medium/Large)
3. ROR creates Design Document (if Medium/Large)
4. TRA creates implementation plan
5. EUS decomposes into atomic tasks
6. KIL implements with TDD
7. BAS enforces quality gates (automatic)
8. DRA reviews code (at stop points)
9. JUNO audits (if Large scale)

**Stop Points:**
- **Small:** None (continuous with BAS gates)
- **Medium:** 1 stop point (design review)
- **Large:** 4 stop points (design, mid-implementation, pre-merge, post-deployment)

**Example:**
```
User: /trinity-orchestrate
AJ MAESTRO: Starting orchestration...
ALY: Scale determined: MEDIUM (pagination feature, 8 hours)
MON: Requirements analyzed ✓
ROR: Design document created ✓
--- STOP POINT #1: Design Review ---
User: approve
TRA: Implementation plan created ✓
EUS: Decomposed into 5 atomic tasks ✓
KIL: Task 1/5 complete (TDD: RED-GREEN-REFACTOR) ✓
BAS: Quality gate PASSED ✓
... [continues through all tasks]
DRA: Code review complete ✓
AJ MAESTRO: Implementation complete!
```

**See Also:** [Implementation Workflow](../workflows/implementation-workflow.md)

---

### /trinity-workorder

**Purpose:** Create detailed work order with deliverables and acceptance criteria.

**Usage:**
```
/trinity-workorder
```

**Interactive Prompts:**
1. Work order type? (Implementation, Investigation, Refactoring, Bug Fix, Security Fix)
2. Priority? (CRITICAL, HIGH, MEDIUM, LOW)
3. Estimated time?
4. Dependencies?
5. Deliverables?
6. Acceptance criteria?

**Output:**
- `trinity/work-orders/WO-###-feature-name.md`
- Structured work order document
- Tracked in To-do.md

**Example:**
```
User: /trinity-workorder
System: Work order type?
User: Implementation
System: Priority?
User: HIGH
System: Estimated time?
User: 8 hours
... [completes prompts]
System: Created: trinity/work-orders/WO-015-pagination.md
```

**See Also:** [Session Workflow](../workflows/session-workflow.md)

---

### /trinity-requirements

**Purpose:** Analyze requirements with MON (Requirements Analyst).

**Agent:** MON

**Usage:**
```
/trinity-requirements
```

**What It Analyzes:**
- User needs and acceptance criteria
- Success metrics
- User workflows
- Edge cases
- Non-functional requirements (performance, security)

**Output:**
- `trinity/requirements/YYYY-MM-DD-feature-name.md`
- Structured requirements document
- Acceptance criteria list

---

### /trinity-design

**Purpose:** Create technical design document with ROR (Design Architect).

**Agent:** ROR

**Usage:**
```
/trinity-design
```

**What It Creates:**
- Component architecture
- Interface definitions
- Data flow diagrams
- Database schema (if applicable)
- API specifications
- Testing strategy

**Output:**
- `trinity/design-docs/YYYY-MM-DD-feature-name.md`
- Design document with diagrams
- Referenced during implementation (DRA validates compliance)

**Required For:** Medium and Large scale implementations

---

### /trinity-decompose

**Purpose:** Decompose work into atomic tasks with EUS (Task Decomposer).

**Agent:** EUS

**Usage:**
```
/trinity-decompose
```

**What It Does:**
- Breaks features into 2-4 hour atomic tasks
- Identifies task dependencies
- Specifies test requirements per task
- Creates task execution order

**Output:**
- Task list in implementation plan
- Each task includes: description, dependencies, tests, time estimate

**Example Output:**
```
Task 1: Create PaginationHelper utility (2h)
  - Dependencies: None
  - Tests: Unit tests for calculateSkip, validateParams

Task 2: Add pagination to UserService (3h)
  - Dependencies: Task 1
  - Tests: Integration tests for UserService.listUsers()

Task 3: Add pagination to UserController (2h)
  - Dependencies: Task 2
  - Tests: E2E tests for GET /api/users
```

---

## Investigation Commands (Detailed)

### /trinity-create-investigation

**Purpose:** Launch Investigation Wizard for guided investigation creation.

**Usage:**
```
/trinity-create-investigation
```

**Interactive Wizard Steps:**
1. Investigation type? (Technical, Performance, UX, Security)
2. Problem description?
3. Current state?
4. Success criteria?
5. Constraints?

**Output:**
- `trinity/investigations/YYYY-MM-DD-problem-name.md`
- Structured investigation document
- Ready for evidence collection

**Agents Involved:**
- ALY coordinates investigation
- ZEN for technical analysis
- BAS for performance baselines
- MON for requirements
- JUNO for security assessment

**See Also:** [Investigation Workflow](../workflows/investigation-workflow.md)

---

### /trinity-plan-investigation

**Purpose:** Generate AI-powered investigation plans with visualizations.

**Usage:**
```
/trinity-plan-investigation
```

**What It Creates:**
- Investigation roadmap
- Evidence collection plan
- Analysis strategy
- Decision framework

**Use Case:** Complex investigations requiring structured approach.

---

## Session Commands (Detailed)

### /trinity-start

**Purpose:** Guide through your first Trinity workflow (onboarding).

**Usage:**
```
/trinity-start
```

**What It Does:**
1. Explains Trinity Method philosophy
2. Shows available workflows (Investigation, Implementation, Session)
3. Guides through first investigation or work order
4. Demonstrates agent coordination

**Target Audience:** New Trinity Method users

---

### /trinity-continue

**Purpose:** Resume work after interruption.

**Agent:** ALY (State Reviewer)

**Usage:**
```
/trinity-continue
```

**What It Does:**
1. Reviews current session state
2. Loads To-do.md and ISSUES.md
3. Identifies incomplete tasks
4. Suggests next actions
5. Restores context from previous session

**Use Case:** After interruption (context limit, break, new session)

---

### /trinity-end

**Purpose:** End session and archive work to `trinity/archive/`.

**Usage:**
```
/trinity-end
```

**What It Does:**
1. Archives session files (investigations, design docs, work orders)
2. Extracts patterns (Learning System)
3. Creates session summary
4. Updates Knowledge Base (ZEN)
5. Prepares for next session

**Output:**
- `trinity/sessions/YYYY-MM-DD-HH-MM/SESSION-SUMMARY.md`
- All session documents archived
- Patterns extracted and saved

**See Also:** [Session Workflow](../workflows/session-workflow.md)

---

## Quality & Audit Commands (Detailed)

### /trinity-verify

**Purpose:** Verify Trinity Method installation completeness.

**Agent:** JUNO (Quality Auditor)

**Usage:**
```
/trinity-verify
```

**What It Checks:**
- [1/10] Folder structure exists
- [2/10] All 18 agents deployed
- [3/10] Knowledge Base initialized
- [4/10] Context hierarchy (CLAUDE.md files)
- [5/10] Linting configured
- [6/10] Hooks installed
- [7/10] Learning System initialized
- [8/10] Baseline established
- [9/10] Initial audit complete
- [10/10] Git integration

**Output:** Pass/fail report with remediation steps for failures

**See Also:** [Deploy Workflow](../workflows/deploy-workflow.md)

---

### /trinity-benchmark

**Purpose:** Run performance benchmarks and detect regressions.

**Agent:** BAS (Quality Gate)

**Usage:**
```
/trinity-benchmark
```

**What It Measures:**
- Response times (API endpoints)
- Memory usage
- Database query performance
- Build times
- Test execution times

**Output:**
- `trinity/benchmarks/YYYY-MM-DD-benchmark.json`
- Comparison to baseline
- Regression detection

**Example Output:**
```
Performance Benchmarks:

Response Times (p95):
- GET /api/users: 78ms (baseline: 145ms) ✅ 46% improvement
- POST /api/users: 124ms (baseline: 98ms) ⚠️ 27% regression

Memory Usage:
- Average: 145MB (baseline: 120MB) ⚠️ 21% increase

Regressions Detected: 2
```

---

### /trinity-analytics

**Purpose:** View performance analytics and investigation metrics.

**Usage:**
```
/trinity-analytics
```

**What It Shows:**
- Investigation success rate
- Implementation velocity (tasks per hour)
- Pattern reuse effectiveness
- Quality gate pass rate
- Time savings from Learning System

**Use Case:** Track team productivity and process improvements

---

## Learning System Commands (Detailed)

### /trinity-learning-status

**Purpose:** Display learning system status and performance metrics.

**Usage:**
```
/trinity-learning-status
```

**What It Shows:**
- Total patterns learned
- Pattern confidence distribution
- Strategy selection performance
- Cross-session learning effectiveness
- Knowledge sharing metrics

**Example Output:**
```
Learning System Status:

Patterns Learned: 47
  - High confidence (>0.8): 23
  - Medium confidence (0.6-0.8): 18
  - Low confidence (<0.6): 6

Strategy Performance:
  - TDD workflow: 94% success rate
  - Cursor pagination: 91% time savings
  - Service layer pattern: 88% reuse

Cross-Session Learning:
  - 34 patterns suggested across sessions
  - 28 patterns accepted (82% acceptance)
  - Average time savings: 3.2 hours per pattern
```

---

### /trinity-learning-export

**Purpose:** Export learned patterns and insights from the learning system.

**Usage:**
```
/trinity-learning-export
```

**Output:**
- `trinity/learning/export-YYYY-MM-DD.json`
- All patterns with confidence scores
- Strategy performance metrics
- Shareable with team

**Use Case:** Backup patterns, share with team, analyze learning trends

---

## Configuration Commands (Detailed)

### /trinity-config

**Purpose:** Configure Trinity settings interactively.

**Agent:** CAP (Configuration Specialist)

**Usage:**
```
/trinity-config
```

**What You Can Configure:**
- Learning System (enable/disable, confidence threshold)
- Cache settings (TTL, size limits)
- Quality gates (coverage threshold, lint rules)
- Hooks (enable/disable specific hooks)
- Agent preferences (which agents to use)

**Example:**
```
User: /trinity-config
CAP: What would you like to configure?
     1. Learning System
     2. Cache Settings
     3. Quality Gates
     4. Hooks
     5. Agent Preferences

User: 1
CAP: [Learning System Configuration]
     - Enable automatic pattern extraction? (Y/n)
     - Pattern confidence threshold? (0.0-1.0, default: 0.7)
     - Share patterns with team? (Y/n)
     - Enable cross-session learning? (Y/n)
```

---

### /trinity-init

**Purpose:** Complete Trinity integration (TAN, ZEN, INO, then JUNO audit).

**Agents:** TAN, ZEN, INO, JUNO

**Usage:**
```
/trinity-init
```

**What It Does:**
1. TAN creates folder structure
2. ZEN initializes Knowledge Base
3. INO establishes CLAUDE.md hierarchy
4. JUNO performs initial audit

**Use Case:** Fresh deployment or re-initialization after major changes

**See Also:** [Deploy Workflow](../workflows/deploy-workflow.md)

---

## Cache Commands (Detailed)

### /trinity-cache-stats

**Purpose:** Display cache statistics and performance metrics.

**Usage:**
```
/trinity-cache-stats
```

**What It Shows:**
- L1 (in-memory) hit rate
- L2 (file-based) hit rate
- L3 (SQLite) hit rate
- Cache size per tier
- Query similarity effectiveness

**Example Output:**
```
Cache Performance:

L1 (In-Memory):
  - Entries: 87/100
  - Hit rate: 76%
  - Average response: 2ms

L2 (File-Based):
  - Entries: 543/1000
  - Hit rate: 62%
  - Average response: 15ms

L3 (SQLite):
  - Entries: 3,421 (unlimited)
  - Hit rate: 48%
  - Average response: 45ms

Overall:
  - Cache hits: 2,341
  - Cache misses: 542
  - Hit rate: 81%
```

---

### /trinity-cache-warm

**Purpose:** Pre-populate cache with frequently used patterns.

**Usage:**
```
/trinity-cache-warm
```

**What It Does:**
- Loads common patterns into cache
- Improves first-query performance
- Reduces cold-start latency

**Use Case:** After deployment or cache clear, before starting work

---

### /trinity-cache-clear

**Purpose:** Clear Trinity cache system (L1, L2, L3).

**Usage:**
```
/trinity-cache-clear
```

**Interactive:**
- Clear all tiers? (Y/n)
- Or select specific tier (L1, L2, L3)

**Use Case:** After major changes, to force fresh analysis

---

## Utility Commands (Detailed)

### /trinity-agents

**Purpose:** Display Trinity agent directory and information.

**Usage:**
```
/trinity-agents
```

**What It Shows:**
- All 18 agents organized by layer
- Agent roles and responsibilities
- When to use which agent
- Agent collaboration patterns

**Example Output:**
```
Trinity Method SDK v2.0 - Agent Directory

LEADERSHIP (2 agents):
├─ ALY (CTO) - Strategic planning, investigation coordination
└─ AJ MAESTRO - Implementation orchestration, 11-agent coordination

PLANNING (4 agents):
├─ MON - Requirements analysis, acceptance criteria
├─ ROR - Design architecture, technical specifications
├─ TRA - Work planning, estimation, dependencies
└─ EUS - Task decomposition, atomic task creation

EXECUTION (3 agents):
├─ KIL - TDD implementation, RED-GREEN-REFACTOR cycle
├─ BAS - Quality gates, 6-phase validation
└─ DRA - Code review, Design Doc compliance validation

SUPPORT (4 agents):
├─ APO - API documentation, inline comments
├─ BON - Dependency management, security updates
├─ CAP - Configuration management, environment variables
└─ URO - Refactoring, technical debt reduction

DEPLOYMENT (4 agents):
├─ TAN - Structure creation, folder hierarchy
├─ ZEN - Knowledge Base management, documentation
├─ INO - Context hierarchy, CLAUDE.md management
└─ Ein - CI/CD integration, pipeline automation

AUDIT (1 agent):
└─ JUNO - Comprehensive audits, security + performance + debt
```

**See Also:** [Agent Selection Guide](../agents/agent-selection-guide.md) (when created)

---

### /trinity-hooks

**Purpose:** Manage Trinity Hook Library for safe workflow automation.

**Agent:** CAP (Configuration Specialist)

**Usage:**
```
/trinity-hooks
```

**What You Can Do:**
- List installed hooks
- Enable/disable hooks
- View hook configuration
- Test hooks
- Create custom hooks

**Hook Types:**
- `session-start` - Runs at session start
- `session-end` - Runs at session end
- `pre-commit` - Runs before git commit
- `post-commit` - Runs after git commit
- Custom hooks (user-defined)

**See Also:** [Hooks Guide](../hooks-guide.md)

---

### /trinity-history

**Purpose:** View Trinity session history and archived investigations.

**Usage:**
```
/trinity-history
```

**What It Shows:**
- Recent sessions (last 10)
- Session summaries
- Investigations created
- Patterns learned
- Time spent per session

**Example Output:**
```
Trinity Session History:

2025-11-05 14:30 - User Pagination (Medium scale, 6h)
  - Investigation: Cursor-based pagination
  - Design: ROR created design doc
  - Implementation: 5 tasks completed
  - Pattern learned: pagination-cursor-based-001

2025-11-04 09:00 - Security Audit (Large scale, 3h)
  - JUNO comprehensive audit
  - 3 HIGH vulnerabilities found
  - Remediation plan created
  - Technical debt: 12 hours identified
```

---

### /trinity-docs

**Purpose:** Quick access to Trinity documentation.

**Usage:**
```
/trinity-docs
```

**What It Shows:**
- Links to all documentation
- Workflow guides
- Best practices
- Crisis management
- Session management

**Categories:**
- Workflows (Investigation, Implementation, Session, Audit, Deploy)
- Methodology (Trinity Framework, Investigation-First)
- Guides (Hooks, Best Practices, Crisis Management)
- Reference (Commands, Agents, Evolution)

---

## CLI Commands (Brief Overview)

**Note:** CLI commands are used in terminal, outside of Claude Code.

```bash
# Deployment
npx trinity deploy          # Deploy Trinity to project
npx trinity update          # Update to latest version
npx trinity status          # Display deployment status

# Analysis & Investigation
npx trinity analyze         # Quick code analysis
npx trinity investigate     # Create and execute investigation

# Monitoring
npx trinity dashboard       # Launch web dashboard
npx trinity analytics       # Display analytics (CLI)
npx trinity cache-stats     # Display cache stats (CLI)
npx trinity learning-status # Display learning status (CLI)
npx trinity benchmark       # Run benchmarks (CLI)

# Review
npx trinity review          # Review session archives
```

---

## Command Usage Patterns

### Starting a New Feature

```
1. /trinity-create-investigation  # Understand problem
2. [Review investigation document]
3. /trinity-plan                  # Create implementation plan
4. /trinity-orchestrate           # Execute with 11-agent team
5. [Stop points for review]
6. /trinity-end                   # Archive session
```

---

### Resuming After Interruption

```
1. /trinity-continue              # ALY reviews state
2. [Review To-do.md and ISSUES.md]
3. /trinity-orchestrate           # Continue implementation
```

---

### Post-Deployment Audit

```
1. /trinity-benchmark             # Check performance
2. /trinity-verify                # Verify installation
3. /trinity-analytics             # Review metrics
```

---

### Learning System Management

```
1. /trinity-learning-status       # Check patterns learned
2. /trinity-learning-export       # Export patterns
3. /trinity-cache-warm            # Pre-populate cache
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start new feature | `/trinity-plan` → `/trinity-orchestrate` |
| Create investigation | `/trinity-create-investigation` |
| Resume work | `/trinity-continue` |
| End session | `/trinity-end` |
| View agents | `/trinity-agents` |
| Check quality | `/trinity-verify` |
| Run benchmarks | `/trinity-benchmark` |
| View analytics | `/trinity-analytics` |
| Manage hooks | `/trinity-hooks` |
| View history | `/trinity-history` |
| Configure settings | `/trinity-config` |
| Clear cache | `/trinity-cache-clear` |
| Access docs | `/trinity-docs` |

---

## Related Documentation

- [Investigation Workflow](../workflows/investigation-workflow.md)
- [Implementation Workflow](../workflows/implementation-workflow.md)
- [Session Workflow](../workflows/session-workflow.md)
- [Audit Workflow](../workflows/audit-workflow.md)
- [Deploy Workflow](../workflows/deploy-workflow.md)
- [Best Practices](../best-practices.md)
- [Hooks Guide](../hooks-guide.md)

---

**Trinity Method SDK: Command your workflow. Automate quality. Ship with confidence.**
