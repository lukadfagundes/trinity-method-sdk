# Agent Updates - Update Command

**Module:** `src/cli/commands/update/agents.ts`
**Purpose:** Update 19 agent templates while preserving user content
**Category:** Update Command - Agent Management
**Priority:** MEDIUM

---

## Overview

The Agent Updates module synchronizes agent template files from the Trinity Method SDK to the project's `.claude/agents/` directory. It updates all 19 specialized agents across 5 categories, ensuring projects have the latest agent capabilities while preserving user customizations.

### Key Features

- **Hierarchical structure**: Organizes agents by role (leadership, planning, aj-team, deployment, audit)
- **Template stripping**: Removes `.template` extension during deployment
- **Overwrite strategy**: Updates all agent files to latest versions
- **Progress tracking**: Reports number of agents updated
- **SDK path resolution**: Supports dev, local, and global SDK installations

---

## API Reference

### `updateAgents(spinner, stats)`

Updates agent files from SDK templates to `.claude/agents/`.

**Signature:**

```typescript
async function updateAgents(spinner: Ora, stats: UpdateStats): Promise<void>;
```

**Parameters:**

| Parameter | Type          | Description                                |
| --------- | ------------- | ------------------------------------------ |
| `spinner` | `Ora`         | ora spinner instance for status display    |
| `stats`   | `UpdateStats` | Update statistics object to track progress |

**Returns:** `Promise<void>` - Updates `stats.agentsUpdated` count

**Side Effects:**

- Reads from SDK template directory
- Creates `.claude/agents/` subdirectories if missing
- Overwrites existing agent files in `.claude/agents/`
- Updates `stats.agentsUpdated` counter

---

## Agent Organization

### 5 Agent Categories

The Trinity Method SDK includes 19 agents organized into 5 categories:

#### 1. Leadership (1 agent)

```
.claude/agents/leadership/
└── AJ-MAESTRO.md - Master orchestrator and strategic director
```

#### 2. Planning (3 agents)

```
.claude/agents/planning/
├── JUNO.md - Analysis & Planning Specialist
├── RAVEN.md - Requirement Validator
└── SOL.md - Solution Architect
```

#### 3. AJ-Team (10 agents)

```
.claude/agents/aj-team/
├── KIL.md - Task Executor
├── APO.md - Documentation Specialist
├── DAZ.md - Quality Assurance Engineer
├── GEN.md - Generator Agent
├── NEO.md - Enhancement Specialist
├── PIX.md - Frontend Specialist
├── SAGE.md - Knowledge Manager
├── SIFT.md - Codebase Navigator
├── SYNC.md - State Synchronizer
└── VEX.md - Debugger/Troubleshooter
```

#### 4. Deployment (3 agents)

```
.claude/agents/deployment/
├── HARBOR.md - Release Manager
├── NOVA.md - CI/CD Integration Specialist
└── TORCH.md - Rollback Coordinator
```

#### 5. Audit (2 agents)

```
.claude/agents/audit/
├── CHRONICLE.md - Project Historian
└── GUARDIAN.md - Security Auditor
```

---

## Update Process

### Phase 1: SDK Path Resolution

```
Call: getSDKPath()
Purpose: Locate SDK installation (dev/local/global)
Result: Path to SDK root directory

Example Paths:
  Dev: /path/to/trinity-method-sdk
  Local: ./node_modules/trinity-method-sdk
  Global: /usr/local/lib/node_modules/trinity-method-sdk
```

### Phase 2: Directory Iteration

```
For each agent category:
  leadership → planning → aj-team → deployment → audit

1. Construct source path:
   ${SDK_PATH}/dist/templates/.claude/agents/${category}

2. Construct target path:
   .claude/agents/${category}

3. Check if source directory exists
4. Ensure target directory exists (create if missing)
```

### Phase 3: File Processing

```
For each file in source directory:
  1. Check if filename ends with '.md.template'
  2. If yes:
     a. Read source file
     b. Strip .template extension
     c. Copy to target with overwrite
     d. Increment stats.agentsUpdated
  3. If no: Skip (not an agent template)
```

### Phase 4: Completion

```
Spinner: ✓ "Agents updated (N files)"
Where N = total agent files updated
```

---

## Usage Examples

### Basic Usage

```typescript
import { updateAgents } from './commands/update/agents.js';
import ora from 'ora';

const spinner = ora();
const stats = { agentsUpdated: 0 };

await updateAgents(spinner, stats);

console.log(`Updated ${stats.agentsUpdated} agents`);
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

console.log('Update complete:', stats);
```

### Custom Stats Tracking

```typescript
interface DetailedStats extends UpdateStats {
  agentsUpdated: number;
  agentsByCategory: {
    leadership: number;
    planning: number;
    'aj-team': number;
    deployment: number;
    audit: number;
  };
}

const stats: DetailedStats = {
  agentsUpdated: 0,
  agentsByCategory: {
    leadership: 0,
    planning: 0,
    'aj-team': 0,
    deployment: 0,
    audit: 0,
  },
};

await updateAgents(spinner, stats);
```

---

## File Operations

### Template Stripping Example

**Source File (SDK):**

```
dist/templates/.claude/agents/aj-team/APO.md.template
```

**Target File (Project):**

```
.claude/agents/aj-team/APO.md
```

**Operation:**

```typescript
// Source
const sourceFile = 'dist/templates/.claude/agents/aj-team/APO.md.template';

// Remove .template extension
const deployedFileName = 'APO.md.template'.replace('.template', '');
// Result: 'APO.md'

// Target
const targetFile = '.claude/agents/aj-team/APO.md';

// Copy with overwrite
await fs.copy(sourceFile, targetFile, { overwrite: true });
```

### Directory Structure Before/After

**Before Update:**

```
.claude/
└── agents/
    ├── leadership/
    │   └── AJ-MAESTRO.md (v2.0.0 - outdated)
    └── planning/
        └── JUNO.md (v2.0.0 - outdated)
```

**After Update:**

```
.claude/
└── agents/
    ├── leadership/
    │   └── AJ-MAESTRO.md (v2.1.0 - updated)
    ├── planning/
    │   ├── JUNO.md (v2.1.0 - updated)
    │   ├── RAVEN.md (new)
    │   └── SOL.md (new)
    ├── aj-team/
    │   ├── KIL.md (v2.1.0)
    │   ├── APO.md (v2.1.0)
    │   ├── ... (8 more agents)
    ├── deployment/
    │   ├── HARBOR.md (v2.1.0)
    │   ├── NOVA.md (v2.1.0)
    │   └── TORCH.md (v2.1.0)
    └── audit/
        ├── CHRONICLE.md (v2.1.0)
        └── GUARDIAN.md (v2.1.0)
```

---

## Overwrite Strategy

### Why Overwrite?

**Agent templates are meant to be updated**, not customized:

- Agents receive bug fixes and improvements
- New capabilities added over time
- Consistency across projects maintained
- Breaking changes handled in major versions

### User Customization Preservation

**If users need to customize agents:**

**Option 1: Custom Agents Directory**

```
.claude/
├── agents/          (managed by SDK)
└── custom-agents/   (user-managed)
    └── MY-CUSTOM-AGENT.md
```

**Option 2: Fork and Modify SDK**

```bash
# Fork SDK repository
git clone https://github.com/user/trinity-method-sdk-fork.git

# Modify agents in your fork
# Use your fork instead of official SDK
npm install user/trinity-method-sdk-fork
```

**Option 3: Agent Configuration Files**

```
.claude/
├── agents/          (managed by SDK)
└── agent-config.json (user preferences)
```

---

## Statistics Tracking

### UpdateStats Interface

```typescript
interface UpdateStats {
  agentsUpdated: number;
  commandsUpdated?: number;
  knowledgeBaseUpdated?: number;
  templatesUpdated?: number;
}
```

### Incrementing Stats

```typescript
// For each agent file copied:
stats.agentsUpdated++;

// Example progression:
// Start: stats.agentsUpdated = 0
// After leadership: stats.agentsUpdated = 1
// After planning: stats.agentsUpdated = 4
// After aj-team: stats.agentsUpdated = 14
// After deployment: stats.agentsUpdated = 17
// After audit: stats.agentsUpdated = 19
```

### Console Output

```
⠋ Updating agents...
✓ Agents updated (19 files)
```

---

## Error Handling

### Graceful Failures

**Source Directory Missing:**

```typescript
if (await fs.pathExists(sourcePath)) {
  // Update agents
} else {
  // Silently skip (directory doesn't exist in SDK)
  // No error thrown, continue with other categories
}
```

**File Copy Failure:**

```typescript
try {
  await fs.copy(sourceFile, targetFile, { overwrite: true });
  stats.agentsUpdated++;
} catch (error) {
  // Error bubbles up to update command handler
  // Spinner shows failure message
  throw error;
}
```

### Common Error Scenarios

**1. Permission Denied**

```
Error: EACCES: permission denied, open '.claude/agents/aj-team/KIL.md'
Solution: Run with appropriate permissions or fix file ownership
```

**2. SDK Not Installed**

```
Error: SDK path not found
Solution: Install Trinity Method SDK first
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
- `fs.pathExists()` - Checks directory existence
- `fs.ensureDir()` - Creates target directories
- `fs.readdir()` - Lists source files
- `fs.copy()` - Copies agent files

### Updates

- `.claude/agents/` - Target directory for all agent files
- `stats.agentsUpdated` - Progress tracking counter

---

## Testing Considerations

### Unit Testing

```typescript
import { updateAgents } from './agents';
import fs from 'fs-extra';
import { createMockSpinner } from '../../../test/helpers';

describe('updateAgents', () => {
  let spinner;
  let stats;

  beforeEach(() => {
    spinner = createMockSpinner();
    stats = { agentsUpdated: 0 };
  });

  afterEach(async () => {
    await fs.remove('.claude/agents');
  });

  it('should update all agent files', async () => {
    await updateAgents(spinner, stats);

    expect(stats.agentsUpdated).toBeGreaterThan(0);
    expect(await fs.pathExists('.claude/agents/aj-team/KIL.md')).toBe(true);
  });

  it('should strip .template extension', async () => {
    await updateAgents(spinner, stats);

    // Should NOT have .template extension
    expect(await fs.pathExists('.claude/agents/aj-team/APO.md.template')).toBe(false);
    // Should have clean .md extension
    expect(await fs.pathExists('.claude/agents/aj-team/APO.md')).toBe(true);
  });

  it('should overwrite existing files', async () => {
    // Create old version
    await fs.ensureDir('.claude/agents/aj-team');
    await fs.writeFile('.claude/agents/aj-team/KIL.md', 'Old content');

    await updateAgents(spinner, stats);

    const content = await fs.readFile('.claude/agents/aj-team/KIL.md', 'utf-8');
    expect(content).not.toBe('Old content');
  });
});
```

### Integration Testing

```typescript
describe('Agent Updates Integration', () => {
  it('should integrate with update command', async () => {
    const result = await runUpdateCommand(['--agents-only']);

    expect(result.agentsUpdated).toBe(19);
    expect(await fs.pathExists('.claude/agents/leadership/AJ-MAESTRO.md')).toBe(true);
  });
});
```

---

## Performance Considerations

### Update Time

- **SDK path resolution**: ~10ms
- **Directory traversal**: ~50ms per category (5 total)
- **File operations**: ~5-10ms per agent (19 total)
- **Total time**: ~500ms - 1 second typical

### Optimization Strategies

- Parallel file copying (currently sequential)
- Batch directory creation
- Delta updates (only changed files)
- Compression for network transfers (future)

### Parallel Update Example

```typescript
// Current: Sequential
for (const file of files) {
  await fs.copy(sourceFile, targetFile);
}

// Optimized: Parallel
await Promise.all(files.map((file) => fs.copy(sourceFile, targetFile)));
```

---

## Security Considerations

### File System Safety

- Only reads from SDK template directory (trusted source)
- Only writes to `.claude/agents/` (isolated directory)
- No arbitrary path traversal
- Overwrite permission controlled by fs.copy option

### Template Validation

- Templates stored in SDK package (npm verified)
- No user input in file paths
- Extension validation (`.md.template`)
- Directory whitelist (AGENT_DIRS constant)

---

## Related Documentation

- **Update Command**: [docs/api/update-command.md](docs/api/update-command.md)
- **Command Updates**: [docs/api/update-commands.md](docs/api/update-commands.md) (pending)
- **Knowledge Base Updates**: [docs/api/update-knowledge-base.md](docs/api/update-knowledge-base.md) (pending)
- **SDK Path Resolution**: [docs/api/get-sdk-path.md](docs/api/get-sdk-path.md) (pending)
- **Agent Directory**: [.claude/EMPLOYEE-DIRECTORY.md](../../.claude/EMPLOYEE-DIRECTORY.md)

---

## Agent Categories Reference

### Complete Agent List (19 total)

| Category   | Agent      | Role                     | File          |
| ---------- | ---------- | ------------------------ | ------------- |
| Leadership | AJ MAESTRO | Master Orchestrator      | AJ-MAESTRO.md |
| Planning   | JUNO       | Analysis & Planning      | JUNO.md       |
| Planning   | RAVEN      | Requirement Validator    | RAVEN.md      |
| Planning   | SOL        | Solution Architect       | SOL.md        |
| AJ-Team    | KIL        | Task Executor            | KIL.md        |
| AJ-Team    | APO        | Documentation Specialist | APO.md        |
| AJ-Team    | DAZ        | QA Engineer              | DAZ.md        |
| AJ-Team    | GEN        | Generator Agent          | GEN.md        |
| AJ-Team    | NEO        | Enhancement Specialist   | NEO.md        |
| AJ-Team    | PIX        | Frontend Specialist      | PIX.md        |
| AJ-Team    | SAGE       | Knowledge Manager        | SAGE.md       |
| AJ-Team    | SIFT       | Codebase Navigator       | SIFT.md       |
| AJ-Team    | SYNC       | State Synchronizer       | SYNC.md       |
| AJ-Team    | VEX        | Debugger/Troubleshooter  | VEX.md        |
| Deployment | HARBOR     | Release Manager          | HARBOR.md     |
| Deployment | NOVA       | CI/CD Integration        | NOVA.md       |
| Deployment | TORCH      | Rollback Coordinator     | TORCH.md      |
| Audit      | CHRONICLE  | Project Historian        | CHRONICLE.md  |
| Audit      | GUARDIAN   | Security Auditor         | GUARDIAN.md   |

---

## Version History

| Version | Date       | Changes                               |
| ------- | ---------- | ------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with 19 agents |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3        |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
