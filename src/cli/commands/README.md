# CLI Commands Module

This module contains the core CLI commands for the Trinity Method SDK. It provides the primary interface for deploying and updating Trinity Method infrastructure in user projects.

## Overview

The commands module implements two main commands:
- **deploy.ts**: Complete Trinity Method deployment with 12-phase pipeline
- **update.ts**: Update existing Trinity deployments to latest SDK version

## Files

### deploy.ts (924 lines)

The deployment command orchestrates the complete Trinity Method infrastructure setup through a 12-phase deployment pipeline.

#### Trinity Principle
**"Systematic Quality Assurance"** - Deploys complete Trinity Method infrastructure with interactive wizard, ensuring every Trinity project starts with a proven, consistent foundation.

#### Core Features

1. **Interactive Deployment Wizard**
   - Project name configuration
   - Technology stack detection
   - Linting tool selection (ESLint, Prettier, Black, Flake8, etc.)
   - CI/CD workflow setup (GitHub Actions, GitLab CI)
   - Final confirmation before deployment

2. **12-Phase Deployment Pipeline**

   **Phase 1: Pre-flight Checks**
   - Verifies Trinity not already deployed (unless `--force`)
   - Validates project structure
   ```typescript
   const trinityExists = await fs.pathExists('trinity');
   if (trinityExists && !options.force) {
     throw new Error('Trinity already deployed');
   }
   ```

   **Phase 2: Technology Stack Detection**
   - Auto-detects framework (React, Node.js, Flutter, Python, Rust)
   - Identifies source directories (src/, lib/, app/, backend/, frontend/)
   - Determines package manager (npm, yarn, pnpm, pip, cargo)
   ```typescript
   const stack = await detectStack(process.cwd());
   // Result: { framework, language, sourceDir, sourceDirs, packageManager }
   ```

   **Phase 3: Configuration Prompts**
   - Project name input
   - Linting setup (recommended/custom/skip)
   - CI/CD deployment selection
   - Final deployment confirmation

   **Phase 3.5: Codebase Metrics Collection** (unless `--skip-audit`)
   - Collects scriptable metrics without semantic analysis
   - File counts, TODO/FIXME/HACK comments
   - Large file detection (>500, >1000, >3000 lines)
   - Dependency analysis
   - Git metrics (commits, contributors, last commit)
   ```typescript
   const metrics = await collectCodebaseMetrics(stack.sourceDir, stack.framework);
   // Returns: { totalFiles, todoCount, filesOver500, dependencyCount, ... }
   ```

   **Phase 4: Trinity Directory Structure**
   - Creates 11 core directories:
     - `trinity/knowledge-base/` - Project documentation
     - `trinity/sessions/` - Session archives
     - `trinity/investigations/` - Investigation results
     - `trinity/patterns/` - Detected patterns
     - `trinity/work-orders/` - Work order tracking
     - `trinity/templates/` - Work order templates
     - `trinity/investigations/plans/` - Investigation plans
     - `trinity/archive/` - Archived artifacts
   - Creates 5 Claude Code directories:
     - `.claude/agents/leadership/` - ALY, AJ MAESTRO
     - `.claude/agents/deployment/` - TAN, ZEN, INO, EIN
     - `.claude/agents/audit/` - JUNO
     - `.claude/agents/planning/` - MON, ROR, TRA, EUS (v2.0)
     - `.claude/agents/aj-team/` - KIL, BAS, DRA, APO, BON, CAP, URO (v2.0)

   **Phase 5: Knowledge Base Deployment**
   - Deploys 9 knowledge base templates:
     - `ARCHITECTURE.md` - System architecture documentation
     - `Trinity.md` - Trinity Method guidelines
     - `To-do.md` - Task tracking
     - `ISSUES.md` - Issue tracking
     - `Technical-Debt.md` - Technical debt management
     - `CODING-PRINCIPLES.md` - Coding standards (v2.0)
     - `TESTING-PRINCIPLES.md` - Testing guidelines (v2.0)
     - `AI-DEVELOPMENT-GUIDE.md` - AI development practices (v2.0)
     - `DOCUMENTATION-CRITERIA.md` - Documentation standards (v2.0)

   **Phase 5.5: Knowledge Base Enrichment**
   - Replaces placeholders with actual project data
   - Populates `ARCHITECTURE.md` with codebase metrics
   ```typescript
   archContent = archContent
     .replace(/\{\{PROJECT_NAME\}\}/g, variables.PROJECT_NAME)
     .replace(/\{\{FRAMEWORK\}\}/g, stack.framework)
     .replace(/\{\{TODO_COUNT\}\}/g, String(metrics?.todoCount || 0))
   ```

   **Phase 6: Root Files Deployment**
   - `TRINITY.md` - Root Trinity documentation
   - `CLAUDE.md` - Root Claude Code context
   - `trinity/VERSION` - SDK version tracking

   **Phase 6.5: Trinity CLAUDE.md**
   - Deploys `trinity/CLAUDE.md` with Trinity-specific context

   **Phase 6.6: Source Directory CLAUDE.md**
   - Framework-specific templates:
     - `nodejs-CLAUDE.md.template` (Node.js, React, Next.js)
     - `flutter-CLAUDE.md.template` (Flutter/Dart)
     - `react-CLAUDE.md.template` (React-specific)
     - `python-CLAUDE.md.template` (Python)
     - `rust-CLAUDE.md.template` (Rust)
     - `base-CLAUDE.md.template` (Fallback)
   - Deploys to all detected source directories
   - Never creates directories, only deploys to existing ones

   **Phase 7: Agent Configurations** (v2.0 Architecture)
   - Deploys 18 agents across 5 categories:
     - **Leadership** (2 agents): ALY (CTO), AJ MAESTRO
     - **Deployment** (4 agents): TAN, ZEN, INO, EIN
     - **Audit** (1 agent): JUNO
     - **Planning** (4 agents): MON, ROR, TRA, EUS (v2.0 new)
     - **Execution Team** (7 agents): KIL, BAS, DRA, APO, BON, CAP, URO (v2.0 new)

   **Phase 9: Claude Code Settings**
   - Creates empty `.claude/settings.json` for manual configuration

   **Phase 9.5: Employee Directory**
   - Deploys `.claude/EMPLOYEE-DIRECTORY.md` with agent information

   **Phase 9.6: Slash Commands** (Categorized)
   - Deploys 16 Trinity slash commands across 6 categories:
     - **Session**: `/trinity-start`, `/trinity-continue`, `/trinity-end`
     - **Planning**: `/trinity-requirements`, `/trinity-design`, `/trinity-decompose`, `/trinity-plan`
     - **Execution**: `/trinity-orchestrate`
     - **Investigation**: `/trinity-create-investigation`, `/trinity-plan-investigation`, `/trinity-investigate-templates`
     - **Infrastructure**: `/trinity-init`, `/trinity-crisis`
     - **Utility**: `/trinity-agents`, `/trinity-verify`, `/trinity-workorder`

   **Phase 9.7: Linting Configuration** (Optional)
   - Deploys selected linting tools:
     - **Node.js/React**: ESLint, Prettier, Pre-commit hooks, TypeScript ESLint
     - **Python**: Black, Flake8, isort, Pre-commit hooks
     - **Flutter**: Dart Analyzer, Pre-commit hooks
     - **Rust**: Clippy, Rustfmt, Pre-commit hooks

   **Phase 9.8: Dependency Injection** (Optional)
   - Adds linting dependencies to `package.json` (Node.js)
   - Adds linting dependencies to `requirements-dev.txt` (Python)
   - Adds npm scripts for linting commands

   **Phase 10: Work Order Templates**
   - Deploys 6 work order templates:
     - `INVESTIGATION-TEMPLATE.md`
     - `IMPLEMENTATION-TEMPLATE.md`
     - `ANALYSIS-TEMPLATE.md`
     - `AUDIT-TEMPLATE.md`
     - `PATTERN-TEMPLATE.md`
     - `VERIFICATION-TEMPLATE.md`

   **Phase 11: CI/CD Templates** (Optional)
   - Detects Git platform (GitHub, GitLab, unknown)
   - Deploys platform-specific templates:
     - `.github/workflows/trinity-ci.yml` (GitHub Actions)
     - `.gitlab-ci.yml` (GitLab CI)
     - `trinity/templates/ci/generic-ci.yml` (Reference)

   **Phase 11.5: .gitignore Update**
   - Adds Trinity exclusions to `.gitignore`:
     ```
     # Trinity Method deployment files
     node_modules/
     trinity/
     ```

   **Phase 12: SDK Installation**
   - Adds `trinity-method-sdk` to `package.json`
   - Runs `npm install` to install SDK
   - Skips if already installed

#### Template Variables

The deployment pipeline uses a comprehensive variable system:

```typescript
const variables: Record<string, any> = {
  PROJECT_NAME: projectName,
  TECH_STACK: stack.language,
  FRAMEWORK: stack.framework,
  SOURCE_DIR: stack.sourceDir || 'src',
  TRINITY_VERSION: pkg.version || '1.0.0',
  DEPLOYMENT_TIMESTAMP: new Date().toISOString(),
  LANGUAGE: stack.language,
  TECHNOLOGY_STACK: stack.language,
  PRIMARY_FRAMEWORK: stack.framework,
  CURRENT_DATE: new Date().toISOString().split('T')[0],
  PROJECT_VAR_NAME: projectName.toLowerCase().replace(/[^a-z0-9]/g, ''),
  TRINITY_HOME: process.env.TRINITY_HOME || 'C:/Users/lukaf/Desktop/Dev Work/trinity-method',
  ...formatMetrics(metrics), // Merge collected metrics
};
```

#### Deployment Statistics

The command tracks comprehensive deployment metrics:

```typescript
interface DeploymentStats {
  agents: number;        // 18 agents (v2.0)
  hooks: number;         // Hook configurations
  templates: number;     // 6 work order templates
  directories: number;   // 16 directories (11 Trinity + 5 Claude Code)
  files: number;         // Total files deployed
}
```

#### Integration Points

1. **Stack Detection** (`detect-stack.ts`)
   - Framework/language detection
   - Source directory discovery
   - Package manager identification

2. **Template Processing** (`template-processor.ts`)
   - Variable replacement in templates
   - Metrics formatting

3. **Codebase Metrics** (`codebase-metrics.ts`)
   - Code quality analysis
   - File complexity metrics
   - Dependency parsing

4. **Linting Tools** (`linting-tools.ts`)
   - Tool configuration for frameworks
   - Dependency management

5. **Linting Deployment** (`deploy-linting.ts`)
   - Framework-specific linting setup
   - Configuration file deployment

6. **Dependency Injection** (`inject-dependencies.ts`)
   - Package.json modification
   - Requirements.txt management

7. **CI/CD Deployment** (`deploy-ci.ts`)
   - Git platform detection
   - Workflow template deployment

#### Command-Line Options

```typescript
interface DeployOptions {
  name?: string;                        // Project name
  yes?: boolean;                        // Skip prompts (use defaults)
  dryRun?: boolean;                     // Simulate deployment
  force?: boolean;                      // Force redeployment
  skipAudit?: boolean;                  // Skip codebase metrics collection
  ciDeploy?: boolean;                   // Deploy CI/CD templates
  lintingTools?: LintingTool[];         // Selected linting tools
  lintingDependencies?: string[];       // Dependencies to inject
  lintingScripts?: Record<string, string>; // npm scripts to add
  postInstallInstructions?: PostInstallInstruction[]; // Post-install steps
}
```

#### Usage Examples

```bash
# Interactive deployment
npx trinity deploy

# Non-interactive with defaults
npx trinity deploy --yes

# Force redeployment
npx trinity deploy --force

# Skip codebase audit
npx trinity deploy --skip-audit

# Custom project name
npx trinity deploy --name "My Project"
```

#### Error Handling

The command implements comprehensive error handling:

```typescript
try {
  // Deployment phases...
} catch (error: any) {
  if (spinner) spinner.fail();
  console.error(chalk.red('\n❌ Deployment failed:'), error.message);
  throw error;
}
```

Common error scenarios:
- Trinity already deployed (use `--force` to override)
- Invalid project structure
- Missing dependencies
- Permission errors
- Template processing failures

---

### update.ts (138 lines)

The update command safely updates an existing Trinity deployment to the latest SDK version.

#### Trinity Principle
**"Systematic Quality Assurance"** - Keeps Trinity deployment current while preserving user customizations.

#### Core Features

1. **Version Management**
   - Reads current version from `trinity/VERSION`
   - Compares with SDK package version
   - Skips update if already current

2. **User Content Backup**
   - Backs up user-modified files before update
   - Preserves customizations in knowledge base
   ```typescript
   const userFiles = [
     'trinity/knowledge-base/ARCHITECTURE.md',
     'trinity/knowledge-base/To-do.md',
     'trinity/knowledge-base/ISSUES.md'
   ];
   ```

3. **Selective Update**
   - Updates SDK-managed files only
   - Templates (work orders)
   - Trinity.md documentation
   - Agent configurations
   - Preserves user hooks and customizations

4. **Safe Update Process**
   - Creates timestamped backup directory
   - Updates SDK files with overwrite
   - Restores user content from backup
   - Updates VERSION file
   - Cleans up backup on success

#### Update Flow

```typescript
// 1. Check if Trinity exists
const trinityExists = await fs.pathExists('trinity');

// 2. Read current version
const currentVersion = await fs.readFile('trinity/VERSION', 'utf8');

// 3. Read latest version from SDK
const latestVersion = sdkPkg.version;

// 4. Compare versions
if (currentVersion === latestVersion) {
  console.log('✅ Already up to date');
  return;
}

// 5. Confirm update (unless --dry-run)
const { confirm } = await inquirer.prompt([...]);

// 6. Backup user content
await fs.copy(file, path.join(backupDir, path.basename(file)));

// 7. Update SDK-managed files
await fs.copy(woDir, 'trinity/templates', { overwrite: true });

// 8. Restore user content
await fs.copy(backupFile, file, { overwrite: true });

// 9. Update VERSION file
await fs.writeFile(versionPath, latestVersion);

// 10. Cleanup backup
await fs.remove(backupDir);
```

#### Command-Line Options

```typescript
interface UpdateOptions {
  all?: boolean;     // Update all components (future use)
  dryRun?: boolean;  // Simulate update without making changes
}
```

#### Usage Examples

```bash
# Interactive update
npx trinity update

# Dry run (preview changes)
npx trinity update --dry-run

# Future: Update all components
npx trinity update --all
```

#### Error Handling

```typescript
try {
  // Update process...
  spinner.succeed('Trinity Method updated successfully');
} catch (error: any) {
  spinner.fail('Update failed');
  console.error(chalk.red(`\nError: ${error.message}\n`));
  throw error;
}
```

Common error scenarios:
- Trinity not deployed (use `trinity deploy` first)
- Permission errors
- Backup failures
- File system errors

---

## Shared Dependencies

Both commands share common utilities and types:

### Utility Imports

```typescript
// Stack detection
import { detectStack } from '../utils/detect-stack.js';

// Template processing
import { processTemplate, formatMetrics } from '../utils/template-processor.js';

// Codebase analysis
import { collectCodebaseMetrics } from '../utils/codebase-metrics.js';

// Linting configuration
import {
  getToolsForFramework,
  getRecommendedTools,
  getDependenciesForTools,
  getScriptsForTools,
  getPostInstallInstructions,
} from '../utils/linting-tools.js';

// Linting deployment
import { deployLintingTool } from '../utils/deploy-linting.js';

// Dependency management
import { injectLintingDependencies } from '../utils/inject-dependencies.js';

// CI/CD deployment
import { deployCITemplates } from '../utils/deploy-ci.js';
```

### Type Imports

```typescript
import { DeployOptions, DeploymentStats, LintingTool, CodebaseMetrics } from '../types.js';
import { UpdateOptions } from '../types.js';
```

### UI Libraries

```typescript
import ora, { Ora } from 'ora';        // Spinners
import chalk from 'chalk';             // Terminal colors
import inquirer from 'inquirer';       // Interactive prompts
import fs from 'fs-extra';             // File system utilities
import path from 'path';               // Path manipulation
```

---

## Integration with Trinity Method

### Deployment Workflow

```
User runs: npx trinity deploy
    ↓
Pre-flight checks → Stack detection → User prompts
    ↓
Codebase metrics → Directory structure → Knowledge base
    ↓
CLAUDE.md files → Agent configs → Slash commands
    ↓
Linting setup → CI/CD templates → .gitignore → SDK install
    ↓
Deployment summary → Next steps → Ready to use
```

### Update Workflow

```
User runs: npx trinity update
    ↓
Version check → User confirmation → Backup user files
    ↓
Update templates → Update agents → Restore user files
    ↓
Update VERSION → Cleanup → Update complete
```

### Agent Integration

The deployment creates the complete v2.0 agent architecture:

1. **Leadership Team** (2 agents)
   - ALY (CTO) - Strategic planning
   - AJ MAESTRO - AI-orchestrated implementation

2. **Planning Team** (4 agents - v2.0)
   - MON - Requirements analysis
   - ROR - Technical design
   - TRA - Implementation planning
   - EUS - Task decomposition

3. **Execution Team** (7 agents - v2.0)
   - KIL - Task execution
   - BAS - Quality gates
   - DRA - Code review
   - APO - Documentation
   - BON - Dependency management
   - CAP - Configuration
   - URO - Refactoring

4. **Deployment Team** (4 agents)
   - TAN - Structure specialist
   - ZEN - Knowledge specialist
   - INO - Context specialist
   - EIN - CI/CD specialist

5. **Audit Team** (1 agent)
   - JUNO - Quality auditor

---

## Best Practices

### For Deploy Command

1. **Always run in project root**
   ```bash
   cd /path/to/project
   npx trinity deploy
   ```

2. **Review prompts carefully**
   - Project name affects template variables
   - Linting setup is framework-specific
   - CI/CD platform detection may need verification

3. **Use --skip-audit for large codebases**
   - Speeds up deployment
   - Agents can complete audit later

4. **Force redeployment only when necessary**
   - Backs up nothing
   - Overwrites all Trinity files

### For Update Command

1. **Always backup before updating**
   - Update creates backup automatically
   - Manual backup recommended for safety

2. **Review user files after update**
   - Check restored content
   - Verify no data loss

3. **Use --dry-run to preview changes**
   - See what will be updated
   - No actual modifications

---

## Troubleshooting

### Deploy Issues

**Problem**: "Trinity Method already deployed"
```bash
# Solution: Use force flag
npx trinity deploy --force
```

**Problem**: Slow deployment on large codebase
```bash
# Solution: Skip audit
npx trinity deploy --skip-audit
```

**Problem**: Linting dependencies not installed
```bash
# Solution: Run npm install after deployment
npm install
```

### Update Issues

**Problem**: "Trinity Method not deployed"
```bash
# Solution: Deploy first
npx trinity deploy
```

**Problem**: Version mismatch after update
```bash
# Solution: Check trinity/VERSION file
cat trinity/VERSION
```

**Problem**: Lost customizations after update
```bash
# Solution: Check backup directory
ls -la .trinity-backup-*
```

---

## File Structure Created by Deploy

```
project-root/
├── TRINITY.md                          # Root Trinity documentation
├── CLAUDE.md                           # Root Claude Code context
├── .gitignore                          # Updated with Trinity exclusions
├── package.json                        # Updated with SDK dependency
├── trinity/
│   ├── VERSION                         # SDK version
│   ├── CLAUDE.md                       # Trinity-specific context
│   ├── knowledge-base/
│   │   ├── ARCHITECTURE.md
│   │   ├── Trinity.md
│   │   ├── To-do.md
│   │   ├── ISSUES.md
│   │   ├── Technical-Debt.md
│   │   ├── CODING-PRINCIPLES.md
│   │   ├── TESTING-PRINCIPLES.md
│   │   ├── AI-DEVELOPMENT-GUIDE.md
│   │   └── DOCUMENTATION-CRITERIA.md
│   ├── templates/
│   │   ├── INVESTIGATION-TEMPLATE.md
│   │   ├── IMPLEMENTATION-TEMPLATE.md
│   │   ├── ANALYSIS-TEMPLATE.md
│   │   ├── AUDIT-TEMPLATE.md
│   │   ├── PATTERN-TEMPLATE.md
│   │   ├── VERIFICATION-TEMPLATE.md
│   │   └── ci/
│   │       └── generic-ci.yml
│   ├── sessions/                       # Session archives
│   ├── investigations/                 # Investigation results
│   ├── patterns/                       # Detected patterns
│   ├── work-orders/                    # Work order tracking
│   └── archive/                        # Archived artifacts
├── .claude/
│   ├── settings.json                   # Empty (manual config)
│   ├── EMPLOYEE-DIRECTORY.md           # Agent information
│   ├── agents/
│   │   ├── leadership/
│   │   │   ├── aly-cto.md
│   │   │   └── aj-maestro.md
│   │   ├── deployment/
│   │   │   ├── tan-structure.md
│   │   │   ├── zen-knowledge.md
│   │   │   ├── ino-context.md
│   │   │   └── ein-cicd.md
│   │   ├── audit/
│   │   │   └── juno-auditor.md
│   │   ├── planning/
│   │   │   ├── mon-requirements.md
│   │   │   ├── ror-design.md
│   │   │   ├── tra-planner.md
│   │   │   └── eus-decomposer.md
│   │   └── aj-team/
│   │       ├── kil-task-executor.md
│   │       ├── bas-quality-gate.md
│   │       ├── dra-code-reviewer.md
│   │       ├── apo-documentation-specialist.md
│   │       ├── bon-dependency-manager.md
│   │       ├── cap-configuration-specialist.md
│   │       └── uro-refactoring-specialist.md
│   └── commands/
│       ├── session/
│       ├── planning/
│       ├── execution/
│       ├── investigation/
│       ├── infrastructure/
│       └── utility/
├── src/CLAUDE.md                       # Source directory context
└── .github/workflows/                  # (Optional) CI/CD workflows
    └── trinity-ci.yml
```

---

## Version History

- **v2.0.0**: Agent architecture redesign (11-agent orchestration team)
- **v1.5.0**: Added CI/CD templates and linting configuration
- **v1.0.0**: Initial release with basic deployment

---

## Related Documentation

- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\cli\utils\README.md](../utils/README.md) - Utility modules
- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\shared\types\README.md](../../shared/types/README.md) - Type definitions
- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\templates\README.md](../../templates/README.md) - Template system
