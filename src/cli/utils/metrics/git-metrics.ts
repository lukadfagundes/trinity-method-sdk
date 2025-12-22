/**
 * Git Metrics Collection
 * Collects commit counts, contributor counts, and last commit date
 * @module cli/utils/metrics/git-metrics
 */

import { execSync } from 'child_process';

/**
 * Get total commit count
 * @returns Commit count
 */
export async function getCommitCount(): Promise<number> {
  try {
    const count = execSync('git rev-list --count HEAD', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return parseInt(count.trim(), 10);
  } catch {
    return 0;
  }
}

/**
 * Get contributor count
 * @returns Contributor count
 */
export async function getContributorCount(): Promise<number> {
  try {
    const output = execSync('git shortlog -sn --all', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const lines = output
      .trim()
      .split('\n')
      .filter((line) => line.length > 0);
    return lines.length;
  } catch {
    return 1;
  }
}

/**
 * Get last commit date
 * @returns Last commit date (ISO format)
 */
export async function getLastCommitDate(): Promise<string> {
  try {
    const date = execSync('git log -1 --format=%cI', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return date.trim();
  } catch {
    return 'Unknown';
  }
}

/**
 * Collect git metrics
 * @returns Git metrics
 */
export async function collectGitMetrics(): Promise<{
  commitCount: number;
  contributors: number;
  lastCommitDate: string;
}> {
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
