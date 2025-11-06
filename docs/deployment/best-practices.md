# Trinity SDK Deployment Best Practices

**Deployment Philosophy and Validation Patterns**
**Trinity Method SDK v2.0**
**Last Updated:** 2025-11-05

---

## Overview

Deploying Trinity Method SDK requires more than copying files—it requires systematic validation, idempotent operations, and comprehensive user feedback. This guide captures deployment philosophy and best practices.

---

## The Bootstrap Philosophy

### Core Principles

**1. Fail Fast, Fail Clearly**
```bash
set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

# Clear error messages
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install Node.js 18+ before continuing."
    exit 1
fi
```

**2. Idempotent Operations**
```bash
# Safe to run multiple times
mkdir -p trinity/knowledge-base    # Creates if missing, no error if exists
cp -n template.md target.md         # Copy only if target doesn't exist
```

**3. User Feedback at Every Step**
```bash
echo "🔍 Checking prerequisites..."
echo "✅ Node.js 18.x detected"
echo "⚠️  Git not configured - will skip hooks"
echo "📁 Creating folder structure..."
echo "✅ Folder structure created (2.3s)"
```

**4. Validation Before and After**
```bash
# Before deployment
validate_prerequisites

# During deployment
validate_each_step

# After deployment
validate_complete_installation
```

---

## Deployment Stages

### Stage 1: Pre-Deployment Validation

**Check before making any changes:**

```typescript
async function validatePrerequisites(): Promise<ValidationResult> {
  const checks = [
    checkNodeVersion(),      // Node 18+
    checkNpmAvailable(),     // npm or yarn
    checkGitInstalled(),     // git (optional but recommended)
    checkDiskSpace(),        // ≥100MB free
    checkWritePermissions(), // Can write to directory
  ];

  const results = await Promise.all(checks);
  const failures = results.filter(r => !r.passed);

  if (failures.length > 0) {
    console.error('❌ Prerequisites not met:');
    failures.forEach(f => console.error(`  - ${f.message}`));
    return { passed: false, failures };
  }

  console.log('✅ All prerequisites met');
  return { passed: true };
}
```

**Example Output:**
```
🔍 Checking prerequisites...
✅ Node.js 18.17.0 detected
✅ npm 9.6.7 available
✅ git 2.41.0 installed
✅ Disk space: 2.3 GB free
✅ Write permissions: OK
```

---

### Stage 2: Folder Structure Creation

**Create with validation:**

```typescript
async function createFolderStructure(projectRoot: string): Promise<void> {
  const folders = [
    'trinity/',
    'trinity/knowledge-base/',
    'trinity/investigations/',
    'trinity/design-docs/',
    'trinity/work-orders/',
    'trinity/sessions/',
    'trinity/audits/',
    'trinity/learning/patterns/',
    'trinity/learning/strategies/',
    'trinity/learning/metrics/',
    'trinity/cache/',
    '.claude/agents/leadership/',
    '.claude/agents/planning/',
    '.claude/agents/execution/',
    '.claude/agents/support/',
    '.claude/agents/deployment/',
    '.claude/agents/audit/',
    '.claude/commands/',
    '.claude/hooks/',
  ];

  console.log('📁 Creating folder structure...');
  const startTime = Date.now();

  for (const folder of folders) {
    const fullPath = path.join(projectRoot, folder);
    await fs.mkdir(fullPath, { recursive: true });
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Folder structure created (${duration}s)`);

  // Validate
  await validateFolderStructure(projectRoot, folders);
}

async function validateFolderStructure(
  root: string,
  expected: string[]
): Promise<void> {
  const missing = [];

  for (const folder of expected) {
    const fullPath = path.join(root, folder);
    try {
      await fs.access(fullPath);
    } catch {
      missing.push(folder);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing folders: ${missing.join(', ')}`);
  }
}
```

---

### Stage 3: File Deployment

**Deploy with checksums:**

```typescript
interface FileDeployment {
  source: string;
  destination: string;
  mode?: number; // File permissions (e.g., 0o755 for executable)
  required: boolean;
}

async function deployFiles(
  deployments: FileDeployment[]
): Promise<DeploymentResult[]> {
  const results: DeploymentResult[] = [];

  for (const deployment of deployments) {
    try {
      // Check if file already exists
      const exists = await fileExists(deployment.destination);

      if (exists) {
        console.log(`⚠️  ${deployment.destination} already exists, skipping`);
        results.push({ file: deployment.destination, status: 'skipped' });
        continue;
      }

      // Copy file
      await fs.copyFile(deployment.source, deployment.destination);

      // Set permissions if specified
      if (deployment.mode) {
        await fs.chmod(deployment.destination, deployment.mode);
      }

      // Verify deployment
      await verifyFileDeployment(deployment.source, deployment.destination);

      console.log(`✅ Deployed: ${deployment.destination}`);
      results.push({ file: deployment.destination, status: 'deployed' });
    } catch (error) {
      if (deployment.required) {
        throw new Error(
          `Failed to deploy required file: ${deployment.destination}`
        );
      }

      console.warn(`⚠️  Optional file failed: ${deployment.destination}`);
      results.push({ file: deployment.destination, status: 'failed' });
    }
  }

  return results;
}

async function verifyFileDeployment(
  source: string,
  destination: string
): Promise<void> {
  const [sourceStat, destStat] = await Promise.all([
    fs.stat(source),
    fs.stat(destination),
  ]);

  // Verify file size matches
  if (sourceStat.size !== destStat.size) {
    throw new Error('File size mismatch after deployment');
  }

  // Verify content matches (checksum)
  const [sourceChecksum, destChecksum] = await Promise.all([
    calculateChecksum(source),
    calculateChecksum(destination),
  ]);

  if (sourceChecksum !== destChecksum) {
    throw new Error('File content mismatch after deployment');
  }
}
```

---

### Stage 4: Template Processing

**Variable substitution with validation:**

```typescript
interface TemplateVariables {
  PROJECT_NAME: string;
  TECH_STACK: string;
  FRAMEWORK: string;
  SOURCE_DIR: string;
  DEPLOYMENT_DATE: string;
}

async function processTemplate(
  templatePath: string,
  outputPath: string,
  variables: TemplateVariables
): Promise<void> {
  // Read template
  const template = await fs.readFile(templatePath, 'utf8');

  // Validate all required variables present
  const requiredVars = extractRequiredVariables(template);
  const missing = requiredVars.filter(v => !(v in variables));

  if (missing.length > 0) {
    throw new Error(`Missing required variables: ${missing.join(', ')}`);
  }

  // Replace variables
  let processed = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, value);
  }

  // Verify no unreplaced variables
  const unreplaced = processed.match(/{{(\w+)}}/g);
  if (unreplaced) {
    throw new Error(`Unreplaced variables found: ${unreplaced.join(', ')}`);
  }

  // Write processed template
  await fs.writeFile(outputPath, processed, 'utf8');

  console.log(`✅ Processed template: ${path.basename(outputPath)}`);
}

function extractRequiredVariables(template: string): string[] {
  const matches = template.matchAll(/{{(\w+)}}/g);
  return Array.from(matches, m => m[1]);
}
```

---

### Stage 5: Dependency Installation

**Install with retry logic:**

```typescript
async function installDependencies(
  packageManager: 'npm' | 'yarn' | 'pnpm' = 'npm'
): Promise<void> {
  const commands = {
    npm: 'npm install --save-dev @trinity-method/sdk',
    yarn: 'yarn add -D @trinity-method/sdk',
    pnpm: 'pnpm add -D @trinity-method/sdk',
  };

  const command = commands[packageManager];
  console.log(`📦 Installing Trinity SDK via ${packageManager}...`);

  try {
    await execWithRetry(command, {
      maxRetries: 3,
      retryDelay: 5000, // 5 seconds
      timeout: 120000, // 2 minutes
    });

    console.log('✅ Trinity SDK installed');

    // Verify installation
    await verifyDependencyInstalled('@trinity-method/sdk');
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error.message}`);
  }
}

async function execWithRetry(
  command: string,
  options: RetryOptions
): Promise<void> {
  let attempts = 0;

  while (attempts < options.maxRetries) {
    try {
      await exec(command, { timeout: options.timeout });
      return; // Success
    } catch (error) {
      attempts++;

      if (attempts === options.maxRetries) {
        throw error; // Give up
      }

      console.warn(
        `⚠️  Attempt ${attempts} failed, retrying in ${options.retryDelay}ms...`
      );
      await sleep(options.retryDelay);
    }
  }
}

async function verifyDependencyInstalled(packageName: string): Promise<void> {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

    const installed =
      packageJson.dependencies?.[packageName] ||
      packageJson.devDependencies?.[packageName];

    if (!installed) {
      throw new Error(`${packageName} not found in package.json`);
    }

    console.log(`✅ Verified: ${packageName}@${installed}`);
  } catch (error) {
    throw new Error(`Dependency verification failed: ${error.message}`);
  }
}
```

---

### Stage 6: Hook Installation

**Install with platform detection:**

```typescript
async function installHooks(): Promise<void> {
  console.log('🪝 Installing hooks...');

  // Check if pre-commit is available
  const hasPreCommit = await checkCommandExists('pre-commit');

  if (!hasPreCommit) {
    console.log('📦 Installing pre-commit framework...');

    // Platform-specific installation
    if (process.platform === 'win32') {
      await exec('pip install pre-commit');
    } else if (process.platform === 'darwin') {
      await exec('brew install pre-commit');
    } else {
      await exec('pip3 install pre-commit');
    }
  }

  // Install hooks
  await exec('pre-commit install');

  // Verify hooks installed
  const gitHooksPath = path.join(process.cwd(), '.git', 'hooks', 'pre-commit');
  const hookExists = await fileExists(gitHooksPath);

  if (!hookExists) {
    throw new Error('Pre-commit hook not installed');
  }

  console.log('✅ Hooks installed successfully');
}

async function checkCommandExists(command: string): Promise<boolean> {
  try {
    await exec(`${command} --version`);
    return true;
  } catch {
    return false;
  }
}
```

---

### Stage 7: Baseline Establishment

**Establish with benchmarks:**

```typescript
async function establishBaseline(): Promise<void> {
  console.log('📊 Establishing quality baseline...');

  const baseline = {
    timestamp: new Date().toISOString(),
    lint: await runLinting(),
    build: await runBuild(),
    tests: await runTests(),
    coverage: await runCoverage(),
    performance: await runPerformanceBenchmark(),
  };

  // Save baseline
  const baselinePath = path.join(
    process.cwd(),
    'trinity',
    'baselines',
    `${new Date().toISOString().split('T')[0]}-initial.json`
  );

  await fs.mkdir(path.dirname(baselinePath), { recursive: true });
  await fs.writeFile(baselinePath, JSON.stringify(baseline, null, 2), 'utf8');

  console.log(`✅ Baseline established: ${baselinePath}`);

  // Display summary
  displayBaselineSummary(baseline);
}

function displayBaselineSummary(baseline: Baseline): void {
  console.log('\n📊 Baseline Summary:');
  console.log(`  Lint errors: ${baseline.lint.errors}`);
  console.log(`  Build status: ${baseline.build.success ? '✅' : '❌'}`);
  console.log(`  Tests passed: ${baseline.tests.passed}/${baseline.tests.total}`);
  console.log(`  Coverage: ${baseline.coverage.percent.toFixed(1)}%`);
  console.log(`  Response time (p95): ${baseline.performance.p95}ms`);
}
```

---

### Stage 8: Post-Deployment Validation

**Comprehensive verification:**

```typescript
async function validateDeployment(): Promise<ValidationReport> {
  console.log('🔍 Validating deployment...');

  const checks = [
    { name: 'Folder structure', fn: validateFolders },
    { name: 'Agent files', fn: validateAgents },
    { name: 'Knowledge base', fn: validateKnowledgeBase },
    { name: 'Context hierarchy', fn: validateContextHierarchy },
    { name: 'Linting configuration', fn: validateLinting },
    { name: 'Hooks', fn: validateHooks },
    { name: 'Learning system', fn: validateLearningSystem },
    { name: 'Baseline', fn: validateBaseline },
    { name: 'Git integration', fn: validateGitIntegration },
  ];

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      await check.fn();
      console.log(`✅ [${passed + 1}/${checks.length}] ${check.name}`);
      results.push({ check: check.name, status: 'passed' });
      passed++;
    } catch (error) {
      console.error(`❌ [${passed + failed + 1}/${checks.length}] ${check.name}`);
      console.error(`   ${error.message}`);
      results.push({ check: check.name, status: 'failed', error: error.message });
      failed++;
    }
  }

  const report = {
    passed,
    failed,
    total: checks.length,
    results,
    success: failed === 0,
  };

  if (report.success) {
    console.log('\n✅ Trinity Method SDK Verified Successfully\n');
  } else {
    console.log(
      `\n⚠️  ${failed} validation check(s) failed. Please review and fix.\n`
    );
  }

  return report;
}
```

---

## Idempotent Operations

### Pattern 1: Safe Directory Creation

```bash
# Bash
mkdir -p trinity/knowledge-base

# TypeScript
await fs.mkdir('trinity/knowledge-base', { recursive: true });
```

**Result:** Creates if missing, no error if exists

---

### Pattern 2: Conditional File Copy

```bash
# Bash - Copy only if target doesn't exist
cp -n source.md target.md

# TypeScript
if (!(await fileExists(targetPath))) {
  await fs.copyFile(sourcePath, targetPath);
}
```

**Result:** Safe to run multiple times

---

### Pattern 3: Append Once

```bash
# Bash - Add content only if not already present
if ! grep -q "TRINITY_HOME" ~/.bashrc; then
  echo 'export TRINITY_HOME="/path/to/trinity"' >> ~/.bashrc
fi

# TypeScript
const bashrc = await fs.readFile(bashrcPath, 'utf8');
if (!bashrc.includes('TRINITY_HOME')) {
  await fs.appendFile(bashrcPath, '\nexport TRINITY_HOME="/path/to/trinity"\n');
}
```

**Result:** Multiple runs don't duplicate content

---

## User Feedback Patterns

### Pattern 1: Progress Indicators

```typescript
// Simple progress
console.log('🔍 Checking prerequisites...');
console.log('✅ Prerequisites verified');

// Detailed progress
console.log('[1/5] Creating folder structure...');
console.log('[2/5] Deploying agent files...');
console.log('[3/5] Installing dependencies...');
console.log('[4/5] Configuring hooks...');
console.log('[5/5] Establishing baseline...');

// With timing
const start = Date.now();
console.log('📦 Installing dependencies...');
await installDependencies();
const duration = ((Date.now() - start) / 1000).toFixed(1);
console.log(`✅ Dependencies installed (${duration}s)`);
```

---

### Pattern 2: Visual Hierarchy

```
┌─────────────────────────────────────────────────────┐
│   Trinity Method SDK Deployment Complete!          │
└─────────────────────────────────────────────────────┘

✓ Folder structure created
✓ 18 AI agents deployed
✓ Knowledge Base initialized
✓ CLAUDE.md hierarchy established
✓ Linting configured (ESLint + Prettier)
✓ Hooks installed (pre-commit, session-start, session-end)
✓ Quality baseline established
✓ Initial audit completed

Next Steps:
1. Review: trinity/audits/2025-11-05-initial-deployment.md
2. Customize: CLAUDE.md with project-specific instructions
3. Start work: /trinity-plan or /trinity-workorder

Documentation: https://docs.trinity-method.dev
Support: https://github.com/trinity-method/sdk/issues

Total deployment time: 3m 8s
```

---

## Rollback Strategy

**Always provide rollback capability:**

```typescript
class DeploymentTransaction {
  private actions: DeploymentAction[] = [];
  private rollbackStack: RollbackAction[] = [];

  async execute(action: DeploymentAction): Promise<void> {
    this.actions.push(action);

    try {
      await action.execute();
      this.rollbackStack.push(action.getRollback());
    } catch (error) {
      console.error(`❌ Action failed: ${action.name}`);
      await this.rollback();
      throw error;
    }
  }

  async rollback(): Promise<void> {
    console.log('🔄 Rolling back deployment...');

    while (this.rollbackStack.length > 0) {
      const rollback = this.rollbackStack.pop()!;

      try {
        await rollback();
        console.log(`✅ Rolled back: ${rollback.name}`);
      } catch (error) {
        console.error(`⚠️  Rollback failed: ${rollback.name}`);
        // Continue rolling back despite failures
      }
    }

    console.log('✅ Rollback complete');
  }
}

// Usage
const transaction = new DeploymentTransaction();

try {
  await transaction.execute(createFoldersAction);
  await transaction.execute(deployAgentsAction);
  await transaction.execute(installDependenciesAction);
  await transaction.execute(establishBaselineAction);
} catch (error) {
  // Rollback automatically called on failure
  console.error('Deployment failed and has been rolled back');
}
```

---

## Related Documentation

- [Deploy Workflow](../workflows/deploy-workflow.md) - Step-by-step deployment process
- [Commands Reference](../commands/README.md) - CLI commands for deployment
- [Universal Principles](../methodology/universal-principles.md) - Agent-agnostic deployment

---

**Trinity SDK Deployment: Validate. Deploy. Verify. Ship with confidence.**
