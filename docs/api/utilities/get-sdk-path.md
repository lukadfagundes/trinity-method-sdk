# SDK Path Resolution

**Module:** `src/cli/utils/get-sdk-path.ts`
**Purpose:** Resolve SDK installation path (global vs local)
**Category:** Deployment Utilities - Path Resolution
**Priority:** LOW

---

## Overview

The SDK Path Resolution module provides utilities for locating the Trinity Method SDK installation directory. It automatically detects whether running from SDK root (development/testing), local install (node_modules), or global install, ensuring templates and resources can be accessed regardless of installation method.

### Key Features

- **Auto-detection**: Detects SDK root, local, or global installation
- **ESM/CommonJS compatible**: Works in both module systems
- **Development-friendly**: Supports running from SDK source during development
- **Helper functions**: Convenience functions for templates and package.json paths

---

## API Reference

### `getSDKPath()`

Get the SDK root directory path with auto-detection.

**Signature:**

```typescript
async function getSDKPath(): Promise<string>;
```

**Returns:** `Promise<string>` - Absolute path to SDK root directory

**Detection Order:**

1. **SDK Root** (dev/test): `process.cwd()` if `dist/templates` exists
2. **Local Install**: `process.cwd()/node_modules/trinity-method-sdk`
3. **Global Install**: Calculated from `import.meta.url` (3 levels up from this file)

---

### `getTemplatesPath()`

Get the templates directory path.

**Signature:**

```typescript
async function getTemplatesPath(): Promise<string>;
```

**Returns:** `Promise<string>` - `${SDKPath}/dist/templates`

---

### `getPackageJsonPath()`

Get the package.json path.

**Signature:**

```typescript
async function getPackageJsonPath(): Promise<string>;
```

**Returns:** `Promise<string>` - `${SDKPath}/package.json`

---

## Installation Detection

### 1. SDK Root (Development/Testing)

**Condition:** `dist/templates` exists in current working directory

**Example Path:**

```
/Users/dev/trinity-method-sdk/
├── dist/
│   └── templates/
├── src/
└── package.json
```

**Detected As:** SDK Root
**Returns:** `/Users/dev/trinity-method-sdk`

**Use Case:**

- Running tests from SDK repository
- Development of SDK itself
- Local CLI development

---

### 2. Local Install

**Condition:** `node_modules/trinity-method-sdk` exists in current directory

**Example Path:**

```
/Users/dev/my-project/
├── node_modules/
│   └── trinity-method-sdk/
│       ├── dist/
│       │   └── templates/
│       └── package.json
└── package.json
```

**Detected As:** Local Install
**Returns:** `/Users/dev/my-project/node_modules/trinity-method-sdk`

**Use Case:**

- Project-specific SDK install
- `npm install trinity-method-sdk` in project
- Most common production scenario

---

### 3. Global Install

**Condition:** Neither SDK root nor local install detected

**Example Path:**

```
/usr/local/lib/node_modules/trinity-method-sdk/
├── dist/
│   ├── cli/
│   │   └── utils/
│   │       └── get-sdk-path.js  ← import.meta.url points here
│   └── templates/
└── package.json
```

**Detection Method:**

```typescript
const currentFilePath = fileURLToPath(import.meta.url);
// currentFilePath = /usr/local/lib/node_modules/trinity-method-sdk/dist/cli/utils/get-sdk-path.js

const globalPath = path.resolve(path.dirname(currentFilePath), '..', '..', '..');
// globalPath = /usr/local/lib/node_modules/trinity-method-sdk
```

**Detected As:** Global Install
**Returns:** `/usr/local/lib/node_modules/trinity-method-sdk`

**Use Case:**

- `npm install -g trinity-method-sdk`
- System-wide SDK availability
- CLI commands available globally

---

## Usage Examples

### Basic Usage

```typescript
import { getSDKPath } from './utils/get-sdk-path.js';

const sdkPath = await getSDKPath();
console.log('SDK installed at:', sdkPath);

// Example output:
// SDK installed at: /Users/dev/my-project/node_modules/trinity-method-sdk
```

### Access Templates

```typescript
import { getTemplatesPath } from './utils/get-sdk-path.js';
import path from 'path';

const templatesPath = await getTemplatesPath();
const agentsPath = path.join(templatesPath, '.claude/agents');

console.log('Agents templates at:', agentsPath);
// Agents templates at: /path/to/sdk/dist/templates/.claude/agents
```

### Read SDK Version

```typescript
import { getPackageJsonPath } from './utils/get-sdk-path.js';
import fs from 'fs-extra';

const packageJsonPath = await getPackageJsonPath();
const packageJson = await fs.readJson(packageJsonPath);

console.log('SDK Version:', packageJson.version);
// SDK Version: 2.1.0
```

### Use in Command

```typescript
import { getSDKPath } from './utils/get-sdk-path.js';
import path from 'path';
import fs from 'fs-extra';

async function deployAgents() {
  const sdkPath = await getSDKPath();
  const agentsTemplatePath = path.join(sdkPath, 'dist/templates/.claude/agents');

  // Copy agent templates...
  await fs.copy(agentsTemplatePath, '.claude/agents');
}
```

---

## Path Calculation Details

### Global Install Path Calculation

**File Structure:**

```
trinity-method-sdk/
└── dist/
    └── cli/
        └── utils/
            └── get-sdk-path.js  ← We are here
```

**Calculation:**

```typescript
const currentFilePath = fileURLToPath(import.meta.url);
// '/path/to/trinity-method-sdk/dist/cli/utils/get-sdk-path.js'

const currentDir = path.dirname(currentFilePath);
// '/path/to/trinity-method-sdk/dist/cli/utils'

const upOne = path.resolve(currentDir, '..');
// '/path/to/trinity-method-sdk/dist/cli'

const upTwo = path.resolve(upOne, '..');
// '/path/to/trinity-method-sdk/dist'

const sdkRoot = path.resolve(upTwo, '..');
// '/path/to/trinity-method-sdk'  ← SDK Root!
```

---

## Integration Points

### Called By

- `src/cli/commands/update/utils.ts` - Update command utilities
- `src/cli/commands/update/agents.ts` - Agent updates
- `src/cli/commands/update/commands.ts` - Command updates
- `src/cli/commands/update/knowledge-base.ts` - KB updates
- `src/cli/commands/update/templates.ts` - Template updates
- All deployment commands requiring template access

### Dependencies

- `path` - Node.js path module
- `url` - `fileURLToPath` for ESM compatibility
- `fs-extra` - File system checks

---

## Testing Considerations

### Unit Testing

```typescript
import { getSDKPath, getTemplatesPath, getPackageJsonPath } from './get-sdk-path';
import fs from 'fs-extra';
import path from 'path';

describe('getSDKPath', () => {
  it('should detect SDK root during development', async () => {
    // Assume running from SDK repository with dist/templates present
    const sdkPath = await getSDKPath();
    expect(await fs.pathExists(path.join(sdkPath, 'dist/templates'))).toBe(true);
  });

  it('should detect local install', async () => {
    // Mock: Create node_modules/trinity-method-sdk
    await fs.ensureDir('node_modules/trinity-method-sdk/dist/templates');

    const sdkPath = await getSDKPath();
    expect(sdkPath).toContain('node_modules/trinity-method-sdk');

    // Cleanup
    await fs.remove('node_modules');
  });

  it('should fallback to global install path', async () => {
    // When neither SDK root nor local install detected
    const sdkPath = await getSDKPath();
    expect(typeof sdkPath).toBe('string');
    expect(sdkPath.length).toBeGreaterThan(0);
  });
});

describe('getTemplatesPath', () => {
  it('should return dist/templates path', async () => {
    const templatesPath = await getTemplatesPath();
    expect(templatesPath).toContain('dist/templates');
  });
});

describe('getPackageJsonPath', () => {
  it('should return package.json path', async () => {
    const packageJsonPath = await getPackageJsonPath();
    expect(packageJsonPath).toContain('package.json');
  });
});
```

---

## Performance Considerations

### Caching Opportunity

Current implementation calls `getSDKPath()` multiple times. Could be optimized with caching:

```typescript
let cachedSDKPath: string | null = null;

export async function getSDKPath(): Promise<string> {
  if (cachedSDKPath) return cachedSDKPath;

  // Detection logic...
  cachedSDKPath = detectedPath;
  return cachedSDKPath;
}
```

**Trade-offs:**

- Faster repeated calls
- Assumes SDK path doesn't change during runtime (safe assumption)
- Minimal memory overhead

---

## Error Scenarios

### No Detection Match

**Situation:** Neither SDK root, local, nor valid global path found

**Current Behavior:** Returns global path calculation (may be invalid)

**Potential Improvement:**

```typescript
// Validate SDK path before returning
const sdkPath = calculatePath();
if (!(await fs.pathExists(path.join(sdkPath, 'dist/templates')))) {
  throw new Error('Trinity Method SDK installation not found');
}
return sdkPath;
```

---

## Related Documentation

- **Update Utilities**: [docs/api/update-utils.md](update-utils.md) (pending)
- **Agent Updates**: [docs/api/update-agents.md](update-agents.md)
- **Command Updates**: [docs/api/update-commands.md](update-commands.md)
- **Template Updates**: [docs/api/update-templates.md](update-templates.md)

---

## Version History

| Version | Date       | Changes                                    |
| ------- | ---------- | ------------------------------------------ |
| 2.0.0   | 2025-12-28 | Initial implementation with auto-detection |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3             |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
