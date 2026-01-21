# File Complexity Metrics Collection

**Module:** `src/cli/utils/metrics/file-complexity.ts`
**Purpose:** Analyze file counts, line counts, and identify large files
**Category:** Metrics Utilities
**Priority:** MEDIUM

---

## Overview

The File Complexity Metrics module analyzes source code files to identify complexity indicators such as file count, line count, and large files. It provides quantitative metrics for assessing codebase maintainability and identifying refactoring candidates.

### Key Features

- **Multi-language support**: JavaScript, TypeScript, Dart, Python, Rust
- **Size categorization**: Tracks files >500, >1000, >3000 lines
- **Largest file identification**: Returns top 10 largest files
- **Average file length calculation**: Provides maintainability baseline
- **Graceful error handling**: Returns empty metrics on failures

---

## API Reference

### `analyzeFileComplexity(dir)`

Main entry point that analyzes file complexity metrics for a directory.

**Signature:**

```typescript
async function analyzeFileComplexity(dir: string): Promise<FileComplexityMetrics>;
```

**Parameters:**

| Parameter | Type     | Description                      |
| --------- | -------- | -------------------------------- |
| `dir`     | `string` | Directory to analyze recursively |

**Returns:** `Promise<FileComplexityMetrics>`

```typescript
interface FileComplexityMetrics {
  totalFiles: number; // Total source files
  filesOver500: number; // Files > 500 lines
  filesOver1000: number; // Files > 1000 lines
  filesOver3000: number; // Files > 3000 lines
  avgFileLength: number; // Average lines per file
  largestFiles: Array<{ file: string; lines: number }>; // Top 10 largest
}
```

**File Types Analyzed:** `.js`, `.jsx`, `.ts`, `.tsx`, `.dart`, `.py`, `.rs`

**Ignored Directories:**

- `node_modules/`
- `build/`
- `.dart_tool/`
- `dist/`
- `__pycache__/`

---

## Usage Examples

### Example 1: Basic Complexity Analysis

```typescript
import { analyzeFileComplexity } from './metrics/file-complexity.js';

const metrics = await analyzeFileComplexity('src');

console.log(`Total files: ${metrics.totalFiles}`);
console.log(`Files over 500 lines: ${metrics.filesOver500}`);
console.log(`Files over 1000 lines: ${metrics.filesOver1000}`);
console.log(`Average file length: ${metrics.avgFileLength} lines`);

// Output:
// Total files: 147
// Files over 500 lines: 8
// Files over 1000 lines: 2
// Average file length: 245 lines
```

### Example 2: Identify Largest Files

```typescript
const metrics = await analyzeFileComplexity('src');

console.log('\nTop 10 Largest Files:');
metrics.largestFiles.forEach((file, index) => {
  console.log(`${index + 1}. ${file.file} (${file.lines} lines)`);
});

// Output:
// Top 10 Largest Files:
// 1. commands/deploy.ts (1847 lines)
// 2. utils/template-processor.ts (1245 lines)
// 3. cli/index.ts (892 lines)
// ...
```

### Example 3: Refactoring Recommendations

```typescript
const metrics = await analyzeFileComplexity('src');

if (metrics.filesOver1000 > 0) {
  console.warn(`Warning: ${metrics.filesOver1000} files exceed 1000 lines`);
  console.warn('Consider refactoring:');

  const largeCandidates = metrics.largestFiles.filter((f) => f.lines > 1000);
  largeCandidates.forEach((file) => {
    console.warn(`  - ${file.file} (${file.lines} lines)`);
  });
}
```

### Example 4: Calculate Complexity Score

```typescript
const metrics = await analyzeFileComplexity('src');

// Simple complexity scoring algorithm
const complexityScore =
  metrics.filesOver500 * 1 + metrics.filesOver1000 * 3 + metrics.filesOver3000 * 10;

console.log(`Complexity Score: ${complexityScore}`);

if (complexityScore > 50) {
  console.warn('High complexity detected - refactoring recommended');
}
```

---

## File Size Thresholds

### Size Categories

| Category   | Lines     | Interpretation                |
| ---------- | --------- | ----------------------------- |
| Small      | 0-500     | Good maintainability          |
| Medium     | 501-1000  | Acceptable, watch closely     |
| Large      | 1001-3000 | Consider refactoring          |
| Very Large | 3000+     | Critical - requires splitting |

### Maintainability Guidelines

**Ideal Average File Length:**

- **Frontend**: 100-300 lines
- **Backend**: 150-400 lines
- **Utilities**: 50-200 lines
- **Tests**: 100-500 lines

**Red Flags:**

```
avgFileLength > 500:  Code smell - files too large
filesOver1000 > 10:   Refactoring backlog needed
filesOver3000 > 0:    Critical - immediate attention required
```

---

## Metrics Collection Process

### Phase 1: File Discovery

```typescript
const files = globSync(`${dir}/**/*.{js,jsx,ts,tsx,dart,py,rs}`, {
  ignore: [
    '**/node_modules/**',
    '**/build/**',
    '**/.dart_tool/**',
    '**/dist/**',
    '**/__pycache__/**',
  ],
});
```

**Result:** List of all source files (excluding build artifacts and dependencies)

---

### Phase 2: Line Counting

```typescript
for (const file of files) {
  const content = await fs.readFile(file, 'utf8');
  const lineCount = content.split('\n').length;
  totalLines += lineCount;

  fileSizes.push({ file: path.relative(dir, file), lines: lineCount });

  // Categorize by size
  if (lineCount > 500) filesOver500++;
  if (lineCount > 1000) filesOver1000++;
  if (lineCount > 3000) filesOver3000++;
}
```

**Result:** Each file categorized by size, total line count accumulated

---

### Phase 3: Sorting and Statistics

```typescript
// Sort by size descending
fileSizes.sort((a, b) => b.lines - a.lines);

// Get top 10 largest
const largestFiles = fileSizes.slice(0, 10);

// Calculate average
const avgFileLength = files.length > 0 ? Math.round(totalLines / files.length) : 0;
```

**Result:** Sorted file list, top 10 largest files, average file length

---

## Analysis Algorithm Details

### Line Counting Method

```typescript
// Simple newline counting
const lineCount = content.split('\n').length;

// Why this approach:
// - Simple and fast
// - Consistent across platforms (handles \n, \r\n)
// - Includes blank lines (intentional for maintainability metrics)
// - Includes comments (part of file complexity)
```

**Alternative Approaches NOT Used:**

```typescript
// Excluding blank lines (not used - blank lines affect readability)
const nonBlankLines = content.split('\n').filter((line) => line.trim()).length;

// Excluding comments (not used - comments affect file length)
const codeOnlyLines = removeComments(content).split('\n').length;
```

---

### Relative Path Calculation

```typescript
fileSizes.push({ file: path.relative(dir, file), lines: lineCount });

// Example:
// Absolute: /project/src/utils/helper.ts
// Relative: utils/helper.ts
```

**Rationale:**

- Shorter paths in output
- Works across different project structures
- Platform-independent (path.relative handles OS differences)

---

## Output Examples

### Example Output Structure

```typescript
{
  totalFiles: 147,
  filesOver500: 8,
  filesOver1000: 2,
  filesOver3000: 0,
  avgFileLength: 245,
  largestFiles: [
    { file: 'commands/deploy.ts', lines: 1847 },
    { file: 'utils/template-processor.ts', lines: 1245 },
    { file: 'cli/index.ts', lines: 892 },
    { file: 'commands/update.ts', lines: 756 },
    { file: 'utils/metrics/index.ts', lines: 654 },
    { file: 'utils/detect-stack.ts', lines: 487 },
    { file: 'utils/validate-path.ts', lines: 423 },
    { file: 'commands/deploy/metrics.ts', lines: 398 },
    { file: 'utils/errors.ts', lines: 345 },
    { file: 'utils/template-processor.ts', lines: 312 }
  ]
}
```

---

## Error Handling

### Missing Directory

```typescript
if (!(await fs.pathExists(dir))) {
  return {
    totalFiles: 0,
    filesOver500: 0,
    filesOver1000: 0,
    filesOver3000: 0,
    avgFileLength: 0,
    largestFiles: [],
  };
}
```

**Behavior:** Returns empty metrics (all zeros)

---

### File Read Errors

```typescript
try {
  // ... analyze files ...
} catch (error: unknown) {
  const { displayWarning, getErrorMessage } = await import('../errors.js');
  displayWarning(`Error analyzing file complexity: ${getErrorMessage(error)}`);
  return {
    totalFiles: 0,
    filesOver500: 0,
    filesOver1000: 0,
    filesOver3000: 0,
    avgFileLength: 0,
    largestFiles: [],
  };
}
```

**Error Scenarios:**

- Directory doesn't exist → Returns empty metrics
- Permission denied → Logs warning, returns empty metrics
- File encoding issues → Logs warning, returns empty metrics
- Glob failures → Logs warning, returns empty metrics

---

## Performance Considerations

### Analysis Performance

- **Small projects (<50 files)**: ~200-500ms
- **Medium projects (50-200 files)**: ~500ms-2s
- **Large projects (200-1000 files)**: ~2-10s
- **Very large projects (1000+ files)**: ~10-30s

### Performance Factors

```typescript
// Primary bottleneck: File I/O
for (const file of files) {
  const content = await fs.readFile(file, 'utf8'); // ~5-50ms per file
  const lineCount = content.split('\n').length; // ~1ms per file
}

// Optimization: Sequential reading (no parallel I/O contention)
// Alternative: Parallel reading (faster but memory-intensive)
```

### Memory Usage

```typescript
// Memory-efficient approach:
// - Stores only file paths and line counts (not content)
// - No caching of file contents
// - Minimal memory footprint

// For 1000 files @ 500 lines each:
// Memory usage: ~5-10 MB (file metadata only)

// If caching file contents:
// Memory usage: ~500 MB - 2 GB (AVOIDED)
```

---

## Integration Points

### Called By

- `src/cli/commands/deploy/metrics.ts` - During deployment metrics collection
- `collectCodebaseMetrics()` - Main metrics orchestrator

### Calls

- `fs-extra` - File system operations
- `path` - Path manipulation
- `glob` - File pattern matching
- `../errors.js` - Error display utilities

### Dependencies

```typescript
import fs from 'fs-extra';
import path from 'path';
import { globSync } from 'glob';
```

---

## Testing Considerations

### Unit Tests

```typescript
import { analyzeFileComplexity } from './file-complexity';
import fs from 'fs-extra';
import path from 'path';

describe('File Complexity Analysis', () => {
  const testDir = './test-fixtures';

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  it('should count total files', async () => {
    await fs.writeFile(path.join(testDir, 'file1.js'), 'code');
    await fs.writeFile(path.join(testDir, 'file2.ts'), 'code');

    const metrics = await analyzeFileComplexity(testDir);
    expect(metrics.totalFiles).toBe(2);
  });

  it('should identify large files', async () => {
    const largeContent = 'line\n'.repeat(1500);
    await fs.writeFile(path.join(testDir, 'large.js'), largeContent);

    const metrics = await analyzeFileComplexity(testDir);
    expect(metrics.filesOver1000).toBe(1);
    expect(metrics.largestFiles[0].lines).toBe(1500);
  });

  it('should calculate average file length', async () => {
    await fs.writeFile(path.join(testDir, 'file1.js'), 'line\n'.repeat(100));
    await fs.writeFile(path.join(testDir, 'file2.js'), 'line\n'.repeat(200));

    const metrics = await analyzeFileComplexity(testDir);
    expect(metrics.avgFileLength).toBe(150); // (100 + 200) / 2
  });

  it('should return empty metrics for missing directory', async () => {
    const metrics = await analyzeFileComplexity('nonexistent');
    expect(metrics.totalFiles).toBe(0);
  });
});
```

---

## Interpretation Guidelines

### Healthy Codebase Profile

```
Total Files: 50-200
Files > 500 lines: <10% of total
Files > 1000 lines: <3% of total
Files > 3000 lines: 0
Average File Length: 150-350 lines
```

### Code Smell Indicators

```
Files > 1000 lines: >10 files
  → Refactoring backlog building up

Files > 3000 lines: >0 files
  → Critical technical debt

Average File Length: >500 lines
  → Modules too large, poor separation of concerns
```

### Refactoring Priority

```
Priority 1: Files >3000 lines (immediate)
Priority 2: Files >1000 lines (next sprint)
Priority 3: Files >500 lines (backlog)
```

---

## Related Documentation

- **Metrics Orchestrator**: [docs/api/metrics-index.md](metrics-index.md) (pending)
- **Deploy Metrics**: [docs/api/deploy-metrics.md](deploy-metrics.md)
- **Code Quality Metrics**: [docs/api/metrics-code-quality.md](metrics-code-quality.md)

---

## Version History

| Version | Date       | Changes                                         |
| ------- | ---------- | ----------------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with size categorization |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3                  |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
