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
