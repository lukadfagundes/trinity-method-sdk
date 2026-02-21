# deploy-ci-cd.md

## Overview

The `deploy-ci-cd` module handles the deployment of CI/CD workflow templates to the target project. It automatically detects the Git platform (GitHub, GitLab, or generic) and deploys appropriate CI/CD configuration files.

**Module:** `src/cli/commands/deploy/ci-cd.ts`
**Purpose:** Deploy platform-specific CI/CD workflow templates
**Category:** Deployment Command
**Dependencies:**

- `deploy-ci.ts` (utility) - CI/CD template deployment logic
- `fs-extra` - File system operations
- `chalk` - Terminal output styling

---

## Main Function

### `deployCICD()`

Deploys CI/CD workflow templates based on user configuration and detected Git platform.

**Signature:**

```typescript
async function deployCICD(
  options: DeployOptions,
  spinner: Spinner,
  variables?: Record<string, string>
): Promise<number>;
```

**Parameters:**

- `options` (DeployOptions) - Deploy command options containing:
  - `ciDeploy` (boolean) - Whether CI/CD deployment is enabled
  - `yes` (boolean) - Skip confirmation prompts
  - `force` (boolean) - Force overwrite existing files
- `spinner` (Spinner) - Ora spinner instance for displaying deployment progress
- `variables` (Record<string, string>) - Optional template variables for processing (e.g., PROJECT_NAME, FRAMEWORK)

**Returns:**

```typescript
Promise<number>; // Number of CI/CD files successfully deployed
```

**Behavior:**

1. Checks if `options.ciDeploy` is enabled (returns 0 if false)
2. Calls `deployCITemplates()` utility to perform deployment
3. Displays success message with list of deployed files
4. Displays skipped files (if any already exist)
5. Displays error messages for failed deployments
6. Returns count of successfully deployed files

**Error Handling:**

- Catches all deployment errors
- Displays warning message with error details
- Returns 0 on failure (doesn't halt entire deployment)
- Uses `getErrorMessage()` to extract error messages safely

**Example Usage:**

```typescript
import { deployCICD } from './deploy-ci-cd.js';

const filesDeployed = await deployCICD(
  {
    ciDeploy: true,
    yes: false,
    force: false,
  },
  spinner,
  { PROJECT_NAME: 'MyProject', FRAMEWORK: 'Node.js' }
);

console.log(`Deployed ${filesDeployed} CI files`);
// Output: Deployed 2 CI files
```

---

## Deployment Process

### Phase 1: Git Platform Detection

**Function:** `detectGitPlatform()`

**Detection Method:**

1. Reads `.git/config` file
2. Searches for remote origin URL
3. Identifies platform based on URL patterns:
   - `github.com` → `'github'`
   - `gitlab.com` or `gitlab` → `'gitlab'`
   - No match → `'unknown'`

**Example `.git/config`:**

```ini
[remote "origin"]
  url = https://github.com/username/repo.git
  fetch = +refs/heads/*:refs/remotes/origin/*
```

**Detection Result:** `'github'`

**Fallback:**

- If `.git/config` doesn't exist → returns `'unknown'`
- If reading fails → returns `'unknown'`
- Unknown platforms default to GitHub Actions deployment

---

### Phase 2: Template Deployment

**Function:** `deployCITemplates()`

**Templates Source Directory:** `src/templates/ci/`

**Available Templates:**

- `ci.yml.template` - GitHub Actions CI workflow
- `gitlab-ci.yml` - GitLab CI configuration
- `generic-ci.yml` - Generic CI template

**Deployment Logic:**

#### GitHub Platform (`platform === 'github'` or `platform === 'unknown'`)

**Files Deployed:**

1. `.github/workflows/ci.yml` - Continuous Integration workflow
2. `trinity/templates/ci/generic-ci.yml` - Generic template for reference

**Process:**

1. Creates `.github/workflows/` directory (if doesn't exist)
2. Reads `ci.yml.template` from SDK templates
3. Processes template variables (e.g., `{{PROJECT_NAME}}` → actual project name)
4. Checks if `.github/workflows/ci.yml` already exists (skips unless `--force`)
5. Validates destination path for security
6. Writes to `.github/workflows/ci.yml`
7. Always deploys generic template to `trinity/templates/ci/`

**Typical Output:**

```
✔ CI/CD templates deployed (2 files)
  ✓ .github/workflows/ci.yml
  ✓ trinity/templates/ci/generic-ci.yml
```

---

#### GitLab Platform (`platform === 'gitlab'`)

**Files Deployed:**

1. `.gitlab-ci.yml` - GitLab CI/CD configuration
2. `trinity/templates/ci/generic-ci.yml` - Generic template for reference

**Process:**

1. Reads `gitlab-ci.yml` from SDK templates
2. Checks if `.gitlab-ci.yml` already exists
3. If exists and `options.force` is false → skips deployment
4. If force enabled or doesn't exist → deploys to `.gitlab-ci.yml`
5. Always deploys generic template to `trinity/templates/ci/`

**Typical Output:**

```
✔ CI/CD templates deployed (2 files)
  ✓ .gitlab-ci.yml
  ✓ trinity/templates/ci/generic-ci.yml
```

**Skipped Case:**

```
ℹ CI/CD templates deployed (1 file)
  ✓ trinity/templates/ci/generic-ci.yml
  Skipped:
  - .gitlab-ci.yml (already exists)
```

---

### Phase 3: Result Reporting

**Deployment Statistics:**

```typescript
interface CIDeploymentStats {
  deployed: string[]; // Successfully deployed files
  skipped: string[]; // Files skipped (already exist)
  errors: Array<{
    // Deployment errors
    file?: string;
    error?: string;
    general?: string;
  }>;
}
```

**Success Reporting:**

```typescript
if (ciStats.deployed.length > 0) {
  spinner.succeed(`CI/CD templates deployed (${ciStats.deployed.length} files)`);
  ciStats.deployed.forEach((file: string) => {
    console.log(chalk.white(`   ✓ ${file}`));
  });
}
```

**Skip Reporting:**

```typescript
if (ciStats.skipped.length > 0) {
  console.log(chalk.yellow('   Skipped:'));
  ciStats.skipped.forEach((file: string) => {
    console.log(chalk.yellow(`   - ${file}`));
  });
}
```

**Error Reporting:**

```typescript
if (ciStats.errors.length > 0) {
  spinner.warn('Some CI/CD templates failed to deploy');
  ciStats.errors.forEach((err) => {
    console.log(chalk.red(`   ✗ ${err.file || 'Error'}: ${err.error}`));
  });
}
```

---

## CI/CD Workflow Templates

### GitHub Actions CI Workflow

**File:** `.github/workflows/ci.yml`

**Purpose:** Automated testing and code quality checks on push/pull request

**Typical Workflow Steps:**

1. Checkout code
2. Setup language runtime (Node.js, Python, etc.)
3. Install dependencies
4. Run linters (ESLint, Prettier, etc.)
5. Run unit tests
6. Run integration tests
7. Generate code coverage report
8. Upload coverage to service (Codecov, Coveralls)

**Example Template:**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run linters
        run: npm run lint
      - name: Run tests
        run: npm test
```

---

### GitLab CI Configuration

**File:** `.gitlab-ci.yml`

**Purpose:** Unified CI/CD pipeline configuration for GitLab

**Typical Pipeline Stages:**

1. **Build** - Compile code, install dependencies
2. **Test** - Run automated tests
3. **Lint** - Code quality checks
4. **Deploy** - Deploy to staging/production

**Example Template:**

```yaml
stages:
  - build
  - test
  - lint
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  script:
    - npm ci
    - npm test

lint:
  stage: lint
  script:
    - npm ci
    - npm run lint

deploy:
  stage: deploy
  script:
    - npm run deploy
  only:
    - main
```

---

### Generic CI Template

**File:** `trinity/templates/ci/generic-ci.yml`

**Purpose:** Reference template for custom CI/CD setup (BitBucket, Azure DevOps, Jenkins, etc.)

**Usage:**

- Provides boilerplate configuration
- Users can copy and customize for their CI/CD platform
- Always deployed to `trinity/templates/ci/` for reference

---

## Integration with Deployment Workflow

### Called From

**Main Deploy Command:** `src/cli/commands/deploy/index.ts`

**Deployment Sequence:**

```typescript
// Step 10 of 12 in deployment workflow (optional)
if (ciDeploy) {
  spinner.start('Step 10: Deploying CI/CD workflow templates...');
  const ciFilesDeployed = await deployCICD(options, spinner);
  progress.ciFilesDeployed = ciFilesDeployed;
}
```

**Conditional Deployment:**

- Only runs if user selected CI/CD deployment during configuration
- Skipped if `options.ciDeploy` is false

**Depends On:**

- Step 3: Framework detection (determines CI/CD template variant)
- Step 4: User configuration (provides `options.ciDeploy` flag)

**Required By:**

- Step 12: Summary display (uses `progress.ciFilesDeployed`)

---

## Error Scenarios

### Missing Template Files

**Scenario:** CI/CD template files don't exist in SDK templates directory

**Behavior:**

- `fs.pathExists()` returns false for template
- Silently skips deployment (no error thrown)
- Returns 0 files deployed

**Example:**

```
ℹ No CI/CD templates deployed
```

---

### Permission Denied

**Scenario:** Cannot write to `.github/workflows/` or `.gitlab-ci.yml` (permissions issue)

**Behavior:**

- `fs.writeFile()` throws EACCES error
- Error caught and added to `stats.errors`
- Warning displayed with error message
- Returns partial deployment count (other files may succeed)

**Example:**

```
⚠ Some CI/CD templates failed to deploy
  ✗ .github/workflows/ci.yml: EACCES: permission denied
  ✓ trinity/templates/ci/generic-ci.yml
```

---

### Existing Files (Not Forced)

**Scenario:** CI workflow file already exists and `options.force` is false

**Behavior:**

- File added to `stats.skipped` array
- Not overwritten (preserves existing configuration)
- Other files still deployed
- Applies to both `.github/workflows/ci.yml` (GitHub) and `.gitlab-ci.yml` (GitLab)

**Example:**

```
✔ CI/CD templates deployed (1 file)
  ✓ trinity/templates/ci/generic-ci.yml
  Skipped:
  - .github/workflows/ci.yml (already exists)
```

**Override:**

- Use `trinity deploy --force` to overwrite existing files

---

### Git Repository Not Initialized

**Scenario:** `.git/` directory doesn't exist (not a Git repository)

**Behavior:**

- `detectGitPlatform()` returns `'unknown'`
- Defaults to GitHub Actions deployment
- Generic template deployed to `trinity/templates/ci/`

---

## Deployment Options

### `ciDeploy` Flag

**Purpose:** Enable/disable CI/CD deployment

**Configuration:**

- Set during interactive configuration prompts
- User can choose to deploy CI/CD templates or skip

**Example:**

```typescript
// Enable CI/CD deployment
const options = {
  ciDeploy: true, // Deploy CI/CD templates
  yes: false,
  force: false,
};

await deployCICD(options, spinner);
```

**Disable CI/CD deployment:**

```typescript
const options = {
  ciDeploy: false, // Skip CI/CD deployment
  yes: false,
  force: false,
};

await deployCICD(options, spinner);
// Returns 0 immediately
```

---

### `force` Flag

**Purpose:** Force overwrite existing CI/CD configuration files

**Behavior:**

- When true: Overwrites existing CI workflow files (`.github/workflows/ci.yml` or `.gitlab-ci.yml`)
- When false: Skips existing files (default)

**Example:**

```bash
# Deploy with force (overwrite existing files)
trinity deploy --force
```

---

### `yes` Flag

**Purpose:** Skip confirmation prompts (auto-accept)

**Behavior:**

- Currently unused in `deployCICD()` function
- Reserved for future confirmation prompts

---

## Security Considerations

### Path Validation

**All destination paths validated using `validatePath()`:**

```typescript
const destPath = validatePath('.github/workflows/ci.yml');
await fs.writeFile(destPath, content);
```

**Protection Against:**

- Directory traversal attacks (e.g., `../../etc/passwd`)
- Symlink attacks
- Path injection

**Example:**

```typescript
// Malicious path would throw error
const destPath = validatePath('../../etc/passwd');
// Error: Path validation failed: outside project directory
```

---

### Template Content

**Security Best Practices:**

- Templates do not contain secrets or tokens
- Secrets managed via CI/CD platform (GitHub Secrets, GitLab CI/CD Variables)
- Environment variables referenced, not hardcoded

**Example:**

```yaml
# Secure (uses secret reference)
env:
  DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}

# Insecure (hardcoded token)
env:
  DEPLOY_TOKEN: "abc123xyz"  # DON'T DO THIS
```

---

## Best Practices

### For SDK Developers

1. **Template Organization:**
   - Store templates in `src/templates/ci/`
   - Use `.template` extension for GitHub Actions templates
   - Use plain filename for GitLab CI templates

2. **Platform Detection:**
   - Always provide fallback for unknown platforms
   - Default to GitHub Actions for broadest compatibility

3. **Error Handling:**
   - Catch errors gracefully (don't fail entire deployment)
   - Provide detailed error messages with file context
   - Allow partial success (deploy what's possible)

4. **Testing:**
   - Test with GitHub, GitLab, and unknown platforms
   - Test with existing files (skip behavior)
   - Test with force flag (overwrite behavior)

---

### For End Users

1. **Platform Selection:**
   - SDK auto-detects platform from `.git/config`
   - GitHub: Gets CI workflow + generic template
   - GitLab: Gets `.gitlab-ci.yml` + generic template
   - Unknown: Gets GitHub Actions templates (most compatible)

2. **Customization:**
   - Templates are starting points (customize after deployment)
   - Add project-specific steps (database migrations, asset compilation)
   - Configure secrets via CI/CD platform UI

3. **Secrets Management:**
   - **Never commit secrets to repository**
   - Use GitHub Secrets (Settings → Secrets and variables → Actions)
   - Use GitLab CI/CD Variables (Settings → CI/CD → Variables)

4. **Workflow Testing:**
   - Test CI workflow on feature branches
   - Monitor workflow runs in CI/CD platform UI

---

## Platform Comparison

### GitHub Actions

| Aspect            | Details                                                     |
| ----------------- | ----------------------------------------------------------- |
| **Configuration** | Multiple YAML files in `.github/workflows/`                 |
| **Strengths**     | Large marketplace of actions, excellent documentation       |
| **Pricing**       | Free for public repos, generous free tier for private repos |
| **Deployment**    | 2 files (CI workflow + generic template)                    |

---

### GitLab CI/CD

| Aspect            | Details                                            |
| ----------------- | -------------------------------------------------- |
| **Configuration** | Single `.gitlab-ci.yml` file                       |
| **Strengths**     | Integrated with GitLab, powerful pipeline features |
| **Pricing**       | Free tier includes 400 CI/CD minutes/month         |
| **Deployment**    | 1 file (unified CI/CD pipeline)                    |

---

### Generic Template

| Aspect            | Details                                       |
| ----------------- | --------------------------------------------- |
| **Configuration** | Reference template in `trinity/templates/ci/` |
| **Strengths**     | Platform-agnostic, fully customizable         |
| **Pricing**       | Depends on target platform                    |
| **Deployment**    | 1 file (reference only)                       |

---

## Related Documentation

- [deploy-command.md](deploy-command.md) - Main deployment orchestration
- [deploy-ci-utils.md](deploy-ci-utils.md) - CI/CD deployment utilities (detailed)
- [configuration.md](deploy-configuration.md) - User configuration prompts
- [validate-path.md](validate-path.md) - Path security validation

---

## Version Information

**Module Version:** 2.1.0
**Last Updated:** 2026-01-21
**Status:** Production Ready
**Stability:** Stable
