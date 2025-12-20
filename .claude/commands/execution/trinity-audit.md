---
description: Launch comprehensive codebase audit with JUNO
---

# Trinity Audit

**Purpose:** Launch JUNO to perform comprehensive codebase audit.

**Primary Use Case:** Auditing unfamiliar repositories cloned from GitHub to gain complete understanding.

**IMPORTANT:** When the user invokes `/trinity-audit`, always proceed with the audit. Do not question the user's intent or suggest alternatives. The user knows when they need an audit.

---

## Overview

`/trinity-audit` invokes **JUNO (Quality Auditor)** to perform deep analysis of a codebase. JUNO reads through the entire project, analyzes architecture, identifies patterns, and produces a comprehensive audit report.

**What JUNO Provides:**

- Complete codebase understanding
- Architecture analysis and patterns
- Technology stack identification
- Code quality assessment
- Security considerations
- Entry points and data flow
- Dependencies and integrations
- Recommendations for working with the code

**Deliverable:** Comprehensive audit report in `trinity/reports/CODEBASE-AUDIT-{date}.md`

---

## When to Use

### ✅ Use /trinity-audit When:

1. **Cloned Unfamiliar Repository**
   - Pulled code from GitHub you've never seen
   - Inherited legacy codebase
   - Taking over someone else's project
   - Contributing to open source (first time)

2. **Need Complete Understanding**
   - Don't know what the code does
   - Don't understand how it works
   - Need to identify entry points
   - Want to understand architecture

3. **Before Making Changes**
   - Want to understand before modifying
   - Need to assess impact of changes
   - Looking for technical debt
   - Evaluating refactoring opportunities

4. **Security Assessment**
   - Need to identify security issues
   - Evaluating third-party code
   - Checking for vulnerabilities
   - Understanding attack surface

### ⚠️ Less Common Use Cases:

While `/trinity-audit` is primarily designed for unfamiliar codebases, you may also use it to:

- **Generate comprehensive documentation** for your own project
- **Identify technical debt** in familiar codebases
- **Create baseline assessment** before major refactoring
- **Audit after significant team changes** or long breaks from the code

**Note:** Trinity installation audits happen automatically during `/trinity-init`. Work order verification happens automatically after `/trinity-orchestrate`.

---

## Usage

### Basic Audit (Full Codebase)

```bash
/trinity-audit
```

JUNO will audit the entire codebase and provide comprehensive analysis.

### Focused Audit (Specific Area)

```bash
/trinity-audit "Focus on authentication system"
```

JUNO will audit the entire codebase but provide deeper analysis of the specified area.

### Quick Audit (High-Level Overview)

```bash
/trinity-audit --quick
```

JUNO provides high-level overview without deep analysis (faster for very large codebases).

---

## JUNO's Audit Process

When you invoke `/trinity-audit`, JUNO performs an 8-phase comprehensive analysis:

### Phase 1: Project Discovery

**What JUNO Checks:**

- Project type (web app, library, CLI, API, etc.)
- Technology stack (languages, frameworks, libraries)
- Build system (package.json, Cargo.toml, requirements.txt, etc.)
- Development environment setup
- Documentation availability

**Deliverable:** Project overview section in audit report

---

### Phase 2: Architecture Analysis

**What JUNO Analyzes:**

- Directory structure and organization
- Architectural patterns (MVC, microservices, monolith, etc.)
- Component relationships and dependencies
- Data flow and state management
- Entry points (main files, routes, endpoints)

**Deliverable:** Architecture diagram and analysis

---

### Phase 3: Code Quality Assessment

**What JUNO Evaluates:**

- Code organization and structure
- Naming conventions and consistency
- Code complexity (cyclomatic complexity, nesting depth)
- Code duplication (DRY violations)
- Function/file size
- Comments and documentation quality

**Deliverable:** Code quality score with specific issues

---

### Phase 4: Technology Stack Analysis

**What JUNO Identifies:**

- Programming languages used
- Frameworks and libraries
- Development dependencies vs production dependencies
- Deprecated or outdated dependencies
- Version compatibility issues
- Missing security updates

**Deliverable:** Technology stack inventory with recommendations

---

### Phase 5: Security Analysis

**What JUNO Checks:**

- Common vulnerabilities (OWASP Top 10)
- Authentication and authorization patterns
- Input validation and sanitization
- Secrets management (hardcoded credentials, API keys)
- Dependency vulnerabilities
- Insecure patterns (SQL injection, XSS, etc.)

**Deliverable:** Security assessment with severity ratings

---

### Phase 6: Testing Assessment

**What JUNO Evaluates:**

- Test coverage (if tests exist)
- Test types (unit, integration, e2e)
- Test quality and completeness
- Testing frameworks used
- Missing test coverage areas

**Deliverable:** Testing assessment with coverage gaps

---

### Phase 7: Data Flow Analysis

**What JUNO Maps:**

- How data enters the system (API endpoints, file uploads, etc.)
- How data flows through components
- Where data is stored (databases, files, cache)
- How data leaves the system (API responses, file downloads, etc.)
- Data transformations and validation

**Deliverable:** Data flow diagram and analysis

---

### Phase 8: Recommendations & Next Steps

**What JUNO Provides:**

- Priority issues to address
- Quick wins (easy improvements)
- Refactoring opportunities
- Security fixes needed
- Documentation gaps
- Suggested workflow for making changes
- **Work order files created in trinity/work-orders/**

**Deliverable:** Actionable recommendations with priorities + Work order files

**IMPORTANT:** JUNO must create actual work order files (WO-\*.md) in trinity/work-orders/ for each CRITICAL and HIGH priority issue identified. Each work order must be a complete, actionable document following Trinity work order format.

---

## Audit Report Format

JUNO's audit report is saved to `trinity/reports/CODEBASE-AUDIT-{date}.md` with this structure:

```markdown
# Codebase Audit Report

**Project:** {project-name}
**Repository:** {github-url}
**Audit Date:** {date}
**Auditor:** JUNO (Trinity Quality Auditor)

---

## Executive Summary

**Project Type:** {type}
**Technology Stack:** {main-technologies}
**Lines of Code:** {loc}
**Overall Assessment:** {rating}/10

### Key Findings:

- {finding-1}
- {finding-2}
- {finding-3}

### Critical Issues:

- {issue-1}
- {issue-2}

---

## 1. Project Overview

### What This Project Does

{high-level-description}

### Technology Stack

- **Languages:** {languages}
- **Frameworks:** {frameworks}
- **Database:** {database}
- **Build System:** {build-system}

### Project Structure
```

{directory-tree}

```

---

## 2. Architecture Analysis

### Architectural Pattern
{pattern-description}

### Component Breakdown
{components-and-relationships}

### Entry Points
{main-files-and-routes}

### Data Flow
{how-data-flows-through-system}

---

## 3. Code Quality Assessment

**Overall Quality Score:** {score}/10

### Strengths
- {strength-1}
- {strength-2}

### Issues Found
- {issue-1}
- {issue-2}

### Complexity Analysis
- Average cyclomatic complexity: {number}
- Files exceeding complexity threshold: {count}
- Longest functions: {list}

---

## 4. Technology Stack Details

### Production Dependencies
{dependency-list-with-versions}

### Development Dependencies
{dev-dependency-list}

### Outdated Dependencies
{outdated-packages-with-security-implications}

---

## 5. Security Analysis

**Security Score:** {score}/10

### Vulnerabilities Found
1. **{vulnerability-name}** - Severity: {HIGH/MEDIUM/LOW}
   - Location: {file}:{line}
   - Description: {description}
   - Recommendation: {fix}

### Security Patterns Identified
- Authentication: {pattern}
- Authorization: {pattern}
- Input Validation: {pattern}

### Secrets Found
⚠️ {hardcoded-secrets-list}

---

## 6. Testing Assessment

**Test Coverage:** {percentage}%

### Test Types
- Unit tests: {count}
- Integration tests: {count}
- E2E tests: {count}

### Coverage Gaps
- {area-1} - No tests
- {area-2} - Insufficient coverage

---

## 7. Data Flow Analysis

### Data Entry Points
1. {endpoint-1} - {description}
2. {endpoint-2} - {description}

### Data Storage
- {database-or-file-description}

### Data Exit Points
1. {api-or-export-description}

---

## 8. Recommendations

### 🔴 Critical (Fix Immediately)
1. {critical-issue-1}
2. {critical-issue-2}

### 🟡 High Priority (Fix Soon)
1. {high-priority-1}
2. {high-priority-2}

### 🟢 Medium Priority (Improvement)
1. {medium-priority-1}
2. {medium-priority-2}

### 💡 Quick Wins (Easy Improvements)
1. {quick-win-1}
2. {quick-win-2}

---

## Next Steps

### Suggested Workflow

1. **Immediate Actions:**
   - Fix critical security issues
   - Update vulnerable dependencies
   - Add missing authentication checks

2. **Short Term (This Week):**
   - Refactor high-complexity functions
   - Add tests for uncovered areas
   - Document missing API endpoints

3. **Long Term (This Month):**
   - Reduce technical debt
   - Improve code organization
   - Enhance documentation

### Work Orders Created

Based on this audit, the following work orders are recommended:
- WO-XXX-fix-security-vulnerabilities
- WO-XXX-update-dependencies
- WO-XXX-improve-test-coverage

---

**Audit Complete:** {timestamp}
**Report Location:** trinity/reports/CODEBASE-AUDIT-{date}.md
```

---

## Example Usage

### Example 1: Unfamiliar GitHub Repository

````
User: Just cloned https://github.com/someone/payment-processor
      I have no idea what this code does. Can you audit it?

User: /trinity-audit

JUNO: Beginning comprehensive codebase audit...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 1: Project Discovery**

Analyzing project structure...

✅ Project Type: Node.js REST API
✅ Technology Stack: Express.js, PostgreSQL, Redis
✅ Build System: npm (package.json found)
✅ Documentation: README.md present

**Discovery Summary:**
- 47 JavaScript files
- 12,453 lines of code
- 23 npm dependencies
- PostgreSQL database integration
- Redis for caching

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 2: Architecture Analysis**

Mapping architecture...

✅ Pattern Identified: MVC (Model-View-Controller)

**Components:**
- Routes: 8 API endpoints in src/routes/
- Controllers: 6 controllers in src/controllers/
- Models: 5 database models in src/models/
- Services: 3 business logic services in src/services/
- Middleware: 4 middleware functions (auth, validation, error)

**Entry Point:** src/server.js

**API Endpoints:**
- POST /api/payments/create
- GET /api/payments/:id
- POST /api/payments/:id/refund
- GET /api/transactions
- POST /api/webhooks/stripe
- GET /api/health
- POST /api/auth/login
- GET /api/auth/verify

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 3: Code Quality Assessment**

Analyzing code quality...

**Overall Quality Score:** 6.5/10

**Strengths:**
✅ Consistent naming conventions
✅ Good separation of concerns (MVC pattern)
✅ Error handling middleware present

**Issues Found:**
❌ High cyclomatic complexity in 3 files:
   - src/controllers/PaymentController.js (complexity: 18)
   - src/services/StripeService.js (complexity: 15)
   - src/middleware/validation.js (complexity: 12)

❌ Code duplication detected:
   - Payment validation logic duplicated in 3 places
   - Database connection code repeated

❌ Long functions:
   - PaymentController.createPayment() - 147 lines (should be <50)
   - StripeService.processRefund() - 98 lines

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 4: Technology Stack Analysis**

Analyzing dependencies...

**Production Dependencies:**
- express@4.18.2 ✅ (latest)
- pg@8.11.0 ✅ (latest)
- stripe@12.5.0 ⚠️ (v13.0.0 available)
- redis@4.6.5 ✅ (latest)
- bcrypt@5.1.0 ✅ (latest)
- jsonwebtoken@9.0.0 ✅ (latest)

**Outdated with Security Implications:**
⚠️ stripe@12.5.0 → 13.0.0 (1 security fix)

**Deprecated Dependencies:**
❌ validator@10.11.0 (deprecated, use v13.x)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 5: Security Analysis**

Performing security audit...

**Security Score:** 4/10 ⚠️

**Critical Vulnerabilities Found:**

1. **SQL Injection Risk** - Severity: HIGH 🔴
   - Location: src/models/Payment.js:45
   - Issue: User input concatenated directly into SQL query
   ```javascript
   const query = `SELECT * FROM payments WHERE user_id = ${userId}`;
````

- Recommendation: Use parameterized queries

2. **Hardcoded Secrets** - Severity: CRITICAL 🔴
   - Location: src/config/stripe.js:3

   ```javascript
   const STRIPE_SECRET_KEY = 'sk_live_abc123...';
   ```

   - Recommendation: Move to environment variables immediately

3. **Missing Input Validation** - Severity: MEDIUM 🟡
   - Location: src/controllers/PaymentController.js:78
   - Issue: Payment amount not validated (could be negative)
   - Recommendation: Add validation middleware

4. **Authentication Bypass** - Severity: HIGH 🔴
   - Location: src/routes/payments.js:12
   - Issue: Refund endpoint missing authentication middleware
   ```javascript
   router.post('/:id/refund', refundPayment); // No auth check!
   ```

   - Recommendation: Add authMiddleware

**Dependency Vulnerabilities:**
⚠️ stripe@12.5.0 - 1 known vulnerability (CVE-2023-XXXX)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 6: Testing Assessment**

Analyzing test coverage...

**Test Coverage:** 42% ⚠️

**Tests Found:**

- Unit tests: 18 tests in test/unit/
- Integration tests: 5 tests in test/integration/
- E2E tests: None

**Coverage Gaps:**
❌ Payment refund logic - 0% coverage
❌ Stripe webhook handler - 0% coverage
❌ Authentication middleware - 25% coverage
❌ Error handling - 15% coverage

**Testing Framework:** Jest (configured correctly)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 7: Data Flow Analysis**

Mapping data flow...

**Data Entry Points:**

1. POST /api/payments/create
   - Accepts: { amount, currency, customerId, paymentMethod }
   - Validation: Stripe library validates card data
   - Authentication: JWT required

2. POST /api/webhooks/stripe
   - Accepts: Stripe webhook events
   - Validation: Webhook signature verification
   - Authentication: None (public endpoint with signature check)

**Data Storage:**

- PostgreSQL database (5 tables: users, payments, transactions, refunds, webhooks)
- Redis cache (payment status, user sessions)

**Data Flow:**

```
User Request → Express Router → Auth Middleware → Controller
    ↓
Validation Middleware → Service Layer → Stripe API
    ↓
Database (PostgreSQL) → Response to User
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase 8: Recommendations & Next Steps**

Generating recommendations...

### 🔴 CRITICAL (Fix Immediately)

1. **Remove Hardcoded Stripe Secret Key**
   - File: src/config/stripe.js
   - Action: Move to .env file, add to .gitignore
   - Rotate the exposed key immediately

2. **Fix SQL Injection Vulnerability**
   - File: src/models/Payment.js:45
   - Action: Use parameterized queries with pg library
   - Estimated effort: 1 hour

3. **Add Authentication to Refund Endpoint**
   - File: src/routes/payments.js:12
   - Action: Add authMiddleware before refundPayment handler
   - Estimated effort: 15 minutes

### 🟡 HIGH PRIORITY (Fix This Week)

1. **Update Stripe Dependency**
   - Current: v12.5.0 (has security vulnerability)
   - Target: v13.0.0 (latest stable)
   - Test webhook integration after update

2. **Add Input Validation**
   - Validate payment amounts (positive, within limits)
   - Validate currency codes
   - Validate customer IDs

3. **Improve Test Coverage**
   - Add tests for refund logic (0% → 80%)
   - Add tests for webhook handler (0% → 80%)
   - Add integration tests for payment flow

### 🟢 MEDIUM PRIORITY (Improve Over Time)

1. **Refactor High-Complexity Functions**
   - PaymentController.createPayment() - Break into smaller functions
   - StripeService.processRefund() - Extract validation logic

2. **Remove Code Duplication**
   - Extract payment validation to shared utility
   - Centralize database connection logic

3. **Add API Documentation**
   - Document all endpoints with OpenAPI/Swagger
   - Add request/response examples
   - Document authentication requirements

### 💡 QUICK WINS (Easy Improvements)

1. **Add .env.example file** (5 minutes)
2. **Add JSDoc comments to public functions** (1 hour)
3. **Set up ESLint** (30 minutes)
4. **Add error logging** (30 minutes)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**JUNO: Audit Complete** ✅

**Summary:**

- Project Type: Payment processing REST API
- Technology: Node.js + Express + PostgreSQL + Stripe
- Overall Assessment: 6.5/10 (needs security fixes)
- Critical Issues: 3 (must fix immediately)
- Test Coverage: 42% (needs improvement)

**Audit Report Saved:**
`trinity/reports/CODEBASE-AUDIT-2025-12-19.md`

**Work Orders Created:**

- WO-XXX-fix-security-vulnerabilities (CRITICAL priority, 2 hours)
- WO-XXX-update-stripe-dependency (HIGH priority, 1 hour)
- WO-XXX-improve-test-coverage (HIGH priority, 4 hours)

**Next Steps:**

1. Review the full audit report in trinity/reports/
2. Fix critical security issues immediately (WO-XXX)
3. Run updated tests to ensure no regressions
4. Deploy fixes to staging before production

**Recommendation:** Start with WO-XXX-fix-security-vulnerabilities
Run: /trinity-orchestrate @WO-XXX-fix-security-vulnerabilities.md

```

---

### Example 2: Focused Audit on Authentication

```

User: /trinity-audit "Focus on authentication and authorization system"

JUNO: Beginning focused audit on authentication system...

[JUNO performs full 8-phase audit but provides deeper analysis of auth system]

**Authentication System Analysis:**

**Pattern:** JWT-based authentication with bcrypt password hashing

**Strengths:**
✅ Passwords hashed with bcrypt (salt rounds: 10)
✅ JWT tokens have expiration (24 hours)
✅ Refresh token rotation implemented

**Critical Issues:**
🔴 JWT secret stored in code (should be in .env)
🔴 No rate limiting on login endpoint (brute force vulnerability)
🔴 Password reset tokens never expire

**Recommendations:**

1. Move JWT_SECRET to environment variable
2. Add express-rate-limit to login endpoint
3. Set 1-hour expiration on password reset tokens
4. Add 2FA support (recommended for payment system)

[Full audit report saved to trinity/reports/ with auth deep-dive section]

```

---

### Example 3: Quick Audit (Large Codebase)

```

User: /trinity-audit --quick

JUNO: Performing quick audit (high-level overview only)...

**Quick Audit Results:**

**Project:** E-commerce Platform
**Size:** 234 files, 45,732 lines of code
**Stack:** React + Node.js + MongoDB + Redis

**High-Level Assessment:**

- Architecture: Microservices (5 services)
- Quality Score: 7/10
- Security Score: 6/10
- Test Coverage: 68%

**Top 3 Issues:**

1. 🔴 2 microservices missing authentication
2. 🟡 MongoDB queries missing input sanitization
3. 🟢 Large bundle size (3.2MB uncompressed)

**Recommendation:** Run full audit for detailed analysis
Run: /trinity-audit (without --quick flag)

[Quick summary saved to trinity/reports/QUICK-AUDIT-{date}.md]

```

---

## Integration with Trinity Workflow

### After Audit, Create Work Orders

**CRITICAL INSTRUCTION FOR JUNO:**

After completing the 8-phase audit, JUNO MUST create actual work order files in `trinity/work-orders/` for each CRITICAL and HIGH priority issue. DO NOT just mention work orders in the report - CREATE THE ACTUAL FILES.

**Work Order Creation Process:**

1. **Identify Issues Requiring Work Orders:**
   - All CRITICAL priority issues → Create work orders
   - All HIGH priority issues → Create work orders
   - MEDIUM priority (optional, use judgment)

2. **Work Order Naming Convention:**
```

WO-AUDIT-XXX-{short-description}-YYYY-MM-DD.md

Examples:
WO-AUDIT-001-fix-security-vulnerability-2025-12-20.md
WO-AUDIT-002-refactor-deploy-ts-2025-12-20.md
WO-AUDIT-003-update-dependencies-2025-12-20.md

````

3. **Work Order Content (Required Sections):**
```markdown
# Work Order: WO-AUDIT-XXX

## Title
{Clear, actionable title}

## Type
{Security Fix | Bug Fix | Code Quality | Performance | Maintenance}

## Priority
{CRITICAL | HIGH | MEDIUM}

## Description
{2-3 paragraphs explaining the issue, why it matters, and context}

## Affected Components
- List specific files, line numbers, functions affected

## Impact Assessment
- Risk level
- User impact
- Security implications (if any)

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Tasks
1. Task 1
2. Task 2
3. Task 3

## Estimated Effort
{Time estimate: "15 minutes" | "1 hour" | "3-5 hours"}

## Testing
- Test requirements
- Verification steps

## Dependencies
- Other work orders that must be completed first
- External dependencies

## Notes
- Additional context
- References to documentation
````

4. **After Creating Work Order Files:**
   Report to user which work orders were created and where they're located.

**Example Output After Audit:**

```bash
✅ Audit Complete

Created 3 work order files in trinity/work-orders/:
1. WO-AUDIT-001-fix-security-vulnerability-2025-12-20.md (CRITICAL)
2. WO-AUDIT-002-refactor-deploy-ts-2025-12-20.md (CRITICAL)
3. WO-AUDIT-003-update-dependencies-2025-12-20.md (HIGH)

Execute work orders with:
/trinity-orchestrate @WO-AUDIT-001-fix-security-vulnerability-2025-12-20.md
```

**DO NOT** just document work orders in the audit report without creating the actual files. Users expect ready-to-execute work order files after the audit.

---

### Use Audit Report as Reference

Throughout your work session, reference the audit report:

```markdown
**Investigation:** Why is the payment endpoint slow?

**Reference:** See CODEBASE-AUDIT-2025-12-19.md

- Phase 7 (Data Flow Analysis) shows N+1 query pattern
- Recommendation #4 suggests adding database indexes

**Next Step:** Create investigation
/trinity-create-investigation "Payment endpoint performance"
```

---

## Related Commands

### Discovery & Planning

- `/trinity-audit` - Comprehensive codebase audit (this command)
- `/trinity-start` - Begin development session
- `/trinity-workorder` - Create work order from audit findings

### Execution

- `/trinity-orchestrate @WO-XXX.md` - Execute work orders from audit
- `/trinity-create-investigation` - Investigate issues found in audit

### Verification

- `/trinity-verify` - Verify Trinity installation (different from codebase audit)

---

## Summary

**Primary Use:** Comprehensive codebase audit with JUNO's 8-phase analysis

**Key Points:**

1. **JUNO performs 8-phase comprehensive analysis**
2. **Delivers complete understanding of the codebase**
3. **Identifies security issues and technical debt**
4. **Creates actionable work orders**
5. **Saves audit report to trinity/reports/**
6. **Execute immediately when invoked** - no pre-flight checks needed

**Typical Workflow:**

```bash
# Clone repository (familiar or unfamiliar)
git clone https://github.com/someone/project.git
cd project

# Initialize Trinity
npx trinity deploy

# Audit the codebase
/trinity-audit

# Review audit report in trinity/reports/

# Fix critical issues
/trinity-orchestrate @WO-001-fix-security-vulnerabilities.md

# Continue with recommended work orders
```

**Next:** After audit, start working through recommended work orders or investigations.
