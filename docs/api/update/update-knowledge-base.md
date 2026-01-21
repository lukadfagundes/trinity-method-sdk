# Knowledge Base Updates - Update Command

**Module:** `src/cli/commands/update/knowledge-base.ts`
**Purpose:** Update knowledge base templates (preserve user content)
**Category:** Update Command - Knowledge Base Management
**Priority:** MEDIUM

---

## Overview

The Knowledge Base Updates module synchronizes SDK-managed knowledge base files from the Trinity Method SDK to the project's `trinity/knowledge-base/` directory. It updates **only SDK-managed files** (5 templates), preserving user-created content like ARCHITECTURE.md, ISSUES.md, and To-do.md.

### Key Features

- **Selective updates**: Only updates SDK-managed files (not user content)
- **Content preservation**: Never touches user-created documentation
- **Template stripping**: Removes `.template` extension during deployment
- **Overwrite strategy**: Updates managed files to latest versions
- **Progress tracking**: Reports number of KB files updated

---

## API Reference

### `updateKnowledgeBase(spinner, stats)`

Updates SDK-managed knowledge base files to `trinity/knowledge-base/`.

**Signature:**

```typescript
async function updateKnowledgeBase(spinner: Ora, stats: UpdateStats): Promise<void>;
```

**Parameters:**

| Parameter | Type          | Description                                |
| --------- | ------------- | ------------------------------------------ |
| `spinner` | `Ora`         | ora spinner instance for status display    |
| `stats`   | `UpdateStats` | Update statistics object to track progress |

**Returns:** `Promise<void>` - Updates `stats.knowledgeBaseUpdated` count

**Side Effects:**

- Reads from SDK template directory
- Overwrites SDK-managed files in `trinity/knowledge-base/`
- **Preserves** user-created files (ARCHITECTURE.md, ISSUES.md, To-do.md, etc.)
- Updates `stats.knowledgeBaseUpdated` counter

---

## SDK-Managed vs User-Created Files

### SDK-Managed Files (Updated)

These 5 files are **overwritten** during updates:

```
trinity/knowledge-base/
├── Trinity.md                    ← SDK-managed (updated)
├── CODING-PRINCIPLES.md          ← SDK-managed (updated)
├── TESTING-PRINCIPLES.md         ← SDK-managed (updated)
├── AI-DEVELOPMENT-GUIDE.md       ← SDK-managed (updated)
└── DOCUMENTATION-CRITERIA.md     ← SDK-managed (updated)
```

**Purpose:**

- **Trinity.md**: Trinity Method overview and workflow
- **CODING-PRINCIPLES.md**: Coding standards and best practices
- **TESTING-PRINCIPLES.md**: Testing strategies and requirements
- **AI-DEVELOPMENT-GUIDE.md**: AI-assisted development guidelines
- **DOCUMENTATION-CRITERIA.md**: Documentation quality standards

**Why Update?**

- Receive bug fixes and improvements
- New best practices and patterns
- Enhanced guidance and examples
- Version-specific requirements

---

### User-Created Files (Preserved)

These files are **never touched** by updates:

```
trinity/knowledge-base/
├── ARCHITECTURE.md       ← User content (PRESERVED)
├── ISSUES.md             ← User content (PRESERVED)
├── To-do.md              ← User content (PRESERVED)
├── Technical-Debt.md     ← User content (PRESERVED)
└── Custom-Notes.md       ← User content (PRESERVED)
```

**Purpose:**

- **ARCHITECTURE.md**: Project-specific architecture documentation
- **ISSUES.md**: Known issues and resolutions
- **To-do.md**: Task tracking and planning
- **Technical-Debt.md**: Technical debt tracking
- **Custom-Notes.md**: Any user-created documentation

**Why Preserve?**

- Contains project-specific information
- User-authored content
- Living documentation updated throughout development
- Historical context and decisions

---

## Update Process

### Phase 1: SDK Path Resolution

```
Call: getSDKPath()
Purpose: Locate SDK installation (dev/local/global)
Result: Path to SDK root directory
```

### Phase 2: Template Path Construction

```
Construct: ${SDK_PATH}/dist/templates/trinity/knowledge-base
Result: Path to SDK knowledge base templates
```

### Phase 3: File Iteration

```
For each SDK-managed file:
  1. Trinity.md.template
  2. CODING-PRINCIPLES.md.template
  3. TESTING-PRINCIPLES.md.template
  4. AI-DEVELOPMENT-GUIDE.md.template
  5. DOCUMENTATION-CRITERIA.md.template

For each file:
  1. Construct source path
  2. Check if file exists in SDK
  3. Strip .template extension
  4. Copy to trinity/knowledge-base/ with overwrite
  5. Increment stats.knowledgeBaseUpdated
```

### Phase 4: Completion

```
Spinner: ✓ "Knowledge base updated (N files)"
Where N = number of SDK-managed files updated
```

---

## Usage Examples

### Basic Usage

```typescript
import { updateKnowledgeBase } from './commands/update/knowledge-base.js';
import ora from 'ora';

const spinner = ora();
const stats = { knowledgeBaseUpdated: 0 };

await updateKnowledgeBase(spinner, stats);

console.log(`Updated ${stats.knowledgeBaseUpdated} knowledge base files`);
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
// Output:
// {
//   agentsUpdated: 19,
//   commandsUpdated: 25,
//   knowledgeBaseUpdated: 5
// }
```

### Verify User Files Preserved

```typescript
// Before update
const userContent = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf-8');

// Run update
await updateKnowledgeBase(spinner, stats);

// After update - verify content unchanged
const postUpdateContent = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf-8');

console.log(userContent === postUpdateContent); // true (preserved)
```

---

## File Operations

### Template Stripping Example

**Source File (SDK):**

```
dist/templates/trinity/knowledge-base/Trinity.md.template
```

**Target File (Project):**

```
trinity/knowledge-base/Trinity.md
```

**Operation:**

```typescript
// Source
const sourcePath = 'dist/templates/trinity/knowledge-base/Trinity.md.template';

// Remove .template extension
const targetFile = 'Trinity.md.template'.replace('.template', '');
// Result: 'Trinity.md'

// Target
const targetPath = 'trinity/knowledge-base/Trinity.md';

// Copy with overwrite
await fs.copy(sourcePath, targetPath, { overwrite: true });
```

### Directory Structure Before/After

**Before Update:**

```
trinity/knowledge-base/
├── Trinity.md (v2.0.0 - outdated)
├── CODING-PRINCIPLES.md (v2.0.0 - outdated)
├── ARCHITECTURE.md (user content - v1.2.3)
├── ISSUES.md (user content - 45 issues)
└── To-do.md (user content - 12 tasks)
```

**After Update:**

```
trinity/knowledge-base/
├── Trinity.md (v2.1.0 - UPDATED)
├── CODING-PRINCIPLES.md (v2.1.0 - UPDATED)
├── TESTING-PRINCIPLES.md (v2.1.0 - UPDATED, new)
├── AI-DEVELOPMENT-GUIDE.md (v2.1.0 - UPDATED, new)
├── DOCUMENTATION-CRITERIA.md (v2.1.0 - UPDATED, new)
├── ARCHITECTURE.md (user content - v1.2.3 - PRESERVED)
├── ISSUES.md (user content - 45 issues - PRESERVED)
└── To-do.md (user content - 12 tasks - PRESERVED)
```

---

## SDK-Managed File Details

### 1. Trinity.md

**Content:** Trinity Method overview, workflow, and philosophy
**Updates Include:**

- New workflow phases
- Enhanced investigation protocols
- Updated quality gates
- Improved examples

**Example Content:**

```markdown
# Trinity Method Overview

The Trinity Method is an investigation-first development methodology...

## Core Principles

1. Investigation before implementation
2. Evidence-based decisions
3. Quality gates at every phase
   ...
```

---

### 2. CODING-PRINCIPLES.md

**Content:** Coding standards, best practices, design patterns
**Updates Include:**

- New coding patterns
- Security best practices
- Performance optimization guidelines
- Framework-specific conventions

**Example Content:**

```markdown
# Coding Principles

## Code Quality Standards

- Write self-documenting code
- Follow SOLID principles
- Implement comprehensive error handling
  ...
```

---

### 3. TESTING-PRINCIPLES.md

**Content:** Testing strategies, test pyramid, coverage requirements
**Updates Include:**

- New testing patterns
- Integration test strategies
- E2E testing guidelines
- Mocking best practices

**Example Content:**

```markdown
# Testing Principles

## Test Pyramid

1. Unit Tests (70%)
2. Integration Tests (20%)
3. End-to-End Tests (10%)
   ...
```

---

### 4. AI-DEVELOPMENT-GUIDE.md

**Content:** Guidelines for AI-assisted development
**Updates Include:**

- Prompt engineering techniques
- Claude Code best practices
- Agent invocation patterns
- Context management strategies

**Example Content:**

```markdown
# AI Development Guide

## Working with Claude Code

- Provide clear context
- Use slash commands effectively
- Leverage agent specializations
  ...
```

---

### 5. DOCUMENTATION-CRITERIA.md

**Content:** Documentation quality standards
**Updates Include:**

- API documentation requirements
- README standards
- Comment guidelines
- Documentation testing

**Example Content:**

```markdown
# Documentation Criteria

## Quality Standards

- Clear and concise language
- Comprehensive examples
- Up-to-date with code
  ...
```

---

## Statistics Tracking

### UpdateStats Interface

```typescript
interface UpdateStats {
  agentsUpdated?: number;
  commandsUpdated?: number;
  knowledgeBaseUpdated: number;
  templatesUpdated?: number;
}
```

### Incrementing Stats

```typescript
// For each SDK-managed file copied:
stats.knowledgeBaseUpdated++;

// Example progression:
// Start: stats.knowledgeBaseUpdated = 0
// After Trinity.md: stats.knowledgeBaseUpdated = 1
// After CODING-PRINCIPLES.md: stats.knowledgeBaseUpdated = 2
// After TESTING-PRINCIPLES.md: stats.knowledgeBaseUpdated = 3
// After AI-DEVELOPMENT-GUIDE.md: stats.knowledgeBaseUpdated = 4
// After DOCUMENTATION-CRITERIA.md: stats.knowledgeBaseUpdated = 5
```

### Console Output

```
⠋ Updating knowledge base...
✓ Knowledge base updated (5 files)
```

---

## Error Handling

### File Not Found (Graceful)

```typescript
if (await fs.pathExists(sourcePath)) {
  // File exists, update it
  await fs.copy(sourcePath, targetPath, { overwrite: true });
  stats.knowledgeBaseUpdated++;
} else {
  // File doesn't exist in SDK, skip silently
  // Continue with other files
}
```

### Common Error Scenarios

**1. Permission Denied**

```
Error: EACCES: permission denied, open 'trinity/knowledge-base/Trinity.md'
Solution: Fix file permissions or run with appropriate privileges
```

**2. SDK Not Installed**

```
Error: SDK path not found
Solution: Install Trinity Method SDK (npm install trinity-method-sdk)
```

**3. Target Directory Missing**

```
Error: ENOENT: no such file or directory 'trinity/knowledge-base'
Solution: Ensure Trinity structure exists (run trinity-deploy first)
```

---

## User Content Protection

### How User Files Are Protected

**1. Explicit File List**

```typescript
const SDK_MANAGED_KB_FILES = [
  'Trinity.md.template',
  'CODING-PRINCIPLES.md.template',
  'TESTING-PRINCIPLES.md.template',
  'AI-DEVELOPMENT-GUIDE.md.template',
  'DOCUMENTATION-CRITERIA.md.template',
];

// Only these files are updated
// Everything else is ignored
```

**2. No Directory Overwrite**

```typescript
// Does NOT do this:
await fs.copy(kbTemplatePath, 'trinity/knowledge-base', { overwrite: true });

// Does this instead (file-by-file):
for (const file of SDK_MANAGED_KB_FILES) {
  await fs.copy(sourcePath, targetPath, { overwrite: true });
}
```

**3. User Files Never Referenced**

```typescript
// These files are never touched:
// - ARCHITECTURE.md
// - ISSUES.md
// - To-do.md
// - Technical-Debt.md
// - Any custom .md files
```

---

## Testing Considerations

### Unit Testing

```typescript
import { updateKnowledgeBase } from './knowledge-base';
import fs from 'fs-extra';
import { createMockSpinner } from '../../../test/helpers';

describe('updateKnowledgeBase', () => {
  let spinner;
  let stats;

  beforeEach(() => {
    spinner = createMockSpinner();
    stats = { knowledgeBaseUpdated: 0 };
  });

  afterEach(async () => {
    await fs.remove('trinity/knowledge-base');
  });

  it('should update SDK-managed files', async () => {
    await updateKnowledgeBase(spinner, stats);

    expect(stats.knowledgeBaseUpdated).toBe(5);
    expect(await fs.pathExists('trinity/knowledge-base/Trinity.md')).toBe(true);
  });

  it('should preserve user files', async () => {
    // Create user files
    await fs.ensureDir('trinity/knowledge-base');
    const userContent = 'User architecture documentation';
    await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', userContent);

    // Run update
    await updateKnowledgeBase(spinner, stats);

    // Verify user content preserved
    const content = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf-8');
    expect(content).toBe(userContent);
  });

  it('should strip .template extension', async () => {
    await updateKnowledgeBase(spinner, stats);

    // Should NOT have .template extension
    expect(await fs.pathExists('trinity/knowledge-base/Trinity.md.template')).toBe(false);
    // Should have clean .md extension
    expect(await fs.pathExists('trinity/knowledge-base/Trinity.md')).toBe(true);
  });

  it('should overwrite existing SDK-managed files', async () => {
    // Create old version
    await fs.ensureDir('trinity/knowledge-base');
    await fs.writeFile('trinity/knowledge-base/Trinity.md', 'Old SDK content');

    await updateKnowledgeBase(spinner, stats);

    const content = await fs.readFile('trinity/knowledge-base/Trinity.md', 'utf-8');
    expect(content).not.toBe('Old SDK content');
  });
});
```

---

## Integration Points

### Called By

- `src/cli/commands/update.ts` - Main update command
- `trinity-update` CLI command

### Calls

- `getSDKPath()` - Resolves SDK installation path (from `utils.ts`)
- `fs.pathExists()` - Checks file existence
- `fs.copy()` - Copies KB files

### Updates

- `trinity/knowledge-base/` - SDK-managed files only
- `stats.knowledgeBaseUpdated` - Progress tracking counter

---

## Performance Considerations

### Update Time

- **SDK path resolution**: ~10ms
- **File existence checks**: ~5ms per file (5 files)
- **File operations**: ~5-10ms per file (5 files)
- **Total time**: ~100-200ms typical

### Optimization Strategies

- Parallel file copying (currently sequential)
- Delta updates (hash comparison)
- Cached SDK path resolution

### Parallel Update Example

```typescript
// Current: Sequential
for (const templateFile of SDK_MANAGED_KB_FILES) {
  if (await fs.pathExists(sourcePath)) {
    await fs.copy(sourcePath, targetPath, { overwrite: true });
    stats.knowledgeBaseUpdated++;
  }
}

// Optimized: Parallel
await Promise.all(
  SDK_MANAGED_KB_FILES.map(async (templateFile) => {
    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, targetPath, { overwrite: true });
      stats.knowledgeBaseUpdated++;
    }
  })
);
```

---

## Security Considerations

### File System Safety

- Only reads from SDK template directory (trusted source)
- Only writes to `trinity/knowledge-base/` (isolated directory)
- Explicit file whitelist (no wildcards)
- No arbitrary path traversal

### User Data Protection

- Never modifies user-created files
- No directory-level overwrites
- Explicit file list (5 files only)
- Preserves all user documentation

---

## Related Documentation

- **Update Command**: [docs/api/update-command.md](docs/api/update-command.md)
- **Agent Updates**: [docs/api/update-agents.md](docs/api/update-agents.md)
- **Command Updates**: [docs/api/update-commands.md](docs/api/update-commands.md)
- **SDK Path Resolution**: [docs/api/get-sdk-path.md](docs/api/get-sdk-path.md) (pending)
- **Knowledge Base**: [trinity/knowledge-base/](../../trinity/knowledge-base/)

---

## Version History

| Version | Date       | Changes                                                         |
| ------- | ---------- | --------------------------------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with 3 SDK-managed files                 |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3, expanded to 5 SDK-managed files |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
