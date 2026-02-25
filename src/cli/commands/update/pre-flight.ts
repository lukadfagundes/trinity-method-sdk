/**
 * Update Pre-flight Checks Module
 * Validates project state before performing update
 * @module cli/commands/update/pre-flight
 */

import fs from 'fs-extra';
import { Ora } from 'ora';
import { UpdateError } from '../../utils/error-classes.js';

export interface PreflightResult {
  needsLegacyMigration: boolean;
}

/**
 * Run pre-flight checks to ensure Trinity Method is deployed
 * Detects both current (.claude/trinity/) and legacy (trinity/) layouts
 * @param spinner - ora spinner instance for status display
 * @returns Pre-flight result with migration flags
 * @throws {UpdateError} If no Trinity deployment found at all
 */
export async function runUpdatePreflightChecks(spinner: Ora): Promise<PreflightResult> {
  spinner.start('Running pre-flight checks...');

  const claudeExists = await fs.pathExists('.claude');
  const trinityExists = await fs.pathExists('.claude/trinity');
  const legacyExists = await fs.pathExists('trinity');

  // Current structure found — no migration needed
  if (claudeExists && trinityExists) {
    spinner.succeed('Pre-flight checks passed');
    return { needsLegacyMigration: false };
  }

  // Legacy structure found — migration needed
  if (legacyExists) {
    spinner.succeed('Pre-flight checks passed (legacy deployment detected)');
    return { needsLegacyMigration: true };
  }

  // Neither found — not deployed
  spinner.fail('Trinity Method not deployed');
  const { displayInfo } = await import('../../utils/errors.js');
  displayInfo('Use: trinity deploy to install');
  throw new UpdateError('Trinity Method not deployed in this project', {
    reason: 'trinity_directory_missing',
  });
}
