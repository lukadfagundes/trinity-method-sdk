---
description: Orchestrate implementation using AJ MAESTRO with workflow visualization and 11-agent team
---

# Trinity Orchestration - AJ MAESTRO

**Purpose:** Orchestrate complex implementations with visual workflow planning and the AJ MAESTRO 11-agent team.

## Overview

AJ MAESTRO provides two powerful orchestration capabilities:

1. **Workflow Visualization** (NEW) - Interactive workflow planning with visual tree display, time estimates, and parallelization analysis
2. **Agent Orchestration** - Coordinate the 11-agent team for implementation

## Workflow Visualization (NEW)

Generate and visualize investigation workflows before execution with the `trinity orchestrate` CLI command.

### Interactive Workflow Generation

```bash
# Interactive mode - AJ MAESTRO prompts for details
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

AJ MAESTRO guides you through workflow planning:

1. **Investigation title:** What are you building? (e.g., "Add JWT token refresh")
2. **Investigation type:** bug, feature, performance, security, or technical
3. **Investigation scale:** SMALL, MEDIUM, or LARGE
4. **Complexity rating:** 1-10 (where 10 is most complex)
5. **Files affected:** Which parts of the codebase? (comma-separated)

### Workflow Plan Output

AJ MAESTRO generates a visual tree structure with comprehensive details:

```
🎼 WORKFLOW PLAN: Implement user authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

### Time Optimization

AJ MAESTRO analyzes and optimizes workflow execution:

- **Parallelization Opportunities:** Identifies tasks that can run simultaneously
- **Dependency Analysis:** Determines optimal task execution order
- **Time Savings:** Calculates optimized duration vs. sequential execution
- **Agent Utilization:** Efficiently coordinates agent workload

**Example:** 8 tasks totaling 10h sequential time can complete in 6h with parallelization (40% time savings).

### Scale-Based Workflows

#### Small Scale (0 stop points, 1-4h)
- **Use Case:** Simple bug fixes, small features affecting 1-2 files
- **Phases:** 2 phases (Investigation → Implementation)
- **Agents:** MON, TRA, KIL, BAS
- **Workflow:**
  1. Quick analysis and planning
  2. Direct implementation with BAS quality gates
- **Time:** 1-4 hours estimated
- **Stop Points:** 0 (fast iteration)

#### Medium Scale (2 stop points, 4-8h)
- **Use Case:** Features, refactoring affecting 3-5 files
- **Phases:** 4 phases (Requirements → Design → Implementation → Review)
- **Agents:** MON, ROR, TRA, EUS, KIL, BAS, DRA, APO
- **Stop Points:**
  - **Stop 1:** Design approval (after Phase 2)
  - **Stop 2:** Final review (after Phase 4)
- **Time:** 4-8 hours estimated
- **Parallelization:** 15-25% time savings

#### Large Scale (4 stop points, >8h)
- **Use Case:** Major features, architecture changes affecting 6+ files
- **Phases:** 6 phases (Requirements → Design → Planning → Implementation → Testing → Review)
- **Agents:** All 11 agents coordinated
- **Stop Points:**
  - **Stop 1:** Requirements approval (after Phase 1)
  - **Stop 2:** Design approval (after Phase 2)
  - **Stop 3:** Plan approval (after Phase 3)
  - **Stop 4:** Final review with JUNO audit (after Phase 6)
- **Time:** >8 hours estimated
- **Parallelization:** 30-40% time savings

## The 11-Agent Team

**Planning Layer:**
- **MON** - Requirements analysis
- **ROR** - Technical design & ADRs
- **TRA** - Work planning
- **EUS** - Task decomposition

**Execution Layer:**
- **KIL** - TDD implementation (RED-GREEN-REFACTOR)
- **BAS** - 6-phase quality gate
- **DRA** - Code review & Design Doc compliance

**Support Layer:**
- **APO** - API documentation
- **BON** - Dependency management
- **CAP** - Configuration files
- **URO** - Code refactoring

## Workflow + Execution

Complete end-to-end process:

1. **Plan** - Generate workflow with `trinity orchestrate`
2. **Review** - Examine phases, tasks, dependencies, time estimates
3. **Approve** - Confirm workflow before execution (or adjust scale/complexity)
4. **Execute** - AJ MAESTRO coordinates agent team through workflow
5. **Stop Points** - User approval required at each stop point
6. **Quality Gates** - BAS validates at each implementation phase
7. **Complete** - Final review, documentation, and archival

## Example Usage

### Interactive Planning Session

```bash
$ trinity orchestrate

🎼 AJ MAESTRO Workflow Planning
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Investigation title: Add JWT token refresh functionality
Investigation type (bug/feature/performance/security/technical): feature
Investigation scale (SMALL/MEDIUM/LARGE): MEDIUM
Complexity (1-10): 6
Files affected: src/auth/token-service.ts,src/middleware/auth.ts

Generating workflow plan...

[Displays workflow plan with tree visualization - see example above]

⚠️  Execute this workflow? (yes/no): yes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 1: Requirements Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Task 1: Analyze functional requirements (MON) [1.0h] COMPLETE
✓ Task 2: Analyze non-functional requirements (MON) [1.0h] COMPLETE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 2: Technical Design
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 Task 3: Create technical design (ROR) [in progress...]
```

### CLI with All Parameters

```bash
# Generate workflow without prompts
trinity orchestrate \
  --title "Optimize database query performance" \
  --type performance \
  --scale LARGE \
  --complexity 8 \
  --files "src/database/,src/models/" \
  --execute
```

### Check Progress of Running Workflow

```bash
trinity orchestrate --progress
```

Shows:
- Overall progress bar
- Phase-by-phase completion
- Current task status
- Time elapsed vs. estimated
- Next stop point

## Usage

Describe your implementation task and AJ MAESTRO will:
1. Determine scale (Small/Medium/Large) or accept your scale
2. Generate visual workflow plan with time estimates
3. Coordinate appropriate planning agents
4. Execute with quality gates and stop points
5. Ensure compliance, testing, and documentation

## Best Practices

1. **Start with Planning:** Always visualize workflow before execution
2. **Honest Complexity Ratings:** Accurate ratings improve time estimates and agent coordination
3. **Review Stop Points:** Use stop points to validate direction and catch issues early
4. **Trust the Process:** Let agents handle implementation details, you handle approvals
5. **Learn from Workflows:** Completed workflows improve future estimates through learning system

## Related Commands

- `/trinity-plan` - TRA strategic planning (complementary to orchestrate)
- `/trinity-crisis` - Crisis recovery with guided protocols
- `/trinity-learning-status --dashboard` - View workflow optimization metrics

## Source Files

- `src/cli/commands/orchestrate.ts` - CLI command implementation
- `src/coordination/AJMaestro.ts` - Workflow plan generator (778 lines)
- `src/coordination/WorkflowVisualizer.ts` - Tree visualization (469 lines)
- `src/coordination/types.ts` - Workflow type definitions

## What would you like AJ MAESTRO to orchestrate?

Describe your implementation task to begin workflow planning. AJ MAESTRO will generate a visual workflow plan with time estimates, parallelization analysis, and agent assignments.
