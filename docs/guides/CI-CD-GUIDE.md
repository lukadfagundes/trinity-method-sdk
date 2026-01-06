# Trinity Method SDK - CI/CD Guide

**Version:** 2.0.4
**Last Updated:** 2026-01-02
**Maintained by:** EIN (CI/CD Specialist)

---

## Overview

Trinity Method SDK uses a comprehensive CI/CD pipeline that enforces BAS 6-phase quality gates, validates all Trinity components, and ensures 80%+ test coverage across multiple platforms.

## Table of Contents

1. [CI Pipeline Overview](#ci-pipeline-overview)
2. [BAS Quality Gates](#bas-quality-gates)
3. [Trinity Component Validation](#trinity-component-validation)
4. [Multi-Platform Testing](#multi-platform-testing)
5. [Coverage Requirements](#coverage-requirements)
6. [Publishing Process](#publishing-process)
7. [Troubleshooting](#troubleshooting)

---

## CI Pipeline Overview

**File:** `.github/workflows/ci.yml`
**Triggers:**

- Push to `main`, `dev`, or `testing` branches
- Pull requests to `main` or `dev`

### Pipeline Jobs

1. **validate-templates** - Validates all Trinity templates (19 agents, 19+ commands)
2. **test** - Multi-platform, multi-version testing (Ubuntu, Windows, macOS × Node.js 18/20/22)
3. **coverage** - Enforces ≥80% test coverage (BAS Phase 5)
4. **quality** - Code quality checks (BAS Phase 1)
5. **build** - Build validation (BAS Phase 3)
6. **docs** - Documentation validation (BAS Phase 6)
7. **success-check** - Final validation summary

### Execution Flow

```
validate-templates
      ├── quality (BAS Phase 1)
      │   └── build (BAS Phase 3)
      │       └── docs (BAS Phase 6)
      └── test (BAS Phase 4)
          └── coverage (BAS Phase 5)
                  └── success-check
```

---

## BAS Quality Gates

Trinity Method SDK enforces all 6 BAS quality phases:

### Phase 1: Code Quality (Linting)

**Job:** `quality`
**Validates:**

- ESLint compliance
- TypeScript type checking
- Code formatting (Prettier)
- TypeScript strict mode enabled

**Commands:**

```bash
npm run lint
npm run type-check
npm run format:check
```

### Phase 2: Structure Validation

**Included in:** `validate-templates`
**Validates:**

- Required directories exist (src, tests, trinity, .claude)
- package.json has required scripts
- Project structure follows Trinity conventions

### Phase 3: Build Validation

**Job:** `build`
**Validates:**

- TypeScript compilation succeeds
- Build artifacts generated in `dist/`
- CLI entry point exists
- Templates copied to dist
- TypeScript declarations generated

**Commands:**

```bash
npm run build
```

### Phase 4: Testing (All Tests Pass)

**Job:** `test`
**Validates:**

- All unit tests pass
- All integration tests pass
- All E2E tests pass
- Performance tests pass
- Tests pass on all platforms (Ubuntu, Windows, macOS)
- Tests pass on all Node.js versions (18.x, 20.x, 22.x)

**Commands:**

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:performance
```

### Phase 5: Coverage Check (≥80%)

**Job:** `coverage`
**Validates:**

- Line coverage ≥80%
- Branch coverage ≥80%
- Function coverage ≥80%
- Statement coverage ≥80%

**Commands:**

```bash
npm run test:coverage
```

**Enforcement:**

```javascript
// Coverage thresholds enforced in CI
if (lines < 80 || branches < 80 || functions < 80 || statements < 80) {
  process.exit(1); // Fail CI
}
```

### Phase 6: Documentation

**Job:** `docs`
**Validates:**

- API documentation generated (TypeDoc)
- README.md completeness
- Required documentation files exist
- Documentation structure follows conventions

**Commands:**

```bash
npm run docs:generate
```

---

## Trinity Component Validation

The CI pipeline validates all Trinity Method components:

### 1. Agent Templates (19 agents)

**Location:** `src/templates/agents/`
**Validated:**

- Leadership (2): ALY (CTO), AJ (Maestro)
- Planning (4): MON, TRA, EUS, ROR
- AJ Team (7): KIL, BAS, DRA, APO, BON, CAP, URO
- Deployment (4): TAN, ZEN, INO, EIN
- Audit (1): JUNO

**Validation:**

```bash
# Count agent templates
agent_count=$(find src/templates/agents -name "*.md.template" | wc -l)

if [ "$agent_count" -lt 19 ]; then
  echo "ERROR: Expected 19 agent templates, found $agent_count"
  exit 1
fi
```

### 2. Slash Command Templates (19+ commands)

**Location:** `src/templates/shared/claude-commands/`
**Critical Commands Validated:**

- `trinity-init` - Initialize Trinity Method
- `trinity-start` - Start new work session
- `trinity-orchestrate` - Multi-agent orchestration
- `trinity-audit` - Quality audit
- `trinity-docs` - Documentation generation

**Validation:**

```bash
# Count slash commands
cmd_count=$(find src/templates/shared/claude-commands -name "*.md.template" | wc -l)

if [ "$cmd_count" -lt 19 ]; then
  echo "ERROR: Expected 19+ slash commands, found $cmd_count"
  exit 1
fi
```

### 3. Knowledge Base Templates

**Location:** `src/templates/knowledge-base/`
**Required Templates:**

- `ARCHITECTURE.md.template`
- `CODING-PRINCIPLES.md.template`
- `TESTING-PRINCIPLES.md.template`
- `DOCUMENTATION-CRITERIA.md.template`

### 4. CI/CD Templates

**Location:** `src/templates/ci/`
**Required Templates:**

- `ci.yml.template` - CI workflow

### 5. Template Placeholders

**Validated Placeholders:**

- `{{PROJECT_NAME}}`
- `{{FRAMEWORK}}`
- `{{TRINITY_VERSION}}`
- `{{TIMESTAMP}}`

---

## Multi-Platform Testing

Trinity Method SDK is tested across multiple platforms and Node.js versions to ensure universal compatibility.

### Platform Matrix

| Platform       | Node.js Versions | Status |
| -------------- | ---------------- | ------ |
| Ubuntu Latest  | 18.x, 20.x, 22.x | ✅     |
| Windows Latest | 18.x, 20.x, 22.x | ✅     |
| macOS Latest   | 18.x, 20.x, 22.x | ✅     |

**Total Combinations:** 9 (3 platforms × 3 Node.js versions)

### Test Types Per Platform

1. **Unit Tests** (5 min timeout)
2. **Integration Tests** (5 min timeout)
3. **E2E Tests** (10 min timeout)
4. **Performance Tests** (5 min timeout)

### Platform-Specific Considerations

**Windows:**

- Path separators (`\` vs `/`)
- Line endings (CRLF vs LF)
- Case-insensitive file system

**macOS:**

- Case-sensitive by default
- Different file system (APFS)

**Ubuntu:**

- Default Linux environment
- Case-sensitive file system

---

## Coverage Requirements

### Minimum Thresholds

| Metric     | Threshold | Enforcement     |
| ---------- | --------- | --------------- |
| Lines      | ≥80%      | Hard fail in CI |
| Branches   | ≥80%      | Hard fail in CI |
| Functions  | ≥80%      | Hard fail in CI |
| Statements | ≥80%      | Hard fail in CI |

### Coverage Reports

**Generated Reports:**

- `coverage/lcov.info` - LCOV format (Codecov)
- `coverage/coverage-summary.json` - JSON summary
- `coverage/index.html` - HTML report

**Codecov Integration:**

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    file: ./coverage/lcov.info
    flags: unittests
    fail_ci_if_error: false
```

### Viewing Coverage Locally

```bash
# Run tests with coverage
npm run test:coverage

# Open HTML report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

---

## Publishing Process

### 1. Pre-Publishing Checklist

- [ ] All tests passing locally (`npm test`)
- [ ] Coverage ≥80% (`npm run test:coverage`)
- [ ] CHANGELOG.md updated with new version
- [ ] Documentation updated
- [ ] Git committed and pushed to main

### 2. Manual Publishing Workflow

```bash
# 1. Update version
npm version patch  # 2.0.0 → 2.0.1
npm version minor  # 2.0.0 → 2.1.0
npm version major  # 2.0.0 → 3.0.0

# 2. Build and publish
npm run build
npm publish --access public

# 3. Create git tag and push
git tag -a v2.0.1 -m "Release v2.0.1"
git push origin main --follow-tags
```

### 3. Automated Pre-Publish Checks

The `prepublishOnly` script runs automatically before every publish:

1. TypeScript compilation (`npm run build`)
2. Template copying to dist/
3. Full test suite execution (`npm run test`)
4. Only publishes if all checks pass

### 4. Post-Publishing Verification

```bash
# Verify package is available on npm
npm view trinity-method-sdk@2.0.4

# Install and test
npm install -g trinity-method-sdk@2.0.4
trinity --version

# Test deployment
trinity deploy --dry-run
```

---

## Troubleshooting

### CI Failures

#### Template Validation Failed

**Error:** Expected 19 agent templates, found X

**Solution:**

```bash
# Count templates
find src/templates/agents -name "*.md.template"

# Check for missing templates
ls -la src/templates/agents/leadership/
ls -la src/templates/agents/planning/
ls -la src/templates/agents/aj-team/
ls -la src/templates/agents/deployment/
ls -la src/templates/agents/audit/
```

#### Coverage Below Threshold

**Error:** Line coverage X% is below 80% threshold

**Solution:**

```bash
# Run coverage locally
npm run test:coverage

# View detailed report
open coverage/index.html

# Add tests for uncovered files
# Focus on files with <80% coverage
```

#### Build Artifacts Missing

**Error:** Templates not copied to dist

**Solution:**

```bash
# Check build script in package.json
npm run build

# Verify copy-templates script
node -e "const fs=require('fs-extra'); fs.copySync('src/templates', 'dist/templates');"

# Verify dist directory
ls -la dist/templates/
```

#### Platform-Specific Test Failures

**Error:** Tests pass on Ubuntu, fail on Windows

**Solution:**

```bash
# Check path separators
path.join() instead of manual path concatenation

# Check line endings
git config core.autocrlf true  # Windows
git config core.autocrlf input  # macOS/Linux

# Check file system case sensitivity
Use consistent casing for file names
```

### CD Failures

#### Version Mismatch

**Error:** Version mismatch - Tag: 2.0.4, package.json: 2.0.0

**Solution:**

```bash
# Update package.json version
npm version 2.0.4 --no-git-tag-version

# Commit changes
git add package.json
git commit -m "Bump version to 2.0.4"

# Create tag
git tag v2.0.4
git push origin --tags
```

#### npm Publish Failed

**Error:** 401 Unauthorized

**Solution:**

```bash
# Re-authenticate with npm
npm login

# Try publishing again
npm publish --access public
```

**Error:** 403 Forbidden / Version already exists

**Solution:**

```bash
# Bump version and try again
npm version patch
npm run build
npm publish --access public
```

#### Git Tag Creation Failed

**Error:** Release already exists

**Solution:**

```bash
# Delete existing release (GitHub UI)
# Or use gh CLI
gh release delete v2.0.4 --yes

# Re-run workflow
```

### Performance Issues

#### Tests Timeout

**Error:** Test exceeded timeout of 5 minutes

**Solution:**

```bash
# Increase timeout in jest.config.js
testTimeout: 30000  # 30 seconds per test

# Or in specific test file
jest.setTimeout(60000);  # 60 seconds

# Optimize slow tests
# Use mocks for external dependencies
# Parallelize test execution
```

#### Build Takes Too Long

**Solution:**

```bash
# Use build cache
npm ci  # Instead of npm install

# Parallelize builds
tsc --build --force  # Force rebuild

# Clean and rebuild
npm run clean
npm run build
```

---

## Best Practices

### 1. Local Testing Before Push

```bash
# Run full test suite
npm test

# Run coverage check
npm run test:coverage

# Run linter
npm run lint

# Run type check
npm run type-check

# Build project
npm run build
```

### 2. Commit Message Conventions

```
feat: Add new slash command template
fix: Resolve template validation issue
docs: Update CI/CD guide
test: Add coverage for deploy command
chore: Update dependencies
```

### 3. Branch Protection Rules

**Recommended Settings:**

- Require pull request reviews before merging
- Require status checks to pass (all CI jobs)
- Require branches to be up to date before merging
- Include administrators in restrictions

### 4. Release Cadence

- **Patch releases** (2.0.x): Bug fixes, minor improvements
- **Minor releases** (2.x.0): New features, backward compatible
- **Major releases** (x.0.0): Breaking changes, major refactors

### 5. Monitoring CI/CD Health

- Track CI success rate (target: ≥95%)
- Monitor test execution time (target: <5 min)
- Monitor coverage trends
- Review failed builds weekly

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [Jest Coverage Documentation](https://jestjs.io/docs/configuration#collectcoverage-boolean)
- [Trinity Method SDK README](../../README.md)
- [BAS Quality Gates](../reference/BAS-QUALITY-GATES.md)

---

**Maintained by:** EIN (CI/CD Specialist)
**Trinity Version:** 2.0.4
**Last Updated:** 2026-01-02
