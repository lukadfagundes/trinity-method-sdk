# SDK Installation - Deploy Command

**Module:** `src/cli/commands/deploy/sdk-install.ts`
**Purpose:** Install Trinity Method SDK to target project's package.json
**Category:** Deploy Command - SDK Management
**Priority:** MEDIUM

---

## Overview

The SDK Installation module adds Trinity Method SDK as a dependency to the target project's `package.json` and runs `npm install` to complete the installation. It intelligently detects if the SDK is already installed and provides helpful guidance if installation fails.

### Key Features

- **Smart detection**: Checks both dependencies and devDependencies
- **Automatic package.json modification**: Adds SDK with version constraint
- **npm install execution**: Completes installation automatically
- **Graceful failure handling**: Provides manual installation instructions
- **Idempotent**: Safe to run multiple times

---

## API Reference

### `installSDK(spinner)`

Installs Trinity Method SDK to the project's package.json.

**Signature:**

```typescript
async function installSDK(spinner: Spinner): Promise<boolean>;
```

**Parameters:**

| Parameter | Type      | Description                         |
| --------- | --------- | ----------------------------------- |
| `spinner` | `Spinner` | Spinner instance for status updates |

**Returns:** `Promise<boolean>` - `true` if SDK was installed, `false` if already installed or installation failed

**Throws:** None (errors are caught and logged with manual installation instructions)

---

## Installation Process

### Phase 1: Validation

```
Check for package.json existence
  ├─ Found → Continue to Phase 2
  └─ Not Found → Warn user, provide manual instructions
```

### Phase 2: Detection

```
Read package.json
Check dependencies object
Check devDependencies object
  ├─ SDK Found → Skip installation (already installed)
  └─ SDK Not Found → Continue to Phase 3
```

### Phase 3: Package.json Modification

```
1. Ensure dependencies object exists
2. Add "trinity-method-sdk": "^2.1.0"
3. Write package.json with 2-space indentation
```

### Phase 4: Installation Execution

```
Run: npm install
Options:
  - stdio: 'pipe' (suppress npm output)
  - cwd: process.cwd() (current directory)
```

### Phase 5: Completion

```
Success:
  Spinner: ✓ "Trinity Method SDK installed successfully"
  Return: true

Already Installed:
  Spinner: ℹ "Trinity Method SDK already installed"
  Return: false

Failure:
  Spinner: ⚠ "SDK installation skipped"
  Console: Manual installation instructions
  Return: false
```

---

## Usage Examples

### Basic Usage

```typescript
import { installSDK } from './commands/deploy/sdk-install.js';
import ora from 'ora';

const spinner = ora();
const wasInstalled = await installSDK(spinner);

if (wasInstalled) {
  console.log('SDK installed successfully');
} else {
  console.log('SDK already installed or installation skipped');
}
```

### Integration with Deploy Command

```typescript
// Part of the deploy workflow
const stack = await detectStack();
const metrics = await collectMetrics(stack, spinner);

// Install SDK to target project
const sdkInstalled = await installSDK(spinner);

if (sdkInstalled) {
  console.log('Ready to use Trinity Method SDK');
}
```

### Error Handling

```typescript
// installSDK never throws, always returns boolean
const result = await installSDK(spinner);

if (!result) {
  // Check console output for reason:
  // - Already installed
  // - No package.json
  // - Installation failed (manual instructions provided)
}
```

---

## Installation Scenarios

### Scenario 1: Fresh Installation

```
Input: package.json exists, SDK not present
Process:
  1. Add SDK to dependencies
  2. Run npm install
  3. Return true

Output:
  ✓ Trinity Method SDK installed successfully
  Return: true
```

### Scenario 2: Already Installed (dependencies)

```
Input: package.json contains "trinity-method-sdk" in dependencies
Process:
  1. Detect existing installation
  2. Skip installation
  3. Return false

Output:
  ℹ Trinity Method SDK already installed
  Return: false
```

### Scenario 3: Already Installed (devDependencies)

```
Input: package.json contains "trinity-method-sdk" in devDependencies
Process:
  1. Detect existing installation in devDependencies
  2. Skip installation
  3. Return false

Output:
  ℹ Trinity Method SDK already installed
  Return: false
```

### Scenario 4: No package.json

```
Input: package.json does not exist
Process:
  1. Warn user
  2. Provide initialization instructions
  3. Return false

Output:
  ⚠ No package.json found - SDK not installed
     Run: npm init -y && npm install trinity-method-sdk
  Return: false
```

### Scenario 5: Installation Failure

```
Input: npm install fails (network, permissions, etc.)
Process:
  1. Catch error
  2. Warn user
  3. Provide manual installation instructions
  4. Return false

Output:
  ⚠ SDK installation skipped
     Install manually: npm install trinity-method-sdk
     Error: [error message]
  Return: false
```

---

## Package.json Modifications

### Before Installation

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

### After Installation

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "trinity-method-sdk": "^2.1.0"
  }
}
```

### If No Dependencies Object

```json
// Before
{
  "name": "my-project",
  "version": "1.0.0"
}

// After
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "trinity-method-sdk": "^2.1.0"
  }
}
```

---

## Version Constraint

### Current Version: `^2.1.0`

```
Semver Range: >=2.1.0 <3.0.0
Allows:
  - 2.1.0 ✓
  - 2.1.1 ✓
  - 2.2.0 ✓
  - 2.9.9 ✓
  - 3.0.0 ✗ (major version bump)
```

### Why Caret (^) Range?

- **Flexibility**: Allow minor and patch updates
- **Safety**: Prevent breaking changes (major version)
- **Compatibility**: Standard npm convention
- **Updates**: Users get bug fixes and features automatically

---

## npm install Execution

### Command Details

```typescript
execSync('npm install', {
  stdio: 'pipe', // Suppress output
  cwd: process.cwd(), // Run in current directory
});
```

### stdio: 'pipe' Behavior

- **stdout**: Suppressed (not shown to user)
- **stderr**: Suppressed (not shown to user)
- **Reason**: Cleaner deployment output, spinner shows progress

### Alternative: stdio: 'inherit'

```typescript
// If you want to show npm output:
execSync('npm install', {
  stdio: 'inherit', // Show npm output
  cwd: process.cwd(),
});
```

---

## Error Handling

### Error Categories

**1. File System Errors**

```
- package.json not found
- Permission denied (write to package.json)
- Disk full
```

**2. npm Errors**

```
- Network failure (registry unreachable)
- Authentication failure (private registry)
- Dependency conflict
- npm not installed
```

**3. Process Errors**

```
- execSync failure
- Child process error
- Timeout
```

### Error Response Strategy

```typescript
try {
  // Installation logic...
  spinner.succeed('Trinity Method SDK installed successfully');
  return true;
} catch (error: unknown) {
  // Never throw, always handle gracefully
  spinner.warn('SDK installation skipped');

  // Provide actionable guidance
  console.log(chalk.yellow(`   Install manually: npm install trinity-method-sdk`));
  console.log(chalk.gray(`   Error: ${getErrorMessage(error)}`));

  // Return false (installation did not complete)
  return false;
}
```

---

## Integration Points

### Called By

- `src/cli/commands/deploy.ts` - Main deploy command
- During Trinity Method SDK deployment workflow

### Dependencies

- `fs-extra` - File system operations (readJson, writeJson, pathExists)
- `child_process.execSync` - npm install execution
- `chalk` - Console output formatting
- `utils/errors.js` - Error message extraction

### Side Effects

- Modifies `package.json` (adds dependency)
- Creates `node_modules/` directory (npm install)
- Creates/updates `package-lock.json`

---

## Testing Considerations

### Unit Testing

```typescript
import { installSDK } from './sdk-install';
import fs from 'fs-extra';
import { createMockSpinner } from '../../../test/helpers';

describe('installSDK', () => {
  let mockSpinner;

  beforeEach(() => {
    mockSpinner = createMockSpinner();
  });

  it('should install SDK when not present', async () => {
    // Setup: package.json without SDK
    await fs.writeJson('package.json', {
      name: 'test-project',
      dependencies: {},
    });

    const result = await installSDK(mockSpinner);

    expect(result).toBe(true);

    const packageJson = await fs.readJson('package.json');
    expect(packageJson.dependencies['trinity-method-sdk']).toBe('^2.1.0');
  });

  it('should skip when SDK already installed', async () => {
    // Setup: package.json with SDK
    await fs.writeJson('package.json', {
      name: 'test-project',
      dependencies: {
        'trinity-method-sdk': '^2.0.0',
      },
    });

    const result = await installSDK(mockSpinner);

    expect(result).toBe(false);
    expect(mockSpinner.info).toHaveBeenCalledWith('Trinity Method SDK already installed');
  });

  it('should handle missing package.json', async () => {
    // Setup: no package.json
    await fs.remove('package.json');

    const result = await installSDK(mockSpinner);

    expect(result).toBe(false);
    expect(mockSpinner.warn).toHaveBeenCalledWith('No package.json found - SDK not installed');
  });
});
```

### Integration Testing

```typescript
describe('SDK Installation Integration', () => {
  it('should integrate with deploy command', async () => {
    const deployResult = await runDeployCommand(['--install-sdk']);

    expect(deployResult.sdkInstalled).toBe(true);

    // Verify package.json was modified
    const packageJson = await fs.readJson('package.json');
    expect(packageJson.dependencies['trinity-method-sdk']).toBeDefined();

    // Verify SDK is available
    const sdk = require('trinity-method-sdk');
    expect(sdk).toBeDefined();
  });
});
```

---

## Performance Considerations

### Installation Time

- **Package.json modification**: ~50ms (file I/O)
- **npm install**: 5-30 seconds (depends on network, cache)
- **Total time**: 5-30 seconds typically

### Optimization Strategies

- Use npm cache for faster installs
- Consider `--prefer-offline` flag for cached packages
- Use `--no-audit` to skip security audit (faster)
- Consider `--no-fund` to skip funding messages

### Async Execution

```typescript
// Current: Synchronous (blocks until complete)
execSync('npm install', { ... });

// Alternative: Asynchronous (non-blocking)
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
await execAsync('npm install', { ... });
```

---

## Security Considerations

### Package.json Integrity

- Uses `fs-extra.writeJson()` with proper formatting
- Preserves existing package.json structure
- Only modifies `dependencies` object

### npm Registry Security

- Installs from official npm registry
- Version constraint prevents malicious major version
- Users can verify SDK authenticity on npm

### Process Execution Safety

- Uses `execSync` with specific command (no user input)
- No shell injection risk
- Runs in controlled environment (process.cwd())

---

## Manual Installation Instructions

### When Automatic Installation Fails

**For npm:**

```bash
npm install trinity-method-sdk
```

**For yarn:**

```bash
yarn add trinity-method-sdk
```

**For pnpm:**

```bash
pnpm add trinity-method-sdk
```

**Initialize project first (if no package.json):**

```bash
npm init -y
npm install trinity-method-sdk
```

---

## Related Documentation

- **Deploy Command**: [docs/api/deploy-command.md](docs/api/deploy-command.md)
- **Dependency Injection**: [docs/api/inject-dependencies.md](docs/api/inject-dependencies.md) (pending)
- **Package Manager Detection**: [docs/api/package-manager.md](docs/api/package-manager.md)
- **Trinity Method SDK**: [README.md](../../README.md)

---

## Version History

| Version | Date       | Changes                                                |
| ------- | ---------- | ------------------------------------------------------ |
| 2.0.0   | 2025-12-28 | Initial implementation with smart detection            |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3, version bump to ^2.1.0 |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
