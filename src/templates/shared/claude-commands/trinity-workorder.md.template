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
1. **Work Order Type** - Select template:
   - Investigation Work Order (from `trinity/templates/work-orders/INVESTIGATION-TEMPLATE.md`)
   - Implementation Work Order (from `trinity/templates/work-orders/IMPLEMENTATION-TEMPLATE.md`)
   - Analysis Work Order (from `trinity/templates/work-orders/ANALYSIS-TEMPLATE.md`)
   - Audit Work Order (from `trinity/templates/work-orders/AUDIT-TEMPLATE.md`)
   - Pattern Work Order (from `trinity/templates/work-orders/PATTERN-TEMPLATE.md`)
   - Verification Work Order (from `trinity/templates/work-orders/VERIFICATION-TEMPLATE.md`)

2. **Task Description** - Brief description of work needed
3. **Objectives** - What needs to be accomplished
4. **Deliverables** - Expected outputs
5. **Estimated Time** - Time estimate
6. **Priority** - Low/Medium/High/Critical (optional)

**Workflow**:
1. Select appropriate template from `trinity/templates/work-orders/`
2. Fill out template with task details
3. Save completed work order to `trinity/work-orders/WO-XXX-{task-name}.md`
4. Execute with `/trinity-orchestrate @WO-XXX-{task-name}.md`

---

## Orchestration

Once work order is created in `trinity/work-orders/`, execute it:

```bash
/trinity-orchestrate @WO-001-example-task.md
```

**AJ MAESTRO** picks up the work order from `trinity/work-orders/` and orchestrates the 19-agent team to complete the task following Trinity Method workflows.

---

## Complete Example

See WO-042 example in work order files showing full structure with objectives, implementation plan, testing strategy, and progress tracking.

---

## Available Templates

Work order templates are located in `trinity/templates/work-orders/`:
- **INVESTIGATION-TEMPLATE.md** - Research and analysis tasks
- **IMPLEMENTATION-TEMPLATE.md** - Feature development tasks
- **ANALYSIS-TEMPLATE.md** - Code analysis and review tasks
- **AUDIT-TEMPLATE.md** - Quality and compliance audits
- **PATTERN-TEMPLATE.md** - Pattern detection and analysis
- **VERIFICATION-TEMPLATE.md** - Verification and validation tasks

---

## Real-World Examples

### Example 1: Implementation Work Order
**Work Order:** WO-042-jwt-refresh-implementation
**Template:** Implementation
**Priority:** High
**Estimated Time:** 2 days

**Objectives:**
1. Implement automatic JWT token refresh
2. Handle edge cases (expired tokens, race conditions)
3. Add comprehensive test coverage

**Deliverables:**
- Token refresh middleware
- Unit tests (≥80% coverage)
- Integration tests for refresh flow
- API documentation update

**Outcome:**
- Completed in 1.5 days
- Test coverage: 92%
- All acceptance criteria met
- Zero production incidents post-deployment

---

### Example 2: Investigation Work Order
**Work Order:** WO-015-database-performance-analysis
**Template:** Investigation
**Priority:** Critical
**Estimated Time:** 1 day

**Objectives:**
1. Identify cause of 300% increase in query times
2. Analyze database query patterns
3. Recommend optimization strategy

**Deliverables:**
- Performance analysis report
- Query execution plan analysis
- Optimization recommendations with effort estimates

**Outcome:**
- Root cause: Missing indexes on new user_metadata table
- Recommended 3 compound indexes
- Created follow-up work order WO-016 for implementation

---

### Example 3: Audit Work Order
**Work Order:** WO-023-security-dependency-audit
**Template:** Audit
**Priority:** Medium
**Estimated Time:** 4 hours

**Objectives:**
1. Audit all npm dependencies for vulnerabilities
2. Assess CVSS scores and exploitability
3. Create remediation plan

**Deliverables:**
- Dependency vulnerability report
- Risk assessment (Critical/High/Medium/Low)
- Upgrade path for vulnerable packages

**Outcome:**
- 12 vulnerabilities found (3 critical, 5 high, 4 medium)
- All critical issues resolved immediately
- Documented upgrade blockers for 2 high-severity issues

---

### Example 4: Analysis Work Order
**Work Order:** WO-031-codebase-complexity-analysis
**Template:** Analysis
**Priority:** Low
**Estimated Time:** 1 day

**Objectives:**
1. Analyze codebase complexity metrics
2. Identify refactoring candidates
3. Prioritize technical debt reduction

**Deliverables:**
- Complexity metrics report (cyclomatic complexity, coupling)
- Top 10 files needing refactoring
- Technical debt reduction roadmap

**Outcome:**
- Identified 8 files with cyclomatic complexity >15
- Created 4 follow-up work orders for refactoring
- Established baseline metrics for future tracking

---

### Example 5: Verification Work Order
**Work Order:** WO-050-production-deployment-verification
**Template:** Verification
**Priority:** Critical
**Estimated Time:** 2 hours

**Objectives:**
1. Verify payment processing deployment to production
2. Validate all smoke tests pass
3. Confirm monitoring and alerts operational

**Deliverables:**
- Deployment verification checklist (completed)
- Smoke test results (all passing)
- Rollback plan (if needed)

**Outcome:**
- All 24 smoke tests passed
- Monitoring confirmed normal operation
- No rollback required
- Payment processing 100% operational

---

## Template Selection Guide

**Use this decision tree:**

```
Do you need to implement new code or features?
  → YES: Use Implementation Template

Do you need to research or investigate something?
  → YES: Use Investigation Template

Do you need to analyze code, architecture, or metrics?
  → YES: Use Analysis Template

Do you need to audit quality, security, or compliance?
  → YES: Use Audit Template

Do you need to identify or document patterns?
  → YES: Use Pattern Template

Do you need to verify deployment or validate results?
  → YES: Use Verification Template
```

---
