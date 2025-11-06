# Implementation Workflow

**Scale-Based Implementation with Trinity SDK**

---

## Overview

Implementation follows investigation. This workflow guides you through systematic implementation using SDK agents, TDD enforcement, and automatic quality gates.

---

## Scale Determination

**ALY determines scale based on investigation findings:**

```yaml
Small Scale (0-4 hours):
  - Bug fixes
  - Minor enhancements
  - Configuration changes
  - Stop Points: 0
  - Design Doc: Not required

Medium Scale (4-16 hours):
  - New features (single component)
  - Moderate refactoring
  - API changes
  - Stop Points: 1 (after design review)
  - Design Doc: Required (ROR)

Large Scale (16+ hours):
  - Major features (multiple components)
  - Architecture changes
  - System-wide refactoring
  - Stop Points: 4 (design, mid-implementation, pre-merge, post-deployment)
  - Design Doc: Required + comprehensive (ROR)
```

---

## Implementation Process by Scale

### Small Scale Implementation

**Agents:** KIL (execution) + BAS (quality)

**Workflow:**
```typescript
Investigation Approved
    ↓
KIL: Implement with TDD
    ├── RED: Write failing test
    ├── GREEN: Minimal code to pass
    └── REFACTOR: Clean code
    ↓
BAS: 6-Phase Quality Gate (automatic after each KIL task)
    ├── Phase 1: Linting
    ├── Phase 2: Structure validation
    ├── Phase 3: Build
    ├── Phase 4: Testing
    ├── Phase 5: Coverage ≥80%
    └── Phase 6: Best practices
    ↓
Implementation Complete
```

**No stop points** - quality enforced automatically by BAS.

---

### Medium Scale Implementation

**Agents:** ROR (design) → KIL (execution) → BAS (quality) → DRA (review)

**Workflow:**
```typescript
Investigation Approved
    ↓
ROR: Create Design Document
    - Component architecture
    - Interface definitions
    - Data flow diagrams
    - Testing strategy
    ↓
STOP POINT #1: Design Review
    User reviews: trinity/design-docs/YYYY-MM-DD-feature-name.md
    ↓
KIL: Implement with TDD (task-by-task)
    For each atomic task:
        ├── RED: Write failing test
        ├── GREEN: Minimal code to pass
        ├── REFACTOR: Clean code
        └── BAS: 6-Phase Quality Gate
    ↓
DRA: Design Doc Compliance Review
    - Validates implementation matches design
    - Checks function parameters ≤2
    - Verifies nesting depth ≤4
    - Confirms error handling present
    ↓
Implementation Complete
```

**Stop Point #1 Deliverables:**
- Design document (trinity/design-docs/)
- Component diagrams
- Interface specifications
- Testing strategy

---

### Large Scale Implementation

**Agents:** MON (requirements) → ROR (design) → TRA (planning) → EUS (decomposition) → KIL (execution) → BAS (quality) → DRA (review) → JUNO (audit)

**Workflow:**
```typescript
Investigation Approved
    ↓
MON: Requirements Analysis
    - Acceptance criteria
    - Success metrics
    - User workflows
    ↓
ROR: Comprehensive Design Document
    - System architecture
    - Component interactions
    - Database schema changes
    - API specifications
    - Security considerations
    - Performance requirements
    ↓
STOP POINT #1: Design Review
    User reviews: trinity/design-docs/YYYY-MM-DD-feature-name.md
    ↓
TRA: Implementation Plan
    - Work breakdown
    - Dependencies
    - Time estimates
    - Risk mitigation
    ↓
EUS: Task Decomposition
    - Atomic tasks (2-4 hours each)
    - Task dependencies
    - Test requirements per task
    ↓
KIL: Implement (task-by-task with TDD)
    For each atomic task:
        ├── RED: Write failing test
        ├── GREEN: Minimal code to pass
        ├── REFACTOR: Clean code
        └── BAS: 6-Phase Quality Gate
    ↓
STOP POINT #2: Mid-Implementation Review
    - 50% task completion
    - Design adherence check
    - Performance baseline check
    ↓
KIL: Continue implementation
    (Remaining tasks with TDD + BAS)
    ↓
DRA: Comprehensive Code Review
    - Design Doc compliance
    - Code quality standards
    - Security review
    - Performance analysis
    ↓
STOP POINT #3: Pre-Merge Review
    User reviews:
        - All implementation code
        - Test coverage report
        - DRA review findings
        - Performance benchmarks
    ↓
Merge to main branch
    ↓
JUNO: Post-Deployment Audit
    - Security audit
    - Performance audit
    - Technical debt assessment
    - Learning extraction
    ↓
STOP POINT #4: Post-Deployment Review
    User reviews: trinity/audits/YYYY-MM-DD-feature-name.md
    ↓
Implementation Complete
```

**Stop Point Deliverables:**
- **SP #1:** Design document, architecture diagrams, API specs
- **SP #2:** 50% implementation, baseline metrics, design adherence report
- **SP #3:** Complete implementation, test coverage ≥80%, DRA review
- **SP #4:** JUNO audit report, performance analysis, technical debt assessment

---

## TDD Cycle (KIL Agent)

**RED-GREEN-REFACTOR Enforcement:**

### Phase 1: RED (Write Failing Test)

```typescript
// Example: Adding pagination to user list
describe('UserService.listUsers', () => {
  it('should return paginated results', async () => {
    // Arrange
    const mockUsers = createMockUsers(25);
    await db.users.insertMany(mockUsers);

    // Act
    const result = await userService.listUsers({ page: 1, limit: 10 });

    // Assert
    expect(result.users).toHaveLength(10);
    expect(result.total).toBe(25);
    expect(result.page).toBe(1);
    expect(result.hasMore).toBe(true);
  });
});

// Run: npm test
// Expected: ❌ FAIL (pagination not implemented yet)
```

**KIL verifies:** Test fails for the right reason (feature not implemented, not syntax error).

---

### Phase 2: GREEN (Minimal Code to Pass)

```typescript
// Minimal implementation to pass test
interface PaginatedResult<T> {
  users: T[];
  total: number;
  page: number;
  hasMore: boolean;
}

async listUsers(options: { page: number; limit: number }): Promise<PaginatedResult<User>> {
  const skip = (options.page - 1) * options.limit;

  const [users, total] = await Promise.all([
    db.users.find().skip(skip).limit(options.limit).toArray(),
    db.users.countDocuments()
  ]);

  return {
    users,
    total,
    page: options.page,
    hasMore: skip + users.length < total
  };
}

// Run: npm test
// Expected: ✅ PASS
```

**KIL verifies:** Test passes, minimal code added (no premature optimization).

---

### Phase 3: REFACTOR (Clean Code)

```typescript
// Refactor for clarity and reusability
interface PaginationOptions {
  page: number;
  limit: number;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

async listUsers(options: PaginationOptions): Promise<PaginatedResult<User>> {
  this.validatePaginationOptions(options);

  const skip = this.calculateSkip(options.page, options.limit);

  const [users, total] = await this.fetchPaginatedData(skip, options.limit);

  return this.buildPaginatedResult(users, total, options);
}

private validatePaginationOptions(options: PaginationOptions): void {
  if (options.page < 1) throw new ValidationError('Page must be >= 1');
  if (options.limit < 1 || options.limit > 100) {
    throw new ValidationError('Limit must be between 1 and 100');
  }
}

private calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

private async fetchPaginatedData(
  skip: number,
  limit: number
): Promise<[User[], number]> {
  return Promise.all([
    db.users.find().skip(skip).limit(limit).toArray(),
    db.users.countDocuments()
  ]);
}

private buildPaginatedResult(
  users: User[],
  total: number,
  options: PaginationOptions
): PaginatedResult<User> {
  const skip = this.calculateSkip(options.page, options.limit);

  return {
    data: users,
    pagination: {
      total,
      page: options.page,
      limit: options.limit,
      hasMore: skip + users.length < total
    }
  };
}

// Run: npm test
// Expected: ✅ PASS (all tests still pass after refactoring)
```

**KIL verifies:**
- All tests still pass
- Functions ≤2 parameters
- Function length <200 lines
- Nesting depth ≤4
- Error handling present

---

### Phase 4: BAS Quality Gate (Automatic)

```bash
BAS 6-Phase Quality Gate:

[1/6] Linting...
  ✓ ESLint passed
  ✓ Prettier formatting verified

[2/6] Structure Validation...
  ✓ Functions ≤2 parameters
  ✓ Function length <200 lines
  ✓ Nesting depth ≤4 levels

[3/6] Build...
  ✓ TypeScript compilation successful
  ✓ No type errors

[4/6] Testing...
  ✓ All tests passed (127/127)
  ✓ No test failures

[5/6] Coverage...
  ✓ Coverage: 89.4% (threshold: 80%)
  ✓ New code coverage: 100%

[6/6] Best Practices...
  ✓ Error handling present
  ✓ Async functions have try-catch
  ✓ No console.log in production code
  ✓ Types exported from @shared/types

✅ Quality Gate PASSED - Ready for next task
```

**If any phase fails:** KIL must fix before proceeding to next task.

---

## Agent Coordination

### Planning Agents (MON, ROR, TRA, EUS)

**MON (Requirements Analyst):**
- Analyzes user requirements
- Defines acceptance criteria
- Creates success metrics
- Documents user workflows

**ROR (Design Architect):**
- Creates Design Document
- Defines component architecture
- Specifies interfaces and data flow
- Plans testing strategy

**TRA (Work Planner):**
- Creates implementation plan
- Estimates effort
- Identifies dependencies
- Plans risk mitigation

**EUS (Task Decomposer):**
- Breaks work into atomic tasks (2-4 hours)
- Defines task dependencies
- Specifies test requirements per task
- Creates task execution order

---

### Execution Agent (KIL)

**KIL (Task Executor):**
- Executes atomic tasks one at a time
- Enforces TDD cycle (RED-GREEN-REFACTOR)
- Triggers BAS quality gate after each task
- Documents implementation notes
- Extracts patterns for Learning System

**KIL operates in strict sequence:**
```
Task 1: RED → GREEN → REFACTOR → BAS Gate
    ↓ (only if gate passes)
Task 2: RED → GREEN → REFACTOR → BAS Gate
    ↓ (only if gate passes)
Task 3: RED → GREEN → REFACTOR → BAS Gate
```

**KIL NEVER:**
- Skips tests
- Proceeds after failed quality gate
- Implements without RED phase
- Refactors without passing tests

---

### Quality Agents (BAS, DRA)

**BAS (Quality Gate):**
- Executes automatically after every KIL task
- 6-phase validation (lint, structure, build, test, coverage, best practices)
- Blocks progression if any phase fails
- Reports quality metrics to Performance Tracker

**DRA (Code Reviewer):**
- Reviews at stop points (Medium/Large scale)
- Validates Design Doc compliance
- Checks code quality standards
- Escalates issues to user if non-compliant

---

### Audit Agent (JUNO)

**JUNO (Quality Auditor):**
- Performs comprehensive audit (Large scale only)
- Security assessment (OWASP Top 10)
- Performance analysis (baseline comparison)
- Technical debt identification
- Learning extraction for Knowledge Base

---

## Stop Point Procedures

### Stop Point #1: Design Review (Medium/Large)

**Deliverables:**
- `trinity/design-docs/YYYY-MM-DD-feature-name.md`
- Architecture diagrams
- Interface specifications
- Testing strategy

**User Actions:**
1. Review Design Document thoroughly
2. Check component architecture
3. Verify interface definitions
4. Approve or request changes

**Response:**
- "Approve" → Proceed to implementation
- "Changes needed: [details]" → ROR revises design

---

### Stop Point #2: Mid-Implementation (Large)

**Triggered:** After 50% of tasks completed

**Deliverables:**
- Implementation progress report
- Design adherence check
- Performance baseline comparison
- Test coverage report (current state)

**User Actions:**
1. Review completed implementation
2. Check design adherence
3. Verify performance baselines
4. Approve or request adjustments

---

### Stop Point #3: Pre-Merge Review (Large)

**Deliverables:**
- Complete implementation code
- Test coverage report (≥80%)
- DRA review findings
- Performance benchmarks
- Security review (DRA preliminary)

**User Actions:**
1. Review all implementation code
2. Check test coverage
3. Review DRA findings
4. Verify performance metrics
5. Approve merge or request changes

---

### Stop Point #4: Post-Deployment Audit (Large)

**Deliverables:**
- `trinity/audits/YYYY-MM-DD-feature-name.md`
- Security audit report (JUNO)
- Performance audit (comparison to baselines)
- Technical debt assessment
- Learned patterns (for Knowledge Base)

**User Actions:**
1. Review JUNO audit report
2. Check security findings
3. Verify performance improvements
4. Review technical debt
5. Approve session end

---

## Example: Complete Medium Scale Implementation

**Feature:** Add pagination to user list API

### Step 1: Investigation Approved
```markdown
Investigation: trinity/investigations/2025-11-05-user-list-pagination.md
Decision: Implement cursor-based pagination (better for large datasets)
Scale: Medium (8 hours)
```

### Step 2: ROR Design Document
```markdown
Design Doc: trinity/design-docs/2025-11-05-user-list-pagination.md

## Component Architecture
- UserService.listUsers() - core logic
- PaginationHelper - reusable pagination utilities
- UserController.getUsers() - API endpoint

## Interface Definitions
interface PaginationOptions { page: number; limit: number; }
interface PaginatedResult<T> { data: T[]; pagination: {...}; }

## Testing Strategy
- Unit tests: PaginationHelper utilities
- Integration tests: UserService.listUsers()
- E2E tests: GET /api/users?page=1&limit=10
```

### Step 3: STOP POINT #1 - User Review
**User:** "Approve"

### Step 4: KIL Implementation (TDD)
```typescript
// Task 1: PaginationHelper utility
RED: Write test for calculateSkip()
GREEN: Implement calculateSkip()
REFACTOR: Extract validation
BAS: ✅ PASS

// Task 2: UserService pagination logic
RED: Write test for listUsers() with pagination
GREEN: Implement basic pagination
REFACTOR: Extract helper methods
BAS: ✅ PASS

// Task 3: UserController API endpoint
RED: Write E2E test for GET /api/users
GREEN: Implement controller endpoint
REFACTOR: Add input validation
BAS: ✅ PASS
```

### Step 5: DRA Code Review
```markdown
DRA Review: trinity/reviews/2025-11-05-user-list-pagination.md

✅ Design Doc Compliance: All components implemented as designed
✅ Function Parameters: All functions ≤2 parameters
✅ Code Quality: Nesting depth ≤4, functions <200 lines
✅ Error Handling: All async functions have try-catch
✅ Test Coverage: 94.2% (threshold: 80%)

Recommendation: APPROVE for merge
```

### Step 6: Implementation Complete
- 3 atomic tasks completed
- All BAS gates passed
- DRA review approved
- Test coverage: 94.2%
- Duration: 7.5 hours (within 8-hour estimate)

---

## Performance Standards

**BAS enforces performance baselines:**

```yaml
Response Time:
  - API endpoints: <200ms (p95)
  - Database queries: <100ms
  - Page load: <2s

Resource Usage:
  - Memory: No leaks detected
  - CPU: <70% sustained load
  - Database connections: Properly pooled

Scalability:
  - N+1 queries: Zero tolerance
  - Eager loading: Required for related data
  - Pagination: Required for lists >100 items
```

**BAS Phase 6 checks:**
- No synchronous file I/O
- Database queries use indexes
- Caching implemented for expensive operations
- Rate limiting on public endpoints

---

## Related Workflows

- **Previous:** [Investigation Workflow](./investigation-workflow.md)
- **See Also:** [Session Workflow](./session-workflow.md)
- **Audit:** [Audit Workflow](./audit-workflow.md)

---

**Implement with discipline. Test with rigor. Ship with confidence.**
