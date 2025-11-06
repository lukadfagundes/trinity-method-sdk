# Agent Selection Guide

**When to Use Which Trinity Agent**
**Trinity Method SDK v2.0**
**Last Updated:** 2025-11-05

---

## Overview

Trinity Method SDK provides 18 specialized AI agents organized into 5 layers. This guide helps you choose the right agent(s) for your task and understand how agents collaborate.

---

## Quick Reference: Agent Selection by Task

| Task Type | Primary Agent(s) | Secondary Agents |
|-----------|------------------|------------------|
| **Start new feature** | ALY | MON, ROR, TRA, EUS |
| **Implement code** | KIL | BAS (automatic) |
| **Review code** | DRA | KIL, BAS |
| **Comprehensive audit** | JUNO | ALY, ZEN |
| **Analyze requirements** | MON | ALY, ROR |
| **Create design** | ROR | MON, TRA |
| **Plan implementation** | TRA | ROR, EUS |
| **Break down tasks** | EUS | TRA, KIL |
| **Refactor code** | URO | KIL, BAS, DRA |
| **Manage dependencies** | BON | CAP |
| **Configure settings** | CAP | BON, TAN |
| **Document APIs** | APO | ZEN |
| **Deploy Trinity** | TAN | ZEN, INO |
| **Manage knowledge** | ZEN | ALY, INO |
| **Set up context** | INO | ZEN, TAN |
| **Set up CI/CD** | Ein | TAN, CAP |
| **Coordinate team** | AJ MAESTRO | All 11 agents |

---

## The 18 Agents (Organized by Layer)

### Leadership Layer (2 agents)
**When:** Strategic decisions, high-level coordination, investigation initiation

**Agents:**
- **ALY (Chief Technology Officer)**
- **AJ MAESTRO (Implementation Lead)**

---

### Planning Layer (4 agents)
**When:** Before implementation, during design phase, creating roadmap

**Agents:**
- **MON (Requirements Analyst)**
- **ROR (Design Architect)**
- **TRA (Work Planner)**
- **EUS (Task Decomposer)**

---

### Execution Layer (3 agents)
**When:** During implementation, code review, quality enforcement

**Agents:**
- **KIL (Task Executor)**
- **BAS (Quality Gate)**
- **DRA (Code Reviewer)**

---

### Support Layer (4 agents)
**When:** Documentation, dependency management, configuration, refactoring

**Agents:**
- **APO (Documentation Specialist)**
- **BON (Dependency Manager)**
- **CAP (Configuration Specialist)**
- **URO (Refactoring Specialist)**

---

### Deployment Layer (4 agents)
**When:** Initial setup, knowledge base management, CI/CD integration

**Agents:**
- **TAN (Structure Specialist)**
- **ZEN (Knowledge Base Specialist)**
- **INO (Context Specialist)**
- **Ein (CI/CD Specialist)**

---

### Audit Layer (1 agent)
**When:** Comprehensive audits, security reviews, technical debt assessment

**Agent:**
- **JUNO (Quality Auditor)**

---

## Detailed Agent Profiles

### ALY (Chief Technology Officer)

**Role:** Strategic leadership, investigation coordination, technical direction

**When to Use ALY:**
- Starting new investigation
- Need technical decision or architectural guidance
- Resuming work after interruption (`/trinity-continue`)
- Coordinating complex multi-step investigation
- Determining project scale (Small/Medium/Large)

**ALY Personality:**
- Strategic thinker
- Big-picture perspective
- Evidence-based decision maker
- Delegates to specialists

**Example Usage:**
```
User: "Please review .claude/agents/leadership/aly-cto.md to
       investigate performance issues with user list endpoint"

ALY: [Analyzes situation]
ALY: This requires technical + performance investigation.
     Delegating to:
     - ZEN for technical analysis
     - BAS for performance baseline
     - MON for requirements (expected performance targets)

     I'll coordinate findings into investigation document.
```

**Coordinates With:** ZEN, BAS, MON, JUNO (evidence collectors)

**Output:** Investigation documents, technical decisions, strategic recommendations

---

### AJ MAESTRO (Implementation Lead)

**Role:** Orchestrate 11-agent implementation team, coordinate stop points

**When to Use AJ MAESTRO:**
- Complete feature implementation (`/trinity-orchestrate`)
- Coordinating multiple agents
- Managing stop points (Medium/Large scale)
- End-to-end implementation oversight

**AJ MAESTRO Personality:**
- Conductor/orchestrator
- Coordination specialist
- Timeline manager
- Quality enforcer

**Example Usage:**
```
User: /trinity-orchestrate
AJ MAESTRO: Starting orchestration for user pagination feature...

Step 1: ALY determines scale → MEDIUM (8 hours)
Step 2: MON analyzes requirements → Complete
Step 3: ROR creates Design Document → Complete
--- STOP POINT #1: Design Review ---
User: approve
Step 4: TRA creates implementation plan → Complete
Step 5: EUS decomposes into atomic tasks → 5 tasks identified
Step 6: KIL executes tasks with TDD
  - Task 1/5: PaginationHelper utility → BAS PASS
  - Task 2/5: UserService pagination → BAS PASS
  - Task 3/5: UserController endpoint → BAS PASS
  - Task 4/5: Unit tests → BAS PASS
  - Task 5/5: E2E tests → BAS PASS
Step 7: DRA reviews code → APPROVED
AJ MAESTRO: Implementation complete!
```

**Coordinates With:** All 11 implementation agents (MON, ROR, TRA, EUS, KIL, BAS, DRA, APO, BON, CAP, URO)

**Output:** Complete implementations, coordination reports, stop point management

---

### MON (Requirements Analyst)

**Role:** Analyze requirements, define acceptance criteria, identify user needs

**When to Use MON:**
- Unclear or ambiguous requirements (`/trinity-requirements`)
- Need to define acceptance criteria
- Starting Medium/Large implementation
- Analyzing user workflows

**MON Personality:**
- Detail-oriented
- User-focused
- Clarification seeker
- Criteria definer

**Example Usage:**
```
User: /trinity-requirements
User: Add pagination to user list

MON: Analyzing requirements for user list pagination...

User Needs:
- View users in manageable chunks (not all at once)
- Navigate forward/backward through pages
- Know total user count and current page
- Consistent user experience across page loads

Acceptance Criteria:
- Support page and limit query parameters
- Return total count and hasMore flag
- Maintain consistent sort order (by createdAt)
- Handle edge cases (page out of range, invalid limit)
- Performance: Response time <200ms (p95)

Non-Functional Requirements:
- Pagination should work with 100k+ users
- Should integrate with existing filtering
- Must maintain backward compatibility

Questions:
1. Should we support cursor-based pagination?
2. What is default limit if not specified?
3. Should pagination state persist across sessions?
```

**Coordinates With:** ALY (strategic context), ROR (design implications), User (clarifications)

**Output:** Requirements document, acceptance criteria, user workflows

---

### ROR (Design Architect)

**Role:** Create technical design, define architecture, specify interfaces

**When to Use ROR:**
- Medium/Large scale implementation (`/trinity-design`)
- Need architectural guidance
- Designing component interactions
- Defining database schema changes

**ROR Personality:**
- Architecture-focused
- System thinker
- Pattern advocate
- Interface designer

**Example Usage:**
```
User: /trinity-design

ROR: Creating Design Document for user list pagination...

## Component Architecture

PaginationHelper (Utility)
  - calculateSkip(page, limit): number
  - validatePaginationOptions(options): void
  - buildPaginatedResult<T>(data, total, options): PaginatedResult<T>

UserService (Service Layer)
  - listUsers(options: PaginationOptions): Promise<PaginatedResult<User>>
  - Uses PaginationHelper for calculations
  - Queries database with skip/limit
  - Returns paginated result

UserController (API Layer)
  - GET /api/users (handler)
  - Validates query parameters
  - Calls UserService.listUsers()
  - Returns JSON response

## Data Flow
1. Request: GET /api/users?page=2&limit=10
2. Controller validates query params
3. Controller calls UserService.listUsers({ page: 2, limit: 10 })
4. Service uses PaginationHelper to calculate skip (10)
5. Service queries database: find().skip(10).limit(10)
6. Service builds PaginatedResult with hasMore flag
7. Controller returns JSON response

## Interface Definitions
[TypeScript interfaces...]

## Testing Strategy
- Unit: PaginationHelper utilities
- Integration: UserService.listUsers()
- E2E: GET /api/users endpoint
- Performance: Response time <200ms (p95)

Design Document saved: trinity/design-docs/2025-11-05-user-pagination.md
```

**Coordinates With:** MON (requirements), TRA (planning), DRA (validates compliance)

**Output:** Design documents, architecture diagrams, interface specifications

---

### TRA (Work Planner)

**Role:** Create implementation plan, estimate effort, identify dependencies

**When to Use TRA:**
- Creating work breakdown (`/trinity-plan`)
- Estimating implementation time
- Identifying task dependencies
- Risk assessment

**TRA Personality:**
- Planning specialist
- Timeline estimator
- Risk assessor
- Dependency mapper

**Example Usage:**
```
User: /trinity-plan

TRA: Creating implementation plan for user list pagination...

## Work Breakdown

Task 1: Create PaginationHelper utility (2 hours)
  - Dependencies: None
  - Risk: Low
  - Deliverables: Utility class with tests

Task 2: Update UserService with pagination (3 hours)
  - Dependencies: Task 1 (PaginationHelper)
  - Risk: Medium (database query changes)
  - Deliverables: Service method with integration tests

Task 3: Update UserController endpoint (2 hours)
  - Dependencies: Task 2 (UserService)
  - Risk: Low
  - Deliverables: API endpoint with E2E tests

Task 4: Performance testing (1 hour)
  - Dependencies: Task 3 (Complete implementation)
  - Risk: Medium (may reveal performance issues)
  - Deliverables: Performance benchmarks

## Total Estimate: 8 hours
## Scale: MEDIUM
## Risk: Low-Medium

## Risk Mitigation:
- Database query performance → Add indexes if needed
- Backward compatibility → Pagination optional (default: return all)

Plan saved: trinity/plans/2025-11-05-user-pagination.md
```

**Coordinates With:** ROR (design), EUS (task decomposition), AJ MAESTRO (orchestration)

**Output:** Implementation plans, time estimates, risk assessments

---

### EUS (Task Decomposer)

**Role:** Break work into atomic tasks (2-4 hours each)

**When to Use EUS:**
- Decomposing large features (`/trinity-decompose`)
- Creating atomic task list
- Medium/Large scale implementations
- When working with KIL (executor needs atomic tasks)

**EUS Personality:**
- Detail-oriented
- Task atomizer
- Dependency analyzer
- Test requirement specifier

**Example Usage:**
```
User: /trinity-decompose

EUS: Decomposing user list pagination into atomic tasks...

Atomic Task 1: PaginationHelper.calculateSkip()
  - Time: 30 minutes
  - Dependencies: None
  - Tests Required:
      • Unit test: calculateSkip(1, 10) = 0
      • Unit test: calculateSkip(2, 10) = 10
      • Unit test: calculateSkip(3, 25) = 50
  - Acceptance: All tests pass

Atomic Task 2: PaginationHelper.validatePaginationOptions()
  - Time: 30 minutes
  - Dependencies: None
  - Tests Required:
      • Unit test: throws error if page < 1
      • Unit test: throws error if limit < 1 or > 100
      • Unit test: accepts valid options
  - Acceptance: All tests pass

Atomic Task 3: PaginationHelper.buildPaginatedResult()
  - Time: 1 hour
  - Dependencies: None
  - Tests Required:
      • Unit test: builds correct PaginatedResult structure
      • Unit test: calculates hasMore correctly
  - Acceptance: All tests pass

Atomic Task 4: UserService.listUsers() - Implementation
  - Time: 2 hours
  - Dependencies: Task 1, 2, 3 (PaginationHelper complete)
  - Tests Required:
      • Integration test: returns paginated results
      • Integration test: handles page 1, 2, last page
      • Integration test: respects limit parameter
  - Acceptance: All tests pass, integration with PaginationHelper

Atomic Task 5: UserController.getUsers() - API endpoint
  - Time: 1.5 hours
  - Dependencies: Task 4 (UserService)
  - Tests Required:
      • E2E test: GET /api/users?page=1&limit=10
      • E2E test: Validates query parameters
      • E2E test: Returns correct JSON structure
  - Acceptance: All tests pass, endpoint functional

Total: 5 atomic tasks, 5.5 hours
Ready for KIL execution with TDD cycle.
```

**Coordinates With:** TRA (planning), KIL (execution)

**Output:** Atomic task lists, test requirements, task dependencies

---

### KIL (Task Executor)

**Role:** Execute atomic tasks with TDD (RED-GREEN-REFACTOR cycle)

**When to Use KIL:**
- Implementing code (automatically via `/trinity-orchestrate`)
- TDD enforcement required
- Executing atomic tasks from EUS
- All implementation work

**KIL Personality:**
- Implementation specialist
- TDD enforcer
- Code writer
- Test-first advocate

**TDD Workflow:**
```
KIL executes Task 1: PaginationHelper.calculateSkip()

RED Phase:
  - Write failing test first
  - Test: expect(calculateSkip(1, 10)).toBe(0)
  - Run test → ❌ FAIL (function not implemented)
  - KIL verifies: Test fails for right reason

GREEN Phase:
  - Write minimal code to pass
  - Implementation: return (page - 1) * limit;
  - Run test → ✅ PASS
  - KIL verifies: Test passes with minimal code

REFACTOR Phase:
  - Clean code, improve clarity
  - Extract helper functions if needed
  - Run test → ✅ PASS (still passes after refactor)
  - KIL verifies: Tests still pass

BAS Quality Gate (Automatic):
  - Phase 1: Linting → ✅ PASS
  - Phase 2: Structure → ✅ PASS
  - Phase 3: Build → ✅ PASS
  - Phase 4: Testing → ✅ PASS
  - Phase 5: Coverage → ✅ PASS (100% for this task)
  - Phase 6: Best Practices → ✅ PASS

KIL: Task 1 complete. Moving to Task 2...
```

**Coordinates With:** EUS (task list), BAS (quality gates - automatic), DRA (code review)

**Output:** Implementation code, tests, TDD documentation

---

### BAS (Quality Gate)

**Role:** Enforce 6-phase quality gates after every KIL task

**When to Use BAS:**
- Automatic after every KIL task
- Manual quality checks (`/trinity-benchmark`)
- Baseline establishment
- Performance validation

**BAS Personality:**
- Quality enforcer
- Zero-tolerance for failures
- Performance monitor
- Coverage validator

**6-Phase Quality Gate:**
```
BAS Quality Gate Execution:

[1/6] Linting...
  ✓ ESLint: 0 errors, 0 warnings
  ✓ Prettier: All files formatted

[2/6] Structure Validation...
  ✓ Functions ≤2 parameters
  ✓ Function length <200 lines
  ✓ Nesting depth ≤4 levels

[3/6] Build...
  ✓ TypeScript compilation successful
  ✓ No type errors

[4/6] Testing...
  ✓ 127 tests passed
  ✓ 0 tests failed

[5/6] Coverage...
  ✓ Overall: 94.2% (threshold: 80%)
  ✓ New code: 100%

[6/6] Best Practices...
  ✓ Error handling present in async functions
  ✓ No console.log in production code
  ✓ Types exported from @shared/types

✅ Quality Gate PASSED - Ready for next task

If ANY phase fails → 🚫 GATE FAILED - Fix before proceeding
```

**Coordinates With:** KIL (automatic execution after each task)

**Output:** Quality reports, performance baselines, pass/fail decisions

---

### DRA (Code Reviewer)

**Role:** Validate Design Doc compliance, code quality standards

**When to Use DRA:**
- Medium/Large scale stop points
- Code review before merge
- Design Doc compliance validation
- Quality standard enforcement

**DRA Personality:**
- Code quality advocate
- Design Doc validator
- Standards enforcer
- Constructive critic

**Review Process:**
```
DRA Code Review (Medium scale - Stop Point #1):

## Design Document Compliance
✅ PaginationHelper: Matches design specification
✅ UserService.listUsers(): Correct interface
✅ UserController.getUsers(): API spec compliant

## Code Quality Standards
✅ Functions ≤2 parameters (31/31 functions)
✅ Function length <200 lines (longest: 47 lines)
✅ Nesting depth ≤4 (max depth: 3 levels)
✅ Async error handling (18/18 functions have try-catch)

## Security Review (Basic)
✅ No hardcoded secrets
✅ Input validation present (Joi schemas)
✅ No SQL injection vulnerabilities
✅ No sensitive data in logs

⚠️ RECOMMENDATION: Add rate limiting to pagination endpoint

## Conclusion
APPROVED FOR MERGE

Recommendations are enhancements, not blockers.
Review saved: trinity/reviews/2025-11-05-user-pagination.md
```

**Coordinates With:** KIL (reviews implementation), ROR (validates against design), JUNO (escalates to comprehensive audit if needed)

**Output:** Code review reports, compliance validation, recommendations

---

### APO (Documentation Specialist)

**Role:** Generate API documentation, inline comments

**When to Use APO:**
- API documentation needed
- Inline comment generation
- JSDoc/TSDoc generation
- Documentation gaps identified by DRA

**APO Personality:**
- Documentation advocate
- Clarity focused
- User-centric
- Example provider

**Example Usage:**
```
APO generates documentation for PaginationHelper:

/**
 * Calculate database skip value for pagination
 *
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page
 * @returns Skip value for database query (0-indexed)
 *
 * @example
 * calculateSkip(1, 10) // Returns 0 (first page, skip 0 items)
 * calculateSkip(2, 10) // Returns 10 (second page, skip 10 items)
 * calculateSkip(3, 25) // Returns 50 (third page, skip 50 items)
 *
 * @throws {ValidationError} If page < 1 or limit < 1
 */
export function calculateSkip(page: number, limit: number): number {
  if (page < 1) throw new ValidationError('Page must be >= 1');
  if (limit < 1) throw new ValidationError('Limit must be >= 1');
  return (page - 1) * limit;
}
```

**Coordinates With:** ZEN (knowledge base updates), KIL (implementation context)

**Output:** API documentation, inline comments, usage examples

---

### BON (Dependency Manager)

**Role:** Manage dependencies, security updates, version management

**When to Use BON:**
- Updating dependencies
- Security vulnerability fixes
- Package.json management
- Dependency conflict resolution

**BON Personality:**
- Security-conscious
- Version manager
- Compatibility checker
- Update advocate

**Example Usage:**
```
BON: Analyzing dependencies for security vulnerabilities...

Security Audit Results:
  ❌ lodash@4.17.19 - CVE-2020-8203 (Moderate)
  ❌ express@4.17.1 - CVE-2022-24999 (High)
  ⚠️ axios@0.21.1 - Outdated (latest: 1.6.0)

Recommended Updates:
  - lodash: 4.17.19 → 4.17.21 (security fix)
  - express: 4.17.1 → 4.18.2 (security fix)
  - axios: 0.21.1 → 1.6.0 (features + security)

Breaking Changes:
  - express 4.18.x: None identified
  - axios 1.x: API changes (migration needed)

BON: Updating non-breaking dependencies...
  ✓ lodash updated to 4.17.21
  ✓ express updated to 4.18.2

BON: Axios 1.x migration requires code changes. Create work order?
```

**Coordinates With:** CAP (configuration), Ein (CI/CD updates)

**Output:** Dependency updates, security reports, migration guides

---

### CAP (Configuration Specialist)

**Role:** Manage configuration, environment variables, settings

**When to Use CAP:**
- Configuration management (`/trinity-config`)
- Environment variable setup
- Settings synchronization
- Hook configuration (`/trinity-hooks`)

**CAP Personality:**
- Configuration expert
- Environment manager
- Settings coordinator
- Sync enforcer

**Example Usage:**
```
User: /trinity-config

CAP: Trinity Configuration Manager

What would you like to configure?
1. Learning System
2. Cache Settings
3. Quality Gates
4. Hooks
5. Agent Preferences

User: 1

CAP: Learning System Configuration

Current Settings:
  - Pattern extraction: Enabled
  - Confidence threshold: 0.7
  - Cross-session learning: Enabled
  - Pattern sharing: Enabled (git)

Modify settings?
1. Enable/disable pattern extraction
2. Change confidence threshold (0.0-1.0)
3. Enable/disable cross-session learning
4. Change sharing preference

User: 2

CAP: Current confidence threshold: 0.7
     Patterns with confidence <0.7 are not suggested.

     New threshold (0.0-1.0): 0.8

CAP: Confidence threshold updated to 0.8
     Saved to: .trinity/config.json

     This will result in:
     - Fewer pattern suggestions (higher quality)
     - Longer learning period
     - More confident recommendations
```

**Coordinates With:** BON (dependencies), TAN (structure), Ein (CI/CD config)

**Output:** Configuration updates, environment files, settings documentation

---

### URO (Refactoring Specialist)

**Role:** Refactor code, reduce technical debt, improve structure

**When to Use URO:**
- Technical debt reduction
- Code refactoring needed
- Function length >200 lines
- Nesting depth >4 levels
- Duplicate code extraction

**URO Personality:**
- Code quality advocate
- Refactoring specialist
- Debt reducer
- Clean code promoter

**Example Usage:**
```
URO: Analyzing codebase for refactoring opportunities...

Technical Debt Identified:
1. Long function: processOrder() (247 lines)
   - Recommendation: Extract to smaller functions
   - Estimated effort: 2 hours

2. Duplicate code: Pagination logic (3 occurrences)
   - Recommendation: Extract to PaginationHelper
   - Estimated effort: 1 hour

3. Complex conditional: PermissionService.hasAccess() (5 levels deep)
   - Recommendation: Extract guard clauses
   - Estimated effort: 30 minutes

URO: Starting refactoring: Long function processOrder()

Before (247 lines):
function processOrder(order) {
  // ... 247 lines of code
}

After (refactored):
function processOrder(order) {
  validateOrder(order);
  const payment = processPayment(order);
  updateInventory(order);
  notifyUser(order);
  return createOrderResult(order, payment);
}

function validateOrder(order) { /* ... */ }
function processPayment(order) { /* ... */ }
function updateInventory(order) { /* ... */ }
function notifyUser(order) { /* ... */ }
function createOrderResult(order, payment) { /* ... */ }

URO: Refactoring complete. All tests still pass.
     Technical debt reduced by 2 hours.
```

**Coordinates With:** KIL (implementation), BAS (quality validation), DRA (code review)

**Output:** Refactored code, technical debt reports, improvement metrics

---

### TAN (Structure Specialist)

**Role:** Create folder structure, organize files, establish hierarchy

**When to Use TAN:**
- Initial Trinity deployment (`/trinity-init`)
- Folder structure creation
- File organization
- Project structure setup

**TAN Personality:**
- Organization expert
- Structure creator
- Hierarchy designer
- Folder architect

**Example Usage:**
```
User: /trinity-init

TAN: Creating Trinity Method SDK folder structure...

Creating: trinity/
├── .claude/
│   ├── agents/ (18 agent files)
│   ├── commands/ (24 slash commands)
│   └── hooks/ (4 hook types)
├── knowledge-base/
│   ├── Trinity.md
│   ├── ARCHITECTURE.md
│   ├── ISSUES.md
│   ├── To-do.md
│   └── PATTERNS.md
├── learning/
│   ├── patterns/
│   ├── strategies/
│   └── metrics/
├── investigations/
├── design-docs/
├── work-orders/
├── sessions/
├── audits/
└── cache/

TAN: Folder structure created (2.3s)
     Total directories: 24
     Total files: 67

Next: ZEN will initialize Knowledge Base
```

**Coordinates With:** ZEN (knowledge base), INO (context hierarchy), Ein (CI/CD setup)

**Output:** Folder structure, directory organization, file hierarchy

---

### ZEN (Knowledge Base Specialist)

**Role:** Manage knowledge base, document patterns, maintain ARCHITECTURE.md

**When to Use ZEN:**
- Knowledge base updates
- Pattern documentation
- ARCHITECTURE.md maintenance
- Technical analysis for investigations
- Cross-session knowledge preservation

**ZEN Personality:**
- Knowledge curator
- Documentation maintainer
- Pattern documenter
- History preserver

**Example Usage:**
```
ZEN: Updating Knowledge Base after pagination implementation...

## Updates Applied:

1. ARCHITECTURE.md
   Added section: API Pagination Pattern
   - Cursor-based pagination approach
   - PaginationHelper utility
   - Service layer integration

2. PATTERNS.md
   Added pattern: Cursor-Based Pagination
   - Confidence: 0.92
   - Use case: List endpoints with >100 items
   - Performance: 91% improvement over offset pagination
   - Code examples included

3. PERFORMANCE.md (created)
   Added baseline: GET /api/users
   - Response time: 78ms (p95)
   - Memory: 1.8MB per request
   - Baseline established: 2025-11-05

4. To-do.md
   Marked complete: Add pagination to user list API
   Added follow-up: Apply pagination to /api/projects

ZEN: Knowledge Base updated (4 files modified/created)
     Session knowledge preserved for future reference.
```

**Coordinates With:** ALY (investigation coordination), APO (documentation), Learning System (pattern extraction)

**Output:** Knowledge base updates, pattern documentation, architecture docs

---

### INO (Context Specialist)

**Role:** Establish CLAUDE.md hierarchy, manage codebase context

**When to Use INO:**
- Initial Trinity deployment (`/trinity-init`)
- CLAUDE.md hierarchy creation
- Codebase analysis
- Context management

**INO Personality:**
- Context expert
- Hierarchy manager
- Codebase analyzer
- Documentation coordinator

**Example Usage:**
```
User: /trinity-init

INO: Establishing CLAUDE.md context hierarchy...

Creating 3-tier hierarchy:

Tier 1: Project Root CLAUDE.md
  - Project overview
  - Tech stack
  - Current tasks (links to To-do.md)
  - Known issues (links to ISSUES.md)
  - Trinity Method Core Philosophy

Tier 2: src/CLAUDE.md
  - Technology-specific rules
  - Coding conventions
  - Module system guidance
  - Framework patterns

Tier 3: trinity/CLAUDE.md
  - Trinity Method enforcement
  - Investigation requirements
  - Quality standards
  - Agent coordination rules

INO: Context hierarchy established (0.8s)
     3 CLAUDE.md files created

Next: JUNO will perform initial audit
```

**Coordinates With:** ZEN (knowledge base), TAN (structure), ALY (context awareness)

**Output:** CLAUDE.md hierarchy, context documentation, codebase analysis

---

### Ein (CI/CD Specialist)

**Role:** CI/CD integration, pipeline automation, deployment setup

**When to Use Ein:**
- CI/CD pipeline setup
- GitHub Actions / GitLab CI integration
- Deployment automation
- Pre-commit hooks (with CAP)

**Ein Personality:**
- DevOps expert
- Automation advocate
- Pipeline designer
- Deployment specialist

**Example Usage:**
```
Ein: Analyzing CI/CD configuration...

Current Setup:
  - CI Platform: GitHub Actions
  - Workflows: .github/workflows/ci.yml
  - Hooks: .pre-commit-config.yaml

Trinity Integration Recommendations:

1. Add BAS Quality Gates to CI
   ✓ Phase 1: Linting (already present)
   ✓ Phase 3: Build (already present)
   ✓ Phase 4: Testing (already present)
   ⚠️ Phase 5: Coverage check (add threshold validation)
   ⚠️ Phase 6: Best practices (add custom checks)

2. Add JUNO Audits on Release Branches
   - Trigger: Push to release/*
   - Action: Run comprehensive audit
   - Output: Upload audit report as artifact

3. Add Trinity Benchmarks on PR
   - Trigger: Pull request
   - Action: Run performance benchmarks
   - Output: Comment with results vs baseline

Ein: Would you like me to update CI configuration?
```

**Coordinates With:** CAP (configuration), BON (dependencies), TAN (structure)

**Output:** CI/CD pipelines, deployment scripts, automation configuration

---

### JUNO (Quality Auditor)

**Role:** Comprehensive audits (security + performance + debt)

**When to Use JUNO:**
- Large scale post-deployment audits
- Comprehensive security review
- Technical debt assessment
- Periodic quality audits (`/trinity-verify`)

**JUNO Personality:**
- Quality auditor
- Security expert
- Performance analyst
- Debt assessor

**Example Usage:**
```
User: /trinity-verify

JUNO: Performing comprehensive Trinity Method SDK audit...

[1/5] Security Audit (OWASP Top 10)
  ✅ No SQL injection vulnerabilities
  ✅ No hardcoded secrets
  ⚠️ Session cookies not httpOnly (MEDIUM)
  ❌ Missing security headers (HIGH)

[2/5] Performance Audit
  ✅ GET /api/users: 78ms (p95) - Within target
  ⚠️ POST /api/users: 124ms - 30% regression
  ❌ GET /api/projects: 450ms - Exceeds 200ms target

[3/5] Technical Debt Assessment
  - Total debt: 12 hours
  - Critical: 1 hour (security fixes)
  - High: 4 hours (performance issues)
  - Medium: 4 hours (code quality)
  - Low: 3 hours (documentation)

[4/5] Architecture Review
  ✅ Service layer pattern consistent
  ✅ Repository pattern implemented
  ⚠️ 12 tightly-coupled modules

[5/5] Pattern Extraction
  - Cursor-based pagination: High confidence (0.92)
  - Service layer DI: Medium confidence (0.88)
  - Anti-pattern: N+1 queries (3 occurrences)

JUNO: Audit complete (2.5 hours)
      Report saved: trinity/audits/2025-11-05-comprehensive-audit.md

Immediate Actions Required:
1. Add helmet middleware (15 minutes)
2. Fix GET /api/projects N+1 query (30 minutes)
3. Update vulnerable dependencies (1 hour)
```

**Coordinates With:** ALY (strategic recommendations), ZEN (knowledge base updates), DRA (escalation from code review)

**Output:** Comprehensive audit reports, security findings, performance analysis, technical debt assessment

---

## Agent Collaboration Patterns

### Pattern 1: Investigation → Implementation

```
Investigation Phase:
  ALY (coordinates) →
  ├── ZEN (technical analysis)
  ├── BAS (performance baseline)
  ├── MON (requirements)
  └── JUNO (security/audit as needed)

Planning Phase:
  ROR (design) → TRA (plan) → EUS (decompose)

Implementation Phase:
  KIL (execute) ↔ BAS (quality gates - automatic)

Review Phase:
  DRA (code review) → JUNO (comprehensive audit - Large scale)
```

---

### Pattern 2: Small Scale Implementation

```
User requests feature (estimated 0-4 hours)

ALY: Determines scale → SMALL
     No Design Doc needed
     Direct to implementation

KIL: Executes with TDD
     RED → GREEN → REFACTOR → BAS gate

BAS: Automatic quality gates after each task

Done: Feature complete, no stop points
```

---

### Pattern 3: Medium Scale Implementation

```
User requests feature (estimated 4-16 hours)

ALY: Determines scale → MEDIUM
     Design Doc required

MON: Analyzes requirements
ROR: Creates Design Document

STOP POINT #1: User reviews design

TRA: Creates implementation plan
EUS: Decomposes into atomic tasks
KIL: Executes tasks with TDD
     Each task: RED → GREEN → REFACTOR → BAS gate

DRA: Reviews code for Design Doc compliance

Done: Feature complete, 1 stop point
```

---

### Pattern 4: Large Scale Implementation

```
User requests feature (estimated 16+ hours)

ALY: Determines scale → LARGE
     Comprehensive planning required

MON: Analyzes requirements
ROR: Creates comprehensive Design Document

STOP POINT #1: User reviews design

TRA: Creates detailed implementation plan
EUS: Decomposes into atomic tasks
KIL: Starts implementation (first 50%)
     Each task: RED → GREEN → REFACTOR → BAS gate

STOP POINT #2: Mid-implementation review (50% complete)

KIL: Continues implementation (remaining 50%)
DRA: Comprehensive code review

STOP POINT #3: Pre-merge review

User: Approves merge
JUNO: Post-deployment comprehensive audit

STOP POINT #4: Post-deployment review

Done: Feature complete, 4 stop points
```

---

## Decision Tree: Which Agent to Use?

```
START: What do you need?

├─ Need strategic guidance or starting investigation
│  └─ Use: ALY (Chief Technology Officer)
│
├─ Need complete feature implementation
│  └─ Use: AJ MAESTRO (/trinity-orchestrate)
│      └─ AJ MAESTRO coordinates all agents automatically
│
├─ Need to understand requirements
│  └─ Use: MON (Requirements Analyst)
│
├─ Need technical design
│  └─ Use: ROR (Design Architect)
│
├─ Need implementation plan
│  └─ Use: TRA (Work Planner)
│
├─ Need to break down large task
│  └─ Use: EUS (Task Decomposer)
│
├─ Need to write code
│  └─ Use: KIL (Task Executor)
│      └─ BAS (Quality Gate) runs automatically
│
├─ Need code review
│  └─ Use: DRA (Code Reviewer)
│
├─ Need comprehensive audit
│  └─ Use: JUNO (Quality Auditor)
│
├─ Need refactoring
│  └─ Use: URO (Refactoring Specialist)
│
├─ Need documentation
│  └─ Use: APO (Documentation Specialist)
│
├─ Need dependency management
│  └─ Use: BON (Dependency Manager)
│
├─ Need configuration
│  └─ Use: CAP (Configuration Specialist)
│
├─ Need folder structure / deployment
│  ├─ TAN (Structure Specialist)
│  ├─ ZEN (Knowledge Base Specialist)
│  └─ INO (Context Specialist)
│
└─ Need CI/CD setup
   └─ Use: Ein (CI/CD Specialist)
```

---

## Related Documentation

- [Commands Reference](../commands/README.md) - How to invoke agents via slash commands
- [Implementation Workflow](../workflows/implementation-workflow.md) - Agent coordination in implementation
- [Investigation Workflow](../workflows/investigation-workflow.md) - Agent coordination in investigation
- [Best Practices](../best-practices.md) - When to use which patterns

---

**Trinity Method SDK: 18 specialized agents. One coordinated system. Zero compromises on quality.**
