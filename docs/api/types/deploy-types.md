# Deploy Types API Reference

**Module:** `src/cli/commands/deploy/types.ts`
**Purpose:** Deploy command shared type definitions
**Priority:** MEDIUM (Internal types)

---

## Overview

This module defines deploy-specific types used across deploy sub-modules. It re-exports
common types from `src/cli/types.ts` and adds deploy-specific interfaces for
configuration and progress tracking.

---

## Re-exported Types

The following types are re-exported from `src/cli/types.ts` for convenience:

- `DeployOptions`
- `Stack`
- `CodebaseMetrics`
- `LintingTool`
- `PostInstallInstruction`

See [CLI Types](cli-types.md) for their definitions.

---

## Deploy-Specific Types

### `DeployConfig`

Configuration collected during the interactive deploy setup phase.

```typescript
export interface DeployConfig {
  projectName: string; // Resolved project name
  stack: Stack; // Detected technology stack
  metrics: CodebaseMetrics; // Collected codebase metrics
  lintingTools: LintingTool[]; // Selected linting tools
  lintingDependencies: string[]; // npm packages for linting
  lintingScripts: Record<string, string>; // package.json scripts for linting
  postInstallInstructions: PostInstallInstruction[]; // Post-install instructions
  enableLinting: boolean; // Whether linting was enabled
  enableCICD: boolean; // Whether CI/CD was enabled
  enableWorkOrders: boolean; // Whether work orders were enabled
  enableInvestigations: boolean; // Whether investigations were enabled
  enableDocs: boolean; // Whether docs were enabled
}
```

**Used By:** Deploy configuration module, passed to all deploy sub-commands.

---

### `DeploymentProgress`

Statistics tracked during the deployment process.

```typescript
export interface DeploymentProgress {
  directories?: number; // Directories created
  agentsDeployed: number; // Agent files deployed
  commandsDeployed: number; // Command files deployed
  knowledgeBaseFiles: number; // Knowledge base files deployed
  templatesDeployed: number; // Template files deployed
  rootFilesDeployed: number; // Root-level files deployed (CLAUDE.md, etc.)
}
```

**Used By:** Deploy orchestrator to track and report deployment statistics.

---

### `Spinner`

Type alias for the Ora spinner instance.

```typescript
export type Spinner = Ora;
```

**Used By:** All deploy sub-modules receive a shared spinner for progress display.

---

## Related Documentation

- [CLI Types](cli-types.md) - Base type definitions
- [Deploy Command API](../deploy/deploy-command.md) - Deploy orchestration

---

**Last Updated:** 2026-02-23
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready)
