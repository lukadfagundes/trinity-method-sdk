/**
 * Update Backup Module
 * Handles backup creation and rollback operations
 * @module cli/commands/update/backup
 */

import fs from 'fs-extra';
import path from 'path';
import { Ora } from 'ora';
import chalk from 'chalk';

/** User-managed files that need backup */
const USER_FILES = [
  'trinity/knowledge-base/ARCHITECTURE.md',
  'trinity/knowledge-base/To-do.md',
  'trinity/knowledge-base/ISSUES.md',
  'trinity/knowledge-base/Technical-Debt.md',
];

/**
 * Create backup of Trinity Method files before update
 * @param spinner - ora spinner instance for status display
 * @returns Path to backup directory
 */
export async function createUpdateBackup(spinner: Ora): Promise<string> {
  spinner.start('Creating backup...');

  const backupDir = `.trinity-backup-${Date.now()}`;
  await fs.ensureDir(backupDir);

  // Backup user-managed files
  for (const file of USER_FILES) {
    if (await fs.pathExists(file)) {
      const backupPath = path.join(backupDir, path.basename(file));
      await fs.copy(file, backupPath);
    }
  }

  // Backup entire trinity and .claude dirs for rollback safety
  await fs.copy('trinity', path.join(backupDir, 'trinity'));
  await fs.copy('.claude', path.join(backupDir, '.claude'));

  spinner.succeed('Backup created');

  return backupDir;
}

/**
 * Restore user-managed content from backup
 * @param backupDir - Path to backup directory
 * @param spinner - ora spinner instance for status display
 */
export async function restoreUserContent(backupDir: string, spinner: Ora): Promise<void> {
  spinner.start('Restoring user content...');

  for (const file of USER_FILES) {
    const backupFile = path.join(backupDir, path.basename(file));
    if (await fs.pathExists(backupFile)) {
      await fs.copy(backupFile, file, { overwrite: true });
    }
  }

  spinner.succeed('User content restored');
}

/**
 * Rollback from backup in case of update failure
 * @param backupDir - Path to backup directory
 * @throws {Error} If rollback fails
 */
export async function rollbackFromBackup(backupDir: string): Promise<void> {
  if (!(await fs.pathExists(backupDir))) {
    return; // No backup to rollback from
  }

  const rollbackSpinner = await import('ora').then((m) =>
    m.default('Restoring from backup...').start()
  );

  try {
    // Restore trinity directory
    if (await fs.pathExists(path.join(backupDir, 'trinity'))) {
      await fs.remove('trinity');
      await fs.copy(path.join(backupDir, 'trinity'), 'trinity');
    }

    // Restore .claude directory
    if (await fs.pathExists(path.join(backupDir, '.claude'))) {
      await fs.remove('.claude');
      await fs.copy(path.join(backupDir, '.claude'), '.claude');
    }

    // Cleanup backup
    await fs.remove(backupDir);

    rollbackSpinner.succeed('Rollback complete - Original state restored');
    console.log('');
  } catch (rollbackError: unknown) {
    rollbackSpinner.fail('Rollback failed');
    const { getErrorMessage } = await import('../../utils/errors.js');
    console.error(chalk.red(`\n❌ CRITICAL: Rollback failed: ${getErrorMessage(rollbackError)}`));
    console.error(chalk.yellow(`\n⚠️  Backup preserved at: ${backupDir}`));
    console.error(chalk.blue(`   Manually restore from backup if needed\n`));
    throw rollbackError;
  }
}

/**
 * Cleanup backup directory after successful update
 * @param backupDir - Path to backup directory
 * @param spinner - ora spinner instance for status display
 */
export async function cleanupBackup(backupDir: string, spinner: Ora): Promise<void> {
  spinner.start('Cleaning up...');
  await fs.remove(backupDir);
  spinner.succeed('Cleanup complete');
}
