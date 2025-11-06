# Crisis Management Protocols

**Trinity Method SDK v2.0 - Crisis Response Guide**
**Last Updated:** 2025-11-05

---

## Table of Contents

1. [Crisis Overview](#crisis-overview)
2. [Crisis Types](#crisis-types)
3. [Crisis Detection](#crisis-detection)
4. [Response Protocols](#response-protocols)
5. [SDK-Assisted Crisis Resolution](#sdk-assisted-crisis-resolution)
6. [Post-Crisis Analysis](#post-crisis-analysis)
7. [Prevention Strategies](#prevention-strategies)
8. [Quick Reference](#quick-reference)

---

## Crisis Overview

**A crisis is any situation that:**
- Blocks users from core functionality
- Exposes security vulnerabilities
- Causes data loss or corruption
- Degrades performance below acceptable thresholds
- Prevents successful deployment

**Trinity Method Principle:** Crisis is opportunity—problems become patterns, patterns become prevention.

### When to Activate Crisis Protocol

```yaml
Immediate Activation (Stop Everything):
  - Console errors in production
  - Security breach detected
  - Data corruption discovered
  - Complete system outage
  - Deployment rollback required

Scheduled Activation (Next Planning Cycle):
  - Performance degradation (not critical)
  - Minor UI bugs
  - Non-critical features broken
  - Technical debt reaching threshold
```

---

## Crisis Types

### 1. Console Error Crisis

**Trigger:** Any console errors in production

**Severity:** **CRITICAL** (zero tolerance for console errors)

**Detection:**
```typescript
// Production monitoring
if (process.env.NODE_ENV === 'production') {
  window.onerror = (message, source, lineno, colno, error) => {
    // Log to error tracking service
    logCriticalError({
      message,
      source,
      line: lineno,
      column: colno,
      stack: error?.stack
    });

    // Trigger crisis protocol
    activateCrisisProtocol('CONSOLE_ERROR');
  };
}
```

**Impact:**
- User experience degraded
- Potential data loss
- Loss of confidence in application
- May indicate deeper issues

---

### 2. Performance Degradation Crisis

**Trigger:** Performance drops below baselines

**Severity:** HIGH to CRITICAL (depends on degradation %)

**Detection:**
```typescript
// BAS monitors performance baselines
const baseline = 200; // ms
const current = await measureApiResponseTime('/api/users');

if (current > baseline * 1.5) {
  // 50% degradation
  logWarning('Performance degradation detected');

  if (current > baseline * 2) {
    // 100% degradation - CRISIS
    activateCrisisProtocol('PERFORMANCE_DEGRADATION');
  }
}
```

**Impact:**
- Poor user experience
- Increased server costs
- Potential timeout errors
- User abandonment

---

### 3. Data Integrity Crisis

**Trigger:** Data inconsistencies detected

**Severity:** **CRITICAL** (data is sacred)

**Detection:**
```typescript
// Data validation checks
const userCount = await db.users.count();
const roleAssignments = await db.roles.count();

if (roleAssignments > userCount * 5) {
  // Unlikely: Each user should have 1-5 roles max
  logCriticalError('Data integrity issue: role explosion');
  activateCrisisProtocol('DATA_INTEGRITY');
}
```

**Impact:**
- Incorrect business logic
- Regulatory compliance issues
- Loss of user trust
- Potential legal liability

---

### 4. Deployment Failure Crisis

**Trigger:** Deployment process fails or needs rollback

**Severity:** HIGH (production down or degraded)

**Detection:**
```yaml
# CI/CD pipeline monitors
- Build fails
- Tests fail in production environment
- Health check fails after deployment
- Error rate spike after deployment
```

**Impact:**
- Production downtime
- Users unable to access application
- Revenue loss
- Reputation damage

---

### 5. Security Breach Crisis

**Trigger:** Security vulnerability exploited

**Severity:** **CRITICAL** (highest priority)

**Detection:**
```typescript
// Security monitoring
- Unusual access patterns
- Failed authentication spike
- Unauthorized data access
- SQL injection attempts
- XSS attempts
- CSRF token violations
```

**Impact:**
- User data compromised
- Legal liability
- Regulatory fines
- Reputation damage
- Business shutdown risk

---

## Crisis Detection

### Automated Detection (SDK Tools)

**BAS Quality Gates:**
```yaml
Phase 6: Production Health Checks
  - Console error monitoring
  - Performance regression detection
  - Test failure alerts
  - Coverage drop warnings
```

**JUNO Audits:**
```yaml
Security Monitoring:
  - Vulnerability scans
  - Dependency audits
  - Code security analysis
  - Access pattern analysis
```

**Performance Monitoring:**
```typescript
// trinity/knowledge-base/Technical-Debt.md tracks:
{
  "performanceBaselines": {
    "/api/users": 150,
    "/api/posts": 134
  },
  "currentPerformance": {
    "/api/users": 145,  // ✅ Within 10% of baseline
    "/api/posts": 892   // ❌ 565% regression - CRISIS
  }
}
```

### Manual Detection (User Reports)

**User Reports Crisis:**
```markdown
User: "I'm seeing errors when trying to load the user list"
    ↓
Developer: Check production logs
    ↓
Console errors detected
    ↓
CRISIS ACTIVATED
```

---

## Response Protocols

### Universal Crisis Response (All Types)

```yaml
Phase 1: IMMEDIATE RESPONSE (0-5 minutes)
  1. Stop all non-crisis work
  2. Create crisis branch: git checkout -b crisis/[type]-[date]
  3. Document the crisis:
     - What happened
     - When it started
     - What is affected
     - Current impact
  4. Assess severity (Critical/High/Medium)
  5. Notify stakeholders if Critical

Phase 2: INVESTIGATION (5-15 minutes)
  1. Gather evidence
     - Logs
     - Error messages
     - Performance metrics
     - User reports
  2. Identify root cause
  3. Assess scope of impact
  4. Determine fix approach

Phase 3: RESOLUTION (15-60 minutes)
  1. Implement fix (TDD if time allows)
  2. Test fix thoroughly
  3. Verify no regressions
  4. Deploy fix (or rollback if faster)

Phase 4: VERIFICATION (5-15 minutes)
  1. Confirm crisis resolved
  2. Monitor for recurrence
  3. Validate all affected areas
  4. Get user confirmation

Phase 5: POST-CRISIS (30-60 minutes)
  1. Document crisis and resolution
  2. Extract pattern (prevention)
  3. Update knowledge base
  4. Conduct retrospective
  5. Implement prevention measures
```

**Total Time:** 1-2 hours (Critical), 30-60 minutes (High)

---

## SDK-Assisted Crisis Resolution

### Console Error Crisis (SDK Workflow)

```typescript
// User reports crisis
User: "Production has console errors in user list page"
    ↓
// IMMEDIATE RESPONSE
Developer: git checkout -b crisis/console-errors-2025-11-05
    ↓
Developer: "Please review .claude/agents/leadership/aly-cto.md to
           investigate console errors in production"
    ↓
ALY: Recognizes crisis, activates crisis workflow
    - Gathers error logs (ZEN)
    - Identifies error location
    - Assesses impact: HIGH (blocks user list)
    ↓
// INVESTIGATION
ZEN: Analyzes error
    Error: TypeError: Cannot read property 'map' of undefined
    Location: src/components/UserList.tsx:42
    Cause: API returns null when no users, component expects array
    ↓
// RESOLUTION
ALY: Determines fix strategy
    - Add null check before .map()
    - Use optional chaining
    - Add defensive programming
    ↓
KIL: Implements fix (simplified TDD for crisis)
    ✅ Add test for null response
    ✅ Add null check: users?.map() || []
    ✅ Tests pass
    ↓
BAS: Validates fix
    ✅ Phase 1: Lint pass
    ✅ Phase 2: Structure pass
    ✅ Phase 3: Build pass
    ✅ Phase 4: Tests pass (new test + existing)
    ✅ Phase 5: Coverage maintained
    ✅ Phase 6: Best practices pass
    ↓
// VERIFICATION
git commit -m "fix(crisis): handle null user list response"
git push origin crisis/console-errors-2025-11-05
Deploy to production
    ↓
Verify: No console errors ✅
    ↓
// POST-CRISIS
Learning System: Extracts pattern
    Pattern: "Always handle null/undefined from API responses"
    Location: trinity/patterns/error-handling/null-safety.md
    ↓
ZEN: Updates knowledge base
    ISSUES.md: Mark RESOLVED
    ARCHITECTURE.md: Note defensive programming pattern
    ↓
DRA: Quick retrospective
    What went well: Fast detection, clear error message
    What to improve: Add API contract validation
    Prevention: Add TypeScript strict null checks
```

**Timeline with SDK:** 20-30 minutes (vs 1-2 hours manual)

---

### Performance Degradation Crisis (SDK Workflow)

```typescript
// Automated detection
BAS: Performance monitoring detects degradation
    Baseline: /api/posts 134ms
    Current: /api/posts 892ms (565% increase)
    ↓
BAS: Alerts team
    ↓
// IMMEDIATE RESPONSE
Developer: git checkout -b crisis/performance-posts-api
    ↓
Developer: "Please review .claude/agents/leadership/aly-cto.md to
           investigate performance degradation on /api/posts"
    ↓
// INVESTIGATION
ALY: Triggers performance investigation
    ↓
BAS: Detailed performance profiling
    - API response time: 892ms
    - Database queries: 87 queries (N+1 problem)
    - Recent changes: Added comment count to post list
    ↓
ZEN: Analyzes recent commits
    Commit 3 hours ago: "feat: show comment count on posts"
    Implementation: Fetches comments for each post (N queries)
    ↓
// RESOLUTION
ALY: Fix strategy
    Option 1: Eager load comment counts (SQL COUNT)
    Option 2: Rollback commit, redesign
    Recommendation: Option 1 (faster, addresses root cause)
    ↓
KIL: Implements fix
    ✅ Add SQL COUNT in single query
    ✅ Remove N+1 comment fetches
    ✅ Tests pass, performance restored
    ↓
BAS: Validates fix
    ✅ Performance: 98ms (27% faster than original baseline!)
    ✅ All quality gates pass
    ↓
// VERIFICATION
Deploy to production
Monitor: Performance restored ✅
    ↓
// POST-CRISIS
Pattern: "N+1 Query Prevention"
Prevention: Always check query count in code review
Learning: Add N+1 query detection to BAS Phase 6
```

**Timeline with SDK:** 30-45 minutes

---

### Data Integrity Crisis (SDK Workflow)

```typescript
// User reports issue
User: "Users seeing duplicate posts, some posts missing"
    ↓
// IMMEDIATE RESPONSE
Developer: git checkout -b crisis/data-integrity-posts
    ↓
Developer: "Please review .claude/agents/leadership/aly-cto.md to
           investigate data integrity issue with posts"
    ↓
// INVESTIGATION
ALY: Activates crisis protocol
    ↓
JUNO: Data integrity audit
    - Checks database constraints
    - Validates foreign keys
    - Analyzes recent migrations
    ↓
ZEN: Finds root cause
    Recent migration: Added post_categories table
    Issue: Migration didn't add unique constraint
    Result: Duplicate entries in join table
    ↓
// RESOLUTION
ALY: Fix strategy
    1. Immediate: Remove duplicates
    2. Add unique constraint
    3. Add validation in application
    ↓
KIL: Implements fix
    ✅ Create data cleanup migration
    ✅ Add unique constraint
    ✅ Add application-level validation
    ✅ Tests verify no duplicates possible
    ↓
JUNO: Validates data integrity
    ✅ All duplicates removed
    ✅ Constraints active
    ✅ Validation working
    ↓
// VERIFICATION
Run migration in production
Verify: No duplicates ✅
Monitor: New entries validated ✅
    ↓
// POST-CRISIS
Pattern: "Database Migration Checklist"
Prevention:
    - Always add unique constraints for join tables
    - Always test migrations with duplicate data
    - Always add application-level validation
Learning System: Adds to migration best practices
```

**Timeline with SDK:** 45-60 minutes

---

### Deployment Failure Crisis (SDK Workflow)

```typescript
// CI/CD detects failure
Ein: Deployment failed
    Stage: Production deployment
    Error: Database migration failed
    ↓
// IMMEDIATE RESPONSE
Developer: git checkout main
Developer: git checkout -b crisis/deployment-failure
    ↓
// INVESTIGATION
Ein: Analyzes deployment logs
    Error: Migration 20251105_add_posts_category.sql failed
    Reason: Column 'category_id' already exists
    Root Cause: Migration ran twice due to deployment retry
    ↓
// RESOLUTION
ALY: Crisis strategy
    Option 1: Rollback deployment
    Option 2: Skip failed migration, fix idempotency
    Recommendation: Option 2 (rollback loses new features)
    ↓
KIL: Makes migration idempotent
    ✅ Add IF NOT EXISTS checks
    ✅ Test migration runs multiple times
    ✅ Add rollback script
    ↓
Ein: Redeploys
    ✅ Migration skipped (already exists)
    ✅ Application deployed
    ✅ Health checks pass
    ↓
// VERIFICATION
All features working ✅
No errors ✅
    ↓
// POST-CRISIS
Pattern: "Idempotent Migrations"
Prevention:
    - Always use IF NOT EXISTS
    - Always test migrations run multiple times
    - Always include rollback scripts
Ein: Updates deployment checklist
```

**Timeline with SDK:** 20-40 minutes

---

## Post-Crisis Analysis

### Required Documentation

**Crisis Report Template:**
```markdown
# CRISIS REPORT: [Type] - [Date]

## Crisis Summary
- **Type**: [Console Error/Performance/Data Integrity/Deployment/Security]
- **Severity**: [Critical/High/Medium]
- **Duration**: [Detection → Resolution time]
- **Impact**: [Who/what was affected]

## Timeline
- **Detected**: YYYY-MM-DD HH:MM
- **Response Started**: YYYY-MM-DD HH:MM
- **Root Cause Identified**: YYYY-MM-DD HH:MM
- **Fix Deployed**: YYYY-MM-DD HH:MM
- **Verified Resolved**: YYYY-MM-DD HH:MM

## Root Cause Analysis
[What happened and why]

## Resolution
[What was done to fix it]

## Verification
[How we confirmed it was fixed]

## Pattern Extracted
[Reusable solution or prevention strategy]

## Prevention Measures
[What we're doing to prevent recurrence]

## Retrospective
**What Went Well:**
- [...]

**What Could Be Improved:**
- [...]

**Action Items:**
- [ ] [Prevention measure 1]
- [ ] [Prevention measure 2]

---
**Archived**: trinity/crisis-reports/YYYY-MM-DD-[type].md
```

### Where to Document

```bash
# Crisis report
trinity/crisis-reports/2025-11-05-console-errors.md

# Pattern extracted
trinity/patterns/error-handling/null-safety.md

# Knowledge base updates
trinity/knowledge-base/ISSUES.md          # Mark issue RESOLVED
trinity/knowledge-base/ARCHITECTURE.md     # Note architecture changes
trinity/knowledge-base/Technical-Debt.md   # Update metrics
```

---

## Prevention Strategies

### Proactive Measures (SDK Built-In)

**1. BAS Quality Gates (Prevent Before Commit)**
```yaml
Phase 4: Testing
  - All tests must pass
  - Catches regression bugs

Phase 5: Coverage
  - ≥80% coverage required
  - Ensures edge cases tested

Phase 6: Best Practices
  - No console.log in production
  - Error handling required
  - Catches potential production issues
```

**2. JUNO Audits (Large Scale Stop Point #4)**
```yaml
Security Audit:
  - Vulnerability scanning
  - Dependency audits
  - Prevents security crises

Performance Audit:
  - Baseline validation
  - Regression detection
  - Prevents performance crises

Data Integrity Audit:
  - Constraint validation
  - Migration testing
  - Prevents data crises
```

**3. Learning System (Pattern Recognition)**
```yaml
Pattern Extraction:
  - Successful resolutions become patterns
  - Patterns suggested in similar contexts
  - Reduces repeat crises
```

**4. Pre-commit Hooks**
```yaml
Pre-commit Validation:
  - Lint errors
  - Format issues
  - Test failures
  - Prevents broken code from entering repo
```

### Process Improvements

**1. Crisis Drills (Quarterly)**
```markdown
Simulate crises to practice response:
- Console error scenario
- Performance degradation scenario
- Data corruption scenario
- Deployment failure scenario

Measure response time
Refine protocols based on learnings
```

**2. Monitoring & Alerting**
```yaml
Production Monitoring:
  - Error tracking (Sentry, Rollbar)
  - Performance monitoring (New Relic, DataDog)
  - Uptime monitoring (Pingdom, UptimeRobot)
  - Log aggregation (Splunk, ELK)

Alert Thresholds:
  - Any console error → Immediate alert
  - Performance >50% regression → Warning alert
  - Performance >100% regression → Critical alert
  - Deployment failure → Critical alert
```

**3. Code Review Focus**
```markdown
Trinity Method Review Checklist:
□ Error handling present
□ Null/undefined checks
□ Performance considerations
□ Database query optimization
□ Migration idempotency
□ Security best practices
```

---

## Quick Reference

### Crisis Response Cheat Sheet

```bash
# 1. IMMEDIATE RESPONSE (< 5 minutes)
git checkout -b crisis/[type]-$(date +%Y-%m-%d)
# Document: What, When, Impact, Severity

# 2. INVESTIGATION (5-15 minutes)
# Use ALY to investigate with SDK agents
"Please review .claude/agents/leadership/aly-cto.md to investigate [crisis]"

# 3. RESOLUTION (15-60 minutes)
# Let KIL implement fix with BAS validation
# TDD if time allows, simplified TDD if urgent

# 4. VERIFICATION (5-15 minutes)
git commit -m "fix(crisis): [description]"
# Deploy, monitor, confirm resolution

# 5. POST-CRISIS (30-60 minutes)
# Create crisis report: trinity/crisis-reports/YYYY-MM-DD-[type].md
# Extract pattern: trinity/patterns/[category]/[pattern].md
# Update knowledge base (ZEN)
```

### Emergency Contacts Template

```markdown
# Emergency Contacts

## Team
- Tech Lead: [Name] - [Phone] - [Email]
- DevOps: [Name] - [Phone] - [Email]
- Database Admin: [Name] - [Phone] - [Email]

## External
- Hosting Provider: [Support Number]
- Error Tracking: [Service] - [Support]
- Performance Monitoring: [Service] - [Support]

## Escalation Path
1. Developer → Tech Lead
2. Tech Lead → Engineering Manager
3. Engineering Manager → CTO
4. CTO → CEO (Critical only)
```

### Crisis Severity Matrix

| Type | Severity | Response Time | Escalation |
|------|----------|---------------|------------|
| Console Errors | CRITICAL | Immediate | Tech Lead |
| Security Breach | CRITICAL | Immediate | CTO |
| Data Corruption | CRITICAL | Immediate | Database Admin |
| Complete Outage | CRITICAL | Immediate | DevOps + Tech Lead |
| Performance >100% | HIGH | <15 minutes | Tech Lead |
| Deployment Failure | HIGH | <15 minutes | DevOps |
| Performance 50-100% | MEDIUM | <1 hour | Developer |
| Minor UI Bugs | LOW | Next sprint | Product Manager |

---

## Conclusion

Crisis management is a critical skill for production systems. **Trinity Method SDK provides tools to:**
1. **Detect crises early** (BAS monitoring, JUNO audits)
2. **Respond systematically** (Agent-assisted investigation and resolution)
3. **Prevent recurrence** (Pattern extraction, Learning System)

**Remember:** Every crisis is an opportunity to improve. Extract the pattern, document the learning, and make your system more resilient.

---

**Trinity Method SDK: Turn Crises into Patterns, Patterns into Prevention**

*Respond swiftly. Resolve systematically. Learn continuously.*

---

**Document Version:** 2.0
**SDK Version:** 2.0.0
**Last Updated:** 2025-11-05
**Related:** [Investigation-First Complete](./methodology/investigation-first-complete.md#crisis-management)
