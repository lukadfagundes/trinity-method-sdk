# Update Backup API Reference

**Module:** `src/cli/commands/update/backup.ts`
**Purpose:** Backup creation, restoration, and rollback operations for update process
**Priority:** HIGH (Critical for data safety)

---

## Overview

The Update Backup module ensures data safety during Trinity Method SDK updates. It creates timestamped backups, preserves user content, enables automatic rollback on failure, and provides manual recovery options.

**Key Features:**

- Complete Trinity deployment backup (trinity/ + .claude/)
- User-managed file identification and restoration
- Automatic rollback on update failure
- Manual recovery support
- Cleanup after successful updates

---

## Core Functions

### `createUpdateBackup(spinner: Ora): Promise<string>`

Creates a complete backup of Trinity deployment before update.

**Parameters:**

- `spinner` (Ora) - Spinner instance for status display

**Returns:** `Promise<string>` - Path to backup directory (e.g., `.trinity-backup-1737456000123`)

**Backup Structure:**

```
.trinity-backup-1737456000123/
├── ARCHITECTURE.md           # User-managed file
├── To-do.md                  # User-managed file
├── ISSUES.md                 # User-managed file
├── Technical-Debt.md         # User-managed file
├── trinity/                  # Complete Trinity directory
│   ├── agents/
│   ├── commands/
│   ├── knowledge-base/
│   ├── sessions/
│   ├── investigations/
│   ├── work-orders/
│   └── VERSION
└── .claude/                  # Complete agent directory
    ├── agents/
    └── prompts/
```

**Backup Process:**

1. **Create Backup Directory**
   - Name format: `.trinity-backup-{timestamp}`
   - Hidden directory (starts with `.`)
   - Timestamp ensures uniqueness

2. **Backup User-Managed Files**
   - Copy 4 critical knowledge base files
   - Preserves user customizations
   - Only copies if files exist

3. **Backup Trinity Directory**
   - Complete recursive copy of `trinity/`
   - Includes all subdirectories
   - Preserves file permissions

4. **Backup Agent Directory**
   - Complete recursive copy of `.claude/`
   - Includes agent templates and prompts

**User-Managed Files:**

```typescript
const USER_FILES = [
  'trinity/knowledge-base/ARCHITECTURE.md',
  'trinity/knowledge-base/To-do.md',
  'trinity/knowledge-base/ISSUES.md',
  'trinity/knowledge-base/Technical-Debt.md',
];
```

**Example Usage:**

```typescript
import ora from 'ora';
import { createUpdateBackup } from './backup.js';

const spinner = ora();
const backupDir = await createUpdateBackup(spinner);
console.log(`Backup created: ${backupDir}`);
// Output: "Backup created: .trinity-backup-1737456000123"
```

**Spinner Messages:**

```
⠙ Creating backup...
✓ Backup created
```

**Error Handling:**

- If backup creation fails, error thrown to caller
- Update process aborted before any changes made

---

### `restoreUserContent(backupDir: string, spinner: Ora): Promise<void>`

Restores user-managed files from backup after update.

**Parameters:**

- `backupDir` (string) - Path to backup directory
- `spinner` (Ora) - Spinner instance for status display

**Returns:** `Promise<void>` - Resolves when restoration complete

**Purpose:**

- Preserve user customizations during update
- Restore user-edited knowledge base files
- Merge user content with updated templates

**Restoration Logic:**

1. **Iterate User-Managed Files**
   - Check if file exists in backup
   - Skip if not present in backup

2. **Copy from Backup**
   - Overwrite updated file with backup version
   - Preserves user customizations
   - Uses `overwrite: true` option

**Example Usage:**

```typescript
import { restoreUserContent } from './backup.js';

await restoreUserContent('.trinity-backup-1737456000123', spinner);
// User-managed files restored from backup
```

**Spinner Messages:**

```
⠙ Restoring user content...
✓ User content restored
```

**Restoration Behavior:**

| File            | Exists in Backup | Updated | Restored | Final State                |
| --------------- | ---------------- | ------- | -------- | -------------------------- |
| ARCHITECTURE.md | Yes              | Yes     | Yes      | User version (from backup) |
| To-do.md        | Yes              | Yes     | Yes      | User version (from backup) |
| ISSUES.md       | No               | Yes     | No       | Updated version            |
| Trinity.md      | Not user-managed | Yes     | No       | Updated version            |

**Use Case:**

```
1. User customizes ARCHITECTURE.md before update
2. Update overwrites ARCHITECTURE.md with template
3. restoreUserContent() restores user's custom ARCHITECTURE.md
4. Result: User customizations preserved
```

---

### `rollbackFromBackup(backupDir: string): Promise<void>`

Performs full rollback to pre-update state on failure.

**Parameters:**

- `backupDir` (string) - Path to backup directory

**Returns:** `Promise<void>` - Resolves when rollback complete

**Throws:** `Error` if rollback fails (critical error)

**Rollback Process:**

1. **Verify Backup Exists**
   - Check if `backupDir` exists
   - If not, return silently (no rollback possible)

2. **Create Rollback Spinner**
   - Display "Restoring from backup..." message
   - Independent spinner (original may be in error state)

3. **Restore Trinity Directory**
   - Delete current `trinity/` directory
   - Copy backup `trinity/` directory to project root

4. **Restore Agent Directory**
   - Delete current `.claude/` directory
   - Copy backup `.claude/` directory to project root

5. **Cleanup Backup**
   - Delete backup directory after successful rollback
   - Backup no longer needed

**Example Usage:**

```typescript
import { rollbackFromBackup } from './backup.js';

try {
  // Update operation
  await updateComponents();
} catch (error) {
  // Rollback on failure
  await rollbackFromBackup('.trinity-backup-1737456000123');
}
```

**Spinner Messages:**

```
⠙ Restoring from backup...
✓ Rollback complete - Original state restored
```

**Critical Error Handling:**

If rollback itself fails (e.g., disk full, permission error):

```typescript
try {
  await rollbackFromBackup(backupDir);
} catch (rollbackError) {
  // Display critical error
  displayError(`CRITICAL: Rollback failed: ${errorMessage}`);
  displayWarning(`Backup preserved at: ${backupDir}`);
  displayInfo('Manually restore from backup if needed');
  throw rollbackError;
}
```

**User Messages:**

```
✗ Rollback failed
❌ CRITICAL: Rollback failed: ENOSPC: no space left on device
⚠️  Backup preserved at: .trinity-backup-1737456000123
ℹ️  Manually restore from backup if needed
```

**Manual Recovery Instructions:**

If automatic rollback fails, user can manually restore:

```bash
# Remove corrupted deployment
rm -rf trinity .claude

# Restore from backup
cp -r .trinity-backup-1737456000123/trinity trinity
cp -r .trinity-backup-1737456000123/.claude .claude

# Verify restoration
cat trinity/VERSION
```

---

### `cleanupBackup(backupDir: string, spinner: Ora): Promise<void>`

Removes backup directory after successful update.

**Parameters:**

- `backupDir` (string) - Path to backup directory
- `spinner` (Ora) - Spinner instance for status display

**Returns:** `Promise<void>` - Resolves when cleanup complete

**Purpose:**

- Free disk space after successful update
- Remove temporary backup files
- Keep project directory clean

**Example Usage:**

```typescript
import { cleanupBackup } from './backup.js';

await cleanupBackup('.trinity-backup-1737456000123', spinner);
// Backup directory deleted
```

**Spinner Messages:**

```
⠙ Cleaning up...
✓ Cleanup complete
```

**When Called:**

- Only after successful update verification
- After all restoration steps complete
- Before displaying success summary

**Cleanup Logic:**

```typescript
await fs.remove(backupDir);
// Recursively deletes backup directory and all contents
```

---

## User-Managed Files

### Identified User Content

```typescript
const USER_FILES = [
  'trinity/knowledge-base/ARCHITECTURE.md',
  'trinity/knowledge-base/To-do.md',
  'trinity/knowledge-base/ISSUES.md',
  'trinity/knowledge-base/Technical-Debt.md',
];
```

### Why These Files?

**ARCHITECTURE.md**

- User documents project architecture
- Custom diagrams and explanations
- Project-specific patterns

**To-do.md**

- User's task tracking
- Work-in-progress items
- Planning notes

**ISSUES.md**

- Project-specific issue tracking
- Custom bug documentation
- Resolution strategies

**Technical-Debt.md**

- User-identified technical debt
- Refactoring plans
- Debt prioritization

### Files NOT User-Managed

**Trinity Templates:**

- `trinity/knowledge-base/Trinity.md` (Trinity methodology)
- `trinity/knowledge-base/CODING-PRINCIPLES.md` (Trinity standards)
- `trinity/knowledge-base/DOCUMENTATION-CRITERIA.md` (Documentation rules)
- `trinity/knowledge-base/TESTING-PRINCIPLES.md` (Testing standards)

**Rationale:** These are Trinity-provided templates that should be updated, not preserved.

---

## Backup Lifecycle

### 1. Pre-Update Backup

```
createUpdateBackup()
    ↓
Create .trinity-backup-{timestamp}/
    ↓
Copy USER_FILES (4 files)
    ↓
Copy trinity/ (full directory)
    ↓
Copy .claude/ (full directory)
    ↓
Return backup path
```

**Result:** Complete backup created, update safe to proceed

---

### 2. Post-Update Restoration

```
restoreUserContent(backupDir)
    ↓
For each USER_FILE:
    ├→ Exists in backup? Yes
    ├→ Copy from backup
    └→ Overwrite updated file
    ↓
User customizations preserved
```

**Result:** User content merged with updated templates

---

### 3. Successful Update Cleanup

```
cleanupBackup(backupDir)
    ↓
Delete backup directory
    ↓
Free disk space
```

**Result:** Clean project directory, backup removed

---

### 4. Failure Rollback

```
rollbackFromBackup(backupDir)
    ↓
Delete trinity/ and .claude/
    ↓
Copy backup/trinity/ to trinity/
    ↓
Copy backup/.claude/ to .claude/
    ↓
Delete backup directory
    ↓
Original state restored
```

**Result:** Deployment reverted to pre-update state

---

## Integration with Update Command

```typescript
// Update command workflow
import {
  createUpdateBackup,
  restoreUserContent,
  rollbackFromBackup,
  cleanupBackup,
} from './backup.js';

export async function update(options) {
  const spinner = ora();
  let backupDir: string | null = null;

  try {
    // Step 4: Create backup
    backupDir = await createUpdateBackup(spinner);

    // Steps 5-8: Update components
    await updateAgents(spinner);
    await updateCommands(spinner);
    await updateTemplates(spinner);
    await updateKnowledgeBase(spinner);

    // Step 9: Restore user content
    await restoreUserContent(backupDir, spinner);

    // Steps 10-11: Verification
    await updateVersionFile(spinner);
    await verifyUpdate(spinner);

    // Step 12: Cleanup
    await cleanupBackup(backupDir, spinner);

    // SUCCESS
    displayUpdateSummary();
  } catch (error) {
    // ROLLBACK
    if (backupDir) {
      await rollbackFromBackup(backupDir);
    }
    throw error;
  }
}
```

---

## Backup Directory Structure

### Complete Backup Contents

```
.trinity-backup-1737456000123/
├── ARCHITECTURE.md              # User-managed (1.2 KB)
├── To-do.md                     # User-managed (0.8 KB)
├── ISSUES.md                    # User-managed (3.4 KB)
├── Technical-Debt.md            # User-managed (2.1 KB)
│
├── trinity/                     # Complete Trinity directory (~5 MB)
│   ├── agents/
│   │   ├── mon.md
│   │   ├── juno.md
│   │   └── ... (19 agents)
│   │
│   ├── commands/
│   │   ├── INVESTIGATION-TEMPLATE.md
│   │   └── WORKORDER-TEMPLATE.md
│   │
│   ├── knowledge-base/
│   │   ├── ARCHITECTURE.md      # Backup copy
│   │   ├── To-do.md             # Backup copy
│   │   ├── ISSUES.md            # Backup copy
│   │   ├── Technical-Debt.md    # Backup copy
│   │   ├── Trinity.md
│   │   ├── CODING-PRINCIPLES.md
│   │   ├── DOCUMENTATION-CRITERIA.md
│   │   └── TESTING-PRINCIPLES.md
│   │
│   ├── sessions/                # User session artifacts
│   │   └── 2026-01-20-103000/
│   │       ├── SESSION-SUMMARY.md
│   │       └── investigation-summary.md
│   │
│   ├── investigations/          # User investigations
│   │   └── auth-bug-fix/
│   │       └── findings.md
│   │
│   ├── work-orders/             # User work orders
│   │   └── WORKORDER-042.md
│   │
│   ├── templates/
│   │   └── documentation/
│   │
│   └── VERSION                  # Current version
│
└── .claude/                     # Complete agent directory (~500 KB)
    ├── agents/
    │   ├── mon.md
    │   ├── juno.md
    │   └── ... (19 agents)
    │
    └── prompts/
        └── custom-prompts.md
```

**Total Backup Size:** ~5-10 MB (depends on user content)

---

## Error Scenarios

### Scenario 1: Backup Creation Fails

**Cause:** Disk full, permission denied

**Behavior:**

```typescript
try {
  backupDir = await createUpdateBackup(spinner);
} catch (error) {
  spinner.fail('Backup creation failed');
  throw error;
}
```

**Result:** Update aborted, no changes made

**User Action:** Free disk space, retry update

---

### Scenario 2: Update Fails (Rollback Succeeds)

**Cause:** Network error during template download

**Behavior:**

```typescript
try {
  await updateComponents();
} catch (error) {
  await rollbackFromBackup(backupDir);
  // Rollback successful
}
```

**Result:** Deployment restored to pre-update state

**User Action:** Retry update when network stable

---

### Scenario 3: Update Fails (Rollback Fails)

**Cause:** Disk failure during rollback

**Behavior:**

```typescript
try {
  await rollbackFromBackup(backupDir);
} catch (rollbackError) {
  displayError('CRITICAL: Rollback failed');
  displayWarning(`Backup preserved at: ${backupDir}`);
  displayInfo('Manually restore from backup if needed');
}
```

**Result:** Deployment corrupted, backup preserved

**User Action:** Manual restoration required

---

### Scenario 4: Cleanup Fails

**Cause:** Backup directory locked by antivirus

**Behavior:**

```typescript
try {
  await cleanupBackup(backupDir, spinner);
} catch (error) {
  // Non-critical error, continue
  displayWarning(`Could not delete backup: ${backupDir}`);
}
```

**Result:** Update successful, backup preserved

**User Action:** Manually delete backup directory later

---

## Performance Considerations

### Backup Creation Time

**Factors:**

- Disk I/O speed (SSD vs. HDD)
- Directory size (user sessions, investigations)
- File count (hundreds to thousands)

**Typical Performance:**

- Small deployment (< 100 files): ~1 second
- Medium deployment (100-500 files): ~3 seconds
- Large deployment (> 500 files): ~10 seconds

**Optimization:**

- Use `fs-extra.copy()` (efficient recursive copy)
- No compression (speed over size)
- Async operations (non-blocking)

---

### Rollback Performance

**Typical Performance:**

- Delete + restore: ~2-5 seconds
- Depends on directory size

**Critical Path:**

- Rollback must be fast (user waiting)
- No compression (speed priority)

---

## Disk Space Requirements

**Backup Size:**

- Trinity directory: ~5 MB (templates, agents)
- User content: Variable (sessions, investigations)
- Total: ~5-50 MB

**Recommendation:**

- Ensure 100 MB free space before update
- Cleanup after successful update

---

## Testing Recommendations

### Unit Tests

```typescript
describe('backup', () => {
  it('should create backup directory', async () => {
    const backupDir = await createUpdateBackup(ora());
    expect(fs.existsSync(backupDir)).toBe(true);
  });

  it('should backup user-managed files', async () => {
    const backupDir = await createUpdateBackup(ora());
    expect(fs.existsSync(path.join(backupDir, 'ARCHITECTURE.md'))).toBe(true);
  });

  it('should restore user content', async () => {
    const backupDir = await createUpdateBackup(ora());
    fs.writeFileSync('trinity/knowledge-base/To-do.md', 'Modified');
    await restoreUserContent(backupDir, ora());
    const content = fs.readFileSync('trinity/knowledge-base/To-do.md', 'utf8');
    expect(content).toBe('Original'); // Restored from backup
  });

  it('should rollback on failure', async () => {
    const backupDir = await createUpdateBackup(ora());
    fs.removeSync('trinity');
    await rollbackFromBackup(backupDir);
    expect(fs.existsSync('trinity/VERSION')).toBe(true);
  });

  it('should cleanup backup', async () => {
    const backupDir = await createUpdateBackup(ora());
    await cleanupBackup(backupDir, ora());
    expect(fs.existsSync(backupDir)).toBe(false);
  });
});
```

---

## Known Limitations

1. **No Incremental Backups:**
   - Always full backup (all files copied)
   - No delta backups (slower, larger)

2. **No Compression:**
   - Backups uncompressed (faster but larger)
   - Could add `.tar.gz` compression for space savings

3. **Single Backup:**
   - Only one backup at a time
   - Previous backup overwritten

4. **No Backup Rotation:**
   - Old backups not automatically deleted
   - Manual cleanup required if rollback fails

---

## Future Enhancements

### Planned Improvements

- [ ] Incremental backups (only changed files)
- [ ] Backup compression (gzip)
- [ ] Multiple backup versions (rotation)
- [ ] Backup size estimation before creation
- [ ] Configurable user file list (user-defined)
- [ ] Automatic old backup cleanup (retention policy)

---

## Related Documentation

- **Update Command:** [docs/api/update-command.md](update-command.md) - Main update orchestration
- **Verification Module:** [docs/api/update-verification.md](update-verification.md) - Post-update verification
- **Version Management:** [docs/api/update-version.md](update-version.md) - Version detection

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready, critical for data safety)
