# Trinity Method Quality Standards

**Trinity Method SDK v2.0 - Systematic Quality Assurance**
**Last Updated:** 2025-11-06

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [The Six Quality Gates (BAS)](#the-six-quality-gates-bas)
3. [Standard 1: Mandatory Debugging](#standard-1-mandatory-debugging)
4. [Standard 2: Zero Console Errors](#standard-2-zero-console-errors)
5. [Standard 3: Test Coverage Requirements](#standard-3-test-coverage-requirements)
6. [Standard 4: Performance Standards](#standard-4-performance-standards)
7. [Standard 5: Documentation Requirements](#standard-5-documentation-requirements)
8. [Standard 6: Code Review Standards](#standard-6-code-review-standards)
9. [Enforcement](#enforcement)
10. [Examples](#examples)
11. [Measuring Quality](#measuring-quality)

---

## Philosophy

### Why Quality Matters in Trinity Method

**Trinity Principle: "Systematic Quality Assurance"**

Quality isn't optional. Quality isn't aspirational. Quality is **systematically enforced** through automated gates that prevent low-quality code from reaching production.

### The Problem with Traditional Quality Approaches

**Traditional Development:**
```
❌ "We value quality" → No enforcement → Quality decays
❌ Manual code reviews → Inconsistent standards → Technical debt
❌ Optional testing → Coverage drops → Regressions increase
❌ "Move fast and break things" → Fast breaks, slow fixes
```

**The Cost:**
- Technical debt accumulates invisibly
- Bugs reach production
- Refactoring becomes risky
- Developer velocity decreases over time
- User trust erodes with each bug

### The Trinity Method Approach

**Systematic Quality Assurance:**
```
✅ Explicit quality standards → BAS enforcement → Quality compounds
✅ Automated quality gates → Consistent standards → Zero technical debt
✅ Mandatory testing → ≥80% coverage → Regressions caught early
✅ "Move fast with confidence" → Fast shipping, zero breaks
```

**The Transformation:**
- Quality gates prevent technical debt before it's created
- Bugs caught in development, not production
- Refactoring is safe and encouraged
- Developer velocity increases over time
- User trust grows with each release

### Quality as Investigation

**Trinity Method treats quality as continuous investigation:**

1. **Investigation Before Implementation** - Understand requirements before coding
2. **Evidence-Based Testing** - Tests are evidence that code works
3. **Systematic Review** - DRA validates against design docs
4. **Continuous Measurement** - Performance tracking across sessions
5. **Knowledge Preservation** - Quality patterns learned and reused

**Quality is not what you achieve once. Quality is what you systematically enforce forever.**

---

## The Six Quality Gates (BAS)

BAS (Quality Gate Agent) enforces six mandatory phases after every implementation:

### Gate Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   BAS 6-Phase Quality Gate                  │
├─────────────────────────────────────────────────────────────┤
│ Phase 1: Linting       → Code style and conventions        │
│ Phase 2: Structure     → Architecture and organization      │
│ Phase 3: Build         → Compilation and type safety        │
│ Phase 4: Testing       → Functional correctness             │
│ Phase 5: Coverage      → Test comprehensiveness (≥80%)      │
│ Phase 6: Review        → Design doc compliance             │
└─────────────────────────────────────────────────────────────┘
```

### Phase 1: Linting

**What:** Code style, formatting, and convention enforcement.

**Tools:**
- **Node.js/React:** ESLint + Prettier
- **Python:** Black + Flake8 + isort
- **Rust:** Clippy + Rustfmt
- **Flutter:** Dart Analyzer

**Auto-fix Enabled:** Yes (safe fixes applied automatically)

**Why:**
- Consistent code style reduces cognitive load
- Convention violations indicate design issues
- Automated formatting eliminates style debates
- Pre-commit hooks prevent bad commits

**BAS Actions:**
```bash
# Node.js
npx eslint . --fix
npx prettier . --write

# Python
black . --check
flake8 .
isort . --check

# Rust
cargo clippy -- -D warnings
cargo fmt -- --check
```

**Pass Criteria:** Zero linting errors, zero formatting inconsistencies.

---

### Phase 2: Structure Validation

**What:** File organization, module structure, dependency correctness.

**Checks:**
- File naming conventions followed
- Module exports are clean
- Dependencies are declared correctly
- No circular dependencies
- Proper separation of concerns

**Why:**
- Structure prevents architecture rot
- Clean exports improve maintainability
- Circular dependencies cause bugs
- Proper organization aids navigation

**BAS Actions:**
- Validates file structure matches conventions
- Checks for circular dependencies with `madge`
- Verifies module exports are intentional
- Ensures `index.ts` files export correctly

**Pass Criteria:** All files follow conventions, no circular dependencies, clean module exports.

---

### Phase 3: Build Validation

**What:** TypeScript/Rust/Go compilation, type safety verification.

**Why:**
- Type safety prevents runtime errors
- Compilation catches syntax errors
- Build failures indicate broken code
- Type errors reveal design issues

**BAS Actions:**
```bash
# Node.js/TypeScript
npm run build

# Rust
cargo build --release

# Go
go build ./...
```

**Pass Criteria:** Zero compilation errors, zero type errors.

---

### Phase 4: Testing

**What:** All tests pass (unit, integration, E2E).

**Requirements:**
- Unit tests for all functions
- Integration tests for workflows
- E2E tests for user flows
- TDD approach (RED-GREEN-REFACTOR)

**Why:**
- Tests are evidence code works
- Regressions caught immediately
- Refactoring is safe
- Documentation through examples

**BAS Actions:**
```bash
# Run all tests
npm test

# Parallel test execution
npm test -- --maxWorkers=4

# Watch mode (development)
npm test -- --watch
```

**Pass Criteria:** 100% of tests pass, zero test failures.

---

### Phase 5: Coverage Check

**What:** Test coverage ≥80% threshold.

**Requirements:**
- Minimum 80% line coverage
- Minimum 80% branch coverage
- Critical paths: 100% coverage
- New code: ≥80% coverage

**Why:**
- Coverage ensures code is tested
- Uncovered code is unverified code
- High coverage enables confident refactoring
- Coverage trends indicate quality trajectory

**BAS Actions:**
```bash
# Generate coverage report
npm run test:coverage

# Check coverage threshold
jest --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
```

**Pass Criteria:** ≥80% coverage globally, ≥80% coverage for new code.

**Coverage Report Example:**
```
File                    | % Stmts | % Branch | % Funcs | % Lines
------------------------|---------|----------|---------|--------
All files               |   82.5  |   81.2   |   83.7  |   82.5
 src/                   |   85.3  |   83.1   |   86.2  |   85.3
  index.ts              |   90.0  |   85.0   |   92.0  |   90.0
  utils.ts              |   78.5  |   75.2   |   80.1  |   78.5
```

---

### Phase 6: Review (Best Practices)

**What:** DRA validates code against design doc and Trinity Method standards.

**Checks:**
- Implementation matches design doc
- Functions ≤2 parameters (object parameters preferred)
- Functions <200 lines
- Nesting depth ≤4 levels
- No code duplication
- Proper error handling
- Debugging output included

**Why:**
- Design doc compliance prevents scope creep
- Standards prevent technical debt
- Best practices compound over time
- Human review catches what automation misses

**BAS Actions:**
- Compares implementation to design doc
- Validates function signatures
- Checks function lengths
- Measures nesting depth
- Identifies code duplication

**Pass Criteria:** Implementation matches design, all standards met, DRA approval.

---

## Standard 1: Mandatory Debugging

### The Standard

**Every implementation must include comprehensive debugging output.**

### Requirements

1. **Console.log at decision points**
   - Log when entering/exiting functions
   - Log at conditionals and branches
   - Log state transitions

2. **Error state logging with full context**
   - Log error message
   - Log error stack trace
   - Log relevant context (IDs, state, inputs)

3. **Performance measurement for critical operations**
   - Measure operation start/end times
   - Log duration for slow operations (>100ms)
   - Track resource usage (memory, CPU)

4. **State transition logging for complex workflows**
   - Log workflow entry/exit
   - Log phase transitions
   - Log agent handoffs

### Rationale

**Trinity Method treats debugging as investigation.**

Logs are **evidence** for future investigations. When something goes wrong, comprehensive logs enable rapid diagnosis without reproducing bugs locally.

**Benefits:**
- Faster debugging (hours → minutes)
- Production issue diagnosis without reproduction
- Learning data for agents (patterns in logs)
- Performance profiling data
- Audit trail for critical operations

### Example (Good)

```typescript
/**
 * Process investigation with comprehensive debugging
 */
export async function processInvestigation(id: string): Promise<InvestigationResult> {
  console.log(`[Investigation] Starting processing: ${id}`);
  const startTime = performance.now();

  try {
    // Log data fetching
    console.log(`[Investigation] Fetching data for ${id}...`);
    const data = await fetchInvestigationData(id);
    console.log(`[Investigation] Data fetched: ${data.records.length} records, ${data.sizeKB}KB`);

    // Log analysis phase
    console.log(`[Investigation] Analyzing data...`);
    const analysisStart = performance.now();
    const result = await analyzeInvestigation(data);
    const analysisDuration = performance.now() - analysisStart;
    console.log(`[Investigation] Analysis complete in ${analysisDuration.toFixed(2)}ms`);

    // Log success
    const totalDuration = performance.now() - startTime;
    console.log(`[Investigation] Processing complete: ${id} (${totalDuration.toFixed(2)}ms)`);
    console.log(`[Investigation] Result: ${result.findings.length} findings, confidence ${result.confidence}`);

    return result;
  } catch (error) {
    // Log error with full context
    const failureDuration = performance.now() - startTime;
    console.error(`[Investigation] Processing failed: ${id} (${failureDuration.toFixed(2)}ms)`);
    console.error(`[Investigation] Error:`, error);
    console.error(`[Investigation] Context:`, { id, timestamp: new Date().toISOString() });

    throw new InvestigationError(
      `Failed to process investigation ${id}`,
      { cause: error, investigationId: id }
    );
  }
}
```

**What makes this good:**
- Clear operation lifecycle (start → fetch → analyze → complete)
- Performance measurement (start time, end time, duration)
- Structured logs with `[Investigation]` prefix
- Error context includes investigation ID and timestamp
- Logs are actionable (enough info to debug without reproduction)

### Example (Bad)

```typescript
/**
 * Process investigation (no debugging)
 */
export async function processInvestigation(id: string): Promise<InvestigationResult> {
  const data = await fetchInvestigationData(id);
  return analyzeInvestigation(data);
}
```

**What makes this bad:**
- No logging (silent failures)
- No error handling (errors bubble up without context)
- No performance measurement (can't identify slow operations)
- No state tracking (can't diagnose issues)
- No evidence for future investigations

---

## Standard 2: Zero Console Errors

### The Standard

**Production code must have zero unhandled errors.**

### Requirements

1. **All errors caught and handled appropriately**
   - Try-catch blocks around risky operations
   - Promise rejections handled with `.catch()`
   - Async/await errors wrapped in try-catch

2. **Edge cases identified and tested**
   - Null/undefined inputs
   - Empty arrays/objects
   - Invalid types
   - Out-of-bounds values
   - Network failures
   - File system errors

3. **Graceful degradation for non-critical failures**
   - Cache miss → Fetch from source
   - API timeout → Retry with backoff
   - Feature unavailable → Show fallback UI

4. **User-friendly error messages**
   - No stack traces to users
   - Actionable error messages
   - Suggest solutions when possible
   - Log technical details server-side

### Rationale

**Unhandled errors break user trust and investigations.**

Every error is technical debt. Users encountering errors lose confidence. Developers encountering cryptic errors lose time.

**Benefits:**
- Users never see stack traces
- Errors are diagnosable from logs
- System degrades gracefully
- Investigations continue despite failures

### Example (Good)

```typescript
/**
 * Fetch investigation with comprehensive error handling
 */
export async function fetchInvestigation(id: string): Promise<Investigation> {
  // Validate inputs
  if (!id || typeof id !== 'string') {
    throw new ValidationError('Investigation ID is required and must be a string');
  }

  const normalizedId = id.trim().toLowerCase();

  try {
    console.log(`[Investigation] Checking cache for ${normalizedId}`);
    const cached = await cache.get<Investigation>(normalizedId);

    if (cached) {
      console.log(`[Investigation] Cache hit for ${normalizedId}`);
      return cached;
    }

    console.log(`[Investigation] Cache miss, fetching from database`);
    const investigation = await db.investigations.findById(normalizedId);

    if (!investigation) {
      throw new NotFoundError(`Investigation not found: ${normalizedId}`);
    }

    await cache.set(normalizedId, investigation, 3600);
    console.log(`[Investigation] Cached ${normalizedId} for 1 hour`);

    return investigation;
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }

    console.error(`[Investigation] Unexpected error fetching ${normalizedId}:`, {
      error,
      timestamp: new Date().toISOString()
    });

    throw new ServiceError(
      'An unexpected error occurred. Please try again or contact support.',
      { cause: error, investigationId: normalizedId }
    );
  }
}
```

**What makes this good:**
- Input validation prevents bad data
- Try-catch wraps risky operations
- Specific error types for different failures
- User-friendly error messages (no stack traces)
- Technical details logged server-side
- Graceful degradation (cache miss → database)

---

## Standard 3: Test Coverage Requirements

### The Standard

**Maintain minimum 80% test coverage for all code.**

### Requirements

1. **Unit tests for all functions**
   - Public API functions: 100% coverage
   - Internal functions: ≥80% coverage
   - Edge cases tested
   - Error paths tested

2. **Integration tests for workflows**
   - Multi-step processes tested end-to-end
   - Agent coordination tested
   - Database interactions tested
   - External API interactions mocked

3. **E2E tests for user flows**
   - Critical user journeys tested
   - CLI commands tested end-to-end
   - Error recovery flows tested

4. **TDD approach (RED-GREEN-REFACTOR)**
   - Write failing test first (RED)
   - Implement minimal code to pass (GREEN)
   - Refactor for quality (REFACTOR)
   - Tests remain green after refactor

### Rationale

**Tests are evidence that code works.**

Coverage ensures code is verified. Uncovered code is unverified code. High coverage enables confident refactoring and prevents regressions.

**Benefits:**
- Regressions caught immediately
- Refactoring is safe
- Documentation through examples
- Confidence in deployments

### Coverage Targets

```
┌──────────────────────────────────────────────────┐
│          Trinity Method Coverage Targets         │
├──────────────────────────────────────────────────┤
│ Global Coverage:           ≥80% (BAS enforced)  │
│ New Code:                  ≥80% (required)      │
│ Critical Paths:            100% (no exceptions) │
│ Public APIs:               100% (no exceptions) │
│ Internal Functions:        ≥80% (best effort)   │
│ Configuration:             ≥50% (basic checks)  │
└──────────────────────────────────────────────────┘
```

---

## Standard 4: Performance Standards

### The Standard

**All operations must meet performance benchmarks.**

### Requirements

1. **Page load < 2 seconds**
   - Initial page load under 2s
   - Route transitions under 500ms
   - Time to interactive < 3s

2. **API response < 500ms**
   - 95th percentile < 500ms
   - 99th percentile < 1000ms
   - Database queries optimized

3. **Search < 100ms**
   - Autocomplete < 100ms
   - Full-text search < 200ms
   - Search results cached

4. **Build time < 30 seconds**
   - Development build < 10s
   - Production build < 30s
   - Incremental builds < 5s

5. **Cache hit rate > 80%**
   - Investigation cache > 80% hits
   - API response cache > 70% hits
   - Pattern matching cache > 90% hits

### Rationale

**User experience is quality.**

Performance directly impacts user satisfaction. Slow applications frustrate users and reduce productivity.

---

## Standard 5: Documentation Requirements

### The Standard

**All code must be comprehensively documented.**

### Requirements

1. **TSDoc for all exported classes and functions**
   - Brief description (1 sentence)
   - `@see` links to methodology docs
   - Trinity Principle explained
   - "Why This Exists" section
   - Practical example with code

2. **README for each major module**
   - Purpose and scope
   - Installation/setup
   - Usage examples
   - API reference

3. **Inline comments for complex logic**
   - Algorithm explanations
   - Non-obvious optimizations
   - Edge case handling

### TSDoc Pattern (Trinity Method Standard)

```typescript
/**
 * [Class/Function Name] - [Brief 1-sentence description]
 *
 * @see docs/[relevant-doc].md - [What this doc provides]
 *
 * **Trinity Principle:** "[Principle Name]"
 * [2-3 sentences explaining how this embodies the principle]
 *
 * **Why This Exists:**
 * [2-4 sentences explaining the problem this solves]
 *
 * @example
 * ```typescript
 * // Practical, runnable code example
 * const instance = new Component();
 * await instance.doSomething();
 * ```
 *
 * @param paramName - [Parameter description]
 * @returns [Return value description]
 * @throws {ErrorType} [When this error is thrown]
 */
```

---

## Standard 6: Code Review Standards

### The Standard

**All code must pass DRA review before merge.**

### Requirements

1. **Implementation matches design doc**
   - All requirements implemented
   - Design decisions followed
   - No scope creep

2. **Trinity Method standards met**
   - Functions ≤2 parameters
   - Functions <200 lines
   - Nesting depth ≤4 levels
   - No code duplication
   - Proper error handling

3. **Test coverage ≥80%**
   - All happy paths tested
   - Edge cases tested
   - Error paths tested

4. **Documentation complete**
   - TSDoc on all exports
   - README updated if needed
   - Examples provided

5. **Performance validated**
   - Operations meet benchmarks
   - No performance regressions

### DRA Review Checklist

```markdown
## DRA Code Review Checklist

### Design Compliance
- [ ] Implementation matches design doc
- [ ] All requirements met
- [ ] No scope creep

### Trinity Method Standards
- [ ] Functions ≤2 parameters
- [ ] Functions <200 lines
- [ ] Nesting depth ≤4 levels
- [ ] No code duplication
- [ ] Proper error handling
- [ ] Debugging output included

### Testing
- [ ] Test coverage ≥80%
- [ ] Happy paths tested
- [ ] Edge cases tested
- [ ] Error paths tested

### Documentation
- [ ] TSDoc on all exports
- [ ] README updated
- [ ] Examples provided

### Performance
- [ ] Operations meet benchmarks
- [ ] No regressions

### Final Approval
- [ ] Code is clear and maintainable
- [ ] Trinity Method principles upheld
- [ ] Ready for production
```

---

## Enforcement

### How Quality is Enforced

Trinity Method uses **systematic enforcement** through automated tools and human review:

```
┌────────────────────────────────────────────────────────────────┐
│                   Quality Enforcement Flow                     │
├────────────────────────────────────────────────────────────────┤
│ Developer writes code                                           │
│         ↓                                                       │
│ Pre-commit hooks (Phase 1-3)                                   │
│   ├─ Linting (ESLint/Prettier auto-fix)                       │
│   ├─ Structure validation                                       │
│   └─ Build validation                                          │
│         ↓                                                       │
│ Commit allowed only if Phase 1-3 pass                          │
│         ↓                                                       │
│ Push to remote                                                  │
│         ↓                                                       │
│ CI/CD Pipeline (Phase 4-5)                                      │
│   ├─ All tests run                                             │
│   └─ Coverage checked (≥80%)                                   │
│         ↓                                                       │
│ Pull request created                                           │
│         ↓                                                       │
│ DRA Review (Phase 6)                                            │
│   ├─ Design doc compliance                                     │
│   ├─ Trinity Method standards                                  │
│   └─ Code quality and maintainability                         │
│         ↓                                                       │
│ Approval required for merge                                    │
│         ↓                                                       │
│ Deploy to production                                           │
└────────────────────────────────────────────────────────────────┘
```

### Pre-commit Hooks

**Setup:**
```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install
```

**Configuration (`.pre-commit-config.yaml`):**
```yaml
repos:
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.50.0
    hooks:
      - id: eslint
        args: [--fix, --max-warnings=0]

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.0.3
    hooks:
      - id: prettier
        args: [--write]
```

---

## Examples

### Complete Example: Good vs Bad Implementation

**Task:** Implement user authentication with email/password.

#### ❌ Bad Implementation

```typescript
// No TSDoc, no documentation
export async function login(e, p) {
  const u = await db.users.where('email', e).first();
  if (u && u.password === p) {
    return { token: 'abc123' };
  }
  throw new Error('Login failed');
}
```

**Violations:**
- No logging
- Plain text passwords (security issue)
- No tests
- No performance measurement
- No documentation

#### ✅ Good Implementation

See comprehensive example in [WO-023 work order](../trinity/work-orders/WO-023-quality-standards-documentation.md).

---

## Measuring Quality

### Quality Metrics Dashboard

```
┌───────────────────────────────────────────────────────────────┐
│              Trinity Method Quality Dashboard                 │
├───────────────────────────────────────────────────────────────┤
│ Test Coverage:             87.3% ✅ (target: ≥80%)           │
│ Build Success Rate:        100%  ✅ (last 30 builds)         │
│ Function Length Avg:       47 lines ✅ (target: <200)        │
│ Function Parameters Avg:   1.2  ✅ (target: ≤2)              │
│ Code Duplication:          2.1% ✅ (target: <5%)             │
│ Performance (p95):         340ms ✅ (target: <500ms)         │
│ Cache Hit Rate:            84%   ✅ (target: >80%)           │
└───────────────────────────────────────────────────────────────┘
```

### Tracking Quality Trends

```bash
# Generate quality report
npx trinity analytics --quality

# View quality trends (last 30 days)
npx trinity analytics --quality --period 30d

# Export quality metrics
npx trinity analytics --quality --export quality-report.json
```

---

## Conclusion

**Quality isn't optional. Quality is systematically enforced.**

Trinity Method transforms quality from aspiration to reality through:

1. **Explicit Standards** - Clear, measurable quality requirements
2. **Automated Enforcement** - BAS 6-phase quality gates
3. **Human Review** - DRA validates design compliance
4. **Continuous Measurement** - Quality metrics tracked
5. **Knowledge Preservation** - Quality patterns learned

**The Trinity Method Quality Promise:**

> "Code that passes BAS gates and DRA review is production-ready. No exceptions."

---

**Version:** 2.0
**Last Updated:** 2025-11-06
**Maintained By:** Trinity Method SDK Team