# Trinity Method Workflows

**Complete Workflow Reference for Trinity Method SDK v2.0**
**Last Updated:** 2025-11-05

---

## Available Workflows

This directory contains comprehensive workflow documentation for Trinity Method SDK:

### Core Workflows

1. **[Investigation Workflow](./investigation-workflow.md)**
   - How to conduct systematic investigations
   - Evidence collection process
   - Decision documentation
   - SDK agent coordination (ALY, ZEN, BAS, MON)

2. **[Implementation Workflow](./implementation-workflow.md)**
   - Scale-based implementation (Small/Medium/Large)
   - TDD cycle (RED-GREEN-REFACTOR)
   - Quality gates (BAS 6-phase)
   - Stop points and reviews

3. **[Session Workflow](./session-workflow.md)**
   - Session start procedures
   - Investigation → Implementation → Documentation cycle
   - Session end and archiving
   - Cross-session knowledge transfer

4. **[Audit Workflow](./audit-workflow.md)**
   - Quality audit process (JUNO)
   - Code review workflow (DRA)
   - Security audit checklist
   - Performance audit procedures

5. **[Deploy Workflow](./deploy-workflow.md)**
   - Trinity SDK deployment process
   - Project initialization
   - Baseline establishment
   - Post-deployment validation

---

## Workflow Overview

### The Trinity Method Development Cycle

```
┌─────────────────────────────────────────────────────────────┐
│                   TRINITY METHOD CYCLE                      │
└─────────────────────────────────────────────────────────────┘

Session Start
    ↓
Investigation (ALY + Evidence Collection)
    ↓
Design (ROR - Medium/Large scale)
    ↓
Implementation (KIL + TDD)
    ↓
Quality Gates (BAS - automatic)
    ↓
Review (DRA at stop points)
    ↓
Audit (JUNO - Large scale)
    ↓
Session End (Archive + Pattern Extraction)
    ↓
Next Session (Load Context + Suggest Patterns)
```

---

## Quick Reference

### By Task Type

**Bug Fix:**
```
Investigation Workflow → Implementation Workflow (Small/Medium scale)
```

**New Feature:**
```
Investigation Workflow → Implementation Workflow (Medium/Large scale)
```

**Performance Optimization:**
```
Investigation Workflow → Audit Workflow → Implementation Workflow
```

**Refactoring:**
```
Audit Workflow → Investigation Workflow → Implementation Workflow
```

**Deployment:**
```
Deploy Workflow → Session Workflow → Audit Workflow
```

---

## Workflow Principles

### 1. Investigation Before Implementation

**All workflows start with investigation** - understanding before action.

### 2. Evidence-Based Decisions

**All decisions backed by evidence** - data over assumptions.

### 3. Systematic Quality Assurance

**Quality is automatic, not optional** - BAS enforces standards.

### 4. Knowledge Preservation

**Every workflow preserves knowledge** - sessions archived, patterns extracted.

### 5. Continuous Improvement

**Workflows evolve based on learnings** - retrospectives drive refinement.

---

## Using These Workflows

### For Developers

Read the relevant workflow before starting work:
- **Bug fix?** → Investigation + Implementation workflows
- **New feature?** → Investigation + Implementation + Session workflows
- **Optimization?** → Investigation + Audit + Implementation workflows

### For Teams

Use workflows in onboarding:
- Day 1: Read Investigation Workflow
- Day 2: Read Implementation Workflow
- Day 3: Practice with SDK agents
- Day 4: Read Session and Audit workflows
- Week 2: Deploy to real project

### For AI Agents

Workflows guide agent coordination:
- **ALY** orchestrates Investigation Workflow
- **AJ MAESTRO** orchestrates Implementation Workflow
- **KIL** executes TDD within Implementation Workflow
- **BAS** enforces quality gates within Implementation Workflow
- **JUNO** executes Audit Workflow

---

## Workflow Customization

Trinity Method workflows are **adaptable**:

**For Your Project:**
1. Copy workflow template
2. Adapt to your tech stack
3. Add project-specific steps
4. Document in `trinity/knowledge-base/Trinity.md`

**For Your Team:**
1. Review workflows together
2. Discuss adaptations needed
3. Practice with real tasks
4. Refine based on retrospectives

---

## Related Documentation

- [Investigation-First Complete Methodology](../methodology/investigation-first-complete.md)
- [Trinity Framework](../methodology/trinity-framework.md)
- [Best Practices](../best-practices.md)
- [Session Management](../session-management.md)

---

**Trinity Method SDK: Workflows That Guide, Agents That Execute**

*Understand the workflow. Let SDK handle execution.*
