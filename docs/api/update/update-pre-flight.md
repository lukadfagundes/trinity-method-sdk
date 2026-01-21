# Update Pre-flight API Reference

**Module:** `src/cli/commands/update/pre-flight.ts`
**Purpose:** Pre-update validation to ensure Trinity is deployed
**Priority:** MEDIUM (Validation)

---

## Overview

The Update Pre-flight module performs essential validation checks before allowing an update to proceed. It ensures Trinity Method SDK is properly deployed and prevents update attempts on non-deployed projects.

**Key Features:**

- Trinity deployment validation
- Agent directory verification
- Early failure detection (before backup creation)
- Clear error messages with remediation steps

---

## Core Function

### `runUpdatePreflightChecks(spinner: Ora): Promise<void>`

Validates project state before update execution.

**Parameters:**

- `spinner` (Ora) - Spinner instance for status display

**Returns:** `Promise<void>` - Resolves if all checks pass

**Throws:** `UpdateError` if any check fails

**Pre-flight Checks:**

#### Check 1: Trinity Directory Exists

**Path Checked:** `trinity/`

**Validation:**

```typescript
const trinityExists = await fs.pathExists('trinity');
if (!trinityExists) {
  spinner.fail('Trinity Method not deployed');
  displayInfo('Use: trinity deploy to install');
  throw new UpdateError('Trinity Method not deployed in this project', {
    reason: 'trinity_directory_missing',
  });
}
```

**Purpose:** Verify Trinity Method SDK is deployed in current project

**Failure Behavior:**

- Display error message
- Show remediation command (`trinity deploy`)
- Throw `UpdateError` with context

**User Messages:**

```
✗ Trinity Method not deployed
ℹ️  Use: trinity deploy to install
❌ Error: Trinity Method not deployed in this project
```

---

#### Check 2: Agent Directory Exists

**Path Checked:** `.claude/`

**Validation:**

```typescript
const claudeExists = await fs.pathExists('.claude');
if (!claudeExists) {
  spinner.fail('.claude directory not found');
  displayInfo('Trinity deployment appears incomplete');
  throw new UpdateError('.claude directory not found', {
    reason: 'claude_directory_missing',
  });
}
```

**Purpose:** Verify agent directory is present (deployment completeness check)

**Failure Behavior:**

- Display error message
- Indicate incomplete deployment
- Throw `UpdateError` with context

**User Messages:**

```
✗ .claude directory not found
ℹ️  Trinity deployment appears incomplete
❌ Error: .claude directory not found
```

---

### Example Usage

```typescript
import ora from 'ora';
import { runUpdatePreflightChecks } from './pre-flight.js';

const spinner = ora();

try {
  await runUpdatePreflightChecks(spinner);
  console.log('Pre-flight checks passed, proceeding with update...');
} catch (error) {
  console.error('Pre-flight checks failed:', error.message);
  process.exit(1);
}
```

**Spinner Messages:**

```
⠙ Running pre-flight checks...
✓ Pre-flight checks passed
```

---

## Integration with Update Command

```typescript
export async function update(options: UpdateOptions) {
  const spinner = ora();

  try {
    // STEP 1: Pre-flight checks (FIRST THING)
    await runUpdatePreflightChecks(spinner);

    // STEP 2: Version check
    const versionInfo = await detectInstalledSDKVersion(spinner);

    // STEP 3-12: Continue with update process...
  } catch (error) {
    // Pre-flight failure exits early (no rollback needed)
    throw error;
  }
}
```

**Why First?**

- Fails fast before any changes made
- No backup created yet (nothing to rollback)
- Saves time if deployment invalid

---

## Error Context

### UpdateError Structure

```typescript
throw new UpdateError('Trinity Method not deployed in this project', {
  reason: 'trinity_directory_missing',
});
```

**Error Properties:**

- `message` - Human-readable error description
- `context.reason` - Machine-readable error code
- `name` - "UpdateError" (error class name)

**Error Codes:**

- `trinity_directory_missing` - Trinity directory not found
- `claude_directory_missing` - Agent directory not found

---

## Pre-flight Check Scenarios

### Scenario 1: Fresh Project (No Deployment)

**State:**

- No `trinity/` directory
- No `.claude/` directory

**Pre-flight Result:**

```
⠙ Running pre-flight checks...
✗ Trinity Method not deployed
ℹ️  Use: trinity deploy to install
❌ Error: Trinity Method not deployed in this project
```

**User Action:** Run `trinity deploy` to install Trinity Method SDK

---

### Scenario 2: Partial Deployment (Trinity Only)

**State:**

- `trinity/` directory exists
- `.claude/` directory missing

**Pre-flight Result:**

```
⠙ Running pre-flight checks...
✗ .claude directory not found
ℹ️  Trinity deployment appears incomplete
❌ Error: .claude directory not found
```

**Cause:** Deployment interrupted or manually deleted

**User Action:** Run `trinity deploy --force` to reinstall

---

### Scenario 3: Complete Deployment

**State:**

- `trinity/` directory exists
- `.claude/` directory exists

**Pre-flight Result:**

```
⠙ Running pre-flight checks...
✓ Pre-flight checks passed
```

**Next Step:** Proceed to version check

---

### Scenario 4: Agents Only (No Trinity)

**State:**

- No `trinity/` directory
- `.claude/` directory exists (from other project)

**Pre-flight Result:**

```
⠙ Running pre-flight checks...
✗ Trinity Method not deployed
ℹ️  Use: trinity deploy to install
❌ Error: Trinity Method not deployed in this project
```

**Cause:** `.claude/` directory from another project or manual creation

**User Action:** Run `trinity deploy` to install Trinity Method SDK

---

## Directory Validation Details

### Trinity Directory Structure Expected

```
trinity/
├── agents/
├── commands/
├── knowledge-base/
├── templates/
├── sessions/
├── investigations/
├── work-orders/
└── VERSION
```

**Pre-flight Check:** Only verifies `trinity/` directory exists, not contents

**Rationale:** Contents validated during update verification (post-update)

---

### Agent Directory Structure Expected

```
.claude/
├── agents/
│   ├── leadership/
│   ├── planning/
│   └── aj-team/
├── commands/
└── prompts/
```

**Pre-flight Check:** Only verifies `.claude/` directory exists, not contents

**Rationale:** Contents validated during update verification (post-update)

---

## Error Handling

### Early Exit

**Pre-flight failures exit before:**

- Backup creation (no backup to clean up)
- Version detection (no network calls made)
- Any file modifications (project untouched)

**Benefits:**

- Fast failure (immediate feedback)
- No cleanup required
- No rollback needed

---

### Error Recovery

**For `trinity_directory_missing`:**

```bash
trinity deploy
```

**For `claude_directory_missing`:**

```bash
trinity deploy --force
```

**Why `--force`?**

- Partial deployment may have corrupted files
- Force flag ensures clean reinstall

---

## Testing Recommendations

### Unit Tests

```typescript
describe('runUpdatePreflightChecks', () => {
  it('should pass with complete deployment', async () => {
    await fs.ensureDir('trinity');
    await fs.ensureDir('.claude');

    await expect(runUpdatePreflightChecks(ora())).resolves.toBeUndefined();
  });

  it('should fail if trinity directory missing', async () => {
    fs.removeSync('trinity');
    await fs.ensureDir('.claude');

    await expect(runUpdatePreflightChecks(ora())).rejects.toThrow(
      'Trinity Method not deployed in this project'
    );
  });

  it('should fail if .claude directory missing', async () => {
    await fs.ensureDir('trinity');
    fs.removeSync('.claude');

    await expect(runUpdatePreflightChecks(ora())).rejects.toThrow('.claude directory not found');
  });

  it('should fail if both directories missing', async () => {
    fs.removeSync('trinity');
    fs.removeSync('.claude');

    await expect(runUpdatePreflightChecks(ora())).rejects.toThrow(
      'Trinity Method not deployed in this project'
    );
  });
});
```

---

### Integration Tests

```typescript
describe('update pre-flight integration', () => {
  it('should prevent update without deployment', async () => {
    fs.removeSync('trinity');
    fs.removeSync('.claude');

    await expect(update({})).rejects.toThrow('Trinity Method not deployed');
  });

  it('should allow update with complete deployment', async () => {
    await fs.ensureDir('trinity');
    await fs.ensureDir('.claude');
    await fs.writeFile('trinity/VERSION', '2.0.0');

    await expect(update({})).resolves.toBeUndefined();
  });
});
```

---

## Performance Considerations

**File System Operations:**

- 2 directory existence checks (`fs.pathExists()`)
- No file reads (existence only)

**Typical Performance:** <5ms

**Optimization:** Checks run sequentially (could be parallelized, but minimal gain)

---

## Known Limitations

1. **No Content Validation:**
   - Only checks directory existence, not contents
   - Empty directories pass pre-flight checks

2. **No VERSION File Check:**
   - Doesn't verify `trinity/VERSION` exists
   - VERSION check performed in version detection step

3. **No Permission Check:**
   - Doesn't verify read/write permissions
   - Permission errors detected during update

4. **No Git Check:**
   - Doesn't verify Git repository (recommended but not required)
   - Git check could prevent update in non-Git projects

---

## Future Enhancements

### Planned Improvements

- [ ] Content validation (verify critical files exist)
- [ ] VERSION file existence check
- [ ] Permission verification (read/write access)
- [ ] Git repository check (warn if not using Git)
- [ ] Deployment health check (verify all agents present)
- [ ] Disk space check (ensure sufficient space for update)
- [ ] Network connectivity check (if update requires download)

---

## Security Considerations

### Path Validation

**Current Implementation:** Uses `fs.pathExists()` with relative paths

**Security:**

- No user input involved (hardcoded paths)
- No path traversal risk
- Safe for current implementation

**Future Consideration:** If user-configurable paths added, use `validatePath()`

---

## Related Documentation

- **Update Command:** [docs/api/update-command.md](update-command.md) - Main update orchestration
- **Deploy Command:** [docs/api/deploy-command.md](deploy-command.md) - Initial deployment (remediation)
- **Update Verification:** [docs/api/update-verification.md](update-verification.md) - Post-update content validation
- **Error Classes:** [docs/api/error-classes.md](error-classes.md) - UpdateError definition

---

## Pre-flight Check Flow Diagram

```
runUpdatePreflightChecks(spinner)
    ↓
[Check 1] trinity/ directory exists?
    ├→ No → Fail
    │       ├→ Display: "Trinity Method not deployed"
    │       ├→ Display: "Use: trinity deploy to install"
    │       └→ Throw UpdateError (reason: trinity_directory_missing)
    └→ Yes → Continue
    ↓
[Check 2] .claude/ directory exists?
    ├→ No → Fail
    │       ├→ Display: ".claude directory not found"
    │       ├→ Display: "Trinity deployment appears incomplete"
    │       └→ Throw UpdateError (reason: claude_directory_missing)
    └→ Yes → Continue
    ↓
SUCCESS: Pre-flight checks passed
    ↓
Proceed to version check
```

---

## Comparison: Pre-flight vs. Verification

| Aspect            | Pre-flight Checks          | Verification Checks             |
| ----------------- | -------------------------- | ------------------------------- |
| **When**          | Before update starts       | After update completes          |
| **Purpose**       | Validate deployment exists | Validate update success         |
| **Scope**         | 2 directory checks         | 7 path checks + VERSION content |
| **Failure**       | Early exit (no rollback)   | Triggers rollback               |
| **Performance**   | <5ms                       | 10-20ms                         |
| **Error Context** | UpdateError                | Generic Error                   |

**Pre-flight checks:** "Is Trinity deployed?"
**Verification checks:** "Did the update work correctly?"

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready)
