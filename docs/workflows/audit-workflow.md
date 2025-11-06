# Audit Workflow

**Comprehensive Quality Assurance with JUNO and DRA**

---

## Overview

Audits ensure quality, security, and performance standards. Trinity SDK provides two audit levels: **DRA code reviews** (automatic at stop points) and **JUNO comprehensive audits** (Large scale implementations and periodic assessments).

---

## The Two Audit Levels

### Level 1: DRA Code Review (Continuous)

**Triggers:**
- Medium scale: After implementation complete (Stop Point #1)
- Large scale: Mid-implementation (Stop Point #2) + Pre-merge (Stop Point #3)
- On-demand: User requests code review

**Focus:**
- Design Document compliance
- Code quality standards (functions ≤2 params, nesting ≤4, etc.)
- Basic security checks (no hardcoded secrets, input validation)
- Error handling verification

**Duration:** 15-30 minutes per review

---

### Level 2: JUNO Comprehensive Audit (Periodic)

**Triggers:**
- Large scale: Post-deployment (Stop Point #4)
- Scheduled: Monthly/quarterly (configurable)
- Pre-release: Before major version deployment
- On-demand: User requests comprehensive audit

**Focus:**
- Security audit (OWASP Top 10)
- Performance audit (baseline comparisons)
- Technical debt assessment
- Architecture review
- Learning extraction

**Duration:** 1-3 hours per audit

---

## DRA Code Review Workflow

### Phase 1: Preparation

**DRA collects:**
```yaml
Context:
  - Design Document (if Medium/Large scale)
  - Implementation plan (TRA)
  - Completed tasks (from KIL)
  - Test results (from BAS)
  - Git diff (changed files)

Standards:
  - Design Doc specifications
  - Trinity coding standards (functions ≤2 params, nesting ≤4, etc.)
  - Project-specific conventions (from CLAUDE.md)
```

---

### Phase 2: Design Document Compliance

**DRA verifies:**

```typescript
// Example Design Doc specification:
Component: PaginationHelper
Method: calculateSkip(page: number, limit: number): number
Purpose: Calculate database skip value for pagination
Validation: page >= 1, limit between 1-100

// DRA checks implementation:
✅ Method signature matches: calculateSkip(page: number, limit: number): number
✅ Validation present: page >= 1 check, limit range check
✅ Purpose fulfilled: Returns correct skip value
✅ Error handling: Throws ValidationError on invalid input
```

**Violations reported:**
```markdown
❌ Design Doc Violation: UserService.listUsers()
Expected: PaginatedResult<User>
Found: Promise<User[]>
Severity: HIGH
Fix: Update return type to match Design Doc
```

---

### Phase 3: Code Quality Standards

**DRA validates Trinity coding standards:**

```typescript
// Standard 1: Functions ≤2 parameters
❌ VIOLATION:
function createUser(name: string, email: string, role: string, dept: string) {
  // 4 parameters (exceeds 2)
}

✅ COMPLIANT:
interface CreateUserInput {
  name: string;
  email: string;
  role: string;
  department: string;
}
function createUser(input: CreateUserInput) {
  // 1 parameter (input object)
}

// Standard 2: Function length <200 lines
❌ VIOLATION:
function processOrder() {
  // ... 247 lines ...
}
Recommendation: Break into smaller functions (processPayment, updateInventory, notifyUser)

// Standard 3: Nesting depth ≤4 levels
❌ VIOLATION:
if (user) {                    // Level 1
  if (user.isActive) {         // Level 2
    if (user.hasPermission) {  // Level 3
      if (resource.available) { // Level 4
        if (quota.remaining) {  // Level 5 - VIOLATION
          // ...
        }
      }
    }
  }
}
Recommendation: Extract to separate functions or use guard clauses

// Standard 4: Async functions have try-catch
❌ VIOLATION:
async function fetchData() {
  const response = await api.get('/data');
  return response.data;
  // No error handling
}

✅ COMPLIANT:
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    throw new ApiError('Failed to fetch data', { cause: error });
  }
}
```

---

### Phase 4: Security Review (Basic)

**DRA checks for common vulnerabilities:**

```typescript
// 1. No hardcoded secrets
❌ VIOLATION:
const API_KEY = 'sk_live_abc123def456';
const DB_PASSWORD = 'mypassword123';

✅ COMPLIANT:
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

// 2. Input validation present
❌ VIOLATION:
app.post('/users', (req, res) => {
  const user = req.body;  // No validation
  db.users.insert(user);
});

✅ COMPLIANT:
app.post('/users', validateInput(userSchema), (req, res) => {
  const user = req.body;  // Validated by middleware
  db.users.insert(user);
});

// 3. SQL injection prevention
❌ VIOLATION:
const query = `SELECT * FROM users WHERE email = '${email}'`;
db.execute(query);

✅ COMPLIANT:
const query = 'SELECT * FROM users WHERE email = ?';
db.execute(query, [email]);

// 4. No sensitive data in logs
❌ VIOLATION:
console.log('User logged in:', { email, password, ssn });

✅ COMPLIANT:
console.log('User logged in:', { email });  // No password/ssn
```

---

### Phase 5: Error Handling Verification

**DRA ensures proper error handling:**

```typescript
// Pattern 1: All async functions have try-catch
✅ COMPLIANT:
async function saveUser(user: User) {
  try {
    await db.users.insert(user);
  } catch (error) {
    if (error.code === 'DUPLICATE_KEY') {
      throw new ValidationError('User already exists');
    }
    throw new DatabaseError('Failed to save user', { cause: error });
  }
}

// Pattern 2: Error context preserved
❌ VIOLATION:
try {
  await riskyOperation();
} catch (error) {
  throw new Error('Operation failed');  // Original error lost
}

✅ COMPLIANT:
try {
  await riskyOperation();
} catch (error) {
  throw new CustomError('Operation failed', {
    cause: error,
    context: { userId, operation: 'riskyOperation' }
  });
}

// Pattern 3: No silent failures
❌ VIOLATION:
try {
  await sendEmail(user.email);
} catch {
  // Silent failure - email not sent, no indication
}

✅ COMPLIANT:
try {
  await sendEmail(user.email);
} catch (error) {
  logger.error('Failed to send email', { userId: user.id, error });
  throw new EmailError('Failed to send email', { cause: error });
}
```

---

### Phase 6: DRA Report Generation

**DRA creates review document:**

```markdown
# Code Review: User List Pagination

**Date:** 2025-11-05
**Reviewer:** DRA (Code Reviewer Agent)
**Scale:** Medium
**Review Type:** Post-implementation (Stop Point #1)

---

## Design Document Compliance

✅ **PASS** - All components implemented as specified

- PaginationHelper utility: Matches design
- UserService.listUsers(): Matches interface
- UserController.getUsers(): Matches API spec

---

## Code Quality Standards

✅ **PASS** - All standards met

### Functions ≤2 Parameters
✅ All functions compliant (31/31)

### Function Length <200 Lines
✅ All functions compliant (31/31)
Longest function: 47 lines (PaginationHelper.validate)

### Nesting Depth ≤4 Levels
✅ All functions compliant (31/31)
Max nesting: 3 levels (UserController error handling)

### Async Error Handling
✅ All async functions have try-catch (18/18)

---

## Security Review

✅ **PASS** - No critical vulnerabilities detected

- No hardcoded secrets found
- Input validation present (Joi schemas)
- No SQL injection vulnerabilities
- No sensitive data in logs

⚠️ **RECOMMENDATION**: Consider rate limiting for pagination endpoint
(prevents abuse of large limit values)

---

## Test Coverage

✅ **PASS** - 94.2% coverage (threshold: 80%)

- PaginationHelper: 100%
- UserService: 95%
- UserController: 90%

---

## Performance

✅ **PASS** - Performance targets met

- Response time: 78ms (p95) - Target: <200ms
- Memory usage: 1.8MB - Target: <5MB
- Database queries: Indexed and optimized

---

## Recommendations

### High Priority
None

### Medium Priority
1. Add rate limiting to pagination endpoint (prevent abuse)
2. Consider caching total count (changes infrequently)

### Low Priority
1. Extract validation schemas to @shared/validation
2. Add JSDoc comments to PaginationHelper methods

---

## Conclusion

**APPROVED FOR MERGE**

Implementation meets all Design Doc requirements, code quality standards, and security guidelines. Recommendations are enhancements, not blockers.

**Next Steps:**
- Apply recommendations (optional)
- Merge to main branch
- Monitor performance in production
```

**Report saved to:** `trinity/reviews/YYYY-MM-DD-feature-name.md`

---

## JUNO Comprehensive Audit Workflow

### Phase 1: Audit Initialization

**JUNO gathers comprehensive context:**

```yaml
Codebase Snapshot:
  - All source files (not just changed files)
  - Configuration files
  - Environment variables (names only, not values)
  - Dependencies (package.json, lock files)
  - Git history (commit patterns, contributor activity)

Baseline Data:
  - Previous audit results (if available)
  - Performance baselines (from BAS)
  - Technical debt metrics (from previous JUNO audits)
  - Security scan results (from previous JUNO audits)

Project Context:
  - ARCHITECTURE.md
  - Design Documents
  - Investigation reports
  - Session archives
```

---

### Phase 2: Security Audit (OWASP Top 10)

**JUNO performs comprehensive security assessment:**

#### 1. Injection Vulnerabilities

```typescript
// SQL Injection
SCAN: All database queries
CHECK: Parameterized queries or ORM usage
✅ PASS: All queries use parameterized statements

// NoSQL Injection
SCAN: MongoDB queries
CHECK: Query sanitization
⚠️ FOUND: Potential NoSQL injection
FILE: src/services/UserService.ts:142
CODE: db.users.find({ email: userInput })
FIX: Use query sanitization or validation

// Command Injection
SCAN: child_process.exec, child_process.spawn calls
CHECK: Input sanitization before shell execution
✅ PASS: No command execution with user input detected
```

#### 2. Broken Authentication

```typescript
// Password Storage
SCAN: User authentication logic
CHECK: Passwords hashed with bcrypt/argon2
✅ PASS: bcrypt with 12 rounds

// Session Management
SCAN: Express session configuration
CHECK: Secure session settings
⚠️ FOUND: Session cookie not marked as httpOnly
FILE: src/server.ts:23
FIX: Add httpOnly: true to session config

// JWT Security
SCAN: JWT implementation
CHECK: Strong secret, expiration set
✅ PASS: JWT secret from env, 1h expiration
```

#### 3. Sensitive Data Exposure

```typescript
// Hardcoded Secrets
SCAN: All source files for potential secrets
CHECK: API keys, passwords, tokens
❌ FOUND: Hardcoded API key
FILE: src/services/EmailService.ts:8
CODE: const API_KEY = 'sg.abc123def456'
SEVERITY: CRITICAL
FIX: Move to environment variable

// Logging Sensitive Data
SCAN: console.log, logger calls
CHECK: Passwords, tokens, PII in logs
⚠️ FOUND: Email address in logs
FILE: src/controllers/UserController.ts:67
CODE: logger.info('User created:', { email, password })
SEVERITY: MEDIUM
FIX: Remove password from log statement

// HTTPS Enforcement
SCAN: Server configuration
CHECK: HTTPS redirect middleware
⚠️ FOUND: No HTTPS enforcement in production
FILE: src/server.ts
SEVERITY: MEDIUM
FIX: Add express-enforce-ssl middleware
```

#### 4. XML External Entities (XXE)

```typescript
// XML Parsing
SCAN: XML parsing libraries
CHECK: External entity processing disabled
✅ PASS: No XML parsing detected in codebase
```

#### 5. Broken Access Control

```typescript
// Authorization Checks
SCAN: API routes
CHECK: Permission verification before sensitive operations
⚠️ FOUND: Missing authorization check
FILE: src/controllers/AdminController.ts:45
CODE: app.delete('/users/:id', deleteUser)
SEVERITY: HIGH
FIX: Add requireAdmin middleware

// Direct Object References
SCAN: Resource access patterns
CHECK: User can only access own resources
✅ PASS: All resource access checks user ownership
```

#### 6. Security Misconfiguration

```typescript
// Default Credentials
SCAN: Configuration files
CHECK: No default admin/admin accounts
✅ PASS: No default credentials found

// Error Messages
SCAN: Error handling
CHECK: No stack traces in production
⚠️ FOUND: Stack traces in API error responses
FILE: src/middleware/errorHandler.ts:12
SEVERITY: MEDIUM
FIX: Only send stack traces if NODE_ENV !== 'production'

// Security Headers
SCAN: Express middleware
CHECK: helmet middleware configured
❌ FOUND: No security headers middleware
SEVERITY: HIGH
FIX: Add helmet middleware
```

#### 7-10: Additional OWASP Checks

**JUNO continues scanning for:**
- Cross-Site Scripting (XSS)
- Insecure Deserialization
- Using Components with Known Vulnerabilities
- Insufficient Logging & Monitoring

---

### Phase 3: Performance Audit

**JUNO analyzes performance against baselines:**

```yaml
Response Time Analysis:
  Endpoints Tested: 24
  Baseline Comparison:
    - GET /api/users: 78ms (baseline: 850ms) ✅ 91% improvement
    - POST /api/users: 124ms (baseline: 95ms) ⚠️ 30% regression
    - GET /api/projects: 450ms (baseline: 200ms) ❌ 125% regression

  Slow Endpoints (>200ms):
    - GET /api/projects: 450ms
      Cause: N+1 query (loading users for each project)
      Fix: Add eager loading for project.user relation
      Impact: Expected 85% improvement (450ms → 67ms)

Memory Usage:
  Current: 145MB average, 220MB peak
  Baseline: 120MB average, 180MB peak
  Change: +21% average, +22% peak
  Cause: User session cache not evicting expired sessions
  Fix: Add cache TTL and eviction policy
  Impact: Expected 15% reduction

Database Query Performance:
  Slow Queries (>100ms):
    - projects.findMany() with user join: 380ms
      Cause: Missing index on projects.userId
      Fix: CREATE INDEX idx_projects_userId ON projects(userId)
      Impact: Expected 90% improvement

  N+1 Queries Detected:
    - UserController.listProjects() loads users individually
      Fix: Use include: { user: true } in findMany
      Impact: 85% improvement (15 queries → 1 query)
```

---

### Phase 4: Technical Debt Assessment

**JUNO identifies and quantifies technical debt:**

```yaml
Code Smells:
  - Long Functions (>200 lines): 3 instances
    • src/services/ProjectService.ts:142 (247 lines)
    • src/controllers/AdminController.ts:89 (213 lines)
    Recommendation: URO refactoring (2-3 hours)

  - Duplicate Code: 5 instances
    • Pagination logic duplicated in 3 services
    Recommendation: Extract to PaginationHelper (1 hour)

  - Complex Conditionals (nesting >4): 2 instances
    • src/services/PermissionService.ts:67
    Recommendation: Extract to guard clauses (30 minutes)

Missing Tests:
  - src/utils/EmailValidator.ts (0% coverage)
  - src/middleware/rateLimiter.ts (45% coverage)
  Recommendation: Add tests to reach 80% threshold (3-4 hours)

Outdated Dependencies:
  - express@4.17.1 (latest: 4.18.2) - Security vulnerability CVE-2022-24999
  - lodash@4.17.19 (latest: 4.17.21) - Security vulnerability
  Recommendation: BON dependency update (1 hour)

Configuration Debt:
  - .env.example missing 3 new variables
  - TypeScript strict mode disabled
  Recommendation: CAP configuration sync (30 minutes)

Total Technical Debt: 9-12 hours
Priority Breakdown:
  - Critical (security): 1 hour
  - High (performance): 3-4 hours
  - Medium (code quality): 3-4 hours
  - Low (documentation): 2-3 hours
```

---

### Phase 5: Architecture Review

**JUNO assesses system architecture:**

```yaml
Architecture Patterns:
  ✅ Service Layer: Properly implemented
  ✅ Repository Pattern: Consistent data access
  ✅ Dependency Injection: Used for testability
  ⚠️ Error Handling: Inconsistent across modules

Scalability Concerns:
  - Session data stored in-memory (single server)
    Impact: Horizontal scaling not possible
    Recommendation: Redis session store (4 hours)

  - File uploads stored locally (filesystem)
    Impact: Multi-server deployment requires shared storage
    Recommendation: S3/cloud storage integration (8 hours)

Maintainability:
  - Cyclomatic Complexity: Average 6.2 (target: <10) ✅
  - Module Coupling: 12 tightly-coupled modules ⚠️
    Recommendation: URO refactoring for loose coupling (6-8 hours)

  - Documentation: 68% of public APIs documented ⚠️
    Recommendation: APO documentation generation (4 hours)
```

---

### Phase 6: Learning Extraction

**JUNO extracts patterns and insights:**

```yaml
Patterns Discovered:
  - Cursor-based pagination (highly effective)
    Performance: 91% improvement
    Confidence: 0.92
    Applicability: All list endpoints

  - Service layer with dependency injection
    Testability: 94.2% coverage achieved
    Confidence: 0.88
    Applicability: All new services

Anti-Patterns Detected:
  - N+1 queries in eager loading scenarios
    Occurrence: 3 locations
    Impact: 85-90% performance degradation
    Fix: Use ORM eager loading features

  - Hardcoded configuration values
    Occurrence: 5 locations
    Impact: Deployment flexibility reduced
    Fix: Move to environment variables (CAP agent)

Recommendations for Knowledge Base:
  - Document pagination pattern (ZEN)
  - Add N+1 query detection to BAS Phase 6
  - Create pre-commit hook for secret detection
  - Update ARCHITECTURE.md with session management approach
```

---

### Phase 7: JUNO Report Generation

**JUNO creates comprehensive audit report:**

```markdown
# Comprehensive Audit Report: Trinity Method SDK

**Date:** 2025-11-05
**Auditor:** JUNO (Quality Auditor Agent)
**Scope:** Complete codebase audit
**Duration:** 2.5 hours

---

## Executive Summary

**Overall Health: GOOD (78/100)**

- Security: 72/100 (3 HIGH, 4 MEDIUM vulnerabilities)
- Performance: 81/100 (1 critical regression, 2 slow endpoints)
- Code Quality: 85/100 (Technical debt: 9-12 hours)
- Architecture: 76/100 (Scalability concerns identified)

**Critical Actions Required:**
1. Fix hardcoded API key (CRITICAL security issue)
2. Add database index for projects.userId (CRITICAL performance)
3. Update vulnerable dependencies (HIGH security)

**Estimated Remediation Time:** 16-20 hours

---

## Security Audit Results

### Critical Vulnerabilities (Fix Immediately)

**1. Hardcoded API Key**
- **File:** src/services/EmailService.ts:8
- **Severity:** CRITICAL
- **Risk:** API key exposure in source control
- **Fix:** Move to environment variable
- **Effort:** 15 minutes

### High Vulnerabilities (Fix Within 7 Days)

**2. Missing Authorization Check**
- **File:** src/controllers/AdminController.ts:45
- **Severity:** HIGH
- **Risk:** Unauthorized users can delete users
- **Fix:** Add requireAdmin middleware
- **Effort:** 30 minutes

**3. No Security Headers**
- **File:** src/server.ts
- **Severity:** HIGH
- **Risk:** XSS, clickjacking vulnerabilities
- **Fix:** Add helmet middleware
- **Effort:** 15 minutes

### Medium Vulnerabilities (Fix Within 30 Days)

**4. Session Cookie Not httpOnly**
- **File:** src/server.ts:23
- **Severity:** MEDIUM
- **Risk:** XSS-based session theft
- **Fix:** Add httpOnly: true to session config
- **Effort:** 5 minutes

**5. Stack Traces in Production**
- **File:** src/middleware/errorHandler.ts:12
- **Severity:** MEDIUM
- **Risk:** Information disclosure
- **Fix:** Conditionally send stack traces
- **Effort:** 10 minutes

**6. Email in Logs**
- **File:** src/controllers/UserController.ts:67
- **Severity:** MEDIUM
- **Risk:** PII exposure in logs
- **Fix:** Remove sensitive data from logs
- **Effort:** 10 minutes

**7. No HTTPS Enforcement**
- **File:** src/server.ts
- **Severity:** MEDIUM
- **Risk:** Man-in-the-middle attacks
- **Fix:** Add express-enforce-ssl middleware
- **Effort:** 20 minutes

---

## Performance Audit Results

### Critical Performance Issues

**1. N+1 Query in Projects List**
- **File:** src/controllers/ProjectController.ts:45
- **Impact:** 450ms response time (baseline: 200ms) - 125% regression
- **Cause:** Loading users individually for each project
- **Fix:** Add eager loading with include: { user: true }
- **Expected Improvement:** 85% (450ms → 67ms)
- **Effort:** 30 minutes

### Performance Regressions

**2. POST /api/users Regression**
- **Current:** 124ms (baseline: 95ms) - 30% regression
- **Cause:** Added email validation logic (external API call)
- **Fix:** Cache email validation results or use async job
- **Expected Improvement:** Return to baseline ~95ms
- **Effort:** 1-2 hours

### Missing Indexes

**3. projects.userId Missing Index**
- **Impact:** 380ms query time for project lookups by user
- **Fix:** CREATE INDEX idx_projects_userId ON projects(userId)
- **Expected Improvement:** 90% (380ms → 38ms)
- **Effort:** 5 minutes (+ testing)

---

## Technical Debt Assessment

**Total Debt: 9-12 hours**

### Critical (Security) - 1 hour
- Update vulnerable dependencies (express, lodash)
- Fix hardcoded secrets

### High (Performance) - 3-4 hours
- Fix N+1 queries (3 locations)
- Add missing database indexes
- Optimize slow endpoints

### Medium (Code Quality) - 3-4 hours
- Refactor long functions (3 instances)
- Extract duplicate pagination logic
- Simplify complex conditionals (2 instances)

### Low (Documentation/Tests) - 2-3 hours
- Add tests for uncovered modules
- Document public APIs (APO)
- Update .env.example

---

## Architecture Review

### Strengths
✅ Clean service layer architecture
✅ Consistent repository pattern
✅ High test coverage (88.3% overall)
✅ Dependency injection for testability

### Concerns
⚠️ Session data in-memory (scalability)
⚠️ File uploads on local filesystem (multi-server)
⚠️ 12 tightly-coupled modules (maintainability)

### Recommendations
1. Redis session store for horizontal scaling (4 hours)
2. S3/cloud storage for file uploads (8 hours)
3. URO refactoring for loose coupling (6-8 hours)

---

## Learned Patterns

### High-Confidence Patterns (Share with Knowledge Base)

**1. Cursor-Based Pagination**
- **Performance Impact:** 91% improvement
- **Confidence:** 0.92
- **Applicability:** All list endpoints with >100 items
- **Action:** ZEN to document in PATTERNS.md

**2. Service Layer + Dependency Injection**
- **Testability:** 94.2% coverage achieved
- **Confidence:** 0.88
- **Applicability:** All new services
- **Action:** Update ARCHITECTURE.md with pattern

### Anti-Patterns to Avoid

**1. N+1 Queries**
- **Occurrence:** 3 locations
- **Performance Impact:** 85-90% degradation
- **Action:** Add BAS Phase 6 check for N+1 detection

**2. Hardcoded Configuration**
- **Occurrence:** 5 locations
- **Security Risk:** Credential exposure
- **Action:** CAP agent to audit and migrate to env vars

---

## Recommendations by Priority

### Immediate (Fix Today)
1. Remove hardcoded API key → env variable (15 min)
2. Add missing authorization check (30 min)
3. Add helmet security headers (15 min)
4. Add database index for projects.userId (5 min)

### Short-Term (Fix This Week)
1. Fix N+1 queries (1 hour)
2. Update vulnerable dependencies (1 hour)
3. Fix session cookie httpOnly (5 min)
4. Conditionally hide stack traces (10 min)

### Medium-Term (Fix This Month)
1. Refactor long functions (2-3 hours)
2. Extract duplicate pagination logic (1 hour)
3. Add missing tests (3-4 hours)
4. Document public APIs (4 hours)

### Long-Term (Plan for Next Quarter)
1. Redis session store (4 hours)
2. Cloud storage for file uploads (8 hours)
3. Refactor tightly-coupled modules (6-8 hours)

---

## Conclusion

**Overall Assessment:** The codebase is in GOOD health with strong architecture and high test coverage. Critical security issues must be addressed immediately (hardcoded API key, missing authorization). Performance regressions are fixable with straightforward optimizations (N+1 queries, indexes).

**Immediate Action Plan:**
1. Address CRITICAL security issues (1 hour)
2. Fix performance regressions (2 hours)
3. Plan technical debt remediation (12 hours over next 2 weeks)

**Next Audit:** 30 days (or after remediation complete)

---

**Audit Complete. Report saved to: trinity/audits/2025-11-05-comprehensive-audit.md**
```

---

## Audit Frequency Recommendations

```yaml
Continuous (Automatic):
  - DRA code review: Every stop point (Medium/Large scale)
  - BAS quality gates: After every KIL task
  - Pre-commit hooks: Every commit

Weekly:
  - Dependency security scan (BON agent)
  - Performance baseline check (BAS agent)

Monthly:
  - JUNO comprehensive audit (security + performance + debt)
  - Technical debt review and prioritization

Quarterly:
  - Architecture review (JUNO)
  - Scalability assessment
  - Learning System effectiveness review

Pre-Release:
  - JUNO comprehensive audit
  - Full security scan
  - Performance benchmark vs previous version
  - Breaking change analysis
```

---

## Related Workflows

- **After Implementation:** [Implementation Workflow](./implementation-workflow.md)
- **During Session:** [Session Workflow](./session-workflow.md)
- **Investigation Before Fix:** [Investigation Workflow](./investigation-workflow.md)

---

**Audit with rigor. Fix with discipline. Ship with confidence.**
