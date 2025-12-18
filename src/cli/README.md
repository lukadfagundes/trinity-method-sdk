# CLI Module - Command-Line Interface

**Purpose:** Trinity Method SDK command-line interface implementation
**Location:** `src/cli/`
**Entry Point:** `index.ts`

## Overview

The `cli/` directory implements the complete command-line interface for the Trinity Method SDK. It provides an interactive, user-friendly deployment experience powered by Commander.js, with sophisticated technology detection, metrics collection, and template processing.

## Directory Structure

```
cli/
├── commands/              # CLI command implementations
│   ├── deploy.ts         # Main deployment orchestrator (924 lines)
│   └── update.ts         # Version update management (138 lines)
├── utils/                # CLI utility functions (8 files)
│   ├── detect-stack.ts              # Technology stack detection
│   ├── template-processor.ts        # Variable interpolation
│   ├── codebase-metrics.ts          # Code quality analysis
│   ├── linting-tools.ts             # Linting tool catalog
│   ├── deploy-linting.ts            # Linting deployment
│   ├── inject-dependencies.ts       # Package.json injection
│   ├── deploy-ci.ts                 # CI/CD template deployment
│   └── inject-readme.ts             # README generation
├── index.ts              # CLI entry point (40 lines)
└── types.ts              # CLI-specific type definitions (64 lines)
```

## Files Overview

### 1. `index.ts` - CLI Entry Point (40 lines)

**Purpose:** Define CLI commands and route to implementations

**Exports:**
- Commander.js program with two main commands

**Commands:**
```typescript
program
  .command('deploy')
  .description('Deploy Trinity Method to current project')
  .option('--name <name>', 'Project name (auto-detected if not specified)')
  .option('--yes', 'Skip confirmation prompts')
  .option('--dry-run', 'Preview changes without writing files')
  .option('--force', 'Overwrite existing Trinity deployment')
  .option('--skip-audit', 'Skip codebase metrics collection (faster, uses placeholders)')
  .option('--ci-deploy', 'Deploy CI/CD workflow templates for automated testing')
  .action(deploy);

program
  .command('update')
  .description('Update Trinity Method to latest version')
  .option('--all', 'Update all registered Trinity projects')
  .option('--dry-run', 'Preview changes without writing files')
  .action(update);
```

**Integration:**
- Reads version from `package.json`
- Displays version with `-v, --version`
- Parses command-line arguments

**Usage:**
```bash
# Display help
npx trinity --help

# Display version
npx trinity --version

# Run deploy command
npx trinity deploy

# Run deploy with options
npx trinity deploy --yes --skip-audit

# Run update command
npx trinity update --dry-run
```

---

### 2. `types.ts` - CLI Type Definitions (64 lines)

**Purpose:** Define interfaces for CLI command options and data structures

**Exports:**

#### `DeployOptions`
```typescript
export interface DeployOptions {
  name?: string;                          // Project name
  yes?: boolean;                          // Skip confirmations
  dryRun?: boolean;                       // Preview mode
  force?: boolean;                        // Overwrite existing
  skipAudit?: boolean;                    // Skip metrics
  ciDeploy?: boolean;                     // Deploy CI/CD
  lintingTools?: LintingTool[];           // Selected tools
  lintingDependencies?: string[];         // Dependencies to inject
  lintingScripts?: Record<string, string>; // Scripts to add
  postInstallInstructions?: PostInstallInstruction[]; // Setup steps
}
```

#### `UpdateOptions`
```typescript
export interface UpdateOptions {
  all?: boolean;      // Update all projects
  dryRun?: boolean;   // Preview mode
}
```

#### `LintingTool`
```typescript
export interface LintingTool {
  id: string;                      // "eslint", "prettier"
  name: string;                    // Display name
  file: string;                    // Config filename
  description?: string;            // User-facing description
  template?: string;               // Template filename
  framework?: string;              // Target framework
  language?: string;               // Target language
  recommended?: boolean;           // Auto-select flag
  dependencies?: string[];         // Package dependencies
  scripts?: Record<string, string>; // npm scripts
}
```

#### `PostInstallInstruction`
```typescript
export interface PostInstallInstruction {
  command: string;      // Command to run
  description?: string; // What it does
}
```

#### `Stack`
```typescript
export interface Stack {
  framework: string;      // "React", "Flutter", etc.
  language: string;       // "JavaScript/TypeScript", "Dart"
  sourceDir: string;      // Primary source directory
  sourceDirs: string[];   // All detected source directories
  packageManager?: string; // "npm", "yarn", "pnpm"
}
```

#### `CodebaseMetrics`
```typescript
export interface CodebaseMetrics {
  totalFiles: number;      // Total source files
  todoCount: number;       // TODO/FIXME/HACK count
  filesOver500: number;    // Large files
  dependencyCount: number; // Dependencies
  [key: string]: any;      // Extensible
}
```

#### `DeploymentStats`
```typescript
export interface DeploymentStats {
  agents: number;       // Agents deployed
  hooks: number;        // Hooks deployed
  templates: number;    // Templates deployed
  directories: number;  // Directories created
  files: number;        // Files created
}
```

**Usage:**
```typescript
import { DeployOptions, Stack } from '../types.js';

async function deploy(options: DeployOptions): Promise<void> {
  const stack: Stack = await detectStack(process.cwd());
  // ...
}
```

---

## Command Implementations (`commands/`)

### `commands/deploy.ts` (924 lines)

**Purpose:** Complete Trinity Method deployment orchestrator

**See:** [`src/cli/commands/README.md`](commands/README.md) for detailed documentation

**Key Responsibilities:**
- Pre-flight checks
- Technology stack detection
- Interactive configuration
- Codebase metrics collection
- Directory structure creation
- Knowledge base deployment
- Agent configuration deployment
- Optional systems (linting, CI/CD)
- Deployment reporting

---

### `commands/update.ts` (138 lines)

**Purpose:** Non-breaking Trinity Method version updates

**See:** [`src/cli/commands/README.md`](commands/README.md) for detailed documentation

**Key Responsibilities:**
- Version detection
- User content backup
- SDK file updates
- Content restoration
- Safe rollback support

---

## Utility Functions (`utils/`)

### Overview of All Utilities

| Utility | Lines | Purpose |
|---------|-------|---------|
| `detect-stack.ts` | 233 | Framework/language detection |
| `template-processor.ts` | 143 | Variable interpolation |
| `codebase-metrics.ts` | 457 | Code quality analysis |
| `linting-tools.ts` | 228 | Linting catalog |
| `deploy-linting.ts` | 165 | Linting config deployment |
| `inject-dependencies.ts` | 72 | Package.json modification |
| `deploy-ci.ts` | 128 | CI/CD workflow deployment |
| `inject-readme.ts` | 89 | README generation |

**See:** [`src/cli/utils/README.md`](utils/README.md) for detailed documentation of all utilities

---

## Architecture Patterns

### 1. Command Pattern

Each command is a separate module with a single exported function:

```typescript
// commands/deploy.ts
export async function deploy(options: DeployOptions): Promise<void> {
  // Implementation
}

// commands/update.ts
export async function update(options: UpdateOptions): Promise<void> {
  // Implementation
}
```

**Benefits:**
- Clear separation of concerns
- Easy to test individually
- Simple to add new commands

---

### 2. Utility Composition

Deploy command composes multiple utilities:

```typescript
import { detectStack } from '../utils/detect-stack.js';
import { collectCodebaseMetrics } from '../utils/codebase-metrics.js';
import { processTemplate } from '../utils/template-processor.js';
import { deployLintingTool } from '../utils/deploy-linting.js';

export async function deploy(options: DeployOptions): Promise<void> {
  const stack = await detectStack(process.cwd());
  const metrics = await collectCodebaseMetrics(stack.sourceDir, stack.framework);
  const processed = processTemplate(content, variables);
  await deployLintingTool(tool, stack, templatesPath, variables);
}
```

---

### 3. Progressive Enhancement

Start minimal, add complexity only when needed:

```typescript
// 1. Basic deployment (--yes)
if (options.yes) {
  // Use defaults, skip prompts
}

// 2. Interactive deployment
else {
  const answers = await inquirer.prompt([...]);
}

// 3. Optional features
if (ciChoice.setupCI) {
  options.ciDeploy = true;
}

if (selectedLintingTools.length > 0) {
  await deployLintingTools(...);
}
```

---

### 4. Error Boundary Pattern

Each phase is wrapped with error handling:

```typescript
try {
  spinner = ora('Phase description...').start();

  // Phase implementation

  spinner.succeed('Phase complete');
} catch (error: any) {
  spinner.fail('Phase failed');
  console.error(chalk.red(`Error: ${error.message}`));
  throw error;
}
```

---

## Integration with SDK

### Build System Integration

```json
// package.json
{
  "bin": {
    "trinity": "./dist/cli/index.js"
  },
  "type": "module"
}
```

The CLI is built by TypeScript compiler:

```bash
# Development
npm run build

# Production
npm run build:prod
```

Output structure:
```
dist/
└── cli/
    ├── index.js
    ├── types.js
    ├── commands/
    │   ├── deploy.js
    │   └── update.js
    └── utils/
        ├── detect-stack.js
        ├── template-processor.js
        ├── codebase-metrics.js
        └── ... (other utils)
```

---

### Template Integration

CLI accesses templates at runtime:

```typescript
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Templates are in SDK package
const templatesPath = path.join(__dirname, '../../templates');

// Read template
const templatePath = path.join(templatesPath, 'knowledge-base', 'ARCHITECTURE.md.template');
const content = await fs.readFile(templatePath, 'utf8');
```

Templates are copied to `dist/templates` during build.

---

### Type Integration

CLI types integrate with shared types:

```typescript
// cli/types.ts - CLI-specific
export interface DeployOptions { ... }

// shared/types/index.ts - SDK-wide
export interface InvestigationResult { ... }

// Usage in commands
import { DeployOptions } from '../types.js';
import { InvestigationResult } from '../../shared/types/index.js';
```

---

## Key Exports

### From `cli/index.ts`
```typescript
// No exports - executable entry point
// Invokes deploy() or update() based on command
```

### From `cli/types.ts`
```typescript
export interface DeployOptions { ... }
export interface UpdateOptions { ... }
export interface LintingTool { ... }
export interface PostInstallInstruction { ... }
export interface Stack { ... }
export interface CodebaseMetrics { ... }
export interface DeploymentStats { ... }
```

### From `cli/commands/deploy.ts`
```typescript
export async function deploy(options: DeployOptions): Promise<void>
```

### From `cli/commands/update.ts`
```typescript
export async function update(options: UpdateOptions): Promise<void>
```

---

## Usage Examples

### Basic Deployment

```bash
# Interactive deployment
npx trinity deploy

# Follow prompts:
# - Project name
# - Linting tools (recommended / custom / skip)
# - CI/CD deployment (yes / no)
# - Final confirmation
```

### Automated Deployment

```bash
# Non-interactive with defaults
npx trinity deploy --yes

# Skip metrics collection for faster deployment
npx trinity deploy --yes --skip-audit

# Force redeploy
npx trinity deploy --force

# Custom project name
npx trinity deploy --name "My Awesome Project"
```

### Update Existing Deployment

```bash
# Update current project
npx trinity update

# Preview changes without applying
npx trinity update --dry-run

# Update all registered projects (future)
npx trinity update --all
```

### Programmatic Usage

```typescript
import { deploy } from 'trinity-method-sdk/dist/cli/commands/deploy.js';
import { DeployOptions } from 'trinity-method-sdk/dist/cli/types.js';

const options: DeployOptions = {
  name: 'my-project',
  yes: true,
  dryRun: false,
  force: false,
  skipAudit: false,
  ciDeploy: true
};

await deploy(options);
```

---

## Design Principles

### 1. User Experience First

- **Interactive prompts** - Guide users through setup
- **Smart defaults** - Detect framework, recommend tools
- **Clear feedback** - Spinners, colors, progress indicators
- **Helpful errors** - Explain what went wrong and how to fix

### 2. Graceful Degradation

- **Optional features** - Linting, CI/CD, metrics are optional
- **Fallback values** - Use placeholders when metrics unavailable
- **Skip on error** - Continue deployment if optional phase fails

### 3. Idempotency

- **Safe redeployment** - Can run deploy multiple times
- **Backup user content** - Never lose user customizations
- **Skip existing** - Don't overwrite user files

### 4. Transparency

- **Dry-run mode** - Preview changes before applying
- **Deployment stats** - Show what was created
- **Clear logging** - Explain each phase

---

## Performance Considerations

### Parallel Operations

```typescript
// Deploy multiple templates concurrently
await Promise.all(
  templates.map(template => deployTemplate(template))
);
```

### Lazy Loading

```typescript
// Import utilities only when needed
if (options.ciDeploy) {
  const { deployCITemplates } = await import('../utils/deploy-ci.js');
  await deployCITemplates(options);
}
```

### Optional Metrics

```typescript
// Skip expensive analysis with --skip-audit
if (!options.skipAudit) {
  metrics = await collectCodebaseMetrics(stack.sourceDir, stack.framework);
} else {
  spinner.info('Using placeholder values');
}
```

---

## Testing Strategy

### Manual Testing

```bash
# Test basic deployment
cd /tmp/test-project && npm init -y
npx trinity-method-sdk deploy --yes

# Test framework detection
# Create React project
npx create-react-app test-react
cd test-react
npx trinity-method-sdk deploy --yes

# Test Python project
mkdir test-python && cd test-python
echo "flask" > requirements.txt
npx trinity-method-sdk deploy --yes
```

### Unit Testing (Future)

```typescript
import { deploy } from '../commands/deploy';
import { DeployOptions } from '../types';

describe('deploy command', () => {
  it('should create Trinity structure', async () => {
    const options: DeployOptions = { yes: true, dryRun: false };
    await deploy(options);
    expect(fs.existsSync('trinity/knowledge-base')).toBe(true);
  });
});
```

---

## Troubleshooting

### Common Issues

**Issue:** `Error: Trinity Method already deployed`

**Solution:**
```bash
npx trinity deploy --force
```

---

**Issue:** `Error: Technology stack not detected`

**Cause:** Missing framework indicator files

**Solution:**
- Node.js: Create `package.json`
- Flutter: Create `pubspec.yaml`
- Python: Create `requirements.txt`

---

**Issue:** Metrics collection takes too long

**Solution:**
```bash
npx trinity deploy --skip-audit
```

---

**Issue:** Linting config conflicts

**Cause:** Existing `.eslintrc.json` or `.prettierrc.json`

**Solution:**
- Review existing configs
- Choose "Skip" during linting setup
- Or backup and overwrite with `--force`

---

## Adding New Commands

### Step 1: Create command file

```typescript
// cli/commands/my-command.ts
import { MyCommandOptions } from '../types.js';

export async function myCommand(options: MyCommandOptions): Promise<void> {
  console.log('Executing my command...');
  // Implementation
}
```

### Step 2: Add types

```typescript
// cli/types.ts
export interface MyCommandOptions {
  flag?: boolean;
  value?: string;
}
```

### Step 3: Register command

```typescript
// cli/index.ts
import { myCommand } from './commands/my-command.js';

program
  .command('my-command')
  .description('Description of command')
  .option('--flag', 'Flag description')
  .option('--value <value>', 'Value description')
  .action(myCommand);
```

---

## Security Considerations

### Input Validation

All user inputs are validated:

```typescript
if (!projectName || projectName.trim() === '') {
  throw new Error('Project name cannot be empty');
}
```

### Path Traversal Prevention

Normalize and validate paths:

```typescript
const safePath = path.normalize(userPath).replace(/^(\.\.[/\\])+/, '');
```

### Dependency Version Pinning

Dependencies are pinned to specific versions:

```typescript
dependencies: ['eslint@^8.50.0', 'prettier@^3.0.0']
```

### No Arbitrary Code Execution

Only file system operations, no `eval()` or code generation.

---

## Related Documentation

- **Commands:** [`src/cli/commands/README.md`](commands/README.md)
- **Utilities:** [`src/cli/utils/README.md`](utils/README.md)
- **Main SDK:** [`../README.md`](../README.md)
- **Deployment Guide:** `../../docs/workflows/deploy-workflow.md`

---

**Last Updated:** 2025-12-18
**Maintainer:** Trinity Method SDK Team
