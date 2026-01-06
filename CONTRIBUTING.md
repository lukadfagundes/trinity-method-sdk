# Contributing to Trinity Method SDK

Thank you for your interest in contributing to the Trinity Method SDK! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Documentation](#documentation)
- [Getting Help](#getting-help)

---

## Code of Conduct

This project follows a code of conduct to ensure a welcoming and inclusive environment for all contributors. By participating, you agree to uphold this standard.

**Expected Behavior:**

- Be respectful and considerate
- Welcome diverse perspectives and experiences
- Focus on constructive feedback
- Prioritize the community's best interests

---

## Development Setup

### Prerequisites

- **Node.js:** 16.9.0 or higher
- **npm:** 8.0.0 or higher
- **Git:** 2.0 or higher

### Initial Setup

1. **Fork and Clone:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/trinity-method-sdk.git
   cd trinity-method-sdk
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Verify Installation:**

   ```bash
   npm run type-check  # TypeScript compilation check
   npm run lint        # ESLint verification
   npm test            # Run all tests
   npm run build       # Build the project
   ```

4. **Set Up Git Hooks:**
   ```bash
   npm run prepare     # Sets up Husky pre-commit hooks
   ```

All commands should pass without errors before you begin development.

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch Naming Conventions:**

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add/update tests for your changes
- Update documentation as needed

### 3. Run Quality Checks

Before committing, ensure all checks pass:

```bash
npm run type-check  # TypeScript type checking
npm run lint        # Linting (auto-fix with npm run lint:fix)
npm test            # All tests must pass
npm run build       # Build must succeed
```

### 4. Commit Changes

We use **Conventional Commits** for all commit messages:

```bash
git commit -m "feat(cli): add new command for X"
git commit -m "fix(deploy): resolve template copy issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(utils): add unit tests for validation"
```

**Commit Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

---

## Code Standards

### TypeScript

- **Strict Mode:** All code must compile with TypeScript strict mode enabled
- **Type Safety:** Avoid `any` types; use proper type annotations
- **Interfaces:** Prefer interfaces over type aliases for object shapes
- **Exports:** Use named exports over default exports

**Example:**

```typescript
// Good
export interface UserOptions {
  name: string;
  email: string;
}

export function createUser(options: UserOptions): User {
  // Implementation
}

// Avoid
export default function (options: any) {
  // Implementation
}
```

### ESLint Rules

The project uses ESLint 9 with flat config. Key rules:

- **No unused variables** (except prefixed with `_`)
- **Consistent code formatting** (enforced by Prettier)
- **No console statements** in production code (use proper logging)
- **Proper error handling** (no empty catch blocks)

Run linting:

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

### Code Coverage

- **Minimum coverage:** 80% (target: 96%+)
- **Unit tests:** Required for all new functions
- **Integration tests:** Required for CLI commands and major features
- **Edge cases:** Must be tested

Check coverage:

```bash
npm run test:coverage
```

### File Organization

```
src/
├── cli/              # CLI-specific code
│   ├── commands/     # Command implementations
│   ├── utils/        # Utility functions
│   └── types.ts      # Type definitions
├── templates/        # File templates
└── index.ts          # Main entry point

tests/
├── unit/             # Unit tests (mirrors src/ structure)
├── integration/      # Integration tests
└── fixtures/         # Test fixtures and mocks
```

---

## Testing

### Test Structure

We use **Jest** with **ts-jest** for all testing.

**Test Types:**

1. **Unit Tests** (`tests/unit/`)
   - Test individual functions in isolation
   - Mock external dependencies
   - Fast execution

2. **Integration Tests** (`tests/integration/`)
   - Test CLI commands end-to-end
   - Test module interactions
   - Use real filesystem (with cleanup)

### Writing Tests

**Example Unit Test:**

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

**Example Integration Test:**

```typescript
import { deploy } from '../../src/cli/commands/deploy/index.js';

describe('deploy command', () => {
  it('should create Trinity directory structure', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-'));

    await deploy({ targetDir: tempDir });

    expect(await fs.pathExists(path.join(tempDir, 'trinity'))).toBe(true);

    await fs.remove(tempDir); // Cleanup
  });
});
```

### Running Tests

```bash
npm test                    # Run all tests
npm run test:unit          # Run unit tests only
npm run test:integration   # Run integration tests only
npm run test:coverage      # Run with coverage report
npm run test:watch         # Run in watch mode
```

### Coverage Requirements

- **Overall coverage:** ≥80% (target: 96%+)
- **New code:** 100% coverage required
- **Critical paths:** Must have edge case coverage
- **Error handling:** All error paths must be tested

---

## Pull Request Process

### Before Submitting

Ensure all of the following pass:

- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Test coverage ≥80%
- [ ] Documentation updated (if needed)
- [ ] CHANGELOG.md updated (if user-facing change)

### PR Requirements

1. **Title:** Use conventional commit format
   - Example: `feat(cli): add new investigation command`

2. **Description:** Include:
   - What changed and why
   - Link to related issue (if applicable)
   - Breaking changes (if any)
   - Screenshots (for UI changes)

3. **Size:** Keep PRs focused and manageable
   - Prefer smaller, focused PRs over large ones
   - One feature/fix per PR

4. **Tests:** All new code must have tests
   - Unit tests for functions
   - Integration tests for features

### Review Process

1. **Automated Checks:**
   - CI/CD pipeline runs all tests
   - Linting and type checking
   - Coverage report generated

2. **Code Review:**
   - At least one maintainer approval required
   - Address all review comments
   - Keep discussion professional and constructive

3. **Merge:**
   - Squash and merge preferred
   - Delete branch after merge

### What We Look For

- **Code Quality:** Clean, readable, maintainable
- **Test Coverage:** Comprehensive tests
- **Documentation:** Clear inline comments and updated docs
- **Performance:** No unnecessary performance regressions
- **Security:** No security vulnerabilities introduced

---

## Release Process

### Versioning

We follow **Semantic Versioning** (semver):

- **MAJOR:** Breaking changes (v1.0.0 → v2.0.0)
- **MINOR:** New features, backward compatible (v1.0.0 → v1.1.0)
- **PATCH:** Bug fixes, backward compatible (v1.0.0 → v1.0.1)

### CI/CD Pipeline

Trinity uses GitHub Actions for automated quality assurance:

**CI Workflow** (`.github/workflows/ci.yml`):

- ✅ Multi-platform testing (Ubuntu, Windows, macOS)
- ✅ Multi-version testing (Node.js 18.x, 20.x, 22.x)
- ✅ Comprehensive test suite (unit, integration, e2e, performance)
- ✅ Code coverage validation (80%+ threshold enforced)
- ✅ Linting and type checking (ESLint, TypeScript)
- ✅ Code formatting verification (Prettier)
- ✅ Security scanning (npm audit, dependency checks)
- ✅ Build verification and artifact validation

**Triggers:**

- Push to `main` or `dev` branches
- Pull requests targeting `main` or `dev`

### Release Checklist

1. **Ensure CI Passes:**

   ```bash
   # Push changes to trigger CI
   git push origin main

   # Wait for CI to complete
   # Check: https://github.com/lukadfagundes/trinity-method-sdk/actions
   ```

   All CI jobs must pass before publishing:
   - Test suite (all platforms)
   - Coverage check (≥80%)
   - Quality checks
   - Performance benchmarks
   - Build verification
   - Security scan

2. **Update Version:**

   ```bash
   npm version [major|minor|patch]
   # This creates a git tag and updates package.json
   ```

3. **Update CHANGELOG.md:**
   - Document all changes since last release
   - Group by type (Added, Changed, Deprecated, Removed, Fixed, Security)
   - Follow [Keep a Changelog](https://keepachangelog.com/) format

4. **Push Version Tag:**

   ```bash
   git push --follow-tags
   ```

5. **Verify prepublishOnly Checks:**

   The `prepublishOnly` script automatically runs before publishing:

   ```bash
   npm run build    # TypeScript compilation + template copying
   npm run test     # Full test suite
   ```

   If either fails, publishing is blocked automatically.

6. **Publish to npm:**

   ```bash
   npm login              # Authenticate (if needed)
   npm publish            # Publish with automatic prepublishOnly checks
   ```

   **Note:** Automated npm publishing is not currently configured. All releases require manual `npm publish` after successful CI validation.

7. **Create GitHub Release:**
   - Go to [Releases](https://github.com/lukadfagundes/trinity-method-sdk/releases)
   - Click "Draft a new release"
   - Select the version tag
   - Copy CHANGELOG.md content for that version
   - Publish release

### Pre-Release Testing

Before releasing, test the package locally:

```bash
# Build and pack
npm run build
npm pack

# Test in another project
cd /path/to/test-project
npm install /path/to/trinity-method-sdk/trinity-method-sdk-X.Y.Z.tgz

# Verify deployment works
npx trinity deploy
```

---

## Documentation

### API Documentation

- **TypeDoc:** We use TypeDoc for API documentation
- **Generate docs:** `npm run docs:generate`
- **Output:** `docs/` directory (committed to repo)

### JSDoc Comments

All public functions should have JSDoc comments:

````typescript
/**
 * Validates a file path for security and correctness
 *
 * @param filePath - The path to validate
 * @param options - Validation options
 * @returns True if valid, false otherwise
 * @throws {ValidationError} If path contains dangerous patterns
 *
 * @example
 * ```typescript
 * const isValid = validatePath('/safe/path');
 * ```
 */
export function validatePath(filePath: string, options?: ValidationOptions): boolean {
  // Implementation
}
````

### ADRs (Architectural Decision Records)

Major architectural decisions are documented in `docs/adr/`:

- **Template:** `docs/adr/template.md`
- **Format:** ADR-XXX-title.md
- **Required sections:** Context, Decision, Consequences, Alternatives

---

## Getting Help

### Resources

- **Documentation:** [README.md](README.md)
- **API Docs:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/lukadfagundes/trinity-method-sdk/issues)
- **Discussions:** [GitHub Discussions](https://github.com/lukadfagundes/trinity-method-sdk/discussions)

### Asking Questions

Before asking:

1. Check existing documentation
2. Search closed issues
3. Review ADRs for design decisions

When asking:

- Provide context and examples
- Include error messages (if applicable)
- Describe what you've tried

### Reporting Bugs

Use the bug report template and include:

- **Description:** Clear description of the bug
- **Reproduction steps:** Minimal steps to reproduce
- **Expected behavior:** What should happen
- **Actual behavior:** What actually happens
- **Environment:** Node version, OS, npm version
- **Logs:** Relevant error messages

### Suggesting Features

Use the feature request template and include:

- **Use case:** Why is this needed?
- **Proposed solution:** How should it work?
- **Alternatives:** Other approaches considered
- **Impact:** Who benefits from this?

---

## Contributing Support for Other AI Agents

Trinity Method SDK v2.0.3 is built for [Claude Code](https://claude.com/claude-code).

We welcome contributions to add support for other AI coding agents (Cursor, GitHub Copilot, Aider, etc.).

### Guidelines

1. **Agent-Specific Templates**: Create templates in `src/templates/[agent-name]/`
2. **Context Files**: Each agent needs its own context file format (e.g., cursor-rules.md, copilot-instructions.md)
3. **Agent Configuration**: Add agent config to deployment logic
4. **Documentation**: Update README with agent-specific instructions
5. **Testing**: Test full deployment for your agent

---

## Project Structure

```
trinity-method-sdk/
├── .claude/                 # Claude Code slash commands
├── dist/                    # Compiled output (generated)
├── docs/                    # API documentation (generated)
│   └── adr/                 # Architectural Decision Records
├── src/                     # Source code
│   ├── cli/                 # CLI implementation
│   │   ├── commands/        # Command implementations
│   │   ├── utils/           # Utility functions
│   │   └── types.ts         # Type definitions
│   ├── templates/           # File templates
│   └── index.ts             # Main entry point
├── tests/                   # Test files
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── fixtures/            # Test fixtures
├── trinity/                 # Trinity Method documentation
│   ├── knowledge-base/      # Living documentation
│   ├── work-orders/         # Active work orders
│   └── sessions/            # Session artifacts
├── CHANGELOG.md             # Change log
├── CONTRIBUTING.md          # This file
├── LICENSE                  # MIT license
├── README.md                # Project overview
├── package.json             # Package configuration
└── tsconfig.json            # TypeScript configuration
```

---

## License

By contributing to Trinity Method SDK, you agree that your contributions will be licensed under the MIT License.

---

## Acknowledgments

Thank you for contributing to the Trinity Method SDK! Your efforts help improve the development experience for teams using investigation-first methodology.

For questions or clarification, please open a GitHub Discussion or contact the maintainers.
