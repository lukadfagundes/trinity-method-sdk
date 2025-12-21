# ADR-004: Test Strategy (Jest + ts-jest)

**Status:** Accepted
**Date:** 2025-12-21
**Deciders:** Development Team
**Technical Story:** Comprehensive testing strategy for Trinity Method SDK

---

## Context

The Trinity Method SDK requires robust testing to ensure reliability across different environments and use cases.

**Requirements:**

- Unit tests for utility functions
- Integration tests for CLI commands
- Support for TypeScript without transpilation overhead
- Fast test execution
- Code coverage reporting
- Easy to write and maintain tests

**Constraints:**

- TypeScript codebase with ES modules
- Node.js 16.9+ environment
- Must work with CI/CD pipelines
- Coverage target: ≥80% (ideal: 96%+)

---

## Decision

We will use **Jest with ts-jest** as our testing framework.

**Implementation:**

- Jest 30.x as test runner
- ts-jest for TypeScript support
- Separate test projects for unit and integration tests
- fs-extra for filesystem testing utilities
- Coverage reporting with built-in Istanbul

**Test Structure:**

```
tests/
├── unit/                    # Unit tests (fast, isolated)
│   └── cli/utils/          # Mirror src/ structure
├── integration/            # Integration tests (slower, realistic)
│   └── cli/commands/       # End-to-end command tests
└── fixtures/               # Test data and mocks
```

**Jest Configuration:**

```javascript
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
    },
  ],
};
```

---

## Consequences

### Positive Consequences

- **TypeScript support:** ts-jest handles TypeScript without pre-compilation
- **Fast execution:** Jest runs tests in parallel
- **Great DX:** Excellent error messages and diffs
- **Code coverage:** Built-in coverage reporting
- **Mocking:** Powerful mocking capabilities
- **Snapshot testing:** Useful for template verification
- **Watch mode:** Fast feedback during development
- **Community:** Large ecosystem and good documentation

### Negative Consequences

- **ES modules complexity:** Requires experimental Node.js flag
- **Configuration:** Initial setup has learning curve
- **Dependencies:** Jest and ts-jest add bundle size
- **Mock system:** Can be confusing for complex scenarios

### Neutral Consequences

- **Test organization:** Clear separation between unit and integration
- **Coverage thresholds:** Can enforce quality gates
- **CI/CD integration:** Standard tooling, well-supported

---

## Alternatives Considered

### Alternative 1: Vitest

**Description:** Modern test framework with native ES modules and TypeScript support

**Pros:**

- Native ESM support (no experimental flags)
- Faster than Jest in many cases
- Better TypeScript experience out of the box
- Modern API design
- Vite ecosystem integration

**Cons:**

- Newer, less mature
- Smaller community
- Fewer Stack Overflow answers
- Less IDE integration
- Migration from Jest later if needed

**Why not chosen:** Jest is more mature with better tooling. Vitest is promising but Jest's ecosystem is more robust. Can consider migration in future.

### Alternative 2: AVA

**Description:** Minimal test runner with focus on ES modules

**Pros:**

- Native ESM support
- Concurrent test execution
- Simple API
- Good TypeScript support

**Cons:**

- Less feature-rich than Jest
- Smaller ecosystem
- No built-in mocking
- Less documentation

**Why not chosen:** Lacks the rich feature set and ecosystem of Jest. Would need additional tools for mocking and coverage.

### Alternative 3: Mocha + Chai

**Description:** Traditional test framework combination

**Pros:**

- Very mature
- Flexible
- Large ecosystem
- Well-documented

**Cons:**

- Requires multiple packages (test runner, assertion library, etc.)
- More configuration needed
- Slower than Jest
- Less modern DX

**Why not chosen:** Jest provides better out-of-the-box experience with less configuration. One tool vs. multiple.

---

## Implementation Notes

**Test Organization:**

**Unit Tests:**

- Test individual functions in isolation
- Mock external dependencies
- Fast execution (<5s for all unit tests)
- Mirror source directory structure

**Integration Tests:**

- Test CLI commands end-to-end
- Use real filesystem (with temp directories)
- Test actual workflows
- Slower but comprehensive

**Coverage Strategy:**

- Minimum 80% coverage enforced
- Target 96%+ coverage
- Critical paths must have 100% coverage
- Generate HTML reports for review

**Running Tests:**

```bash
npm test                      # All tests
npm run test:unit            # Unit tests only
npm run test:integration     # Integration tests only
npm run test:coverage        # With coverage report
npm run test:watch           # Watch mode
```

**Example Test:**

```typescript
import { validatePath } from '../../src/cli/utils/validate-path.js';

describe('validatePath', () => {
  it('should accept valid absolute paths', () => {
    expect(validatePath('/valid/path')).toBe(true);
  });

  it('should reject relative paths', () => {
    expect(validatePath('../relative')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(validatePath('')).toBe(false);
    expect(validatePath(null as any)).toBe(false);
  });
});
```

**Migration Path:**

- Jest is stable for v1.x
- Can migrate to Vitest in v2.x if beneficial
- Test files can remain largely unchanged

**Validation:**

- All tests pass consistently
- Coverage meets thresholds
- Tests run in CI/CD
- Fast feedback loop in development

---

## References

- [Jest Documentation](https://jestjs.io/)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Jest ES Modules Support](https://jestjs.io/docs/ecmascript-modules)

---

## Revision History

| Date       | Author | Change Description |
| ---------- | ------ | ------------------ |
| 2025-12-21 | APO    | Initial version    |
