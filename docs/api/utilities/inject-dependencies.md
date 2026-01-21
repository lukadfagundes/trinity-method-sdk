# Dependency Injection Utility

**Module:** `src/cli/utils/inject-dependencies.ts`
**Purpose:** Inject linting dependencies and scripts into project files
**Category:** Core Utilities
**Priority:** HIGH

---

## Overview

The Dependency Injection module provides framework-aware dependency and script injection into project configuration files. It modifies `package.json` for Node.js projects and `requirements-dev.txt` for Python projects, adding linting tools and npm scripts without overwriting existing configurations.

### Key Features

- **Framework-aware injection**: Supports Node.js/React/Next.js and Python
- **Non-destructive updates**: Preserves existing dependencies and scripts
- **Scoped package support**: Handles packages like `@typescript-eslint/parser@^6.7.0`
- **Version management**: Parses and injects version constraints
- **Safe file operations**: Uses `validatePath` for security

---

## API Reference

### `injectLintingDependencies(dependencies, scripts, framework)`

Main entry point for injecting linting dependencies and scripts into project files.

**Signature:**

```typescript
async function injectLintingDependencies(
  dependencies: string[],
  scripts: Record<string, string>,
  framework: string
): Promise<void>;
```

**Parameters:**

| Parameter      | Type                     | Description                                                     |
| -------------- | ------------------------ | --------------------------------------------------------------- |
| `dependencies` | `string[]`               | Array of dependency strings in format `package@version`         |
| `scripts`      | `Record<string, string>` | Object mapping script names to commands                         |
| `framework`    | `string`                 | Framework name (Node.js, React, Next.js, Python, Rust, Flutter) |

**Returns:** `Promise<void>`

**Throws:** None (logs warnings on errors)

---

### `injectNodeDependencies(dependencies, scripts)` (Internal)

Injects dependencies and scripts into `package.json` for Node.js-based projects.

**Signature:**

```typescript
async function injectNodeDependencies(
  dependencies: string[],
  scripts: Record<string, string>
): Promise<void>;
```

**Parameters:**

| Parameter      | Type                     | Description                                         |
| -------------- | ------------------------ | --------------------------------------------------- |
| `dependencies` | `string[]`               | Array of dependency strings (e.g., `eslint@^8.0.0`) |
| `scripts`      | `Record<string, string>` | npm scripts to add                                  |

**Returns:** `Promise<void>`

**Behavior:**

- Creates `devDependencies` section if it doesn't exist
- Parses scoped packages (e.g., `@typescript-eslint/parser@^6.7.0`)
- Only adds scripts if they don't already exist
- Writes back with 2-space formatting

---

### `injectPythonDependencies(dependencies)` (Internal)

Injects dependencies into `requirements-dev.txt` for Python projects.

**Signature:**

```typescript
async function injectPythonDependencies(dependencies: string[]): Promise<void>;
```

**Parameters:**

| Parameter      | Type       | Description                                      |
| -------------- | ---------- | ------------------------------------------------ |
| `dependencies` | `string[]` | Array of Python packages (e.g., `pylint>=2.0.0`) |

**Returns:** `Promise<void>`

**Behavior:**

- Creates `requirements-dev.txt` if it doesn't exist
- Appends new dependencies to existing file
- Skips dependencies that are already present
- Uses `validatePath` for security

---

## Usage Examples

### Example 1: Inject Node.js Linting Dependencies

```typescript
import { injectLintingDependencies } from './utils/inject-dependencies.js';

const dependencies = [
  'eslint@^8.0.0',
  '@typescript-eslint/parser@^6.7.0',
  '@typescript-eslint/eslint-plugin@^6.7.0',
  'prettier@^3.0.0',
];

const scripts = {
  lint: 'eslint src/',
  'lint:fix': 'eslint src/ --fix',
  format: 'prettier --write src/',
};

await injectLintingDependencies(dependencies, scripts, 'Node.js');

// Result: package.json updated with devDependencies and scripts
```

### Example 2: Inject Python Linting Dependencies

```typescript
import { injectLintingDependencies } from './utils/inject-dependencies.js';

const dependencies = ['pylint>=2.0.0', 'black>=23.0.0', 'flake8>=6.0.0'];

await injectLintingDependencies(dependencies, {}, 'Python');

// Result: requirements-dev.txt created/updated with dependencies
```

### Example 3: Handling Missing Files

```typescript
// If package.json doesn't exist, logs warning and continues
await injectLintingDependencies(dependencies, scripts, 'Node.js');

// Console output:
// ⚠ Warning: package.json not found, skipping dependency injection
```

### Example 4: React/Next.js Projects

```typescript
// Works for React and Next.js frameworks (uses Node.js logic)
await injectLintingDependencies(dependencies, scripts, 'React');
await injectLintingDependencies(dependencies, scripts, 'Next.js');

// Both call injectNodeDependencies internally
```

---

## Supported Frameworks

| Framework | File Modified          | Function Used                 |
| --------- | ---------------------- | ----------------------------- |
| Node.js   | `package.json`         | `injectNodeDependencies`      |
| React     | `package.json`         | `injectNodeDependencies`      |
| Next.js   | `package.json`         | `injectNodeDependencies`      |
| Python    | `requirements-dev.txt` | `injectPythonDependencies`    |
| Rust      | None                   | No injection (built-in tools) |
| Flutter   | None                   | No injection (built-in tools) |

---

## Dependency String Parsing

### Node.js Dependencies

The module parses dependency strings with version constraints:

```typescript
// Standard package
'eslint@^8.0.0' → { name: 'eslint', version: '^8.0.0' }

// Scoped package
'@typescript-eslint/parser@^6.7.0' → {
  name: '@typescript-eslint/parser',
  version: '^6.7.0'
}

// Algorithm:
// 1. Find last '@' character
// 2. Split at that position
// 3. Everything before = name
// 4. Everything after = version
```

### Python Dependencies

```typescript
// Version constraint
'pylint>=2.0.0' → Split on '>=' to check for duplicates

// Exact version
'black==23.0.0' → Split on '==' to check for duplicates
```

---

## Script Injection Behavior

### Non-Destructive Script Updates

```typescript
// Existing package.json
{
  "scripts": {
    "test": "jest",
    "lint": "eslint ."  // Already exists
  }
}

// Injection attempt
const scripts = {
  "lint": "eslint src/",  // Will NOT overwrite
  "format": "prettier --write ."  // Will add
};

await injectLintingDependencies(deps, scripts, 'Node.js');

// Result: Only "format" script is added
{
  "scripts": {
    "test": "jest",
    "lint": "eslint .",  // Preserved
    "format": "prettier --write ."  // Added
  }
}
```

---

## Error Handling

### Missing Configuration Files

```typescript
// package.json not found
if (!(await fs.pathExists(packageJsonPath))) {
  console.warn(chalk.yellow('   Warning: package.json not found, skipping dependency injection'));
  return;
}
```

**Behavior:**

- Logs warning in yellow
- Returns without error
- Allows command to continue

### Invalid JSON Parsing

```typescript
// If package.json is invalid JSON, fs.readJson will throw
// This is NOT caught, allowing the error to propagate
// Rationale: Invalid package.json indicates project corruption
```

---

## Integration Points

### Called By

- `src/cli/commands/deploy/deploy-linting.ts` - During linting setup
- Part of Trinity Method SDK deployment workflow

### Calls

- `fs-extra` - File system operations
- `validatePath()` - Path security validation (for Python)
- `chalk` - Console color output

### Dependencies

```typescript
import fs from 'fs-extra';
import chalk from 'chalk';
import { validatePath } from './validate-path.js';
```

---

## Testing Considerations

### Unit Tests

```typescript
import { injectLintingDependencies } from './inject-dependencies';
import fs from 'fs-extra';

describe('injectLintingDependencies', () => {
  afterEach(() => {
    // Clean up test files
    fs.removeSync('package.json');
  });

  it('should add devDependencies to package.json', async () => {
    await fs.writeJson('package.json', { name: 'test' });

    await injectLintingDependencies(['eslint@^8.0.0'], {}, 'Node.js');

    const pkg = await fs.readJson('package.json');
    expect(pkg.devDependencies.eslint).toBe('^8.0.0');
  });

  it('should not overwrite existing scripts', async () => {
    await fs.writeJson('package.json', {
      scripts: { lint: 'existing' },
    });

    await injectLintingDependencies([], { lint: 'new', format: 'prettier' }, 'Node.js');

    const pkg = await fs.readJson('package.json');
    expect(pkg.scripts.lint).toBe('existing');
    expect(pkg.scripts.format).toBe('prettier');
  });

  it('should handle scoped packages', async () => {
    await fs.writeJson('package.json', {});

    await injectLintingDependencies(['@typescript-eslint/parser@^6.7.0'], {}, 'Node.js');

    const pkg = await fs.readJson('package.json');
    expect(pkg.devDependencies['@typescript-eslint/parser']).toBe('^6.7.0');
  });
});
```

---

## Performance Considerations

### File Operations

- **package.json read/write**: ~10-50ms (depends on file size)
- **requirements-dev.txt append**: ~5-20ms
- **Total injection time**: <100ms for typical projects

### Optimization Strategies

- Minimal file I/O (single read, single write)
- No external command execution
- Efficient string parsing (lastIndexOf for scoped packages)

---

## Security Considerations

### Path Validation

- **Python files**: Uses `validatePath()` to prevent path traversal
- **Node.js files**: Hardcoded `package.json` path (no user input)

### File Permissions

- Respects existing file permissions
- Does not modify file ownership
- No privilege escalation

### Data Sanitization

- No code execution (only JSON/text writing)
- Dependency strings are not evaluated
- Version constraints are stored as-is

---

## Related Documentation

- **Linting Deployment**: [docs/api/deploy-linting.md](deploy-linting.md)
- **Path Validation**: [docs/api/validate-path.md](validate-path.md)
- **Deploy Command**: [docs/api/deploy-command.md](deploy-command.md)

---

## Version History

| Version | Date       | Changes                                                |
| ------- | ---------- | ------------------------------------------------------ |
| 2.0.0   | 2025-12-28 | Initial implementation with Node.js and Python support |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3                         |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
