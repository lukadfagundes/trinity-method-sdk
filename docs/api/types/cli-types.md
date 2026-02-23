# CLI Types API Reference

**Module:** `src/cli/types.ts`
**Purpose:** Central type definitions for all CLI commands and shared interfaces
**Priority:** HIGH (Core types)

---

## Overview

This module contains all canonical TypeScript interface definitions used across the Trinity CLI. It is the single source of truth for command option types, stack detection types, codebase metrics, and deployment statistics.

---

## Command Option Types

### `DeployOptions`

Options for the `trinity deploy` command.

```typescript
export interface DeployOptions {
  name?: string; // Project name (--name flag)
  yes?: boolean; // Skip confirmation prompts (--yes)
  dryRun?: boolean; // Preview mode (--dry-run)
  force?: boolean; // Overwrite existing deployment (--force)
  skipAudit?: boolean; // Skip metrics collection (--skip-audit)
  ciDeploy?: boolean; // Deploy CI/CD templates (--ci-deploy)
  lintingTools?: LintingTool[]; // Selected linting tools (set during config)
  lintingDependencies?: string[]; // npm packages for linting (derived)
  lintingScripts?: Record<string, string>; // package.json scripts for linting (derived)
  postInstallInstructions?: PostInstallInstruction[]; // Post-install instructions (derived)
}
```

**CLI Flag Mapping:**

| Interface Field | CLI Flag        | Commander Type |
| --------------- | --------------- | -------------- |
| `name`          | `--name <name>` | `string`       |
| `yes`           | `--yes`         | `boolean`      |
| `dryRun`        | `--dry-run`     | `boolean`      |
| `force`         | `--force`       | `boolean`      |
| `skipAudit`     | `--skip-audit`  | `boolean`      |
| `ciDeploy`      | `--ci-deploy`   | `boolean`      |

**Note:** `lintingTools`, `lintingDependencies`, `lintingScripts`, and `postInstallInstructions` are not CLI flags. They are populated during the interactive configuration phase.

---

### `UpdateOptions`

Options for the `trinity update` command.

```typescript
export interface UpdateOptions {
  all?: boolean; // Update all registered Trinity projects (--all)
  dryRun?: boolean; // Preview mode (--dry-run)
  force?: boolean; // Force update even if up to date (--force)
}
```

---

## Linting Types

### `LintingTool`

Represents a linting tool configuration.

```typescript
export interface LintingTool {
  id: string; // Unique identifier (e.g., 'eslint')
  name: string; // Display name (e.g., 'ESLint')
  file: string; // Config filename (e.g., 'eslint.config.js')
  description?: string; // Human-readable description
  template?: string; // Template filename for config generation
  framework?: string; // Framework this tool applies to
  language?: string; // Language this tool applies to
  recommended?: boolean; // Whether this is the recommended tool
  dependencies?: string[]; // npm packages to install
  scripts?: Record<string, string>; // package.json scripts to add
  requiresTypeScript?: boolean; // Whether TypeScript config is needed
  postInstall?: string; // Post-install instruction text
}
```

---

### `PostInstallInstruction`

Represents a post-install command to display to the user.

```typescript
export interface PostInstallInstruction {
  command: string; // Shell command to run
  description?: string; // Human-readable description
}
```

---

## Stack Detection Types

### `Stack`

Represents a detected project technology stack.

```typescript
export interface Stack {
  framework: string; // Detected framework (e.g., 'Next.js', 'Flask', 'Generic')
  language: string; // Programming language (e.g., 'JavaScript/TypeScript', 'Python')
  sourceDir: string; // Primary source directory (e.g., 'src', 'lib', 'app')
  sourceDirs: string[]; // All detected source directories (monorepo support)
  packageManager?: string; // Package manager (e.g., 'npm', 'yarn', 'pnpm')
}
```

**Used By:** `detectStack()` in `src/cli/utils/detect-stack.ts`

---

## Metrics Types

### `CodebaseMetrics`

Comprehensive codebase metrics collected during deployment.

```typescript
export interface CodebaseMetrics {
  // Code Quality Metrics
  todoCount: number;
  todoComments: number;
  fixmeComments: number;
  hackComments: number;
  consoleStatements: number;
  commentedCodeBlocks: number;

  // File Complexity Metrics
  totalFiles: number;
  filesOver500: number;
  filesOver1000: number;
  filesOver3000: number;
  avgFileLength: number;
  largestFiles: Array<{ file: string; lines: number }>;

  // Dependency Metrics
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

**Used By:** `collectCodebaseMetrics()` in `src/cli/utils/metrics/index.ts`

---

### `DeploymentStats`

Summary statistics for a completed deployment.

```typescript
export interface DeploymentStats {
  agents: number; // Number of agent files deployed
  templates: number; // Number of template files deployed
  directories: number; // Number of directories created
  files: number; // Total files deployed
}
```

---

## Related Documentation

- [CLI Entry Point](../cli-entry-point.md) - Command registration using these types
- [Deploy Types](deploy-types.md) - Deploy-specific extended types
- [Update Types](update-types.md) - Update-specific extended types
- [Deploy Command API](../deploy/deploy-command.md) - Deploy implementation
- [Update Command API](../update/update-command.md) - Update implementation

---

**Last Updated:** 2026-02-23
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready)
