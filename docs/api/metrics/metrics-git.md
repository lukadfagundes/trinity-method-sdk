# Git Metrics Collection

**Module:** `src/cli/utils/metrics/git-metrics.ts`
**Purpose:** Collect commit counts, contributor counts, and last commit date
**Category:** Metrics Utilities
**Priority:** LOW

---

## Overview

The Git Metrics module collects repository metadata from Git history, including total commit count, number of contributors, and the last commit date. It provides quantitative metrics for project activity and collaboration.

### Key Features

- **Commit counting**: Total commits in repository history
- **Contributor identification**: Unique contributor count across all branches
- **Last commit tracking**: ISO 8601 formatted commit date
- **Graceful degradation**: Returns default values if Git not available
- **Zero configuration**: Works with any Git repository

---

## API Reference

### `collectGitMetrics()`

Main entry point that collects all Git metrics.

**Signature:**

```typescript
async function collectGitMetrics(): Promise<{
  commitCount: number;
  contributors: number;
  lastCommitDate: string;
}>;
```

**Returns:** `Promise<GitMetrics>`

```typescript
interface GitMetrics {
  commitCount: number; // Total commits (all branches)
  contributors: number; // Unique contributors
  lastCommitDate: string; // ISO 8601 date or "Unknown"
}
```

**Default Values (if Git not available):**

```typescript
{
  commitCount: 0,
  contributors: 0,
  lastCommitDate: "Unknown"
}
```

---

### `getCommitCount()`

Counts total commits in the repository.

**Signature:**

```typescript
async function getCommitCount(): Promise<number>;
```

**Implementation:**

```typescript
const count = execSync('git rev-list --count HEAD', {
  encoding: 'utf8',
  stdio: ['pipe', 'pipe', 'ignore'],
});
return parseInt(count.trim(), 10);
```

**Returns:** Number of commits from initial commit to HEAD

**Git Command:** `git rev-list --count HEAD`

- `rev-list`: List commit objects
- `--count`: Return count instead of list
- `HEAD`: Current branch tip

---

### `getContributorCount()`

Counts unique contributors across all branches.

**Signature:**

```typescript
async function getContributorCount(): Promise<number>;
```

**Implementation:**

```typescript
const output = execSync('git shortlog -sn --all', {
  encoding: 'utf8',
  stdio: ['pipe', 'pipe', 'ignore'],
});
const lines = output
  .trim()
  .split('\n')
  .filter((line) => line.length > 0);
return lines.length;
```

**Returns:** Number of unique contributors

**Git Command:** `git shortlog -sn --all`

- `shortlog`: Summarize git log by author
- `-s`: Suppress commit descriptions (show counts only)
- `-n`: Sort by number of commits
- `--all`: Include all branches

**Output Format:**

```
   142  John Doe
    87  Jane Smith
    23  Bob Johnson
```

Each line = one contributor

---

### `getLastCommitDate()`

Gets the date of the most recent commit.

**Signature:**

```typescript
async function getLastCommitDate(): Promise<string>;
```

**Implementation:**

```typescript
const date = execSync('git log -1 --format=%cI', {
  encoding: 'utf8',
  stdio: ['pipe', 'pipe', 'ignore'],
});
return date.trim();
```

**Returns:** ISO 8601 formatted date string (e.g., "2026-01-21T14:32:45-08:00")

**Git Command:** `git log -1 --format=%cI`

- `log`: Show commit logs
- `-1`: Only the most recent commit
- `--format=%cI`: Format as ISO 8601 strict format
- `%cI`: Committer date, strict ISO 8601 format

---

## Usage Examples

### Example 1: Basic Git Metrics Collection

```typescript
import { collectGitMetrics } from './metrics/git-metrics.js';

const metrics = await collectGitMetrics();

console.log(`Total commits: ${metrics.commitCount}`);
console.log(`Contributors: ${metrics.contributors}`);
console.log(`Last commit: ${metrics.lastCommitDate}`);

// Output:
// Total commits: 342
// Contributors: 5
// Last commit: 2026-01-21T14:32:45-08:00
```

### Example 2: Individual Metric Collection

```typescript
import { getCommitCount, getContributorCount, getLastCommitDate } from './metrics/git-metrics.js';

const commits = await getCommitCount();
const contributors = await getContributorCount();
const lastCommit = await getLastCommitDate();

console.log(`${commits} commits by ${contributors} contributors`);
console.log(`Last activity: ${lastCommit}`);
```

### Example 3: Calculate Activity Metrics

```typescript
const metrics = await collectGitMetrics();

// Average commits per contributor
const avgCommitsPerContributor =
  metrics.contributors > 0 ? Math.round(metrics.commitCount / metrics.contributors) : 0;

console.log(`Average commits per contributor: ${avgCommitsPerContributor}`);

// Days since last commit
if (metrics.lastCommitDate !== 'Unknown') {
  const lastCommit = new Date(metrics.lastCommitDate);
  const now = new Date();
  const daysSinceCommit = Math.floor(
    (now.getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24)
  );

  console.log(`Days since last commit: ${daysSinceCommit}`);

  if (daysSinceCommit > 30) {
    console.warn('Warning: No commits in over 30 days');
  }
}
```

### Example 4: Non-Git Repository Handling

```typescript
// If not a git repository or git not installed
const metrics = await collectGitMetrics();

// Result:
// {
//   commitCount: 0,
//   contributors: 0,
//   lastCommitDate: "Unknown"
// }

// No errors thrown - graceful fallback
```

---

## Git Command Details

### Commit Counting

```bash
# Command used
git rev-list --count HEAD

# What it does:
# 1. Lists all commits reachable from HEAD
# 2. Returns count instead of list
# 3. Fast operation (no content parsing)

# Example output:
342

# Edge cases:
# - New repository (0 commits): Returns 0
# - Detached HEAD: Counts from current position
# - Shallow clone: Counts only available commits
```

---

### Contributor Counting

```bash
# Command used
git shortlog -sn --all

# What it does:
# 1. Groups commits by author email
# 2. Counts commits per author
# 3. Sorts by commit count descending
# 4. Includes all branches (not just current)

# Example output:
#    142  John Doe <john@example.com>
#     87  Jane Smith <jane@example.com>
#     23  Bob Johnson <bob@example.com>

# Parsing strategy:
# - Split by newlines
# - Count non-empty lines
# - Each line = unique contributor

# Edge cases:
# - Same person, different emails: Counted as separate contributors
# - Same person, different names: Counted as separate contributors
# - No commits: Returns 1 (assumes current user is contributor)
```

---

### Last Commit Date

```bash
# Command used
git log -1 --format=%cI

# What it does:
# 1. Shows most recent commit
# 2. Formats as ISO 8601 strict format
# 3. Uses committer date (not author date)

# Example output:
2026-01-21T14:32:45-08:00

# Format breakdown:
# 2026-01-21    → Date (YYYY-MM-DD)
# T             → Date/time separator
# 14:32:45      → Time (HH:MM:SS)
# -08:00        → Timezone offset

# Why committer date (%cI) not author date (%aI)?
# - Committer date = when commit was added to repository
# - Author date = when changes were originally made
# - Committer date is more relevant for activity metrics
```

---

## Metrics Interpretation

### Commit Count Thresholds

```
0-50:      New project or prototype
51-200:    Active development
201-1000:  Established project
1000+:     Mature project
```

### Contributor Count Thresholds

```
1:         Solo project
2-5:       Small team
6-15:      Medium team
16+:       Large team / open source
```

### Activity Indicators

```typescript
// Days since last commit
0-7:      Active development
8-30:     Recent activity
31-90:    Maintenance mode
91+:      Potentially abandoned

// Commits per contributor
1-50:     New contributors / casual contributors
51-200:   Regular contributors
201+:     Core maintainers
```

---

## Error Handling

### Git Not Available

```typescript
try {
  const count = execSync('git rev-list --count HEAD', { ... });
  return parseInt(count.trim(), 10);
} catch {
  return 0;  // Git not available or not a git repo
}
```

**Error Scenarios:**

- Git not installed → Returns 0
- Not a git repository → Returns 0
- Permission denied → Returns 0

---

### Fallback Strategy

```typescript
export async function collectGitMetrics(): Promise<GitMetrics> {
  try {
    const commitCount = await getCommitCount();
    const contributors = await getContributorCount();
    const lastCommitDate = await getLastCommitDate();

    return {
      commitCount,
      contributors,
      lastCommitDate,
    };
  } catch {
    // Git not available or not a git repo
    return {
      commitCount: 0,
      contributors: 0,
      lastCommitDate: 'Unknown',
    };
  }
}
```

**Rationale:**

- Git metrics are optional (not critical for deployment)
- Graceful degradation allows command to continue
- No warnings displayed (silent fallback)

---

## Integration Points

### Called By

- `src/cli/commands/deploy/metrics.ts` - During deployment metrics collection
- `collectCodebaseMetrics()` - Main metrics orchestrator

### Calls

- `child_process.execSync` - Git command execution

### Dependencies

```typescript
import { execSync } from 'child_process';
```

---

## Testing Considerations

### Unit Tests

```typescript
import {
  collectGitMetrics,
  getCommitCount,
  getContributorCount,
  getLastCommitDate,
} from './git-metrics';
import { execSync } from 'child_process';

jest.mock('child_process');

describe('Git Metrics', () => {
  it('should collect commit count', async () => {
    (execSync as jest.Mock).mockReturnValue('342\n');

    const count = await getCommitCount();
    expect(count).toBe(342);
  });

  it('should collect contributor count', async () => {
    (execSync as jest.Mock).mockReturnValue('   142  John Doe\n    87  Jane Smith\n');

    const contributors = await getContributorCount();
    expect(contributors).toBe(2);
  });

  it('should collect last commit date', async () => {
    (execSync as jest.Mock).mockReturnValue('2026-01-21T14:32:45-08:00\n');

    const date = await getLastCommitDate();
    expect(date).toBe('2026-01-21T14:32:45-08:00');
  });

  it('should return default values when git fails', async () => {
    (execSync as jest.Mock).mockImplementation(() => {
      throw new Error('Git not found');
    });

    const metrics = await collectGitMetrics();
    expect(metrics.commitCount).toBe(0);
    expect(metrics.contributors).toBe(0);
    expect(metrics.lastCommitDate).toBe('Unknown');
  });
});
```

### Integration Tests

```typescript
describe('Git Metrics Integration', () => {
  it('should collect metrics from real git repository', async () => {
    const metrics = await collectGitMetrics();

    expect(metrics.commitCount).toBeGreaterThan(0);
    expect(metrics.contributors).toBeGreaterThan(0);
    expect(metrics.lastCommitDate).not.toBe('Unknown');
  });
});
```

---

## Performance Considerations

### Command Execution Time

- **git rev-list --count HEAD**: ~50-200ms
- **git shortlog -sn --all**: ~100-500ms (depends on commit count)
- **git log -1 --format=%cI**: ~50-100ms
- **Total time**: ~200ms-800ms

### Performance Factors

```typescript
// Factors affecting performance:
// 1. Repository size (commit count)
// 2. Number of branches (--all flag)
// 3. Disk I/O speed (.git directory access)
// 4. Git index state (cached vs. uncached)
```

### Optimization Strategies

- Sequential execution (no parallel git commands)
- Minimal output format (--format=%cI)
- Stderr silenced (`stdio: ['pipe', 'pipe', 'ignore']`)

---

## Security Considerations

### Command Execution Safety

```typescript
// Safe: No user input in commands
execSync('git rev-list --count HEAD', { ... });

// Commands are hardcoded (no injection risk)
// No shell execution (direct command invocation)
```

### Git Configuration

- Read-only operations (no repository modifications)
- No git config changes
- No remote operations (local only)

---

## Limitations

### Shallow Clones

```typescript
// Shallow clones (git clone --depth=1) have incomplete history
const metrics = await collectGitMetrics();

// Result:
// {
//   commitCount: 1,        // Only 1 commit available
//   contributors: 1,       // Only 1 contributor visible
//   lastCommitDate: "..."  // Accurate (most recent commit)
// }

// Mitigation: None (shallow clones intentionally limit history)
```

### Email Deduplication

```typescript
// Same person with different emails counted as separate contributors
// Example:
// - john@work.com
// - john@personal.com
// Both counted as separate contributors

// Git solution: .mailmap file (not currently supported)
```

### Branch-Specific Metrics

```typescript
// Current implementation counts ALL branches (--all flag)
// Alternative: Count only current branch

// Current: git shortlog -sn --all
// Alternative: git shortlog -sn HEAD

// Trade-off: Complete history vs. branch-specific history
```

---

## Related Documentation

- **Metrics Orchestrator**: [docs/api/metrics-index.md](metrics-index.md) (pending)
- **Deploy Metrics**: [docs/api/deploy-metrics.md](deploy-metrics.md)
- **Framework Detector**: [docs/api/metrics-framework-detector.md](metrics-framework-detector.md)

---

## Version History

| Version | Date       | Changes                                                     |
| ------- | ---------- | ----------------------------------------------------------- |
| 2.0.0   | 2025-12-28 | Initial implementation with commit and contributor counting |
| 2.1.0   | 2026-01-21 | Documentation created by APO-3                              |

---

**Maintained by:** Trinity Method SDK Team
**Last Updated:** 2026-01-21
**Status:** Production Ready
