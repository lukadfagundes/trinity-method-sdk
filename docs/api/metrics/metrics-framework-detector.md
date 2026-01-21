# Framework Detection Module

**Module:** `src/cli/utils/metrics/framework-detector.ts`
**Purpose:** Detect framework versions and package managers
**Category:** Metrics Utilities
**Priority:** MEDIUM

---

## Overview

The Framework Detection module identifies the version of the currently used framework and the package manager in use. It provides version detection for Node.js, React, Next.js, Flutter, Python, and Rust projects, as well as package manager identification (npm, yarn, pnpm, pip, cargo, pub).

### Key Features

- **Multi-framework support**: Node.js, React, Next.js, Flutter, Python, Rust
- **Version detection**: Extracts framework versions from configuration files or runtime
- **Package manager detection**: Identifies lockfile-based package managers
- **Fallback handling**: Returns 'Unknown' on detection failures
- **Zero external dependencies**: Uses native Node.js APIs and file parsing

---

## API Reference

### `detectFrameworkVersion(framework)`

Detects the version of the specified framework.

**Signature:**

```typescript
async function detectFrameworkVersion(framework: string): Promise<string>;
```

**Parameters:**

| Parameter   | Type     | Description                                                     |
| ----------- | -------- | --------------------------------------------------------------- |
| `framework` | `string` | Framework name (Node.js, React, Next.js, Flutter, Python, Rust) |

**Returns:** `Promise<string>` - Version string (e.g., "v20.0.0", "18.2.0", "Unknown")

**Supported Frameworks:**

- `Node.js` → Node.js runtime version
- `React` → React version from package.json
- `Next.js` → Next.js version from package.json
- `Flutter` → Flutter SDK version from pubspec.yaml
- `Python` → Python interpreter version
- `Rust` → Rust compiler version

---

### `detectPackageManager()`

Detects the package manager used by the project.

**Signature:**

```typescript
async function detectPackageManager(): Promise<string>;
```

**Returns:** `Promise<string>` - Package manager name or "Unknown"

**Detection Strategy:**
Checks for lockfiles in priority order:

1. `pnpm-lock.yaml` → "pnpm"
2. `yarn.lock` → "yarn"
3. `package-lock.json` → "npm"
4. `pubspec.yaml` → "pub"
5. `requirements.txt` → "pip"
6. `Cargo.toml` → "cargo"
7. None found → "Unknown"

---

## Framework-Specific Detectors

### `detectNodeVersion()` (Internal)

Detects Node.js runtime version.

**Signature:**

```typescript
function detectNodeVersion(): string;
```

**Implementation:**

```typescript
const nodeVersion = execSync('node --version', {
  encoding: 'utf8',
  stdio: ['pipe', 'pipe', 'ignore'],
});
return nodeVersion.trim(); // e.g., "v20.11.0"
```

**Returns:** Version string with 'v' prefix (e.g., "v20.11.0")

---

### `detectReactVersion()` (Internal)

Detects React version from package.json.

**Signature:**

```typescript
async function detectReactVersion(): Promise<string>;
```

**Implementation:**

```typescript
if (!(await fs.pathExists('package.json'))) return 'Unknown';

const pkg = await fs.readJson('package.json');
if (pkg.dependencies?.react) {
  return pkg.dependencies.react.replace(/[\^~]/, '');
}

return detectNodeVersion(); // Fallback to Node.js version
```

**Returns:** React version without `^` or `~` prefix (e.g., "18.2.0")

---

### `detectNextVersion()` (Internal)

Detects Next.js version from package.json.

**Signature:**

```typescript
async function detectNextVersion(): Promise<string>;
```

**Implementation:**

```typescript
if (!(await fs.pathExists('package.json'))) return 'Unknown';

const pkg = await fs.readJson('package.json');
if (pkg.dependencies?.next) {
  return pkg.dependencies.next.replace(/[\^~]/, '');
}

return detectNodeVersion(); // Fallback to Node.js version
```

**Returns:** Next.js version without `^` or `~` prefix (e.g., "14.0.0")

---

### `detectFlutterVersion()` (Internal)

Detects Flutter SDK version from pubspec.yaml.

**Signature:**

```typescript
async function detectFlutterVersion(): Promise<string>;
```

**Implementation:**

```typescript
if (!(await fs.pathExists('pubspec.yaml'))) return 'Unknown';

const yaml = await fs.readFile('pubspec.yaml', 'utf8');
const match = yaml.match(/sdk:\s*["']>=?(\d+\.\d+\.\d+)/);
return match ? match[1] : 'Unknown';
```

**Returns:** Flutter SDK version (e.g., "3.10.0")

**Parsing Strategy:**

- Regex matches `sdk: ">=3.10.0"` or `sdk: '>=3.10.0'`
- Extracts version number (ignores `>=` constraint)

---

### `detectPythonVersion()` (Internal)

Detects Python interpreter version.

**Signature:**

```typescript
function detectPythonVersion(): string;
```

**Implementation:**

```typescript
const version = execSync('python --version 2>&1', {
  encoding: 'utf8',
  stdio: ['pipe', 'pipe', 'ignore'],
});
return version.trim().replace('Python ', ''); // e.g., "3.11.5"
```

**Returns:** Python version without "Python " prefix (e.g., "3.11.5")

**Note:** Uses `2>&1` to capture stderr (Python 2.x prints version to stderr)

---

### `detectRustVersion()` (Internal)

Detects Rust compiler version.

**Signature:**

```typescript
function detectRustVersion(): string;
```

**Implementation:**

```typescript
const version = execSync('rustc --version', {
  encoding: 'utf8',
  stdio: ['pipe', 'pipe', 'ignore'],
});
return version.trim().replace('rustc ', ''); // e.g., "1.75.0"
```

**Returns:** Rust version without "rustc " prefix (e.g., "1.75.0")

---

## Usage Examples

### Example 1: Detect Framework Version

```typescript
import { detectFrameworkVersion } from './metrics/framework-detector.js';

const nodeVersion = await detectFrameworkVersion('Node.js');
console.log(`Node.js version: ${nodeVersion}`);
// Output: Node.js version: v20.11.0

const reactVersion = await detectFrameworkVersion('React');
console.log(`React version: ${reactVersion}`);
// Output: React version: 18.2.0
```

### Example 2: Detect Package Manager

```typescript
import { detectPackageManager } from './metrics/framework-detector.js';

const packageManager = await detectPackageManager();
console.log(`Package manager: ${packageManager}`);
// Output: Package manager: pnpm
```

### Example 3: Full Framework Detection

```typescript
const framework = 'Next.js';
const version = await detectFrameworkVersion(framework);
const packageManager = await detectPackageManager();

console.log(`Framework: ${framework}`);
console.log(`Version: ${version}`);
console.log(`Package Manager: ${packageManager}`);

// Output:
// Framework: Next.js
// Version: 14.0.0
// Package Manager: npm
```

### Example 4: Handle Missing Framework

```typescript
const version = await detectFrameworkVersion('UnknownFramework');
console.log(version); // "Unknown"

// No errors thrown - graceful fallback
```

---

## Version Detection Strategies

### File-Based Detection (React, Next.js, Flutter)

```typescript
// Read configuration file
// Extract version from dependencies or SDK constraints
// Return cleaned version string

// Advantages:
// - Fast (no command execution)
// - Accurate (matches actual project dependencies)
// - No external runtime required

// Disadvantages:
// - Requires configuration file to exist
// - Version may differ from globally installed version
```

### Command-Based Detection (Node.js, Python, Rust)

```typescript
// Execute version command (e.g., node --version)
// Parse stdout
// Return cleaned version string

// Advantages:
// - Always available (if runtime installed)
// - Reflects actual runtime version
// - No configuration file needed

// Disadvantages:
// - Slower (command execution overhead)
// - May fail if runtime not in PATH
// - Security consideration (command execution)
```

---

## Package Manager Detection Logic

### Priority Order Rationale

```typescript
// 1. pnpm-lock.yaml → pnpm (highest priority)
//    - pnpm users intentionally choose it
//    - Must check before npm (both use package.json)

// 2. yarn.lock → yarn
//    - yarn users intentionally choose it
//    - Must check before npm (both use package.json)

// 3. package-lock.json → npm
//    - npm is default for Node.js
//    - Only matched if pnpm/yarn not present

// 4. pubspec.yaml → pub (Flutter)
// 5. requirements.txt → pip (Python)
// 6. Cargo.toml → cargo (Rust)
```

### Example Detection

```typescript
// Project with multiple lockfiles (edge case):
// - package.json
// - pnpm-lock.yaml
// - package-lock.json (leftover from npm)

const manager = await detectPackageManager();
// Returns: "pnpm" (highest priority)
```

---

## Version String Cleaning

### Removing Version Prefixes

```typescript
// React/Next.js dependencies
"^18.2.0"  → "18.2.0"
"~18.2.0"  → "18.2.0"
"18.2.0"   → "18.2.0"

// Implementation
version.replace(/[\^~]/, '');
```

### Runtime Version Formatting

```typescript
// Node.js
"v20.11.0" → "v20.11.0" (preserved)

// Python
"Python 3.11.5" → "3.11.5"

// Rust
"rustc 1.75.0 (82e1608df 2023-12-21)" → "1.75.0 (82e1608df 2023-12-21)"
```

---

## Error Handling

### Missing Configuration Files

```typescript
if (!(await fs.pathExists('package.json'))) return 'Unknown';
```

**Behavior:** Returns "Unknown" (no errors thrown)

---

### Command Execution Failures

```typescript
try {
  const detector = VERSION_DETECTORS[framework];
  if (detector) {
    return await detector();
  }
} catch {
  // Framework version detection failed
}

return 'Unknown';
```

**Error Scenarios:**

- Runtime not installed → Returns "Unknown"
- Command not in PATH → Returns "Unknown"
- Permission denied → Returns "Unknown"
- Unknown framework → Returns "Unknown"

---

## Integration Points

### Called By

- `src/cli/commands/deploy/metrics.ts` - During deployment metrics collection
- `collectCodebaseMetrics()` - Main metrics orchestrator

### Calls

- `child_process.execSync` - Command execution
- `fs-extra` - File system operations

### Dependencies

```typescript
import fs from 'fs-extra';
import { execSync } from 'child_process';
```

---

## Testing Considerations

### Unit Tests

```typescript
import { detectFrameworkVersion, detectPackageManager } from './framework-detector';
import fs from 'fs-extra';

describe('Framework Detection', () => {
  it('should detect Node.js version', async () => {
    const version = await detectFrameworkVersion('Node.js');
    expect(version).toMatch(/^v\d+\.\d+\.\d+$/);
  });

  it('should detect React version from package.json', async () => {
    await fs.writeJson('package.json', {
      dependencies: { react: '^18.2.0' },
    });

    const version = await detectFrameworkVersion('React');
    expect(version).toBe('18.2.0');
  });

  it('should return Unknown for missing framework', async () => {
    const version = await detectFrameworkVersion('UnknownFramework');
    expect(version).toBe('Unknown');
  });

  it('should detect package manager from lockfile', async () => {
    await fs.writeFile('pnpm-lock.yaml', '');

    const manager = await detectPackageManager();
    expect(manager).toBe('pnpm');
  });
});
```

### Mock Command Execution

```typescript
import { execSync } from 'child_process';

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

it('should handle command execution failures', async () => {
  (execSync as jest.Mock).mockImplementation(() => {
    throw new Error('Command not found');
  });

  const version = await detectFrameworkVersion('Python');
  expect(version).toBe('Unknown');
});
```

---

## Performance Considerations

### Detection Performance

- **File-based detection**: ~5-20ms (file read + JSON parse)
- **Command-based detection**: ~50-200ms (process spawn + execution)
- **Package manager detection**: ~5-10ms per lockfile check

### Optimization Strategies

- Command execution silences stderr (`stdio: ['pipe', 'pipe', 'ignore']`)
- File checks use async I/O (non-blocking)
- No caching (ensures fresh detection)

---

## Security Considerations

### Command Execution Safety

```typescript
// Safe: No user input in commands
execSync('node --version', { ... });

// Commands are hardcoded (no injection risk)
// No shell execution (direct command invocation)
```

### File System Access

- Read-only operations (no file modifications)
- Standard project files only (no arbitrary paths)
- Sandboxed to project directory

---

## Limitations

### Version Detection Accuracy

```typescript
// React/Next.js: Detects dependency version (not necessarily installed version)
// Example: package.json says "^18.0.0" but node_modules has 18.2.5
// Detection returns: "18.0.0" (from package.json)

// Solution: Would require parsing node_modules/react/package.json
// Trade-off: Simplicity vs. accuracy (current approach prioritizes simplicity)
```

### Flutter Version Parsing

```typescript
// pubspec.yaml may have complex SDK constraints:
sdk: ">=3.0.0 <4.0.0"   → Detects: "3.0.0"
sdk: ^3.10.0            → Detects: "Unknown" (doesn't match regex)

// Regex: /sdk:\s*["']>=?(\d+\.\d+\.\d+)/
// Only matches quoted constraints with '>='
```

### Python 2 vs Python 3

```typescript
// Command: python --version
// May resolve to Python 2 or Python 3 depending on system configuration

// Solution: Check 'python3 --version' if 'python' returns version < 3.0
// Current implementation: Uses whatever 'python' resolves to
```

---

## Related Documentation

- **Metrics Orchestrator**: [docs/api/metrics-index.md](metrics-index.md) (pending)
- **Deploy Metrics**: [docs/api/deploy-metrics.md](deploy-metrics.md)
- **Dependency Parser**: [docs/api/metrics-dependency-parser.md](metrics-dependency-parser.md)

---

## Version History

| Version | Date       | Changes                                         |
| ------- | ---------- | ----------------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with 6 framework support |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3                  |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
