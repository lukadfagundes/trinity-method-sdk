# Testing Strategy & CI/CD Integration Guide

**Trinity Method SDK v2.0 Testing Philosophy and CI/CD Integration**
**Last Updated:** 2025-11-05

---

## Overview

Trinity Method SDK enforces quality through systematic testing and automated CI/CD integration. This guide covers testing strategy, BAS quality gates, and CI/CD pipeline integration with Trinity Method workflows.

---

## Testing Philosophy

### The Trinity Testing Principles

**1. Tests Are Not Optional**
- Coverage threshold: ≥80% (enforced by BAS Phase 5)
- No code ships without tests
- Tests document expected behavior

**2. TDD Is The Default**
- RED: Write failing test first
- GREEN: Minimal code to pass
- REFACTOR: Clean code while tests pass
- KIL agent enforces this cycle

**3. Tests Run Continuously**
- After every code change (BAS Phase 4)
- On every commit (pre-commit hook)
- On every PR (CI pipeline)
- Before every deployment

**4. Test Failure Blocks Progress**
- BAS Quality Gate fails if tests fail
- No merge if tests fail
- No deployment if tests fail

---

## Testing Strategy by Scale

### Small Scale (0-4 hours)

**Testing Requirements:**
```yaml
Unit Tests: Required
  - Test each function/method
  - Coverage: ≥80%

Integration Tests: Optional
  - Only if multiple components interact

E2E Tests: Not required
  - Feature is self-contained

Performance Tests: Not required
  - Unless performance-critical
```

**Example:**
```typescript
// Feature: Add pagination helper utility

describe('PaginationHelper', () => {
  describe('calculateSkip', () => {
    it('should calculate skip value correctly', () => {
      expect(calculateSkip(1, 10)).toBe(0);
      expect(calculateSkip(2, 10)).toBe(10);
      expect(calculateSkip(3, 10)).toBe(20);
    });
  });

  describe('validatePaginationOptions', () => {
    it('should throw error for page < 1', () => {
      expect(() => validatePaginationOptions({ page: 0, limit: 10 }))
        .toThrow('Page must be >= 1');
    });

    it('should throw error for limit out of range', () => {
      expect(() => validatePaginationOptions({ page: 1, limit: 101 }))
        .toThrow('Limit must be between 1 and 100');
    });
  });
});
```

---

### Medium Scale (4-16 hours)

**Testing Requirements:**
```yaml
Unit Tests: Required
  - All functions/methods
  - Coverage: ≥80%

Integration Tests: Required
  - Test component interactions
  - Test API endpoints
  - Test database operations

E2E Tests: Optional
  - Critical user workflows only

Performance Tests: Required
  - Baseline comparison
  - Response time validation
```

**Example:**
```typescript
// Feature: User list pagination

// Unit tests: PaginationHelper utility
describe('PaginationHelper', () => { /* ... */ });

// Integration tests: Service layer
describe('UserService.listUsers', () => {
  beforeEach(async () => {
    await db.users.deleteMany();
    await db.users.insertMany(createMockUsers(25));
  });

  it('should return paginated results', async () => {
    const result = await userService.listUsers({ page: 1, limit: 10 });

    expect(result.data).toHaveLength(10);
    expect(result.pagination.total).toBe(25);
    expect(result.pagination.hasMore).toBe(true);
  });

  it('should return correct page 2', async () => {
    const result = await userService.listUsers({ page: 2, limit: 10 });

    expect(result.data).toHaveLength(10);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.hasMore).toBe(true);
  });

  it('should handle last page correctly', async () => {
    const result = await userService.listUsers({ page: 3, limit: 10 });

    expect(result.data).toHaveLength(5);
    expect(result.pagination.hasMore).toBe(false);
  });
});

// E2E tests: API endpoint
describe('GET /api/users (E2E)', () => {
  it('should return paginated users', async () => {
    const response = await request(app)
      .get('/api/users?page=1&limit=10')
      .expect(200);

    expect(response.body.data).toHaveLength(10);
    expect(response.body.pagination.total).toBe(25);
  });
});

// Performance tests
describe('Performance: User list pagination', () => {
  it('should respond within 200ms (p95)', async () => {
    const times = [];

    for (let i = 0; i < 100; i++) {
      const start = Date.now();
      await userService.listUsers({ page: 1, limit: 10 });
      times.push(Date.now() - start);
    }

    const p95 = calculatePercentile(times, 95);
    expect(p95).toBeLessThan(200);
  });
});
```

---

### Large Scale (16+ hours)

**Testing Requirements:**
```yaml
Unit Tests: Required
  - All functions/methods
  - Coverage: ≥80%
  - Edge cases thoroughly tested

Integration Tests: Required
  - All component interactions
  - All API endpoints
  - Database operations
  - External service mocks

E2E Tests: Required
  - All critical user workflows
  - Happy path + error scenarios

Performance Tests: Required
  - Baseline comparison
  - Load testing
  - Stress testing
  - Regression detection

Security Tests: Required
  - Input validation
  - Authorization checks
  - SQL injection prevention
  - XSS prevention
```

---

## BAS Quality Gates and Testing

### BAS 6-Phase Quality Gate

**Phase 4: Testing**
```bash
BAS Phase 4: Testing
  - Running tests: npm test
  - ✓ 127 tests passed
  - ✓ 0 tests failed
  - ✓ Test suite execution: 12.3s
```

**If tests fail:**
```bash
BAS Phase 4: Testing
  - Running tests: npm test
  - ✓ 125 tests passed
  - ❌ 2 tests failed
  - Test failures:
      • UserService.listUsers: Expected 10, received 25
      • UserController.getUsers: 500 Internal Server Error

🚫 Quality Gate FAILED - Fix test failures before proceeding
```

**Phase 5: Coverage**
```bash
BAS Phase 5: Coverage
  - Running coverage: npm run test:coverage
  - Overall coverage: 94.2%
  - New code coverage: 100%
  - Threshold: 80%
  - ✓ Coverage requirements met
```

**If coverage below threshold:**
```bash
BAS Phase 5: Coverage
  - Overall coverage: 74.3%
  - Threshold: 80%
  - ❌ Coverage below threshold

Missing coverage:
  - src/services/PaginationHelper.ts: 45% (needs tests)
  - src/utils/validation.ts: 0% (no tests)

🚫 Quality Gate FAILED - Add tests to reach 80% coverage
```

---

## CI/CD Pipeline Integration

### GitHub Actions Integration

**Trinity Quality Gates Workflow:**

```yaml
# .github/workflows/trinity-quality.yml
name: Trinity Quality Gates

on:
  push:
    branches: [main, develop, 'feature/**']
  pull_request:
    branches: [main, develop]

jobs:
  trinity-quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      # BAS Phase 1: Linting
      - name: BAS Phase 1 - Linting
        run: npm run lint

      # BAS Phase 3: Build
      - name: BAS Phase 3 - Build
        run: npm run build

      # BAS Phase 4: Testing
      - name: BAS Phase 4 - Testing
        run: npm test

      # BAS Phase 5: Coverage
      - name: BAS Phase 5 - Coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json

      # BAS Phase 6: Best Practices (custom checks)
      - name: BAS Phase 6 - Best Practices
        run: |
          # Check for console.log in production code
          if grep -r "console\.log" src/ --exclude-dir=__tests__; then
            echo "❌ console.log found in production code"
            exit 1
          fi

          # Check coverage threshold
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "❌ Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi

          echo "✅ Best practices checks passed"
```

---

### GitLab CI Integration

**Trinity Quality Gates:**

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - build
  - test
  - audit

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

# BAS Phase 1: Linting
lint:
  stage: lint
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
  only:
    - merge_requests
    - main
    - develop

# BAS Phase 3: Build
build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 day

# BAS Phase 4 & 5: Testing + Coverage
test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run test:coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

# JUNO Audit (Large scale only)
audit:
  stage: audit
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm audit --audit-level=moderate
    - npx trinity audit
  only:
    - main
    - /^release\/.*$/
  artifacts:
    paths:
      - trinity/audits/
```

---

### Pre-commit Hooks Integration

**Trinity pre-commit configuration:**

```yaml
# .pre-commit-config.yaml
repos:
  # ESLint
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.52.0
    hooks:
      - id: eslint
        files: \.(js|jsx|ts|tsx)$
        args: ['--fix']
        additional_dependencies:
          - eslint@^8.52.0
          - '@typescript-eslint/eslint-plugin@^6.10.0'
          - '@typescript-eslint/parser@^6.10.0'

  # Prettier
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.0.3
    hooks:
      - id: prettier
        files: \.(js|jsx|ts|tsx|json|md)$

  # TypeScript type check
  - repo: local
    hooks:
      - id: tsc
        name: TypeScript type check
        entry: npx tsc --noEmit
        language: system
        types: [typescript]
        pass_filenames: false

  # Run tests (fast subset)
  - repo: local
    hooks:
      - id: test-changed
        name: Run tests for changed files
        entry: npm run test:changed
        language: system
        pass_filenames: false
        stages: [commit]

  # Check coverage
  - repo: local
    hooks:
      - id: coverage-check
        name: Check test coverage threshold
        entry: bash -c 'npm run test:coverage && node scripts/check-coverage.js'
        language: system
        pass_filenames: false
        stages: [push]
```

---

## Testing Patterns and Best Practices

### Pattern 1: Arrange-Act-Assert (AAA)

```typescript
describe('UserService.createUser', () => {
  it('should create user with hashed password', async () => {
    // Arrange: Set up test data
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    // Act: Execute the operation
    const user = await userService.createUser(userData);

    // Assert: Verify the outcome
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.password).not.toBe('password123'); // Should be hashed
    expect(await bcrypt.compare('password123', user.password)).toBe(true);
  });
});
```

---

### Pattern 2: Test Isolation

```typescript
describe('UserService', () => {
  beforeEach(async () => {
    // Clean database before each test
    await db.users.deleteMany();
  });

  afterEach(async () => {
    // Clean up after each test
    await db.users.deleteMany();
  });

  it('test 1: should create user', async () => {
    // This test starts with empty database
  });

  it('test 2: should find user by email', async () => {
    // This test also starts with empty database (isolated from test 1)
  });
});
```

---

### Pattern 3: Mock External Dependencies

```typescript
import { EmailService } from '../services/EmailService';

jest.mock('../services/EmailService');

describe('UserController.register', () => {
  it('should send welcome email after registration', async () => {
    // Mock external email service
    const mockSendEmail = jest.fn().mockResolvedValue(true);
    (EmailService.prototype.sendEmail as jest.Mock) = mockSendEmail;

    // Register user
    const response = await request(app)
      .post('/api/register')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(201);

    // Verify email was sent
    expect(mockSendEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Welcome!',
      template: 'welcome'
    });
  });
});
```

---

### Pattern 4: Parameterized Tests

```typescript
describe('PaginationHelper.calculateSkip', () => {
  it.each([
    [1, 10, 0],
    [2, 10, 10],
    [3, 10, 20],
    [1, 25, 0],
    [2, 25, 25],
    [5, 10, 40]
  ])('page %i, limit %i should return skip %i', (page, limit, expectedSkip) => {
    expect(calculateSkip(page, limit)).toBe(expectedSkip);
  });
});
```

---

## Performance Testing

### Baseline Establishment

```typescript
// tests/performance/user-list.perf.ts
import { PerformanceTracker } from '@trinity-method/performance';

describe('Performance: User list pagination', () => {
  const tracker = new PerformanceTracker();

  beforeAll(async () => {
    // Load baseline from BAS
    await tracker.loadBaseline('user-list-pagination');
  });

  it('should meet response time targets', async () => {
    const times = [];

    // Run 100 iterations
    for (let i = 0; i < 100; i++) {
      const start = performance.now();
      await userService.listUsers({ page: 1, limit: 10 });
      times.push(performance.now() - start);
    }

    const metrics = tracker.analyze(times);

    // Compare to baseline
    expect(metrics.p50).toBeLessThan(50); // median < 50ms
    expect(metrics.p95).toBeLessThan(200); // p95 < 200ms
    expect(metrics.p99).toBeLessThan(500); // p99 < 500ms

    // Check for regression
    const regression = tracker.compareToBaseline(metrics);
    expect(regression.percentChange).toBeLessThan(10); // < 10% regression
  });

  afterAll(async () => {
    // Update baseline if performance improved
    await tracker.updateBaselineIfImproved();
  });
});
```

---

## Related Documentation

- [Implementation Workflow](../workflows/implementation-workflow.md) - TDD cycle with KIL
- [Audit Workflow](../workflows/audit-workflow.md) - JUNO comprehensive audits
- [Best Practices](../best-practices.md) - Testing patterns
- [Session Workflow](../workflows/session-workflow.md) - Testing in session context

---

**Trinity Method SDK: Test systematically. Ship confidently. Maintain quality.**
