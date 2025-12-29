/**
 * Code Quality Metrics Collection
 * Counts TODOs, FIXMEs, console statements, and commented code blocks
 * @module cli/utils/metrics/code-quality
 */

import fs from 'fs-extra';
import { globSync } from 'glob';

/**
 * Count occurrences of a pattern in source files
 * @param dir - Directory to search
 * @param pattern - Pattern to match
 * @returns Count of matches
 */
export async function countPattern(dir: string, pattern: RegExp): Promise<number> {
  if (!(await fs.pathExists(dir))) {
    return 0;
  }

  try {
    // Get all source files
    const files = globSync(`${dir}/**/*.{js,jsx,ts,tsx,dart,py,rs}`, {
      ignore: [
        '**/node_modules/**',
        '**/build/**',
        '**/.dart_tool/**',
        '**/dist/**',
        '**/__pycache__/**',
      ],
    });

    let count = 0;
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const matches = content.match(pattern);
      if (matches) {
        count += matches.length;
      }
    }

    return count;
  } catch (error: unknown) {
    const { displayWarning, getErrorMessage } = await import('../errors.js');
    displayWarning(`Error counting pattern: ${getErrorMessage(error)}`);
    return 0;
  }
}

/**
 * Count consecutive comments in a single file
 * @param file - File path to analyze
 * @returns Number of commented code blocks in the file
 */
async function countCommentsInFile(file: string): Promise<number> {
  const content = await fs.readFile(file, 'utf8');
  const lines = content.split('\n');

  let blockCount = 0;
  let consecutiveComments = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const isComment = trimmed.startsWith('//') || trimmed.startsWith('#');

    if (isComment) {
      consecutiveComments++;
      if (consecutiveComments === 3) {
        blockCount++;
      }
    } else {
      consecutiveComments = 0;
    }
  }

  return blockCount;
}

/**
 * Count commented code blocks (heuristic: 3+ consecutive comment lines)
 * @param dir - Directory to search
 * @returns Estimated count of commented code blocks
 */
export async function countCommentedCode(dir: string): Promise<number> {
  if (!(await fs.pathExists(dir))) {
    return 0;
  }

  try {
    const files = globSync(`${dir}/**/*.{js,jsx,ts,tsx,dart,py,rs}`, {
      ignore: [
        '**/node_modules/**',
        '**/build/**',
        '**/.dart_tool/**',
        '**/dist/**',
        '**/__pycache__/**',
      ],
    });

    let blockCount = 0;
    for (const file of files) {
      blockCount += await countCommentsInFile(file);
    }

    return blockCount;
  } catch (error: unknown) {
    const { displayWarning, getErrorMessage } = await import('../errors.js');
    displayWarning(`Error counting commented code: ${getErrorMessage(error)}`);
    return 0;
  }
}

/**
 * Collect code quality metrics
 * @param sourceDir - Source directory to analyze
 * @returns Code quality metrics
 */
export async function collectCodeQualityMetrics(sourceDir: string): Promise<{
  todoCount: number;
  todoComments: number;
  fixmeComments: number;
  hackComments: number;
  consoleStatements: number;
  commentedCodeBlocks: number;
}> {
  const todoComments = await countPattern(sourceDir, /\/\/\s*TODO|#\s*TODO/gi);
  const fixmeComments = await countPattern(sourceDir, /\/\/\s*FIXME|#\s*FIXME/gi);
  const hackComments = await countPattern(sourceDir, /\/\/\s*HACK|#\s*HACK/gi);
  const todoCount = todoComments + fixmeComments + hackComments;

  const consoleStatements = await countPattern(sourceDir, /console\.(log|warn|error|debug|info)/gi);
  const commentedCodeBlocks = await countCommentedCode(sourceDir);

  return {
    todoCount,
    todoComments,
    fixmeComments,
    hackComments,
    consoleStatements,
    commentedCodeBlocks,
  };
}
