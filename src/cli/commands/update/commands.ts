/**
 * Update Commands Module
 * Handles updating slash command files in .claude/commands/
 * @module cli/commands/update/commands
 */

import fs from 'fs-extra';
import path from 'path';
import { Ora } from 'ora';
import { UpdateStats } from './types.js';
import { getSDKPath } from './utils.js';

/** Command categories */
const COMMAND_CATEGORIES = [
  'session',
  'planning',
  'execution',
  'investigation',
  'infrastructure',
  'maintenance',
  'utility',
];

/**
 * Update slash command files from SDK to .claude/commands/
 * Commands are now organized by category in source templates
 * @param spinner - ora spinner instance for status display
 * @param stats - update statistics to track progress
 */
export async function updateCommands(spinner: Ora, stats: UpdateStats): Promise<void> {
  spinner.start('Updating slash commands...');

  const sdkPath = await getSDKPath();
  const commandsTemplatePath = path.join(sdkPath, 'dist/templates/.claude/commands');

  if (!(await fs.pathExists(commandsTemplatePath))) {
    spinner.warn('Commands template path not found, skipping');
    return;
  }

  // Iterate through each category directory
  for (const category of COMMAND_CATEGORIES) {
    const sourceCategoryPath = path.join(commandsTemplatePath, category);
    const targetCategoryPath = path.join('.claude/commands', category);

    if (await fs.pathExists(sourceCategoryPath)) {
      await fs.ensureDir(targetCategoryPath);
      const commandFiles = await fs.readdir(sourceCategoryPath);

      for (const file of commandFiles) {
        if (file.endsWith('.md.template')) {
          const sourcePath = path.join(sourceCategoryPath, file);
          // Remove .template extension for deployed file
          const deployedFileName = file.replace('.template', '');
          const targetPath = path.join(targetCategoryPath, deployedFileName);

          await fs.copy(sourcePath, targetPath, { overwrite: true });
          stats.commandsUpdated++;
        }
      }
    }
  }

  spinner.succeed(`Slash commands updated (${stats.commandsUpdated} files)`);
}
