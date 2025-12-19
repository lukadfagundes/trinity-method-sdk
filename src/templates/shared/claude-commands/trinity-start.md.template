---
description: Guide through your first Trinity workflow
---

Guide the user through starting their first Trinity Method workflow.

**Important:** Claude doesn't "delegate" to agents. When you use a slash command or agent, Claude adopts that persona and expertise to help you.

## Workflow Selection Process

### Step 1: Understand the Task
Ask the user what they want to work on:
- New feature implementation
- Bug fix
- Refactoring existing code
- Performance optimization
- Documentation updates
- Testing improvements

### Step 2: Determine Task Scale
**Small Tasks (1-2 files, <4 hours):**
- Direct implementation without formal workflow
- Quick analysis and coding
- Minimal planning needed

**Medium Tasks (3-5 files, 4-8 hours):**
- Structured workflow: Requirements → Design → Implementation → Review
- Design approval checkpoint
- BAS quality gates

**Large Tasks (6+ files, >8 hours):**
- Full workflow: Requirements → Design → Planning → Decomposition → Implementation → Audit
- Multiple approval checkpoints
- Comprehensive planning and documentation

### Step 3: Route to Appropriate Workflow

**For Small Tasks:**
→ Direct implementation (Claude as developer persona)

**For Medium Tasks:**
1. `/trinity-requirements` - MON analyzes requirements and scale
2. `/trinity-design` - ROR creates technical design
3. `/trinity-plan` - TRA plans implementation approach
4. Direct implementation with BAS quality gates

**For Large Tasks:**
1. `/trinity-requirements` - MON analyzes requirements
2. `/trinity-design` - ROR creates technical design with ADRs
3. `/trinity-plan` - TRA creates strategic plan
4. `/trinity-decompose` - EUS breaks into atomic tasks
5. Implementation with KIL following TDD
6. `/trinity-orchestrate` - For guidance on complete workflow

### Step 4: Work Order Creation (Optional)

For complex or long-running tasks, suggest creating a work order:
```
/trinity-workorder
```

This creates a structured investigation in `trinity/work-orders/` with:
- Problem statement
- Requirements and acceptance criteria
- Design decisions
- Implementation plan
- Progress tracking

## Agent Quick Reference

**Leadership:**
- ALY (CTO) - Strategic planning, architecture decisions
- AJ MAESTRO - Workflow orchestration and planning
- AJ CC - Code quality oversight

**Deployment:**
- TAN - Trinity structure deployment
- ZEN - Knowledge base management
- INO - Context hierarchy (CLAUDE.md, ISSUES.md)
- EIN - CI/CD pipeline setup

**Planning:**
- MON - Requirements analysis and scale determination
- ROR - Technical design and ADRs
- TRA - Implementation planning
- EUS - Atomic task decomposition

**Implementation:**
- KIL - TDD implementation (RED-GREEN-REFACTOR)
- BAS - Quality gate validation (6 phases)
- DRA - Design Doc compliance review
- APO - API documentation
- BON - Dependency management
- CAP - Configuration management
- URO - Code refactoring

**Audit:**
- JUNO - Comprehensive quality audits

## Usage

Describe your task and Claude will help you choose the right workflow and guide you through the process.

---

## Scale Determination Criteria

### File Count Assessment

**SMALL Scale (1-2 files)**:
- Single feature file + test file
- Bug fix in one location
- Configuration change
- Documentation update
**Examples**:
- Fix validation bug in user.service.ts + add test
- Update API endpoint in auth.controller.ts
- Add utility function to string-utils.ts

**MEDIUM Scale (3-5 files)**:
- Feature spanning multiple files
- Service + controller + types + tests
- Refactoring with dependencies
**Examples**:
- JWT refresh tokens: service (2 files) + middleware + types + tests (4 files total)
- Add pagination: controller + service + types + tests (4 files)
- Extract shared logic: create new utility + update 3 consumers + tests (5 files)

**LARGE Scale (6+ files)**:
- Full module implementation
- Cross-cutting concerns
- Major refactoring
**Examples**:
- User management module: 12 files (services, controllers, middleware, types, tests, validators)
- Payment integration: 8 files (service, webhook handler, types, models, tests, config)
- Database migration: 10+ files (migration scripts, model updates, service changes, tests)

### Complexity Factors (May Increase Scale)

Consider bumping scale up if:
- **High Security Impact**: Auth, payments, data access → Add stop points
- **Complex Logic**: Multiple algorithms, state machines → Need design review
- **External Dependencies**: Third-party APIs, new libraries → Requires planning
- **Cross-Team Impact**: Changes affect multiple teams/services → Need coordination

**Example**: 2-file auth change might be MEDIUM due to security impact requiring design review.

---

## Decision Tree

```
User Request
    ↓
How many files affected?
    ├─ 1-2 files ──→ SMALL
    ├─ 3-5 files ──→ MEDIUM
    └─ 6+ files ──→ LARGE
         ↓
    [Check Complexity Factors]
         ↓
    High security/complexity?
         ├─ Yes → Increase scale
         └─ No → Keep scale
              ↓
         [Determine Workflow]
              ↓
    SMALL → KIL + BAS (0 stops)
    MEDIUM → MON/ROR + KIL + BAS + DRA (2 stops)
    LARGE → MON + ROR + TRA + EUS + KIL + BAS + DRA (4 stops)
```

### Scale-to-Workflow Mapping

| Scale | Files | Agents | Stop Points | Duration |
|-------|-------|--------|-------------|----------|
| SMALL | 1-2 | KIL, BAS | 0 | <1 hour |
| MEDIUM | 3-5 | MON/ROR, KIL, BAS, DRA | 2 | 2-6 hours |
| LARGE | 6+ | MON, ROR, TRA, EUS, KIL, BAS, DRA | 4 | 1-2 days |

**Stop Points**:
- SMALL: No stops (direct execution)
- MEDIUM: Design review + Final review
- LARGE: Requirements + Design + Plan + Final review

---

---

## /trinity-start vs /trinity-orchestrate

### When to Use Each

**Use /trinity-start** when:
- ✅ Starting fresh work (no investigation file exists)
- ✅ User request is clear
- ✅ Want ALY to determine scale and delegate

**Use /trinity-orchestrate** when:
- ✅ Have existing work order file
- ✅ Want to execute specific WO-XXX
- ✅ Resuming paused work order

### Workflow Difference

**/trinity-start**:
```
User request → ALY assesses → Determines scale → Delegates to AJ MAESTRO
```

**/trinity-orchestrate @WO-042**:
```
Read WO-042 → AJ MAESTRO executes directly (skip ALY assessment)
```

**Example**:
- "Add JWT refresh tokens" → Use `/trinity-start`
- "Execute WO-042" → Use `/trinity-orchestrate @WO-042`

---

---

## Visual Workflow Guide

```
START HERE: User has a task
    ↓
┌───────────────────────────────────────┐
│ Is Trinity deployed in this project? │
└────────┬──────────────────┬───────────┘
         │ No               │ Yes
         ↓                  ↓
    /trinity-init      Is this a new task?
         │                  │
         │            ┌─────┴──────┐
         │            │ Yes        │ No (resuming)
         │            ↓            ↓
         │      /trinity-start  /trinity-continue
         │            │            │
         └────────────┴────────────┘
                      ↓
              ALY determines scale
                      │
         ┌────────────┼────────────┐
         │            │            │
    SMALL (0)    MEDIUM (2)    LARGE (4)
    KIL+BAS      +Design       +Full planning
         │            │            │
         └────────────┼────────────┘
                      ↓
              AJ MAESTRO executes
                      ↓
              BAS validates (6 phases)
                      ↓
              DRA reviews compliance
                      ↓
              ┌───────┴────────┐
              │ Complete?      │
              └───┬────────┬───┘
                  │ Yes    │ No
                  ↓        ↓
            /trinity-end  Continue next task
```

**Numbers in parentheses** = Stop points for ALY review

---
