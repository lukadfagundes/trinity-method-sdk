# Command Updates - Update Command

**Module:** `src/cli/commands/update/commands.ts`
**Purpose:** Update 20 slash command templates
**Category:** Update Command - Slash Command Management
**Priority:** MEDIUM

---

## Overview

The Command Updates module synchronizes slash command template files from the Trinity Method SDK to the project's `.claude/commands/` directory. It updates all 20+ specialized slash commands across 7 categories, ensuring projects have the latest command capabilities and documentation.

### Key Features

- **Category-based organization**: Commands organized by purpose (session, planning, execution, etc.)
- **Template stripping**: Removes `.template` extension during deployment
- **Overwrite strategy**: Updates all command files to latest versions
- **Progress tracking**: Reports number of commands updated
- **Graceful failures**: Skips missing categories without errors

---

## API Reference

### `updateCommands(spinner, stats)`

Updates slash command files from SDK templates to `.claude/commands/`.

**Signature:**

```typescript
async function updateCommands(spinner: Ora, stats: UpdateStats): Promise<void>;
```

**Parameters:**

| Parameter | Type          | Description                                |
| --------- | ------------- | ------------------------------------------ |
| `spinner` | `Ora`         | ora spinner instance for status display    |
| `stats`   | `UpdateStats` | Update statistics object to track progress |

**Returns:** `Promise<void>` - Updates `stats.commandsUpdated` count

**Side Effects:**

- Reads from SDK template directory
- Creates `.claude/commands/` subdirectories if missing
- Overwrites existing command files in `.claude/commands/`
- Updates `stats.commandsUpdated` counter

---

## Command Organization

### 7 Command Categories

Commands are organized by workflow phase and purpose:

#### 1. Session Commands

```
.claude/commands/session/
├── trinity-init.md - Initialize Trinity Method session
├── trinity-end.md - End Trinity session with summary
└── trinity-sync.md - Synchronize session state
```

#### 2. Planning Commands

```
.claude/commands/planning/
├── trinity-plan.md - Create feature implementation plan
├── trinity-audit.md - Audit codebase for issues
└── trinity-investigate.md - Deep-dive investigation
```

#### 3. Execution Commands

```
.claude/commands/execution/
├── trinity-execute.md - Execute planned task
├── trinity-implement.md - Implement feature
├── trinity-test.md - Run test suite
└── trinity-fix.md - Fix identified issue
```

#### 4. Investigation Commands

```
.claude/commands/investigation/
├── trinity-analyze.md - Analyze code patterns
├── trinity-debug.md - Debug specific issue
└── trinity-trace.md - Trace execution flow
```

#### 5. Infrastructure Commands

```
.claude/commands/infrastructure/
├── trinity-deploy.md - Deploy Trinity Method SDK
├── trinity-update.md - Update Trinity components
├── trinity-rollback.md - Rollback deployment
└── trinity-health.md - Health check
```

#### 6. Maintenance Commands

```
.claude/commands/maintenance/
├── trinity-refactor.md - Refactor code
├── trinity-optimize.md - Optimize performance
├── trinity-cleanup.md - Clean up technical debt
└── trinity-document.md - Update documentation
```

#### 7. Utility Commands

```
.claude/commands/utility/
├── trinity-status.md - Show project status
├── trinity-metrics.md - Display metrics
├── trinity-search.md - Search codebase
└── trinity-help.md - Show Trinity help
```

---

## Update Process

### Phase 1: SDK Path Resolution

```
Call: getSDKPath()
Purpose: Locate SDK installation (dev/local/global)
Result: Path to SDK root directory
```

### Phase 2: Template Path Validation

```
Check: ${SDK_PATH}/dist/templates/.claude/commands
If not exists:
  Spinner: ⚠ "Commands template path not found, skipping"
  Return early (no error thrown)
```

### Phase 3: Category Iteration

```
For each command category:
  session → planning → execution → investigation →
  infrastructure → maintenance → utility

1. Construct source path:
   ${SDK_PATH}/dist/templates/.claude/commands/${category}

2. Construct target path:
   .claude/commands/${category}

3. Check if source directory exists
4. Ensure target directory exists (create if missing)
```

### Phase 4: File Processing

```
For each file in source directory:
  1. Check if filename ends with '.md.template'
  2. If yes:
     a. Read source file
     b. Strip .template extension
     c. Copy to target with overwrite
     d. Increment stats.commandsUpdated
  3. If no: Skip (not a command template)
```

### Phase 5: Completion

```
Spinner: ✓ "Slash commands updated (N files)"
Where N = total command files updated
```

---

## Usage Examples

### Basic Usage

```typescript
import { updateCommands } from './commands/update/commands.js';
import ora from 'ora';

const spinner = ora();
const stats = { commandsUpdated: 0 };

await updateCommands(spinner, stats);

console.log(`Updated ${stats.commandsUpdated} commands`);
```

### Integration with Update Command

```typescript
import { updateAgents } from './update/agents.js';
import { updateCommands } from './update/commands.js';
import { updateKnowledgeBase } from './update/knowledge-base.js';

const stats = {
  agentsUpdated: 0,
  commandsUpdated: 0,
  knowledgeBaseUpdated: 0,
};

// Update all Trinity components
await updateAgents(spinner, stats);
await updateCommands(spinner, stats);
await updateKnowledgeBase(spinner, stats);

console.log('Update summary:', stats);
```

### Selective Command Updates

```typescript
// Update only specific command categories
const SELECTED_CATEGORIES = ['session', 'planning', 'execution'];

for (const category of SELECTED_CATEGORIES) {
  const sourcePath = path.join(sdkPath, 'dist/templates/.claude/commands', category);
  const targetPath = path.join('.claude/commands', category);

  // Update category...
}
```

---

## File Operations

### Template Stripping Example

**Source File (SDK):**

```
dist/templates/.claude/commands/session/trinity-init.md.template
```

**Target File (Project):**

```
.claude/commands/session/trinity-init.md
```

**Operation:**

```typescript
// Source
const sourcePath = 'dist/templates/.claude/commands/session/trinity-init.md.template';

// Remove .template extension
const deployedFileName = 'trinity-init.md.template'.replace('.template', '');
// Result: 'trinity-init.md'

// Target
const targetPath = '.claude/commands/session/trinity-init.md';

// Copy with overwrite
await fs.copy(sourcePath, targetPath, { overwrite: true });
```

### Directory Structure Before/After

**Before Update:**

```
.claude/
└── commands/
    └── session/
        ├── trinity-init.md (v2.0.0 - outdated)
        └── trinity-end.md (v2.0.0 - outdated)
```

**After Update:**

```
.claude/
└── commands/
    ├── session/
    │   ├── trinity-init.md (v2.1.0 - updated)
    │   ├── trinity-end.md (v2.1.0 - updated)
    │   └── trinity-sync.md (new)
    ├── planning/
    │   ├── trinity-plan.md (v2.1.0)
    │   ├── trinity-audit.md (v2.1.0)
    │   └── trinity-investigate.md (v2.1.0)
    ├── execution/
    │   ├── trinity-execute.md (v2.1.0)
    │   ├── trinity-implement.md (v2.1.0)
    │   ├── trinity-test.md (v2.1.0)
    │   └── trinity-fix.md (v2.1.0)
    ├── investigation/
    │   ├── trinity-analyze.md (v2.1.0)
    │   ├── trinity-debug.md (v2.1.0)
    │   └── trinity-trace.md (v2.1.0)
    ├── infrastructure/
    │   ├── trinity-deploy.md (v2.1.0)
    │   ├── trinity-update.md (v2.1.0)
    │   ├── trinity-rollback.md (v2.1.0)
    │   └── trinity-health.md (v2.1.0)
    ├── maintenance/
    │   ├── trinity-refactor.md (v2.1.0)
    │   ├── trinity-optimize.md (v2.1.0)
    │   ├── trinity-cleanup.md (v2.1.0)
    │   └── trinity-document.md (v2.1.0)
    └── utility/
        ├── trinity-status.md (v2.1.0)
        ├── trinity-metrics.md (v2.1.0)
        ├── trinity-search.md (v2.1.0)
        └── trinity-help.md (v2.1.0)
```

---

## Command Categories Reference

### Complete Command List (24 commands)

| Category       | Command             | Purpose              | File                   |
| -------------- | ------------------- | -------------------- | ---------------------- |
| Session        | trinity-init        | Initialize session   | trinity-init.md        |
| Session        | trinity-end         | End session          | trinity-end.md         |
| Session        | trinity-sync        | Sync state           | trinity-sync.md        |
| Planning       | trinity-plan        | Create plan          | trinity-plan.md        |
| Planning       | trinity-audit       | Audit codebase       | trinity-audit.md       |
| Planning       | trinity-investigate | Deep investigation   | trinity-investigate.md |
| Execution      | trinity-execute     | Execute task         | trinity-execute.md     |
| Execution      | trinity-implement   | Implement feature    | trinity-implement.md   |
| Execution      | trinity-test        | Run tests            | trinity-test.md        |
| Execution      | trinity-fix         | Fix issue            | trinity-fix.md         |
| Investigation  | trinity-analyze     | Analyze patterns     | trinity-analyze.md     |
| Investigation  | trinity-debug       | Debug issue          | trinity-debug.md       |
| Investigation  | trinity-trace       | Trace execution      | trinity-trace.md       |
| Infrastructure | trinity-deploy      | Deploy SDK           | trinity-deploy.md      |
| Infrastructure | trinity-update      | Update components    | trinity-update.md      |
| Infrastructure | trinity-rollback    | Rollback changes     | trinity-rollback.md    |
| Infrastructure | trinity-health      | Health check         | trinity-health.md      |
| Maintenance    | trinity-refactor    | Refactor code        | trinity-refactor.md    |
| Maintenance    | trinity-optimize    | Optimize performance | trinity-optimize.md    |
| Maintenance    | trinity-cleanup     | Clean tech debt      | trinity-cleanup.md     |
| Maintenance    | trinity-document    | Update docs          | trinity-document.md    |
| Utility        | trinity-status      | Show status          | trinity-status.md      |
| Utility        | trinity-metrics     | Display metrics      | trinity-metrics.md     |
| Utility        | trinity-search      | Search codebase      | trinity-search.md      |
| Utility        | trinity-help        | Show help            | trinity-help.md        |

---

## Overwrite Strategy

### Why Overwrite?

**Command templates receive updates** including:

- Bug fixes and improvements
- New command options/flags
- Updated documentation
- Enhanced error messages
- Performance optimizations

### User Customization

**If users need custom commands:**

**Option 1: Custom Commands Directory**

```
.claude/
├── commands/          (managed by SDK)
└── custom-commands/   (user-managed)
    └── my-custom-command.md
```

**Option 2: Extend Existing Commands**

```markdown
# In .claude/custom-commands/trinity-init-extended.md

<!-- Import base command -->

{{include:commands/session/trinity-init.md}}

<!-- Add custom logic -->

## Custom Initialization Steps

1. Check environment variables
2. Validate API keys
3. ...
```

---

## Statistics Tracking

### UpdateStats Interface

```typescript
interface UpdateStats {
  agentsUpdated?: number;
  commandsUpdated: number;
  knowledgeBaseUpdated?: number;
  templatesUpdated?: number;
}
```

### Incrementing Stats

```typescript
// For each command file copied:
stats.commandsUpdated++;

// Example progression:
// Start: stats.commandsUpdated = 0
// After session: stats.commandsUpdated = 3
// After planning: stats.commandsUpdated = 6
// After execution: stats.commandsUpdated = 10
// After investigation: stats.commandsUpdated = 13
// After infrastructure: stats.commandsUpdated = 17
// After maintenance: stats.commandsUpdated = 21
// After utility: stats.commandsUpdated = 25
```

### Console Output

```
⠋ Updating slash commands...
✓ Slash commands updated (25 files)
```

---

## Error Handling

### Graceful Failures

**Template Path Missing:**

```typescript
if (!(await fs.pathExists(commandsTemplatePath))) {
  spinner.warn('Commands template path not found, skipping');
  return; // Exit early, no error thrown
}
```

**Category Directory Missing:**

```typescript
if (await fs.pathExists(sourceCategoryPath)) {
  // Update commands in this category
} else {
  // Silently skip (category doesn't exist in SDK version)
  // Continue with other categories
}
```

**File Copy Failure:**

```typescript
try {
  await fs.copy(sourcePath, targetPath, { overwrite: true });
  stats.commandsUpdated++;
} catch (error) {
  // Error bubbles up to update command handler
  throw error;
}
```

### Common Error Scenarios

**1. Permission Denied**

```
Error: EACCES: permission denied, open '.claude/commands/session/trinity-init.md'
Solution: Run with appropriate permissions or fix file ownership
```

**2. SDK Not Installed**

```
Error: SDK path not found
Solution: Install Trinity Method SDK first (npm install trinity-method-sdk)
```

**3. Disk Full**

```
Error: ENOSPC: no space left on device
Solution: Free up disk space
```

---

## Integration Points

### Called By

- `src/cli/commands/update.ts` - Main update command
- `trinity-update` CLI command

### Calls

- `getSDKPath()` - Resolves SDK installation path (from `utils.ts`)
- `fs.pathExists()` - Checks directory/file existence
- `fs.ensureDir()` - Creates target directories
- `fs.readdir()` - Lists source files
- `fs.copy()` - Copies command files

### Updates

- `.claude/commands/` - Target directory for all command files
- `stats.commandsUpdated` - Progress tracking counter

---

## Testing Considerations

### Unit Testing

```typescript
import { updateCommands } from './commands';
import fs from 'fs-extra';
import { createMockSpinner } from '../../../test/helpers';

describe('updateCommands', () => {
  let spinner;
  let stats;

  beforeEach(() => {
    spinner = createMockSpinner();
    stats = { commandsUpdated: 0 };
  });

  afterEach(async () => {
    await fs.remove('.claude/commands');
  });

  it('should update all command files', async () => {
    await updateCommands(spinner, stats);

    expect(stats.commandsUpdated).toBeGreaterThan(0);
    expect(await fs.pathExists('.claude/commands/session/trinity-init.md')).toBe(true);
  });

  it('should strip .template extension', async () => {
    await updateCommands(spinner, stats);

    // Should NOT have .template extension
    expect(await fs.pathExists('.claude/commands/session/trinity-init.md.template')).toBe(false);
    // Should have clean .md extension
    expect(await fs.pathExists('.claude/commands/session/trinity-init.md')).toBe(true);
  });

  it('should organize by category', async () => {
    await updateCommands(spinner, stats);

    const categories = [
      'session',
      'planning',
      'execution',
      'investigation',
      'infrastructure',
      'maintenance',
      'utility',
    ];

    for (const category of categories) {
      expect(await fs.pathExists(`.claude/commands/${category}`)).toBe(true);
    }
  });

  it('should overwrite existing files', async () => {
    // Create old version
    await fs.ensureDir('.claude/commands/session');
    await fs.writeFile('.claude/commands/session/trinity-init.md', 'Old content');

    await updateCommands(spinner, stats);

    const content = await fs.readFile('.claude/commands/session/trinity-init.md', 'utf-8');
    expect(content).not.toBe('Old content');
  });

  it('should handle missing template path gracefully', async () => {
    // Mock SDK path with missing commands directory
    jest.spyOn(utils, 'getSDKPath').mockResolvedValue('/fake/path');

    await updateCommands(spinner, stats);

    expect(spinner.warn).toHaveBeenCalledWith('Commands template path not found, skipping');
    expect(stats.commandsUpdated).toBe(0);
  });
});
```

### Integration Testing

```typescript
describe('Command Updates Integration', () => {
  it('should integrate with update command', async () => {
    const result = await runUpdateCommand(['--commands-only']);

    expect(result.commandsUpdated).toBeGreaterThan(20);
    expect(await fs.pathExists('.claude/commands/session/trinity-init.md')).toBe(true);
  });

  it('should work with all categories', async () => {
    const result = await runUpdateCommand();

    const categories = await fs.readdir('.claude/commands');
    expect(categories).toContain('session');
    expect(categories).toContain('planning');
    expect(categories).toContain('execution');
  });
});
```

---

## Performance Considerations

### Update Time

- **SDK path resolution**: ~10ms
- **Template path validation**: ~5ms
- **Directory traversal**: ~30ms per category (7 total)
- **File operations**: ~5-10ms per command (25 total)
- **Total time**: ~500ms - 1 second typical

### Optimization Strategies

- Parallel file copying within categories
- Batch directory creation
- Delta updates (only changed files)
- Caching SDK path resolution

### Parallel Update Example

```typescript
// Current: Sequential
for (const file of commandFiles) {
  await fs.copy(sourcePath, targetPath);
  stats.commandsUpdated++;
}

// Optimized: Parallel
await Promise.all(
  commandFiles.map(async (file) => {
    await fs.copy(sourcePath, targetPath);
    stats.commandsUpdated++;
  })
);
```

---

## Security Considerations

### File System Safety

- Only reads from SDK template directory (trusted source)
- Only writes to `.claude/commands/` (isolated directory)
- No arbitrary path traversal
- Category whitelist (COMMAND_CATEGORIES constant)

### Template Validation

- Templates stored in SDK package (npm verified)
- No user input in file paths
- Extension validation (`.md.template`)
- Directory whitelist prevents malicious paths

---

## Related Documentation

- **Update Command**: [docs/api/update-command.md](docs/api/update-command.md)
- **Agent Updates**: [docs/api/update-agents.md](docs/api/update-agents.md)
- **Knowledge Base Updates**: [docs/api/update-knowledge-base.md](docs/api/update-knowledge-base.md) (pending)
- **SDK Path Resolution**: [docs/api/get-sdk-path.md](docs/api/get-sdk-path.md) (pending)
- **Slash Commands Guide**: [docs/guides/slash-commands.md](docs/guides/slash-commands.md)

---

## Version History

| Version | Date       | Changes                                                 |
| ------- | ---------- | ------------------------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with 7 categories                |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3, expanded to 25 commands |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
