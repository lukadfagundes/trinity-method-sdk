# CI/CD Deployment Utilities

**Module:** `src/cli/utils/deploy-ci.ts`
**Purpose:** CI/CD workflow generation utilities
**Category:** Deployment Utilities - CI/CD
**Priority:** MEDIUM

---

## Overview

The CI/CD Deployment Utilities module provides low-level functions for deploying CI/CD workflow templates. It handles platform detection (GitHub Actions, GitLab CI), template deployment, and statistics tracking. This module is called by the higher-level `deploy/ci-cd.ts` command.

### Key Features

- **Platform detection**: Automatically detects GitHub or GitLab from `.git/config`
- **Multi-platform support**: Deploys GitHub Actions (CI+CD) or GitLab CI
- **Generic templates**: Always deploys platform-agnostic templates
- **Path validation**: Security checks for file system operations
- **Statistics tracking**: Tracks deployed, skipped, and error files
- **Graceful error handling**: Continues deployment despite individual file failures

---

## API Reference

### `deployCITemplates(options)`

Deploys CI/CD workflow templates based on detected Git platform.

**Signature:**

```typescript
async function deployCITemplates(options?: CIDeployOptions): Promise<CIDeploymentStats>;
```

**Parameters:**

| Parameter       | Type              | Description                               |
| --------------- | ----------------- | ----------------------------------------- |
| `options`       | `CIDeployOptions` | Optional deployment options               |
| `options.yes`   | `boolean`         | Auto-confirm prompts (default: false)     |
| `options.force` | `boolean`         | Overwrite existing files (default: false) |

**Returns:** `Promise<CIDeploymentStats>` - Deployment statistics

**Side Effects:**

- Creates `.github/workflows/` directory (GitHub)
- Creates `.gitlab-ci.yml` file (GitLab)
- Creates `trinity/templates/ci/` directory (always)
- Writes workflow files to file system

---

### `detectGitPlatform()`

Detects Git platform from `.git/config`.

**Signature:**

```typescript
async function detectGitPlatform(): Promise<GitPlatform>;
```

**Returns:** `Promise<GitPlatform>` - One of: `'github'`, `'gitlab'`, or `'unknown'`

**Detection Logic:**

1. Read `.git/config`
2. Search for `github.com` → return `'github'`
3. Search for `gitlab.com` or `gitlab` → return `'gitlab'`
4. Otherwise → return `'unknown'`

---

### `deployGitLabCI(templatesPath, options, stats)`

Deploys GitLab CI template (internal helper).

**Signature:**

```typescript
async function deployGitLabCI(
  templatesPath: string,
  options: CIDeployOptions,
  stats: CIDeploymentStats
): Promise<void>;
```

**Parameters:**

| Parameter       | Type                | Description                    |
| --------------- | ------------------- | ------------------------------ |
| `templatesPath` | `string`            | Path to CI templates directory |
| `options`       | `CIDeployOptions`   | Deployment options             |
| `stats`         | `CIDeploymentStats` | Statistics object to update    |

**Returns:** `Promise<void>` - Updates `stats` object

---

## Type Definitions

### CIDeploymentStats

```typescript
interface CIDeploymentStats {
  deployed: string[]; // Successfully deployed files
  skipped: string[]; // Skipped files (already exist)
  errors: Array<{
    // Files with errors
    file?: string; // File path (if applicable)
    error?: string; // Error message (if file-specific)
    general?: string; // General error (if not file-specific)
  }>;
}
```

### CIDeployOptions

```typescript
interface CIDeployOptions {
  yes?: boolean; // Auto-confirm prompts
  force?: boolean; // Overwrite existing files
}
```

### GitPlatform

```typescript
type GitPlatform = 'github' | 'gitlab' | 'unknown';
```

---

## Deployment Logic

### Platform-Based Deployment

```
1. Detect Git Platform (detectGitPlatform)
   ├─ GitHub detected → Deploy GitHub Actions (CI + CD)
   ├─ GitLab detected → Deploy GitLab CI
   └─ Unknown → Deploy GitHub Actions (default)

2. GitHub Actions Deployment
   ├─ Create .github/workflows/ directory
   ├─ Deploy ci.yml.template → .github/workflows/ci.yml
   └─ Deploy cd.yml.template → .github/workflows/cd.yml

3. GitLab CI Deployment
   ├─ Check if .gitlab-ci.yml exists
   ├─ If exists and !force → Skip
   └─ If !exists or force → Deploy gitlab-ci.yml

4. Generic Template Deployment (always)
   ├─ Create trinity/templates/ci/ directory
   └─ Deploy generic-ci.yml → trinity/templates/ci/generic-ci.yml
```

---

## Usage Examples

### Basic Deployment

```typescript
import { deployCITemplates } from './utils/deploy-ci.js';

const stats = await deployCITemplates();

console.log('Deployed:', stats.deployed);
console.log('Skipped:', stats.skipped);
console.log('Errors:', stats.errors);
```

### Force Overwrite

```typescript
const stats = await deployCITemplates({ force: true });

// Will overwrite existing .gitlab-ci.yml if present
```

### Auto-Confirm Prompts

```typescript
const stats = await deployCITemplates({ yes: true });

// Skips user confirmation prompts (useful for CI/CD)
```

### Check Platform Detection

```typescript
import { detectGitPlatform } from './utils/deploy-ci.js';

const platform = await detectGitPlatform();

if (platform === 'github') {
  console.log('GitHub detected - will deploy GitHub Actions');
} else if (platform === 'gitlab') {
  console.log('GitLab detected - will deploy GitLab CI');
} else {
  console.log('Unknown platform - will deploy GitHub Actions (default)');
}
```

---

## Platform Detection

### GitHub Detection

**Detection Method:**

- Read `.git/config`
- Search for `github.com` in remote URL

**Example .git/config:**

```ini
[remote "origin"]
  url = https://github.com/user/repo.git
  fetch = +refs/heads/*:refs/remotes/origin/*
```

**Result:** `'github'`

---

### GitLab Detection

**Detection Method:**

- Read `.git/config`
- Search for `gitlab.com` or `gitlab` in remote URL

**Example .git/config:**

```ini
[remote "origin"]
  url = https://gitlab.com/user/repo.git
  fetch = +refs/heads/*:refs/remotes/origin/*
```

**Result:** `'gitlab'`

---

### Unknown Platform

**Triggers:**

- `.git/config` doesn't exist
- Remote URL doesn't contain `github.com` or `gitlab`
- Error reading `.git/config`

**Example:**

```ini
[remote "origin"]
  url = https://bitbucket.org/user/repo.git
```

**Result:** `'unknown'` (defaults to GitHub Actions deployment)

---

## GitHub Actions Deployment

### Files Deployed

**1. CI Workflow (`.github/workflows/ci.yml`)**

- Runs on every push and PR
- Linting, testing, building
- Automated quality checks

**2. CD Workflow (`.github/workflows/cd.yml`)**

- Runs on version tags (v*.*.\*)
- Deployment to production
- Release automation

### Template Path

```
src/cli/templates/ci/
├── ci.yml.template → .github/workflows/ci.yml
└── cd.yml.template → .github/workflows/cd.yml
```

### Deployment Process

```typescript
// 1. Ensure directory exists
await fs.ensureDir('.github/workflows');

// 2. Deploy CI workflow
const ciTemplate = path.join(templatesPath, 'ci.yml.template');
const ciContent = await fs.readFile(ciTemplate, 'utf8');
const ciDestPath = validatePath('.github/workflows/ci.yml');
await fs.writeFile(ciDestPath, ciContent);
stats.deployed.push('.github/workflows/ci.yml');

// 3. Deploy CD workflow
const cdTemplate = path.join(templatesPath, 'cd.yml.template');
const cdContent = await fs.readFile(cdTemplate, 'utf8');
const cdDestPath = validatePath('.github/workflows/cd.yml');
await fs.writeFile(cdDestPath, cdContent);
stats.deployed.push('.github/workflows/cd.yml');
```

---

## GitLab CI Deployment

### File Deployed

**GitLab CI (`.gitlab-ci.yml`)**

- Runs on every push
- Stages: test, build, deploy
- Pipeline automation

### Template Path

```
src/cli/templates/ci/
└── gitlab-ci.yml → .gitlab-ci.yml
```

### Deployment Process

```typescript
// 1. Check if file exists
const gitlabCIExists = await fs.pathExists('.gitlab-ci.yml');

// 2. Skip if exists (unless force=true)
if (gitlabCIExists && !options.force) {
  stats.skipped.push('.gitlab-ci.yml (already exists)');
  return;
}

// 3. Deploy template
const content = await fs.readFile(gitlabTemplate, 'utf8');
const destPath = validatePath('.gitlab-ci.yml');
await fs.writeFile(destPath, content);
stats.deployed.push('.gitlab-ci.yml');
```

**Key Difference from GitHub:**

- GitLab: Checks for existing file (skips if exists)
- GitHub: Always deploys (overwrites if exists)

---

## Generic Template Deployment

### Purpose

Platform-agnostic CI template for reference or manual customization.

### File Deployed

```
trinity/templates/ci/generic-ci.yml
```

**Always Deployed:**

- Regardless of platform detection
- Serves as documentation and reference
- Users can customize for their platform

### Template Path

```
src/cli/templates/ci/
└── generic-ci.yml → trinity/templates/ci/generic-ci.yml
```

---

## Path Validation

### Security Feature

```typescript
const destPath = validatePath('.github/workflows/ci.yml');
await fs.writeFile(destPath, content);
```

**Purpose:**

- Prevent path traversal attacks
- Ensure files written to safe locations
- Validate against malicious paths

**Example Blocked Paths:**

```
../../../etc/passwd        ✗ Blocked
.github/workflows/ci.yml   ✓ Allowed
```

---

## Statistics Tracking

### Example Stats Object

**Successful Deployment:**

```typescript
{
  deployed: [
    '.github/workflows/ci.yml',
    '.github/workflows/cd.yml',
    'trinity/templates/ci/generic-ci.yml'
  ],
  skipped: [],
  errors: []
}
```

**GitLab with Existing File:**

```typescript
{
  deployed: [
    'trinity/templates/ci/generic-ci.yml'
  ],
  skipped: [
    '.gitlab-ci.yml (already exists)'
  ],
  errors: []
}
```

**Deployment with Errors:**

```typescript
{
  deployed: [
    '.github/workflows/ci.yml',
    'trinity/templates/ci/generic-ci.yml'
  ],
  skipped: [],
  errors: [
    {
      file: '.github/workflows/cd.yml',
      error: 'EACCES: permission denied'
    }
  ]
}
```

---

## Error Handling

### Individual File Failures

```typescript
try {
  // Deploy CI workflow
  await fs.writeFile(destPath, content);
  stats.deployed.push('.github/workflows/ci.yml');
} catch (error: unknown) {
  // Log error, continue with other files
  stats.errors.push({
    file: '.github/workflows/ci.yml',
    error: getErrorMessage(error),
  });
}
```

**Key Behavior:**

- Individual file failures don't stop deployment
- Errors tracked in `stats.errors`
- Other files continue deploying

### General Errors

```typescript
try {
  // Entire deployment process...
  return stats;
} catch (error: unknown) {
  // Catastrophic failure
  stats.errors.push({ general: getErrorMessage(error) });
  return stats;
}
```

**When General Errors Occur:**

- Template directory not found
- File system completely inaccessible
- Unexpected exception

---

## Integration Points

### Called By

- `src/cli/commands/deploy/ci-cd.ts` - Higher-level CI/CD deployment command
- `trinity-deploy` CLI command (indirectly)

### Calls

- `validatePath()` - Path security validation (from `utils/validate-path.js`)
- `getErrorMessage()` - Error message extraction (from `utils/errors.js`)
- `fs-extra` - File system operations

### Templates Used

- `src/cli/templates/ci/ci.yml.template` - GitHub Actions CI workflow
- `src/cli/templates/ci/cd.yml.template` - GitHub Actions CD workflow
- `src/cli/templates/ci/gitlab-ci.yml` - GitLab CI pipeline
- `src/cli/templates/ci/generic-ci.yml` - Generic CI template

---

## Testing Considerations

### Unit Testing

```typescript
import { deployCITemplates, detectGitPlatform } from './deploy-ci';
import fs from 'fs-extra';

describe('deployCITemplates', () => {
  afterEach(async () => {
    await fs.remove('.github');
    await fs.remove('.gitlab-ci.yml');
    await fs.remove('trinity/templates/ci');
  });

  it('should deploy GitHub Actions for GitHub repo', async () => {
    // Mock .git/config with GitHub URL
    await fs.ensureDir('.git');
    await fs.writeFile(
      '.git/config',
      '[remote "origin"]\n  url = https://github.com/user/repo.git'
    );

    const stats = await deployCITemplates();

    expect(stats.deployed).toContain('.github/workflows/ci.yml');
    expect(stats.deployed).toContain('.github/workflows/cd.yml');
    expect(stats.deployed).toContain('trinity/templates/ci/generic-ci.yml');
  });

  it('should deploy GitLab CI for GitLab repo', async () => {
    await fs.ensureDir('.git');
    await fs.writeFile(
      '.git/config',
      '[remote "origin"]\n  url = https://gitlab.com/user/repo.git'
    );

    const stats = await deployCITemplates();

    expect(stats.deployed).toContain('.gitlab-ci.yml');
    expect(stats.deployed).toContain('trinity/templates/ci/generic-ci.yml');
  });

  it('should skip existing GitLab CI file', async () => {
    await fs.ensureDir('.git');
    await fs.writeFile(
      '.git/config',
      '[remote "origin"]\n  url = https://gitlab.com/user/repo.git'
    );
    await fs.writeFile('.gitlab-ci.yml', 'existing content');

    const stats = await deployCITemplates();

    expect(stats.skipped).toContain('.gitlab-ci.yml (already exists)');
  });

  it('should force overwrite with force option', async () => {
    await fs.ensureDir('.git');
    await fs.writeFile(
      '.git/config',
      '[remote "origin"]\n  url = https://gitlab.com/user/repo.git'
    );
    await fs.writeFile('.gitlab-ci.yml', 'existing content');

    const stats = await deployCITemplates({ force: true });

    expect(stats.deployed).toContain('.gitlab-ci.yml');
  });
});

describe('detectGitPlatform', () => {
  afterEach(async () => {
    await fs.remove('.git');
  });

  it('should detect GitHub', async () => {
    await fs.ensureDir('.git');
    await fs.writeFile(
      '.git/config',
      '[remote "origin"]\n  url = https://github.com/user/repo.git'
    );

    const platform = await detectGitPlatform();

    expect(platform).toBe('github');
  });

  it('should detect GitLab', async () => {
    await fs.ensureDir('.git');
    await fs.writeFile(
      '.git/config',
      '[remote "origin"]\n  url = https://gitlab.com/user/repo.git'
    );

    const platform = await detectGitPlatform();

    expect(platform).toBe('gitlab');
  });

  it('should return unknown for other platforms', async () => {
    await fs.ensureDir('.git');
    await fs.writeFile(
      '.git/config',
      '[remote "origin"]\n  url = https://bitbucket.org/user/repo.git'
    );

    const platform = await detectGitPlatform();

    expect(platform).toBe('unknown');
  });

  it('should return unknown if .git/config missing', async () => {
    const platform = await detectGitPlatform();

    expect(platform).toBe('unknown');
  });
});
```

---

## Performance Considerations

### Deployment Time

- **Platform detection**: ~10ms (read .git/config)
- **GitHub Actions**: ~50-100ms (2 files + directory creation)
- **GitLab CI**: ~25-50ms (1 file)
- **Generic template**: ~25-50ms (1 file + directory creation)
- **Total time**: ~100-200ms typical

### Optimization Strategies

- Parallel file writing (currently sequential)
- Cached platform detection
- Template preloading

---

## Security Considerations

### Path Validation

- All file paths validated before writing
- Prevents directory traversal attacks
- Ensures files written to safe locations

### Template Integrity

- Templates stored in SDK package (npm verified)
- No user input in template content
- Read-only template source

### File Permissions

- Creates directories with default permissions
- Writes files with standard user permissions
- No execution permissions set

---

## Related Documentation

- **CI/CD Deployment Command**: [docs/api/deploy-ci-cd.md](deploy-ci-cd.md)
- **Path Validation**: [docs/api/validate-path.md](validate-path.md)
- **Error Utilities**: [docs/api/errors.md](errors.md)
- **Deploy Command**: [docs/api/deploy-command.md](deploy-command.md)

---

## Version History

| Version | Date       | Changes                                           |
| ------- | ---------- | ------------------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with GitHub/GitLab support |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3                    |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
