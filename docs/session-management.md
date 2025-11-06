# Session Management Guide

**Trinity Method SDK v2.0 - Session Lifecycle & Knowledge Preservation**
**Last Updated:** 2025-11-05

---

## Table of Contents

1. [Session Philosophy](#session-philosophy)
2. [Session Lifecycle](#session-lifecycle)
3. [Session Documentation](#session-documentation)
4. [Archive Organization](#archive-organization)
5. [Cross-Session Learning](#cross-session-learning)
6. [Session Commands](#session-commands)
7. [Best Practices](#best-practices)

---

## Session Philosophy

### What Is a Session?

**A session is a focused period of development work** with clear boundaries (start and end) and preserved artifacts.

**Trinity Method Principle:** Knowledge is preserved, not lost. Every session builds on the last.

### Why Sessions Matter

**Without Session Management:**
- ❌ Lost context between work periods
- ❌ Forgotten learnings and decisions
- ❌ Repeated mistakes
- ❌ No learning accumulation
- ❌ Difficult to resume work

**With Session Management:**
- ✅ Context automatically preserved
- ✅ Learnings documented
- ✅ Patterns extracted
- ✅ Knowledge compounds
- ✅ Easy to resume work

### Trinity Method Session Principles

**1. Every Session Is Documented**
```yaml
Artifacts:
  - What was investigated
  - What was implemented
  - What patterns emerged
  - What issues arose
  - What was learned
```

**2. Knowledge Accumulates Across Sessions**
```yaml
Session 1: Investigate pagination
    ↓
Session 2: Implement pagination (uses Session 1 knowledge)
    ↓
Session 3: Apply pagination to another endpoint (reuses pattern)
```

**3. Sessions Are Retrievable**
```yaml
Archive Structure:
  trinity/sessions/2025-11-05-09-30/
    - investigation-summary.md
    - implementation-notes.md
    - patterns-discovered.md
    - session-retrospective.md
```

---

## Session Lifecycle

### Phase 1: Session Start

**Goal:** Load context from previous sessions, plan current session work.

**Activities:**
```yaml
1. Review Last Session:
   - Read previous session retrospective
   - Understand what was accomplished
   - Identify any blockers or issues

2. Check Current State:
   - Review To-do.md (what's next)
   - Check ISSUES.md (any critical issues)
   - Review Technical-Debt.md (metrics trends)

3. Plan Session:
   - Select tasks for this session
   - Define session goals
   - Estimate time needed
```

**SDK Support:**
```bash
# Automatic session start (if using hooks)
./trinity-hooks/session-start.sh

# Displays:
# - Last session summary
# - Current tasks (To-do.md top 20)
# - Critical issues (ISSUES.md P0 items)
# - Ready message
```

**Manual Session Start:**
```bash
# Review last session
ls -t trinity/sessions/ | head -1
cat trinity/sessions/[last-session]/session-retrospective.md

# Check current tasks
cat trinity/knowledge-base/To-do.md

# Check critical issues
grep "P0" trinity/knowledge-base/ISSUES.md
```

---

### Phase 2: Investigation

**Goal:** Understand before implementing.

**Activities:**
```yaml
1. Create Investigation Document:
   - Copy template: trinity/templates/INVESTIGATION-TEMPLATE.md
   - Fill in investigation details
   - Or use ALY to create automatically

2. Gather Evidence:
   - ZEN: Analyze codebase
   - BAS: Measure baselines
   - MON: Define acceptance criteria

3. Document Findings:
   - Current state analysis
   - Root cause (if bug)
   - Proposed solution
   - Risk assessment
```

**SDK Support:**
```typescript
// Automated investigation
User: "Please review .claude/agents/leadership/aly-cto.md to
       investigate [issue]"
    ↓
ALY: Creates investigation document automatically
Location: trinity/investigations/YYYY-MM-DD-issue-name.md
```

---

### Phase 3: Implementation

**Goal:** Build with quality, following TDD.

**Activities:**
```yaml
1. Design (Medium/Large Scale):
   - ROR creates Design Doc
   - User reviews and approves
   - EUS decomposes into atomic tasks

2. Implementation (TDD):
   - KIL: RED (write failing test)
   - KIL: GREEN (make test pass)
   - KIL: REFACTOR (improve code)
   - BAS: Quality gates after each commit

3. Review:
   - DRA: Code review (stop points)
   - JUNO: Final audit (Large scale)
   - User: Acceptance testing
```

**SDK Support:**
```typescript
// Automated implementation
ALY → MON/ROR → EUS → KIL (loop) → BAS → DRA → JUNO
// All implementation automatically tracked
```

---

### Phase 4: Documentation

**Goal:** Preserve knowledge for future sessions.

**Activities:**
```yaml
1. Implementation Notes:
   - What was built
   - How it was implemented
   - Decisions made
   - Challenges overcome

2. Pattern Extraction:
   - Successful approaches
   - Reusable solutions
   - Anti-patterns avoided

3. Knowledge Base Updates:
   - ARCHITECTURE.md (system changes)
   - ISSUES.md (resolved issues)
   - Technical-Debt.md (metrics updated)
   - Trinity.md (methodology learnings)
```

**SDK Support:**
```typescript
// Automatic documentation
ZEN: Updates knowledge base automatically during session
Learning System: Extracts patterns automatically
APO: Generates API documentation
```

---

### Phase 5: Session End

**Goal:** Archive session materials, extract learnings.

**Activities:**
```yaml
1. Create Session Archive:
   - Copy investigations
   - Copy work orders
   - Copy implementation notes
   - Create session summary

2. Extract Patterns:
   - Identify successful approaches
   - Document in trinity/patterns/
   - Learning System auto-extraction

3. Session Retrospective:
   - What went well
   - What could improve
   - Action items for next session

4. Prepare Next Session:
   - Update To-do.md
   - Note blockers
   - Plan next priorities
```

**SDK Support:**
```bash
# Automatic session end (if using hooks)
./trinity-hooks/session-end-archive.sh

# Creates:
# trinity/sessions/YYYY-MM-DD-HH-MM/
#   - All investigations
#   - All work orders
#   - Session summary
#   - Patterns discovered
#   - Implementation notes
```

---

## Session Documentation

### Required Session Artifacts

**1. Investigation Summary**
```markdown
# Investigation Summary

**Session Date:** 2025-11-05
**Investigations:** 2

## Investigation 1: Slow API Response Time
- **Issue:** /api/users taking 1847ms
- **Root Cause:** N+1 query problem
- **Solution:** Pagination + eager loading
- **Result:** 150ms (92% improvement)

## Investigation 2: Console Errors in Production
- **Issue:** TypeError: Cannot read property 'map' of undefined
- **Root Cause:** API returns null, component expects array
- **Solution:** Add null check with optional chaining
- **Result:** Zero console errors

## Patterns Identified:
1. N+1 Query Prevention (applied)
2. Null Safety Pattern (applied)
```

**Location:** `trinity/sessions/YYYY-MM-DD-HH-MM/investigation-summary.md`

---

**2. Implementation Notes**
```markdown
# Implementation Notes

**Session Date:** 2025-11-05
**Scale:** MEDIUM (6 hours total)

## What Was Built

### Feature: Pagination for /api/users
- **Commits:** 5 (all atomic, TDD)
- **Tests Added:** 12 (unit + integration)
- **Coverage:** 84% → 87%
- **Performance:** 1847ms → 150ms

### Implementation Details:
1. Added `getPaginatedUsers(page, limit)` function
2. Added pagination metadata response
3. Added query parameter validation
4. Updated API documentation
5. Extracted pagination utility function

### Challenges:
- Database count query slow → optimized with index
- Pagination metadata calculation edge cases → added tests
- Backward compatibility → made pagination optional

### Decisions:
- Use limit/offset (not cursor) - simpler for this use case
- Default 20 items per page - balances performance/UX
- Max 100 items per page - prevents abuse
```

**Location:** `trinity/sessions/YYYY-MM-DD-HH-MM/implementation-notes.md`

---

**3. Patterns Discovered**
```markdown
# Patterns Discovered

**Session Date:** 2025-11-05

## Pattern 1: Pagination with N+1 Prevention

**Context:** API endpoints returning collections

**Problem:** Fetching all records causes performance issues and N+1 queries

**Solution:**
\`\`\`typescript
async function getPaginatedUsers(page: number, limit: number) {
  const [users, total] = await Promise.all([
    db.users
      .select('id', 'name', 'email')  // Only needed fields
      .include({ roles: true })        // Eager load relations
      .limit(limit)
      .offset((page - 1) * limit),
    db.users.count()
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}
\`\`\`

**Benefits:**
- 92% performance improvement (1847ms → 150ms)
- 98% query reduction (47 queries → 1 query)
- Scalable to large datasets

**Reusability:** HIGH
**Confidence:** 0.95
**Applied:** /api/users (successful)
**Next Application:** /api/posts, /api/comments
```

**Location:** `trinity/sessions/YYYY-MM-DD-HH-MM/patterns-discovered.md`

---

**4. Session Retrospective**
```markdown
# Session Retrospective

**Session Date:** 2025-11-05
**Duration:** 6 hours
**Scale:** MEDIUM

## What Went Well ✅

1. **Investigation was thorough**
   - Found root cause quickly (N+1 queries)
   - Evidence-based decision (benchmarks)
   - Clear solution path

2. **TDD workflow smooth**
   - All tests written first
   - BAS quality gates caught issues early
   - No rework needed

3. **Pattern emerged naturally**
   - Pagination + N+1 prevention
   - Immediately applicable to other endpoints
   - Learning System extracted automatically

## What Could Improve 🔧

1. **Initial time estimate off**
   - Estimated: 4 hours
   - Actual: 6 hours
   - Reason: Database optimization needed (not anticipated)
   - Learning: Always budget time for optimization

2. **Documentation lagged**
   - Forgot to update API docs during implementation
   - Had to add after the fact
   - Solution: Add to TDD checklist

3. **Testing edge cases**
   - Pagination edge cases (page out of range) found late
   - Should test edge cases in RED phase
   - Solution: Edge case test template

## Action Items for Next Session 📋

- [ ] Apply pagination pattern to /api/posts
- [ ] Create edge case test template
- [ ] Update TDD checklist (add documentation step)
- [ ] Review other endpoints for N+1 patterns

## Metrics

**Before Session:**
- Technical Debt: TODO count = 42
- Performance: /api/users = 1847ms
- Coverage: 84%

**After Session:**
- Technical Debt: TODO count = 41
- Performance: /api/users = 150ms ✅
- Coverage: 87% ✅

## Next Session Goals

1. Apply pagination to /api/posts
2. Extract pagination utility to shared module
3. Add database indexing for common queries
```

**Location:** `trinity/sessions/YYYY-MM-DD-HH-MM/session-retrospective.md`

---

## Archive Organization

### Session Archive Structure

```
trinity/sessions/
├── 2025-11-01-09-00/
│   ├── investigation-summary.md
│   ├── implementation-notes.md
│   ├── patterns-discovered.md
│   ├── issues-resolved.md
│   ├── session-retrospective.md
│   └── git-commits.log
├── 2025-11-01-14-30/
│   └── [same structure]
├── 2025-11-02-09-00/
│   └── [same structure]
└── 2025-11-05-09-30/  # Current session
    └── [same structure]
```

### Naming Convention

**Format:** `YYYY-MM-DD-HH-MM`

**Why:**
- Chronological sorting (ls -t works)
- Clear date/time identification
- No ambiguity
- Cross-platform compatible

### What Gets Archived

**Automatically (via session-end-archive.sh):**
```yaml
Investigations:
  - All files from trinity/investigations/

Work Orders:
  - All files from trinity/work-orders/

Implementation:
  - Git commit log (last 8 hours)
  - File change summary
  - Key implementation decisions

Patterns:
  - Auto-extracted by Learning System
  - Confidence scores
  - Reusability ratings

Retrospective:
  - Template auto-filled with metrics
  - User completes "what went well" and "what could improve"
```

**Manually (user adds):**
```yaml
Notes:
  - Meeting notes
  - Design discussions
  - Architecture decisions
  - Team feedback

Screenshots:
  - UI implementations
  - Before/after comparisons
  - Error messages
  - Performance graphs
```

---

## Cross-Session Learning

### How Knowledge Transfers Between Sessions

**Session N:**
```yaml
Investigates: Pagination for /api/users
Implements: Pagination with N+1 prevention
Extracts Pattern: "Pagination with N+1 Prevention"
Archives: trinity/sessions/2025-11-05-09-30/
```

**Session N+1:**
```yaml
Loads Context: Reads Session N retrospective
Sees Pattern: "Pagination with N+1 Prevention" available
Task: Pagination for /api/posts
    ↓
Learning System: Suggests pattern (confidence: 0.95)
    ↓
ALY: "I recommend applying the pagination pattern from Session N"
    ↓
Implementation: Reuses pattern (30% faster than Session N)
    ↓
Pattern Confidence: 0.95 → 0.98 (validated again)
```

**Session N+2:**
```yaml
Task: Pagination for /api/comments
    ↓
Learning System: Suggests pattern (confidence: 0.98)
    ↓
Pattern now standard approach (automatic suggestion)
    ↓
Implementation: 50% faster than Session N (workflow optimized)
```

### Learning System Integration

**Pattern Extraction (Automatic):**
```typescript
// After session end
const patterns = await learningSystem.extractPatterns(sessionId);

// Extracted patterns include:
{
  name: "Pagination with N+1 Prevention",
  confidence: 0.95,
  metrics: {
    performanceImprovement: 0.92,  // 92%
    queryReduction: 0.98,          // 98%
    timeToImplement: 6              // hours
  },
  applicableContexts: [
    "API endpoints returning collections",
    "Database queries with relations",
    "Performance optimization scenarios"
  ]
}
```

**Pattern Suggestion (Next Session):**
```typescript
// At session start
const suggestions = await learningSystem.suggestPatterns({
  context: "pagination for /api/posts",
  similarPastTasks: true
});

// Returns:
[
  {
    pattern: "Pagination with N+1 Prevention",
    confidence: 0.95,
    reason: "Similar context: API endpoint, collection, performance",
    previousSuccess: {
      session: "2025-11-05-09-30",
      improvement: "92%",
      effort: "6 hours"
    }
  }
]
```

---

## Session Commands

### Using `/trinity-start` (Slash Command)

**Purpose:** Begin Trinity Method session with context loading

```bash
# In Claude Code
/trinity-start

# What it does:
1. Loads previous session context
2. Displays current tasks (To-do.md)
3. Shows critical issues (ISSUES.md P0)
4. Suggests patterns from previous sessions
5. Sets up session environment
```

---

### Using `/trinity-end` (Slash Command)

**Purpose:** End Trinity Method session with automatic archiving

```bash
# In Claude Code
/trinity-end

# What it does:
1. Creates session archive (trinity/sessions/YYYY-MM-DD-HH-MM/)
2. Copies all session artifacts
3. Extracts patterns (Learning System)
4. Updates knowledge base (ZEN)
5. Creates session summary
6. Generates retrospective template
```

---

### Manual Session Commands

**Start Session:**
```bash
# Option 1: Use hook
./trinity-hooks/session-start.sh

# Option 2: Manual review
cat trinity/sessions/$(ls -t trinity/sessions | head -1)/session-retrospective.md
cat trinity/knowledge-base/To-do.md
```

**End Session:**
```bash
# Option 1: Use hook
./trinity-hooks/session-end-archive.sh

# Option 2: Manual archive
mkdir -p trinity/sessions/$(date +%Y-%m-%d-%H-%M)
cp trinity/investigations/*.md trinity/sessions/$(date +%Y-%m-%d-%H-%M)/
# ... copy other artifacts
```

---

## Best Practices

### 1. End Every Session

**Why:** Don't lose knowledge when stepping away

```bash
# ❌ Bad: Just close laptop
# Knowledge lost, no archive, can't resume easily

# ✅ Good: Run session end
./trinity-hooks/session-end-archive.sh
# Knowledge preserved, easy to resume
```

**When to End Session:**
- End of work day
- Taking multi-day break
- Switching to different project
- Before major context switch

---

### 2. Review Previous Session at Start

**Why:** Load context efficiently

```bash
# At session start
cat trinity/sessions/$(ls -t trinity/sessions | head -1)/session-retrospective.md

# See:
# - What was accomplished
# - What went well
# - What to improve
# - Next session goals
```

**Saves:** 15-30 minutes of context rebuilding

---

### 3. Complete Retrospectives

**Why:** Continuous improvement

```markdown
# ❌ Bad: Skip retrospective
# No learning, repeat mistakes

# ✅ Good: Complete retrospective
## What Went Well:
- TDD workflow smooth
- Pattern emerged naturally

## What Could Improve:
- Time estimates off
- Documentation lagged

## Action Items:
- Add to TDD checklist
- Create time estimation guide
```

**Result:** Each session improves process

---

### 4. Extract Patterns Explicitly

**Why:** Knowledge becomes reusable

```markdown
# When you solve a problem well:
1. Document the pattern
2. Add to trinity/patterns/
3. Include confidence score
4. Note where to apply next

# Learning System will:
- Extract automatically at session end
- Suggest in similar contexts
- Track effectiveness
```

---

### 5. Keep Sessions Focused

**Why:** Clear boundaries, better documentation

```yaml
Good Session:
  Duration: 2-8 hours
  Goals: 1-3 related tasks
  Theme: Clear focus area
  Archive: Coherent story

Bad Session:
  Duration: 2+ days
  Goals: 10+ unrelated tasks
  Theme: Everything at once
  Archive: Confusing mix
```

**Recommendation:** End session when switching context

---

## Conclusion

Session management is **knowledge preservation in action**. The Trinity Method SDK makes it **automatic and systematic**.

**Every session:**
- Starts with context (previous session loaded)
- Proceeds with investigation (documented)
- Implements with quality (TDD + BAS)
- Ends with archiving (automatic)
- Feeds next session (patterns suggested)

**Result:** Knowledge compounds, skills improve, velocity increases.

---

**Trinity Method SDK: Where Every Session Builds on the Last**

*Start with context. End with knowledge. Repeat.*

---

**Document Version:** 2.0
**SDK Version:** 2.0.0
**Last Updated:** 2025-11-05
**Related:** [Hooks Guide](./hooks-guide.md), [Best Practices](./best-practices.md), [Investigation-First Complete](./methodology/investigation-first-complete.md#knowledge-management)
