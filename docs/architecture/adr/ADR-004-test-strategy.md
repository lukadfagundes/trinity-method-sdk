# ADR-004: Comprehensive Test Strategy

**Status:** Accepted
**Date:** 2025-12-28
**Deciders:** Trinity Method SDK Core Team
**Technical Story:** Establish testing strategy for production-ready SDK quality

## Context

Trinity Method SDK is a critical tool that deploys development infrastructure (agents, commands, linting configs, CI/CD workflows) to user projects. Any bugs or failures in deployment could:

- Corrupt user project files
- Break existing CI/CD pipelines
- Deploy invalid configurations
- Cause data loss or unrecoverable states

The SDK needed a robust testing strategy to ensure:

1. **Deployment Reliability** - 100% successful deployments across all frameworks
2. **Template Correctness** - All 64 components deploy with valid substitutions
3. **Rollback Safety** - Backup and restore mechanisms work flawlessly
4. **Framework Compatibility** - Works across Node.js, Python, Rust, Flutter, Go
5. **Regression Prevention** - Changes don't break existing functionality
6. **Production Readiness** - SDK is stable enough for public npm release

**Testing Challenges:**

- File system operations (create, read, write, delete directories)
- Template processing with variable substitution
- CLI command execution and user interaction
- Cross-platform compatibility (Windows, macOS, Linux)
- Multi-framework support validation
- Backup/restore mechanisms
- Error handling and rollback scenarios

## Decision Drivers

- **Quality Assurance** - SDK must be production-ready and reliable
- **Comprehensive Coverage** - Test all critical paths and edge cases
- **Fast Feedback** - Tests should run quickly during development
- **Clear Test Organization** - Easy to locate and write tests
- **TypeScript Support** - First-class TypeScript testing
- **Mocking Capabilities** - Mock file system and external dependencies
- **Integration Testing** - Test real deployment flows

## Considered Options

### Option 1: Jest (Comprehensive Test Suite)

- Jest testing framework with 405+ tests
- Unit tests (~200 tests) + Integration tests (~200 tests)
- Mock file system with `memfs` or `mock-fs`
- Snapshot testing for template outputs

**Pros:**

- **Comprehensive** - Built-in mocking, assertions, coverage reporting
- **TypeScript Support** - Excellent TypeScript integration via `ts-jest`
- **Fast** - Parallel test execution, watch mode
- **Snapshot Testing** - Validate template outputs automatically
- **Large Ecosystem** - Extensive documentation and community
- **Built-in Coverage** - Code coverage reports with no additional tools

**Cons:**

- **Learning Curve** - More features = more to learn (mitigated: excellent docs)
- **Bundle Size** - Larger than minimal frameworks (acceptable for dev dependency)

### Option 2: Mocha + Chai + Sinon

- Mocha test runner + Chai assertions + Sinon mocks
- Flexible but requires more configuration

**Pros:**

- **Flexible** - Mix and match testing libraries
- **Minimal** - Smaller footprint than Jest

**Cons:**

- **More Configuration** - Must wire together 3+ libraries
- **No Built-in Coverage** - Need Istanbul/nyc separately
- **Less TypeScript Support** - Requires more setup
- **Fragmented Ecosystem** - Multiple libraries to maintain

### Option 3: Vitest

- Modern test framework, Vite-based
- Similar API to Jest

**Pros:**

- **Fast** - Vite-based compilation
- **Modern** - Latest JavaScript features
- **Jest Compatible** - Similar API

**Cons:**

- **Less Mature** - Newer framework, smaller community
- **Vite Dependency** - Unnecessary for CLI tool (no bundling needed)
- **Smaller Ecosystem** - Fewer resources and plugins

### Option 4: AVA

- Minimalist testing framework
- Concurrent test execution

**Pros:**

- **Fast** - Concurrent execution by default
- **Simple API** - Minimal learning curve

**Cons:**

- **Less Feature-Rich** - Limited mocking and assertions
- **Smaller Community** - Fewer resources
- **Less TypeScript Support** - More manual configuration

## Decision

**Chosen Option: Jest with Comprehensive Test Suite (405+ Tests)**

We will use Jest as the testing framework with:

- **Unit Tests (~200 tests)** - Test individual functions and utilities
- **Integration Tests (~200 tests)** - Test complete deployment flows
- **16 Test Suites** - Organized by functionality
- **95%+ Code Coverage** - Ensure all critical paths tested
- **Snapshot Testing** - Validate template outputs
- **Mock File System** - Test file operations safely

**Rationale:**

1. **Production-Ready Quality** - 405+ tests ensure SDK is reliable and stable

2. **Comprehensive Coverage** - Unit tests + integration tests + snapshot tests cover:
   - Template processing and variable substitution
   - CLI command execution
   - File system operations (create, read, write, delete)
   - Framework detection logic
   - Backup and restore mechanisms
   - Error handling and rollback
   - Cross-platform compatibility

3. **TypeScript Excellence** - `ts-jest` provides seamless TypeScript support:

   ```typescript
   // tests/unit/templateProcessor.test.ts
   import { processTemplate } from '../../src/cli/utils/templateProcessor';

   describe('Template Processor', () => {
     it('should replace {{PROJECT_NAME}} variable', async () => {
       // Full type safety in tests
     });
   });
   ```

4. **Fast Feedback Loop** - Jest watch mode enables rapid development:

   ```bash
   npm run test:watch  # Re-run tests on file changes
   ```

5. **Built-in Mocking** - Mock file system operations safely:

   ```typescript
   import fs from 'fs-extra';
   jest.mock('fs-extra');

   // Mock file writes without touching real filesystem
   (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
   ```

6. **Snapshot Testing** - Validate template outputs automatically:

   ```typescript
   it('should generate correct Trinity.md content', () => {
     const output = processTemplate('Trinity.md.template', variables);
     expect(output).toMatchSnapshot();
   });
   ```

7. **Code Coverage** - Built-in coverage reports:
   ```bash
   npm test -- --coverage
   # Generates HTML report in coverage/
   ```

## Implementation Details

### Test Suite Organization

```
tests/
├── unit/                          # Unit tests (~200 tests)
│   ├── templateProcessor.test.ts  # Template substitution
│   ├── stackDetection.test.ts     # Framework detection
│   ├── pathValidation.test.ts     # Security validation
│   ├── backupManager.test.ts      # Backup/restore
│   └── variableRegistry.test.ts   # Variable management
├── integration/                   # Integration tests (~200 tests)
│   ├── deploy.test.ts            # Full deploy command
│   ├── update.test.ts            # Full update command
│   ├── multiFramework.test.ts    # Cross-framework tests
│   ├── rollback.test.ts          # Failure recovery
│   └── validation.test.ts        # Component verification
└── fixtures/                      # Test data
    ├── templates/
    └── expectedOutputs/
```

### Test Categories

#### 1. Unit Tests (~200 tests)

**Template Processing (50 tests):**

- Variable substitution correctness
- Unresolved variable detection
- Multi-variable replacement
- Edge cases (empty strings, special characters)

**Framework Detection (40 tests):**

- package.json detection → Node.js
- requirements.txt detection → Python
- Cargo.toml detection → Rust
- pubspec.yaml detection → Flutter
- go.mod detection → Go
- Package manager detection (npm, yarn, pnpm, pip, cargo, flutter, go)

**Path Validation (30 tests):**

- Directory traversal prevention
- Symlink detection
- Absolute vs relative paths
- Cross-platform path handling

**Backup Manager (40 tests):**

- Backup creation
- Backup restoration
- Rollback on failure
- Backup cleanup

**Variable Registry (40 tests):**

- Variable resolution
- Default value handling
- Date formatting
- Version extraction

#### 2. Integration Tests (~200 tests)

**Deploy Command (80 tests):**

- Full deployment flow (Node.js, Python, Rust, Flutter, Go)
- Interactive prompt handling
- Directory creation
- Component deployment verification
- .gitignore updates
- Error recovery

**Update Command (60 tests):**

- Version checking
- Backup creation before update
- User content preservation (ARCHITECTURE.md, ISSUES.md)
- Template deployment
- Rollback on failure
- Backup cleanup

**Multi-Framework (40 tests):**

- Node.js deployment + linting (ESLint, Prettier)
- Python deployment + linting (Black, Flake8, isort)
- Rust deployment + linting (Clippy, Rustfmt)
- Flutter deployment + linting (Dart Analyzer)
- Go deployment + linting (gofmt)

**Validation (20 tests):**

- 64 component verification
- File content validation
- Template variable resolution check
- Directory structure verification

### Jest Configuration

**jest.config.js:**

```javascript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/index.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
```

### Example Test

**tests/unit/templateProcessor.test.ts:**

```typescript
import { processTemplate } from '../../src/cli/utils/templateProcessor';
import fs from 'fs-extra';

describe('Template Processor', () => {
  const mockVariables = {
    '{{PROJECT_NAME}}': 'my-app',
    '{{FRAMEWORK}}': 'Node.js',
    '{{PACKAGE_MANAGER}}': 'npm',
  };

  it('should replace all variables in template', async () => {
    const template = '# {{PROJECT_NAME}} - {{FRAMEWORK}}';
    const expected = '# my-app - Node.js';

    const result = await processTemplate(template, mockVariables);

    expect(result).toBe(expected);
  });

  it('should throw error on unresolved variables', async () => {
    const template = '# {{PROJECT_NAME}} - {{UNKNOWN_VAR}}';

    await expect(processTemplate(template, mockVariables)).rejects.toThrow('Unresolved variables');
  });

  it('should handle multiple occurrences of same variable', async () => {
    const template = '{{PROJECT_NAME}} uses {{PROJECT_NAME}}';
    const expected = 'my-app uses my-app';

    const result = await processTemplate(template, mockVariables);

    expect(result).toBe(expected);
  });
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### CI/CD Integration

**GitHub Actions (.github/workflows/test.yml):**

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [16, 18, 20]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}

      - run: npm ci
      - run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Consequences

### Positive

- **High Confidence** - 405+ tests ensure SDK is production-ready
- **Regression Prevention** - Tests catch breaking changes immediately
- **Fast Feedback** - Watch mode enables rapid development
- **Documentation** - Tests serve as usage examples
- **Refactoring Safety** - Can refactor with confidence
- **Cross-Platform Validation** - CI tests on Windows, macOS, Linux
- **Code Quality** - 95%+ coverage ensures thorough testing

### Negative

- **Test Maintenance** - 405 tests require maintenance when features change
- **Initial Time Investment** - Writing comprehensive tests takes time
- **CI/CD Time** - Running 405 tests in CI takes ~12 seconds (acceptable)

### Neutral

- **Test-Driven Development** - Encourages TDD workflow (write tests first)
- **Coverage Requirements** - 90% threshold enforces quality but may be strict for some edge cases

## Validation

Success metrics after implementation:

1. **Test Count** - ✅ 405 tests across 16 suites
2. **Code Coverage** - ✅ 95%+ coverage (branches, functions, lines, statements)
3. **Test Speed** - ✅ ~12 seconds for complete test suite
4. **CI/CD Success** - ✅ All tests pass on Windows, macOS, Linux
5. **Zero Production Bugs** - ✅ No reported deployment failures in production
6. **Deployment Success Rate** - ✅ 100% successful deployments in testing

## Related Decisions

- **ADR-001: CLI Architecture** - CLI commands covered by integration tests
- **ADR-002: Template System Design** - Template processor has 50+ unit tests
- **ADR-003: ESLint Flat Config** - Linting applied to all test files

## References

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Jest Snapshot Testing](https://jestjs.io/docs/snapshot-testing)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- Implementation: `tests/` directory
- Configuration: `jest.config.js`
- CI: `.github/workflows/test.yml`
