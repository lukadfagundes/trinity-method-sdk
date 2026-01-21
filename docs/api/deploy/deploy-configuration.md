# Deploy Configuration - Interactive Prompts

**Module:** `src/cli/commands/deploy/configuration.ts`
**Purpose:** Interactive user configuration for Trinity deployment
**Dependencies:** inquirer, fs-extra, chalk

---

## Overview

The Configuration module provides an interactive wizard for collecting user preferences during Trinity deployment. It prompts for project name, linting tools, CI/CD platform, and optional features, or applies sensible defaults when running in non-interactive mode (`--yes`).

**Why This Exists:**
Different projects have different requirements for code quality tools and CI/CD platforms. This module adapts Trinity deployment to project needs through interactive prompts, while supporting automation through the `--yes` flag for CI/CD pipelines.

---

## Main Function

### `promptConfiguration(options: DeployOptions, stack: Stack): Promise<Partial<DeployConfig>>`

Prompts user for deployment configuration or returns defaults.

**Parameters:**

| Parameter         | Type            | Required | Description                             |
| ----------------- | --------------- | -------- | --------------------------------------- |
| `options`         | `DeployOptions` | Yes      | Deployment command options              |
| `options.yes`     | `boolean`       | No       | Skip prompts and use defaults           |
| `options.name`    | `string`        | No       | Pre-specified project name              |
| `stack`           | `Stack`         | Yes      | Detected technology stack               |
| `stack.framework` | `string`        | Yes      | Framework name (Node.js, Python, etc.)  |
| `stack.language`  | `string`        | Yes      | Language (JavaScript, TypeScript, etc.) |

**Returns:** `Promise<Partial<DeployConfig>>` - User's deployment configuration

**Configuration Object:**

```typescript
{
  projectName: string;                  // User's project name
  enableLinting: boolean;               // Whether linting was enabled
  enableCICD: boolean;                  // Whether CI/CD was enabled
  lintingTools: LintingTool[];          // Selected linting tools
  lintingDependencies: string[];        // npm dependencies to install
  lintingScripts: Record<string, string>; // package.json scripts
  postInstallInstructions: PostInstallInstruction[]; // Post-deployment commands
}
```

**Throws:**

- Error when user cancels deployment (message: "Deployment cancelled by user")

---

## Interactive Prompts Flow

### 1. Project Name Prompt

**Function:** `promptProjectName(defaultName: string)`

Asks user to confirm or customize project name.

**Default:** Current directory name (from `path.basename(process.cwd())`)

**Example:**

```
? Project name: › my-awesome-project
```

---

### 2. Linting Tools Prompt

**Function:** `promptLintingChoice(stack: Stack)`

Asks whether to setup code quality tools.

**Choices:**

- **Yes (Recommended)**: Setup framework-specific linting tools
- **No (Skip)**: Skip linting configuration

**Display:**

```
📋 Optional: Code Quality Tools

Trinity can setup linting and formatting tools for Node.js projects.

? Setup linting configuration? (y/n) › Yes
```

**Returns:** `'recommended'` or `'skip'`

---

### 3. Recommended Linting Configuration

**Function:** `configureRecommendedLinting(stack: Stack)`

Automatically selects framework-appropriate linting tools.

**For Node.js projects:**

- ESLint (JavaScript/TypeScript linting)
- Prettier (code formatting)
- TypeScript (if TypeScript detected)

**For Python projects:**

- Pylint (Python linting)
- Black (code formatting)
- MyPy (type checking)

**Output Display:**

```
✔ Setup linting configuration? Recommended

📦 Will configure:
  ✓ ESLint (.eslintrc.js)
    JavaScript and TypeScript linting
  ✓ Prettier (.prettierrc)
    Code formatting

  Dependencies to add (run npm install after deployment):
    - eslint
    - prettier
    - eslint-config-prettier

  Scripts to add to package.json:
    - npm run lint
    - npm run format
```

**Returns:**

```typescript
{
  tools: LintingTool[];          // Selected tools
  dependencies: string[];        // npm/pip dependencies
  scripts: Record<string, string>; // package.json scripts
}
```

---

### 4. CI/CD Platform Detection and Prompt

**Function:** `promptCICDSetup()`

Detects Git platform and prompts for CI/CD workflow deployment.

**Detection Logic:**

1. Read `.git/config` file
2. Check for `github.com` → GitHub Actions
3. Check for `gitlab.com` or `gitlab` → GitLab CI
4. Otherwise → Unknown (defaults to GitHub Actions)

**Prompt:**

```
⚙️  Optional: CI/CD Automation

Trinity can setup automated testing workflows for your CI/CD platform.

? Deploy CI/CD workflow templates? › Yes
```

**Output Display (GitHub detected):**

```
✔ Deploy CI/CD workflow templates? Yes
📦 Detected platform: GitHub Actions

  Will configure:
  ✓ .github/workflows/trinity-ci.yml
  ✓ trinity/templates/ci/generic-ci.yml (reference)
```

**Output Display (No platform detected):**

```
✔ Deploy CI/CD workflow templates? Yes

📦 Will configure:

  ✓ .github/workflows/trinity-ci.yml (GitHub Actions)
  ✓ trinity/templates/ci/generic-ci.yml (reference)
```

**Returns:** `boolean` - Whether CI/CD was enabled

---

### 5. Deployment Confirmation

**Function:** `confirmDeployment()`

Final confirmation before deployment begins.

**Prompt:**

```
? Proceed with deployment? › Yes
```

**If user selects No:**

```
🔸 Deployment cancelled
```

**Throws:** Error with message "Deployment cancelled by user"

---

## Non-Interactive Mode

### `getDefaultConfig(options: DeployOptions): Partial<DeployConfig>`

Returns default configuration when `--yes` flag is used.

**Default Configuration:**

```typescript
{
  projectName: options.name || path.basename(process.cwd()),
  enableLinting: false,          // Linting disabled by default
  enableCICD: false,             // CI/CD disabled by default
  lintingTools: [],
  lintingDependencies: [],
  lintingScripts: {},
  postInstallInstructions: [],
}
```

**Usage Example:**

```bash
npx trinity deploy --yes
# Uses defaults: no linting, no CI/CD, project name from directory
```

---

## Helper Functions

### `displayLintingConfig(tools, dependencies, scripts)`

Displays formatted linting configuration summary.

**Parameters:**

- `tools`: Array of selected `LintingTool` objects
- `dependencies`: Array of npm package names
- `scripts`: Object mapping script names to commands

**Output Format:**

```
📦 Will configure:
  ✓ Tool Name (config-file.js)
    Tool description

  Dependencies to add (run npm install after deployment):
    - dependency-1
    - dependency-2

  Scripts to add to package.json:
    - npm run script-name
```

---

### `detectGitPlatform(): Promise<string>`

Auto-detects Git hosting platform from `.git/config`.

**Detection Logic:**

1. Check if `.git/config` exists
2. Read file contents
3. Search for platform identifiers:
   - `github.com` → Return "GitHub Actions"
   - `gitlab.com` or `gitlab` → Return "GitLab CI"
4. Return "unknown" if not detected or error occurs

**Returns:** `Promise<string>` - Platform name or "unknown"

**Error Handling:** Silently catches all errors and returns "unknown"

---

### `displayCICDConfig(platform: string)`

Displays formatted CI/CD configuration summary.

**Parameters:**

- `platform`: Detected Git platform ("GitHub Actions", "GitLab CI", "unknown")

**Output (GitHub):**

```
✔ Deploy CI/CD workflow templates? Yes
📦 Detected platform: GitHub Actions

  Will configure:
  ✓ .github/workflows/trinity-ci.yml
  ✓ trinity/templates/ci/generic-ci.yml (reference)
```

**Output (Unknown):**

```
✔ Deploy CI/CD workflow templates? Yes

📦 Will configure:

  ✓ .github/workflows/trinity-ci.yml (GitHub Actions)
  ✓ trinity/templates/ci/generic-ci.yml (reference)
```

---

## Integration with Linting Tools

The configuration module integrates with the linting tools utility:

### `getRecommendedTools(framework: string, language: string): LintingTool[]`

Returns framework-specific recommended linting tools.

**For Node.js + JavaScript:**

- ESLint
- Prettier

**For Node.js + TypeScript:**

- ESLint
- Prettier
- TypeScript

**For Python:**

- Pylint
- Black
- MyPy

---

### `getDependenciesForTools(tools: LintingTool[]): string[]`

Extracts npm/pip dependency names from selected tools.

**Example:**

```typescript
const tools = [eslintTool, prettierTool];
const deps = getDependenciesForTools(tools);
// Returns: ['eslint', 'prettier', 'eslint-config-prettier']
```

---

### `getScriptsForTools(tools: LintingTool[]): Record<string, string>`

Generates package.json scripts for selected tools.

**Example:**

```typescript
const tools = [eslintTool, prettierTool];
const scripts = getScriptsForTools(tools);
// Returns: {
//   'lint': 'eslint src/**/*.{js,ts}',
//   'format': 'prettier --write src/**/*.{js,ts}'
// }
```

---

### `getPostInstallInstructions(tools: LintingTool[], framework: string): PostInstallInstruction[]`

Generates post-deployment instructions for user.

**Example:**

```typescript
const tools = [eslintTool, prettierTool];
const instructions = getPostInstallInstructions(tools, 'Node.js');
// Returns: [
//   { command: 'npm install', description: 'Install linting dependencies' },
//   { command: 'npm run lint', description: 'Run linting' }
// ]
```

---

## Usage Examples

### Example 1: Interactive Deployment (Full Configuration)

```bash
npx trinity deploy
```

**User Experience:**

```
? Project name: › my-project

📋 Optional: Code Quality Tools
Trinity can setup linting and formatting tools for Node.js projects.

? Setup linting configuration? (y/n) › Yes

✔ Setup linting configuration? Recommended

📦 Will configure:
  ✓ ESLint (.eslintrc.js)
  ✓ Prettier (.prettierrc)

  Dependencies to add:
    - eslint
    - prettier

⚙️  Optional: CI/CD Automation
Trinity can setup automated testing workflows for your CI/CD platform.

? Deploy CI/CD workflow templates? › Yes

✔ Deploy CI/CD workflow templates? Yes
📦 Detected platform: GitHub Actions

? Proceed with deployment? › Yes
```

---

### Example 2: Non-Interactive Deployment (Defaults)

```bash
npx trinity deploy --yes
```

**Behavior:**

- Skips all prompts
- Uses directory name as project name
- No linting configuration
- No CI/CD workflows
- Proceeds immediately to deployment

**Configuration Returned:**

```typescript
{
  projectName: 'current-directory-name',
  enableLinting: false,
  enableCICD: false,
  lintingTools: [],
  lintingDependencies: [],
  lintingScripts: {},
  postInstallInstructions: [],
}
```

---

### Example 3: Pre-Specified Project Name

```bash
npx trinity deploy --name "Awesome Project"
```

**Behavior:**

- Skips project name prompt
- Uses "Awesome Project" as project name
- Prompts for linting and CI/CD as normal

---

### Example 4: User Cancels Deployment

```bash
npx trinity deploy
```

**User selects "No" at confirmation:**

```
? Proceed with deployment? › No

🔸 Deployment cancelled
```

**Result:** Throws error, deployment stops gracefully

---

## Configuration Output Structure

### DeployConfig Interface

```typescript
interface DeployConfig {
  projectName: string; // User-specified project name
  stack: Stack; // Detected technology stack
  metrics: CodebaseMetrics; // Collected metrics (if not skipped)
  lintingTools: LintingTool[]; // Selected linting tools
  lintingDependencies: string[]; // npm/pip dependencies
  lintingScripts: Record<string, string>; // package.json scripts
  postInstallInstructions: PostInstallInstruction[]; // Post-deployment tasks
  enableLinting: boolean; // Whether linting enabled
  enableCICD: boolean; // Whether CI/CD enabled
  enableWorkOrders: boolean; // (Currently unused)
  enableInvestigations: boolean; // (Currently unused)
  enableDocs: boolean; // (Currently unused)
}
```

---

## LintingTool Structure

```typescript
interface LintingTool {
  id: string; // Unique identifier (e.g., 'eslint')
  name: string; // Display name (e.g., 'ESLint')
  file: string; // Config filename (e.g., '.eslintrc.js')
  description?: string; // Tool description
  template?: string; // Template file path
  framework?: string; // Target framework (e.g., 'Node.js')
  language?: string; // Target language (e.g., 'JavaScript')
  recommended?: boolean; // Whether tool is recommended
  dependencies?: string[]; // npm packages to install
  scripts?: Record<string, string>; // package.json scripts
  requiresTypeScript?: boolean; // Whether TypeScript is required
  postInstall?: string; // Post-install instruction
}
```

---

## PostInstallInstruction Structure

```typescript
interface PostInstallInstruction {
  command: string; // Command to run (e.g., 'npm install')
  description?: string; // Human-readable description
}
```

---

## Error Handling

### Cancellation Handling

When user cancels deployment at confirmation prompt:

```typescript
if (!confirmAnswer.confirmDeploy) {
  console.log(chalk.yellow('\n🔸 Deployment cancelled\n'));
  throw new Error('Deployment cancelled by user');
}
```

**Caught by:** Deploy command's main try-catch block
**Result:** Graceful exit without stack trace

---

### Git Detection Errors

Git platform detection failures are silently caught:

```typescript
async function detectGitPlatform(): Promise<string> {
  try {
    // Detection logic
  } catch {
    // Ignore detection errors
  }
  return 'unknown';
}
```

**Rationale:** Git detection is optional; failures shouldn't stop deployment

---

## Performance Considerations

### Prompt Response Time

- **Project name prompt:** Instant
- **Linting prompt:** Instant
- **CI/CD prompt:** <100ms (Git detection I/O)
- **Confirmation prompt:** Instant

### Total Configuration Time

- **Interactive mode:** 30-60 seconds (user input time)
- **Non-interactive mode:** <10ms (immediate return)

---

## Related Documentation

- **Linting Tools Utility:** [linting-tools.md](linting-tools.md)
- **Deploy Command:** [deploy-command.md](deploy-command.md)
- **CI/CD Deployment:** [deploy-ci-cd.md](deploy-ci-cd.md)
- **Linting Deployment:** [deploy-linting.md](deploy-linting.md)

---

## Type Definitions

### DeployOptions (Input)

```typescript
interface DeployOptions {
  name?: string; // Pre-specified project name
  yes?: boolean; // Skip prompts (use defaults)
  dryRun?: boolean; // Simulate deployment
  force?: boolean; // Force redeployment
  skipAudit?: boolean; // Skip metrics collection
  ciDeploy?: boolean; // CI/CD mode
}
```

### DeployConfig (Output)

```typescript
interface DeployConfig {
  projectName: string;
  stack: Stack;
  metrics: CodebaseMetrics;
  lintingTools: LintingTool[];
  lintingDependencies: string[];
  lintingScripts: Record<string, string>;
  postInstallInstructions: PostInstallInstruction[];
  enableLinting: boolean;
  enableCICD: boolean;
  enableWorkOrders: boolean;
  enableInvestigations: boolean;
  enableDocs: boolean;
}
```

### Stack

```typescript
interface Stack {
  framework: string; // Detected framework
  language: string; // Detected language
  sourceDir: string; // Primary source directory
  sourceDirs: string[]; // All source directories
  packageManager?: string; // npm, yarn, pnpm, pip, cargo
}
```

---

**Last Updated:** 2026-01-21
**Trinity SDK Version:** 2.1.0
**Maintained By:** APO-2 (Documentation Specialist)
