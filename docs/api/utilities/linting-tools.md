# Linting Tools Configuration

**Module:** `src/cli/utils/linting-tools.ts`
**Purpose:** Linting tool metadata and configuration options
**Category:** Deployment Utilities - Linting Metadata
**Priority:** MEDIUM

---

## Overview

The Linting Tools Configuration module provides metadata for all supported linting tools across 5 frameworks. It defines tool specifications, dependencies, npm scripts, and provides helper functions for selecting and configuring tools based on framework and language.

### Key Features

- **Framework-specific tool definitions**: 5 frameworks supported (Node.js, React, Python, Flutter, Rust)
- **Comprehensive metadata**: Dependencies, config files, npm scripts, descriptions
- **Helper functions**: 5 utility functions for tool selection and configuration
- **TypeScript awareness**: Special handling for TypeScript projects
- **Dependency management**: Automatic dependency aggregation

---

## Supported Frameworks & Tools

### Node.js (4 tools)

- **ESLint** - JavaScript/TypeScript linter (recommended)
- **Prettier** - Code formatter (recommended)
- **Pre-commit hooks** - Git hooks for code quality (recommended)
- **TypeScript ESLint** - TypeScript-specific linting (conditional)

### React (4 tools)

- **ESLint** - JavaScript/TypeScript linter with React plugin (recommended)
- **Prettier** - Code formatter (recommended)
- **Pre-commit hooks** - Git hooks for code quality (recommended)
- **TypeScript ESLint** - TypeScript-specific linting (conditional)

### Python (4 tools)

- **Black** - Python code formatter (recommended)
- **Flake8** - Python linter (recommended)
- **isort** - Import sorter (recommended)
- **Pre-commit hooks** - Git hooks for code quality (recommended)

### Flutter (2 tools)

- **Dart Analyzer** - Dart/Flutter linter (recommended)
- **Pre-commit hooks** - Git hooks for code quality (recommended)

### Rust (3 tools)

- **Clippy** - Rust linter (recommended)
- **rustfmt** - Rust formatter (recommended)
- **Pre-commit hooks** - Git hooks for code quality (recommended)

---

## API Reference

### `getToolsForFramework(framework, language)`

Get all available linting tools for a framework and language.

**Signature:**

```typescript
function getToolsForFramework(framework: string, language: string): LintingTool[];
```

**Parameters:**

- `framework`: Framework name (e.g., "Node.js", "Python")
- `language`: Programming language (e.g., "TypeScript", "JavaScript")

**Returns:** Array of linting tools with metadata

---

### `getRecommendedTools(framework, language)`

Get recommended linting tools for a framework.

**Signature:**

```typescript
function getRecommendedTools(framework: string, language: string): LintingTool[];
```

**Returns:** Array of tools where `recommended: true`

---

### `getDependenciesForTools(selectedTools)`

Get aggregated dependencies for selected tools.

**Signature:**

```typescript
function getDependenciesForTools(selectedTools: LintingTool[]): string[];
```

**Returns:** Flat array of dependency strings (e.g., `["eslint@^8.50.0", "prettier@^3.0.0"]`)

---

### `getScriptsForTools(selectedTools)`

Get aggregated npm scripts for selected tools.

**Signature:**

```typescript
function getScriptsForTools(selectedTools: LintingTool[]): Record<string, string>;
```

**Returns:** Object with npm script definitions

---

### `getPostInstallInstructions(selectedTools, framework)`

Get post-installation instructions for selected tools.

**Signature:**

```typescript
function getPostInstallInstructions(
  selectedTools: LintingTool[],
  framework: string
): PostInstallInstruction[];
```

**Returns:** Array of instructions with command and description

---

## Tool Definitions

### LintingTool Interface

```typescript
interface LintingTool {
  id: string; // Unique identifier
  name: string; // Display name
  description: string; // Tool description
  file: string; // Config file name
  recommended: boolean; // Pre-selected by default
  dependencies?: string[]; // npm/pip/pub dependencies
  scripts?: Record<string, string>; // npm scripts to add
  postInstall?: string; // Post-install command
  requiresTypeScript?: boolean; // Only for TypeScript projects
}
```

---

## Example Tool Definitions

### ESLint (Node.js)

```typescript
{
  id: 'eslint',
  name: 'ESLint',
  description: 'JavaScript/TypeScript linter',
  file: '.eslintrc.json',
  recommended: true,
  dependencies: ['eslint@^8.50.0'],
  scripts: {
    lint: 'eslint .',
    'lint:fix': 'eslint . --fix'
  }
}
```

### Prettier (Node.js)

```typescript
{
  id: 'prettier',
  name: 'Prettier',
  description: 'Code formatter',
  file: '.prettierrc.json',
  recommended: true,
  dependencies: ['prettier@^3.0.0'],
  scripts: {
    format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"',
    'format:check': 'prettier --check "**/*.{js,jsx,ts,tsx,json,md}"'
  }
}
```

### Black (Python)

```typescript
{
  id: 'black',
  name: 'Black',
  description: 'Python code formatter',
  file: 'pyproject.toml',
  recommended: true,
  dependencies: ['black>=23.0.0']
}
```

### Clippy (Rust)

```typescript
{
  id: 'clippy',
  name: 'Clippy',
  description: 'Rust linter',
  file: 'clippy.toml',
  recommended: true,
  dependencies: [] // Built into Rust toolchain
}
```

---

## Usage Examples

### Get Tools for Node.js Project

```typescript
import { getToolsForFramework } from './utils/linting-tools.js';

const tools = getToolsForFramework('Node.js', 'JavaScript');

console.log(tools);
// [
//   { id: 'eslint', name: 'ESLint', ... },
//   { id: 'prettier', name: 'Prettier', ... },
//   { id: 'precommit', name: 'Pre-commit hooks', ... },
//   { id: 'typescript-eslint', name: 'TypeScript ESLint', ... }
// ]
```

### Get Recommended Tools

```typescript
import { getRecommendedTools } from './utils/linting-tools.js';

const recommended = getRecommendedTools('Node.js', 'JavaScript');

console.log(recommended);
// [
//   { id: 'eslint', recommended: true, ... },
//   { id: 'prettier', recommended: true, ... },
//   { id: 'precommit', recommended: true, ... }
// ]
// Note: typescript-eslint excluded (recommended: false for JS)
```

### TypeScript Project (Special Handling)

```typescript
const toolsJS = getToolsForFramework('Node.js', 'JavaScript');
const toolsTS = getToolsForFramework('Node.js', 'TypeScript');

// For TypeScript, tools with requiresTypeScript become recommended
console.log(toolsTS.find((t) => t.id === 'typescript-eslint').recommended);
// true (promoted for TypeScript projects)
```

### Get Dependencies for Selected Tools

```typescript
import { getDependenciesForTools } from './utils/linting-tools.js';

const selectedTools = [
  { id: 'eslint', dependencies: ['eslint@^8.50.0'] },
  { id: 'prettier', dependencies: ['prettier@^3.0.0'] },
];

const deps = getDependenciesForTools(selectedTools);

console.log(deps);
// ['eslint@^8.50.0', 'prettier@^3.0.0']
```

### Get npm Scripts

```typescript
import { getScriptsForTools } from './utils/linting-tools.js';

const selectedTools = [
  {
    id: 'eslint',
    scripts: {
      lint: 'eslint .',
      'lint:fix': 'eslint . --fix',
    },
  },
  {
    id: 'prettier',
    scripts: {
      format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"',
    },
  },
];

const scripts = getScriptsForTools(selectedTools);

console.log(scripts);
// {
//   lint: 'eslint .',
//   'lint:fix': 'eslint . --fix',
//   format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"'
// }
```

---

## Framework Defaults

### Unknown Framework Handling

```typescript
const tools = getToolsForFramework('PHP', 'PHP');
// Falls back to Node.js tools (default)
// Returns: ESLint, Prettier, Pre-commit, TypeScript-ESLint
```

**Fallback Logic:**

```typescript
const tools = lintingTools[framework] || lintingTools['Node.js'] || [];
```

---

## Complete Tool Matrix

| Framework | ESLint | Prettier | Pre-commit | TypeScript-ESLint | Black | Flake8 | isort | Dart Analyzer | Clippy | rustfmt |
| --------- | ------ | -------- | ---------- | ----------------- | ----- | ------ | ----- | ------------- | ------ | ------- |
| Node.js   | ✓      | ✓        | ✓          | ✓                 | -     | -      | -     | -             | -      | -       |
| React     | ✓      | ✓        | ✓          | ✓                 | -     | -      | -     | -             | -      | -       |
| Python    | -      | -        | ✓          | -                 | ✓     | ✓      | ✓     | -             | -      | -       |
| Flutter   | -      | -        | ✓          | -                 | -     | -      | -     | ✓             | -      | -       |
| Rust      | -      | -        | ✓          | -                 | -     | -      | -     | -             | ✓      | ✓       |

---

## Dependency Versions

### Node.js/React

- `eslint@^8.50.0` - ESLint core
- `eslint-plugin-react@^7.33.0` - React plugin (React only)
- `prettier@^3.0.0` - Prettier formatter
- `@typescript-eslint/parser@^6.7.0` - TypeScript parser
- `@typescript-eslint/eslint-plugin@^6.7.0` - TypeScript ESLint plugin

### Python

- `black>=23.0.0` - Black formatter
- `flake8>=6.0.0` - Flake8 linter
- `isort>=5.12.0` - isort import sorter
- `pre-commit>=3.3.0` - Pre-commit framework

### Flutter

- No external dependencies (Dart Analyzer built into Dart SDK)

### Rust

- No external dependencies (Clippy and rustfmt built into Rust toolchain)

---

## npm Scripts Generated

### ESLint Scripts

```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
}
```

### Prettier Scripts

```json
{
  "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
  "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,md}\""
}
```

### Combined Scripts Example

```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
  "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,md}\""
}
```

---

## Integration Points

### Called By

- `src/cli/commands/deploy/linting.ts` - Linting deployment command
- `trinity-deploy` CLI command (linting selection)

### Uses

- `LintingTool` type - From `src/cli/types.ts`
- `PostInstallInstruction` type - From `src/cli/types.ts`

---

## Testing Considerations

### Unit Testing

```typescript
import {
  getToolsForFramework,
  getRecommendedTools,
  getDependenciesForTools,
  getScriptsForTools,
} from './linting-tools';

describe('getToolsForFramework', () => {
  it('should return Node.js tools', () => {
    const tools = getToolsForFramework('Node.js', 'JavaScript');
    expect(tools).toHaveLength(4);
    expect(tools.map((t) => t.id)).toContain('eslint');
  });

  it('should return Python tools', () => {
    const tools = getToolsForFramework('Python', 'Python');
    expect(tools).toHaveLength(4);
    expect(tools.map((t) => t.id)).toContain('black');
  });

  it('should promote TypeScript tools for TS projects', () => {
    const tools = getToolsForFramework('Node.js', 'TypeScript');
    const tsEslint = tools.find((t) => t.id === 'typescript-eslint');
    expect(tsEslint.recommended).toBe(true);
  });
});

describe('getRecommendedTools', () => {
  it('should filter to recommended only', () => {
    const recommended = getRecommendedTools('Node.js', 'JavaScript');
    expect(recommended.every((t) => t.recommended)).toBe(true);
  });
});

describe('getDependenciesForTools', () => {
  it('should aggregate dependencies', () => {
    const tools = [
      { id: 'eslint', dependencies: ['eslint@^8.50.0'] },
      { id: 'prettier', dependencies: ['prettier@^3.0.0'] },
    ];
    const deps = getDependenciesForTools(tools);
    expect(deps).toEqual(['eslint@^8.50.0', 'prettier@^3.0.0']);
  });
});

describe('getScriptsForTools', () => {
  it('should combine scripts from multiple tools', () => {
    const tools = [
      { id: 'eslint', scripts: { lint: 'eslint .' } },
      { id: 'prettier', scripts: { format: 'prettier --write "**/*.js"' } },
    ];
    const scripts = getScriptsForTools(tools);
    expect(scripts).toHaveProperty('lint');
    expect(scripts).toHaveProperty('format');
  });
});
```

---

## Related Documentation

- **Linting Deployment Command**: [docs/api/deploy-linting.md](deploy-linting.md)
- **Linting Deployment Utilities**: [docs/api/deploy-linting-utils.md](deploy-linting-utils.md)
- **Dependency Injection**: [docs/api/inject-dependencies.md](inject-dependencies.md) (pending)
- **Deploy Command**: [docs/api/deploy-command.md](deploy-command.md)

---

## Version History

| Version | Date       | Changes                                                   |
| ------- | ---------- | --------------------------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with 5 frameworks, 12 unique tools |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3                            |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
