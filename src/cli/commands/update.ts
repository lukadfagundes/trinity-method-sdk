/**
 * Update Command - Update Trinity Method SDK deployment to latest version
 * @see docs/workflows/update-workflow.md
 * **Trinity Principle:** "Systematic Quality Assurance" - Keep deployment current
 * @module cli/commands/update
 */

import ora, { Ora } from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { UpdateOptions } from '../types.js';
import { getPackageJsonPath } from '../utils/get-sdk-path.js';

interface UpdateStats {
  agentsUpdated: number;
  templatesUpdated: number;
  knowledgeBaseUpdated: number;
  commandsUpdated: number;
  filesUpdated: number;
}

export async function update(options: UpdateOptions): Promise<void> {
  console.log(chalk.blue.bold('\n🔄 Trinity Method SDK - Update\n'));

  let spinner: Ora | undefined;
  let backupDir: string | null = null;
  const stats: UpdateStats = {
    agentsUpdated: 0,
    templatesUpdated: 0,
    knowledgeBaseUpdated: 0,
    commandsUpdated: 0,
    filesUpdated: 0
  };

  try {
    // STEP 1: Pre-flight checks
    spinner = ora('Running pre-flight checks...').start();

    const trinityExists = await fs.pathExists('trinity');
    if (!trinityExists) {
      spinner.fail('Trinity Method not deployed');
      console.error(chalk.red('❌ Trinity Method not deployed in this project'));
      console.error(chalk.blue('   Use: trinity deploy to install\n'));
      process.exit(1);
    }

    // Check for .claude directory
    const claudeExists = await fs.pathExists('.claude');
    if (!claudeExists) {
      spinner.fail('.claude directory not found');
      console.error(chalk.red('❌ .claude directory not found'));
      console.error(chalk.blue('   Trinity deployment appears incomplete\n'));
      process.exit(1);
    }

    spinner.succeed('Pre-flight checks passed');

    // STEP 2: Version check
    spinner = ora('Checking versions...').start();

    const versionPath = 'trinity/VERSION';
    let currentVersion = '0.0.0';
    if (await fs.pathExists(versionPath)) {
      currentVersion = (await fs.readFile(versionPath, 'utf8')).trim();
    }

    // Read latest version from SDK package.json
    const sdkPkgPath = await getPackageJsonPath();
    const sdkPkg = JSON.parse(await fs.readFile(sdkPkgPath, 'utf8'));
    const latestVersion = sdkPkg.version;

    spinner.succeed('Version check complete');
    console.log(chalk.gray(`   Current version: ${currentVersion}`));
    console.log(chalk.gray(`   Latest version:  ${latestVersion}`));
    console.log('');

    if (currentVersion === latestVersion) {
      console.log(chalk.green('✅ Already up to date\n'));
      return;
    }

    // STEP 3: Dry-run preview or confirmation
    if (options.dryRun) {
      console.log(chalk.yellow('🔍 DRY RUN - Preview of changes:\n'));
      console.log(chalk.white('   Would update:'));
      console.log(chalk.gray(`   • 18 agent files in .claude/agents/`));
      console.log(chalk.gray(`   • 16 slash commands in .claude/commands/`));
      console.log(chalk.gray(`   • 6 work order templates in trinity/templates/`));
      console.log(chalk.gray(`   • Knowledge base files (Trinity.md, CODING-PRINCIPLES.md, etc.)`));
      console.log(chalk.gray(`   • Version file: ${currentVersion} → ${latestVersion}`));
      console.log('');
      console.log(chalk.white('   Would preserve:'));
      console.log(chalk.gray(`   • trinity/knowledge-base/ARCHITECTURE.md`));
      console.log(chalk.gray(`   • trinity/knowledge-base/To-do.md`));
      console.log(chalk.gray(`   • trinity/knowledge-base/ISSUES.md`));
      console.log(chalk.gray(`   • trinity/knowledge-base/Technical-Debt.md`));
      console.log('');
      console.log(chalk.blue('💡 Run without --dry-run to perform update\n'));
      return;
    }

    // Confirm update
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

    // STEP 4: Create backup
    spinner = ora('Creating backup...').start();
    backupDir = `.trinity-backup-${Date.now()}`;
    await fs.ensureDir(backupDir);

    // Backup user-managed files
    const userFiles = [
      'trinity/knowledge-base/ARCHITECTURE.md',
      'trinity/knowledge-base/To-do.md',
      'trinity/knowledge-base/ISSUES.md',
      'trinity/knowledge-base/Technical-Debt.md'
    ];

    for (const file of userFiles) {
      if (await fs.pathExists(file)) {
        const backupPath = path.join(backupDir, path.basename(file));
        await fs.copy(file, backupPath);
      }
    }

    // Also backup entire trinity and .claude dirs for rollback safety
    await fs.copy('trinity', path.join(backupDir, 'trinity'));
    await fs.copy('.claude', path.join(backupDir, '.claude'));

    spinner.succeed('Backup created');

    // STEP 5: Update agents
    spinner = ora('Updating agents...').start();
    // SDK path: In tests it's process.cwd(), in production it's node_modules/@trinity-method/sdk
    const sdkPath = await fs.pathExists(path.join(process.cwd(), 'dist/templates'))
      ? process.cwd()  // Running from SDK root (tests or dev)
      : path.join(process.cwd(), 'node_modules', '@trinity-method', 'sdk');  // Installed package
    const agentsTemplatePath = path.join(sdkPath, 'dist/templates/agents');

    // Agent subdirectories to update
    const agentDirs = ['leadership', 'planning', 'aj-team', 'deployment', 'audit'];

    for (const agentDir of agentDirs) {
      const sourcePath = path.join(agentsTemplatePath, agentDir);
      const targetPath = path.join('.claude/agents', agentDir);

      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath, { overwrite: true });
        const files = await fs.readdir(sourcePath);
        stats.agentsUpdated += files.length;
      }
    }

    spinner.succeed(`Agents updated (${stats.agentsUpdated} files)`);

    // STEP 6: Update slash commands
    spinner = ora('Updating slash commands...').start();
    const commandsTemplatePath = path.join(sdkPath, 'dist/templates/shared/claude-commands');

    if (await fs.pathExists(commandsTemplatePath)) {
      // Command categories
      const commandCategories = ['session', 'planning', 'execution', 'investigation', 'infrastructure', 'utility'];

      for (const category of commandCategories) {
        const targetCategoryPath = path.join('.claude/commands', category);
        await fs.ensureDir(targetCategoryPath);
      }

      // Copy all command files
      const commandFiles = await fs.readdir(commandsTemplatePath);
      for (const file of commandFiles) {
        if (file.endsWith('.md')) {
          const sourcePath = path.join(commandsTemplatePath, file);

          // Determine category based on filename
          let category = 'utility';
          if (file.includes('start') || file.includes('continue') || file.includes('end')) {
            category = 'session';
          } else if (file.includes('requirements') || file.includes('design') || file.includes('plan') || file.includes('decompose')) {
            category = 'planning';
          } else if (file.includes('orchestrate')) {
            category = 'execution';
          } else if (file.includes('investigation')) {
            category = 'investigation';
          } else if (file.includes('init')) {
            category = 'infrastructure';
          }

          const targetPath = path.join('.claude/commands', category, file);
          await fs.copy(sourcePath, targetPath, { overwrite: true });
          stats.commandsUpdated++;
        }
      }
    }

    spinner.succeed(`Slash commands updated (${stats.commandsUpdated} files)`);

    // STEP 7: Update work order templates
    spinner = ora('Updating work order templates...').start();
    const woTemplatePath = path.join(sdkPath, 'dist/templates/work-orders');

    if (await fs.pathExists(woTemplatePath)) {
      await fs.copy(woTemplatePath, 'trinity/templates', { overwrite: true });
      const files = await fs.readdir(woTemplatePath);
      stats.templatesUpdated = files.length;
    }

    spinner.succeed(`Work order templates updated (${stats.templatesUpdated} files)`);

    // STEP 8: Update knowledge base (SDK-managed files only)
    spinner = ora('Updating knowledge base...').start();
    const kbTemplatePath = path.join(sdkPath, 'dist/templates/knowledge-base');

    // Only update SDK-managed knowledge base files (not user content)
    const sdkManagedKBFiles = [
      'Trinity.md.template',
      'CODING-PRINCIPLES.md.template',
      'TESTING-PRINCIPLES.md.template',
      'AI-DEVELOPMENT-GUIDE.md.template',
      'DOCUMENTATION-CRITERIA.md.template'
    ];

    for (const templateFile of sdkManagedKBFiles) {
      const sourcePath = path.join(kbTemplatePath, templateFile);
      if (await fs.pathExists(sourcePath)) {
        // Remove .template extension for target
        const targetFile = templateFile.replace('.template', '');
        const targetPath = path.join('trinity/knowledge-base', targetFile);
        await fs.copy(sourcePath, targetPath, { overwrite: true });
        stats.knowledgeBaseUpdated++;
      }
    }

    spinner.succeed(`Knowledge base updated (${stats.knowledgeBaseUpdated} files)`);

    // STEP 9: Restore user content
    spinner = ora('Restoring user content...').start();

    for (const file of userFiles) {
      const backupFile = path.join(backupDir, path.basename(file));
      if (await fs.pathExists(backupFile)) {
        await fs.copy(backupFile, file, { overwrite: true });
      }
    }

    spinner.succeed('User content restored');

    // STEP 10: Update VERSION file
    spinner = ora('Updating version file...').start();
    await fs.writeFile(versionPath, latestVersion);
    spinner.succeed('Version file updated');

    // STEP 11: Verification
    spinner = ora('Verifying update...').start();

    const verificationChecks = [
      { path: 'trinity/VERSION', desc: 'Version file' },
      { path: '.claude/agents/leadership', desc: 'Leadership agents' },
      { path: '.claude/agents/planning', desc: 'Planning agents' },
      { path: '.claude/agents/aj-team', desc: 'AJ team agents' },
      { path: '.claude/commands', desc: 'Slash commands' },
      { path: 'trinity/templates', desc: 'Work order templates' },
      { path: 'trinity/knowledge-base/Trinity.md', desc: 'Trinity knowledge base' }
    ];

    let verificationPassed = true;
    for (const check of verificationChecks) {
      if (!await fs.pathExists(check.path)) {
        verificationPassed = false;
        spinner.fail(`Verification failed: ${check.desc} missing`);
        throw new Error(`Update verification failed: ${check.path} not found`);
      }
    }

    // Verify version was actually updated
    const updatedVersion = (await fs.readFile(versionPath, 'utf8')).trim();
    if (updatedVersion !== latestVersion) {
      verificationPassed = false;
      spinner.fail('Version file not updated correctly');
      throw new Error(`Version verification failed: expected ${latestVersion}, got ${updatedVersion}`);
    }

    spinner.succeed('Verification passed');

    // STEP 12: Cleanup backup
    spinner = ora('Cleaning up...').start();
    await fs.remove(backupDir);
    backupDir = null; // Mark as cleaned up
    spinner.succeed('Cleanup complete');

    // SUCCESS
    console.log('');
    console.log(chalk.green.bold('✅ Trinity Method updated successfully!\n'));

    console.log(chalk.cyan('📊 Update Statistics:\n'));
    console.log(chalk.white(`   Agents Updated: ${stats.agentsUpdated}`));
    console.log(chalk.white(`   Commands Updated: ${stats.commandsUpdated}`));
    console.log(chalk.white(`   Templates Updated: ${stats.templatesUpdated}`));
    console.log(chalk.white(`   Knowledge Base Updated: ${stats.knowledgeBaseUpdated}`));
    console.log(chalk.white(`   Total Files Updated: ${stats.agentsUpdated + stats.commandsUpdated + stats.templatesUpdated + stats.knowledgeBaseUpdated}`));
    console.log('');
    console.log(chalk.gray(`   Version: ${currentVersion} → ${latestVersion}\n`));

  } catch (error: any) {
    // ROLLBACK on failure
    if (spinner) {
      spinner.fail('Update failed');
    }

    console.log('');
    console.log(chalk.red.bold('❌ Update failed - Rolling back changes...\n'));

    if (backupDir && await fs.pathExists(backupDir)) {
      try {
        // Restore from backup
        const rollbackSpinner = ora('Restoring from backup...').start();

        if (await fs.pathExists(path.join(backupDir, 'trinity'))) {
          await fs.remove('trinity');
          await fs.copy(path.join(backupDir, 'trinity'), 'trinity');
        }

        if (await fs.pathExists(path.join(backupDir, '.claude'))) {
          await fs.remove('.claude');
          await fs.copy(path.join(backupDir, '.claude'), '.claude');
        }

        // Cleanup backup
        await fs.remove(backupDir);

        rollbackSpinner.succeed('Rollback complete - Original state restored');
        console.log('');
      } catch (rollbackError: any) {
        console.error(chalk.red(`\n❌ CRITICAL: Rollback failed: ${rollbackError.message}`));
        console.error(chalk.yellow(`\n⚠️  Backup preserved at: ${backupDir}`));
        console.error(chalk.blue(`   Manually restore from backup if needed\n`));
      }
    }

    console.error(chalk.red(`Error: ${error.message}\n`));
    console.error(chalk.blue('💡 Try running: trinity deploy --force for a clean reinstall\n'));
    process.exit(1);
  }
}
