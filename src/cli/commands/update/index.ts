/**
 * Update Command - Orchestrator
 * Coordinates update process with focused helper functions
 * @see docs/workflows/update-workflow.md
 * **Trinity Principle:** "Systematic Quality Assurance" - Keep deployment current
 * @module cli/commands/update
 */

import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { UpdateOptions } from '../../types.js';
import { runUpdatePreflightChecks } from './pre-flight.js';
import { detectInstalledSDKVersion } from './version.js';
import {
  createUpdateBackup,
  restoreUserContent,
  rollbackFromBackup,
  cleanupBackup,
} from './backup.js';
import { updateAgents } from './agents.js';
import { updateCommands } from './commands.js';
import { updateTemplates } from './templates.js';
import { updateKnowledgeBase } from './knowledge-base.js';
import { verifyUpdateDeployment, updateVersionFile } from './verification.js';
import { displayUpdateSummary, displayDryRunPreview } from './summary.js';
import { UpdateStats } from './types.js';

/**
 * Update Trinity Method SDK deployment to latest version
 * Orchestrates the update process with focused helper functions
 * @param options - Update command options
 */
export async function update(options: UpdateOptions): Promise<void> {
  console.log(chalk.blue.bold('\n🔄 Trinity Method SDK - Update\n'));

  const spinner = ora();
  let backupDir: string | null = null;
  const stats: UpdateStats = {
    agentsUpdated: 0,
    templatesUpdated: 0,
    knowledgeBaseUpdated: 0,
    commandsUpdated: 0,
    filesUpdated: 0,
  };

  try {
    // STEP 1: Pre-flight checks
    await runUpdatePreflightChecks(spinner);

    // STEP 2: Version check
    const versionInfo = await detectInstalledSDKVersion(spinner);

    if (versionInfo.isUpToDate) {
      console.log(chalk.green('✅ Already up to date\n'));
      return;
    }

    // STEP 3: Dry-run preview or confirmation
    if (options.dryRun) {
      displayDryRunPreview(versionInfo.currentVersion, versionInfo.latestVersion);
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Update Trinity Method from ${versionInfo.currentVersion} to ${versionInfo.latestVersion}?`,
        default: true,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Update cancelled\n'));
      return;
    }

    // STEP 4: Create backup
    backupDir = await createUpdateBackup(spinner);

    // STEP 5-8: Update components
    await updateAgents(spinner, stats);
    await updateCommands(spinner, stats);
    await updateTemplates(spinner, stats);
    await updateKnowledgeBase(spinner, stats);

    // STEP 9: Restore user content
    await restoreUserContent(backupDir, spinner);

    // STEP 10: Update VERSION file
    await updateVersionFile(spinner, versionInfo.latestVersion);

    // STEP 11: Verification
    await verifyUpdateDeployment(spinner, versionInfo.latestVersion);

    // STEP 12: Cleanup backup
    await cleanupBackup(backupDir, spinner);
    backupDir = null; // Mark as cleaned up

    // SUCCESS: Display summary
    displayUpdateSummary(stats, versionInfo.currentVersion, versionInfo.latestVersion);
  } catch (error: unknown) {
    // ROLLBACK on failure
    if (spinner) {
      spinner.fail('Update failed');
    }

    console.log('');
    console.log(chalk.red.bold('❌ Update failed - Rolling back changes...\n'));

    if (backupDir) {
      try {
        await rollbackFromBackup(backupDir);
      } catch (rollbackError: unknown) {
        // Rollback error already logged in rollbackFromBackup
      }
    }

    const { displayError, displayInfo, getErrorMessage } = await import('../../utils/errors.js');
    displayError(getErrorMessage(error));
    displayInfo('Try running: trinity deploy --force for a clean reinstall');
    process.exit(1);
  }
}
