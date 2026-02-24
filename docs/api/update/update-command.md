# Update Command API Reference

**Module:** `src/cli/commands/update/index.ts`
**Purpose:** Main update workflow orchestration for Trinity Method SDK
**Priority:** HIGH (Core command)

---

## Overview

The Update Command orchestrates the Trinity Method SDK update process, bringing an existing
deployment up to the latest version. It manages backup creation, component updates, user content
restoration, verification, and rollback on failure.

**Trinity Principle:** "Systematic Quality Assurance" - Keep deployment current

**Key Features:**

- 12-step update workflow with error handling
- Automatic backup creation before update
- User content preservation (sessions, investigations)
- Version detection and comparison
- Dry-run preview mode
- Automatic rollback on failure
- Comprehensive verification
- Force update capability

---

## Main Function

### `update(options: UpdateOptions): Promise<void>`

Main entry point for update command. Orchestrates 12-step update workflow.

**Parameters:**

- `options` (UpdateOptions) - Update command options

```typescript
interface UpdateOptions {
  all?: boolean; // Update all registered Trinity projects
  dryRun?: boolean; // Preview changes without applying
  force?: boolean; // Force update even if up-to-date
}
```

**Returns:** `Promise<void>` - Resolves when update complete

**Throws:** `UpdateError` - If update fails (after rollback attempt)

---

## Update Workflow (12 Steps)

### Step 1: Pre-flight Checks

**Function:** `runUpdatePreflightChecks(spinner)`
**Purpose:** Verify Trinity is deployed and Git is initialized

**Checks:**

- Trinity directory (`.claude/trinity/`) exists
- VERSION file exists
- `.git/` directory exists (recommended)

**Failure:** Throws error if Trinity not deployed

**User Message:**

```text
⚠️  Trinity Method is not deployed
Run: trinity deploy
```

---

### Step 2: Version Check

**Function:** `detectInstalledSDKVersion(spinner)`
**Purpose:** Compare installed version with latest available version

**Returns:**

```typescript
interface VersionInfo {
  currentVersion: string; // e.g., "2.0.0"
  latestVersion: string; // e.g., "2.1.0"
  isUpToDate: boolean; // true if current === latest
}
```

**Behavior:**

- If up-to-date and `!force` → Exit early with success message
- If up-to-date and `force` → Show warning, continue update
- If outdated → Continue to confirmation

**User Messages:**

```text
✅ Already up to date (if up-to-date)
⚠️  Forcing update (already at latest version) (if force)
```

---

### Step 3: Dry-Run Preview or Confirmation

#### Dry-Run Mode (`options.dryRun`)

**Function:** `displayDryRunPreview(currentVersion, latestVersion)`
**Purpose:** Show what would be updated without making changes

**Output:**

```text
🔍 Dry Run Preview

Current Version: 2.0.0
Latest Version: 2.1.0

The following would be updated:
✓ Agents (.claude/agents/)
✓ Commands (.claude/trinity/commands/)
✓ Templates (.claude/trinity/templates/)
✓ Knowledge Base (.claude/trinity/knowledge-base/)
✓ VERSION file

User content would be preserved:
✓ Sessions (.claude/trinity/sessions/)
✓ Investigations (.claude/trinity/investigations/)
✓ Work Orders (.claude/trinity/work-orders/)

To apply this update, run: trinity update
```

**Exit:** Command exits after preview (no changes made)

#### Confirmation Prompt (Normal Mode)

**Prompt:**

```text
? Update Trinity Method from 2.0.0 to 2.1.0? (Y/n)
```

**User Action:**

- `Y` → Continue to Step 4
- `n` → Cancel update, exit with message

**Cancellation Message:**

```text
Update cancelled
```

---

### Step 4: Create Backup

**Function:** `createUpdateBackup(spinner)`
**Purpose:** Create timestamped backup of entire Trinity directory

**Backup Location:**

```text
.claude/trinity/backups/update-YYYY-MM-DD-HHMMSS/
```

**Backed Up Directories:**

- `.claude/` (agents, prompts)
- `.claude/trinity/` (entire Trinity directory)

**Returns:** `string` - Backup directory path

**Error Handling:**

- Registers cleanup handler (backup deletion on error)
- If backup fails, update aborted

**User Message:**

```text
✓ Created backup: .claude/trinity/backups/update-2026-01-21-103000
```

---

### Step 5-8: Update Components

Updates performed sequentially:

#### Step 5: Update Agents

**Function:** `updateAgents(spinner, stats)`
**Purpose:** Update agent templates in `.claude/agents/`

**Updates:**

- 18 Trinity agent templates
- Preserves user customizations (if detected)

**Stats Tracking:** `stats.agentsUpdated`

---

#### Step 6: Update Commands

**Function:** `updateCommands(spinner, stats)`
**Purpose:** Update command templates in `.claude/trinity/commands/`

**Updates:**

- Investigation templates
- Work order templates
- Command documentation

**Stats Tracking:** `stats.commandsUpdated`

---

#### Step 7: Update Templates

**Function:** `updateTemplates(spinner, stats)`
**Purpose:** Update deployment templates in `.claude/trinity/templates/`

**Updates:**

- Documentation templates
- Configuration templates
- Workflow templates

**Stats Tracking:** `stats.templatesUpdated`

---

#### Step 8: Update Knowledge Base

**Function:** `updateKnowledgeBase(spinner, stats)`
**Purpose:** Update Trinity knowledge base in `.claude/trinity/knowledge-base/`

**Updates:**

- ARCHITECTURE.md
- ISSUES.md
- Trinity.md
- CODING-PRINCIPLES.md
- DOCUMENTATION-CRITERIA.md
- TESTING-PRINCIPLES.md

**Stats Tracking:** `stats.knowledgeBaseUpdated`

**User Content Preservation:**

- Existing custom entries preserved
- Only updates Trinity-provided sections

---

### Step 9: Restore User Content

**Function:** `restoreUserContent(backupDir, spinner)`
**Purpose:** Restore user-created content from backup

**Restored Directories:**

- `.claude/trinity/sessions/` - User session artifacts
- `.claude/trinity/investigations/` - User investigations
- `.claude/trinity/work-orders/` - User work orders
- Custom agent configurations (if any)

**Behavior:**

- Only restores if backup contains user content
- Skips restoration if directories empty in backup

**User Message:**

```text
✓ Restored user content (sessions, investigations, work orders)
```

---

### Step 10: Update VERSION File

**Function:** `updateVersionFile(spinner, latestVersion)`
**Purpose:** Update `.claude/trinity/VERSION` file with new version

**File Content:**

```text
2.1.0
```

**User Message:**

```text
✓ Updated VERSION file to 2.1.0
```

---

### Step 11: Verification

**Function:** `verifyUpdateDeployment(spinner, latestVersion)`
**Purpose:** Verify update success and file integrity

**Verification Checks:**

1. VERSION file contains correct version
2. All critical directories exist
3. Required files present
4. No corrupted files

**Failure:** Throws error → Triggers rollback

**User Message:**

```text
✓ Verified update deployment
```

---

### Step 12: Cleanup Backup

**Function:** `cleanupBackup(backupDir, spinner)`
**Purpose:** Remove backup after successful update

**Behavior:**

- Only cleans up on success
- Backup preserved on failure (for manual recovery)

**User Message:**

```text
✓ Cleaned up backup
```

---

## Success Summary

**Function:** `displayUpdateSummary(stats, currentVersion, latestVersion)`

**Output:**

```text
✅ Trinity Method Updated Successfully!

Version: 2.0.0 → 2.1.0

Updated Components:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Agents:         19 files
  Commands:       12 files
  Templates:      8 files
  Knowledge Base: 6 files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total:          45 files updated

User content preserved:
✓ Sessions
✓ Investigations
✓ Work Orders

Next Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Review changelog: .claude/trinity/knowledge-base/CHANGELOG.md
2. Check for breaking changes in Trinity.md
3. Test your workflow with updated agents
```

---

## Error Handling and Rollback

### Rollback Trigger

Any error in Steps 4-11 triggers automatic rollback.

### Rollback Process

**Function:** `rollbackFromBackup(backupDir)`

**Steps:**

1. Display rollback message
2. Restore entire Trinity directory from backup
3. Restore `.claude/` directory from backup
4. Preserve backup directory (for debugging)
5. Display recovery instructions

**User Messages:**

```text
❌ Update failed - Rolling back changes...

🔄 Rolling back from backup: .claude/trinity/backups/update-2026-01-21-103000

✓ Restored Trinity directory
✓ Restored agent directory

Rollback complete. Your deployment is restored to its previous state.
Backup preserved at: .claude/trinity/backups/update-2026-01-21-103000

Try running: trinity deploy --force for a clean reinstall
```

### Error Classification

**UpdateError Thrown:**

```typescript
throw new UpdateError(`Update failed: ${errorMessage}`, {
  originalError: error,
  backupDir: backupDir || 'none',
});
```

**Error Context:**

- Original error message
- Backup directory location
- Step where failure occurred

---

## Update Statistics

### Stats Object

```typescript
interface UpdateStats {
  agentsUpdated: number; // Number of agent files updated
  templatesUpdated: number; // Number of template files updated
  knowledgeBaseUpdated: number; // Number of knowledge base files updated
  commandsUpdated: number; // Number of command files updated
  filesUpdated: number; // Total files updated
}
```

**Tracking:**

- Each update function increments its respective counter
- `filesUpdated` computed as sum of all counters

---

## Command Options

### Force Update (`--force`)

**Purpose:** Update even if already at latest version

**Use Cases:**

- Repair corrupted installation
- Re-apply templates after manual edits
- Force refresh of all files

**Example:**

```bash
trinity update --force
```

**Behavior:**

- Skips "already up-to-date" check
- Shows warning before proceeding
- Full update performed

---

### Dry-Run Preview (`--dry-run`)

**Purpose:** Preview changes without applying them

**Use Cases:**

- Check what will be updated
- Verify version upgrade
- Confirm user content preservation

**Example:**

```bash
trinity update --dry-run
```

**Behavior:**

- Performs Steps 1-2 (checks and version detection)
- Displays preview
- Exits without making changes

---

---

## Integration with Other Commands

### Deploy Command

**Relationship:** Update requires prior deployment

**Check:**

```typescript
if (!fs.existsSync('.claude/trinity/VERSION')) {
  throw new Error('Trinity not deployed. Run: trinity deploy');
}
```

---

### Audit Command

**Future Integration:** Update may trigger automatic audit after update

**Planned:**

```typescript
if (options.audit) {
  await audit();
}
```

---

## Example Usage

### Basic Update

```typescript
import { update } from './commands/update/index.js';

await update({});
// Interactive prompt, creates backup, updates all components
```

---

### Force Update

```typescript
await update({ force: true });
// Updates even if at latest version
```

---

### Dry-Run Preview

```typescript
await update({ dryRun: true });
// Shows what would be updated, exits without changes
```

---

---

## Performance Considerations

**Typical Update Time:**

- Small deployment (< 50 files): ~5 seconds
- Medium deployment (50-200 files): ~15 seconds
- Large deployment (> 200 files): ~30 seconds

**Performance Factors:**

- File I/O speed (SSD vs. HDD)
- Number of files in user content directories
- Backup compression (if enabled)

**Optimization:**

- Parallel component updates (Steps 5-8)
- Incremental backup (only changed files)
- Skip unchanged files (checksum comparison)

---

## Error Recovery

### Manual Recovery Steps

If automatic rollback fails:

1. **Locate Backup:**

   ```bash
   cd .claude/trinity/backups/
   ls -la
   # Find update-YYYY-MM-DD-HHMMSS directory
   ```

2. **Manual Restore:**

   ```bash
   rm -rf .claude
   cp -r .claude/trinity/backups/update-2026-01-21-103000/.claude .claude/
   ```

3. **Verify Restoration:**

   ```bash
   cat .claude/trinity/VERSION
   # Should show previous version
   ```

4. **Clean Reinstall (Last Resort):**

   ```bash
   trinity deploy --force
   ```

---

## Testing Recommendations

### Unit Tests

```typescript
describe('update', () => {
  it('should exit early if up-to-date', async () => {
    const options = { force: false };
    await update(options);
    // Verify early exit
  });

  it('should force update when requested', async () => {
    const options = { force: true };
    await update(options);
    // Verify full update performed
  });

  it('should show dry-run preview', async () => {
    const options = { dryRun: true };
    await update(options);
    // Verify no changes made
  });

  it('should rollback on failure', async () => {
    // Mock failure in Step 6
    const options = {};
    await expect(update(options)).rejects.toThrow('Update failed');
    // Verify rollback performed
  });
});
```

---

### Integration Tests

```typescript
describe('update integration', () => {
  it('should update all components', async () => {
    await update({});
    expect(fs.existsSync('.claude/agents/mon.md')).toBe(true);
    expect(fs.existsSync('.claude/trinity/knowledge-base/ARCHITECTURE.md')).toBe(true);
  });

  it('should preserve user content', async () => {
    // Create user session
    fs.writeFileSync('.claude/trinity/sessions/test-session/summary.md', 'Test');

    await update({});

    // Verify session preserved
    expect(fs.existsSync('.claude/trinity/sessions/test-session/summary.md')).toBe(true);
  });
});
```

---

## Known Limitations

1. **No Partial Updates:**
   - Cannot update individual components (agents only, etc.)
   - Always updates all components

2. **No Selective Restoration:**
   - User content restoration is all-or-nothing
   - Cannot restore specific sessions

3. **No Conflict Resolution:**
   - If user modified Trinity templates, changes overwritten
   - No merge conflict resolution

4. **No Update Notifications:**
   - User must manually check for updates
   - No automatic update checking

---

## Future Enhancements

### Planned Improvements

- [ ] Selective component updates (`--agents-only`, `--templates-only`)
- [ ] Conflict resolution for modified templates
- [ ] Automatic update checking (weekly)
- [ ] Update notifications in CLI
- [ ] Incremental backups (faster)
- [ ] Parallel file operations (performance)
- [ ] Update changelog display (before confirmation)
- [ ] Post-update health check (automatic audit)

---

## Related Documentation

- **Deploy Command:** [docs/api/deploy-command.md](deploy-command.md) - Initial deployment
- **Backup Module:** [docs/api/update-backup.md](update-backup.md) - Backup/restore logic
- **Version Management:** [docs/api/update-version.md](update-version.md) - Version detection
- **Verification Module:** [docs/api/update-verification.md](update-verification.md) - Update verification
- **Update Pre-flight:** [docs/api/update-pre-flight.md](update-pre-flight.md) - Pre-flight checks

---

## Workflow Diagram

```text
update(options)
    ↓
[1] Pre-flight Checks
    ├→ Trinity deployed? ✓
    ├→ VERSION file exists? ✓
    └→ Git initialized? ✓
    ↓
[2] Version Check
    ├→ Detect current version
    ├→ Compare with latest
    └→ Up-to-date? → Exit (if !force)
    ↓
[3] Dry-Run / Confirmation
    ├→ Dry-run? → Display preview → Exit
    └→ Prompt user → Confirm?
    ↓
[4] Create Backup
    ├→ Backup .claude/trinity/ directory
    ├→ Backup .claude/ directory
    └→ Register cleanup handler
    ↓
[5-8] Update Components (Parallel)
    ├→ [5] Update Agents
    ├→ [6] Update Commands
    ├→ [7] Update Templates
    └→ [8] Update Knowledge Base
    ↓
[9] Restore User Content
    ├→ Restore .claude/trinity/sessions/
    ├→ Restore .claude/trinity/investigations/
    └→ Restore .claude/trinity/work-orders/
    ↓
[10] Update VERSION File
    └→ Write new version to .claude/trinity/VERSION
    ↓
[11] Verification
    ├→ Verify VERSION file
    ├→ Verify directories exist
    └→ Verify file integrity
    ↓
[12] Cleanup Backup
    └→ Delete backup directory
    ↓
SUCCESS: Display Summary
    ├→ Show updated components
    ├→ Show statistics
    └→ Show next steps

ERROR: Rollback
    ├→ Restore from backup
    ├→ Preserve backup
    └→ Display recovery instructions
```

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready)
