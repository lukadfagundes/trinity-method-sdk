/**
 * Update Command - Update Trinity Method SDK deployment to latest version
 * @see docs/workflows/update-workflow.md
 * **Trinity Principle:** "Systematic Quality Assurance" - Keep deployment current
 * @module cli/commands/update
 */

import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { UpdateOptions } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function update(options: UpdateOptions): Promise<void> {
  console.log(chalk.blue.bold('\n🔄 Trinity Method SDK - Update\n'));

  // Check if Trinity exists
  const trinityExists = await fs.pathExists('trinity');
  if (!trinityExists) {
    console.error(chalk.red('❌ Trinity Method not deployed in this project'));
    console.error(chalk.blue('   Use: trinity deploy to install\n'));
    process.exit(1);
  }

  // Read current version
  const versionPath = 'trinity/VERSION';
  let currentVersion = '0.0.0';
  if (await fs.pathExists(versionPath)) {
    currentVersion = (await fs.readFile(versionPath, 'utf8')).trim();
  }

  // Read latest version from SDK package.json
  const sdkPkgPath = path.join(__dirname, '../../../package.json');
  const sdkPkg = JSON.parse(await fs.readFile(sdkPkgPath, 'utf8'));
  const latestVersion = sdkPkg.version;

  console.log(chalk.gray(`Current version: ${currentVersion}`));
  console.log(chalk.gray(`Latest version: ${latestVersion}\n`));

  if (currentVersion === latestVersion) {
    console.log(chalk.green('✅ Already up to date\n'));
    return;
  }

  // Confirm update
  if (!options.dryRun) {
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: `Update Trinity Method from ${currentVersion} to ${latestVersion}?`,
      default: true
    }]);

    if (!confirm) {
      console.log(chalk.yellow('Update cancelled\n'));
      return;
    }
  }

  const spinner = ora('Updating Trinity Method...').start();

  try {
    // Backup user content
    const backupDir = `.trinity-backup-${Date.now()}`;
    await fs.ensureDir(backupDir);

    const userFiles = [
      'trinity/knowledge-base/ARCHITECTURE.md',
      'trinity/knowledge-base/To-do.md',
      'trinity/knowledge-base/ISSUES.md'
    ];

    for (const file of userFiles) {
      if (await fs.pathExists(file)) {
        await fs.copy(file, path.join(backupDir, path.basename(file)));
      }
    }

    // Update SDK-managed files
    const sdkPath = path.join(__dirname, '../../../');

    // Update templates
    const woDir = path.join(sdkPath, 'templates/work-orders');
    if (await fs.pathExists(woDir) && !options.dryRun) {
      await fs.copy(woDir, 'trinity/templates', { overwrite: true });
    }

    // Update Trinity.md
    const trinityMdTemplate = path.join(sdkPath, 'templates/knowledge-base/Trinity.md.template');
    if (await fs.pathExists(trinityMdTemplate) && !options.dryRun) {
      await fs.copy(trinityMdTemplate, 'trinity/knowledge-base/Trinity.md', { overwrite: true });
    }

    // Update agents
    if (await fs.pathExists('.claude/agents')) {
      const agentSource = path.join(sdkPath, 'templates/agents/claude-code');
      if (await fs.pathExists(agentSource) && !options.dryRun) {
        await fs.copy(agentSource, '.claude/agents', { overwrite: true });
      }
    }

    // Update hooks
    const hooksSource = path.join(sdkPath, 'templates/hooks');
    if (await fs.pathExists(hooksSource) && !options.dryRun) {
      await fs.copy(hooksSource, '.claude/hooks', { overwrite: true });
    }

    // Restore user content
    for (const file of userFiles) {
      const backupFile = path.join(backupDir, path.basename(file));
      if (await fs.pathExists(backupFile) && !options.dryRun) {
        await fs.copy(backupFile, file, { overwrite: true });
      }
    }

    // Update VERSION
    if (!options.dryRun) {
      await fs.writeFile(versionPath, latestVersion);
    }

    // Cleanup backup
    if (!options.dryRun) {
      await fs.remove(backupDir);
    }

    spinner.succeed('Trinity Method updated successfully');
    console.log();
    console.log(chalk.green(`✅ Updated from ${currentVersion} to ${latestVersion}\n`));

  } catch (error: any) {
    spinner.fail('Update failed');
    console.error(chalk.red(`\nError: ${error.message}\n`));
    throw error;
  }
}
