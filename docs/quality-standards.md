# Trinity Method Quality Standards

**Document Version:** 2.0
**Last Updated:** 2025-11-06
**Status:** Active

---

## Overview

Trinity Method quality standards are **non-negotiable requirements** for all code merged into Trinity-managed projects. These standards are enforced through the 6-phase BAS (Build-Analyze-Structure) quality gate system, which validates every change before it reaches the repository.

### Core Principle

**"Quality is not optional. It is infrastructure."**

Quality in Trinity Method is not dependent on developer discipline or code review catch-all. It is systematically enforced through automated gates that prevent substandard code from ever being committed.

---

## The 6-Phase BAS Quality Gate System

BAS executes after every task completion in the KIL (Task Executor) workflow. All 6 phases must pass before code is considered mergeable.

### Phase 1: Lint

**Purpose:** Enforce code style consistency and catch common errors.

**Tools by Language:**
- **JavaScript/TypeScript:** ESLint with Trinity Method ruleset
- **Python:** Flake8 + Black + isort
- **Rust:** Clippy
- **Go:** golint + go vet
- **Dart/Flutter:** Dart Analyzer

**Failure Conditions:**
- Any ESLint error (warnings allowed with justification)
- Black formatting violations
- Clippy errors (warnings require documentation)
- Import order violations (isort)

**Example ESLint Configuration (Trinity Standard):**

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

**Pass Criteria:**
- Zero linting errors
- Warnings documented with inline comments explaining necessity
- All auto-fixable issues resolved via `npm run lint:fix` or `black .`

---

### Phase 2: Structure

**Purpose:** Validate file organization, naming conventions, and architectural compliance.

**Checks:**
1. **File Naming:**
   - PascalCase for classes/components: `UserController.ts`, `AuthService.ts`
   - camelCase for utilities: `formatDate.js`, `validateEmail.js`
   - kebab-case for CSS/styles: `button-primary.css`, `modal-overlay.scss`
   - UPPER_CASE for constants files: `API_KEYS.ts`, `CONFIG.ts`

2. **Directory Structure:**
   - Source code in `src/` or `lib/`
   - Tests colocated or in `__tests__/` directories
   - Shared types in `src/shared/types/`
   - Utilities in `src/utils/`
   - No files >3000 lines (complexity threshold)

3. **Import Organization:**
   - External imports first
   - Internal imports second
   - Type imports last
   - Alphabetically sorted within groups

**Example (TypeScript):**

```typescript
// ✅ CORRECT: Organized imports
import { program } from 'commander';        // External
import chalk from 'chalk';                  // External
import ora from 'ora';                      // External

import { deploy } from './commands/deploy.js';    // Internal
import { LearningDataStore } from './learning/LearningDataStore.js';  // Internal

import type { DeployOptions } from './types.js';  // Types

// ❌ INCORRECT: Mixed imports
import { deploy } from './commands/deploy.js';
import chalk from 'chalk';
import type { DeployOptions } from './types.js';
import { program } from 'commander';
```

**Failure Conditions:**
- Files exceeding line count thresholds (500 warning, 1000 error, 3000 hard stop)
- Incorrect naming conventions
- Circular dependencies detected
- Missing index.ts barrel exports for public APIs

**Pass Criteria:**
- All files follow naming conventions
- Directory structure matches Trinity template
- No circular dependencies
- Complexity metrics within acceptable ranges

---

### Phase 3: Build

**Purpose:** Ensure code compiles without errors and type safety is maintained.

**Tools by Language:**
- **TypeScript:** `tsc --noEmit` (type checking only)
- **Rust:** `cargo build --release`
- **Go:** `go build ./...`
- **Java:** `mvn compile`

**TypeScript Strict Mode Requirements:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true
  }
}
```

**Common Build Failures:**

1. **Type Errors:**
```typescript
// ❌ INCORRECT: Implicit any
function processData(data) {
  return data.map(item => item.value);
}

// ✅ CORRECT: Explicit types
function processData(data: Array<{ value: number }>): number[] {
  return data.map(item => item.value);
}
```

2. **Missing Return Types:**
```typescript
// ❌ INCORRECT: Inferred return type
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// ✅ CORRECT: Explicit return type
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

**Failure Conditions:**
- Any compilation error
- Type inference failures
- Missing type definitions
- Unused imports/variables

**Pass Criteria:**
- Clean compilation with zero errors
- All types explicitly declared (no implicit any)
- No unused code (unless marked with @ts-ignore with justification)

---

### Phase 4: Test

**Purpose:** Validate functionality through automated tests.

**Frameworks by Language:**
- **JavaScript/TypeScript:** Jest
- **Python:** pytest
- **Rust:** cargo test
- **Go:** go test

**Test Coverage Requirements:**

| Code Type | Minimum Coverage |
|-----------|-----------------|
| Critical paths (auth, payments, data integrity) | 90% |
| Business logic | 80% |
| Utilities | 70% |
| UI components | 60% |

**Test Organization:**

```
src/
├── agents/
│   ├── TAN.ts
│   └── __tests__/
│       └── TAN.test.ts
├── cache/
│   ├── AdvancedCacheManager.ts
│   └── __tests__/
│       └── AdvancedCacheManager.test.ts
```

**Test Structure (Jest):**

```typescript
describe('AdvancedCacheManager', () => {
  let cache: AdvancedCacheManager;

  beforeEach(() => {
    cache = new AdvancedCacheManager();
  });

  afterEach(async () => {
    await cache.clear();
  });

  describe('get()', () => {
    it('should return cached value when key exists', async () => {
      // Arrange
      const key = 'test-key';
      const value = { data: 'test' };
      await cache.set(key, value);

      // Act
      const result = await cache.get(key);

      // Assert
      expect(result).toEqual(value);
    });

    it('should return undefined when key does not exist', async () => {
      // Arrange
      const key = 'nonexistent-key';

      // Act
      const result = await cache.get(key);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return undefined when entry is expired', async () => {
      // Arrange
      const key = 'expired-key';
      const value = { data: 'test' };
      await cache.set(key, value, 100); // 100ms TTL
      await new Promise(resolve => setTimeout(resolve, 150));

      // Act
      const result = await cache.get(key);

      // Assert
      expect(result).toBeUndefined();
    });
  });
});
```

**Failure Conditions:**
- Any test failure
- Coverage below threshold for critical paths
- Tests disabled without justification
- Flaky tests (non-deterministic failures)

**Pass Criteria:**
- All tests pass
- Coverage meets minimum thresholds
- No skipped tests without documented reason
- Tests follow Arrange-Act-Assert pattern

---

### Phase 5: Coverage (≥80%)

**Purpose:** Ensure sufficient test coverage to catch regressions.

**Threshold Enforcement:**

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

**Coverage Report Example:**

```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   87.23 |    82.45 |   89.12 |   86.89 |
 agents/                  |   92.15 |    88.32 |   94.44 |   91.78 |
  TAN.ts                  |   95.23 |    90.12 |   96.55 |   94.87 |
  ZEN.ts                  |   89.45 |    86.78 |   92.31 |   88.92 |
 cache/                   |   84.32 |    79.45 |   86.21 |   83.67 |
  AdvancedCacheManager.ts |   88.92 |    82.13 |   90.00 |   87.45 |
  L1Cache.ts              |   79.67 |    76.32 |   82.35 |   78.91 | ⚠️
```

**Coverage Exemptions:**

Certain code can be exempted with justification:

```typescript
/* istanbul ignore next - Error handling for edge case */
if (process.env.NODE_ENV === 'test') {
  throw new Error('Should not reach here in tests');
}
```

**Failure Conditions:**
- Coverage below 80% globally
- Coverage below 90% for critical paths
- Exemptions without proper documentation
- Coverage artificially inflated (empty test blocks)

**Pass Criteria:**
- Global coverage ≥80%
- Critical path coverage ≥90%
- All exemptions documented
- Coverage trends upward (not degrading)

---

### Phase 6: Best Practices

**Purpose:** Enforce security, performance, and accessibility standards.

**Security Checks:**

1. **No Hardcoded Secrets:**
```typescript
// ❌ INCORRECT: Hardcoded API key
const API_KEY = 'sk-1234567890abcdef';

// ✅ CORRECT: Environment variable
const API_KEY = process.env.API_KEY;
if (!API_KEY) throw new Error('API_KEY not configured');
```

2. **Input Validation:**
```typescript
// ❌ INCORRECT: No validation
function processUserInput(input: string) {
  return eval(input); // CRITICAL SECURITY VIOLATION
}

// ✅ CORRECT: Validation and sanitization
import { z } from 'zod';

const userInputSchema = z.string().max(1000).regex(/^[a-zA-Z0-9\s]+$/);

function processUserInput(input: string) {
  const validated = userInputSchema.parse(input);
  return validated.toLowerCase();
}
```

3. **SQL Injection Prevention:**
```typescript
// ❌ INCORRECT: String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ CORRECT: Parameterized query
const query = 'SELECT * FROM users WHERE email = ?';
db.execute(query, [email]);
```

**Performance Standards:**

1. **Algorithmic Complexity:**
   - O(1) or O(log n) preferred
   - O(n) acceptable with documentation
   - O(n²) requires justification and optimization plan
   - O(n³) or worse forbidden without architectural review

2. **Memory Management:**
```typescript
// ❌ INCORRECT: Memory leak
let cache = {};
function cacheResult(key, value) {
  cache[key] = value; // Unbounded growth
}

// ✅ CORRECT: LRU cache with limits
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({ max: 1000, ttl: 3600000 });
function cacheResult(key, value) {
  cache.set(key, value);
}
```

3. **Bundle Size (Web):**
   - Main bundle: <500KB (gzipped)
   - Individual chunks: <250KB (gzipped)
   - Third-party dependencies: <50KB per library (justify larger)

**Accessibility Standards (Web/Mobile):**

1. **Semantic HTML:**
```html
<!-- ❌ INCORRECT: Div soup -->
<div class="button" onclick="submit()">Submit</div>

<!-- ✅ CORRECT: Semantic elements -->
<button type="submit" aria-label="Submit form">Submit</button>
```

2. **Keyboard Navigation:**
   - All interactive elements keyboard-accessible (tabindex)
   - Focus indicators visible
   - Logical tab order

3. **Screen Reader Support:**
   - ARIA labels for non-text content
   - Alt text for images
   - Form labels properly associated

**Failure Conditions:**
- Hardcoded secrets detected
- SQL injection vulnerabilities
- XSS attack vectors
- Missing input validation
- O(n²) or worse without justification
- Bundle size exceeds limits
- WCAG 2.1 Level AA violations

**Pass Criteria:**
- No security vulnerabilities
- Performance metrics within acceptable ranges
- Accessibility standards met
- Code review checklist complete

---

## Trinity-Specific Standards

### Module System (ESM Only)

Trinity Method SDK uses **ES Modules exclusively**. CommonJS is not supported.

```typescript
// ✅ CORRECT: ESM imports
import { program } from 'commander';
import fs from 'fs/promises';
import path from 'path';

// ❌ INCORRECT: CommonJS (will break)
const program = require('commander');
const fs = require('fs');
```

**File Extensions:**
- Always include `.js` extension in imports (TypeScript compiles to JS)
- Example: `import { deploy } from './commands/deploy.js';`

### Path Handling (Windows Compatibility)

Always use `path.join()` or `path.resolve()` for file paths:

```typescript
// ✅ CORRECT: Cross-platform
const filePath = path.join(baseDir, 'subdir', 'file.json');

// ❌ INCORRECT: Unix-only (breaks on Windows)
const filePath = `${baseDir}/subdir/file.json`;
```

### Error Handling

Never swallow errors silently:

```typescript
// ❌ INCORRECT: Silent failure
try {
  await riskyOperation();
} catch {
  // Empty catch block
}

// ✅ CORRECT: Contextual error propagation
try {
  await riskyOperation();
} catch (error) {
  throw new CustomError(
    `Failed to execute operation: ${(error as Error).message}`,
    { context: additionalContext }
  );
}
```

### Async/Await (No Callbacks)

Use async/await exclusively. Callbacks are forbidden:

```typescript
// ❌ INCORRECT: Callback-based
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// ✅ CORRECT: Async/await
const data = await fs.readFile(filePath, 'utf8');
console.log(data);
```

---

## Enforcement Mechanisms

### Pre-Commit Hooks

Trinity Method uses Python's `pre-commit` framework for ALL languages:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.50.0
    hooks:
      - id: eslint
        files: \.(js|ts|jsx|tsx)$
        types: [file]

  - repo: https://github.com/psf/black
    rev: 23.9.1
    hooks:
      - id: black
```

Install once per project:
```bash
pip install pre-commit
pre-commit install
```

### CI/CD Integration

BAS gates integrate into CI/CD pipelines via EIN agent:

**GitHub Actions Example:**

```yaml
name: Trinity Quality Gates

on: [push, pull_request]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Phase 1 - Lint
        run: npm run lint

      - name: Phase 2 - Structure
        run: npm run check-structure

      - name: Phase 3 - Build
        run: npm run build

      - name: Phase 4 - Test
        run: npm test

      - name: Phase 5 - Coverage
        run: npm run test:coverage

      - name: Phase 6 - Best Practices
        run: npm run security-audit
```

### DRA Review Standards

After KIL completes implementation and BAS validates quality, DRA (Design Review Agent) performs final compliance check:

1. **Design Doc Adherence:** Implementation matches technical design (ROR output)
2. **Trinity Principle Compliance:** Investigation-first approach followed
3. **Documentation Currency:** ARCHITECTURE.md, ISSUES.md updated
4. **Technical Debt Impact:** New debt quantified and documented

---

## Quality Metrics Dashboard

Trinity Method tracks quality metrics across sessions:

**Technical Debt Baseline:**
- TODO/FIXME/HACK comments: Tracked automatically during deployment
- Console.log statements: Counted and flagged for removal
- File complexity: Files >500, >1000, >3000 lines tracked
- Dependency versions: Outdated dependencies flagged

**Quality Trends:**
- Test coverage over time (should trend upward)
- Linting violations per commit (should trend downward)
- Build failures (should approach zero)
- Security vulnerabilities (zero tolerance)

---

## Appendix A: Common Violations and Fixes

### Violation: Implicit Any

```typescript
// ❌ VIOLATION
function process(data) {
  return data.value;
}

// ✅ FIX
function process(data: { value: number }): number {
  return data.value;
}
```

### Violation: Missing Error Handling

```typescript
// ❌ VIOLATION
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}

// ✅ FIX
async function fetchData(): Promise<Data> {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch data: ${(error as Error).message}`);
  }
}
```

### Violation: Hardcoded Configuration

```typescript
// ❌ VIOLATION
const DATABASE_URL = 'postgresql://localhost:5432/mydb';

// ✅ FIX
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable required');
}
```

---

## Appendix B: Quality Gate Bypass

In rare circumstances, quality gates can be bypassed with documented justification:

```typescript
// BAS-BYPASS: Phase 5 (Coverage)
// Justification: Legacy code refactoring in progress
// Ticket: TRINITY-1234
// Approved by: TechLead
// Expiration: 2025-12-31
/* istanbul ignore next */
function legacyFunction() {
  // ...
}
```

**Bypass Requirements:**
1. Documented justification with ticket reference
2. Technical lead approval
3. Expiration date set
4. Remediation plan in place

**Never Bypass:**
- Phase 1 (Lint) - Code style is non-negotiable
- Phase 3 (Build) - Broken code cannot be merged
- Phase 6 Security Checks - Security violations are critical

---

## Summary

Trinity Method quality standards ensure:
- **Consistency:** Code looks like it was written by one person
- **Safety:** Security vulnerabilities caught before deployment
- **Performance:** Algorithmic complexity and memory usage validated
- **Maintainability:** Tests and documentation prevent regressions
- **Accessibility:** Web/mobile apps usable by everyone

Quality is not optional. It is the infrastructure that makes rapid development sustainable.

---

**Document Owner:** Trinity Method Team
**Review Cycle:** Quarterly
**Last Review:** 2025-11-06
**Next Review:** 2026-02-06
