# Deploy Pre-flight Validation

**Module:** `src/cli/commands/deploy/pre-flight.ts`
**Purpose:** Environment validation before Trinity deployment
**Dependencies:** fs-extra, chalk

---

## Overview

The Pre-flight module performs essential validation checks before Trinity deployment begins. It prevents accidental redeployment and ensures the target environment is ready for Trinity installation.

**Why This Exists:**
Deploying Trinity twice to the same project without user intent can overwrite custom configurations and user-created content. Pre-flight checks prevent accidental overwrites while allowing intentional redeployment through the `--force` flag.

---

## Main Function

### `checkPreFlight(options: DeployOptions, spinner: Spinner): Promise<void>`

Validates environment and deployment state before proceeding.

**Parameters:**

| Parameter       | Type            | Required | Description                                           |
| --------------- | --------------- | -------- | ----------------------------------------------------- |
| `options`       | `DeployOptions` | Yes      | Deployment command options                            |
| `options.force` | `boolean`       | No       | Allow redeployment over existing Trinity installation |
| `spinner`       | `Spinner` (Ora) | Yes      | Spinner instance for progress display                 |

**Returns:** `Promise<void>` - Resolves if checks pass

**Throws:**

- Error when Trinity already deployed and `--force` not used
  - Message: "Trinity already deployed. Use --force to redeploy."

---

## Validation Checks

### Check 1: Existing Trinity Deployment Detection

**Purpose:** Detect if Trinity is already deployed in the target project

**Detection Method:**

```typescript
const trinityExists = await fs.pathExists('trinity');
```

**Checks for:** Existence of `trinity/` directory in current working directory

---

## Behavior Matrix

| Trinity Exists | --force Flag | Behavior                                     |
| -------------- | ------------ | -------------------------------------------- |
| No             | No           | ✅ Proceed with deployment                   |
| No             | Yes          | ✅ Proceed with deployment (--force ignored) |
| Yes            | No           | ❌ Throw error, show --force instructions    |
| Yes            | Yes          | ✅ Proceed with redeployment, show warning   |

---

## Error Handling

### Scenario 1: Trinity Already Deployed (No --force)

**Condition:** `trinity/` directory exists, `--force` flag not provided

**Output:**

```
❌ Running pre-flight checks...

Trinity Method is already deployed in this project.

Use --force flag to redeploy (this will overwrite existing files):
  npx trinity deploy --force
```

**Error Thrown:** `Error: Trinity already deployed. Use --force to redeploy.`

**Exit Code:** Non-zero (deployment stops)

---

### Scenario 2: Force Redeployment

**Condition:** `trinity/` directory exists, `--force` flag provided

**Output:**

```
⠸ Force flag detected - will overwrite existing deployment...
✔ Pre-flight checks passed
```

**Behavior:** Deployment continues, existing files will be overwritten

**Note:** User-created content in the following directories is preserved:

- `trinity/sessions/` (not overwritten)
- `trinity/work-orders/WORKORDER-*.md` (user work orders preserved)
- `trinity/investigations/*/` (user investigations preserved)

---

### Scenario 3: Fresh Installation

**Condition:** `trinity/` directory does not exist

**Output:**

```
✔ Pre-flight checks passed
```

**Behavior:** Deployment proceeds to next step

---

## Spinner Status Updates

The function updates the spinner with different messages:

### Starting Check

```typescript
spinner.start('Running pre-flight checks...');
```

**Display:** `⠸ Running pre-flight checks...`

---

### Force Flag Detected

```typescript
spinner.text = 'Force flag detected - will overwrite existing deployment...';
```

**Display:** `⠸ Force flag detected - will overwrite existing deployment...`

---

### Success

```typescript
spinner.succeed('Pre-flight checks passed');
```

**Display:** `✔ Pre-flight checks passed`

---

### Failure

```typescript
spinner.fail();
```

**Display:** `❌ Running pre-flight checks...`

---

## Usage Examples

### Example 1: Fresh Deployment (No Trinity Exists)

```bash
npx trinity deploy
```

**Pre-flight Output:**

```
✔ Pre-flight checks passed
```

**Result:** Deployment continues

---

### Example 2: Attempted Redeployment (No --force)

```bash
npx trinity deploy
```

**Pre-flight Output:**

```
❌ Running pre-flight checks...

Trinity Method is already deployed in this project.

Use --force flag to redeploy (this will overwrite existing files):
  npx trinity deploy --force
```

**Result:** Deployment stops, error thrown

---

### Example 3: Force Redeployment

```bash
npx trinity deploy --force
```

**Pre-flight Output:**

```
⠸ Force flag detected - will overwrite existing deployment...
✔ Pre-flight checks passed
```

**Result:** Deployment continues, existing Trinity files overwritten

---

### Example 4: CI/CD Automated Deployment

```bash
npx trinity deploy --yes --force
```

**Pre-flight Output:**

```
⠸ Force flag detected - will overwrite existing deployment...
✔ Pre-flight checks passed
```

**Result:** Non-interactive deployment with forced redeployment

---

## What Gets Overwritten with --force

### Files That Are Overwritten:

- ✅ `.claude/agents/*.md` (19 agent templates)
- ✅ `.claude/commands/*.md` (20 slash command templates)
- ✅ `.claude/settings.json` (Claude Code configuration)
- ✅ `.claude/EMPLOYEE-DIRECTORY.md` (agent directory)
- ✅ `trinity/knowledge-base/*.md` (8 knowledge base templates)
- ✅ `trinity/templates/**/*` (all template files)
- ✅ `trinity/CLAUDE.md` (Trinity context)
- ✅ `CLAUDE.md` (root context)
- ✅ `src/CLAUDE.md` (source context)
- ✅ `VERSION` (Trinity version tracking)

### Files/Directories That Are Preserved:

- ❌ `trinity/sessions/**/*` (user session data)
- ❌ `trinity/work-orders/WORKORDER-*.md` (user work orders, except template)
- ❌ `trinity/investigations/*/` (user investigations, except template)
- ❌ `trinity/reports/**/*` (user-generated reports)
- ❌ Project files outside Trinity structure (package.json, src/, etc.)

---

## Integration with Deploy Workflow

Pre-flight checks are Step 1 of the 12-step deployment workflow:

```typescript
// STEP 1: Pre-flight checks
await checkPreFlight(options, spinner);

// STEP 2: Detect technology stack
const stack = await detectStack();

// ... (remaining 10 steps)
```

**Position in Workflow:** First validation before any file system modifications

**Purpose:** Fast-fail if deployment cannot proceed

---

## Performance Considerations

### Execution Time

- **Check duration:** <10ms (single file system check)
- **Total overhead:** Negligible (~0.01% of deployment time)

### File System Operations

- **Read operations:** 1 (check if `trinity/` exists)
- **Write operations:** 0 (validation only)

---

## Error Recovery

### When Pre-flight Fails

**Caught by:** Deploy command's main try-catch block

```typescript
try {
  await checkPreFlight(options, spinner);
} catch (error) {
  // Error display and exit
  displayError(`Deployment failed: ${error.message}`);
  throw error;
}
```

**User Experience:**

1. Spinner fails (❌)
2. Error message displayed
3. Help text shown (--force instructions)
4. Process exits with non-zero code

---

## Design Rationale

### Why Check for trinity/ Directory?

**Options Considered:**

1. ❌ Check for `VERSION` file - Can be deleted accidentally
2. ❌ Check for `.claude/` directory - May exist from other tools
3. ✅ Check for `trinity/` directory - Unique to Trinity Method SDK

**Chosen Approach:** Check for `trinity/` directory existence

- Most reliable indicator of Trinity deployment
- Least likely to have false positives
- Core directory that must exist in all Trinity projects

---

### Why Require --force Flag?

**Without --force requirement:**

- Risk: Users accidentally redeploy and lose work
- Risk: Automation scripts overwrite without warning

**With --force requirement:**

- Benefit: Explicit user intent required
- Benefit: Clear error message with solution
- Benefit: Protects user work by default

---

## Future Enhancements

Potential additional pre-flight checks (not currently implemented):

### Node.js Version Check

```typescript
// Check Node.js version (not implemented)
const nodeVersion = process.version;
if (!semver.satisfies(nodeVersion, '>=14.0.0')) {
  throw new Error('Node.js 14+ required');
}
```

### Git Repository Check

```typescript
// Check for Git repository (not implemented)
const gitExists = await fs.pathExists('.git');
if (!gitExists) {
  console.warn('Warning: No Git repository detected');
}
```

### Package.json Validation

```typescript
// Check for valid package.json (not implemented)
const pkgExists = await fs.pathExists('package.json');
if (!pkgExists) {
  throw new Error('No package.json found');
}
```

**Note:** These checks are not currently implemented but could be added in future versions.

---

## Related Documentation

- **Deploy Command:** [deploy-command.md](deploy-command.md)
- **Configuration Prompts:** [deploy-configuration.md](deploy-configuration.md)
- **Update Pre-flight:** [update-pre-flight.md](update-pre-flight.md)

---

## Type Definitions

### DeployOptions (Relevant Fields)

```typescript
interface DeployOptions {
  force?: boolean; // Allow redeployment over existing Trinity
  dryRun?: boolean; // Not used in pre-flight (deployment simulation)
  yes?: boolean; // Not used in pre-flight (skip prompts)
}
```

### Spinner (Ora)

```typescript
interface Spinner {
  start(text?: string): Spinner; // Start spinner with message
  succeed(text?: string): Spinner; // Show success checkmark
  fail(text?: string): Spinner; // Show failure X
  text: string; // Current spinner message
}
```

---

## Security Considerations

### Directory Traversal Protection

The pre-flight check uses `fs.pathExists('trinity')` which:

- ✅ Resolves relative to current working directory
- ✅ Does not accept absolute paths or `..` traversal
- ✅ Safe from path injection attacks

**No Additional Validation Needed:** Node.js `fs` module handles path normalization

---

## Testing Recommendations

### Unit Tests

```typescript
describe('checkPreFlight', () => {
  it('should pass when trinity does not exist', async () => {
    // Mock fs.pathExists to return false
    await expect(checkPreFlight(options, spinner)).resolves.toBeUndefined();
  });

  it('should throw when trinity exists without --force', async () => {
    // Mock fs.pathExists to return true
    await expect(checkPreFlight(options, spinner)).rejects.toThrow('Trinity already deployed');
  });

  it('should pass when trinity exists with --force', async () => {
    // Mock fs.pathExists to return true
    options.force = true;
    await expect(checkPreFlight(options, spinner)).resolves.toBeUndefined();
  });
});
```

---

**Last Updated:** 2026-01-21
**Trinity SDK Version:** 2.1.0
**Maintained By:** APO-2 (Documentation Specialist)
