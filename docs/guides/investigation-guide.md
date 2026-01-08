# Investigation Guide: Structured Problem-Solving with Trinity

**Trinity Version:** 2.0.8
**Last Updated:** 2026-01-02

## Overview

Trinity Method provides structured investigation templates for systematic problem-solving. This guide covers how to use investigation templates effectively, create custom investigations, and leverage the investigation workflow for complex debugging, performance analysis, and system understanding.

## Table of Contents

- [What are Investigations?](#what-are-investigations)
- [Investigation Types](#investigation-types)
- [Investigation Workflow](#investigation-workflow)
- [Creating Investigations](#creating-investigations)
- [Investigation Templates](#investigation-templates)
- [Best Practices](#best-practices)
- [Examples](#examples)

---

## What are Investigations?

Investigations are structured documents that guide systematic problem-solving. Unlike ad-hoc debugging, investigations provide:

- **Structured approach** - Follow proven problem-solving frameworks
- **Documentation** - Capture hypothesis, data, and conclusions
- **Reproducibility** - Others can follow your investigation steps
- **Knowledge retention** - Investigations become reference documentation

### When to Use Investigations

Use investigations for:

- Complex bugs that require systematic debugging
- Performance issues needing profiling and analysis
- System understanding (How does X work?)
- Security audits and vulnerability assessments
- Post-mortem analysis of production incidents
- Research and spike solutions

**Don't use investigations for:**

- Simple bugs with obvious fixes
- Trivial configuration changes
- Routine maintenance tasks
- Well-understood problems

---

## Investigation Types

Trinity provides 5 investigation template types:

### 1. Bug Investigation

**Purpose:** Debug software defects systematically

**Use When:**

- Unknown error occurs
- Bug is difficult to reproduce
- Root cause is unclear
- Multiple potential causes exist

**Template Sections:**

- Problem Statement
- Reproduction Steps
- Expected vs Actual Behavior
- Environment Details
- Hypothesis
- Investigation Steps
- Data Collected
- Root Cause Analysis
- Solution
- Validation
- Prevention Measures

**Example Scenarios:**

- "Login fails intermittently on production"
- "Memory leak in long-running process"
- "Race condition causing data corruption"

---

### 2. Performance Investigation

**Purpose:** Analyze and resolve performance issues

**Use When:**

- Application is slow
- Response times degraded
- Resource usage excessive
- Need to optimize bottlenecks

**Template Sections:**

- Performance Issue Description
- Baseline Metrics
- Target Performance Goals
- Profiling Setup
- Data Collection
- Bottleneck Identification
- Optimization Hypothesis
- Implementation
- Performance Validation
- Before/After Comparison

**Example Scenarios:**

- "API response time increased from 100ms to 2s"
- "Database queries slow during peak traffic"
- "Frontend rendering causing UI lag"

---

### 3. System Analysis

**Purpose:** Understand how systems and components work

**Use When:**

- Need to understand unfamiliar code
- Documenting system architecture
- Onboarding to complex systems
- Planning refactoring or changes

**Template Sections:**

- System Overview
- Component Architecture
- Data Flow
- Key Abstractions
- Integration Points
- Configuration
- Known Limitations
- Documentation Gaps

**Example Scenarios:**

- "How does the authentication system work?"
- "Understanding microservice communication patterns"
- "Documenting legacy codebase before refactoring"

---

### 4. Security Audit

**Purpose:** Assess security vulnerabilities and risks

**Use When:**

- Security review needed
- Potential vulnerability discovered
- Compliance requirements
- Pre-production security check

**Template Sections:**

- Security Scope
- Threat Model
- Attack Surface Analysis
- Vulnerability Assessment
- Exploit Scenarios
- Risk Classification
- Mitigation Recommendations
- Implementation Plan
- Validation Testing

**Example Scenarios:**

- "SQL injection risk in user input forms"
- "Authentication bypass potential in OAuth flow"
- "Sensitive data exposure in logs"

---

### 5. Incident Investigation (Post-Mortem)

**Purpose:** Analyze production incidents for root cause and prevention

**Use When:**

- Production outage occurred
- Major incident needs analysis
- Post-mortem required
- Learning from failures

**Template Sections:**

- Incident Summary
- Impact Assessment
- Timeline of Events
- Root Cause Analysis
- Contributing Factors
- Detection and Response
- Resolution Steps
- Action Items
- Prevention Measures
- Lessons Learned

**Example Scenarios:**

- "Production database outage December 28"
- "API rate limiting caused cascading failures"
- "Deployment rollback due to critical bug"

---

## Investigation Workflow

### Step 1: Create Investigation

Use `/trinity-create-investigation` to launch the investigation wizard:

```
/trinity-create-investigation
```

**Wizard Prompts:**

1. Investigation title
2. Problem statement
3. Impact level (Low, Medium, High, Critical)
4. Investigation type (Bug, Performance, System Analysis, Security, Incident)

**Output:** Investigation document created in `trinity/investigations/INVESTIGATION-{slug}-{date}.md`

**Example:**

```
User: /trinity-create-investigation

Investigation Wizard
────────────────────

Investigation Title: Memory leak in API server

Problem Statement: API server memory usage grows continuously under load,
requiring manual restart every 6 hours.

Impact Level:
[ ] Low
[ ] Medium
[X] High
[ ] Critical

Investigation Type:
[ ] Bug Investigation
[X] Performance Issue
[ ] System Analysis
[ ] Security Audit
[ ] Incident Post-Mortem

✅ Investigation Created: trinity/investigations/INVESTIGATION-memory-leak-api-2025-12-28.md

Open the investigation file to begin documenting your findings.

Next: Create investigation plan with /trinity-plan-investigation
```

---

### Step 2: Plan Investigation

Use `/trinity-plan-investigation` to generate a structured investigation plan:

```
/trinity-plan-investigation
```

**AI-Powered Planning:**

- Analyzes investigation document
- Generates investigation steps
- Creates visual diagram (Mermaid)
- Suggests data collection methods
- Defines validation criteria

**Output:** Investigation plan section populated in investigation document

**Example:**

````
User: /trinity-plan-investigation

Analyzing Investigation: Memory leak in API server

Investigation Plan:

Phase 1: Reproduce & Baseline
──────────────────────────────
- [ ] Set up staging environment matching production
- [ ] Configure monitoring (memory, CPU, heap dumps)
- [ ] Run load test to trigger memory growth
- [ ] Establish baseline memory usage (idle state)
- [ ] Capture memory growth pattern (time-series)

Phase 2: Data Collection
────────────────────────
- [ ] Capture heap snapshots (before/during/after load)
- [ ] Profile CPU usage during memory growth
- [ ] Monitor event loop lag
- [ ] Check for unhandled promise rejections
- [ ] Review application logs for patterns
- [ ] Analyze garbage collection logs

Phase 3: Heap Analysis
──────────────────────
- [ ] Compare heap snapshots for retained objects
- [ ] Identify large object retentions (>1MB)
- [ ] Review event listener registrations
- [ ] Check for circular references
- [ ] Analyze closure retention
- [ ] Identify memory leak suspects (top 10)

Phase 4: Code Review
────────────────────
- [ ] Review identified code paths for leaks
- [ ] Check for global variable accumulation
- [ ] Review event listener cleanup
- [ ] Analyze cache implementation
- [ ] Check for closure leaks
- [ ] Review middleware for request-scoped data retention

Phase 5: Hypothesis Testing
───────────────────────────
- [ ] Isolate suspect code path
- [ ] Create minimal reproduction
- [ ] Test hypothesis with targeted fixes
- [ ] Validate fix in isolated environment
- [ ] Measure memory usage improvement

Phase 6: Solution & Validation
──────────────────────────────
- [ ] Implement fix in codebase
- [ ] Add regression test for memory leak
- [ ] Deploy to staging and validate
- [ ] Run extended load test (24h+)
- [ ] Compare before/after metrics
- [ ] Deploy to production with monitoring

Investigation Diagram:

```mermaid
graph TD
    START[Memory Leak Detected] --> REPRODUCE[Reproduce in Staging]
    REPRODUCE --> BASELINE[Establish Baseline Metrics]
    BASELINE --> COLLECT[Collect Heap Dumps & Logs]
    COLLECT --> ANALYZE[Analyze Heap Snapshots]
    ANALYZE --> IDENTIFY[Identify Retained Objects]
    IDENTIFY --> REVIEW[Code Review Suspect Paths]
    REVIEW --> HYPOTHESIS[Test Hypothesis]
    HYPOTHESIS --> FIX[Implement Fix]
    FIX --> VALIDATE[Validate in Staging]
    VALIDATE --> TEST[Extended Load Test]
    TEST --> DEPLOY[Deploy to Production]
    DEPLOY --> MONITOR[Monitor & Verify]
````

Data Collection Checklist:
───────────────────────────

- Heap snapshots (Chrome DevTools or Node.js --heap-prof)
- CPU profiles (Chrome DevTools or Node.js --cpu-prof)
- Event loop metrics (process.hrtime(), perf_hooks)
- GC logs (Node.js --trace-gc)
- Application logs (correlation IDs for request tracking)
- System metrics (RAM, swap, CPU via monitoring tools)

Success Criteria:
─────────────────

- Memory usage stable over 24h load test
- No continuous growth pattern
- Heap size remains within expected bounds
- No OOM errors in extended testing
- Production deployment shows stable memory

✅ Investigation plan saved to investigation document

Use this plan to systematically resolve the memory leak.

````

---

### Step 3: Execute Investigation

Follow the investigation plan step-by-step:

1. **Check off completed steps** - Mark `[x]` for completed items
2. **Document findings** - Add notes, code snippets, screenshots
3. **Update hypothesis** - Refine as you gather data
4. **Record data** - Paste profiling results, logs, metrics
5. **Capture decisions** - Note why you pursued certain paths

**Tips:**
- Work through phases sequentially
- Don't skip data collection
- Document dead ends (save time for others)
- Update investigation document continuously

---

### Step 4: Document Solution

Once root cause is identified:

1. **Root Cause Section**
   - Clearly state the root cause
   - Explain why it occurred
   - Reference code/data that proves it

2. **Solution Section**
   - Describe the fix
   - Include code changes
   - Explain why this solves the problem

3. **Validation Section**
   - Show validation results
   - Before/after metrics
   - Test results

**Example:**
```markdown
## Root Cause

Event listeners registered in middleware were not being removed after request
completion, causing listener accumulation and memory retention.

**Evidence:**
- Heap snapshot showed 50,000+ EventEmitter instances
- Each EventEmitter retained request context (~100KB)
- EventEmitters grew linearly with request count

**Code Location:**
File: `src/middleware/requestLogger.ts:42`

```typescript
// Leaking code
app.use((req, res, next) => {
  req.on('end', () => {
    logger.info('Request completed');
    // Missing: req.removeListener('end', ...)
  });
  next();
});
````

## Solution

Add proper event listener cleanup:

```typescript
// Fixed code
app.use((req, res, next) => {
  const onEnd = () => {
    logger.info('Request completed');
  };

  req.on('end', onEnd);

  // Cleanup listener when response finishes
  res.on('finish', () => {
    req.removeListener('end', onEnd);
  });

  next();
});
```

## Validation

**Before Fix:**

- Baseline memory: 200MB
- After 10,000 requests: 5GB (memory leak)
- OOM crash after 50,000 requests

**After Fix:**

- Baseline memory: 200MB
- After 10,000 requests: 220MB (stable)
- After 100,000 requests: 230MB (stable)
- 24-hour load test: No memory growth ✅

**Test Results:**

- Unit test added: `tests/middleware/requestLogger.test.ts`
- Integration test: 10,000 request loop with memory monitoring
- All tests pass ✅

````

---

### Step 5: Close Investigation

1. **Add Prevention Measures**
   - How to prevent similar issues
   - Monitoring improvements
   - Code review checklist items

2. **Archive Investigation**
   - Move to `trinity/archive/investigations/` if desired
   - Or keep in `trinity/investigations/` for reference

3. **Update Knowledge Base**
   - Add to `trinity/knowledge-base/ISSUES.md` as known pattern
   - Update `Technical-Debt.md` if technical debt identified
   - Document in `ARCHITECTURE.md` if architecture change made

---

## Creating Investigations

### Using Investigation Wizard

```bash
/trinity-create-investigation
````

Follow prompts to create investigation document.

### Manual Creation

Create investigation manually in `trinity/investigations/`:

```markdown
# Investigation: [Title]

**Created:** 2025-12-28
**Investigator:** [Your Name]
**Type:** [Bug / Performance / System Analysis / Security / Incident]
**Status:** In Progress

## Problem Statement

[Clear description of the problem]

## Impact

- **Severity:** [Low / Medium / High / Critical]
- **Affected Users:** [Number or percentage]
- **Business Impact:** [Description]

## Hypothesis

[Initial hypothesis about the cause]

## Investigation Plan

- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## Data Collected

[Logs, metrics, screenshots, code snippets]

## Analysis

[Your analysis of the data]

## Root Cause

[Identified root cause]

## Solution

[Proposed or implemented solution]

## Validation

[Validation results]

## Prevention Measures

[How to prevent similar issues]

## Lessons Learned

[Key takeaways from this investigation]
```

---

## Investigation Templates

Trinity deploys investigation templates to `trinity/templates/investigations/`:

### Available Templates

1. `bug-investigation.md` - Bug debugging template
2. `performance-investigation.md` - Performance analysis template
3. `system-analysis.md` - System understanding template
4. `security-audit.md` - Security assessment template
5. `incident-postmortem.md` - Incident analysis template

### Customizing Templates

Edit templates in `trinity/templates/investigations/` to customize for your team:

```bash
# Edit bug investigation template
code trinity/templates/investigations/bug-investigation.md

# Add team-specific sections
## Runbook Reference
[Link to runbook if applicable]

## Stakeholder Communication
- [ ] Notify product team
- [ ] Update status page
- [ ] Communicate to customers
```

**Note:** Template customizations will be overwritten on `trinity update`. Back up customizations first.

---

## Best Practices

### 1. Start Investigations Early

Don't wait until a bug becomes critical. Start investigations for:

- Intermittent issues
- Performance degradation trends
- Unknown behavior
- Customer-reported edge cases

### 2. Document As You Go

Update investigation document continuously:

- Add findings immediately
- Don't rely on memory
- Paste command outputs, logs, screenshots
- Capture failed hypotheses (valuable for others)

### 3. Use Data-Driven Approach

Always collect objective data:

- Metrics, not guesses
- Profiling results, not intuition
- Logs, not assumptions
- Reproducible tests, not manual verification

### 4. Follow the Scientific Method

1. **Observe** - What is the problem?
2. **Hypothesize** - What might cause it?
3. **Test** - Can you reproduce it?
4. **Analyze** - What does the data show?
5. **Conclude** - What is the root cause?
6. **Validate** - Does the fix work?

### 5. Share Investigations

Investigations are valuable knowledge:

- Share with team for learning
- Reference in code reviews
- Use in onboarding
- Create runbooks from incident investigations

### 6. Close the Loop

Always complete investigations:

- Document solution (even if "won't fix")
- Add prevention measures
- Update monitoring/alerts
- Share lessons learned

---

## Examples

### Example 1: Bug Investigation

**Problem:** User authentication fails randomly (5% failure rate)

**Investigation Process:**

1. **Create Investigation**

   ```
   /trinity-create-investigation
   Title: Random authentication failures
   Type: Bug Investigation
   Impact: High
   ```

2. **Plan Investigation**

   ```
   /trinity-plan-investigation
   ```

3. **Data Collection**
   - Reviewed failed auth logs (500 failures over 24h)
   - Identified pattern: Failures occur during JWT refresh
   - Captured network traces showing 401 responses

4. **Root Cause**
   - JWT refresh token race condition
   - Concurrent requests both try to refresh token
   - Second refresh fails because first refresh already used the token

5. **Solution**
   - Implement refresh token locking with Redis
   - Only one concurrent refresh per user
   - Queue subsequent requests until refresh completes

6. **Validation**
   - Load tested with 10,000 concurrent refresh requests
   - 0 failures (previously 5% failure rate)
   - Deployed to production, monitored for 7 days - no issues

---

### Example 2: Performance Investigation

**Problem:** Homepage load time increased from 500ms to 3s

**Investigation Process:**

1. **Baseline Metrics**
   - Before: 500ms average, 800ms p99
   - Current: 3s average, 5s p99
   - Change occurred after deployment on Dec 15

2. **Profiling**
   - Chrome DevTools Performance tab
   - Identified long task: Database query taking 2.5s

3. **Query Analysis**
   - Missing database index on `users.last_login` column
   - Full table scan on 1M user records

4. **Solution**
   - Add index: `CREATE INDEX idx_users_last_login ON users(last_login)`

5. **Validation**
   - Before: 2.5s query time
   - After: 15ms query time
   - Homepage: 450ms average (better than baseline!)

---

### Example 3: Incident Post-Mortem

**Problem:** Production database outage, 2-hour downtime

**Investigation (Post-Mortem):**

1. **Incident Summary**
   - Duration: 2 hours (14:00-16:00 UTC)
   - Impact: Complete service unavailability
   - Affected: All users (100,000+ impacted)

2. **Timeline**
   - 13:55: Deployment of new feature
   - 14:00: Database connection pool exhausted
   - 14:05: Alerts triggered, team notified
   - 14:15: Identified connection leak in new feature
   - 14:30: Rolled back deployment
   - 15:00: Database connections recovered
   - 15:30: Re-deployed with fix
   - 16:00: Full service restoration

3. **Root Cause**
   - New feature opened database connections but didn't close them
   - Connection pool exhausted after 500 requests
   - All subsequent requests queued, timeout reached

4. **Contributing Factors**
   - Inadequate staging load testing
   - No connection pool monitoring
   - No automatic circuit breaker

5. **Action Items**
   - [ ] Add connection pool monitoring and alerts
   - [ ] Implement circuit breaker for database connections
   - [ ] Mandatory load testing for all deployments
   - [ ] Add connection lifecycle auditing in code review
   - [ ] Improve staging environment to match production scale

6. **Lessons Learned**
   - Connection management must be validated in load tests
   - Monitoring gaps can delay incident detection
   - Rollback procedures worked well (15 min to rollback)
   - Need better production-like staging environment

---

## Additional Resources

- [Slash Commands Reference](../reference/slash-commands-reference.md) - `/trinity-create-investigation`, `/trinity-plan-investigation`
- [Agent Guide](agent-guide.md) - Agents can help with investigations
- [Getting Started](getting-started.md) - Trinity basics

---

**Trinity Method SDK v2.0.8** - Investigation-First Development
