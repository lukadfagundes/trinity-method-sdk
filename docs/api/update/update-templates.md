# Template Updates - Update Command

**Module:** `src/cli/commands/update/templates.ts`
**Purpose:** Update work order and investigation templates
**Category:** Update Command - Template Management
**Priority:** MEDIUM

---

## Overview

The Template Updates module synchronizes template files from the Trinity Method SDK to the project's `trinity/templates/` directory. It recursively updates 3 template categories: work orders, documentation templates, and investigation templates, ensuring projects have the latest scaffolding tools.

### Key Features

- **Recursive directory traversal**: Handles nested template structures
- **Multi-format support**: Updates both `.md.template` and plain `.md` files
- **Template stripping**: Removes `.template` extension during deployment
- **Overwrite strategy**: Updates all template files to latest versions
- **Progress tracking**: Reports number of templates updated

---

## API Reference

### `updateTemplates(spinner, stats)`

Updates template files from SDK to `trinity/templates/`.

**Signature:**

```typescript
async function updateTemplates(spinner: Ora, stats: UpdateStats): Promise<void>;
```

**Parameters:**

| Parameter | Type          | Description                                |
| --------- | ------------- | ------------------------------------------ |
| `spinner` | `Ora`         | ora spinner instance for status display    |
| `stats`   | `UpdateStats` | Update statistics object to track progress |

**Returns:** `Promise<void>` - Updates `stats.templatesUpdated` count

**Side Effects:**

- Reads from SDK template directory
- Creates `trinity/templates/` subdirectories if missing
- Overwrites existing template files in `trinity/templates/`
- Updates `stats.templatesUpdated` counter

---

### `copyTemplatesRecursively(sourcePath, targetPath, stats)`

Recursively copies template files, handling subdirectories.

**Signature:**

```typescript
async function copyTemplatesRecursively(
  sourcePath: string,
  targetPath: string,
  stats: UpdateStats
): Promise<void>;
```

**Parameters:**

| Parameter    | Type          | Description              |
| ------------ | ------------- | ------------------------ |
| `sourcePath` | `string`      | Source directory path    |
| `targetPath` | `string`      | Target directory path    |
| `stats`      | `UpdateStats` | Update statistics object |

**Returns:** `Promise<void>` - Recursively processes all files and directories

**Processing Rules:**

- **Directories**: Recursively copy contents
- **`.md.template` files**: Copy and strip `.template` extension
- **`.md` files**: Copy as-is (for Mermaid diagrams, examples)
- **Other files**: Ignored

---

## Template Organization

### 3 Template Categories

#### 1. Work Orders

```
trinity/templates/work-orders/
├── WORKORDER-TEMPLATE.md - Standard work order template
├── BUGFIX-WORKORDER.md - Bug fix work order
├── FEATURE-WORKORDER.md - Feature implementation work order
├── REFACTOR-WORKORDER.md - Refactoring work order
└── INVESTIGATION-WORKORDER.md - Investigation work order
```

**Purpose:** Standardized work order templates for different task types

---

#### 2. Documentation

```
trinity/templates/documentation/
├── API-DOCUMENTATION-TEMPLATE.md - API documentation structure
├── README-TEMPLATE.md - README file template
├── CHANGELOG-TEMPLATE.md - CHANGELOG structure
├── ARCHITECTURE-TEMPLATE.md - Architecture documentation
└── diagrams/
    ├── sequence-diagram.md - Mermaid sequence diagram
    ├── class-diagram.md - Mermaid class diagram
    └── flowchart.md - Mermaid flowchart template
```

**Purpose:** Documentation scaffolding and diagram templates

---

#### 3. Investigations

```
trinity/templates/investigations/
├── INVESTIGATION-TEMPLATE.md - Generic investigation template
├── BUG-INVESTIGATION.md - Bug investigation structure
├── PERFORMANCE-INVESTIGATION.md - Performance analysis template
├── SECURITY-INVESTIGATION.md - Security audit template
└── INTEGRATION-INVESTIGATION.md - Integration investigation
```

**Purpose:** Structured investigation templates for different analysis types

---

## Update Process

### Phase 1: SDK Path Resolution

```
Call: getSDKPath()
Purpose: Locate SDK installation (dev/local/global)
Result: Path to SDK root directory
```

### Phase 2: Category Iteration

```
For each template category:
  work-orders → documentation → investigations

1. Construct source path:
   ${SDK_PATH}/dist/templates/trinity/templates/${category}

2. Construct target path:
   trinity/templates/${category}

3. Check if source directory exists
4. Ensure target directory exists (create if missing)
5. Call copyTemplatesRecursively()
```

### Phase 3: Recursive File Processing

```
For each entry in directory:
  If directory:
    1. Create target subdirectory
    2. Recursively process contents

  If file ending with .md.template:
    1. Strip .template extension
    2. Copy to target with overwrite
    3. Increment stats.templatesUpdated

  If file ending with .md:
    1. Copy as-is (no extension change)
    2. Increment stats.templatesUpdated

  If other file type:
    Skip (not a template file)
```

### Phase 4: Completion

```
Spinner: ✓ "Templates updated (N files)"
Where N = total template files updated
```

---

## Usage Examples

### Basic Usage

```typescript
import { updateTemplates } from './commands/update/templates.js';
import ora from 'ora';

const spinner = ora();
const stats = { templatesUpdated: 0 };

await updateTemplates(spinner, stats);

console.log(`Updated ${stats.templatesUpdated} templates`);
```

### Integration with Update Command

```typescript
import { updateAgents } from './update/agents.js';
import { updateCommands } from './update/commands.js';
import { updateKnowledgeBase } from './update/knowledge-base.js';
import { updateTemplates } from './update/templates.js';

const stats = {
  agentsUpdated: 0,
  commandsUpdated: 0,
  knowledgeBaseUpdated: 0,
  templatesUpdated: 0,
};

// Update all Trinity components
await updateAgents(spinner, stats);
await updateCommands(spinner, stats);
await updateKnowledgeBase(spinner, stats);
await updateTemplates(spinner, stats);

console.log('Update summary:', stats);
```

### Custom Template Processing

```typescript
// Process only work order templates
const sourcePath = path.join(sdkPath, 'dist/templates/trinity/templates/work-orders');
const targetPath = 'trinity/templates/work-orders';

if (await fs.pathExists(sourcePath)) {
  await fs.ensureDir(targetPath);
  await copyTemplatesRecursively(sourcePath, targetPath, stats);
}
```

---

## File Operations

### Template Stripping Example (.md.template)

**Source File (SDK):**

```
dist/templates/trinity/templates/work-orders/WORKORDER-TEMPLATE.md.template
```

**Target File (Project):**

```
trinity/templates/work-orders/WORKORDER-TEMPLATE.md
```

**Operation:**

```typescript
// Entry: WORKORDER-TEMPLATE.md.template
if (entry.name.endsWith('.md.template')) {
  const deployedFileName = 'WORKORDER-TEMPLATE.md.template'.replace('.template', '');
  // Result: 'WORKORDER-TEMPLATE.md'

  const targetFilePath = path.join(targetPath, deployedFileName);
  // Result: 'trinity/templates/work-orders/WORKORDER-TEMPLATE.md'

  await fs.copy(sourceFile, targetFilePath, { overwrite: true });
  stats.templatesUpdated++;
}
```

---

### Plain .md File Example (Mermaid Diagrams)

**Source File (SDK):**

```
dist/templates/trinity/templates/documentation/diagrams/sequence-diagram.md
```

**Target File (Project):**

```
trinity/templates/documentation/diagrams/sequence-diagram.md
```

**Operation:**

```typescript
// Entry: sequence-diagram.md
if (entry.name.endsWith('.md')) {
  // Copy as-is (no extension change)
  await fs.copy(sourceFile, targetFile, { overwrite: true });
  stats.templatesUpdated++;
}
```

**Why Plain .md?**

- Mermaid diagram templates are complete files (not template sources)
- Examples and reference documentation
- Ready to use without modification

---

## Recursive Processing

### Example Directory Structure

**SDK Source:**

```
dist/templates/trinity/templates/
├── work-orders/
│   ├── WORKORDER-TEMPLATE.md.template
│   └── BUGFIX-WORKORDER.md.template
├── documentation/
│   ├── README-TEMPLATE.md.template
│   └── diagrams/
│       ├── sequence-diagram.md
│       └── class-diagram.md
└── investigations/
    └── INVESTIGATION-TEMPLATE.md.template
```

**Processing Flow:**

```
1. Process work-orders/
   ├── Copy WORKORDER-TEMPLATE.md.template → WORKORDER-TEMPLATE.md
   └── Copy BUGFIX-WORKORDER.md.template → BUGFIX-WORKORDER.md

2. Process documentation/
   ├── Copy README-TEMPLATE.md.template → README-TEMPLATE.md
   └── Process diagrams/ (subdirectory)
       ├── Copy sequence-diagram.md (as-is)
       └── Copy class-diagram.md (as-is)

3. Process investigations/
   └── Copy INVESTIGATION-TEMPLATE.md.template → INVESTIGATION-TEMPLATE.md
```

---

## Directory Structure Before/After

**Before Update:**

```
trinity/templates/
├── work-orders/
│   └── WORKORDER-TEMPLATE.md (v2.0.0 - outdated)
└── investigations/
    └── INVESTIGATION-TEMPLATE.md (v2.0.0 - outdated)
```

**After Update:**

```
trinity/templates/
├── work-orders/
│   ├── WORKORDER-TEMPLATE.md (v2.1.0 - updated)
│   ├── BUGFIX-WORKORDER.md (new)
│   ├── FEATURE-WORKORDER.md (new)
│   ├── REFACTOR-WORKORDER.md (new)
│   └── INVESTIGATION-WORKORDER.md (new)
├── documentation/
│   ├── API-DOCUMENTATION-TEMPLATE.md (v2.1.0)
│   ├── README-TEMPLATE.md (v2.1.0)
│   ├── CHANGELOG-TEMPLATE.md (v2.1.0)
│   ├── ARCHITECTURE-TEMPLATE.md (v2.1.0)
│   └── diagrams/
│       ├── sequence-diagram.md (v2.1.0)
│       ├── class-diagram.md (v2.1.0)
│       └── flowchart.md (v2.1.0)
└── investigations/
    ├── INVESTIGATION-TEMPLATE.md (v2.1.0 - updated)
    ├── BUG-INVESTIGATION.md (new)
    ├── PERFORMANCE-INVESTIGATION.md (new)
    ├── SECURITY-INVESTIGATION.md (new)
    └── INTEGRATION-INVESTIGATION.md (new)
```

---

## Statistics Tracking

### UpdateStats Interface

```typescript
interface UpdateStats {
  agentsUpdated?: number;
  commandsUpdated?: number;
  knowledgeBaseUpdated?: number;
  templatesUpdated: number;
}
```

### Incrementing Stats

```typescript
// For each template file copied (both .md.template and .md):
stats.templatesUpdated++;

// Example progression:
// Start: stats.templatesUpdated = 0
// After work-orders: stats.templatesUpdated = 5
// After documentation: stats.templatesUpdated = 12
// After investigations: stats.templatesUpdated = 17
```

### Console Output

```
⠋ Updating templates...
✓ Templates updated (17 files)
```

---

## Error Handling

### Directory Missing (Graceful)

```typescript
if (await fs.pathExists(sourcePath)) {
  // Directory exists, process it
  await fs.ensureDir(targetPath);
  await copyTemplatesRecursively(sourcePath, targetPath, stats);
} else {
  // Directory doesn't exist in SDK, skip silently
  // Continue with other template categories
}
```

### File Copy Failure

```typescript
try {
  await fs.copy(sourceFile, targetFilePath, { overwrite: true });
  stats.templatesUpdated++;
} catch (error) {
  // Error bubbles up to update command handler
  throw error;
}
```

### Common Error Scenarios

**1. Permission Denied**

```
Error: EACCES: permission denied, open 'trinity/templates/work-orders/WORKORDER-TEMPLATE.md'
Solution: Fix file permissions or run with appropriate privileges
```

**2. SDK Not Installed**

```
Error: SDK path not found
Solution: Install Trinity Method SDK (npm install trinity-method-sdk)
```

**3. Target Directory Missing**

```
Error: ENOENT: no such file or directory 'trinity/templates'
Solution: Ensure Trinity structure exists (run trinity-deploy first)
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
- `fs.readdir()` - Lists directory contents (with file type info)
- `fs.copy()` - Copies template files
- `copyTemplatesRecursively()` - Recursive processing (internal)

### Updates

- `trinity/templates/` - Target directory for all template files
- `stats.templatesUpdated` - Progress tracking counter

---

## Testing Considerations

### Unit Testing

```typescript
import { updateTemplates, copyTemplatesRecursively } from './templates';
import fs from 'fs-extra';
import { createMockSpinner } from '../../../test/helpers';

describe('updateTemplates', () => {
  let spinner;
  let stats;

  beforeEach(() => {
    spinner = createMockSpinner();
    stats = { templatesUpdated: 0 };
  });

  afterEach(async () => {
    await fs.remove('trinity/templates');
  });

  it('should update all template files', async () => {
    await updateTemplates(spinner, stats);

    expect(stats.templatesUpdated).toBeGreaterThan(0);
    expect(await fs.pathExists('trinity/templates/work-orders/WORKORDER-TEMPLATE.md')).toBe(true);
  });

  it('should strip .template extension', async () => {
    await updateTemplates(spinner, stats);

    // Should NOT have .template extension
    expect(
      await fs.pathExists('trinity/templates/work-orders/WORKORDER-TEMPLATE.md.template')
    ).toBe(false);
    // Should have clean .md extension
    expect(await fs.pathExists('trinity/templates/work-orders/WORKORDER-TEMPLATE.md')).toBe(true);
  });

  it('should handle nested directories', async () => {
    await updateTemplates(spinner, stats);

    // Check nested diagrams directory
    expect(
      await fs.pathExists('trinity/templates/documentation/diagrams/sequence-diagram.md')
    ).toBe(true);
  });

  it('should copy plain .md files as-is', async () => {
    await updateTemplates(spinner, stats);

    // Mermaid diagram should be copied without extension change
    const exists = await fs.pathExists(
      'trinity/templates/documentation/diagrams/sequence-diagram.md'
    );
    expect(exists).toBe(true);
  });

  it('should overwrite existing files', async () => {
    // Create old version
    await fs.ensureDir('trinity/templates/work-orders');
    await fs.writeFile('trinity/templates/work-orders/WORKORDER-TEMPLATE.md', 'Old content');

    await updateTemplates(spinner, stats);

    const content = await fs.readFile(
      'trinity/templates/work-orders/WORKORDER-TEMPLATE.md',
      'utf-8'
    );
    expect(content).not.toBe('Old content');
  });
});

describe('copyTemplatesRecursively', () => {
  it('should recursively process subdirectories', async () => {
    const stats = { templatesUpdated: 0 };
    const sourcePath = 'test/fixtures/templates';
    const targetPath = 'test/output/templates';

    await copyTemplatesRecursively(sourcePath, targetPath, stats);

    // Check subdirectory processing
    expect(await fs.pathExists('test/output/templates/nested/file.md')).toBe(true);
  });
});
```

---

## Performance Considerations

### Update Time

- **SDK path resolution**: ~10ms
- **Directory traversal**: ~50ms per category (3 categories)
- **Recursive processing**: ~5-10ms per file (17+ files)
- **Total time**: ~300-500ms typical

### Optimization Strategies

- Parallel file copying within directories
- Delta updates (hash comparison)
- Cached SDK path resolution

### Parallel Update Example

```typescript
// Current: Sequential
for (const entry of entries) {
  if (entry.isFile()) {
    await fs.copy(sourceFile, targetFile);
  }
}

// Optimized: Parallel (files only)
const fileEntries = entries.filter(e => e.isFile());
await Promise.all(
  fileEntries.map(entry =>
    fs.copy(sourceFile, targetFile)
  )
);

// Still sequential for directories (to maintain structure)
const dirEntries = entries.filter(e => e.isDirectory());
for (const dir of dirEntries) {
  await copyTemplatesRecursively(...);
}
```

---

## Security Considerations

### File System Safety

- Only reads from SDK template directory (trusted source)
- Only writes to `trinity/templates/` (isolated directory)
- No arbitrary path traversal
- Recursive depth controlled by SDK structure

### Template Validation

- Templates stored in SDK package (npm verified)
- No user input in file paths
- Extension validation (`.md.template` or `.md`)
- Category whitelist (TEMPLATE_DIRS constant)

---

## Related Documentation

- **Update Command**: [docs/api/update-command.md](docs/api/update-command.md)
- **Agent Updates**: [docs/api/update-agents.md](docs/api/update-agents.md)
- **Command Updates**: [docs/api/update-commands.md](docs/api/update-commands.md)
- **Knowledge Base Updates**: [docs/api/update-knowledge-base.md](docs/api/update-knowledge-base.md)
- **SDK Path Resolution**: [docs/api/get-sdk-path.md](docs/api/get-sdk-path.md) (pending)
- **Templates Directory**: [trinity/templates/](../../trinity/templates/)

---

## Version History

| Version | Date       | Changes                                                                       |
| ------- | ---------- | ----------------------------------------------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with 3 template categories                             |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3, recursive processing, Mermaid diagram support |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
