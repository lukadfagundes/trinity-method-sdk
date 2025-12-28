# tests/ - Trinity Method SDK Test Suite

**Testing Framework:** Jest
**Test Files:** 16 test files
**Total Tests:** 405 tests
**Coverage Target:** 80%+

## Overview

Comprehensive test suite for Trinity Method SDK using Jest with TypeScript. Tests cover CLI commands, utilities, template processing, and integration workflows.

## Directory Structure

```
tests/
├── CLAUDE.md           # Testing standards and patterns
├── unit/               # Unit tests (isolated function/class tests)
│   └── cli/            # CLI utility unit tests
│       └── utils/      # Template processing, validation, error handling
├── integration/        # Integration tests (multiple components)
│   └── cli/            # Full CLI command integration tests
│       └── commands/   # deploy, update, linting, CI/CD tests
├── helpers/            # Test helpers and utilities
├── fixtures/           # Test data and mock files
├── utils/              # Shared test utilities
└── __mocks__/          # Mock implementations
```

## Test Organization

### Unit Tests (`unit/`)

Isolated tests for individual functions and classes:

- **Template Processing** - Variable substitution, metrics formatting
- **Path Validation** - Security checks, symlink detection
- **Error Handling** - Error classes, cleanup, wrapping
- **Stack Detection** - Framework/package manager detection
- **Linting Tools** - Tool selection, dependency extraction
- **CI/CD Deployment** - Platform detection, template deployment

**Total Unit Tests:** ~200+ tests

### Integration Tests (`integration/`)

Multi-component workflow tests:

- **Deploy Command** - Full Trinity deployment with all components
- **Update Command** - Version detection, backup, restore
- **Deploy Configuration** - Interactive wizard, linting setup, CI/CD
- **Deploy Linting** - Tool deployment, dependency injection
- **Deploy CI/CD** - GitHub Actions, GitLab CI workflows
- **Update Backup** - Backup/restore/rollback workflows

**Total Integration Tests:** ~200+ tests

## Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Type checking only
npm run type-check

# Full build + test
npm run build && npm test
```

## Test Results

**Latest Test Run:**

```
Test Suites: 16 passed, 16 total
Tests:       405 passed, 405 total
Time:        ~12 seconds
```

## Test Structure (AAA Pattern)

All tests follow Arrange-Act-Assert pattern:

```typescript
describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange - Set up test data and conditions
    const input = 'test input';
    const expected = 'expected output';

    // Act - Execute the function/method being tested
    const result = functionUnderTest(input);

    // Assert - Verify the result matches expectations
    expect(result).toBe(expected);
  });
});
```

## Key Test Coverage

### Deploy Command Tests

- ✅ Directory structure creation (14 directories)
- ✅ Agent template deployment (19 agents)
- ✅ Slash command deployment (20 commands)
- ✅ Knowledge base deployment (9 files)
- ✅ Template deployment (work orders, investigations, documentation)
- ✅ Framework detection (Node.js, Python, Rust, Flutter, Go)
- ✅ .gitignore updates
- ✅ Force flag handling

### Update Command Tests

- ✅ Version detection from VERSION file
- ✅ Backup creation before update
- ✅ User content preservation (ARCHITECTURE, ISSUES, To-do, Technical-Debt)
- ✅ Rollback on failure
- ✅ Dry-run mode
- ✅ Update confirmation prompts

### Linting Tests

- ✅ ESLint deployment (JavaScript/TypeScript)
- ✅ Prettier deployment
- ✅ Pre-commit hooks
- ✅ Python tools (Black, Flake8)
- ✅ Flutter tools (Dart Analyzer)
- ✅ Rust tools (Clippy, Rustfmt)
- ✅ Dependency injection to package.json/requirements.txt

### CI/CD Tests

- ✅ GitHub Actions deployment
- ✅ GitLab CI deployment
- ✅ Platform detection from git config
- ✅ Generic template deployment
- ✅ Force flag handling

### Utility Tests

- ✅ Template variable substitution
- ✅ Path validation security
- ✅ Symlink detection
- ✅ Stack detection (framework, package manager, source directories)
- ✅ Error handling and cleanup

## Testing Standards

As defined in [tests/CLAUDE.md](CLAUDE.md):

- Each test must be independent (no shared state)
- Use AAA pattern (Arrange-Act-Assert)
- Mock external dependencies
- Clean up after tests (temp files, directories)
- Descriptive test names
- Edge case coverage
- Error scenario testing

## Test Helpers

### Fixtures (`fixtures/`)

Mock package.json, .git/config, and other test data files

### Helpers (`helpers/`)

Reusable test utilities and setup functions

### Mocks (`__mocks__/`)

Mock implementations for external dependencies

## Documentation

See [tests/CLAUDE.md](CLAUDE.md) for complete testing standards, patterns, and best practices.

---

**405 Tests, 16 Suites** - Comprehensive coverage for production-ready SDK
