# Comprehensive Trinity Method Implementation Example

This example demonstrates what a **complete Trinity Method SDK deployment** looks like for a modern full-stack application. It shows the entire structure, all generated files, and how they work together.

## Table of Contents
1. [Project Profile](#project-profile)
2. [Complete File Structure](#complete-file-structure)
3. [Document Breakdown](#document-breakdown)
4. [Deployment Process](#deployment-process)
5. [Integration Examples](#integration-examples)
6. [Workflow Examples](#workflow-examples)
7. [Advanced Features](#advanced-features)

---

## Project Profile

**Project Name:** MyApp
**Type:** Full-stack SaaS Web Application
**Tech Stack:**

### Frontend
- **Framework**: React 18 + Next.js 14 (App Router)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query

### Backend
- **Framework**: FastAPI 0.104+ (Python 3.11)
- **ORM**: Prisma (via Python client)
- **Database**: PostgreSQL 15
- **Cache**: Redis
- **Authentication**: JWT + OAuth2
- **API Docs**: OpenAPI/Swagger

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Database**: Railway PostgreSQL
- **CDN**: Vercel Edge Network
- **Monitoring**: Sentry + LogRocket
- **CI/CD**: GitHub Actions

### Testing
- **Unit Tests**: Jest (Frontend), Pytest (Backend)
- **Integration Tests**: Playwright
- **E2E Tests**: Playwright + Chromatic
- **Coverage Target**: 80%+

---

## Complete File Structure

After running `trinity deploy`, MyApp's structure looks like this:

```
myapp/
├── .claude/                          # Claude Code integration
│   ├── agents/
│   │   ├── leadership/
│   │   │   ├── trinity-cc.md        # AJ - Chief Code Officer
│   │   │   └── trinity-cto.md       # ALY - CTO Agent
│   │   ├── deployment/
│   │   │   ├── trinity-tan.md       # TAN - Structure Specialist
│   │   │   ├── trinity-zen.md       # ZEN - Knowledge Base Specialist
│   │   │   ├── trinity-ino.md       # INO - Context Specialist
│   │   │   └── ein-cicd.md          # EIN - CI/CD Agent
│   │   └── audit/
│   │       └── trinity-juno.md      # JUNO - Quality Auditor
│   ├── commands/
│   │   ├── trinity-init.md          # Initialize all agents
│   │   ├── trinity-verify.md        # Verify installation
│   │   ├── trinity-start.md         # Start session
│   │   ├── trinity-continue.md      # Resume session
│   │   ├── trinity-end.md           # End session
│   │   ├── trinity-workorder.md     # Create work order
│   │   ├── trinity-docs.md          # Access docs
│   │   └── trinity-agents.md        # List agents
│   ├── hooks/
│   │   ├── user-prompt-submit.sh    # Pre-prompt hook
│   │   └── tool-bash.sh             # Bash tool hook
│   ├── EMPLOYEE-DIRECTORY.md        # Agent documentation
│   └── settings.json                # Claude settings
│
├── trinity/                          # Trinity Method core
│   ├── knowledge-base/
│   │   ├── ARCHITECTURE.md          # System architecture
│   │   ├── ISSUES.md                # Known issues tracker
│   │   ├── To-do.md                 # Task management
│   │   ├── Technical-Debt.md        # Debt tracking
│   │   └── Trinity.md               # Project Trinity guide
│   ├── investigations/               # Investigation reports
│   ├── patterns/                     # Reusable patterns
│   ├── sessions/                     # Session tracking
│   ├── templates/                    # Work order templates
│   │   ├── INVESTIGATION-TEMPLATE.md
│   │   ├── IMPLEMENTATION-TEMPLATE.md
│   │   ├── ANALYSIS-TEMPLATE.md
│   │   ├── AUDIT-TEMPLATE.md
│   │   ├── PATTERN-TEMPLATE.md
│   │   └── VERIFICATION-TEMPLATE.md
│   ├── work-orders/                  # Active work orders
│   ├── CLAUDE.md                     # Trinity context
│   └── VERSION                       # SDK version
│
├── trinity-hooks/                    # Session management
│   ├── session-end-archive.sh
│   └── prevent-git.sh
│
├── CLAUDE.md                         # Global project context
├── TRINITY.md                        # Trinity Method guide
├── src/
│   └── CLAUDE.md                     # Tech-specific context
│
├── .eslintrc.json                    # Linting configuration
├── .prettierrc.json                  # Code formatting
├── .pre-commit-config.yaml           # Pre-commit hooks
├── package.json
└── [other project files...]
```

---

## Document Breakdown

### 1. Root CLAUDE.md
**Purpose:** Global project context for AI assistants

```markdown
# MyApp - Claude Code Memory

**Framework:** React + Next.js 14, FastAPI
**Tech Stack:** TypeScript, Python, PostgreSQL
**Source Directory:** src/
**Trinity Version:** 1.0.0
**Deployed:** 2025-10-02

## Project Overview
MyApp is a modern SaaS platform for team collaboration with
real-time features, multi-tenant architecture, and Stripe billing.

## Architecture
See: trinity/knowledge-base/ARCHITECTURE.md

## Current Tasks
See: trinity/knowledge-base/To-do.md

## Known Issues
See: trinity/knowledge-base/ISSUES.md

---

**Trinity Method:** Investigation-first development methodology
**Session Location:** trinity/sessions/
```

### 2. trinity/CLAUDE.md
**Purpose:** Trinity Method enforcement

```markdown
# Trinity Method Behavioral Enforcement

## Investigation-First Protocol
**MANDATORY:** Before ANY code changes:
1. Create investigation work order
2. Research root cause
3. Document findings
4. Only then implement

## Debugging Requirements
**MANDATORY:** All functions must include:
- [TRINITY {CATEGORY}] console.log statements
- Performance timing (start/end)
- Error handling with Trinity logging

## No Dummy Data
**FORBIDDEN:**
- Mock data in production code
- Hardcoded test values
- Lorem ipsum text
- Placeholder functions

Violations trigger JUNO audit.

## Work Order Protocol
All non-trivial changes require:
- Work order creation via /trinity-workorder
- Investigation phase completion
- Pattern documentation

See: trinity/knowledge-base/Trinity.md
```

### 3. src/CLAUDE.md
**Purpose:** Technology-specific rules

```markdown
# MyApp Technology Stack Context

## Frontend (Next.js 14 + React 18)
- **App Router only** - No Pages directory
- **Server Components default** - Use 'use client' explicitly
- **Zustand for state** - No Redux or Context
- **Tailwind for styling** - No CSS modules

## Backend (FastAPI + Python)
- **Async/await required** - All endpoints async
- **Pydantic v2** - Type validation
- **SQLAlchemy 2.0** - Async ORM
- **JWT authentication** - All protected routes

## Database (PostgreSQL + Prisma)
- **Prisma schema** - Single source of truth
- **Migrations** - Always generate and apply
- **Row-level security** - Multi-tenant isolation

## Testing Requirements
- **80% coverage minimum**
- **Playwright for E2E**
- **Jest for unit tests**
- **Pytest for backend**
```

### 4. trinity/knowledge-base/ARCHITECTURE.md
**Purpose:** System architecture documentation

```markdown
# MyApp Architecture

## System Overview
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Next.js   │────▶│   FastAPI    │────▶│ PostgreSQL  │
│  (Vercel)   │     │  (Railway)   │     │  (Railway)  │
└─────────────┘     └──────────────┘     └─────────────┘
      │                     │                     │
      │                     │                     │
      ▼                     ▼                     ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    Redis    │     │    Stripe    │     │   Sentry    │
│   (Cache)   │     │  (Billing)   │     │ (Monitoring)│
└─────────────┘     └──────────────┘     └─────────────┘
```

## Frontend Architecture
- **Server Components** - Data fetching on server
- **Client Components** - Interactive UI only
- **Zustand** - Global state management
- **TanStack Query** - Server state caching

## Backend Architecture
- **RESTful API** - Standard HTTP endpoints
- **JWT Authentication** - Stateless auth
- **Multi-tenant** - Tenant isolation via RLS
- **Async processing** - Background jobs with Celery

## Database Schema
- **Users** - Authentication and profiles
- **Tenants** - Multi-tenant isolation
- **Subscriptions** - Stripe integration
- **Features** - Feature flags per tenant

## Deployment
- **Vercel** - Frontend (auto-deploy on push)
- **Railway** - Backend + Database
- **GitHub Actions** - CI/CD pipeline
```

### 5. trinity/knowledge-base/To-do.md
**Purpose:** Active task tracking

```markdown
# MyApp Active Tasks

## In Progress
- [ ] WO-042: Implement real-time notifications (AJ, Started: 2025-10-02)
- [ ] WO-041: Optimize dashboard query performance (ALY, Started: 2025-10-01)

## Pending
- [ ] WO-043: Add Stripe webhook handling
- [ ] WO-044: Implement team invite flow
- [ ] WO-045: Add export to CSV feature

## Completed
- [x] WO-040: Fix subscription upgrade bug (Completed: 2025-09-30)
- [x] WO-039: Add multi-tenant row-level security (Completed: 2025-09-28)

## Backlog
- [ ] Add real-time collaboration
- [ ] Implement audit log
- [ ] Add SSO with SAML
- [ ] Create mobile app
```

### 6. trinity/knowledge-base/ISSUES.md
**Purpose:** Known issues tracker

```markdown
# MyApp Known Issues

## Active Issues

### ISSUE-028: Dashboard slow on large datasets
- **Severity:** Medium
- **Affected:** Dashboard page
- **Impact:** Users with >1000 records see 5+ second load times
- **Workaround:** Pagination added, but needs optimization
- **Related WO:** WO-041
- **Status:** In Progress

### ISSUE-027: WebSocket disconnects on mobile
- **Severity:** Low
- **Affected:** Real-time features on mobile
- **Impact:** Notifications delayed by up to 30 seconds
- **Workaround:** Polling fallback implemented
- **Related WO:** WO-042
- **Status:** Investigating

## Resolved Issues

### ISSUE-026: Stripe subscription webhook failures
- **Resolved:** 2025-09-30
- **Solution:** Added retry logic with exponential backoff
- **Related WO:** WO-040
```

### 7. trinity/knowledge-base/Technical-Debt.md
**Purpose:** Technical debt tracking

```markdown
# MyApp Technical Debt

## High Priority

### TD-012: Frontend bundle size (Current: 450KB)
- **Target:** <300KB
- **Impact:** Slow initial page load (3.2s LCP)
- **Effort:** 8 hours
- **Solution:** Code splitting, lazy loading, tree shaking
- **Created:** 2025-09-15
- **Estimated Fix:** 2025-10-15

### TD-011: Database query N+1 problems
- **Location:** `/api/teams/:id/members`
- **Impact:** 50+ queries per request
- **Effort:** 4 hours
- **Solution:** Eager loading with Prisma include
- **Created:** 2025-09-10
- **Estimated Fix:** 2025-10-10

## Medium Priority

### TD-010: Missing E2E tests for billing
- **Coverage:** 0% E2E for payment flows
- **Impact:** Risk of breaking billing in production
- **Effort:** 16 hours
- **Solution:** Playwright tests with Stripe test mode
```

---

## Deployment Process

### Step 1: Initial Deployment

```bash
# Navigate to project
cd myapp

# Deploy Trinity Method
trinity deploy

# Follow interactive prompts
? Project name: MyApp
? Setup linting? Recommended (ESLint + Prettier + Pre-commit)

# Output:
✅ Created trinity/ structure
✅ Deployed 7 agents to .claude/agents/
✅ Deployed 8 slash commands to .claude/commands/
✅ Created hierarchical CLAUDE.md system
✅ Configured linting tools
⏱️  Completed in 8.3 seconds
```

### Step 2: Install Dependencies

```bash
# Install linting dependencies
npm install

# Install pre-commit hooks
pip install pre-commit
pre-commit install
```

### Step 3: Initialize Agents

In Claude Code:
```bash
/trinity-init
```

This runs:
1. **TAN** - Verifies structure deployment
2. **ZEN** - Populates knowledge base
3. **INO** - Sets up context hierarchy
4. **JUNO** - Runs initial quality audit

---

## Integration Examples

### Example 1: Starting a New Feature

**User Request:** "Add export to PDF feature for reports"

**Trinity Workflow:**

1. **Create Work Order**
```bash
/trinity-workorder
```

Generates: `trinity/work-orders/WO-046-export-pdf.md`

```markdown
# Work Order WO-046: Export to PDF Feature

## Objective
Implement PDF export functionality for reports

## Investigation Required
1. Research PDF generation libraries (React-PDF vs PDFKit)
2. Analyze report data structure
3. Identify performance requirements
4. Check browser compatibility

## Implementation Steps
1. Install PDF generation library
2. Create PDF template component
3. Add export button to report UI
4. Implement backend PDF generation endpoint
5. Add download functionality

## Acceptance Criteria
- [ ] PDF exports match report data exactly
- [ ] Export completes in <3 seconds
- [ ] Works in Chrome, Firefox, Safari
- [ ] File size <5MB for typical reports
- [ ] Trinity debugging included
```

2. **Conduct Investigation**

Creates: `trinity/investigations/2025-10-02-pdf-export.md`

```markdown
# Investigation: PDF Export Implementation

## Research Findings

### Library Comparison
**@react-pdf/renderer:**
- Pros: React-native, component-based
- Cons: Limited styling, 450KB bundle size

**PDFKit (backend):**
- Pros: Full control, server-side
- Cons: Requires backend changes

**Decision:** PDFKit on backend (better performance)

## Report Structure Analysis
- Reports contain: Tables, charts, headers
- Average data size: 2000 rows
- Chart libraries: Recharts (needs conversion)

## Performance Requirements
- Target: <2 seconds for 2000 rows
- Memory: <100MB peak
- Concurrent exports: Support 10+ simultaneous

## Implementation Approach
1. Backend FastAPI endpoint: POST /api/reports/:id/export
2. Generate PDF using PDFKit
3. Stream to S3 for large files
4. Return download URL to frontend
5. Frontend triggers download
```

3. **Implement with Trinity Debugging**

Frontend component:
```typescript
// src/components/ReportExport.tsx
'use client';

export function ReportExport({ reportId }: { reportId: string }) {
  const componentName = 'ReportExport';

  const handleExport = async () => {
    const startTime = Date.now();

    console.log('[TRINITY ACTION]', {
      component: componentName,
      action: 'exportPDF',
      reportId,
      timestamp: new Date().toISOString()
    });

    try {
      const response = await fetch(`/api/reports/${reportId}/export`, {
        method: 'POST'
      });

      const { downloadUrl } = await response.json();
      const duration = Date.now() - startTime;

      console.log('[TRINITY ACTION SUCCESS]', {
        component: componentName,
        action: 'exportPDF',
        duration: `${duration}ms`,
        downloadUrl
      });

      if (duration > 3000) {
        console.warn('[TRINITY PERFORMANCE]', {
          component: componentName,
          action: 'exportPDF',
          warning: 'Slow PDF generation',
          duration: `${duration}ms`,
          threshold: '3000ms'
        });
      }

      window.location.href = downloadUrl;

    } catch (error) {
      const duration = Date.now() - startTime;

      console.error('[TRINITY ACTION ERROR]', {
        component: componentName,
        action: 'exportPDF',
        error: error.message,
        duration: `${duration}ms`
      });
    }
  };

  return <Button onClick={handleExport}>Export PDF</Button>;
}
```

Backend endpoint:
```python
# api/routes/reports.py
from fastapi import APIRouter
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/api/reports/{report_id}/export")
async def export_report_pdf(report_id: str):
    action_name = "export_report_pdf"
    start_time = datetime.now()

    logger.info(f"[TRINITY API] {action_name} started", extra={
        "action": action_name,
        "report_id": report_id,
        "timestamp": start_time.isoformat()
    })

    try:
        # Generate PDF
        pdf_start = datetime.now()
        pdf_buffer = await generate_report_pdf(report_id)
        pdf_duration = (datetime.now() - pdf_start).total_seconds() * 1000

        logger.info(f"[TRINITY PDF] PDF generated", extra={
            "action": action_name,
            "report_id": report_id,
            "size_kb": len(pdf_buffer) / 1024,
            "duration_ms": pdf_duration
        })

        # Upload to S3
        s3_start = datetime.now()
        download_url = await upload_to_s3(pdf_buffer, f"reports/{report_id}.pdf")
        s3_duration = (datetime.now() - s3_start).total_seconds() * 1000

        logger.info(f"[TRINITY S3] PDF uploaded", extra={
            "action": action_name,
            "duration_ms": s3_duration
        })

        total_duration = (datetime.now() - start_time).total_seconds() * 1000

        logger.info(f"[TRINITY API SUCCESS] {action_name} completed", extra={
            "action": action_name,
            "report_id": report_id,
            "total_duration_ms": total_duration
        })

        if total_duration > 2000:
            logger.warning(f"[TRINITY PERFORMANCE] Slow PDF export", extra={
                "action": action_name,
                "duration_ms": total_duration,
                "threshold_ms": 2000
            })

        return {"downloadUrl": download_url}

    except Exception as e:
        duration = (datetime.now() - start_time).total_seconds() * 1000

        logger.error(f"[TRINITY API ERROR] {action_name} failed", extra={
            "action": action_name,
            "report_id": report_id,
            "error": str(e),
            "duration_ms": duration
        }, exc_info=True)

        raise HTTPException(status_code=500, detail="PDF export failed")
```

4. **Document Pattern**

Creates: `trinity/patterns/pdf-export-pattern.md`

```markdown
# Pattern: Server-Side PDF Export

## Context
Export large data sets as PDF without blocking frontend

## Solution
1. Backend generates PDF using PDFKit
2. Upload to S3 for persistence
3. Return download URL
4. Frontend triggers browser download

## Benefits
- No frontend bundle bloat
- Better performance for large exports
- Scalable (offload to workers)

## Implementation
See: WO-046 for complete example

## Performance
- 2000 rows: ~1.5 seconds
- Memory: ~80MB peak
- Concurrent: 10+ simultaneous exports
```

### Example 2: Fixing a Bug

**User Report:** "Subscription upgrade shows wrong price"

**Trinity Workflow:**

1. **Create Investigation WO**
```bash
/trinity-workorder
# Select: Investigation
```

2. **Investigation Phase**

```markdown
# Investigation: Subscription Price Display Bug

## Problem Statement
Users see incorrect price during subscription upgrade
- Expected: New plan price only
- Actual: Showing sum of old + new price

## Investigation Steps

### 1. Frontend State Analysis
- [x] Check Zustand store subscription state
- [x] Review price calculation logic
- [x] Inspect API response structure

**Finding:** Frontend correctly displays API response

### 2. API Endpoint Analysis
- [x] Review /api/subscriptions/upgrade endpoint
- [x] Check Stripe price calculation
- [x] Verify proration logic

**Finding:** Proration includes previous charge!

### 3. Stripe Integration Analysis
- [x] Review Stripe subscription.modify call
- [x] Check proration_behavior parameter
- [x] Test with Stripe test mode

**Finding:** proration_behavior='create_prorations' adds old charge

## Root Cause
Stripe's proration includes the remaining value of the old plan,
which gets added to the new plan price. API returns total, but
UI should display only new plan amount.

## Solution
Display `newPlanPrice` instead of `prorationTotal` in UI.
Keep proration for Stripe, but calculate display price separately.
```

3. **Implement Fix**
```typescript
// Before (showing wrong price)
<div>New price: ${subscription.prorationTotal}</div>

// After (showing correct price)
<div>
  New price: ${subscription.newPlanPrice}
  {subscription.proration > 0 && (
    <div className="text-sm text-gray-500">
      Credit applied: -${subscription.proration}
    </div>
  )}
</div>
```

4. **Add to ISSUES.md**
```markdown
### ISSUE-029: Subscription upgrade price display
- **Severity:** High
- **Resolved:** 2025-10-02
- **Root Cause:** Displayed proration total instead of new plan price
- **Solution:** Show new plan price, credit separately
- **Prevention:** Added E2E test for upgrade flow
- **Related WO:** WO-047
```

---

## Workflow Examples

### Daily Development Workflow

**Morning:**
```bash
# Start session
/trinity-start

# Check active tasks
cat trinity/knowledge-base/To-do.md

# Review any issues
cat trinity/knowledge-base/ISSUES.md
```

**During Work:**
```bash
# For each task, create work order
/trinity-workorder

# Conduct investigation first
# Document in trinity/investigations/

# Implement with Trinity debugging
# Run tests locally

# Update To-do.md status
```

**End of Day:**
```bash
# Archive session
/trinity-end

# Commit work (if ready)
git add .
git commit -m "WO-046: Implement PDF export feature"
```

### Weekly Review Workflow

**Monday Planning:**
1. Review `To-do.md` backlog
2. Prioritize work orders
3. Assign to team members
4. Update Technical-Debt.md priorities

**Friday Retrospective:**
1. Run JUNO audit: `/trinity-verify`
2. Review patterns discovered
3. Update ARCHITECTURE.md if needed
4. Document lessons learned

---

## Advanced Features

### Multi-Agent Collaboration

**Scenario:** Large refactoring task

1. **ALY (CTO)** - Strategic planning
```bash
"ALY, analyze the impact of migrating from REST to GraphQL"
```

2. **ZEN (Knowledge)** - Document current state
```bash
"ZEN, document all current REST endpoints in knowledge base"
```

3. **AJ (Chief Code)** - Implementation
```bash
"AJ, create work orders for GraphQL migration in phases"
```

4. **JUNO (Auditor)** - Quality check
```bash
"JUNO, audit the migration plan for technical debt"
```

### Crisis Recovery

**Scenario:** Production incident

1. **Immediate:** Check Crisis Recovery procedures
```bash
cat trinity/knowledge-base/ARCHITECTURE.md
# Navigate to "Crisis Recovery" section
```

2. **Investigation:** Create urgent work order
```bash
/trinity-workorder
# Mark as URGENT
# Document incident timeline
```

3. **Resolution:** Follow Trinity debugging
```python
# All fixes include Trinity logging
logger.error(f"[TRINITY INCIDENT] {incident_id}", extra={
    "severity": "critical",
    "impact": "production_down",
    "timestamp": datetime.now().isoformat()
})
```

4. **Post-mortem:** Document in ISSUES.md
```markdown
### INCIDENT-005: Database connection pool exhaustion
- **Date:** 2025-10-02 14:30 UTC
- **Duration:** 23 minutes
- **Root Cause:** Connection leak in subscription webhook handler
- **Fix:** Added connection.close() in finally block
- **Prevention:** Added connection pool monitoring alerts
```

### Knowledge Evolution

**Pattern Discovery:**
Every successful implementation can become a pattern:

1. Complete work order successfully
2. Extract reusable approach
3. Document in `trinity/patterns/`
4. Reference in future work orders

**Architecture Updates:**
As system evolves, update ARCHITECTURE.md:

1. New services added
2. Database schema changes
3. Integration points modified
4. Deployment changes

---

## Success Metrics

After 3 months of Trinity Method usage:

### Development Velocity
- **Before Trinity:** 2.5 features/sprint
- **After Trinity:** 4.1 features/sprint (+64%)

### Quality Improvements
- **Bug rate:** 12 bugs/sprint → 3 bugs/sprint (-75%)
- **Test coverage:** 45% → 87% (+93%)
- **Code review time:** 3 hours → 45 minutes (-75%)

### Knowledge Retention
- **Onboarding time:** 3 weeks → 4 days (-86%)
- **Context loss:** 70% between sessions → 5% (-93%)
- **Documentation:** 12% covered → 94% covered (+683%)

### Performance
- **Console errors:** 47/week → 0/week (-100%)
- **Production incidents:** 3/month → 0.5/month (-83%)
- **Debugging time:** 4 hours/bug → 45 minutes/bug (-81%)

---

**Trinity Method transforms development from reactive to systematic. This comprehensive example shows the complete picture of professional software development with investigation-first methodology.**

**Version:** 1.0.0
**Last Updated:** 2025-10-02
**Trinity Method SDK:** [Installation Guide](../../docs/getting-started.md)
