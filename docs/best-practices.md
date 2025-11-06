# Best Practices & Patterns

**Trinity Method SDK v2.0 - Battle-Tested Development Wisdom**
**Last Updated:** 2025-11-05

---

## Table of Contents

1. [Overview](#overview)
2. [Coding Principles](#coding-principles)
3. [Testing Patterns](#testing-patterns)
4. [AI Development Practices](#ai-development-practices)
5. [Investigation Patterns](#investigation-patterns)
6. [Performance Optimization](#performance-optimization)
7. [Security Best Practices](#security-best-practices)
8. [Common Anti-Patterns](#common-anti-patterns)
9. [Pattern Library](#pattern-library)

---

## Overview

This guide consolidates **battle-tested wisdom** from Trinity Method v7.0 and Trinity SDK v2.0 practical implementations. Each practice includes rationale, examples, and when to apply it.

### How to Use This Guide

**For Developers:**
- Read before starting new features
- Reference during code review
- Consult when encountering issues

**For Teams:**
- Use in onboarding
- Reference in code review checklist
- Update with team-specific patterns

**For AI Agents:**
- ALY references during investigation
- ROR applies in Design Docs
- DRA validates in code reviews
- URO uses during refactoring

---

## Coding Principles

### Principle 1: Investigation Before Implementation

**The Rule:** Never write code without investigation.

**Why:**
- Prevents solving wrong problems
- Identifies existing solutions
- Reveals dependencies and constraints
- Establishes success criteria

**How (SDK):**
```typescript
// ❌ Bad: Jump to implementation
User: "Add pagination"
Developer: *starts coding*

// ✅ Good: Investigate first
User: "Add pagination"
Developer: "Please review .claude/agents/leadership/aly-cto.md to
           investigate pagination requirements for /api/users"
ALY: Investigates → Evidence → Design → Implementation
```

**When to Apply:** **Always** (The Fundamental Law)

**Exceptions:** None (even "simple" bugs need investigation)

---

### Principle 2: Functions ≤ 2 Parameters

**The Rule:** Functions should have at most 2 parameters.

**Why:**
- Easier to understand
- Easier to test
- Easier to change
- Forces good design (object parameters)

**How:**
```typescript
// ❌ Bad: Too many parameters
function createUser(
  name: string,
  email: string,
  role: string,
  department: string,
  manager: string,
  startDate: Date
) {
  // ...
}

// ✅ Good: Object parameter
interface CreateUserInput {
  name: string;
  email: string;
  role: string;
  department: string;
  manager: string;
  startDate: Date;
}

function createUser(input: CreateUserInput) {
  // Easy to extend, easy to test, easy to document
}

// ✅ Also Good: 2 or fewer primitives
function calculateDiscount(price: number, discountRate: number): number {
  return price * (1 - discountRate);
}
```

**When to Apply:** All function definitions

**Exceptions:** Rare (utility functions like `Math.max(a, b, c)`)

**SDK Enforcement:** DRA validates this in code reviews

---

### Principle 3: Function Length < 200 Lines

**The Rule:** Functions should be under 200 lines.

**Why:**
- Easier to understand at a glance
- Easier to test
- Indicates single responsibility
- Easier to debug

**How:**
```typescript
// ❌ Bad: 300-line function doing everything
async function processOrder(orderId: string) {
  // Validate order (50 lines)
  // Calculate total (40 lines)
  // Process payment (60 lines)
  // Send email (40 lines)
  // Update inventory (50 lines)
  // Log analytics (30 lines)
  // Update customer record (30 lines)
}

// ✅ Good: Extracted functions
async function processOrder(orderId: string): Promise<ProcessedOrder> {
  const order = await validateOrder(orderId);
  const total = calculateOrderTotal(order);
  const payment = await processPayment(order, total);
  await sendConfirmationEmail(order, payment);
  await updateInventory(order.items);
  logOrderAnalytics(order, payment);
  await updateCustomerHistory(order.customerId, order);

  return { order, payment };
}
// Each extracted function is <50 lines, focused, testable
```

**When to Apply:** All function definitions

**Exceptions:** Generated code, complex algorithms (with comments)

**SDK Enforcement:** DRA validates, URO refactors if exceeded

---

### Principle 4: Nesting Depth ≤ 4 Levels

**The Rule:** Code should not nest deeper than 4 levels.

**Why:**
- Easier to follow logic
- Reduces cognitive load
- Indicates complex logic that should be extracted
- Improves testability

**How:**
```typescript
// ❌ Bad: 6 levels of nesting
function processData(data: any[]) {
  if (data) {
    for (const item of data) {
      if (item.isValid) {
        for (const subItem of item.children) {
          if (subItem.isActive) {
            for (const prop of subItem.properties) {
              if (prop.needsUpdate) {
                // Level 6 - too deep!
                updateProperty(prop);
              }
            }
          }
        }
      }
    }
  }
}

// ✅ Good: Guard clauses + extraction
function processData(data: any[]): void {
  if (!data) return;  // Guard clause

  for (const item of data) {
    processItem(item);
  }
}

function processItem(item: any): void {
  if (!item.isValid) return;  // Guard clause

  for (const subItem of item.children) {
    processSubItem(subItem);
  }
}

function processSubItem(subItem: any): void {
  if (!subItem.isActive) return;  // Guard clause

  const propsNeedingUpdate = subItem.properties.filter(p => p.needsUpdate);
  propsNeedingUpdate.forEach(updateProperty);
}
// Max nesting: 2 levels, much clearer
```

**When to Apply:** All code with conditional/loop nesting

**Exceptions:** Rare (complex state machines with comments)

**SDK Enforcement:** DRA validates, URO refactors if exceeded

---

### Principle 5: Async Functions Must Have Error Handling

**The Rule:** All async functions must wrap operations in try-catch.

**Why:**
- Prevents unhandled promise rejections
- Provides context for errors
- Enables proper error recovery
- Required for production stability

**How:**
```typescript
// ❌ Bad: No error handling
async function getUser(userId: string): Promise<User> {
  const user = await db.users.findById(userId);
  return user;
}
// Throws unhandled error if DB fails

// ✅ Good: Comprehensive error handling
async function getUser(userId: string): Promise<User> {
  try {
    const user = await db.users.findById(userId);

    if (!user) {
      throw new NotFoundError(`User ${userId} not found`);
    }

    return user;

  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;  // Re-throw expected errors
    }

    // Log and wrap unexpected errors
    logger.error('Failed to get user', {
      userId,
      error: (error as Error).message,
      stack: (error as Error).stack
    });

    throw new DatabaseError(
      `Failed to retrieve user ${userId}`,
      { cause: error }
    );
  }
}
```

**When to Apply:** **All** async functions

**Exceptions:** None (even simple async functions)

**SDK Enforcement:** DRA validates, BAS Phase 6 checks

---

### Principle 6: No Magic Numbers

**The Rule:** Extract hardcoded numbers to named constants.

**Why:**
- Self-documenting code
- Easier to change
- Reveals business rules
- Prevents typo bugs

**How:**
```typescript
// ❌ Bad: Magic numbers
function processOrders(orders: Order[]) {
  const recentOrders = orders.filter(o =>
    Date.now() - o.createdAt < 86400000  // What is this?
  );

  const largeOrders = orders.filter(o =>
    o.total > 1000  // Why 1000?
  );
}

// ✅ Good: Named constants
const MILLISECONDS_PER_DAY = 86400000;
const LARGE_ORDER_THRESHOLD = 1000;  // USD

function processOrders(orders: Order[]) {
  const recentOrders = orders.filter(o =>
    Date.now() - o.createdAt < MILLISECONDS_PER_DAY
  );

  const largeOrders = orders.filter(o =>
    o.total > LARGE_ORDER_THRESHOLD
  );
}

// ✅ Even Better: Configuration object
const OrderConfig = {
  RECENT_THRESHOLD_MS: 86400000,  // 24 hours
  LARGE_ORDER_THRESHOLD_USD: 1000,
  MAX_ITEMS_PER_ORDER: 100,
  DEFAULT_PAGE_SIZE: 20
} as const;
```

**When to Apply:** All hardcoded numbers except 0, 1, -1

**Exceptions:** Array indices, loop counters

**SDK Enforcement:** ESLint rule (no-magic-numbers)

---

### Principle 7: DRY (Don't Repeat Yourself)

**The Rule:** Don't duplicate code, extract to functions/modules.

**Why:**
- Single source of truth
- Easier to maintain
- Consistent behavior
- Reduces bugs

**How:**
```typescript
// ❌ Bad: Duplicated validation logic
function createUser(input: CreateUserInput) {
  if (!input.email.includes('@')) {
    throw new Error('Invalid email');
  }
  if (input.email.length > 255) {
    throw new Error('Email too long');
  }
  // ... create user
}

function updateUserEmail(userId: string, email: string) {
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
  if (email.length > 255) {
    throw new Error('Email too long');
  }
  // ... update email
}

// ✅ Good: Extracted validation
function validateEmail(email: string): void {
  if (!email.includes('@')) {
    throw new ValidationError('Email must contain @');
  }
  if (email.length > 255) {
    throw new ValidationError('Email must be ≤255 characters');
  }
}

function createUser(input: CreateUserInput) {
  validateEmail(input.email);
  // ... create user
}

function updateUserEmail(userId: string, email: string) {
  validateEmail(email);
  // ... update email
}
```

**When to Apply:** Code duplicated 2+ times

**Exceptions:** Genuinely different logic that happens to look similar

**SDK Enforcement:** URO identifies and refactors duplication

---

## Testing Patterns

### Pattern 1: TDD (Test-Driven Development)

**The Pattern:** Write test first, then implementation.

**Why:**
- Ensures testability
- Clarifies requirements
- Prevents over-engineering
- Provides instant feedback

**How (RED-GREEN-REFACTOR):**
```typescript
// RED: Write failing test
describe('getPaginatedUsers', () => {
  it('should return 20 users on page 1', async () => {
    // Arrange
    await seedDatabase(100); // 100 users in DB

    // Act
    const result = await getPaginatedUsers(1, 20);

    // Assert
    expect(result.data).toHaveLength(20);
    expect(result.pagination.total).toBe(100);
  });
});
// Run: npm test → ❌ FAIL (function doesn't exist)

// GREEN: Make test pass (minimal implementation)
async function getPaginatedUsers(page: number, limit: number) {
  const users = await db.users.limit(limit).offset((page - 1) * limit);
  const total = await db.users.count();
  return {
    data: users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}
// Run: npm test → ✅ PASS

// REFACTOR: Improve implementation
async function getPaginatedUsers(
  page: number,
  limit: number
): Promise<PaginatedResponse<User>> {
  validatePaginationParams(page, limit);

  const [users, total] = await Promise.all([
    db.users
      .select('id', 'name', 'email', 'role')  // Only needed fields
      .limit(limit)
      .offset((page - 1) * limit),
    db.users.count()
  ]);

  return createPaginatedResponse(users, page, limit, total);
}
// Run: npm test → ✅ PASS (still works after refactor)
```

**When to Apply:** All new features, bug fixes

**Exceptions:** Exploratory spikes (then throw away and TDD)

**SDK Enforcement:** KIL implements TDD, BAS validates tests exist

---

### Pattern 2: AAA (Arrange-Act-Assert)

**The Pattern:** Structure tests with clear phases.

**Why:**
- Easier to read
- Easier to debug
- Self-documenting
- Consistent structure

**How:**
```typescript
// ❌ Bad: Unclear test structure
it('should work', async () => {
  const result = await someFunction(await setup(), 5, true);
  expect(result.value).toBe(10);
  expect(result.valid).toBe(true);
});

// ✅ Good: Clear AAA structure
it('should calculate discount for valid orders', async () => {
  // Arrange: Setup test data
  const order = {
    items: [
      { price: 100, quantity: 2 },  // $200
      { price: 50, quantity: 1 }    // $50
    ],
    customerId: 'customer-123'
  };
  const discountRate = 0.10;  // 10% discount

  // Act: Execute function under test
  const result = await calculateOrderTotal(order, discountRate);

  // Assert: Verify results
  expect(result.subtotal).toBe(250);
  expect(result.discount).toBe(25);
  expect(result.total).toBe(225);
});
```

**When to Apply:** All tests

**Exceptions:** None

**SDK Enforcement:** KIL follows this pattern automatically

---

### Pattern 3: Test Coverage ≥80%

**The Pattern:** Maintain minimum 80% test coverage.

**Why:**
- Ensures most code is tested
- Catches regressions
- Encourages testable design
- Required for confidence in changes

**How:**
```bash
# Check coverage
npm run test:coverage

# View coverage report
open coverage/index.html

# BAS Phase 5 enforces this
```

**What to Cover:**
```yaml
Must Cover (100%):
  - Public APIs
  - Business logic
  - Error handling
  - Edge cases

Should Cover (80%+):
  - Helper functions
  - Data transformations
  - Validation logic

Can Skip:
  - Generated code
  - Third-party library wrappers (if thin)
  - Pure UI components (test with E2E instead)
```

**When to Apply:** All code

**Exceptions:** Generated code, deprecated code

**SDK Enforcement:** BAS Phase 5 blocks commits <80%

---

### Pattern 4: Mock External Dependencies

**The Pattern:** Mock APIs, databases, external services in unit tests.

**Why:**
- Tests run faster
- Tests are deterministic
- No external service dependency
- Can test error scenarios

**How:**
```typescript
// ❌ Bad: Real database calls in unit tests
describe('UserService', () => {
  it('should get user by ID', async () => {
    const user = await userService.getById('user-123');
    // Depends on real database
    // Slow, flaky, requires seeding
  });
});

// ✅ Good: Mocked dependencies
describe('UserService', () => {
  let userService: UserService;
  let mockDb: jest.Mocked<Database>;

  beforeEach(() => {
    mockDb = {
      users: {
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      }
    } as any;

    userService = new UserService(mockDb);
  });

  it('should get user by ID', async () => {
    // Arrange: Setup mock
    const expectedUser = { id: 'user-123', name: 'John' };
    mockDb.users.findById.mockResolvedValue(expectedUser);

    // Act
    const user = await userService.getById('user-123');

    // Assert
    expect(user).toEqual(expectedUser);
    expect(mockDb.users.findById).toHaveBeenCalledWith('user-123');
  });
});
```

**When to Apply:** Unit tests

**Don't Mock:** Integration tests, E2E tests

**SDK Enforcement:** Testing guidelines recommend this

---

## AI Development Practices

### Practice 1: Let ALY Determine Scale

**The Practice:** Always let ALY analyze scale before implementation.

**Why:**
- Appropriate workflow for task size
- Prevents over-engineering simple tasks
- Ensures planning for complex tasks
- Optimizes development time

**How:**
```typescript
// ❌ Bad: Skip scale determination
User: "Implement pagination"
Developer: *starts Medium-scale workflow unnecessarily*

// ✅ Good: Let ALY determine
User: "Investigate and implement pagination for /api/users"
    ↓
ALY: Analyzes task
    - Lines to change: ~50
    - Files affected: 2
    - New features: 1
    - Complexity: Medium
    → Determines MEDIUM scale
    ↓
Triggers appropriate workflow:
    - MON: Requirements (acceptance criteria)
    - ROR: Design Doc (API changes)
    - STOP POINT: User reviews design
    - EUS: Task decomposition (5 tasks)
    - KIL: TDD implementation
    - BAS: Quality gates
    - DRA: Code review
```

**When to Apply:** All implementation requests

**Exceptions:** None

**SDK Enforcement:** ALY always determines scale first

---

### Practice 2: Provide Context in Prompts

**The Practice:** Give agents specific context, not vague requests.

**Why:**
- Better agent understanding
- More accurate investigation
- Faster resolution
- Higher quality output

**How:**
```typescript
// ❌ Bad: Vague prompts
"Make it faster"
"Fix the bug"
"Add pagination"

// ✅ Good: Specific prompts
"Investigate slow response time on /api/users endpoint (currently 2-3 seconds)"

"Investigate TypeError: Cannot read property 'map' of undefined
 in UserList component when API returns null"

"Investigate and implement pagination for /api/users endpoint,
 supporting page and limit query parameters, with pagination metadata
 in response (total count, page count, current page)"
```

**When to Apply:** All agent interactions

**Exceptions:** None

**Result:** Better agent performance, faster completion

---

### Practice 3: Review Stop Points

**The Practice:** Always review and approve at stop points.

**Why:**
- Catch issues before implementation
- Align expectations
- Reduce rework
- Maintain control

**Stop Points by Scale:**
```yaml
Small Scale: 0 stop points
  - Trust automation
  - Review after completion

Medium Scale: 1 stop point
  - STOP: Design approval
  - Prevents architectural misalignment

Large Scale: 4 stop points
  - STOP #1: Requirements review
  - STOP #2: Design approval
  - STOP #3: Plan approval
  - STOP #4: Final review (JUNO audit)
```

**How to Review:**
```typescript
// At stop point
ALY: "Design Doc created. Please review:
      trinity/work-orders/WO-XXX-design-doc.md"
    ↓
User: Reviews design
    - Function signatures look good ✅
    - Error handling comprehensive ✅
    - Concerns: Response format different than expected
    ↓
User: "The response format should be { data, meta } not { data, pagination }.
       Please update design."
    ↓
ROR: Updates Design Doc
    ↓
User: "Approved, proceed with implementation"
```

**When to Apply:** All Medium/Large scale tasks

**Exceptions:** Small scale (no stop points)

---

### Practice 4: Let BAS Enforce Quality

**The Practice:** Don't bypass BAS quality gates.

**Why:**
- Automatic quality enforcement
- Consistent standards
- Catches issues before commit
- No manual checks needed

**How:**
```typescript
// KIL commits code
git commit -m "feat: add pagination"
    ↓
BAS: Automatically triggered
    Phase 1: Linting ✅
    Phase 2: Structure ✅
    Phase 3: Build ✅
    Phase 4: Tests ✅
    Phase 5: Coverage ✅
    Phase 6: Best practices ✅
    ↓
Commit successful

// If any phase fails:
BAS: BLOCKS COMMIT
    Phase 4: ❌ 2 tests failing
    ↓
KIL: Fixes tests
    ↓
BAS: Retries
    Phase 4: ✅ All tests pass
    ↓
Commit successful
```

**When to Apply:** All commits

**Don't:** Skip BAS checks, commit with --no-verify

**SDK Enforcement:** BAS runs automatically after every KIL commit

---

## Investigation Patterns

### Pattern 1: Evidence-Based Decisions

**The Pattern:** Support all decisions with documented evidence.

**Why:**
- Prevents opinion-based decisions
- Enables review and validation
- Teaches future developers
- Justifies approach

**How:**
```markdown
# INVESTIGATION: Add Caching Layer

## Decision: Redis for API response caching

### Evidence Supporting This Decision:

**Performance Evidence:**
- Current: /api/users 1847ms average
- With Redis: 15ms (99% improvement) - benchmark with 100k requests
- Cache hit rate: 85% for 5-minute TTL

**Cost Evidence:**
- Redis hosting: $20/month
- Server costs saved: $200/month (reduced DB load)
- ROI: 900% in first month

**Technical Evidence:**
- Existing Redis expertise on team
- Well-documented libraries
- Easy rollback (feature flag)

**Alternatives Considered:**
1. In-memory caching: Fast but doesn't scale across servers
2. CDN caching: Doesn't work for authenticated endpoints
3. Database query optimization: Already optimized, still slow

### Conclusion:
Redis caching provides best ROI with lowest risk.
```

**When to Apply:** All technical decisions

**Exceptions:** None

**SDK Enforcement:** ALY creates investigation documents automatically

---

### Pattern 2: Root Cause Analysis

**The Pattern:** Always find root cause, don't fix symptoms.

**Why:**
- Prevents recurrence
- Fixes related issues
- Improves understanding
- Creates reusable patterns

**How:**
```markdown
# INVESTIGATION: Users Seeing Duplicate Posts

## Symptom Analysis:
User reports: "I see the same post 2-3 times in my feed"

## Root Cause Investigation:

**Level 1: What we see**
- Duplicate posts in UI

**Level 2: Where it comes from**
- API returns duplicates

**Level 3: Why API returns duplicates**
- Database query returns duplicates

**Level 4: Why database has duplicates**
- Join table lacks unique constraint

**Level 5: ROOT CAUSE**
- Migration 20251103 created post_categories table
- Forgot to add UNIQUE constraint on (post_id, category_id)
- Multiple inserts created duplicates

## Fix Strategy:
1. Immediate: Remove duplicates (data cleanup)
2. Prevent: Add unique constraint
3. Validate: Application-level validation
4. Pattern: Update migration checklist

## Prevention:
- Always add unique constraints on join tables
- Always test migrations with duplicate data
- Add to migration checklist pattern
```

**When to Apply:** All bug investigations

**Don't:** Stop at surface-level symptoms

**SDK Enforcement:** ALY facilitates root cause analysis

---

## Performance Optimization

### Pattern 1: N+1 Query Prevention

**The Pattern:** Use eager loading instead of lazy loading in loops.

**Why:**
- Reduces database queries from N+1 to 1
- 90-95% performance improvement typical
- Lower database load
- Faster response times

**How:**
```typescript
// ❌ Bad: N+1 queries
async function getUsers(): Promise<User[]> {
  const users = await db.users.findMany();  // 1 query

  for (const user of users) {
    user.roles = await db.roles.findMany({  // N queries
      where: { userId: user.id }
    });
  }

  return users;
}
// 1 + N queries (for 100 users = 101 queries)

// ✅ Good: Eager loading (single query)
async function getUsers(): Promise<User[]> {
  const users = await db.users.findMany({
    include: {
      roles: true  // Eager load in single query
    }
  });

  return users;
}
// 1 query (always)
```

**When to Apply:** All collection queries with relations

**Detection:** BAS can detect N+1 patterns

**SDK Pattern:** `trinity/patterns/database/n-plus-one-prevention.md`

---

### Pattern 2: Pagination for Collections

**The Pattern:** Always paginate collections, never return all records.

**Why:**
- Prevents memory exhaustion
- Faster response times
- Better user experience
- Scales to large datasets

**How:**
```typescript
// ❌ Bad: Return all records
async function getUsers(): Promise<User[]> {
  return await db.users.findMany();
  // Returns 10,000+ users, 5+ seconds, 50+ MB
}

// ✅ Good: Paginated response
async function getPaginatedUsers(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<User>> {
  const [users, total] = await Promise.all([
    db.users.limit(limit).offset((page - 1) * limit),
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
// Returns 20 users, <100ms, <1MB
```

**When to Apply:** All collection endpoints

**Default:** 20 items per page

**SDK Pattern:** `trinity/patterns/api/pagination.md`

---

## Security Best Practices

### Practice 1: Input Validation

**The Practice:** Validate all user input before processing.

**Why:**
- Prevents SQL injection
- Prevents XSS attacks
- Prevents data corruption
- Improves error messages

**How:**
```typescript
// ❌ Bad: No validation
async function createUser(name: string, email: string) {
  return await db.users.create({ name, email });
  // SQL injection risk, no validation
}

// ✅ Good: Comprehensive validation
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string()
    .min(1, 'Name required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters'),
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email too long')
});

async function createUser(input: unknown) {
  // Validate and parse
  const validated = CreateUserSchema.parse(input);

  // Safe to use
  return await db.users.create(validated);
}
```

**When to Apply:** All user input

**Tools:** Zod, Joi, class-validator

**SDK Enforcement:** JUNO security audits check validation

---

### Practice 2: Parameterized Queries

**The Practice:** Always use parameterized queries, never string concatenation.

**Why:**
- Prevents SQL injection (most common vulnerability)
- No escaping needed
- Safer and cleaner code

**How:**
```typescript
// ❌ Bad: SQL injection vulnerable
async function getUserByEmail(email: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  return await db.raw(query);
  // Attacker input: email = "' OR '1'='1"
  // Resulting query: SELECT * FROM users WHERE email = '' OR '1'='1'
  // Returns all users!
}

// ✅ Good: Parameterized query
async function getUserByEmail(email: string) {
  return await db.users.findOne({ where: { email } });
  // ORM handles parameterization
  // Safe from injection
}

// ✅ Also Good: Raw queries with parameters
async function getUserByEmail(email: string) {
  const query = 'SELECT * FROM users WHERE email = ?';
  return await db.raw(query, [email]);
  // Database driver handles escaping
}
```

**When to Apply:** All database queries

**Never:** Build SQL strings with concatenation

**SDK Enforcement:** JUNO security audits flag string concatenation

---

## Common Anti-Patterns

### Anti-Pattern 1: God Objects

**The Problem:** Single class/module that does everything.

**Why It's Bad:**
- Impossible to understand
- Impossible to test
- Impossible to maintain
- Violates single responsibility

**How to Fix:**
```typescript
// ❌ Anti-pattern: God object
class UserManager {
  async createUser() { ... }
  async updateUser() { ... }
  async deleteUser() { ... }
  async authenticateUser() { ... }
  async authorizeUser() { ... }
  async sendEmailToUser() { ... }
  async generateUserReport() { ... }
  async validateUserInput() { ... }
  async calculateUserMetrics() { ... }
  // ... 50 more methods
}

// ✅ Solution: Separate concerns
class UserRepository {
  async create() { ... }
  async update() { ... }
  async delete() { ... }
  async findById() { ... }
}

class UserAuthService {
  async authenticate() { ... }
  async authorize() { ... }
}

class UserNotificationService {
  async sendEmail() { ... }
}

class UserReportService {
  async generateReport() { ... }
}
```

**When to Refactor:** Class >500 lines or >20 methods

**SDK Enforcement:** URO identifies and refactors god objects

---

### Anti-Pattern 2: Premature Optimization

**The Problem:** Optimizing before measuring performance.

**Why It's Bad:**
- Wastes time optimizing non-bottlenecks
- Makes code more complex
- No measurable benefit
- Harder to maintain

**How to Avoid:**
```typescript
// ❌ Anti-pattern: Premature optimization
// Developer spends 2 days optimizing this function
async function calculateTotal(items: Item[]): Promise<number> {
  // Complex memoization, caching, parallel processing
  // ... 200 lines of optimization code
}
// Function is called once per request, takes 2ms
// Optimization saved 1ms, not the bottleneck

// ✅ Solution: Measure first, optimize bottlenecks
// 1. Measure with BAS
BAS: /api/users takes 1847ms (bottleneck!)
    - 1423ms in database queries
    - 312ms in serialization
    - 112ms in other operations

// 2. Optimize the bottleneck
// Focus on database queries (N+1 problem)
// Result: 1847ms → 150ms (92% improvement)

// 3. Only then optimize other parts if needed
```

**Trinity Method Rule:** "Investigation before optimization"

**SDK Enforcement:** ALY requires performance baseline before optimization

---

## Pattern Library

The SDK includes a growing pattern library in `trinity/patterns/`:

```
trinity/patterns/
├── api/
│   ├── pagination.md
│   ├── error-responses.md
│   └── authentication.md
├── database/
│   ├── n-plus-one-prevention.md
│   ├── eager-loading.md
│   ├── migration-best-practices.md
│   └── connection-management.md
├── error-handling/
│   ├── null-safety.md
│   ├── async-error-handling.md
│   └── validation-patterns.md
├── performance/
│   ├── caching-strategies.md
│   ├── lazy-loading.md
│   └── query-optimization.md
└── security/
    ├── input-validation.md
    ├── authentication-patterns.md
    └── authorization-patterns.md
```

**Learning System automatically extracts patterns** from successful implementations and suggests them in similar contexts.

---

## Conclusion

These best practices and patterns come from **years of Trinity Method practical application** and **SDK v2.0 agent coordination**.

### Key Takeaways

1. **Investigate before implementing** (always)
2. **Keep functions small** (≤2 params, <200 lines, ≤4 nesting)
3. **Test first** (TDD with ≥80% coverage)
4. **Handle errors** (async functions, try-catch, validation)
5. **Optimize smartly** (measure first, fix bottlenecks)
6. **Learn continuously** (extract patterns, prevent recurrence)

### Using with SDK

- **ALY references** during investigation
- **ROR applies** in Design Docs
- **DRA validates** in code reviews
- **URO uses** during refactoring
- **Learning System extracts** new patterns
- **You benefit** from accumulated wisdom

---

**Trinity Method SDK: Best Practices Enforced, Patterns Accumulated, Quality Guaranteed**

*Learn from the past. Build for the future. Let SDK guide the way.*

---

**Document Version:** 2.0
**SDK Version:** 2.0.0
**Last Updated:** 2025-11-05
**Related Docs:**
- [Investigation-First Complete](./methodology/investigation-first-complete.md)
- [Trinity Framework](./methodology/trinity-framework.md)
- [Crisis Management](./crisis-management.md)
