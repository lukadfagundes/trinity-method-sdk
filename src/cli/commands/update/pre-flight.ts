/**
 * Update Pre-flight Checks Module
 * Validates project state before performing update
 * @module cli/commands/update/pre-flight
 */

import fs from 'fs-extra';
import { Ora } from 'ora';

/**
 * Run pre-flight checks to ensure Trinity Method is deployed
 * @param spinner - ora spinner instance for status display
 * @throws {Error} If pre-flight checks fail
 */
export async function runUpdatePreflightChecks(spinner: Ora): Promise<void> {
  spinner.start('Running pre-flight checks...');

  // Check trinity directory exists
  const trinityExists = await fs.pathExists('trinity');
  if (!trinityExists) {
    spinner.fail('Trinity Method not deployed');
    const { displayError, displayInfo } = await import('../../utils/errors.js');
    displayError('Trinity Method not deployed in this project');
    displayInfo('Use: trinity deploy to install');
    process.exit(1);
  }

  // Check .claude directory exists
  const claudeExists = await fs.pathExists('.claude');
  if (!claudeExists) {
    spinner.fail('.claude directory not found');
    const { displayError, displayInfo } = await import('../../utils/errors.js');
    displayError('.claude directory not found');
    displayInfo('Trinity deployment appears incomplete');
    process.exit(1);
  }

  spinner.succeed('Pre-flight checks passed');
}
