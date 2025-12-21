/**
 * CI/CD workflow deployment
 */

import chalk from 'chalk';
import { deployCITemplates } from '../../utils/deploy-ci.js';
import type { DeployOptions, Spinner } from './types.js';

/**
 * Deploy CI/CD workflow templates
 *
 * @param options - Deploy command options
 * @param spinner - Spinner instance for status updates
 * @returns Number of files deployed
 */
export async function deployCICD(options: DeployOptions, spinner: Spinner): Promise<number> {
  if (!options.ciDeploy) {
    return 0;
  }

  spinner.start('Deploying CI/CD workflow templates...');

  try {
    const ciStats = await deployCITemplates(options);

    if (ciStats.deployed.length > 0) {
      spinner.succeed(`CI/CD templates deployed (${ciStats.deployed.length} files)`);
      ciStats.deployed.forEach((file: string) => {
        console.log(chalk.white(`   ✓ ${file}`));
      });
    } else {
      spinner.info('No CI/CD templates deployed');
    }

    if (ciStats.skipped.length > 0) {
      console.log(chalk.yellow('   Skipped:'));
      ciStats.skipped.forEach((file: string) => {
        console.log(chalk.yellow(`   - ${file}`));
      });
    }

    if (ciStats.errors.length > 0) {
      spinner.warn('Some CI/CD templates failed to deploy');
      ciStats.errors.forEach((err: { file?: string; error?: string; general?: string }) => {
        console.log(chalk.red(`   ✗ ${err.file || 'Error'}: ${err.error}`));
      });
    }

    return ciStats.deployed.length;
  } catch (error: unknown) {
    spinner.fail('CI/CD template deployment failed');
    const { displayWarning, getErrorMessage } = await import('../../utils/errors.js');
    displayWarning(getErrorMessage(error));
    return 0;
  }
}
