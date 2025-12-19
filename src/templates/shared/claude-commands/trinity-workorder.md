---
description: Create Trinity Method work orders interactively
---

# Trinity Work Orders

## What Are Work Orders?

Work orders are structured task documents that provide clear objectives, task breakdown, progress tracking, context preservation, and quality assurance.

**Purpose**: Bridge gap between user requests and systematic implementation.

---

## When to Use Work Orders

**Use For**: Medium/Large tasks (3+ files), session-spanning work, team collaboration, audit trail needed

**Skip For**: Small tasks (1-2 files), one-off experiments, trivial changes

---

## Work Order Naming

**Format**: `WO-XXX-{brief-title}.md`

Examples: WO-042-jwt-refresh-implementation.md

---

## Interactive Creation

Run `/trinity-workorder` and answer:
1. Work Order Type (Investigation/Implementation/Hybrid)
2. Task Description
3. Objectives
4. Deliverables
5. Estimated Time
6. Priority (optional)

System creates WO-XXX-{task-name}.md in trinity/work-orders/

---

## Complete Example

See WO-042 example in work order files showing full structure with objectives, implementation plan, testing strategy, and progress tracking.

---
