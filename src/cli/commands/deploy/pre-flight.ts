/**
 * Pre-flight checks for Trinity deployment
 */

import fs from 'fs-extra';
import chalk from 'chalk';
import type { DeployOptions, Spinner } from './types.js';

/**
 * Check if Trinity is already deployed and handle force flag
 *
 * @param options - Deploy command options
 * @param spinner - Spinner instance for status updates
 * @throws Error if Trinity already deployed and --force not used
 */
export async function checkPreFlight(options: DeployOptions, spinner: Spinner): Promise<void> {
  spinner.start('Running pre-flight checks...');

  // Check if Trinity is already deployed
  const trinityExists = await fs.pathExists('trinity');

  if (trinityExists && !options.force) {
    spinner.fail();
    console.log(chalk.yellow('\nTrinity Method is already deployed in this project.'));
    console.log(chalk.cyan('\nUse --force flag to redeploy (this will overwrite existing files):'));
    console.log(chalk.white('  npx trinity deploy --force\n'));
    throw new Error('Trinity already deployed. Use --force to redeploy.');
  }

  if (trinityExists && options.force) {
    spinner.text = 'Force flag detected - will overwrite existing deployment...';
  }

  spinner.succeed('Pre-flight checks passed');
}
