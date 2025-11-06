# Context Management & Issue Tracking Guide

**CLAUDE.md Hierarchy and ISSUES.md Best Practices**
**Trinity Method SDK v2.0**
**Last Updated:** 2025-11-05

---

## Overview

Effective context management and issue tracking are critical for Trinity Method success. This guide covers the 3-tier CLAUDE.md hierarchy and comprehensive issue tracking patterns.

---

## Part 1: CLAUDE.md Context Hierarchy

### The 3-Tier System

```
project/
├── CLAUDE.md                    # Tier 1: Project-level (global)
├── src/CLAUDE.md                # Tier 2: Technology-specific
└── trinity/CLAUDE.md            # Tier 3: Trinity enforcement
```

**Purpose:** Progressive context specificity from general → specific → enforcement

---

### Tier 1: Project Root CLAUDE.md

**Location:** `project/CLAUDE.md`
**Purpose:** Global project context, always loaded first

**Contents:**
```markdown
# Project Name - Claude Code Memory

**Framework:** [Your framework]
**Tech Stack:** [Your stack]
**Source Directory:** [Your src]
**Trinity Version:** 2.0.0
**Deployed:** [Deployment date]

---

## Trinity Method Core Philosophy

**The Fundamental Law:** "No updates without investigation. No changes without Trinity consensus. No shortcuts without consequences."

**Every action must be:**
1. **Investigated** - Understand before acting
2. **Evidenced** - Support with data
3. **Verified** - Test comprehensively
4. **Documented** - Preserve knowledge

**See:** [README.md](README.md#core-philosophy) for complete philosophy

---

## Project Overview

[Your project description, goals, current state]

## Architecture

See: [trinity/knowledge-base/ARCHITECTURE.md](trinity/knowledge-base/ARCHITECTURE.md)

## Current Tasks

See: [trinity/knowledge-base/To-do.md](trinity/knowledge-base/To-do.md)

## Known Issues

See: [trinity/knowledge-base/ISSUES.md](trinity/knowledge-base/ISSUES.md)

---

## Navigation Guide

### Key Directories
- `src/` - [Description]
- `tests/` - [Description]
- `docs/` - [Description]
- `trinity/` - Trinity Method artifacts

### Key Files
1. `src/index.ts` - [Description]
2. `src/config.ts` - [Description]
3. `package.json` - [Description]
```

---

### Tier 2: Source Directory CLAUDE.md

**Location:** `src/CLAUDE.md`
**Purpose:** Technology and framework-specific rules

**Contents:**
```markdown
# Source Code Context - [Project Name]

## Module System

**ALWAYS use ESM (ES Modules), NEVER use CommonJS:**

\`\`\`typescript
// CORRECT - ESM imports
import { module } from 'package';
import path from 'path';

// WRONG - CommonJS (will break builds)
const module = require('package');
\`\`\`

**Why:** [Your reasoning]

## TypeScript Configuration

**Strict Mode Active:**
- `strict: true`
- `noImplicitReturns: true`
- `strictNullChecks: true`

## Framework-Specific Patterns

### [Framework Name]

**Pattern 1: [Name]**
\`\`\`typescript
// Example
\`\`\`

**Pattern 2: [Name]**
\`\`\`typescript
// Example
\`\`\`

## Common Anti-Patterns to AVOID

1. **[Anti-Pattern 1]** - [Explanation]
2. **[Anti-Pattern 2]** - [Explanation]
```

---

### Tier 3: Trinity Enforcement CLAUDE.md

**Location:** `trinity/CLAUDE.md`
**Purpose:** Trinity Method enforcement and agent coordination

**Contents:**
```markdown
# Trinity Method - Enforcement Context

## Investigation Requirements

**BEFORE any code changes:**
- Create investigation document: trinity/investigations/
- Use ALY to coordinate evidence collection
- Document decision with rationale
- Get user approval before implementation

## Agent Coordination

**For Medium/Large implementations:**
1. MON: Analyze requirements
2. ROR: Create Design Document
3. TRA: Create implementation plan
4. EUS: Decompose into atomic tasks
5. KIL: Implement with TDD
6. BAS: Enforce quality gates (automatic)
7. DRA: Review code compliance

## Quality Standards

**Non-Negotiable:**
- Test coverage ≥80%
- All BAS phases must pass
- Functions ≤2 parameters
- Function length <200 lines
- Nesting depth ≤4 levels

## Work Order Requirements

**All work must have:**
- Work order document: trinity/work-orders/WO-###-name.md
- Clear deliverables
- Acceptance criteria
- Test requirements
```

---

## Part 2: ISSUES.md Issue Tracking

### Issue Template

```markdown
# Known Issues - [Project Name]

**Last Updated:** YYYY-MM-DD

---

## ACTIVE ISSUES

### Issue #001: [Title]

**Status:** Active / In Progress / Resolved / Deferred
**Severity:** P0-Critical / P1-High / P2-Medium / P3-Low
**Category:** Bug / Performance / Security / Technical Debt / UX
**Component:** [Affected component/module]
**Discovered:** YYYY-MM-DD
**Assigned:** [Person or Agent]

#### Problem

[Clear description of the issue]

#### Impact

- **Users Affected:** [Number or percentage]
- **Frequency:** [Always / Often / Sometimes / Rare]
- **Workaround Available:** [Yes/No - describe if yes]

#### Root Cause

[Analysis of why this is happening]

#### Evidence

- Error logs: [Link or excerpt]
- Reproduction steps:
  1. [Step 1]
  2. [Step 2]
  3. [Expected vs Actual]

#### Solution Options

**Option 1:** [Description]
- **Effort:** [Time estimate]
- **Risk:** [Assessment]
- **Pros/Cons:** [List]

**Option 2:** [Description]
- **Effort:** [Time estimate]
- **Risk:** [Assessment]
- **Pros/Cons:** [List]

#### Recommended Solution

[Chosen approach with rationale]

#### Investigation Document

See: [trinity/investigations/YYYY-MM-DD-issue-001.md](trinity/investigations/YYYY-MM-DD-issue-001.md)

#### Work Order

[Link to work order once created]

#### Resolution

[Once resolved - what was done, verification, date]

---

### Issue #002: [Next Issue]

[Same template...]

---

## RESOLVED ISSUES (Archive)

### Issue #042: [Resolved Issue Title]

**Resolved:** YYYY-MM-DD
**Resolution:** [Brief summary]
**See:** [Link to investigation/work order]

---

## DEFERRED ISSUES

### Issue #015: [Deferred Issue Title]

**Deferred Until:** [Condition or date]
**Reason:** [Why deferred]
**Workaround:** [Temporary solution]

---

## ISSUE STATISTICS

### By Severity
\`\`\`yaml
P0_Critical: 0
P1_High: 2
P2_Medium: 5
P3_Low: 3
Total_Active: 10
\`\`\`

### By Category
\`\`\`yaml
Bug: 4
Performance: 2
Security: 1
Technical_Debt: 2
UX: 1
\`\`\`

### By Component
\`\`\`yaml
API: 3
Database: 2
Frontend: 3
Infrastructure: 2
\`\`\`

---

## ISSUE CATEGORIZATION

### By Stack (for multi-stack projects)

#### React Issues
- [Link to react-specific issues]

#### Node.js Issues
- [Link to nodejs-specific issues]

#### Database Issues
- [Link to database-specific issues]

---

## QUICK LINKS

- **Create Investigation:** Use `/trinity-create-investigation`
- **Create Work Order:** Use `/trinity-workorder`
- **View Technical Debt:** See `Technical-Debt.md`
```

---

## Issue Categorization Patterns

### By Severity

**P0 - Critical (Fix Immediately)**
- Security vulnerabilities (data breach risk)
- Data integrity issues (data loss risk)
- System down / unavailable
- Breaking bugs (core functionality broken)

**P1 - High (Fix Within 24-48 Hours)**
- Major feature broken (workaround exists)
- Performance degradation (>50% slower)
- Frequent errors (affecting 10%+ users)

**P2 - Medium (Fix Within 1-2 Weeks)**
- Minor feature broken
- Moderate performance issues
- Infrequent errors (affecting <10% users)
- UX improvements

**P3 - Low (Fix When Possible)**
- Edge cases
- Polish / minor UX improvements
- Technical debt (non-blocking)

---

### By Category

**Bug**
- Incorrect behavior
- Error messages
- Crashes

**Performance**
- Slow response times
- High memory usage
- N+1 queries
- Inefficient algorithms

**Security**
- Vulnerabilities (OWASP Top 10)
- Missing input validation
- Insecure configurations
- Exposed secrets

**Technical Debt**
- Code duplication
- Long functions
- Missing tests
- Outdated dependencies

**UX (User Experience)**
- Confusing UI
- Missing feedback
- Accessibility issues
- Mobile responsiveness

---

### By Component

**API**
- Endpoint errors
- Validation issues
- Authentication/authorization

**Database**
- Query performance
- Schema issues
- Migration problems

**Frontend**
- Component errors
- State management
- Rendering issues

**Infrastructure**
- Deployment failures
- CI/CD issues
- Environment configuration

---

## Issue Tracking Workflow

### Step 1: Discovery

```
Issue discovered (bug report, monitoring alert, user feedback)
    ↓
Create issue in ISSUES.md with template
    ↓
Assign severity and category
    ↓
Link to evidence (logs, reproduction steps)
```

---

### Step 2: Investigation

```
Create investigation document
    ↓
Use /trinity-create-investigation
    ↓
ALY coordinates evidence collection:
    - ZEN: Technical analysis
    - BAS: Performance impact
    - MON: User impact
    - JUNO: Security implications (if relevant)
    ↓
Document root cause and solution options
    ↓
Update ISSUES.md with investigation link
```

---

### Step 3: Resolution

```
Create work order for fix
    ↓
Use /trinity-workorder
    ↓
Implement fix with Trinity workflow:
    - Design (if needed)
    - TDD implementation
    - Quality gates
    - Code review
    ↓
Verify fix resolves issue
    ↓
Update ISSUES.md with resolution
    ↓
Move to RESOLVED ISSUES section
```

---

## Context Best Practices

### 1. Keep CLAUDE.md Files Concise

**Good:** Essential rules, patterns, anti-patterns
**Bad:** Excessive examples, obvious information

**Rule of Thumb:**
- Tier 1 (Root): 200-400 lines
- Tier 2 (src/): 300-600 lines
- Tier 3 (trinity/): 100-200 lines

---

### 2. Update Context When Patterns Change

**When to update:**
- New framework patterns discovered
- Anti-patterns identified
- Project structure changes
- Technology stack updates

**Who updates:**
- ZEN agent (automatic for knowledge base)
- Developer (manual for CLAUDE.md)

---

### 3. Link, Don't Duplicate

**Instead of duplicating in CLAUDE.md:**
```markdown
## Current Tasks

[Full todo list copied here - 500 lines]
```

**Link to source of truth:**
```markdown
## Current Tasks

See: [trinity/knowledge-base/To-do.md](trinity/knowledge-base/To-do.md)
```

---

### 4. Use Progressive Disclosure

**Tier 1 (Root):** High-level project overview
**Tier 2 (src/):** Technology-specific details
**Tier 3 (trinity/):** Trinity enforcement rules

**User sees:** Tier 1 → Tier 2 → Tier 3 (as needed)

---

## Related Documentation

- [Best Practices](./best-practices.md) - Coding best practices
- [Crisis Management](./crisis-management.md) - Incident response
- [Session Workflow](./workflows/session-workflow.md) - Session lifecycle

---

**Effective context + systematic issue tracking = Informed decisions + Quality outcomes**
