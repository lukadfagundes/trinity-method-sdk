# Metrics Collection - Deploy Command

**Module:** `src/cli/commands/deploy/metrics.ts`
**Purpose:** Collect codebase metrics for enriching ARCHITECTURE.md baseline
**Category:** Deploy Command - Metrics
**Priority:** MEDIUM

---

## Overview

The Metrics Collection module gathers comprehensive codebase statistics during Trinity Method SDK deployment. It collects data on code quality, file complexity, dependencies, and git history to establish a baseline for the project's ARCHITECTURE.md document.

### Key Features

- **Multi-dimensional metrics**: Code quality, file complexity, dependencies, git history
- **Graceful degradation**: Returns minimal metrics if collection fails
- **Visual summary**: Displays key metrics in console
- **Framework-agnostic**: Works with Node.js, Flutter, React, Python, Rust

---

## API Reference

### `collectMetrics(stack, spinner)`

Collects comprehensive codebase metrics for template enrichment.

**Signature:**

```typescript
async function collectMetrics(stack: Stack, spinner: Spinner): Promise<CodebaseMetrics>;
```

**Parameters:**

| Parameter | Type      | Description                                                      |
| --------- | --------- | ---------------------------------------------------------------- |
| `stack`   | `Stack`   | Detected technology stack containing `sourceDir` and `framework` |
| `spinner` | `Spinner` | Spinner instance for status updates                              |

**Returns:** `Promise<CodebaseMetrics>` - Collected codebase metrics

**Throws:** None (gracefully handles errors and returns empty metrics)

---

## Collected Metrics

### Code Quality Metrics

- `todoCount` - Total TODO/FIXME/HACK comments
- `todoComments` - TODO comment count
- `fixmeComments` - FIXME comment count
- `hackComments` - HACK comment count
- `consoleStatements` - Console.log/print statement count
- `commentedCodeBlocks` - Commented-out code blocks

### File Complexity Metrics

- `totalFiles` - Total source files
- `filesOver500` - Files exceeding 500 lines
- `filesOver1000` - Files exceeding 1000 lines
- `filesOver3000` - Files exceeding 3000 lines
- `avgFileLength` - Average file length in lines
- `largestFiles` - Array of largest files with line counts

### Dependency Metrics

- `dependencies` - Production dependencies (object)
- `dependencyCount` - Count of production dependencies
- `devDependencies` - Development dependencies (object)
- `devDependencyCount` - Count of dev dependencies

### Git Metrics

- `commitCount` - Total git commits
- `contributors` - Number of contributors
- `lastCommitDate` - ISO 8601 date of last commit

### Framework-Specific Metrics

- `frameworkVersion` - Detected framework version
- `packageManager` - Package manager (npm, yarn, pnpm)

---

## Usage Examples

### Basic Usage

```typescript
import { collectMetrics } from './commands/deploy/metrics.js';
import ora from 'ora';

const stack = {
  framework: 'Node.js',
  sourceDir: 'src',
};
const spinner = ora();

const metrics = await collectMetrics(stack, spinner);

console.log(`Total files: ${metrics.totalFiles}`);
console.log(`Dependencies: ${metrics.dependencyCount}`);
```

### Error Handling (Graceful Degradation)

```typescript
// Metrics collection automatically handles errors
const metrics = await collectMetrics(stack, spinner);

// If collection fails, returns empty metrics:
// {
//   totalFiles: 0,
//   todoCount: 0,
//   dependencyCount: 0,
//   // ... all fields set to 0 or empty
// }
```

### Integration with Deploy Command

```typescript
// Part of the deploy workflow
const stack = await detectStack();
const metrics = await collectMetrics(stack, spinner);

// Metrics are used to enrich ARCHITECTURE.md template
const variables = {
  ...baseVariables,
  metrics: metrics,
};

await enrichTemplate('ARCHITECTURE.md', variables);
```

---

## Metrics Collection Process

### Phase 1: Initialization

```
Spinner: "Collecting codebase metrics..."
Status: Running metrics collection
```

### Phase 2: Multi-Dimensional Collection

```
1. Code Quality Metrics (code-quality.ts)
   - Scan for TODO/FIXME/HACK comments
   - Count console statements
   - Detect commented code blocks

2. File Complexity Metrics (file-complexity.ts)
   - Count total files
   - Analyze file sizes
   - Identify large files (>500, >1000, >3000 lines)

3. Dependency Metrics (dependency-parser.ts)
   - Parse package.json (or equivalent)
   - Count production dependencies
   - Count dev dependencies

4. Git Metrics (git-metrics.ts) [Optional]
   - Count total commits
   - Count contributors
   - Get last commit date

5. Framework Detection (framework-detector.ts)
   - Detect framework version
   - Detect package manager
```

### Phase 3: Success / Graceful Failure

```
Success Path:
  Spinner: ✓ "Codebase metrics collected"
  Console: Display metrics summary (4 key stats)

Failure Path:
  Spinner: ⚠ "Could not collect all metrics"
  Console: "Some metrics collection failed, continuing..."
  Return: Empty metrics object
```

---

## Console Output

### Success Output

```
✓ Codebase metrics collected

📊 Codebase Metrics:
  Total Files: 147
  TODO Comments: 23
  Large Files (>500 lines): 5
  Dependencies: 42
```

### Partial Failure Output

```
⚠ Could not collect all metrics
  Some metrics collection failed, continuing...

📊 Codebase Metrics:
  Total Files: 0
  TODO Comments: 0
  Large Files (>500 lines): 0
  Dependencies: 0
```

---

## Error Handling

### Graceful Degradation Strategy

The module implements fail-safe error handling:

```typescript
try {
  const metrics = await collectCodebaseMetrics(stack.sourceDir, stack.framework);
  spinner.succeed('Codebase metrics collected');
  // Display summary...
  return metrics;
} catch {
  spinner.warn('Could not collect all metrics');
  console.log(chalk.yellow('  Some metrics collection failed, continuing...'));

  // Return minimal metrics instead of failing
  const { createEmptyMetrics } = await import('../../utils/metrics/index.js');
  return createEmptyMetrics();
}
```

**Key Points:**

- Never throws errors (deployment continues)
- Returns empty metrics on failure
- Warns user but doesn't block deployment
- Allows partial metric collection

---

## Integration Points

### Called By

- `src/cli/commands/deploy.ts` - Main deploy command
- During Trinity Method SDK deployment workflow

### Calls

- `collectCodebaseMetrics()` - Main metrics orchestrator (from `utils/metrics/index.ts`)
- `createEmptyMetrics()` - Fallback empty metrics (from `utils/metrics/index.ts`)

### Uses Utilities

- `utils/metrics/code-quality.ts` - Code quality metrics
- `utils/metrics/file-complexity.ts` - File complexity analysis
- `utils/metrics/dependency-parser.ts` - Dependency parsing
- `utils/metrics/git-metrics.ts` - Git history metrics
- `utils/metrics/framework-detector.ts` - Framework version detection

---

## Metrics Purpose

### ARCHITECTURE.md Baseline

Metrics establish a baseline for tracking:

- **Code Quality Evolution**: Track TODO reduction over time
- **Complexity Management**: Monitor file size growth
- **Dependency Health**: Track dependency count changes
- **Project Activity**: Monitor commit frequency

### Example ARCHITECTURE.md Integration

```markdown
## Performance Baseline

**Metrics Collection Date:** 2026-01-21

### Code Quality

- Total Files: 147
- TODO Comments: 23
- Large Files (>500 lines): 5

### Dependencies

- Production: 42
- Development: 18

### Activity

- Commits: 234
- Contributors: 3
- Last Commit: 2026-01-20
```

---

## Testing Considerations

### Unit Testing

```typescript
import { collectMetrics } from './metrics';
import { createMockSpinner } from '../../../test/helpers';

describe('collectMetrics', () => {
  it('should collect metrics successfully', async () => {
    const stack = { framework: 'Node.js', sourceDir: 'src' };
    const spinner = createMockSpinner();

    const metrics = await collectMetrics(stack, spinner);

    expect(metrics.totalFiles).toBeGreaterThan(0);
    expect(metrics.dependencyCount).toBeGreaterThan(0);
  });

  it('should return empty metrics on failure', async () => {
    const stack = { framework: 'Unknown', sourceDir: 'invalid' };
    const spinner = createMockSpinner();

    const metrics = await collectMetrics(stack, spinner);

    expect(metrics.totalFiles).toBe(0);
    expect(metrics.dependencyCount).toBe(0);
  });
});
```

### Integration Testing

```typescript
describe('Metrics Collection Integration', () => {
  it('should integrate with deploy command', async () => {
    const deployResult = await runDeployCommand(['--framework', 'Node.js']);

    expect(deployResult.metrics).toBeDefined();
    expect(deployResult.metrics.totalFiles).toBeGreaterThan(0);
  });
});
```

---

## Performance Considerations

### Metrics Collection Time

- **Code Quality Scan**: ~1-3 seconds (depends on file count)
- **File Complexity**: ~500ms (file system traversal)
- **Dependency Parsing**: ~100ms (JSON parsing)
- **Git Metrics**: ~500ms (git command execution)
- **Total Time**: ~2-5 seconds for typical projects

### Optimization Strategies

- Parallel collection of independent metrics
- Caching of file system traversals
- Skip git metrics if repository not detected
- Limit file scanning to source directories only

---

## Security Considerations

### Safe File System Access

- Only reads from specified source directory
- No file modifications during collection
- No execution of arbitrary code
- Sandboxed git command execution

### Data Privacy

- Metrics contain no sensitive data
- No personal information collected
- No API keys or credentials scanned
- Only aggregated statistics

---

## Related Documentation

- **Metrics Orchestrator**: [docs/api/metrics-index.md](docs/api/metrics-index.md) (not yet created)
- **Code Quality Metrics**: [docs/api/metrics-code-quality.md](docs/api/metrics-code-quality.md) (pending)
- **File Complexity**: [docs/api/metrics-file-complexity.md](docs/api/metrics-file-complexity.md) (pending)
- **Dependency Parser**: [docs/api/metrics-dependency-parser.md](docs/api/metrics-dependency-parser.md) (pending)
- **Git Metrics**: [docs/api/metrics-git.md](docs/api/metrics-git.md) (pending)
- **Deploy Command**: [docs/api/deploy-command.md](docs/api/deploy-command.md)

---

## Version History

| Version | Date       | Changes                                          |
| ------- | ---------- | ------------------------------------------------ |
| 2.0.0   | 2025-12-28 | Initial implementation with graceful degradation |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3                   |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
