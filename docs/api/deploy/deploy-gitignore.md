# Deploy Gitignore - Exclusion Management

**Module:** `src/cli/commands/deploy/gitignore.ts`
**Purpose:** Update .gitignore with Trinity-specific exclusions
**Dependencies:** fs-extra, validate-path utility

---

## Overview

The Gitignore module updates the project's `.gitignore` file to exclude Trinity Method directories and files from version control. It prevents accidental commits of session artifacts, work orders, and agent-generated content.

**Why This Exists:**
Trinity creates session artifacts, work orders, and investigation documents that are meant for local development only. These files should not be committed to version control. This module automatically adds Trinity-specific ignore patterns to protect developers from accidentally committing temporary or sensitive content.

---

## Main Function

### `updateGitignore(spinner: Spinner): Promise<boolean>`

Updates .gitignore with Trinity exclusions.

**Parameters:**

| Parameter | Type            | Required | Description                           |
| --------- | --------------- | -------- | ------------------------------------- |
| `spinner` | `Spinner` (Ora) | Yes      | Spinner instance for progress display |

**Returns:** `Promise<boolean>` - True if .gitignore was updated, false if already contains Trinity section or error occurred

**Behavior:**

- Creates .gitignore if it doesn't exist
- Appends Trinity exclusions if not already present
- Uses security validation for file path
- Handles errors gracefully (warns but doesn't fail deployment)

---

## Trinity Exclusion Patterns

### Excluded Files and Directories

```
# Trinity Method SDK
.claude/
trinity/
*CLAUDE.md
TRINITY.md
```

### Pattern Breakdown

| Pattern      | Matches                     | Rationale                                                               |
| ------------ | --------------------------- | ----------------------------------------------------------------------- |
| `.claude/`   | Entire `.claude/` directory | Agent templates and settings (deployed, not user-created)               |
| `trinity/`   | Entire `trinity/` directory | All Trinity infrastructure (sessions, work orders, etc.)                |
| `*CLAUDE.md` | All CLAUDE.md files         | Root, trinity/, src/, tests/ context files (deployed, not user-created) |
| `TRINITY.md` | TRINITY.md in root          | Trinity Method project guide (deployed, not user-created)               |

---

## What Gets Excluded

### .claude/ Directory (Excluded)

```
.claude/
├── agents/           ❌ Agent templates (deployed by SDK)
├── commands/         ❌ Slash commands (deployed by SDK)
├── settings.json     ❌ Claude Code config (deployed by SDK)
└── EMPLOYEE-DIRECTORY.md  ❌ Agent directory (deployed by SDK)
```

**Reason:** All contents are deployed by Trinity SDK and should not be version controlled

---

### trinity/ Directory (Excluded)

```
trinity/
├── sessions/         ❌ Session artifacts (temporary)
├── work-orders/      ❌ Active work orders (local workflow)
├── investigations/   ❌ Investigation documents (local workflow)
├── archive/          ❌ Archived artifacts (temporary)
├── reports/          ❌ Agent reports (generated)
├── knowledge-base/   ❌ Knowledge base (deployed by SDK)
├── templates/        ❌ Templates (deployed by SDK)
└── CLAUDE.md         ❌ Trinity context (deployed by SDK)
```

**Reason:** Mix of temporary artifacts and deployed templates, neither should be version controlled

**Exception:** If you customize knowledge base or patterns, you may want to commit them. In that case, remove `trinity/` from .gitignore and add specific exclusions:

```gitignore
# Custom Trinity exclusions (if you want to commit knowledge base)
trinity/sessions/
trinity/work-orders/
trinity/investigations/
trinity/archive/
trinity/reports/
```

---

### CLAUDE.md Files (Excluded)

```
CLAUDE.md             ❌ Root context (deployed by SDK)
trinity/CLAUDE.md     ❌ Trinity context (deployed by SDK)
src/CLAUDE.md         ❌ Source context (deployed by SDK)
tests/CLAUDE.md       ❌ Tests context (deployed by SDK)
```

**Reason:** Context files are deployed by Trinity SDK and updated via `trinity update` command

---

## Implementation Flow

### Step 1: Read Existing .gitignore

```typescript
let gitignoreContent = '';
if (await fs.pathExists(gitignorePath)) {
  gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
}
```

**Behavior:**

- If .gitignore exists: Read contents
- If .gitignore doesn't exist: Use empty string

---

### Step 2: Check if Trinity Section Exists

```typescript
if (!gitignoreContent.includes('# Trinity Method SDK')) {
  // Proceed with update
} else {
  // Skip update
}
```

**Detection Method:** Check for marker comment `# Trinity Method SDK`

**Why This Works:**

- ✅ Simple and reliable
- ✅ Prevents duplicate entries
- ✅ Idempotent (safe to run multiple times)

---

### Step 3: Append Trinity Exclusions

```typescript
const trinityIgnores = [
  '',
  '# Trinity Method SDK',
  '.claude/',
  'trinity/',
  '*CLAUDE.md',
  'TRINITY.md',
];

const newContent = `${gitignoreContent.trim()}\n${trinityIgnores.join('\n')}\n`;
```

**Formatting:**

1. Trim existing content (remove trailing whitespace)
2. Add newline separator
3. Add blank line before Trinity section
4. Add `# Trinity Method SDK` comment header
5. Add exclusion patterns
6. Add trailing newline

**Result:**

```gitignore
# Existing .gitignore content
node_modules/
.env

# Trinity Method SDK
.claude/
trinity/
*CLAUDE.md
TRINITY.md
```

---

### Step 4: Validate and Write

```typescript
const validatedPath = validatePath(gitignorePath);
await fs.writeFile(validatedPath, newContent);
```

**Security:** Uses `validatePath()` utility to prevent directory traversal attacks

---

## Spinner Status Updates

### Starting Update

```typescript
spinner.start('Updating .gitignore...');
```

**Display:** `⠸ Updating .gitignore...`

---

### Success (Updated)

```typescript
spinner.succeed('.gitignore updated with Trinity exclusions');
```

**Display:** `✔ .gitignore updated with Trinity exclusions`

**Return:** `true`

---

### Info (Already Updated)

```typescript
spinner.info('.gitignore already contains Trinity exclusions');
```

**Display:** `ℹ .gitignore already contains Trinity exclusions`

**Return:** `false`

---

### Warning (Error)

```typescript
spinner.warn('.gitignore update failed');
```

**Display:** `⚠️ .gitignore update failed`

**Return:** `false`

**Note:** Error doesn't fail deployment - warns and continues

---

## Usage in Deploy Workflow

Gitignore update occurs in Step 11.5 of the 12-step deployment:

```typescript
// STEP 11: Deploy CI/CD workflow templates
const cicdFiles = await deployCICD(options, spinner);
progress.rootFilesDeployed += cicdFiles;

// STEP 11.5: Update .gitignore
const gitignoreUpdated = await updateGitignore(spinner);
if (gitignoreUpdated) {
  progress.rootFilesDeployed++;
}

// STEP 12: Install Trinity Method SDK
const sdkInstalled = await installSDK(spinner);
```

**Position in Workflow:** Near end (11.5/12) - after all files deployed

**Purpose:** Prevent newly deployed Trinity files from being accidentally committed

---

## Usage Examples

### Example 1: Fresh Deployment (No .gitignore)

```bash
npx trinity deploy
```

**Before:**

```
(no .gitignore file)
```

**After:**

```gitignore
# Trinity Method SDK
.claude/
trinity/
*CLAUDE.md
TRINITY.md
```

**Output:**

```
✔ .gitignore updated with Trinity exclusions
```

---

### Example 2: Existing .gitignore (No Trinity Section)

```bash
npx trinity deploy
```

**Before:**

```gitignore
node_modules/
.env
dist/
```

**After:**

```gitignore
node_modules/
.env
dist/

# Trinity Method SDK
.claude/
trinity/
*CLAUDE.md
TRINITY.md
```

**Output:**

```
✔ .gitignore updated with Trinity exclusions
```

---

### Example 3: Redeployment (Trinity Section Exists)

```bash
npx trinity deploy --force
```

**Before:**

```gitignore
node_modules/

# Trinity Method SDK
.claude/
trinity/
*CLAUDE.md
TRINITY.md
```

**After:**

```gitignore
(no changes - Trinity section already exists)
```

**Output:**

```
ℹ .gitignore already contains Trinity exclusions
```

---

### Example 4: File System Error (Permission Denied)

```bash
npx trinity deploy
```

**Scenario:** .gitignore is read-only

**Output:**

```
⚠️ .gitignore update failed
Warning: EACCES: permission denied, open '.gitignore'
```

**Result:** Deployment continues (gitignore update not critical)

---

## Error Handling

### Try-Catch Block

```typescript
try {
  // Read, check, write logic
} catch (error: unknown) {
  spinner.warn('.gitignore update failed');
  const { displayWarning, getErrorMessage } = await import('../../utils/errors.js');
  displayWarning(getErrorMessage(error));
  return false;
}
```

**Error Recovery:**

1. Change spinner to warning (⚠️)
2. Display error message to user
3. Return `false` (not updated)
4. **Do NOT throw** - deployment continues

**Rationale:** .gitignore update is not critical for Trinity functionality

---

### Common Errors

| Error  | Cause                | Behavior                  |
| ------ | -------------------- | ------------------------- |
| EACCES | Permission denied    | Warn, continue deployment |
| ENOSPC | Disk full            | Warn, continue deployment |
| EROFS  | Read-only filesystem | Warn, continue deployment |

---

## Security Considerations

### Path Validation

```typescript
const validatedPath = validatePath(gitignorePath);
await fs.writeFile(validatedPath, newContent);
```

**Purpose:** Prevent directory traversal attacks

**Validation Checks:**

1. ✅ No `..` traversal
2. ✅ No absolute paths outside project
3. ✅ No symlink attacks

**Example Attack (Prevented):**

```typescript
// Attacker tries to modify system file
const gitignorePath = '../../../etc/passwd';
// validatePath() throws error
```

---

## Design Rationale

### Why Exclude Entire trinity/ Directory?

**Options Considered:**

1. ❌ Exclude only `trinity/sessions/` and `trinity/work-orders/`
2. ✅ Exclude entire `trinity/` directory

**Chosen Approach:** Exclude entire directory

- **Benefit:** Simpler pattern, no risk of missing files
- **Benefit:** All Trinity content deployed by SDK (no need to commit)
- **Trade-off:** Users can't commit customizations without modifying .gitignore

**If You Want to Commit Knowledge Base:**

```gitignore
# Option 1: Remove trinity/ from .gitignore and use specific exclusions
trinity/sessions/
trinity/work-orders/
trinity/investigations/
trinity/archive/
trinity/reports/

# Option 2: Use negation patterns (Git 2.x+)
trinity/*
!trinity/knowledge-base/
```

---

### Why Use Marker Comment for Detection?

**Options Considered:**

1. ❌ Check for each pattern individually
2. ✅ Check for marker comment `# Trinity Method SDK`

**Chosen Approach:** Marker comment

- **Benefit:** Single check (faster)
- **Benefit:** Reliable (comment unlikely to exist otherwise)
- **Benefit:** Idempotent (safe to run multiple times)

---

## Performance Considerations

### Execution Time

- **Read .gitignore:** <5ms
- **String operations:** <1ms
- **Write .gitignore:** <10ms
- **Total duration:** <20ms

### File System Operations

- **Read operations:** 1 (check if .gitignore exists, then read)
- **Write operations:** 0-1 (only if update needed)

---

## Integration with Version Control

### Git Status After Deployment

**Before Trinity Deployment:**

```bash
$ git status
On branch main
nothing to commit, working tree clean
```

**After Trinity Deployment:**

```bash
$ git status
On branch main
Untracked files:
  .gitignore         # Modified to include Trinity exclusions
  package.json       # Modified to include Trinity SDK dependency

nothing added to commit but untracked files present
```

**Note:** Trinity files (.claude/, trinity/, CLAUDE.md) do NOT appear because .gitignore excludes them

---

## Related Documentation

- **Deploy Command:** [deploy-command.md](deploy-command.md)
- **Path Validation:** [validate-path.md](validate-path.md)
- **Error Utilities:** [errors.md](errors.md)

---

## Type Definitions

### Spinner (Ora)

```typescript
interface Spinner {
  start(text?: string): Spinner; // Start spinner with message
  succeed(text?: string): Spinner; // Show success checkmark
  info(text?: string): Spinner; // Show info symbol
  warn(text?: string): Spinner; // Show warning symbol
  fail(text?: string): Spinner; // Show failure X
}
```

---

## Testing Recommendations

### Unit Tests

```typescript
describe('updateGitignore', () => {
  it('should create .gitignore if not exists', async () => {
    // Mock fs.pathExists to return false
    const result = await updateGitignore(spinner);
    expect(result).toBe(true);
  });

  it('should append to existing .gitignore', async () => {
    // Mock existing .gitignore content
    const result = await updateGitignore(spinner);
    expect(result).toBe(true);
  });

  it('should skip if Trinity section exists', async () => {
    // Mock .gitignore with Trinity section
    const result = await updateGitignore(spinner);
    expect(result).toBe(false);
  });

  it('should handle errors gracefully', async () => {
    // Mock fs.writeFile to throw EACCES
    const result = await updateGitignore(spinner);
    expect(result).toBe(false);
    expect(spinner.warn).toHaveBeenCalled();
  });
});
```

---

**Last Updated:** 2026-01-21
**Trinity SDK Version:** 2.1.0
**Maintained By:** APO-2 (Documentation Specialist)
