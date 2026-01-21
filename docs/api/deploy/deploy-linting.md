# deploy-linting.md

## Overview

The `deploy-linting` module handles the deployment of framework-specific linting configurations to the target project. This includes deploying configuration files for linting tools (ESLint, Prettier, Black, etc.) and injecting linting dependencies into the project's package management files.

**Module:** `src/cli/commands/deploy/linting.ts`
**Purpose:** Deploy framework-specific linting configurations and dependencies
**Category:** Deployment Command
**Dependencies:**

- `deploy-linting.ts` (utility) - Linting tool deployment
- `inject-dependencies.ts` (utility) - Dependency injection
- `fs-extra` - File system operations

---

## Main Function

### `deployLinting()`

Deploys linting configuration files and injects linting dependencies into the project's package management files.

**Signature:**

```typescript
async function deployLinting(
  lintingTools: LintingTool[],
  lintingDependencies: string[],
  lintingScripts: Record<string, string>,
  stack: Stack,
  templatesPath: string,
  variables: Record<string, string>,
  spinner: Spinner
): Promise<number>;
```

**Parameters:**

- `lintingTools` (LintingTool[]) - Array of selected linting tools to deploy (e.g., `[{ id: 'eslint', name: 'ESLint' }, { id: 'prettier', name: 'Prettier' }]`)
- `lintingDependencies` (string[]) - Array of dependency strings to inject (e.g., `['eslint@^8.50.0', 'prettier@^3.0.0']`)
- `lintingScripts` (Record<string, string>) - Scripts to add to package.json (e.g., `{ lint: 'eslint .', format: 'prettier --write .' }`)
- `stack` (Stack) - Detected technology stack with framework and language information
- `templatesPath` (string) - Absolute path to the SDK's templates directory
- `variables` (Record<string, string>) - Template variables for substitution
- `spinner` (Spinner) - Ora spinner instance for displaying deployment progress

**Returns:**

```typescript
Promise<number>; // Number of configuration files deployed
```

**Behavior:**

1. **Deploy Configuration Files:**
   - Iterates through selected linting tools
   - Calls `deployLintingTool()` for each tool
   - Deploys framework-specific configuration files
   - Returns count of files deployed

2. **Inject Dependencies:**
   - Injects linting dependencies into package management files
   - Adds linting scripts to package.json (Node.js) or requirements-dev.txt (Python)
   - Only injects if dependencies array is not empty

**Error Handling:**

- Catches deployment errors and displays warnings (doesn't fail entire deployment)
- Catches dependency injection errors and displays warnings
- Uses `getErrorMessage()` to extract error messages safely
- Continues with other steps even if one fails

**Example Usage:**

```typescript
import { deployLinting } from './deploy-linting.js';

const filesDeployed = await deployLinting(
  [
    { id: 'eslint', name: 'ESLint' },
    { id: 'prettier', name: 'Prettier' },
  ],
  ['eslint@^8.50.0', 'prettier@^3.0.0'],
  {
    lint: 'eslint .',
    format: 'prettier --write .',
  },
  { framework: 'Node.js', language: 'JavaScript' },
  '/usr/local/lib/node_modules/trinity-method/src/templates',
  { PROJECT_NAME: 'myapp' },
  spinner
);

console.log(`Deployed ${filesDeployed} linting configuration files`);
// Output: Deployed 2 linting configuration files
```

---

## Deployment Process

### Phase 1: Configuration File Deployment

**Handled by:** `deployLintingTool()` utility function

**Process:**

1. Determines framework directory based on detected framework:
   - `Node.js`, `React`, `Next.js` → `nodejs/`
   - `Python` → `python/`
   - `Flutter` → `flutter/`
   - `Rust` → `rust/`

2. For each selected linting tool, calls appropriate deployment function:
   - `eslint` → `deployESLint()`
   - `prettier` → `deployPrettier()`
   - `precommit` → `deployPreCommit()`
   - `typescript-eslint` → `deployTypeScriptESLint()`
   - `black`, `flake8`, `isort` → `deployPythonTool()`
   - `dartanalyzer` → `deployDartAnalyzer()`
   - `clippy`, `rustfmt` → `deployRustTool()`

3. Increments files deployed counter for each successful deployment

**Status Messages:**

```
⠹ Deploying linting configuration...
✔ Linting configuration deployed (2 tools)
```

**Error Case:**

```
✖ Linting configuration deployment failed
⚠ Warning: Template file not found
```

---

### Phase 2: Dependency Injection

**Handled by:** `injectLintingDependencies()` utility function

**Process:**

1. Determines package manager based on framework:
   - `Node.js`, `React`, `Next.js` → `package.json` (npm)
   - `Python` → `requirements-dev.txt` (pip)
   - `Rust`, `Flutter` → No injection (built-in tools)

2. For Node.js projects:
   - Reads `package.json`
   - Adds dependencies to `devDependencies` section
   - Adds linting scripts to `scripts` section
   - Writes back with 2-space indentation

3. For Python projects:
   - Creates or appends to `requirements-dev.txt`
   - Adds dependency lines (e.g., `black>=23.0.0`)

**Status Messages:**

```
⠹ Adding linting dependencies to project...
✔ Linting dependencies added to project configuration
```

**Error Case:**

```
✖ Dependency injection failed
⚠ Warning: package.json not found, skipping dependency injection
```

---

## Supported Linting Tools

### Node.js / JavaScript / TypeScript

#### ESLint

**Configuration File:** `.eslintrc.json`

**Templates:**

- `.eslintrc-typescript.json.template` (TypeScript projects)
- `.eslintrc-esm.json.template` (ESM module type)
- `.eslintrc-commonjs.json.template` (CommonJS module type)

**Selection Logic:**

```typescript
if (stack.language === 'TypeScript') {
  // Use TypeScript template
} else if (stack.moduleType === 'esm') {
  // Use ESM template
} else {
  // Use CommonJS template
}
```

**Dependencies Injected:**

- `eslint@^8.50.0`
- `eslint-config-airbnb-base@^15.0.0` (optional)
- `eslint-plugin-import@^2.28.0` (optional)

**Scripts Added:**

```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
}
```

---

#### Prettier

**Configuration File:** `.prettierrc.json`

**Template:** `.prettierrc.json.template`

**Dependencies Injected:**

- `prettier@^3.0.0`

**Scripts Added:**

```json
{
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

---

#### Pre-commit Hooks

**Configuration File:** `.pre-commit-config.yaml`

**Template:** `.pre-commit-config.yaml.template`

**Purpose:** Configure pre-commit hooks for automated linting before commits

**Dependencies Injected:**

- `pre-commit@^3.4.0`

---

#### TypeScript ESLint

**Configuration File:** `.eslintrc.json` (modifies existing)

**Behavior:**

- Reads existing `.eslintrc.json` file
- Adds `plugin:@typescript-eslint/recommended` to `extends` array
- Sets `parser` to `@typescript-eslint/parser`
- Adds `@typescript-eslint` to `plugins` array
- Writes back with 2-space indentation

**Dependencies Injected:**

- `@typescript-eslint/parser@^6.7.0`
- `@typescript-eslint/eslint-plugin@^6.7.0`

---

### Python

#### Black (Code Formatter)

**Configuration File:** `pyproject.toml`

**Template:** `pyproject.toml.template`

**Dependencies Injected:**

- `black>=23.0.0`

**Configuration Example:**

```toml
[tool.black]
line-length = 88
target-version = ['py39']
```

---

#### Flake8 (Linter)

**Configuration File:** `.flake8`

**Template:** `.flake8.template`

**Dependencies Injected:**

- `flake8>=6.0.0`

**Configuration Example:**

```ini
[flake8]
max-line-length = 88
extend-ignore = E203
```

---

#### isort (Import Sorter)

**Configuration File:** `pyproject.toml`

**Template:** `pyproject.toml.template` (combined with Black)

**Dependencies Injected:**

- `isort>=5.12.0`

**Configuration Example:**

```toml
[tool.isort]
profile = "black"
```

---

### Flutter / Dart

#### Dart Analyzer

**Configuration File:** `analysis_options.yaml`

**Template:** `analysis_options.yaml.template`

**Built-in Tool:** No dependencies injected (uses Dart SDK's analyzer)

**Configuration Example:**

```yaml
linter:
  rules:
    - prefer_const_constructors
    - avoid_print
```

---

### Rust

#### Clippy (Linter)

**Configuration File:** `clippy.toml`

**Template:** `clippy.toml.template`

**Built-in Tool:** No dependencies injected (uses Cargo clippy)

**Configuration Example:**

```toml
cognitive-complexity-threshold = 30
```

---

#### rustfmt (Formatter)

**Configuration File:** `rustfmt.toml`

**Template:** `rustfmt.toml.template`

**Built-in Tool:** No dependencies injected (uses Cargo fmt)

**Configuration Example:**

```toml
max_width = 100
tab_spaces = 4
```

---

## Dependency Injection Details

### Node.js Dependency Injection

**Function:** `injectNodeDependencies()`

**Process:**

1. Read `package.json`
2. Parse dependency strings:
   ```typescript
   // Input: "@typescript-eslint/parser@^6.7.0"
   const lastAtIndex = dep.lastIndexOf('@');
   const name = dep.substring(0, lastAtIndex); // "@typescript-eslint/parser"
   const version = dep.substring(lastAtIndex + 1); // "^6.7.0"
   ```
3. Add to `devDependencies` object
4. Add scripts to `scripts` object (only if not already present)
5. Write back with `{ spaces: 2 }` formatting

**Example Before:**

```json
{
  "name": "myapp",
  "version": "1.0.0",
  "devDependencies": {}
}
```

**Example After:**

```json
{
  "name": "myapp",
  "version": "1.0.0",
  "devDependencies": {
    "eslint": "^8.50.0",
    "prettier": "^3.0.0"
  },
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

---

### Python Dependency Injection

**Function:** `injectPythonDependencies()`

**Process:**

1. Check if `requirements-dev.txt` exists
2. Read existing content (if file exists)
3. For each dependency:
   - Extract package name (before `>=` or `==`)
   - Check if already present
   - Append if not present
4. Write back to `requirements-dev.txt`

**Example Before:**

```
pytest>=7.0.0
```

**Example After:**

```
pytest>=7.0.0
black>=23.0.0
flake8>=6.0.0
isort>=5.12.0
```

---

## Template Variable Substitution

### Common Variables Used

**In Configuration Templates:**

- `{{PROJECT_NAME}}` - Project name
- `{{FRAMEWORK}}` - Detected framework
- `{{SOURCE_DIR}}` - Source directory
- `{{LANGUAGE}}` - Programming language

**Example Template (`.eslintrc.json.template`):**

```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {}
}
```

**After Processing:**

```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {}
}
```

---

## Integration with Deployment Workflow

### Called From

**Main Deploy Command:** `src/cli/commands/deploy/index.ts`

**Deployment Sequence:**

```typescript
// Step 9 of 12 in deployment workflow
if (lintingTools.length > 0) {
  spinner.start('Step 9: Deploying linting configuration...');
  const lintingFilesDeployed = await deployLinting(
    lintingTools,
    lintingDependencies,
    lintingScripts,
    stack,
    templatesPath,
    variables,
    spinner
  );
  progress.lintingFilesDeployed = lintingFilesDeployed;
}
```

**Depends On:**

- Step 3: Framework detection (provides `stack` object)
- Step 4: User configuration (provides `lintingTools`, `lintingDependencies`, `lintingScripts`)

**Required By:**

- Step 12: Summary display (uses `progress.lintingFilesDeployed`)

---

## Error Scenarios

### Missing Template File

**Scenario:** Template file doesn't exist for selected tool

**Behavior:**

- `fs.readFile()` throws ENOENT error
- Error caught by try-catch block
- Warning displayed: "Linting configuration deployment failed"
- Deployment continues (doesn't halt)

**Example:**

```
✖ Linting configuration deployment failed
⚠ Warning: Template file not found: /templates/root/linting/nodejs/.eslintrc.json.template
```

---

### Missing package.json

**Scenario:** `package.json` doesn't exist (Node.js project)

**Behavior:**

- Warning displayed: "Warning: package.json not found, skipping dependency injection"
- Function returns without injecting dependencies
- Deployment continues

**Example:**

```
⚠ Warning: package.json not found, skipping dependency injection
```

---

### Invalid Dependency Format

**Scenario:** Dependency string doesn't contain version (e.g., `"eslint"` instead of `"eslint@^8.50.0"`)

**Behavior:**

- `lastIndexOf('@')` returns -1
- `version` becomes entire string
- Invalid dependency added to package.json
- User must manually fix package.json

**Prevention:**

- Dependency strings should always include version (e.g., `"package@version"`)
- Linting tool configuration should validate dependency format

---

### Permission Denied

**Scenario:** Cannot write to project directory (permissions issue)

**Behavior:**

- `fs.writeFile()` throws EACCES error
- Error caught by try-catch block
- Warning displayed with error message
- Deployment continues

---

## Best Practices

### For SDK Developers

1. **Template Organization:**
   - Organize templates by framework: `templates/root/linting/{framework}/`
   - Use `.template` extension for all template files
   - Provide variants for different module types (ESM, CommonJS, TypeScript)

2. **Dependency Management:**
   - Always include version in dependency strings: `"package@version"`
   - Use caret ranges for maximum compatibility: `"^8.50.0"`
   - Group related dependencies together

3. **Error Handling:**
   - Catch errors gracefully (don't fail entire deployment)
   - Display helpful warnings with context
   - Log errors for debugging

4. **Framework Support:**
   - Add new frameworks to `getFrameworkDirectory()` mapping
   - Create deployment functions for new tools
   - Document configuration file formats

### For End Users

1. **Tool Selection:**
   - Choose tools appropriate for your framework
   - ESLint + Prettier is common for JavaScript/TypeScript
   - Black + Flake8 + isort for Python
   - Built-in tools for Rust and Flutter

2. **Customization:**
   - Configuration files are deployed to project root
   - Customize rules after deployment
   - Add project-specific overrides

3. **Installation:**
   - Run `npm install` after deployment (Node.js)
   - Run `pip install -r requirements-dev.txt` after deployment (Python)
   - Dependencies are injected but not automatically installed

4. **Scripts:**
   - Use added scripts for linting: `npm run lint`
   - Use format scripts: `npm run format`
   - Add to pre-commit hooks for automation

---

## Linting Tool Comparison

### Node.js / JavaScript / TypeScript

| Tool              | Purpose              | Config File        | Auto-fix | Speed  |
| ----------------- | -------------------- | ------------------ | -------- | ------ |
| ESLint            | Code quality linting | `.eslintrc.json`   | Yes      | Medium |
| Prettier          | Code formatting      | `.prettierrc.json` | Yes      | Fast   |
| TypeScript ESLint | TypeScript linting   | `.eslintrc.json`   | Yes      | Medium |

**Recommended Combination:** ESLint + Prettier + TypeScript ESLint (for TypeScript projects)

---

### Python

| Tool   | Purpose                 | Config File      | Auto-fix | Speed |
| ------ | ----------------------- | ---------------- | -------- | ----- |
| Black  | Code formatting         | `pyproject.toml` | Yes      | Fast  |
| Flake8 | Style guide enforcement | `.flake8`        | No       | Fast  |
| isort  | Import sorting          | `pyproject.toml` | Yes      | Fast  |

**Recommended Combination:** Black + Flake8 + isort

---

### Rust

| Tool    | Purpose         | Config File    | Auto-fix | Speed  |
| ------- | --------------- | -------------- | -------- | ------ |
| Clippy  | Code linting    | `clippy.toml`  | Some     | Medium |
| rustfmt | Code formatting | `rustfmt.toml` | Yes      | Fast   |

**Recommended Combination:** Clippy + rustfmt (both built-in)

---

### Flutter / Dart

| Tool          | Purpose       | Config File             | Auto-fix | Speed |
| ------------- | ------------- | ----------------------- | -------- | ----- |
| Dart Analyzer | Code analysis | `analysis_options.yaml` | Some     | Fast  |

**Recommended:** Dart Analyzer (built-in with Flutter SDK)

---

## Related Documentation

- [deploy-command.md](deploy-command.md) - Main deployment orchestration
- [deploy-linting-utils.md](deploy-linting-utils.md) - Linting deployment utilities (detailed)
- [inject-dependencies.md](inject-dependencies.md) - Dependency injection utilities
- [linting-tools.md](linting-tools.md) - Linting tool metadata and configuration
- [configuration.md](deploy-configuration.md) - User configuration prompts

---

## Version Information

**Module Version:** 2.1.0
**Last Updated:** 2026-01-21
**Status:** Production Ready
**Stability:** Stable
