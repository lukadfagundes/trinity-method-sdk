# Trinity Method SDK - Source Code Documentation

**Version:** 1.0.0
**Last Updated:** 2025-12-18

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Reference](#quick-reference)
3. [Directory Structure](#directory-structure)
4. [Core Modules](#core-modules)
5. [Deployment Pipeline](#deployment-pipeline)
6. [Template System](#template-system)
7. [Architecture & Design Patterns](#architecture--design-patterns)
8. [Adding New Features](#adding-new-features)
9. [Testing](#testing)

---

## Overview

The `src/` directory contains the complete implementation of the Trinity Method SDK - a CLI tool that deploys AI-powered investigation-first development infrastructure to projects across multiple technology stacks.

**What It Does:**
- Detects project technology stack (Node.js, React, Python, Flutter, Rust, etc.)
- Analyzes codebase metrics (code quality, complexity, dependencies)
- Deploys 18 specialized AI agent configurations
- Sets up linting, formatting, and pre-commit hooks
- Configures CI/CD workflows (GitHub Actions, GitLab CI)
- Creates knowledge base templates with metric enrichment
- Generates framework-specific context files (CLAUDE.md)

**Key Stats:**
- **~5,600 lines** of production TypeScript
- **2,270 lines** of shared type definitions
- **80+ template files** for multi-framework support
- **18 AI agents** across 5 specialized teams
- **Supports 6+ frameworks** with single codebase

---

## Quick Reference

### Core Commands
```bash
# Deploy Trinity Method to current project
npx trinity deploy

# Deploy with recommended settings (non-interactive)
npx trinity deploy --yes

# Fast deployment (skip metrics collection)
npx trinity deploy --skip-audit

# Force redeployment
npx trinity deploy --force

# Update existing Trinity deployment
npx trinity update
```

### Key Files & Their Purpose

| File | Lines | Purpose |
|------|-------|---------|
| [cli/commands/deploy.ts](cli/commands/deploy.ts) | 924 | Main deployment orchestrator |
| [cli/commands/update.ts](cli/commands/update.ts) | 138 | Non-breaking version upgrades |
| [cli/utils/detect-stack.ts](cli/utils/detect-stack.ts) | 233 | Framework/language detection |
| [cli/utils/codebase-metrics.ts](cli/utils/codebase-metrics.ts) | 457 | Code quality analysis |
| [cli/utils/template-processor.ts](cli/utils/template-processor.ts) | 143 | Variable interpolation |
| [shared/types/index.ts](shared/types/index.ts) | 2,270 | Global type definitions |
| [utils/Logger.ts](utils/Logger.ts) | 174 | Structured logging |

---

## Directory Structure

```
src/
├── cli/                          # CLI layer (commands + utilities)
│   ├── commands/
│   │   ├── deploy.ts            # Deployment orchestrator (924 lines)
│   │   └── update.ts            # Version management (138 lines)
│   ├── utils/                   # Deployment utilities (8 files)
│   │   ├── detect-stack.ts      # Technology detection
│   │   ├── template-processor.ts # Variable interpolation
│   │   ├── codebase-metrics.ts  # Code analysis
│   │   ├── linting-tools.ts     # Linting catalog
│   │   ├── deploy-linting.ts    # Linting deployment
│   │   ├── inject-dependencies.ts # Package integration
│   │   ├── deploy-ci.ts         # CI/CD deployment
│   │   └── inject-readme.ts     # README generation
│   ├── types.ts                 # CLI-specific interfaces
│   └── index.ts                 # CLI entrypoint (Commander setup)
├── shared/
│   └── types/
│       └── index.ts             # Global types (2,270 lines - SSOT)
├── utils/
│   └── Logger.ts                # Logging utility
├── templates/                   # Template assets (80+ files)
│   ├── agents/                  # 18 AI agent configs
│   ├── knowledge-base/          # 9 KB templates
│   ├── linting/                 # Framework linting configs
│   ├── work-orders/             # 6 work order templates
│   ├── root/                    # Root TRINITY.md, CLAUDE.md
│   ├── source/                  # Framework-specific CLAUDE.md
│   ├── shared/claude-commands/  # 13 slash commands
│   ├── ci/                      # GitHub Actions, GitLab CI
│   ├── claude/                  # Claude Code configs
│   └── investigations/          # Investigation templates
├── index.ts                     # Main export (public API)
└── CLAUDE.md                    # Technology-specific guidelines
```

---

## Core Modules

### 1. CLI Entrypoint (`cli/index.ts`)

**Purpose:** Define CLI commands using Commander.js

**Commands:**
- `trinity deploy` - Full Trinity Method deployment
- `trinity update` - Update existing deployment

**Options:**
- `--yes` - Skip confirmation prompts
- `--dry-run` - Preview changes without writing
- `--force` - Overwrite existing Trinity deployment
- `--skip-audit` - Skip codebase metrics (faster)
- `--ci-deploy` - Deploy CI/CD workflows

**Flow:**
```typescript
program
  .command('deploy')
  .description('Deploy Trinity Method to current project')
  .option('--yes', 'Skip confirmation prompts')
  .action(deploy);
```

---

### 2. Deploy Command (`cli/commands/deploy.ts`) - 924 lines

**Purpose:** Complete Trinity Method infrastructure orchestrator

**12-Phase Deployment Pipeline:**

1. **Pre-flight Checks** - Verify not already deployed
2. **Stack Detection** - Identify framework/language/package manager
3. **User Configuration** - Interactive prompts (project name, linting, CI/CD)
4. **Metrics Collection** - Analyze codebase (optional with `--skip-audit`)
5. **Directory Creation** - Create 16 directories (knowledge-base, agents, etc.)
6. **Knowledge Base** - Deploy 9 templates with metric enrichment
7. **Root Files** - TRINITY.md, CLAUDE.md, VERSION
8. **CLAUDE.md Deployment** - Multi-directory support (root, trinity, all source dirs)
9. **Agent Deployment** - 18 agent configs across 5 teams
10. **Slash Commands** - 13 Trinity commands
11. **Optional Systems** - Linting, CI/CD, .gitignore
12. **SDK Installation** - Add trinity-method-sdk to package.json

**CLAUDE.md Multi-Directory Deployment:**

The deploy command now intelligently deploys CLAUDE.md files to ALL detected source directories:

```typescript
// Detects and deploys to:
CLAUDE.md                    // Root context
trinity/CLAUDE.md           // Trinity methodology
src/CLAUDE.md               // Primary source
src/backend/CLAUDE.md       // Backend code
src/frontend/CLAUDE.md      // Frontend code
src/frontend/app/CLAUDE.md  // Nested structure
frontend/app/lib/CLAUDE.md  // Deep nesting
```

**Smart Detection Patterns:**
- Top-level: `src/`, `lib/`, `app/`, `backend/`, `frontend/`, `server/`, `client/`, `database/`, `packages/`, `apps/`
- 2-level: `backend/src`, `frontend/app`, `src/backend`, etc.
- 3-level: `frontend/app/lib`, `src/frontend/src`, etc.

**Never creates directories** - only deploys to existing ones.

**Key Integration Points:**
```typescript
// Stack detection
const stack = await detectStack(process.cwd());
// Returns: { framework, language, sourceDir, sourceDirs[], packageManager }

// Metrics collection
const metrics = await collectCodebaseMetrics(stack);
// Returns: { totalFiles, todoCount, filesOver500, dependencyCount, ... }

// Template processing
const processed = processTemplate(content, variables);
// Replaces: {{PROJECT_NAME}}, {{FRAMEWORK}}, {{TODO_COUNT}}, etc.
```

**Success Output:**
```
✅ Trinity Method deployed successfully!

📊 Deployment Statistics:
   Directories Created: 16
   Agents Deployed: 18 (2 leadership + 4 planning + 7 execution + 4 deployment + 1 audit)
   CLAUDE.md Files: 7 (root + trinity + src, src/backend, src/frontend, src/frontend/src, frontend/app/lib)
   Files Created: 40+
```

---

### 3. Update Command (`cli/commands/update.ts`) - 138 lines

**Purpose:** Non-breaking version upgrades

**Safety Features:**
- Backs up user content (ARCHITECTURE.md, To-do.md, ISSUES.md)
- Updates only SDK-managed files
- Restores user content after update
- Dry-run support

**Workflow:**
```
1. Read current version (trinity/VERSION)
2. Compare with SDK version
3. Backup user files
4. Update templates/agents
5. Restore user files
6. Update VERSION file
```

---

### 4. Stack Detection (`cli/utils/detect-stack.ts`) - 233 lines

**Purpose:** Automatically identify technology stack and ALL source directories

**Detection Priority:**
1. Node.js (`package.json`) → Detect React, Vue, Angular, Next.js, Express
2. Flutter (`pubspec.yaml`) → Dart
3. Python (`requirements.txt`, `setup.py`, `pyproject.toml`) → Flask, Django
4. Rust (`Cargo.toml`)
5. Go (`go.mod`)

**Multi-Directory Detection (Monorepo Support):**

Scans for common source directories:
```typescript
const COMMON_SOURCE_DIRS = [
  'src', 'lib', 'app', 'backend', 'frontend',
  'server', 'client', 'database', 'packages', 'apps'
];
```

Checks nested patterns (2-level and 3-level):
```typescript
// 2-level: backend/src, frontend/app, src/backend
// 3-level: frontend/app/lib, src/backend/src
```

**Returns:**
```typescript
interface Stack {
  framework: string;        // "React", "Flutter", etc.
  language: string;         // "JavaScript/TypeScript", "Dart", etc.
  sourceDir: string;        // Primary: "src" (backward compat)
  sourceDirs: string[];     // All: ["src", "src/backend", "src/frontend", ...]
  packageManager?: string;  // "npm", "yarn", "pnpm", "pip", etc.
}
```

**Example Output:**
```typescript
{
  framework: "React",
  language: "JavaScript/TypeScript",
  sourceDir: "src",
  sourceDirs: [
    "src",
    "src/backend",
    "src/frontend",
    "src/frontend/src",
    "src/frontend/app",
    "src/frontend/app/lib",
    "src/database"
  ],
  packageManager: "npm"
}
```

---

### 5. Template Processor (`cli/utils/template-processor.ts`) - 143 lines

**Purpose:** Variable interpolation for templates

**Standard Variables:**
- `{{PROJECT_NAME}}` → Project name
- `{{FRAMEWORK}}` → React, Flutter, etc.
- `{{LANGUAGE}}` → JavaScript/TypeScript, Dart, etc.
- `{{SOURCE_DIR}}` → Primary source directory
- `{{TRINITY_VERSION}}` → SDK version
- `{{DEPLOYMENT_TIMESTAMP}}` → ISO 8601 timestamp
- `{{PACKAGE_MANAGER}}` → npm, yarn, pip, etc.

**Metrics Variables (Scriptable):**
- `{{TODO_COUNT}}` → TODO/FIXME/HACK comments
- `{{TOTAL_FILES}}` → Total source files
- `{{FILES_500}}` → Files > 500 lines
- `{{DEPENDENCY_COUNT}}` → Dependencies count
- `{{COMMIT_COUNT}}` → Git commit count

**Placeholder Variables (Agent-only):**
- `{{OVERALL_COVERAGE}}` → Test coverage (requires semantic analysis)
- `{{SECURITY_COUNT}}` → Security issues (requires audit)
- `{{COMPONENT_1}}` → Architecture components (requires analysis)

**Hybrid System:**
- CLI collects scriptable metrics
- Agents complete semantic analysis
- Prevents gaps during deployment

**Usage:**
```typescript
const variables = {
  PROJECT_NAME: "My App",
  FRAMEWORK: "React",
  TODO_COUNT: "23"
};

const processed = processTemplate(content, variables);
// Replaces all {{PLACEHOLDER}} occurrences
```

---

### 6. Codebase Metrics (`cli/utils/codebase-metrics.ts`) - 457 lines

**Purpose:** Scriptable code quality analysis

**Metrics Categories:**

1. **Code Quality** (pattern matching):
   - TODO/FIXME/HACK comments
   - Console statements (log, warn, error, debug)
   - Commented code blocks (3+ consecutive comment lines)

2. **File Complexity**:
   - Total files per directory
   - Files > 500, 1000, 3000 lines
   - Average file length
   - Top 10 largest files

3. **Dependencies**:
   - Package count (dependencies + devDependencies)
   - Framework-specific parsing (package.json, requirements.txt, Cargo.toml, etc.)

4. **Git Metrics** (optional):
   - Commit count
   - Contributor count
   - Last commit date

**File Globbing:**
```typescript
**/*.{js,jsx,ts,tsx,dart,py,rs}
```
Excludes: `node_modules`, `build`, `.dart_tool`, `dist`, `__pycache__`

**Returns:**
```typescript
interface CodebaseMetrics {
  totalFiles: number;
  todoCount: number;
  filesOver500: number;
  dependencyCount: number;
  [key: string]: any;  // Extensible
}
```

---

### 7. Linting Tools (`cli/utils/linting-tools.ts`) - 228 lines

**Purpose:** Framework-specific linting configuration catalog

**Supported Tools by Framework:**

**Node.js/React/Next.js:**
- ESLint (with TypeScript support)
- Prettier
- Pre-commit hooks

**Python:**
- Black (formatter)
- Flake8 (linter)
- isort (import sorter)
- Pre-commit hooks

**Flutter:**
- Dart Analyzer
- Pre-commit hooks

**Rust:**
- Clippy (linter)
- Rustfmt (formatter)
- Pre-commit hooks

**Tool Definition:**
```typescript
interface LintingTool {
  id: string;              // "eslint"
  name: string;            // "ESLint"
  file: string;            // ".eslintrc.json"
  description?: string;
  template?: string;
  framework?: string;
  language?: string;
  recommended?: boolean;
  dependencies?: string[]; // ["eslint@^8.50.0"]
  scripts?: Record<string, string>; // { "lint": "eslint ." }
}
```

**Functions:**
- `getToolsForFramework()` - All available tools
- `getRecommendedTools()` - Recommended subset
- `getDependenciesForTools()` - Flatten dependencies
- `getScriptsForTools()` - Merge npm scripts
- `getPostInstallInstructions()` - Setup commands

---

### 8. Deploy Linting (`cli/utils/deploy-linting.ts`) - 165 lines

**Purpose:** Deploy framework-specific linting configs

**Deployment Logic:**

1. **ESLint (JavaScript/TypeScript)**:
   - Selects template based on module type:
     - TypeScript → `.eslintrc-typescript.json.template`
     - ESM → `.eslintrc-esm.json.template`
     - CommonJS → `.eslintrc-commonjs.json.template`

2. **Prettier**: Deploy `.prettierrc.json`

3. **Pre-commit hooks**: Deploy `.pre-commit-config.yaml`

4. **Python tools**: Deploy `.flake8`, `pyproject.toml`

5. **Dart Analyzer**: Deploy `analysis_options.yaml`

6. **Rust tools**: Deploy `clippy.toml`, `rustfmt.toml`

**Template Location:**
```
templates/linting/{framework}/
├── nodejs/
│   ├── .eslintrc-typescript.json.template
│   ├── .prettierrc.json.template
│   └── .pre-commit-config.yaml.template
├── python/
├── flutter/
└── rust/
```

---

### 9. Inject Dependencies (`cli/utils/inject-dependencies.ts`) - 72 lines

**Purpose:** Add linting dependencies to package managers

**Functionality:**

**Node.js (`package.json`)**:
- Add devDependencies with version specs
- Merge scripts (lint, format, etc.)
- Handle scoped packages (@typescript-eslint/parser)

**Python (`requirements-dev.txt`)**:
- Create or append dependencies
- Prevent duplicates

**Version Parsing:**
```typescript
// Input: "@typescript-eslint/parser@^6.7.0"
// Output: { name: "@typescript-eslint/parser", version: "^6.7.0" }
```

---

### 10. Deploy CI/CD (`cli/utils/deploy-ci.ts`) - 128 lines

**Purpose:** Deploy CI/CD workflow templates

**Workflow Detection:**
- Reads `.git/config`
- Detects: GitHub, GitLab, or Unknown

**Deployment Targets:**

**GitHub Actions:**
- File: `.github/workflows/trinity-ci.yml`
- Source: `templates/ci/github-actions.yml`

**GitLab CI:**
- File: `.gitlab-ci.yml`
- Source: `templates/ci/gitlab-ci.yml`

**Generic Reference:**
- File: `trinity/templates/ci/generic-ci.yml`
- Always deployed for reference

**Returns:**
```typescript
{
  deployed: string[];   // ["trinity-ci.yml"]
  skipped: string[];    // [".gitlab-ci.yml"]
  errors: Array<{file?, error?, general?}>
}
```

---

### 11. Logger Utility (`utils/Logger.ts`) - 174 lines

**Purpose:** Structured, context-aware logging

**Features:**

1. **Log Levels**: DEBUG, INFO, WARN, ERROR, NONE

2. **Environment-Based**:
   - `LOG_LEVEL` env var controls verbosity
   - Production: WARN
   - Development: INFO

3. **Context Support**:
   - Create context-specific loggers
   - Chain contexts: `logger.child('deploy:linting')`
   - Hierarchical: `[deploy:linting:typescript]`

4. **Structured Output**:
   ```
   2025-12-18T10:30:00.000Z INFO [deploy:linting] Deploying ESLint {"framework":"React"}
   ```

5. **Singleton Pattern**:
   - `Logger.getInstance()` - Global
   - `Logger.create(context)` - Context-specific

**Usage:**
```typescript
const logger = Logger.create('deploy');
logger.info('Starting deployment', { framework: 'React' });
```

---

### 12. Shared Types (`shared/types/index.ts`) - 2,270 lines

**Purpose:** Single source of truth for all type definitions

**This is the most critical file** - prevents type duplication and provides comprehensive type safety.

**Key Type Categories:**

1. **Investigation System** (80+ interfaces):
   - `InvestigationResult` - Complete investigation structure
   - `InvestigationPhase` - Execution phases
   - `Finding` - Discovered insights
   - `Pattern` - Code patterns (anti-patterns, best practices)
   - `Issue` - Problems (bugs, vulnerabilities, performance)
   - `Risk` - Identified risks with mitigation
   - `Artifact` - Generated reports, diagrams, test results

2. **Context & Configuration**:
   - `ClaudeMdContext` - Parsed CLAUDE.md
   - `Configuration` - Trinity configuration
   - `TrinityConfiguration` - Trinity settings
   - `HookConfiguration` - Deployment hooks
   - `InvestigationPreferences` - Customization

3. **Performance & Metrics**:
   - `InvestigationMetrics` - Performance data
   - `PerformanceStats` - Statistical analysis
   - `BenchmarkResult` - Benchmark data
   - `AgentPerformanceMetrics` - Per-agent metrics

4. **Cache System**:
   - `CacheEntry<T>` - Cache entry with TTL
   - `CacheStats` - Cache statistics
   - `CacheOperationResult<T>` - Operation result

5. **Coordination & Execution**:
   - `InvestigationTask` - Task within investigation
   - `TaskDependencyGraph` - DAG of dependencies
   - `InvestigationExecutionStatus` - Real-time status
   - `AgentStatus` - Per-agent workload

6. **Validation & Error Handling**:
   - `ValidationResult` - Success/failure
   - `ValidationError` - Specific errors
   - `ValidationWarning` - Non-critical warnings
   - `ErrorResolution` - Error tracking

**Type Guards:**
```typescript
isInvestigationResult(value)
isPattern(value)
isCacheEntry(value)
isClaudeMdContext(value)
```

**Utility Types:**
```typescript
DeepPartial<T>      // Recursive optional
DeepRequired<T>     // Recursive required
KeysOfType<T, U>    // Extract keys of type
StrictOmit<T, K>    // Type-safe omit
StrictPick<T, K>    // Type-safe pick
```

**Constants:**
```typescript
DEFAULT_CONFIG              // Default Trinity config
INVESTIGATION_TYPES         // Valid investigation types
PATTERN_CATEGORIES          // Valid pattern categories
```

---

## Deployment Pipeline

### Complete Flow Diagram

```
User Command
    ↓
CLI Routing (commander.js)
    ↓
Pre-flight Checks
    ↓
Stack Detection (detect-stack.ts)
    ↓
Interactive Prompts (inquirer)
    ↓
Metrics Collection (codebase-metrics.ts)
    ↓
Variable Preparation (template-processor.ts)
    ↓
Directory Creation (16 dirs)
    ↓
Knowledge Base Deployment (9 templates with enrichment)
    ↓
Root Files (TRINITY.md, CLAUDE.md)
    ↓
Multi-Directory CLAUDE.md (root, trinity, all source dirs)
    ↓
Agent Deployment (18 agents)
    ↓
Slash Commands (13 commands)
    ↓
Linting Setup (optional)
    ↓
CI/CD Deployment (optional)
    ↓
SDK Installation (npm install)
    ↓
Success Report
```

### Typical Deployment Time

| Operation | Time | Notes |
|-----------|------|-------|
| Stack Detection | <100ms | Quick file checks |
| Metrics Collection | 1-5s | Depends on codebase size |
| Directory Creation | <100ms | 16 directories |
| Template Processing | <500ms | 50+ templates |
| Dependency Injection | <500ms | JSON parsing/writing |
| CI/CD Deployment | <100ms | 2-3 templates |
| npm install | 30s-5min | Highly variable |
| **Total** | **1-6 min** | Parallelizable |

---

## Template System

### Template Organization

```
templates/
├── agents/                   # 18 AI agent configurations
│   ├── leadership/          # ALY (CTO), AJ (Maestro)
│   ├── planning/            # MON, ROR, TRA, EUS
│   ├── deployment/          # TAN, ZEN, INO, EIN
│   ├── audit/               # JUNO
│   └── aj-team/             # KIL, BAS, DRA, APO, BON, CAP, URO
├── knowledge-base/          # 9 core KB templates
├── linting/                 # Framework-specific configs
├── work-orders/             # 6 work order templates
├── root/                    # Root TRINITY.md, CLAUDE.md
├── source/                  # Framework CLAUDE.md variants
├── shared/claude-commands/  # 13 slash commands
├── ci/                      # GitHub Actions, GitLab CI
├── claude/                  # Claude Code configs
└── investigations/          # Investigation templates
```

### Variable Interpolation

Templates use `{{PLACEHOLDER}}` syntax:

```markdown
# {{PROJECT_NAME}} - Architecture

**Framework:** {{FRAMEWORK}}
**Language:** {{LANGUAGE}}

## Metrics
- Total Files: {{TOTAL_FILES}}
- TODO Count: {{TODO_COUNT}}
- Dependencies: {{DEPENDENCY_COUNT}}
```

**Processing:**
```typescript
const processed = processTemplate(content, {
  PROJECT_NAME: "My App",
  FRAMEWORK: "React",
  TOTAL_FILES: "145",
  TODO_COUNT: "23"
});
```

**Result:**
```markdown
# My App - Architecture

**Framework:** React
**Language:** JavaScript/TypeScript

## Metrics
- Total Files: 145
- TODO Count: 23
- Dependencies: 42
```

---

## Architecture & Design Patterns

### 1. Orchestration Pattern

Deploy command acts as orchestrator, coordinating specialized utilities:

```
deploy.ts (orchestrator)
    ↓
├─ detectStack()          [Framework detection]
├─ collectMetrics()       [Code analysis]
├─ processTemplate()      [Variable interpolation]
├─ deployLintingTool()    [Linting setup]
├─ injectDependencies()   [Package integration]
└─ deployCITemplates()    [CI/CD deployment]
```

### 2. Template Processing Pattern

Templates are data, processing is code:

```
Template File (data)
    ↓
Variable Extraction
    ↓
Template Reading
    ↓
Variable Interpolation
    ↓
Output File
```

### 3. Modular Utilities

Each utility is:
- Single-responsibility
- Independently testable
- Reusable
- Framework-agnostic

### 4. Type Safety (SSOT)

All types defined in `shared/types/index.ts`:
- Prevents duplication
- Enables IDE autocomplete
- Catches errors at compile time
- Documents data structures

---

## Adding New Features

### Add Framework Support

1. **In `detect-stack.ts`**: Add detection logic
   ```typescript
   else if (await exists(path.join(targetDir, 'deno.json'))) {
     result.language = 'TypeScript';
     result.framework = 'Deno';
     result.sourceDir = 'src';
   }
   ```

2. **In `codebase-metrics.ts`**: Add file patterns
   ```typescript
   **/*.{js,jsx,ts,tsx,dart,py,rs,go}
   ```

3. **In `linting-tools.ts`**: Add tool definitions
   ```typescript
   {
     id: 'deno-lint',
     name: 'Deno Lint',
     file: 'deno.json',
     framework: 'Deno',
     recommended: true,
     scripts: { lint: 'deno lint' }
   }
   ```

4. **In `templates/linting/deno/`**: Add config templates

5. **In `templates/source/`**: Add `deno-CLAUDE.md.template`

### Add AI Agent

1. **Create template**: `templates/agents/{team}/{agent-name}.md.template`

2. **Update deploy.ts**: Add to agent deployment loop
   ```typescript
   { dir: 'team-name', agents: ['new-agent.md'] }
   ```

3. **Create command**: `.claude/commands/trinity-{agent}.md`

4. **Document**: Update `EMPLOYEE-DIRECTORY.md.template`

### Add Metric

1. **In `codebase-metrics.ts`**: Add collection function
   ```typescript
   async function countDeprecated(): Promise<number> {
     // Implementation
   }
   ```

2. **In `template-processor.ts`**: Add to metrics formatting
   ```typescript
   DEPRECATED_COUNT: String(metrics?.deprecatedCount ?? 'TBD')
   ```

3. **In templates**: Add `{{DEPRECATED_COUNT}}` placeholder

### Add Source Directory Pattern

1. **In `detect-stack.ts`**: Add to `COMMON_SOURCE_DIRS` or `NESTED_PATTERNS`
   ```typescript
   const COMMON_SOURCE_DIRS = [
     'src', 'lib', 'app', 'modules', // Add 'modules'
     ...
   ];

   const NESTED_PATTERNS: string[][] = [
     ['modules', 'src'],  // Add modules/src pattern
     ...
   ];
   ```

2. **Test**: Verify detection with test project structure

---

## Testing

### Manual Testing

1. **Create test project**:
   ```bash
   mkdir test-project && cd test-project
   npm init -y
   ```

2. **Run deployment**:
   ```bash
   npx trinity-method-sdk deploy --yes
   ```

3. **Verify**:
   - Check directory structure
   - Verify CLAUDE.md files in all source directories
   - Validate template variable interpolation
   - Test linting configuration
   - Run CI/CD workflow

### Unit Testing (Future)

```typescript
// Example test structure
describe('detectStack', () => {
  it('should detect React project', async () => {
    const stack = await detectStack('/path/to/react-project');
    expect(stack.framework).toBe('React');
    expect(stack.language).toBe('JavaScript/TypeScript');
  });

  it('should detect all source directories', async () => {
    const stack = await detectStack('/path/to/monorepo');
    expect(stack.sourceDirs).toContain('src');
    expect(stack.sourceDirs).toContain('src/backend');
    expect(stack.sourceDirs).toContain('src/frontend');
  });
});
```

### Integration Testing (Future)

Test complete deployment pipeline:
```bash
npm run test:integration
```

---

## Key Design Decisions

### Why Template Processing?

**Instead of**: Runtime code generation

**Rationale:**
- Easier to review and customize
- Human-readable configurations
- Version-controlled definitions
- Faster deployment

### Why Hybrid Metrics?

**Instead of**: Wait for agents

**Rationale:**
- Immediate deployment with partial data
- Reduce deployment time
- Provide baseline for improvements
- Allow users to start immediately

### Why 18 Agents?

**Instead of**: Monolithic agent

**Rationale:**
- Specialization improves effectiveness
- Parallel execution possible
- Clear responsibility separation
- Easier maintenance

### Why 2,270 Lines of Types?

**Instead of**: Loose `any` types

**Rationale:**
- Prevent interface duplication
- Single source of truth
- IDE autocomplete
- Catch errors at compile time

---

## Performance Optimization

### Current Optimizations

1. **Parallel Operations**:
   - Template reading parallelized
   - Independent file operations batched

2. **Lazy Loading**:
   - Templates loaded only when needed
   - Metrics collection optional (`--skip-audit`)

3. **Minimal Dependencies**:
   - Only 7 runtime dependencies
   - No heavy parsing libraries

### Future Optimizations

1. **Template Caching**: Pre-compile templates
2. **Incremental Updates**: Only update changed files
3. **Parallel Metrics**: Concurrent file analysis
4. **Streaming Processing**: Process large files in chunks

---

## Security Considerations

1. **No Arbitrary Code Execution**: Only file operations
2. **Template Injection-Safe**: Simple string replacement
3. **Dependency Versions Pinned**: Specific versions in catalog
4. **User Content Preserved**: Updates backup user files
5. **File Permissions**: Inherits OS defaults
6. **No External API Calls**: All local operations
7. **Dry-run Support**: Preview before execution

---

## Debugging

### Enable Debug Logging

```bash
LOG_LEVEL=debug npx trinity deploy
```

### Common Issues

**Issue:** Trinity already deployed
**Solution:** Use `--force` to redeploy
```bash
npx trinity deploy --force
```

**Issue:** Metrics collection slow
**Solution:** Skip audit for faster deployment
```bash
npx trinity deploy --skip-audit
```

**Issue:** Linting config conflicts
**Solution:** Review existing configs before deploying

---

## Contributing

### Code Style

- **TypeScript Strict Mode**: All modules
- **JSDoc Comments**: All public functions
- **Naming Conventions**: Clear, descriptive names
- **Single Responsibility**: Small, focused functions
- **Error Handling**: Try-catch with clear messages

### Pull Request Checklist

- [ ] All TypeScript compiles without errors
- [ ] JSDoc comments added
- [ ] No new linting errors
- [ ] Tested with multiple frameworks
- [ ] Updated this README if architecture changed

---

## Additional Resources

- **Main README**: [../README.md](../README.md)
- **Changelog**: [../CHANGELOG.md](../CHANGELOG.md)
- **Templates**: [templates/](templates/)
- **Type Definitions**: [shared/types/index.ts](shared/types/index.ts)

---

**Last Updated:** 2025-12-18
**Maintainer:** Trinity Method SDK Team
