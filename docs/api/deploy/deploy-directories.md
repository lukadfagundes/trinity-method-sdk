# Deploy Directories - Structure Creation

**Module:** `src/cli/commands/deploy/directories.ts`
**Purpose:** Create Trinity Method directory structure
**Dependencies:** fs-extra

---

## Overview

The Directories module creates the complete Trinity Method directory structure in the target project. It ensures all necessary folders exist for agents, knowledge base, sessions, investigations, and archives.

**Why This Exists:**
Trinity's 19-agent system requires a well-organized directory structure to function effectively. This module creates 17 directories that serve as the foundation for agent collaboration, knowledge management, and workflow orchestration.

---

## Main Function

### `createDirectories(spinner: Spinner): Promise<number>`

Creates complete Trinity directory structure.

**Parameters:**

| Parameter | Type            | Required | Description                           |
| --------- | --------------- | -------- | ------------------------------------- |
| `spinner` | `Spinner` (Ora) | Yes      | Spinner instance for progress display |

**Returns:** `Promise<number>` - Number of directories created (17)

**Behavior:**

- Uses `fs.ensureDir()` to create directories (idempotent - won't fail if exists)
- Creates 12 Trinity core directories
- Creates 5 Claude Code agent directories
- Updates spinner with progress and success message

---

## Directory Structure

### Trinity Core Directories (12 total)

#### 1. Knowledge Base

**Path:** `trinity/knowledge-base/`
**Purpose:** Stores project knowledge and documentation
**Contents:**

- `ARCHITECTURE.md` - System architecture and metrics baseline
- `To-do.md` - Task tracking
- `ISSUES.md` - Known issues and solutions
- `Technical-Debt.md` - Technical debt tracking
- `Trinity.md` - Trinity Method project guide
- `TESTING-PRINCIPLES.md` - Testing standards
- `CODING-PRINCIPLES.md` - Coding standards
- `DOCUMENTATION-CRITERIA.md` - Documentation standards

---

#### 2. Sessions

**Path:** `trinity/sessions/`
**Purpose:** Stores session artifacts and logs
**Contents:**

- `[YYYY-MM-DD]-[HHMMSS]/` - Session directories
  - `SESSION-SUMMARY.md`
  - `investigation-summary.md`
  - `patterns-discovered.md`
  - `issues-resolved.md`
  - `performance-report.md`

**Usage:** Automatically created by agents during workflow execution

---

#### 3. Investigations

**Path:** `trinity/investigations/`
**Purpose:** Stores investigation work products
**Contents:**

- `[investigation-name]/` - Investigation directories
  - `investigation-plan.md`
  - `findings.md`
  - `recommendations.md`

**Usage:** Created by investigation workflow (`/trinity-investigate`)

---

#### 4. Investigation Plans

**Path:** `trinity/investigations/plans/`
**Purpose:** Stores investigation planning documents
**Contents:**

- Investigation plan templates
- Research findings

**Usage:** Separate subdirectory for investigation organization

---

#### 5. Patterns

**Path:** `trinity/patterns/`
**Purpose:** Stores reusable solution patterns
**Contents:**

- `[pattern-name].md` - Discovered patterns
- Best practices
- Reusable solutions

**Usage:** Agents extract and generalize patterns from completed work

---

#### 6. Work Orders

**Path:** `trinity/work-orders/`
**Purpose:** Stores active and completed work orders
**Contents:**

- `WORKORDER-XXX.md` - Work order documents
- Task specifications
- Implementation plans

**Usage:** Created by work order workflow (`/trinity-workorder`)

---

#### 7. Templates

**Path:** `trinity/templates/`
**Purpose:** Stores template files for agents
**Contents:**

- `work-order/WORKORDER-TEMPLATE.md`
- `investigation/INVESTIGATION-TEMPLATE.md`
- `documentation/` - Documentation templates

**Usage:** Source templates for agent-generated documents

---

#### 8. Reports

**Path:** `trinity/reports/`
**Purpose:** Stores agent-generated reports
**Contents:**

- Audit reports (JUNO)
- Quality reports
- Performance reports

**Usage:** Created by agents during analysis and auditing

---

#### 9-12. Archive Directories (4 total)

**Paths:**

- `trinity/archive/work-orders/` - Archived work orders
- `trinity/archive/investigations/` - Archived investigations
- `trinity/archive/reports/` - Archived reports
- `trinity/archive/sessions/` - Archived session artifacts

**Purpose:** Long-term storage of completed work
**Usage:** Agents move completed items to archives to keep active directories clean

---

### Claude Code Agent Directories (5 total)

#### 1. Leadership Agents

**Path:** `.claude/agents/leadership/`
**Purpose:** Stores leadership agent templates
**Agents:**

- AJ MAESTRO (Workflow Orchestrator)
- JUNO (Quality Auditor)

---

#### 2. Deployment Agents

**Path:** `.claude/agents/deployment/`
**Purpose:** Stores deployment agent templates
**Agents:**

- CAP (Configuration Specialist)
- EMP (Environment Manager)
- ALF (Linting & Formatting Specialist)
- DAT (Database Specialist)

---

#### 3. Audit Agents

**Path:** `.claude/agents/audit/`
**Purpose:** Stores audit agent templates
**Agents:**

- JUNO (Quality Auditor) - Symlinked from leadership

---

#### 4. Planning Agents

**Path:** `.claude/agents/planning/`
**Purpose:** Stores planning agent templates
**Agents:**

- MON (Requirements Analyzer)
- ROR (Design Architect)
- TRA (Implementation Planner)
- EUS (Task Decomposer)

---

#### 5. AJ Team (Execution Agents)

**Path:** `.claude/agents/aj-team/`
**Purpose:** Stores execution agent templates
**Agents:**

- KIL (Task Executor)
- APO (Documentation Specialist)
- ZEN (Knowledge Manager)
- INO (Context Specialist)
- EIN (CI/CD Specialist)
- VER (Code Reviewer)
- TAN (Directory Organizer)

---

## Complete Directory Tree

```
project-root/
├── .claude/
│   └── agents/
│       ├── leadership/       (AJ MAESTRO, JUNO)
│       ├── deployment/       (CAP, EMP, ALF, DAT)
│       ├── audit/            (JUNO symlink)
│       ├── planning/         (MON, ROR, TRA, EUS)
│       └── aj-team/          (KIL, APO, ZEN, INO, EIN, VER, TAN)
│
└── trinity/
    ├── knowledge-base/       (8 knowledge files)
    ├── sessions/             (Session artifacts)
    ├── investigations/       (Investigation work)
    │   └── plans/            (Investigation planning)
    ├── patterns/             (Reusable patterns)
    ├── work-orders/          (Active work orders)
    ├── templates/            (Template files)
    ├── reports/              (Agent reports)
    └── archive/
        ├── work-orders/      (Archived work orders)
        ├── investigations/   (Archived investigations)
        ├── reports/          (Archived reports)
        └── sessions/         (Archived sessions)
```

---

## Usage in Deploy Workflow

Directories are created in Step 4 of the 12-step deployment:

```typescript
// STEP 1: Pre-flight checks
await checkPreFlight(options, spinner);

// STEP 2: Detect technology stack
const stack = await detectStack();

// STEP 3: Interactive configuration
const config = await promptConfiguration(options, stack);

// STEP 4: Create directory structure
const directoriesCreated = await createDirectories(spinner);
progress.directories = directoriesCreated;

// STEP 5-12: Deploy content to directories
```

**Position in Workflow:** Early step (4/12) - must exist before content deployment

**Purpose:** Ensure all target directories exist before file deployments

---

## Implementation Details

### fs.ensureDir() Behavior

```typescript
await fs.ensureDir('trinity/knowledge-base');
```

**Behavior:**

- ✅ Creates directory if it doesn't exist
- ✅ Does nothing if directory already exists (no error)
- ✅ Creates parent directories recursively
- ✅ Safe to call multiple times (idempotent)

**Example:**

```typescript
// First call: Creates directory
await fs.ensureDir('trinity/sessions'); // ✅ Created

// Second call: No-op
await fs.ensureDir('trinity/sessions'); // ✅ Already exists, no error
```

---

### Directory Count Tracking

```typescript
let directoriesCreated = 0;

// Trinity core directories
await fs.ensureDir('trinity/knowledge-base');
// ... (12 total)
directoriesCreated += 12;

// Claude Code directories
await fs.ensureDir('.claude/agents/leadership');
// ... (5 total)
directoriesCreated += 5;

return directoriesCreated; // Returns 17
```

**Purpose:** Track deployment progress for summary display

---

## Spinner Status Updates

### Starting Creation

```typescript
spinner.start('Creating Trinity Method structure...');
```

**Display:** `⠸ Creating Trinity Method structure...`

---

### Success

```typescript
spinner.succeed('Trinity Method structure created');
```

**Display:** `✔ Trinity Method structure created`

---

## Usage Examples

### Example 1: Fresh Deployment

```bash
npx trinity deploy
```

**Output:**

```
✔ Trinity Method structure created
```

**Result:** 17 directories created

---

### Example 2: Redeployment (--force)

```bash
npx trinity deploy --force
```

**Output:**

```
✔ Trinity Method structure created
```

**Result:** 0 new directories (all exist), no errors

**Note:** `fs.ensureDir()` is idempotent, so existing directories don't cause errors

---

## Performance Considerations

### Execution Time

- **Creation duration:** <50ms (17 directory operations)
- **Network I/O:** 0 (local file system only)
- **Disk I/O:** 17 directory creation operations

### File System Operations

- **Write operations:** 0-17 (depending on what exists)
- **Read operations:** 0 (ensureDir doesn't check existence first)

---

## Error Handling

### File System Errors

**Potential Errors:**

- Permission denied (EACCES)
- Disk full (ENOSPC)
- Invalid path (EINVAL)

**Behavior:**

```typescript
// No explicit try-catch in function
// Errors propagate to deploy command's main try-catch
try {
  await createDirectories(spinner);
} catch (error) {
  spinner.fail();
  displayError(`Deployment failed: ${error.message}`);
  throw error;
}
```

**User Experience:**

```
❌ Creating Trinity Method structure...
Deployment failed: EACCES: permission denied, mkdir 'trinity'
```

---

## Integration with Deployment

### Content Population

After directories are created, subsequent steps populate them:

**Step 5:** Deploy knowledge base files to `trinity/knowledge-base/`
**Step 6:** Deploy root files to project root
**Step 7:** Deploy agent templates to `.claude/agents/*/`
**Step 9:** Deploy Claude setup to `.claude/`
**Step 10:** Deploy templates to `trinity/templates/`

---

## Design Rationale

### Why Separate Leadership/Deployment/Planning Directories?

**Options Considered:**

1. ❌ All agents in `.claude/agents/` (flat structure)
2. ✅ Categorized subdirectories

**Chosen Approach:** Categorized subdirectories

- **Benefit:** Easier agent navigation and organization
- **Benefit:** Clear separation of concerns
- **Benefit:** Supports future expansion of agent categories

---

### Why Archive Subdirectories?

**Purpose:** Prevent active directories from becoming cluttered

**Benefits:**

- ✅ Faster file scanning (fewer files in active dirs)
- ✅ Clear separation of active vs completed work
- ✅ Easier to clean up old artifacts

---

## Related Documentation

- **Deploy Command:** [deploy-command.md](deploy-command.md)
- **Agent Deployment:** [deploy-agents.md](deploy-agents.md)
- **Knowledge Base Deployment:** [deploy-knowledge-base.md](deploy-knowledge-base.md)
- **Templates Deployment:** [deploy-templates.md](deploy-templates.md)

---

## Type Definitions

### Spinner (Ora)

```typescript
interface Spinner {
  start(text?: string): Spinner; // Start spinner with message
  succeed(text?: string): Spinner; // Show success checkmark
  fail(text?: string): Spinner; // Show failure X
  warn(text?: string): Spinner; // Show warning
}
```

---

**Last Updated:** 2026-01-21
**Trinity SDK Version:** 2.1.0
**Maintained By:** APO-2 (Documentation Specialist)
