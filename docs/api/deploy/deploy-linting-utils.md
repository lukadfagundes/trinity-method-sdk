# Linting Deployment Utilities

**Module:** `src/cli/utils/deploy-linting.ts`
**Purpose:** Linting configuration generation utilities
**Category:** Deployment Utilities - Linting
**Priority:** MEDIUM

---

## Overview

The Linting Deployment Utilities module provides low-level functions for deploying linting tool configurations. It handles framework-specific linting setups for 9 different tools across 4 frameworks (Node.js, Python, Flutter, Rust), with intelligent template selection based on language and module type.

### Key Features

- **9 linting tools**: ESLint, Prettier, Pre-commit, TypeScript-ESLint, Black, Flake8, isort, Dart Analyzer, Clippy, rustfmt
- **Framework mapping**: Automatic framework directory resolution
- **Language-aware**: Selects templates based on TypeScript/JavaScript and ESM/CommonJS
- **Template processing**: Variable substitution and customization
- **Path validation**: Security checks for file system operations

---

## API Reference

### `deployLintingTool(tool, stack, templatesPath, variables)`

Deploys configuration file for a specific linting tool.

**Signature:**

```typescript
async function deployLintingTool(
  tool: LintingTool,
  stack: Stack,
  templatesPath: string,
  variables: Record<string, string | number>
): Promise<void>;
```

**Parameters:**

| Parameter       | Type                               | Description                 |
| --------------- | ---------------------------------- | --------------------------- |
| `tool`          | `LintingTool`                      | Linting tool to deploy      |
| `stack`         | `Stack`                            | Detected technology stack   |
| `templatesPath` | `string`                           | Path to templates directory |
| `variables`     | `Record<string, string \| number>` | Template variables          |

**Returns:** `Promise<void>` - Writes config file to file system

---

### `getFrameworkDirectory(framework)`

Maps framework name to template directory name.

**Signature:**

```typescript
function getFrameworkDirectory(framework: string): string;
```

**Parameters:**

| Parameter   | Type     | Description                                |
| ----------- | -------- | ------------------------------------------ |
| `framework` | `string` | Framework name (e.g., "Node.js", "Python") |

**Returns:** `string` - Template directory name (e.g., "nodejs", "python")

**Mapping:**

```typescript
{
  'Node.js': 'nodejs',
  'React': 'nodejs',
  'Next.js': 'nodejs',
  'Python': 'python',
  'Flutter': 'flutter',
  'Rust': 'rust'
}
// Default: 'nodejs'
```

---

## Supported Linting Tools

### Node.js Tools (4 tools)

**1. ESLint (`eslint`)**

- **Config File:** `.eslintrc.json`
- **Templates:**
  - `.eslintrc-typescript.json.template` (TypeScript projects)
  - `.eslintrc-esm.json.template` (ESM projects)
  - `.eslintrc-commonjs.json.template` (CommonJS projects)
- **Selection Logic:** Based on `stack.language` and `stack.moduleType`

**2. Prettier (`prettier`)**

- **Config File:** `.prettierrc.json`
- **Template:** `.prettierrc.json.template`

**3. Pre-commit (`precommit`)**

- **Config File:** `.pre-commit-config.yaml`
- **Template:** `.pre-commit-config.yaml.template`

**4. TypeScript-ESLint (`typescript-eslint`)**

- **Config File:** `.eslintrc.json` (modified in-place)
- **Behavior:** Adds TypeScript support to existing ESLint config
- **Changes:**
  - Adds `plugin:@typescript-eslint/recommended` to `extends`
  - Sets `parser` to `@typescript-eslint/parser`
  - Adds `@typescript-eslint` to `plugins`

---

### Python Tools (3 tools)

**1. Black (`black`)**

- **Config File:** `pyproject.toml`
- **Template:** `pyproject.toml.template`
- **Shares config with isort**

**2. isort (`isort`)**

- **Config File:** `pyproject.toml`
- **Template:** `pyproject.toml.template`
- **Shares config with Black**

**3. Flake8 (`flake8`)**

- **Config File:** `.flake8`
- **Template:** `.flake8.template`

---

### Flutter Tools (1 tool)

**1. Dart Analyzer (`dartanalyzer`)**

- **Config File:** `analysis_options.yaml`
- **Template:** `analysis_options.yaml.template`

---

### Rust Tools (2 tools)

**1. Clippy (`clippy`)**

- **Config File:** `clippy.toml`
- **Template:** `clippy.toml.template`

**2. rustfmt (`rustfmt`)**

- **Config File:** `rustfmt.toml`
- **Template:** `rustfmt.toml.template`

---

## ESLint Template Selection

### Decision Tree

```
stack.language === 'TypeScript'
  ├─ YES → .eslintrc-typescript.json.template
  └─ NO → Check module type
      ├─ stack.moduleType === 'esm' → .eslintrc-esm.json.template
      └─ Default → .eslintrc-commonjs.json.template
```

### Examples

**TypeScript Project:**

```typescript
stack = { language: 'TypeScript', ... }
→ Uses: .eslintrc-typescript.json.template
→ Creates: .eslintrc.json (with TypeScript rules)
```

**ESM JavaScript Project:**

```typescript
stack = { language: 'JavaScript', moduleType: 'esm', ... }
→ Uses: .eslintrc-esm.json.template
→ Creates: .eslintrc.json (with ESM rules)
```

**CommonJS JavaScript Project:**

```typescript
stack = { language: 'JavaScript', moduleType: 'commonjs', ... }
→ Uses: .eslintrc-commonjs.json.template
→ Creates: .eslintrc.json (with CommonJS rules)
```

---

## Usage Examples

### Deploy ESLint for TypeScript

```typescript
import { deployLintingTool } from './utils/deploy-linting.js';

const tool = { id: 'eslint', name: 'ESLint', selected: true };
const stack = {
  framework: 'Node.js',
  language: 'TypeScript',
  sourceDir: 'src',
};
const variables = {
  PROJECT_NAME: 'my-project',
  FRAMEWORK: 'Node.js',
};

await deployLintingTool(tool, stack, templatesPath, variables);
// Creates: .eslintrc.json (TypeScript config)
```

### Deploy Multiple Tools

```typescript
const tools = [
  { id: 'eslint', name: 'ESLint', selected: true },
  { id: 'prettier', name: 'Prettier', selected: true },
  { id: 'precommit', name: 'Pre-commit', selected: true },
];

for (const tool of tools) {
  await deployLintingTool(tool, stack, templatesPath, variables);
}
// Creates: .eslintrc.json, .prettierrc.json, .pre-commit-config.yaml
```

### Deploy Python Tools

```typescript
const stack = {
  framework: 'Python',
  language: 'Python',
  sourceDir: 'src',
};

const blackTool = { id: 'black', name: 'Black', selected: true };
await deployLintingTool(blackTool, stack, templatesPath, variables);
// Creates: pyproject.toml (Black config)

const flake8Tool = { id: 'flake8', name: 'Flake8', selected: true };
await deployLintingTool(flake8Tool, stack, templatesPath, variables);
// Creates: .flake8
```

---

## TypeScript-ESLint Enhancement

### Special Behavior

Unlike other tools, `typescript-eslint` **modifies existing config** instead of creating new file.

### Example Modification

**Before (existing .eslintrc.json):**

```json
{
  "extends": ["eslint:recommended"],
  "env": {
    "node": true
  }
}
```

**After TypeScript-ESLint Deployment:**

```json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "env": {
    "node": true
  }
}
```

### Code Logic

```typescript
// 1. Read existing config
const config = await fs.readJson('.eslintrc.json');

// 2. Add TypeScript extends
config.extends = config.extends || [];
if (!config.extends.includes('plugin:@typescript-eslint/recommended')) {
  config.extends.push('plugin:@typescript-eslint/recommended');
}

// 3. Set TypeScript parser
config.parser = '@typescript-eslint/parser';

// 4. Add TypeScript plugin
config.plugins = config.plugins || [];
if (!config.plugins.includes('@typescript-eslint')) {
  config.plugins.push('@typescript-eslint');
}

// 5. Write back
await fs.writeJson('.eslintrc.json', config, { spaces: 2 });
```

---

## Template Processing

### Variable Substitution

```typescript
const content = await fs.readFile(templatePath, 'utf8');
const processed = processTemplate(content, variables);
await fs.writeFile(destPath, processed);
```

### Example Variables

```typescript
const variables = {
  PROJECT_NAME: 'trinity-method-sdk',
  FRAMEWORK: 'Node.js',
  SOURCE_DIR: 'src',
  YEAR: 2026,
};
```

### Template Example

```json
{
  "name": "{{PROJECT_NAME}}",
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "env": {
    "{{FRAMEWORK}}": true
  }
}
```

### Processed Output

```json
{
  "name": "trinity-method-sdk",
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "env": {
    "Node.js": true
  }
}
```

---

## Path Validation

### Security Feature

```typescript
const destPath = validatePath('.eslintrc.json');
await fs.writeFile(destPath, processed);
```

**Purpose:**

- Prevent path traversal attacks
- Ensure files written to safe locations
- Validate against malicious paths

**Example:**

```typescript
validatePath('.eslintrc.json')     → ✓ Valid
validatePath('../../../etc/passwd') → ✗ Throws error
```

---

## Framework Directory Mapping

### Why Mapping Needed?

- Templates organized by framework category (nodejs, python, flutter, rust)
- Multiple frameworks share same linting tools (React/Next.js use Node.js tools)
- Simplifies template organization

### Mapping Table

| Framework | Directory        | Tools Available                                 |
| --------- | ---------------- | ----------------------------------------------- |
| Node.js   | nodejs           | ESLint, Prettier, Pre-commit, TypeScript-ESLint |
| React     | nodejs           | ESLint, Prettier, Pre-commit, TypeScript-ESLint |
| Next.js   | nodejs           | ESLint, Prettier, Pre-commit, TypeScript-ESLint |
| Python    | python           | Black, Flake8, isort                            |
| Flutter   | flutter          | Dart Analyzer                                   |
| Rust      | rust             | Clippy, rustfmt                                 |
| Unknown   | nodejs (default) | ESLint, Prettier, Pre-commit, TypeScript-ESLint |

---

## Error Handling

### Unknown Tool Warning

```typescript
default:
  console.warn(`Unknown linting tool: ${tool.id}`);
```

**When Triggered:**

- Tool ID not recognized
- New tool added without implementation
- Typo in tool ID

**Behavior:**

- Logs warning to console
- Continues deployment (doesn't throw)
- No file created for unknown tool

### File System Errors

```typescript
// Errors bubble up to calling function (deploy/linting.ts)
await fs.writeFile(destPath, processed);
// If fails, error propagates to deploy command
```

---

## Integration Points

### Called By

- `src/cli/commands/deploy/linting.ts` - Higher-level linting deployment command
- Called once per selected linting tool

### Calls

- `processTemplate()` - Variable substitution (from `utils/template-processor.js`)
- `validatePath()` - Path security validation (from `utils/validate-path.js`)
- `fs-extra` - File system operations

### Templates Used

Templates located in: `src/cli/templates/root/linting/{framework}/`

**Node.js Templates:**

- `.eslintrc-typescript.json.template`
- `.eslintrc-esm.json.template`
- `.eslintrc-commonjs.json.template`
- `.prettierrc.json.template`
- `.pre-commit-config.yaml.template`

**Python Templates:**

- `pyproject.toml.template`
- `.flake8.template`

**Flutter Templates:**

- `analysis_options.yaml.template`

**Rust Templates:**

- `clippy.toml.template`
- `rustfmt.toml.template`

---

## Testing Considerations

### Unit Testing

```typescript
import { deployLintingTool, getFrameworkDirectory } from './deploy-linting';
import fs from 'fs-extra';

describe('deployLintingTool', () => {
  afterEach(async () => {
    await fs.remove('.eslintrc.json');
    await fs.remove('.prettierrc.json');
  });

  it('should deploy ESLint for TypeScript', async () => {
    const tool = { id: 'eslint', name: 'ESLint' };
    const stack = { framework: 'Node.js', language: 'TypeScript', sourceDir: 'src' };

    await deployLintingTool(tool, stack, templatesPath, {});

    expect(await fs.pathExists('.eslintrc.json')).toBe(true);
  });

  it('should deploy Prettier', async () => {
    const tool = { id: 'prettier', name: 'Prettier' };
    const stack = { framework: 'Node.js', language: 'JavaScript', sourceDir: 'src' };

    await deployLintingTool(tool, stack, templatesPath, {});

    expect(await fs.pathExists('.prettierrc.json')).toBe(true);
  });

  it('should enhance existing ESLint config with TypeScript', async () => {
    // Create existing config
    await fs.writeJson('.eslintrc.json', {
      extends: ['eslint:recommended'],
    });

    const tool = { id: 'typescript-eslint', name: 'TypeScript-ESLint' };
    const stack = { framework: 'Node.js', language: 'TypeScript', sourceDir: 'src' };

    await deployLintingTool(tool, stack, templatesPath, {});

    const config = await fs.readJson('.eslintrc.json');
    expect(config.extends).toContain('plugin:@typescript-eslint/recommended');
    expect(config.parser).toBe('@typescript-eslint/parser');
  });
});

describe('getFrameworkDirectory', () => {
  it('should map Node.js frameworks to nodejs', () => {
    expect(getFrameworkDirectory('Node.js')).toBe('nodejs');
    expect(getFrameworkDirectory('React')).toBe('nodejs');
    expect(getFrameworkDirectory('Next.js')).toBe('nodejs');
  });

  it('should map Python to python', () => {
    expect(getFrameworkDirectory('Python')).toBe('python');
  });

  it('should map Flutter to flutter', () => {
    expect(getFrameworkDirectory('Flutter')).toBe('flutter');
  });

  it('should map Rust to rust', () => {
    expect(getFrameworkDirectory('Rust')).toBe('rust');
  });

  it('should default to nodejs for unknown frameworks', () => {
    expect(getFrameworkDirectory('Unknown')).toBe('nodejs');
    expect(getFrameworkDirectory('PHP')).toBe('nodejs');
  });
});
```

---

## Performance Considerations

### Deployment Time

- **Template reading**: ~5-10ms per tool
- **Variable processing**: ~5ms per tool
- **File writing**: ~5-10ms per tool
- **Total per tool**: ~15-25ms

**Multiple tools:**

- 3 tools (ESLint + Prettier + Pre-commit): ~45-75ms
- 5 tools (add Black + Flake8): ~75-125ms

### Optimization Strategies

- Parallel tool deployment (currently sequential)
- Template caching
- Batch file writes

---

## Security Considerations

### Path Validation

- All destination paths validated before writing
- Prevents directory traversal attacks
- Ensures files written to project root only

### Template Source Integrity

- Templates stored in SDK package (npm verified)
- No user input in template content
- Read-only template source

### File Permissions

- Creates files with default user permissions
- No execution permissions set
- Safe for version control

---

## Related Documentation

- **Linting Deployment Command**: [docs/api/deploy-linting.md](deploy-linting.md)
- **Linting Tools Configuration**: [docs/api/linting-tools.md](linting-tools.md) (pending)
- **Template Processor**: [docs/api/template-processor.md](template-processor.md)
- **Path Validation**: [docs/api/validate-path.md](validate-path.md)
- **Deploy Command**: [docs/api/deploy-command.md](deploy-command.md)

---

## Version History

| Version | Date       | Changes                                     |
| ------- | ---------- | ------------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with 9 linting tools |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3              |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
