# Investigation-First Development: Complete Methodology

**Trinity Method SDK v2.0 - Complete Operational Guide**
**Last Updated:** 2025-11-05

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Quick Start for SDK Users](#quick-start-for-sdk-users)
3. [Investigation Methodology](#investigation-methodology)
4. [Quality Enforcement](#quality-enforcement)
5. [Crisis Management](#crisis-management)
6. [Knowledge Management](#knowledge-management)
7. [Practical Implementation](#practical-implementation)
8. [Success Metrics](#success-metrics)
9. [Continuous Evolution](#continuous-evolution)
10. [Appendices](#appendices)

---

## Executive Summary

The **Trinity Method SDK** transforms Trinity Method v7.0 methodology from documentation into executable agents and workflows. This complete guide shows you how to use the SDK to practice investigation-first development in your projects.

###Who This Is For

- Developers using Trinity Method SDK with Claude Code
- Teams adopting investigation-first development
- Projects requiring systematic quality assurance
- Anyone committed to evidence-based decisions

### What You'll Learn

- **Investigation Methodology**: How to investigate before implementing
- **Quality Enforcement**: How SDK enforces quality automatically
- **Crisis Management**: How to handle development crises systematically
- **Knowledge Management**: How to preserve and reuse knowledge
- **Practical Implementation**: Day-to-day workflows with SDK agents

### Prerequisites

Before reading this guide:
1. **Deploy Trinity SDK**: `npx @trinity-method/cli deploy`
2. **Read Core Philosophy**: [README.md Core Philosophy](../../README.md#core-philosophy)
3. **Understand Trinity Framework**: [Trinity Framework](./trinity-framework.md)

---

## Quick Start for SDK Users

### Your First Investigation with SDK

```bash
# 1. Deploy Trinity Method SDK
cd your-project
npx @trinity-method/cli deploy

# 2. Review what was deployed
ls trinity/knowledge-base/
# ARCHITECTURE.md, ISSUES.md, To-do.md, Technical-Debt.md, Trinity.md

# 3. Check your baseline metrics
cat trinity/knowledge-base/Technical-Debt.md
# See TODO count, file complexity, console statements, etc.

# 4. Start your first investigation
# Open Claude Code and say:
"Please review .claude/agents/leadership/aly-cto.md to investigate
the slow API response time on /api/users endpoint"
```

### How SDK Implements Trinity Method

| Methodology Aspect | SDK Implementation |
|--------------------|-------------------|
| **Investigation-First** | ALY orchestrates investigation before implementation |
| **Evidence-Based Decisions** | MON defines acceptance criteria, ROR creates Design Doc |
| **Systematic Quality** | BAS runs 6-phase quality gates on every commit |
| **Knowledge Preservation** | ZEN maintains knowledge base, Learning System extracts patterns |
| **Crisis Management** | Crisis protocols available, agents coordinate response |

---

## Investigation Methodology

### The Investigation Process

Trinity Method requires investigation before implementation. The SDK automates this through agent coordination.

#### Step 1: Context Establishment

**Manual Process (Trinity Method v7.0):**
```markdown
- Read existing documentation
- Review code
- Understand current state
- Define problem
```

**SDK Process (Automated):**
```typescript
// User triggers investigation
"Investigate slow /api/users endpoint"
    ↓
ALY: Determines investigation scope
    ├── Technical Investigation (ZEN semantic analysis)
    ├── Performance Investigation (BAS baseline measurement)
    └── UX Investigation (MON acceptance criteria)
    ↓
Context automatically gathered:
    - Current endpoint implementation (ZEN)
    - Performance baselines (BAS)
    - User requirements (MON)
    - Security concerns (JUNO if needed)
```

**SDK Agents:**
- **ALY**: Orchestrates investigation
- **ZEN**: Analyzes codebase and architecture
- **BAS**: Measures performance baselines
- **MON**: Defines success criteria
- **JUNO**: Assesses security (when needed)

---

#### Step 2: Evidence Collection

**What Evidence SDK Collects:**

**Technical Evidence (ZEN):**
```typescript
// ZEN semantic analysis output
const technicalEvidence = {
  endpoint: '/api/users',
  implementation: 'GET handler in src/routes/users.ts',
  dependencies: ['database ORM', 'auth middleware', 'logger'],
  patterns: ['N+1 query detected', 'no pagination', 'fetches all columns'],
  security: ['SQL injection protected', 'auth required'],
  complexity: {
    fileSize: 247,  // lines
    cyclomaticComplexity: 8,
    dependencies: 5
  }
};
```

**Performance Evidence (BAS):**
```typescript
// BAS baseline measurement
const performanceEvidence = {
  averageResponseTime: 1847ms,  // ❌ Target: <200ms
  p50: 1654ms,
  p95: 3421ms,
  p99: 5109ms,
  throughput: 12,  // requests/second
  memoryUsage: 156MB,
  databaseQueries: 47,  // ❌ N+1 problem
  bottlenecks: [
    { location: 'database fetch', time: 1423ms },
    { location: 'serialization', time: 312ms }
  ]
};
```

**User Experience Evidence (MON):**
```typescript
// MON acceptance criteria
const uxEvidence = {
  currentUX: 'Users wait 2-5 seconds for user list',
  desiredUX: 'User list loads in <500ms',
  acceptanceCriteria: [
    'Response time <200ms',
    'Pagination support (20 users/page)',
    'Filter by role',
    'Search by name'
  ],
  riskAssessment: 'Medium - breaking change if pagination required'
};
```

**SDK Workflow:**
```
User: "Investigate slow /api/users"
    ↓
ALY: Coordinates all 3 investigation types
    ↓
Evidence Collection (Parallel):
    ├── ZEN: Technical analysis
    ├── BAS: Performance baseline
    └── MON: UX requirements
    ↓
Evidence compiled into investigation document
```

---

#### Step 3: Analysis and Synthesis

**SDK Analysis:**

```typescript
// ALY synthesizes evidence
const analysis = {
  rootCause: 'N+1 query problem (47 queries for 25 users)',

  technicalFactors: [
    'No pagination implemented',
    'Fetches all user fields (including unused)',
    'Separate query for each user\'s roles'
  ],

  performanceImpact: {
    current: 1847ms,
    withPagination: '~150ms (estimated 92% improvement)',
    withSelectedFields: '~50ms additional savings',
    withEagerLoading: '~25ms additional savings'
  },

  solutions: [
    {
      approach: 'Add pagination + field selection + eager loading',
      effort: 'Medium (4-6 hours)',
      risk: 'Low',
      benefit: 'High (95% performance improvement)'
    },
    {
      approach: 'Add caching layer',
      effort: 'High (2 days)',
      risk: 'Medium (cache invalidation)',
      benefit: 'High (but adds complexity)'
    }
  ],

  recommendation: 'Solution 1: Pagination + optimizations (best ROI)'
};
```

**How SDK Determines Solution:**

```typescript
// ALY decision process
const decision = await aly.determineApproach({
  evidence: compiledEvidence,
  constraints: {
    timeAvailable: '1 day',
    breakingChangesAllowed: false,
    riskTolerance: 'low'
  },

  evaluation: {
    solution1: { effort: 6, risk: 2, benefit: 95 },  // Score: 93
    solution2: { effort: 16, risk: 5, benefit: 98 }  // Score: 77
  }
});

// ALY selects Solution 1 (highest score)
```

---

#### Step 4: Decision Documentation

**SDK Automatically Creates:**

```markdown
# INVESTIGATION: Slow /api/users Endpoint

**Date**: 2025-11-05
**Type**: Performance Optimization
**Scale**: MEDIUM
**Investigator**: ALY + ZEN + BAS + MON

## Evidence Summary

**Technical** (ZEN):
- N+1 query problem: 47 queries for 25 users
- No pagination
- Fetches all fields (20 columns, only 8 used in UI)

**Performance** (BAS):
- Current: 1847ms average
- Target: <200ms
- Bottleneck: Database queries (1423ms)

**UX** (MON):
- Users expect <500ms load time
- Need pagination, filtering, search

## Root Cause Analysis

**Primary**: N+1 query pattern
- Each user fetch triggers separate role query
- ORM not configured for eager loading

**Secondary**: Overfetching
- Returns all 20 fields per user
- UI only uses 8 fields

## Proposed Solution

**Approach**: Add pagination + field selection + eager loading

**Implementation**:
1. Add pagination (limit/offset parameters)
2. Select only needed fields
3. Configure ORM eager loading for roles
4. Add indexes for common queries

**Expected Impact**:
- Response time: 1847ms → 150ms (92% improvement)
- Database queries: 47 → 1 (98% reduction)
- Memory usage: 156MB → 45MB (71% reduction)

**Risk Assessment**: Low
- No breaking changes (pagination optional)
- Backward compatible
- Well-tested ORM features

## Success Metrics

**Must Have**:
- Response time <200ms (95th percentile)
- Zero N+1 queries
- Pagination working

**Nice to Have**:
- Response time <100ms (50th percentile)
- Filter and search working
- Caching headers added

## Implementation Plan

**Scale**: MEDIUM (planning layer + execution)
**Estimated Time**: 4-6 hours
**Stop Points**: 1 (Design Doc approval)

**Next Steps**:
1. MON: Define full acceptance criteria
2. ROR: Create Design Doc (API changes)
3. EUS: Decompose into atomic tasks
4. KIL: Implement with TDD
5. BAS: Quality gates
6. DRA: Final review

---

**Investigation Complete** ✅
**Ready for Implementation**: Pending Design Doc approval
```

**This investigation document is automatically created in:**
```
trinity/investigations/2025-11-05-slow-api-users.md
```

---

### Investigation Templates

SDK includes 6 investigation templates in `trinity/templates/`:

#### 1. Feature Investigation

**When to Use**: Adding new features

**Template**: `trinity/templates/INVESTIGATION-TEMPLATE.md`

**SDK Workflow**:
```
User: "Add dark mode to application"
    ↓
ALY: Determines MEDIUM scale
    ↓
MON: Analyzes requirements (investigation phase)
    ├── Current state: No theme support
    ├── User needs: Toggle dark/light mode
    ├── Technical requirements: CSS variables, persistence
    └── Acceptance criteria defined
    ↓
Investigation document created
```

---

#### 2. Bug Investigation

**When to Use**: Fixing bugs

**Template**: Modified from INVESTIGATION-TEMPLATE.md

**SDK Workflow**:
```
User: "Login button doesn't work on mobile"
    ↓
ALY: Determines SMALL scale (if simple) or MEDIUM (if complex)
    ↓
Technical Investigation (ZEN):
    - Reproduces bug
    - Identifies root cause
    - Checks affected components
    ↓
If SMALL: KIL fixes immediately
If MEDIUM: Full investigation + Design Doc
```

---

#### 3. Performance Investigation

**When to Use**: Optimizing performance

**Template**: `trinity/templates/INVESTIGATION-TEMPLATE.md` (performance focus)

**SDK Workflow**:
```
User: "Application is slow"
    ↓
ALY: Triggers performance investigation
    ↓
BAS: Measures all baselines
    ├── Page load time
    ├── API response times
    ├── Memory usage
    ├── CPU usage
    └── Network requests
    ↓
Identifies bottlenecks
    ↓
ALY: Determines optimization approach
```

---

### Investigation Best Practices (SDK)

#### 1. Let ALY Determine Scale

```typescript
// ❌ Don't skip ALY
"Implement pagination for /api/users"  // Jumps to implementation

// ✅ Do: Let ALY investigate first
"Investigate and implement pagination for /api/users"
```

**Why**: ALY determines scale (Small/Medium/Large) which triggers appropriate workflow.

---

#### 2. Provide Context

```typescript
// ❌ Vague request
"Make it faster"

// ✅ Specific request
"Investigate slow response time on /api/users endpoint (currently 2-3 seconds)"
```

**Why**: Better context = better investigation.

---

#### 3. Review Investigation Before Implementation

```typescript
// SDK workflow includes stop points
ALY: Investigation complete
    ↓
STOP POINT (Medium/Large scale): User reviews investigation
    ↓
User: "Approve" or "Revise"
    ↓
If approved: Proceed to implementation
```

**Why**: Catch issues early before writing code.

---

## Quality Enforcement

### How SDK Enforces Quality

Trinity Method v7.0 defined quality standards. **Trinity SDK enforces them automatically through BAS (Quality Gate) agent.**

#### BAS: The 6-Phase Quality Gate

**Runs After Every Commit** (automatic):

```yaml
Phase 1: Linting
  Tool: ESLint + Prettier
  Action: Auto-fix if possible
  Blocks Commit If: Unfixable errors remain

Phase 2: Structure Validation
  Checks: File naming, import organization, module structure
  Blocks Commit If: Violations found

Phase 3: Build Validation
  Tool: TypeScript compiler (tsc)
  Blocks Commit If: Type errors or build fails

Phase 4: Testing
  Tool: Jest (or project test framework)
  Blocks Commit If: Any test fails

Phase 5: Coverage Check
  Tool: Jest --coverage
  Threshold: ≥80%
  Blocks Commit If: Coverage below threshold

Phase 6: Best Practices
  Checks: No console.log in production, error handling present, documentation complete
  Blocks Commit If: Critical violations found
```

**Example BAS Run:**

```typescript
// KIL commits code
git commit -m "feat: add pagination to /api/users"
    ↓
BAS: Triggered automatically
    ↓
Phase 1: Linting
    ✅ ESLint passed
    ✅ Prettier formatted
    ↓
Phase 2: Structure
    ✅ File naming correct
    ✅ Imports organized
    ↓
Phase 3: Build
    ✅ TypeScript compiled
    ✅ Zero type errors
    ↓
Phase 4: Testing
    ❌ FAIL: 2 tests failing
        - test/routes/users.test.ts:42 - Expected 20 users, got 47
        - test/routes/users.test.ts:58 - Pagination metadata missing
    ↓
BAS: BLOCKS COMMIT ❌
    ↓
KIL: Fixes tests, tries again
    ↓
Phase 4: Testing
    ✅ All tests pass (52/52)
    ↓
Phase 5: Coverage
    ✅ Line coverage: 84% (above 80% threshold)
    ✅ Branch coverage: 76%
    ✅ Function coverage: 88%
    ↓
Phase 6: Best Practices
    ✅ No console.log in src/
    ✅ Error handling present
    ✅ JSDoc comments added
    ↓
BAS: ALL PHASES PASSED ✅
    ↓
Commit Successful
```

---

### Debugging Standards

**Trinity Method v7.0 Required** (manual):
```javascript
function anyFunction(param1, param2) {
    console.log(`[ENTRY] ${anyFunction.name}`, { params, timestamp });
    // ... implementation
    console.log(`[EXIT] ${anyFunction.name}`, { result, executionTime });
}
```

**SDK Recommendation** (TypeScript):
```typescript
// SDK uses structured logging instead of console.log
import { Logger } from './utils/Logger.js';

const logger = new Logger('UserService');

export async function getPaginatedUsers(
  page: number,
  limit: number
): Promise<PaginatedResponse<User>> {
  logger.info('getPaginatedUsers called', { page, limit });
  const startTime = Date.now();

  try {
    // Implementation
    const users = await db.users
      .select('id', 'name', 'email', 'role')
      .offset((page - 1) * limit)
      .limit(limit);

    const total = await db.users.count();

    const result = {
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    logger.info('getPaginatedUsers completed', {
      duration: Date.now() - startTime,
      resultCount: users.length
    });

    return result;

  } catch (error) {
    logger.error('getPaginatedUsers failed', {
      error: (error as Error).message,
      stack: (error as Error).stack,
      params: { page, limit }
    });
    throw error;
  }
}
```

**Why Structured Logging**:
- Easy to disable in production (Logger.setLevel('warn'))
- Easy to search/filter logs
- Machine-readable format
- BAS Phase 6 allows Logger, blocks console.log

---

### Testing Requirements

**SDK Testing Hierarchy:**

```yaml
Unit Tests (Jest):
  Location: tests/unit/
  Coverage: ≥80%
  Run By: BAS Phase 4
  Example:
    - tests/unit/services/UserService.test.ts
    - tests/unit/utils/pagination.test.ts

Integration Tests (Jest):
  Location: tests/integration/
  Coverage: Critical paths
  Run By: CI/CD (Ein agent)
  Example:
    - tests/integration/routes/users.test.ts
    - tests/integration/database/queries.test.ts

E2E Tests (Optional):
  Location: tests/e2e/
  Tool: Playwright or Cypress
  Run By: CI/CD before deployment
  Example:
    - tests/e2e/user-list.spec.ts
    - tests/e2e/pagination.spec.ts

Performance Tests (Optional):
  Location: tests/performance/
  Tool: Jest with performance benchmarks
  Run By: JUNO audit (Large scale stop point #4)
  Example:
    - tests/performance/api-response-times.test.ts
```

**SDK TDD Workflow (KIL Agent):**

```typescript
// RED: Write failing test first
describe('getPaginatedUsers', () => {
  it('should return paginated users', async () => {
    const result = await getPaginatedUsers(1, 20);

    expect(result.data).toHaveLength(20);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 100,
      pages: 5
    });
  });
});

// Run: npm test → ❌ FAIL (function doesn't exist)

// GREEN: Implement minimal code to pass
export async function getPaginatedUsers(page: number, limit: number) {
  // Minimal implementation
  return {
    data: await db.users.limit(limit).offset((page - 1) * limit),
    pagination: {
      page,
      limit,
      total: await db.users.count(),
      pages: Math.ceil(await db.users.count() / limit)
    }
  };
}

// Run: npm test → ✅ PASS

// REFACTOR: Clean up
// - Extract pagination logic
// - Add error handling
// - Optimize queries (single count query)
// - Add input validation

// Run: npm test → ✅ PASS (still works after refactor)
```

---

### Performance Standards

**Trinity Method Universal Baselines:**
```yaml
Response Time: <100ms
Render Time: <16ms (60fps)
Load Time: <3s initial
API Response: <200ms
Memory Usage: <100MB idle
CPU Usage: <30% active
```

**SDK Performance Validation:**

**Baseline Establishment (TAN at deployment):**
```typescript
// trinity/knowledge-base/Technical-Debt.md includes:
{
  "performanceBaselines": {
    "apiResponseTimes": {
      "/api/users": 1847ms,  // ❌ Above 200ms threshold
      "/api/posts": 134ms,   // ✅ Within threshold
      "/api/login": 89ms     // ✅ Within threshold
    },
    "memoryUsage": {
      "idle": 87MB,          // ✅ Below 100MB
      "active": 156MB        // Review if sustained
    }
  }
}
```

**Performance Regression Detection (BAS):**
```typescript
// BAS Phase 6 checks performance against baselines
const currentPerformance = await measureApiResponseTime('/api/users');
const baseline = await getBaseline('/api/users');

if (currentPerformance > baseline * 1.1) {  // 10% regression threshold
  logger.warn('Performance regression detected', {
    endpoint: '/api/users',
    baseline: baseline,
    current: currentPerformance,
    regression: ((currentPerformance - baseline) / baseline * 100).toFixed(1) + '%'
  });
  // BAS flags for review (doesn't block if within absolute threshold)
}
```

---

### Documentation Standards

**Every change requires** (enforced by BAS Phase 6):

**1. Investigation Document** (automatically created by ALY)
```
trinity/investigations/YYYY-MM-DD-feature-name.md
```

**2. Code Comments** (checked by BAS):
```typescript
/**
 * Get paginated list of users
 * @param page - Page number (1-indexed)
 * @param limit - Number of users per page (max 100)
 * @returns Paginated response with users and metadata
 * @throws {ValidationError} If page < 1 or limit > 100
 * @throws {DatabaseError} If database query fails
 */
export async function getPaginatedUsers(
  page: number,
  limit: number
): Promise<PaginatedResponse<User>>
```

**3. API Documentation** (APO agent generates):
```typescript
// APO creates/updates:
docs/api/endpoints/users.md

# GET /api/users

Returns paginated list of users.

**Parameters**:
- `page` (query, number): Page number (default: 1)
- `limit` (query, number): Users per page (default: 20, max: 100)

**Response** (200 OK):
{
  "data": User[],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

**4. Knowledge Base Updates** (ZEN agent maintains):
```markdown
// trinity/knowledge-base/ARCHITECTURE.md updated with:
## API Endpoints

### GET /api/users (Paginated)
- **Added**: 2025-11-05
- **Reason**: Performance optimization (N+1 query fix)
- **Implementation**: src/routes/users.ts:getPaginatedUsers
- **Performance**: 150ms average (was 1847ms)
- **Tests**: tests/integration/routes/users.test.ts
```

---

## Crisis Management

### When to Activate Crisis Protocol

**Triggers**:
1. **Console Error Crisis**: Any console errors in production
2. **Performance Degradation**: Performance drops below baselines
3. **Data Integrity Crisis**: Data inconsistencies detected
4. **Deployment Failure**: Deployment process fails
5. **Security Breach**: Security vulnerability exploited

### Crisis Response with SDK

#### Console Error Crisis

**Scenario**: Production application showing console errors

**Manual Process** (Trinity Method v7.0):
```markdown
1. Full system stop
2. Document all errors
3. Create crisis branch
4. Fix errors one by one
5. Test thoroughly
6. Deploy fix
```

**SDK Process** (Assisted):

```bash
# User reports console errors in production
User: "Production has console errors, need immediate fix"
    ↓
ALY: Recognizes crisis situation
    ↓
Crisis Protocol Activated:
    ↓
1. IMMEDIATE RESPONSE (0-5 minutes)
   - Create crisis branch: git checkout -b crisis/console-errors-2025-11-05
   - Document errors: ZEN captures all error logs
   - Assess impact: ALY determines severity (blocker/critical/high)
    ↓
2. SYSTEMATIC RECOVERY (5-30 minutes)
   - Prioritize errors by severity
   - KIL fixes critical errors first (TDD)
   - BAS validates each fix (6-phase gates)
   - DRA reviews fixes
    ↓
3. VERIFICATION
   - All tests pass
   - Zero console errors
   - Performance not degraded
   - JUNO comprehensive audit
    ↓
4. COMPLETION
   - Merge crisis branch
   - Deploy to production
   - Document pattern (prevent recurrence)
   - Extract learning for future
```

**Example Crisis Flow:**

```typescript
// 1. IMMEDIATE RESPONSE
User: "Production errors - TypeError: Cannot read property 'map' of undefined"
    ↓
ALY:
  - Creates branch: crisis/undefined-map-error
  - Impact: HIGH (blocks user list view)
  - Affected: /api/users endpoint
    ↓
ZEN: Documents error context
  - Error location: src/routes/users.ts:42
  - Error: users.map is not a function when pagination returns null
  - Root cause: Database query can return null if no users
    ↓

// 2. SYSTEMATIC RECOVERY
KIL: Implements fix (TDD)
  - RED: Add test for empty user list
  - GREEN: Add null check before map
  - REFACTOR: Use optional chaining
    ↓
BAS: Validates fix
  - ✅ All phases pass
    ↓
DRA: Reviews fix
  - ✅ Proper error handling
  - ✅ No breaking changes
    ↓

// 3. VERIFICATION
JUNO: Final audit
  - ✅ Zero console errors
  - ✅ Tests pass
  - ✅ Performance OK
    ↓

// 4. COMPLETION
  - Merge to main
  - Deploy (Ein agent handles CI/CD)
  - Pattern extracted: "Always handle null/undefined from database queries"
  - Added to trinity/patterns/error-handling/null-safety.md
```

**Time**: 15-25 minutes (vs 1-2 hours manual)

---

#### Performance Degradation Crisis

**Scenario**: API response time suddenly increased from 150ms to 2000ms

**SDK Response:**

```typescript
User: "API is suddenly very slow, investigate immediately"
    ↓
ALY: Crisis protocol activated
    ↓
Performance Investigation (BAS + ALY):
  - Current: 2000ms (was 150ms baseline)
  - Regression: 1233% increase
  - Bottleneck identified: Database connection pool exhausted
    ↓
Root Cause Analysis (ZEN):
  - Recent change: Added new endpoint that doesn't close connections
  - Impact: Connection pool saturated
  - Evidence: 100 active connections (max 100)
    ↓
Fix Strategy (ALY):
  - Immediate: Restart application (clears connections)
  - Short-term: Fix connection leak in new endpoint
  - Long-term: Add connection monitoring
    ↓
Implementation (KIL):
  - Fix connection leak (add try-finally)
  - Add connection pool monitoring
  - Add alerts for 80% pool usage
    ↓
Verification (BAS + JUNO):
  - Performance restored: 150ms average
  - Connections stable: 5-10 active
  - Monitoring active
    ↓
Pattern Extracted:
  - "Always use try-finally for database connections"
  - "Monitor connection pools"
  - Added to trinity/patterns/database/connection-management.md
```

---

### Crisis Prevention

**SDK Proactive Measures:**

**1. BAS Quality Gates (Prevent Issues Before Commit)**
- Catches errors before production
- Blocks commits that fail tests
- Enforces coverage thresholds

**2. JUNO Audits (Large Scale Stop Point #4)**
- Comprehensive security audit
- Performance regression detection
- Code quality validation

**3. Learning System (Pattern Recognition)**
- Identifies anti-patterns before they spread
- Suggests proven solutions
- Warns about risky approaches

**4. Pre-commit Hooks (Automated Quality)**
- Runs lint/format before commit
- Prevents bad code from entering repo
- Fast feedback loop

---

## Knowledge Management

### How SDK Preserves Knowledge

Trinity Method v7.0 emphasized cross-session knowledge. **SDK implements this through:**
1. **Session Archives** (automated by hooks)
2. **Pattern Library** (Learning System)
3. **Knowledge Base** (ZEN maintenance)

### Session Documentation

**Session Lifecycle:**

```
Session Start (Hook: session-start)
    ↓
Load Previous Context:
    - ALY reads trinity/sessions/ for last session
    - ZEN loads ARCHITECTURE.md, Technical-Debt.md
    - Learning System suggests relevant patterns
    ↓
Work Happens:
    - Investigations created
    - Code implemented
    - Tests written
    - Commits made
    ↓
Session End (Hook: session-end-archive.sh)
    ↓
Archive Session:
    - Create trinity/sessions/YYYY-MM-DD-HH-MM/
    - Copy investigation documents
    - Copy implementation notes
    - Extract patterns
    - Update knowledge base
    ↓
Next Session Benefits:
    - Loads previous context
    - Suggests relevant patterns
    - Continues work seamlessly
```

**What Gets Archived:**

```
trinity/sessions/2025-11-05-14-30/
├── investigation-summary.md          # What was investigated
├── implementation-notes.md           # What was implemented
├── patterns-discovered.md            # Patterns identified
├── issues-resolved.md               # Issues fixed
├── test-results.md                  # Test coverage and results
└── session-retrospective.md         # What went well/poorly
```

**SDK Automation:**

```bash
# session-end-archive.sh (runs automatically)
#!/bin/bash

SESSION_DIR="trinity/sessions/$(date +%Y-%m-%d-%H-%M)"
mkdir -p "$SESSION_DIR"

# Copy investigations
cp trinity/investigations/*.md "$SESSION_DIR/" 2>/dev/null

# Extract patterns (Learning System)
# ... pattern extraction logic

# Update knowledge base (ZEN)
# ... knowledge base updates

echo "Session archived to $SESSION_DIR"
```

---

### Pattern Library

**SDK Pattern Management:**

**Pattern Extraction (Learning System):**

```typescript
// Automatic pattern extraction after each session
class LearningDataStore {
  async extractPatterns(sessionId: string): Promise<LearnedPattern[]> {
    const session = await this.getSession(sessionId);

    // Analyze what worked
    const successfulApproaches = session.implementations
      .filter(impl => impl.success && impl.quality > 0.8);

    // Extract patterns
    const patterns = successfulApproaches.map(approach => ({
      name: approach.pattern,
      context: approach.context,
      solution: approach.code,
      confidence: approach.quality,
      metrics: approach.performance
    }));

    return patterns;
  }
}
```

**Pattern Structure:**

```markdown
# PATTERN: Pagination with N+1 Query Prevention

**Category**: Database Optimization
**Context**: API endpoints returning collections
**Confidence**: 0.95 (extracted from 3 successful implementations)

## Problem
Fetching collections with relations causes N+1 query problem:
- 1 query for collection
- N queries for relations (one per item)

## Solution
Use ORM eager loading with field selection:

\`\`\`typescript
// ❌ N+1 queries (bad)
const users = await db.users.findMany();
// Then for each user:
// await db.roles.findMany({ userId: user.id });

// ✅ Single query (good)
const users = await db.users.findMany({
  include: { roles: true },  // Eager load
  select: {                  // Only needed fields
    id: true,
    name: true,
    email: true,
    roles: {
      select: { name: true }
    }
  }
});
\`\`\`

## Benefits
- 95% reduction in database queries
- 90% improvement in response time
- Lower memory usage

## Caveats
- Works best with indexed relations
- May fetch more data than needed for large relations
- Consider pagination for very large datasets

## Related Patterns
- Pagination Pattern
- Field Selection Pattern
- Database Indexing Pattern

---

**Extracted From**:
- Session: 2025-11-05-14-30
- Investigation: slow-api-users.md
- Performance: 1847ms → 150ms
```

**Pattern Suggestion (Next Session):**

```typescript
// User starts new investigation
User: "Investigate slow /api/posts endpoint"
    ↓
ALY: Recognizes similar context
    ↓
Learning System: Suggests patterns
    ↓
{
  suggestion: "Pagination with N+1 Query Prevention",
  confidence: 0.95,
  reason: "Similar context (API endpoint, collection, performance)",
  previousSuccess: {
    endpoint: "/api/users",
    improvement: "92%",
    effort: "4 hours"
  },
  recommendation: "Apply same pattern to /api/posts"
}
    ↓
ALY: "Based on previous success with /api/users (92% improvement),
      I recommend applying pagination with eager loading to /api/posts"
```

---

### Knowledge Base Maintenance (ZEN Agent)

**What ZEN Updates:**

**1. ARCHITECTURE.md** (after every change):
```markdown
## Recent Changes

### 2025-11-05: Pagination Added to /api/users
- **Reason**: Performance optimization
- **Implementation**: src/routes/users.ts:getPaginatedUsers
- **Pattern Applied**: Pagination with N+1 Query Prevention
- **Performance Impact**: 1847ms → 150ms (92% improvement)
- **Breaking Changes**: None (backward compatible)
- **Related Endpoints**: Consider applying to /api/posts, /api/comments
```

**2. Technical-Debt.md** (tracks metrics over time):
```markdown
## Technical Debt Trends

### Performance Debt (Decreasing ✅)
- 2025-11-01: 3 endpoints >1s response time
- 2025-11-05: 2 endpoints >1s response time
- **Improvement**: Fixed /api/users (N+1 query)
- **Remaining**: /api/posts (1234ms), /api/comments (2100ms)
- **Next Priority**: P1 - Fix /api/posts
```

**3. ISSUES.md** (tracks known issues):
```markdown
## Resolved Issues

### ISSUE-042: Slow /api/users Endpoint
- **Resolved**: 2025-11-05
- **Root Cause**: N+1 query pattern
- **Solution**: Pagination + eager loading
- **Pattern**: Pagination with N+1 Query Prevention
- **Prevention**: Apply pattern to all collection endpoints
- **Status**: RESOLVED ✅
```

**4. Trinity.md** (methodology learnings):
```markdown
## Project-Specific Patterns

### Database Patterns
1. **Always use eager loading for relations**
   - Pattern: trinity/patterns/database/eager-loading.md
   - Applied: 3 times, 100% success rate
   - Average improvement: 90% query reduction

2. **Always paginate collections**
   - Pattern: trinity/patterns/api/pagination.md
   - Applied: 1 time, 92% improvement
   - Recommended for: All collection endpoints
```

---

## Practical Implementation

### Getting Started with SDK

#### For New Projects

```bash
# 1. Create project
npx create-react-app my-app
# or
npm init -y

# 2. Deploy Trinity SDK
cd my-app
npx @trinity-method/cli deploy

# Prompts:
# - Project name: my-app
# - Linting: Recommended ✅
# - Confirm: Yes

# 3. Install dependencies
npm install

# 4. Setup pre-commit hooks
pip install pre-commit
pre-commit install

# 5. Verify deployment
ls trinity/knowledge-base/
# ARCHITECTURE.md ✅
# ISSUES.md ✅
# To-do.md ✅
# Technical-Debt.md ✅
# Trinity.md ✅

# 6. Review baseline metrics
cat trinity/knowledge-base/Technical-Debt.md

# 7. Start development
# Open Claude Code and reference agents
```

---

#### For Existing Projects

```bash
# 1. Backup current state
git checkout -b pre-trinity-backup
git commit -am "Pre-Trinity Method SDK state"

# 2. Return to main branch
git checkout main

# 3. Deploy Trinity SDK
npx @trinity-method/cli deploy

# 4. Review what was deployed
git status
# New files:
#   trinity/
#   .claude/
#   CLAUDE.md
#   .eslintrc.json (if linting selected)
#   .prettierrc.json (if linting selected)
#   .pre-commit-config.yaml (if linting selected)

# 5. Commit Trinity deployment
git add .
git commit -m "feat: deploy Trinity Method SDK v2.0"

# 6. Install dependencies
npm install  # or pip install -r requirements-dev.txt

# 7. Setup pre-commit
pip install pre-commit
pre-commit install

# 8. Baseline establishment (ZEN completes this)
# Open Claude Code:
"Please review .claude/agents/deployment/zen-knowledge.md to complete
ARCHITECTURE.md and Technical-Debt.md with full semantic analysis"

# 9. Verify baseline
cat trinity/knowledge-base/Technical-Debt.md
# Should show real metrics from your codebase

# 10. Start first investigation
"Please review .claude/agents/leadership/aly-cto.md to investigate
[highest priority issue from ISSUES.md or Technical-Debt.md]"
```

---

### Daily Workflow with SDK

#### Morning Routine

```bash
# 1. Review previous session
cat trinity/sessions/$(ls -t trinity/sessions | head -1)/session-retrospective.md

# 2. Check task queue
cat trinity/knowledge-base/To-do.md
# Shows prioritized tasks (P0, P1, P2, P3)

# 3. Check known issues
cat trinity/knowledge-base/ISSUES.md
# Shows any blockers or critical issues

# 4. Check technical debt
cat trinity/knowledge-base/Technical-Debt.md
# Shows metrics trends

# 5. Plan today's work
# Open Claude Code:
"Based on trinity/knowledge-base/To-do.md, what should I work on today?"
    ↓
ALY: Reviews To-do.md and suggests priority order
    ↓
User: Selects task
```

---

#### Development Cycle (SDK-Assisted)

```typescript
// 1. Select Task
User: "Let's work on P1 task: Add pagination to /api/users"
    ↓

// 2. Investigation
ALY: Determines scale (MEDIUM)
    ↓
Investigation phase:
    - ZEN analyzes current implementation
    - BAS measures performance baseline
    - MON defines acceptance criteria
    ↓
Investigation document created
    ↓

// 3. User Review (Stop Point)
User: Reviews investigation
User: "Approve"
    ↓

// 4. Design
ROR: Creates Design Doc
    - Function signatures
    - Error handling
    - API changes
    ↓
User: Reviews design
User: "Approve"
    ↓

// 5. Implementation
EUS: Decomposes into atomic tasks (5 tasks)
    ↓
KIL: Implements task 1 (TDD)
    - RED: Write test
    - GREEN: Make pass
    - REFACTOR: Clean up
    ↓
BAS: Runs 6-phase quality gates
    ✅ All phases pass
    ↓
Commit successful
    ↓
Repeat for tasks 2-5
    ↓

// 6. Review
DRA: Final code review
    - Design Doc compliance: 100%
    - Acceptance criteria: 100%
    - Code quality: High
    ↓

// 7. Completion
User: Tests feature manually
User: "Looks good!"
    ↓
ZEN: Updates knowledge base
    - ARCHITECTURE.md updated
    - Technical-Debt.md metrics improved
    - Pattern extracted
```

---

#### End of Day

```bash
# 1. Update To-do.md
cat trinity/knowledge-base/To-do.md
# Update task statuses

# 2. Trigger session end (automatic if using hooks)
# Or manually:
./.claude/hooks/session-end-archive.sh

# 3. Session archived to trinity/sessions/YYYY-MM-DD-HH-MM/

# 4. Review what was accomplished
cat trinity/sessions/$(ls -t trinity/sessions | head -1)/implementation-notes.md

# 5. Next session preparation (automatic)
# Learning System extracts patterns
# ZEN updates knowledge base
# Ready for tomorrow
```

---

### Team Implementation

#### Roles with SDK

**Tech Lead:**
- Methodology enforcement: Review stop points
- Investigation review: Approve ALY investigations
- Quality gates: Monitor BAS results
- Crisis management: Coordinate crisis responses

**Senior Developers:**
- Investigation leadership: Work with ALY on complex investigations
- Pattern extraction: Help Learning System identify patterns
- Mentoring: Teach juniors Trinity Method + SDK
- Architecture decisions: Work with ROR on Design Docs

**Developers:**
- Investigation execution: Create investigation documents with ALY
- Implementation: Work with KIL on TDD
- Testing: Ensure BAS quality gates pass
- Documentation: Help ZEN maintain knowledge base

**QA Team:**
- Test strategy: Define test requirements with MON
- Quality verification: Work with JUNO on audits
- Performance monitoring: Track baselines with BAS
- User acceptance: Validate acceptance criteria

---

#### Code Review with SDK

**Trinity Method Review Checklist:**

```markdown
## Investigation
□ Investigation document exists in trinity/investigations/
□ Evidence supports chosen approach
□ ALY approved scale determination
□ Stop point reviews completed (Medium/Large scale)

## Design
□ Design Doc exists (Medium/Large scale)
□ ROR reviewed design
□ DRA validated Design Doc compliance (≥70%)
□ Function signatures follow standards (≤2 params)

## Implementation
□ TDD followed (RED-GREEN-REFACTOR)
□ All tests pass
□ Coverage ≥80%
□ BAS 6-phase quality gates passed

## Documentation
□ Code comments present (JSDoc/TSDoc)
□ API documentation updated (APO)
□ Knowledge base updated (ZEN)
□ README updated if needed

## Patterns
□ Patterns extracted (Learning System)
□ Anti-patterns avoided
□ Related patterns referenced

## Performance
□ Performance within baselines
□ No regressions detected
□ Optimization patterns applied if needed
```

**DRA Agent Handles This:**

```typescript
// DRA performs code review automatically at stop points
const review = await dra.reviewCode({
  designDoc: 'trinity/work-orders/WO-XXX-design-doc.md',
  implementation: 'src/routes/users.ts',
  tests: 'tests/integration/routes/users.test.ts'
});

if (review.complianceScore < 0.70) {
  // Block merge, request changes
  return {
    status: 'CHANGES_REQUESTED',
    issues: review.issues,
    recommendations: review.recommendations
  };
}

return {
  status: 'APPROVED',
  score: review.complianceScore
};
```

---

## Success Metrics

### How to Measure Success with SDK

**SDK Tracks Metrics Automatically:**

```typescript
// trinity/knowledge-base/Technical-Debt.md updated continuously
const metrics = {
  investigation: {
    successRate: 95,           // % investigations leading to successful implementation
    timeReduction: 35,         // % reduction in investigation time over time
    patternReuse: 67           // % investigations using existing patterns
  },

  quality: {
    bugsPreventedByInvestigation: 23,  // Bugs caught in investigation phase
    performanceRegressions: 0,          // Count of performance regressions
    consoleErrors: 0,                   // Console errors in production
    testCoverage: 84,                   // % test coverage
    basPassRate: 98                     // % commits passing BAS on first try
  },

  knowledge: {
    patternsExtracted: 12,      // Patterns in trinity/patterns/
    patternReuseRate: 67,       // % new code using existing patterns
    sessionContinuity: 92,      // % sessions loading previous context
    knowledgeRetention: 88      // % patterns reused after 30 days
  },

  efficiency: {
    deploymentSuccessRate: 100,  // % successful deployments
    crisisActivations: 1,        // Crisis protocols activated (last 30 days)
    averageTaskTime: 4.2,       // Hours per Medium scale task
    velocityIncrease: 42        // % velocity increase since SDK adoption
  }
};
```

**View Metrics:**

```bash
# View current metrics
cat trinity/knowledge-base/Technical-Debt.md

# View trends over time (sessions)
ls -lt trinity/sessions/
cat trinity/sessions/*/implementation-notes.md
```

---

### Implementation Success Indicators

#### Short Term (1-4 weeks)

**What to Look For:**
- ✅ Investigation documents created for all changes
- ✅ BAS quality gates passing consistently
- ✅ Zero console errors in production
- ✅ Basic pattern library established (3-5 patterns)
- ✅ Session documentation routine working

**SDK Evidence:**
```bash
# Check investigations
ls trinity/investigations/  # Should have 5-10 documents

# Check patterns
ls trinity/patterns/  # Should have 3-5 patterns

# Check quality
git log --grep="🤖 Generated with"  # All commits have SDK stamp
```

---

#### Medium Term (1-3 months)

**What to Look For:**
- ✅ 30-50% reduction in bugs
- ✅ 20-40% faster development
- ✅ Pattern reuse increasing (>50%)
- ✅ Knowledge retention evident (sessions reference past work)
- ✅ Crisis protocols rarely needed (<1/month)

**SDK Evidence:**
```bash
# Check metrics
cat trinity/knowledge-base/Technical-Debt.md
# Compare metrics from week 1 vs week 12

# Check pattern reuse
grep "Pattern Applied" trinity/investigations/*.md | wc -l
# Should show increasing pattern application

# Check velocity
# Compare commits per week over 12 weeks
# Should show increase after initial learning curve
```

---

#### Long Term (3-6 months)

**What to Look For:**
- ✅ 80-90% first-time success rate (investigations → working code)
- ✅ Technical debt decreasing
- ✅ Self-improving system (patterns automatically suggested)
- ✅ Team expertise growth (junior developers use SDK effectively)
- ✅ Methodology refinement active (custom patterns, workflows)

**SDK Evidence:**
```bash
# Check success rate
# Count investigations vs failed implementations
investigations=$(ls trinity/investigations/ | wc -l)
resolved=$(grep "RESOLVED" trinity/knowledge-base/ISSUES.md | wc -l)
# Success rate = resolved / investigations

# Check technical debt trend
grep "Technical Debt Trends" trinity/knowledge-base/Technical-Debt.md
# Should show decreasing trend

# Check pattern library growth
ls trinity/patterns/ | wc -l
# Should have 15-25 patterns
```

---

### ROI Calculation with SDK

**Investment:**
```yaml
Initial Deployment: 90 seconds (SDK) vs 4 hours (manual)
Learning Curve: 1-2 weeks (same as manual Trinity Method)
Daily Overhead: 5-10 minutes (SDK automation) vs 15-20 minutes (manual)
```

**Returns (Typical SDK Project):**
```yaml
Bug Reduction: 60% (vs 50% manual)
  - BAS quality gates catch issues before commit
  - DRA reviews catch design issues
  - JUNO audits catch security issues

Development Speed: 40% faster (vs 30% manual)
  - ALY automates investigation
  - Pattern suggestions save time
  - BAS automates quality checks

Rework Reduction: 70% (vs 60% manual)
  - Stop points catch issues early
  - Design Doc prevents misalignment
  - TDD reduces bugs

Knowledge Retention: 95% (vs 90% manual)
  - Automatic session archiving
  - Pattern extraction
  - Knowledge base maintenance

Team Satisfaction: 50% increase (vs 40% manual)
  - Less manual process
  - Clear workflows
  - Agent assistance
```

**Typical ROI:**
```
3-month ROI: 400% (vs 300% manual Trinity Method)
6-month ROI: 600% (vs 500% manual Trinity Method)
12-month ROI: 800% (vs 700% manual Trinity Method)
```

**Why SDK Has Higher ROI:**
- Automation reduces overhead (BAS, ZEN, Learning System)
- Faster investigations (ALY orchestration)
- Better pattern reuse (automated suggestions)
- Fewer mistakes (agent coordination)

---

## Continuous Evolution

### Methodology Improvement with SDK

#### Monthly Review (Automated by Learning System)

**What SDK Tracks:**
```typescript
const monthlyMetrics = await learningSystem.getMonthlyReport();

{
  investigationMetrics: {
    totalInvestigations: 42,
    successRate: 95,
    averageTime: 2.3,  // hours
    patternReuse: 67   // %
  },

  qualityMetrics: {
    basPassRate: 98,
    avgCoverage: 84,
    consoleErrors: 0,
    performanceRegressions: 0
  },

  patternsExtracted: 8,
  patternsReused: 28,

  recommendations: [
    "Consider creating pattern for authentication flow (used 5 times)",
    "Performance investigation time decreasing (good trend)",
    "Test coverage stable at 84% (target: 85%)"
  ]
}
```

**Review Process:**
```markdown
1. Analyze monthly metrics (Learning System provides report)
2. Review investigations (identify successful patterns)
3. Extract new patterns (Learning System suggests candidates)
4. Update protocols (refine workflows based on learnings)
5. Enhance templates (improve investigation templates)
6. Share learnings (update Trinity.md with project-specific insights)
```

---

#### Quarterly Assessment (JUNO Audit)

**Request Quarterly Audit:**
```typescript
// Open Claude Code every 3 months
"Please review .claude/agents/audit/juno-auditor.md to perform
comprehensive quarterly audit of Trinity Method deployment"
    ↓
JUNO: Performs comprehensive audit
    - Methodology effectiveness
    - Tool performance (agent effectiveness)
    - Team adoption (pattern reuse rates)
    - Success metrics (vs targets)
    - Strategic adjustments needed
    ↓
Audit Report: trinity/audits/YYYY-QQ-quarterly-audit.md
```

**What JUNO Audits:**
```yaml
Methodology Effectiveness:
  - Investigation success rate: 95% (target: >90%) ✅
  - Quality metrics: 98% BAS pass rate ✅
  - Pattern reuse: 67% (target: >50%) ✅

Tool Performance:
  - ALY scale determination accuracy: 92%
  - BAS quality gate effectiveness: 98%
  - DRA review accuracy: 88%
  - Learning System pattern quality: 85%

Team Adoption:
  - Developers using SDK: 100%
  - Pattern reuse rate: 67%
  - Knowledge base engagement: 85%
  - Session archiving compliance: 92%

Strategic Adjustments:
  - Consider adding custom agent for [domain-specific need]
  - Refine stop point frequency (reduce for experienced team)
  - Enhance pattern library organization (categorize by domain)
```

---

#### Annual Evolution

**SDK Version Updates:**
```bash
# Check for SDK updates
npx @trinity-method/cli status
# Current version: 2.0.0
# Latest version: 2.1.0
# New features: Investigation Wizard, Pattern Dashboard

# Update SDK
npx @trinity-method/cli update
# Updates agents, templates, learning system
# Preserves your patterns and knowledge base
```

**Methodology Refinement:**
```markdown
Year 1 → Year 2 Evolution:
  - Agent additions: Created custom agent for authentication flows
  - Pattern library: Grew from 25 to 87 patterns
  - Workflow optimization: Reduced Medium scale from 4h to 2.5h
  - Team expertise: Junior developers now lead investigations
  - Methodology adoption: 100% team using SDK daily
```

---

## Appendices

### A. Quick Reference Cards

#### Investigation Quick Start

```bash
# 1. Create investigation with ALY
"Please review .claude/agents/leadership/aly-cto.md to investigate [issue]"

# 2. ALY determines scale (Small/Medium/Large)

# 3. Evidence collected automatically (ZEN, BAS, MON)

# 4. Investigation document created
trinity/investigations/YYYY-MM-DD-issue-name.md

# 5. Review investigation, approve to proceed

# 6. Implementation follows automatically
```

---

#### Crisis Response Card

```bash
ERROR → ALY (crisis recognition) → Create crisis branch →
Fix systematically (KIL + BAS) → Review (DRA) →
Audit (JUNO) → Extract pattern → RESOLVED
```

---

#### Daily Checklist

```bash
Morning:
□ Review trinity/knowledge-base/To-do.md
□ Check trinity/knowledge-base/ISSUES.md
□ Plan investigations with ALY

Development:
□ Investigate before implementing
□ Let BAS validate quality
□ Update knowledge base (ZEN)

End of Day:
□ Session archives automatically
□ Patterns extracted automatically
□ Ready for next session
```

---

### B. Command Reference

#### SDK Commands

```bash
# Deploy Trinity SDK
npx @trinity-method/cli deploy

# Check status
npx @trinity-method/cli status

# Update SDK
npx @trinity-method/cli update

# Review sessions
npx @trinity-method/cli review --sessions 10
```

---

#### Agent Reference Commands (Claude Code)

```bash
# ALY (Investigation & Scale Determination)
"Please review .claude/agents/leadership/aly-cto.md to investigate [issue]"

# ZEN (Knowledge Base Completion)
"Please review .claude/agents/deployment/zen-knowledge.md to complete
ARCHITECTURE.md with semantic analysis"

# JUNO (Comprehensive Audit)
"Please review .claude/agents/audit/juno-auditor.md to audit Trinity
Method deployment"

# AJ MAESTRO (Implementation Orchestration)
"Please review .claude/agents/leadership/aj-maestro.md to orchestrate
implementation of [approved investigation]"
```

---

### C. Template Library

**SDK Templates Location:** `trinity/templates/`

```bash
Available Templates:
├── INVESTIGATION-TEMPLATE.md       # Investigation documentation
├── IMPLEMENTATION-TEMPLATE.md      # Implementation work orders
├── ANALYSIS-TEMPLATE.md           # Analysis documentation
├── AUDIT-TEMPLATE.md              # Audit reports
├── PATTERN-TEMPLATE.md            # Pattern documentation
└── VERIFICATION-TEMPLATE.md       # Verification checklists
```

**Usage:**
```bash
# Copy template for new investigation
cp trinity/templates/INVESTIGATION-TEMPLATE.md \
   trinity/investigations/YYYY-MM-DD-feature-name.md

# Or let ALY create it automatically:
"Please review .claude/agents/leadership/aly-cto.md to investigate [feature]"
```

---

### D. Glossary

**Investigation-First**: Development approach requiring thorough investigation before implementation. SDK implements through ALY agent orchestration.

**Trinity Consensus**: Agreement between investigation findings, evidence, and implementation approach. SDK enforces through stop points and agent coordination.

**Evidence-Based Development**: Code decisions supported by documented investigation and data. SDK collects evidence automatically through ZEN, BAS, MON agents.

**Pattern Extraction**: Process of identifying reusable solutions from investigations. SDK Learning System extracts patterns automatically.

**Cross-Session Knowledge**: Information preserved and transferred between development sessions. SDK archives sessions automatically via hooks.

**Crisis Protocol**: Systematic response to critical development issues. SDK assists through agent coordination and automated validation.

**Quality Gates**: Mandatory checkpoints ensuring standards compliance. SDK enforces through BAS 6-phase quality gates.

**Stop Points**: User review and approval points in workflows. SDK implements 0 (Small), 1 (Medium), or 4 (Large) stop points based on scale.

**Scale-Based Workflow**: Different workflows for Small/Medium/Large tasks. SDK ALY agent determines scale and triggers appropriate workflow.

**BAS**: Quality Gate agent that runs 6-phase validation on every commit.

**DRA**: Code Reviewer agent that validates Design Doc compliance at stop points.

**JUNO**: Quality Auditor agent that performs comprehensive audits at Large scale stop point #4 and quarterly reviews.

**Learning System**: SDK component that extracts patterns, suggests solutions, and improves over time.

---

## Conclusion

**Investigation-First Development** is now executable through Trinity Method SDK. The methodology remains the same—the implementation is automated.

### Core Principles Enforced by SDK

1. **Investigation-First** → ALY ensures investigation before implementation
2. **Evidence-Based** → ZEN, BAS, MON collect evidence automatically
3. **Systematic Quality** → BAS enforces quality gates on every commit
4. **Knowledge Preservation** → ZEN maintains knowledge base, Learning System extracts patterns
5. **Crisis Management** → Agents coordinate systematic crisis response

### The SDK Advantage

**vs Manual Trinity Method:**
- ⚡ 98% faster deployment (90s vs 4 hours)
- 🤖 Automated quality enforcement (BAS)
- 🧠 Automatic pattern extraction (Learning System)
- 📊 Real-time metrics tracking
- 🔄 Seamless cross-session knowledge

### Next Steps

1. **If you haven't deployed**: `npx @trinity-method/cli deploy`
2. **Read complementary docs**:
   - [Core Philosophy](../../README.md#core-philosophy)
   - [Trinity Framework](./trinity-framework.md)
   - [Evolution Narrative](../evolution/from-methodology-to-sdk.md)
3. **Start your first investigation with ALY**
4. **Let the agents guide you**

---

**Trinity Method SDK v2.0: Investigation-First Development, Automated**

*Investigate thoroughly. Build with evidence. Learn continuously. Let SDK handle the rest.*

---

**Document Version:** 2.0
**SDK Version:** 2.0.0
**Last Updated:** 2025-11-05
**Maintained By:** Trinity Method SDK Team
