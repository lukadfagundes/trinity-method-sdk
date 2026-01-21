# Update Verification API Reference

**Module:** `src/cli/commands/update/verification.ts`
**Purpose:** Verify update success and file integrity after update
**Priority:** MEDIUM (Quality assurance)

---

## Overview

The Update Verification module ensures that Trinity Method SDK updates were applied successfully. It performs post-update integrity checks, verifies critical files exist, and confirms VERSION file was updated correctly.

**Key Features:**

- 7 critical path verification checks
- VERSION file content validation
- Directory existence verification
- Update integrity confirmation
- Rollback trigger on failure

---

## Core Functions

### `verifyUpdateDeployment(spinner: Ora, expectedVersion: string): Promise<void>`

Verifies update deployment success with comprehensive checks.

**Parameters:**

- `spinner` (Ora) - Spinner instance for status display
- `expectedVersion` (string) - Expected version after update (e.g., "2.1.0")

**Returns:** `Promise<void>` - Resolves if verification passes

**Throws:** `Error` if any verification check fails

**Verification Process:**

#### Step 1: Path Existence Checks

**Checks Performed:**

```typescript
const VERIFICATION_CHECKS = [
  { path: 'trinity/VERSION', desc: 'Version file' },
  { path: '.claude/agents/leadership', desc: 'Leadership agents' },
  { path: '.claude/agents/planning', desc: 'Planning agents' },
  { path: '.claude/agents/aj-team', desc: 'AJ team agents' },
  { path: '.claude/commands', desc: 'Slash commands' },
  { path: 'trinity/templates', desc: 'Work order templates' },
  { path: 'trinity/knowledge-base/Trinity.md', desc: 'Trinity knowledge base' },
];
```

**Check Logic:**

```typescript
for (const check of VERIFICATION_CHECKS) {
  if (!(await fs.pathExists(check.path))) {
    spinner.fail(`Verification failed: ${check.desc} missing`);
    throw new Error(`Update verification failed: ${check.path} not found`);
  }
}
```

**Purpose:** Ensure all critical deployment directories and files exist

---

#### Step 2: VERSION File Content Verification

**Check Logic:**

```typescript
const versionPath = 'trinity/VERSION';
const updatedVersion = (await fs.readFile(versionPath, 'utf8')).trim();

if (updatedVersion !== expectedVersion) {
  spinner.fail('Version file not updated correctly');
  throw new Error(
    `Version verification failed: expected ${expectedVersion}, got ${updatedVersion}`
  );
}
```

**Purpose:** Confirm VERSION file contains expected version string

**Failure Scenario:**

- Expected: `"2.1.0"`
- Actual: `"2.0.0"` (update didn't write VERSION file)
- Result: Verification fails, rollback triggered

---

### Example Usage

```typescript
import ora from 'ora';
import { verifyUpdateDeployment } from './verification.js';

const spinner = ora();
const expectedVersion = '2.1.0';

try {
  await verifyUpdateDeployment(spinner, expectedVersion);
  console.log('Update verified successfully!');
} catch (error) {
  console.error('Verification failed:', error.message);
  // Rollback triggered by update command
}
```

**Spinner Messages:**

```
⠙ Verifying update...
✓ Verification passed
```

---

### `updateVersionFile(spinner: Ora, version: string): Promise<void>`

Updates VERSION file with new version string.

**Parameters:**

- `spinner` (Ora) - Spinner instance for status display
- `version` (string) - Version string to write (e.g., "2.1.0")

**Returns:** `Promise<void>` - Resolves when VERSION file updated

**Update Process:**

1. **Path Validation**

   ```typescript
   const destPath = validatePath('trinity/VERSION');
   ```

   - Uses `validatePath()` for security
   - Prevents path traversal attacks

2. **Write VERSION File**
   ```typescript
   await fs.writeFile(destPath, version);
   ```

   - Overwrites existing VERSION file
   - No newline added (version string only)

**Example Usage:**

```typescript
import { updateVersionFile } from './verification.js';

await updateVersionFile(spinner, '2.1.0');
// trinity/VERSION now contains "2.1.0"
```

**Spinner Messages:**

```
⠙ Updating version file...
✓ Version file updated
```

---

## Verification Checks Detailed

### Check 1: Version File

**Path:** `trinity/VERSION`
**Description:** Version file
**Criticality:** HIGH

**Rationale:** VERSION file is authoritative source for installed version

**Failure Impact:** Cannot determine installed version, future updates broken

---

### Check 2: Leadership Agents

**Path:** `.claude/agents/leadership`
**Description:** Leadership agents
**Criticality:** HIGH

**Contents:**

- `mon.md` - Project Orchestrator
- `aj.md` - Engineering Manager

**Rationale:** Core leadership agents required for Trinity Method orchestration

**Failure Impact:** Project orchestration broken, Trinity workflow non-functional

---

### Check 3: Planning Agents

**Path:** `.claude/agents/planning`
**Description:** Planning agents
**Criticality:** MEDIUM

**Contents:**

- `atlas.md` - Architecture Specialist
- `juno.md` - Audit Specialist
- `lux.md` - Planning Specialist

**Rationale:** Planning agents required for investigation and design workflows

**Failure Impact:** Investigation workflows broken, architecture planning unavailable

---

### Check 4: AJ Team Agents

**Path:** `.claude/agents/aj-team`
**Description:** AJ team agents
**Criticality:** HIGH

**Contents:**

- `kil.md` - Task Executor
- `raz.md` - QA Specialist
- `vex.md` - Debugging Specialist
- `apo.md` - Documentation Specialist

**Rationale:** Implementation team required for code execution and quality assurance

**Failure Impact:** Implementation workflows broken, cannot execute tasks

---

### Check 5: Slash Commands

**Path:** `.claude/commands`
**Description:** Slash commands
**Criticality:** MEDIUM

**Contents:**

- Custom slash commands for Trinity workflows
- Investigation commands
- Work order commands

**Rationale:** Slash commands provide quick access to Trinity workflows

**Failure Impact:** Command shortcuts unavailable, manual workflow invocation required

---

### Check 6: Work Order Templates

**Path:** `trinity/templates`
**Description:** Work order templates
**Criticality:** MEDIUM

**Contents:**

- Investigation templates
- Work order templates
- Session templates

**Rationale:** Templates required for structured Trinity workflows

**Failure Impact:** Cannot create investigations or work orders, manual document creation required

---

### Check 7: Trinity Knowledge Base

**Path:** `trinity/knowledge-base/Trinity.md`
**Description:** Trinity knowledge base
**Criticality:** HIGH

**Contents:**

- Trinity Method methodology
- Workflow protocols
- Quality standards

**Rationale:** Core Trinity Method documentation

**Failure Impact:** Agents lack Trinity Method context, workflows may not follow protocol

---

## Integration with Update Command

```typescript
export async function update(options: UpdateOptions) {
  const spinner = ora();

  try {
    // Steps 1-9: Pre-flight, backup, update components, restore

    // Step 10: Update VERSION file
    await updateVersionFile(spinner, versionInfo.latestVersion);

    // Step 11: Verification
    await verifyUpdateDeployment(spinner, versionInfo.latestVersion);

    // Step 12: Cleanup backup
    await cleanupBackup(backupDir, spinner);

    // SUCCESS
    displayUpdateSummary();
  } catch (error) {
    // Verification failure triggers rollback
    await rollbackFromBackup(backupDir);
    throw error;
  }
}
```

---

## Error Scenarios

### Scenario 1: Missing Directory

**Cause:** Component update failed (e.g., network error during agent deployment)

**Verification Check:**

```typescript
if (!(await fs.pathExists('.claude/agents/leadership'))) {
  throw new Error('Update verification failed: .claude/agents/leadership not found');
}
```

**Result:** Verification fails, rollback triggered

**User Message:**

```
✗ Verification failed: Leadership agents missing
❌ Update failed - Rolling back changes...
```

---

### Scenario 2: VERSION File Not Updated

**Cause:** `updateVersionFile()` failed silently

**Verification Check:**

```typescript
const updatedVersion = (await fs.readFile('trinity/VERSION', 'utf8')).trim();
if (updatedVersion !== expectedVersion) {
  throw new Error(`Version verification failed: expected 2.1.0, got 2.0.0`);
}
```

**Result:** Verification fails, rollback triggered

**User Message:**

```
✗ Version file not updated correctly
❌ Update failed - Rolling back changes...
```

---

### Scenario 3: Corrupted VERSION File

**Cause:** Disk error during write, file permissions issue

**Verification Check:**

```typescript
const updatedVersion = (await fs.readFile('trinity/VERSION', 'utf8')).trim();
// updatedVersion is empty or garbled
if (updatedVersion !== expectedVersion) {
  throw new Error(`Version verification failed: expected 2.1.0, got `);
}
```

**Result:** Verification fails, rollback triggered

---

### Scenario 4: Partial Update

**Cause:** Update process interrupted (e.g., Ctrl+C during update)

**Verification Check:** Multiple checks fail (missing directories + VERSION mismatch)

**Result:** Verification fails, rollback triggered

**User Message:**

```
✗ Verification failed: Leadership agents missing
✗ Verification failed: Planning agents missing
✗ Version file not updated correctly
❌ Update failed - Rolling back changes...
```

---

## Verification Coverage

### What's Verified

✅ **Critical Directories:**

- `.claude/agents/leadership`
- `.claude/agents/planning`
- `.claude/agents/aj-team`
- `.claude/commands`
- `trinity/templates`

✅ **Critical Files:**

- `trinity/VERSION`
- `trinity/knowledge-base/Trinity.md`

✅ **VERSION Content:**

- Correct version string written

---

### What's NOT Verified

❌ **Individual Agent Files:**

- Assumes directory existence = all agents present
- No per-agent file check (e.g., `mon.md`, `aj.md`)

❌ **File Content Integrity:**

- No checksum verification
- No content validation

❌ **Directory Permissions:**

- Assumes files are readable/writable
- No permission check

❌ **Template Content:**

- Assumes templates directory exists
- No individual template verification

❌ **User Content:**

- No verification of restored user sessions/investigations

---

## Performance Considerations

**Verification Checks:**

- 7 path existence checks (`fs.pathExists()`)
- 1 file read (`fs.readFile()` for VERSION)
- All operations async (non-blocking)

**Typical Performance:** 10-20ms

**Optimization:** Checks run sequentially (could be parallelized)

---

## Testing Recommendations

### Unit Tests

```typescript
describe('verifyUpdateDeployment', () => {
  it('should pass verification with all checks', async () => {
    // Setup: Create all required directories and files
    await fs.ensureDir('.claude/agents/leadership');
    await fs.ensureDir('.claude/agents/planning');
    await fs.ensureDir('.claude/agents/aj-team');
    await fs.ensureDir('.claude/commands');
    await fs.ensureDir('trinity/templates');
    await fs.writeFile('trinity/VERSION', '2.1.0');
    await fs.writeFile('trinity/knowledge-base/Trinity.md', '# Trinity');

    await expect(verifyUpdateDeployment(ora(), '2.1.0')).resolves.toBeUndefined();
  });

  it('should fail if directory missing', async () => {
    fs.removeSync('.claude/agents/leadership');

    await expect(verifyUpdateDeployment(ora(), '2.1.0')).rejects.toThrow(
      'Update verification failed: .claude/agents/leadership not found'
    );
  });

  it('should fail if VERSION file incorrect', async () => {
    await fs.writeFile('trinity/VERSION', '2.0.0');

    await expect(verifyUpdateDeployment(ora(), '2.1.0')).rejects.toThrow(
      'Version verification failed: expected 2.1.0, got 2.0.0'
    );
  });
});

describe('updateVersionFile', () => {
  it('should write version to VERSION file', async () => {
    await updateVersionFile(ora(), '2.1.0');

    const content = await fs.readFile('trinity/VERSION', 'utf8');
    expect(content).toBe('2.1.0');
  });

  it('should overwrite existing VERSION file', async () => {
    await fs.writeFile('trinity/VERSION', '2.0.0');
    await updateVersionFile(ora(), '2.1.0');

    const content = await fs.readFile('trinity/VERSION', 'utf8');
    expect(content).toBe('2.1.0');
  });
});
```

---

## Known Limitations

1. **No Per-File Verification:**
   - Only checks directory existence, not individual files
   - Corrupted individual agent files not detected

2. **No Checksum Verification:**
   - Cannot detect file corruption
   - Cannot verify file integrity

3. **No Permission Checks:**
   - Assumes files are readable/writable
   - Permission errors detected only on access

4. **No Content Validation:**
   - VERSION file content not validated (could be garbage)
   - Trinity.md content not validated

5. **Sequential Checks:**
   - Checks run in sequence (slower)
   - Could be parallelized for performance

---

## Future Enhancements

### Planned Improvements

- [ ] Per-agent file verification (check all 19 agent files)
- [ ] Checksum verification (SHA-256 hashes)
- [ ] Content validation (validate VERSION format, Trinity.md structure)
- [ ] Permission verification (check read/write permissions)
- [ ] Parallel verification checks (performance)
- [ ] Detailed verification report (which checks passed/failed)
- [ ] Repair mode (attempt to fix failed checks without full rollback)

---

## Security Considerations

### Path Validation

**Function:** `updateVersionFile()` uses `validatePath()`

**Purpose:** Prevent path traversal attacks

**Example:**

```typescript
// Safe: Validates path is within project directory
const destPath = validatePath('trinity/VERSION');

// Blocked: Path traversal attempt
const maliciousPath = validatePath('../../../etc/passwd');
// Throws error: "Path traversal detected"
```

---

## Related Documentation

- **Update Command:** [docs/api/update-command.md](update-command.md) - Main update orchestration
- **Version Management:** [docs/api/update-version.md](update-version.md) - Version detection
- **Backup Module:** [docs/api/update-backup.md](update-backup.md) - Rollback on verification failure
- **Path Validation:** [docs/api/validate-path.md](validate-path.md) - Path security

---

## Verification Flow Diagram

```
verifyUpdateDeployment(spinner, expectedVersion)
    ↓
[Check 1] trinity/VERSION exists?
    ├→ No → Fail: "Version file missing"
    └→ Yes → Continue
    ↓
[Check 2] .claude/agents/leadership exists?
    ├→ No → Fail: "Leadership agents missing"
    └→ Yes → Continue
    ↓
[Check 3] .claude/agents/planning exists?
    ├→ No → Fail: "Planning agents missing"
    └→ Yes → Continue
    ↓
[Check 4] .claude/agents/aj-team exists?
    ├→ No → Fail: "AJ team agents missing"
    └→ Yes → Continue
    ↓
[Check 5] .claude/commands exists?
    ├→ No → Fail: "Slash commands missing"
    └→ Yes → Continue
    ↓
[Check 6] trinity/templates exists?
    ├→ No → Fail: "Work order templates missing"
    └→ Yes → Continue
    ↓
[Check 7] trinity/knowledge-base/Trinity.md exists?
    ├→ No → Fail: "Trinity knowledge base missing"
    └→ Yes → Continue
    ↓
[Check 8] VERSION file content matches expectedVersion?
    ├→ No → Fail: "Version verification failed"
    └→ Yes → Continue
    ↓
SUCCESS: Verification passed
```

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready)
