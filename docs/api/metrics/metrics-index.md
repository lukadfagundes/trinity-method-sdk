# Metrics Orchestrator API Reference

**Module:** `src/cli/utils/metrics/index.ts`
**Purpose:** Main orchestrator for codebase metrics collection
**Priority:** MEDIUM (Utility module)

---

## Overview

The metrics orchestrator coordinates all metrics collection sub-modules to produce a comprehensive `CodebaseMetrics` object. It collects code quality metrics, file complexity, dependency information, git history, and framework-specific data.

---

## Exported Functions

### `collectCodebaseMetrics(sourceDir, framework): Promise<CodebaseMetrics>`

Main entry point for metrics collection.

**Parameters:**

| Parameter   | Type     | Description                                               |
| ----------- | -------- | --------------------------------------------------------- |
| `sourceDir` | `string` | Source code directory (e.g., `src/`, `lib/`, `app/`)      |
| `framework` | `string` | Detected framework (e.g., `Node.js`, `Flutter`, `Python`) |

**Returns:** `Promise<CodebaseMetrics>` - Complete metrics object

**Collection Sequence:**

1. Code Quality Metrics → `collectCodeQualityMetrics(sourceDir)`
2. File Complexity Metrics → `analyzeFileComplexity(sourceDir)`
3. Dependency Metrics → `parseDependencies(framework)`
4. Git Metrics → `collectGitMetrics()` (optional, graceful on failure)
5. Framework-Specific → `detectFrameworkVersion(framework)`, `detectPackageManager()`

**Error Handling:**

- Git metrics failure is non-fatal (logs warning, continues)
- All other failures throw the error after logging

---

### `createEmptyMetrics(): CodebaseMetrics`

Creates a default `CodebaseMetrics` object with zero/empty values.

**Returns:** `CodebaseMetrics` with all numeric fields set to `0`, string fields set to `'Unknown'`, and collection fields set to empty arrays/objects.

**Used By:** Deploy command when `--skip-audit` flag is set (skips metrics collection, uses empty metrics).

---

## Re-exports

The orchestrator re-exports sub-module functions for backward compatibility:

| Export                         | Source Module             |
| ------------------------------ | ------------------------- |
| `analyzeFileComplexity`        | `./file-complexity.js`    |
| `parseDependencies`            | `./dependency-parser.js`  |
| `detectFrameworkVersion`       | `./framework-detector.js` |
| `detectPackageManager`         | `./framework-detector.js` |
| `countPattern`                 | `./code-quality.js`       |
| `FileComplexityMetrics` (type) | `./file-complexity.js`    |
| `DependencyMetrics` (type)     | `./dependency-parser.js`  |

---

## Sub-Modules

| Module                  | Function                                             | Purpose                                 |
| ----------------------- | ---------------------------------------------------- | --------------------------------------- |
| `code-quality.ts`       | `collectCodeQualityMetrics()`                        | TODO/FIXME/HACK/console counts          |
| `file-complexity.ts`    | `analyzeFileComplexity()`                            | File count, size distribution, averages |
| `dependency-parser.ts`  | `parseDependencies()`                                | Production and dev dependency counts    |
| `git-metrics.ts`        | `collectGitMetrics()`                                | Commit count, contributors, last commit |
| `framework-detector.ts` | `detectFrameworkVersion()`, `detectPackageManager()` | Framework version and package manager   |

---

## Related Documentation

- [Code Quality Metrics](metrics-code-quality.md) - Code quality sub-module
- [File Complexity Metrics](metrics-file-complexity.md) - File complexity sub-module
- [Dependency Parser](metrics-dependency-parser.md) - Dependency parsing sub-module
- [Git Metrics](metrics-git.md) - Git metrics sub-module
- [Framework Detector](metrics-framework-detector.md) - Framework detection sub-module
- [CLI Types](../types/cli-types.md) - `CodebaseMetrics` interface definition

---

**Last Updated:** 2026-02-23
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready)
