---
description: Primary command for executing tasks with AJ MAESTRO orchestration
---

# Trinity Orchestration

**Purpose:** Primary command for executing tasks during development sessions. AJ MAESTRO coordinates the 19-agent team to complete work, with automatic JUNO verification.

**Use throughout your session:** This command is used repeatedly as you work through tasks.

---

## Overview

`/trinity-orchestrate` is the **main execution command** in Trinity Method development. After you start a session with `/trinity-start` or `/trinity-continue`, you'll use this command repeatedly to execute work orders, perform investigations, and complete general tasks.

**Development Session Flow:**

```
/trinity-start or /trinity-continue
    ↓
/trinity-orchestrate (PRIMARY LOOP - used repeatedly)
    ↓
/trinity-end
```

**A session = User actively working with Claude Code**
**A session ≠ Claude Code's context window** (documentation persists across context boundaries)

---

## Usage Patterns

### 1. Orchestrate Work Orders (Formal Tasks)

```bash
/trinity-orchestrate @WO-XXX-{task-name}.md
```

**When to use:**

- Complex tasks requiring formal tracking
- Multi-step implementations
- Tasks spanning multiple context windows
- Work that needs quality verification

**Workflow:**

1. Create work order: `/trinity-workorder`
2. Work order saved to: `trinity/work-orders/WO-XXX-{task-name}.md`
3. Execute: `/trinity-orchestrate @WO-042-jwt-refresh.md`
4. **AJ MAESTRO** selects agents and orchestrates execution
5. **TWO DELIVERABLES CREATED:**
   a. **Implementation Report** (from work order template):
   `trinity/reports/[COMPONENT]-IMPLEMENTATION-COMPLETE-{timestamp}.md`
   b. **JUNO Audit Report** (automatic verification):
   `trinity/reports/AUDIT-WO-042-{date}.md`
6. 🚨 **CRITICAL: MOVE completed work order** from `trinity/work-orders/` to `trinity/sessions/`
   - **MANDATORY STEP** - Execute: `mv trinity/work-orders/WO-XXX-*.md trinity/sessions/`
   - **Verify work order NO LONGER exists in trinity/work-orders/**
7. **Reports remain** in `trinity/reports/` until session end
8. **Run `/trinity-end`** when session complete to archive all session files

**Example:**

```bash
/trinity-orchestrate @WO-042-jwt-refresh-implementation.md
```

---

### 2. Orchestrate Investigations (READ-ONLY Analysis)

```bash
/trinity-orchestrate @INV-XXX-{title}.md
```

**When to use:**

- Bug analysis and root cause investigation
- Performance investigation
- Security audits
- Technical decision research
- Architecture review

**Workflow:**

1. Create investigation: `/trinity-create-investigation`
2. Investigation saved to: `trinity/investigations/INV-XXX-{title}.md`
3. Execute: `/trinity-orchestrate @INV-015-performance-analysis.md`
4. **AJ MAESTRO** coordinates READ-ONLY investigation
5. Findings documented (no code changes)
6. **Investigation Report Created:**
   `trinity/reports/INV-015-findings-{date}.md`
   (See investigation template for required sections)
7. 🚨 **CRITICAL: MOVE completed investigation** from `trinity/investigations/` to `trinity/sessions/`
   - **MANDATORY STEP** - Execute: `mv trinity/investigations/INV-XXX-*.md trinity/sessions/`
   - **Verify investigation NO LONGER exists in trinity/investigations/**
8. **Report remains** in `trinity/reports/` until session end
9. **Run `/trinity-end`** when session complete to archive all session files

⚠️ **CRITICAL:** Investigations are READ-ONLY operations. No code changes during investigation phase. Implementation happens separately after investigation is complete.

**Example:**

```bash
/trinity-orchestrate @INV-015-database-performance-analysis.md
```

---

### 3. Orchestrate General Tasks (Quick Tasks)

```bash
/trinity-orchestrate "Task description"
```

**When to use:**

- Quick fixes without formal work order
- Simple bug fixes
- Documentation updates
- Configuration changes
- Exploratory work

**How it works:**

- AJ MAESTRO assesses task complexity
- Selects appropriate agents
- Executes with quality gates
- JUNO verifies completion
- No work order file needed

**Example:**

```bash
/trinity-orchestrate "Fix date validation bug in UserForm component"
```

**When to create work order instead:**

- Task affects 3+ files
- Implementation will take >2 hours
- Need formal tracking across context windows
- Complex enough to need planning phases

---

## AJ MAESTRO's Orchestration Process

When you invoke `/trinity-orchestrate`, here's what happens:

### Step 1: Task Analysis

**AJ MAESTRO reads and analyzes:**

- Work order file (if @WO-XXX provided)
- Investigation file (if @INV-XXX provided)
- Task description (if general task)

**Determines:**

- Task complexity and scope
- Required expertise areas
- Which agents are needed
- Quality gate requirements

---

### Step 2: Agent Selection

**AJ MAESTRO selects the best agent(s) for each phase:**

**Planning Agents:**

- **MON** - Requirements analysis, acceptance criteria, scale determination
- **ROR** - Technical design, function signatures, ADR documentation
- **TRA** - Strategic planning, task sequencing, timeline estimation
- **EUS** - Atomic task decomposition (1 task = 1 commit)

**Execution Agents:**

- **KIL** - TDD implementation (RED-GREEN-REFACTOR cycle)
- **BAS** - 6-phase quality gate validation
- **DRA** - Code review and Design Doc compliance verification

**Support Agents:**

- **APO** - API documentation and inline code comments
- **BON** - Dependency management and security scanning
- **CAP** - Configuration files and environment management
- **URO** - Code refactoring and technical debt reduction

**Audit Agent:**

- **JUNO** - Comprehensive quality audit and compliance verification

**Selection Criteria:**

- Small tasks (1-2 files): Direct to KIL + BAS
- Medium tasks (3-5 files): MON → ROR → TRA → KIL + BAS → DRA
- Large tasks (6+ files): Full agent workflow including EUS and JUNO

---

### Step 3: Coordinate Execution

**AJ MAESTRO manages the workflow:**

1. **Hands off to selected agent(s)**
   - Provides full context from work order/investigation
   - Ensures agent has all necessary information
   - Monitors agent progress

2. **Manages agent transitions**
   - Coordinates handoffs between agents
   - Ensures context preservation
   - Handles dependencies between phases

3. **Ensures quality gates are met**
   - BAS validates after each commit
   - DRA reviews before completion
   - Escalates issues if quality standards not met

4. **Handles escalations**
   - If complexity exceeds initial assessment
   - If blockers are encountered
   - If quality gates fail

---

### Step 4: JUNO Verification (Automatic)

**After task completion, JUNO automatically verifies:**

**Quality Criteria Checked:**

1. ✅ **BAS Quality Gates** - All 6 phases passed
   - Linting, structure, build, tests, coverage (≥80%), best practices

2. ✅ **Work Order Objectives** - All objectives met
   - Deliverables completed
   - Acceptance criteria satisfied

3. ✅ **Test Coverage** - Tests passing with adequate coverage
   - Unit tests for new code
   - Integration tests where applicable
   - Edge cases covered

4. ✅ **Documentation** - Updated appropriately
   - Code comments (if needed)
   - API documentation (if API changed)
   - README updates (if user-facing)

5. ✅ **Design Doc Compliance** - Follows design (if applicable)
   - Function signatures match design
   - Architecture decisions followed
   - Compliance score ≥70%

6. ✅ **Technical Debt** - No new debt introduced
   - No TODOs without tickets
   - No code duplication
   - Complexity within limits

**JUNO's Audit Report:**

- Saved to: `trinity/reports/AUDIT-{task-id}-{date}.md`
- Pass/Fail status for each criterion
- Overall assessment (APPROVED / REQUIRES FIXES)
- Recommendations for improvements
- Follow-up work orders (if issues found)

**What You See:**

```
JUNO: Audit complete ✅
- BAS gates: PASS ✅
- Test coverage: 92% ✅ (exceeds 80% threshold)
- Design Doc compliance: 85% ✅
- Technical debt: 0 new issues ✅
- Overall: APPROVED ✅

Task WO-042-jwt-refresh-implementation is complete and verified.
```

**If Issues Found:**

```
JUNO: Audit complete ⚠️
- BAS gates: PASS ✅
- Test coverage: 68% ❌ (below 80% threshold)
- Design Doc compliance: 75% ✅
- Overall: REQUIRES FIXES ⚠️

Recommendation: Add tests for error handling edge cases
Created follow-up: WO-043-jwt-test-coverage

Please address WO-043 before marking WO-042 complete.
```

---

### Step 5: Report to User

**AJ MAESTRO provides completion summary:**

- Work completed overview
- JUNO audit results (PASS/FAIL)
- Files changed and commits made
- Follow-up recommendations (if any)
- Next steps or follow-up work orders

---

## Session Workflow Context

### Development Session Lifecycle

**A development session:**

- Starts when user begins working (via `/trinity-start` or `/trinity-continue`)
- Continues with repeated `/trinity-orchestrate` invocations
- Ends when user finishes working (via `/trinity-end`)
- Is NOT tied to Claude Code's context window

```
┌─────────────────────────────────────────────────────┐
│         TRINITY DEVELOPMENT SESSION                 │
└─────────────────────────────────────────────────────┘

1. START SESSION
   ├─ /trinity-start (new session - includes workflow planning)
   └─ OR /trinity-continue (resume interrupted session)

2. EXECUTE TASKS (PRIMARY LOOP) ← MOST OF YOUR TIME
   │
   ├─ /trinity-orchestrate @WO-042.md
   │  └─ AJ MAESTRO → Agents → JUNO → Report
   │
   ├─ /trinity-orchestrate @INV-015.md
   │  └─ AJ MAESTRO → Investigation → JUNO → Findings
   │
   ├─ /trinity-orchestrate "Quick fix"
   │  └─ AJ MAESTRO → Quick execution → JUNO → Done
   │
   └─ Repeat as needed throughout your session

3. END SESSION
   └─ /trinity-end
      ├─ Archive completed work
      ├─ Update knowledge base
      └─ Create session summary
```

---

## ⚠️ CRITICAL: After Task Completion Workflow - MANDATORY STEPS

### 🚨 When You've Completed a Work Order or Investigation - DO NOT SKIP 🚨

**Step 1: Verify Deliverables Created** ✅

**Work Orders:**

- [ ] Implementation report in `trinity/reports/[COMPONENT]-IMPLEMENTATION-COMPLETE-{timestamp}.md`
- [ ] JUNO audit report in `trinity/reports/AUDIT-WO-XXX-{date}.md` (if applicable)

**Investigations:**

- [ ] Findings report in `trinity/reports/INV-XXX-findings-{date}.md`
- [ ] All required sections completed (summary, findings, root cause, recommendations, evidence)

**Step 2: 🚨 MOVE THE COMPLETED FILE TO SESSIONS/ 🚨** ✅

**THIS STEP IS MANDATORY - Work orders left in trinity/work-orders/ are considered INCOMPLETE.**

```bash
# Work Order Example - EXECUTE THIS IMMEDIATELY AFTER CREATING DELIVERABLE
mv trinity/work-orders/WO-042-jwt-refresh.md trinity/sessions/

# Investigation Example - EXECUTE THIS IMMEDIATELY AFTER CREATING FINDINGS REPORT
mv trinity/investigations/INV-015-performance-analysis.md trinity/sessions/
```

**Step 3: Verify File Locations** ✅

**CRITICAL VERIFICATION - If this fails, the task is NOT complete:**

**For Work Orders:**

- [ ] Work order file NOW EXISTS in: `trinity/sessions/WO-XXX-*.md`
- [ ] Deliverable report exists in: `trinity/reports/[COMPONENT]-IMPLEMENTATION-COMPLETE-*.md`
- [ ] Work order file NO LONGER EXISTS in: `trinity/work-orders/`

**For Investigations:**

- [ ] Investigation file NOW EXISTS in: `trinity/sessions/INV-XXX-*.md`
- [ ] Findings report exists in: `trinity/reports/INV-XXX-findings-*.md`
- [ ] Investigation file NO LONGER EXISTS in: `trinity/investigations/`

**If any verification fails, STOP and fix immediately before proceeding.**

**Step 4: Continue Working or End Session**

**If continuing work in same session:**

- Reports remain in `trinity/reports/` (available for reference)
- Completed WOs/INVs in `trinity/sessions/` (out of active work queue)
- Proceed with next task

**If session is complete:**

```bash
/trinity-end
```

This will:

- Archive ALL files from `trinity/sessions/` → `trinity/archive/sessions/YYYY-MM-DD/`
- Archive ALL files from `trinity/reports/` → `trinity/archive/reports/YYYY-MM-DD/`
- Archive completed work orders → `trinity/archive/work-orders/YYYY-MM-DD/`
- Archive completed investigations → `trinity/archive/investigations/YYYY-MM-DD/`
- Create session summary in `trinity/archive/sessions/YYYY-MM-DD/`
- **Result:** Clean `trinity/sessions/` and `trinity/reports/` folders for next session

---

## Session File Organization

**Active Session:**

```
trinity/
├── work-orders/          # Active work orders (not yet completed)
├── investigations/       # Active investigations (not yet completed)
├── sessions/            # Completed WOs/INVs (awaiting archival)
├── reports/             # All session reports (awaiting archival)
```

**After /trinity-end:**

```
trinity/
├── work-orders/          # EMPTY (all active work complete or in-progress only)
├── investigations/       # EMPTY (all active investigations complete or in-progress only)
├── sessions/            # EMPTY (all archived)
├── reports/             # EMPTY (all archived)
├── archive/
│   ├── work-orders/YYYY-MM-DD/    # Completed work orders
│   ├── investigations/YYYY-MM-DD/ # Completed investigations
│   ├── reports/YYYY-MM-DD/        # All session reports
│   └── sessions/YYYY-MM-DD/       # Session summaries
```

**Clean Slate:** Every new session starts with empty sessions/ and reports/ folders.

---

### Context Window Management

**Key Understanding:**

- **Session** = You working at the computer
- **Context Window** = Claude Code's current memory limit
- **Sessions can span multiple context windows**

**How Trinity Handles Context Loss:**

1. **Documentation Persists:**
   - Work orders: `trinity/work-orders/WO-XXX.md`
   - Investigations: `trinity/investigations/INV-XXX.md`
   - JUNO reports: `trinity/reports/AUDIT-*.md`
   - Knowledge base: `trinity/knowledge-base/*.md`

2. **When Context Window Is Exceeded:**
   - Current work is automatically documented
   - Session state saved to `trinity/sessions/SESSION-{timestamp}.md`
   - Use `/trinity-continue` to resume
   - AJ MAESTRO reads files to understand current state
   - JUNO reports show what's been completed
   - Work continues seamlessly

3. **Recovery Process (`/trinity-continue`):**
   - ALY (CTO) analyzes current state from files
   - Reviews work orders, investigations, reports
   - Provides session summary
   - Recommends how to proceed
   - Hands off to AJ MAESTRO to continue

**Example:**

```
[Context window limit approaching during WO-042]

System: Context window at 95%. Documenting current state...
[Saves progress to work order file and session log]

[User starts new context window]

User: /trinity-continue

ALY: Analyzing session state...
- Work Order: WO-042 (50% complete, 3/6 tasks done)
- Last activity: Implementing middleware (Task 3)
- Uncommitted changes: src/middleware/auth.middleware.ts

Recommendation: Resume with AJ MAESTRO to complete WO-042.

Shall I hand off to AJ MAESTRO to continue?

User: Yes

AJ MAESTRO: Resuming WO-042... Reading current state...
[Continues from Task 4]
```

---

## Real-World Examples

### Example 1: Work Order Execution

````
User: /trinity-orchestrate @WO-042-jwt-refresh-implementation.md

AJ MAESTRO: Reading work order WO-042...

**Analysis:**
- Task: JWT token refresh implementation
- Complexity: MEDIUM (4 files affected)
- Estimated time: 4-6 hours
- Agents needed: MON → ROR → TRA → KIL + BAS → DRA → JUNO

**Execution Plan:**
1. Requirements analysis (MON)
2. Technical design (ROR)
3. Implementation planning (TRA)
4. TDD implementation (KIL + BAS)
5. Code review (DRA)
6. Final audit (JUNO)

Proceeding...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 1: Requirements (MON)**

MON: Analyzing work order requirements...

✅ Functional Requirements:
- Automatic token refresh on expiry
- HttpOnly cookie storage
- Race condition handling

✅ Acceptance Criteria:
- Given: User has expired token
- When: Authenticated request is made
- Then: Token refreshes automatically without user action

✅ Risks Identified:
- Race conditions with concurrent requests
- Token theft if not properly secured

Requirements analysis complete.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 2: Technical Design (ROR)**

ROR: Creating technical design...

✅ Function Signatures:
```typescript
interface RefreshTokenOptions {
  expiryBuffer: number; // milliseconds before expiry to refresh
}

async refreshToken(userId: string, options: RefreshTokenOptions): Promise<TokenPair>
async validateAndRefreshIfNeeded(token: string): Promise<TokenPair | null>
````

✅ Architecture Decision Record (ADR):

- Decision: Use HTTP-only cookies for refresh tokens
- Rationale: Prevents XSS attacks, more secure than localStorage
- Trade-offs: Slightly more complex server-side management

Design complete. Design Doc compliance criteria: ≥70%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 3: Implementation Planning (TRA)**

TRA: Creating implementation plan...

✅ Task Breakdown:

1. Create token refresh service
2. Implement refresh middleware
3. Add token validation logic
4. Handle race conditions (mutex)
5. Add error handling
6. Write unit tests
7. Write integration tests
8. Update API documentation

Sequencing: Tasks 1-2 must complete before 3-4 (dependencies)
Tasks 6-7 can run in parallel (independent)

Estimated time: 4-6 hours (with 20% parallelization savings)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 4: Implementation (KIL + BAS)**

KIL: Beginning TDD implementation...

**Task 1/8: Create token refresh service**

RED: Writing failing test...

```typescript
describe('TokenRefreshService', () => {
  it('should refresh token before expiry', async () => {
    // Test implementation
  });
});
```

❌ Test fails (expected - no implementation yet)

GREEN: Implementing minimal code...

```typescript
class TokenRefreshService {
  async refreshToken(userId: string, options: RefreshTokenOptions) {
    // Implementation
  }
}
```

✅ Test passes

REFACTOR: Cleaning up...
✅ Code optimized

**BAS Quality Gates:**

1. Linting: PASS ✅ (auto-fixed 2 formatting issues)
2. Structure: PASS ✅
3. Build: PASS ✅
4. Testing: PASS ✅ (1/1 tests passing)
5. Coverage: 95% ✅ (exceeds 80%)
6. Best Practices: PASS ✅

✅ Commit: "feat(auth): add token refresh service"

[Continues for Tasks 2-8...]

**Task 8/8: Update API documentation**
✅ API docs updated
✅ BAS gates: ALL PASS
✅ Commit: "docs(auth): document token refresh endpoints"

Implementation complete: 7 commits, all tests passing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 5: Code Review (DRA)**

DRA: Reviewing implementation...

✅ Design Doc Compliance Check:

- Function signatures match design: ✅
- Error handling strategy followed: ✅
- ADR decisions implemented: ✅
- Compliance score: 85% ✅ (exceeds 70% threshold)

✅ Code Quality:

- No code duplication: ✅
- Function complexity within limits: ✅
- Test coverage: 92% ✅
- Documentation complete: ✅

Code review: APPROVED ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 6: Final Audit (JUNO)**

JUNO: Performing comprehensive audit...

**Quality Verification:**

1. BAS Quality Gates: PASS ✅
   - All 6 phases passed on every commit

2. Work Order Objectives: COMPLETE ✅
   - All deliverables provided
   - All acceptance criteria met

3. Test Coverage: 92% ✅
   - Exceeds 80% threshold
   - Edge cases covered
   - Integration tests comprehensive

4. Documentation: COMPLETE ✅
   - API docs updated
   - Inline comments added
   - README unchanged (not needed)

5. Design Doc Compliance: 85% ✅
   - Exceeds 70% threshold
   - All ADR decisions followed

6. Technical Debt: 0 NEW ISSUES ✅
   - No TODOs without tickets
   - No code duplication introduced
   - Complexity within limits

**Overall Assessment: APPROVED ✅**

Audit report saved to:
`trinity/reports/AUDIT-WO-042-2025-12-19.md`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**AJ MAESTRO: Task Complete**

✅ Work Order: WO-042-jwt-refresh-implementation
✅ Status: COMPLETE AND VERIFIED
✅ Commits: 7 commits
✅ Files Changed: 4 files (auth.service.ts, auth.middleware.ts, auth.types.ts, auth.test.ts)
✅ Test Coverage: 92%
✅ JUNO Audit: APPROVED

**Next Steps:**

- Deploy to staging environment for testing
- Monitor for edge cases in production
- OR continue with next task: /trinity-orchestrate @WO-043.md

```

---

### Example 2: Investigation Execution

```

User: /trinity-orchestrate @INV-015-database-performance-analysis.md

AJ MAESTRO: Reading investigation INV-015...

**Analysis:**

- Type: Performance Investigation (READ-ONLY)
- Scope: Database query performance degradation
- Evidence: API response time increased 300%
- Agents needed: Investigation workflow (READ-ONLY mode)

⚠️ **Investigation Mode:** No code changes will be made.

Proceeding with investigation...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 1: Data Collection**

Collecting performance metrics...
✅ APM traces collected (last 7 days)
✅ Database slow query log analyzed
✅ Query execution plans captured
✅ Resource utilization metrics gathered

**Key Findings:**

- Average query time: 2.3s (was 0.5s)
- Slowest query: getUserOrders (5.2s average)
- Execution count: 500+ queries per page load

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 2: Analysis**

Analyzing query patterns...

**Root Cause Identified:**
❌ **N+1 Query Pattern in getUserOrders**

```sql
-- Main query (executed once)
SELECT * FROM orders WHERE user_id = 123;

-- N+1 queries (executed 500 times!)
SELECT * FROM users WHERE id = ?;  -- For each order
```

**Missing Indexes Found:**
❌ No index on `orders.user_id`
❌ No index on `user_metadata.user_id`
❌ No compound index on `orders(user_id, created_at)`

**Performance Impact:**

- Full table scans on 100k+ row tables
- 500+ individual queries instead of 1 JOIN
- No query result caching

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 3: Recommendations**

**Recommendation 1: Add Database Indexes**
Priority: HIGH
Estimated effort: 2 hours
Expected improvement: 60-70% reduction in query time

```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_user_metadata_user_id ON user_metadata(user_id);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);
```

**Recommendation 2: Fix N+1 Query Pattern**
Priority: HIGH
Estimated effort: 3 hours
Expected improvement: 80% reduction in query count

```typescript
// Current (N+1 queries)
const orders = await Order.findAll({ where: { userId } });
for (const order of orders) {
  order.user = await User.findByPk(order.userId); // N queries!
}

// Fixed (1 query with JOIN)
const orders = await Order.findAll({
  where: { userId },
  include: [{ model: User }], // Eager loading
});
```

**Recommendation 3: Implement Query Result Caching**
Priority: MEDIUM
Estimated effort: 4 hours
Expected improvement: Additional 40% improvement for repeated queries

```typescript
const cacheKey = `user_orders_${userId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const orders = await getOrdersWithUsers(userId);
await redis.set(cacheKey, JSON.stringify(orders), 'EX', 300); // 5 min TTL
```

**Total Expected Improvement:**

- Query time: 2.3s → 0.4s (83% improvement)
- Query count: 500+ → 1 (99.8% reduction)
- API response time: Within target (<500ms)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 4: JUNO Audit**

JUNO: Auditing investigation completeness...

**Investigation Quality Check:**

1. Problem Statement: CLEAR ✅
2. Data Collection: COMPREHENSIVE ✅
3. Root Cause Analysis: EVIDENCE-BASED ✅
4. Recommendations: ACTIONABLE ✅
5. Effort Estimates: PROVIDED ✅
6. Expected Impact: QUANTIFIED ✅

**Overall: INVESTIGATION COMPLETE ✅**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**AJ MAESTRO: Investigation Complete**

✅ Investigation: INV-015-database-performance-analysis
✅ Status: COMPLETE AND VERIFIED
✅ Root Cause: N+1 queries + missing indexes
✅ Recommendations: 3 actionable items with effort estimates

**Findings Report:**
`trinity/reports/INV-015-findings-2025-12-19.md`

**Follow-Up Work Orders Created:**

- WO-043-database-index-optimization (HIGH priority, 2 hours)
- WO-044-fix-n-plus-one-queries (HIGH priority, 3 hours)
- WO-045-implement-query-caching (MEDIUM priority, 4 hours)

**Next Steps:**

1. Review findings report
2. Approve work orders for implementation
3. Execute with: /trinity-orchestrate @WO-043.md

```

---

### Example 3: Quick Task (No Work Order)

```

User: /trinity-orchestrate "Fix date validation bug in UserForm component"

AJ MAESTRO: Analyzing task...

**Assessment:**

- Type: Bug fix
- Complexity: SMALL (1 file)
- Estimated time: <1 hour
- Approach: Direct implementation with BAS gates

I'll handle this without a formal work order.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 1: Analysis**

Reviewing UserForm component...

**Bug Identified:**
❌ Date validation accepts invalid formats (e.g., "13/32/2025")
❌ No edge case handling for leap years
❌ Missing test coverage for date validation

**Fix Required:**

- Add proper date format validation
- Handle edge cases (leap years, invalid dates)
- Write comprehensive tests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 2: Implementation (TDD)**

**RED: Write failing tests**

```typescript
describe('UserForm date validation', () => {
  it('should reject invalid date formats', () => {
    expect(validateDate('13/32/2025')).toBe(false);
  });

  it('should handle leap years correctly', () => {
    expect(validateDate('02/29/2024')).toBe(true); // Leap year
    expect(validateDate('02/29/2023')).toBe(false); // Not leap year
  });
});
```

❌ Tests fail (expected - no validation yet)

**GREEN: Implement fix**

```typescript
function validateDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}
```

✅ Tests pass

**REFACTOR: Improve validation**

```typescript
function validateDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }

  // Ensure date string round-trips correctly
  const roundTrip = date.toISOString().split('T')[0];
  return roundTrip === dateStr;
}
```

✅ Tests still pass, validation more robust

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 3: BAS Quality Gates**

1. **Linting:** PASS ✅
   - Auto-fixed 1 formatting issue

2. **Structure:** PASS ✅
   - File organization correct

3. **Build:** PASS ✅
   - TypeScript compilation successful

4. **Testing:** PASS ✅
   - All 52 tests passing (added 5 new tests)

5. **Coverage:** 91% ✅
   - Exceeds 80% threshold
   - Edge cases covered

6. **Best Practices:** PASS ✅
   - Function complexity: LOW
   - No code duplication

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 4: JUNO Verification**

JUNO: Verifying quick fix...

**Quality Check:**

1. Bug fixed: CONFIRMED ✅
2. Tests comprehensive: YES ✅
3. No regressions: VERIFIED ✅
4. Code quality: EXCELLENT ✅

**Overall: APPROVED ✅**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**AJ MAESTRO: Task Complete**

✅ Bug: Date validation fixed
✅ Tests: 5 new tests added (all passing)
✅ Coverage: 91%
✅ BAS Gates: ALL PASS
✅ JUNO: APPROVED

**Commit:** "fix(UserForm): validate date format edge cases"

**Files Changed:**

- src/components/UserForm.tsx (validation logic)
- src/components/UserForm.test.tsx (5 new tests)

Task complete. Ready for next task.

````

---

## When NOT to Use /trinity-orchestrate

**Don't use for:**

❌ **Starting a session**
→ Use `/trinity-start` (new session) or `/trinity-continue` (resume)

❌ **Creating work orders**
→ Use `/trinity-workorder` to create, then orchestrate it

❌ **Creating investigations**
→ Use `/trinity-create-investigation` to create, then orchestrate it

❌ **Ending your session**
→ Use `/trinity-end` to archive work and update knowledge base

❌ **Planning workflows**
→ Use `/trinity-start` (includes workflow planning guidance)

**Use /trinity-orchestrate for:**

✅ Executing work orders
✅ Performing investigations
✅ Completing general tasks
✅ Any actual development work during your session

---

## Related Commands

### Session Management
- `/trinity-start` - Begin new development session (includes workflow planning)
- `/trinity-continue` - Resume interrupted session (ALY analyzes state)
- `/trinity-end` - End session and archive work

### Task Creation
- `/trinity-workorder` - Create formal work order for complex tasks
- `/trinity-create-investigation` - Create investigation for analysis
- `/trinity-plan-investigation` - Generate investigation execution plan

### Specialized Planning
- `/trinity-requirements` - Deep requirements analysis with MON
- `/trinity-design` - Technical design creation with ROR
- `/trinity-plan` - Implementation planning with TRA
- `/trinity-decompose` - Atomic task decomposition with EUS

### Utilities
- `/trinity-verify` - Verify Trinity installation completeness
- `/trinity-agents` - View all 19 Trinity agents and their roles

---

## Summary

**Primary Development Command:** `/trinity-orchestrate` is your main execution command during development sessions.

**Key Points:**
1. **AJ MAESTRO orchestrates:** Selects best agents for each task
2. **JUNO verifies automatically:** Every task gets quality audit
3. **Used repeatedly:** Throughout your session, not just once
4. **Three usage patterns:** @WO-XXX (work orders), @INV-XXX (investigations), "description" (quick tasks)
5. **Session ≠ Context window:** Documentation persists, use `/trinity-continue` to resume

**Typical Session Flow:**
```bash
/trinity-start                                    # Begin session
/trinity-orchestrate @WO-042-jwt-refresh.md      # Execute work order
/trinity-orchestrate @INV-015-performance.md     # Investigate issue
/trinity-orchestrate "Fix validation bug"        # Quick fix
# ... repeat as needed throughout session ...
/trinity-end                                      # End session
````

**Next:** Describe your task, provide a work order/investigation file, or continue working on your current task. AJ MAESTRO will orchestrate execution with automatic JUNO verification.
