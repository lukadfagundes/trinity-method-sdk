/**
 * Update Pre-flight Checks Module
 * Validates project state before performing update
 * @module cli/commands/update/pre-flight
 */

import fs from 'fs-extra';
import { Ora } from 'ora';
import { UpdateError } from '../../utils/error-classes.js';

/**
 * Run pre-flight checks to ensure Trinity Method is deployed
 * @param spinner - ora spinner instance for status display
 * @throws {UpdateError} If pre-flight checks fail
 */
export async function runUpdatePreflightChecks(spinner: Ora): Promise<void> {
  spinner.start('Running pre-flight checks...');

  // Check trinity directory exists
  const trinityExists = await fs.pathExists('trinity');
  if (!trinityExists) {
    spinner.fail('Trinity Method not deployed');
    const { displayInfo } = await import('../../utils/errors.js');
    displayInfo('Use: trinity deploy to install');
    throw new UpdateError('Trinity Method not deployed in this project', {
      reason: 'trinity_directory_missing',
    });
  }

  // Check .claude directory exists
  const claudeExists = await fs.pathExists('.claude');
  if (!claudeExists) {
    spinner.fail('.claude directory not found');
    const { displayInfo } = await import('../../utils/errors.js');
    displayInfo('Trinity deployment appears incomplete');
    throw new UpdateError('.claude directory not found', {
      reason: 'claude_directory_missing',
    });
  }

  spinner.succeed('Pre-flight checks passed');
}
