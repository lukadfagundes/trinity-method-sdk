/**
 * Codebase Metrics Collection Utility - Main Orchestrator
 * Trinity Method SDK - Hybrid Audit System
 *
 * Collects scriptable metrics from codebase without semantic analysis.
 * Designed for cross-platform compatibility (Node.js, Flutter, React, Python, Rust).
 * @module cli/utils/metrics
 */

import { CodebaseMetrics } from '../../types.js';
import { collectCodeQualityMetrics } from './code-quality.js';
import { analyzeFileComplexity } from './file-complexity.js';
import { parseDependencies } from './dependency-parser.js';
import { collectGitMetrics } from './git-metrics.js';
import { detectFrameworkVersion, detectPackageManager } from './framework-detector.js';

/**
 * Create an empty CodebaseMetrics object with default values
 */
export function createEmptyMetrics(): CodebaseMetrics {
  return {
    // Code Quality Metrics
    todoCount: 0,
    todoComments: 0,
    fixmeComments: 0,
    hackComments: 0,
    consoleStatements: 0,
    commentedCodeBlocks: 0,

    // File Complexity Metrics
    totalFiles: 0,
    filesOver500: 0,
    filesOver1000: 0,
    filesOver3000: 0,
    avgFileLength: 0,
    largestFiles: [],

    // Dependency Metrics
    dependencies: {},
    dependencyCount: 0,
    devDependencies: {},
    devDependencyCount: 0,

    // Git Metrics
    commitCount: 0,
    contributors: 0,
    lastCommitDate: 'Unknown',

    // Framework-Specific
    frameworkVersion: 'Unknown',
    packageManager: 'Unknown',
  };
}

/**
 * Main entry point for metrics collection
 * @param sourceDir - Source code directory (src/, lib/, app/)
 * @param framework - Detected framework (Node.js, Flutter, React, Python, Rust)
 * @returns Collected metrics
 */
async function collectCodebaseMetrics(
  sourceDir: string,
  framework: string
): Promise<CodebaseMetrics> {
  console.log(`   Collecting metrics from ${sourceDir} (${framework})...`);

  const metrics: CodebaseMetrics = createEmptyMetrics();

  try {
    // Code Quality Metrics
    const codeQuality = await collectCodeQualityMetrics(sourceDir);
    Object.assign(metrics, codeQuality);

    // File Complexity Metrics
    const fileStats = await analyzeFileComplexity(sourceDir);
    metrics.totalFiles = fileStats.totalFiles;
    metrics.filesOver500 = fileStats.filesOver500;
    metrics.filesOver1000 = fileStats.filesOver1000;
    metrics.filesOver3000 = fileStats.filesOver3000;
    metrics.avgFileLength = fileStats.avgFileLength;
    metrics.largestFiles = fileStats.largestFiles;

    // Dependency Metrics
    const deps = await parseDependencies(framework);
    metrics.dependencies = deps.dependencies;
    metrics.dependencyCount = deps.dependencyCount;
    metrics.devDependencies = deps.devDependencies;
    metrics.devDependencyCount = deps.devDependencyCount;

    // Git Metrics (optional)
    try {
      const gitMetrics = await collectGitMetrics();
      metrics.commitCount = gitMetrics.commitCount;
      metrics.contributors = gitMetrics.contributors;
      metrics.lastCommitDate = gitMetrics.lastCommitDate;
    } catch (error) {
      // Git not available or not a git repo
      console.log('   Git metrics unavailable (not a git repository)');
    }

    // Framework-Specific
    metrics.frameworkVersion = await detectFrameworkVersion(framework);
    metrics.packageManager = await detectPackageManager();
  } catch (error: unknown) {
    const { displayError, getErrorMessage } = await import('../errors.js');
    displayError(`Error collecting metrics: ${getErrorMessage(error)}`);
    throw error;
  }

  return metrics;
}

// Export everything for backward compatibility
export {
  collectCodebaseMetrics,
  analyzeFileComplexity,
  parseDependencies,
  detectFrameworkVersion,
  detectPackageManager,
};

// Re-export from submodules for direct access
export { countPattern } from './code-quality.js';
export type { FileComplexityMetrics } from './file-complexity.js';
export type { DependencyMetrics } from './dependency-parser.js';
