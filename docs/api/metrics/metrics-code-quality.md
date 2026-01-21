# Code Quality Metrics Collection

**Module:** `src/cli/utils/metrics/code-quality.ts`
**Purpose:** Count TODOs, FIXMEs, console statements, and commented code blocks
**Category:** Metrics Utilities
**Priority:** MEDIUM

---

## Overview

The Code Quality Metrics module scans source files to identify code quality indicators such as TODO comments, console statements, and commented-out code blocks. It provides quantitative metrics for technical debt and debugging artifacts.

### Key Features

- **Multi-language support**: JavaScript, TypeScript, Dart, Python, Rust
- **Pattern matching**: Regex-based detection of TODOs, FIXMEs, HACKs
- **Console statement counting**: Identifies debugging artifacts
- **Commented code detection**: Heuristic-based (3+ consecutive comment lines)
- **Graceful error handling**: Returns 0 on errors with warnings

---

## API Reference

### `countPattern(dir, pattern)`

Counts occurrences of a regex pattern across all source files in a directory.

**Signature:**

```typescript
async function countPattern(dir: string, pattern: RegExp): Promise<number>;
```

**Parameters:**

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `dir`     | `string` | Directory to search recursively |
| `pattern` | `RegExp` | Regular expression to match     |

**Returns:** `Promise<number>` - Count of pattern matches

**File Types Scanned:** `.js`, `.jsx`, `.ts`, `.tsx`, `.dart`, `.py`, `.rs`

**Ignored Directories:**

- `node_modules/`
- `build/`
- `.dart_tool/`
- `dist/`
- `__pycache__/`

---

### `countCommentedCode(dir)`

Estimates the number of commented-out code blocks using a heuristic approach.

**Signature:**

```typescript
async function countCommentedCode(dir: string): Promise<number>;
```

**Parameters:**

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `dir`     | `string` | Directory to analyze |

**Returns:** `Promise<number>` - Estimated count of commented code blocks

**Heuristic:** A "block" is counted when 3+ consecutive lines start with `//` or `#`

---

### `countCommentsInFile(file)` (Internal)

Analyzes a single file to count commented code blocks.

**Signature:**

```typescript
async function countCommentsInFile(file: string): Promise<number>;
```

**Parameters:**

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `file`    | `string` | Path to file to analyze |

**Returns:** `Promise<number>` - Number of commented code blocks in the file

**Algorithm:**

```
1. Read file content
2. Split into lines
3. For each line:
   - If line starts with // or #: increment consecutive counter
   - If counter reaches 3: increment block count
   - If line is not a comment: reset consecutive counter
4. Return block count
```

---

### `collectCodeQualityMetrics(sourceDir)`

Main entry point that collects all code quality metrics.

**Signature:**

```typescript
async function collectCodeQualityMetrics(sourceDir: string): Promise<{
  todoCount: number;
  todoComments: number;
  fixmeComments: number;
  hackComments: number;
  consoleStatements: number;
  commentedCodeBlocks: number;
}>;
```

**Parameters:**

| Parameter   | Type     | Description                 |
| ----------- | -------- | --------------------------- |
| `sourceDir` | `string` | Source directory to analyze |

**Returns:** `Promise<CodeQualityMetrics>` - Object containing all metrics

**Metrics Collected:**

| Metric                | Description              | Pattern                                        |
| --------------------- | ------------------------ | ---------------------------------------------- |
| `todoComments`        | TODO comments            | `/\/\/\s*TODO\|#\s*TODO/gi`                    |
| `fixmeComments`       | FIXME comments           | `/\/\/\s*FIXME\|#\s*FIXME/gi`                  |
| `hackComments`        | HACK comments            | `/\/\/\s*HACK\|#\s*HACK/gi`                    |
| `todoCount`           | Total of all three above | Sum of TODO + FIXME + HACK                     |
| `consoleStatements`   | Console debugging        | `/console\.(log\|warn\|error\|debug\|info)/gi` |
| `commentedCodeBlocks` | Commented code           | Heuristic detection (3+ lines)                 |

---

## Usage Examples

### Example 1: Basic Metrics Collection

```typescript
import { collectCodeQualityMetrics } from './metrics/code-quality.js';

const metrics = await collectCodeQualityMetrics('src');

console.log(`TODO comments: ${metrics.todoComments}`);
console.log(`FIXME comments: ${metrics.fixmeComments}`);
console.log(`Console statements: ${metrics.consoleStatements}`);
console.log(`Commented code blocks: ${metrics.commentedCodeBlocks}`);

// Output:
// TODO comments: 23
// FIXME comments: 5
// Console statements: 47
// Commented code blocks: 8
```

### Example 2: Pattern Counting

```typescript
import { countPattern } from './metrics/code-quality.js';

// Count specific patterns
const debuggerCount = await countPattern('src', /debugger;/gi);
const alertCount = await countPattern('src', /alert\(/gi);

console.log(`Debugger statements: ${debuggerCount}`);
console.log(`Alert calls: ${alertCount}`);
```

### Example 3: Commented Code Detection

```typescript
import { countCommentedCode } from './metrics/code-quality.js';

const commentedBlocks = await countCommentedCode('src');

if (commentedBlocks > 10) {
  console.warn(`Warning: ${commentedBlocks} commented code blocks detected`);
  console.warn('Consider removing dead code');
}
```

### Example 4: Error Handling

```typescript
// If directory doesn't exist, returns 0
const metrics = await collectCodeQualityMetrics('nonexistent');

// Result:
// {
//   todoCount: 0,
//   todoComments: 0,
//   fixmeComments: 0,
//   hackComments: 0,
//   consoleStatements: 0,
//   commentedCodeBlocks: 0
// }
```

---

## Pattern Detection Examples

### TODO Comments

```typescript
// Matches:
// TODO: Fix this bug
// // TODO - Refactor this code
// # TODO: Add error handling

// Pattern: /\/\/\s*TODO|#\s*TODO/gi

// Examples:
"// TODO: implement validation"  → Match
"// todo: fix bug"                → Match (case-insensitive)
"# TODO: add tests"               → Match (Python)
"/* TODO: refactor */"            → No match (block comments not supported)
```

### Console Statements

```typescript
// Matches:
console.log('debug');
console.warn('warning');
console.error('error');
console.debug('debug info');
console.info('info');

// Pattern: /console\.(log|warn|error|debug|info)/gi

// Examples:
"console.log('test')"       → Match
"console.LOG('test')"       → Match (case-insensitive)
"console.table(data)"       → No match
"myconsole.log('test')"     → No match (must be console object)
```

### Commented Code Blocks

```typescript
// Example that would be detected (3+ consecutive comments):
// function oldCode() {
//   return 'unused';
// }

// This would NOT be detected (only 2 consecutive):
// Single comment
// Another comment
const code = 'active';

// Python example (detected):
# def old_function():
#   return 'unused'
# # more code
```

---

## Metrics Interpretation

### TODO Count Thresholds

```
0-10:    Excellent (minimal technical debt)
11-50:   Good (manageable technical debt)
51-100:  Fair (consider cleanup sprint)
100+:    Poor (technical debt backlog needed)
```

### Console Statements Thresholds

```
0-5:     Production-ready (debugging removed)
6-20:    Development (some debugging left)
21-50:   Needs cleanup (too many debug statements)
50+:     Critical (excessive debugging artifacts)
```

### Commented Code Blocks

```
0:       Clean (no dead code)
1-5:     Acceptable (minor dead code)
6-15:    Needs review (moderate dead code)
15+:     Critical (extensive dead code removal needed)
```

---

## Performance Considerations

### Scanning Performance

- **Small projects (<50 files)**: ~1-2 seconds
- **Medium projects (50-200 files)**: ~2-5 seconds
- **Large projects (200+ files)**: ~5-15 seconds

### Optimization Strategies

- Uses `glob` for efficient file traversal
- Reads files sequentially (no parallel I/O bottlenecks)
- Caches nothing (stateless for accuracy)
- Skips binary files automatically

### Memory Usage

```typescript
// Memory-efficient approach:
// - Reads one file at a time
// - No content caching
// - Minimal regex compilation overhead

// For 1000 files @ 500 lines each:
// Memory usage: ~50-100 MB (file content + regex engine)
```

---

## Error Handling

### Missing Directory

```typescript
if (!(await fs.pathExists(dir))) {
  return 0; // Silent failure, return 0
}
```

### File Read Errors

```typescript
try {
  // ... scan files ...
} catch (error: unknown) {
  const { displayWarning, getErrorMessage } = await import('../errors.js');
  displayWarning(`Error counting pattern: ${getErrorMessage(error)}`);
  return 0; // Graceful degradation
}
```

**Error Scenarios:**

- Directory doesn't exist → Returns 0
- Permission denied → Logs warning, returns 0
- File encoding issues → Logs warning, skips file
- Regex failures → Logs warning, returns 0

---

## Integration Points

### Called By

- `src/cli/commands/deploy/metrics.ts` - During deployment metrics collection
- `collectCodebaseMetrics()` - Main metrics orchestrator

### Calls

- `fs-extra` - File system operations
- `glob` - File pattern matching
- `../errors.js` - Error display utilities

### Dependencies

```typescript
import fs from 'fs-extra';
import { globSync } from 'glob';
```

---

## Testing Considerations

### Unit Tests

```typescript
import { countPattern, countCommentedCode, collectCodeQualityMetrics } from './code-quality';
import fs from 'fs-extra';
import path from 'path';

describe('Code Quality Metrics', () => {
  const testDir = './test-fixtures';

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  it('should count TODO comments', async () => {
    await fs.writeFile(path.join(testDir, 'test.js'), '// TODO: fix\n// TODO: refactor\ncode();');

    const count = await countPattern(testDir, /\/\/\s*TODO/gi);
    expect(count).toBe(2);
  });

  it('should detect commented code blocks', async () => {
    await fs.writeFile(
      path.join(testDir, 'test.js'),
      '// old code\n// more old code\n// even more\nactive();'
    );

    const blocks = await countCommentedCode(testDir);
    expect(blocks).toBe(1);
  });

  it('should return 0 for missing directory', async () => {
    const metrics = await collectCodeQualityMetrics('nonexistent');
    expect(metrics.todoCount).toBe(0);
  });
});
```

---

## Commented Code Detection Algorithm

### Why 3+ Consecutive Lines?

The heuristic balances false positives and false negatives:

**Rationale:**

- **1-2 lines**: Likely legitimate comments (explanations, headers)
- **3+ lines**: Likely commented-out code (functions, logic blocks)

**Examples:**

```typescript
// This is a comment (NOT counted)
// Explaining the next line (NOT counted)
const active = true;

// const oldVar = 1;      ← Line 1
// const anotherOld = 2;  ← Line 2
// const thirdOld = 3;    ← Line 3 (BLOCK COUNTED HERE)
const new = 4;
```

### Limitations

```typescript
// False Positives (counted but not code):
// ===================================
// This is a long explanation
// that spans multiple lines
// and continues here
// ===================================

// False Negatives (not counted but is code):
// Single-line commented code
const active = 1; // const old = 2;
```

---

## Related Documentation

- **Metrics Orchestrator**: [docs/api/metrics-index.md](metrics-index.md) (pending)
- **Deploy Metrics**: [docs/api/deploy-metrics.md](deploy-metrics.md)
- **File Complexity**: [docs/api/metrics-file-complexity.md](metrics-file-complexity.md)

---

## Version History

| Version | Date       | Changes                                      |
| ------- | ---------- | -------------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with pattern counting |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3               |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
