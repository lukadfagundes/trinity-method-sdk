# Update Utilities Module

**Module:** `src/cli/commands/update/utils.ts`
**Purpose:** Shared utilities for update command
**Category:** Update Command Utilities
**Priority:** LOW

---

## Overview

The Update Utilities module provides shared helper functions for the update command workflow. Currently, it provides a single utility function for SDK path resolution, delegating to the centralized SDK path utility.

### Key Features

- **Centralized SDK path resolution**: Delegates to `get-sdk-path.js`
- **Consistent path handling**: Uses same logic as deploy command
- **Support for multiple install types**: Dev, local, and global npm installs
- **Zero configuration**: Automatically detects SDK location

---

## API Reference

### `getSDKPath()`

Gets the SDK path for reading template files during updates.

**Signature:**

```typescript
async function getSDKPath(): Promise<string>;
```

**Returns:** `Promise<string>` - Absolute path to SDK directory

**Implementation:**

```typescript
import { getSDKPath as getCentralSDKPath } from '../../utils/get-sdk-path.js';

export async function getSDKPath(): Promise<string> {
  return getCentralSDKPath();
}
```

**Delegates to:** `src/cli/utils/get-sdk-path.ts`

---

## Usage Examples

### Example 1: Get SDK Path for Template Reading

```typescript
import { getSDKPath } from './commands/update/utils.js';
import path from 'path';
import fs from 'fs-extra';

const sdkPath = await getSDKPath();
const templatePath = path.join(sdkPath, 'src/templates/agents/JUNO.md');

const template = await fs.readFile(templatePath, 'utf8');
console.log(`Read template from: ${templatePath}`);
```

### Example 2: Update Command Integration

```typescript
import { getSDKPath } from './utils.js';

async function updateAgents() {
  const sdkPath = await getSDKPath();

  // Read agent templates from SDK
  const agentsDir = path.join(sdkPath, 'src/templates/agents');
  const agents = await fs.readdir(agentsDir);

  // Copy updated templates to project
  for (const agent of agents) {
    const sourcePath = path.join(agentsDir, agent);
    const destPath = path.join('.claude', agent);
    await fs.copy(sourcePath, destPath);
  }

  console.log('Agent templates updated');
}
```

### Example 3: Path Resolution Across Install Types

```typescript
// Development install (cloned repository)
const sdkPath = await getSDKPath();
// Returns: /path/to/trinity-method-sdk

// Local npm install (npm link or local package)
const sdkPath = await getSDKPath();
// Returns: /path/to/node_modules/trinity-method-sdk

// Global npm install (npm install -g)
const sdkPath = await getSDKPath();
// Returns: /usr/local/lib/node_modules/trinity-method-sdk
```

---

## Centralized SDK Path Resolution

### Why Delegation?

The `getSDKPath()` function in this module is intentionally thin, delegating to the centralized utility:

```typescript
// src/cli/commands/update/utils.ts
export async function getSDKPath(): Promise<string> {
  return getCentralSDKPath();
}

// src/cli/utils/get-sdk-path.ts
export async function getSDKPath(): Promise<string> {
  // Complex path resolution logic
  // ...
}
```

**Rationale:**

- **Single source of truth**: All commands use same path resolution logic
- **Consistency**: Deploy and update commands resolve paths identically
- **Maintainability**: Bug fixes apply to all commands automatically
- **Testability**: Only one function to test thoroughly

---

## SDK Path Resolution Logic

The centralized `get-sdk-path.ts` utility handles multiple install scenarios:

### Detection Order

1. **Development install** (repository root)
   - Checks for `package.json` with `"name": "trinity-method-sdk"`
   - Returns current directory

2. **Local npm install** (`node_modules/`)
   - Searches up directory tree for `node_modules/trinity-method-sdk/`
   - Returns SDK directory in node_modules

3. **Global npm install**
   - Uses `require.resolve('trinity-method-sdk')` to locate package
   - Returns global npm modules directory

### Example Paths

```typescript
// Development (repository root)
/path/to/trinity-method-sdk/

// Local npm (project dependency)
/path/to/my-project/node_modules/trinity-method-sdk/

// Global npm (system-wide)
/usr/local/lib/node_modules/trinity-method-sdk/
```

---

## Integration Points

### Called By

- `src/cli/commands/update/update-agents.ts` - Agent template updates
- `src/cli/commands/update/update-commands.ts` - Command template updates
- `src/cli/commands/update/update-knowledge-base.ts` - Knowledge base updates
- `src/cli/commands/update/update-templates.ts` - Work order template updates

### Calls

- `src/cli/utils/get-sdk-path.ts` - Centralized SDK path resolution

### Dependencies

```typescript
import { getSDKPath as getCentralSDKPath } from '../../utils/get-sdk-path.js';
```

---

## Error Handling

### SDK Not Found

```typescript
// If SDK path cannot be resolved, centralized utility throws
try {
  const sdkPath = await getSDKPath();
} catch (error) {
  console.error('Error: Could not locate Trinity Method SDK');
  console.error('Ensure SDK is installed via npm or cloned locally');
  process.exit(1);
}
```

**Error Scenarios:**

- SDK not installed → Error thrown by centralized utility
- Corrupted installation → Error thrown
- Permission issues → Error thrown

---

## Future Expansion

### Potential Additional Utilities

The module is designed to be extensible for future update-specific utilities:

```typescript
// Current (single utility)
export async function getSDKPath(): Promise<string> {
  return getCentralSDKPath();
}

// Future expansion possibilities
export async function compareVersions(
  currentVersion: string,
  latestVersion: string
): Promise<number> {
  // Version comparison logic
}

export async function createBackupPath(): Promise<string> {
  // Backup directory creation logic
}

export async function validateUpdatePreconditions(): Promise<boolean> {
  // Pre-update validation logic
}
```

**Design Pattern:**

- Start with minimal utilities (avoid premature abstraction)
- Add utilities as patterns emerge across update modules
- Keep utilities focused (single responsibility)

---

## Testing Considerations

### Unit Tests

```typescript
import { getSDKPath } from './utils';

describe('Update Utilities', () => {
  it('should delegate to centralized SDK path resolution', async () => {
    const sdkPath = await getSDKPath();

    expect(sdkPath).toBeDefined();
    expect(sdkPath).toContain('trinity-method-sdk');
  });

  it('should return absolute path', async () => {
    const sdkPath = await getSDKPath();

    expect(path.isAbsolute(sdkPath)).toBe(true);
  });
});
```

### Integration Tests

```typescript
import { getSDKPath } from './utils';
import fs from 'fs-extra';
import path from 'path';

describe('SDK Path Resolution Integration', () => {
  it('should locate SDK in node_modules', async () => {
    const sdkPath = await getSDKPath();
    const packageJsonPath = path.join(sdkPath, 'package.json');

    const packageJsonExists = await fs.pathExists(packageJsonPath);
    expect(packageJsonExists).toBe(true);
  });

  it('should locate templates directory', async () => {
    const sdkPath = await getSDKPath();
    const templatesPath = path.join(sdkPath, 'src/templates');

    const templatesExists = await fs.pathExists(templatesPath);
    expect(templatesExists).toBe(true);
  });
});
```

---

## Performance Considerations

### Path Resolution Performance

- **First call**: ~50-200ms (directory traversal + file checks)
- **Subsequent calls**: Same (no caching in current implementation)

### Optimization Opportunities

```typescript
// Current: No caching (simple, always accurate)
export async function getSDKPath(): Promise<string> {
  return getCentralSDKPath();
}

// Potential optimization: Cache SDK path
let cachedSDKPath: string | null = null;

export async function getSDKPath(): Promise<string> {
  if (!cachedSDKPath) {
    cachedSDKPath = await getCentralSDKPath();
  }
  return cachedSDKPath;
}

// Trade-off: Performance vs. accuracy
// Current approach prioritizes simplicity and accuracy
```

---

## Module Evolution

### Version History Context

This module was created as a thin wrapper to provide update-specific utilities while maintaining centralized SDK path logic.

**Design Rationale:**

```typescript
// Instead of:
import { getSDKPath } from '../../utils/get-sdk-path.js';
// (Requires update modules to know about utils directory structure)

// Use:
import { getSDKPath } from './utils.js';
// (Encapsulates SDK path logic within update command)

// Benefits:
// 1. Update modules import from local utils
// 2. If SDK path logic changes, update modules unaffected
// 3. Future update-specific utilities can be added here
```

---

## Comparison with Deploy Utilities

### Deploy Command

```typescript
// Deploy command imports directly from centralized utility
import { getSDKPath } from './utils/get-sdk-path.js';
```

### Update Command

```typescript
// Update command imports from local wrapper
import { getSDKPath } from './commands/update/utils.js';

// Which delegates to centralized utility
export async function getSDKPath(): Promise<string> {
  return getCentralSDKPath();
}
```

**Why Different?**

- **Deploy**: More mature, established patterns
- **Update**: Newer, designed for future expansion
- **Both valid**: Different design choices for different contexts

---

## Related Documentation

- **SDK Path Resolution**: [docs/api/get-sdk-path.md](get-sdk-path.md)
- **Update Command**: [docs/api/update-command.md](update-command.md)
- **Update Agents**: [docs/api/update-agents.md](update-agents.md)
- **Update Knowledge Base**: [docs/api/update-knowledge-base.md](update-knowledge-base.md)

---

## Security Considerations

### Path Traversal Prevention

The centralized `get-sdk-path.ts` utility validates paths to prevent traversal attacks:

```typescript
// Centralized utility validates:
// 1. Path is within expected directories (repository, node_modules)
// 2. No '..' components in path
// 3. Absolute path resolution
```

### File System Access

- Read-only operations (no file modifications in this module)
- Only accesses SDK installation directory
- No user-provided paths processed

---

## Version History

| Version | Date       | Changes                                         |
| ------- | ---------- | ----------------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with SDK path delegation |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3                  |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
