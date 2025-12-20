/**
 * Codebase metrics collection for deployment
 */

import chalk from 'chalk';
import { collectCodebaseMetrics } from '../../utils/codebase-metrics.js';
import type { CodebaseMetrics, Stack, Spinner } from './types.js';

/**
 * Collect codebase metrics for enriching templates
 *
 * @param stack - Detected technology stack
 * @param spinner - Spinner instance for status updates
 * @returns Collected codebase metrics
 */
export async function collectMetrics(stack: Stack, spinner: Spinner): Promise<CodebaseMetrics> {
  spinner.start('Collecting codebase metrics...');

  try {
    const metrics = await collectCodebaseMetrics(stack.sourceDir, stack.framework);

    spinner.succeed('Codebase metrics collected');

    // Display metrics summary
    console.log(chalk.cyan('\n📊 Codebase Metrics:'));
    console.log(chalk.white(`  Total Files: ${metrics.totalFiles}`));
    console.log(chalk.white(`  TODO Comments: ${metrics.todoCount}`));
    console.log(chalk.white(`  Large Files (>500 lines): ${metrics.filesOver500}`));
    console.log(chalk.white(`  Dependencies: ${metrics.dependencyCount}`));

    return metrics;
  } catch (error) {
    spinner.warn('Could not collect all metrics');
    console.log(chalk.yellow('  Some metrics collection failed, continuing...'));

    // Return minimal metrics
    return {
      totalFiles: 0,
      todoCount: 0,
      filesOver500: 0,
      dependencyCount: 0,
    };
  }
}
