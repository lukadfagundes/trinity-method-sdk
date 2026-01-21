# Deploy Command - Main Orchestration

**Module:** `src/cli/commands/deploy/index.ts`
**Purpose:** Main deployment workflow orchestration for Trinity Method SDK
**Trinity Principle:** Systematic Quality Assurance

---

## Overview

The Deploy Command is the primary entry point for installing the Trinity Method SDK into a target project. It orchestrates a 12-step deployment process that creates directory structures, deploys agent templates, configures quality tools, and sets up CI/CD templates.

**Why This Exists:**
Manual setup is error-prone and inconsistent. Developers forget folders, skip quality tools, or misconfigure agents. This command orchestrates multiple specialized agents (TAN for structure, ZEN for documentation, INO for context, EIN for CI/CD) to deploy battle-tested Trinity infrastructure in minutes. Every project gets the same high-quality foundation: 19 agents, 20 commands, quality gates, and documentation architecture.

---

## Main Function

### `deploy(options: DeployOptions): Promise<void>`

Deploys the complete Trinity Method SDK infrastructure to a target project.

**Parameters:**

| Parameter                         | Type                       | Required | Description                               |
| --------------------------------- | -------------------------- | -------- | ----------------------------------------- |
| `options`                         | `DeployOptions`            | Yes      | Deployment configuration options          |
| `options.name`                    | `string`                   | No       | Project name override                     |
| `options.yes`                     | `boolean`                  | No       | Skip interactive prompts (use defaults)   |
| `options.dryRun`                  | `boolean`                  | No       | Simulate deployment without writing files |
| `options.force`                   | `boolean`                  | No       | Force redeployment even if Trinity exists |
| `options.skipAudit`               | `boolean`                  | No       | Skip codebase metrics collection          |
| `options.ciDeploy`                | `boolean`                  | No       | CI/CD automated deployment mode           |
| `options.lintingTools`            | `LintingTool[]`            | No       | Pre-selected linting tools                |
| `options.lintingDependencies`     | `string[]`                 | No       | Linting dependencies to install           |
| `options.lintingScripts`          | `Record<string, string>`   | No       | package.json scripts for linting          |
| `options.postInstallInstructions` | `PostInstallInstruction[]` | No       | Commands to run after deployment          |

**Returns:** `Promise<void>` - Resolves when deployment completes successfully

**Throws:**

- Error when deployment fails (network issues, file system errors, validation failures)
- Error when pre-flight checks fail (Node.js version too old, existing deployment without --force)
- Error when user cancels deployment during interactive prompts

---

## Deployment Workflow

The deploy command executes a 12-step orchestrated workflow:

### Step 1: Pre-flight Checks

**Function:** `checkPreFlight(options, spinner)`
**Purpose:** Validate environment before deployment
**Checks:**

- Node.js version compatibility (v14+)
- Existing Trinity deployment detection
- Target directory validity

### Step 2: Technology Stack Detection

**Function:** `detectStack()`
**Purpose:** Auto-detect project framework and language
**Detects:** Node.js, Python, Rust, Flutter, Go
**Output:** Stack object with framework, language, sourceDir, packageManager

### Step 3: Interactive Configuration

**Function:** `promptConfiguration(options, stack)`
**Purpose:** Collect user preferences for deployment
**Prompts for:**

- Project name
- Linting tools (ESLint, Prettier, TypeScript, etc.)
- CI/CD platform (GitHub Actions, GitLab CI, CircleCI, etc.)
- Optional features (work orders, investigations, documentation templates)

**Skipped when:** `--yes` flag is used (defaults applied)

### Step 3.5: Codebase Metrics Collection

**Function:** `collectMetrics(stack, spinner)`
**Purpose:** Collect baseline codebase metrics for ARCHITECTURE.md
**Metrics collected:**

- Code quality: TODO/FIXME comments, console statements, commented code
- File complexity: Total files, files over 500/1000/3000 lines, largest files
- Dependencies: Production and dev dependencies count
- Git history: Commit count, contributors, last commit date

**Skipped when:** `--skipAudit` flag is used (empty metrics created)

### Step 4: Directory Structure Creation

**Function:** `createDirectories(spinner)`
**Purpose:** Create 14 Trinity directories
**Creates:**

```
.claude/
  agents/
  commands/
trinity/
  investigations/
  knowledge-base/
  patterns/
  reports/
  sessions/
  templates/
    documentation/
    investigation/
    work-order/
  work-orders/
docs/
```

### Step 5: Knowledge Base Deployment

**Function:** `deployKnowledgeBase(templatesPath, variables, stack, metrics, spinner)`
**Purpose:** Deploy knowledge base templates with project-specific context
**Deploys:**

- `trinity/knowledge-base/ARCHITECTURE.md` (with metrics baseline)
- `trinity/knowledge-base/To-do.md`
- `trinity/knowledge-base/ISSUES.md`
- `trinity/knowledge-base/Technical-Debt.md`
- `trinity/knowledge-base/Trinity.md`
- `trinity/knowledge-base/TESTING-PRINCIPLES.md`
- `trinity/knowledge-base/CODING-PRINCIPLES.md`
- `trinity/knowledge-base/DOCUMENTATION-CRITERIA.md`

### Step 6: Root Files Deployment

**Function:** `deployRootFiles(templatesPath, variables, stack, version, spinner)`
**Purpose:** Deploy CLAUDE.md hierarchy and VERSION file
**Deploys:**

- `CLAUDE.md` (root context with project-specific variables)
- `trinity/CLAUDE.md` (Trinity Method enforcement)
- `src/CLAUDE.md` (framework-specific context)
- `VERSION` (Trinity SDK version tracking)

### Step 7: Agent Configuration Deployment

**Function:** `deployAgents(templatesPath, variables, spinner)`
**Purpose:** Deploy 19 agent templates to `.claude/agents/`
**Agents deployed:**

- AJ MAESTRO (workflow orchestrator)
- JUNO (quality auditor)
- AJ Team (10 specialized implementation agents)
- Troubleshooting Agents (8 specialized debug agents)

### Step 9: Claude Code Setup

**Function:** `deployClaudeSetup(templatesPath, variables, spinner)`
**Purpose:** Configure Claude Code IDE integration
**Deploys:**

- `.claude/settings.json` (Claude Code configuration)
- `.claude/EMPLOYEE-DIRECTORY.md` (agent directory and workflows)
- `.claude/commands/` (20 slash command templates)

### Step 9.7-9.8: Linting Configuration (Conditional)

**Function:** `deployLinting(lintingTools, dependencies, scripts, stack, templatesPath, variables, spinner)`
**Purpose:** Deploy framework-specific linting configurations
**Deploys:** ESLint, Prettier, TypeScript, Python linters based on selection
**Skipped when:** User doesn't select any linting tools

### Step 10: Template Deployment

**Function:** `deployTemplates(templatesPath, variables, spinner)`
**Purpose:** Deploy work order and investigation templates
**Deploys:**

- `trinity/templates/work-order/WORKORDER-TEMPLATE.md`
- `trinity/templates/investigation/INVESTIGATION-TEMPLATE.md`
- `trinity/templates/documentation/` (README templates, report templates)

### Step 11: CI/CD Workflow Deployment (Conditional)

**Function:** `deployCICD(options, spinner)`
**Purpose:** Deploy CI/CD workflow templates
**Deploys:** GitHub Actions, GitLab CI, CircleCI, Azure Pipelines templates
**Skipped when:** User doesn't enable CI/CD

### Step 11.5: Gitignore Update

**Function:** `updateGitignore(spinner)`
**Purpose:** Add Trinity-specific entries to .gitignore
**Adds:**

- `trinity/sessions/`
- `trinity/work-orders/WORKORDER-*.md` (except template)
- `trinity/investigations/*/` (except template)

### Step 12: SDK Installation

**Function:** `installSDK(spinner)`
**Purpose:** Add Trinity Method SDK to project's package.json
**Installs:** `@trinity-labs/trinity-method-sdk` as devDependency

### Final Step: Summary Display

**Function:** `displaySummary(progress, options, stack, metrics)`
**Purpose:** Show deployment results and next steps
**Displays:**

- Files deployed count
- Agents deployed count
- Commands deployed count
- Next steps and documentation links

---

## Deployment Progress Tracking

The deployment progress is tracked using the `DeploymentProgress` interface:

```typescript
interface DeploymentProgress {
  directories?: number; // Number of directories created
  agentsDeployed: number; // Number of agent templates deployed
  commandsDeployed: number; // Number of slash commands deployed
  knowledgeBaseFiles: number; // Number of knowledge base files deployed
  templatesDeployed: number; // Number of template files deployed
  rootFilesDeployed: number; // Number of root config files deployed
}
```

**Progress Tracking Example:**

```typescript
const progress: DeploymentProgress = {
  agentsDeployed: 0,
  commandsDeployed: 0,
  knowledgeBaseFiles: 0,
  templatesDeployed: 0,
  rootFilesDeployed: 0,
};

// After each step, progress is updated:
progress.agentsDeployed = 19;
progress.commandsDeployed = 20;
progress.knowledgeBaseFiles = 8;
// ... etc
```

---

## Template Variables

The deployment process uses template variable substitution to personalize files:

```typescript
const variables = {
  PROJECT_NAME: config.projectName || 'My Project',
  FRAMEWORK: stack.framework, // e.g., 'Node.js', 'Python'
  LANGUAGE: stack.language, // e.g., 'JavaScript', 'TypeScript'
  SOURCE_DIR: stack.sourceDir, // e.g., 'src', 'lib'
  PACKAGE_MANAGER: stack.packageManager, // e.g., 'npm', 'yarn', 'pnpm'
  BACKEND_FRAMEWORK: stack.framework, // For compatibility
  CURRENT_DATE: new Date().toISOString(), // Deployment timestamp
  TRINITY_VERSION: pkg.version, // SDK version (e.g., '2.1.0')
};
```

**Variable Usage in Templates:**

```markdown
# {{PROJECT_NAME}} - Trinity Method

**Framework:** {{FRAMEWORK}}
**Language:** {{LANGUAGE}}
**Source Directory:** {{SOURCE_DIR}}
**Trinity Version:** {{TRINITY_VERSION}}
**Deployed:** {{CURRENT_DATE}}
```

---

## Error Handling

The deploy command implements comprehensive error handling:

### Try-Catch Block

All deployment steps are wrapped in a try-catch block that:

1. Stops spinner on error
2. Displays user-friendly error message
3. Handles cancellation gracefully (user pressed Ctrl+C)
4. Rethrows errors for proper exit codes

### Error Recovery

```typescript
try {
  // 12-step deployment workflow
} catch (error: unknown) {
  if (spinner) spinner.fail();
  const { displayError, getErrorMessage } = await import('../../utils/errors.js');
  const message = getErrorMessage(error);
  displayError(`Deployment failed: ${message}`);

  // Don't throw if user cancelled
  if (message === 'Deployment cancelled by user') {
    return;
  }

  throw error; // Rethrow for proper exit code
}
```

---

## Usage Examples

### Example 1: Interactive Deployment

```bash
npx trinity deploy
```

**Behavior:**

- Prompts for project name
- Shows framework detection results
- Asks user to select linting tools
- Asks user to select CI/CD platform
- Collects codebase metrics (unless --skipAudit)
- Deploys all selected components

### Example 2: Non-Interactive Deployment (Defaults)

```bash
npx trinity deploy --yes
```

**Behavior:**

- Skips all prompts
- Uses detected project name from package.json
- Installs recommended linting tools for framework
- Skips CI/CD deployment
- Collects codebase metrics
- Completes deployment with defaults

### Example 3: Force Redeployment

```bash
npx trinity deploy --force
```

**Behavior:**

- Overwrites existing Trinity deployment
- Useful for upgrading Trinity SDK version
- Preserves user-created content in sessions/, work-orders/, investigations/

### Example 4: Skip Metrics Collection

```bash
npx trinity deploy --skipAudit
```

**Behavior:**

- Skips codebase metrics collection step
- Faster deployment for large codebases
- ARCHITECTURE.md will have placeholder metrics

### Example 5: Dry Run (Preview)

```bash
npx trinity deploy --dryRun
```

**Behavior:**

- Simulates deployment without writing files
- Shows what would be deployed
- Useful for testing before actual deployment

### Example 6: CI/CD Automated Deployment

```bash
npx trinity deploy --ciDeploy --yes
```

**Behavior:**

- Optimized for CI/CD pipelines
- Non-interactive (--yes)
- Minimal output for logs
- Fast deployment

---

## Integration with Other Commands

The deploy command integrates with:

### Update Command

After initial deployment, use `trinity update` to:

- Update agent templates to latest version
- Update slash commands
- Update knowledge base templates
- Preserve user-created content

### Slash Commands

After deployment, 20 slash commands become available:

- `/trinity-audit` - Run JUNO quality audit
- `/trinity-investigate` - Start investigation workflow
- `/trinity-workorder` - Create work order
- ... (17 more commands)

---

## File Structure After Deployment

```
project-root/
├── .claude/
│   ├── agents/           (19 agent templates)
│   ├── commands/         (20 slash command templates)
│   ├── settings.json
│   └── EMPLOYEE-DIRECTORY.md
├── trinity/
│   ├── knowledge-base/   (8 knowledge base files)
│   ├── templates/
│   │   ├── work-order/
│   │   ├── investigation/
│   │   └── documentation/
│   ├── VERSION
│   └── CLAUDE.md
├── docs/                 (if documentation enabled)
├── CLAUDE.md
├── src/
│   └── CLAUDE.md
└── .gitignore            (updated)
```

---

## Performance Considerations

### Deployment Duration

- **Small projects** (<100 files): ~10-15 seconds
- **Medium projects** (100-1000 files): ~20-30 seconds
- **Large projects** (>1000 files): ~30-60 seconds

**Note:** Metrics collection (`--skipAudit` disabled) adds 5-10 seconds for large codebases.

### File System Operations

- **Total files written**: ~50-80 files (depending on selections)
- **Total directories created**: 14 directories
- **Disk space required**: ~500KB - 1MB

### Network Operations

- SDK installation requires npm registry access
- No external API calls during deployment
- All templates bundled with SDK (no downloads)

---

## Related Documentation

- **Pre-flight Validation:** [deploy-pre-flight.md](deploy-pre-flight.md)
- **Configuration Prompts:** [deploy-configuration.md](deploy-configuration.md)
- **Framework Detection:** [detect-stack.md](detect-stack.md)
- **Template Processor:** [template-processor.md](template-processor.md)
- **Deployment Summary:** [deploy-summary.md](deploy-summary.md)

---

## Type Definitions

### DeployOptions

```typescript
interface DeployOptions {
  name?: string; // Project name override
  yes?: boolean; // Skip prompts
  dryRun?: boolean; // Simulate deployment
  force?: boolean; // Force redeployment
  skipAudit?: boolean; // Skip metrics collection
  ciDeploy?: boolean; // CI/CD mode
  lintingTools?: LintingTool[]; // Pre-selected linting tools
  lintingDependencies?: string[]; // Linting dependencies
  lintingScripts?: Record<string, string>; // package.json scripts
  postInstallInstructions?: PostInstallInstruction[]; // Post-install commands
}
```

### DeploymentProgress

```typescript
interface DeploymentProgress {
  directories?: number; // Directories created
  agentsDeployed: number; // Agents deployed
  commandsDeployed: number; // Commands deployed
  knowledgeBaseFiles: number; // Knowledge base files
  templatesDeployed: number; // Templates deployed
  rootFilesDeployed: number; // Root files deployed
}
```

### Stack

```typescript
interface Stack {
  framework: string; // Detected framework (Node.js, Python, etc.)
  language: string; // Detected language (JavaScript, TypeScript, etc.)
  sourceDir: string; // Primary source directory (src, lib, etc.)
  sourceDirs: string[]; // All source directories (monorepo support)
  packageManager?: string; // npm, yarn, pnpm, pip, cargo, etc.
}
```

### CodebaseMetrics

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

  // Framework-Specific
  frameworkVersion: string;
  packageManager: string;
}
```

---

**Last Updated:** 2026-01-21
**Trinity SDK Version:** 2.1.0
**Maintained By:** APO-2 (Documentation Specialist)
