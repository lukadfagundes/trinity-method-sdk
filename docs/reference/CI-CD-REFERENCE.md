# CI/CD Quick Reference

**Trinity Method SDK v2.0.8**
**EIN (CI/CD Specialist)**

---

## Quick Links

- **CI Workflow:** `.github/workflows/ci.yml`
- **Full Guide:** [CI-CD-GUIDE.md](../guides/CI-CD-GUIDE.md)
- **Actions Dashboard:** `https://github.com/{user}/{repo}/actions`
- **npm Package:** [trinity-method-sdk](https://www.npmjs.com/package/trinity-method-sdk)

---

## CI Pipeline Jobs

| Job                  | Description                       | Trigger        | Duration |
| -------------------- | --------------------------------- | -------------- | -------- |
| `validate-templates` | Validate 19 agents, 19+ commands  | All pushes/PRs | ~1 min   |
| `test`               | Multi-platform testing (9 combos) | All pushes/PRs | ~15 min  |
| `coverage`           | Enforce ≥80% coverage             | All pushes/PRs | ~3 min   |
| `quality`            | Linting, type checking            | All pushes/PRs | ~2 min   |
| `build`              | Build validation                  | All pushes/PRs | ~2 min   |
| `docs`               | Documentation validation          | All pushes/PRs | ~2 min   |
| `success-check`      | Final validation                  | All pushes/PRs | ~1 min   |

**Total Execution Time:** ~20-25 minutes (jobs run in parallel)

---

## BAS Quality Gates

| Phase | Job                  | Validation             | Threshold         |
| ----- | -------------------- | ---------------------- | ----------------- |
| 1     | `quality`            | Linting, type checking | No errors         |
| 2     | `validate-templates` | Structure validation   | All required dirs |
| 3     | `build`              | Build artifacts        | Build succeeds    |
| 4     | `test`               | All tests pass         | 100% pass rate    |
| 5     | `coverage`           | Test coverage          | ≥80% all metrics  |
| 6     | `docs`               | Documentation          | All docs present  |

---

## Trinity Component Validation

| Component       | Count | Location                                | Validation                    |
| --------------- | ----- | --------------------------------------- | ----------------------------- |
| Agent Templates | 19    | `src/templates/agents/`                 | File count, structure         |
| Slash Commands  | 19+   | `src/templates/shared/claude-commands/` | File count, critical commands |
| Knowledge Base  | 4+    | `src/templates/knowledge-base/`         | Required files                |
| CI/CD Templates | 1     | `src/templates/ci/`                     | ci.yml                        |

---

## Platform Matrix

| Platform | Node.js Versions | Test Types                          |
| -------- | ---------------- | ----------------------------------- |
| Ubuntu   | 18.x, 20.x, 22.x | Unit, Integration, E2E, Performance |
| Windows  | 18.x, 20.x, 22.x | Unit, Integration, E2E, Performance |
| macOS    | 18.x, 20.x, 22.x | Unit, Integration, E2E, Performance |

**Total Test Runs:** 36 (9 platforms × 4 test types)

---

## npm Scripts

### Testing

```bash
npm test                      # Run all tests
npm run test:unit            # Unit tests only
npm run test:integration     # Integration tests only
npm run test:e2e             # E2E tests only
npm run test:performance     # Performance tests only
npm run test:coverage        # Run tests with coverage
npm run test:watch           # Watch mode
```

### Code Quality

```bash
npm run lint                 # Run ESLint
npm run lint:fix             # Auto-fix linting issues
npm run type-check           # TypeScript type checking
npm run format               # Format code with Prettier
npm run format:check         # Check formatting
```

### Build

```bash
npm run clean                # Clean dist directory
npm run build                # Build TypeScript + copy templates
npm run copy-templates       # Copy templates to dist
```

### Documentation

```bash
npm run docs:generate        # Generate TypeDoc documentation
```

### Deployment

```bash
npm version patch            # Bump patch version (2.0.0 → 2.0.1)
npm version minor            # Bump minor version (2.0.0 → 2.1.0)
npm version major            # Bump major version (2.0.0 → 3.0.0)
npm publish                  # Publish to npm (use CD pipeline instead)
```

---

## Common Commands

### Local Development

```bash
# Full local validation (mimics CI)
npm ci && \
npm run lint && \
npm run type-check && \
npm run build && \
npm run test:coverage

# Quick check before commit
npm test && npm run lint

# Build and test
npm run build && npm test
```

### Deployment

```bash
# Release workflow (recommended)
# 1. Update CHANGELOG.md with new version
# 2. Bump version
npm version patch

# 3. Push with tags
git push origin main --tags

# Alternative: Manual workflow dispatch
# Go to: Actions → Trinity CD Pipeline → Run workflow
```

### Troubleshooting

```bash
# Clean and rebuild
npm run clean && npm ci && npm run build

# Run specific test file
npm test -- path/to/test.test.ts

# Run tests with verbose output
npm test -- --verbose

# Check coverage for specific file
npm run test:coverage -- path/to/file.ts
```

---

## Environment Variables

### CI Environment

| Variable       | Description                   | Set By         |
| -------------- | ----------------------------- | -------------- |
| `CI`           | Indicates CI environment      | GitHub Actions |
| `GITHUB_TOKEN` | GitHub authentication         | Auto-generated |
| `NODE_ENV`     | Environment (test/production) | Workflow       |

### CD Environment

| Variable       | Description              | Required       |
| -------------- | ------------------------ | -------------- |
| `NPM_TOKEN`    | npm authentication token | Yes (secret)   |
| `GITHUB_TOKEN` | GitHub authentication    | Auto-generated |

---

## Workflow Triggers

### CI Triggers

```yaml
on:
  push:
    branches: [main, dev, testing]
  pull_request:
    branches: [main, dev]
```

**Triggered by:**

- Direct push to `main`, `dev`, or `testing`
- Opening a PR to `main` or `dev`
- Pushing to PR branch

### CD Triggers

```yaml
on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:
    inputs:
      version: { required: true }
      dry_run: { default: false }
```

**Triggered by:**

- Pushing version tag (e.g., `v2.0.0`)
- Manual workflow dispatch

---

## Coverage Thresholds

```javascript
{
  "lines": 80,      // Minimum 80% line coverage
  "branches": 80,   // Minimum 80% branch coverage
  "functions": 80,  // Minimum 80% function coverage
  "statements": 80  // Minimum 80% statement coverage
}
```

**Enforcement:** Hard fail in CI if any metric falls below 80%

---

## Artifact Retention

| Artifact             | Retention | Size Limit |
| -------------------- | --------- | ---------- |
| Test results         | 30 days   | N/A        |
| Coverage reports     | 30 days   | N/A        |
| Build artifacts (CI) | 7 days    | N/A        |
| Build artifacts (CD) | 90 days   | N/A        |
| Documentation        | 30 days   | N/A        |

---

## Status Badges

### CI Status

```markdown
![CI](https://github.com/{user}/{repo}/workflows/Trinity%20CI%20Pipeline/badge.svg)
```

### Coverage

```markdown
[![codecov](https://codecov.io/gh/{user}/{repo}/branch/main/graph/badge.svg)](https://codecov.io/gh/{user}/{repo})
```

### npm Version

```markdown
[![npm version](https://badge.fury.io/js/trinity-method-sdk.svg)](https://www.npmjs.com/package/trinity-method-sdk)
```

---

## Failure Thresholds

| Metric         | Threshold | Action       |
| -------------- | --------- | ------------ |
| Test failures  | 0         | Block merge  |
| Coverage       | <80%      | Block merge  |
| Linting errors | >0        | Warning only |
| Build errors   | >0        | Block merge  |
| Type errors    | >0        | Block merge  |

---

## Branch Protection

**Recommended for `main` branch:**

- ✅ Require pull request reviews (1+)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Include administrators
- ✅ Require linear history (optional)

**Required Status Checks:**

- `validate-templates`
- `test`
- `coverage`
- `quality`
- `build`
- `docs`
- `success-check`

---

## Key Metrics

| Metric              | Target  | Current            |
| ------------------- | ------- | ------------------ |
| CI Success Rate     | ≥95%    | Monitor in Actions |
| Test Execution Time | <5 min  | ~15 min (parallel) |
| Coverage            | ≥80%    | Enforced           |
| Build Time          | <2 min  | ~2 min             |
| Deployment Time     | <10 min | ~10 min            |

---

## Security Scanning

```yaml
- name: Run npm audit
  run: npm audit --audit-level=moderate
  continue-on-error: true

- name: Run dependency check
  run: npx depcheck
  continue-on-error: true
```

**Audit Levels:**

- `low` - All vulnerabilities
- `moderate` - Moderate and above (default in CI)
- `high` - High and critical only
- `critical` - Critical only

---

## Debugging CI Failures

### View Logs

1. Go to: Actions → Select workflow run
2. Click on failed job
3. Expand failed step
4. Review error output

### Re-run Jobs

```bash
# Re-run failed jobs only
Actions → Workflow run → Re-run failed jobs

# Re-run all jobs
Actions → Workflow run → Re-run all jobs
```

### Local Debugging

```bash
# Install act (GitHub Actions local runner)
brew install act  # macOS
choco install act  # Windows

# Run workflow locally
act push

# Run specific job
act push -j test
```

---

## Emergency Procedures

### Skip CI Checks (Emergency Only)

```bash
# Merge with admin privileges
# Use only for critical hotfixes
git push origin main --force
```

**WARNING:** Only use in emergencies. Always prefer fixing CI issues.

### Rollback Deployment

```bash
# Unpublish from npm (within 72 hours)
npm unpublish trinity-method-sdk@2.0.8

# Or deprecate version
npm deprecate trinity-method-sdk@2.0.8 "Critical bug, use 2.0.0"

# Delete GitHub release
gh release delete v2.0.8 --yes
```

---

## Support

**Issues:** https://github.com/{user}/{repo}/issues
**Discussions:** https://github.com/{user}/{repo}/discussions
**Documentation:** [CI-CD-GUIDE.md](../guides/CI-CD-GUIDE.md)

---

**Trinity Version:** 2.0.8
**Last Updated:** 2026-01-02
**Maintained by:** EIN (CI/CD Specialist)
