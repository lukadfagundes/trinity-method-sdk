/**
 * File Complexity Metrics Collection
 * Analyzes file counts, line counts, and identifies large files
 * @module cli/utils/metrics/file-complexity
 */

import fs from 'fs-extra';
import path from 'path';
import { globSync } from 'glob';

/**
 * File complexity metrics
 */
export interface FileComplexityMetrics {
  totalFiles: number;
  filesOver500: number;
  filesOver1000: number;
  filesOver3000: number;
  avgFileLength: number;
  largestFiles: Array<{ file: string; lines: number }>;
}

/**
 * Analyze file complexity metrics
 * @param dir - Directory to analyze
 * @returns File complexity metrics
 */
export async function analyzeFileComplexity(dir: string): Promise<FileComplexityMetrics> {
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

    const fileSizes: Array<{ file: string; lines: number }> = [];
    let filesOver500 = 0;
    let filesOver1000 = 0;
    let filesOver3000 = 0;
    let totalLines = 0;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const lineCount = content.split('\n').length;
      totalLines += lineCount;

      fileSizes.push({ file: path.relative(dir, file), lines: lineCount });

      if (lineCount > 500) filesOver500++;
      if (lineCount > 1000) filesOver1000++;
      if (lineCount > 3000) filesOver3000++;
    }

    // Sort by size and get top 10
    fileSizes.sort((a, b) => b.lines - a.lines);
    const largestFiles = fileSizes.slice(0, 10);

    return {
      totalFiles: files.length,
      filesOver500,
      filesOver1000,
      filesOver3000,
      avgFileLength: files.length > 0 ? Math.round(totalLines / files.length) : 0,
      largestFiles,
    };
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
}
