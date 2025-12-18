# Session Workflow

**Knowledge Preservation Across Development Sessions**

---

## Overview

Sessions are the fundamental unit of Trinity Method work. Each session follows a complete lifecycle: start, investigate, implement, document, and end. Knowledge from every session feeds the Learning System and Knowledge Base for future use.

---

## The 5-Phase Session Lifecycle

```
┌──────────────────────────────────────────────────────┐
│               SESSION LIFECYCLE                      │
└──────────────────────────────────────────────────────┘

Phase 1: Session Start (5-10 minutes)
    ↓
Phase 2: Investigation (15-60 minutes)
    ↓
Phase 3: Implementation (1-8 hours, scale-dependent)
    ↓
Phase 4: Documentation (10-20 minutes)
    ↓
Phase 5: Session End (5-15 minutes)
```

---

## Phase 1: Session Start

**Goal:** Load context, understand current state, plan session goals

### Actions

**Developer/User:**
1. Review To-do.md for planned tasks
2. Review ISSUES.md for known blockers
3. Check recent session archives for context
4. Define session goal(s)

**Example Session Goal:**
```markdown
Session Goal: Implement pagination for user list API
- Investigation needed: Yes (performance requirements, cursor vs offset)
- Estimated scale: Medium (8 hours)
- Success criteria: API supports pagination with ≥80% test coverage
```

---

## Phase 2: Investigation

**Goal:** Understand problem, gather evidence, make informed decisions

### ALY Coordinates Investigation

**User initiates:**
```
User: "Please review .claude/agents/leadership/aly-cto.md to
       investigate pagination requirements for /api/users endpoint"
```

**ALY workflow:**
1. Determines investigation scope (technical, performance, UX)
2. Delegates evidence collection to specialized agents
3. Synthesizes findings into investigation document
4. Recommends solution with rationale

### Evidence Collection (SDK Agents)

**ZEN (Technical Analysis):**
```yaml
Current Implementation:
  - GET /api/users returns all users (no pagination)
  - Database: MongoDB users collection
  - Current usage: 1,200 users, growing 15% monthly

Dependencies:
  - UserService.listUsers()
  - UserController.getUsers()
  - No existing pagination utilities

Code Patterns:
  - REST API using Express
  - Service layer pattern
  - TypeScript with strict mode
```

**BAS (Performance Baseline):**
```yaml
Current Performance:
  - Response time: 850ms (p95) - EXCEEDS 200ms threshold
  - Memory usage: 12MB per request
  - Database query: Full collection scan (no indexes)

Bottleneck:
  - Loading all 1,200 users into memory
  - No query optimization

Target:
  - Response time: <100ms (p95)
  - Memory usage: <2MB per request
  - Database query: Indexed + limited results
```

**MON (Requirements):**
```yaml
User Needs:
  - View user list in manageable chunks (10-50 per page)
  - Navigate forward/backward through pages
  - Know total user count

Acceptance Criteria:
  - Support page and limit query parameters
  - Return total count and hasMore flag
  - Maintain consistent sort order
  - Handle edge cases (page out of range, invalid limit)
```

### Investigation Document Created

**Location:** `trinity/investigations/YYYY-MM-DD-user-list-pagination.md`

**Contents:**
```markdown
# Investigation: User List Pagination

## Problem
GET /api/users endpoint returns all users, causing:
- 850ms response time (exceeds 200ms threshold)
- 12MB memory per request
- Full collection scans (no indexes)

## Evidence
[ZEN, BAS, MON findings...]

## Solution Options
1. Offset-based pagination (simple, but slow at high offsets)
2. Cursor-based pagination (fast, but more complex)
3. Keyset pagination (fastest, but requires stable sort key)

## Recommendation
**Cursor-based pagination** (Option 2)

Rationale:
- Performance: O(1) regardless of page depth
- Scalability: Handles 100k+ users efficiently
- UX: Simple page/limit interface
- Trade-off: Slightly more complex implementation (acceptable)

Expected Outcomes:
- Response time: <100ms (p95) - 88% improvement
- Memory: <2MB per request - 83% reduction
- Scalability: Supports 10x user growth

## Implementation Plan
Scale: Medium (8 hours)
Next: ROR Design Document
```

### User Decision

**User reviews investigation document and approves:**
```
User: "Approve investigation. Proceed to implementation."
```

---

## Phase 3: Implementation

**Goal:** Build solution with TDD, enforce quality gates

**See:** [Implementation Workflow](./implementation-workflow.md) for complete implementation process.

### Scale-Based Implementation

**Small Scale (0-4 hours):**
- KIL executes with TDD
- BAS enforces quality gates
- No stop points

**Medium Scale (4-16 hours):**
- ROR creates Design Document
- STOP POINT #1: Design review
- KIL implements with TDD
- BAS enforces quality gates
- DRA reviews compliance

**Large Scale (16+ hours):**
- MON/ROR/TRA/EUS plan thoroughly
- STOP POINT #1: Design review
- KIL implements incrementally
- STOP POINT #2: Mid-implementation (50%)
- DRA reviews compliance
- STOP POINT #3: Pre-merge review
- JUNO comprehensive audit
- STOP POINT #4: Post-deployment audit

---

## Phase 4: Documentation

**Goal:** Preserve knowledge, extract patterns, update Knowledge Base

### Automatic Documentation (KIL)

**During implementation, KIL documents:**
```markdown
trinity/sessions/YYYY-MM-DD-HH-MM/implementation-notes.md

# Implementation: User List Pagination

## Tasks Completed
1. ✅ PaginationHelper utility (1.5h)
2. ✅ UserService.listUsers() pagination (2h)
3. ✅ UserController.getUsers() endpoint (1.5h)

## Patterns Used
- Service layer pattern (existing)
- Input validation with Joi
- Error handling with try-catch

## Patterns Discovered
- Reusable pagination utility (applicable to all list endpoints)
- Cursor encoding pattern (Base64 encode skip value)

## Challenges
- Initial offset approach caused slow queries at high page numbers
- Switched to cursor-based after performance testing

## Test Coverage
- PaginationHelper: 100%
- UserService.listUsers(): 95%
- UserController.getUsers(): 90%
- Overall: 94.2%

## Performance Results
- Response time: 78ms (p95) - 91% improvement
- Memory: 1.8MB per request - 85% reduction
- Database: Indexed query, 10-50 results per page
```

### Learning System (Automatic Pattern Extraction)

**Learning System analyzes implementation and extracts patterns:**

```typescript
// Learned pattern stored in trinity/learning/patterns/
{
  "id": "pagination-cursor-based-001",
  "name": "Cursor-Based Pagination Pattern",
  "category": "API",
  "confidence": 0.92,
  "context": {
    "technology": "TypeScript + MongoDB",
    "problem": "Paginate large collections efficiently"
  },
  "solution": {
    "approach": "Cursor-based pagination with Base64-encoded skip value",
    "implementation": "PaginationHelper utility + service layer integration",
    "performance": "O(1) time complexity regardless of page depth"
  },
  "applicability": {
    "similar_contexts": [
      "Any list endpoint with >100 items",
      "MongoDB collections requiring pagination",
      "REST APIs with scalability requirements"
    ]
  },
  "metrics": {
    "performance_improvement": "91%",
    "implementation_time": "5 hours",
    "test_coverage": "94.2%"
  }
}
```

**Pattern shared with other agents via Knowledge Sharing Bus.**

### Knowledge Base Updates (ZEN)

**ZEN updates Knowledge Base with session learnings:**

**Updated Files:**
- `trinity/knowledge-base/ARCHITECTURE.md` - Add pagination pattern
- `trinity/knowledge-base/To-do.md` - Mark task complete
- `trinity/knowledge-base/PATTERNS.md` - Document cursor-based pagination
- `trinity/knowledge-base/PERFORMANCE.md` - Update API baseline metrics

---

## Phase 5: Session End

**Goal:** Archive session, extract insights, prepare for next session

### Session Archiving Example

```bash
# Manual session archiving script
echo "=== Trinity Method Session End ==="

# Create session archive directory
SESSION_DIR="trinity/sessions/$(date +%Y-%m-%d-%H-%M)"
mkdir -p "$SESSION_DIR"

# Archive session files
echo "Archiving session files..."
cp trinity/investigations/*.md "$SESSION_DIR/" 2>/dev/null || true
cp trinity/design-docs/*.md "$SESSION_DIR/" 2>/dev/null || true
cp trinity/work-orders/*.md "$SESSION_DIR/" 2>/dev/null || true
cp trinity/audits/*.md "$SESSION_DIR/" 2>/dev/null || true

# Create session summary
cat > "$SESSION_DIR/SESSION-SUMMARY.md" << EOF
# Session Summary

**Date:** $(date)
**Duration:** [Auto-calculated if tracked]

## Objectives
[Session goals from Phase 1]

## Completed Work
[Tasks from To-do.md marked complete]

## Investigation Findings
[Links to investigation documents]

## Implementation Details
[Links to design docs, code changes]

## Patterns Learned
[Extracted patterns from Learning System]

## Next Session
[Planned tasks, carry-over items]
EOF

echo "Session archived to: $SESSION_DIR"
echo ""
echo "=== Session End Complete ==="
```

### Manual Session Retrospective

**Developer/User reflects:**
```markdown
Session Retrospective: 2025-11-05-14-30

## What Went Well
- Investigation was thorough, prevented premature optimization
- Cursor-based pagination performed better than expected (91% improvement)
- TDD cycle kept code quality high (94.2% coverage)

## What Could Improve
- Initial offset approach wasted 1 hour before pivoting to cursor
- Could have consulted ZEN for existing pagination patterns earlier

## Learnings
- Always check Knowledge Base for patterns before implementing
- Performance testing in GREEN phase (not REFACTOR) saves time

## Next Session
- Apply cursor pagination to /api/projects endpoint
- Extract PaginationHelper to shared utilities package
```

### Cross-Session Knowledge Transfer

**Prepared for next session:**

1. **Updated To-do.md:**
```markdown
## Active Tasks
- [ ] Apply cursor pagination to /api/projects (2h)
- [ ] Extract PaginationHelper to @shared/utils (1h)

## Completed
- [x] Implement pagination for /api/users (5h) - 2025-11-05
```

2. **Pattern Available:**
- `trinity/learning/patterns/pagination-cursor-based-001.json`
- Learning System will suggest this pattern when "pagination" context detected

3. **Baseline Updated:**
- GET /api/users: 78ms (p95) ← new baseline
- Future changes measured against this

4. **Knowledge Base Enhanced:**
- ARCHITECTURE.md documents pagination approach
- PATTERNS.md includes cursor-based pagination example

---

## Cross-Session Learning Example

### Session N (Current Session)
```markdown
Problem: Implement pagination for /api/users
Investigation: 30 minutes (manual research, pattern exploration)
Implementation: 5 hours
Total: 5.5 hours
```

### Session N+1 (Next Session with Learning)
```markdown
Problem: Implement pagination for /api/projects

Learning System detects similarity:
  "Similar pattern found: pagination-cursor-based-001"
  "Confidence: 0.92"
  "Estimated time savings: 60-70%"

Suggested approach:
  - Reuse PaginationHelper utility
  - Copy test structure from /api/users tests
  - Apply same cursor encoding pattern

Investigation: 10 minutes (pattern review only)
Implementation: 2 hours (reuse existing pattern)
Total: 2.2 hours (60% faster than Session N)
```

**Learning System impact:** 3.3 hours saved per similar task.

---

## Session Archive Structure

```
trinity/sessions/
├── 2025-11-05-09-00/          # Morning session
│   ├── SESSION-SUMMARY.md
│   ├── investigation-user-auth.md
│   ├── design-doc-user-auth.md
│   └── implementation-notes.md
├── 2025-11-05-14-30/          # Afternoon session
│   ├── SESSION-SUMMARY.md
│   ├── investigation-user-pagination.md
│   ├── design-doc-pagination.md
│   ├── implementation-notes.md
│   └── performance-report.md
└── 2025-11-06-09-00/          # Next day session
    ├── SESSION-SUMMARY.md
    └── ... (next session files)
```

**Archive Benefits:**
- Complete session history for audit trail
- Pattern recognition across sessions
- Onboarding resource for new developers
- Investigation reuse (similar problems)

---

## Session Types

### Development Session (Most Common)
```yaml
Duration: 2-8 hours
Phases: All 5 phases
Focus: Build new features, fix bugs
Agents: ALY, ROR, KIL, BAS, DRA
Output: Code, tests, documentation, patterns
```

### Investigation-Only Session
```yaml
Duration: 30-90 minutes
Phases: 1-2 only (start + investigate)
Focus: Research, analysis, decision-making
Agents: ALY, ZEN, BAS, MON, JUNO
Output: Investigation document, recommendation
Note: No implementation (decision may be "don't build")
```

### Refactoring Session
```yaml
Duration: 1-4 hours
Phases: 1-2-3-4-5 (brief investigation, focus on implementation)
Focus: Reduce technical debt, improve code quality
Agents: URO, KIL, BAS, DRA
Output: Cleaner code, maintained functionality, no new features
```

### Audit Session
```yaml
Duration: 1-3 hours
Phases: 1-2-4-5 (no implementation)
Focus: Security, performance, technical debt assessment
Agents: JUNO, ALY, ZEN
Output: Audit report, remediation recommendations
```

### Emergency Session (Crisis Management)
```yaml
Duration: 20-90 minutes
Phases: Condensed (rapid investigation → immediate fix)
Focus: Production incidents, critical bugs
Agents: ALY (coordinates), relevant specialists
Output: Hotfix, incident report, prevention measures
```

---

## Session Management Best Practices

### 1. Always Start with Session Goal

**Good:**
```
Session Goal: Implement cursor-based pagination for user list
Success: API endpoint supports pagination with <100ms response time
```

**Bad:**
```
Session Goal: Work on pagination stuff
```

### 2. Investigation Before Implementation (Always)

**Even for "simple" tasks:**
- Check Knowledge Base for existing patterns
- Review ISSUES.md for known blockers
- Understand current baselines (performance, coverage)

**Trinity Method Law:** "No updates without investigation."

### 3. Document as You Go (Not at the End)

**KIL documents during implementation:**
- After each task completion
- When discovering new patterns
- When encountering challenges

**Don't wait until session end** - memory fades, details lost.

### 4. Archive Every Session (No Exceptions)

**Even "failed" sessions are valuable:**
- What didn't work (prevent future repetition)
- What was learned
- Why approach was abandoned

**Knowledge preserved = time saved in future sessions.**

### 5. Extract Patterns Proactively

**Learning System is automatic, but you can help:**
- Highlight reusable patterns in implementation notes
- Tag patterns with contexts (technology, problem type)
- Suggest pattern applications to other areas

### 6. Review Archives When Starting Similar Work

**Before implementing similar feature:**
1. Search `trinity/sessions/` for related work
2. Check `trinity/learning/patterns/` for applicable patterns
3. Review `trinity/knowledge-base/PATTERNS.md` for documented approaches

**5-10 minute review can save 2-4 hours of implementation time.**

---

## Session Metrics (Tracked by SDK)

**Automatic Tracking:**
```yaml
Session Duration: Start hook timestamp → End hook timestamp
Investigation Time: Investigation document creation → approval
Implementation Time: First KIL task → last BAS gate pass
Documentation Time: Implementation complete → session archive
Total Time: Sum of all phases

Tasks Completed: Count from To-do.md changes
Patterns Extracted: Count from Learning System
Test Coverage: From BAS Phase 5
Quality Gates Passed: From BAS executions
Stop Points: Count and duration

Performance Impact:
  - Baseline before vs after
  - Response time improvement %
  - Resource usage reduction %
```

**Metrics Used For:**
- Estimation refinement (future similar tasks)
- Pattern effectiveness measurement
- Developer productivity insights
- ROI calculation (time saved by Learning System)

---

## Related Workflows

- **Investigation:** [Investigation Workflow](./investigation-workflow.md)
- **Implementation:** [Implementation Workflow](./implementation-workflow.md)
- **Audit:** [Audit Workflow](./audit-workflow.md)

---

**Start with intention. Build with discipline. End with wisdom.**
