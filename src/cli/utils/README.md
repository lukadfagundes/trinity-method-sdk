# CLI Utilities Module

This module contains 8 utility files that power the Trinity Method SDK deployment and update commands. Each utility handles a specific aspect of the deployment pipeline, from stack detection to CI/CD template generation.

## Overview

The utilities module provides:
- Technology stack detection
- Template processing with variable substitution
- Codebase metrics collection
- Linting tool configuration
- Linting deployment automation
- Dependency injection
- CI/CD template deployment
- README injection (planned)

## Files

### 1. detect-stack.ts (233 lines)

Intelligent technology stack detection across multiple frameworks and languages.

#### Purpose
Automatically detects project framework, language, source directories, and package manager to enable framework-specific Trinity deployments.

#### Exports

```typescript
export async function detectStack(targetDir: string = process.cwd()): Promise<Stack>;
```

#### Stack Interface

```typescript
interface Stack {
  framework: string;     // 'React', 'Node.js', 'Flutter', 'Python', 'Rust', 'Generic'
  language: string;      // 'JavaScript/TypeScript', 'Dart', 'Python', 'Rust', 'Go'
  sourceDir: string;     // Primary source directory (backward compatibility)
  sourceDirs: string[];  // All detected source directories
  packageManager?: string; // 'npm', 'yarn', 'pnpm', 'pub', 'pip', 'cargo'
}
```

#### Features

1. **Framework Detection**
   - **Node.js/JavaScript**: Detects React, Vue, Angular, Next.js, Express
   - **Flutter**: Identifies via `pubspec.yaml`
   - **Python**: Detects Flask via `requirements.txt`
   - **Rust**: Identifies via `Cargo.toml`
   - **Go**: Identifies via `go.mod`

2. **Source Directory Discovery**
   - Scans for common directories: `src/`, `lib/`, `app/`, `backend/`, `frontend/`
   - Supports nested patterns: `backend/src`, `frontend/lib`, `src/backend/src`
   - Handles monorepo structures: `apps/web`, `apps/api`
   - Up to 3-level nesting: `frontend/app/lib`

3. **Package Manager Detection**
   - npm: `package-lock.json`
   - yarn: `yarn.lock`
   - pnpm: `pnpm-lock.yaml`
   - pub: `pubspec.yaml`
   - pip: `requirements.txt`
   - cargo: `Cargo.toml`

#### Usage Examples

```typescript
// Basic stack detection
const stack = await detectStack();
console.log(stack.framework);  // 'React'
console.log(stack.language);   // 'JavaScript/TypeScript'
console.log(stack.sourceDir);  // 'src'
console.log(stack.sourceDirs); // ['src', 'backend/src', 'frontend/src']

// Custom target directory
const stack = await detectStack('/path/to/project');

// Monorepo detection
const stack = await detectStack();
// sourceDirs: ['apps/web', 'apps/api', 'packages/shared']
```

#### Source Directory Patterns

```typescript
// Common top-level directories
const COMMON_SOURCE_DIRS = [
  'src', 'lib', 'app', 'backend', 'frontend',
  'server', 'client', 'database', 'packages', 'apps'
];

// 2-level nesting patterns
['backend', 'src']        // backend/src
['frontend', 'lib']       // frontend/lib
['src', 'backend']        // src/backend

// 3-level nesting patterns
['backend', 'app', 'lib'] // backend/app/lib
['frontend', 'app', 'src'] // frontend/app/src
```

#### Integration Points

- Used by `deploy.ts` to determine deployment strategy
- Affects CLAUDE.md template selection
- Determines linting tool recommendations
- Influences directory structure creation

---

### 2. template-processor.ts (143 lines)

Template variable substitution engine for all Trinity templates.

#### Purpose
Processes template files by replacing placeholder variables with actual project values.

#### Exports

```typescript
export function processTemplate(content: string, variables: Record<string, any>): string;
export function extractVariables(stack: Stack, projectName: string): Record<string, string>;
export function formatMetrics(metrics?: CodebaseMetrics): Record<string, any>;
```

#### Features

1. **Variable Replacement**
   - Uses `{{VARIABLE_NAME}}` syntax
   - Supports nested variable objects
   - Provides fallback values for missing variables

2. **Standard Variables**
   ```typescript
   {
     PROJECT_NAME: 'My Project',
     TECH_STACK: 'JavaScript/TypeScript',
     FRAMEWORK: 'React',
     SOURCE_DIR: 'src',
     DEPLOYMENT_TIMESTAMP: '2024-01-15T10:30:00.000Z',
     LANGUAGE: 'JavaScript/TypeScript',
     PACKAGE_MANAGER: 'npm',
     TRINITY_VERSION: '2.0.0',
     CURRENT_DATE: '2024-01-15',
     PROJECT_VAR_NAME: 'myproject',
     TRINITY_HOME: 'C:/Users/.../trinity-method'
   }
   ```

3. **Metrics Variables**
   - Code quality metrics: `TODO_COUNT`, `FIXME_COUNT`, `HACK_COUNT`
   - File complexity: `TOTAL_FILES`, `FILES_500`, `FILES_1000`, `FILES_3000`
   - Dependencies: `DEPENDENCY_COUNT`, `DEV_DEPENDENCY_COUNT`
   - Git metrics: `COMMIT_COUNT`, `CONTRIBUTOR_COUNT`, `LAST_COMMIT`
   - Placeholder support for agent-only metrics

#### Usage Examples

```typescript
// Basic template processing
const template = 'Project: {{PROJECT_NAME}}, Framework: {{FRAMEWORK}}';
const variables = {
  PROJECT_NAME: 'My App',
  FRAMEWORK: 'React'
};
const result = processTemplate(template, variables);
// Result: 'Project: My App, Framework: React'

// Extract variables from stack
const variables = extractVariables(stack, 'My Project');
// Returns: { projectName, techStack, framework, sourceDir, ... }

// Format metrics with placeholders (no audit)
const metrics = formatMetrics();
// Returns: { TODO_COUNT: '{{TODO_COUNT}}', TOTAL_FILES: '{{TOTAL_FILES}}', ... }

// Format actual metrics
const metrics = formatMetrics({
  totalFiles: 150,
  todoCount: 12,
  filesOver500: 3,
  dependencyCount: 45
});
// Returns: { TODO_COUNT: 12, TOTAL_FILES: 150, FILES_500: 3, ... }
```

#### Placeholder System

When `--skip-audit` is used or metrics unavailable:
```typescript
{
  TODO_COUNT: '{{TODO_COUNT}}',        // Agents fill these later
  TOTAL_FILES: '{{TOTAL_FILES}}',
  OVERALL_COVERAGE: '{{OVERALL_COVERAGE}}',
  COMPONENT_1: '{{COMPONENT_1}}',
  DATABASE_TYPE: '{{DATABASE_TYPE}}'
}
```

#### Integration Points

- Used by all template deployments in `deploy.ts`
- Powers knowledge base enrichment
- Enables framework-specific CLAUDE.md generation

---

### 3. codebase-metrics.ts (457 lines)

Cross-platform codebase analysis without semantic understanding.

#### Purpose
Collects scriptable metrics from codebases (Node.js, Flutter, React, Python, Rust) for knowledge base enrichment.

#### Exports

```typescript
export async function collectCodebaseMetrics(
  sourceDir: string,
  framework: string
): Promise<CodebaseMetrics>;

export async function countPattern(dir: string, pattern: RegExp): Promise<number>;
export async function analyzeFileComplexity(dir: string): Promise<FileComplexityMetrics>;
export async function parseDependencies(framework: string): Promise<DependencyMetrics>;
export async function detectFrameworkVersion(framework: string): Promise<string>;
export async function detectPackageManager(): Promise<string>;
```

#### Features

1. **Code Quality Metrics** (Scriptable)
   - TODO/FIXME/HACK comment detection
   - Console.log statement counting
   - Commented code block estimation (3+ consecutive comment lines)

2. **File Complexity Metrics** (Scriptable)
   - Total file count
   - Files >500 lines
   - Files >1000 lines
   - Files >3000 lines
   - Average file length
   - Top 10 largest files

3. **Dependency Metrics** (Scriptable)
   - Production dependencies
   - Dev dependencies
   - Framework-specific parsing:
     - **Node.js**: `package.json`
     - **Flutter**: `pubspec.yaml`
     - **Python**: `requirements.txt`
     - **Rust**: `Cargo.toml`

4. **Git Metrics** (Scriptable)
   - Total commit count
   - Contributor count
   - Last commit date

#### Usage Examples

```typescript
// Collect all metrics
const metrics = await collectCodebaseMetrics('src', 'React');
console.log(metrics.totalFiles);        // 150
console.log(metrics.todoCount);         // 12
console.log(metrics.filesOver500);      // 3
console.log(metrics.dependencyCount);   // 45

// Count specific patterns
const todoCount = await countPattern('src', /\/\/\s*TODO/gi);
const fixmeCount = await countPattern('src', /\/\/\s*FIXME/gi);

// Analyze file complexity
const complexity = await analyzeFileComplexity('src');
console.log(complexity.totalFiles);     // 150
console.log(complexity.avgFileLength);  // 287
console.log(complexity.largestFiles);   // [{ file: 'App.tsx', lines: 1250 }, ...]

// Parse dependencies
const deps = await parseDependencies('React');
console.log(deps.dependencies);         // { react: '18.2.0', ... }
console.log(deps.dependencyCount);      // 12

// Detect versions
const version = await detectFrameworkVersion('React');
console.log(version);                   // '18.2.0'

const pkgManager = await detectPackageManager();
console.log(pkgManager);                // 'npm'
```

#### Metrics Interface

```typescript
interface CodebaseMetrics {
  // Code Quality
  todoCount: number;
  todoComments: number;
  fixmeComments: number;
  hackComments: number;
  consoleStatements: number;
  commentedCodeBlocks: number;

  // File Complexity
  totalFiles: number;
  filesOver500: number;
  filesOver1000: number;
  filesOver3000: number;
  avgFileLength: number;
  largestFiles: Array<{ file: string; lines: number }>;

  // Dependencies
  dependencies: Record<string, string>;
  dependencyCount: number;
  devDependencies: Record<string, string>;
  devDependencyCount: number;

  // Git Metrics
  commitCount: number;
  contributors: number;
  lastCommitDate: string;

  // Framework Info
  frameworkVersion: string;
  packageManager: string;
}
```

#### File Pattern Detection

```typescript
// Supported file extensions
const extensions = '*.{js,jsx,ts,tsx,dart,py,rs}';

// Ignored directories
const ignore = [
  '**/node_modules/**',
  '**/build/**',
  '**/.dart_tool/**',
  '**/dist/**',
  '**/__pycache__/**'
];
```

#### Integration Points

- Used by `deploy.ts` Phase 3.5 (Codebase Metrics Collection)
- Populates `ARCHITECTURE.md` template
- Enriches knowledge base with actual data
- Skippable with `--skip-audit` flag

---

### 4. linting-tools.ts (228 lines)

Framework-specific linting tool configuration database.

#### Purpose
Provides recommended linting tools and configurations for each supported framework.

#### Exports

```typescript
export function getToolsForFramework(framework: string, language: string): LintingTool[];
export function getRecommendedTools(framework: string, language: string): LintingTool[];
export function getDependenciesForTools(selectedTools: LintingTool[]): string[];
export function getScriptsForTools(selectedTools: LintingTool[]): Record<string, string>;
export function getPostInstallInstructions(
  selectedTools: LintingTool[],
  framework: string
): PostInstallInstruction[];
```

#### Linting Tool Interface

```typescript
interface LintingTool {
  id: string;              // 'eslint', 'prettier', 'black', etc.
  name: string;            // Display name
  file: string;            // Config file name
  description?: string;    // Tool description
  recommended?: boolean;   // Auto-select in recommended mode
  dependencies?: string[]; // npm/pip packages
  scripts?: Record<string, string>; // package.json scripts
}
```

#### Supported Frameworks

1. **Node.js/React**
   ```typescript
   {
     eslint: {
       file: '.eslintrc.json',
       dependencies: ['eslint@^8.50.0'],
       scripts: { lint: 'eslint .', 'lint:fix': 'eslint . --fix' }
     },
     prettier: {
       file: '.prettierrc.json',
       dependencies: ['prettier@^3.0.0'],
       scripts: { format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"' }
     },
     precommit: {
       file: '.pre-commit-config.yaml',
       dependencies: []
     },
     'typescript-eslint': {
       file: 'extends typescript in .eslintrc.json',
       dependencies: [
         '@typescript-eslint/parser@^6.7.0',
         '@typescript-eslint/eslint-plugin@^6.7.0'
       ]
     }
   }
   ```

2. **Python**
   ```typescript
   {
     black: {
       file: 'pyproject.toml',
       dependencies: ['black>=23.0.0']
     },
     flake8: {
       file: '.flake8',
       dependencies: ['flake8>=6.0.0']
     },
     isort: {
       file: 'pyproject.toml',
       dependencies: ['isort>=5.12.0']
     },
     precommit: {
       file: '.pre-commit-config.yaml',
       dependencies: ['pre-commit>=3.3.0']
     }
   }
   ```

3. **Flutter**
   ```typescript
   {
     dartanalyzer: {
       file: 'analysis_options.yaml',
       dependencies: [] // Built into Dart SDK
     },
     precommit: {
       file: '.pre-commit-config.yaml',
       dependencies: []
     }
   }
   ```

4. **Rust**
   ```typescript
   {
     clippy: {
       file: 'clippy.toml',
       dependencies: [] // Built into Rust toolchain
     },
     rustfmt: {
       file: 'rustfmt.toml',
       dependencies: [] // Built into Rust toolchain
     },
     precommit: {
       file: '.pre-commit-config.yaml',
       dependencies: []
     }
   }
   ```

#### Usage Examples

```typescript
// Get all tools for React
const tools = getToolsForFramework('React', 'TypeScript');
// Returns: [eslint, prettier, precommit, typescript-eslint]

// Get recommended tools only
const recommended = getRecommendedTools('React', 'TypeScript');
// Returns: [eslint, prettier, precommit] (typescript-eslint not recommended by default)

// Extract dependencies
const dependencies = getDependenciesForTools([eslint, prettier]);
// Returns: ['eslint@^8.50.0', 'prettier@^3.0.0']

// Extract npm scripts
const scripts = getScriptsForTools([eslint, prettier]);
// Returns: {
//   lint: 'eslint .',
//   'lint:fix': 'eslint . --fix',
//   format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"'
// }

// Get post-install instructions
const instructions = getPostInstallInstructions([precommit], 'React');
// Returns: [{ command: 'npx husky install', description: 'Setup pre-commit hooks' }]
```

#### Integration Points

- Used by `deploy.ts` Phase 3 (Configuration Prompts)
- Powers interactive linting tool selection
- Drives dependency injection in Phase 9.8

---

### 5. deploy-linting.ts (165 lines)

Automated linting tool deployment with framework-specific templates.

#### Purpose
Deploys linting configuration files from templates based on selected tools and framework.

#### Exports

```typescript
export async function deployLintingTool(
  tool: LintingTool,
  stack: Stack,
  templatesPath: string,
  variables: Record<string, any>
): Promise<void>;
```

#### Features

1. **Framework-Specific Deployment**
   - Maps frameworks to template directories:
     ```typescript
     {
       'Node.js': 'nodejs',
       'React': 'nodejs',
       'Next.js': 'nodejs',
       'Python': 'python',
       'Flutter': 'flutter',
       'Rust': 'rust'
     }
     ```

2. **Tool-Specific Deployment Logic**
   - **ESLint**: Selects TypeScript/ESM/CommonJS template variant
   - **Prettier**: Standard template deployment
   - **Pre-commit**: Framework-agnostic deployment
   - **TypeScript ESLint**: Modifies existing `.eslintrc.json`
   - **Python tools**: Combines into `pyproject.toml` or separate `.flake8`
   - **Dart Analyzer**: Deploys `analysis_options.yaml`
   - **Rust tools**: Deploys `clippy.toml` and `rustfmt.toml`

#### Usage Examples

```typescript
// Deploy ESLint for TypeScript
await deployLintingTool(
  { id: 'eslint', name: 'ESLint', file: '.eslintrc.json' },
  { framework: 'React', language: 'TypeScript', sourceDir: 'src', sourceDirs: ['src'] },
  'src/templates',
  { PROJECT_NAME: 'My App' }
);
// Creates: .eslintrc.json (from .eslintrc-typescript.json.template)

// Deploy Prettier
await deployLintingTool(
  { id: 'prettier', name: 'Prettier', file: '.prettierrc.json' },
  stack,
  'src/templates',
  variables
);
// Creates: .prettierrc.json

// Deploy Python Black
await deployLintingTool(
  { id: 'black', name: 'Black', file: 'pyproject.toml' },
  { framework: 'Python', language: 'Python', sourceDir: 'app', sourceDirs: ['app'] },
  'src/templates',
  variables
);
// Creates: pyproject.toml
```

#### ESLint Template Selection

```typescript
let templateFile: string;

if (stack.language === 'TypeScript') {
  templateFile = '.eslintrc-typescript.json.template';
} else if (stack.moduleType === 'esm') {
  templateFile = '.eslintrc-esm.json.template';
} else {
  templateFile = '.eslintrc-commonjs.json.template';
}
```

#### TypeScript ESLint Enhancement

```typescript
// Modifies existing .eslintrc.json instead of replacing
const config = await fs.readJson('.eslintrc.json');
config.extends = config.extends || [];
if (!config.extends.includes('plugin:@typescript-eslint/recommended')) {
  config.extends.push('plugin:@typescript-eslint/recommended');
}
config.parser = '@typescript-eslint/parser';
config.plugins = config.plugins || [];
if (!config.plugins.includes('@typescript-eslint')) {
  config.plugins.push('@typescript-eslint');
}
await fs.writeJson('.eslintrc.json', config, { spaces: 2 });
```

#### Integration Points

- Used by `deploy.ts` Phase 9.7 (Linting Configuration)
- Processes templates from `src/templates/linting/`
- Applies template variables via `template-processor.ts`

---

### 6. inject-dependencies.ts (72 lines)

Safe dependency and script injection into project configuration files.

#### Purpose
Injects linting dependencies and npm scripts into `package.json` (Node.js) or `requirements-dev.txt` (Python).

#### Exports

```typescript
export async function injectLintingDependencies(
  dependencies: string[],
  scripts: Record<string, string>,
  framework: string
): Promise<void>;
```

#### Features

1. **Node.js Dependency Injection**
   - Parses scoped packages correctly: `@typescript-eslint/parser@^6.7.0`
   - Adds to `devDependencies` section
   - Preserves existing dependencies
   - Adds npm scripts (doesn't overwrite existing)

2. **Python Dependency Injection**
   - Creates or appends to `requirements-dev.txt`
   - Avoids duplicates
   - Preserves existing content

3. **Rust/Flutter**
   - No injection needed (built-in tools)

#### Usage Examples

```typescript
// Inject Node.js dependencies
await injectLintingDependencies(
  [
    'eslint@^8.50.0',
    'prettier@^3.0.0',
    '@typescript-eslint/parser@^6.7.0'
  ],
  {
    lint: 'eslint .',
    format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"'
  },
  'React'
);

// Before package.json:
{
  "dependencies": { "react": "^18.0.0" },
  "scripts": { "start": "react-scripts start" }
}

// After package.json:
{
  "dependencies": { "react": "^18.0.0" },
  "devDependencies": {
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "@typescript-eslint/parser": "^6.7.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "lint": "eslint .",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\""
  }
}

// Inject Python dependencies
await injectLintingDependencies(
  ['black>=23.0.0', 'flake8>=6.0.0'],
  {},
  'Python'
);

// Creates requirements-dev.txt:
black>=23.0.0
flake8>=6.0.0
```

#### Scoped Package Parsing

```typescript
// Handles scoped packages like @typescript-eslint/parser@^6.7.0
const lastAtIndex = dep.lastIndexOf('@');
const name = dep.substring(0, lastAtIndex);      // '@typescript-eslint/parser'
const version = dep.substring(lastAtIndex + 1);  // '^6.7.0'
```

#### Integration Points

- Used by `deploy.ts` Phase 9.8 (Dependency Injection)
- Called after linting tool selection
- Ensures dependencies are ready for `npm install`

---

### 7. deploy-ci.ts (128 lines)

Git platform detection and CI/CD workflow template deployment.

#### Purpose
Detects Git platform (GitHub, GitLab) and deploys appropriate CI/CD workflow templates.

#### Exports

```typescript
export async function deployCITemplates(options: CIDeployOptions = {}): Promise<CIDeploymentStats>;
```

#### Interfaces

```typescript
interface CIDeployOptions {
  yes?: boolean;   // Skip confirmation
  force?: boolean; // Overwrite existing workflows
}

interface CIDeploymentStats {
  deployed: string[];   // Successfully deployed files
  skipped: string[];    // Skipped files (already exist, no force)
  errors: Array<{ file?: string; error?: string; general?: string }>;
}

type GitPlatform = 'github' | 'gitlab' | 'unknown';
```

#### Features

1. **Git Platform Detection**
   - Reads `.git/config` for remote origin
   - Detects GitHub (github.com)
   - Detects GitLab (gitlab.com or gitlab)
   - Defaults to 'unknown' if not detected

2. **Platform-Specific Deployment**
   - **GitHub**: `.github/workflows/trinity-ci.yml`
   - **GitLab**: `.gitlab-ci.yml`
   - **All platforms**: `trinity/templates/ci/generic-ci.yml` (reference)

3. **Conflict Handling**
   - Checks for existing workflows
   - Respects `--force` flag
   - Reports skipped files

#### Usage Examples

```typescript
// Deploy CI templates
const stats = await deployCITemplates({ yes: true });

console.log(stats.deployed);
// ['github/workflows/trinity-ci.yml', 'trinity/templates/ci/generic-ci.yml']

console.log(stats.skipped);
// ['.gitlab-ci.yml (already exists)']

console.log(stats.errors);
// []

// Force deployment (overwrite existing)
const stats = await deployCITemplates({ force: true });

// Detect platform manually
const platform = await detectGitPlatform();
// Returns: 'github' | 'gitlab' | 'unknown'
```

#### Deployment Logic

```typescript
// GitHub Actions (always deploy for github or unknown)
if (platform === 'github' || platform === 'unknown') {
  await fs.ensureDir('.github/workflows');
  await fs.writeFile('.github/workflows/trinity-ci.yml', content);
  stats.deployed.push('.github/workflows/trinity-ci.yml');
}

// GitLab CI (only deploy for gitlab)
if (platform === 'gitlab') {
  const gitlabCIExists = await fs.pathExists('.gitlab-ci.yml');
  if (gitlabCIExists && !options.force) {
    stats.skipped.push('.gitlab-ci.yml (already exists)');
  } else {
    await fs.writeFile('.gitlab-ci.yml', content);
    stats.deployed.push('.gitlab-ci.yml');
  }
}

// Generic template (always deploy)
await fs.ensureDir('trinity/templates/ci');
await fs.writeFile('trinity/templates/ci/generic-ci.yml', content);
stats.deployed.push('trinity/templates/ci/generic-ci.yml');
```

#### Integration Points

- Used by `deploy.ts` Phase 11 (CI/CD Templates)
- Templates located in `src/templates/ci/`
- Triggered by `--ci-deploy` flag or user prompt

---

### 8. inject-readme.ts (156 lines)

Trinity Method section injection into project README (planned feature).

#### Purpose
Injects comprehensive Trinity Method documentation section into existing project README.md files.

#### Exports

```typescript
export async function injectTrinityMethodSection(
  variables: Record<string, any>
): Promise<ReadmeInjectResult>;
```

#### Interfaces

```typescript
interface ReadmeInjectResult {
  success: boolean;
  message: string;
  injected?: boolean;   // True if section was added
  skipped?: boolean;    // True if section already exists
  created?: boolean;    // True if README was created
  error?: Error;
}
```

#### Features

1. **Safe Injection**
   - Checks if README.md exists
   - Detects existing Trinity section
   - Appends only if not present
   - Never overwrites existing content

2. **Comprehensive Documentation**
   - Agent directory with commands
   - Documentation file locations
   - Session management workflow
   - Project info summary
   - Getting started guide

#### Usage Examples

```typescript
// Inject Trinity section
const result = await injectTrinityMethodSection({
  PROJECT_NAME: 'My App',
  FRAMEWORK: 'React',
  TRINITY_VERSION: '2.0.0'
});

if (result.injected) {
  console.log('Trinity section added to README.md');
} else if (result.skipped) {
  console.log('Trinity section already exists');
} else {
  console.error('Failed:', result.message);
}
```

#### Generated Section

```markdown
## 🔱 Trinity Method

This project uses the **Trinity Method** - an investigation-first development methodology powered by AI agents.

### Quick Commands

#### Leadership Team
- **Aly (CTO)** - Strategic planning and work order creation
  ```bash
  /trinity-aly
  ```
- **AJ (Implementation Lead)** - Code execution and implementation
  ```bash
  /trinity-aj
  ```

[... continues with all agents, documentation, and getting started ...]

---

*Deployed with Trinity Method SDK v2.0.0*
```

#### Integration Points

- Planned integration with `deploy.ts` (not yet active)
- Would inject during Phase 6 (Root Files Deployment)
- Optional feature controlled by deployment options

---

## Utility Integration Flow

```
deploy.ts
    ↓
detect-stack.ts → Detects framework, language, source dirs
    ↓
template-processor.ts → Prepares variable substitution
    ↓
codebase-metrics.ts → Collects project metrics (unless --skip-audit)
    ↓
linting-tools.ts → Gets recommended tools for framework
    ↓
User selects linting tools (or uses recommended)
    ↓
deploy-linting.ts → Deploys selected linting configs
    ↓
inject-dependencies.ts → Adds dependencies to package.json
    ↓
deploy-ci.ts → Deploys CI/CD workflows (if requested)
    ↓
(inject-readme.ts) → Injects Trinity section (planned)
```

---

## Common Patterns

### File System Operations

All utilities use `fs-extra` for enhanced file system operations:

```typescript
import fs from 'fs-extra';

// Check existence
const exists = await fs.pathExists(path);

// Read file
const content = await fs.readFile(path, 'utf8');

// Write file
await fs.writeFile(path, content);

// Copy file/directory
await fs.copy(source, dest, { overwrite: true });

// Ensure directory exists
await fs.ensureDir(path);

// Read JSON
const json = await fs.readJson(path);

// Write JSON
await fs.writeJson(path, data, { spaces: 2 });
```

### Error Handling

Utilities implement graceful error handling:

```typescript
try {
  // Operation
  const result = await someOperation();
  return result;
} catch (error: any) {
  console.error(`Error: ${error.message}`);
  // Return safe fallback
  return defaultValue;
}
```

### Cross-Platform Compatibility

```typescript
// Use path.join for all paths
const filePath = path.join(dir, 'file.txt');

// Use forward slashes in glob patterns
const files = globSync(`${dir}/**/*.{js,ts}`);

// Handle both Windows and Unix paths
const normalized = path.normalize(filePath);
```

---

## Testing Utilities

Each utility can be tested independently:

```typescript
// Test stack detection
import { detectStack } from './detect-stack.js';
const stack = await detectStack('test-project');
console.log(stack);

// Test template processing
import { processTemplate } from './template-processor.js';
const result = processTemplate('Hello {{NAME}}', { NAME: 'World' });
console.log(result); // 'Hello World'

// Test codebase metrics
import { collectCodebaseMetrics } from './codebase-metrics.js';
const metrics = await collectCodebaseMetrics('src', 'React');
console.log(metrics.totalFiles, metrics.todoCount);

// Test linting tools
import { getRecommendedTools } from './linting-tools.js';
const tools = getRecommendedTools('React', 'TypeScript');
console.log(tools.map(t => t.name));
```

---

## Performance Considerations

1. **Codebase Metrics Collection**
   - Can be slow on large codebases (>1000 files)
   - Use `--skip-audit` to skip metrics collection
   - Agents can complete metrics later

2. **Template Processing**
   - Lightweight string replacement
   - No performance concerns

3. **Stack Detection**
   - Fast directory scanning
   - Minimal file system operations

4. **Dependency Injection**
   - JSON parsing overhead minimal
   - File writes are atomic

---

## Troubleshooting

### Stack Detection Issues

**Problem**: Source directories not detected
```typescript
// Solution: Add to COMMON_SOURCE_DIRS or NESTED_PATTERNS
const COMMON_SOURCE_DIRS = ['your-custom-dir', ...];
```

**Problem**: Wrong framework detected
```typescript
// Solution: Check package.json dependencies
// Framework detection priority: React > Vue > Angular > Next.js > Express
```

### Template Processing Issues

**Problem**: Variables not replaced
```typescript
// Solution: Ensure variable names match exactly (case-sensitive)
{{PROJECT_NAME}} ≠ {{project_name}}
```

**Problem**: Missing fallback values
```typescript
// Solution: Check placeholders object in template-processor.ts
```

### Metrics Collection Issues

**Problem**: Metrics collection fails
```typescript
// Solution: Check file permissions, use --skip-audit
```

**Problem**: Wrong file count
```typescript
// Solution: Check ignore patterns in globSync
const ignore = ['**/node_modules/**', '**/build/**', ...];
```

---

## Related Documentation

- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\cli\commands\README.md](../commands/README.md) - CLI commands
- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\shared\types\README.md](../../shared/types/README.md) - Type definitions
- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\templates\README.md](../../templates/README.md) - Template system
